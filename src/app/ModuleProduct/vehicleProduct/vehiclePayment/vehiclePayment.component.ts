import { Component, OnInit, ViewChild } from "@angular/core";
import { OnlineContractService } from "../../../services/onlinecontract.service";
import { InsurancePackage, InsurancePackageDetail, InsuredVehicle, InsuranceFeeInfoByConfig, VehicleContractModel, ProgramPackageConfig } from "../../../models/contract.model";
import { VietService } from "../../../services/viet.service";
import { Customer, Channel } from "../../../models/general.model";
import { ActivatedRoute, Router } from "@angular/router";
import { VehiclesinfoComponent } from "../../../ShareComponent/vehiclesinfo/vehiclesinfo.component";
import { OrderHelper } from "../../../services/order.helper";
import { OnlineGroupType } from "../../../models/enum";
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from "@angular/forms";
import { Regex } from "../../../models/regex";
import { Province, District, Ward } from "../../../models/address.model";
import { LocationService } from "../../../services/location.service";

@Component({
    selector: "app-vehiclePayment",
    templateUrl: "./vehiclePayment.component.html",
    styleUrls: ["./vehiclePayment.component.css"]
})
export class VehiclePaymentComponent implements OnInit {
    today = new Date();
    insurancePackages: Array<InsurancePackage> = [];
    optionPackages = new InsurancePackage();
    combinePackages = new InsurancePackage();
    selectedPackages: Array<InsurancePackageDetail> = [];
    vehiclesInfo = new InsuredVehicle();
    insuranceFeeInfoByConfig = new InsuranceFeeInfoByConfig();
    effectiveDate = new Date();
    minEffectiveDate = new Date();
    expireDate = new Date();
    insuranceCost: number;
    // discount: number;
    customerInfo = new Customer();
    vehicleContractModel = new VehicleContractModel();
    inProcess: boolean = false;
    refCode: string = "";
    customerInfoValid: boolean = false;
    hasCombine = false;
    prevLink = "";
    grId: number;
    blNextStep: boolean = false;
    paymentSupplierCode: string = "";
    groupName: string = "";
    checkedPromise = false;
    fromApp: any;
    //
    lstBranch = [];
    lstType = [];
    receiveCertificate = false;
    vehicleForm: FormGroup;
    regex = new Regex();
    maskYear = new Regex().maskYear;
    maskPlate = new Regex().maskPlate;
    //
    provinces = new Array<Province>();
    districts: Array<District> = [];
    wards: Array<Ward> = [];
    customerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private oh: OrderHelper,
        private oc: OnlineContractService,
        private ls: LocationService,
        private vs: VietService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.grId = +params["groupId"];
        });
        this.route.queryParams.subscribe(params => {
            this.paymentSupplierCode = params["paymentsupplier"] || null;
            this.fromApp = params["fromApp"] == "true";
        });
        this.initFormVehicle();
        this.initFormCustomer();
        this.getProvinces();
        this.selectedPackages = new Array<InsurancePackageDetail>();
        this.today = this.vs.nowDate();
        this.effectiveDate = this.vs.next_N_Date(2);
        this.minEffectiveDate = this.vs.next_N_Date(2);
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
        this.insuranceFeeInfoByConfig.contractType = 4;
        this.insuranceCost = 0;
        // this.discount = 0;
        this.oh.infoOfProduct.subscribe(p => {
            if (p) {
                this.refCode = p.refCode;
                this.prevLink = p.prev_link;
            }
        });
        this.oc.getInsuraceProductOptionsDetailWithChannel(this.grId, Channel.ONLINE).subscribe(res => {
            if (res && res.success) {
                this.insurancePackages = this.vs.arrayOrder(res.data.insuranceProductOptionDetails, "programCode", false);
                this.receiveCertificate = res.data.receiveCertificate;
                this.checkHasCombine();
                this.autoCheckPackageDefault();
            }
        });

        this.oh.order.subscribe(p => {
            if (p) {
                this.customerInfo = p.customer_info;
                this.vehicleContractModel = p.base_contract;
                this.vehiclesInfo = this.vehicleContractModel.insuredVehicles[0];
            }
        });

        this.oc.getInsuranceProductById(this.grId).subscribe(res => {
            if (res && res.success) {
                this.groupName = res.data.name;
                this.vehicleContractModel.baseContract.insuranceProductId = res.data.id;
                this.vehicleContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
            }
        });
    }
    checkHasCombine() {
        this.hasCombine = this.insurancePackages.length > 1;
        this.splitOptionPackages();
    }
    splitOptionPackages() {
        this.combinePackages = this.insurancePackages.find(s => !s.isMainPackage);
        this.optionPackages = this.insurancePackages.find(s => s.isMainPackage);
        if (this.optionPackages.requiredTakingPaperCertificate) {
            this.vehicleContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
        }
    }
    nextToConfirm() {
        window.scrollTo(0, 0);
        this.blNextStep = true;
    }
    nextStep() {
        window.scrollTo(0, 0);
        this.vehicleContractModel.programPackageConfigs = new Array<ProgramPackageConfig>();
        this.vehicleContractModel.insuredVehicles = new Array<InsuredVehicle>();
        for (let i = 0; i < this.selectedPackages.length; i++) {
            let tempPackagesConfig = new ProgramPackageConfig();
            tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
            tempPackagesConfig.numberOfInsuranceObject = this.selectedPackages[i].numberOfInsuranceObject;
            this.vehicleContractModel.programPackageConfigs.push(tempPackagesConfig);
        }
        this.vehicleContractModel.baseContract.effectiveDate = this.effectiveDate;
        this.vehicleContractModel.baseContract.expireDate = this.expireDate;
        this.vehicleContractModel.insuredVehicles.push(this.vehiclesInfo);
        this.vehicleContractModel.baseContract.isOnlineContract = true;
        this.vehicleContractModel.baseContract.contractType = 2; // hợp đồng bảo hiểm xe máy
        this.vehicleContractModel.baseContract.formOfParticipation = 1; // hợp đồng gốc
        this.oh.insuranceDetailOrder(OnlineGroupType.grTNDS, this.vehicleContractModel, this.customerInfo);
        this.oh.select(this.insurancePackages, this.router.url, this.refCode);
        this.router.navigate(["product/checkoutpayment/"], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href, { receiveCert: this.receiveCertificate }) });
    }
    goBack() {
        this.router.navigate([this.vs.cleanParamsInURL(this.prevLink)], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink) });
    }
    goBackInStep2() {
        this.blNextStep = false;
    }
    autoCheckPackageDefault() {
        this.checkOptionPackage(0);
    }
    checkOptionPackage(itemId) {
        try {
            this.optionPackages.insurancePackageDetails.forEach(item => {
                item.selected = false;
            });
            if (this.combinePackages) {
                this.combinePackages.insurancePackageDetails.forEach(item => {
                    item.selected = false;
                });
            }
            this.optionPackages.insurancePackageDetails[itemId].selected = true;
            this.calInsuranceCost();
        } catch (err) {
            console.log(err);
        }
    }
    checkCombinePackage(itemId, event) {
        try {
            if (this.combinePackages) {
                this.combinePackages.insurancePackageDetails.forEach(item => {
                    item.selected = false;
                });
                this.combinePackages.insurancePackageDetails[itemId].selected = event;
            }
            this.calInsuranceCost();
        } catch (err) {
            console.log(err);
        }
    }
    calInsuranceCost() {
        let arrProgramPackageConfig: Array<ProgramPackageConfig> = [];
        this.selectedPackages = this.optionPackages.insurancePackageDetails.filter(item => item.selected == true);
        if (this.combinePackages) {
            this.combinePackages.insurancePackageDetails
                .filter(item => item.selected == true)
                .forEach(item => {
                    this.selectedPackages.push(item);
                });
        }
        for (var i = 0; i < this.selectedPackages.length; i++) {
            var selectedPackage = this.selectedPackages[i];
            let packageConfig: ProgramPackageConfig = {
                insuranceProgramPackageId: selectedPackage.insuranceProgramPackageId,
                numberOfInsuranceObject: selectedPackage.numberOfInsuranceObject,
                insuranceProgramId: selectedPackage.insuranceProgramId
            };
            arrProgramPackageConfig.push(packageConfig);
        }
        this.insuranceFeeInfoByConfig.programPackageConfigs = arrProgramPackageConfig;
        this.oc.calculatorInsuranceFeeByConfig(this.insuranceFeeInfoByConfig).subscribe(res => {
            if (res && res.success) {
                this.insuranceCost = res.data.totalInsuranceCost;
                //  + res.data.totalDiscount;
                // this.discount = res.data.totalInsuranceCost;
            }
        });
    }

    //
    changeEffectiveDate() {
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
    }
    customerFormValid(valid: boolean) {
        this.customerInfoValid = valid;
    }
    customerInfoChange(cusInfo) {
        this.customerInfo = cusInfo;
    }
    changeStatusPromise() {
        this.checkedPromise = !this.checkedPromise;
    }
    checkAllowToCheckOut() {
        let temp = this.customerForm.valid && this.vehicleForm.valid && this.selectedPackages.length > 0;
        if (this.fromApp) {
            return temp;
        } else {
            return temp && this.checkedPromise;
        }
    }
    //
    initFormVehicle() {
        this.vehicleForm = this.fb.group({
            ownerName: ["", [Validators.required, stringName(2)]],
            hasPlate: [""]
            // likeCustomerInfo: [{ value: "", disabled: this.disabled && (this.customerInfo.name == "" || this.customerInfo.name == undefined) }]
        });
        const ctrl: FormControl = (<any>this.vehicleForm).controls["hasPlate"];
        ctrl.setValue(this.vehiclesInfo.hasPlate);
        if (this.vehiclesInfo.hasPlate == true) {
            this.vehicleForm.addControl("hasPlateForm", this.initHasPlateForm());
        } else {
            this.vehicleForm.addControl("hasNoPlateForm", this.initNoPlateForm());
        }
        this.vehicleForm.valueChanges.subscribe(res => {
            if (this.vehicleForm.get("hasPlateForm") && this.vehicleForm.get("hasPlateForm").valid) {
                this.vehiclesInfo.plateNumber ? (this.vehiclesInfo.plateNumber = this.vehiclesInfo.plateNumber.toUpperCase()) : "";
            }
        });
    }
    initHasPlateForm() {
        return this.fb.group({
            plateNumber: ["", [Validators.required, Validators.pattern(this.regex.plateRegex)]]
        });
    }
    initNoPlateForm() {
        return this.fb.group({
            engineNumber: ["", Validators.required],
            machineNumber: ["", Validators.required]
        });
    }
    hasPlate(status: boolean) {
        if (status) {
            this.vehiclesInfo.hasPlate = true;
            this.vehiclesInfo.machineNumber = null;

            this.vehiclesInfo.engineNumber = null;
            // update hasPlate status
            const ctrl = this.vehicleForm.get("hasPlate");
            ctrl.setValue(status);
            this.vehicleForm.addControl("hasPlateForm", this.initHasPlateForm());
            this.vehicleForm.removeControl("hasNoPlateForm");
        } else {
            this.vehiclesInfo.hasPlate = false;
            this.vehiclesInfo.plateNumber = null;
            // update hasPlate status
            const ctrl = this.vehicleForm.get("hasPlate");
            ctrl.setValue(status);
            this.vehicleForm.addControl("hasNoPlateForm", this.initNoPlateForm());
            this.vehicleForm.removeControl("hasPlateForm");
        }
    }
    //

    initFormCustomer() {
        this.customerForm = this.fb.group({
            name: ["", [Validators.required, stringName(2)]],
            phoneNumber: ["", [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
            idNumber: ["", [Validators.pattern(this.regex.idRegex)]],
            email: ["", [Validators.pattern(this.regex.emailRegex)]],
            fullAddress: this.fb.group({
                addressDetails: ["", [Validators.required]],
                provinceOrCityId: ["", [Validators.required]],
                districtId: ["", [Validators.required]],
                wardId: ["", [Validators.required]]
            })
        });
    }
    copyCustomerName() {
        this.vehiclesInfo.ownerName = this.customerInfo.name;
    }
    async getProvinces() {
        try {
            this.ls.getProvinces().subscribe(resultProvince => {
                if (resultProvince.success) {
                    this.provinces = this.vs.arrayOrder(resultProvince.data, "name");
                } else {
                    console.log(resultProvince.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async getDistricts(provinceId) {
        try {
            this.ls.getDistrictsByProvinceId(provinceId).subscribe(resultDistrict => {
                if (resultDistrict.success) {
                    this.districts = this.vs.arrayOrder(resultDistrict.data, "name");
                    if (!this.districts.find(d => d.id == this.customerInfo.districtId)) {
                        this.customerInfo.districtId = undefined;
                        this.customerInfo.wardId = undefined;
                    }
                } else {
                    console.log(resultDistrict.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async getWards(districtId) {
        try {
            this.ls.getWardsByDistrictId(districtId).subscribe(resultWard => {
                if (resultWard.success) {
                    this.wards = this.vs.arrayOrder(resultWard.data, "name");
                    if (!this.wards.find(d => d.id == this.customerInfo.wardId)) {
                        this.customerInfo.wardId = undefined;
                    }
                } else {
                    console.log(resultWard.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    isFullAddress() {
        if (this.customerInfo.provinceOrCityId && this.customerInfo.districtId && this.customerInfo.wardId && this.customerInfo.addressDetails) {
            return true;
        }
        if (!this.customerInfo.provinceOrCityId && !this.customerInfo.districtId && !this.customerInfo.wardId && !this.customerInfo.addressDetails) {
            return true;
        }
        return false;
    }
    mixAddressDetail() {
        let str = "";
        if (this.wards.length != 0 && this.customerInfo.wardId && this.districts.length != 0 && this.customerInfo.districtId && this.provinces.length != 0 && this.customerInfo.provinceOrCityId) {
            str =
                (this.customerInfo.addressDetails ? this.customerInfo.addressDetails +
                ", " : '') +
                (this.wards.find(w => w.id == this.customerInfo.wardId).name || "") +
                ", " +
                (this.districts.find(w => w.id == this.customerInfo.districtId).name || "") +
                ", " +
                (this.provinces.find(w => w.id == this.customerInfo.provinceOrCityId).name || "");
        }
        return str;
    }
    changeAddressDetail() {
        this.customerInfo.fullAddress = this.mixAddressDetail();
    }
}
export function stringName(minWord) {
    return (c: AbstractControl) => {
        let temp = c.value;
        if (
            temp &&
            temp.split(" ").filter(_ => {
                return _;
            }).length < minWord
        ) {
            return { nameInvalid: true };
        }
        return null;
    };
}

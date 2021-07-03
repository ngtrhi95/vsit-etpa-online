import { Component, OnInit } from "@angular/core";
import { OnlineContractService } from "../../../../services/onlinecontract.service";
import { InsurancePackage, InsurancePackageDetail, InsuranceFeeInfoByConfig, ProgramPackageConfig, HumanContractModel, InsuredPeople } from "../../../../models/contract.model";
import { VietService } from "../../../../services/viet.service";
import { Customer, Channel } from '../../../../models/general.model';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderHelper } from "../../../../services/order.helper";
import { Address, Province, District, Ward } from "../../../../models/address.model";
import { OnlineGroupType } from "../../../../models/enum";
import { Validators, FormBuilder, FormGroup, AbstractControl } from "@angular/forms";
import { Regex } from "../../../../models/regex";
import { LocationService } from "../../../../services/location.service";
declare var $: any;

@Component({
    selector: "app-humanPayment",
    templateUrl: "./humanPayment.component.html",
    styleUrls: ["./humanPayment.component.css"]
})
export class HumanPaymentComponent implements OnInit {
    today = new Date();
    insurancePackages: Array<InsurancePackage> = [];
    optionPackages = new InsurancePackage();
    combinePackages = new InsurancePackage();
    selectedPackages: Array<InsurancePackageDetail> = [];
    addressInfo = new Address();
    insuranceFeeInfoByConfig = new InsuranceFeeInfoByConfig();
    effectiveDate = new Date();
    minEffectiveDate = new Date();
    expireDate = new Date();
    insuranceCost: number;
    discount: number;
    customerInfo = new Customer();
    householdContractModel = new HumanContractModel();
    inProcess: boolean = false;
    refCode: string = "";
    customerInfoValid: boolean = false;
    humanModels = new Array<InsuredPeople>();
    hasCombine = false;
    prevLink = "";
    grId: number;
    blNextStep: boolean = false;
    paymentSupplierCode: string = "";
    groupName: string = "";
    checkedPromise = false;
    fromApp: any;
    regex = new Regex();
    customerForm: FormGroup;
    provinces = new Array<Province>();
    districts: Array<District> = [];
    wards: Array<Ward> = [];
    receiveCertificate = false;

    constructor(
        private oh: OrderHelper,
        private oc: OnlineContractService,
        private ls: LocationService,
        private vs: VietService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.grId = +params["groupId"];
        });
        this.route.queryParams.subscribe(params => {
            this.paymentSupplierCode = params["paymentsupplier"] || null;
            this.fromApp = params["fromApp"] == "true";
        });
        this.initFormCustomer();
        this.getProvinces();
        this.selectedPackages = new Array<InsurancePackageDetail>();
        this.today = this.vs.nowDate();
        this.effectiveDate = this.vs.next_N_Date(2);
        this.minEffectiveDate = this.vs.next_N_Date(2);
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
        this.insuranceFeeInfoByConfig.contractType = 4;
        this.householdContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
        this.insuranceCost = 0;
        this.discount = 0;
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
                this.householdContractModel = p.base_contract;
            }
        });

        this.oc.getInsuranceProductById(this.grId).subscribe(res => {
            if (res && res.success) {
                this.groupName = res.data.name;
                this.householdContractModel.baseContract.insuranceProductId = res.data.id;
                this.householdContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
            }
        });
    }
    ngAfterViewInit() {
        $("#customerAddress").html(`Địa chỉ thường trú trên hộ khẩu`);
    }
    checkHasCombine() {
        this.hasCombine = this.insurancePackages.length > 1;
        this.splitOptionPackages();
    }
    splitOptionPackages() {
        this.insurancePackages.forEach((program, index) => {
            program.insurancePackageDetails.forEach(p => {
                if (p.isMainPackage) {
                    this.optionPackages = this.insurancePackages[index];
                } else {
                    this.combinePackages = this.insurancePackages[index];
                }
            });
        });
        if (this.optionPackages.requiredTakingPaperCertificate) {
            this.householdContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
        }
    }

    nextStep() {
        window.scrollTo(0, 0);
        this.householdContractModel.programPackageConfigs = new Array<ProgramPackageConfig>();
        for (let i = 0; i < this.selectedPackages.length; i++) {
            let tempPackagesConfig = new ProgramPackageConfig();
            tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
            tempPackagesConfig.numberOfInsuranceObject = this.selectedPackages[i].numberOfInsuranceObject;
            this.householdContractModel.programPackageConfigs.push(tempPackagesConfig);
        }
        this.householdContractModel.baseContract.isOnlineContract = true;
        this.householdContractModel.baseContract.effectiveDate = this.effectiveDate;
        this.householdContractModel.baseContract.expireDate = this.expireDate;
        this.householdContractModel.baseContract.contractType = 1; // hợp đồng bảo hiểm gia đình
        this.householdContractModel.baseContract.formOfParticipation = 1; // hợp đồng gốc
        this.oh.insuranceDetailOrder(OnlineGroupType.grCN, this.householdContractModel, this.customerInfo);

        this.oh.select(this.insurancePackages, this.router.url, this.refCode);
        // const url = "product/checkoutpayment/";
        // if (this.paymentSupplierCode != null && this.paymentSupplierCode != "") {
        //     this.router.navigate([url, { paymentsupplier: this.paymentSupplierCode }]);
        // } else {
        //     this.router.navigate([url]);
        // }
        this.router.navigate(["product/checkoutpayment/"], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href, { receiveCert: this.receiveCertificate }) });
    }
    nextToConfirm() {
        window.scrollTo(0, 0);
        if (this.customerInfo.fullAddress != null || this.customerInfo.fullAddress != undefined || this.customerInfo.fullAddress != "") this.customerInfo.fullAddress = this.mixAddressDetail();
        this.blNextStep = true;
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
            this.combinePackages.insurancePackageDetails.forEach(item => {
                item.selected = false;
            });
            this.optionPackages.insurancePackageDetails[itemId].selected = true;
            this.calInsuranceCost();
        } catch (err) {
            console.log(err);
        }
    }
    checkCombinePackage(itemId, event) {
        try {
            this.combinePackages.insurancePackageDetails.forEach(item => {
                item.selected = false;
            });
            this.combinePackages.insurancePackageDetails[itemId].selected = event;
            this.calInsuranceCost();
        } catch (err) {
            console.log(err);
        }
    }
    calInsuranceCost() {
        let arrProgramPackageConfig: Array<ProgramPackageConfig> = [];
        this.selectedPackages = this.optionPackages.insurancePackageDetails.filter(item => item.selected == true);
        this.combinePackages.insurancePackageDetails
            .filter(item => item.selected == true)
            .forEach(item => {
                this.selectedPackages.push(item);
            });
        for (var i = 0; i < this.selectedPackages.length; i++) {
            var selectedPackage = this.selectedPackages[i];
            let packageConfig: ProgramPackageConfig = {
                insuranceProgramPackageId: selectedPackage.insuranceProgramPackageId,
                numberOfInsuranceObject: selectedPackage.numberOfInsuranceObject
            };
            arrProgramPackageConfig.push(packageConfig);
        }
        this.insuranceFeeInfoByConfig.programPackageConfigs = arrProgramPackageConfig;
        this.oc.calculatorInsuranceFeeByConfig(this.insuranceFeeInfoByConfig).subscribe(res => {
            if (res && res.success) {
                this.insuranceCost = res.data.totalInsuranceCost + res.data.totalDiscount;
                this.discount = res.data.totalInsuranceCost;
            }
        });
    }
    //
    initFormCustomer() {
        this.customerForm = this.fb.group({
            name: ["", [Validators.required, stringName(2)]],
            idNumber: ["", [Validators.pattern(this.regex.idRegex)]],
            phoneNumber: ["", [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
            email: ["", [Validators.pattern(this.regex.emailRegex)]],
            fullAddress: this.fb.group({
                addressDetails: [{ value: "" }, []],
                provinceOrCityId: [{ value: "" }, []],
                districtId: [{ value: "" }, []],
                wardId: [{ value: "" }, []]
            })
        });
    }
    async getProvinces() {
        try {
            let resultProvince = await this.ls.getProvinces().subscribe(resultProvince => {
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
            let resultDistrict = await this.ls.getDistrictsByProvinceId(provinceId).subscribe(resultDistrict => {
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
            let resultWard = await this.ls.getWardsByDistrictId(districtId).subscribe(resultWard => {
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
    mixAddressDetail() {
        let str = "";
        if (this.wards.length != 0 && this.customerInfo.wardId && this.districts.length != 0 && this.customerInfo.districtId && this.provinces.length != 0 && this.customerInfo.provinceOrCityId) {
            str =
                (this.customerInfo.addressDetails ? this.customerInfo.addressDetails + ", " : '') +
                (this.wards.find(w => w.id == this.customerInfo.wardId).name || "") +
                ", " +
                (this.districts.find(w => w.id == this.customerInfo.districtId).name || "") +
                ", " +
                (this.provinces.find(w => w.id == this.customerInfo.provinceOrCityId).name || "");
        }
        return str;
    }
    isFullAddress() {
      if (this.customerInfo.provinceOrCityId && this.customerInfo.districtId && this.customerInfo.wardId) {
        return true;
      }
      if (!this.customerInfo.provinceOrCityId && !this.customerInfo.districtId && !this.customerInfo.wardId && !this.customerInfo.addressDetails) {
        return true;
      }
      return false;
    }
    checkAllowToCheckOut() {
        let temp = !this.customerForm.valid || this.selectedPackages.length == 0 || !this.isFullAddress();
        if (this.fromApp) {
            return temp;
        } else {
            return temp || !this.checkedPromise;
        }
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

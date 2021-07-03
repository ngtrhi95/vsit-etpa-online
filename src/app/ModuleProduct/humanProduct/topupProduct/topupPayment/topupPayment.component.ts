import { Component, OnInit } from "@angular/core";
import { OnlineContractService } from "../../../../services/onlinecontract.service";
import { InsurancePackage, InsurancePackageDetail, InsuranceFeeInfoByConfig, ProgramPackageConfig, HumanContractModel, InsuredPeople } from "../../../../models/contract.model";
import { VietService } from "../../../../services/viet.service";
import { Customer, Channel } from "../../../../models/general.model";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderHelper } from "../../../../services/order.helper";
import { Address, Ward, District, Province, Country } from "../../../../models/address.model";
import { OnlineGroupType } from "../../../../models/enum";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Regex } from "../../../../models/regex";
import { LocationService } from "../../../../services/location.service";
declare var $: any;

@Component({
    selector: "app-topupPayment",
    templateUrl: "./topupPayment.component.html",
    styleUrls: ["./topupPayment.component.css"]
})
export class TopupPaymentComponent implements OnInit {
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
    customerInfoTopup = new TopUpContractModel();
    topupContractModel = new HumanContractModel();
    inProcess: boolean = false;
    refCode: string = "";
    customerInfoValid: boolean = false;
    humanModels = new Array<InsuredPeople>();
    hasCombine = false;
    prevLink = "";
    grId: number;
    option: any;
    blNextStep: boolean = false;
    paymentSupplierCode: string = "";
    groupName: string = "";
    checkedPromise = false;
    //
    regex = new Regex();
    coutries = new Array<Country>();
    provinces = new Array<Province>();
    districts: Array<District> = [];
    wards: Array<Ward> = [];
    customerForm: FormGroup;
    healthInsuranceNumberRegex: RegExp = /^([a-zA-Z0-9][a-zA-Z0-9])\d{13}$/;
    maskTopupNumber = [/[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    maskDOB = [/\d/, /\d/, /\d/, /\d/];
    maskPhone = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    gender = [{ id: 0, value: "Khác" }, { id: 1, value: "Nam" }, { id: 2, value: "Nữ" }];
    countrySelected: any;
    receiveCertificate = false;

    constructor(
        private oh: OrderHelper,
        private oc: OnlineContractService,
        private locationService: LocationService,
        private vs: VietService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.grId = +params["groupId"];
            this.option = params["option"];
            this.paymentSupplierCode = params["paymentsupplier"] || null;
        });
        this.initFormCustomer();
        this.getCoutries();
        this.getProvinces();
        this.checkCustomerFormValid();
        this.selectedPackages = new Array<InsurancePackageDetail>();
        this.today = this.vs.nowDate();
        this.effectiveDate = this.vs.next_N_Date(2);
        this.minEffectiveDate = this.vs.next_N_Date(2);
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
        this.insuranceFeeInfoByConfig.contractType = 4;
        this.topupContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
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
        this.oc.getInsuranceProductById(this.grId).subscribe(res => {
            if (res && res.success) {
                this.groupName = res.data.name;
                this.topupContractModel.baseContract.insuranceProductId = res.data.id;
                this.topupContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
            }
        });
        this.oh.order.subscribe(p => {
            if (p) {
                this.customerInfo = p.customer_info;
                this.topupContractModel = p.base_contract;
                this.customerInfoTopup = this.topupContractModel.topupContract;
            }
        });
    }
    ngAfterViewChecked(): void {
        this.changeAddressDetail();
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
    }

    nextStep() {
        window.scrollTo(0, 0);
        this.topupContractModel.programPackageConfigs = new Array<ProgramPackageConfig>();
        for (let i = 0; i < this.selectedPackages.length; i++) {
            let tempPackagesConfig = new ProgramPackageConfig();
            tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
            tempPackagesConfig.quantity = this.selectedPackages[i].numberOfInsuranceObject;
            this.topupContractModel.programPackageConfigs.push(tempPackagesConfig);
        }
        this.topupContractModel.baseContract.isOnlineContract = true;
        this.topupContractModel.baseContract.effectiveDate = this.effectiveDate;
        this.topupContractModel.baseContract.expireDate = this.expireDate;
        this.topupContractModel.baseContract.contractType = 1; // hợp đồng bảo hiểm gia đình
        this.topupContractModel.baseContract.formOfParticipation = 1; // hợp đồng gốc
        this.topupContractModel.topupContract = this.customerInfoTopup;
        this.oh.insuranceDetailOrder(OnlineGroupType.grCN, this.topupContractModel, this.customerInfo);

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
        this.blNextStep = true;
        this.customerInfoTopup.healthInsuranceNumber = this.customerInfoTopup.healthInsuranceNumber.toUpperCase();
        this.customerInfo.name = this.customerInfo.name.toUpperCase();
    }
    goBack() {
        this.router.navigate([this.vs.cleanParamsInURL(this.prevLink)], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink) });
    }
    goBackInStep2() {
        this.blNextStep = false;
    }

    autoCheckPackageDefault() {
        this.checkOptionPackage(this.option, true);
    }
    checkOptionPackage(itemId, checkCode?) {
        try {
            if (itemId != "undefined") {
                this.optionPackages.insurancePackageDetails.forEach(item => {
                    item.selected = false;
                });
                this.combinePackages.insurancePackageDetails.forEach(item => {
                    item.selected = false;
                });
                if (checkCode) {
                    this.optionPackages.insurancePackageDetails.forEach((item, index) => {
                        if (item.insurancePackageCode == itemId) {
                            this.optionPackages.insurancePackageDetails[index].selected = true;
                        }
                    });
                } else {
                    this.optionPackages.insurancePackageDetails[itemId].selected = true;
                }
            } else {
                this.optionPackages.insurancePackageDetails[0].selected = true;
            }
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
        this.combinePackages.insurancePackageDetails.filter(item => item.selected == true).forEach(item => {
            this.selectedPackages.push(item);
        });
        for (var i = 0; i < this.selectedPackages.length; i++) {
            var selectedPackage = this.selectedPackages[i];
            let packageConfig: ProgramPackageConfig = {
                insuranceProgramPackageId: selectedPackage.insuranceProgramPackageId,
                quantity: selectedPackage.numberOfInsuranceObject
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
    changeEffectiveDate() {
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
    }
    changeDateOfBirth(input) {
        if (input == "" || input == null) {
            this.customerInfo.dateOfBirth = null;
        } else if (input.length > 3) {
            this.customerInfo.dateOfBirth = this.vs.toYearDate(input);
        }
    }
    changeCoutry() {
        let temp = this.coutries.find(_ => {
            return _.id == this.customerInfoTopup.nationality;
        });
        if (temp) {
            this.countrySelected = temp;
        }
    }
    checkCustomerFormValid() {
        this.customerForm.valueChanges.subscribe(res => {
            this.customerInfoValid = this.customerForm.valid;
        });
    }
    customerInfoChange(cusInfo) {
        this.customerInfo = cusInfo;
    }
    changeStatusPromise() {
        this.checkedPromise = !this.checkedPromise;
    }
    initFormCustomer() {
        this.customerForm = this.fb.group({
            name: ["", [Validators.required, stringName(2)]],
            idNumber: [{ value: "" }, [Validators.required, Validators.pattern(this.regex.idRegex)]],
            phoneNumber: [{ value: "" }, [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
            email: [{ value: "" }, [Validators.pattern(this.regex.emailRegex)]],
            dateOfBirth: ["", [Validators.required, dobRange(16, 65)]],
            sex: [{ value: "" }, [Validators.required]],
            fullAddress: this.fb.group({
                addressDetails: [{ value: "" }, []],
                provinceOrCityId: [{ value: "" }, [Validators.required]],
                districtId: [{ value: "" }, [Validators.required]],
                wardId: [{ value: "" }, [Validators.required]]
            }),
            nationality: [{ value: "" }, [Validators.required]],
            healthInsuranceNumber: ["", [Validators.required, Validators.pattern(this.healthInsuranceNumberRegex)]],
            job: [{ value: "" }, []]
        });
    }
    async getCoutries() {
        try {
            this.locationService.getCountries().subscribe(resultCoutries => {
                if (resultCoutries.success) {
                    this.coutries = this.vs.arrayOrder(resultCoutries.data, "name");
                    this.countrySelected = this.coutries.find(_ => {
                        return _.id == 237;
                    }); // chọn VN là mặc định
                } else {
                    console.log(resultCoutries.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async getProvinces() {
        try {
            this.locationService.getProvinces().subscribe(resultProvince => {
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
            this.locationService.getDistrictsByProvinceId(provinceId).subscribe(resultDistrict => {
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
            this.locationService.getWardsByDistrictId(districtId).subscribe(resultWard => {
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
    changeAddressDetail() {
        this.customerInfo.fullAddress = this.mixAddressDetail();
    }
}
export class TopUpContractModel {
    nationality: number = 237; // mặc định vn
    healthInsuranceNumber: string;
    job: string;
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
export function dobRange(minDob: number, maxDob: number) {
    return (c: AbstractControl) => {
        let temp = c.value;
        let nowYear = new Date().getFullYear();
        let inputYear;
        if (temp instanceof Date) {
            inputYear = temp.getFullYear();
        } else {
            inputYear = new Date(+temp, 0, 1).getFullYear();
        }
        if (nowYear - inputYear >= minDob && nowYear - inputYear <= maxDob) {
            return null;
        }
        return { outDoBRange: true };
    };
}

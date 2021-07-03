import { Component, OnInit } from "@angular/core";
import { OnlineContractService } from "../../../../services/onlinecontract.service";
import { InsurancePackage, InsurancePackageDetail, InsuranceFeeInfoByConfig, ProgramPackageConfig, InsuredPeople, LoveContractModel } from "../../../../models/contract.model";
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
    selector: "app-lovePayment",
    templateUrl: "./loveInsuPayment.component.html",
    styleUrls: ["./loveInsuPayment.component.css"]
})
export class LovePaymentComponent implements OnInit {
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
    waitingTimeFrom = new Date();
    waitingTimeTo = new Date();
    insuranceCost: number;
    discount: number;
    customerInfo = new Customer();
    partnerInfo = new Customer();
    loveContractModel = new LoveContractModel();
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
    checkedUnwed = false;
    //
    regex = new Regex();
    customerForm: FormGroup;
    partnerForm: FormGroup;
    maskDOB = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
    maskPhone = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    gender = [{ id: 1, value: "Nam" }, { id: 2, value: "Nữ" }];
    maritalStatus = [{ value: 0, text: "Chưa từng" }, { value: 1, text: "Đã từng" }];
    beneficiary = true;
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
        this.initFormPartner();
        this.checkCustomerFormValid();
        this.selectedPackages = new Array<InsurancePackageDetail>();
        this.today = this.vs.nowDate();
        this.waitingTimeFrom = this.vs.next_N_Date(0);
        this.effectiveDate = this.vs.calculatorExpiredTimeOfContract_new(this.waitingTimeFrom, 3);
        this.effectiveDate = new Date(this.effectiveDate.getTime() + 1);
        this.minEffectiveDate = this.vs.next_N_Date(0);
        this.expireDate = this.vs.calculatorExpiredTimeOfContract_new(this.effectiveDate, 5);
        this.waitingTimeTo = this.vs.calculatorExpiredTimeOfContract_new(this.waitingTimeFrom, 3);
        this.insuranceFeeInfoByConfig.contractType = 4;
        this.loveContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
        this.loveContractModel.loveContract.isDivorce = 0;
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
                this.loveContractModel.baseContract.insuranceProductId = res.data.id;
                this.loveContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
            }
        });
        this.oh.order.subscribe(p => {
            if (p) {
                this.customerInfo = p.customer_info;
                this.loveContractModel = p.base_contract;
                this.partnerInfo = p.partner_info;
            }
        });
        setTimeout(() => {
            this.customerInfo.sex = 1;
            this.partnerInfo.sex = 2;
        }, 1);
    }
    test() {
        console.log(this.loveContractModel.loveContract.isDivorce)
    }
    ngAfterViewChecked(): void {
        this.changeGender();
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
    changeBeneficiary(value) {
        this.beneficiary = value;
    }

    nextStep() {
        window.scrollTo(0, 0);
        this.loveContractModel.programPackageConfigs = new Array<ProgramPackageConfig>();
        for (let i = 0; i < this.selectedPackages.length; i++) {
            let tempPackagesConfig = new ProgramPackageConfig();
            tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
            tempPackagesConfig.quantity = this.selectedPackages[i].numberOfInsuranceObject;
            this.loveContractModel.programPackageConfigs.push(tempPackagesConfig);
        }
        this.loveContractModel.baseContract.isOnlineContract = true;
        this.loveContractModel.baseContract.effectiveDate = this.effectiveDate;
        this.loveContractModel.baseContract.expireDate = this.expireDate;
        this.loveContractModel.baseContract.contractType = 1; // hợp đồng bảo hiểm gia đình
        this.loveContractModel.baseContract.formOfParticipation = 1; // hợp đồng gốc
        this.loveContractModel.loveContract.waitingTimeFrom = this.waitingTimeFrom;
        this.loveContractModel.loveContract.waitingTimeTo = this.waitingTimeTo;
        if (this.beneficiary) {
            this.customerInfo.isBeneficiary = true;
            this.partnerInfo.isBeneficiary = false;
        } else {
            this.customerInfo.isBeneficiary = false;
            this.partnerInfo.isBeneficiary = true;
        }
        this.oh.insuranceDetailOrder(OnlineGroupType.grCN, this.loveContractModel, this.customerInfo, null, null, this.partnerInfo);

        this.oh.select(this.insurancePackages, this.router.url, this.refCode);
        this.router.navigate(["product/checkoutpayment/"], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href, { receiveCert: this.receiveCertificate }) });
    }
    nextToConfirm() {
        window.scrollTo(0, 0);
        this.blNextStep = true;
        this.customerInfo.name = this.customerInfo.name.toUpperCase();
        this.partnerInfo.name = this.partnerInfo.name.toUpperCase();
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
                this.optionPackages.insurancePackageDetails[2].selected = true;
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
                this.insuranceCost = res.data.totalInsuranceCost;
                //  + res.data.totalDiscount;
                // this.discount = res.data.totalInsuranceCost;
            }
        });
    }
    //
    changeGender() {
        if (this.customerInfo.sex == 1) {
            this.partnerInfo.sex = 2;
            this.customerForm.get("dateOfBirth").clearValidators();
            this.customerForm.get("dateOfBirth").setValidators([Validators.required, dobRange(18, 100)]);
            this.partnerForm.get("dateOfBirth").clearValidators();
            this.partnerForm.get("dateOfBirth").setValidators([Validators.required, dobRange(18, 100)]);
        } else {
            this.partnerInfo.sex = 1;
            this.customerForm.get("dateOfBirth").clearValidators();
            this.customerForm.get("dateOfBirth").setValidators([Validators.required, dobRange(18, 100)]);
            this.partnerForm.get("dateOfBirth").clearValidators();
            this.partnerForm.get("dateOfBirth").setValidators([Validators.required, dobRange(18, 100)]);
        }
        this.customerForm.get("dateOfBirth").updateValueAndValidity();
        this.partnerForm.get("dateOfBirth").updateValueAndValidity();
    }
    changeEffectiveDate() {
        this.expireDate = this.vs.calculatorExpiredTimeOfContract_new(this.effectiveDate, 5);
        this.waitingTimeFrom = new Date(this.vs.calculatorExpiredTimeOfContract_new(this.effectiveDate, -3).getTime() + 1);
        this.waitingTimeTo = new Date(this.effectiveDate.getTime() - 1);
    }
    changeDateOfBirth(input) {
        if (input == "" || input == null) {
            this.customerInfo.dateOfBirth = null;
        } else if (this.regex.dateRegex.test(input)) {
            this.customerInfo.dateOfBirth = this.vs.toDate(input);
        }
    }
    changeDateOfBirthPartner(input) {
        if (input == "" || input == null) {
            this.partnerInfo.dateOfBirth = null;
        } else if (this.regex.dateRegex.test(input)) {
            this.partnerInfo.dateOfBirth = this.vs.toDate(input);
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
            email: [{ value: "" }, [Validators.required, Validators.pattern(this.regex.emailRegex)]],
            dateOfBirth: ["", [Validators.required, dobRange(20, 100)]],
            sex: [{ value: "" }, [Validators.required]],
        });
    }
    initFormPartner() {
        this.partnerForm = this.fb.group({
            name: ["", [Validators.required, stringName(2)]],
            idNumber: [{ value: "" }, [Validators.required, Validators.pattern(this.regex.idRegex)]],
            phoneNumber: [{ value: "" }, [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
            dateOfBirth: ["", [Validators.required, dobRange(18, 100)]],
            sex: [{ value: "" }, [Validators.required]],
        });
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
export function dobRange(minDob: number, maxDob: number) {
    return (c: AbstractControl) => {
        let dateRegex: RegExp = /^(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/]([1-9][0-9])\d\d$)|(^29[\/]02[\/]([1-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)$/;
        let temp = c.value;
        if (temp && temp.length > 0) {
            if (temp && dateRegex.test(temp)) {
                let arr = temp.split(/\/|-|\\|\.|\_|\,/);
                temp = new Date(+arr[2], +arr[1] - 1, +arr[0]);
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
            }
            return { pat: true };
        }
        return { empty: true };
    };
}

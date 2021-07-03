import { Component, OnInit, ViewChild } from "@angular/core";
import { OnlineContractService } from "../../../services/onlinecontract.service";
import { InsurancePackage, InsurancePackageDetail, InsuranceFeeInfoByConfig, ProgramPackageConfig, BuildingContractModel, InsuredBuilding } from "../../../models/contract.model";
import { VietService } from "../../../services/viet.service";
import { Customer } from "../../../models/general.model";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderHelper } from "../../../services/order.helper";
import { Address } from "../../../models/address.model";
import { FormGroup } from "@angular/forms";
import { AddressInfoComponent } from "../../../ShareComponent/addressinfo/addressinfo.component";
import { OnlineGroupType } from "../../../models/enum";

@Component({
    selector: "app-tsktPayment",
    templateUrl: "./tsktPayment.component.html",
    styleUrls: ["./tsktPayment.component.css"]
})
export class TSKTPaymentComponent implements OnInit {
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
    buildingContractModel = new BuildingContractModel();
    inProcess: boolean = false;
    refCode: string = "";
    customerInfoValid: boolean = false;
    addressInfoValid: boolean = false;
    @ViewChild(AddressInfoComponent) private addressInfoComponent: AddressInfoComponent;
    hasCombine = false;
    prevLink = "";
    grId: number;
    blNextStep: boolean = false;
    paymentSupplierCode: string = '';
    groupName: string = '';
    checkedPromise = false;

    constructor(
        private oh: OrderHelper,
        private oc: OnlineContractService,
        private vs: VietService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.grId = +params["groupId"];
            this.paymentSupplierCode = params['paymentsupplier'] || null;
        });
        this.selectedPackages = new Array<InsurancePackageDetail>();
        this.today = this.vs.nowDate();
        this.effectiveDate = this.vs.next_N_Date(2);
        this.minEffectiveDate = this.vs.next_N_Date(2);
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
        this.insuranceFeeInfoByConfig.contractType = 4;
        // this.buildingContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
        this.insuranceCost = 0;
        this.discount = 0;
        this.oh.infoOfProduct.subscribe(p => {
            if (p) {
                this.refCode = p.refCode;
                this.prevLink = p.prev_link;
            }
        })
        this.oc.getInsuranceProductOptionsDetail(this.grId).subscribe(res => {
            if (res && res.success) {
                this.insurancePackages = this.vs.arrayOrder(res.data.insuranceProductOptionDetails, "programCode", false);
                this.checkHasCombine();
                this.autoCheckPackageDefault();
            }
        });

        this.oh.order.subscribe(p => {
            if (p) {
                this.customerInfo = p.customer_info;
                this.buildingContractModel = p.base_contract;
                this.addressInfo = p.address_info;
            }
        });

        this.oc.getInsuranceProductById(this.grId).subscribe(res => {
            if (res && res.success) {
               this.groupName = res.data.name;
               this.buildingContractModel.baseContract.insuranceProductId = res.data.id;
               this.buildingContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
            }
        });
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
            this.buildingContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
        }
    }
    nextToConfirm() {
        window.scrollTo(0, 0);
        this.blNextStep = true;
    }

    nextStep() {
        window.scrollTo(0, 0);
        let buildingAddress = new Address();
        buildingAddress.addressDetails = this.addressInfo.addressDetails;
        buildingAddress.provinceOrCityId = this.addressInfo.provinceOrCityId;
        buildingAddress.districtId = this.addressInfo.districtId;
        buildingAddress.wardId = this.addressInfo.wardId;
        this.buildingContractModel.programPackageConfigs = new Array<ProgramPackageConfig>();
        for (let i = 0; i < this.selectedPackages.length; i++) {
            let tempPackagesConfig = new ProgramPackageConfig();
            tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
            tempPackagesConfig.numberOfInsuranceObject = this.selectedPackages[i].numberOfInsuranceObject;
            this.buildingContractModel.programPackageConfigs.push(tempPackagesConfig);
        }
        this.buildingContractModel.baseContract.isOnlineContract = true;
        this.buildingContractModel.baseContract.effectiveDate = this.effectiveDate;
        this.buildingContractModel.baseContract.expireDate = this.expireDate;
        this.buildingContractModel.baseContract.contractType = 3; // hợp đồng bảo hiểm nhà
        this.buildingContractModel.baseContract.formOfParticipation = 1; // hợp đồng gốc
        this.oh.insuranceDetailOrder(OnlineGroupType.grTSKT, this.buildingContractModel, this.customerInfo, buildingAddress);
        this.oh.select(this.insurancePackages, this.router.url, this.refCode);
        // const url = 'product/checkoutpayment/';
        // if (this.paymentSupplierCode != null && this.paymentSupplierCode != '') {
        //     this.router.navigate([url, {'paymentsupplier' : this.paymentSupplierCode}]);
        // } else {
        //     this.router.navigate([url]);
        // }
        this.router.navigate(["product/checkoutpayment/"], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href) });
    }
    goBack() {
        this.router.navigate([this.vs.cleanParamsInURL(this.prevLink)], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink)});
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
        this.combinePackages.insurancePackageDetails.filter(item => item.selected == true).forEach(item => {
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
    changeEffectiveDate() {
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
    }
    customerFormValid(valid: boolean) {
        this.customerInfoValid = valid;
        if (this.addressInfoComponent) {
            if (valid) {
                (this.addressInfoComponent.addressForm as FormGroup).get("likeCustomerInfo").enable();
            } else {
                if (this.customerInfo.addressDetails == null || this.customerInfo.addressDetails == "") {
                    (this.addressInfoComponent.addressForm as FormGroup).get("likeCustomerInfo").disable();
                    this.addressInfoComponent._addressInfo = new Address();
                    this.addressInfoComponent.likeCustomerInfo = false;
                    this.addressInfoComponent.disabled = false;
                    (this.addressInfoComponent.addressForm as FormGroup).get("addressDetails").enable();
                }
            }
        }
    }
    customerInfoChange(cusInfo) {
        this.customerInfo = cusInfo;
        this.changeAddress();
    }
    validBuilding(valid: boolean) {
        this.addressInfoValid = valid;
    }
    getAddressFormDetail(addInfo) {
        this.addressInfo = addInfo;
    }
    changeAddress() {
        try {
            if (this.addressInfoComponent != undefined) {
                (this.addressInfoComponent.addressForm as FormGroup).get("likeCustomerInfo").disable();
                if (this.customerInfo.addressDetails != null && this.customerInfo.addressDetails != "") {
                    (this.addressInfoComponent.addressForm as FormGroup).get("likeCustomerInfo").enable();
                    this.addressInfoComponent._addressInfo = new InsuredBuilding();
                    this.addressInfoComponent.likeCustomerInfo = false;
                    this.addressInfoComponent.disabled = false;
                    (this.addressInfoComponent.addressForm as FormGroup).get("addressDetails").enable();
                } else {
                    (this.addressInfoComponent.addressForm as FormGroup).get("likeCustomerInfo").disable();
                    this.addressInfoComponent._addressInfo = new InsuredBuilding();
                    this.addressInfoComponent.likeCustomerInfo = false;
                    this.addressInfoComponent.disabled = false;
                    (this.addressInfoComponent.addressForm as FormGroup).get("addressDetails").enable();
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    changeStatusPromise() {
        this.checkedPromise = !this.checkedPromise;
    }
}

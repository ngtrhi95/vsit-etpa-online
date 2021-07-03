import { Component, OnInit, ViewChild } from '@angular/core';
import { OnlineContractService } from '../../../services/onlinecontract.service';
import { VietService } from '../../../services/viet.service';
import { Customer, Channel } from '../../../models/general.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderHelper } from '../../../services/order.helper';
import { Address, Province, Ward, District } from '../../../models/address.model';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AddressInfoComponent } from '../../../ShareComponent/addressinfo/addressinfo.component';
import { OnlineGroupType } from '../../../models/enum';
import { MobileContractService } from '../mobileinsurance.service';
import { InsuranceProductModel, MobileContractModel, InsuredMobileDevice } from '../../../models/contract.model';
import { Regex } from '../../../models/regex';
import { LocationService } from '../../../services/location.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-mobilePayment',
    templateUrl: './mobilePayment.component.html',
    styleUrls: ['./mobilePayment.component.css']
})
export class MobilePaymentComponent implements OnInit {
    // TODO: nothing todo
    today = new Date();
    effectiveDate = new Date();
    minEffectiveDate = new Date();
    expireDate = new Date();
    insuranceCost: number;
    customerInfo = new Customer();
    inProcess = false;
    refCode = '';
    customerInfoValid = false;
    hasCombine = false;
    prevLink = '';
    grId: number;
    infoNextStep = false;
    blNextStep = false;
    paymentSupplierCode = '';
    groupName = '';
    checkedPromise = false;
    fromApp: any;
    contractType = 11;
    insuranceProductModel = new InsuranceProductModel();
    contractTypes = [
        { type: MobileDeviceContractType.AD, value: 'Bảo hiểm tổn thất bất ngờ' },
        { type: MobileDeviceContractType.EW, value: 'Bảo hành mở rộng' },
        { type: MobileDeviceContractType.ADANDEW, value: 'Bảo hiểm tổn thất bất ngờ và bảo hành mở rộng' }
    ];
    // contractTypeSelected = 0;
    deviceTypes = [
        { type: MobileDeviceCategoryType.Mobile, value: 'Điện thoại di động' },
        { type: MobileDeviceCategoryType.Tablet, value: 'Máy tính bảng' },
        { type: MobileDeviceCategoryType.Laptop, value: 'Laptop' }
    ];
    // deviceTypeSelected = 0;
    producers;
    producerSelected = 1;
    mobileContractModel = new MobileContractModel();
    deviceForm: FormGroup;
    costRate = 0;
    //
    receiveCertificate = false;
    numberOfFile = 0;
    collectedFiles = [];
    //
    regex = new Regex();
    provinces = new Array<Province>();
    districts: Array<District> = [];
    wards: Array<Ward> = [];
    customerForm: FormGroup;
    maskPhone = [/\d/, /\d/, /\d/, /\d/,/\d/, /\d/, /\d/, /\d/,/\d/, /\d/];

    constructor(private oh: OrderHelper, private oc: OnlineContractService, private fb: FormBuilder, private locationService: LocationService,
        private vs: VietService, private route: ActivatedRoute, private router: Router, private mc: MobileContractService) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.paymentSupplierCode = params['paymentsupplier'] || null;
            this.fromApp = params["fromApp"] == "true";
        });
        this.route.params.subscribe(params => {
            this.grId = +params['groupId'];
        });
        this.initForm();
        this.initFormCustomer();
        this.getProvinces();
        this.today = this.vs.nowDate();
        this.effectiveDate = this.vs.nowDate();
        this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
        // TODO: change for new product
        setTimeout(() => {
            this.mobileContractModel.baseMobileDeviceContract.MobileDeviceContractType = MobileDeviceContractType.AD;
            this.mobileContractModel.baseMobileDeviceContract.DeviceCategoryType = 0;
            this.oh.order.subscribe(p => {
                if (p) {
                    this.customerInfo = p.customer_info;
                    this.mobileContractModel = p.base_contract;
                    this.collectedFiles = p.files;
                }
            });
        }, 1);
        this.mobileContractModel.baseContract.effectiveDate = this.effectiveDate;
        this.mobileContractModel.baseContract.contractType = this.contractType;
        this.mobileContractModel.takingPaperCertification = false;
        this.insuranceCost = 0;
        this.oh.infoOfProduct.subscribe(p => {
            if (p) {
                this.refCode = p.refCode;
                this.prevLink = p.prev_link;
            }
        });
        this.mc.getAllActivatedProducers().subscribe(res => {
            if (res && res.success) {
                this.producers = this.vs.arrayOrder(res.data, 'name');
            }
        });
        this.oc.getInsuraceProductOptionsDetailWithChannel(this.grId, Channel.ONLINE).subscribe(res => {
            if (res && res.success) {
                this.receiveCertificate = res.data.receiveCertificate;
            }
        });
        this.oc.getInsuranceProductById(this.grId).subscribe(res => {
            if (res && res.success) {
                this.mobileContractModel.insuranceProductModel = res.data;
                this.groupName = res.data.name;
                this.mobileContractModel.baseContract.insuranceProductId = res.data.id;
                this.mobileContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
            }
        });
    }
    initForm() {
        this.deviceForm = this.fb.group({
            contractType: [ "", [Validators.required]],
            deviceType: [ "", [Validators.required]],
            brand: [ "", [Validators.required]],
            model: [ "", [Validators.required]],
            cost: [ "", [Validators.required, Validators.min(100000)]],
            IMEI: [ "", [Validators.required, Validators.maxLength(15)]],
        });
    }
    nextToConfirm() {
        window.scrollTo(0, 0);
        this.blNextStep = true;
    }

    nextStep() {
        window.scrollTo(0, 0);
        this.mobileContractModel.baseContract.isOnlineContract = true;
        this.mobileContractModel.baseContract.contractType = this.contractType;
        this.mobileContractModel.baseContract.formOfParticipation = 1;
        this.mobileContractModel.baseContract.effectiveDate = this.effectiveDate;
        this.mobileContractModel.baseContract.expireDate = this.expireDate;
        this.oh.insuranceDetailOrder(OnlineGroupType.grTBDD, this.mobileContractModel, this.customerInfo, null, this.collectedFiles);
        this.oh.select([] , this.router.url, this.refCode);
        this.router.navigate(["product/checkoutpayment/"], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href, { receiveCert: this.receiveCertificate }) });
    }
    goBack() {
        this.router.navigate([this.vs.cleanParamsInURL(this.prevLink)], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink) });
    }
    goBackInStep2() {
        this.blNextStep = false;
    }
    calInsuranceCost() {
        const calModel = {
            DeviceCategoryType: this.mobileContractModel.baseMobileDeviceContract.DeviceCategoryType,
            MobileDeviceContractType: this.mobileContractModel.baseMobileDeviceContract.MobileDeviceContractType,
            Price: this.mobileContractModel.insuredMobileDevice.Price
        };
        this.mc.calInsuranceCost(calModel).subscribe(res => {
            if (res && res.success) {
                this.mobileContractModel.totalInsuranceCost = res.data;
            }
            if (res && !res.success) {
                // PRICE_NOT_CORRECT
                this.mobileContractModel.totalInsuranceCost = 0;
            }
        });
        if (calModel.DeviceCategoryType >= 0 && calModel.MobileDeviceContractType >= 0) {
            this.mc.getCostRate(calModel).subscribe(res => {
                if (res && res.success) {
                    this.costRate = res.data;
                }
                if (res && !res.success) {
                    // MOBILE_DEVICE_COST_RATE_NOT_FOUND
                    this.costRate = 0;
                }
            });
        }
    }

    //
    customerFormValid(valid: boolean) {
        this.customerInfoValid = valid;
    }
    customerInfoChange(cusInfo) {
        this.customerInfo = cusInfo;
    }

    changeStatusPromise() {
        this.checkedPromise = !this.checkedPromise;
    }
    changeContractTypeNonBusiness() {
        // this.mobileContractModel.baseMobileDeviceContract.MobileDeviceContractType = this.contractTypeSelected;
        if (this.mobileContractModel.baseMobileDeviceContract.MobileDeviceContractType == MobileDeviceContractType.AD) {
            this.effectiveDate = this.vs.nowDate();
            this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.vs.nowDate());
        } else if (this.mobileContractModel.baseMobileDeviceContract.MobileDeviceContractType == MobileDeviceContractType.EW) {
            this.effectiveDate = new Date(this.vs.calculatorExpiredTimeOfContract(this.vs.nowDate()).setHours(24, 0, 0, 0));
            this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
        } else if (this.mobileContractModel.baseMobileDeviceContract.MobileDeviceContractType == MobileDeviceContractType.ADANDEW) {
            this.effectiveDate = this.vs.nowDate();
            this.expireDate = this.vs.calculatorExpiredTimeOfContract_v2(this.vs.nowDate(), 2);
        }
        this.calInsuranceCost();
    }
    changeDeviceType() {
        // this.mobileContractModel.baseMobileDeviceContract.MobileDeviceCategoryType = this.deviceTypeSelected;
        this.calInsuranceCost();
    }
    changeProducer() {
        // this.mobileOrderModel.mobileDeviceContract.insuredMobileDevice.DeviceProducerId = this.insuredMobile.DeviceProducerId;
    }
    priceChange() {
        this.calInsuranceCost();
    }
    //
    countFileSelected(event) {
        this.numberOfFile = +event;
    }
    collectFiles(event) {
        this.collectedFiles = event;
    }
    checkAllowToCheckOut() {
        // console.log(this.customerInfoValid, this.deviceForm.valid, this.numberOfFile > 2)
        let temp = this.customerForm.valid && this.deviceForm.valid && this.numberOfFile > 2 && this.isFullAddress();
        if (this.fromApp) {
            return temp;
        } else {
            return temp && this.checkedPromise;
        }
    }
    //
    mixAddressDetail() {
        let str = "";
        if (this.wards.length != 0 && this.customerInfo.wardId && this.districts.length != 0 && this.customerInfo.districtId && this.provinces.length != 0 && this.customerInfo.provinceOrCityId) {
            str =
                (this.customerInfo.addressDetails ? (this.customerInfo.addressDetails +
                ", ") : "") +
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
    initFormCustomer() {
        this.customerForm = this.fb.group({
            name: ["" , [Validators.required, stringName(2)]],
            idNumber: ["" , [Validators.required, Validators.pattern(this.regex.idRegex)]],
            phoneNumber: ["" , [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
            email: ["" , [Validators.pattern(this.regex.emailRegex)]],
            fullAddress: this.fb.group({
                addressDetails: ["" , []],
                provinceOrCityId: ["" , [Validators.required]],
                districtId: ["" , [Validators.required]],
                wardId: ["", [Validators.required]]
            })
        });
    }
    getProvinces() {
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
    getDistricts(provinceId) {
        try {
            this.locationService.getDistrictsByProvinceId(provinceId).subscribe(resultDistrict => {
                if (resultDistrict.success) {
                    this.districts = this.vs.arrayOrder(resultDistrict.data, "name");
                    if (this.customerInfo.districtId && this.districts.find(x => x.id == this.customerInfo.districtId))
                        this.customerInfo.districtId = this.districts.find(x => x.id == this.customerInfo.districtId).id || null;
                } else {
                    console.log(resultDistrict.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    getWards(districtId) {
        try {
            this.locationService.getWardsByDistrictId(districtId).subscribe(resultWard => {
                if (resultWard.success) {
                    this.wards = this.vs.arrayOrder(resultWard.data, "name");
                    if (this.customerInfo.wardId && this.wards.find(x => x.id == this.customerInfo.wardId))
                        this.customerInfo.wardId = this.wards.find(x => x.id == this.customerInfo.wardId).id || null;
                } else {
                    console.log(resultWard.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
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
    getContractTypeString() {
        let temp = this.contractTypes.find(_ => _.type == this.mobileContractModel.baseMobileDeviceContract.MobileDeviceContractType);
        return temp ? temp.value : '';
    }
    getDeviceTypeString() {
        let temp = this.deviceTypes.find(_ => _.type == this.mobileContractModel.baseMobileDeviceContract.DeviceCategoryType);
        return temp ? temp.value : '';
    }
    getBrandString() {
        let temp = this.producers ? this.producers.find(_ => _.id == this.mobileContractModel.insuredMobileDevice.DeviceProducerId) : null;
        return temp ? temp.name : '';
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
export enum MobileDeviceContractType {
    AD,
    EW,
    ADANDEW
}
export enum MobileDeviceCategoryType {
    Mobile,
    Tablet,
    Laptop
}

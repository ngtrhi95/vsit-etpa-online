import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray, Form } from "@angular/forms";
import { VietService } from "../../services/viet.service";
import { LocationService } from "../../services/location.service";
import { Address, Province, District, Ward } from "../../models/address.model";
import { Customer } from "../../models/general.model";
import { Regex } from "../../models/regex";

@Component({
    selector: "app-addressinfo",
    templateUrl: "./addressinfo.component.html",
    styleUrls: ["./addressinfo.component.css"]
})
export class AddressInfoComponent implements OnInit {
    //limit address 
    limit = true;
    addressWarning = false;
    // countInit: number = 0;
    hasCusInfo: boolean = false;
    hasAddrInfo: boolean = false;
    @Input() title: string = "Tiêu đề";
    @Input() discription_top: string = "";
    @Input() discription_bot: string = "";
    @Input() disabled: boolean = false;
    // @Input() inputView: boolean = false;
    _addressInfo = new Address();
    _customerInfo = new Customer();
    sameAsCustomerAddress: boolean = false;

    @Output() formValid = new EventEmitter();
    @Output() addressInfoChange = new EventEmitter();
    @Input()
    set addressInfo(value: Address) {
        this.hasAddrInfo = true;
        this._addressInfo = value;
        if (this._addressInfo.provinceOrCityId && this._addressInfo.districtId && this._addressInfo.wardId) {
            this.getDistricts(this._addressInfo.provinceOrCityId);
            this.getWards(this._addressInfo.districtId);
        }
        this.addressInfoChange.emit(this._addressInfo);
    }
    get addressInfo() {
        return this._addressInfo;
    }

    @Input()
    set customerInfo(value: Customer) {
        this._customerInfo = value;
        if (value.id != undefined) {
            this.hasCusInfo = true;
        }
    }
    //
    regex = new Regex();
    mask = new Regex().maskDate;
    provinces = new Array<Province>();
    districts: Array<District> = [];
    wards: Array<Ward> = [];
    addressForm: FormGroup;
    minDoB: Date;
    maxDoB: Date;
    likeCustomerInfo: boolean = false;
    initSuccess = false;
    constructor(private fb: FormBuilder, private vs: VietService, private locationService: LocationService) {
        this.initFormAddress();
    }

    ngOnInit() {}
    ngAfterViewInit() {
        this.addressFormChange();
        this.getProvinces();
        setTimeout(() => {
            this.initSuccess = true;
        }, 1000);
    }
    ngAfterViewChecked() {
        // if (this.likeCustomerInfo) {
        //     this._addressInfo.addressDetails = this._customerInfo.addressDetails;
        // }
        if (!this._addressInfo.fullAddress) this._addressInfo.fullAddress = this.mixAddressDetail();
    }
    mixAddressDetail() {
        let str = "";
        if (this.wards.length != 0 && this._addressInfo.wardId && this.districts.length != 0 && this._addressInfo.districtId && this.provinces.length != 0 && this._addressInfo.provinceOrCityId) {
            str =
                this._addressInfo.addressDetails +
                ", " +
                (this.wards.find(w => w.id == this._addressInfo.wardId).name || "") +
                ", " +
                (this.districts.find(w => w.id == this._addressInfo.districtId).name || "") +
                ", " +
                (this.provinces.find(w => w.id == this._addressInfo.provinceOrCityId).name || "");
        }
        return str;
    }
    changeAddressDetail() {
        this._addressInfo.fullAddress = this.mixAddressDetail();
    }
    checkSameAddress() {
        setTimeout(() => {
            if (this._customerInfo.provinceOrCityId == this._addressInfo.provinceOrCityId && this._customerInfo.districtId == this._addressInfo.districtId && this._customerInfo.wardId == this._addressInfo.wardId && this._customerInfo.addressDetails == this._addressInfo.addressDetails) {
                this.checkLikeCustomerInfo();
            }
        }, 1);
    }
    checkLikeCustomerInfo() {
        try {
            this.likeCustomerInfo = !this.likeCustomerInfo;
            if (this.likeCustomerInfo) {
                let temp = this.provinces.find(x => x.id == this._customerInfo.provinceOrCityId);
                if (temp) {
                    this.addressWarning = false;
                    this._addressInfo.provinceOrCityId = temp.id || null;
                    this.getDistricts(this._customerInfo.provinceOrCityId);
                    this.getWards(this._customerInfo.districtId);
                    this._addressInfo.districtId = this._customerInfo.districtId;
                    this._addressInfo.wardId = this._customerInfo.wardId;
                    this._addressInfo.addressDetails = this._customerInfo.addressDetails;
                    // setTimeout(res => {
                    //     this._addressInfo.addressDetails = this._customerInfo.addressDetails;
                    // }, 1000);
                    // this.disabled = this.likeCustomerInfo;
                    // const ctrl = (this.addressForm as FormGroup).get("addressDetails");
                    // ctrl.disable();
                } else {
                    this.addressWarning = true;
                }
            } else {
                // this._addressInfo = new Address();
                // this.disabled = this.likeCustomerInfo;
                // const ctrl = (this.addressForm as FormGroup).get("addressDetails");
                // ctrl.enable();
            }
        } catch (err) {
            console.log(err)
        }
    }

    addressFormChange() {
        this.addressForm.valueChanges.subscribe(res => {
            if (this.addressForm.valid) {
                this.addressInfoChange.emit(this._addressInfo);
            }
            this.formValid.emit(this.addressForm.valid);
        });
    }

    initFormAddress() {
        this.addressForm = this.fb.group({
            addressDetails: [{ value: "", disabled: this.disabled }, [Validators.required]],
            provinceOrCityId: [{ value: "" }, [Validators.required]],
            districtId: [{ value: "" }, [Validators.required]],
            wardId: [{ value: "" }, [Validators.required]],
            likeCustomerInfo: [{ value: "" }]
            // likeCustomerInfo: [{ value: "", disabled: true }]
        });
    }
    getProvinces() {
        try {
            this.locationService.getProvinces(this.limit).subscribe(resultProvince => {
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
                    if (this._customerInfo.districtId && this.districts.find(x => x.id == this._customerInfo.districtId)) this._addressInfo.districtId = this.districts.find(x => x.id == this._customerInfo.districtId).id || null;
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
                    if (this._customerInfo.wardId && this.wards.find(x => x.id == this._customerInfo.wardId)) this._addressInfo.wardId = this.wards.find(x => x.id == this._customerInfo.wardId).id || null;
                } else {
                    console.log(resultWard.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    provinceSelected() {
        try {
            if (this.initSuccess) {
                this.likeCustomerInfo = false;
                this._addressInfo.districtId = undefined;
                this.districtSelected();
                this.districts = [];
                this.getDistricts(this._addressInfo.provinceOrCityId);
            }
        } catch (e) {
            throw e;
        }
    }
    districtSelected() {
        try {
            if (this.initSuccess) {
                this._addressInfo.wardId = undefined;
                this.wardSelected();
                this.wards = [];
                this.getWards(this._addressInfo.districtId);
            }
        } catch (e) {
            throw e;
        }
    }
    wardSelected() {
        // if (this.initSuccess) {
        //     this._addressInfo.addressDetails = null;
        // }
    }
}

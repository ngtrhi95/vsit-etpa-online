import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray, Form } from "@angular/forms";
import { VietService } from "../../services/viet.service";
import * as Models from "../../models/general.model";
import * as locModels from "../../models/address.model";
import { CustomerService } from "../../services/customer.service";
import { LocationService } from "../../services/location.service";
import { Regex } from "../../models/regex";

@Component({
    selector: "app-customerinfo",
    templateUrl: "./customerinfo.component.html",
    styleUrls: ["./customerinfo.component.css"]
})
export class CustomerinfoComponent implements OnInit {
    @Input()
    title: string = "Tiêu đề";
    @Input()
    disabled: boolean = false;
    @Input()
    isTNDS: boolean = false;
    @Input()
    get customerInfo() {
        return this._customerInfo;
    }
    set customerInfo(value: Models.Customer) {
        setTimeout(() => {
            if (value.provinceOrCityId && value.districtId && value.wardId) {
                this._customerInfo = this.vs.isClonedOf(value);
                setTimeout(() => {
                    this.getDistricts(this._customerInfo.provinceOrCityId);
                    this.getWards(this._customerInfo.districtId);
                    this.customerInfoChange.emit(this._customerInfo);
                }, 1);
            }
        }, 1);
        this.customerInfoChange.emit(this._customerInfo);
    }
    @Input()
    set customerId(value: number) {
        this.getCustomerInfo(value);
    }
    @Output()
    formValid = new EventEmitter();
    @Output()
    customerInfoChange = new EventEmitter();
    //
    regex = new Regex();
    provinces = new Array<locModels.Province>();
    districts: Array<locModels.District> = [];
    wards: Array<locModels.Ward> = [];
    customerForm: FormGroup;
    _customerInfo = new Models.Customer();
    minDoB: Date;
    maxDoB: Date;
    initSuccess = false;
    constructor(private customerService: CustomerService, private fb: FormBuilder, private vs: VietService, private locationService: LocationService) {
        this.initFormCustomer();
    }

    ngOnInit() {
        this.customerFormChange();
    }
    ngAfterViewInit() {
        this.getProvinces();
        setTimeout(() => {
            this.initSuccess = true;
        }, 1000);
    }
    ngAfterViewChecked() {
        if (this._customerInfo.fullAddress != null || this._customerInfo.fullAddress != undefined || this._customerInfo.fullAddress != '') this._customerInfo.fullAddress = this.mixAddressDetail();
    }
    mixAddressDetail() {
        let str = "";
        if (this.wards.length != 0 && this._customerInfo.wardId && this.districts.length != 0 && this._customerInfo.districtId && this.provinces.length != 0 && this._customerInfo.provinceOrCityId) {
            str =
                (this._customerInfo.addressDetails ? this._customerInfo.addressDetails +
                ", " : '') +
                (this.wards.find(w => w.id == this._customerInfo.wardId).name || "") +
                ", " +
                (this.districts.find(w => w.id == this._customerInfo.districtId).name || "") +
                ", " +
                (this.provinces.find(w => w.id == this._customerInfo.provinceOrCityId).name || "");
        }
        return str;
    }
    changeAddressDetail() {
        this._customerInfo.fullAddress = this.mixAddressDetail();
    }

    getCustomerInfo(customerId: number) {
        try {
            this.customerService.getCustomerById(customerId).subscribe(result => {
                if (result.success) {
                    this._customerInfo = result.data;
                    this.getDistricts(this._customerInfo.provinceOrCityId);
                    this.getWards(this._customerInfo.districtId);
                    this.customerInfoChange.emit(this._customerInfo);
                } else {
                    //TODO - có lỗi khi lấy thông tin customer
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    customerFormChange() {
        this.customerForm.valueChanges.subscribe(res => {
            if (this.customerForm.valid) {
                this.customerInfoChange.emit(this._customerInfo);
            }
            this.formValid.emit(this.customerForm.valid);
        });
    }
    initFormCustomer() {
        this.customerForm = this.fb.group({
            name: [{ value: "", disabled: this.disabled }, [Validators.required]],
            phoneNumber: [{ value: "", disabled: this.disabled }, [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
            email: [{ value: "", disabled: this.disabled }, [Validators.pattern(this.regex.emailRegex)]],
            fullAddress: this.fb.group({
                addressDetails: [{ value: "", disabled: this.disabled }, [Validators.required]],
                provinceOrCityId: [{ value: "" }, [Validators.required]],
                districtId: [{ value: "" }, [Validators.required]],
                wardId: [{ value: "" }, [Validators.required]]
            })
        });
        // if (this.isTNDS) {
        //     this.customerForm = this.fb.group({
        //         name: [{ value: "", disabled: this.disabled }, [Validators.required]],
        //         phoneNumber: [{ value: "", disabled: this.disabled }, [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
        //         email: [{ value: "", disabled: this.disabled }, [Validators.pattern(this.regex.emailRegex)]],
        //         fullAddress: this.fb.group({
        //             addressDetails: [{ value: "", disabled: this.disabled }, [Validators.required]],
        //             provinceOrCityId: [{ value: "" }, [Validators.required]],
        //             districtId: [{ value: "" }, [Validators.required]],
        //             wardId: [{ value: "" }, [Validators.required]]
        //         })
        //     });
        // } else {
        //     this.customerForm = this.fb.group({
        //         name: [{ value: "", disabled: this.disabled }, [Validators.required, stringName(2)]],
        //         idNumber: [{ value: "", disabled: this.disabled }, [Validators.pattern(this.regex.idRegex)]],
        //         phoneNumber: [{ value: "", disabled: this.disabled }, [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
        //         email: [{ value: "", disabled: this.disabled }, [Validators.pattern(this.regex.emailRegex)]],
        //         fullAddress: this.fb.group({
        //             addressDetails: [{ value: "", disabled: this.disabled }, [Validators.required]],
        //             provinceOrCityId: [{ value: "" }, [Validators.required]],
        //             districtId: [{ value: "" }, [Validators.required]],
        //             wardId: [{ value: "" }, [Validators.required]]
        //         })
        //     });
        // }
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
                    if (this._customerInfo.districtId && this.districts.find(x => x.id == this._customerInfo.districtId))
                        this._customerInfo.districtId = this.districts.find(x => x.id == this._customerInfo.districtId).id || null;
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
                    if (this._customerInfo.wardId && this.wards.find(x => x.id == this._customerInfo.wardId))
                        this._customerInfo.wardId = this.wards.find(x => x.id == this._customerInfo.wardId).id || null;
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
                this.districts = [];
                this.getDistricts(this._customerInfo.provinceOrCityId);
                this.districtSelected();
                this._customerInfo.districtId = undefined;
            }
        } catch (e) {
            throw e;
        }
    }
    districtSelected() {
        try {
            if (this.initSuccess) {
                this.wards = [];
                this.getWards(this._customerInfo.districtId);
                this.wardSelected();
                this._customerInfo.wardId = undefined;
            }
        } catch (e) {
            throw e;
        }
    }
    wardSelected() {
        // if (this.initSuccess) {
        //     this._customerInfo.addressDetails = null;
        // }
    }
}
export function dateStringRange(minDate: Date, maxDate: Date) {
    return (c: AbstractControl) => {
        let dateRegex = new Regex().dateRegex;
        let vifunc = new VietService();
        if (dateRegex.test(c.value)) {
            let inputDate = vifunc.toDate(c.value);
            if (inputDate.getTime() < minDate.getTime() || inputDate.getTime() > maxDate.getTime()) return { outRange: true };
        }
        return null;
    };
}

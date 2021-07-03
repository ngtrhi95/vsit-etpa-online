import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray, Form } from "@angular/forms";
import { InsuredVehicle } from "../../models/contract.model";
import { Customer } from "../../models/general.model";
import { Regex } from "../../models/regex";
import { VietService } from "../../services/viet.service";
import { OnlineContractService } from "../../services/onlinecontract.service";

@Component({
    selector: "app-vehiclesinfo",
    templateUrl: "./vehiclesinfo.component.html",
    styleUrls: ["./vehiclesinfo.component.css"]
})
export class VehiclesinfoComponent implements OnInit {
    @Output() formValid = new EventEmitter();
    @Output() vehiclesInfoChange = new EventEmitter();
    @Input() disabled: boolean = false;
    @Input() isTNDS: boolean = false;
    @Input() title: string = "Tiêu đề";
    @Input() customerInfo: Customer;
    @Input()
    get vehiclesInfo() {
        return this._vehiclesInfo;
    }
    set vehiclesInfo(value: Array<InsuredVehicle>) {
        this._vehiclesInfo = value;
        this.initFormVehicles();
        this.vehiclesInfoChange.emit(this._vehiclesInfo);
    }
    //
    regex = new Regex();
    maskYear = new Regex().maskYear;
    maskPlate = new Regex().maskPlate;
    _vehiclesInfo = new Array<InsuredVehicle>();
    vehiclesForm: FormGroup;
    yearsOfProduct = [];
    lstBranch = [];
    lstType = [];
    constructor(private fb: FormBuilder, private vs: VietService, private onlService: OnlineContractService) {}

    ngOnInit() {
        this.initFormVehicles();
        this.createYearOfProduct();
        this.getBranch();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["isTNDS"]) {
            this.initFormVehicles();
        }
    }
    createYearOfProduct() {
        const yearLimit = 18;
        const yearNow = new Date().getFullYear();
        for (let index = 0; index <= yearLimit; index++) {
            this.yearsOfProduct.push(yearNow - index);
        }
    }

    public enableCheckLikeCustomerInfo(enable) {
        if (enable) {
            for (let index = 0; index < this._vehiclesInfo.length; index++) {
                const ctrl = ((this.vehiclesForm.get("vehicles") as FormArray).at(index) as FormGroup).get("likeCustomerInfo");
                ctrl.enable();
            }
        } else {
            for (let index = 0; index < this._vehiclesInfo.length; index++) {
                const ctrl = ((this.vehiclesForm.get("vehicles") as FormArray).at(index) as FormGroup).get("likeCustomerInfo");
                ctrl.disable();
            }
        }
    }

    changeYear(input, index) {
        let temp = new Date();
        if (+input > temp.getFullYear()) {
            this.vehiclesInfo[index].yearOfProduction = temp.getFullYear();
        } else {
            this.vehiclesInfo[index].yearOfProduction = input;
        }
    }
    hasPlate(index: number, status: boolean) {
        if (status) {
            this.vehiclesInfo[index].hasPlate = true;
            this.vehiclesInfo[index].machineNumber = null;
            this.vehiclesInfo[index].engineNumber = null;
            // update hasPlate status
            const ctrl = ((this.vehiclesForm.get("vehicles") as FormArray).at(index) as FormGroup).get("hasPlate");
            ctrl.setValue(status);
            const group = (this.vehiclesForm.get("vehicles") as FormArray).at(index) as FormGroup;
            group.addControl("hasPlateForm", this.initHasPlateForm());
            group.removeControl("hasNoPlateForm");
        } else {
            this.vehiclesInfo[index].hasPlate = false;
            this.vehiclesInfo[index].plateNumber = null;
            // update hasPlate status
            const ctrl = ((this.vehiclesForm.get("vehicles") as FormArray).at(index) as FormGroup).get("hasPlate");
            ctrl.setValue(status);
            const group = (this.vehiclesForm.get("vehicles") as FormArray).at(index) as FormGroup;
            group.addControl("hasNoPlateForm", this.initNoPlateForm());
            group.removeControl("hasPlateForm");
        }
    }
    checkLikeCustomerInfo(model: InsuredVehicle, index) {
        model.likeCustomerInfo = !model.likeCustomerInfo;
        const ctrl = ((this.vehiclesForm.get("vehicles") as FormArray).at(index) as FormGroup).get("ownerName");
        if (model.likeCustomerInfo) {
            model.ownerName = this.customerInfo.name;
            ctrl.disable();
        } else {
            model.ownerName = "";
            ctrl.enable();
        }
    }

    initFormVehicles() {
        this.vehiclesForm = this.fb.group({
            vehicles: this.fb.array([])
        });
        for (let i = 0; i < this._vehiclesInfo.length; i++) {
            !this.isTNDS ? this._vehiclesInfo[i].yearOfProduction = new Date().getFullYear() : '';
            this.addVehicle(i);
        }
        this.vehiclesForm.valueChanges.subscribe(res => {
            if (this.vehiclesForm.valid) {
                this._vehiclesInfo.forEach(v => {
                    if (v.plateNumber) v.plateNumber = v.plateNumber.toUpperCase();
                });
                this.vehiclesInfoChange.emit(this._vehiclesInfo);
            }
            this.formValid.emit(this.vehiclesForm.valid);
        });
    }
    initFormVehicle(index) {
        // initialize our address
        let tempFormGroup;
        if (this.isTNDS) {
            tempFormGroup = this.fb.group({
                ownerName: [{ value: "", disabled: this.disabled || this._vehiclesInfo[index].likeCustomerInfo }, Validators.required],
                hasPlate: [{ value: "", disabled: this.disabled }],
                likeCustomerInfo: [{ value: "", disabled: this.disabled || this.customerInfo.name == "" || this.customerInfo.name == undefined }]
            });
        } else {
            tempFormGroup = this.fb.group({
                ownerName: [{ value: "", disabled: this.disabled || this._vehiclesInfo[index].likeCustomerInfo }, Validators.required],
                branchCode: [{ value: "", disabled: this.disabled }, Validators.required],
                typeNumber: [{ value: "", disabled: this.disabled }, Validators.required],
                yearOfProduction: [{ value: "", disabled: this.disabled }, [Validators.required, yearStringValid(18)]],
                hasPlate: [{ value: "", disabled: this.disabled }],
                likeCustomerInfo: [{ value: "", disabled: this.disabled || this.customerInfo.name == "" || this.customerInfo.name == undefined }]
            });
        }
        const ctrl: FormControl = (<any>tempFormGroup).controls["hasPlate"];
        ctrl.setValue(true);
        if (this._vehiclesInfo[index].hasPlate == true) {
            tempFormGroup.addControl("hasPlateForm", this.initHasPlateForm());
        } else {
            tempFormGroup.addControl("hasNoPlateForm", this.initNoPlateForm());
        }
        return tempFormGroup;
    }
    initHasPlateForm() {
        return this.fb.group({
            plateNumber: [{ value: "", disabled: this.disabled }, [Validators.required, Validators.pattern(this.regex.plateRegex)]]
        });
    }
    initNoPlateForm() {
        return this.fb.group({
            engineNumber: [{ value: "", disabled: this.disabled }, Validators.required],
            machineNumber: [{ value: "", disabled: this.disabled }, Validators.required]
        });
    }
    addVehicle(index) {
        // add vehicle to the list
        const control = <FormArray>this.vehiclesForm.controls["vehicles"];
        control.push(this.initFormVehicle(index));
    }
    removeVehicle(index: number) {
        // add vehicle to the list
        const control = <FormArray>this.vehiclesForm.controls["vehicles"];
        control.removeAt(index);
    }

    //

    async getBranch() {
        try {
            await this.onlService.getBranchCodeVehicle().subscribe(_ => {
                if (_ && _.success) {
                    this.lstBranch = _.data;
                } else {
                    console.log(_.data);
                }
            });
            // this.vehiclesForm.controls["vehicles"] ? this.vehiclesForm.controls["vehicles"][0].get("typeNumber").updateValueAndValidity() : '';
        } catch (err) {
            console.log(err);
        }
    }
    async getType(branchCode) {
        try {
            let temp = this.lstBranch.find(_ => _.branchCode.indexOf(branchCode) > -1);
            await this.onlService.getTypeNumberByBranch(temp ? temp.id : -1).subscribe(_ => {
                if (_ && _.success) {
                    this.lstType = _.data;
                } else {
                    console.log(_.data);
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}
export function yearStringValid(yearLimit?: number) {
    return (c: AbstractControl) => {
        let inYear = +c.value;
        let now = new Date();
        if (inYear > now.getFullYear()) {
            return { invalidYear: true };
        } else {
            if (yearLimit != null) {
                if (now.getFullYear() - inYear > yearLimit) {
                    return { invalidLimit: true };
                }
                return null;
            }
            return null;
        }
    };
}

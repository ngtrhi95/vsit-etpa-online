import { Component, OnInit, ViewChild } from "@angular/core";
import { OnlineContractService } from "../../../services/onlinecontract.service";
import { InsurancePackage, InsuranceFeeInfoByConfig } from "../../../models/contract.model";
import { VietService } from "../../../services/viet.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { OrderHelper } from "../../../services/order.helper";

@Component({
    selector: "app-motoinsurancevehicle",
    templateUrl: "./motoinsurancevehicle.component.html",
    styleUrls: ["./motoinsurancevehicle.component.css"]
})
export class MotoinsurancevehicleComponent implements OnInit {
    insurancePackages: Array<InsurancePackage> = [];
    refCode: string = "";
    grId: number = 0;
    optionPackages = new InsurancePackage();
    combinePackages = new InsurancePackage();
    paymentSupplierCode: string = '';
    groupName: string = '';

    constructor(private oh: OrderHelper, private oc: OnlineContractService, private vs: VietService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.refCode = params["referenceCode"] || null;
            this.paymentSupplierCode = params['paymentsupplier'] || null;
        });

        this.route.params.subscribe(params => {
            this.grId = +params['groupId'];
        });

        this.oh.insuranceOrder.next(null);
        this.getInsurancePackage();
        this.getInsuranceGroupById();
    }

    getInsuranceGroupById() {
        this.oc.getInsuranceProductById(this.grId).subscribe(res => {
            if (res && res.success) {
                this.groupName = res.data.name;
            }
        });
    }

    getInsurancePackage() {
        this.oc.getInsuranceProductOptionsDetail(this.grId).subscribe(res => {
            if (res && res.success) {
                this.insurancePackages = this.vs.arrayOrder(res.data.insuranceProductOptionDetails, "programCode", false);
                this.splitOptionPackages();
            }
        });
    }
    splitOptionPackages() {
        this.optionPackages = this.insurancePackages.find(s => s.isMainPackage);
        this.combinePackages = this.insurancePackages.find(s => !s.isMainPackage);
    }
    buyNow() {
        this.oh.infoProduct(this.refCode, this.router.url);
        //this.router.navigate(["product/vehicle/payment/" + this.grId]);
        const url = 'product/vehicle/pd_payment/' + this.grId;
        // if (this.paymentSupplierCode != null && this.paymentSupplierCode != '') {
        //     this.router.navigate([url, { 'paymentsupplier': this.paymentSupplierCode }]);
        // } else {
        //     this.router.navigate([url]);
        // }
        this.router.navigate([url], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href) });
    }
}

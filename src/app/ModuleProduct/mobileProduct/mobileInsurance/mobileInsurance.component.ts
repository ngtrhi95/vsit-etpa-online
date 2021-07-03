import { Component, OnInit } from "@angular/core";
import { OnlineContractService } from "../../../services/onlinecontract.service";
import { InsurancePackage, InsuranceFeeInfoByConfig } from "../../../models/contract.model";
import { VietService } from "../../../services/viet.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { OrderHelper } from "../../../services/order.helper";

@Component({
    selector: "app-mobileInsurance",
    templateUrl: "./mobileInsurance.component.html",
    styleUrls: ["./mobileInsurance.component.css"]
})
export class MobileInsuranceComponent implements OnInit {
    // TODO: nothing todo
    insurancePackages: Array<InsurancePackage> = [];
    refCode: string = "";
    grId: number = 0;
    optionPackages = new InsurancePackage();
    combinePackages = new InsurancePackage();
    paymentSupplierCode: string = '';

    constructor(private oh: OrderHelper, private oc: OnlineContractService,
        private vs: VietService, private route: ActivatedRoute, private router: Router) {}

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
        this.insurancePackages.forEach((program, index) => {
            program.insurancePackageDetails.forEach(p => {
                if (!p.isMainPackage) {
                    this.optionPackages = this.insurancePackages[index];
                } else {
                    this.combinePackages = this.insurancePackages[index];
                }
            });
        });
    }
    buyNow() {
        this.oh.infoProduct(this.refCode, this.router.url);
        // this.router.navigate(["product/tskt/payment/" + this.grId]);
        const url = 'product/mobile/payment/' + this.grId;
        this.router.navigate([url], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href) });
    }
}

import { Component, OnInit } from "@angular/core";
import { OnlineContractService } from "../../../../services/onlinecontract.service";
import { InsurancePackage, InsuranceFeeInfoByConfig } from "../../../../models/contract.model";
import { VietService } from "../../../../services/viet.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { OrderHelper } from "../../../../services/order.helper";
declare var $: any;

@Component({
    selector: "app-topupinsurance",
    templateUrl: "./topupinsurance.component.html",
    styleUrls: ["./topupinsurance.component.css"]
})
export class TopupInsuranceComponent implements OnInit {
    insurancePackages: Array<InsurancePackage> = [];
    refCode: string = "";
    grId: number = 0;
    optionPackages = new InsurancePackage();
    combinePackages = new InsurancePackage();
    paymentSupplierCode: string = "";
    groupName: string = "";

    constructor(private oh: OrderHelper, private oc: OnlineContractService, private vs: VietService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.refCode = params["referenceCode"] || null;
            this.paymentSupplierCode = params["paymentsupplier"] || null;
        });
        this.route.params.subscribe(params => {
            this.grId = +params["groupId"];
        });
        this.oh.insuranceOrder.next(null);
        this.getInsurancePackage();
        this.getInsuranceGroupById();
    }
    ngAfterViewInit(): void {
        if ($(window).width() > 768) {
            $('#col2').height($('#col1').height());
            $('#col2-img').css('margin-top', $('#col1').height()/4);
            $('#col22').height($('#col11').height());
            $('#col22-img').css('margin-top', $('#col11').height()/4);
        }
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
    buyNow(option?) {
        this.oh.infoProduct(this.refCode, this.router.url);
        const url = "product/human/topuppayment/" + this.grId + "/" + option;
        if (this.paymentSupplierCode != null && this.paymentSupplierCode != "") {
            this.router.navigate([url, { paymentsupplier: this.paymentSupplierCode }]);
        } else {
            this.router.navigate([url]);
        }
    }
}

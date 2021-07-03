import { Component, OnInit } from "@angular/core";
import * as reg from "../models/regex";
import { OnlineContractService } from "../services/onlinecontract.service";
import { InsurancePackageModel } from "../models/contract.model";
import { OrderHelper } from "../services/order.helper";
import { ActivatedRoute, Router } from "@angular/router";
import { BlockUIService } from "../services/blockUI.service";

@Component({
    selector: 'app-appProductList',
    templateUrl: './AppProductList.component.html',
    styleUrls: ['./AppProductList.component.css']
})
export class AppProductListComponent implements OnInit {
    public promotionInsurancePackages: Array<any> = [];
    paymentSupplierCode: string = '';
    refCode: string = "";

    constructor(private oh: OrderHelper, private contractService: OnlineContractService, private route: ActivatedRoute, private router: Router, private blockUI: BlockUIService) {}

    ngOnInit() {
        window.scrollTo(0, 0),
        this.route.queryParams.subscribe(params => {
            this.paymentSupplierCode = params['paymentsupplier'] || null;
            this.refCode = params["referenceCode"] || null;
        });
        this.getInsurancePackagesGroupByPartner();
    }

    getInsurancePackagesGroupByPartner() {
        this.blockUI.start('Đang tải dữ liệu');
        this.contractService.getInsuranceProductByDistributor('ONLINE_KEY', 1).subscribe(res => {
            if (res.success) {
                this.promotionInsurancePackages = res.data;
                this.genClassIconOfPackages();
                this.genLinkProduct();
            } else {
                console.log('ERROR');
            }
            this.blockUI.stop();
        });
    }

    genClassIconOfPackages() {
        this.promotionInsurancePackages.forEach(pack => {
            if (pack.categoryCode == "HGD") {
                pack.classIcon = 'icon_family';
            } else if (pack.categoryCode == "NHA") {
                pack.classIcon = 'icon_house';
            } else if (pack.categoryCode == "XMVC") {
                pack.classIcon = 'icon_vcxm';
            } else if (pack.categoryCode == "TNDS") {
                pack.classIcon = 'icon_tnds';
            } else if (pack.categoryCode == "YTP") {
                pack.classIcon = 'icon_bhyt';
            } else if (pack.categoryCode == "LOVE") {
                pack.classIcon = 'icon_love';
            } else if (pack.categoryCode == "TBDD") {
                pack.classIcon = 'icon_tbdd';
            } else {
                pack.classIcon = 'mix_icon';
            }
        });
    }
    genLinkProduct() {
        this.promotionInsurancePackages.forEach(pack => {
            if (pack.categoryCode == "HGD") {
                pack.insuranceGroupUrl = 'human/payment/' + pack.id;
            } else if (pack.categoryCode == "LOVE") {
                pack.insuranceGroupUrl = 'human/lovepayment/' + pack.id;
            } else if (pack.categoryCode == "NHA") {
                pack.insuranceGroupUrl = 'tskt/payment/' + pack.id;
            } else if (pack.categoryCode == "XMVC") {
                pack.insuranceGroupUrl = 'vehicle/pd_payment/' + pack.id;
            } else if (pack.categoryCode == "TNDS") {
                pack.insuranceGroupUrl = 'vehicle/payment/' + pack.id;
            } else if (pack.categoryCode == "TBDĐ") {
                pack.insuranceGroupUrl = 'mobile/mobilepayment/' + pack.id;
            }
        });
    }
}

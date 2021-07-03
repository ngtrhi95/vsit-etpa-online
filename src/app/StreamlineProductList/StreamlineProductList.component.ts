import { Component, OnInit } from "@angular/core";
import * as reg from "./../models/regex";
import { OnlineContractService } from "../services/onlinecontract.service";
import { InsurancePackageModel } from "../models/contract.model";
import { OrderHelper } from "../services/order.helper";
import { ActivatedRoute, Router } from "@angular/router";
import { BlockUIService } from "../services/blockUI.service";

@Component({
    selector: 'app-streamline-productList',
    templateUrl: './StreamlineProductList.component.html',
    styleUrls: ['./StreamlineProductList.component.css']
})
export class StreamlineProductListComponent implements OnInit {
    public promotionInsurancePackages: Array<InsurancePackageModel> = [];
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
        this.contractService.getInsurancePackagesGroupByPartner('ONLINE_KEY').subscribe(res => {
            if (res.success) {
                this.promotionInsurancePackages = res.data;
                console.log(this.promotionInsurancePackages);
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
            if (pack.insuranceCategoryCode == "HGD") {
                pack.classIcon = 'human_icon';
            } else if (pack.insuranceCategoryCode == "NHA") {
                pack.classIcon = 'house_icon';
            } else if (pack.insuranceCategoryCode == "XMVC") {
                pack.classIcon = 'moto_icon';
            } else if (pack.insuranceCategoryCode == "TNDS") {
                pack.classIcon = 'moto_icon';
            } else {
                pack.classIcon = 'mix_icon';
            }
        });
    }
    genLinkProduct() {
        this.promotionInsurancePackages.forEach(pack => {
            if (pack.insuranceCategoryCode == "HGD") {
                pack.insuranceGroupUrl = 'human/homeinsurance/' + pack.insuranceProductId;
            } else if (pack.insuranceCategoryCode == "NHA") {
                pack.insuranceGroupUrl = 'tskt/houseinsurance/' + pack.insuranceProductId;
            } else if (pack.insuranceCategoryCode == "XMVC") {
                pack.insuranceGroupUrl = 'vehicle/motoinsurance/' + pack.insuranceProductId;
            } else if (pack.insuranceCategoryCode == "TNDS") {
                pack.insuranceGroupUrl = 'vehicle/tnds/' + pack.insuranceProductId;
            } else if (pack.insuranceCategoryCode == "TNDS") {
                pack.insuranceGroupUrl = 'mobile/mobileinsurance/' + pack.insuranceProductId;
            }
        });
    }
}

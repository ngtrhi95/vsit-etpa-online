import { Component, OnInit } from '@angular/core';
import * as reg from './../models/regex';
import { OnlineContractService } from '../services/onlinecontract.service';
import { GeneralContractReportModel, InsuranceBussinessModel, InsuranceProgramModel,
    InsurancePackageModel, InsuranceCategoryModel, InsuranceProductModel, InsuranceProductForOnline, InsuranceProductOptionModel } from '../models/contract.model';
import { OrderHelper } from '../services/order.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { GenLinkService } from '../services/genlink.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public message = 10000000.09;
    public date = new Date();
    public maskDate = new reg.Regex().maskDate;
    public contractReportModel = new GeneralContractReportModel();
    public insuranceBusiness: Array<InsuranceBussinessModel> = [];
    public insurancePrograms: Array<InsuranceProgramModel> = [];
    public insurancePackages: Array<InsurancePackageModel> = [];
    public promotionInsurancePackages: Array<InsurancePackageModel> = [];
    public featureInsuranceProducts: Array<InsuranceProductForOnline> = [];
    public insuranceCategories: Array<InsuranceCategoryModel> = [];
    public insuranceProducts: Array<InsuranceProductModel> = [];
    public insuranceOptions: Array<InsuranceProductOptionModel> = [];
    public selectedBusinessId: number;
    public selectedProgramId: number;
    public selectedPackageId: number;
    public selectedCategoryId: number;
    public selectedProductId: number;
    public selectedProductOptionId: number;
    groupPackages: any;
    optionPackages: any;
    selectedPackage: any;
    productUrlSelected = '';
    calculator = false;
    title = 'Tính phí nhanh';
    paymentLink = '';
    refCode = '';
    distributorCode = 'ONLINE_KEY';

    constructor(private oh: OrderHelper, private contractService: OnlineContractService, private route: ActivatedRoute,
        private router: Router, private genLink: GenLinkService) {}

    ngOnInit() {
        // window.scrollTo(0, 0);
        this.route.queryParams.subscribe(params => {
            this.refCode = params['referenceCode'] || null;
        });
        this.generalContractReportModel();
        this.getInsuraceCategoriesForFastCalculate();
        this.getInsuranceProductByDistributor();
    }
    buyNow() {
        if (this.calculator) {
            // this.oh.select(this.groupPackages, this.refCode);
            this.oh.infoProduct(this.refCode, this.productUrlSelected);
            this.router.navigate([this.paymentLink]);
        }
    }

    generalContractReportModel() {
        this.contractService.getGeneralContractReportData().subscribe(res => {
            if (res.success) {
                this.contractReportModel = res.data;
            } else {
                console.log('ERROR');
            }
        });
    }

    // not use in the future
    getInsurancePackagesGroupByBusinessForFastCalculate() {
        this.contractService.getInsurancePackagesGroupByBusiness(this.distributorCode).subscribe(res => {
            if (res.success) {
                this.insuranceBusiness = res.data;
            } else {
                console.log('ERROR');
            }
        });
    }

    getInsurancePackagesGroupByPartner() {
        this.contractService.getInsurancePackagesGroupByPartner(this.distributorCode).subscribe(res => {
            if (res.success) {
                this.promotionInsurancePackages = this.genLink.genLinkForInsurancePackageArr(res.data);
            } else {
                console.log('ERROR');
            }
        });
    }

    getInsuranceProductByDistributor() {
        let onlineChanel = 1;
        this.contractService.getInsuranceProductByDistributor(this.distributorCode,onlineChanel, true).subscribe(res => {
            if (res.success) {
                this.featureInsuranceProducts = this.genLink.genLinkForInsuranceProduct(res.data);
            } else {
                console.log('ERROR');
            }
        });
    }

    public async businessChanged() {
        this.calculator = false;
        this.title = 'Tính phí nhanh';
        this.selectedProgramId = null;
        this.selectedPackageId = null;
        this.insurancePrograms = [];
        this.insurancePackages = [];
        this.contractService.getInsurancProgramBaseOnBusiness(this.distributorCode, this.selectedBusinessId).subscribe(res => {
            if (res.success) {
                this.insurancePrograms = res.data;
            } else {
                console.log('ERROR');
            }
        });
    }

    public programChanged() {
        this.contractService.GetInsurancePackagesGroupByProgram(this.distributorCode, this.selectedProgramId).subscribe(res => {
            if (res.success) {
                this.insurancePackages = this.genLink.genLinkForInsurancePackageArr(res.data);
            } else {
                console.log('ERROR');
            }
        });
    }
    // getPaymentLink() {
    //     console.log(this.selectedPackage)
    //     this.productUrlSelected = 'product/' + this.selectedPackage.insuranceGroupUrl + '/' + this.selectedPackage.insuranceGroupId;
    //     if (this.selectedPackage.insuranceGroupUrl == "human/topupinsurance") {
    //         this.paymentLink = "product/" + this.selectedPackage.insuranceGroupUrl.split("/")[0] + "/topuppayment/" + this.selectedPackage.insuranceGroupId + "/" + this.selectedPackage.insurancePackageCode;
    //     } else if (this.selectedPackage.insuranceGroupUrl == "human/homeinsurance") {
    //         this.paymentLink = "product/" + this.selectedPackage.insuranceGroupUrl.split("/")[0] + "/payment/" + this.selectedPackage.insuranceGroupId;
    //     } else if (this.selectedPackage.insuranceGroupUrl == "vehicle/tnds") {
    //         this.paymentLink = "product/" + this.selectedPackage.insuranceGroupUrl.split("/")[0] + "/payment/" + this.selectedPackage.insuranceGroupId;
    //     } else if (this.selectedPackage.insuranceGroupUrl == "vehicle/motoinsurance") {
    //         this.paymentLink = "product/" + this.selectedPackage.insuranceGroupUrl.split("/")[0] + "/payment/" + this.selectedPackage.insuranceGroupId;
    //     } else if (this.selectedPackage.insuranceGroupUrl == "tskt/houseinsurance") {
    //         this.paymentLink = "product/" + this.selectedPackage.insuranceGroupUrl.split("/")[0] + "/payment/" + this.selectedPackage.insuranceGroupId;
    //     }
    // }

    public calculatorFeeInsurance() {
        this.selectedPackage = this.insurancePackages.find(pack => pack.id == this.selectedPackageId);
        this.paymentLink = 'product/' + this.selectedPackage.paymentUrl + this.selectedPackage.insuranceGroupId;
        this.productUrlSelected = 'product/' + this.selectedPackage.insuranceGroupUrl + this.selectedPackage.insuranceGroupId;
        // this.contractService.getInsurancePackagesOnlineByGroupId(this.selectedPackage.insuranceGroupId).subscribe(res => {
        //     if (res.success) {
        //         this.calculator = true;
        //         this.title = "Mua ngay";
        //         this.groupPackages = res.data;
        //         this.groupPackages.forEach((program, index) => {
        //             program.insurancePackageDetails.forEach(p => {
        //                 if (!p.isAccompanyingPackage) {
        //                     this.optionPackages = this.groupPackages[index];
        //                 }
        //             });
        //         });
        //         this.optionPackages.insurancePackageDetails = this.genLink.genLinkForInsurancePackageArr(this.selectedPackage);
        //         this.selectedPackage = this.optionPackages.insurancePackageDetails.find(pack => pack.insurancePackageCode == this.selectedPackage.insurancePackageCode);
        //     }
        // });
    }

    getInsuraceCategoriesForFastCalculate() {
        this.contractService.getAllCategoriesForDistributor(this.distributorCode).subscribe(res => {
            if (res.success) {
                this.insuranceCategories = res.data;
            } else {
                console.log('ERROR');
            }
        });
    }


    getAllProductOfCategoryForDistributor(categoryId: number) {
        this.contractService.getAllProductOfCategoryForDistributor(categoryId, this.distributorCode).subscribe(res => {
            if (res.success) {
                this.insuranceProducts = res.data;
            } else {
                console.log('ERROR');
            }
        });
    }

    getProductOptionForProduct(productId: number) {
        this.contractService.getProductOptionForProduct(productId).subscribe(res => {
            if (res.success) {
                this.insuranceOptions = res.data;
            } else {
                console.log('ERROR');
            }
        });
    }

    public async categoryChanged() {
        this.calculator = false;
        this.title = 'Tính phí nhanh';
        this.selectedProductId = null;
        this.selectedProductOptionId = null;
        this.insurancePrograms = [];
        this.insurancePackages = [];
        this.getAllProductOfCategoryForDistributor(this.selectedCategoryId);
    }

    public productChanged() {
        this.getProductOptionForProduct(this.selectedProductId);
    }
}

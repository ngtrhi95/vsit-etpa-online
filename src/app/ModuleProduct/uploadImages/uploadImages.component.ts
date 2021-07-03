import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { PublicMiningApi } from '../../api/apiService';
import { OnlineContractService } from '../../services/onlinecontract.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmUploadInfoModel } from '../../models/contract.model';
import { BlockUIService } from '../../services/blockUI.service';

@Component({
    selector: 'app-uploadImages',
    templateUrl: './uploadImages.component.html',
    styles: ['./uploadImages.component.css']
})
export class UploadImagesComponent implements OnInit {
    certId: string = '';
    uploadUrl: string = '';
    confirmUploadInfoModel = new ConfirmUploadInfoModel();
    hasLoaded: boolean = false;
    hasUploadedSuccess: boolean = false;

    constructor(private alert: AlertService, private miningApis: PublicMiningApi,
        private contractService: OnlineContractService,
        private blockUI: BlockUIService,
        private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.certId = params['certId'];
            this.uploadUrl = this.miningApis.uploadImages + this.certId;
        });
        this.getInfoOfCerfificate();
    }

    onAllUploaded() {
        this.alert.success('Bổ sung hình ảnh thành công');
        this.hasUploadedSuccess = true;
    }

    uploadStarted() {
        this.hasUploadedSuccess = false;
    }

    getInfoOfCerfificate() {
        this.blockUI.start('Đang tải thông tin');
        this.contractService.getUploadAndConfirmInfo(this.certId).subscribe(res => {
            if (res && res.success) {
                this.confirmUploadInfoModel = res.data;
            }
            this.hasLoaded = true;
            this.blockUI.stop();
        });
    }
}

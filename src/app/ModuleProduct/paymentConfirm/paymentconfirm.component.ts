import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineContractService } from '../../services/onlinecontract.service';
import { VietService } from '../../services/viet.service';
import { AlertService } from '../../services/alert.service';
import { CustomerService } from '../../services/customer.service';
import { LocationService } from '../../services/location.service';
import { Customer, ApiResult } from '../../models/general.model';
import { Province, District, Ward, Address } from '../../models/address.model';
import { OrderContractDetail, MomoPaymentResultResponse } from '../../models/contract.model';
import { BlockUIService } from '../../services/blockUI.service';
import { OrderHelper } from '../../services/order.helper';
import { OnlineGroupType } from '../../models/enum';
import { Observable } from 'rxjs/Rx';
declare var $: any;

@Component({
    selector: 'app-payment-confirm',
    templateUrl: './paymentconfirm.component.html',
    styleUrls: ['./paymentconfirm.component.css'],
    providers: [OnlineContractService]
})
export class PaymentConfirmComponent implements OnInit {
    orderDetail = new OrderContractDetail();
    orderCode: string = '';
    paymentSuccess: boolean = false;
    loaded: boolean = false;
    errorCode?: number = null;
    refCode: string = '';
    message: string = '';
    zaloApptransId: string = '';
    momoPaymentResultResponse = new MomoPaymentResultResponse();
    currentParams: any;
    orderStatus = OrderStatus;
    paymentMethod = PaymentMethod;
    paymentStatus = PaymentStatus;
    _paymentStatus = 0;
    constructor(private route: ActivatedRoute, private blockUI: BlockUIService, private alert: AlertService,
        private router: Router, private onlineContractService: OnlineContractService) {
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.blockUI.start('Đang xử lý...');
        this.route.queryParams.subscribe(params => {
            this.currentParams = params;
            this.orderCode = params['systemOrderCode'] || 'ORDER-DEFAULT';
            this.errorCode = params['errorCode'] || null;
            this.refCode = params['refCode'] || '';
            this.message = params['message'] || '';
            this.zaloApptransId = params['apptransid'] || '';
        });

        if (this.refCode === 'ZALOPAY') {
            this.getOrderDetailByZaloCase();
        } else {
            this.getOrderDetailByCode();
        }
    }

    collectDataFromQueryForMomoResponseCase(params: any): any {
        this.momoPaymentResultResponse.ErrorCode = params['errorCode'] || null;
        this.momoPaymentResultResponse.Amount = params['amount'] || null;
        this.momoPaymentResultResponse.LocalMessage = params['localMessage'] || null;
        this.momoPaymentResultResponse.Message = params['message'] || null;
        this.momoPaymentResultResponse.OrderId = params['orderId'] || null;
        this.momoPaymentResultResponse.OrderType = params['orderType'] || null;
        this.momoPaymentResultResponse.PayType = params['payType'] || null;
        this.momoPaymentResultResponse.RequestId = params['requestId'] || null;
        this.momoPaymentResultResponse.RequestType = params['requestType'] || null;
        this.momoPaymentResultResponse.Signature = params['signature'] || null;
        this.momoPaymentResultResponse.TransId = params['transId'] || null;
        this.momoPaymentResultResponse.PartnerCode = params['partnerCode'] || null;
        this.momoPaymentResultResponse.OrderInfo = params['orderInfo'] || null;
        this.momoPaymentResultResponse.ResponseTime = params['responseTime'] || null;
        this.momoPaymentResultResponse.ExtraData = params['extraData'] || null;
        this.momoPaymentResultResponse.IsFromReturnUrl = true;
    }

    async getOrderDetailByCode() {
        try {
            this.onlineContractService.getOrderDetailByCode(this.orderCode).subscribe(result => {
                if (result.success) {
                    this.orderDetail = result.data;
                    this.orderDetail.expireDate = new Date(this.orderDetail.expireDate)
                    this.checkPaymentStatusBaseOnOrderDetail();
                    // const orderPaymentHasBeenUpdated =
                    //     this.orderDetail.paymentMethod === this.paymentMethod.OnlinePayment &&
                    //     this.orderDetail.paymentStatus !== this.paymentStatus.Pending;
                    // if (orderPaymentHasBeenUpdated) {
                    //     this.checkPaymentStatusBaseOnOrderDetail();
                    //     console.log('order Payment Has Been Updated by notifyUrl');
                    // } else {
                    //     console.log('Update payment by returnUrl');
                    //     // this.proccessUpatePaymentInfo();
                    //     this.checkPaymentStatusBaseOnReturnUrl();
                    // }
                } else {
                    console.log(result.data);
                }
                this.blockUI.stop();
            });
        } catch (error) {
            console.log(error);
            this.blockUI.stop();
        }
    }

    async getOrderDetailByZaloCase() {
        try {
            this.onlineContractService.getOrderDetailByZaloCase(this.zaloApptransId).subscribe(result => {
                if (result.success) {
                    this.orderDetail = result.data;
                    this.checkPaymentStatusBaseOnOrderDetail();
                } else {
                    console.log(result.data);
                }
                this.blockUI.stop();
            });
        } catch (error) {
            console.log(error);
            this.blockUI.stop();
        }
    }

    checkPaymentStatusBaseOnOrderDetail() {
        this.paymentSuccess = this.orderDetail.paymentStatus == this.paymentStatus.Success;
        this._paymentStatus = this.orderDetail.paymentStatus;
        this.loaded = true;
        // switch (this.refCode) {
        //     case 'MOMO':
        //         this.paymentSuccess = this.orderDetail.paymentStatus == this.paymentStatus.Success;
        //         this.loaded = true;
        //         break;
        //     case 'AIRPAY':
        //         this.paymentSuccess = this.orderDetail.paymentStatus == this.paymentStatus.Success;
        //         this.loaded = true;
        //         break;
        //     case 'ZALOPAY':
        //         this.paymentSuccess = this.orderDetail.paymentStatus == this.paymentStatus.Success;
        //         this.loaded = true;
        //         break;
        // }
    }

    checkPaymentStatusBaseOnReturnUrl() {
        console.log(this.errorCode);
        switch (this.refCode) {
            case 'MOMO':
                this.paymentSuccess = this.errorCode == 0;
                this.loaded = true;
                break;
        }
    }

    async proccessUpatePaymentInfo() {
        switch (this.refCode) {
            case 'MOMO':
                this.collectDataFromQueryForMomoResponseCase(this.currentParams);
                this.updatePaymentResultForMomo();
                break;
        }
        this.blockUI.stop();
    }

    async updatePaymentResultForMomo() {
        try {
            this.onlineContractService.UpdatePaymentResultForMomo(this.momoPaymentResultResponse).subscribe(result => {
                if (!result.success) {
                    this.alert.error('Xác nhận thanh toán thất bại. Lỗi: ' + result.data);
                }
                this.blockUI.stop();
            });
        } catch (error) {
            console.log(error);
            this.blockUI.stop();
        }
    }

    async doRepaidRequest() {
        this.blockUI.start('Đang xử lý...');

        this.onlineContractService.sendRepaidRequest(this.orderDetail.orderId).subscribe(result => {
            if (result.success) {
                window.location.href = result.data;
            } else {
                this.alert.error('Yêu cầu thất bại. Lỗi: ' + result.data);
            }
            this.blockUI.stop();
        });
    }
}

enum OrderStatus {
    New = 0,
    Processing,
    Complete,
    Canceled,
    Draft
}

enum PaymentMethod {
    COD = 0,
    AuthorizedCollection,
    OnlinePayment,
    BankTransfer,
    NotDefined
}

enum PaymentStatus {
    NotAvailable,
    Pending,
    Fail,
    Success,
    Canceled,
}

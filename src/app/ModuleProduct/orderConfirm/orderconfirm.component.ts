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
    selector: 'app-order-confirm',
    templateUrl: './orderconfirm.component.html',
    styleUrls: ['./orderconfirm.component.css'],
    providers: [OnlineContractService]
})
export class OrderConfirmComponent implements OnInit {
    orderDetail = new OrderContractDetail();
    orderCode: string = '';
    orderStatus = OrderStatus;
    paymentMethod = PaymentMethod;
    constructor(private route: ActivatedRoute, private blockUI: BlockUIService, private alert: AlertService,
        private router: Router, private onlineContractService: OnlineContractService) {
    }

    ngOnInit() {
        this.blockUI.start('Đang xử lý...');
        this.route.params.subscribe(params => {
            this.orderCode = params["orderCode"];
        });

        this.getOrderDetail();
    }

    async getOrderDetail() {
        try {
            this.onlineContractService.getOrderDetailByCode(this.orderCode).subscribe(result => {
                if (result.success) {
                    this.orderDetail = result.data;
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

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
    selector: 'app-contract-confirm',
    templateUrl: './contractconfirm.component.html',
    styleUrls: ['./contractconfirm.component.css'],
    providers: [OnlineContractService]
})
export class ContractConfirmComponent implements OnInit {
    orderDetail = new OrderContractDetail();
    orderCode: string = '';
    fromApp = false;
    nextLink = '';
    //paymentMethod = PaymentMethod;
    constructor(private route: ActivatedRoute, private blockUI: BlockUIService, private alert: AlertService,
        private router: Router, private onlineContractService: OnlineContractService) {
    }

    ngOnInit() {
        this.blockUI.start('Đang xử lý...');
        this.route.params.subscribe(params => {
            this.orderCode = params["orderCode"];
        });

        this.route.queryParams.subscribe(params => {
            this.fromApp = params["fromApp"] == "true";
            this.nextLink = this.fromApp ? '/app-product' : '/home';
        });

        this.getContractDetailByOrderCode();
    }

    async getContractDetailByOrderCode() {
        try {
            this.onlineContractService.getOrderDetailByCode(this.orderCode).subscribe(result => {
                if (result.success) {
                    result.data.expireDate = result.data.expireDate.replace('23:59:59.999', '00:00:00');
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

// enum PaymentMethod {
//     COD = 0,
//     AuthorizedCollection,
//     OnlinePayment,
//     BankTransfer,
//     NotDefined
// }

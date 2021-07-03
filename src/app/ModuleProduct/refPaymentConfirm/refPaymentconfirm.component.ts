import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUIService } from '../../services/blockUI.service';
import { Observable } from 'rxjs/Rx';
declare var $: any;

@Component({
    selector: 'app-payment-confirm',
    templateUrl: './paymentconfirm.component.html',
    styleUrls: ['./paymentconfirm.component.css']
})
export class RefPaymentConfirmComponent implements OnInit {
    refCode: string = '';
    apptransid: string = '';
    constructor(private route: ActivatedRoute, private blockUI: BlockUIService,
        private router: Router) {
    }

    ngOnInit() {
        this.blockUI.start('Đang xử lý...');
        this.route.params.subscribe(params => {
            this.refCode = params["refCode"];
        });
        this.route.queryParams.subscribe(params => {
            this.apptransid = params["apptransid"];
        });
        const url = 'product/payment-confirm';
        this.router.navigate([url], { queryParams: { refCode: this.refCode, apptransid:  this.apptransid } });
    }
}

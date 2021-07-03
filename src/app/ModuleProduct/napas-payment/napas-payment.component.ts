import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
declare var $: any;

@Component({
    selector: "app-napas-payment",
    template: `
        <div class="container">
            <div class="row" style="text-align: center; margin-top: 24px">
                <strong>{{message}}</strong>
                <p *ngIf="showLog" style="color: lightgrey">{{errMessage}}</p>
            </div>
        </div>
        <form id="merchant-form" [action]="actionUrl" method="POST">
        </form>
            <div id="napas-widget-container"></div>
    `,
    styles: []
})
export class NapasPaymentComponent implements OnInit {
    message = "Thanh toán đang được xử lý...";
    showLog = false;
    errMessage = "";
    tranactionID = "";
    actionUrl = "";
    apiGetInfoNapas = environment.paymentService + "v2/napas/payment/transaction/";
    expireTime = new Date(new Date().getTime() + 120000);

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {}
    ngAfterViewInit(): void {
        this.route.queryParams.subscribe(params => {
            this.tranactionID = params["transactionId"];
            this.fetchScriptSource()
        });
    }
    fetchScriptSource() {
        this.showLog = false;
        this.errMessage = "";
        fetch(this.apiGetInfoNapas + this.tranactionID)
            .then(result => result.json())
            .then(res => {
                if (res.code == "200") {
                    this.addFormNapas(res.data);
                } else {
                    console.log("lấy thông tin thất bại | " + res.message);
                    this.message = "Xử lý đơn hàng thất bại! Vui lòng tạo mới đơn hàng";
                    this.showLog = true;
                    this.errMessage = res.message;
                }
            })
            .catch(err => {
                if (new Date().getTime() < this.expireTime.getTime()) {
                    let count = 5;
                    let x = setInterval(_ => {
                        this.message = `Lấy thông tin thất bại. Tự động thử lại sau ${count}s`;
                        count = count - 1;
                        if (count < 0) {
                            this.fetchScriptSource();
                            clearInterval(x);
                        }
                    }, 1000);
                } else {
                    this.message = "Xử lý đơn hàng thất bại! Vui lòng tạo mới đơn hàng";
                    this.showLog = true;
                    this.errMessage = err;
                }
            });
    }

    addFormNapas(data) {
        let script = document.createElement("script");
        script["type"] = "text/javascript";
        script["id"] = "napas-widget-script";
        script.setAttribute("src", data["LinkScript"]);
        script.setAttribute("merchantId", data["MerchantId"]);
        script.setAttribute("clientIP", data["ClientIP"]);
        script.setAttribute("deviceId", data["DeviceId"]);
        script.setAttribute("environment", data["Environment"]);
        script.setAttribute("cardScheme", data["CardScheme"]);
        script.setAttribute("orderId", data["OrderId"]);
        script.setAttribute("dataKey", data["DataKey"]);
        script.setAttribute("napasKey", data["NapasKey"]);
        script.setAttribute("orderAmount", data["OrderAmount"]);
        script.setAttribute("orderCurrency", data["OrderCurrency"]);
        script.setAttribute("orderReference", data["OrderReference"]);
        script.setAttribute("channel", "6014");
        script.setAttribute("sourceOfFundsType", "CARD");
        script.setAttribute("enable3DSecure", "false");
        script.setAttribute("apiOperation", "PAY");
        setTimeout(() => {
            $("#merchant-form").append(script);
            this.actionUrl = data["ActionUrl"];
        }, 1);
    }
}

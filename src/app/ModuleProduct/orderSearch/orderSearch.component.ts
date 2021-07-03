import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnlineContractService } from "../../services/onlinecontract.service";
import { VietService } from "../../services/viet.service";
import { LocationService } from "../../services/location.service";
import { BlockUIService } from "../../services/blockUI.service";

@Component({
    selector: "app-orderSearch",
    templateUrl: "./orderSearch.component.html",
    styleUrls: ["./orderSearch.component.css"]
})
export class OrderSearchComponent implements OnInit {
    find1st = false;
    keyword: string = "";
    phoneNumber: string = "";
    orderDetail: any = {};
    mess: string = "";
    processItems = [{ icon: "ti-write", title: "Đang xử lý" }, { icon: "ti-map-alt", title: "Đang giao hàng" }, { icon: "ti-gift", title: "Đã giao hàng" }];
    activeItemInProcess = 1;
    notesDetail = {
        ORDER_CREATED: "Khởi tạo đơn hàng bảo hiểm thành công.",
        ORDER_IS_PROCESSING: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi! Vui lòng lựa chọn hình thức thanh toán, và tiến hành thanh toán; nếu không, đơn hàng của bạn sẽ bị hủy trong vòng 24 giờ kể từ lúc đặt hàng.",
        ORDER_APPROVED: "Đơn hàng bảo hiểm của quý khách đã được xác nhận.",
        CANCEL_ORDER__ORDER_CANCELED_BY_SYSTEM: "Đơn hàng đã bị hủy bởi hệ thống do quá thời gian đợi quy định.",
        PAYMENT_COMPLETED: "Thanh toán cho đơn hàng thành công!",
        PAYMENT_FAILED: "Đơn hàng bảo hiểm của quý khách đã bị hủy do thanh toán thất bại!",
        SHIPMENT_DELIVERED: "Hợp đồng bảo hiểm của Quý khách đang trên đường vận chuyển. Quý khách sẽ nhận được hợp đồng bảo hiểm dự kiến trong vòng 03 ngày làm việc (không tính Thứ 7, Chủ Nhật).",
        CONTRACT_APPROVED: "Hợp đồng bảo hiểm của quý khách đã có hiệu lực. Thông tin chi tiết về hợp đồng sẽ được gửi qua email hoặc số điện thoại mà quý khách đã cung cấp.",
        ORDER_COMPLETED: "Đơn hàng bảo hiểm đã hoàn tất. Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của PTI."
    };
    viewNotes = [];
    longAddress = "";
    constructor(private route: ActivatedRoute, private os: OnlineContractService, private vs: VietService, private ls: LocationService, private bUIs: BlockUIService, private _router: Router) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.phoneNumber = params["phone"];
            this.keyword = params["key"];
            this.findOrderDetail();
        });
    }
    async findOrderDetail() {
        try {
            this.orderDetail = {};
            this.longAddress = "";
            let haveQueryString = this.phoneNumber && this.keyword ? this.phoneNumber + "/" + this.keyword : "";
            this._router.navigate(["product/searchOrder/" + haveQueryString]);
            if (this.phoneNumber && this.keyword) {
                this.find1st = true;
                this.bUIs.start("Đang kiểm tra");
                await this.os.findOrderDetail(this.phoneNumber, this.keyword).subscribe(async findResult => {
                    if (findResult.success) {
                        if (findResult.data.found) {
                            this.orderDetail = findResult.data.data;
                            this.orderDetail.orderNotes = this.vs.arrayOrder(this.orderDetail.orderNotes, "id", false);
                            this.mapNoteDetail();
                            this.viewNotes.push(this.orderDetail.orderNotes[0]);
                            if (this.orderDetail.havingShipment) {
                                await this.ls.getAddressById(this.orderDetail.shipment.addressId).subscribe(res => {
                                    if (res.success) {
                                        this.longAddress = res.data.addressDetails + ", " + res.data.wardName + ", " + res.data.districtName + ", " + res.data.provinceName;
                                    } else {
                                        console.log(res.data);
                                    }
                                });
                            }
                            console.log(this.orderDetail);
                        } else {
                            this.mess = "Không tìm thấy đơn hàng phù hợp.";
                        }
                    }
                    this.bUIs.stop();
                });
            }
        } catch (err) {
            this.bUIs.stop();
            console.log(err);
        }
    }
    mapNoteDetail() {
        this.viewNotes = [];
        this.orderDetail.orderNotes.forEach(note => {
            note.note = note.note.replace(": ", "__");
            note.detail = this.notesDetail[note.note];
        });
        this.activeItemInProcess = 1;
        if (this.orderDetail.orderNotes.find(item => { return item.note == "SHIPPING_STARTED"; })) {
            this.activeItemInProcess = 2;
        }
        if (this.orderDetail.orderNotes.find(item => { return item.note == "SHIPMENT_DELIVERED"; })) {
            this.activeItemInProcess = 3;
        }
    }
    showMore() {
        this.viewNotes = [];
        this.viewNotes = this.orderDetail.orderNotes;
    }
    showLess() {
        this.viewNotes = [];
        this.viewNotes.push(this.orderDetail.orderNotes[0]);
    }
}

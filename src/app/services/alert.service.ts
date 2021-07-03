import { Injectable } from "@angular/core";
import swal from "sweetalert2";
import { Regex } from "../models/regex";

@Injectable()
export class AlertService {
    regex = new Regex();
    constructor() {}
    success(text: string): Promise<any> {
        return swal({
            title: "Thành công.",
            text: text,
            type: "success",
            showCancelButton: false,
            allowOutsideClick: false
        }).then(() => true);
    }
    error(text: string): Promise<any> {
        return swal({
            title: "Lỗi.",
            text: text,
            type: "error",
            showCancelButton: false,
            allowOutsideClick: false
        }).then(() => true);
    }
    warning(text: string): Promise<any> {
        return swal({
            title: "Thông báo.",
            text: text,
            type: "warning",
            showCancelButton: false,
            allowOutsideClick: false
        }).then(() => true);
    }
    infor(text: string): Promise<any> {
        return swal({
            title: "Thông tin.",
            text: text,
            type: "info",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonText: "Đồng ý"
        }).then(() => true);
    }
    confirm(text: string): Promise<any> {
        return swal({
            title: "Xác nhận.",
            text: text,
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            allowOutsideClick: false
        }).then(result => {
            if (result.dismiss === swal.DismissReason.cancel || result.dismiss === swal.DismissReason.esc) {
                return false;
            }
            return result.value;
        });
    }
    redirectSuccess(text: string): Promise<any> {
        return swal({
            title: "Thành công",
            text: text,
            type: "success",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Không",
            allowOutsideClick: false
        }).then(result => {
            if (result.dismiss === swal.DismissReason.cancel || result.dismiss === swal.DismissReason.esc) {
                return false;
            }
            return result.value;
        });
    }
    redirectWarning(text: string): Promise<any> {
        return swal({
            title: "Thông báo",
            text: text,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Không",
            allowOutsideClick: false
        }).then(result => {
            if (result.dismiss === swal.DismissReason.cancel || result.dismiss === swal.DismissReason.esc) {
                return false;
            }
            return result.value;
        });
    }

    createContractSuccessPopUp(text: string): Promise<any> {
        return swal({
            title: "Tạo hợp đồng thành công",
            text: text,
            type: "success",
            showCancelButton: true,
            confirmButtonText: "Nhập mới",
            cancelButtonText: "Chi tiết",
            allowOutsideClick: false
        }).then(result => {
            if (result.dismiss === swal.DismissReason.cancel || result.dismiss === swal.DismissReason.esc) {
                return false;
            }
            return result.value;
        });
    }

    redirectToLoginWarning(text: string): Promise<any> {
        return swal({
            title: "Thông báo",
            text: text,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",
            allowOutsideClick: false
        }).then(result => {
            if (result.dismiss === swal.DismissReason.cancel || result.dismiss === swal.DismissReason.esc) {
                return false;
            }
            return result.value;
        });
    }

    inputCertificateNumber(text: string): Promise<any> {
        return swal({
            title: text,
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            showLoaderOnConfirm: true,
            preConfirm: certificate => {
                if (certificate.length == 0 || certificate == null || !this.regex.civilLiabilityCertificationRegex.test(certificate.toUpperCase())) {
                    swal.showValidationError("Số ấn chỉ không hợp lệ!");
                }
            },
            allowOutsideClick: () => !swal.isLoading()
        }).then(result => {
            if (result.dismiss === swal.DismissReason.cancel || result.dismiss === swal.DismissReason.esc) {
                return "";
            }
            return result.value;
        });
    }
    confirm_Paypost(): Promise<any> {
        return swal({
            title: "Xác nhận.",
            text: "Xác nhận đã thu phí bảo hiểm",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Không mua",
            allowOutsideClick: false,
            reverseButtons: true
        }).then(result => {
            if (result.dismiss === swal.DismissReason.cancel || result.dismiss === swal.DismissReason.esc) {
                return false;
            }
            return result.value;
        });
    }
}

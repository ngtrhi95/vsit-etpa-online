import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class OrderHelper {
    package: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    insuranceOrder: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    infoOfProduct: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    currentPackage = this.package.asObservable();
    order = this.insuranceOrder.asObservable();

    select(value, prev_prod_link?, code?) {
        this.package.next({package: value, prev_link: prev_prod_link, refCode: code || null});
    }
    insuranceDetailOrder(type, base_contract, customer_info, address_info?, files?, partner_info?) {
        this.insuranceOrder.next({type: type, base_contract: base_contract, customer_info: customer_info, address_info: address_info || null, files: files || null, partner_info: partner_info || null});
    }
    infoProduct(refCode?, prev_prod_link?, cms_info = null) {
        this.infoOfProduct.next({refCode: refCode, prev_link: prev_prod_link, cms_info: cms_info})
    }
}

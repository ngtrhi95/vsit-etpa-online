import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../ShareComponent/sharecomponent.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PaymentformComponent } from "./paymentMethod/paymentform.component";
import { PaymentConfirmComponent } from "./paymentConfirm/paymentconfirm.component";
import { OrderConfirmComponent } from "./orderConfirm/orderconfirm.component";
import { ContractConfirmComponent } from "./contractConfirm/contractconfirm.component";
import { UploadImagesComponent } from "./uploadImages/uploadImages.component";
import { OrderSearchComponent } from "./orderSearch/orderSearch.component";
import { RefPaymentConfirmComponent } from "./refPaymentConfirm/refPaymentconfirm.component";
import { ContractSearchComponent } from "./contractSearch/contractsearch.component";
import { SearchclaimComponent } from "./searchclaim/searchclaim.component";
import { NapasPaymentComponent } from './napas-payment/napas-payment.component';
import { CarProductComponent } from './car-product/car-product.component';
import { CarDetailComponent } from './car-detail/car-detail.component';

@Component({
    template: `
        <h3>i'm product</h3>
    `
})
export class ProductComponent {}

const prodRoutes: Routes = [
    { path: "", component: ProductComponent, pathMatch: "full" },
    { path: "checkoutpayment", component: PaymentformComponent },
    { path: "upload/:certId", component: UploadImagesComponent },
    { path: "vehicle", loadChildren: "./vehicleProduct/vehicle.product.module#ProductVehicleModule" },
    { path: "human", loadChildren: "./humanProduct/human.product.module#HumanModule" },
    { path: "mobile", loadChildren: "./mobileProduct/mobile.product.module#MobileModule" },
    { path: "tskt", loadChildren: "./tsktProduct/tskt.product.module#TSKTModule" },
    { path: "payment-confirm", component: PaymentConfirmComponent },
    { path: "searchOrder", component: OrderSearchComponent },
    { path: "searchOrder/:phone/:key", component: OrderSearchComponent },
    { path: "order-confirm/:orderCode", component: OrderConfirmComponent },
    { path: "contract-confirm/:orderCode", component: ContractConfirmComponent },
    { path: "payment-confirm/:refCode", component: RefPaymentConfirmComponent },
    { path: "searchContract", component: ContractSearchComponent },
    { path: "searchContract/:code", component: ContractSearchComponent },
    { path: "searchContract/:acbh/:phone", component: ContractSearchComponent },
    { path: "checkout/napas_hosted_page", component: NapasPaymentComponent },
    { path: "searchClaim", component: SearchclaimComponent },
    { path: "car_insurance", component: CarProductComponent }
];
@NgModule({
    declarations: [
        ProductComponent,
        PaymentformComponent,
        PaymentConfirmComponent,
        OrderConfirmComponent,
        ContractConfirmComponent,
        UploadImagesComponent,
        OrderSearchComponent,
        RefPaymentConfirmComponent,
        ContractSearchComponent,
        SearchclaimComponent,
        NapasPaymentComponent,
        CarProductComponent,
        CarDetailComponent
    ],
    imports: [
        RouterModule.forChild(prodRoutes),
        //
        CommonModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class ProductModule {}

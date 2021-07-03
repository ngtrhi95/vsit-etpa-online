import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../ShareComponent/sharecomponent.module";
import { MobileInsuranceComponent } from "./mobileInsurance/mobileInsurance.component";
import { MobilePaymentComponent } from './mobilePayment/mobilePayment.component';
import { ImageUploadMobileComponent } from "./mobilePayment/imageUploader/image-uploader.component";

@Component({
    template: `<h3>i'm mobile product</h3>`
})
export class MobileComponent {}

const prodRoutes: Routes = [
    { path: "", component: MobileComponent, pathMatch: "full" },
    { path: "payment/:groupId", component: MobilePaymentComponent },
    { path: "mobileinsurance/:groupId", component: MobileInsuranceComponent }];
@NgModule({
    declarations: [MobileComponent, MobileInsuranceComponent, MobilePaymentComponent, ImageUploadMobileComponent],
    imports: [
        RouterModule.forChild(prodRoutes),
        //
        CommonModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class MobileModule {}

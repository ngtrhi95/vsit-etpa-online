import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../ShareComponent/sharecomponent.module";
import { HouseInsuranceComponent } from "./houseinsurance/houseinsurance.component";
import { TSKTPaymentComponent } from "./tsktPayment/tsktPayment.component";

@Component({
    template: `<h3>i'm  TSKT product</h3>`
})

export class TSKTComponent {}

const prodRoutes: Routes = [{ path: "", component: TSKTComponent, pathMatch: "full" }, { path: "payment/:groupId", component: TSKTPaymentComponent }, { path: "houseinsurance/:groupId", component: HouseInsuranceComponent }];
@NgModule({
    declarations: [TSKTComponent, TSKTPaymentComponent, HouseInsuranceComponent],
    imports: [
        RouterModule.forChild(prodRoutes),
        //
        CommonModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class TSKTModule {}

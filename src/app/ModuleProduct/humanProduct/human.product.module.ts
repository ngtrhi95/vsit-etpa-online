import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../ShareComponent/sharecomponent.module";
import { HumanPaymentComponent } from "./homeProduct/humanPayment/humanPayment.component";
import { HomeInsuranceComponent } from "./homeProduct/homeInsurance/homeinsurance.component";
import { TopupPaymentComponent } from "./topupProduct/topupPayment/topupPayment.component";
import { TopupInsuranceComponent } from "./topupProduct/topupInsurance/topupinsurance.component";
import { LoveInsuranceComponent } from "./loveInsuProduct/loveInsurance/loveInsurance.component";
import { LovePaymentComponent } from "./loveInsuProduct/loveInsuPayment/loveInsuPayment.component";

@Component({
    template: `<h3>i'm  human product</h3>`
})
export class HumanComponent {}

const prodRoutes: Routes = [
    { path: "", component: HumanComponent, pathMatch: "full" },
    { path: "payment/:groupId", component: HumanPaymentComponent },
    { path: "homeinsurance/:groupId", component: HomeInsuranceComponent },
    { path: "topuppayment/:groupId/:option", component: TopupPaymentComponent },
    { path: "topupinsurance/:groupId", component: TopupInsuranceComponent },
    { path: "lovepayment/:groupId/:option", component: LovePaymentComponent },
    { path: "loveinsurance/:groupId", component: LoveInsuranceComponent }
];
@NgModule({
    declarations: [HumanComponent, HumanPaymentComponent, HomeInsuranceComponent, TopupPaymentComponent, TopupInsuranceComponent, LoveInsuranceComponent, LovePaymentComponent],
    imports: [
        RouterModule.forChild(prodRoutes),
        //
        CommonModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class HumanModule {}

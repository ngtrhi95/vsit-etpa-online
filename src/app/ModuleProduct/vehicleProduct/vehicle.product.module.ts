import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CivilliabilityvehicleComponent } from "./civilliabilityvehicle/civilliabilityvehicle.component";
import { MotoinsurancevehicleComponent } from "./motoinsurancevehicle/motoinsurancevehicle.component";
import { VehiclePaymentComponent } from "./vehiclePayment/vehiclePayment.component";
import { SharedModule } from "../../ShareComponent/sharecomponent.module";
import { VehiclePDPaymentComponent } from "./vehiclePDPayment/vehiclePayment.component";

@Component({
    template: `<h3>i'm  vehicle product</h3>`
})
export class ProductVehicleComponent {}

const prodRoutes: Routes = [{ path: "", component: ProductVehicleComponent, pathMatch: "full" }, { path: "tnds/:groupId", component: CivilliabilityvehicleComponent }, { path: "motoinsurance/:groupId", component: MotoinsurancevehicleComponent }, { path: "payment/:groupId", component: VehiclePaymentComponent }, { path: "pd_payment/:groupId", component: VehiclePDPaymentComponent }];
@NgModule({
    declarations: [ProductVehicleComponent, CivilliabilityvehicleComponent, MotoinsurancevehicleComponent, VehiclePaymentComponent, VehiclePDPaymentComponent],
    imports: [
        RouterModule.forChild(prodRoutes),
        //
        CommonModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class ProductVehicleModule {}

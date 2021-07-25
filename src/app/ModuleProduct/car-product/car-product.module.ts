import { SharedModule } from "./../../ShareComponent/sharecomponent.module";
import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CarInsuranceComponent } from "./car-insurance/car-insurance.component";
import { CarPaymentComponent } from "./car-payment/car-payment.component";
import { CarIntroduceComponent } from './car-introduce/car-introduce.component';
import { ImageService } from "../../services/image.service";

@Component({
  template: `<h3>i'm car product</h3>`,
})
export class ProductCarComponent {}

const prodRoutes: Routes = [
  { path: "", component: ProductCarComponent, pathMatch: "full" },
  { path: "about/:groupId", component: CarIntroduceComponent },
  { path: "tnds/:groupId", component: CarInsuranceComponent },
  { path: "payment/:groupId", component: CarPaymentComponent },
];

@NgModule({
  declarations: [
    ProductCarComponent,
    CarInsuranceComponent,
    CarPaymentComponent,
    CarIntroduceComponent,
    
  ],
  imports: [
    RouterModule.forChild(prodRoutes),
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [ImageService],
})
export class CarProductModule {}

import { NgModule, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../ShareComponent/sharecomponent.module";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-identity",
    template: `
        <h3>i'm identity</h3>
    `
})
export class IdentityComponent {}

@NgModule({
    declarations: [IdentityComponent, LoginComponent],
    imports: [RouterModule.forChild([{ path: "", component: IdentityComponent, pathMatch: "full" }, { path: "login", component: LoginComponent }]), CommonModule, SharedModule, ReactiveFormsModule]
})
export class IdentityModule {}

import { NgModule, Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-profile",
    template: `<h3>i'm profile</h3>`
})
export class ProfileComponent {}

@NgModule({
    declarations: [ProfileComponent],
    imports: [RouterModule.forChild([{ path: "", component: ProfileComponent, pathMatch: "full" }])]
})
export class ProfileModule {}

import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewsComponent } from "./news/news.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../ShareComponent/sharecomponent.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PolicyHumanInsuranceComponent } from "./policyHumanInsurance/policyHumanInsurance.component";
import { PolicyVehicleInsuranceComponent } from "./policyVehicleInsurance/policyVehicleInsurance.component";
import { PolicyBuildingInsuranceComponent } from "./policyBuildingInsurance/policyBuildingInsurance.component";
import { PolicyTNDSInsuranceComponent } from "./policyTNDSInsurance/policyTNDSInsurance.component";
import { PolicyNNTXInsuranceComponent } from "./policyNNTXInsurance/policyNNTXInsurance.component";
import { PoliciesComponent } from "./policies/policies.component";
import { PrivacyPolicyComponent } from "./privacyPolicy/privacyPolicy.component";
import { TermsOfUseComponent } from "./termsOfUse/termsOfUse.component";
import { AboutusComponent } from "./aboutus/aboutus.component";

@Component({
    selector: "app-article",
    template: `<h3>i'm article</h3>`
})
export class ArticleComponent {}
const articleRoute: Routes = [
    { path: "", component: ArticleComponent, pathMatch: "full" },
    { path: "news", component: NewsComponent },
    { path: "human-policy", component: PolicyHumanInsuranceComponent },
    { path: "vehicle-policy", component: PolicyVehicleInsuranceComponent },
    { path: "building-policy", component: PolicyBuildingInsuranceComponent },
    { path: "tnds-policy", component: PolicyTNDSInsuranceComponent },
    { path: "nntx-policy", component: PolicyNNTXInsuranceComponent },
    { path: "policies", component: PoliciesComponent },
    { path: "privacy-policy", component: PrivacyPolicyComponent },
    { path: "terms-of-use", component: TermsOfUseComponent },
    { path: "about-us", component: AboutusComponent },
];
@NgModule({
    declarations: [TermsOfUseComponent, PrivacyPolicyComponent, PoliciesComponent, ArticleComponent, NewsComponent, PolicyHumanInsuranceComponent, PolicyVehicleInsuranceComponent, PolicyBuildingInsuranceComponent, PolicyTNDSInsuranceComponent, PolicyNNTXInsuranceComponent,AboutusComponent],
    imports: [
        RouterModule.forChild(articleRoute),
        //
        CommonModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class ArticleModule {}

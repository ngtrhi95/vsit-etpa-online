import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { RouterModule, PreloadAllModules, Router, Routes, NavigationError } from "@angular/router";
import { SnotifyModule, ToastDefaults, SnotifyService } from "ng-snotify";
import { NotifyService } from "./services/noti.service";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { TransferHttpCacheModule } from "@nguniversal/common";
import { SharedModule } from "./ShareComponent/sharecomponent.module";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { NavmenuComponent } from "./shared/navmenu/navmenu.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { UtilsService } from "./services/utils.service";
import { HttpService } from "./services/http.service";
import { LocationService } from "./services/location.service";
import { VietService } from "./services/viet.service";
import * as Apis from "./api/apiService";
import * as CMSApis from "./api/apiCMSService";
import { OnlineContractService } from "./services/onlinecontract.service";
import { CMSService } from "./services/cms.service";
import { CustomerService } from "./services/customer.service";
import { AlertService } from "./services/alert.service";
import { BlockUIService } from "./services/blockUI.service";
import { OrderHelper } from "./services/order.helper";
import { StreamlineProductListComponent } from "./StreamlineProductList/StreamlineProductList.component";
import { ErrorsModule } from "./ModuleError/error.module";
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CheckService } from './services/check.service';
import { MetaTagService } from './services/metaTag.service';
import { GenLinkService } from './services/genlink.service';
import { AuthenticationService } from './services/authentication.service';
import { AppProductListComponent } from "./AppProductList/AppProductList.component";
import { LoginMobileComponent } from "./LoginMobile/loginmobile.component";
import { MobileContractService } from "./ModuleProduct/mobileProduct/mobileinsurance.service";
import {ShortLinkComponent} from './ShortLink/shortLink.component'

@NgModule({
    declarations: [AppComponent, HomeComponent, NavmenuComponent, FooterComponent, StreamlineProductListComponent, AppProductListComponent,LoginMobileComponent,ShortLinkComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: "my-app" }),
        RouterModule.forRoot(
            [
                { path: "home", component: HomeComponent, data: { preload: true } },
                { path: "https:", redirectTo: "home", pathMatch: "full" },
                { path: "", redirectTo: "home", pathMatch: "full" },
                { path: "article", loadChildren: "./ModuleArticle/article.module#ArticleModule" },
                { path: "product", loadChildren: "./ModuleProduct/product.module#ProductModule", data: { preload: true } },
                { path: "streamline-productList", component: StreamlineProductListComponent },
                { path: "app-product", component: AppProductListComponent },
                { path: "id", loadChildren: "./ModuleIdentity/identity.module#IdentityModule" },
                { path: "profile", loadChildren: "./ModuleProfile/profile.module#ProfileModule" },
                { path: "error", loadChildren: "./ModuleError/error.module#ErrorsModule" },
                { path: "loginmobile/:username/:password", component: LoginMobileComponent },
                { path: "l/:code", component: ShortLinkComponent }
            ]
            , { preloadingStrategy: PreloadAllModules }
            // { enableTracing: true }
        ),
        DeviceDetectorModule.forRoot(),
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpModule,
        CommonModule,
        NoopAnimationsModule,
        SnotifyModule,
        SharedModule,
        ErrorsModule
    ],
    providers: [
        { provide: "SnotifyToastConfig", useValue: ToastDefaults },
        SnotifyService,
        NotifyService,
        CustomerService,
        UtilsService,
        HttpService,
        LocationService,
        OnlineContractService,
        CMSService,
        MobileContractService,
        VietService,
        AlertService,
        BlockUIService,
        OrderHelper,
        CheckService,
        MetaTagService,
        GenLinkService,
        Apis.LocationApi,
        Apis.CustomerApi,
        Apis.MomoPaymentApi,
        Apis.ZalopayPaymentApi,
        Apis.OrderApi,
        Apis.PublicMiningApi,
        Apis.SmsEmailApi,
        Apis.AirpayPaymentApi,
        Apis.SecurityApi,
        AuthenticationService,
        Apis.PayooPaymentApi,
        Apis.MobileInsuranceApi,
        Apis.AppayPaymentApi,
        Apis.LookupContractApi,
        Apis.CertificateApi,
        Apis.ExportContractFile,
        Apis.LookUpClaimApi,
        CMSApis.PublicCMSApi,

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private router: Router) {
        this.router.events.subscribe(err => {
            try {
                if (err instanceof NavigationError) {
                    this.router.errorHandler = (error: any) => {
                        console.log(error);
                        this.router.navigate(["/error"], { queryParams: { error: "404", path: err.url } }); // or redirect to default route
                    };
                }
            } catch (er) {
                console.log(er);
            }
        });
    }
}

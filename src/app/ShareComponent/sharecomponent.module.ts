import { NgModule } from "@angular/core";
import { LinkDirective } from "../directives/link.directive";
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from "ng-pick-datetime";
import { TextMaskModule } from "angular2-text-mask";
import { MaskDateDirective } from "../directives/maskDate.directive";
import { DecimalMask } from "../directives/decimal-mask.directive";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatterDirective } from "../directives/currency-formatter.directive";
import { AmountConverterPipe } from "../directives/amountConverterPipe";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FooterComponent } from "../shared/footer/footer.component";
import { NavmenuComponent } from "../shared/navmenu/navmenu.component";
import { CustomerinfoComponent } from "./customerinfo/customerinfo.component";
import { HttpModule } from "@angular/http";
import { Select2Component } from "./select2ng2/select2ng2.component";
import { VehiclesinfoComponent } from "./vehiclesinfo/vehiclesinfo.component";
import { OverlayComponent } from "./overlay/overlay.component";
import { AddressInfoComponent } from "./addressinfo/addressinfo.component";
import { FileDropDirective } from "../directives/file-drop.directive";
import { ImageUploadComponent } from "./imageUploader/image-uploader.component";
import { ProcessStepComponent } from "./processStep/processStep.component";
import { OnlyNomalCharacterDirective } from "../directives/onlynomalcharacter.directive";
import { OnlyNumberDirective } from '../directives/onlynumber.directive';

export const MY_MOMENT_FORMATS = {
    parseInput: "DD/MM/YYYY",
    fullPickerInput: "DD/MM/YYYY",
    datePickerInput: "DD/MM/YYYY",
    timePickerInput: "HH:mm:ss",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
};

@NgModule({
    declarations: [
        Select2Component,
        ImageUploadComponent,
        AddressInfoComponent,
        LinkDirective,
        MaskDateDirective,
        FileDropDirective,
        DecimalMask,
        CurrencyFormatterDirective,
        AmountConverterPipe,
        CustomerinfoComponent,
        VehiclesinfoComponent,
        OverlayComponent,
        ProcessStepComponent,
        OnlyNomalCharacterDirective,
        OnlyNumberDirective,
    ],
    exports: [
        Select2Component,
        AddressInfoComponent,
        ImageUploadComponent,
        OverlayComponent,
        LinkDirective,
        MaskDateDirective,
        FileDropDirective,
        CurrencyFormatterDirective,
        AmountConverterPipe,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        TextMaskModule,
        DecimalMask,
        CommonModule,
        FormsModule,
        CustomerinfoComponent,
        VehiclesinfoComponent,
        ProcessStepComponent,
        OnlyNomalCharacterDirective,
        OnlyNumberDirective,
    ],
    imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpModule, FormsModule, OwlDateTimeModule, OwlNativeDateTimeModule, TextMaskModule],
    providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }, AmountConverterPipe]
})
export class SharedModule {}

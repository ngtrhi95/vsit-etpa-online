import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";

import { ErrorsHandler } from "./error-handler";
import { ServerErrorsInterceptor } from "./server-errors.interceptor";

import { ErrorsComponent } from "./errors-component/errors.component";
const routes: Routes = [{ path: "error", component: ErrorsComponent},{ path: '404', component: ErrorsComponent, data: { error: 404 } },];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, RouterModule],
    declarations: [ErrorsComponent],
    providers: [
        {
            provide: ErrorHandler,
            useClass: ErrorsHandler
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ServerErrorsInterceptor,
            multi: true
        }
    ]
})
export class ErrorsModule {}

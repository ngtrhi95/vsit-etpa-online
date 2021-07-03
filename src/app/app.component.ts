import { Component } from "@angular/core";
import { environment } from "../environments/environment";
import { Meta } from "@angular/platform-browser";
import { NavigationEnd, ActivatedRoute, Router } from "@angular/router";
import { BlockUIService } from "./services/blockUI.service";

@Component({
    moduleId: module.id,
    selector: "app-root",
    templateUrl: "./app.component.html",
    styles: []
})
export class AppComponent {
    environmentName = environment.envName;
    openFromApp = false;
    constructor(private meta: Meta, private route: ActivatedRoute, private router: Router, private blockUI: BlockUIService) {
        console.log("app using " + this.environmentName + " environment");
        this.meta.addTag({ charset: "utf-8" });
        this.meta.addTag({ httpEquiv: "X-UA-Compatible", content: "IE=edge" });
        this.meta.addTag({ httpEquiv: "Content-Language", content: "vi" });
        this.meta.addTag({ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" });
        this.meta.addTag({
            name: "description",
            content:
                "Là công ty Bảo hiểm hoạt động hơn 20 năm trong ngành, Bảo hiểm Bưu điện Sài Gòn cam kết cung cấp dịch vụ bảo hiểm và bồi thường tốt nhất. Mang đến sự bình an và thịnh vượng cho khách hàng"
        });
        this.meta.addTag({
            name: "keywords",
            content:
                "PTI Sài Gòn, PTI Sai Gon, pti sai gon, bảo hiểm, Bảo hiểm, bao hiem, Bảo hiểm Bưu điện, bao hiem buu dien, Bảo hiểm Xe máy, bao hiem xe may, Bảo hiểm tai nạn, bao hiem tai nan, bảo hiểm con người, bao hiem con nguoi, bảo hiểm tài sản, bao hiem tai san, bảo hiểm hàng hải, bao hiem hang hai, bảo hiểm xe ô tô, bao hiem xe oto, bao hiem xe o to, bảo hiểm hàng hải, bao hiem hang hai, bảo hiểm tài sản, bao hiem tai san, bảo hiểm tài sản kỹ thuật, bao hiem tai san ky thuat, bảo hiểm trách nhiệm dân sự, bao hiem trach nhiem dan su, bao hiem tnds, bảo hiểm xe máy bắt buộc, bao hiem xe may bat buoc, bảo hiểm nhà ở, bao hiem nha o, bảo hiểm điện thoại, bao hiem dien thoai, bảo hiểm bưu điện sài gòn, bao hiem buu dien sai gon"
        });
    }
    ngAfterViewInit(): void {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.route.queryParams.subscribe(params => {
                    this.openFromApp = params["fromApp"] == "true";
                });
                this.blockUI.stop();
            }
        });
    }
}

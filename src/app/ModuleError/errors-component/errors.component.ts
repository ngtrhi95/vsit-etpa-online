import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "app-error",
    templateUrl: "./errors.component.html"
})
export class ErrorsComponent implements OnInit {
    routeParams;
    errCode;
    errPath;

    constructor(private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.errCode = params["error"] || null;
            this.errPath = params["path"] || null;
        });
    }

    ngOnInit() {
        this.routeParams = this.activatedRoute.snapshot.queryParams;
    }
}

import { Component, OnInit } from "@angular/core";
import { BlockUIService } from "../../services/blockUI.service";

@Component({
    selector: "app-overlay",
    templateUrl: "./overlay.component.html",
    styleUrls: ["./overlay.component.css"]
})
export class OverlayComponent implements OnInit {
    message = "Đang tải";
    show = false;
    constructor(private blockUI: BlockUIService) {
        this.blockUI.invokeEvent.subscribe(value => {
            if (value) {
                value.status ? this.startOverlay(value.message) : this.stopOverlay();
            }
        });
    }

    ngOnInit() {}
    startOverlay(message?: string) {
        this.message = message;
        this.show = true;
    }
    stopOverlay() {
        this.message = "Đang tải";
        this.show = false;
    }
}

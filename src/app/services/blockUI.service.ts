import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class BlockUIService {
    invokeEvent: Subject<any> = new Subject();

    start(value) {
        this.invokeEvent.next({ status: true, message: value });
    }
    stop() {
        this.invokeEvent.next({ status: false, message: '' });
    }
}

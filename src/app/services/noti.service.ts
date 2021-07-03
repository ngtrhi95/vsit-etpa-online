import { Injectable } from "@angular/core";
import { SnotifyService, SnotifyPosition, SnotifyToastConfig } from "ng-snotify";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotifyService {
    private style = 'material';
    private timeout = 5000;
    private position: SnotifyPosition = SnotifyPosition.rightBottom;
    private progressBar = false;
    private closeClick = false;
    private newTop = false;
    private backdrop = -1;
    private dockMax = 8;
    private blockMax = 6;
    private pauseHover = true;
    private titleMaxLength = 15;
    private bodyMaxLength = 80;
    private icon = '';

    constructor(private snotifyService: SnotifyService) { }

    /*
    Change global configuration
     */
    getConfig(): SnotifyToastConfig {
        this.snotifyService.setDefaults({
            global: {
                newOnTop: this.newTop,
                maxAtPosition: this.blockMax,
                maxOnScreen: this.dockMax,
            }
        });
        return {
            bodyMaxLength: this.bodyMaxLength,
            titleMaxLength: this.titleMaxLength,
            backdrop: this.backdrop,
            position: this.position,
            timeout: this.timeout,
            showProgressBar: this.progressBar,
            closeOnClick: this.closeClick,
            pauseOnHover: this.pauseHover,
            icon: this.icon,
        };
    }

    success(notifyString: string) {
        this.icon = '../../assets/images/notify/success.png';
        this.snotifyService.success(notifyString, '', this.getConfig());
    }
    info(notifyString: string) {
        this.icon = '../../assets/images/notify/info.png';
        this.snotifyService.info(notifyString, '', this.getConfig());
    }
    error(notifyString: string) {
        this.icon = '../../assets/images/notify/error.png';
        this.snotifyService.error(notifyString, '', this.getConfig());
    }
    warning(notifyString: string) {
        this.icon = '../../assets/images/notify/warning.png';
        this.snotifyService.warning(notifyString, '', this.getConfig());
    }
}
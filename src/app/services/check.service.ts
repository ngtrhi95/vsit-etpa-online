import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";
import { ApiResult } from "../models/general.model";

@Injectable()
export class CheckService {
    env = environment;
    contractServiceOnline: boolean = false;

    constructor(private httpService: HttpService) {
        this.serviceContractIsOnline();
    }
    serviceContractIsOnline() {
        this.httpService.get(this.env.contractService).subscribe((res: ApiResult) => {
            if (!res.success) console.log(res.data);
            this.contractServiceOnline = res.success;
            console.log(res)
        });
    }
}

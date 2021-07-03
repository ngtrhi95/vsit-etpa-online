import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { HttpService } from "../../services/http.service";
import { ApiResult } from "../../models/general.model";
import { PublicMiningApi, MobileInsuranceApi } from '../../api/apiService';

@Injectable()
export class MobileContractService {
    constructor(private http: HttpService, private miningApi: PublicMiningApi, private mobileInsuranceApi: MobileInsuranceApi) {}

    calInsuranceCost(model): Observable<ApiResult> {
        return this.http.post(this.mobileInsuranceApi.calInsuranceCost, model);
    }
    getAllActivatedProducers(): Observable<ApiResult> {
        return this.http.get(this.mobileInsuranceApi.getAllActivatedProducers);
    }
    getCostRate(model): Observable<ApiResult> {
        return this.http.get(this.mobileInsuranceApi.getCostRate + model.DeviceCategoryType + "/" + model.MobileDeviceContractType);
    }

}

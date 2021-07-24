import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/Rx";
import { ApiResult } from '../models/general.model';
import { PublicCarInsuranceApi } from "../api/api-car-insurance-service";

@Injectable()
export class CarInsuranceService {
  constructor(private http: HttpService, private miningApi: PublicCarInsuranceApi) { }

  getSiteContents(siteCode: string): Observable<ApiResult> {
    return this.http.get(this.miningApi.getSiteContentsBySite + siteCode);
  }

  getMasterData(): Observable<ApiResult> {
    return this.http.get(this.miningApi.getMasterData);
  }

  getMainCost(usingPurposeId: string, feeConfigId: string, unitQuatity: number = 0) {
    return this.http.get(this.miningApi.getMainCost + "?usingPurposeId=" + usingPurposeId + "&feeConfigId=" + feeConfigId + "&unitQuatity=" + unitQuatity);
  }

  getPassengerCost(passengerFeeConfigId: string, numberPeople: number) {
    return this.http.get(this.miningApi.getPassengerCost + "?passengerFeeConfigId=" + passengerFeeConfigId + "&numberPeople=" + numberPeople);
  }

  getGoodsCost(goodsRateId: string, goodsInsAmount: number, unitQuatity: number) {
    return this.http.get(this.miningApi.getGoodsCost + "?goodsRateId=" + goodsRateId + "&goodsInsAmount=" + goodsInsAmount + "&unitQuatity=" + unitQuatity);
  }
}

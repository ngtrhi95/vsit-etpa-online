import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/Rx";
import { ApiResult } from '../models/general.model';
import { PublicCarInsuranceApi } from "../api/api-car-insurance-service";
import { CalcFeeDto, CarInsuranceOrder} from "../models/car-insurance.model";

@Injectable()
export class CarInsuranceService {
  constructor(private http: HttpService, private miningApi: PublicCarInsuranceApi) { }

  getSiteContents(siteCode: string): Observable<ApiResult> {
    return this.http.get(this.miningApi.getSiteContentsBySite + siteCode);
  }

  getMasterData(): Observable<ApiResult> {
    return this.http.get(this.miningApi.getMasterData);
  }

  getMainCost(calcFeeDto: CalcFeeDto ) {
    var url = (Object.keys(calcFeeDto)).reduce((query, key) => {
      query = calcFeeDto[key]
        ? `${query}${query && '&'}${key}=${encodeURIComponent(
          calcFeeDto[key]
          )}`
        : query
      return query;
    }, '');

    return this.http.get(this.miningApi.getMainCost + "?" + url);
  }

  getPassengerCost(passengerFeeConfigId: string, numberPeople: number) {
    return this.http.get(this.miningApi.getPassengerCost + "?passengerFeeConfigId=" + passengerFeeConfigId + "&numberPeople=" + numberPeople);
  }

  getGoodsCost(goodsRateId: string, goodsInsAmount: number, unitQuatity: number) {
    return this.http.get(this.miningApi.getGoodsCost + "?goodsRateId=" + goodsRateId + "&goodsInsAmount=" + goodsInsAmount + "&unitQuatity=" + unitQuatity);
  }

  /** submit create order */
  createOrder(order: CarInsuranceOrder) {
    return this.http.post(this.miningApi.createOrder, order);
  }

  /** trả về object datetime có giá trị ngày/tháng/năm ngày tiếp theo n ngày truyền vào */
  from_Date_Next_N_Date(fromDate, nDay) {
    let temp = new Date(fromDate);
    temp.setHours(0, 0, 0, 0);
    let nDays = 24 * nDay;
    temp.setHours(nDays, 0, 0, 0);
    return temp;
}

  /** trả về object datetime có giá trị ngày/tháng/năm ngày tiếp theo n ngày truyền vào */
  from_Date_Next_N_Month(fromDate, nMonth) {
      console.log(fromDate);

      let temp = new Date(fromDate);
      temp.setHours(0, 0, 0, 0);
      let temp2 = new Date(temp);
      return new Date(temp2.setMonth(temp2.getMonth() + +nMonth));
  }
}

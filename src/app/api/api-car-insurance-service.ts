import { environment } from "../../environments/environment";
export class PublicCarInsuranceApi {
  private env = environment;
  address: string = this.env.carInsuranceService;

  public getSiteContentsBySite: string = this.address + "/v1/cms/get-content/";
  public getMasterData: string = this.address + "/v1/masterdata";
  public getMainCost: string = this.address + "/v1/insurance_calculator/main_cost";
  public getPassengerCost: string = this.address + "/v1/insurance_calculator/passenger_cost";
  public getGoodsCost: string = this.address + "/v1/insurance_calculator/goods_cost";
  public createOrder: string = this.address + "/v2/order";
}

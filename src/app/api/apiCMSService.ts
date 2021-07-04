import { environment } from "../../environments/environment";
export class PublicCMSApi {
  private env = environment;
  address: string = this.env.cmsService;
  public getSiteContentsBySite: string = this.address + "/v2/cms/get-contents-by-site";
}

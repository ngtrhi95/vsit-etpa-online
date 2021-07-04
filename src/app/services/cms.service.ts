import { Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";
import { PublicCMSApi} from "../api/apiCMSService";
import { Observable } from "rxjs/Rx";
import { ApiResult } from '../models/general.model';

@Injectable()
export class CMSService {
  constructor(private http: HttpService, private miningApi: PublicCMSApi) {}

  getSiteContents(siteCode: string): Observable<ApiResult> {
    return this.http.get(this.miningApi.getSiteContentsBySite + "?siteCode=" + siteCode);
  }
}

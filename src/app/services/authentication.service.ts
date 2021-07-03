import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Models from '../models/general.model';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import { HttpService } from "./http.service";
import { SecurityApi } from '../api/apiService';
@Injectable()
export class AuthenticationService {
  constructor(private http: HttpService, private securityApi: SecurityApi) { 
  }
  login(username: string, password: string): Observable<Models.ApiResult> {
    return this.http.get(this.securityApi.address+'api/login?client='+this.securityApi.client+"&secretKey="+this.securityApi.secretKey+"&username="+username+"&password="+password);
  }
  logout() {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('EXPIRED_TIME');
    localStorage.removeItem('EXPIRED_TOTAL_S');
    localStorage.removeItem('roleUser');
    localStorage.removeItem('detailUserPTI');
    localStorage.removeItem('detailUserLogin');
  }
}
import { HttpService } from './http.service'
import { CustomerApi } from '../api/apiService';
import * as Models from '../models/general.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CustomerService{
    constructor(private http:HttpService,private customerApi:CustomerApi){

    }
    generateCustomerCodeFromId(customerId: string): string {
        return 'KH' + ('000000' + customerId).slice(-7);
    }

    getCustomerById(customerId: number): Observable<Models.ApiResult>{
        return this.http.get(this.customerApi.getCustomerInfoById + customerId);
    }

    addNewCustomer(customerData: Models.Customer): Observable<Models.ApiResult>{
        customerData.provinceOrCityId == null ? customerData.provinceOrCityId = undefined : '';
        customerData.districtId == null ? customerData.districtId = undefined : '';
        customerData.wardId == null ? customerData.wardId = undefined : '';
        return this.http.post(this.customerApi.addNewCustomerInfo,customerData);
    }

    addGroupCustomer(groupCustomer: Array<Models.Customer>): Observable<Models.ApiResult> {
        return this.http.post(this.customerApi.updateManyCustomerInfo, groupCustomer);
    }

    getGroupCustomer(customersId: Array<number>): Observable<Models.ApiResult> {
        return this.http.post(this.customerApi.getCustomersOfInsuranceHuman, customersId);
    }

    updateCustomer(customerData: Models.Customer): Observable<Models.ApiResult>{
        customerData.provinceOrCityId == null ? customerData.provinceOrCityId = undefined : '';
        customerData.districtId == null ? customerData.districtId = undefined : '';
        customerData.wardId == null ? customerData.wardId = undefined : '';
        return this.http.post(this.customerApi.updateCustomerInfo,customerData);
    }

    findCustomerByNumberId(numberId: string): Observable<Models.ApiResult> {
        return this.http.get(this.customerApi.findCustomerByIdentityNumber + numberId);
    }

    findCustomerByCustomerCode(customerCode: string): Observable<Models.ApiResult> {
        return this.http.get(this.customerApi.findCustomerByCustomerCode + customerCode);
    }
}
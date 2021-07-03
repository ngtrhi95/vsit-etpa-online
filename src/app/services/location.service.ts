import { HttpService } from "./http.service";
import { LocationApi } from "../api/apiService";
import { Injectable } from "@angular/core";
import * as Models from "../models/address.model";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import { ApiResult } from "../models/general.model";

@Injectable()
export class LocationService {

    fullAddress = new BehaviorSubject<ApiResult>(null);
    constructor(private http: HttpService, private locationApi: LocationApi) {}
    returnNullObservable(success, isArrayResult = true) {
        let temp = new ApiResult();
        temp.success = success;
        isArrayResult ? temp.data = [] : temp.data = {};
        return Observable.create(_ => {
            _.next(temp);
        });
    }
    public getCountries(): Observable<ApiResult> {
        return this.http.get(this.locationApi.getCountries);
    }
    public getProvinces(limit?): Observable<ApiResult> {
        return this.http.get(this.locationApi.getProvinces + (limit ? "?limit=" + limit : ""));
    }

    public getDistrictsByProvinceId(provinceId: number): Observable<ApiResult> {
        if (!provinceId) {
            return this.returnNullObservable(true);
        }
        return this.http.get(this.locationApi.getDistrictsByProvinceId + provinceId);
    }

    public getWardsByDistrictId(districtId: number): Observable<ApiResult> {
        if (!districtId) {
            return this.returnNullObservable(true);
        }
        return this.http.get(this.locationApi.getWardsByDistrictId + districtId);
    }

    public getAddressById(addressId: number): Observable<ApiResult> {
        return this.http.get(this.locationApi.getAddressById + addressId);
    }

    public addNewAddress(addressModel: Models.Address): Observable<ApiResult> {
        addressModel.id = 0;
        return this.http.post(this.locationApi.addOrUpdateAddress, addressModel);
    }
    public updateAddress(addressModel: Models.Address): Observable<ApiResult> {
        return this.http.post(this.locationApi.addOrUpdateAddress, addressModel);
    }

    public getFullAddressDetailById(addressId: number): Observable<any> {
        let apiResult: ApiResult = {};
        let addressReturn: Models.FullAddressDetail = {};
        this.getAddressById(addressId).subscribe(
            result => {
                addressReturn.address = result.data;
                this.getProvinces().subscribe(
                    pResult => {
                        addressReturn.provinces = pResult.data;
                    },
                    err => console.log(err)
                );
                this.getDistrictsByProvinceId(addressReturn.address.provinceOrCityId).subscribe(
                    dResult => {
                        addressReturn.districts = dResult.data;
                    },
                    err => console.log(err)
                );
                this.getWardsByDistrictId(addressReturn.address.districtId).subscribe(
                    wResult => {
                        addressReturn.wards = wResult.data;
                    },
                    err => console.log(err)
                );
                apiResult.data = addressReturn;
                apiResult.success = true;
                this.fullAddress.next(apiResult);
            },
            err => {
                apiResult.data = "Something wrong when load address detail!";
                apiResult.success = false;
                console.log(err);
                this.fullAddress.next(apiResult);
            }
        );
       return this.fullAddress.asObservable();
    }
}

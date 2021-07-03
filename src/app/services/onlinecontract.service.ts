import { Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";
import { PublicMiningApi, OrderApi, MomoPaymentApi,AirpayPaymentApi, ZalopayPaymentApi,PayooPaymentApi,
    AppayPaymentApi , LookupContractApi , CertificateApi , ExportContractFile,LookUpClaimApi} from "../api/apiService";
import { VehicleContractModel, BuildingContractModel, HumanContractModel, OrderWithShipment,
    MomoPaymentResultResponse, InsuranceFeeInfoByConfig, AddNewOrderModel, lookUpClaimRequest } from "../models/contract.model";
import { Observable } from "rxjs/Rx";
import { ApiResult } from '../models/general.model';

@Injectable()
export class OnlineContractService {
    constructor(private http: HttpService, private miningApi: PublicMiningApi, private orderApi: OrderApi,
        private zalopayPayment: ZalopayPaymentApi,
        private momoPayment: MomoPaymentApi,
        private airpayPayment: AirpayPaymentApi,
        private payooPayment: PayooPaymentApi,
        private appayPayment: AppayPaymentApi,
        private certificate : CertificateApi,
        private LookupContract : LookupContractApi,
        private exportContractFile: ExportContractFile,
        private lookupclaim: LookUpClaimApi) {}

    addNewVehicleContractOnline(model: VehicleContractModel, refCode): Observable<ApiResult> {
        return this.http.post(this.miningApi.addNewVehicleOnlineContract + '?referenceCode=' + refCode, model);
    }
    addNewBuildingContractOnline(model: BuildingContractModel, refCode): Observable<ApiResult> {
        return this.http.post(this.miningApi.addNewBuildingOnlineContract + '?referenceCode=' + refCode, model);
    }
    addNewHumanContractOnline(model: HumanContractModel, refCode): Observable<ApiResult> {
        return this.http.post(this.miningApi.addNewHumanOnlineContract + '?referenceCode=' + refCode, model);
    }
    getInsuranceProductOptionsDetail(productId: number): Observable<ApiResult> {
        return this.http.get(this.miningApi.getInsuraceProductOptionsDetail + productId);
    }
    getInsuraceProductOptionsDetailWithChannel(productId: number, channel: number): Observable<ApiResult> {
        return this.http.get(this.miningApi.getInsuraceProductOptionsDetailWithChannel + "/" + productId + "/" + channel);
    }

    getContractCertificateForCustomer(contractId: number): Observable<ApiResult> {
        return this.http.get(this.miningApi.getContractCertificateForCustomer + contractId);
    }

    getOrderDetailById(orderId): Observable<ApiResult> {
        return this.http.get(this.orderApi.getOrderContractDetailById + orderId);
    }

    getOrderDetailByCode(code): Observable<ApiResult> {
        return this.http.get(this.orderApi.getOrderContractDetailByCode + code);
    }

    updateOrderShipment(orderShipment: OrderWithShipment): Observable<ApiResult> {
        return this.http.post(this.orderApi.updateOrderWithShipment, orderShipment);
    }

    addNewOrderWithRelatedData(orderData: AddNewOrderModel, refCode): Observable<ApiResult> {
        return this.http.post(this.orderApi.addNewOrderWithRelatedData + "?referenceCode=" + refCode, orderData);
    }

    findOrderDetail(phoneNumber, keyword): Observable<ApiResult> {
        return this.http.get(this.orderApi.findOrderInfo + 'keyword=' + keyword + '&customerPhone=' + phoneNumber);
    }

    getPayUrlFromMomo(orderId: number): Observable<ApiResult> {
        return this.http.get(this.momoPayment.getPayUrlFromMomo + orderId);
    }

    getAllPaymentSuppliers(): Observable<ApiResult> {
        return this.http.get(this.orderApi.getAllPaymentSuppliers);
    }

    getPaymentMethodConfigBaseOnCompanyAndChannel(channel: number, defaultPaymentSuppplierCode: string = null): Observable<ApiResult> {
        let url = this.orderApi.getPaymentMethodConfigBaseOnCompanyAndChannel + channel;
        if (defaultPaymentSuppplierCode != null) {
            url = url + '?defaultPaymentSupplierCode=' + defaultPaymentSuppplierCode;
        }

        return this.http.get(url);
    }

    getZalopayChannels(): Observable<ApiResult> {
        return this.http.get(this.zalopayPayment.getZalopayChannels);
    }

    updatePaymentResultForMomo(data: MomoPaymentResultResponse): Observable<ApiResult> {
        return this.http.post(this.momoPayment.UpdatePaymentResult, data);
    }

    sendRepaidRequest(orderId: number): Observable<ApiResult> {
        return this.http.get(this.momoPayment.sendRepaidRequest + orderId);
    }

    calculatorInsuranceFeeByConfig(insuranceFeeByConfig: InsuranceFeeInfoByConfig): Observable<ApiResult> {
        return this.http.post(this.miningApi.getInsuranceFeeByConfig, insuranceFeeByConfig);
    }

    getGeneralContractReportData(): Observable<ApiResult> {
        return this.http.get(this.miningApi.getGeneralContractReportData);
    }

    getInsurancePackagesGroupByBusiness(partnerCode: string): Observable<ApiResult> {
        return this.http.get(this.miningApi.getInsurancePackagesGroupByBusiness + '?partnerCode=' + partnerCode );
    }

    getAllCategoriesForDistributor(partnerCode: string): Observable<ApiResult> {
        return this.http.get(this.miningApi.getAllCategoriesForDistributor + partnerCode );
    }

    getAllProductOfCategoryForDistributor(categoryId: number, partnerCode: string): Observable<ApiResult> {
        return this.http.get(this.miningApi.getAllProductOfCategoryForDistributor + categoryId + '/'  + partnerCode );
    }

    // getInsuranceProductOptionByProductId(productId: number): Observable<ApiResult> {
    //     return this.http.get(this.miningApi.getInsuranceProductOptionByProductId + productId );
    // }

    getInsurancProgramBaseOnBusiness(partnerCode: string, businessId: number): Observable<ApiResult> {
        return this.http.get(this.miningApi.getInsurancProgramBaseOnBusiness + '?partnerCode=' + partnerCode + '&businessId=' + businessId);
    }

    GetInsurancePackagesGroupByProgram(partnerCode: string, programId: number): Observable<ApiResult> {
        return this.http.get(this.miningApi.getInsurancePackagesGroupByProgram + '?partnerCode=' + partnerCode + '&programId=' + programId);
    }

    getInsuranceProductByDistributor(distributorCode: string,chanel : number, onlyFeatureProduct: boolean = false): Observable<ApiResult> {
        const url = this.miningApi.getInsuranceProductByDistributor + distributorCode + '/' + chanel + '?onlyFeatureProduct=' + onlyFeatureProduct;
        return this.http.get(url);
    }

    getInsurancePackagesGroupByPartner(partnerCode: string): Observable<ApiResult> {
        return this.http.get(this.miningApi.getInsurancePackagesGroupByPartner + '?partnerCode=' + partnerCode );
    }

    UpdatePaymentResultForMomo(data: MomoPaymentResultResponse): Observable<ApiResult> {
        return this.http.post(this.miningApi.getInsuranceFeeByConfig, data);
    }

    getInsuranceProductById(groupId: number): Observable<ApiResult> {
        return this.http.get(this.miningApi.getInsuranceProductById + groupId);
    }

    getProductOptionForProduct(productId: number): Observable<ApiResult> {
        return this.http.get(this.miningApi.getProductOptionForProduct + productId);
    }

    getUploadAndConfirmInfo(certificateNumber: string): Observable<ApiResult> {
        return this.http.get(this.miningApi.getUploadAndConfirmInfo + certificateNumber);
    }

    getOrderDataForZalolay(orderId: number, bankCode: string): Observable<ApiResult> {
        return this.http.get(this.zalopayPayment.createZalopayOrder + orderId + '/' + bankCode);
    }

    getLandingUrlFromAirpay(orderId: number): Observable<ApiResult>{
        return this.http.get(this.airpayPayment.getLandingUrlFromAirpay + orderId);
    }

    getOrderDetailByZaloCase(apptransId): Observable<ApiResult> {
        return this.http.get(this.zalopayPayment.getOrderDetailByApptransId + apptransId);
    }

    getPayUrlFromPayoo(orderId: number): Observable<ApiResult> {
        return this.http.get(this.payooPayment.getPayUrlFromPayoo + orderId);
    }

    getBranchCodeVehicle(): Observable<ApiResult> {
        return this.http.get(this.miningApi.getBranchCodeVehicle);
    };
    getTypeNumberByBranch(branchID): Observable<ApiResult> {
        return this.http.get(this.miningApi.getTypeNumberVehicle + branchID);
    }
    getPayUrlFromAppay(orderId: number): Observable<ApiResult> {
        return this.http.get(this.appayPayment.getPayUrlFromAppay + orderId);
    }
    findConTractDetail(code : string): Observable<ApiResult> {
        return this.http.get(this.LookupContract.findByLookupCode  + code);
    }
    getUrlCertificate(certificationNumber: string): Observable<ApiResult> {
        return this.http.get(this.certificate.getUrlCertificate + certificationNumber);
    }
    FindCertificateAnhPhone(keyword: string, phone: string): Observable<ApiResult> {
        return this.http.get(this.LookupContract.findByCertificateAndPhone + '?certificateNumber=' + keyword + '&customerPhone=' + phone);
    }
    exportHumanContractFile(contracId: number): Observable<ApiResult> {
        return this.http.get(this.exportContractFile.humanContractFile + contracId);
    }
    exportBuildingContractFile(contracId: number): Observable<ApiResult> {
        return this.http.get(this.exportContractFile.buildingContractFile + contracId);
    }
    exportVehicleContractFile(contracId: number): Observable<ApiResult> {
        return this.http.get(this.exportContractFile.vehicleContractFile + contracId);
    }
    exportOtoContractFile(contracId: number): Observable<ApiResult> {
        return this.http.get(this.exportContractFile.otoContractFile + contracId);
    }
    exportReceiverInfoFile(contracId: number): Observable<ApiResult> {
        return this.http.get(this.exportContractFile.receiverInfoFile + contracId);
    }
    exportMobileDeviceContractFile(contracId: number): Observable<ApiResult> {
        return this.http.get(this.exportContractFile.mobileDeviceContractFile + contracId);
    }
    exportContractFileBytes(certificationNumber: string): Observable<ApiResult> {
        return this.http.get(this.certificate.GetFileBytes + certificationNumber);
    }
    FindLookUpClaim(lookupclaimrequest: lookUpClaimRequest): Observable<ApiResult> {
        return this.http.post(this.lookupclaim.findLookUpClaim , lookupclaimrequest);
    }
}

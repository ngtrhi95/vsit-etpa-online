import { environment } from "../../environments/environment";
export class LocationApi {
    private env = environment;
    address: string = this.env.locationService;
    controller: string = this.address + "api/location/";
    getCountries: string = this.controller + 'Countries/';
    getProvinces: string = this.controller + "Provinces/";
    getDistrictsByProvinceId: string = this.controller + "Districts/";
    getWardsByDistrictId: string = this.controller + "Wards/";
    getAddressById: string = this.controller + "Address/";
    addOrUpdateAddress: string = this.controller + "AddressAddorUpdate/";
    getNameLocation: string = this.controller + "GetNameLocation";
}

export class CustomerApi {
    private env = environment;
    address: string = this.env.customerService;
    customer: string = this.address + "api/customer/";
    getAllCustomer: string = this.customer + "GetAll/";
    getCustomerInfoById: string = this.customer + "GetById?id=";
    addNewCustomerInfo: string = this.customer + "AddNew/";
    updateCustomerInfo: string = this.customer + "Update/";
    updateManyCustomerInfo: string = this.customer + "AddTempCustomer/";
    getCustomersOfInsuranceHuman: string = this.customer + "GetByIds/";
    findCustomerByIdentityNumber: string = this.customer + "FindCustomerByIdentityNumber/";
    getInsuredPersonsByIds: string = this.customer + "GetInsuredPersonsByIds";
    getInfoInsuredPersonsByIds: string = this.customer + "GetInfoInsuredPersonsByIds";
    findCustomerByCustomerCode: string = this.customer + "GetCustomerByCustomerCode?customerCode=";
}

export class SmsEmailApi {
    private env = environment;
    address: string = this.env.smsEmailService;
    sms: string = this.address + "api/Sms/";
    sendSmsByConfig: string = this.sms + "sendSmsByConfig/";
    sendEmailByConfig: string = this.address + "api/Email/SendEmailByConfig";
    sendEmailQueueByConfig: string = this.address + "api/Email/SendEmailQueueByConfig";
    sendSmsByQueueConfig: string = this.sms + "SendSmsQueueByConfig/";
}

export class PublicMiningApi {
    private env = environment;
    address: string = this.env.contractService;
    vehicleContract: string = this.address + "api/VehicleContract/";
    config: string = this.address + "api/contractconfig/";
    insuranceProduct: string = this.address + "api/insuranceProduct/";
    addNewVehicleContract: string = this.vehicleContract + "AddNew";
    addNewVehicleOnlineContract: string = this.vehicleContract + "AddNewOnline";
    getInsuraceProductOptionsDetail: string = this.config + "GetInsuraceProductOptionsDetail/";
    getInsuraceProductOptionsDetailWithChannel: string = this.config + "GetInsuraceProductOptionsDetailWithChannel/";
    getContractCertificateForCustomer: string = this.vehicleContract + "GetContractCertificateByContractId/";
    updateVehicleContract: string = this.vehicleContract + "Update";
    getVehicleContract: string = this.vehicleContract + "GetById/";
    sendCreatedVehicleContractEmail: string = this.vehicleContract + "SendCreateVehicleContractEmail/";
    createVehicleEndorsementContract: string = this.vehicleContract + "CreateEndorsementContract?referenceContractId=";
    buildingContract: string = this.address + "api/BuildingContract/";
    addNewBuildingContract: string = this.buildingContract + "AddNew";
    addNewBuildingOnlineContract: string = this.buildingContract + "AddNewOnline";
    updateBuildingContract: string = this.buildingContract + "Update";
    getBuildingContract: string = this.buildingContract + "GetById/";
    sendCreatedBuildingContractEmail: string = this.buildingContract + "SendCreateBuildingContractEmail/";
    humanContract: string = this.address + "api/HumanContract/";
    addNewHumanContract: string = this.humanContract + "AddNew/";
    addNewHumanOnlineContract: string = this.humanContract + "AddNewOnline";
    updateHumanContract: string = this.humanContract + "Update";
    getHumanContract: string = this.humanContract + "GetById/";
    sendCreatedHumanContractEmail: string = this.humanContract + "SendCreateHumanContractEmail/";
    searchRawVehicleContracts: string = this.vehicleContract + "SearchRawContracts/";
    searchRawHumanContracts: string = this.humanContract + "SearchRawContracts/";
    searchRawBuildingContracts: string = this.buildingContract + "SearchRawContracts/";
    baseContract: string = this.address + "api/BaseContract/";
    sendSms: string = this.baseContract + "SendSMS/";
    reasonAndSelection: string = this.address + "api/ReasonAndSelection/";
    getReasonByGroupType: string = this.reasonAndSelection + "GetItemsByGroupType?groupType=";
    getReferenceOfContract: string = this.baseContract + "GetReferenceContractsOfContract?contractId=";
    holdVehicleCertification: string = this.vehicleContract + "UpdateRawContractHoldTime/";
    holdBuildingCertification: string = this.buildingContract + "UpdateRawContractHoldTime/";
    holdHumanCertification: string = this.humanContract + "UpdateRawContractHoldTime/";
    createBuildingEndorsementContract: string = this.buildingContract + "CreateEndorsementContract?referenceContractId=";
    createHumanEndorsementContract: string = this.humanContract + "CreateEndorsementContract?referenceContractId=";
    getHumanContractFile: string = this.humanContract + "GetContractCertificateByContractId/";
    getVehicleContractFile: string = this.vehicleContract + "GetContractCertificateByContractId/";
    getBuildingContractFile: string = this.buildingContract + "GetContractCertificateByContractId/";
    getBaseContract: string = this.baseContract + "GetById/";
    combineContract: string = this.address + 'api/CombineContract/';
    getInsuranceFeeByConfig: string = this.combineContract + 'GetInsuranceFeeInfoByConfigs/';
    getGeneralContractReportData: string = this.address + "api/BaseContract/GetGeneralContractReportData";
    getInsurancePackagesGroupByBusiness: string = this.address + "api/ContractConfig/GetInsurancePackagesGroupByBusiness/";
    getAllCategoriesForDistributor: string = this.insuranceProduct + "GetAllCategoriesForDistributor/";
    getAllProductOfCategoryForDistributor: string = this.insuranceProduct + "GetAllProductOfCategoryForDistributor/";
    // getInsuranceProductOptionByProductId: string = this.insuranceProduct + "GetInsuranceProductOptionByProductId/";
    getInsurancProgramBaseOnBusiness: string = this.address + "api/ContractConfig/GetInsurancProgramBaseOnBusiness/";
    getInsurancePackagesGroupByProgram: string = this.address + "api/ContractConfig/GetInsurancePackagesGroupByProgram/";
    getInsuranceProductByDistributor: string = this.insuranceProduct + "GetInsuranceProductByDistributor/";
    getInsurancePackagesGroupByPartner: string = this.address + "api/ContractConfig/GetInsurancePackagesGroupByPartner/";
    uploadImages: string = this.baseContract + 'UploadImages/';
    getInsuranceProductById: string = this.insuranceProduct + "GetInsuranceProductById/";
    getProductOptionForProduct: string = this.insuranceProduct + "GetInsuranceProductOptionByProductId/";
    getUploadAndConfirmInfo: string = this.address + "api/BaseContract/GetUploadAndConfirmInfo/";
    getBranchCodeVehicle: string = this.address + "api/VehicleContract/GetVehicleBranches/";
    getTypeNumberVehicle: string = this.address + "api/VehicleContract/GetVehicleTypeByBranch/";
}

export class OrderApi {
    private env = environment;
    address: string = this.env.contractService;
    order: string = this.address + "api/order/";
    paymentMethodConfigInfo: string = this.address + "api/PaymentMethodConfigInfo/";
    search: string = this.order + "Search/";
    getById: string = this.order + "GetById/";
    cancelOrderByEmployee: string = this.order + "CancelOrderByEmployee/";
    approveOrderByEmployee: string = this.order + "ApproveOrderByEmployee/";
    updateForCompletingPayment: string = this.order + "UpdateForCompletingPayment/";
    updateForStartingShipping: string = this.order + "UpdateForStartingShipping/";
    updateForCompletingShipping: string = this.order + "UpdateForCompletingShipping/";
    getOrderContractDetailById: string = this.order + "GetOrderContractDetailById/";
    getOrderContractDetailByCode: string = this.order + "GetOrderContractDetailByCode/";
    updateOrderWithShipment: string = this.order + "UpdateOrderWithShipment/";
    getAllPaymentSuppliers: string = this.order + "GetAllPaymentSuppliers/";
    addNewOrderWithRelatedData: string = this.order + "AddNewOrderWithRelatedData/";//them moi don hang
    findOrderInfo: string = this.order + "FindOrderBaseOnPublicInfo?";
    getPaymentMethodConfigBaseOnCompanyAndChannel: string = this.paymentMethodConfigInfo + "GetPaymentMethodConfigBaseOnCompanyAndChannel/";
}

export class MomoPaymentApi {
    private env = environment;
    address: string = this.env.contractService;
    momoPayment: string = this.address + "api/MomoPayment/";
    getPayUrlFromMomo: string = this.momoPayment + "GetPayUrl/";
    UpdatePaymentResult: string = this.momoPayment + "UpdatePaymentResultFromReturnUrl/";
    sendRepaidRequest: string = this.momoPayment + "RequestRepaidPayment/";
}

export class ZalopayPaymentApi {
    private env = environment;
    address: string = this.env.contractService;
    zalopayPayment: string = this.address + "api/ZalopayPayment/";
    getZalopayChannels: string = this.zalopayPayment + "getChannels/";
    createZalopayOrder: string = this.zalopayPayment + "CreateZalopayOrder/";
    getOrderDetailByApptransId: string = this.zalopayPayment + "GetOrderDetailByApptransId/";
}

export class AirpayPaymentApi {
    private env = environment;
    address: string = this.env.contractService;
    airpayPayment: string = this.address + "api/AirpayPayment/";
    getLandingUrlFromAirpay: string = this.airpayPayment + "GetAirpayPaymentUrl/";
}

export class SecurityApi {
    private env = environment;
    address: string = this.env.apiIdentityUrl;
    client: string = this.env.client;
    secretKey: string = this.env.secretKey;
    apiIdentityResource: string = this.env.apiIdentityResource;
    security: string = this.address + 'api/Security/';
    getCurrentUserConfigs: string = this.address + 'api/UserAccount/GetCurrentUserConfigs';
}
export class PayooPaymentApi{
    private env = environment;
    address : string = this.env.contractService;
    payooPayment: string = this.address + "api/PayooPayment/";
    getPayUrlFromPayoo: string = this.payooPayment + "CreatePayooOrderCopy/";
}
export class MobileInsuranceApi {
    private env = environment;
    private address: string = this.env.contractService;
    private mobileDeviceContract: string = this.address + "api/MobileDeviceContract/";
    getAllActivatedProducers: string = this.mobileDeviceContract + "GetAllActivatedProducers/";
    getCostRate: string = this.mobileDeviceContract + "GetCostRateBaseOn/";
    calInsuranceCost: string = this.mobileDeviceContract + "CalculateInsuranceCost/";
}

export class AppayPaymentApi {
    private env = environment;
    address: string = this.env.contractService;
    payooPayment: string = this.address + "api/AppayPayment/";
    getPayUrlFromAppay: string = this.payooPayment + "GetPayUrl/";
}

export class LookupContractApi {
    private env = environment;
    private address: string = this.env.contractService;
    findByLookupCode: string = this.address + 'api/LookupContract/FindByLookupCode/';
    findByCertificateAndPhone: string = this.address + 'api/LookupContract/FindByCertificateAndPhone';
}

export class CertificateApi {
    private env = environment;
    private address: string = this.env.CMService;
    getUrlCertificate: string = this.address + 'api/certificate/GetUrlCertificate?certificationnumber=';
    GetFileBytes: string = this.address + 'api/certificate/GetFileBytes?certificationnumber=';
}
export class ExportContractFile {
    private env = environment;
    address: string = this.env.contractService;
    humanContractFile: string = this.address + 'api/HumanContract/GetContractCertificateByContractId/';
    buildingContractFile: string = this.address + 'api/BuildingContract/GetContractCertificateByContractId/';
    vehicleContractFile: string = this.address + 'api/VehicleContract/GetContractCertificateByContractId/';
    otoContractFile: string = this.address + 'api/OtoContract/GetContractCertificateByContractId/';
    receiverInfoFile: string = this.address + 'api/Order/DownloadReceiverInfo/';
    mobileDeviceContractFile: string = this.address + 'api/MobileDeviceContract/GetContractCertificateByContractId/';
}
export class LookUpClaimApi {
    private env = environment;
    private address: string = this.env.claimService;
    findLookUpClaim: string = this.address + 'api/BaseClaim/LookUpClaim';
}
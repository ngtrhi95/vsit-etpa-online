import { Address } from "./address.model";
import { Customer } from "./general.model";

export class InsuranceFeeInfoByConfig {
    constructor(public comboId?: number, public contractType?: number, public programPackageConfigs = new Array<ProgramPackageConfig>()) {}
}

export class InsurancePackage {
    [key: string]: any;
    constructor(public requiredTakingPaperCertificate: boolean = false, public receiveCertificate?: boolean, public name?: string, public insuranceObjectType?: number, public insurancePackageDetails = new Array<InsurancePackageDetail>()) {
        this.insurancePackageDetails = [];
    }
}

export class InsurancePackageDetail {
    constructor(
        public programCode?: string,
        public programName?: string,
        public insuranceBusinessName?: string,
        public insurancePackageCode?: string,
        public insurancePackageName?: string,
        public insuranceProgramId?: number,
        public insuranceCost?: number,
        public insuranceAmount?: number,
        public accompanyingPackageInsuranceAmount?: number,
        public insuranceBussinessId?: number,
        public numberOfInsuranceObject?: number,
        public insurancePackageDescription?: string,
        public insuranceProgramPackageId?: number,
        public insuranceObjectType?: number,
        public comboId?: number,
        public comboCode?: string,
        public selected: boolean = false,
        public recommend: boolean = false,
        public isMainPackage: boolean = false,
        public accompanyingInsuranceProgramPackageData?: InsurancePackageDetail,
    ) {}
}

export class BaseContract {
    [key: string]: any;
    constructor(
        public id?: number,
        /** số ấn chỉ */
        public certificationNumner?: string,
        /** id chủ hợp đồng */
        public contractOwnerId?: number,
        /** id người thụ hưởng */
        public beneficiaryId?: number,
        /** id người nhận tiền bồi thường */
        public moneyReceiverId?: number,
        /** ngày hợp đồng có hiệu lực */
        public effectiveDate?: Date,
        /** ngày hợp đồng hết hạn */
        public expireDate?: Date,
        /** loại hồ sơ - gốc (1) | sđbs (2) | tái tục (3) */
        public formOfParticipation: number = 1,
        /** loại hợp đồng - con người | xe máy | tài sản | combo */
        public contractType?: number,
        /** id người tạo hợp đồng */
        public createdBy?: number,
        /** id người bán */
        public sellerId?: number,
        /** mã bưu cục */
        public organizationCode?: number,
        /** tên người bán */
        public sellerName?: string,
        /** */
        public programId?: number,
        /** mã hợp đồng trong hệ thống */
        public code?: string,
        public totalInsuranceAmount?: number,
        public totalInsuranceCost?: number,
        public totalDiscount?: number,
        /** ngày cấp hợp đồng */
        public dateOfIssue?: Date,
        public createdDate?: Date,
        public isLocked?: boolean,
        public affiliateOrganizationId?: number,
        public isOnlineContract?: boolean,
        public IsOfflineCertificate?: boolean,
        public confirmationStatus?: number,
        public companyId?: number,
        /** id hợp đồng được cấp sửa đổi bổ sung */
        public referenceContractId?: number,
        /** id hợp đồng gốc được sửa đổi bổ sung */
        public rootReferenceContractId?: number,
        /** id lý do SĐBS */
        public endorsementReasonId?: number,
        public insuranceProductId?: number,
        public insuranceProductCategoryId?: number
    ) {}
}

export class ContractProgramPackageData {
    [key: string]: any;
    constructor(
        public id?: number,
        public contractId?: number,
        public insuranceProgramId?: number,
        public insuranceCostPerObject?: number,
        public insuranceAmountPerObject?: number,
        public quantity?: number,
        public belongToCombo?: boolean,
        public programPackageCode?: string,
        public insuranceObjectType?: number,
        public isAccompanyingPackage?: boolean,
        public accompanyingProgramPackageCode?: string
    ) {}
}

export class ProgramPackageConfig {
    [key: string]: any;
    constructor(public insuranceProgramPackageId?: number, public numberOfInsuranceObject?: number) {}
}

export class BaseContractModel {
    [key: string]: any;
    public baseContract?: BaseContract = new BaseContract();
    public contractProgramPackages?: Array<ContractProgramPackageData> = new Array<ContractProgramPackageData>();
    public programPackageConfigs?: Array<ProgramPackageConfig> = new Array<ProgramPackageConfig>();
    public takingPaperCertification?: boolean;
}
export class BuildingContract {
    [key: string]: any;
    constructor(public includeAssetInsideBuilding?: boolean) {}
}
export class InsuredBuilding {
    [key: string]: any;
    constructor(
        /** id địa chỉ nhà được bảo hiểm */
        public addressId?: number,
        /** id chủ sở hữu */
        public buildingOwnerId?: number,
        /** loại nhà */
        public buildingType?: number,
        /** năm xây dựng */
        public yearOfBuilding?: number,
        /** diện tích sử dụng */
        public areaOfUse?: number,
        /** có phải là nhà dân sự */
        public isFamilyHome?: boolean,
        /** có phải là nhà bê-tông */
        public isConcreteBuilding?: boolean,
        /** id hợp đồng bảo hiểm */
        public contractId?: number
    ) {}
}
export class InsuredPeople {
    [key: string]: any;
    constructor(public customerId?: number, public relationShipId?: number) {}
}
export class VehicleContract {
    [key: string]: any;
    constructor(
        /** tổng phí bảo hiểm */
        public totalInsuranceFee?: number,
        /** tổng hạn mức trách nhiệm bảo hiểm */
        public totalInsurenceAmount?: number,
        /** tổng số xe tham gia */
        public numberOfInsuredVehcles?: number,
        public insuranceProgramId?: number,
        public id?: number,
        public contractId?: number,
        public hasReceivedVehicleImages?: boolean,
        public hasReveivedImages?: boolean,
        public hasSentSmsToCustomer?: boolean
    ) {}
}
export class InsuredVehicle {
    [key: string]: any;
    constructor(
        public id?: number,
        /** biển kiểm soát */
        public plateNumber?: string,
        /** số máy */
        public engineNumber?: string,
        /** số khung */
        public machineNumber?: string,
        /** giống thông tin chủ xe */
        public likeCustomerInfo: boolean = false,
        /** id chủ xe */
        public ownerId?: number,
        /** tên chủ xe */
        public ownerName?: string,
        /** năm sản xuất */
        public yearOfProduction?: number,
        /** ... */
        public branchCode?: string,
        /** ... */
        public typeNumber?: string,
        public hasPlate: boolean = true,
        public insuranceAmount?: number,
        public remainingAmount?: number,
        public numberOfClaim?: number,
        public numberOfCompensation?: number
    ) {}
}
export class HumanContract {
    [key: string]: any;
    constructor(public id?: number, public contractId?: number, public numberOfInsuredPeople?: number) {}
}
export class BuildingContractModel extends BaseContractModel {
    [key: string]: any;
    public buildingContract?: BuildingContract = new BuildingContract();
    public insuredBuilding?: InsuredBuilding = new InsuredBuilding();
}
export class VehicleContractModel extends BaseContractModel {
    [key: string]: any;
    public vehicleContract?: VehicleContract = new VehicleContract();
    public insuredVehicles?: InsuredVehicle[] = new Array<InsuredVehicle>();
}

export class HumanContractModel extends BaseContractModel {
    [key: string]: any;
    public humanContract?: HumanContract = new HumanContract();
    public insuredPeople?: InsuredPeople[] = new Array<InsuredPeople>();
}
export class LoveContract {
    [key: string]: any;
    constructor(public id?: number, public humanContractId?: number, public waitingTimeFrom?: Date, public waitingTimeTo?: Date, public isDivorce?: number) {}
}
export class LoveContractModel extends BaseContractModel {
    [key: string]: any;
    public loveContract?: LoveContract = new LoveContract();
    public insuredPeople?: InsuredPeople[] = new Array<InsuredPeople>();
}
export class OrderContractDetail {
    [key: string]: any;
    constructor(
        public orderId?: number,
        public contractId?: number,
        public certificateNumber?: string,
        public contractStatus?: number,
        public contractOwnerId?: number,
        public orderCode?: string,
        public orderCreatedDate?: Date,
        public effectiveDate?: Date,
        public expireDate?: Date,
        public orderAmount?: number,
        public insuranceAmount?: number,
        public insuranceProgramCode?: string,
        public insuranceProgramName?: string,
        public orderStatus?: number,
        public paymentMethod?: number,
        public takingPaperCertification?: boolean,
        public paymentStatus?: number,
        public paymentSupplierId?: number,
        public shipment: Shipment = new Shipment(),
    ) {}
}

export class Shipment extends Address {
    [key: string]: any;
    constructor(public addressId?: number, public receiverName?: string,
        public receiverPhone?: string, public receiverEmail?: string) {
        super();
    }
}

export class OrderWithShipment {
    [key: string]: any;
    constructor(public orderId?: number, public paymentMethod?: number, public shipment: Shipment = new Shipment(), public paymentSupplierId?: number) {}
}

export class PaymentMethodConfig {
    [key: string]: any;
    constructor(public id?: number, public name?: string, public paymentMethod?: number, public paymentSupplierId?: number, public paymentSupplier?: PaymentSupplier) {}
}

export class PaymentSupplier {
    [key: string]: any;
    constructor(public id?: number, public name?: string, public description?: string, public code?: string) {}
}

export class MomoPaymentResultResponse {
    [key: string]: any;
    constructor(
        public RequestId?: number,
        public ErrorCode?: string,
        public OrderId?: string,
        public Message?: string,
        public LocalMessage?: number,
        public RequestType?: string,
        public Signature?: string,
        public Amount?: string,
        public TransId?: number,
        public PayType?: string,
        public OrderType?: string,
        public PartnerCode?: number,
        public OrderInfo?: string,
        public ResponseTime?: string,
        public ExtraData?: string,
        public IsFromReturnUrl?: boolean
    ) {}
}

export class GeneralContractReportModel {
    public numberOfContracts: number;
    public numberOfInsurancePackages: number;
}

export class InsuranceBussinessModel {
    public id: number;
    public name: string;
    // public insuranceProgramModels = new Array<InsuranceProgramModel>();
}

export class InsuranceCategoryModel {
    public id: number;
    public name: string;
}

export class InsuranceProductModel {
    public id: number;
    public name: string;
    public description: string;
}

export class InsuranceProductOptionModel {
    public id: number;
    public insuranceProgramId: number;
    public insuranceProgramPackageId: number;
    public insuranceProgramPackageCode: string;
}

export class InsuranceProgramModel {
    public id: number;
    public name: string;
    // public insurancePackageModels = new Array<InsurancePackageModel>();
}

export class InsurancePackageModel {
    [key: string]: any;
    public id: number;
    public insurancePackageCode: number;
    public insurancePackageDescription: number;
    public insuranceCost: number;
    public insuranceAmount: number;
    public insuranceGroupId: number;
    public insuranceGroupUrl: string;
    public programName: string;
}

export class InsuranceProductForOnline {
    public id: number;
    public name: string;
    public description: string;
    public url: string;
    public groupType: number;
    public programCode: string;
    public categoryCode: string;
    public classIcon: string;
    public insuranceProductUrl: string;
    public paymentUrl: string;
}

export class ConfirmUploadInfoModel {
    public contractId: number;
    public certificateNumber: string;
    public numberOfUploadImages: number;
    public hasSentSmsConfirmUploadImage: boolean;
}

export class AddNewOrderModel {
    public BuildingAddressInfo: Address; // bh nhà
    public ContractOwnerInfo: Customer;
    public PartnerInfo: Customer; //bh tình yêu
    public VehicleContract: {};
    public BuildingContract: {};
    public HumanContract: {};
    public MobileDeviceContract: {};
    public Order: OrderContractDetail;
    public ContractType: number;
    public AffNetwork : string;
    public AffSid : string;
}

export class ZalopayChannelModel {
    public name: string;
    public pmcid: number;
    public banks: Array<ZalopayBankInfoModel> = [];
}

export class ZalopayBankInfoModel {
    public name: string;
    public bankCode: string;
}

export class ZalopaySelectedValueModel {
    public channel: ZalopayChannelModel;
    public bankCode: string;
    public orderId: number;
}
export class MobileContractModel extends BaseContractModel {
    [key: string]: any;
    public baseMobileDeviceContract?: MobileContract = new MobileContract();
    public insuredMobileDevice?: InsuredMobileDevice = new InsuredMobileDevice();
}

export class MobileContract {
    [key: string]: any;
    constructor(public MobileDeviceContractType?: number, public DeviceCategoryType?: number) {}
}

export class InsuredMobileDevice {
    constructor (
        public DeviceProducerId?: number,
        public ModelName?: string,
        public IMEI?: string,
        public Price?: number,
    ) {}
}
export class lookUpClaimRequest {
    public keyWord: string;
    public phoneNumber: string;
}
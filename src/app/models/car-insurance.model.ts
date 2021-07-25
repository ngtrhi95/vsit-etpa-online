import { BaseContractModel } from "./contract.model";

export class CMSContentDetail {
  constructor(
    public title?: string,
    public content?: string,
    public imageUrl?: string
  ) { }
}

export class CMSSiteContent {
  constructor(
    public position?: number,
    public contents: CMSContentDetail[] = new Array<CMSContentDetail>()
  ) { }
}
export class CMSSite {
  constructor(
    public name?: string,
    public shortDescription?: string,
    public backgroundImageUrl?: string,
    public siteContents: CMSSiteContent[] = new Array<CMSSiteContent>()
  ) { }
}

export class UsingPurposes {
  [key: string]: any;
  public feeConfigs: FeeConfigs[] = new Array<FeeConfigs>();

  constructor(
    public id?: string,
    public name?: string,
    public code?: string,
    public isCivilLiability: boolean = false,
    public isPhysicalDamage: boolean = false,
    public type?: number
  ) { }
}

export class FeeConfigs {
  [key: string]: any;
  constructor(
    public id?: string,
    public name?: string,
    public cost?: number,
    public minValue?: number,
    public maxValue?: number,
    public isCivilLiability: boolean = false,
    public isPhysicalDamage: boolean = false,
    public type?: number,
    public hoCode?: string,
    public seatCapacityMinValue?: number,
    public seatCapacityMaxValue?: number,
    public weightCapacityMinValue?: number,
    public weightCapacityMaxValue?: number,
  ) { }
}
export class GoodsRates {
  [key: string]: any;
  constructor(public id?: string, public name?: string, public rate?: number) { }
}

export class CalcFeeDto {
  /** Bao hiem nguoi ngoi tren xe*/
  public hasPassenger: boolean = true;
  /** Loai xe*/
  public usingPurposeId?: string;
  /* số cho ngoi tren xe */
  public seatCapacity?: number;
  /* so trong tai */
  public weightCapacity?: number;
  /* so cho lai phu xe */
  public numberPeople?: number;
  /** muc trach nhiem */
  public insuranceAmount?: number;
  /* ngay hieu luc */
  public effectiveDate?: string;
  /* ngay ket thuc */
  public expiryDate?: string;

  constructor(order: CarInsuranceOrder) {
    this.hasPassenger = order.hasPassenger;
    this.usingPurposeId = order.usingPurposeId;
    this.weightCapacity = order.weightCapacity;
    this.seatCapacity = order.seatCapacity;
    this.insuranceAmount = order.insuranceAmount;
    this.numberPeople = order.numberPeople
    this.effectiveDate = order.effectiveDate.toISOString();
    this.expiryDate = order.expiryDate.toISOString();
  }

}

export class CarInsuranceOrder {
  [key: string]: any;
  constructor(
    public hasPlate: boolean = true,
    public fullAddress?: string, 
    public receiverFullAddress?: string,
    public carOwnerFullAddress?: string,

    public numberOfDriverAndAssistantDriver?: number,
    public numberOfPassenger?: number,
    public insuranceProgramId?: number,
    public insuranceProductCategoryId?: number,
    public code?: string,
    public effectiveDate?: Date,
    public expiryDate?: Date,
    public hasReveivedImages: boolean = true,
    public hasReceivedVehicleImages: boolean = true,
    public hasSentSmsToCustomer: boolean = true,
    public insuranceType: number = 0,
    public contractType?: number,
    public name?: string,
    public phoneNumber?: string,
    public email?: string,
    public districtId?: number,
    public provinceId?: number,
    public wardId?: number,
    public addressDetail?: string,
    public paymentMethod?: number,
    public takingPaperCertification: boolean = true,
    public paymentSupplierId?: number,
    public receiverName?: string,
    public receiverPhone?: string,
    public receiverEmail?: string,
    public receiverProvinceId?: number,
    public receiverDistrictId?: number,
    public receiverWardId?: number,
    public receiverAddressDetail?: string,
    public registrationNumber?: string,
    public engineNumber?: string,
    public chassisNumber?: string,
    public ownerName?: string,
    public ownerFullAddress?: string,
    public yearOfProduction?: number,
    public firstRegistrationDate?: Date,
    public brandCode?: string,
    public type?: string,
    public modelCode?: string,
    public weightCapacity?: number,
    public seatCapacity?: number,
    public carOwnerName?: string,
    public carOwnerPhoneNumber?: string,
    public carOwnerEmail?: string,
    public carOwnerDistrictId?: number,
    public carOwnerProvinceId?: number,
    public carOwnerWardId?: number,
    public carOwnerAddressDetail?: string,
    public usingPurposeId?: string,
    public numberPeople?: number,
    public insuranceAmount?: number,
    public hasPassenger: boolean = true,
    public purposeType: number = -1
  ) { }
}
export class CarInsuraneVehicle {
  [key: string]: any;
  constructor(
    public id?: number,

    /** Mục đích sử dụng */
    public type: number = -1,

    /*loại xe*/
    public usingPurposeId?: string,

    /* Trọng tải đăng ký xe*/
    public goodWeightSign?: number,

    /* Số chỗ ngồi đăng ký xe*/
    public seatSign?: number,

    /** Tính phí BH tai nạn lái phụ xe và người ngồi trên xe */
    public enablePassengerFee: boolean = true,

    /** Tính phí BH tai nạn lái phụ xe và người ngồi trên xe */
    public enablePassenger: boolean = false,

    /** Số chỗ ngồi / Tải trọng */
    public feeConfigId?: string,

    /**Tính phí bảo hiểm TNDS (gồm VAT) */
    public mainCost: number = 0,



    /** Số người tham gia */
    public passengerNumber?: number,
    /** Số tiền bảo hiểm  */
    public passengerFeeConfigId?: string,
    /** Phí bảo hiểm  */
    public passengerCost: number = 0,

    /** Tính phí BH hàng hóa trên xe */
    public enabledGoodsFee: boolean = false,
    /** Trọng tải(tấn) */
    public goodsWeight?: number,
    /** Số tiền bảo hiểm */
    public goodsInsuranceAmount?: number,
    /** Loại xe/loại hàng hóa */
    public goodsRatesId?: string,
    /** Phí bảo hiểm  */
    public goodsCost: number = 0,

    public totalDriveSeat: number = 0,

    public totalPeopleSeat: number = 0,

    public responsibilityAmount: number = 0,

    /** Tổng Phí bảo hiểm  */
    public totalCost: number = 0
  ) { }
}

export class CarInsuranceBuyer {
  [key: string]: any;
  constructor(
    public id?: number,
    /** Họ và tên */
    public name?: string,
    /** Số Điện thoại */
    public phoneNumber?: string,
    /** Email */
    public email?: string,
    /** địa chỉ cư trú */
    public addressDetails?: string,
    /** địa chỉ đầy đủ */
    public fullAddress?: string,
    /** id dữ liệu địa chỉ */
    public addressId?: number,
    /** id địa chỉ tỉnh, thành phố */
    public provinceOrCityId?: number,
    /** id địa chỉ quận, huyện */
    public districtId?: number,
    /** id địa chỉ xã, phường */
    public wardId?: number
  ) { }
}

export class CarInsuranceReceiver {
  [key: string]: any;
  constructor(
    public id?: number,
    /** Họ và tên */
    public name?: string,
    /** Số Điện thoại */
    public phoneNumber?: string,
    /** Email */
    public email?: string,
    /** địa chỉ cư trú */
    public addressDetails?: string,
    /** địa chỉ đầy đủ */
    public fullAddress?: string,
    /** id dữ liệu địa chỉ */
    public addressId?: number,
    /** id địa chỉ tỉnh, thành phố */
    public provinceOrCityId?: number,
    /** id địa chỉ quận, huyện */
    public districtId?: number,
    /** id địa chỉ xã, phường */
    public wardId?: number
  ) { }
}

export class CarInsuranceObject {
  [key: string]: any;
  constructor(
    public id?: number,

    public hasPlate: boolean = true,
    /** biển kiểm soát */
    public plateNumber?: string,
    /** số máy */
    public engineNumber?: string,
    /** số khung */
    public machineNumber?: string,
    /** tên chủ xe */
    public ownerName?: string,
    /** năm sản xuất */
    public yearOfProduction?: number,
    /** Email */
    public email?: string,
    /** Số điện thoại */
    public phoneNumber?: string,
    /** địa chỉ cư trú */
    public addressDetails?: string,
    /** địa chỉ đầy đủ */
    public fullAddress?: string,
    /** id dữ liệu địa chỉ */
    public addressId?: number,
    /** địa chỉ liên lạc thường trực */
    public permanentAddressDetails?: string,
    /** id địa chỉ liên lạc thường trực */
    public permanentAddressId?: number,
    /** id địa chỉ tỉnh, thành phố */
    public provinceOrCityId?: number,
    /** id địa chỉ quận, huyện */
    public districtId?: number,
    /** id địa chỉ xã, phường */
    public wardId?: number
  ) { }
}

export class CarInsuranceContractModel extends BaseContractModel {
  [key: string]: any;
  public vehicleContract?: CarInsuraneVehicle = new CarInsuraneVehicle();
  public insuredVehicle?: CarInsuranceObject = new CarInsuranceObject();
  public insuraneBuyer?: CarInsuranceBuyer = new CarInsuranceBuyer();
}

export enum TransportationType {
  Passenger = 0,
  Luggage = 1,
}

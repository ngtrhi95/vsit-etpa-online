import { BaseContractModel } from "./contract.model";

export class CMSContentDetail {
  constructor(
    public title?: string,
    public content?: string,
    public imageUrl?: string
  ) {}
}

export class CMSSiteContent {
  constructor(
    public position?: number,
    public contents: CMSContentDetail[] = new Array<CMSContentDetail>()
  ) {}
}
export class CMSSite {
  constructor(
    public name?: string,
    public shortDescription?: string,
    public backgroundImageUrl?: string,
    public siteContents: CMSSiteContent[] = new Array<CMSSiteContent>()
  ) {}
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
  ) {}
}

export class FeeConfigs {
  [key: string]: any;
  constructor(
    public id?: string,
    public name?: string,
    public cost?: number,
    public minValue?: number,
    public maxValue?: number
  ) {}
}

export class PassengerFeeConfigs {
  [key: string]: any;
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public type?: number,
    public cost?: number,
    public insuranceAmount?: number
  ) {}
}

export class GoodsRates {
  [key: string]: any;
  constructor(public id?: string, public name?: string, public rate?: number) {}
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
  ) {}
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
  ) {}
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
  ) {}
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
  ) {}
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

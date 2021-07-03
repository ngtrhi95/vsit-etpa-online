export class Customer {
    [key: string]: any;
    constructor(
        public id?: number,
        public customerCode?: number,
        /** tên */
        public name?: string,
        /** địa chỉ email */
        public email?: string,
        /** giới tính */
        public sex: number = 0,
        /** số cmnd */
        public idNumber?: number,
        /** ngày cấp cmnd */
        public issueIdNumberDate?: Date,
        /** nơi cấp cmnd */
        public issueIdNumberPlace?: string,
        /** mã giấy khai sinh */
        public birthCertifationNumber?: string,
        /** ngày sinh */
        public dateOfBirth?: Date,
        /** số điện thoại */
        public phoneNumber?: string,
        /** số điện thoại văn phòng */
        public officePhoneNumber?: string,
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
        public wardId?: number,
        /** có là người thụ hưởng hay không */
        public isBeneficiary?: boolean,
    ) {}
}
export class User {
    id?: number;
    userName?: string;
    password?: string;
    salt?: string;
    email?: string;
    isLocked?: boolean;
    createdByUserId?: string;
    createDateTime?: Date;
    lastModifiedByUserId?: string;
    lastModifiedDateTime?: Date;
    isActive?: boolean;
    accessToken?: string;
    fullName?: string;
    mobile?: string;
}
export class ApiResult {
    success?: boolean;
    data?: any;
}
export class SearchConfig {
    keyword?: string;
    pageIndex?: number;
    pageSize?: number;
}

export enum Channel {
    ALL = -1,
    ASBD,
    ONLINE,
    OFFLINE,
    APP
}

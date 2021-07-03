/** thông tin quốc gia */
export class Country {
    /** id châu lục */
    regionId?: number;
    id?: number;
    /** tên quốc gia */
    name?: string;
    /** tên viết tắt*/
    shortName?: number;
    [key: string]: any;
 }
/** thông tin tỉnh thành phố */
export class Province {
    [key: string]: any;
    constructor(
        public id: number,
        /** id quốc gia */
        public countryId: number,
        /** tên tỉnh, thành phố */
        public name: string,
        /** loại đơn vị*/
        public type?: number
    ) {}
}

/** thông tin quận huyện */
export class District {
    [key: string]: any;
    constructor(
        public id: number,
        /** id tỉnh, thành phố */
        public provinceId: number,
        /** tên quận, huyện */
        public name: string,
        /** loại đơn vị*/
        public type?: number
    ) {}
}

/** thông tin xã phường */
export class Ward {
    [key: string]: any;
    constructor(
        public id: number,
        /** id tỉnh, thành phố */
        public districtId: number,
        /** tên quận, huyện */
        public name: string,
        /** loại đơn vị*/
        public type?: number
    ) {}
}

/** toàn bộ thông tin địa chỉ */
export class Address {
    [key: string]: any;
    constructor(
        public id?: number,
        /** địa chỉ cư trú */
        public addressDetails?: string,
        /** địa chỉ cư trú đầy đủ */
        public fullAddress?: string,
        /** tỉnh, thành phố */
        public provinceName?: string,
        /** id tỉnh, thành phố */
        public provinceOrCityId?: number,
        /** quận, huyện */
        public districtName?: string,
        /** id quận, huyện */
        public districtId?: number,
        /** xã, phường */
        public wardName?: string,
        /** id xã, phường */
        public wardId?: number
    ) {}
}

export class FullAddressDetail {
    constructor(public address?: Address, public provinces?: Array<Province>, public districts?: Array<District>, public wards?: Array<Ward>) {
        this.address = {};
        this.provinces = [];
        this.districts = [];
        this.wards = [];
    }
}

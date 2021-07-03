import { Injectable } from '@angular/core';
import { InsurancePackageModel, InsuranceProductForOnline } from '../models/contract.model';

@Injectable()
export class GenLinkService {
    constructor() {}
    genLinkForInsurancePackageArr(arr: Array<InsurancePackageModel>) {
        arr.forEach(pack => {
            if (pack.programCode === 'HGD') {
                pack.classIcon = 'human_icon';
                pack.insuranceGroupUrl = 'human/homeinsurance/';
                pack.paymentUrl = 'human/payment/';
            } else if (pack.programCode === 'N') {
                pack.classIcon = 'house_icon';
                pack.insuranceGroupUrl = 'tskt/houseinsurance/';
                pack.paymentUrl = 'tskt/payment/';
            } else if (pack.programCode === 'X_VC') {
                pack.classIcon = 'moto_icon';
                pack.insuranceGroupUrl = 'vehicle/motoinsurance/';
                pack.paymentUrl = 'vehicle/payment/';
            } else if (pack.programCode === 'X_TNDS') {
                pack.classIcon = 'moto_icon';
                pack.insuranceGroupUrl = 'vehicle/tnds/';
                pack.paymentUrl = 'vehicle/payment/';
            } else if (pack.programCode === 'YTP') {
                pack.classIcon = 'human_icon';
                pack.insuranceGroupUrl = 'human/homeinsurance/';
                pack.paymentUrl = 'human/payment/';
            } else if (pack.programCode === 'LOVE') {
                pack.classIcon = 'human_icon';
                pack.insuranceGroupUrl = 'human/loveinsurance/';
                pack.paymentUrl = 'human/lovepayment/';
            }
        });
        return arr;
    }

    genLinkForInsuranceProduct(arr: Array<InsuranceProductForOnline>) {
        arr.forEach(pack => {
            if (pack.categoryCode === 'HGD') {
                pack.classIcon = 'human_icon';
                pack.insuranceProductUrl = 'human/homeinsurance/';
                pack.paymentUrl = 'human/payment/';
            } else if (pack.categoryCode === 'NHA') {
                pack.classIcon = 'house_icon';
                pack.insuranceProductUrl = 'tskt/houseinsurance/';
                pack.paymentUrl = 'tskt/payment/';
            } else if (pack.categoryCode === 'XMVC') {
                pack.classIcon = 'moto_icon';
                pack.insuranceProductUrl = 'vehicle/motoinsurance/';
                pack.paymentUrl = 'vehicle/payment/';
            } else if (pack.categoryCode === 'TNDS') {
                pack.classIcon = 'moto_icon';
                pack.insuranceProductUrl = 'vehicle/tnds/';
                pack.paymentUrl = 'vehicle/payment/';
            } else if (pack.categoryCode === 'TOPUP') {
                pack.classIcon = 'human_icon';
                pack.insuranceProductUrl = 'human/homeinsurance/';
                pack.paymentUrl = 'human/payment/';
            // }
            // else if (pack.categoryCode === 'TBDD') {
            //     pack.classIcon = 'human_icon';
            //     pack.insuranceProductUrl = 'human/homeinsurance/';
            //     pack.paymentUrl = 'human/payment/';
            } else if (pack.programCode === 'LOVE') {
                pack.classIcon = 'human_icon';
                pack.insuranceProductUrl = 'human/loveinsurance/';
                pack.paymentUrl = 'human/lovepayment/';
            }
        });
        return arr;
    }
}

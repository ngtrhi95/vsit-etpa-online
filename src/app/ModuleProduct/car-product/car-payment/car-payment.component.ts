import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnlineContractService } from "../../../services/onlinecontract.service";
import { VietService } from "../../../services/viet.service";
import { AlertService } from "../../../services/alert.service";
import { CustomerService } from "../../../services/customer.service";
import { LocationService } from "../../../services/location.service";
import { Customer, ApiResult } from "../../../models/general.model";
import { Province, District, Ward, Address } from "../../../models/address.model";
import {
    OrderContractDetail,
    OrderWithShipment,
    PaymentSupplier,
    HumanContractModel,
    BuildingContractModel,
    VehicleContractModel,
    InsuredPeople,
    InsurancePackage,
    InsurancePackageDetail,
    ProgramPackageConfig,
    InsuranceFeeInfoByConfig,
    AddNewOrderModel,
    Shipment,
    ZalopayChannelModel,
    ZalopaySelectedValueModel,
    PaymentMethodConfig,
    MobileContractModel,
    LoveContractModel
} from "../../../models/contract.model";
import { BlockUIService } from "../../../services/blockUI.service";
import { OrderHelper } from "../../../services/order.helper";
import { OnlineGroupType, ContractType } from "../../../models/enum";
import { DeviceDetectorService } from "ngx-device-detector";
import { Regex } from "../../../models/regex";
import { PayooPaymentApi, PublicMiningApi } from "../../../api/apiService";
import { Observable } from "rxjs/Rx";
import { CheckService } from "../../../services/check.service";
import { Validators, AbstractControl, FormGroup, FormBuilder } from "@angular/forms";
import { ImageService } from "../../../services/image.service";
//import {CookieService} from 'angular2-cookie/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
declare var $: any;


@Component({
    selector: "app-car-payment",
    templateUrl: "./car-payment.component.html",
    styleUrls: ["./car-payment.component.css"]
})
export class CarPaymentComponent implements OnInit {
    regex = new Regex();
    billCode = "";
    weekDay = "";
    receiverInfo = new Customer();
    _customerInfo = new Customer();
    _partnerInfo = new Customer();
    provinces = new Array<Province>();
    districts: Array<District> = [];
    wards: Array<Ward> = [];
    orderDetail = new OrderContractDetail();
    onlinePaymentSuppliers: Array<PaymentSupplier> = [];
    zalopayChannels: Array<ZalopayChannelModel> = [];
    selectedOnlineSupplier: PaymentSupplier = null;
    paymentMethod = PaymentMethod;
    useCustomerInfoOrderStatus = false;
    useCustomerInfoOrder_ = 1;
    typeOfProduct: number;
    contractModel: any = {};
    humanModels = new Array<InsuredPeople>();
    buildingAddress = new Address();
    refCode = "";
    prevLink = "";
    insurancePackages: Array<InsurancePackage> = [];
    optionPackages = new InsurancePackage();
    combinePackages = new InsurancePackage();
    hasCombine = false;
    selectedPackages: Array<InsurancePackageDetail> = [];
    insuranceCost: number;
    // discount: number;
    receiverPhoneError = true;
    receiverPhoneDirty = false;
    receiverEmailError = false;
    insuranceFeeInfoByConfig = new InsuranceFeeInfoByConfig();
    paymentSupplierCode = "";
    onlyShowOnlinePaymentMethod = false;
    havingDefaultPaymentMethod = false;
    isMobile = false;
    hasLoaded = false;
    selectedZalopayData = new ZalopaySelectedValueModel();
    zaloPayATMPmcid = 39;
    paymentMethodConfigs: Array<PaymentMethodConfig> = [];
    needToSelectZaloPayCauseFirstMethod = false;
    fromApp = false;
    receiveCert = false;
    uploadUrl = "";
    files = new Array<FileHolder>();
    type = OnlineGroupType;
    receiverForm: FormGroup;
    now = new Date();

    constructor(
        private oh: OrderHelper,
        private route: ActivatedRoute,
        private blockUI: BlockUIService,
        private vs: VietService,
        private alert: AlertService,
        private cus: CustomerService,
        private ls: LocationService,
        private router: Router,
        private onlineContractService: OnlineContractService,
        private deviceService: DeviceDetectorService,
        private miningApis: PublicMiningApi,
        private fb: FormBuilder,
        private imageService: ImageService,
        //private _cookieService:CookieService
    ) {
        this.orderDetail.paymentMethod = this.paymentMethod.BankTransfer;
        this._partnerInfo = null;
    }

    ngOnInit() {
        try {
            this.initReceiverForm();
            this.getProvinces();
            window.scrollTo(0, 0);
            this.isMobile = this.deviceService.isMobile();
            this.oh.order.subscribe(p => {
                if (p) {
                    this.typeOfProduct = p.type;
                    this._customerInfo = p.customer_info;
                    this._customerInfo.provinceOrCityId ? this.getDistricts(this._customerInfo.provinceOrCityId) : "";
                    this._customerInfo.districtId ? this.getWards(this._customerInfo.districtId) : "";
                    if (this.typeOfProduct === OnlineGroupType.grCN) {
                        if (p.partner_info) {
                            this.contractModel = new LoveContractModel();
                            this._partnerInfo = p.partner_info;
                            this.useCustomerInfoOrder_LoveInsu(1);
                        } else {
                            this.contractModel = new HumanContractModel();
                        }
                    } else if (this.typeOfProduct === OnlineGroupType.grTSKT) {
                        this.contractModel = new BuildingContractModel();
                        this.buildingAddress = p.address_info;
                    } else if (this.typeOfProduct === OnlineGroupType.grXCG || this.typeOfProduct === OnlineGroupType.grTNDS) {
                        this.contractModel = new VehicleContractModel();
                    } else if (this.typeOfProduct === OnlineGroupType.grTBDD) {
                        this.contractModel = new MobileContractModel();
                        this.uploadUrl = this.miningApis.uploadImages + p.base_contract.insuredMobileDevice.IMEI;
                        this.files = p.files;
                        this.insuranceCost = p.base_contract.totalInsuranceCost;
                    }
                    this.contractModel = p.base_contract;
                    this.orderDetail.takingPaperCertification = this.contractModel.takingPaperCertification;
                    this.oh.currentPackage.subscribe(pack => {
                        if (pack) {
                            this.insurancePackages = pack.package;
                            this.checkHasCombine();
                            this.refCode = pack.refCode;
                            this.prevLink = pack.prev_link;
                        }
                    });
                    setTimeout(() => {
                        this.mapSelectedPackageOfContractModel();
                    }, 500);
                    setTimeout(() => {
                        this.calInsuranceCost();
                    }, 1000);
                }
            });

            this.route.queryParams.subscribe(params => {
                this.paymentSupplierCode = params["paymentsupplier"] || null;
                if (this.paymentSupplierCode != null) {
                    this.onlyShowOnlinePaymentMethod = true;
                    this.havingDefaultPaymentMethod = true;
                }
                this.fromApp = params["fromApp"] == "true";
                this.receiveCert = params["receiveCert"] == "true";
            });
            this.getPaymentMethodConfigs();
            // this.getOnlinePaymentSuppliers();
            this.hasLoaded = true;
        } catch (err) {
            console.log(err);
        }
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        if (this.hasLoaded && (this.typeOfProduct != OnlineGroupType.grTBDD && this.optionPackages.insurancePackageDetails.length === 0)) {
            // this.blockUI.stop();
            if (this.fromApp) {
                this.router.navigate(["/app-product"]);
            } else {
                this.router.navigate(["/home"]);
            }
        }
    }
    initReceiverForm() {
        this.receiverForm = this.fb.group({
            name: ["", [Validators.required, stringName(2)]],
            phoneNumber: ["", [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
            email: ["", [Validators.pattern(this.regex.emailRegex)]],
            fullAddress: this.fb.group({
                addressDetails: [{ value: "" }, [Validators.required]],
                provinceOrCityId: [{ value: "" }, [Validators.required]],
                districtId: [{ value: "" }, [Validators.required]],
                wardId: [{ value: "" }, [Validators.required]]
            })
        });
    }

    rollBack() {
        this.oh.select(this.insurancePackages, this.prevLink, this.refCode);
        this.router.navigate([this.vs.cleanParamsInURL(this.prevLink)], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink) });
        // this.router.navigate([this.prevLink]);
    }

    checkHasCombine() {
        this.hasCombine = this.insurancePackages.length > 1;
        this.splitOptionPackages();
    }

    splitOptionPackages() {
        this.insurancePackages.forEach((program, index) => {
            program.insurancePackageDetails.forEach(p => {
                if (p.isMainPackage) {
                    this.optionPackages = this.insurancePackages[index];
                } else {
                    this.combinePackages = this.insurancePackages[index];
                }
            });
        });
    }

    mapSelectedPackageOfContractModel() {
        if (this.insurancePackages && this.contractModel) {
            this.contractModel.programPackageConfigs.forEach(e => {
                this.selectedPackages.push(this.optionPackages.insurancePackageDetails.find(p => p.insuranceProgramPackageId === e.insuranceProgramPackageId));
                this.selectedPackages.push(this.combinePackages.insurancePackageDetails.find(p => p.insuranceProgramPackageId === e.insuranceProgramPackageId));
            });
            this.selectedPackages = this.vs.cleanArray(this.selectedPackages);
        }
    }

    selectPaymentOption(paymentMethod, supplier: PaymentSupplier, channel: ZalopayChannelModel = null) {
        this.orderDetail.paymentMethod = paymentMethod;
        this.selectedOnlineSupplier = supplier;
        if (supplier != null && supplier !== undefined) {
            this.orderDetail.paymentSupplierId = supplier.id;
        } else {
            this.orderDetail.paymentSupplierId = null;
        }

        if (channel != null && channel !== undefined) {
            this.selectedZalopayData.channel = channel;
            this.selectedZalopayData.bankCode = channel.banks[0].bankCode;
        }
    }

    calInsuranceCost() {
        if (this.selectedPackages.length > 0) {
            const arrProgramPackageConfig: Array<ProgramPackageConfig> = [];
            for (let i = 0; i < this.selectedPackages.length; i++) {
                const selectedPackage = this.selectedPackages[i];
                const packageConfig: ProgramPackageConfig = {
                    insuranceProgramPackageId: selectedPackage.insuranceProgramPackageId,
                    numberOfInsuranceObject: selectedPackage.numberOfInsuranceObject
                };
                arrProgramPackageConfig.push(packageConfig);
            }
            this.insuranceFeeInfoByConfig.programPackageConfigs = arrProgramPackageConfig;
            this.onlineContractService.calculatorInsuranceFeeByConfig(this.insuranceFeeInfoByConfig).subscribe(res => {
                if (res && res.success) {
                    this.insuranceCost = res.data.totalInsuranceCost;
                    //  + res.data.totalDiscount;
                    // this.discount = res.data.totalInsuranceCost;
                }
            });
        }
    }

    // abc() {
    //     console.log(this.orderDetail.paymentSupplierId);
    //     console.log(this.selectedZalopayData);
    // }

    getOnlinePaymentSuppliers() {
        try {
            this.blockUI.start("Đang xử lý...");
            this.onlineContractService.getAllPaymentSuppliers().subscribe(result => {
                if (result.success) {
                    if (this.havingDefaultPaymentMethod) {
                        for (let i = 0; i < result.data.length; i++) {
                            if (result.data[i].code === this.paymentSupplierCode) {
                                this.onlinePaymentSuppliers.push(result.data[i]);
                                this.selectPaymentOption(this.paymentMethod.OnlinePayment, result.data[i]);
                            }
                        }
                    } else {
                        this.onlinePaymentSuppliers = result.data;
                    }
                    const shouldLoadZalopayChannels = this.paymentSupplierCode == null || this.paymentSupplierCode === "" || this.paymentSupplierCode === "ZALOPAY";
                    if (shouldLoadZalopayChannels) {
                        this.getZalopayChannels();
                    } else {
                        this.blockUI.stop();
                    }
                } else {
                    console.log(result.data);
                    this.blockUI.stop();
                }
            });
        } catch (error) {
            console.log(error);
            this.blockUI.stop();
        }
    }

    getPaymentMethodConfigs() {
        try {
            this.blockUI.start("Đang xử lý hình thức thanh toán...");
            const onlineChanel = 1;
            this.onlineContractService.getPaymentMethodConfigBaseOnCompanyAndChannel(onlineChanel, this.paymentSupplierCode).subscribe(result => {
                if (result.success) {
                    this.paymentMethodConfigs = result.data;
                    if (this.paymentMethodConfigs.length > 0) {
                        // this.orderDetail.paymentMethod = this.paymentMethodConfigs[0].paymentMethod;
                        const firstPaymentMethod = this.paymentMethodConfigs[0];
                        if (firstPaymentMethod.paymentSupplierId != null && firstPaymentMethod.paymentSupplier.code === "ZALOPAY") {
                            // do nothing.
                            this.needToSelectZaloPayCauseFirstMethod = true;
                        } else {
                            this.selectPaymentOption(firstPaymentMethod.paymentMethod, firstPaymentMethod.paymentSupplier);
                        }
                        // this.selectedPaymentMethodIndex = 0;
                    }

                    const shouldLoadZalopayChannels = this.paymentSupplierCode == null || this.paymentSupplierCode === "" || this.paymentSupplierCode === "ZALOPAY";
                    if (shouldLoadZalopayChannels) {
                        this.getZalopayChannels();
                    }
                } else {
                    console.log(result.data);
                }
                this.blockUI.stop();
            });
        } catch (error) {
            console.log(error);
            this.blockUI.stop();
        }
    }

    getZalopayChannels() {
        try {
            this.blockUI.start("Đang tải dữ liệu...");
            this.onlineContractService.getZalopayChannels().subscribe(result => {
                if (result.success) {
                    this.zalopayChannels = result.data;
                    if (this.needToSelectZaloPayCauseFirstMethod) {
                        const firstPaymentMethod = this.paymentMethodConfigs[0];
                        this.selectPaymentOption(firstPaymentMethod.paymentMethod, firstPaymentMethod.paymentSupplier, this.zalopayChannels[0]);
                    }
                } else {
                    console.log(result.data);
                }
                this.blockUI.stop();
            });
        } catch (error) {
            console.log(error);
            this.blockUI.stop();
        }
    }

    useCustomerInfoOrder(event) {
        if (event.target.checked) {
            this.receiverInfo = this.vs.isClonedOf(this._customerInfo);
            setTimeout(() => {
                this.getDistricts(this.receiverInfo.provinceOrCityId);
                this.getWards(this.receiverInfo.districtId);
            }, 1);
        } else {
            // this.receiverInfo = new Customer();
        }
        this.useCustomerInfoOrderStatus = event.target.checked;
        this.receiverForm.get("name").updateValueAndValidity();
        this.receiverForm.get("phoneNumber").updateValueAndValidity();
        this.receiverForm.get("email").updateValueAndValidity();
        this.receiverForm.get("fullAddress").updateValueAndValidity();
    }
    useCustomerInfoOrder_LoveInsu(event) {
        // if (event == this.useCustomerInfoOrder_) {
        //     this.useCustomerInfoOrder_ = 0;
        // } else
        if (event == 1) {
            this.useCustomerInfoOrder_ = 1;
            this.receiverInfo = this.vs.isClonedOf(this._customerInfo);
            setTimeout(() => {
                this.getDistricts(this.receiverInfo.provinceOrCityId);
                this.getWards(this.receiverInfo.districtId);
            }, 1);
        } else if (event == 2) {
            this.useCustomerInfoOrder_ = 2;
            this.receiverInfo = this.vs.isClonedOf(this._partnerInfo);
            setTimeout(() => {
                this.getDistricts(this.receiverInfo.provinceOrCityId);
                this.getWards(this.receiverInfo.districtId);
            }, 1);
        }
        this.receiverForm.get("name").disable();
        this.receiverForm.get("phoneNumber").disable();
        this.receiverForm.get("name").updateValueAndValidity();
        this.receiverForm.get("phoneNumber").updateValueAndValidity();
        this.receiverForm.get("email").updateValueAndValidity();
    }
    confirmCheckOut_confirmPaypost() {
        if (this.orderDetail.paymentMethod == PaymentMethod.Cash) {
            // TODO: hiện thông báo khi chọn thanh toán qua paypost
            this.alert.confirm_Paypost().then(_ => {
                if (_) {
                    this.confirmCheckout();
                }
            });
        } else {
            this.confirmCheckout();
        }
    }

    async confirmCheckout() {
        try {
            if (!this.checkValidInfoShipment()) {
                this.alert.warning("Thông tin giao hàng không hợp lệ");
                return;
            }
            this.blockUI.start("Đang ghi nhận đơn hàng");
            const orderData = new AddNewOrderModel();
            orderData.ContractOwnerInfo = this._customerInfo;
            orderData.ContractOwnerInfo.provinceOrCityId == null ? (orderData.ContractOwnerInfo.provinceOrCityId = undefined) : "";
            orderData.Order = this.orderDetail;
            orderData.Order.shipment = new Shipment();
            orderData.Order.shipment.receiverName = this.receiverInfo.name;
            orderData.Order.shipment.receiverPhone = this.receiverInfo.phoneNumber;
            orderData.Order.shipment.receiverEmail = this.receiverInfo.email;
            orderData.Order.shipment.addressDetails = this.receiverInfo.addressDetails;
            orderData.Order.shipment.provinceOrCityId = this.receiverInfo.provinceOrCityId;
            orderData.Order.shipment.districtId = this.receiverInfo.districtId;
            orderData.Order.shipment.wardId = this.receiverInfo.wardId;

            if (this.typeOfProduct === OnlineGroupType.grTNDS || this.typeOfProduct === OnlineGroupType.grXCG) {
                orderData.ContractType = ContractType.VEHICLE_CONTRACT;
                orderData.VehicleContract = this.contractModel;
            } else if (this.typeOfProduct === OnlineGroupType.grCN) {
                orderData.ContractType = ContractType.HUMAN_CONTRACT;
                orderData.HumanContract = this.contractModel;
                this._partnerInfo ? (orderData.PartnerInfo = this._partnerInfo) : "";
            } else if (this.typeOfProduct === OnlineGroupType.grTSKT) {
                orderData.ContractType = ContractType.BUILDING_CONTRACT;
                orderData.BuildingContract = this.contractModel;
                orderData.BuildingAddressInfo = this.buildingAddress;
            } else if (this.typeOfProduct === OnlineGroupType.grTBDD) {
                orderData.ContractType = ContractType.MOBILE_DEVICE_CONTRACT;
                orderData.MobileDeviceContract = this.contractModel;
                await this.uploadImages();
            }
            //doc du lieu aff tu cookie
            // var affNetwork = this._cookieService.get("_aff_network");
            // var affSid =  this._cookieService.get("_aff_sid");
            // orderData.AffNetwork = affNetwork;
            // orderData.AffSid = affSid;
            orderData.AffNetwork =  Cookie.get('_aff_network');
            orderData.AffSid =  Cookie.get('_aff_sid');
            this.processAddNewOrderWithRelatedData(orderData);
        } catch (err) {
            console.log(err);
            this.blockUI.stop();
            this.alert.warning("Xin lỗi quý khách. Hệ thống đang gặp sự cố. Chúng tôi đang khắc phục. Xin quý khách vui lòng thử lại sau.");
        }
    }

    processAddNewOrderWithRelatedData(data: AddNewOrderModel) {
        try {
            this.onlineContractService.addNewOrderWithRelatedData(data, this.refCode).subscribe(result => {
                if (result.success) {
                    if (this.orderDetail.paymentMethod === this.paymentMethod.OnlinePayment) {
                        this.processForOnlinePayment(result.data.id);
                    } else {
                        this.blockUI.stop();
                        this.oh.insuranceOrder.next(null);
                        this.oh.package.next(null);
                        const nextUrl = data.Order.paymentMethod == PaymentMethod.Cash ? "product/contract-confirm/" + result.data.code : "product/order-confirm/" + result.data.code;
                        this.alert.success("Xác nhận thành công!").then(res => {
                            this.router.navigate([nextUrl], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink) });
                        });
                    }
                } else {
                    this.blockUI.stop();
                    this.alert.error("Xin lỗi quý khách. Hệ thống đang gặp sự cố. Chúng tôi đang khắc phục. Xin quý khách vui lòng thử lại sau.\n" + (result.data == "IMEI_NOT_AVAILABLE_TO_CREATE" ? "Số IMEI đã bị trùng" : ""));
                }
            });
        } catch (err) {
            this.blockUI.stop();
            console.log(err);
            this.alert.warning("Đã có lỗi sảy ra. Rất tiếc về sự bất tiện này!");
        }
    }

    // please add other online - suppliers if we add more payment methods
    processForOnlinePayment(orderId: number) {
        this.blockUI.start("Ghi nhận đơn hàng thành công, đang đợi chuyển đến trang thanh toán");
        switch (this.selectedOnlineSupplier.code) {
            case "AIRPAY":
                this.onlineContractService.getLandingUrlFromAirpay(orderId).subscribe(getUrlResult => {
                    if (getUrlResult.success) {
                        window.location.href = getUrlResult.data;
                        if (this.havingDefaultPaymentMethod) {
                            this.blockUI.stop();
                        }
                    } else {
                        this.alert.error("Có lỗi từ nhà cung cấp thanh toán");
                        this.blockUI.stop();
                    }
                    // this.blockUI.stop();
                });
                break;
            case "MOMO":
                this.onlineContractService.getPayUrlFromMomo(orderId).subscribe(getUrlResult => {
                    if (getUrlResult.success) {
                        // console.log(getUrlResult.data);
                        if (this.isMobile) {
                            if (this.havingDefaultPaymentMethod) {
                                window.location.href = getUrlResult.data.deeplinkWebInApp;
                            } else {
                                window.location.href = getUrlResult.data.deeplink;
                            }

                            setTimeout(function() {
                                window.location.href = "/";
                            }, 500);
                        } else {
                            window.location.href = getUrlResult.data.payUrl;
                        }
                    } else {
                        this.blockUI.stop();
                        this.alert.error("Có lỗi từ nhà cung cấp thanh toán");
                    }
                });
                break;

            case "ZALOPAY":
                this.onlineContractService.getOrderDataForZalolay(orderId, this.selectedZalopayData.bankCode).subscribe(result => {
                    if (result.success) {
                        window.location.href = result.data.createOrderUrl;
                    } else {
                        this.blockUI.stop();
                        this.alert.error("Có lỗi từ nhà cung cấp thanh toán");
                    }
                });
                break;
            case "PAYOO":
                this.onlineContractService.getPayUrlFromPayoo(orderId).subscribe(getUrlResult => {
                    if (getUrlResult.success) {
                        window.location.href = getUrlResult.data;
                    } else {
                        this.blockUI.stop();
                        this.alert.error("Có lỗi từ nhà cung cấp thanh toán");
                    }
                });
                break;
            case "APPAY":
                this.onlineContractService.getPayUrlFromAppay(orderId).subscribe(getUrlResult => {
                    if (getUrlResult.success) {
                        window.location.href = getUrlResult.data;
                    } else {
                        this.blockUI.stop();
                        this.alert.error("Có lỗi từ nhà cung cấp thanh toán");
                    }
                });
                break;
        }
    }

    checkValidInfoShipment() {
        if (this.orderDetail.paymentMethod == this.paymentMethod.COD || this.orderDetail.takingPaperCertification) {
            return this.receiverForm.valid;
        }
        return true;
    }

    async getProvinces() {
        try {
            await this.ls.getProvinces().subscribe(resultProvince => {
                if (resultProvince.success) {
                    this.provinces = this.vs.arrayOrder(resultProvince.data, "name");
                } else {
                    console.log(resultProvince.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async getDistricts(provinceId) {
        try {
            await this.ls.getDistrictsByProvinceId(provinceId).subscribe(resultDistrict => {
                if (resultDistrict.success) {
                    this.districts = this.vs.arrayOrder(resultDistrict.data, "name");
                    if (!this.districts.find(d => d.id == this.receiverInfo.districtId)) {
                        this.receiverInfo.districtId = undefined;
                        this.receiverInfo.wardId = undefined;
                    }
                } else {
                    console.log(resultDistrict.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async getWards(districtId) {
        try {
            await this.ls.getWardsByDistrictId(districtId).subscribe(resultWard => {
                if (resultWard.success) {
                    this.wards = this.vs.arrayOrder(resultWard.data, "name");
                    if (!this.wards.find(d => d.id == this.receiverInfo.wardId)) {
                        this.receiverInfo.wardId = undefined;
                    }
                } else {
                    console.log(resultWard.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    isFullAddress() {
        if (this.receiverInfo.provinceOrCityId && this.receiverInfo.districtId && this.receiverInfo.wardId) {
            return true;
        }
        if (!this.receiverInfo.provinceOrCityId && !this.receiverInfo.districtId && !this.receiverInfo.wardId && !this.receiverInfo.addressDetails) {
            return true;
        }
        return false;
    }
    //
    async uploadImages() {
        this.blockUI.start("Đang tải hình ảnh lên...");
        let okAll = true;
        let index = 0;
        for (; index < this.files.length; index++) {
            var result = await this.imageService.postImageAsync(this.uploadUrl, this.files[index].file);
            okAll = okAll && result.status == 200 && result.json().success;
        }
        if (okAll) this.blockUI.stop();
    }
}

export function stringName(minWord) {
    return (c: AbstractControl) => {
        let temp = c.value;
        if (
            temp &&
            temp.split(" ").filter(_ => {
                return _;
            }).length < minWord
        ) {
            return { nameInvalid: true };
        }
        return null;
    };
}

enum PaymentMethod {
    COD = 0,
    AuthorizedCollection,
    OnlinePayment,
    BankTransfer,
    NotDefined,
    Cash
}
export class FileHolder {
    public pending: boolean = false;
    public uploaded: boolean = false;
    public succeeded: boolean = false;
    public type: string = "";
    public srcView: string = "";
    public createdBy: string = "";
    public createdDate: Date = null;
    public invalidFileFormat: boolean = false;
    public invalidFileSize: boolean = false;
    public invalidFileSizeMessage: string = "";
    public serverResponse: { status: number; response: any };

    constructor(public src: string, public file: File) {}
}

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
import { CalcFeeDto, CarInsuranceContractModel, CarInsuranceOrder } from "../../../models/car-insurance.model";
import { CarInsuranceService } from "../../../services/car-insurance.service";
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
    contractModel = new CarInsuranceOrder();
    humanModels = new Array<InsuredPeople>();
    buildingAddress = new Address();
    refCode = "";
    prevLink = "";
    insurancePackages: Array<InsurancePackage> = [];
    optionPackages = new InsurancePackage();
    combinePackages = new InsurancePackage();
    hasCombine = false;
    selectedPackages: Array<InsurancePackageDetail> = [];
    finalInsuranceCost: number;
    civilLiabilitionInsuranceCost: number;
    passengerInsuranceCost: number;
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

    isCheckRangeTime: boolean = false;

    constructor(
        private oh: OrderHelper,
        private route: ActivatedRoute,
        private blockUI: BlockUIService,
        private vs: VietService,
        private alert: AlertService,
        private cus: CustomerService,
        private ls: LocationService,
        private cis: CarInsuranceService,
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
                    this.isCheckRangeTime = p.customer_info?.isCheckRangeTime;
                    this._customerInfo.provinceOrCityId ? this.getDistricts(this._customerInfo.provinceOrCityId) : "";
                    this._customerInfo.districtId ? this.getWards(this._customerInfo.districtId) : "";
                    this.contractModel =  p.base_contract;
                    this.orderDetail.takingPaperCertification = this.contractModel.takingPaperCertification;
                    this.oh.currentPackage.subscribe(pack => {
                        if (pack) {
                            this.insurancePackages = pack.package;
                            this.checkHasCombine();
                            this.refCode = pack.refCode;
                            this.prevLink = pack.prev_link;
                        }
                    });
                    // setTimeout(() => {
                    //     this.mapSelectedPackageOfContractModel();
                    // }, 500);
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

    ngAfterViewInit() {
        if (this.hasLoaded && this.typeOfProduct != OnlineGroupType.grOto) {
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
        var calcFeeDto: CalcFeeDto = new CalcFeeDto(this.contractModel);

        try {
          this.cis.getMainCost(calcFeeDto).subscribe(result => {
            if (result.data != null) {
              this.civilLiabilitionInsuranceCost = result.data.civilLiabilitionInsuranceCost;
              this.passengerInsuranceCost = result.data.passengerInsuranceCost;
              this.finalInsuranceCost = result.data.finalInsuranceCost;
            } else {
              console.log(result.data);
            }
          });
        } catch (error) {
          console.log(error);
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
            //doc du lieu aff tu cookie
            // orderData.AffNetwork =  Cookie.get('_aff_network');
            // orderData.AffSid =  Cookie.get('_aff_sid');
            this.processAddNewOrderWithRelatedData();
        } catch (err) {
            console.log(err);
            this.blockUI.stop();
            this.alert.warning("Xin lỗi quý khách. Hệ thống đang gặp sự cố. Chúng tôi đang khắc phục. Xin quý khách vui lòng thử lại sau.");
        }
    }

    async processAddNewOrderWithRelatedData() {
        try {
            await this.cis.createOrder(this.contractModel).subscribe(result => {
                if (result.code == "200") {
                    if (this.orderDetail.paymentMethod === this.paymentMethod.OnlinePayment) {
                        this.processForOnlinePayment(result.data.id);
                    } else {
                        this.blockUI.stop();
                        this.oh.insuranceOrder.next(null);
                        this.oh.package.next(null);
                        const nextUrl = this.contractModel.paymentMethod == PaymentMethod.Cash ? "product/contract-confirm/" + result.data.code : "product/order-confirm/" + result.data.code;
                        this.alert.success("Xác nhận thành công!").then(res => {
                            this.router.navigate([nextUrl], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink) });
                        });
                    }
                }
                else {
                    this.blockUI.stop();
                    this.alert.error("Xin lỗi quý khách. Hệ thống đang gặp sự cố. Chúng tôi đang khắc phục. Xin quý khách vui lòng thử lại sau.\n");
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

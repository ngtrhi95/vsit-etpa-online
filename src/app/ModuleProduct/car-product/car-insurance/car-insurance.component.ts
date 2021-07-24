import { Component, OnInit, ViewChild } from "@angular/core";
import { OnlineContractService } from "../../../services/onlinecontract.service";
import { InsurancePackage, InsurancePackageDetail, InsuredVehicle, InsuranceFeeInfoByConfig, ProgramPackageConfig } from "../../../models/contract.model";
import { VietService } from "../../../services/viet.service";
import { Channel } from "../../../models/general.model";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderHelper } from "../../../services/order.helper";
import { AbstractControl, Validators, FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { Regex } from "../../../models/regex";
import { Province, District, Ward } from "../../../models/address.model";
import { LocationService } from "../../../services/location.service";
import { CarInsuranceBuyer, CarInsuranceContractModel, CarInsuranceObject, CarInsuranceReceiver, CarInsuraneVehicle, FeeConfigs, GoodsRates, PassengerFeeConfigs, TransportationType, UsingPurposes } from "../../../models/car-insurance.model";
import { OWL_DATE_TIME_FORMATS } from "ng-pick-datetime";
import { PublicMiningApi } from "../../../api/apiService";
import { CMSSite } from "../../../models/car-insurance.model";
import { CarInsuranceService } from "../../../services/car-insurance.service";
import { CMSSiteCode } from "../../../models/car-insurance-enum";
import { OnlineGroupType } from "../../../models/enum";

export const MY_MOMENT_FORMATS = {
  parseInput: "DD/MM/YYYY",
  fullPickerInput: "DD/MM/YYYY",
  datePickerInput: "DD/MM/YYYY",
  timePickerInput: "HH:mm:ss",
  monthYearLabel: "MMM YYYY",
  dateA11yLabel: "LL",
  monthYearA11yLabel: "MMMM YYYY"
};

@Component({
  selector: 'app-car-insurance',
  templateUrl: './car-insurance.component.html',
  styleUrls: ['./car-insurance.component.css'],
  providers: [ 
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ]
})
export class CarInsuranceComponent implements OnInit {
  defaultMinPassengerNumber = 2;
  defaultMaxPassengerNumber = 4;

  today = new Date();
  insurancePackages: Array<InsurancePackage> = [];
  optionPackages = new InsurancePackage();
  combinePackages = new InsurancePackage();
  selectedPackages: Array<InsurancePackageDetail> = [];
  insuranceFeeInfoByConfig = new InsuranceFeeInfoByConfig();
  effectiveDate = new Date();
  minEffectiveDate = new Date();
  expireDate = new Date();
  insuranceCost: number;
  // discount: number;
  customerInfo = new CarInsuranceBuyer();
  vehicleContractModel = new CarInsuranceContractModel();
  inProcess: boolean = false;
  refCode: string = "";
  cmsInfo: CMSSite = new CMSSite();
  image: string = "";
  hasCombine = false;
  prevLink = "";
  grId: number;
  currentStep: number = 1;
  paymentSupplierCode: string = "";
  groupName: string = "";
  checkedPromise = false;
  fromApp: any;
  //
  receiveCertificate = false;
  carForm: FormGroup;
  regex = new Regex();
  maskYear = new Regex().maskYear;
  maskPlate = new Regex().maskPlate;
  yearsOfProduct = [];
  //
  provinces = new Array<Province>();
  districts: Array<District> = [];
  wards: Array<Ward> = [];

  provincesCavet = new Array<Province>();
  districtsCavet: Array<District> = [];
  wardsCavet: Array<Ward> = [];

  provincesReceiver = new Array<Province>();
  districtsReceiver: Array<District> = [];
  wardsReceiver: Array<Ward> = [];

  customerForm: FormGroup;
  carInsuranceObjectForm: FormGroup;
  receiverForm: FormGroup;

  //
  usingPurposes = new Array<UsingPurposes>(); // list loai xe
  feeConfigs = new Array<FeeConfigs>();
  passengerFeeConfigs = new Array<PassengerFeeConfigs>();
  goodsRates = new Array<GoodsRates>();
  surchargeConfigs = []; // list muc trach nhiem

  //
  selectedUsingPurpose = new UsingPurposes();
  selectedFeeConfig = new FeeConfigs();
  selectedPassengerFeeConfig = new PassengerFeeConfigs();
  selectedGoodsRate = new GoodsRates();

  enabledGoodsFeeControl = false;

  vehiclesInfo = new CarInsuraneVehicle();
  carInsuranceObject = new CarInsuranceObject();
  receiverInfo = new CarInsuranceReceiver();

  uploadUrl: string;

  minValuePassenger?: number;
  maxValuePassenger?: number;
  minValueGoodsWeight?: number;
  maxValueGoodsWeight?: number;

  //new condition
  isCheckRangeTime = false;

  constructor(
    private fb: FormBuilder,
    private oh: OrderHelper,
    private oc: OnlineContractService,
    private vs: VietService,
    private route: ActivatedRoute,
    private router: Router,
    private ls: LocationService,
    private cis: CarInsuranceService,
    private miningApis: PublicMiningApi
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.grId = +params["groupId"];
    });
    this.route.queryParams.subscribe(params => {
      this.paymentSupplierCode = params["paymentsupplier"] || null;
      this.fromApp = params["fromApp"] == "true";
    });
    this.initFormCarInsurance();
    this.initFormCustomer();
    this.initCarInsuranceObjectForm();
    this.createYearOfProduct();
    this.getProvinces();
    this.getMasterData();
    this.selectedPackages = new Array<InsurancePackageDetail>();
    this.today = this.vs.nowDate();
    this.effectiveDate = this.vs.next_N_Date(2);
    this.minEffectiveDate = this.vs.next_N_Date(2);
    this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
    this.insuranceFeeInfoByConfig.contractType = 4;
    this.insuranceCost = 0;
    this.uploadUrl = this.miningApis.uploadImages;
    // this.discount = 0;
    console.log(this.oh.infoOfProduct);

    this.getSiteContent();
    this.oh.infoOfProduct.subscribe(p => {

      if (p) {
        this.refCode = p.refCode;
        this.prevLink = p.prev_link;
        // this.cmsInfo = p.cms_info;
        // this.image = `url(${this.cmsInfo.backgroundImageUrl})`;
      }

      if (!this.cmsInfo.name) {

      }
    });
    this.oc.getInsuraceProductOptionsDetailWithChannel(this.grId, Channel.ONLINE).subscribe(res => {
      if (res && res.success) {
        this.insurancePackages = this.vs.arrayOrder(res.data.insuranceProductOptionDetails, "programCode", false);
        this.receiveCertificate = res.data.receiveCertificate;
        this.checkHasCombine();
        this.autoCheckPackageDefault();
      }
    });

    this.oh.order.subscribe(p => {
      if (p) {
        this.customerInfo = p.customer_info;
        this.vehicleContractModel = p.base_contract;
        this.vehiclesInfo = this.vehicleContractModel.insuredVehicles[0];
      }
    });

    this.oc.getInsuranceProductById(this.grId).subscribe(res => {
      if (res && res.success) {
        this.groupName = res.data.name;
        this.vehicleContractModel.baseContract.insuranceProductId = res.data.id;
        this.vehicleContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
      }
    });
  }

  async getMasterData() { // init master data of fee config
    try {
      console.log('vao')
      this.cis.getMasterData().subscribe(result => {
        if (result.data) {
          this.usingPurposes = this.vs.arrayOrder(result.data.usingPurposes, "name");
          this.passengerFeeConfigs = this.vs.arrayOrder(result.data.passengerFeeConfigs, "name");
         
          // add option another in surcharge fee config
          this.surchargeConfigs.push( {id:'0', name:'Khác'});

          // if (this.usingPurposes.length > 0) {
          //   this.selectedUsingPurpose = this.usingPurposes[0];
          //   this.vehiclesInfo.usingPurposeId = this.selectedUsingPurpose.id;
          //   this.feeConfigs = this.selectedUsingPurpose.feeConfigs;
          //   setTimeout(() => {
          //     if (this.feeConfigs.length > 0) {
          //       this.selectedFeeConfig = this.feeConfigs[0];
          //       this.vehiclesInfo.feeConfigId = this.selectedFeeConfig.id;
          //       this.vehiclesInfo.passengerNumber = this.selectedFeeConfig.minValue;
          //       this.vehiclesInfo.goodsWeight = this.selectedFeeConfig.minValue;
          //     }
          //   }, 500);
          // }
          // if (this.passengerFeeConfigs.length > 0) {
          //   this.selectedPassengerFeeConfig = this.passengerFeeConfigs[0];
          //   this.vehiclesInfo.passengerFeeConfigId = this.selectedPassengerFeeConfig.id;
          // }
        } else {
          console.log('error getMasterData api -> ' + result.data);
        }
      });
    } catch (error) {
      console.log('error getMasterData ->' + error);
    }
  }

  getSiteContent() { // get site content
    this.cis.getSiteContents(CMSSiteCode.CAR_INSURANCE).subscribe(res => {
      if (res) {
        this.cmsInfo = res.data;
        this.image = `url(${this.cmsInfo.backgroundImageUrl})`;
      }
    });
  }

  loadCarTypeByUsingPurposeId(usingPurposeType) { //load car type by using purpose
    console.log('loadCarTypeByUsingPurposeId');
    console.log(usingPurposeType)
  }

  initFormCarInsurance() { // init form car insurance
    this.carForm = this.fb.group({
      // ownerName: ["", [Validators.required, stringName(2)]],
      // branchCode: ["", Validators.required],
      // typeNumber: ["", Validators.required],
      // yearOfProduction: ["", [Validators.required, yearStringValid(18, true)]],
      // hasPlate: [""],
      usingPurposeId: ["", Validators.required],
      feeConfigId: ["", Validators.required],
      mainCost: [""],

      seatSign: ["", Validators.required],
      goodWeightSign: ["", Validators.required],
      
      passengerNumber: [""],
      passengerFeeConfigId: [""],
      passengerCost: [""],

      goodsWeight: [""],
      goodsInsuranceAmount: [""],
      goodsRatesId: [""],
      goodsCost: [""],

      totalDriveSeat: ['', Validators.required],
      totalPeopleSeat: ['', Validators.required],    
      responsibilityAmount: ['']
      // likeCustomerInfo: [{ value: "", disabled: this.disabled && (this.customerInfo.name == "" || this.customerInfo.name == undefined) }]
    });

    this.carForm.valueChanges.subscribe(res => {
      if (this.carForm.get("mainCost") || this.carForm.get("passengerCost") || this.carForm.get("goodsCost")) {
        this.calculatorTotalCost();
      }
    });
  }

  checkHasCombine() {
    this.hasCombine = this.insurancePackages.length > 1;
    this.splitOptionPackages();
  }
  splitOptionPackages() {
    this.combinePackages = this.insurancePackages.find(s => !s.isMainPackage);
    this.optionPackages = this.insurancePackages.find(s => s.isMainPackage);
    if (this.optionPackages.requiredTakingPaperCertificate) {
      this.vehicleContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
      this.initReceiverForm();
    }
  }
  nextToPriceTab() {
    this.currentStep++;
    window.scrollTo(0, 0);
  }
  nextToConfirm() {
    this.mixAddressDetail();
    window.scrollTo(0, 0);
    this.currentStep++;
  }
  nextStep() {
    this.currentStep++;
    window.scrollTo(0, 0);
    this.vehicleContractModel.programPackageConfigs = new Array<ProgramPackageConfig>();
    this.vehicleContractModel.insuredVehicles = new Array<InsuredVehicle>();
    for (let i = 0; i < this.selectedPackages.length; i++) {
      let tempPackagesConfig = new ProgramPackageConfig();
      tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
      tempPackagesConfig.numberOfInsuranceObject = this.selectedPackages[i].numberOfInsuranceObject;
      this.vehicleContractModel.programPackageConfigs.push(tempPackagesConfig);
    }
    this.vehicleContractModel.baseContract.effectiveDate = this.effectiveDate;
    this.vehicleContractModel.baseContract.expireDate = this.expireDate;
    this.vehicleContractModel.insuredVehicles.push(this.vehiclesInfo);
    this.vehicleContractModel.baseContract.isOnlineContract = true;
    this.vehicleContractModel.baseContract.contractType = 2; // hợp đồng bảo hiểm xe máy
    this.vehicleContractModel.baseContract.formOfParticipation = 1; // hợp đồng gốc
    this.oh.insuranceDetailOrder(OnlineGroupType.grXCG, this.vehicleContractModel, this.customerInfo);
    this.oh.select(this.insurancePackages, this.router.url, this.refCode);
    this.router.navigate(["product/checkoutpayment/"], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href, { receiveCert: this.receiveCertificate }) });
  }
  goBack() {
    this.currentStep--;
    this.router.navigate([this.vs.cleanParamsInURL(this.prevLink)], { queryParams: this.vs.convertParamsToObjectInURL(this.prevLink) });
  }
  goBackInStep() {
    this.currentStep--;
  }
  autoCheckPackageDefault() {
    this.checkOptionPackage(0);
  }
  checkOptionPackage(itemId) {
    try {
      this.optionPackages.insurancePackageDetails.forEach(item => {
        item.selected = false;
      });
      if (this.combinePackages) {
        this.combinePackages.insurancePackageDetails.forEach(item => {
          item.selected = false;
        });
      }
      this.optionPackages.insurancePackageDetails[itemId].selected = true;
      this.calInsuranceCost();
    } catch (err) {
      console.log(err);
    }
  }
  checkCombinePackage(itemId, event) {
    try {
      if (this.combinePackages) {
        this.combinePackages.insurancePackageDetails.forEach(item => {
          item.selected = false;
        });
        this.combinePackages.insurancePackageDetails[itemId].selected = event;
      }
      this.calInsuranceCost();
    } catch (err) {
      console.log(err);
    }
  }
  calInsuranceCost() {
    let arrProgramPackageConfig: Array<ProgramPackageConfig> = [];
    this.selectedPackages = this.optionPackages.insurancePackageDetails.filter(item => item.selected == true);
    if (this.combinePackages) {
      this.combinePackages.insurancePackageDetails
        .filter(item => item.selected == true)
        .forEach(item => {
          this.selectedPackages.push(item);
        });
    }
    for (var i = 0; i < this.selectedPackages.length; i++) {
      var selectedPackage = this.selectedPackages[i];
      let packageConfig: ProgramPackageConfig = {
        insuranceProgramPackageId: selectedPackage.insuranceProgramPackageId,
        numberOfInsuranceObject: selectedPackage.numberOfInsuranceObject,
        insuranceProgramId: selectedPackage.insuranceProgramId
      };
      arrProgramPackageConfig.push(packageConfig);
    }
    this.insuranceFeeInfoByConfig.programPackageConfigs = arrProgramPackageConfig;
    this.oc.calculatorInsuranceFeeByConfig(this.insuranceFeeInfoByConfig).subscribe(res => {
      if (res && res.success) {
        this.insuranceCost = res.data.totalInsuranceCost;
        //  + res.data.totalDiscount;
        // this.discount = res.data.totalInsuranceCost;
      }
    });
  }

  //
  changeEffectiveDate() {
    this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
  }
  changeStatusPromise() {
    this.checkedPromise = !this.checkedPromise;
  }
  checkAllowToCheckOut() {
    let temp = this.customerForm.valid && this.carForm.valid && this.selectedPackages.length > 0;
    if (this.fromApp) {
      return temp;
    } else {
      return temp && this.checkedPromise;
    }
  }
  onCheckEnablePassengerFeeChange(e) {
    if (!this.vehiclesInfo.enablePassengerFee) {
      this.vehiclesInfo.passengerCost = 0;
    }
  }

  onChangeEnableGoodsRate() {
    if (!this.vehiclesInfo.enabledGoodsFee) {
      this.vehiclesInfo.goodsCost = 0;
    }
  }
  changeTakingPaperCertification() {
    this.vehicleContractModel.takingPaperCertification = !this.vehicleContractModel.takingPaperCertification
    if (this.vehicleContractModel.takingPaperCertification) {
      this.initReceiverForm();
    }
    else {
      this.receiverForm.clearValidators();
    }
  }

  copyCustomerName() {
    this.carInsuranceObject.ownerName = this.customerInfo.name;
    this.carInsuranceObject.phoneNumber = this.customerInfo.phoneNumber;
    this.carInsuranceObject.email = this.customerInfo.email;
  }
  copyBuyerName() {
    this.receiverInfo.name = this.customerInfo.name;
    this.receiverInfo.phoneNumber = this.customerInfo.phoneNumber;
    this.receiverInfo.email = this.customerInfo.email;
  }
  copyOwnerName() {
    this.receiverInfo.name = this.carInsuranceObject.ownerName;
    this.receiverInfo.phoneNumber = this.carInsuranceObject.phoneNumber;
    this.receiverInfo.email = this.carInsuranceObject.email;
  }

  createYearOfProduct() {
    const yearLimit = 18 + 12;
    const yearNow = new Date().getFullYear();
    for (let index = 0; index <= yearLimit; index++) {
      this.yearsOfProduct.push(yearNow - index);
    }
  }
  //

  initFormCustomer() {
    this.customerForm = this.fb.group({
      name: ["", [Validators.required, stringName(2)]],
      phoneNumber: ["", [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
      email: ["", [Validators.pattern(this.regex.emailRegex)]],
      fullAddress: this.fb.group({
        addressDetails: ["", [Validators.required]],
        provinceOrCityId: ["", [Validators.required]],
        districtId: ["", [Validators.required]],
        wardId: ["", [Validators.required]]
      }),
    });
  }

  initReceiverForm() {
    this.receiverForm = this.fb.group({
      nameReceiver: ["", [Validators.required, stringName(2)]],
      phoneNumberReceiver: ["", [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
      emailReceiver: ["", [Validators.pattern(this.regex.emailRegex)]],
      fullAddressReceiver: this.fb.group({
        addressDetailsReceiver: ["", [Validators.required]],
        provinceOrCityIdReceiver: ["", [Validators.required]],
        districtIdReceiver: ["", [Validators.required]],
        wardIdReceiver: ["", [Validators.required]]
      }),
    });
  }

  initCarInsuranceObjectForm() {
    this.carInsuranceObject.yearOfProduction = new Date().getFullYear();
    this.carInsuranceObjectForm = this.fb.group({
      ownerName: ["", [Validators.required, stringName(2)]],
      phoneNumberObject: ["", [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
      emailObject: ["", [Validators.pattern(this.regex.emailRegex)]],
      fullAddressCavet: this.fb.group({
        addressDetailsCavet: ["", [Validators.required]],
        provinceOrCityIdCavet: ["", [Validators.required]],
        districtIdCavet: ["", [Validators.required]],
        wardIdCavet: ["", [Validators.required]]
      }),
      yearOfProduction: ["", [Validators.required]],
      hasPlate: [""]
    });

    const ctrl: FormControl = (<any>this.carInsuranceObjectForm).controls["hasPlate"];
    ctrl.setValue(this.carInsuranceObject.hasPlate);
    if (this.carInsuranceObject.hasPlate == true) {
      this.carInsuranceObjectForm.addControl("hasPlateForm", this.initHasPlateForm());
    } else {
      this.carInsuranceObjectForm.addControl("hasNoPlateForm", this.initNoPlateForm());
    }
    this.carInsuranceObjectForm.valueChanges.subscribe(res => {
      if (this.carInsuranceObjectForm.get("hasPlateForm") && this.carInsuranceObjectForm.get("hasPlateForm").valid) {
        this.carInsuranceObject.plateNumber ? (this.carInsuranceObject.plateNumber = this.carInsuranceObject.plateNumber.toUpperCase()) : "";
      }
    });
  }

  initHasPlateForm() {
    return this.fb.group({
      plateNumber: ["", [Validators.required, Validators.pattern(this.regex.plateRegex)]]
    });
  }
  initNoPlateForm() {
    return this.fb.group({
      engineNumber: ["", Validators.required],
      machineNumber: ["", Validators.required]
    });
  }
  hasPlate(status: boolean) {
    if (status) {
      this.carInsuranceObject.hasPlate = true;
      this.carInsuranceObject.machineNumber = null;

      this.carInsuranceObject.engineNumber = null;
      // update hasPlate status
      const ctrl = this.carInsuranceObjectForm.get("hasPlate");
      ctrl.setValue(status);
      this.carInsuranceObjectForm.addControl("hasPlateForm", this.initHasPlateForm());
      this.carInsuranceObjectForm.removeControl("hasNoPlateForm");
    } else {
      this.carInsuranceObject.hasPlate = false;
      this.carInsuranceObject.plateNumber = null;
      // update hasPlate status
      const ctrl = this.carInsuranceObjectForm.get("hasPlate");
      ctrl.setValue(status);
      this.carInsuranceObjectForm.addControl("hasNoPlateForm", this.initNoPlateForm());
      this.carInsuranceObjectForm.removeControl("hasPlateForm");
    }
  }

  

  async onChangeUsingPurpose(usingPurposeId) {
    this.vehiclesInfo.feeConfigId = null;
    this.vehiclesInfo.mainCost = 0;
    this.feeConfigs = new Array<FeeConfigs>();
    if (usingPurposeId == null || usingPurposeId == undefined || this.usingPurposes == null || this.usingPurposes.length == 0) {
      return;
    }
    try {
      this.selectedUsingPurpose = this.usingPurposes.find(p => p.id == usingPurposeId);
      this.feeConfigs = this.vs.arrayOrder(this.selectedUsingPurpose.feeConfigs, "name");
      this.enabledGoodsFeeControl = this.selectedUsingPurpose.type == TransportationType.Luggage;
      this.vehiclesInfo.enabledGoodsFee = this.selectedUsingPurpose.type == TransportationType.Luggage;
      this.vehiclesInfo.feeConfigId = this.feeConfigs[0].id;
      if (this.vehiclesInfo.enabledGoodsFee) {
        this.selectedGoodsRate = this.goodsRates[0];
        this.vehiclesInfo.goodsRatesId = this.selectedGoodsRate.id;

      }
      else {
        this.selectedGoodsRate = new GoodsRates();
        this.vehiclesInfo.goodsRatesId = null;
      }
      this.vehiclesInfo.goodsInsuranceAmount = 0;
      this.vehiclesInfo.goodsCost = 0;
    } catch (error) {
      console.log(error);
    }
  }

  onChangeFeeConfigId(feeConfigId) {
    if (feeConfigId == null || feeConfigId == undefined) {
      return;
    }
    this.selectedFeeConfig = this.feeConfigs.find(p => p.id == feeConfigId) || new FeeConfigs();
    console.log(this.enabledGoodsFeeControl);

    if (this.enabledGoodsFeeControl) {
      this.vehiclesInfo.goodsWeight = this.minValueGoodsWeight = this.selectedFeeConfig.minValue;
      this.maxValueGoodsWeight = this.selectedFeeConfig.maxValue;
      this.vehiclesInfo.passengerNumber = this.minValuePassenger = this.defaultMinPassengerNumber;
      this.maxValuePassenger = this.defaultMaxPassengerNumber;
      this.vehiclesInfo.goodsInsuranceAmount = 1000000;
      this.carForm.controls.goodsWeight.setValidators([Validators.min(this.minValueGoodsWeight)
        , Validators.max(this.maxValueGoodsWeight)]);
      this.carForm.controls.passengerNumber.setValidators([Validators.min(this.minValuePassenger)
        , Validators.max(this.maxValuePassenger)]);
    }
    else {
      this.vehiclesInfo.passengerNumber = this.minValuePassenger = this.selectedFeeConfig.minValue;
      this.maxValuePassenger = this.selectedFeeConfig.maxValue;
      this.vehiclesInfo.goodsWeight = null;
      this.carForm.controls.passengerNumber.setValidators([Validators.min(this.minValuePassenger)
        , Validators.max(this.maxValuePassenger)]);
      this.carForm.controls.goodsWeight.clearValidators();
    }


    this.calculatorMainCost();
  }

  onChangeGoodsRateId(goodRateId) {
    if (goodRateId == null || goodRateId == undefined) {
      return;
    }
    this.selectedGoodsRate = this.goodsRates.find(p => p.id == goodRateId) || new GoodsRates();
    this.calculatorGoodsFee();
  }

  onChangeGoodsInsAmount() {
    setTimeout(() => {
      if (this.feeConfigs.length > 0) {
        this.calculatorGoodsFee();
      }
    }, 500);
  }
  async calculatorMainCost() {
    try {
      this.cis.getMainCost(this.vehiclesInfo.usingPurposeId, this.vehiclesInfo.feeConfigId, this.vehiclesInfo.passengerNumber).subscribe(result => {
        if (result.data != null) {
          this.vehiclesInfo.mainCost = result.data;
        } else {
          console.log(result.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  calculatorPassengerFee() {
    console.log(this.vehiclesInfo);

    if (!(this.vehiclesInfo.passengerNumber >= 0)
      || !(this.vehiclesInfo.passengerFeeConfigId)) {
      this.vehiclesInfo.passengerCost = 0;
    }
    else {
      try {
        this.cis.getPassengerCost(this.vehiclesInfo.passengerFeeConfigId, this.vehiclesInfo.passengerNumber).subscribe(result => {
          if (result.data != null) {
            console.log(result.data);

            this.vehiclesInfo.passengerCost = result.data
          } else {
            console.log(result.data);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  calculatorGoodsFee() {
    console.log(this.vehiclesInfo);

    if (!(this.vehiclesInfo.goodsWeight >= 0)
      || !(this.vehiclesInfo.goodsInsuranceAmount >= 0)
      || !(this.vehiclesInfo.goodsRatesId)) {
      this.vehiclesInfo.goodsCost = 0;
    }
    else {
      try {
        this.cis.getGoodsCost(this.vehiclesInfo.goodsRatesId, this.vehiclesInfo.goodsInsuranceAmount, this.vehiclesInfo.goodsWeight).subscribe(result => {
          if (result.data != null) {
            this.vehiclesInfo.goodsCost = result.data
          } else {
            console.log(result.data);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  calculatorTotalCost() {
    this.vehiclesInfo.totalCost = this.vehiclesInfo.mainCost + this.vehiclesInfo.passengerCost + this.vehiclesInfo.goodsCost;
  }
  async getProvinces() {
    try {
      this.ls.getProvinces().subscribe(resultProvince => {
        if (resultProvince.success) {
          this.provinces = this.provincesCavet = this.provincesReceiver = this.vs.arrayOrder(resultProvince.data, "name");
        } else {
          console.log(resultProvince.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getDistricts(provinceId, type) {
    try {
      this.ls.getDistrictsByProvinceId(provinceId).subscribe(resultDistrict => {
        if (resultDistrict.success) {
          switch (type) {
            case "customer":
              this.districts = this.vs.arrayOrder(resultDistrict.data, "name");
              if (!this.districts.find(d => d.id == this.customerInfo.districtId)) {
                this.customerInfo.districtId = undefined;
                this.customerInfo.wardId = undefined;
              }
              break;
            case "cavet":
              this.districtsCavet = this.vs.arrayOrder(resultDistrict.data, "name");
              if (!this.districtsCavet.find(d => d.id == this.carInsuranceObject.districtId)) {
                this.carInsuranceObject.districtId = undefined;
                this.carInsuranceObject.wardId = undefined;
              }
              break;
            case "receiver":
              this.districtsReceiver = this.vs.arrayOrder(resultDistrict.data, "name");
              if (!this.districtsReceiver.find(d => d.id == this.receiverInfo.districtId)) {
                this.receiverInfo.districtId = undefined;
                this.receiverInfo.wardId = undefined;
              }
              break;
            default:
              break;
          }

        } else {
          console.log(resultDistrict.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getWards(districtId, type) {
    try {
      this.ls.getWardsByDistrictId(districtId).subscribe(resultWard => {
        if (resultWard.success) {
          switch (type) {
            case "customer":
              this.wards = this.vs.arrayOrder(resultWard.data, "name");
              if (!this.wards.find(d => d.id == this.customerInfo.wardId)) {
                this.customerInfo.wardId = undefined;
              }
              break;
            case "cavet":
              this.wardsCavet = this.vs.arrayOrder(resultWard.data, "name");
              if (!this.wardsCavet.find(d => d.id == this.carInsuranceObject.wardId)) {
                this.carInsuranceObject.wardId = undefined;
              }
              break;
            case "receiver":
              this.wardsReceiver = this.vs.arrayOrder(resultWard.data, "name");
              console.log(this.wardsReceiver);

              if (!this.wardsReceiver.find(d => d.id == this.receiverInfo.wardId)) {
                this.receiverInfo.wardId = undefined;
              }
              break;
            default:
              break;
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
    console.log(this.customerInfo.provinceOrCityId);

    if (this.customerInfo.provinceOrCityId && this.customerInfo.districtId && this.customerInfo.wardId) {
      return true;
    }
    return false;
  }
  isFullAddressCavet() {
    console.log(this.carInsuranceObject.provinceOrCityId);

    if (this.carInsuranceObject.provinceOrCityId && this.carInsuranceObject.districtId && this.carInsuranceObject.wardId) {
      return true;
    }
    return false;
  }
  isFullAddressReceiver() {
    console.log(this.receiverInfo.provinceOrCityId);

    if (this.receiverInfo.provinceOrCityId && this.receiverInfo.districtId && this.receiverInfo.wardId) {
      return true;
    }
    return false;
  }
  mixAddressDetail() {
    let str = "";
    if (this.wards.length != 0 && this.customerInfo.wardId && this.districts.length != 0 && this.customerInfo.districtId && this.provinces.length != 0 && this.customerInfo.provinceOrCityId) {
      str =
        (this.customerInfo.addressDetails ? this.customerInfo.addressDetails +
          ", " : '') +
        (this.wards.find(w => w.id == this.customerInfo.wardId).name || "") +
        ", " +
        (this.districts.find(w => w.id == this.customerInfo.districtId).name || "") +
        ", " +
        (this.provinces.find(w => w.id == this.customerInfo.provinceOrCityId).name || "");
    }
    return str;
  }
  changeAddressDetail() {
    this.customerInfo.fullAddress = this.mixAddressDetail();
  }
  changeAddressDetailInCavet() {
    this.carInsuranceObject.fullAddress = this.mixAddressDetail();
  }
  changeAddressDetailReceiver() {
    this.receiverInfo.fullAddress = this.mixAddressDetail();
  }
}
export function yearStringValid(yearLimit?: number, required?: boolean) {
  return (c: AbstractControl) => {
    let inYear = +c.value;
    let now = new Date();
    if (inYear == 0 && !required) {
      return null;
    } else if (inYear > now.getFullYear()) {
      return { invalidYear: true };
    } else {
      if (yearLimit != null) {
        if (now.getFullYear() - inYear > yearLimit) {
          return { invalidLimit: true };
        }
        return null;
      }
      return null;
    }
  };
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

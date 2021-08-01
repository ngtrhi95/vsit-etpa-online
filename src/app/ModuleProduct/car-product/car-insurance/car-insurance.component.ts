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
import { CalcFeeDto, CarInsuranceBuyer, CarInsuranceContractModel, CarInsuranceObject, CarInsuranceOrder, CarInsuranceReceiver, CarInsuraneVehicle, FeeConfigs, GoodsRates, UsingPurposes } from "../../../models/car-insurance.model";
import { OWL_DATE_TIME_FORMATS } from "ng-pick-datetime";
import { PublicMiningApi } from "../../../api/apiService";
import { CMSSite } from "../../../models/car-insurance.model";
import { CarInsuranceService } from "../../../services/car-insurance.service";
import { CMSSiteCode } from "../../../models/car-insurance-enum";
import { OnlineGroupType } from "../../../models/enum";
import { BlockUIService } from "../../../services/blockUI.service";

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
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
  ]
})
export class CarInsuranceComponent implements OnInit {
  today = new Date();
  insurancePackages: Array<InsurancePackage> = [];
  optionPackages = new InsurancePackage();
  combinePackages = new InsurancePackage();
  selectedPackages: Array<InsurancePackageDetail> = [];
  insuranceFeeInfoByConfig = new InsuranceFeeInfoByConfig();
  effectiveDate = new Date();
  minEffectiveDate = new Date();
  minExpiryDate = new Date();
  maxExpiryDate = new Date();
  expireDate = new Date();
  insuranceCost: number;
  // discount: number;
  customerInfo = new CarInsuranceBuyer();
  // vehicleContractModel = new CarInsuranceContractModel();
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
  goodsRates = new Array<GoodsRates>();

  //
  selectedUsingPurpose = new UsingPurposes();
  selectedFeeConfig = new FeeConfigs();
  selectedGoodsRate = new GoodsRates();

  enabledGoodsFeeControl = false;

  carInsuranceOrder = new CarInsuranceOrder();
  civilLiabilitionInsuranceCost: number = 0;
  passengerInsuranceCost: number = 0;
  finalInsuranceCost: number = 0;
  masterData = new Array<UsingPurposes>(); // list loai xe

  enablePassenger: boolean = true;
  selectedSurchargeConfigId?: string;
  allNumberOfDriverAndAssistantDriverList = [];
  numberOfDriverAndAssistantDriverList = [];
  surchargeConfigs = [] // list muc trach nhiem

  vehiclesInfo = new CarInsuraneVehicle();
  carInsuranceObject = new CarInsuranceObject();
  receiverInfo = new CarInsuranceReceiver();

  uploadUrl: string;

  seatCapacityMinValue?: number = null;
  seatCapacityMaxValue?: number = null;
  weightCapacityMinValue?: number = null;
  weightCapacityMaxValue?: number = null;

  //new condition
  isCheckRangeTime = false;
  namingRegex = '^[a-zA-Z\'-]+$';
  nameInvalidNotify = 'Tên phải tối thiểu 2 từ và không có ký tự đặc biệt, ký tự số';
  phoneInvalidNotify = 'Số điện thoại không đúng định dạng';
  emailInvalidNotify = 'Email không đúng định dạng';
  requiredNotify = 'Không được để trống';
  engineMachineNotify = 'Số khung số máy tối thiểu 2 ký tự';
  plateNotify = 'Biển số xe không đúng định dạng';

  constructor(
    private fb: FormBuilder,
    private oh: OrderHelper,
    private oc: OnlineContractService,
    private vs: VietService,
    private route: ActivatedRoute,
    private router: Router,
    private ls: LocationService,
    private cis: CarInsuranceService,
    private miningApis: PublicMiningApi,
    private bUIs: BlockUIService,
  ) { }

  ngOnInit() {
    console.log(this.carInsuranceOrder);

    this.route.params.subscribe(params => {
      this.grId = +params["groupId"];
      console.log(this.grId);

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
    this.minEffectiveDate = this.carInsuranceOrder.effectiveDate = this.vs.next_N_Date(2);
    this.minExpiryDate = this.carInsuranceOrder.expiryDate = this.vs.calculatorExpiredTimeOfContract(this.carInsuranceOrder.effectiveDate);
    this.maxExpiryDate = this.cis.from_Date_Next_N_Month(this.carInsuranceOrder.effectiveDate, 30);
    console.log(this.maxExpiryDate);

    this.expireDate = this.vs.calculatorExpiredTimeOfContract(this.effectiveDate);
    this.carInsuranceOrder.contractType = 5;
    this.insuranceCost = 0;
    this.uploadUrl = this.miningApis.uploadImages;
    // this.discount = 0;
    console.log(this.oh.infoOfProduct);

    this.getSiteContent();
    this.oh.infoOfProduct.subscribe(p => {

      if (p) {
        this.refCode = p.refCode;
        this.prevLink = p.prev_link;
      }
    });
    this.oc.getInsuranceProductOptionsDetail(this.grId).subscribe(res => {
      if (res && res.success) {
        this.insurancePackages = this.vs.arrayOrder(res.data.insuranceProductOptionDetails, "programCode", false);
        this.receiveCertificate = res.data.receiveCertificate;
        this.checkHasCombine();
        this.autoCheckPackageDefault();
      }
    });

    this.oh.order.subscribe(p => {
      if (p) {
        this.carInsuranceOrder = p.base_contract;
      }
    });

    this.oc.getInsuranceProductById(this.grId).subscribe(res => {
      if (res && res.success && res.data) {
        this.groupName = res.data.name;
        // this.carInsuranceOrder.insuranceProductId = this.vehicleContractModel.baseContract.insuranceProductId = res.data.id;
        // this.carInsuranceOrder.insuranceProductCategoryId = this.vehicleContractModel.baseContract.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
        this.carInsuranceOrder.insuranceProductId = res.data.id;
        this.carInsuranceOrder.insuranceProductCategoryId = res.data.insuranceProductCategoryId;
      }
    });

    setTimeout(() => {
      this.numberOfDriverAndAssistantDriverList = this.allNumberOfDriverAndAssistantDriverList = [{ id: 1, name: 1 }, { id: 2, name: 2 }, { id: 3, name: 3 }];
      this.surchargeConfigs = [{ value: 10000000, id: "SC_10TR", name: "10.000.000 đồng" },
      { value: 20000000, id: "SC_20TR", name: "20.000.000 đồng" },
      { value: 30000000, id: "SC_30TR", name: "30.000.000 đồng" },
      { value: 0, id: 'SC_OTHER', name: "Khác" }] // list muc trach nhiem
    }, 500);

    // this.testTabPayment();
  }

  async getMasterData() { // init master data of fee config
    try {
      console.log('vao')
      this.cis.getMasterData().subscribe(result => {
        if (result.data) {
          this.masterData = this.vs.arrayOrder(result.data.usingPurposes, "name");
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
    this.carInsuranceOrder.purposeType = usingPurposeType;
    this.usingPurposes = this.masterData.filter((item) => item.type == usingPurposeType)
  }

  initFormCarInsurance() { // init form car insurance
    this.carForm = this.fb.group({
      usingPurposeId: ["", Validators.required],

      seatCapacity: [""],
      weightCapacity: [""],

      selectedSurchargeConfigId: ["", Validators.required],

      numberOfDriverAndAssistantDriver: ['', Validators.required],
      numberOfPassenger: ['', Validators.required],
      insuranceAmount: ['', [Validators.min(10000000), Validators.max(1540000000)]]
    });

    this.carForm.valueChanges.subscribe(res => {
      if (this.carForm.valid) {
        this.calculatorMainCost();
      }
      else {
        this.civilLiabilitionInsuranceCost = this.passengerInsuranceCost = this.finalInsuranceCost = 0;
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
    if (this.optionPackages) {
      this.carInsuranceOrder.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
      // this.vehicleContractModel.takingPaperCertification = this.optionPackages.requiredTakingPaperCertificate;
      if (this.optionPackages.requiredTakingPaperCertificate) {
        this.initReceiverForm();
      }
    }
  }
  // nextToPriceTab() {
  //   this.currentStep++;
  //   window.scrollTo(0, 0);
  // }
  // nextToConfirm() {
  //   this.mixAddressDetail();
  //   window.scrollTo(0, 0);
  //   this.currentStep++;
  // }
  // nextStep() {
  //   this.currentStep++;
  //   window.scrollTo(0, 0);
  //   // this.vehicleContractModel.programPackageConfigs = new Array<ProgramPackageConfig>();
  //   // this.vehicleContractModel.insuredVehicles = new Array<InsuredVehicle>();
  //   // for (let i = 0; i < this.selectedPackages.length; i++) {
  //   //   let tempPackagesConfig = new ProgramPackageConfig();
  //   //   tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
  //   //   tempPackagesConfig.numberOfInsuranceObject = this.selectedPackages[i].numberOfInsuranceObject;
  //   //   this.vehicleContractModel.programPackageConfigs.push(tempPackagesConfig);
  //   // }
  //   this.vehicleContractModel.baseContract.effectiveDate = this.effectiveDate;
  //   this.vehicleContractModel.baseContract.expireDate = this.expireDate;
  //   this.vehicleContractModel.insuredVehicles.push(this.vehiclesInfo);
  //   this.vehicleContractModel.baseContract.isOnlineContract = true;
  //   this.vehicleContractModel.baseContract.contractType = 2; // hợp đồng bảo hiểm xe máy
  //   this.vehicleContractModel.baseContract.formOfParticipation = 1; // hợp đồng gốc
  //   this.oh.insuranceDetailOrder(OnlineGroupType.grXCG, this.vehicleContractModel, this.customerInfo);
  //   this.oh.select(this.insurancePackages, this.router.url, this.refCode);
  //   this.router.navigate(["product/checkoutpayment/"], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href, { receiveCert: this.receiveCertificate }) });
  // }
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
    let temp = this.customerForm.valid && this.carForm.valid;
    //let temp = this.customerForm.valid && this.carForm.valid && this.selectedPackages.length > 0;
    if (this.fromApp) {
      return temp;
    } else {
      return temp && this.checkedPromise;
    }
  }
  onCheckEnableSurchargeConfigChange(e) { // event when check surcharge config
    if (this.carInsuranceOrder.hasPassenger) {
      this.setValidatorNumberOfDriverControls();
    }
    else {
      this.calculatorMainCost();
      this.resetValidateNumberOfDriverControls();
    }
  }
  setValidatorNumberOfDriverControls() {
    this.carForm.controls.insuranceAmount.setValidators([Validators.required, Validators.min(10000000), Validators.max(1540000000)]);
    this.carForm.controls.insuranceAmount.updateValueAndValidity();

    this.carForm.controls.numberOfDriverAndAssistantDriver.setValidators([Validators.required]);
    this.carForm.controls.numberOfDriverAndAssistantDriver.updateValueAndValidity();

    this.carForm.controls.numberOfPassenger.setValidators([Validators.required]);
    this.carForm.controls.numberOfPassenger.updateValueAndValidity();

    this.carForm.controls.selectedSurchargeConfigId.setValidators([Validators.required]);
    this.carForm.controls.selectedSurchargeConfigId.updateValueAndValidity()
  }

  resetValidateNumberOfDriverControls() {
    this.carForm.controls.insuranceAmount.clearValidators();
    this.carForm.controls.insuranceAmount.updateValueAndValidity();

    this.carForm.controls.numberOfDriverAndAssistantDriver.clearValidators();
    this.carForm.controls.numberOfDriverAndAssistantDriver.updateValueAndValidity()

    this.carForm.controls.numberOfPassenger.clearValidators();
    this.carForm.controls.numberOfPassenger.updateValueAndValidity();

    this.carForm.controls.selectedSurchargeConfigId.clearValidators();
    this.carForm.controls.selectedSurchargeConfigId.updateValueAndValidity();
  }

  onChangeSeatCapacity() {
    this.carInsuranceOrder.numberPeople = this.carInsuranceOrder.seatCapacity;
    if (this.carInsuranceOrder.seatCapacity) {
      this.numberOfDriverAndAssistantDriverList = this.allNumberOfDriverAndAssistantDriverList.filter((i) => i.id <= this.carInsuranceOrder.seatCapacity);
      if (this.carInsuranceOrder.numberOfDriverAndAssistantDriver > this.carInsuranceOrder.seatCapacity) {
        this.carInsuranceOrder.numberOfDriverAndAssistantDriver = this.carInsuranceOrder.seatCapacity;
      }
    }
    else {
      this.numberOfDriverAndAssistantDriverList = this.allNumberOfDriverAndAssistantDriverList;
    }
    this.calculatorNumberOfPassenger();
    this.calculatorMainCost();
  }

  onCheckEnablePassengerChange(e) {
    if (this.enablePassenger) {
      this.carForm.controls.numberOfPassenger.setValidators([Validators.required]);
    }
    else {
      this.carForm.controls.numberOfPassenger.clearValidators();
    }
    this.carForm.controls.numberOfPassenger.updateValueAndValidity();
  }

  calculatorNumberOfPassenger() {
    if (!this.carInsuranceOrder.numberOfDriverAndAssistantDriver) {
      return;
    }
    if (this.carInsuranceOrder.numberPeople >= this.carInsuranceOrder.numberOfDriverAndAssistantDriver) {
      this.carInsuranceOrder.numberOfPassenger = this.carInsuranceOrder.numberPeople - this.carInsuranceOrder.numberOfDriverAndAssistantDriver;
    }
    else {
      this.carInsuranceOrder.numberOfPassenger = 0;
    }
  }

  onChangeEnableGoodsRate() {
    if (!this.vehiclesInfo.enabledGoodsFee) {
      this.vehiclesInfo.goodsCost = 0;
    }
  }

  setRangeExprireDate() {
    console.log(this.carInsuranceOrder.effectiveDate);

    if (this.isCheckRangeTime) {
      this.minExpiryDate = this.carInsuranceOrder.expiryDate = this.cis.from_Date_Next_N_Date(this.carInsuranceOrder.effectiveDate, 30);
      this.maxExpiryDate = this.vs.calculatorExpiredTimeOfContract_new(this.carInsuranceOrder.effectiveDate, 1);
    }
    else {

      this.minExpiryDate = this.carInsuranceOrder.expiryDate = this.vs.calculatorExpiredTimeOfContract_new(this.carInsuranceOrder.effectiveDate, 1);
      this.maxExpiryDate = this.cis.from_Date_Next_N_Month(this.carInsuranceOrder.effectiveDate, 30);
    }
  }
  changeTakingPaperCertification() {
    this.carInsuranceOrder.takingPaperCertification = !this.carInsuranceOrder.takingPaperCertification
    if (this.carInsuranceOrder.takingPaperCertification) {
      this.initReceiverForm();
    }
    else {
      this.receiverForm.clearValidators();
    }
  }

  createYearOfProduct() {
    const yearLimit = 18 + 12;
    const yearNow = new Date().getFullYear();
    for (let index = 0; index <= yearLimit; index++) {
      this.yearsOfProduct.push(yearNow - index);
    }
  }

  async onChangeUsingPurpose(usingPurposeId) { // event when change car type
    if (usingPurposeId == null || usingPurposeId == undefined || this.usingPurposes == null || this.usingPurposes.length == 0) {
      return;
    }
    try {
      this.selectedUsingPurpose = this.usingPurposes.find(p => p.id == usingPurposeId);
      this.seatCapacityMinValue = this.selectedUsingPurpose.seatCapacityMinValue;
      this.seatCapacityMaxValue = this.selectedUsingPurpose.seatCapacityMaxValue;
      this.weightCapacityMinValue = this.selectedUsingPurpose.weightCapacityMinValue;
      this.weightCapacityMaxValue = this.selectedUsingPurpose.weightCapacityMaxValue;

      if (this.seatCapacityMaxValue != null && this.seatCapacityMinValue != null) {
        this.carForm.controls.seatCapacity.setValidators([Validators.required, Validators.min(this.seatCapacityMinValue)
          , Validators.max(this.seatCapacityMaxValue)]);
        this.carForm.controls.seatCapacity.updateValueAndValidity();
      }
      else {
        this.carForm.controls.seatCapacity.clearValidators();
        this.carForm.controls.seatCapacity.updateValueAndValidity();
      }

      if (this.weightCapacityMinValue != null && this.weightCapacityMaxValue != null) {
        this.carForm.controls.weightCapacity.setValidators([Validators.required, Validators.min(this.weightCapacityMinValue)
          , Validators.max(this.weightCapacityMaxValue)]);
        this.carForm.controls.weightCapacity.updateValueAndValidity();
      }
      else {
        this.carForm.controls.weightCapacity.clearValidators();
        this.carForm.controls.weightCapacity.updateValueAndValidity();
      }

    } catch (error) {
      console.log(error);
    }
  }

  async calculatorMainCost() {
    var calcFeeDto: CalcFeeDto = new CalcFeeDto(this.carInsuranceOrder);

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

  onChangeSurchargeConfigId(id) {
    if (id == undefined || id == null) {
      return;
    }

    console.log(id);

    if (id != 'SC_OTHER') {
      var selectedItem = this.surchargeConfigs.find((item) => item.id == id)
      this.carInsuranceOrder.insuranceAmount = selectedItem.value;
    }
    else {
      this.carInsuranceOrder.insuranceAmount = 50000000;
    }
  }

  calculatorTotalCost() {
    this.vehiclesInfo.totalCost = this.vehiclesInfo.mainCost + this.vehiclesInfo.passengerCost + this.vehiclesInfo.goodsCost;
  }

  initFormCustomer() { // thong tin nguoi mua
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, stringName(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
      email: ['', [Validators.pattern(this.regex.emailRegex)]],
      fullAddress: this.fb.group({
        addressDetails: ['', [Validators.required]],
        provinceOrCityId: ['', [Validators.required]],
        districtId: ['', [Validators.required]],
        wardId: ['', [Validators.required]]
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
      })
    });
  }

  initCarInsuranceObjectForm() { // doi tuong bao hiem
    this.carInsuranceOrder.yearOfProduction = new Date().getFullYear();
    this.carInsuranceObjectForm = this.fb.group({
      ownerName: ['', [Validators.required, stringName(2)]],
      phoneNumberObject: ['', [Validators.required, Validators.pattern(this.regex.phoneRegex)]],
      emailObject: ['', [Validators.pattern(this.regex.emailRegex)]],
      fullAddressCavet: this.fb.group({
        addressDetailsCavet: ['', [Validators.required]],
        provinceOrCityIdCavet: ['', [Validators.required]],
        districtIdCavet: ['', [Validators.required]],
        wardIdCavet: ['', [Validators.required]]
      }),
      yearOfProduction: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]],
      engineNumber: ['', [Validators.required, Validators.minLength(2)]],
      chassisNumber: ['', [Validators.required, Validators.minLength(2)]],
      registrationNumber: ["", [Validators.required, Validators.pattern(this.regex.plateRegex)]]
    });

    if (this.carInsuranceOrder.hasPlate) {
      this.carInsuranceObjectForm.controls['engineNumber'].disable();
      this.carInsuranceObjectForm.controls['chassisNumber'].disable();
      this.carInsuranceObjectForm.controls['registrationNumber'].enable();
    } else {
      this.carInsuranceObjectForm.controls['chassisNumber'].enable();
      this.carInsuranceObjectForm.controls['engineNumber'].enable();
      this.carInsuranceObjectForm.controls['registrationNumber'].disable();
    }
    this.carInsuranceObjectForm.valueChanges.subscribe(res => {
      if (this.carInsuranceObjectForm.get("registrationNumber") && this.carInsuranceObjectForm.get("registrationNumber").valid) {
        this.carInsuranceOrder.registrationNumber ? (this.carInsuranceOrder.registrationNumber = this.carInsuranceOrder.registrationNumber.toUpperCase()) : "";
      }
    });
  }

  copyCustomerName() { // copy thong tin nguoi mua sang thong tin chu xe
    this.carInsuranceOrder.carOwnerName = this.carInsuranceOrder.name;
    this.carInsuranceOrder.carOwnerPhoneNumber = this.carInsuranceOrder.phoneNumber;
    this.carInsuranceOrder.carOwnerEmail = this.carInsuranceOrder.email;
    this.carInsuranceOrder.carOwnerProvinceId = this.carInsuranceOrder.provinceId;
    this.carInsuranceOrder.carOwnerDistrictId = this.carInsuranceOrder.districtId;
    this.carInsuranceOrder.carOwnerWardId = this.carInsuranceOrder.wardId;
    this.carInsuranceOrder.carOwnerAddressDetail = this.carInsuranceOrder.addressDetail;
  }


  copyBuyerNameToReceiver() { // copy thong tin nguoi mua sang thong tin nguoi nhan
    this.carInsuranceOrder.receiverName = this.carInsuranceOrder.name;
    this.carInsuranceOrder.receiverPhone = this.carInsuranceOrder.phoneNumber;
    this.carInsuranceOrder.receiverEmail = this.carInsuranceOrder.email;
    this.carInsuranceOrder.receiverProvinceId = this.carInsuranceOrder.provinceId;
    this.carInsuranceOrder.receiverDistrictId = this.carInsuranceOrder.districtId;
    this.carInsuranceOrder.receiverWardId = this.carInsuranceOrder.wardId;
    this.carInsuranceOrder.receiverAddressDetail = this.carInsuranceOrder.addressDetail;
  }

  copyOwnerNameToReceiver() { //copy thong tin chu xe sang thong tin nguoi nhan
    this.carInsuranceOrder.receiverName = this.carInsuranceOrder.carOwnerName;
    this.carInsuranceOrder.receiverPhone = this.carInsuranceOrder.carOwnerPhoneNumber;
    this.carInsuranceOrder.receiverEmail = this.carInsuranceOrder.carOwnerEmail;
    this.carInsuranceOrder.receiverProvinceId = this.carInsuranceOrder.carOwnerProvinceId;
    this.carInsuranceOrder.receiverDistrictId = this.carInsuranceOrder.carOwnerDistrictId;
    this.carInsuranceOrder.receiverWardId = this.carInsuranceOrder.carOwnerWardId;
    this.carInsuranceOrder.receiverAddressDetail = this.carInsuranceOrder.carOwnerAddressDetail;
  }

  hasPlate(status: boolean) { // init cho bien so va so khung so may
    if (status) {
      this.carInsuranceOrder.hasPlate = true;
      this.carInsuranceOrder.chassisNumber = null;
      this.carInsuranceOrder.engineNumber = null;

      // update hasPlate status
      this.carInsuranceObjectForm.controls['registrationNumber'].reset();
      this.carInsuranceObjectForm.controls['engineNumber'].disable();
      this.carInsuranceObjectForm.controls['chassisNumber'].disable();
      this.carInsuranceObjectForm.controls['registrationNumber'].enable();
    } else {
      this.carInsuranceOrder.hasPlate = false;
      this.carInsuranceOrder.registrationNumber = null;
      // update hasPlate status
      this.carInsuranceObjectForm.controls['chassisNumber'].reset();
      this.carInsuranceObjectForm.controls['engineNumber'].reset();
      this.carInsuranceObjectForm.controls['chassisNumber'].enable();
      this.carInsuranceObjectForm.controls['engineNumber'].enable();
      this.carInsuranceObjectForm.controls['registrationNumber'].disable();
    }
  }

  nextToPolicyTab() { //next to policy tab
    // this.router.navigate(["product/car/tnds/payment/" + this.grId]);
    this.currentStep++;
    window.scrollTo(0, 0);
  }
  nextToConfirm() { //next to confirm tab
    this.carInsuranceOrder.fullAddress = this.mixAddressDetail(this.carInsuranceOrder.provinceId, this.carInsuranceOrder.districtId,
      this.carInsuranceOrder.wardId, this.carInsuranceOrder.addressDetail);
    this.carInsuranceOrder.carOwnerFullAddress = this.mixAddressDetail(this.carInsuranceOrder.carOwnerProvinceId, this.carInsuranceOrder.carOwnerDistrictId,
      this.carInsuranceOrder.carOwnerWardId, this.carInsuranceOrder.carOwnerAddressDetail);
    if (this.carInsuranceOrder.takingPaperCertification) {
      this.carInsuranceOrder.receiverFullAddress = this.mixAddressDetail(this.carInsuranceOrder.receiverProvinceId, this.carInsuranceOrder.receiverDistrictId,
        this.carInsuranceOrder.receiverWardId, this.carInsuranceOrder.receiverAddressDetail);
    }

    window.scrollTo(0, 0);
    this.currentStep++;
  }


  isFullAddress() { // validate address in UI
    if (this.carInsuranceOrder.provinceId && this.carInsuranceOrder.districtId && this.carInsuranceOrder.wardId && this.carInsuranceOrder.addressDetail) {
      return true;
    }
    return false;
  }

  isFullAddressCavet() { // validate address in UI
    if (this.carInsuranceObject.provinceOrCityId && this.carInsuranceObject.districtId && this.carInsuranceObject.wardId) {
      return true;
    }
    return false;
  }
  isFullAddressReceiver() { // validate address in UI
    if (this.carInsuranceOrder.receiverProvinceId && this.carInsuranceOrder.receiverDistrictId && this.carInsuranceOrder.receiverWardId) {
      return true;
    }
    return false;
  }

  mixAddressDetail(provinceId, districId, wardId, addressDetail) { // mix address to display in confirm tab
    let str = "";
    if (this.wards.length != 0 && wardId && this.districts.length != 0 &&
      districId && this.provinces.length != 0 && provinceId) {
      str =
        (addressDetail ? addressDetail +
          ", " : '') +
        (this.wards.find(w => w.id == wardId).name || "") +
        ", " +
        (this.districts.find(w => w.id == districId).name || "") +
        ", " +
        (this.provinces.find(w => w.id == provinceId).name || "");
    }
    return str;
  }

  async getProvinces() { // address dropdown provinces
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

  async getDistricts(provinceId, type) { // address dropdown
    try {
      this.ls.getDistrictsByProvinceId(provinceId).subscribe(resultDistrict => {
        if (resultDistrict.success) {
          switch (type) {
            case "customer":
              this.districts = this.vs.arrayOrder(resultDistrict.data, "name");
              if (!this.districts.find(d => d.id == this.carInsuranceOrder.districtId)) {
                this.carInsuranceOrder.districtId = undefined;
                this.carInsuranceOrder.wardId = undefined;
              }
              break;
            case "cavet":
              this.districtsCavet = this.vs.arrayOrder(resultDistrict.data, "name");
              if (!this.districtsCavet.find(d => d.id == this.carInsuranceOrder.districtId)) {
                this.carInsuranceOrder.carOwnerDistrictId = undefined;
                this.carInsuranceOrder.carOwnerWardId = undefined;
              }
              break;
            case "receiver":
              this.districtsReceiver = this.vs.arrayOrder(resultDistrict.data, "name");
              if (!this.districtsReceiver.find(d => d.id == this.carInsuranceOrder.receiverDistrictId)) {
                this.carInsuranceOrder.receiverDistrictId = undefined;
                this.carInsuranceOrder.receiverWardId = undefined;
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

  async getWards(districtId, type) { // address dropdown
    try {
      this.ls.getWardsByDistrictId(districtId).subscribe(resultWard => {
        if (resultWard.success) {
          switch (type) {
            case "customer":
              this.wards = this.vs.arrayOrder(resultWard.data, "name");
              if (!this.wards.find(d => d.id == this.carInsuranceOrder.wardId)) {
                this.carInsuranceOrder.wardId = undefined;
              }
              break;
            case "cavet":
              this.wardsCavet = this.vs.arrayOrder(resultWard.data, "name");
              if (!this.wardsCavet.find(d => d.id == this.carInsuranceOrder.carOwnerWardId)) {
                this.carInsuranceOrder.carOwnerWardId = undefined;
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

  async nextToPayment() { // tien toi thanh toan
    this.currentStep++;
    window.scrollTo(0, 0);
    // for (let i = 0; i < this.selectedPackages.length; i++) {
    //   let tempPackagesConfig = new ProgramPackageConfig();
    //   tempPackagesConfig.insuranceProgramPackageId = this.selectedPackages[i].insuranceProgramPackageId;
    //   tempPackagesConfig.numberOfInsuranceObject = this.selectedPackages[i].numberOfInsuranceObject;
    //   this.vehicleContractModel.programPackageConfigs.push(tempPackagesConfig);
    // }
    this.carInsuranceOrder.expiryDate = this.expireDate;
    this.carInsuranceOrder.effectiveDate = this.effectiveDate;
    this.carInsuranceOrder.contractType = 5; // hợp đồng bảo hiểm xe o to
    this.carInsuranceOrder.paymentMethod = 5; // hard code to test
    try {
      var customer_info = {
        provinceOrCityId: this.carInsuranceOrder.provinceId,
        districtId: this.carInsuranceOrder.districtId,
        isCheckRangeTime: this.isCheckRangeTime
      }
      this.oh.insuranceDetailOrder(OnlineGroupType.grOto, this.carInsuranceOrder, customer_info);
      this.oh.select(this.insurancePackages, this.router.url, this.refCode); //NEED TO CONFIRM
      this.router.navigate(["product/car/payment/" + this.grId], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href, { receiveCert: this.carInsuranceOrder.takingPaperCertification }) });
    } catch (error) {
      console.log(error);
    }
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
function testTabPayment() {
  throw new Error("Function not implemented.");
}


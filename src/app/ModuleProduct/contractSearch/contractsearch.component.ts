import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OnlineContractService } from "../../services/onlinecontract.service";
import { LocationService } from "../../services/location.service";
import { BlockUIService } from "../../services/blockUI.service";
import {NotifyService} from "../../services/noti.service"

enum ContractType {
  BASE_CONTRACT = 0,
  HUMAN_CONTRACT = 1,
  VEHICLE_CONTRACT = 2,
  BUILDING_CONTRACT = 3,
  HAPPYFAMILY_CONTRACT = 4,
  MOBILE_DEVICE_CONTRACT = 11,
}
@Component({
  selector: 'app-contractsearch',
  templateUrl: "./contractsearch.component.html",
  styleUrls: ["./contractsearch.component.css"]
})
export class ContractSearchComponent implements OnInit {
  find1st = false;
  keyword: string = '';
  phoneNumber: string = '';
  contractDetail: any;
  insuredObjects: any;
  mess: string = '';
  conttractCode: string = '' ;
  selectedValue: number;
  deviceTypes: DeviceTypes[] = [
    { type: 1, value: 'Số ấn chỉ + Số điện thoại'},
    { type: 2, value: 'Mã tra cứu'  },
  ];
  pdfSrc: string;
  fileType = {
    excel : "vnd.ms-excel",
    pdf: "application/pdf"
  }

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private bUIs: BlockUIService,
    private onlineService: OnlineContractService,
    private notifi: NotifyService,
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.phoneNumber = params['phone'];
      this.keyword = params['acbh'];
      this.conttractCode = params['code'];
      this.findOptionType();
    });
  }
  findOptionType() {
    this.contractDetail = {};
    if (this.conttractCode) {
      this.selectedValue = 2;
      this.findContractDetailByCode();
    } else if (this.keyword && this.phoneNumber) {
      this.selectedValue = 1;
      this.findContractDetail();
    } else {
      this.selectedValue = 1;
    }
  }
  async findContractDetail() {
    this.contractDetail = {};
    const haveQueryString = this.keyword && this.phoneNumber ? this.keyword + '/' + this.phoneNumber :"";
    this._router.navigate(['product/searchContract/' + haveQueryString]);
    if (this.keyword && this.phoneNumber) {
      this.bUIs.start("Đang kiểm tra");
      this.find1st = true;
      await this.onlineService.FindCertificateAnhPhone(this.keyword , this.phoneNumber).subscribe(async findResult => {
        if (findResult.success) {
          this.contractDetail = findResult.data;
          this.insuredObjects = findResult.data.insuredObjects;
        } else {
          this.mess = 'Không tìm thấy hợp đồng.';
        }
    });
    } else {
      this.mess = 'Bạn chưa nhập đủ thông tin! Vui vòng nhập đủ các thông tin.';
    }
    this.bUIs.stop();
  }
  async findContractDetailByCode() {
    this.contractDetail = {};
    this._router.navigate(['product/searchContract/' + this.conttractCode]);
    if (this.conttractCode) {
      this.bUIs.start("Đang kiểm tra");
      this.find1st = true;
      await this.onlineService.findConTractDetail(this.conttractCode).subscribe(async findResult => {
          if (findResult.success) {
            this.contractDetail = findResult.data;
            this.insuredObjects = findResult.data.insuredObjects;
          } else {
            this.mess = 'Không tìm thấy hợp đồng.';
          }
      });
    } else {
      this.mess = 'Bạn chưa nhập đủ thông tin! Vui vòng nhập đủ các thông tin.';
    }
  this.bUIs.stop();
  }
  async downLoadPDF() {
    if (this.contractDetail.certificationNumber) {
      this.bUIs.start('Đang tải file...');
      await this.onlineService.exportContractFileBytes(this.contractDetail.certificationNumber).subscribe(async findResult => {
        if (findResult.success) {
          if (findResult.data) {
            await this.downloadFile(findResult.data, this.fileType.pdf);
          } else {
            this.notifi.warning('Hợp đồng chưa có chữ ký. Vui lòng liên hệ Admin !');
          }
        } else {
          this.notifi.warning('Hợp đồng này chưa có file ấn chỉ. Vui lòng liên hệ Admin !');
        }
        this.bUIs.stop();
      });
    } else {
      this.notifi.error('Hợp đồng này không có số ấn chỉ !');
    }
  }
  // async getContractFile() {
  //   if (this.contractDetail.contractType) {
  //     this.bUIs.start('Đang tải file');
  //     switch (this.contractDetail.contractType) {
  //       case ContractType.VEHICLE_CONTRACT:
  //         await this.onlineService.exportVehicleContractFile(this.contractDetail.id).subscribe(async findResult => {
  //           if (findResult.success) {
  //             await this.downloadFile(findResult.data, this.fileType.pdf);
  //             this.bUIs.stop();
  //           } else {
  //             this.notifi.error('Server không phản hồi.');
  //             this.bUIs.stop();
  //           }
  //         });
  //           break;
  //       case ContractType.HUMAN_CONTRACT:
  //         await this.onlineService.exportHumanContractFile(this.contractDetail.id).subscribe(async findResult => {
  //           if (findResult.success) {
  //             await this.downloadFile(findResult.data, this.fileType.pdf);
  //             this.bUIs.stop();
  //             } else {
  //             this.notifi.error('Server không phản hồi.');
  //             this.bUIs.stop();
  //             }
  //           });
  //           break;
  //       case ContractType.BUILDING_CONTRACT:
  //         await this.onlineService.exportBuildingContractFile(this.contractDetail.id).subscribe(async findResult => {
  //           if (findResult.success) {
  //             await this.downloadFile(findResult.data, this.fileType.pdf);
  //             this.bUIs.stop();
  //             } else {
  //             this.notifi.error('Server không phản hồi.');
  //             this.bUIs.stop();
  //             }
  //           });
  //           break;
  //       default :
  //         this.bUIs.stop();
  //     }
  //   }
  // }
  private downloadFile(files, fileType) {
    var sliceSize = 512;
    var byteCharacters = atob(files);
    var byteArrays = []
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: fileType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = this.contractDetail.certificationNumber;
    a.click();
  }
}
export interface  DeviceTypes {
  type: number;
  value: string;
}

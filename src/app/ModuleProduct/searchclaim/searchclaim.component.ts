import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OnlineContractService } from "../../services/onlinecontract.service";
import { BlockUIService } from "../../services/blockUI.service";
import {lookUpClaimRequest} from '../../models/contract.model';

@Component({
  selector: 'app-searchclaim',
  templateUrl: './searchclaim.component.html',
  styleUrls: ['./searchclaim.component.css']
})
export class SearchclaimComponent implements OnInit {
  find1st = false;
  keyword: string = '';
  phoneNumber: string = '';
  claimDetail: any;
  findClaimDetails: any;
  mess: string = ' a';
  selectedValue: number;
  findDetail = false;
  deviceTypes: DeviceTypes[] = [
    { type: 1, value: 'Số ấn chỉ bảo hiểm'},
    { type: 2, value: 'Số yêu cầu bồi thường'},
  ];

  constructor(
    private _router: Router,
    private bUIs: BlockUIService,
    private onlineService: OnlineContractService,
  ) { }

  ngOnInit() {
    this.selectedValue = 1;
    this.findClaim();
  }
  async findClaim() {
    this.findDetail = false;
    this.claimDetail = {};
    this.findClaimDetails = {};
    if (this.keyword && this.phoneNumber) {
      this.find1st = true;
      const lookupclaimrequest = new lookUpClaimRequest;
      this.bUIs.start("Đang kiểm tra");
      lookupclaimrequest.keyWord = this.keyword;
      lookupclaimrequest.phoneNumber = this.phoneNumber;
      await this.onlineService.FindLookUpClaim( lookupclaimrequest).subscribe(findResult => {
        if (findResult.success) {
          console.log(findResult.data);
          this.claimDetail = findResult.data;
        }
      this.bUIs.stop();
    });
    }
  }
  findClaimDetail(item) {
    this.findDetail = true;
    this.findClaimDetails = item;
    console.log(item)
  }

}
export interface  DeviceTypes {
  type: number;
  value: string;
}

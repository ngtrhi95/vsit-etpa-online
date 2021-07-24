import { Component, OnInit } from '@angular/core';
import { VietService } from "../../../services/viet.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { OrderHelper } from "../../../services/order.helper";
import { CMSSiteCode } from '../../../models/car-insurance-enum';
import { CarInsuranceService } from '../../../services/car-insurance.service';
import { CMSSite } from '../../../models/car-insurance.model';

@Component({
  selector: 'app-car-introduce',
  templateUrl: './car-introduce.component.html',
  styleUrls: ['./car-introduce.component.css']
})
export class CarIntroduceComponent implements OnInit {
  cmsSite: CMSSite = new CMSSite();
  refCode: string = "";
  image: string = "";
  grId: number = 0;
  constructor(private oh: OrderHelper, private cs: CarInsuranceService, private vs: VietService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.refCode = params["referenceCode"] || null;
    });

    this.route.params.subscribe(params => {
      this.grId = +params['groupId'];
    });
    this.oh.insuranceOrder.next(null);
    this.getSiteContent();
  }

  getSiteContent() {
    this.cs.getSiteContents(CMSSiteCode.CAR_INSURANCE).subscribe(res => {
      if (res) {
        this.cmsSite = res.data;
        this.image = `url(${this.cmsSite.backgroundImageUrl})`;
      }
    });
  }
  buyNow() {
    this.oh.infoProduct(this.refCode, this.router.url, this.cmsSite);
    const url = 'product/car/tnds/' + this.grId;
    this.router.navigate([url], { queryParams: this.vs.convertParamsToObjectInURL(window.location.href) });
  }
}
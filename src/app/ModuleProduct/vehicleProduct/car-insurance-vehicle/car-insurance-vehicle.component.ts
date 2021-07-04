import { Component, OnInit } from '@angular/core';
import { CMSSite } from "../../../models/cms.model";
import { CMSService } from "../../../services/cms.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { CMSSiteCode } from '../../../models/enum';

@Component({
  selector: 'app-car-insurance-vehicle',
  templateUrl: "./car-insurance-vehicle.component.html",
  styleUrls: ["./car-insurance-vehicle.component.css"]
})
export class CarInsuranceVehicleComponent implements OnInit {

  cmsSite: CMSSite = new CMSSite();
  constructor(private cs: CMSService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getSiteContent();
  }

  getSiteContent() {
    this.cs.getSiteContents(CMSSiteCode.CAR_INSURANCE).subscribe(res => {
        if (res) {
          this.cmsSite = res.data;
          console.log(this.cmsSite );

        }
    });
  }
}

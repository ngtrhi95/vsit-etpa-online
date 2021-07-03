import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-policyNNTXInsurance',
  templateUrl: './policyNNTXInsurance.component.html',
  styles: []
})
export class PolicyNNTXInsuranceComponent implements OnInit {
  environmentMainSite = environment.mainSite;
  fileURL: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    // this.fileURL = sanitizer.bypassSecurityTrustResourceUrl(this.environmentMainSite + '/assets/physicFiles/Quy_tac_bao_hiem_tai_nan_con_nguoi_V_QD253.pdf');
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-contractsearch',
  template: ` ` ,
})
export class ShortLinkComponent implements OnInit {
    Code: string;
  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.Code = params['code'];
    });
    this._router.navigate(['product/searchContract/' + this.Code]);
  }
}

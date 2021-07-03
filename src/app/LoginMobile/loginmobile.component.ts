import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-loginmobile',
  template: ""
})
export class LoginMobileComponent implements OnInit {
  returnUrl = '/';
  userName;
  pwd;
  constructor(private _route: ActivatedRoute, private _router: Router,   private _authenticationService:AuthenticationService) { }

  ngOnInit() {
    this._authenticationService.logout();
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this.login();
  }
  login() {
    try {
      let params: any = this._route.snapshot.params;
      let username=params['username'];
      let password=params['password'];
      this._authenticationService.login(username, password).subscribe(_ => {
        if (_.success) {
          var expiredTime = new Date();
          expiredTime.setSeconds(expiredTime.getSeconds() + _.data.expiresIn);
          localStorage.setItem('EXPIRED_TOTAL_S', _.data.expiresIn);
          localStorage.setItem('EXPIRED_TIME', JSON.stringify(expiredTime));
          localStorage.setItem('TOKEN', JSON.stringify(_.data.accessToken));
          this._router.navigate(["app-product"]);
        } else {
          alert('Đăng nhập tự động không thành công, vui lòng thử lại.')
        }
      });
    } catch (err) {
        alert("Đăng nhập tự động không thành công (server), vui lòng thử lại.");

    }
  }

}
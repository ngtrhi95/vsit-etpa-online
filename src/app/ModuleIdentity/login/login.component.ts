import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { BlockUIService } from '../../services/blockUI.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  returnUrl = '/';
  userName;
  pwd;
  constructor(private _route: ActivatedRoute, private _router: Router, private blockUI: BlockUIService, private alert: AlertService, private _authenticationService:AuthenticationService) { }

  ngOnInit() {
    this._authenticationService.logout();
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }
  login() {
    this.blockUI.start("Loading...");
    try {
      this._authenticationService.login(this.userName, this.pwd).subscribe(_ => {
        if (_.success) {
          var expiredTime = new Date();
          expiredTime.setSeconds(expiredTime.getSeconds() + _.data.expiresIn);
          localStorage.setItem('EXPIRED_TOTAL_S', _.data.expiresIn);
          localStorage.setItem('EXPIRED_TIME', JSON.stringify(expiredTime));
          localStorage.setItem('TOKEN', JSON.stringify(_.data.accessToken));
          this.blockUI.stop();
          if (this.returnUrl === '/') {
            this._router.navigate(["home"]);
          }
          else {
            this._router.navigate([this.returnUrl]);
          }
        } else {
          this.blockUI.stop();
          this.alert.error('Sai tên đăng nhập hoặc mật khẩu.')
        }
      });
    } catch (err) {
      this.blockUI.stop();
      this.alert.error("Không tìm thấy server security.");
      console.log(err)
    }
  }

}

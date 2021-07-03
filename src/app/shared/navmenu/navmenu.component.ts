import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { OnlineContractService } from "../../services/onlinecontract.service";
import { InsuranceProductForOnline } from "../../models/contract.model";
import { GenLinkService } from "../../services/genlink.service";
import { AuthenticationService } from "../../services/authentication.service";
import { HttpService } from '../../services/http.service';
import { SecurityApi } from "../../api/apiService";
declare var $: any;
declare var Swiper: any;

@Component({
    selector: "app-navmenu",
    templateUrl: "./navmenu.component.html",
    styleUrls: ["./navmenu.component.css"]
})
export class NavmenuComponent implements OnInit {
    public insuranceProducts: Array<InsuranceProductForOnline> = [];
    hasLogin = false;
    userName = '';
    constructor(private contractService: OnlineContractService, private router: Router, private route: ActivatedRoute, private _authenticationService: AuthenticationService, private http: HttpService, private securityApi: SecurityApi) {
        this.hasLogin = false;
        // this.route.queryParams.subscribe(params => {
        //     this.refCode = params["referenceCode"] || "";
        // });
    }

    ngOnInit() {
        this.router.events.subscribe(val => {
            try {
                if (val instanceof NavigationEnd) {
                    window.scrollTo(0, 0);
                    $("#nav").removeClass("show");
                    $(".hamburger_menu_button").prop("checked", false);
                    // set footer menu alway show in bottom page
                    setInterval(() => {
                        if ($(window).height() - ($("header").height() + 11 + $("nav").height() + $("footer").height() + $("main").height()) > 0) {
                            $("footer").css("margin-top", $(window).height() - ($("header").height() + 11 + $("nav").height() + $("footer").height() + $("main").height()));
                        } else {
                            $("footer").css("margin-top", 0);
                        }
                    }, 1000);
                    this.loadJSPlugins();
                }
            } catch (err) {
                console.log(err);
            }
        });
        this.GetInsuranceProductsByPartnerCode();
    }
    ngAfterViewInit() {
        if (this.router.url == "/id/login") this.hasLogin = false;
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.checkHasLogin();
                this.GetInsuranceProductsByPartnerCode();
            }
        });
    }
    checkHasLogin() {
        this.hasLogin = false;
        if (JSON.parse(localStorage.getItem("TOKEN"))) {
            this.hasLogin = true;
            this.getCurrentDetailUser();
            let eString = JSON.parse(localStorage.getItem("EXPIRED_TIME"));
            let expiredIn = new Date();
            if (eString != null) expiredIn = new Date(eString);
            let difference = Math.round((expiredIn.getTime() - new Date().getTime()));
            if (difference < 10000) {
                console.log("TOKEN EXPIRED TIMEOUT......:");
                this.logout();
            }
        }
    }

    async getCurrentDetailUser() {
        this.http.get(this.securityApi.getCurrentUserConfigs).subscribe(_ => {
            if (_.success) {
                this.userName = _.data.fullName;
            } else {
                console.log("lấy thông tin người đăng nhập thất bại");
            }
        })
    }
    logout() {
        this._authenticationService.logout();
        this.hasLogin = false;
        this.GetInsuranceProductsByPartnerCode();
        this.router.navigate(["/home"]);
    }

    GetInsuranceProductsByPartnerCode() {
        let onlineChanel = 1;
        this.contractService.getInsuranceProductByDistributor("ONLINE_KEY", onlineChanel).subscribe(res => {
            if (res.success) {
                this.insuranceProducts = res.data;
                const count = this.insuranceProducts.length;
                for (let index = 0; index < count; index++) {
                    switch (this.insuranceProducts[index].categoryCode) {
                        case "NHA":
                            this.insuranceProducts[index].url = "tskt/houseinsurance";
                            break;
                        case "TNDS":
                            this.insuranceProducts[index].url = "vehicle/tnds";
                            break;
                        case "XMVC":
                            this.insuranceProducts[index].url = "vehicle/motoinsurance";
                            break;
                        case "YTP":
                            this.insuranceProducts[index].url = "human/topupinsurance";
                            break;
                        case "HGD":
                            this.insuranceProducts[index].url = "human/homeinsurance";
                            break;
                        case "LOVE":
                            this.insuranceProducts[index].url = "human/loveinsurance";
                            break;
                        case 'TBDD':
                            this.insuranceProducts[index].url = 'mobile/mobileinsurance';
                            break;
                        default:
                            break;
                    }
                }
            } else {
                console.log("ERROR");
            }
        });
    }

    loadJSPlugins() {
        this.loadHamburgerMenu();
        // this.loadSwiperProduct();
    }
    loadHamburgerMenu() {
        // jquery for hamburger menu button
        $(document).on("change", ".hamburger_menu_button", function() {
            $(this).prop("checked") == true ? $("#nav").addClass("show") : $("#nav").removeClass("show");
        });
    }
    loadSwiperProduct() {
        $(document).ready(function() {
            var swiper = new Swiper(".feature_products_listing", {
                slidesPerView: 4,
                spaceBetween: 10,
                pagination: ".swiper-pagination",
                paginationClickable: true,
                breakpoints: {
                    // when window width is <= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    },
                    // when window width is <= 480px
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    // when window width is <= 640px
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                }
            });
        });
    }
}

import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-footer",
    template: `
    <footer>
        <div class="container-fluid">
            <div class="row footer_content">
                <div class="container">
                    <div class="col-md-6 col-xs-12 footer_menu">
                        <h2>Truy cập nhanh</h2>
                        <div class="col-md-6">
                            <ul>
                                <li><a routerLink="/home">Trang Chủ</a></li>
                                <li><a href="#">Sản Phẩm</a></li>
                                <li><a routerLink="/product/searchOrder">Tra Cứu Đơn Hàng</a></li>
                            </ul>
                        </div>
                        <!-- <div class="col-md-6">
                            <ul>
                                <li><a href="#">Giới Thiệu</a></li>
                                <li><a href="#">Bồi Thường</a></li>
                                <li><a href="#">Báo Cáo</a></li>
                            </ul>
                        </div> -->
                        <div class="col-md-6">
                            <ul>
                                <li><a routerLink="/article/policies" target="_blank">Điều khoản</a></li>
                                <li><a routerLink="/article/privacy-policy" target="_blank">Chính sách</a></li>
                                <li><a routerLink="/article/terms-of-use" target="_blank">Quy định</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-6 col-xs-12 footer_contact">
                        <h2>Liên Hệ</h2>
                        <ul>
                            <li class="footer_icon footer_contact_phone_icon"><a href="callto:19006727">1900 6727</a></li>
                            <li class="footer_icon footer_contact_email_icon"><a href="mailto:contact@etpasaigon.vn">contact@etpasaigon.vn</a></li>
                            <li class="footer_icon footer_contact_address_icon">24C Phan Đăng Lưu, P6, Quận Bình Thạnh, TP.HCM</li>
                        </ul>
                    </div>
                    <!-- <div class="col-md-4 col-xs-12 footer_newsletter">
                        <h2>Đăng ký nhận tin từ chúng tôi</h2>
                        <div class="get_new_pti_form">
                            <form action="">
                                <input type="text" placeholder="email@example.com">
                                <button class="btn btn-main">Đăng ký</button>
                            </form>
                        </div>
                    </div> -->
                    <div class="col-md-4 col-xs-12 footer_social hide">
                        <h2>Fanpage</h2>
                        <ul>
                            <li>
                                <a href="#" class="footer_social_icon footer_facebook_social_icon"></a>
                            </li>
                            <li>
                                <a href="#" class="footer_social_icon footer_linkedin_social_icon"></a>
                            </li>
                            <li>
                                <a href="#" class="footer_social_icon footer_twitter_social_icon"></a>
                            </li>
                            <li>
                                <a href="#" class="footer_social_icon footer_youtube_social_icon"></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row copyright">
                <div class="container">
                    <p>VSIT © {{currentYear}}. All Rights Reserved</p>
                </div>
            </div>
        </div>
    </footer>
    `,
    styles: []
})
export class FooterComponent implements OnInit {
    currentYear = new Date().getFullYear();
    constructor() {}

    ngOnInit() {}
}

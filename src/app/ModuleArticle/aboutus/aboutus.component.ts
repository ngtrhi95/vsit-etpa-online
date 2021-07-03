import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-aboutus',
    templateUrl: './aboutus.component.html',
    styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
    newsId: string;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        window.scrollTo(0, 0);
        this.route.queryParams.subscribe(params => {
            this.newsId = params['newsId'] || null;
        });
    }
}

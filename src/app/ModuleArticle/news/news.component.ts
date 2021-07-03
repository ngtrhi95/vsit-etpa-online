import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
    newsId: string;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        window.scrollTo(0, 0);
        this.route.queryParams.subscribe(params => {
            this.newsId = params['newsId'] || null;
        });
    }
}

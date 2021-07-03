import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";

// Import RxJs required methods
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class HttpService {
    public token: string;
    private headers: Headers;
    private options: RequestOptions;
    private expiredIn: Date;
    constructor(private http: Http) {
        this.setToken();
    }
    private setToken() {
        this.headers = new Headers({
            "Content-Type": "application/json",
            Accept: "q=0.8;application/json;q=0.9",
            "Content-Security-Policy": "style-src 'unsafe-inline' 'self'; default-src 'self'"
        });
        let eString = JSON.parse(localStorage.getItem("EXPIRED_TIME"));
        if (eString != null) this.expiredIn = new Date(eString);
        let t = JSON.parse(localStorage.getItem("TOKEN"));
        if (t != null) {
            this.token = t;
            this.headers.append("Authorization", "Bearer " + this.token);
        }
        this.options = new RequestOptions({ headers: this.headers });
    }

    public get(url: string): Observable<any> {
        this.setToken();
        return this.http
            .get(url.replace(/([^:]\/)\/+/g, "$1"), this.options)
            .map(this.extractData)
            .catch((error: any) => Observable.throw(error.json().error || "Server [GET] " + url + " error"));
    }

    public post(url: string, body: any): Observable<any> {
        this.setToken();
        return this.http
            .post(url.replace(/([^:]\/)\/+/g, "$1"), body, this.options)
            .map(this.extractData)
            .catch((error: any) => Observable.throw(error.json().error || "Server [POST] " + url + " error"));
    }
    private extractData(res: Response) {
        try {
            let body = res.json();
            return body || {};
        } catch (err) {
            console.log(res);
            console.log(err);
        }
    }
}

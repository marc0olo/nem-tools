import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class HarvestingService {
    baseUrl = "https://nem-services.herokuapp.com/harvesting/";
    pathRegister = "register";

    constructor(private http:HttpClient) { }

    registerForHarvesting(email: string, publicKeyDelegated: string, privateKeyDelegated: string): Observable<Object> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            params: new HttpParams()
                        .set('email', email)
                        .set('publicKeyDelegated', publicKeyDelegated)
                        .set('privateKeyDelegated', privateKeyDelegated)
        };

        return this.http.post(this.baseUrl + this.pathRegister, null, httpOptions);
    }
}
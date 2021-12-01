import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  // AUTH
  LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/store/login_v2', x); }
  WEB_LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/store/web_login', x); }
  MASTER_LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/admin/login', x); }
  FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/forgot_request', x); }
  VALIDATE_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/validate_forgot_request', x); }
  UPDATE_PWD(x) { return this.http.post<any>(environment.ws_url+'/auth/store/update_pwd', x); }

  // common
  COUNTRIES_LIST() { return this.http.get<any>(environment.ws_url+'/store_details/country_list'); }

}
import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DeploymentService {

  constructor(private http: HttpClient) { }

  DEPLOY_DETAILS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/deploy', httpOptions);
  }

  UPDATE_DEPLOY_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/deploy', x, httpOptions);
  }

  UPDATE_STORE_LOGO(x) { return this.http.post<any>(environment.ws_url+'/logo_upload', x); }
  LOGO_COLORS(x) { return this.http.post<any>(environment.ws_url+'/logo_colors', x); }

}
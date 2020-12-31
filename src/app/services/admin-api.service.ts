import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AdminApiService {

  constructor(private http: HttpClient) { }

  LIVE_CURRENCIES() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/live_currencies', httpOptions);
  }
  GENERATE_STORE_TOKEN(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/generate_token', x, httpOptions);
  }

  // clients
  STORE_LIST(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/store?type='+x, httpOptions);
  }
  STORE_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/details', x, httpOptions);
  }
  ADD_STORE(x) {
    return this.http.post<any>(environment.ws_url+'/others/store', x);
  }
  UPDATE_STORE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.put<any>(environment.ws_url+'/admin/store', x, httpOptions); 
  }
  CHANGE_STORE_PWD(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/change_pwd', x, httpOptions);
  }

  // packages
  PACKAGE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/packages', httpOptions);
  }
  ADD_PACKAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/packages', x, httpOptions);
  }
  UPDATE_PACKAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.put<any>(environment.ws_url+'/admin/packages', x, httpOptions); 
  }
  DELETE_PACKAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.patch<any>(environment.ws_url+'/admin/packages', x, httpOptions);
  }

  // features
  FEATURE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/features', httpOptions);
  }
  FEATURE_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/features/details', x, httpOptions);
  }
  ADD_FEATURE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/features', x, httpOptions);
  }
  UPDATE_FEATURE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.put<any>(environment.ws_url+'/admin/features', x, httpOptions); 
  }
  DELETE_FEATURE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.patch<any>(environment.ws_url+'/admin/features', x, httpOptions);
  }

  // Subscribers
  SUBSCRIBER_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/subscribers', httpOptions);
  }

}
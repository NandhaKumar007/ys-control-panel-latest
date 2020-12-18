import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SetupService {

  constructor(private http: HttpClient) { }

  // CURRENCY TYPES
  CURRENCY_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/currency/details?country_code='+x, httpOptions);
  }
  CURRENCY_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/currency', httpOptions);
  }
  ADD_CURRENCY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/currency', x, httpOptions);
  }
  UPDATE_CURRENCY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/currency', x, httpOptions); 
  }
  DELETE_CURRENCY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/currency', x, httpOptions);
  }

  // shipping methods
  SHIPPING_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/shipping', httpOptions);
  }
  SHIPPING_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/shipping_details?id='+x, httpOptions);
  }
  ADD_SHIPPING(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/shipping', x, httpOptions);
  }
  UPDATE_SHIPPING(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/shipping', x, httpOptions); 
  }
  DELETE_SHIPPING(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/shipping', x, httpOptions);
  }

  // delivery methods
  DELIVERY_METHODS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/delivery_methods', httpOptions);
  }
  UPDATE_DELIVERY_METHODS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/delivery_methods', x, httpOptions);
  }

  // pincodes
  PINCODES() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/pincodes', httpOptions);
  }
  UPDATE_PINCODES(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/pincodes', x, httpOptions);
  }

}
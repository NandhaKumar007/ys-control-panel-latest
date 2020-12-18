import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProductExtrasApiService {

  constructor(private http: HttpClient) { }

  // ADDONS
  ADDON_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/addon', httpOptions);
  }
  ADDON_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/addon/'+x, httpOptions); 
  }
  ADD_ADDON(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/addon', x, httpOptions);
  }
  UPDATE_ADDON(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/addon', x, httpOptions); 
  }
  DELETE_ADDON(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/addon', x, httpOptions);
  }

  // ARCHIVE
  ARCHIVE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/archive', httpOptions);
  }
  ADD_ARCHIVE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/archive', x, httpOptions);
  }
  UPDATE_ARCHIVE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/archive', x, httpOptions); 
  }
  DELETE_ARCHIVE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/archive', x, httpOptions);
  }
  MOVE_BULK_PRODUCTS_FROM_ARCHIVE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/archive/product', x, httpOptions);
  }

  ARCHIVE_PRODUCTS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/archive/product?archive_id='+x, httpOptions);
  }
  MOVE_PRODUCT_FROM_ARCHIVE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/archive/product', x, httpOptions);
  }

  // FAQ
  FAQ_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/faq', httpOptions);
  }
  ADD_FAQ(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/faq', x, httpOptions);
  }
  UPDATE_FAQ(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/faq', x, httpOptions); 
  }
  DELETE_FAQ(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/faq', x, httpOptions);
  }

  // FOOT NOTE
  FOOTNOTE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/footnote', httpOptions);
  }
  ADD_FOOTNOTE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/footnote', x, httpOptions);
  }
  UPDATE_FOOTNOTE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/footnote', x, httpOptions); 
  }
  DELETE_FOOTNOTE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/footnote', x, httpOptions);
  }

  // MEASUREMENTS
  MEASUREMENT_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/measurement', httpOptions);
  }
  ADD_MEASUREMENT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/measurement', x, httpOptions);
  }
  UPDATE_MEASUREMENT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/measurement', x, httpOptions); 
  }
  DELETE_MEASUREMENT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/measurement', x, httpOptions);
  }
  MEASUREMENT_SETTING(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/measurement/setting', x, httpOptions); 
  }

  // Ai Styles
  AI_STYLE_DETAILS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/ai_styles', httpOptions);
  }
  UPDATE_AI_STYLE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/ai_styles', x, httpOptions);
  }

  // SIZE CHART
  CHART_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/size_chart', httpOptions);
  }
  ADD_CHART(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/size_chart', x, httpOptions);
  }
  UPDATE_CHART(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/size_chart', x, httpOptions); 
  }
  DELETE_CHART(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/size_chart', x, httpOptions);
  }

  // TAGS
  TAG_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/tag', httpOptions);
  }
  ADD_TAG(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/tag', x, httpOptions);
  }
  UPDATE_TAG(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/tag', x, httpOptions); 
  }
  DELETE_TAG(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/tag', x, httpOptions);
  }

  // TAX RATES
  TAX_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/tax_rates', httpOptions);
  }
  ADD_TAX(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/tax_rates', x, httpOptions);
  }
  UPDATE_TAX(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/tax_rates', x, httpOptions); 
  }
  DELETE_TAX(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/tax_rates', x, httpOptions);
  }

}
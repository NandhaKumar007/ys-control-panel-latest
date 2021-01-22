import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { AccountService } from '../../../views/store/account/account.service';
import { CommonService } from '../../../services/common.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})

export class SigninComponent implements OnInit {

  loading: boolean; loadingText: string;
  loginForm: any = {};
  deviceToken: any = null;
  constructor(
    public router: Router, private storeApi: StoreApiService, private api: ApiService, private sidebar: SidebarService,
    private commonService: CommonService, private accountApi: AccountService
  ) { }

  ngOnInit() {
    localStorage.clear();
    this.loading = false; this.loadingText = "";
  }

  signin() {
    this.loading = true; this.loadingText = 'Signing in...';
    this.loginForm.device_token = this.deviceToken;
    if(this.router.url=='/session/signin/master') this.masterLogin();
    else this.storeLogin();
  }

  storeLogin() {
    this.api.LOGIN(this.loginForm).subscribe(result => {
      this.loading = false; this.loadingText = "";
      if(result.status) {
        localStorage.setItem("store_token", result.token);
        this.commonService.store_details = {
          type: result.data.type,
          login_email: result.data.email,
          login_type: result.login_type,
          _id: result.data._id,
          name: result.data.name,
          email: result.data.email,
          website: result.data.website,
          gst_no: result.data.gst_no,
          base_url: result.data.base_url,
          currency_types: result.data.currency_types,
          country: result.data.country,
          created_on: result.data.created_on,
          application_setting: result.data.application_setting,
          additional_features: result.data.additional_features
        };
        if(result.data.tax_config) this.commonService.store_details.tax_config = result.data.tax_config;
        let currencyIndex = result.data.currency_types.findIndex(obj => obj.default_currency);
        this.commonService.store_currency = result.data.currency_types[currencyIndex];
        this.commonService.updateLocalData('store_currency', this.commonService.store_currency);
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
        // ys features
        this.commonService.ys_features = result.ys_features;
        this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
        // payment list
        this.commonService.payment_list = result.data.payment_types;
        this.commonService.updateLocalData('payment_list', this.commonService.payment_list);
        // courier partner
        this.commonService.courier_partners = [];
        this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
        if(this.commonService.ys_features.indexOf('courier_partners') != -1) {
          this.storeApi.COURIER_PARTNERS().subscribe(result => {
            if(result.status) {
              this.commonService.courier_partners = result.list;
              this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
            }
          });
        }
        // vendors
        this.commonService.vendor_list = [];
        this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
        if(this.commonService.store_details.login_type!='vendor' && this.commonService.ys_features.indexOf('vendors') != -1) {
          this.accountApi.VENDOR_LIST().subscribe(result => {
            if(result.status) {
              this.commonService.vendor_list = result.list.filter(obj => obj.status=='active');
              this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
            }
          });
        }
        this.sidebar.BUILD_CATEGORY_LIST();
        if(sessionStorage.getItem("redirect_url")) {
          let redirectUrl = sessionStorage.getItem("redirect_url");
          sessionStorage.removeItem("redirect_url");
          this.router.navigateByUrl(redirectUrl);
        }
        else this.router.navigateByUrl('/whats-new');
      }
      else {
        this.loginForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  masterLogin() {
    this.api.MASTER_LOGIN(this.loginForm).subscribe(result => {
      this.loading = false; this.loadingText = "";
      if(result.status) {
        this.commonService.ys_payment_list = result.payment_types;
        this.commonService.updateLocalData('ys_payment_list', this.commonService.ys_payment_list);
        this.commonService.master_token = result.token;
        localStorage.setItem("master_token", this.commonService.master_token);
        this.router.navigateByUrl('/control-panel');
      }
      else {
        this.loginForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
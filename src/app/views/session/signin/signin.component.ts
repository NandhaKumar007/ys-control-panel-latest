import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { SidebarService } from '../../../services/sidebar.service';
import { AccountService } from '../../store/account/account.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})

export class SigninComponent implements OnInit {

  loading: boolean; loadingText: string;
  loginForm: any = {};
  constructor(
    public router: Router, private storeApi: StoreApiService, private api: ApiService, private sidebar: SidebarService,
    private commonService: CommonService, private accApi: AccountService
  ) { }

  ngOnInit() {
    localStorage.clear();
    this.loading = false; this.loadingText = "";
  }

  signin() {
    this.loading = true; this.loadingText = 'Signing in...';
    if(this.router.url.indexOf('master')!=-1) this.masterLogin();
    else if(this.router.url.indexOf('vendor')!=-1) this.vendorLogin();
    else this.storeLogin();
  }

  storeLogin() {
    this.api.LOGIN(this.loginForm).subscribe(result => {
      this.loading = false; this.loadingText = "";
      if(result.status) {
        localStorage.setItem("store_token", result.token);
        this.commonService.store_details = {
          type: result.data.type,
          login_email: this.loginForm.email,
          login_type: result.login_type,
          _id: result.data._id,
          name: result.data.name,
          email: result.data.email,
          gst_no: result.data.gst_no,
          website: result.data.website,
          base_url: result.data.base_url,
          sub_domain: result.data.sub_domain,
          currency_types: result.data.currency_types,
          country: result.data.country,
          created_on: result.data.created_on,
          additional_features: result.data.additional_features,
          company_details: result.data.company_details,
          package_details: result.data.package_details,
          package_info: result.data.package_info,
          status: result.data.status
        };
        if(result.data.dp_wallet_status) this.commonService.store_details.dp_wallet_status = result.data.dp_wallet_status;
        if(result.data.tax_config) this.commonService.store_details.tax_config = result.data.tax_config;
        let currencyIndex = result.data.currency_types.findIndex(obj => obj.default_currency);
        this.commonService.store_currency = result.data.currency_types[currencyIndex];
        this.commonService.updateLocalData('store_currency', this.commonService.store_currency);
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
        // payment list
        this.commonService.payment_list = result.data.payment_types;
        this.commonService.updateLocalData('payment_list', this.commonService.payment_list);
        // deploy stages
        this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
        this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
        // deploy details
        this.commonService.deploy_details = result.data.deployDetails[0];
        delete this.commonService.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
        if(result.data.status=='active') {
          // ys features
          if(!result.ys_features) result.ys_features = [];
          this.commonService.ys_features = result.ys_features;
          // trial features
          let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
          if(trialFeatures.length) {
            trialFeatures.forEach(obj => {
              let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
              if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
                this.commonService.ys_features.push(obj.name);
              }
            });
          }
          this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
          // vendor list
          this.commonService.vendor_list = [];
          if(this.commonService.ys_features.indexOf('vendors')!=-1) {
            this.accApi.VENDOR_LIST().subscribe(result => {
              if(result.status) this.commonService.vendor_list = result.list.filter(obj => obj.status=='active');
              this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
            });
          }
          else this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
          // sub-user features
          if(!result.subuser_features) result.subuser_features = [];
          this.commonService.subuser_features = result.subuser_features;
          this.commonService.updateLocalData('subuser_features', this.commonService.subuser_features);
          // vendor features
          this.commonService.vendor_features = [];
          this.commonService.updateLocalData('vendor_features', this.commonService.vendor_features);
          // store features
          this.commonService.user_list = []; this.commonService.courier_partners = [];
          this.commonService.updateLocalData('user_list', this.commonService.user_list);
          this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
          this.storeApi.STORE_FEATURES().subscribe(result => {
            if(result.status) {
              result.data.sub_users.forEach(obj => {
                this.commonService.user_list.push({ _id: obj._id, name: obj.name });
              });
              this.commonService.courier_partners = result.data.courier_partners;
              this.commonService.updateLocalData('user_list', this.commonService.user_list);
              this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
            }
          });
          this.sidebar.BUILD_CATEGORY_LIST();
          if(result.data.last_login) {
            if(sessionStorage.getItem("redirect_url")) {
              let redirectUrl = sessionStorage.getItem("redirect_url");
              sessionStorage.removeItem("redirect_url");
              this.router.navigateByUrl(redirectUrl);
            }
            else this.router.navigateByUrl('/dashboard');
          }
          else this.router.navigateByUrl('/welcome');
        }
        else {
          this.commonService.route_permission_list = ["deployment", "billing"];
          this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
          this.router.navigateByUrl('/account/billing');
        }
      }
      else {
        this.loginForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  vendorLogin() {
    this.api.VENDOR_LOGIN(this.loginForm).subscribe(result => {
      this.loading = false; this.loadingText = "";
      if(result.status) {
        localStorage.setItem("store_token", result.token);
        this.commonService.store_details = {
          type: result.data.type,
          login_email: this.loginForm.email,
          login_type: result.login_type,
          _id: result.data._id,
          name: result.data.name,
          email: result.data.email,
          gst_no: result.data.gst_no,
          website: result.data.website,
          base_url: result.data.base_url,
          sub_domain: result.data.sub_domain,
          currency_types: result.data.currency_types,
          country: result.data.country,
          created_on: result.data.created_on,
          additional_features: result.data.additional_features,
          company_details: result.data.company_details,
          package_details: result.data.package_details,
          package_info: result.data.package_info,
          status: result.data.status
        };
        if(result.data.dp_wallet_status) this.commonService.store_details.dp_wallet_status = result.data.dp_wallet_status;
        if(result.data.tax_config) this.commonService.store_details.tax_config = result.data.tax_config;
        let currencyIndex = result.data.currency_types.findIndex(obj => obj.default_currency);
        this.commonService.store_currency = result.data.currency_types[currencyIndex];
        this.commonService.updateLocalData('store_currency', this.commonService.store_currency);
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
        // vendor details
        this.commonService.vendor_details = result.vendor_details;
        this.commonService.updateLocalData('vendor_details', this.commonService.vendor_details);
        // vendor features
        this.commonService.vendor_features = result.vendor_details.permission_list;
        this.commonService.updateLocalData('vendor_features', this.commonService.vendor_features);
        // payment list
        this.commonService.payment_list = result.data.payment_types;
        this.commonService.updateLocalData('payment_list', this.commonService.payment_list);
        // deploy stages
        this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
        this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
        // deploy details
        this.commonService.deploy_details = result.data.deployDetails[0];
        delete this.commonService.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
        if(result.data.status=='active') {
          // ys features
          if(!result.ys_features) result.ys_features = [];
          this.commonService.ys_features = result.ys_features;
          // trial features
          let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
          if(trialFeatures.length) {
            trialFeatures.forEach(obj => {
              let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
              if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
                this.commonService.ys_features.push(obj.name);
              }
            });
          }
          this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
          // sub-user features
          if(!result.subuser_features) result.subuser_features = [];
          this.commonService.subuser_features = result.subuser_features;
          this.commonService.updateLocalData('subuser_features', this.commonService.subuser_features);
          // store features
          this.commonService.user_list = []; this.commonService.vendor_list = []; this.commonService.courier_partners = [];
          this.commonService.updateLocalData('user_list', this.commonService.user_list);
          this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
          this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
          this.storeApi.STORE_FEATURES().subscribe(result => {
            if(result.status) {
              result.data.sub_users.forEach(obj => {
                this.commonService.user_list.push({ _id: obj._id, name: obj.name });
              });
              this.commonService.courier_partners = result.data.courier_partners;
              this.commonService.updateLocalData('user_list', this.commonService.user_list);
              this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
            }
          });
          this.sidebar.BUILD_CATEGORY_LIST();
          this.router.navigateByUrl('/vendor-dashboard');
        }
        else this.loginForm.errorMsg = "Account Deactivated.";
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
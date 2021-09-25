import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { StoreApiService } from '../../../services/store-api.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-web-signin',
  templateUrl: './web-signin.component.html',
  styleUrls: ['./web-signin.component.scss']
})

export class WebSigninComponent implements OnInit {

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: ApiService, private commonService: CommonService,
    private sidebar: SidebarService, private storeApi: StoreApiService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.api.WEB_LOGIN({ _id: params.id, token: params.token }).subscribe(result => {
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
            additional_features: result.data.additional_features,
            company_details: {}
          };
          if(result.data.dp_wallet_status) this.commonService.store_details.dp_wallet_status = result.data.dp_wallet_status;
          if(result.data.company_details) this.commonService.store_details.company_details = result.data.company_details;
          if(result.data.tax_config) this.commonService.store_details.tax_config = result.data.tax_config;
          let currencyIndex = result.data.currency_types.findIndex(obj => obj.default_currency);
          this.commonService.store_currency = result.data.currency_types[currencyIndex];
          this.commonService.updateLocalData('store_currency', this.commonService.store_currency);
          this.commonService.updateLocalData('store_details', this.commonService.store_details);
          // deploy stages
          this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
          this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
          // deploy details
          this.commonService.deploy_details = result.data.deployDetails[0];
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
          // ys features
          this.commonService.ys_features = result.ys_features;
          this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
          // sub-user features
          this.commonService.subuser_features = result.subuser_features;
          this.commonService.updateLocalData('subuser_features', this.commonService.subuser_features);
          // payment list
          this.commonService.payment_list = result.data.payment_types;
          this.commonService.updateLocalData('payment_list', this.commonService.payment_list);
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
              this.commonService.vendor_list = result.data.vendors.filter(obj => obj.status=='active');
              this.commonService.courier_partners = result.data.courier_partners;
              this.commonService.updateLocalData('user_list', this.commonService.user_list);
              this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
              this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
            }
          });
          this.sidebar.BUILD_CATEGORY_LIST();
          this.router.navigateByUrl('/deployment');
        }
        else {
          this.commonService.signOut('/session/signin');
          console.log("response", result);
        }
      });
    });
  }

}
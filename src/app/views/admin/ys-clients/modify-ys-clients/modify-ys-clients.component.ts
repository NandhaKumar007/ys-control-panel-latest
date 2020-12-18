import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AdminApiService } from '../../../../services/admin-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-modify-ys-clients',
  templateUrl: './modify-ys-clients.component.html',
  styleUrls: ['./modify-ys-clients.component.scss']
})

export class ModifyYsClientsComponent implements OnInit {

  // currency_list: any = [
  //   { country_code: "INR", html_code: "&#x20B9;" },
  //   { country_code: "USD", html_code: "&#36;" },
  //   { country_code: "AED", html_code: "AED" },
  //   { country_code: "AUD", html_code: "A&#36;" }
  // ];
  currency_list: any = [
    { country_code: "INR", html_code: "&#x20B9;" },
    { country_code: "USD", html_code: "&#36;" }
  ];
  pageLoader: boolean;
  packages_list: any = this.commonService.admin_packages;
  features_list: any = this.commonService.admin_features;
  free_features_list: any = []; paid_features_list: any = [];
  clientForm: any = {}; step_num: number; params: any = {};
  imgBaseUrl = environment.img_baseurl;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params; this.step_num = 1;
      // EDIT
      if(this.params.client_id) {
        this.adminApi.STORE_DETAILS({ _id: this.params.client_id }).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.clientForm = result.data;
            this.clientForm.currency_types = this.clientForm.currency_types[0];
          }
          else console.log("response", result);
        });
      }
      else this.pageLoader = false;
    });
  }

  onSubmit() {
    if(this.params.client_id) {
      // UPDATE
      delete this.clientForm.currency_types;
      this.clientForm.package_details.paid_features = [];
      this.paid_features_list.forEach(element => {
        if(element.feature_checked) this.clientForm.package_details.paid_features.push(element.keyword);
      });
      this.adminApi.UPDATE_STORE(this.clientForm).subscribe(result => {
        if(result.status) this.router.navigate(['/admin/clients']);
        else {
          console.log("response", result);
          this.clientForm.errorMsg = result.message;
        }
      });
    }
    else {
      // ADD
      this.clientForm.currency_types.default_currency = true;
      this.clientForm.currency_types = [this.clientForm.currency_types];
      this.clientForm.base_url = 'https://'+this.clientForm.website;
      this.clientForm.session_key = new Date().valueOf();
      this.clientForm.seo_details = {
        page_title: this.clientForm.name,
        meta_desc: "Ecommerce Application"
      };
      this.clientForm.package_details.paid_features = [];
      this.paid_features_list.forEach(element => {
        if(element.feature_checked) this.clientForm.package_details.paid_features.push(element.keyword);
      });
      this.adminApi.ADD_STORE(this.clientForm).subscribe(result => {
        if(result.status) this.router.navigate(['/admin/clients']);
        else {
          console.log("response", result);
          this.clientForm.errorMsg = result.message;
          this.clientForm.currency_types = this.clientForm.currency_types[0];
        }
      });
    }
  }

  onChoosePackage() {
    this.clientForm.add_features = false;
    if(this.params.client_id) {
      if(this.clientForm.package_details.paid_features.length) this.clientForm.add_features = true;
      if(this.clientForm.package_details.billing_status) {
        this.clientForm.package_details.subscription_start_date = new Date(this.clientForm.package_details.subscription_start_date);
        this.clientForm.package_details.expiry_date = new Date(this.clientForm.package_details.expiry_date);
      }
    }
    if(!this.clientForm.package_details.package_id && this.packages_list.length) {
      this.clientForm.package_details.package_id = this.packages_list[0]._id;
    }
    this.free_features_list = []; this.paid_features_list = [];
    this.features_list.forEach(element => {
      let packIndex = element.linked_packages.findIndex(obj => obj.package_id==this.clientForm.package_details.package_id);
      if(packIndex!=-1) {
        delete element.feature_checked;
        element.package_pricing = element.linked_packages[packIndex].currency_types;
        if(element.package_pricing[this.clientForm.currency_types.country_code].price > 0) {
          if(this.params.client_id && this.clientForm.package_details.paid_features.indexOf(element.keyword)!=-1) element.feature_checked = true;
          this.paid_features_list.push(element);
        }
        else this.free_features_list.push(element);
      }
    });
  }

  fileChangeListener(type, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.clientForm.img_change = true;
        this.clientForm.logo = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
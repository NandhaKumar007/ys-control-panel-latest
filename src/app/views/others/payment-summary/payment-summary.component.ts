import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})

export class PaymentSummaryComponent implements OnInit {

  pageLoader: boolean;

  constructor(private storeApi: StoreApiService, private router: Router, private activeRoute: ActivatedRoute, private commonService: CommonService, private sbService: SidebarService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.storeApi.ADV_STORE_DETAILS().subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
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
            company_details: result.data.company_details,
            package_details: result.data.package_details,
            status: result.data.status
          };
          if(result.data.dp_wallet_status) this.commonService.store_details.dp_wallet_status = result.data.dp_wallet_status;
          if(result.data.tax_config) this.commonService.store_details.tax_config = result.data.tax_config;
          this.commonService.updateLocalData('store_details', this.commonService.store_details);
          // deploy stages
          this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
          this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
          // deploy details
          this.commonService.deploy_details = result.data.deployDetails[0];
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
          if(result.data.status=='active') {
            // ys features
            this.commonService.ys_features = result.ys_features;
            // trial features
            let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
            if(trialFeatures.length) {
              trialFeatures.forEach(obj => {
                let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 15)).setHours(23,59,59,999);
                if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
                  this.commonService.ys_features.push(obj.name);
                }
              });
            }
            this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
            this.sbService.getSidePanelList();
          }
          else {
            this.commonService.route_permission_list = ["deployment", "billing"];
            this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
            this.router.navigateByUrl('/account/billing');
          }
        }
        else console.log("response", result);
      });
    });
  }

}
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { DeploymentService } from '../../deployment/deployment.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})

export class BillingComponent implements OnInit {

  pageLoader: boolean;
  billDetails: any = {};
  billingStatus: boolean;

  constructor(public commonService: CommonService, private api: DeploymentService) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.BILLING_DETAILS({ store_id: this.commonService.store_details._id }).subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.billDetails = result.data;
        if(this.billDetails.store_package_details.billing_status) {
          this.billingStatus = true;
          let subCharges = this.billDetails.package_details.currency_types[this.commonService.store_currency.country_code].amount;
          this.billDetails.payable_amount = subCharges + this.billDetails.addon_price + this.billDetails.transaction_charges;
        }
        else {
          this.billDetails.current_date = new Date();
          this.billDetails.trial_expiry = new Date(this.commonService.store_details.created_on).setDate(new Date(this.commonService.store_details.created_on).getDate() + 15);
          this.billDetails.trial_expiry = new Date(new Date(this.billDetails.trial_expiry).setHours(23,59,59,999));
        }
      }
      else console.log("response", result);
    });
  }

}
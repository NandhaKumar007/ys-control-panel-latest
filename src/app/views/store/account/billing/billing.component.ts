import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})

export class BillingComponent implements OnInit {

  pageLoader: boolean; billingStatus: boolean;
  billDetails: any = {}; paymentTypes: any = [];
  environment: any = environment;
  razorpayOptions: any = {
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  enablePayment: boolean;
  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: DeploymentService, public router: Router) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.BILLING_DETAILS({ store_id: this.commonService.store_details._id }).subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.billDetails = result.data;
        this.paymentTypes = result.payment_types;
        if(this.billDetails.store_package_details.billing_status && this.billDetails.store_package_details.expiry_date) {
          this.billingStatus = true;
          this.razorpayOptions.my_order_type = "plan_renewal";
          this.billDetails.payable_amount = this.billDetails.subscription_charge + this.billDetails.addon_price + this.billDetails.transaction_charges;
          if(this.billDetails.store_package_details.transaction_range && this.billDetails.store_package_details.transaction_range.to) {
            if(new Date() > new Date(this.billDetails.store_package_details.transaction_range.to)) this.enablePayment = true;
          }
        }
        else {
          this.razorpayOptions.my_order_type = "purchase_app";
          this.billDetails.current_date = new Date();
          this.billDetails.trial_expiry = new Date(this.commonService.store_details.created_on).setDate(new Date(this.commonService.store_details.created_on).getDate() + 15);
          this.billDetails.trial_expiry = new Date(new Date(this.billDetails.trial_expiry).setHours(23,59,59,999));
        }
      }
      else console.log("response", result);
    });
  }

  onSubscribe(x) {
    this.billDetails.submit = true;
    this.api.BILLING_DETAILS({ store_id: this.commonService.store_details._id, payment_details: { name: x.name }, month: 1 }).subscribe(result => {
      if(result.status) {
        let paymentConfig = result.data.payment_config;
        this.razorpayOptions.my_order_id = result.data.order_id;
        this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
        this.razorpayOptions.key = paymentConfig.key;
        this.razorpayOptions.store_name = paymentConfig.name;
        this.razorpayOptions.description = paymentConfig.description;
        setTimeout(_ => this.razorpayForm.nativeElement.submit());
      }
      else {
        this.billDetails.submit = false;
        this.billDetails.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
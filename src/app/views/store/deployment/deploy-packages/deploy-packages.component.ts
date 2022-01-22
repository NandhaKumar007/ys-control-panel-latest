import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { SidebarService } from '../../../../services/sidebar.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
  selector: 'app-deploy-packages',
  templateUrl: './deploy-packages.component.html',
  styleUrls: ['./deploy-packages.component.scss']
})

export class DeployPackagesComponent implements OnInit {

  pageLoader: boolean; packageList: any = [];
  selectedIndex = 0; packageForm: any = {};
  paymentTypes: any = []; packageRank: number = 0;
  environment: any = environment;
  razorpayOptions: any = {
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  imgBaseUrl = environment.img_baseurl;
  upgradeData: any = {}; paymentData: any = {};
  pricingToolTip: any = {}; viewAll: boolean;
  all_features: any = [
    {
      "name": "Unlimited Products",
      "free": "Upto 500 Products",
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "No limit on the total number of products"
    },
    {
      "name": "Advanced Discount Codes",
      "free": "Basic store wide discount only",
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Run powerfull campaingns to boost your sale"
    },
    {
      "name": "Dashboard",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "An overview to your complete sales data"
    },
    {
      "name": "Order Status Triggers",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Emails that are triggered by various events in your sales process"
    },
    {
      "name": "Invoice Generator",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Auto Generated Invoices for each orders"
    },
    {
      "name": "Advanced SEO Editor",
      "free": "Only store SEO optimisation",
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Drive more organic traffic with custom SEO optimisation"
    },
    {
      "name": "Multi Format Sales Report",
      "free": "Download basic sales data in CSV",
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Download your product, category and total sales reports in XLS, CSV and PDF"
    },
    {
      "name": "Standard Email Template",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Preset email templates for order information and various user interaction with the site"
    },
    {
      "name": "Payment Gateway Integration",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Connect your store with our list of supported payment partners and start receiving payments"
    },
    {
      "name": "CoD",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Offer your customers the prefered payment method"
    },
    {
      "name": "Tax Module",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Collect TAX's applicable on your sale from your customers"
    },
    {
      "name": "SSL",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "SSL is a security protocol that creates an encrypted link between a web server and a web browser"
    },
    {
      "name": "Unlimited Product Variants",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Add multiple combinations of product variants like size, colour, etc.."
    },
    {
      "name": "Unlimited Menus",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Creating a menu with multiple levels of categorisation and improve navigation"
    },
    {
      "name": "Flat Rate Shipping Integration",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Set flat shipping charges for both domestic and international orders"
    },
    {
      "name": "Social Media Login",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "One click social logins for hassle free signups"
    },
    {
      "name": "Google - Facebook Ad Tracking",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Gain insights into your social media campaigns and traffic"
    },
    {
      "name": "Custom Product Footnotes",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Add additional information about products in a structured layout"
    },
    {
      "name": "Custom Size Chart",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Present measurements for product sizes available on sale"
    },
    {
      "name": "Messenger Integration",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Chat with your customers directly on their social media"
    },
    {
      "name": "Bulk Upload",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Upload multiplt products at once by uploading a simple CSV sheet"
    },
    {
      "name": "Product Search",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Add an omnibox to your website to search through products, brands, categories and SKUs"
    },
    {
      "name": "App Store Access",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Access to our wide collection of apps"
    },
    {
      "name": "Abandoned Cart Recovery",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Automatic email reminders for incomplete purchases"
    },
    {
      "name": "Testimonial Uploader",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Reinforce brand trust by uploading custom testimonials with photos"
    },
    {
      "name": "Browser Push Notificatons",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Keep your customer updated with regular push notifications"
    },
    {
      "name": "Blog Module",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Engage your customers with butifull blogs that helps you sell more"
    },
    {
      "name": "Customer Feedback Module",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Get your customers valuble feedback"
    },
    {
      "name": "Newsletter Subscription",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Build an organic and powerfull mailing list"
    },
    {
      "name": "Product Filters and Tags",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true,
      "help_content": "Improve product discoverability through tagged attributes  like price, color and size"
    },
    {
      "name": "Product FAQ",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": true,
      "premium": true,
      "help_content": "Answer questions before your customers ask"
    },
    {
      "name": "Gift Cards",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": true,
      "premium": true,
      "help_content": "Enable gifting solutions for your customers"
    },
    {
      "name": "Mark Product as Gift",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": true,
      "premium": true,
      "help_content": "Allow shoppers to mark products as gifts and hide the selling price from order recepients"
    },
    {
      "name": "Order Instructions/Comments",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": true,
      "premium": true,
      "help_content": "Get additional details from your users while they checkout"
    },
    {
      "name": "Manual Order Creation",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": true,
      "premium": true,
      "help_content": "Create orders manually to manage offline sales"
    },
    {
      "name": "Calculated Shipping Rates",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": false,
      "premium": true,
      "help_content": "Automatically calculate shipping charge based on weight and country"
    },
    {
      "name": "Product Customization Module",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": false,
      "premium": true,
      "help_content": "Add multi customizable options to let customers build their own product"
    },
    {
      "name": "Product Measurement Module",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": false,
      "premium": true,
      "help_content": "Get measurement sets from your customers to truly create a bespoke product"
    },
    {
      "name": "Currency Convertor",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": false,
      "premium": true,
      "help_content": "Give your customers an option to choose from a list of currencies"
    }
  ];
  support_service: any = [
    {
      "name": "Standard Email Support",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Priority Email Support",
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Priority Chat Support",
      "premium": true
    },
    {
      "name": "Call Support",
      "premium": true
    },
  ];
  top_features: any = [
    {
      "free": "500 Products", "lite": "Unlimited Products", "starter": "Abandoned Cart Recovery", "growth": "Manual Order Creation", "premium": "Product Customization Module"
    },
    {
      "free": "Basic SEO Editor", "lite": "Advanced SEO Editor", "starter": "Blog Module", "growth": "Product FAQ", "premium": "Calculated Shipping Rates"
    },
    {
      "free": "Order Status Triggers", "lite": "Unlimited Menus", "starter": "Testimonial Uploader", "growth": "Gift Cards", "premium": "Currency Converter"
    },
    {
      "free": "CoD", "lite": "Messenger Integration", "starter": "Product Filters and Tags", "growth": "Order Instructions/Comments", "premium": "Lowest Transaction Fee"
    },
    {
      "free": "1 Staff Account", "lite": "1 Staff Account", "starter": "5 Staff Account", "growth": "10 Staff Account", "premium": "20 Staff Account"
    },
  ];
  mobile_top_features: any = [
    {
      "name": "Unlimited Products",
      "free": "Upto 500 Products",
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Order Status Triggers",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "CoD",
      "free": true,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Staff Accounts",
      "free": 1,
      "lite": 1,
      "starter": 5,
      "growth": 10,
      "premium": 20
    },
    {
      "name": "Advanced SEO Editor",
      "free": "Only store SEO optimisation",
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Unlimited Menus",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Advanced SEO Editor",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Messenger Integration",
      "free": false,
      "lite": true,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Abandoned Cart Recovery",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Blog Module",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Testimonial Uploader",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Product Filters and Tags",
      "free": false,
      "lite": false,
      "starter": true,
      "growth": true,
      "premium": true
    },
    {
      "name": "Product Customization Module",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": false,
      "premium": true
    },
    {
      "name": "Calculated Shipping Rates",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": false,
      "premium": true
    },
    {
      "name": "Currency Converter",
      "free": false,
      "lite": false,
      "starter": false,
      "growth": false,
      "premium": true
    }
  ];
  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: DeploymentService,
    public router: Router, private sbService: SidebarService, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.PACKAGE_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.packageList = result.list;
        this.packageList.forEach(obj => {
          obj.keyword = obj.name.toLowerCase();
        });
        let pIndex = this.packageList.findIndex(obj => obj._id==this.commonService.store_details.package_details.package_id);
        if(pIndex!=-1) this.packageRank = this.packageList[pIndex].rank;
      }
      else console.log("response", result);
    });
  }

  onSelectPlan(x, modalName) {
    this.packageForm = x;
    let formData = { store_id: this.commonService.store_details._id, package_id: this.packageForm._id, month: 1 };
    this.api.PURCHASE_PLAN(formData).subscribe(result => {
      if(result.status) {
        this.paymentData = result.data;
        this.paymentTypes = result.payment_types;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }
  onSubscribe(x) {
    this.packageForm.submit = true;
    let formData = {
      store_id: this.commonService.store_details._id, package_id: this.packageForm._id,
      month: 1, payment_details: { name: x.name }
    };
    this.api.PURCHASE_PLAN(formData).subscribe(result => {
      if(result.status) {
        if(x.name=="Razorpay") {
          let paymentConfig = result.data.payment_config;
          this.razorpayOptions.my_order_type = "purchase_plan";
          this.razorpayOptions.my_order_id = result.data.order_id;
          this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
          this.razorpayOptions.key = paymentConfig.key;
          this.razorpayOptions.store_name = paymentConfig.name;
          this.razorpayOptions.description = paymentConfig.description;
          setTimeout(_ => this.razorpayForm.nativeElement.submit());
        }
        else console.log("Invalid payment method");
      }
      else {
        this.packageForm.submit = false;
        this.packageForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangePlan(x, modalName) {
    this.api.CHANGE_PLAN({ store_id: this.commonService.store_details._id, package_id: x._id, month: 1 }).subscribe(result => {
      if(result.status) {
        this.upgradeData = result.data;
        this.paymentData = result.payment_data;
        this.paymentTypes = result.payment_types;
        this.upgradeData.package_details = x;
        this.calcAppCharges();
        this.modalService.open(modalName, { size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpgrade(x) {
    this.upgradeData.submit = true;
    let formData = {
      store_id: this.commonService.store_details._id, package_id: this.upgradeData.package_details._id, month: 1,
      payment_details: { name: x.name }, upgrade_apps: this.upgradeData.upgrade_apps
    };
    this.api.CHANGE_PLAN(formData).subscribe(result => {
      if(result.status) {
        if(result.data) {
          if(x.name=="Razorpay") {
            let paymentConfig = result.data.payment_config;
            this.razorpayOptions.my_order_type = "plan_change";
            this.razorpayOptions.my_order_id = result.data.order_id;
            this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
            this.razorpayOptions.key = paymentConfig.key;
            this.razorpayOptions.store_name = paymentConfig.name;
            this.razorpayOptions.description = paymentConfig.description;
            setTimeout(_ => this.razorpayForm.nativeElement.submit());
          }
          else console.log("Invalid payment method");
        }
        else {
          this.storeApi.ADV_STORE_DETAILS().subscribe(result => {
            document.getElementById('closeModal').click();
            if(result.status) this.sbService.resetStoreDetails(result);
            else console.log("response", result);
          });
        }
      }
      else console.log("response", result);
    });
  }

  calcAppCharges() {
    this.upgradeData.credit = 0;
    this.upgradeData.app_charges = 0;
    this.upgradeData.payable_amount = 0;
    this.upgradeData.upgrade_apps.forEach(element => {
      this.upgradeData.app_charges += element.price;
    });
    this.upgradeData.total = this.upgradeData.subscription_charges + this.upgradeData.app_charges + this.upgradeData.transaction_charges;
    if(this.upgradeData.total >= this.upgradeData.discount) this.upgradeData.payable_amount = this.upgradeData.total - this.upgradeData.discount;
    else this.upgradeData.credit = this.upgradeData.discount - this.upgradeData.total;
    // taxes
    if(this.upgradeData.payable_amount > 0) {
      let orderAmount = this.upgradeData.payable_amount;
      if(this.paymentData.cgst) {
        this.paymentData.cgst.amount = parseFloat((((this.paymentData.cgst.percentage)/100)*orderAmount).toFixed(2));
        this.upgradeData.payable_amount += this.paymentData.cgst.amount;
      }
      if(this.paymentData.sgst) {
        this.paymentData.sgst.amount = parseFloat((((this.paymentData.sgst.percentage)/100)*orderAmount).toFixed(2));
        this.upgradeData.payable_amount += this.paymentData.sgst.amount;
      }
      if(this.paymentData.igst) {
        this.paymentData.igst.amount = parseFloat((((this.paymentData.igst.percentage)/100)*orderAmount).toFixed(2));
        this.upgradeData.payable_amount += this.paymentData.igst.amount;
      }
    }
    this.upgradeData.payable_amount = parseFloat(this.upgradeData.payable_amount.toFixed(2));
  }

  resetFeaturesTip() {
    this.pricingToolTip = {};
    this.all_features.forEach(obj => {
      delete obj.toolTip; delete obj.infoTip;
    });
    this.mobile_top_features.forEach(obj => {
      delete obj.infoTip;
    });
  }

}
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { DeploymentService } from '../../deployment/deployment.service';

@Component({
  selector: 'app-deploy-packages',
  templateUrl: './deploy-packages.component.html',
  styleUrls: ['./deploy-packages.component.scss']
})

export class DeployPackagesComponent implements OnInit {

  pageLoader: boolean; packageList: any = [];
  selectedIndex = 0; packageForm: any = {};
  modalInfo: string; viewAll: boolean;
  subList: any = [
    { name: "1 month", month: 1 },
    { name: "3 month", month: 3 },
    { name: "6 month", month: 6 },
    { name: "1 year", month: 12 }
  ];
  environment: any = environment;
  razorpayOptions: any = {
    my_order_type: "package_renewal",
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  pricing_table: any = {
    "pricing": [
      {
        "id": 1, "name": "Platform Fee", "free_plan": "0", "lite_plan": "INR 900", "starter_plan": "INR 2,900", "growth_plan": "INR 5,900", "premium_plan": "INR 9,900", "help_content": "A monthly fee collected based on the plan you choose", "info_content": ""
      },
      {
        "id": 2, "name": "Transaction Fee", "free_plan": "2.50%", "lite_plan": "2%", "starter_plan": "1%", "growth_plan": "0.75%", "premium_plan": "0.50%", "help_content": "Charges applicable on the overall monthly sale", "info_content": ""
      },
      {
        "id": 3, "name": "Transaction waiver", "free_plan": "0", "lite_plan": "INR 45,000/month", "starter_plan": "INR 2,90,000/month", "growth_plan": "INR 7,86,000/month", "premium_plan": "INR 19,80,000/month", "help_content": "Transaction free sale upto a respective charges based on your plan ", "info_content": ""
      },
      {
        "id": 4, "name": "Live Fee", "free_plan": "INR 50", "lite_plan": 0, "starter_plan": 0, "growth_plan": 0, "premium_plan": 0, "help_content": "A charge collected to keep the service live", "info_content": ""
      },
    ],
    "top_features": [
      {
        "id": 1, "name": "", "free_plan": "500 Products", "lite_plan": "Unlimited Products", "starter_plan": "Abandoned Cart Recovery", "growth_plan": "Manual Order Creation", "premium_plan": "Product Customization Module", "help_content": "", "info_content": ""
      },
      {
        "id": 2, "name": "", "free_plan": "Basic SEO Editor", "lite_plan": "Advanced SEO Editor", "starter_plan": "Blog Module", "growth_plan": "Product FAQ", "premium_plan": "Calculated Shipping Rates", "help_content": "", "info_content": ""
      },
      {
        "id": 3, "name": "", "free_plan": "Order Status Triggers", "lite_plan": "Unlimited Menus", "starter_plan": "Testimonial Uploader", "growth_plan": "Gift Cards", "premium_plan": "Currency Converter", "help_content": "", "info_content": ""
      },
      {
        "id": 4, "name": "", "free_plan": "CoD", "lite_plan": "Messenger Integration", "starter_plan": "Product Filters and Tags", "growth_plan": "Order Instructions/Comments", "premium_plan": "Lowest Transaction Fee", "help_content": "", "info_content": ""
      },
      {
        "id": 5, "name": "", "free_plan": "1 Staff Account", "lite_plan": "1 Staff Account", "starter_plan": "5 Staff Account", "growth_plan": "10 Staff Account", "premium_plan": "20 Staff Account", "help_content": "", "info_content": ""
      },
    ],
    "all_features": [
      {
        "id": 1,
        "name": "Unlimited Products",
        "free_plan": "info",
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "No limit on the total number of products",
        "info_content": "Upto 500 Products"
      },
      {
        "id": 2,
        "name": "Advanced Discount Codes",
        "free_plan": "info",
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Run powerfull campaingns to boost your sale",
        "info_content": "Basic store wide discount only"
      },
      {
        "id": 3,
        "name": "Dashboard",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "An overview to your complete sales data",
        "info_content": ""
      },
      {
        "id": 4,
        "name": "Order Status Triggers",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Emails that are triggered by various events in your sales process",
        "info_content": ""
      },
      {
        "id": 5,
        "name": "Invoice Generator",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Auto Generated Invoices for each orders",
        "info_content": ""
      },
      {
        "id": 6,
        "name": "Advanced SEO Editor",
        "free_plan": "info",
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Drive more organic traffic with custom SEO optimisation",
        "info_content": "Only store SEO optimisation"
      },
      {
        "id": 7,
        "name": "Multi Format Sales Report",
        "free_plan": "info",
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Download your product, category and total sales reports in XLS, CSV and PDF",
        "info_content": "Download basic sales data in CSV"
      },
      {
        "id": 8,
        "name": "Standard Email Template",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Preset email templates for order information and various user interaction with the site",
        "info_content": ""
      },
      {
        "id": 9,
        "name": "Payment Gateway Integration",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Connect your store with our list of supported payment partners and start receiving payments",
        "info_content": ""
      },
      {
        "id": 10,
        "name": "CoD",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Offer your customers the prefered payment method",
        "info_content": ""
      },
      {
        "id": 11,
        "name": "Tax Module",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Collect TAX's applicable on your sale from your customers",
        "info_content": ""
      },
      {
        "id": 12,
        "name": "SSL",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "SSL is a security protocol that creates an encrypted link between a web server and a web browser",
        "info_content": ""
      },
      {
        "id": 13,
        "name": "Unlimited Product Variants",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Add multiple combinations of product variants like size, colour, etc..",
        "info_content": ""
      },
      {
        "id": 14,
        "name": "Unlimited Menus",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Creating a menu with multiple levels of categorisation and improve navigation",
        "info_content": ""
      },
      {
        "id": 15,
        "name": "Flat Rate Shipping Integration",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Set flat shipping charges for both domestic and international orders",
        "info_content": ""
      },
      {
        "id": 16,
        "name": "Social Media Login",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "One click social logins for hassle free signups",
        "info_content": ""
      },
      {
        "id": 17,
        "name": "Google - Facebook Ad Tracking",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Gain insights into your social media campaigns and traffic",
        "info_content": ""
      },
      {
        "id": 18,
        "name": "Custom Product Footnotes",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Add additional information about products in a structured layout",
        "info_content": ""
      },
      {
        "id": 19,
        "name": "Custom Size Chart",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Present measurements for product sizes available on sale",
        "info_content": ""
      },
      {
        "id": 20,
        "name": "Messenger Integration",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Chat with your customers directly on their social media",
        "info_content": ""
      },
      {
        "id": 21,
        "name": "Bulk Upload",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Upload multiplt products at once by uploading a simple CSV sheet",
        "info_content": ""
      },
      {
        "id": 22,
        "name": "Product Search",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Add an omnibox to your website to search through products, brands, categories and SKUs",
        "info_content": ""
      },
      {
        "id": 23,
        "name": "App Store Access",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Access to our wide collection of apps",
        "info_content": ""
      },
      {
        "id": 24,
        "name": "Abandoned Cart Recovery",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Automatic email reminders for incomplete purchases",
        "info_content": ""
      },
      {
        "id": 25,
        "name": "Testimonial Uploader",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Reinforce brand trust by uploading custom testimonials with photos",
        "info_content": ""
      },
      {
        "id": 26,
        "name": "Browser Push Notificatons",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Keep your customer updated with regular push notifications",
        "info_content": ""
      },
      {
        "id": 27,
        "name": "Blog Module",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Engage your customers with butifull blogs that helps you sell more",
        "info_content": ""
      },
      {
        "id": 28,
        "name": "Customer Feedback Module",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Get your customers valuble feedback",
        "info_content": ""
      },
      {
        "id": 29,
        "name": "Newsletter Subscription",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Build an organic and powerfull mailing list",
        "info_content": ""
      },
      {
        "id": 30,
        "name": "Product Filters and Tags",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Improve product discoverability through tagged attributes  like price, color and size",
        "info_content": ""
      },
      {
        "id": 31,
        "name": "Product FAQ",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Answer questions before your customers ask",
        "info_content": ""
      },
      {
        "id": 32,
        "name": "Gift Cards ",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Enable gifting solutions for your customers",
        "info_content": ""
      },
      {
        "id": 33,
        "name": "Mark Product as Gift",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Allow shoppers to mark products as gifts and hide the selling price from order recepients",
        "info_content": ""
      },
      {
        "id": 34,
        "name": "Order Instructions/Comments",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Get additional details from your users while they checkout",
        "info_content": ""
      },
      {
        "id": 35,
        "name": "Manual Order Creation",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "Create orders manually to manage offline sales",
        "info_content": ""
      },
      {
        "id": 36,
        "name": "Calculated Shipping Rates",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": false,
        "premium_plan": true,
        "help_content": "Automatically calculate shipping charge based on weight and country",
        "info_content": ""
      },
      {
        "id": 37,
        "name": "Product Customization Module",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": false,
        "premium_plan": true,
        "help_content": "Add multi customizable options to let customers build their own product",
        "info_content": ""
      },
      {
        "id": 38,
        "name": "Product Measurement Module",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": false,
        "premium_plan": true,
        "help_content": "Get measurement sets from your customers to truly create a bespoke product",
        "info_content": ""
      },
      {
        "id": 39,
        "name": "Currency Convertor",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": false,
        "premium_plan": true,
        "help_content": "Give your customers an option to choose from a list of currencies",
        "info_content": ""
      },

    ],
    "support_service": [
      {
        "id": 1,
        "name": "Standard Email Support",
        "free_plan": true,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "",
        "info_content": ""
      },
      {
        "id": 2,
        "name": "Priority Email Support",
        "free_plan": false,
        "lite_plan": true,
        "starter_plan": true,
        "growth_plan": true,
        "premium_plan": true,
        "help_content": "",
        "info_content": ""
      },
      {
        "id": 3,
        "name": "Priority Chat Support",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": false,
        "premium_plan": true,
        "help_content": "",
        "info_content": ""
      },
      {
        "id": 4,
        "name": "Call Support",
        "free_plan": false,
        "lite_plan": false,
        "starter_plan": false,
        "growth_plan": false,
        "premium_plan": true,
        "help_content": "",
        "info_content": ""
      },
    ]
  }
  m_pricing_table: any = {
    "top_features": [
      {
        "id": 1, "name": "Unlimited Products", "free_plan": "info", "lite_plan": true, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": "Upto 500 Products"
      },
      {
        "id": 2, "name": "Order Status Triggers", "free_plan": true, "lite_plan": true, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 3, "name": "CoD", "free_plan": true, "lite_plan": true, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 4, "name": "Staff Accounts", "free_plan": 1, "lite_plan": 1, "starter_plan": 5, "growth_plan": 10, "premium_plan": 20, "help_content": "", "info_content": ""
      },
      {
        "id": 5, "name": "Advanced SEO Editor", "free_plan": "info", "lite_plan": true, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": "Only store SEO optimisation"
      },
      {
        "id": 6, "name": "Unlimited Menus", "free_plan": false, "lite_plan": true, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 7, "name": "Advanced SEO Editor", "free_plan": false, "lite_plan": true, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 8, "name": "Messenger Integration", "free_plan": false, "lite_plan": true, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 9, "name": "Abandoned Cart Recovery", "free_plan": false, "lite_plan": false, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 10, "name": "Blog Module", "free_plan": false, "lite_plan": false, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 11, "name": "Testimonial Uploader", "free_plan": false, "lite_plan": false, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 12, "name": "Product Filters and Tags", "free_plan": false, "lite_plan": false, "starter_plan": true, "growth_plan": true, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 13, "name": "Product Customization Module", "free_plan": false, "lite_plan": false, "starter_plan": false, "growth_plan": false, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 14, "name": "Calculated Shipping Rates", "free_plan": false, "lite_plan": false, "starter_plan": false, "growth_plan": false, "premium_plan": true, "help_content": "", "info_content": ""
      },
      {
        "id": 15, "name": "Currency Converter", "free_plan": false, "lite_plan": false, "starter_plan": false, "growth_plan": false, "premium_plan": true, "help_content": "", "info_content": ""
      },

    ],
  };

  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(public modalService: NgbModal, public commonService: CommonService, private api: DeploymentService, public router: Router) { }

  ngOnInit() {
    this.pageLoader = true;
    this.api.PACKAGE_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.packageList = result.list;
      else console.log("response", result);
    });
  }

  onSelectPlan(x, modalName) {
    this.packageForm = x;
    let priceDetails = x.currency_types[this.commonService.store_currency.country_code];
    this.subList.forEach(element => {
      element.price = priceDetails.live;
      element.price += (priceDetails.amount*element.month);
    });
    this.packageForm.sub_list = this.subList;
    this.packageForm.selected_option = this.subList[0].month;
    this.modalService.open(modalName);
  }

  onSubscribe(x) {
    this.packageForm.submit = true;
    let formData = {
      store_id: this.commonService.store_details._id, package_id: this.packageForm._id,
      month: x, payment_details: { name: "Razorpay" }
    };
    this.api.PACKAGE_RENEWAL(formData).subscribe(result => {
      if(result.status) {
        this.updateDeployStatus();
        let paymentConfig = result.data.payment_config;
        this.razorpayOptions.my_order_id = result.data.order_id;
        this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
        this.razorpayOptions.key = paymentConfig.key;
        this.razorpayOptions.store_name = paymentConfig.name;
        this.razorpayOptions.description = paymentConfig.description;
        setTimeout(_ => this.razorpayForm.nativeElement.submit());
      }
      else {
        this.packageForm.submit = false;
        this.packageForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['package']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.package": true };
      this.api.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

}
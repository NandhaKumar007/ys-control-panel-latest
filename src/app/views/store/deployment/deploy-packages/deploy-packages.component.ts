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
  environment: any = environment; defaultPlan: string;
  razorpayOptions: any = {
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  imgBaseUrl = environment.img_baseurl;
  upgradeData: any = {}; paymentData: any = {};
  pricingToolTip: any = {}; viewAll: boolean;
  all_features: any = []; support_service: any = [];
  mobile_top_features: any = []; top_fea_info: any = {
    free: "All tools to run your ecommerce store",
    essential: "Everything in Free plan, plus",
    professional: "Everything in Essential plan, plus"
  }
  top_features: any = [
    {
      "free": "500 Products",
      "essential": "Unlimited Products",
      "professional": "Basic SEO Editor",
      "lite": "Unlimited Products",
      "starter": "Abandoned Cart Recovery",
      "growth": "Manual Order Creation",
      "premium": "Product Customization Module"
    },
    {
      "free": "Free Sub Domain",
      "essential": "Custom Domain",
      "professional": "Link Existing Domain",
      "lite": "Advanced SEO Editor",
      "starter": "Blog Module",
      "growth": "Product FAQ",
      "premium": "Calculated Shipping Rates"
    },
    {
      "free": "Order Status Triggers",
      "essential": "Product Reviews",
      "professional": "Google Analytics",
      "lite": "Unlimited Menus",
      "starter": "Testimonial Uploader",
      "growth": "Gift Cards",
      "premium": "Currency Converter"
    },
    {
      "free": "UPI & Bank Transfer",
      "essential": "Payment Gateway",
      "professional": "Facebook Pixel",
      "lite": "Messenger Integration",
      "starter": "Product Filters and Tags",
      "growth": "Order Instructions/Comments",
      "premium": "Lowest Transaction Fee"
    },
    {
      "free": "1 menu 4 categories",
      "essential": "Mega Menu",
      "professional": "2 Staff Account",
      "lite": "1 Staff Account",
      "starter": "5 Staff Account",
      "growth": "10 Staff Account",
      "premium": "20 Staff Account"
    },
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
    this.api.PACKAGE_LIST(this.commonService.store_details?.package_info?.category).subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.defaultPlan = result.default_plan;
        this.packageList = result.list;
        this.packageList.forEach(obj => {
          obj.keyword = obj.name.toLowerCase();
          obj.description = obj.description.replace(new RegExp('\n', 'g'), "<br />")
        });
        let pIndex = this.packageList.findIndex(obj => obj._id==this.commonService.store_details.package_details.package_id);
        if(pIndex!=-1) this.packageRank = this.packageList[pIndex].rank;
      }
      else console.log("response", result);
    });
    this.setPackagesInfo();
  }

  setPackagesInfo() {
    // support service
    let genieSupportService = [
      {
        "name": "Email Support",
        "free": true,
        "essential": true,
        "professional": true,
      },
      {
        "name": "Chat Support",
        "free": true,
        "essential": true,
        "professional": true
      },
      {
        "name": "WhatsApp Support",
        "essential": true,
        "professional": true
      },
      {
        "name": "Call Support",
        "essential": true,
        "professional": true
      },
    ];
    let proSupportService = [
      {
        "name": "Standard Email Support",
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
    // all features
    let genieAllFeatures = [
      {
        "name": "Unlimited Products",
        "free": "Upto 500 products",
        "essential": true,
        "professional": true,
        "help_content": "No limit on the total number of products"
      },
      {
        "name": "Discount Codes",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Run powerfull campaingns to boost your sale"
      },
      {
        "name": "Sub domain",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Start your eCommerce store without a domain"
      },
      {
        "name": "UPI & Bank Transfer",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Receive payments directly to your account with 0% processing fee"
      },
      {
        "name": "Desktop Access",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Access the yourstore backend from any PC/Laptop"
      },
      {
        "name": "Tax Module",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Collect TAX's applicable on your sale from your customers"
      },
      {
        "name": "Store pickup",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Give your customer the option to pick-up from your store"
      },
      {
        "name": "Theme colour",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Change the theme colour of your website"
      },
      {
        "name": "Product Variants",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Add multiple combinations of product variants like size, colour, etc.."
      },
      {
        "name": "Category/Catalog",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Categorize the products based on catalog for easy seggregation"
      },
      {
        "name": "Shipping",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Set shipping charges for your orders"
      },
      {
        "name": "Contact Form Leads",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Get enquires form your cusotmer and convert it into sales"
      },
      {
        "name": "Store Controls",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Manage your business with quick on/off controls"
      },
      {
        "name": "Browser Push Notificatons",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Keep your customer updated with regular push notifications"
      },
      {
        "name": "Invoice Generator",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Auto Generated Invoices for each orders"
      },
      {
        "name": "SSL",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "SSL is a security protocol that creates an encrypted link between a web server and a web browser"
      },
      {
        "name": "Custom Size Chart",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Present measurements for product sizes available on sale"
      },
      {
        "name": "Product Search",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Add an omnibox to your website to search through products, brands, categories and SKUs"
      },
      {
        "name": "App Store Access",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Access to our wide collection of apps"
      },
      {
        "name": "Sales Report",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Export of sales data"
      },
      {
        "name": "Layout editor",
        "free": true,
        "essential": true,
        "professional": true,
        "help_content": "Change the banners and segment image to best portray your brand"
      },
      {
        "name": "Payment Gateway",
        "essential": true,
        "professional": true,
        "help_content": "Connect your store with our list of supported payment partners and start receiving payments"
      },
      {
        "name": "Custom Domain",
        "essential": true,
        "professional": true,
        "help_content": "Buy your prefered domain in yourstore to boost your business"
      },
      {
        "name": "Product Reviews and Ratings",
        "essential": true,
        "professional": true,
        "help_content": "Display moderated product reviews from your customers"
      },
      {
        "name": "Mega Menu",
        "essential": true,
        "professional": true,
        "help_content": "Multilevel menu structuring"
      },
      {
        "name": "Themes",
        "essential": true,
        "professional": true,
        "help_content": "Give your brand an exclusive look with our collection of themes"
      },
      {
        "name": "Customer Portal",
        "essential": true,
        "professional": true,
        "help_content": "View your customer database with contact information"
      },
      {
        "name": "Advanced discount options",
        "essential": true,
        "professional": true,
        "help_content": "Automated discount codes to boost your sale"
      },
      {
        "name": "Automatic & Scheduled Discounts",
        "professional": true,
        "help_content": "Option to automate and schedule the offers"
      },
      {
        "name": "Link Existing Domain",
        "professional": true,
        "help_content": "Already have your own domain, you can link it to your account"
      },
      {
        "name": "Google search console",
        "professional": true,
        "help_content": "Helps google list your website and improve SEO"
      },
      {
        "name": "Facebook domain verification",
        "professional": true,
        "help_content": "Domain Verification provides a way for you to claim ownership of your domain in Business Manager"
      },
      {
        "name": "Google Adwords conversion tracking",
        "professional": true,
        "help_content": "Conversion tracking shows you what happens after a customer interacts with your ads"
      },
      {
        "name": "Google Shopping ads",
        "professional": true,
        "help_content": "Google shopping ads appear at the top of search results when you use search terms that indicate you're shopping for a specific product."
      },
      {
        "name": "Google Analytics",
        "professional": true,
        "help_content": "Google Analytics lets you measure your advertising ROI, track webiste visits and analytics"
      },
      {
        "name": "Facebook Pixel",
        "professional": true,
        "help_content": "A code for your website that lets you measure, optimise and build audiences for your advertising campaigns"
      },
      {
        "name": "Pincode/distance based delivery",
        "professional": true,
        "help_content": "Filter out non-servicible areas based on delivery pincodes"
      },
      {
        "name": "Basic SEO Editor",
        "professional": true,
        "help_content": "Drive more organic traffic with custom SEO optimisation"
      },
      {
        "name": "Staff Account",
        "professional": true,
        "help_content": "Create two additional user accounts and assign permissions"
      }
    ];
    let proAllFeatures = [
      {
        "name": "Unlimited Products",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "No limit on the total number of products"
      },
      {
        "name": "Advanced discount options",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Run powerfull campaingns to boost your sale"
      },
      {
        "name": "Dashboard",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "An overview to your complete sales data"
      },
      {
        "name": "Order Status Triggers",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Emails that are triggered by various events in your sales process"
      },
      {
        "name": "Invoice Generator",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Auto Generated Invoices for each orders"
      },
      {
        "name": "Advanced SEO Editor",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Drive more organic traffic with custom SEO optimisation"
      },
      {
        "name": "Multi Format Sales Report",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Download your product, category and total sales reports in XLS, CSV and PDF"
      },
      {
        "name": "Standard Email Template",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Preset email templates for order information and various user interaction with the site"
      },
      {
        "name": "Payment Gateway Integration",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Connect your store with our list of supported payment partners and start receiving payments"
      },
      {
        "name": "CoD",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Offer your customers the prefered payment method"
      },
      {
        "name": "Tax Module",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Collect TAX's applicable on your sale from your customers"
      },
      {
        "name": "SSL",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "SSL is a security protocol that creates an encrypted link between a web server and a web browser"
      },
      {
        "name": "Unlimited Product Variants",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Add multiple combinations of product variants like size, colour, etc.."
      },
      {
        "name": "Unlimited Menus",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Creating a menu with multiple levels of categorisation and improve navigation"
      },
      {
        "name": "Flat Rate Shipping Integration",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Set flat shipping charges for both domestic and international orders"
      },
      {
        "name": "Social Media Login",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "One click social logins for hassle free signups"
      },
      {
        "name": "Google - Facebook Ad Tracking",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Gain insights into your social media campaigns and traffic"
      },
      {
        "name": "Custom Product Footnotes",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Add additional information about products in a structured layout"
      },
      {
        "name": "Custom Size Chart",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Present measurements for product sizes available on sale"
      },
      {
        "name": "Messenger Integration",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Chat with your customers directly on their social media"
      },
      {
        "name": "Bulk Upload",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Upload multiplt products at once by uploading a simple CSV sheet"
      },
      {
        "name": "Product Search",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Add an omnibox to your website to search through products, brands, categories and SKUs"
      },
      {
        "name": "App Store Access",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Access to our wide collection of apps"
      },
      {
        "name": "Abandoned Cart Recovery",
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Automatic email reminders for incomplete purchases"
      },
      {
        "name": "Testimonial Uploader",
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Reinforce brand trust by uploading custom testimonials with photos"
      },
      {
        "name": "Browser Push Notificatons",
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Keep your customer updated with regular push notifications"
      },
      {
        "name": "Blog Module",
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Engage your customers with butifull blogs that helps you sell more"
      },
      {
        "name": "Customer Feedback Module",
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Get your customers valuble feedback"
      },
      {
        "name": "Newsletter Subscription",
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Build an organic and powerfull mailing list"
      },
      {
        "name": "Product Filters and Tags",
        "starter": true,
        "growth": true,
        "premium": true,
        "help_content": "Improve product discoverability through tagged attributes  like price, color and size"
      },
      {
        "name": "Product FAQ",
        "growth": true,
        "premium": true,
        "help_content": "Answer questions before your customers ask"
      },
      {
        "name": "Gift Cards",
        "growth": true,
        "premium": true,
        "help_content": "Enable gifting solutions for your customers"
      },
      {
        "name": "Mark Product as Gift",
        "growth": true,
        "premium": true,
        "help_content": "Allow shoppers to mark products as gifts and hide the selling price from order recepients"
      },
      {
        "name": "Order Instructions/Comments",
        "growth": true,
        "premium": true,
        "help_content": "Get additional details from your users while they checkout"
      },
      {
        "name": "Manual Order Creation",
        "growth": true,
        "premium": true,
        "help_content": "Create orders manually to manage offline sales"
      },
      {
        "name": "Calculated Shipping Rates",
        "premium": true,
        "help_content": "Automatically calculate shipping charge based on weight and country"
      },
      {
        "name": "Product Customization Module",
        "premium": true,
        "help_content": "Add multi customizable options to let customers build their own product"
      },
      {
        "name": "Product Measurement Module",
        "premium": true,
        "help_content": "Get measurement sets from your customers to truly create a bespoke product"
      },
      {
        "name": "Currency Convertor",
        "premium": true,
        "help_content": "Give your customers an option to choose from a list of currencies"
      }
    ];
    // mobile top features
    let genieMobileTopFeatures = [
      {
        "name": "Unlimited Products",
        "free": "Upto 500 Products",
        "essential": true,
        "professional": true
      },
      {
        "name": "Free Sub Domain",
        "free": true,
        "essential": true,
        "professional": true
      },
      {
        "name": "Order Status Triggers",
        "free": true,
        "essential": true,
        "professional": true
      },
      {
        "name": "UPI & Bank Transfer",
        "free": true,
        "essential": true,
        "professional": true
      },
      {
        "name": "1 menu 4 categories",
        "free": true,
        "essential": true,
        "professional": true
      },
      {
        "name": "Custom Domain",
        "essential": true,
        "professional": true
      },
      {
        "name": "Product Reviews",
        "essential": true,
        "professional": true
      },
      {
        "name": "Payment Gateway",
        "essential": true,
        "professional": true
      },
      {
        "name": "Mega Menu",
        "essential": true,
        "professional": true
      },
      {
        "name": "Basic SEO Editor",
        "professional": true
      },
      {
        "name": "Link Existing Domain",
        "professional": true
      },
      {
        "name": "Google Analytics",
        "professional": true
      },
      {
        "name": "Facebook Pixel",
        "professional": true
      },
      {
        "name": "Staff Account",
        "professional": true
      }
    ];
    let proMobileTopFeatures = [
      {
        "name": "Unlimited Products",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Order Status Triggers",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "CoD",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Staff Accounts",
        "lite": 1,
        "starter": 5,
        "growth": 10,
        "premium": 20
      },
      {
        "name": "Advanced SEO Editor",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Unlimited Menus",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Advanced SEO Editor",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Messenger Integration",
        "lite": true,
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Abandoned Cart Recovery",
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Blog Module",
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Testimonial Uploader",
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Product Filters and Tags",
        "starter": true,
        "growth": true,
        "premium": true
      },
      {
        "name": "Product Customization Module",
        "premium": true
      },
      {
        "name": "Calculated Shipping Rates",
        "premium": true
      },
      {
        "name": "Currency Converter",
        "premium": true
      }
    ];
    if(this.commonService.store_details?.package_info?.category=='genie') {
      this.support_service = genieSupportService;
      this.all_features = genieAllFeatures;
      this.mobile_top_features = genieMobileTopFeatures;
    }
    else {
      this.support_service = proSupportService;
      this.all_features = proAllFeatures;
      this.mobile_top_features = proMobileTopFeatures;
    }
  }

  onSelectPlan(x, modalName) {
    this.packageForm = x;
    this.packageForm.submit = false;
    if(this.defaultPlan==x._id) this.modalService.open(modalName, { centered: true });
    else {
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
  }
  onSunscribeDefaultPlan(x) {
    this.packageForm.submit = true;
    this.packageForm = x;
    let formData = { store_id: this.commonService.store_details._id, package_id: this.packageForm._id, month: 1 };
    this.api.PURCHASE_PLAN(formData).subscribe(result => {
      if(result.status) {
        // store details
        this.commonService.store_details.package_details = result.store_details.package_details;
        this.commonService.store_details.status = result.store_details.status;
        this.commonService.store_details.package_info = { name: x.name, category: x.category };
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
        // deploy stages
        this.commonService.deploy_stages = result.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
        document.getElementById('closeModal').click();
        this.router.navigate(['/dashboard']);
      }
      else {
        console.log("response", result);
        this.packageForm.errorMsg = result.message;
      }
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
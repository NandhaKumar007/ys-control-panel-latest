import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
declare const CryptoJS: any;
declare const $: any;

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  dark_theme: boolean;
  desktop_device: boolean;
  grid_list: any = [
    {
      type: "grid_1", name: "Grid 1", icon: "assets/images/grid/Grid-1.png", status: "enabled",
      resolutions: [{ value: "800 x 800 pixels @72ppi" }, { value: "800 x 800 pixels @72ppi" }]
    },
    {
      type: "grid_2", name: "Grid 2", icon: "assets/images/grid/Grid-2.png", status: "enabled",
      resolutions: [{ value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }]
    },
    {
      type: "grid_3", name: "Grid 3", icon: "assets/images/grid/Grid-3.png", status: "enabled",
      resolutions: [{ value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }]
    },
    {
      type: "grid_4", name: "Grid 4", icon: "assets/images/grid/Grid-4.png", status: "enabled",
      resolutions: [
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" },
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }
      ]
    },
    {
      type: "grid_5", name: "Grid 5", icon: "assets/images/grid/Grid-5.png", status: "enabled",
      resolutions: [{ value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }]
    },
    {
      type: "grid_6", name: "Grid 6", icon: "assets/images/grid/Grid-6.png", status: "enabled",
      resolutions: [
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" },
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }
      ]
    },
    {
      type: "grid_7", name: "Grid 7", icon: "assets/images/grid/Grid-7.png", status: "enabled",
      resolutions: [{ value: "1080 x 1140 pixels @72ppi" }, { value: "1080 x 540 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }]
    },
    {
      type: "grid_8", name: "Grid 8", icon: "assets/images/grid/Grid-8.png", status: "enabled",
      resolutions: [
        { value: "700 x 500 pixels @72ppi" }, { value: "700 x 1100 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" },
        { value: "700 x 1100 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 1100 pixels @72ppi" }
      ]
    },
    {
      type: "grid_9", name: "Grid 9", icon: "assets/images/grid/Grid-9.png", status: "enabled",
      resolutions: [
        { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 1060 pixels @72ppi" },
        { value: "1460 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }
      ]
    },
    {
      type: "grid_10", name: "Grid 10", icon: "assets/images/grid/Grid-10.png", status: "enabled",
      resolutions: [
        { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" },
        { value: "700 x 1060 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }
      ]
    },
    {
      type: "grid_11", name: "Grid 11", icon: "assets/images/grid/Grid-11.png", status: "enabled",
      resolutions: [
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" },
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }
      ]
    }
  ];
  blog_grid_list: any = [
    { type: "grid_1", name: "Grid 1", icon: "assets/images/grid/Grid-1.png", status: "enabled" },
    { type: "grid_2", name: "Grid 2", icon: "assets/images/grid/Grid-3.png", status: "enabled" },
    { type: "grid_3", name: "Grid 3", icon: "assets/images/grid/Grid-5.png", status: "enabled" }
  ];
  default_units: any = [
    { name: "Inches", value: "inches" },
    { name: "Cms", value: "cms" }
  ];
  feature_categories:any = [
    { name: "Sales", rank: 1, apps: [] }, { name: "Customer Service", rank: 2, apps: [] }, { name: "Fulfillment", rank: 3, apps: [] },
    { name: "Marketing", rank: 4, apps: [] }, { name: "Sourcing and selling products", rank: 5, apps: [] }, { name: "Store management", rank: 6, apps: [] },
    { name: "Shipping and delivery", rank: 7, apps: [] }, { name: "Sourcing and selling products", rank: 8, apps: [] }, { name: "Store design", rank: 9, apps: [] },
    { name: "Store management", rank: 10, apps: [] }
  ];
  host_name: string = window.location.hostname;
  vapidPublicKey: string = "BK7P3Gui8d5itafHsJ0_amZrnaM8lADhEZcQCRrDZBoBEh_33HBiLHBjS0LUk5UP3Zr2xU2tlFS9Ypnv0xJQHNk";

  master_token: string;
  store_token: string;

  admin_packages: any = [];
  admin_features: any = [];

  store_list: any = [];
  ys_features: any = [];
  subuser_features: any = [];

  store_details: any = {};
  store_currency: any = {};
  subuser_permissions: any = {};
  vendor_permissions: any = {};

  user_list: any = [];
  vendor_list: any = [];
  currency_types: any = [];
  route_permission_list: any = [];
  archive_list: any = [];
  country_list: any = [];
  aistyle_list: any = [];
  courier_partners: any = [];
  catalog_list: any = [];
  payment_list: any = [];
  ys_payment_list: any = [];
  branch_list: any =[];
  deploy_stages: any = {};
  deploy_details: any = {};

  page_attr: any;
  product_page_attr: any;
  selected_customer: any;
  custom_model: any;
  
  scroll_y_pos: number;
  cryptoSecretkey: string = "YoUr065SToRE217C0nTr0I^&$pA^eL%^&KeY";
  socialTypes: any = ["facebook", "instagram", "tiktok", "twitter", "snapchat", "pinterest", "linkedin", "behance", "dribble", "youtube", "whatsapp", "website"];
  verNum: any = new Date().valueOf();

  constructor(private router: Router, private location: Location) {
    if(localStorage.getItem('admin_packages')) this.admin_packages = this.decryptData(localStorage.getItem("admin_packages"));
    if(localStorage.getItem('admin_features')) this.admin_features = this.decryptData(localStorage.getItem("admin_features"));

    if(localStorage.getItem('ys_features')) this.ys_features = this.decryptData(localStorage.getItem("ys_features"));
    if(localStorage.getItem('subuser_features')) this.subuser_features = this.decryptData(localStorage.getItem("subuser_features"));
    if(localStorage.getItem('store_details')) this.store_details = this.decryptData(localStorage.getItem("store_details"));
    if(localStorage.getItem('store_currency')) this.store_currency = this.decryptData(localStorage.getItem("store_currency"));
    if(localStorage.getItem('route_permission_list')) this.route_permission_list = this.decryptData(localStorage.getItem("route_permission_list"));
    
    if(localStorage.getItem('currency_types')) this.currency_types = this.decryptData(localStorage.getItem("currency_types"));
    if(localStorage.getItem('country_list')) this.country_list = this.decryptData(localStorage.getItem("country_list"));

    if(localStorage.getItem('archive_list')) this.archive_list = this.decryptData(localStorage.getItem("archive_list"));
    if(localStorage.getItem('aistyle_list')) this.aistyle_list = this.decryptData(localStorage.getItem("aistyle_list"));
    if(localStorage.getItem('courier_partners')) this.courier_partners = this.decryptData(localStorage.getItem("courier_partners"));
    if(localStorage.getItem('vendor_list')) this.vendor_list = this.decryptData(localStorage.getItem("vendor_list"));
    if(localStorage.getItem('catalog_list')) this.catalog_list = this.decryptData(localStorage.getItem("catalog_list"));
    if(localStorage.getItem('payment_list')) this.payment_list = this.decryptData(localStorage.getItem("payment_list"));
    if(localStorage.getItem('ys_payment_list')) this.ys_payment_list = this.decryptData(localStorage.getItem("ys_payment_list"));
    if(localStorage.getItem('branch_list')) this.branch_list = this.decryptData(localStorage.getItem("branch_list"));
    if(localStorage.getItem('deploy_details')) this.deploy_details = this.decryptData(localStorage.getItem("deploy_details"));
    if(localStorage.getItem('deploy_stages')) this.deploy_stages = this.decryptData(localStorage.getItem("deploy_stages"));

    if(localStorage.getItem('vendor_permissions')) this.vendor_permissions = this.decryptData(localStorage.getItem("vendor_permissions"));

    if(localStorage.getItem('master_token')) this.master_token = localStorage.getItem("master_token");
    if(localStorage.getItem('store_token')) this.store_token = localStorage.getItem("store_token");
  }

  goBack() {
    this.location.back();
  }

  updateLocalData(key: string, value: any) {
    localStorage.setItem(key, this.encryptData(value));
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.cryptoSecretkey).toString();
    } catch (e) {
      console.log("encrypt err-----", e);
    }
  }
  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.cryptoSecretkey);
      if(bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log("decrypt err-----", e);
    }
  }

  PRICE_FORMAT(currency_details, price) {
    return (price/currency_details.country_inr_value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  urlFormat(string) {
    string = string.toLowerCase().replace(/[^a-zA-Z0-9- ]/g, "");
    string = string.replace(/ +(?= )/g, "");
    string = string.replace(/[^a-zA-Z0-9]/g, "-");
    string = string.replace("---", "-");
    return string;
  }

  changeTheme() {
    if(this.dark_theme) {
      localStorage.setItem("darkSwitch", "true");
      document.body.setAttribute("data-theme", "true")
    }
    else {
      localStorage.removeItem("darkSwitch");
      document.body.removeAttribute("data-theme");
    }
  }

  scrollModalTop(timer: number) {
    setTimeout(() => {
      $('.modal-body').each(function(index, element) {
        let className = 'modal-body'+(index+1);
        element.classList.add(className);
        $("."+className).scrollTop(0);
      });
    }, timer);
  }

  pageTop(x) {
    setTimeout(() => { window.scrollTo({ top: x, behavior: 'smooth' }); }, 500);
  }

  signOut(redirectPath) {
    this.clearData();
    this.router.navigate([redirectPath]);
  }

  clearData() {
    localStorage.clear();
    sessionStorage.clear();

    this.admin_packages = [];
    this.admin_features = [];
    this.ys_features = [];
    this.subuser_features = [];

    delete this.master_token;
    delete this.store_token;
    this.route_permission_list = [];

    this.store_details = {};
    this.store_currency = {};
    this.vendor_permissions = {};
    this.subuser_permissions = {};
    this.deploy_stages = {};
    this.deploy_details = {};

    this.vendor_list = [];
    this.archive_list = [];
    this.country_list = [];
    this.aistyle_list = [];
    this.catalog_list = [];
    this.payment_list = [];
    this.currency_types = [];
    this.courier_partners = [];
    
    delete this.page_attr;
    delete this.scroll_y_pos;
    delete this.product_page_attr;
    delete this.selected_customer;
  }

  timeConversion(timeString) {
    var H = timeString.substr(0, 2);
    var convertedTime = (H % 12) || 12;
    var h = convertedTime < 10 ? "0"+ convertedTime : convertedTime;
    var ampm = H < 12 ? " AM" : " PM";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }

  uninstallApp(keyword, storeDetails) {
    let paidFeatures = storeDetails.package_details.paid_features;
    if(paidFeatures.indexOf(keyword) == -1) {
      let yIndex = this.ys_features.indexOf(keyword);
      if(yIndex!=-1) {
        this.ys_features.splice(yIndex, 1);
        this.updateLocalData('ys_features', this.ys_features);
        return true;
      }
      else return false;
    }
    else return false;
  }

}
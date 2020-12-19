import { Injectable } from '@angular/core';
declare const CryptoJS: any;
declare const $: any;

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  dark_theme: boolean;
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

  default_units: any = [
    { name: "Inches", value: "inches" },
    { name: "Cms", value: "cms" }
  ];

  master_token: string = null;
  store_token: string = null;

  admin_packages: any = [];
  admin_features: any = [];

  store_list: any = [];
  // basic_discount, time_based_delivery, giftcard_wallet, variant_image_tag, limited_products, multi_menu, domestic_shipping
  // collections, discount_pages
  ys_features: any = [
    "pincode_service", "measurements", "addons", "product_filters", "foot_note", "size_chart", "faq", "shopping_assistant", "advanced_seo",
    "seo_page_content", "blogs", "currency_variation", "giftcard", "product_archive", "newsletter", "advanced_discount", "manual_order", 
    "manual_giftcard", "donation", "customer_feedback", "vendors", "menus", "courier_partners", "testimonials", "sales_report", "order_note",
    "sizing_assistant", "product_video"
  ];
  store_details: any = {};
  store_currency: any = {};
  courier_partners: any = {};
  vendor_list: any = [];
  currency_types: any = [];
  route_permission_list: any = [];
  archive_list: any = [];
  country_list: any = [];
  aistyle_list: any = [];
  vendor_permissions: any = {};

  overall_category: any = [];
  seo_category: any = [];

  page_attr: any;
  product_page_attr: any;
  selected_customer: any;
  
  scroll_y_pos: number;
  cryptoSecretkey: string = "YoUr065SToRE217C0nTr0I^&$pA^eL%^&KeY";

  constructor() {
    if(localStorage.getItem('admin_packages')) this.admin_packages = this.decryptData(localStorage.getItem("admin_packages"));
    if(localStorage.getItem('admin_features')) this.admin_features = this.decryptData(localStorage.getItem("admin_features"));

    if(localStorage.getItem('ys_features')) this.ys_features = this.decryptData(localStorage.getItem("ys_features"));
    if(localStorage.getItem('store_details')) this.store_details = this.decryptData(localStorage.getItem("store_details"));
    if(localStorage.getItem('store_currency')) this.store_currency = this.decryptData(localStorage.getItem("store_currency"));
    if(localStorage.getItem('route_permission_list')) this.route_permission_list = this.decryptData(localStorage.getItem("route_permission_list"));
    
    if(localStorage.getItem('currency_types')) this.currency_types = this.decryptData(localStorage.getItem("currency_types"));
    if(localStorage.getItem('country_list')) this.country_list = this.decryptData(localStorage.getItem("country_list"));

    if(localStorage.getItem('archive_list')) this.archive_list = this.decryptData(localStorage.getItem("archive_list"));
    if(localStorage.getItem('aistyle_list')) this.aistyle_list = this.decryptData(localStorage.getItem("aistyle_list"));
    if(localStorage.getItem('courier_partners')) this.courier_partners = this.decryptData(localStorage.getItem("courier_partners"));
    if(localStorage.getItem('vendor_list')) this.vendor_list = this.decryptData(localStorage.getItem("vendor_list"));

    if(localStorage.getItem('overall_category')) this.overall_category = this.decryptData(localStorage.getItem("overall_category"));
    if(localStorage.getItem('seo_category')) this.seo_category = this.decryptData(localStorage.getItem("seo_category"));

    if(localStorage.getItem('vendor_permissions')) this.vendor_permissions = this.decryptData(localStorage.getItem("vendor_permissions"));

    if(localStorage.getItem('master_token')) this.master_token = localStorage.getItem("master_token");
    if(localStorage.getItem('store_token')) this.store_token = localStorage.getItem("store_token");
  }

  updateLocalData(key, value) {
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

}
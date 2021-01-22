import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})

export class GeneralSettingComponent implements OnInit {

  settingForm: any = {};
  mailTypes: any = [
    {
      name: "Gmail", value: "gmail",
      transporter : { host: "smtp.gmail.com", port: 465, secure: true }
    },
    {
      name: "Ezveb", value: "ezveb",
      transporter : { host: "mail.ezveb.com", port: 25, secureConnection: false }
    },
    {
      name: "Godaddy", value: "godaddy",
      transporter : { host: "smtpout.secureserver.net", port: 465, secureConnection: true, service: "Godaddy" }
    },
    {
      name: "Outlook", value: "outlook",
      transporter : { host: "smtp-mail.outlook.com", port: 587, secureConnection: false, tls: { ciphers: "SSLv3" } }
    },
    {
      name: "Roundcube", value: "roundcube",
      transporter : { port: 465, secure: true }
    },
    {
      name: "Zoho", value: "zoho",
      transporter : { host: "smtp.zoho.com", port: 465, secure: true }
    }
  ];
  textTypes: any = [
    { name: "Dark", value: "#000" },
    { name: "Light", value: "#fff" }
  ];
  codExist: boolean; app_setting: any;
  checkout_setting: any; productList: any = [];

  constructor(config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: StoreApiService, private atp: AmazingTimePickerService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    if(this.commonService.payment_list.findIndex(obj => obj.name=='COD') != -1) this.codExist = true;
  }

  // mail configuration
  onOpenMailModal(modalName) {
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.settingForm = result.data.mail_config;
        if(this.settingForm.transporter && this.settingForm.transporter.auth) {
          this.settingForm.username = this.settingForm.transporter.auth.user;
          this.settingForm.password = this.settingForm.transporter.auth.pass;
        }
        this.settingForm.from_name = this.commonService.store_details.name;
        if(this.settingForm.send_from) {
          let splitData = this.settingForm.send_from.split("<");
          this.settingForm.from_name = splitData[0].trim();
        }
        if(this.settingForm.host_type=='roundcube') {
          this.settingForm.mail_domain = this.settingForm.transporter.name;
          this.settingForm.mail_host = this.settingForm.transporter.host;
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateMailConfig() {
    let index = this.mailTypes.findIndex(obj => obj.value==this.settingForm.host_type);
    if(index!=-1) {
      this.settingForm.submit = true;
      this.settingForm.transporter = this.mailTypes[index].transporter;
      this.settingForm.transporter.auth = { user: this.settingForm.username, pass: this.settingForm.password };
      this.settingForm.send_from = this.settingForm.from_name+" <"+this.settingForm.username+">";
      if(this.settingForm.host_type=='roundcube') {
        this.settingForm.transporter.name = this.settingForm.mail_domain;
        this.settingForm.transporter.host = this.settingForm.mail_host;
      }
      this.api.STORE_UPDATE({ mail_config: this.settingForm }).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
        }
        else {
          this.settingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.settingForm.errorMsg = "Invalid Host";
    }
  }

  // setting
  onOpenSettingModal(modalName) {
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.app_setting = result.data.application_setting;
        this.checkout_setting = result.data.checkout_setting;
        // search keywords
        this.app_setting.search_keyword_list = [];
        if(this.app_setting.search_keywords.length) {
          this.app_setting.search_keywords.forEach(obj => {
            this.app_setting.search_keyword_list.push({display: obj, value: obj});
          });
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }

  onUpdateStore() {
    let sendData: any = { application_setting: {} };
    sendData.application_setting.cod_charges = this.app_setting.cod_charges;
    sendData.application_setting.gift_wrapping_charges = this.app_setting.gift_wrapping_charges;
    sendData.application_setting.max_shipping_weight = this.app_setting.max_shipping_weight;
    sendData.application_setting.min_checkout_value = this.app_setting.min_checkout_value;
    sendData.application_setting.enquiry_email = this.app_setting.enquiry_email;
    sendData.application_setting.cancel_order_email = this.app_setting.cancel_order_email;

    sendData.application_setting.guest_checkout = this.app_setting.guest_checkout;
    sendData.application_setting.ship_only_in_domestic = this.app_setting.ship_only_in_domestic;
    sendData.application_setting.disp_stock_left = this.app_setting.disp_stock_left;
    sendData.application_setting.min_stock = this.app_setting.min_stock;

    if(this.commonService.ys_features.indexOf('customer_feedback')!=-1) sendData.application_setting.feedback = this.app_setting.feedback;
    if(this.commonService.ys_features.indexOf('addons')!=-1) sendData.application_setting.product_addon = this.app_setting.product_addon;
    if(this.commonService.ys_features.indexOf('currency_variation')!=-1) sendData.application_setting.hide_currency = this.app_setting.hide_currency;

    this.api.UPDATE_STORE_PROPERTY_DETAILS(sendData).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateCheckout() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ checkout_setting: this.checkout_setting }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.checkout_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateKeywords() {
    let searchKeywords = [];
    if(this.app_setting.search_keyword_list) {
      this.app_setting.search_keyword_list.forEach(obj => {
        searchKeywords.push(obj.value);
      });
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.search_keywords": searchKeywords }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateInvoice() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.invoice_status": this.app_setting.invoice_status, "application_setting.invoice_config": this.app_setting.invoice_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateSocial() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.google_id": this.app_setting.google_id, "application_setting.facebook_id": this.app_setting.facebook_id }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateNewsletter() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.newsletter_status": this.app_setting.newsletter_status, "application_setting.newsletter_config": this.app_setting.newsletter_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateChat() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.chat_status": this.app_setting.chat_status, "application_setting.chat_config": this.app_setting.chat_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Announcement bar
  onOpenAnnounceModal(modalName) {
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.app_setting = result.data.application_setting;
        // announcement bar
        if(this.app_setting.announcebar_config && this.app_setting.announcebar_config.timer_date) {
          this.app_setting.announcebar_config.end_date = new Date(this.app_setting.announcebar_config.timer_date);
          this.app_setting.announcebar_config.end_time = new Date(this.app_setting.announcebar_config.timer_date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        // product list
        if(!this.productList.length) {
          this.api.PRODUCT_LIST({ category_id: 'all' }).subscribe(result => {
            if(result.status) this.productList = result.list;
            else console.log("response", result);
          });
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateAnnounceBar() {
    if(this.app_setting.announcebar_status && this.app_setting.announcebar_config.timer) {
      let timerDate = new Date(this.app_setting.announcebar_config.end_date).toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' })+" "+this.app_setting.announcebar_config.end_time;
      this.app_setting.announcebar_config.timer_date = new Date(timerDate);
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.announcebar_status": this.app_setting.announcebar_status, "application_setting.announcebar_config": this.app_setting.announcebar_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  timePicker(x) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.settingForm[x] = this.timeConversion(time);
    });
  }
  timeConversion(timeString) {
    var H = timeString.substr(0, 2);
    var convertedTime = (H % 12) || 12;
    var h = convertedTime < 10 ? "0"+ convertedTime : convertedTime;
    var ampm = H < 12 ? " AM" : " PM";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }

}
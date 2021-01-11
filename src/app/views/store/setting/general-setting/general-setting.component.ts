import { Component, OnInit } from '@angular/core';
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

  constructor(config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: StoreApiService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
  }

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

}
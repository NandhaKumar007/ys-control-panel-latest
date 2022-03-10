import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ys-clients',
  templateUrl: './ys-clients.component.html',
  styleUrls: ['./ys-clients.component.scss'],
  animations: [SharedAnimations]
})

export class YsClientsComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
  pageLoader: boolean; parent_list: any = []; list: any = [];
  imgBaseUrl = environment.img_baseurl; buildForm: any = {};
  listType: string = 'all'; expiryDay: string = "15";
  pwdForm: any = {}; deleteForm: any = {}; settingForm: any = {};
  verNum: any = new Date().getFullYear()+''+new Date().getMonth()+''+new Date().getDate()+''+new Date().getHours();
  configData: any = environment.config_data;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true; this.page = 1;
    let filterType = "type="+this.listType;
    if(this.listType=='trial_expires_in') {
      let trialDate = new Date().setDate(new Date().getDate() + parseInt(this.expiryDay));
      filterType += "&from="+new Date(trialDate).setHours(0,0,0,0);
      filterType += "&to="+new Date(trialDate).setHours(23,59,59,999);
    }
    this.adminApi.STORE_LIST(filterType).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.list.forEach(obj => {
          obj.account_expiry = obj.package_details.trial_expiry;
          if(obj.package_details.billing_status && obj.package_details.expiry_date)
            obj.account_expiry = obj.package_details.expiry_date;
          obj.package_name = "NA";
          let packIndex = this.commonService.admin_packages.findIndex(x => x._id==obj.package_details.package_id);
          if(packIndex!=-1) obj.package_name = this.commonService.admin_packages[packIndex].name;
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSendNotification() {
    this.pwdForm.submit = true;
    this.pwdForm.type = this.listType;
    if(this.listType=='trial_expires_in') {
      let trialDate = new Date().setDate(new Date().getDate() + parseInt(this.expiryDay));
      this.pwdForm.from = new Date(trialDate).setHours(0,0,0,0);
      this.pwdForm.to = new Date(trialDate).setHours(23,59,59,999);
    }
    this.adminApi.SEND_NOTIFICATION(this.pwdForm).subscribe(result => {
      this.pwdForm.submit = false;
      if(result.status) document.getElementById("closeModal").click();
      else {
        console.log("response", result);
        this.pwdForm.errorMsg = result.message;
      }
    });
  }

  onUpdatePwd() {
    this.adminApi.CHANGE_STORE_PWD({ store_id: this.pwdForm._id, new_pwd: this.pwdForm.new_pwd }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.pwdForm.errorMsg = result.message;
      }
    });
  }

  onUpdateStatus() {
    let storeStatus = 'active';
    if(this.deleteForm.status=='active') storeStatus = 'inactive';
    this.adminApi.UPDATE_STORE({ _id: this.deleteForm._id, status: storeStatus, session_key: new Date().valueOf() }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  onDelete() {
    if(this.deleteForm.status=='inactive') {
      this.adminApi.DELETE_STORE({ _id: this.deleteForm._id }).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          console.log("response", result);
          this.deleteForm.errorMsg = result.message;
        }
      });
    }
    else this.deleteForm.errorMsg = "Invalid store";
  }

  onUpdateSetting() {
    this.adminApi.UPDATE_STORE({ _id: this.settingForm._id, additional_features: this.settingForm.additional_features }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.settingForm.errorMsg = result.message;
      }
    });
  }

  openBuildInfoModal(x, modalName) {
    this.buildForm = { _id: x._id, name: x.name, website: x.website, build_details: x.build_details };
    this.modalService.open(modalName);
  }
  manualDeploy() {
    this.buildForm.submit = true;
    this.adminApi.MANUAL_DEPLOY(this.buildForm._id).subscribe(result => {
      this.buildForm.submit = false;
      if(result.status) this.ngOnInit();
      else {
        console.log("response", result);
        this.buildForm.errorMsg = result.message;
      }
    });
  }
  checkBuildStatus() {
    this.buildForm.submit = true;
    this.adminApi.CHECK_BUILD_STATUS(this.buildForm._id).subscribe(result => {
      this.buildForm.submit = false;
      if(result.status) this.ngOnInit();
      else {
        console.log("response", result);
        this.buildForm.errorMsg = result.message;
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.pwdForm.image = (<FileReader>event.target).result;
        this.pwdForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  sendWhatsapp(x) {
    let msgContent = "Dear "+x.company_details.contact_person+",%0a%0a";
    msgContent += "Greetings from Yourstore!%0a%0a";
    msgContent += "Thank you for setting up your website with us.%0a%0a";
    msgContent += "To continue setup, use chrome browser to access the website%0a%0a";
    msgContent += "yourstore.io/login%0a";
    msgContent += "Enter your login id and password used on signup%0a%0a";
    msgContent += "To Install Yourstore as an app,%0a";
    msgContent += "Click  “Add Yourstore to Home screen” when prompted in chrome browser on opening yourstore.io/login to Install as app to get live order notification and for easy access.%0a%0a";
    msgContent += "No store logo?%0a";
    msgContent += "Do not worry, use logomaker.net to generate free logo for your website.%0a%0a";
    msgContent += "Please feel free to get in touch with us on this number for any queries and guidance.%0a%0a";
    msgContent += "Cheers to more sales,%0a";
    msgContent += "Team yourstore.io";
    let url = "https://api.whatsapp.com/send?phone="+x.company_details.dial_code.replace("+", "")+x.company_details.mobile+"&text="+msgContent;
    window.open(url, '_blank');
  }

}
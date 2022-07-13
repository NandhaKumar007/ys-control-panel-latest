import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss']
})

export class VendorProfileComponent implements OnInit {

  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  pwdForm: any = {}; vendorDetails: any = {};
  imgForm: any = {}; vendorForm: any = {};
  state_list: any = [];
  reg_address_fields: any = [];
  pick_address_fields: any = [];
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private accountApi: AccountService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.accountApi.VENDOR_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.vendorDetails = result.data;
        this.onCountryChange(this.commonService.store_details?.country);
      }
      else console.log("response", result);
    });
  }

  onEdit(modalName) {
    this.accountApi.VENDOR_DETAILS(this.vendorDetails._id).subscribe((result) => {
      if(result.status) {
        this.vendorForm = result.data;
        delete this.vendorForm.password;
        this.reg_address_fields.forEach(element => {
          element.value = this.vendorForm.registered_address[element.keyword];
        });
        this.pick_address_fields.forEach(element => {
          element.value = this.vendorForm.pickup_address[element.keyword];
        });
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdate() {
    this.reg_address_fields.forEach(element => {
      if(element.value) this.vendorForm.registered_address[element.keyword] = element.value;
    });
    this.pick_address_fields.forEach(element => {
      if(element.value) this.vendorForm.pickup_address[element.keyword] = element.value;
    });
    this.vendorForm.submit = true;
    this.accountApi.UPDATE_VENDOR(this.vendorForm).subscribe(result => {
      this.vendorForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.vendorDetails = result.data;
      }
      else {
        this.vendorForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateBanner() {
    this.imgForm.submit = true;
    this.accountApi.UPDATE_VENDOR(this.imgForm).subscribe(result => {
      this.imgForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.vendorDetails = result.data;
      }
      else {
        this.imgForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangePwd() {
    this.pwdForm.submit = true;
    this.accountApi.CHANGE_VENDOR_PWD(this.pwdForm).subscribe(result => {
      this.pwdForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.signOut('/vendor/signin/'+this.commonService.vendor_login_info?.name);
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.imgForm.image = (<FileReader>event.target).result;
        this.imgForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onCountryChange(x) {
    this.state_list = [];
    this.reg_address_fields = []; this.pick_address_fields = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      let cDetails = this.commonService.country_list[index];
      this.state_list = cDetails.states;
      cDetails.address_fields.forEach(el => {
        this.reg_address_fields.push({ keyword: el.keyword, label: el.label });
        this.pick_address_fields.push({ keyword: el.keyword, label: el.label });
      });
    }
  }

}

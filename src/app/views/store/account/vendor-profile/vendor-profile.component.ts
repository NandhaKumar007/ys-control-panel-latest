import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { StoreApiService } from 'src/app/services/store-api.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss'],
  animations: [SharedAnimations]
})

export class VendorProfileComponent implements OnInit {

  pageLoader: boolean;
  base_url: "http://localhost:4500";
  razorpay_redirect_url= "http://localhost:4000/store_details/razorpay_payment/";
  imgBaseUrl = environment.img_baseurl;
  environment:any= environment;
  pwdForm: any = {}; vendorDetails: any = {};
  imgForm: any = {}; vendorForm: any = {};
  state_list: any = [];
  reg_address_fields: any = [];
  pick_address_fields: any = [];
  orderForm:any={}; paymentTypes:any= [];
  razorpayOptions: any = {
    my_order_type: "vendor_wallet",
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  list:any=[]; filterForm:any={};
  balance: number = 0;

  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private accountApi: AccountService, 
    public router: Router, public storeApi: StoreApiService
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
        this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
        this.getList();
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

  onTopup(){
    this.orderForm.submit = true;
    this.accountApi.VENDOR_WALLET_TOPUP({ order_price: this.orderForm.price, order_info: "Top Up", payment_details:{ name: "Razorpay" } }).subscribe(result => {
      this.orderForm.submit = false;
      if(result.status) {
        let paymentAppConfig = this.paymentTypes.filter(obj => obj.name == 'Razorpay');
        let paymentConfig = paymentAppConfig[0].app_config;
        this.razorpayOptions.my_order_id = result.data.order_id;
        this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
        this.razorpayOptions.key = paymentConfig.key;
        this.razorpayOptions.store_name = paymentConfig.name;
        this.razorpayOptions.description = paymentConfig.description;
        setTimeout(_ => this.razorpayForm.nativeElement.submit());
      }
      else {
        this.orderForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onOpenTopup(modalName){
    this.orderForm={};
    this.storeApi.STORE_DETAILS().subscribe((result)=>{
      if(result.status){
        this.paymentTypes = result.data.payment_types;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    })
  }

  getList() {
    this.pageLoader = true;
    this.accountApi.VENDOR_WALLET_STATEMENT(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.balance = result.balance;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

}

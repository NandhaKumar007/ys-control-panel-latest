import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../setup.service';
import { CommonService } from '../../../../services/common.service';
import { resource } from 'selenium-webdriver/http';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
  animations: [SharedAnimations]
})

export class PaymentMethodsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
	payForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;

	constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.PAYMENT_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else console.log("response", result);
    });
  }

  // ADD
	onAdd() {
    if(this.list.findIndex(obj => obj.name==this.payForm.name) == -1) {
      let formData = this.structureFormData();
      formData.rank = this.maxRank+1;
      this.api.ADD_PAYMENT(formData).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
          this.commonService.payment_list = this.list;
          this.commonService.updateLocalData('payment_list', this.list);
        }
        else {
          this.payForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.payForm.errorMsg = "Payment already exist.";
    }
  }

	// EDIT
  onEdit(x, modalName) {
    this.payForm = { form_type: 'update', _id: x._id, name: x.name, btn_name: x.btn_name, status: x.status, prev_rank: x.rank, rank: x.rank };
    if(x.cod_charges) this.payForm.cod_charges = x.cod_charges;
    if(x.mode) this.payForm.mode = x.mode;
    if(x.name=='Razorpay') {
      this.payForm.store_name = x.app_config.name;
      this.payForm.description = x.app_config.description;
      this.payForm.key_id = x.config.key_id;
      this.payForm.key_secret = x.config.key_secret;
    }
    else if(x.name=='CCAvenue') {
      this.payForm.merchant_id = x.config.merchant_id;
      this.payForm.working_key = x.config.working_key;
      this.payForm.ap_access_code = x.additional_params.access_code;
      this.payForm.ap_working_key = x.additional_params.working_key;
      this.payForm.ac_access_code = x.app_config.access_code;
    }
    else if(x.name=='PayPal') {
      this.payForm.client_id = x.config.client_id;
      this.payForm.client_secret = x.config.client_secret;
    }
    else if(x.name=='Square') {
      this.payForm.access_token = x.config.access_token;
      this.payForm.store_name = x.app_config.name;
      this.payForm.app_id = x.app_config.app_id;
      this.payForm.location_id = x.app_config.location_id;
    }
    else if(x.name=='Fatoorah') {
      this.payForm.token = x.config.token;
    }
    else if(x.name=='Telr') {
      this.payForm.key = x.config.key;
      this.payForm.ivp_store = x.config.ivp_store;
    }
    else if(x.name=='Foloosi') {
      this.payForm.merchant_key = x.config.merchant_key;
      this.payForm.secret_key = x.config.secret_key;
    }
    this.modalService.open(modalName, {size: 'lg'});
  }

  onChangeStatus(x, modalName) {
    this.payForm = x;
    this.payForm.prev_rank = x.rank;
    this.payForm.prev_status = x.status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    if(this.payForm.status=='active') this.payForm.status = 'inactive';
    else this.payForm.status = 'active';
    this.api.UPDATE_PAYMENT(this.payForm).subscribe(result => {
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else {
        this.payForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // UPDATE
	onUpdate() {
    let formData = this.structureFormData();
    this.api.UPDATE_PAYMENT(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else {
        this.payForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  
  // DELETE
  onDelete() {
    this.api.DELETE_PAYMENT(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  structureFormData() {
    let paymentData: any = { name: this.payForm.name, btn_name: this.payForm.btn_name, status: this.payForm.status };
    if(this.payForm.cod_charges) paymentData.cod_charges = this.payForm.cod_charges;
    if(this.payForm.form_type=='update') {
      paymentData._id = this.payForm._id;
      paymentData.rank = this.payForm.rank;
      paymentData.prev_rank = this.payForm.prev_rank;
    }
    if(paymentData.name!='COD' && paymentData.name!='Square') {
      paymentData.return_url = this.commonService.store_details.base_url+'/checkout/order-summary';
      paymentData.cancel_url = this.commonService.store_details.base_url+'/checkout/payment-failure';
    }
    if(paymentData.name=='Razorpay') {
      paymentData.config = { key_id: this.payForm.key_id, key_secret: this.payForm.key_secret };
      paymentData.app_config = { name: this.payForm.store_name, description: this.payForm.description, key: this.payForm.key_id };
    }
    else if(paymentData.name=='CCAvenue') {
      paymentData.config = { merchant_id: this.payForm.merchant_id, working_key: this.payForm.working_key };
      paymentData.additional_params = { access_code: this.payForm.ap_access_code, working_key: this.payForm.ap_working_key };
      paymentData.app_config = { access_code: this.payForm.ac_access_code };
    }
    else if(paymentData.name=='PayPal') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { client_id: this.payForm.client_id, client_secret: this.payForm.client_secret };
    }
    else if(paymentData.name=='Square') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { access_token: this.payForm.access_token };
      paymentData.app_config = { name: this.payForm.store_name, app_id: this.payForm.app_id, location_id: this.payForm.location_id };
    }
    else if(paymentData.name=='Fatoorah') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { token: this.payForm.token };
    }
    else if(paymentData.name=='Telr') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { key: this.payForm.key, ivp_store: this.payForm.ivp_store };
    }
    else if(paymentData.name=='Foloosi') {
      paymentData.config = { merchant_key: this.payForm.merchant_key, secret_key: this.payForm.secret_key };
      paymentData.app_config = { merchant_key: this.payForm.merchant_key };
    }
    return paymentData;
  }

}
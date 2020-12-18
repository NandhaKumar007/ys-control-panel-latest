import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ActivatedRoute, Params} from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../services/customer-api.service';
import { ApiService } from '../../../services/api.service';
import { ExcelService } from '../../../services/excel.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  animations: [SharedAnimations]
})

export class CustomersComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean; exportLoader: boolean; addressFormType: string;
  list: any = []; editForm: any = {}; addressForm: any = {}; customerForm: any = {};
  country_details: any; address_fields: any = []; mobile_pattern: any;
  state_list: any = []; deleteForm: any = {};
  selected_customer: any; selected_address: any; btnLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private excelService: ExcelService,
    private customerApi: CustomerApiService, private api: ApiService, private activeRoute: ActivatedRoute, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    // country list
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.pageLoader = true; this.list = [];
      if(params.customer_id) {
        this.customerApi.CUSTOMER_DETAILS(params.customer_id).subscribe(result => {
          if(result.status) {
            this.list = [result.data];
            this.modifyList();
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      else this.loadCustomerList();
    });
  }

  loadCustomerList() {
    this.pageLoader = true;
    this.customerApi.CUSTOMER_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.modifyList();
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }
  modifyList() {
    this.list.forEach(element => {
      if(!element.mobile) {
        if(element.address_list.length) {
          let filteredAddress = element.address_list.filter(obj => obj.billing_address);
          if(filteredAddress.length) element.mobile = filteredAddress[0].dial_code+" "+filteredAddress[0].mobile;
          else element.mobile = "NA";
        }
        else element.mobile = "NA";
      }
    });
  }

  // ADD CUSTOMER
  addCustomerModal(modalName) {
    this.customerForm = { step:1, address_form: { type: 'home', billing_address: true, shipping_address: true, country: this.commonService.store_details.country } };
    this.onCountryChange(this.customerForm.address_form.country);
    this.modalService.open(modalName, {size: 'lg'});
  }
  onAddCustomer() {
    this.customerForm.submit = true;
    let addressForm = this.customerForm.address_form;
    this.address_fields.forEach(element => {
      if(element.value) addressForm[element.keyword] = element.value;
    });
    this.customerForm.address_list = [addressForm];
    this.customerApi.ADD_CUSTOMER(this.customerForm).subscribe(result => {
      this.customerForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.loadCustomerList();
      }
      else {
        console.log("response", result);
        this.customerForm.error_msg = result.message;
      }
    });
  }

  // EDIT CUSTOMER
  onEditCustomer(x, modalName) {
    this.btnLoader = false;
    this.editForm = { _id: x._id, name: x.name, email: x.email, mobile: x.mobile };
    this.modalService.open(modalName);
  }
  onUpdateCustomer() {
    this.btnLoader = true;
    this.customerApi.UPDATE_CUSTOMER(this.editForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // ADD ADDRESS
  onAddAddressModal(modalName) {
    this.btnLoader = false;
    this.addressFormType = 'add';
    this.addressForm = { type: 'home', country: this.commonService.store_details.country };
    if(!this.list.length) {
      this.addressForm.billing_address = true;
      this.addressForm.shipping_address = true;
    }
    this.onEditCountryChange(this.addressForm.country);
    this.modalService.open(modalName, {size: 'lg'});
  }

  // EDIT ADDRESS
  onEditAddress(x, modalName) {
    this.btnLoader = false;
    this.addressFormType = "update";
    this.onEditCountryChange(x.country);
    this.addressForm = {
      _id: x._id, type: x.type, other_place: x.other_place, name: x.name, dial_code: x.dial_code, mobile: x.mobile, address: x.address, landmark: x.landmark,
      city: x.city, state: x.state, country: x.country, pincode: x.pincode, billing_address: x.billing_address, exist_billing: x.billing_address,
      shipping_address: x.shipping_address, exist_shipping: x.shipping_address
    };
    this.address_fields.forEach(element => {
      element.value = this.addressForm[element.keyword];
    });
    this.modalService.open(modalName, {size: 'lg'});
  }

  onAddressEvent() {
    this.btnLoader = true;
    this.addressForm.customer_id = this.selected_customer._id;
    this.address_fields.forEach(element => {
      if(element.value) this.addressForm[element.keyword] = element.value;
    });
    if(this.addressFormType=='add') {
      this.customerApi.ADD_ADDRESS(this.addressForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          document.getElementById("closeModal").click();
          this.loadCustomerList();
        }
        else {
          this.addressForm.error_msg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.customerApi.UPDATE_ADDRESS(this.addressForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          document.getElementById("closeModal").click();
          this.loadCustomerList();
        }
        else {
          this.addressForm.error_msg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE ADDRESS
  onDeleteAddress() {
    this.btnLoader = true;
    this.deleteForm = this.selected_address;
    this.deleteForm.customer_id = this.selected_customer._id;
    this.customerApi.DELETE_ADDRESS(this.deleteForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.loadCustomerList();
      }
      else {
        this.deleteForm.error_msg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = []; this.address_fields = [];
    delete this.country_details; delete this.mobile_pattern;
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.country_details = this.commonService.country_list[index];
      this.state_list = this.country_details.states;
      this.customerForm.address_form.dial_code = this.country_details.dial_code;
      this.address_fields = this.country_details.address_fields;
      if(this.country_details.mobileno_length) this.mobile_pattern = ".{"+this.country_details.mobileno_length+","+this.country_details.mobileno_length+"}";
    }
  }
  onEditCountryChange(x) {
    this.state_list = []; this.address_fields = [];
    delete this.country_details; delete this.mobile_pattern;
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.country_details = this.commonService.country_list[index];
      this.state_list = this.country_details.states;
      this.addressForm.dial_code = this.country_details.dial_code;
      this.address_fields = this.country_details.address_fields;
      if(this.country_details.mobileno_length) this.mobile_pattern = ".{"+this.country_details.mobileno_length+","+this.country_details.mobileno_length+"}";
    }
  }

  goOrdersPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/orders/product/"+type+"/"+customer._id])
  }

  goQuotPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/quotations/"+type+"/"+customer._id])
  }

  // EXPORT
  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "customers";
    // let orderList = new FieldSearchPipe().transform(this.list, 'order_number', this.search_bar);
    this.createList(this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, fileName);
      setTimeout(() => { this.exportLoader = false; }, 500);
    });
  }
  createList(list) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let order of list) {
        let sendData = {};
        sendData['Name'] = order.name;
        sendData['Email'] = order.email;
        sendData['Mobile'] = order.mobile;
        sendData['Address'] = "NA"; sendData['City'] = "NA";
        sendData['State'] = "NA"; sendData['Country'] = "NA";
        sendData['Pincode'] = "NA"; sendData['Landmark'] = "NA";
        if(order.address_list.length) {
          let addressDetails = order.address_list[0];
          sendData['Address'] = addressDetails.address;
          sendData['City'] = addressDetails.city;
          sendData['State'] = addressDetails.state;
          sendData['Country'] = addressDetails.country;
          sendData['Pincode'] = addressDetails.pincode;
          if(addressDetails.landmark) sendData['Landmark'] = addressDetails.landmark;
        }
        updatedList.push(sendData);
      }
      resolve(updatedList);
    });
  }

}
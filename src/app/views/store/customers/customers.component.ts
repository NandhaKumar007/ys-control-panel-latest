import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  filterForm: any = { search: "" };
  page = 1; pageSize = 10; totalCount: number = 0;
  pageLoader: boolean; exportLoader: boolean;
  list: any = []; addressForm: any = {}; customerForm: any = {};
  country_details: any; address_fields: any = []; mobile_pattern: any; state_list: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private excelService: ExcelService,
    private customerApi: CustomerApiService, private api: ApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.page = 1; this.list = []; this.pageLoader = true;
    this.filterForm.skip = 0; this.filterForm.limit = 50;
    this.customerApi.CUSTOMER_LIST(this.filterForm).subscribe(result => {
      if(result.status) {
        this.totalCount = result.count;
        this.list = result.list;
        this.list.forEach(element => {
          this.processData(element);
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onChangePage(selectedPage) {
    this.page = selectedPage; this.commonService.pageTop(0);
    let totalPages = this.list.length/this.pageSize;
    if(totalPages===selectedPage && this.totalCount>this.list.length) {
      this.filterForm.skip = this.list.length;
      this.filterForm.limit = 20;
      this.customerApi.CUSTOMER_LIST(this.filterForm).subscribe(result => {
        if(result.status) {
          this.totalCount = result.count;
          result.list.forEach(element => {
            element = this.processData(element);
            this.list.push(element);
          });
        }
        else console.log("response", result);
      });
    }
  }

  processData(element) {
    if(!element.dial_code && !element.mobile && element.address_list.length) {
      let filteredAddress = element.address_list.filter(obj => obj.billing_address);
      if(filteredAddress.length) {
        element.dial_code = filteredAddress[0].dial_code;
        element.mobile = filteredAddress[0].mobile;
      }
    }
    return element;
  }

  // ADD CUSTOMER
  addCustomerModal(modalName) {
    this.customerForm = { step:1, address_form: { type: 'home', billing_address: true, shipping_address: true, country: this.commonService.store_details.country } };
    let index = this.commonService.country_list.findIndex(object => object.name==this.commonService.store_details.country);
    if(index!=-1) this.customerForm.dial_code = this.commonService.country_list[index].dial_code;
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
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.customerForm.error_msg = result.message;
      }
    });
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
        sendData['Mobile'] = "NA";
        if(order.dial_code && order.mobile) sendData['Mobile'] = order.dial_code+' '+order.mobile;
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

}
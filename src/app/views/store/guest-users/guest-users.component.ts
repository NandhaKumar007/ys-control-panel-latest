import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../services/customer-api.service';
import { ApiService } from '../../../services/api.service';
import { ExcelService } from '../../../services/excel.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-guest-users',
  templateUrl: './guest-users.component.html',
  styleUrls: ['./guest-users.component.scss'],
  animations: [SharedAnimations]
})

export class GuestUsersComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean; exportLoader: boolean;
  list: any = []; selected_customer: any; addressForm: any;
  country_details: any; address_fields: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private excelService: ExcelService,
    private customerApi: CustomerApiService, private api: ApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.customerApi.GUEST_USERS_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.list.forEach(element => {
          element.name = "NA";
          element.mobile = "NA";
          if(element.address_list.length) {
            element.name = element.address_list[0].name;
            element.mobile = element.address_list[0].dial_code+" "+element.address_list[0].mobile;
          }
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onViewCustomer(x, modalName) {
    this.selected_customer = x;
    if(x.address_list.length) {
      this.addressForm = {};
      let addrData = x.address_list[0];
      this.onEditCountryChange(addrData.country);
      for(let key in addrData) {
        if(addrData.hasOwnProperty(key)) this.addressForm[key] = addrData[key];
      }
      this.address_fields.forEach(element => {
        element.value = this.addressForm[element.keyword];
      });
    }
    this.modalService.open(modalName, {size: 'lg'});
  }

  onEditCountryChange(x) {
    this.address_fields = [];
    delete this.country_details;
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.country_details = this.commonService.country_list[index];
      this.addressForm.dial_code = this.country_details.dial_code;
      this.address_fields = this.country_details.address_fields;
    }
  }

  goOrdersPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/orders/product/"+type+"/"+customer.email])
  }

  goQuotPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/quotations/"+type+"/"+customer.email])
  }

  // EXPORT
  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "guest-users";
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
        sendData['Email'] = order.email;
        sendData['Name'] = "NA"; sendData['Mobile'] = "NA";
        sendData['Address'] = "NA"; sendData['City'] = "NA";
        sendData['State'] = "NA"; sendData['Country'] = "NA";
        sendData['Pincode'] = "NA"; sendData['Landmark'] = "NA";
        if(order.address_list.length) {
          let addressDetails = order.address_list[0];
          sendData['Name'] = addressDetails.name;
          sendData['Mobile'] = addressDetails.dial_code+" "+addressDetails.mobile;
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
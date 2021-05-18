import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GridSearchPipe } from '../../../../shared/pipes/grid-search.pipe';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-abandoned-customers',
  templateUrl: './abandoned-customers.component.html',
  styleUrls: ['./abandoned-customers.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedCustomersComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  pageLoader: boolean; exportLoader: boolean;

  constructor(
    private customerApi: CustomerApiService, public router: Router, public commonService: CommonService,
    private excelService: ExcelService, private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.pageLoader = true;
    this.customerApi.ABANDONED_CARTS().subscribe(result => {
      if(result.status) {
        this.list = result.list.sort((a, b) => 0 - (a.cart_updated_on > b.cart_updated_on ? 1 : -1));
        this.list.forEach(element => {
          element.city = "NA";
          if(element.address_list.length) {
            let filteredAddress = [element.address_list[0]];
            let billingIndex = element.address_list.findIndex(obj => obj.billing_address);
            if(billingIndex!=-1) filteredAddress = [element.address_list[billingIndex]];
            element.mobile = filteredAddress[0].mobile;
            if(element.mobile.charAt(0) === '0') element.mobile = element.mobile.substring(1);
            if(filteredAddress[0].dial_code) element.mobile = filteredAddress[0].dial_code+" "+element.mobile;
            element.city = filteredAddress[0].city;
          }
          else if(!element.mobile) element.mobile = "NA";
          element.cart_total = this.calcCartTotal(element.cart_list);
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  calcCartTotal(itemList) {
    return itemList.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue['final_price'] * currentValue['quantity']);
    }, 0);
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let productList = new GridSearchPipe().transform(this.list, { name: this.search_bar, email: this.search_bar, mobile: this.search_bar });
    this.createList(productList).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, 'customer-abandoned-cart'+' export '+new Date().getTime());
      setTimeout(() => { this.exportLoader = false; }, 500);
    })
  }
  async createList(productList) {
    let updatedList = [];
    for(let prod of productList) {
      let sendData = {};
      sendData['Name'] = prod.name;
      sendData['Email ID'] = prod.email;
      sendData['Phone Number'] = prod.mobile;
      sendData['Date'] = this.datePipe.transform(prod.cart_updated_on, 'dd MMM y hh:mm a');
      sendData['City'] = prod.city;
      updatedList.push(sendData);
    }
    return updatedList;
  }

}
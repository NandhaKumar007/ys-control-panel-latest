import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-abandoned',
  templateUrl: './abandoned.component.html',
  styleUrls: ['./abandoned.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  list: any = [];
  pageLoader: boolean;

  constructor(private customerApi: CustomerApiService, public router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.pageLoader = true;
    this.customerApi.ABANDONED_CARTS().subscribe(result => {
      if(result.status) {
        this.list = result.list.sort((a, b) => 0 - (a.cart_updated_on > b.cart_updated_on ? 1 : -1));
        this.list.forEach(element => {
          let filteredAddress = element.address_list.filter(obj => obj.billing_address);
          if(filteredAddress.length) {
            element.mobile = filteredAddress[0].mobile;
            if(element.mobile.charAt(0) === '0') element.mobile = element.mobile.substring(1);
            if(filteredAddress[0].dial_code) element.mobile = filteredAddress[0].dial_code+" "+element.mobile;
          }
          else if(!element.mobile) element.mobile = "NA";
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

}
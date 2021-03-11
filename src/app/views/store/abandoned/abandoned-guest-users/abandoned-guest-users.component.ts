import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-abandoned-guest-users',
  templateUrl: './abandoned-guest-users.component.html',
  styleUrls: ['./abandoned-guest-users.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedGuestUsersComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  list: any = [];
  pageLoader: boolean;

  constructor(private customerApi: CustomerApiService, public router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.pageLoader = true;
    this.customerApi.ABANDONED_GUEST_USERS().subscribe(result => {
      if(result.status) {
        this.list = result.list.sort((a, b) => 0 - (a.cart_updated_on > b.cart_updated_on ? 1 : -1));
        this.list.forEach(element => {
          element.name = "NA";
          element.mobile = "NA";
          if(element.address_list.length) {
            element.name = element.address_list[0].name;
            element.mobile = element.address_list[0].mobile;
            if(element.mobile.charAt(0) === '0') element.mobile = element.mobile.substring(1);
            if(element.address_list[0].dial_code) element.mobile = element.address_list[0].dial_code+" "+element.mobile;
          }
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

}
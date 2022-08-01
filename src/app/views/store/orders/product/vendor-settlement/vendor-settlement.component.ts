import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-vendor-settlement',
  templateUrl: './vendor-settlement.component.html',
  styleUrls: ['./vendor-settlement.component.scss'],
  animations: [SharedAnimations]
})

export class VendorSettlementComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; filterForm: any = {};
  list: any = []; scrollPos: number = 0;
  outstanding: number = 0;

  constructor(private api: OrderService, public commonService: CommonService) { }

  ngOnInit() {
    this.filterForm = {
      from_date: new Date(), to_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      vendor_id: 'all', list_type: 'all'
    };
    if(sessionStorage.getItem("order_page")) {
      let pageInfo = JSON.parse(sessionStorage.getItem("order_page"));
      sessionStorage.removeItem("order_page");
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
      this.filterForm.vendor_id = pageInfo.filter_form.vendor_id;
      if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
      if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
      this.filterForm.list_type = pageInfo.filter_form.list_type;
    }
    this.getOrderList();
  }

  getOrderList() {
    this.list = []; this.outstanding = 0;
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      this.pageLoader = true;
      this.api.SETTLEMENT_ORDERS(this.filterForm).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          this.list.forEach(obj => {
            let vendorIndex = this.commonService.vendor_list.findIndex(el => el._id==obj.vendor_id);
            if(vendorIndex!=-1) obj.vendor_name = this.commonService.vendor_list[vendorIndex].company_details.brand;
            if(obj.status!='paid') this.outstanding = obj.settlement_amt;
          });
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
      });
    }
  }

  capturePageData() {
    let pageData = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    sessionStorage.setItem("order_page", JSON.stringify(pageData));
  }

}
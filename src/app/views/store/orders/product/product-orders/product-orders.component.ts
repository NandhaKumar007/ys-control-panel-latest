import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../../order.service';
import { ExcelService } from '../../../../../services/excel.service';
import { CommonService } from '../../../../../services/common.service';
import { FieldSearchPipe } from '../../../../../shared/pipes/field-search.pipe';

@Component({
  selector: 'app-product-orders',
  templateUrl: './product-orders.component.html',
  styleUrls: ['./product-orders.component.scss'],
  animations: [SharedAnimations]
})

export class ProductOrdersComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; exportLoader: boolean;
  params: any = {}; filterForm: any = {};
  list: any = []; scrollPos: number = 0;
  vendorList: any = this.commonService.vendor_list;

  constructor(private api: OrderService, private activeRoute: ActivatedRoute, private excelService: ExcelService, private datePipe: DatePipe, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      if(this.vendorList.length) this.vendorList.unshift({_id: 'all', name: "All Vendors"});
      this.params = params; this.page = 1; this.pageSize = 10;
      this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date(), type: this.params.type, vendor_id: 'all' };
      if(this.params.type=='live') this.filterForm.type = 'all';
      if(this.commonService.store_details.login_type=='vendor') {
        // this.filterForm.type = 'placed';
        this.filterForm.vendor_id = this.commonService.store_details.login_id;
      }
      this.filterForm.customer_id = this.params.customer_id;
      if(sessionStorage.getItem("order_page")) {
        let pageInfo = JSON.parse(sessionStorage.getItem("order_page"));
        sessionStorage.removeItem("order_page");
        this.scrollPos = pageInfo.scroll_pos;
        this.page = pageInfo.page_no;
        this.search_bar = pageInfo.search;
        this.filterForm.type = pageInfo.filter_form.type;
        this.filterForm.vendor_id = pageInfo.filter_form.vendor_id;
        if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
        if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
      }
      this.getOrderList();
    });
  }

  getOrderList() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      this.filterForm.date_type = 'created_on';
      this.api.ORDER_LIST(this.filterForm).subscribe(result => {
        if(result.status) {
          let orderList: any = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
          this.list = [];
          orderList.forEach(obj => {
            if(obj.shipping_address) obj.shipping_customer_name = obj.shipping_address.name;
            if(obj.billing_address) obj.billing_customer_name = obj.billing_address.name;
            if(obj.customerDetails.length) {
              obj.customer_name = obj.customerDetails[0].name;
              obj.customer_email = obj.customerDetails[0].email;
              obj.customer_mobile = 'NA';
              if(obj.customerDetails[0].mobile) { obj.customer_mobile = obj.customerDetails[0].mobile; }
            }
            else {
              obj.customer_name = obj.shipping_address.name;
              obj.customer_email = obj.guest_email;
              obj.customer_mobile = 'NA';
            }
            // delivery time
            if(this.commonService.ys_features.indexOf('time_based_delivery')!=-1 && obj.shipping_method.delivery_date && obj.shipping_method.delivery_time) {
              let delDate = obj.shipping_method.delivery_date.split(" (")[0];
              let delTime = obj.shipping_method.delivery_time.split(" - ")[0];
              obj.delivery_time = new Date(delDate+" "+delTime);
            }
            // vendor
            if(this.commonService.store_details.login_type=='vendor' && obj.vendor_list) {
              let venIndex = obj.vendor_list.findIndex(obj => obj.vendor_id==this.commonService.store_details.login_id);
              if(venIndex!=-1) {
                obj.vendor_order_status = obj.vendor_list[venIndex].status;
                obj.vendor_order_amount = obj.vendor_list[venIndex].total;
              }
            }
            if(this.filterForm.vendor_id!='all') {
              if(obj.item_list.findIndex(obj => obj.vendor_id==this.filterForm.vendor_id) != -1) this.list.push(obj);
            }
            else this.list.push(obj);
          });
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
      });
    }
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "";
    if(this.params.type=='live') fileName += "Live Orders from ";
    else if(this.params.type=='delivered') fileName += "Completed Orders from ";
    else if(this.params.type=='cancelled') fileName += "Cancelled Orders from ";
    fileName += this.datePipe.transform(this.filterForm.from_date, 'dd MMM y')+" to "+this.datePipe.transform(this.filterForm.to_date, 'dd MMM y');
    let orderList = new FieldSearchPipe().transform(this.list, 'order_number', this.search_bar);
    this.createList(orderList).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, fileName);
      setTimeout(() => { this.exportLoader = false; }, 500);
    });
  }

  async createList(list) {
    let updatedList = [];
    for(let order of list) {
      let giftCardAmount = order.coupon_list.reduce((accumulator, currentValue) => { return accumulator + currentValue['price']; }, 0);
      let sendData = {};
      sendData['Date'] = this.datePipe.transform(order.created_on, 'dd MMM y hh:mm a');
      sendData['Order No.'] = order.order_number;
      sendData['Customer Name'] = order.customer_name;
      sendData['Customer Email'] = order.customer_email;
      sendData['Customer Mobile'] = order.customer_mobile;
      sendData['Address'] = order.shipping_address.address;
      sendData['State'] = order.shipping_address.state;
      sendData['Pincode'] = order.shipping_address.pincode;
      if(this.commonService.ys_features.indexOf('time_based_delivery')!=-1) {
        sendData['Delivery Time'] = 'NA';
        if(order.delivery_time) sendData['Delivery Time'] = this.datePipe.transform(order.delivery_time, 'dd MMM y hh:mm a');
      }
      sendData['Shipping'] = order.shipping_cost;
      sendData['COD Charges'] = order.cod_charges;
      sendData['Gift Card'] = giftCardAmount;
      sendData['Discount'] = order.discount_amount - giftCardAmount;
      sendData['Total'] = order.final_price;
      sendData['Payment'] = 'NA';
      if(order.payment_details) sendData['Payment'] = order.payment_details.name;
      let itemsData = await this.processItemList(order.item_list);
      let newSendData = Object.assign(sendData, itemsData);
      updatedList.push(newSendData);
    }
    return updatedList;
  }

  processItemList(list) {
    return new Promise((resolve, reject) => {
      let sendData = {};
      for(let i=0; i<list.length; i++) {
        sendData['SKU'+(i+1)] = list[i].sku;
        sendData['HSN Code'+(i+1)] = 'NA';
        if(list[i].hsn_code) { sendData['HSN Code'+(i+1)] = list[i].hsn_code; }
        sendData['Item'+(i+1)] = list[i].name;
        sendData['Qty'+(i+1)] = list[i].quantity;
        if(list[i].unit) { sendData['Qty'+(i+1)] = list[i].quantity+" "+list[i].unit; }
        sendData['Price'+(i+1)] = list[i].final_price*list[i].quantity;
      }
      resolve(sendData);
    });
  }

  capturePageData() {
    let pageData = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: sessionStorage.getItem("scroll_y_pos") };
    sessionStorage.setItem("order_page", JSON.stringify(pageData));
  }

}
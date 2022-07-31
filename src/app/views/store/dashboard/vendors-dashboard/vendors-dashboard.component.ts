import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { echartStyles } from '../../../../shared/animations/echart-styles';
import { ApiService } from '../../../../services/api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-vendors-dashboard',
  templateUrl: './vendors-dashboard.component.html',
  styleUrls: ['./vendors-dashboard.component.scss']
})

export class VendorsDashboardComponent implements OnInit {

  preLoader: boolean; order_details: any = {
    products: 0, order_list: [], total_sales: 0, items_sold: 0, net_sales: 0,
    placed_orders: 0, confirmed_orders: 0, dispatched_orders: 0, completed_orders: 0, cancelled_orders: 0,
    banked_amount: 0, next_settlement: {}
  };
	chartPie: any; chartLine: any; filterForm: any;

  constructor(public datepipe: DatePipe, public commonService: CommonService, private api: ApiService, private storeApi: StoreApiService) {
    if(!localStorage.getItem("country_list")) {
      this.api.COUNTRIES_LIST().subscribe(result => {
        this.commonService.country_list = [];
        if(result.status) this.commonService.country_list = result.list;
        this.commonService.updateLocalData('country_list', this.commonService.country_list);
      });
    }
  }

  ngOnInit() {
    this.filterForm = { type: 'today', from_date: new Date(), to_date: new Date() };
    this.getDashboardData();
	}

  getDashboardData() {
    if(this.filterForm.from_date && this.filterForm.to_date && new Date(this.filterForm.to_date) >= new Date(this.filterForm.from_date)) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      this.preLoader = true;
      this.order_details = {
        products: 0, order_list: [], total_sales: 0, items_sold: 0, net_sales: 0,
        placed_orders: 0, confirmed_orders: 0, dispatched_orders: 0, completed_orders: 0, cancelled_orders: 0,
        banked_amount: 0, next_settlement: {}
      };
      // DASHBOARD
      this.storeApi.VENDOR_DASHBOARD({ from_date: this.filterForm.from_date, to_date: this.filterForm.to_date, vendor_id: this.commonService.vendor_details?._id }).subscribe(result => {
        setTimeout(() => { this.preLoader = false; }, 500);
        if(result.status) {
          // products
          this.order_details.products = result.data.product_count;
          // orders
          this.order_details.order_list = result.data.order_list;
          this.order_details.order_list.forEach(element => {
            let vendorOrderDetails = element.vendor_list[0];
            this.order_details.items_sold += element.total_items;
            this.order_details.total_sales += vendorOrderDetails.final_price;
            if(vendorOrderDetails.order_status!='cancelled') this.order_details.net_sales += vendorOrderDetails.final_price;
            // orders count
            if(vendorOrderDetails.order_status=='placed') this.order_details.placed_orders++;
            if(vendorOrderDetails.order_status=='confirmed') this.order_details.confirmed_orders++;
            if(vendorOrderDetails.order_status=='dispatched') this.order_details.dispatched_orders++;
            if(vendorOrderDetails.order_status=='delivered') this.order_details.completed_orders++;
            if(vendorOrderDetails.order_status=='cancelled') this.order_details.cancelled_orders++;
          });
          // settlement orders
          let sOrders = result.data.settlement_orders.sort((a, b) => 0 - (a.settlement_on > b.settlement_on ? -1 : 1));
          sOrders.forEach(element => {
            this.order_details.banked_amount += element.settlement_amt;
          });
          if(sOrders.length) this.order_details.next_settlement = sOrders[0];
          // line chart
          this.buildLineChart(this.order_details.order_list).then((respData) => {
            this.chartLine = {
              ...echartStyles.lineNoAxis, ...{
                series: [{
                  data: respData.orders,
                  lineStyle: {
                    color: 'rgba(216, 57, 103, .86)',
                    width: 3,
                    shadowColor: 'rgba(0, 0, 0, .2)',
                    shadowOffsetX: -1,
                    shadowOffsetY: 8,
                    shadowBlur: 10
                  },
                  label: { show: true, color: '#212121' },
                  type: 'line',
                  smooth: true,
                  itemStyle: {
                    borderColor: 'rgba(216, 57, 103, 0.86)'
                  }
                }]
              }
            };
            this.chartLine.xAxis.data = respData.days;
          })
        }
        else console.log("dashboard response", result);
      });
    }
  }

  onFilterChange(x) {
    if(x=='today') { this.filterForm.from_date = new Date; this.filterForm.to_date = new Date; }
    else if(x=='yesterday') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 1)); this.filterForm.to_date = new Date(new Date().setDate(new Date().getDate() - 1)); }
    else if(x=='last_7_days') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 7)); this.filterForm.to_date = new Date; }
    else if(x=='last_30_days') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 30)); this.filterForm.to_date = new Date; }
    else if(x=='current_month') { this.filterForm.from_date = new Date(new Date().getFullYear(), new Date().getMonth(), 1); this.filterForm.to_date = new Date; }
    else if(x=='last_month') {
      let prevMonth = new Date().setMonth(new Date().getMonth() - 1);
      this.filterForm.from_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth(), 1);
      this.filterForm.to_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth() + 1, 0);
    }
    else if(x=='current_year') { this.filterForm.from_date = new Date(new Date().getFullYear(), 0, 1); this.filterForm.to_date = new Date; }
    else if(x=='last_year') {
      let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
      this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 0, 1);
      this.filterForm.to_date = new Date(new Date(prevYear).getFullYear(), 11, 31);
    }
    else if(x=='current_fin_year') {
      let currYear_FinYearEndDate = new Date(new Date().getFullYear(), 2, 31).setHours(23,59,59,999);
      if(new Date(currYear_FinYearEndDate) > new Date) {
        // fin year going to complete (on jan to march)
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date().getFullYear(), 2, 31);
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = new Date;
      }
      else {
        // new fin year started (on apr to dec)
        let nextYear = new Date().setFullYear(new Date().getFullYear() + 1);
        this.filterForm.from_date = new Date(new Date().getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date(nextYear).getFullYear(), 2, 31);
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = new Date;
      }
    }
    else if(x=='last_fin_year') {
      let currYear_FinYearEndDate = new Date(new Date().getFullYear(), 2, 31).setHours(23,59,59,999);
      if(new Date(currYear_FinYearEndDate) > new Date) {
        // fin year going to complete (on jan to march)
        let pastPrevYear = new Date().setFullYear(new Date().getFullYear() - 2);
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(pastPrevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date(prevYear).getFullYear(), 2, 31);
      }
      else {
        // new fin year started (on apr to dec)
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date().getFullYear(), 2, 31);
      }
    }
    else if(x=='all_time') { this.filterForm.from_date = new Date(this.commonService.vendor_details.created_on); this.filterForm.to_date = new Date; }
		this.getDashboardData();
  }
  
  async buildLineChart(orderList) {
    let diff = Math.abs(new Date(this.filterForm.from_date).getTime() - this.filterForm.to_date.getTime());
    let diffDays = Math.ceil(diff / (1000*3600*24));
    let dayList = []; let ordersCountList = [];
    if(diffDays > 0) {
      for(let i=1; i<=diffDays; i++)
      {
        let currDate = new Date(this.filterForm.to_date).setDate(new Date(this.filterForm.to_date).getDate() - (diffDays-i));
        let orderCount = await this.processOrderList(orderList, new Date(currDate).setHours(0,0,0,0), new Date(currDate).setHours(23,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(currDate), 'dd MMM y'));
          ordersCountList.push(orderCount);
        }
      }
    }
    else {
      for(let i=0; i<=23; i++)
      {
        let currDate = "";
        let orderCount = await this.processOrderList(orderList, new Date(this.filterForm.from_date).setHours(i,0,0,0), new Date(this.filterForm.from_date).setHours(i,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(new Date(this.filterForm.from_date).setHours(i,0,0,0)), 'hh:mm a'));
          ordersCountList.push(orderCount);
        }
      }
    }
    return ({days: dayList, orders: ordersCountList});
  }

  processOrderList(orderList, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      let count = orderList.filter(obj => new Date(obj.created_on) >= new Date(fromDate) && new Date(toDate) > new Date(obj.created_on)).length;
      resolve(count);
    });
  }
  
  async buildCustomerList(customerList) {
    let updatedCustomers = [];
    for(let i=0; i<customerList.length; i++)
    {
      let orderDetails: any = await this.processCustomerOrders(customerList[i].order_list);
      if(orderDetails.total_price > 0) {
        orderDetails._id = customerList[i].customerDetails[0]._id;
        orderDetails.name = customerList[i].customerDetails[0].name;
        orderDetails.email = customerList[i].customerDetails[0].email;
        updatedCustomers.push(orderDetails);
      }
    }
    return updatedCustomers;
  }

  processCustomerOrders(orderList) {
    return new Promise((resolve, reject) => {
      let orderDetails = { total_qty: 0, total_price: 0 };
      for(let i=0; i<orderList.length; i++)
      {
        orderDetails.total_price += orderList[i].final_price;
        orderDetails.total_qty += orderList[i].item_list.reduce((accumulator, currentValue) => {
          return accumulator + currentValue['quantity'];
        }, 0);
      }
      resolve(orderDetails);
    });
  }

}
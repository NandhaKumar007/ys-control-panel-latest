import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { echartStyles } from '../../../shared/animations/echart-styles';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-dashboard',
  templateUrl: './ys-dashboard.component.html',
  styleUrls: ['./ys-dashboard.component.scss']
})
export class YsDashboardComponent implements OnInit {

  page = 1; pageSize = 6;
  preLoader: boolean; filterForm: any;
  card_details: any = {};
  chartLine: any;

  constructor(private datepipe: DatePipe, private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.filterForm = { type: 'today', from_date: new Date(), to_date: new Date() };
    this.card_details = {
      new_signups: 0, activated_stores: 0, plan_selected: 0
    };
    this.getDashboardData();
  }

  getDashboardData() {
    // if(this.filterForm.from_date && this.filterForm.to_date && new Date(this.filterForm.to_date) >= new Date(this.filterForm.from_date)) {
    //   this.preLoader = true;
    //   // DASHBOARD
    //   this.adminApi.DASHBOARD({ from_date: this.filterForm.from_date, to_date: this.filterForm.to_date }).subscribe(result => {
    //     setTimeout(() => { this.preLoader = false; }, 500);
    //     if(result.status) {
    //       console.log("---", result);
    //       let storeList = result.store_list.forEach(obj => {
            
    //       });
    //       this.card_details.new_signups = result.store_list.length;
    //       this.card_details.activated_stores = result.store_list.filter(obj => !obj.temp_category && obj.package_details.trial_expiry).length;
    //       this.card_details.plan_selected = result.store_list.filter(obj => obj.package_details.expiry_date).length;
    //       // line chart
    //       this.buildLineChart(result.store_list).then((respData) => {
    //         this.chartLine = {
    //           ...echartStyles.lineNoAxis, ...{
    //             series: [{
    //               data: respData.orders,
    //               lineStyle: {
    //                 color: 'rgba(216, 57, 103, .86)',
    //                 width: 3,
    //                 shadowColor: 'rgba(0, 0, 0, .2)',
    //                 shadowOffsetX: -1,
    //                 shadowOffsetY: 8,
    //                 shadowBlur: 10
    //               },
    //               label: { show: true, color: '#212121' },
    //               type: 'line',
    //               smooth: true,
    //               itemStyle: {
    //                 borderColor: 'rgba(216, 57, 103, 0.86)'
    //               }
    //             }]
    //           }
    //         };
    //         this.chartLine.xAxis.data = respData.days;
    //       });
    //     }
    //     else console.log("dashboard response", result);
    //   });
    // }
  }

  async buildLineChart(storeList) {
    let diff = Math.abs(new Date(this.filterForm.from_date).getTime() - this.filterForm.to_date.getTime());
    let diffDays = Math.ceil(diff / (1000*3600*24));
    let dayList = []; let ordersCountList = [];
    if(diffDays > 0) {
      for(let i=1; i<=diffDays; i++)
      {
        let currDate = new Date(this.filterForm.to_date).setDate(new Date(this.filterForm.to_date).getDate() - (diffDays-i));
        let orderCount = await this.processStoreList(storeList, new Date(currDate).setHours(0,0,0,0), new Date(currDate).setHours(23,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(currDate), 'dd MMM y'));
          ordersCountList.push(orderCount);
        }
      }
    }
    else {
      for(let i=0; i<=23; i++)
      {
        let orderCount = await this.processStoreList(storeList, new Date(this.filterForm.from_date).setHours(i,0,0,0), new Date(this.filterForm.from_date).setHours(i,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(new Date(this.filterForm.from_date).setHours(i,0,0,0)), 'hh:mm a'));
          ordersCountList.push(orderCount);
        }
      }
    }
    return ({days: dayList, orders: ordersCountList});
  }

  processStoreList(storeList, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      let count = storeList.filter(obj => new Date(obj.created_on) >= new Date(fromDate) && new Date(toDate) > new Date(obj.created_on)).length;
      resolve(count);
    });
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
    else if(x=='all_time') { this.filterForm.from_date = new Date(); this.filterForm.to_date = new Date; }
		this.getDashboardData();
  }

}
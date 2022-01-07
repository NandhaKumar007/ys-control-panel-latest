import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { echartStyles } from '../../../shared/animations/echart-styles';
import { ApiService } from '../../../services/api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
	selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  preLoader: boolean; customerLoader: boolean;
  order_details: any; customer_details: any;
	chartPie: any; chartLine: any; filterForm: any;
  completedPercentage: any;
  dispDeployInfo: boolean; dispDashboard: boolean;
  deployList: any = [
    {
      keyword: "account",
      heading: "Create your account", sub_heading: "",
      description: "",
      duration: "", completed: true, redirect: ""
    },
    {
      keyword: "logo", heading: "Add your logo",
      sub_heading: "",
      description: "",
      duration: "1", completed: false, redirect: "/store-setting/logo-management"
    },
    {
      keyword: "products", heading: "List your products",
      sub_heading: "Products → All Products",
      description: "Choose a template and add layouts to your website",
      duration: "1", completed: false, redirect: "/products"
    },
    {
      keyword: "shipping", heading: "Setup shipping methods",
      sub_heading: "Settings → Shipping Methods",
      description: "Select shipping options available to customers at checkout",
      duration: "1", completed: false, redirect: "/shipping/shipping-methods"
    },
    {
      keyword: "payments", heading: "Configure payment collection",
      sub_heading: "Settings → Payment Gateway",
      description: "Choose how people pay at checkout, including credit and debit cards, UPI, cash and more",
      duration: "1", completed: false, redirect: "/setup/payment-gateway"
    },
    {
      keyword: "package", heading: "Choose plan",
      sub_heading: "",
      description: "Choose the right plan for your business",
      duration: "1", completed: false, redirect: "/deployment/plans"
    }
  ];
  moreDeployList: any = [
    {
      keyword: "home_layouts", heading: "Design your website",
      sub_heading: "Website → Website Design",
      description: "Choose a template and add layouts to your website",
      duration: "5", completed: false, redirect: "/layouts/home"
    },
    {
      keyword: "domain", heading: "Setup your domain",
      sub_heading: "",
      description: "Choose your domain or add your domain for your website",
      duration: "5", completed: false, redirect: "/deployment/domain"
    },
    {
      keyword: "tax_rates", heading: "Add your taxation",
      sub_heading: "Settings → Tax Rates",
      description: "Create percentage tax rates based on state laws",
      duration: "1", completed: false, redirect: "/product-extras/tax-rates"
    },
    {
      keyword: "social_media", heading: "Social Media",
      sub_heading: "Website → Footer Configuration",
      description: "",
      duration: "1", completed: false, redirect: "/setup/footer-content"
    },
    {
      keyword: "store_seo", heading: "Store SEO",
      sub_heading: "Website → SEO → Store",
      description: "Change the appearance of your website in a search engine listing",
      duration: "1", completed: false, redirect: "/seo/store"
    },
    {
      keyword: "discount", heading: "Discounts",
      sub_heading: "Marketing Tools → Offers",
      description: "",
      duration: "1", completed: false, redirect: "/features/coupon-codes"
    },
    {
      keyword: "policy_builder", heading: "Policies",
      sub_heading: "",
      description: "",
      duration: "1", completed: false, redirect: "/setup/policies/privacy"
    }
  ];

  constructor(private api: ApiService, private storeApi: StoreApiService, private datepipe: DatePipe, public commonService: CommonService) {
    if(!localStorage.getItem("country_list")) {
      let countryList: any = [];
      this.api.COUNTRIES_LIST().subscribe(result => {
        if(result.status) countryList = result.list;
        this.commonService.country_list = countryList;
        this.commonService.updateLocalData('country_list', countryList);
      });
    }
  }

  ngOnInit() {
    this.commonService.loadChat();
    this.commonService.pageTop(0);
    if(this.commonService.store_details.login_type=='admin' || this.commonService.subuser_features.indexOf('dashboard')!=-1) {
      // deploy stages
      for(let key in this.commonService.deploy_stages) {
        if(this.commonService.deploy_stages.hasOwnProperty(key)) {
          if(!this.commonService.deploy_stages[key]) {
            this.dispDeployInfo = true;
            this.updateDeployInfo();
            break;
          }
        }
      }
      // dashboard
      this.filterForm = { type: 'today', from_date: new Date(), to_date: new Date() };
      this.dispDashboard = true;
      this.getDashboardData();
    }
	}

  updateDeployInfo() {
    let completedCount = 0;
    this.deployList.forEach(element => {
      if(this.commonService.deploy_stages[element.keyword] || element.completed) {
        element.completed = true;
        completedCount++;
      }
    });
    this.completedPercentage = ((completedCount*100)/this.deployList.length).toFixed(1);
  }

  getDashboardData() {
    if(this.filterForm.from_date && this.filterForm.to_date && new Date(this.filterForm.to_date) >= new Date(this.filterForm.from_date)) {
      this.preLoader = true;
      this.order_details = {
        products: 0, order_list: [], total_sales: 0, placed_orders: 0, confirmed_orders: 0,
        dispatched_orders: 0, completed_orders: 0, cancelled_orders: 0, pending_orders: 0
      };
      // DASHBOARD
      this.storeApi.DASHBOARD({ from_date: this.filterForm.from_date, to_date: this.filterForm.to_date }).subscribe(result => {
        setTimeout(() => { this.preLoader = false; }, 500);
        if(result.status) {
          this.order_details.products = result.data.products;
          this.order_details.order_list = result.data.order_list.filter(obj => obj.order_status!='cancelled');
          this.order_details.cancelled_orders = result.data.order_list.length - this.order_details.order_list.length;
          this.order_details.order_list.forEach(element => {
            this.order_details.total_sales += element.final_price;
            if(element.order_status=='placed') this.order_details.placed_orders++;
            if(element.order_status=='confirmed') this.order_details.confirmed_orders++;
            if(element.order_status=='dispatched') this.order_details.dispatched_orders++;
            if(element.order_status=='delivered') this.order_details.completed_orders++;
          });
          this.chartPie = {
            ...echartStyles.defaultOptions, ...{
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                show: true,
                textStyle: { color:'#d83967' },
              },
              series: [{
                type: 'pie',
                ...echartStyles.pieRing,
                avoidLabelOverlap: false,
                width:'50%',
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                  }
                },
                labelLine: {
                  normal: { show: false }
                },
                data: [
                  { name: 'Awaiting', value: this.order_details.placed_orders, itemStyle: { color: '#FFC107' } },
                  { name: 'Confirmed', value: this.order_details.confirmed_orders, itemStyle: { color: '#42bcf5' } },
                  { name: 'Transit', value: this.order_details.dispatched_orders, itemStyle: { color: '#4CAF50' } },
                  { name: 'Pending', value: this.order_details.pending_orders, itemStyle: { color: '#f56725' } },
                  { name: 'Completed', value: this.order_details.completed_orders, itemStyle: { color: '#d83967' } },
                  { name: 'Cancelled', value: this.order_details.cancelled_orders, itemStyle: { color: '#a9a9a9' } }
                ]
              }]
            }
          };
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
      // CUSTOMERS
      this.customerLoader = true;
      this.customer_details = { total_customers: 0, abandoned_count: 0, top_customers: [] };
      this.storeApi.DASHBOARD_CUSTOMERS({ from_date: this.filterForm.from_date, to_date: this.filterForm.to_date, limit: 4 }).subscribe(result => {
        setTimeout(() => { this.customerLoader = false; }, 500);
        if(result.status) {
          this.customer_details.total_customers = result.data.total_customers;
          this.customer_details.abandoned_count = result.data.abandoned_count;
          this.buildCustomerList(result.data.top_customers).then((respData) => {
            this.customer_details.top_customers = respData;
          });
        }
        else console.log("customer response", result);
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
    else if(x=='all_time') { this.filterForm.from_date = new Date(this.commonService.store_details.created_on); this.filterForm.to_date = new Date; }
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

  socialShare() {
    let windowNav: any = window.navigator;
    if(windowNav && windowNav.share) {
      windowNav.share({
        title: '', text: '',
        url: 'https://shop.yourstore.io/'+this.commonService.store_details?.sub_domain
      })
      .catch( (error) => { console.log(error); });
    }
    else console.log("share not supported")
  }

  ngOnDestroy() {
    this.commonService.hideChat();
  }

}
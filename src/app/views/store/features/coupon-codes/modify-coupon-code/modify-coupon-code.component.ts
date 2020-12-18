import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { FeaturesApiService } from '../../features-api.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-modify-coupon-code',
  templateUrl: './modify-coupon-code.component.html',
  styleUrls: ['./modify-coupon-code.component.scss'],
  providers: [AmazingTimePickerService]
})

export class ModifyCouponCodeComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; productListLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl; offerForm: any;
  productList: any = []; tempCategoryList: any = []; tempProductList: any = [];
  category_id: any; formType: string;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private atp: AmazingTimePickerService, private api: FeaturesApiService,
    private router: Router, private activeRoute: ActivatedRoute, private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.activeRoute.params.subscribe((params: Params) => {
      if(params.offer_id) {
        this.formType = "edit";
        this.api.OFFER_DETAILS(params.offer_id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.offerForm = result.data;
            this.tempCategoryList = this.offerForm.category_list;
            this.tempProductList = this.offerForm.product_list;
            this.offerForm.start_date = new Date(this.offerForm.valid_from);
            this.offerForm.start_time = new Date(this.offerForm.valid_from).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if(this.offerForm.valid_to) {
              this.offerForm.enable_end_date = true;
              this.offerForm.end_date = new Date(this.offerForm.valid_to);
              this.offerForm.end_time = new Date(this.offerForm.valid_to).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
          }
          else console.log("response", result);
        });
      }
      else {
        this.formType = "add";
        this.offerForm = {
          discount_type: 'percentage', apply_to: 'order', min_order_amt: 0, min_order_qty: 0,
          category_list: [], product_list: [], enable_status: true
        };
        setTimeout(() => { this.pageLoader = false; }, 500);
      }
    });
  }

  onSubmit() {
    this.offerForm.valid_from = new Date(new Date(this.offerForm.start_date).toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' })+" "+this.offerForm.start_time);
    this.offerForm.valid_to = null;
    if(this.offerForm.enable_end_date) {
      this.offerForm.valid_to = new Date(new Date(this.offerForm.end_date).toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' })+" "+this.offerForm.end_time);
    }
    if(this.formType=='add') {
      this.api.ADD_OFFER(this.offerForm).subscribe(result => {
        if(result.status) this.router.navigate(['/features/coupon-codes']);
        else {
          console.log("response", result);
          this.offerForm.errorMsg = result.message;
        }
      });
    }
    else {
      delete this.offerForm.redeemed_count;
      this.api.UPDATE_OFFER(this.offerForm).subscribe(result => {
        if(result.status) this.router.navigate(['/features/coupon-codes']);
        else {
          console.log("response", result);
          this.offerForm.errorMsg = result.message;
        }
      });
    }
  }

  // product
  getProductList(categoryId) {
    this.productListLoader = true
    this.storeApi.PRODUCT_LIST({ category_id: categoryId }).subscribe(result => {
      setTimeout(() => { this.productListLoader = false; }, 500);
      if(result.status) this.productList = result.list;
      else console.log("response", result);
    });
  }
  checkProduct(x) {
    if(this.tempProductList.findIndex(obj => obj.product_id==x._id) != -1) return true;
  }
  addProduct(x) {
    let index = this.tempProductList.findIndex(obj => obj.product_id==x._id);
    if(index != -1) this.tempProductList.splice(index, 1);
    else this.tempProductList.push({ product_id: x._id, name: x.name, image: x.image_list[0].image });
  }
  onSubmitProduct() {
    this.offerForm.product_list = [];
    this.tempProductList.forEach(element => { this.offerForm.product_list.push(element); });
    document.getElementById('closeModal').click();
  }

  // category
  checkCategory(x) {
    if(this.tempCategoryList.findIndex(obj => obj.category_id==x._id) != -1) return true;
  }
  addCategory(x) {
    let index = this.tempCategoryList.findIndex(obj => obj.category_id==x._id);
    if(index != -1) this.tempCategoryList.splice(index, 1);
    else this.tempCategoryList.push({ category_id: x._id, name: x.name });
  }
  onSubmitCategory() {
    this.offerForm.category_list = [];
    this.tempCategoryList.forEach(element => { this.offerForm.category_list.push(element); });
    document.getElementById('closeModal').click();
  }
  
  // common
  getRandomCode() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0; i < 6; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  timePicker(x) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.offerForm[x] = this.timeConversion(time);
    });
  }
  timeConversion(timeString) {
    var H = timeString.substr(0, 2);
    var convertedTime = (H % 12) || 12;
    var h = convertedTime < 10 ? "0"+ convertedTime : convertedTime;
    var ampm = H < 12 ? " AM" : " PM";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }

}
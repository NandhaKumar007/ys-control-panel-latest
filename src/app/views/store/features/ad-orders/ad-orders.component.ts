import { Component, OnInit } from '@angular/core';
import { StoreApiService } from 'src/app/services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ad-orders',
  templateUrl: './ad-orders.component.html',
  styleUrls: ['./ad-orders.component.scss'],
  animations: [SharedAnimations]
})
export class AdOrdersComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10;
  list:any=[]; filterForm:any ={};
  adOrderDetails:any={}; deleteForm:any={};
  imgBaseUrl = environment.img_baseurl;

  constructor(public api: StoreApiService, public commonService: CommonService, public modalService: NgbModal,) { }

  ngOnInit(): void {
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() , type: 'all'};
    if(this.commonService.store_details.login_type=='vendor') {
      this.filterForm.vendor_id = this.commonService.vendor_details?._id;
    }
    this.getAdOrderList();
  }

  getAdOrderList(){
    this.list = [];
   if(this.filterForm.from_date && this.filterForm.to_date){
    this.pageLoader = true;
    this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
    this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
    this.api.LIST_AD_ORDERS(this.filterForm).subscribe((result)=>{
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status){
        this.list = result.list;
        this.pageLoader = false;
      }else{
        console.log("response", result)
        this.pageLoader = false;
      }
    })
   }
  }

  onView(x, modalName){
    this.adOrderDetails = x;
    this.modalService.open(modalName);
  }

  onDelete(){
    this.api.DELETE_AD_ORDERS(this.deleteForm).subscribe((result)=>{
      if(result.status){
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }else{
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }
}

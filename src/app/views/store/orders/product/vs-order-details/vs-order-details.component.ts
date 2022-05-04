import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-vs-order-details',
  templateUrl: './vs-order-details.component.html',
  styleUrls: ['./vs-order-details.component.scss']
})

export class VsOrderDetailsComponent implements OnInit {

  params: any = {}; order_details: any = {};
  pageLoader: boolean; itemList: any = [];
  vendorInfo: any = {}; vendorDetails: any = {};
  imgBaseUrl = environment.img_baseurl;

  constructor(
    private activeRoute: ActivatedRoute, private api: OrderService, public commonService: CommonService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.pageLoader = true;
      // order details
      this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          this.itemList = this.order_details.item_list.filter(obj => obj.vendor_id==this.params.vendor_id);
          let vendorIndex = this.order_details.vendor_list.findIndex(obj => obj.vendor_id==this.params.vendor_id);
          if(vendorIndex!=-1) this.vendorInfo = this.order_details.vendor_list[vendorIndex];
          // vendor details
          let vIndex = this.commonService.vendor_list.findIndex(el => el._id==this.params.vendor_id);
          if(vIndex!=-1) this.vendorDetails = this.commonService.vendor_list[vIndex];
          // console.log(this.vendorDetails)
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

}
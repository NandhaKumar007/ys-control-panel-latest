import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  vendorOrderDetails: any = {}; vendorInfo: any = {};
  imgBaseUrl = environment.img_baseurl;
  subTotal: number = 0 ; itemInfo: any = {};
  btnLoader: boolean; errorMsg: string;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private api: OrderService, public commonService: CommonService, private router: Router
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.pageLoader = true;
      // order details
      this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          this.itemList = this.order_details.item_list.filter(obj => obj.vendor_id==this.params.vendor_id);
          this.itemList.forEach(item => {
            if(item.item_status!='c_confirmed') {
              this.subTotal += (item.final_price*item.quantity);
              if(item.unit!="Pcs") { this.subTotal += item.addon_price; }
            }
          });
          let vendorIndex = this.order_details.vendor_list.findIndex(obj => obj.vendor_id==this.params.vendor_id);
          if(vendorIndex!=-1) this.vendorOrderDetails = this.order_details.vendor_list[vendorIndex];
          // vendor details
          let vIndex = this.commonService.vendor_list.findIndex(el => el._id==this.params.vendor_id);
          if(vIndex!=-1) this.vendorInfo = this.commonService.vendor_list[vIndex];
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onMarkPaid() {
    this.btnLoader = true; delete this.errorMsg;
    let formData = {
      _id: this.params.order_id, vendor_id: this.params.vendor_id,
      data_set: { 'vendor_list.$.settlement_info.status': 'paid', 'vendor_list.$.settled_on': new Date() }
    };
    this.api.UPDATE_ORDER_DETAILS(formData).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/orders/settlement']);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
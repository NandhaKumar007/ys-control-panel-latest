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

  settlement_info: any = {};
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
      this.pageLoader = true;
      // order details
      this.api.SETTLEMENT_ORDERS({ _id: params.id }).subscribe(result => {
        if(result.status) {
          this.settlement_info = result.data;
          this.vendorOrderDetails = result.data.orderDetails;
          this.itemList = result.data.item_list;
          this.itemList.forEach(item => {
            if(item.item_status!='c_confirmed') {
              this.subTotal += (item.final_price*item.quantity);
              if(item.unit!="Pcs") { this.subTotal += item.addon_price; }
            }
          });
          // vendor details
          let vIndex = this.commonService.vendor_list.findIndex(el => el._id==this.settlement_info.vendor_id);
          if(vIndex!=-1) this.vendorInfo = this.commonService.vendor_list[vIndex];
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onMarkPaid() {
    this.btnLoader = true; delete this.errorMsg;
    this.api.UPDATE_SETTLEMENT_ORDER({ _id: this.settlement_info._id, status: 'paid', settled_on: new Date() }).subscribe(result => {
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
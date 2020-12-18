import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-abandoned-cart-details',
  templateUrl: './abandoned-cart-details.component.html',
  styleUrls: ['./abandoned-cart-details.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedCartDetailsComponent implements OnInit {

  customer_details: any = {};
  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;

  constructor(
    private activeRoute: ActivatedRoute, private customerApi: CustomerApiService, public location: Location,
    public router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.customerApi.CUSTOMER_DETAILS(params.customer_id).subscribe(result => {
        if(result.status) {
          this.customer_details = result.data;
          if(!this.customer_details.mobile) {
            if(this.customer_details.address_list.length) {
              let filteredAddress = this.customer_details.address_list.filter(obj => obj.billing_address);
              this.customer_details.mobile = filteredAddress[0].dial_code+" "+filteredAddress[0].mobile;
            }
            else this.customer_details.mobile = "NA";
          }
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

}
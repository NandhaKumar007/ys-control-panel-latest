import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-inactive-payments',
  templateUrl: './ys-inactive-payments.component.html',
  styleUrls: ['./ys-inactive-payments.component.scss'],
  animations: [SharedAnimations]
})

export class YsInactivePaymentsComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; scrollPos: number = 0;
  filterForm: any = { type: 'All', from_date: new Date(), to_date: new Date() };
  list: any = [];

  constructor(private api: AdminApiService, public commonService: CommonService) { }

  ngOnInit() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      if(this.filterForm.to_date == new Date) this.filterForm.to_date = new Date(new Date().setMinutes(new Date().getMinutes() - 10));
      this.pageLoader = true;
      this.api.INACTIVE_PAYMENTS(this.filterForm).subscribe(result => {
        if(result.status) {
          this.list = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
          this.list.forEach(obj => {
            if(obj.storeDetails && obj.storeDetails.length) {
              obj.store_name = obj.storeDetails[0].name;
              obj.store_email = obj.storeDetails[0].email;
            }
            else obj.customer_email = obj.guest_email;
          });
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
      });
    }
  }

}
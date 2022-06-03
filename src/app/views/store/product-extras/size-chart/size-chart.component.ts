import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-size-chart',
  templateUrl: './size-chart.component.html',
  styleUrls: ['./size-chart.component.scss'],
  animations: [SharedAnimations]
})

export class SizeChartComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  vendor_id: string = "";

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true; this.list = [];
    if(sessionStorage.getItem("vid")) {
      this.vendor_id = sessionStorage.getItem("vid");
      sessionStorage.removeItem("vid");
    }
    this.api.CHART_LIST(this.vendor_id).subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // DELETE
  onDelete() {
    if(this.vendor_id) this.deleteForm.vendor_id = this.vendor_id;
    this.api.DELETE_CHART(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
				this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}
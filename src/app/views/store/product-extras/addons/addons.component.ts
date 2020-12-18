import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss'],
  animations: [SharedAnimations]
})
export class AddonsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
	deleteForm: any; search_bar: string;
  pageLoader: boolean; scrollPos: number = 0;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      delete this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
    }
    this.pageLoader = true;
    this.api.ADDON_LIST().subscribe(result => {
			if(result.status) {
        // category list
        this.list = result.list;
        this.list.forEach((object) => {
          object.options_count = 0;
          object.custom_list.forEach((obj) => {
            object.options_count += obj.option_list.length;
          });
        });
        // get max rank
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_ADDON(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        // category list
        this.list = result.list;
        this.list.forEach((object) => {
          object.options_count = 0;
          object.custom_list.forEach((obj) => {
            object.options_count += obj.option_list.length;
          });
        });
        // get max rank
        this.maxRank = this.list.length;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  goModifyPage() {
    this.commonService.page_attr = { page_no: this.page, search: this.search_bar, scroll_pos: sessionStorage.getItem("scroll_y_pos") };
  }

}
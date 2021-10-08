import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { AccountService } from '../account.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-app-store',
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss']
})

export class AppStoreComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  selected_package: string = 'all';
  list: any = []; package_list: any = [];
  parent_list:any = []; scrollPos: number = 0;
  imgBaseUrl = environment.img_baseurl;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: AccountService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      delete this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.selected_package = pageInfo.selected_package;
      this.search_bar = pageInfo.search;
    }
    this.api.YS_FEATURES_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
      if(result.status) {
        this.package_list = result.packages;
        this.parent_list = result.list.filter(obj => obj.linked_packages.length);
        let trialFeatures = result.deploy_details.trial_features;
        this.parent_list.forEach(obj => {
          let tIndex = trialFeatures.findIndex(el => el.name==obj.keyword);
          if(tIndex!=-1) obj.deploy_data = trialFeatures[tIndex];
        });
        this.onChange(this.selected_package);
      }
      else console.log("response", result);
    });
  }

  onSelectApp(x, modalName) {
    if(this.commonService.store_details.package_details && this.commonService.store_details.package_details.billing_status) {
      this.commonService.page_attr = { selected_package: this.selected_package, search: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
      this.router.navigate(["/account/app-store/"+x._id]);
    }
    else this.modalService.open(modalName, { centered: true });
  }

  onChange(x) {
    if(x!='all') {
      this.list = this.parent_list.filter(obj => obj.linked_packages.findIndex(el => el.package_id==x)!=-1);
    }
    else this.list = this.parent_list;
  }

}

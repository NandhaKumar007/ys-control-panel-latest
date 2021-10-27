import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-features',
  templateUrl: './ys-features.component.html',
  styleUrls: ['./ys-features.component.scss'],
  animations: [SharedAnimations]
})

export class YsFeaturesComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; parent_list: any = []; list: any = [];
  deleteForm: any; search_bar: string;
  curr_end_date: any = new Date().setHours(23,59,59,999);
  selected_category: string = 'all';

  constructor(config: NgbModalConfig, public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    let packageList = this.commonService.admin_packages;
    this.adminApi.FEATURE_LIST().subscribe(result => {
      if(result.status) {
        this.commonService.admin_features = result.list;
        this.commonService.updateLocalData('admin_features', this.commonService.admin_features);
        this.parent_list = [];
        result.list.forEach(obj => {
          obj.packages = [];
          obj.linked_packages.forEach(element => {
            let packIndex = packageList.findIndex(pack => pack._id==element.package_id);
            if(packIndex!=-1) obj.packages.push(packageList[packIndex].name)
          });
          if(obj.disc_status) {
            if(new Date(obj.disc_to).setHours(23,59,59,999) < new Date().setHours(0,0,0,0)) obj.disc_expired = true;
          }
          this.parent_list.push(obj);
          this.onChange(this.selected_category);
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // DELETE
  onDelete() {
    this.adminApi.DELETE_FEATURE(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  onChange(x) {
    this.list = [];
    if(x=='all') this.list = this.parent_list;
    else this.list = this.parent_list.filter(el => el.category==x);
  }

}
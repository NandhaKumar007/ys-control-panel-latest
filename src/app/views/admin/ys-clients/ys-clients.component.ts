import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ys-clients',
  templateUrl: './ys-clients.component.html',
  styleUrls: ['./ys-clients.component.scss'],
  animations: [SharedAnimations]
})

export class YsClientsComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
  pageLoader: boolean; list: any = [];
  imgBaseUrl = environment.img_baseurl;
  pwdForm: any = {}; listType: string = 'active';
  deleteForm: any = {}; verNum: any = new Date().getFullYear()+(new Date().getMonth()+1)+new Date().getDate();

  constructor(config: NgbModalConfig, public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true; this.page = 1;
    this.adminApi.STORE_LIST(this.listType).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.list.forEach(obj => {
          obj.package_name = "NA";
          if(obj.package_details) {
            let packIndex = this.commonService.admin_packages.findIndex(x => x._id==obj.package_details.package_id);
            if(packIndex!=-1) obj.package_name = this.commonService.admin_packages[packIndex].name;
          }
        });
        if(this.listType=='active') this.commonService.store_list = result.list;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onUpdatePwd(modalName) {
    this.adminApi.CHANGE_STORE_PWD({ store_id: this.pwdForm._id, new_pwd: this.pwdForm.new_pwd }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.pwdForm.error_msg = result.message;
      }
    });
  }

  onUpdateStatus() {
    let storeStatus = 'active';
    if(this.deleteForm.status=='active') storeStatus = 'inactive';
    this.adminApi.UPDATE_STORE({ _id: this.deleteForm._id, status: storeStatus, session_key: new Date().valueOf() }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.error_msg = result.message;
      }
    });
  }

  onDelete() {
    if(this.deleteForm.status=='inactive') {
      this.adminApi.DELETE_STORE({ _id: this.deleteForm._id }).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          console.log("response", result);
          this.deleteForm.error_msg = result.message;
        }
      });
    }
    else this.deleteForm.error_msg = "Invalid store";
  }

}
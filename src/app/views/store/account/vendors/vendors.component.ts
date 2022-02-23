import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
  animations: [SharedAnimations]
})

export class VendorsComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean;
  list: any = []; imgBaseUrl = environment.img_baseurl;
  vendorForm: any = {}; pwdForm: any = {}; deleteForm: any = {};
  permissionList: any = [
    { title: "PRODUCT",
      sub_list: [
        { keyword: "add_product", name: "Add" },
        { keyword: "remove_product", name: "Remove" },
        { keyword: "link_product", name: "Link to Catalog" },
        { keyword: "update_product", name: "Update", selected_option: "update_product_overall", options: [
          { keyword: "update_product_overall", name: "Overall" },
          { keyword: "update_product_stock_only", name: "Stock Only" }
        ] }
      ]
    }
  ]

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: AccountService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.VENDOR_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.commonService.vendor_list = this.list;
        this.commonService.updateLocalData('vendor_list', this.list);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSubmit() {
    if(this.vendorForm.form_type=='add') {
      this.vendorForm.submit = true;
      this.vendorForm.status = "active";
      this.api.ADD_VENDOR(this.vendorForm).subscribe((result) => {
        this.vendorForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    if(this.vendorForm.form_type=='edit_details') {
      this.vendorForm.submit = true;
      this.api.UPDATE_VENDOR(this.vendorForm).subscribe(result => {
        this.vendorForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    if(this.vendorForm.form_type=='edit_permissions') {
      let sendData = { _id: this.vendorForm._id, permission_list: [] };
      this.permissionList.forEach(obj => {
        obj.sub_list.forEach(el => {
          if(el.selected) {
            sendData.permission_list.push(el.keyword);
            if(el.selected_option) sendData.permission_list.push(el.selected_option);
          }
        });
      });
      this.vendorForm.submit = true;
      this.api.UPDATE_VENDOR(sendData).subscribe(result => {
        this.vendorForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEdit(x, type, modalName) {
    this.api.VENDOR_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.vendorForm = result.data;
        delete this.vendorForm.username;
        delete this.vendorForm.password;
        this.vendorForm.form_type = type;
        this.permissionList.forEach(obj => {
          obj.sub_list.forEach(el => {
            delete el.selected; delete el.selected_option;
            if(this.vendorForm.permission_list.indexOf(el.keyword)!=-1) el.selected = true;
            if(el.options && el.options.length) {
              el.options.forEach(elem => {
                let optExist;
                if(this.vendorForm.permission_list.indexOf(elem.keyword)!=-1) {
                  optExist = true;
                  el.selected_option = elem.keyword;
                }
                if(!optExist) el.selected_option = el.options[0].keyword;
              });
            }
          });
        });
        this.modalService.open(modalName, {size: "lg"});
      }
      else console.log("response", result);
    });
  }

  // DELETE
  onDelete() {
    this.api.DELETE_VENDOR(this.deleteForm).subscribe(result => {
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

  onUpdateStatus() {
    if(this.deleteForm.exist_status=='active') this.deleteForm.status='inactive';
    else this.deleteForm.status='active';
    this.api.UPDATE_VENDOR({ _id: this.deleteForm._id, status: this.deleteForm.status, session_key: new Date().valueOf() }).subscribe(result => {
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

  // UPDATE PWD
  onUpdatePwd() {
    this.api.UPDATE_VENDOR_PWD(this.pwdForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateBanner() {
    this.vendorForm.submit = true;
    this.api.UPDATE_VENDOR(this.vendorForm).subscribe(result => {
      this.vendorForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.vendorForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.vendorForm.image = (<FileReader>event.target).result;
        this.vendorForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';

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
  list: any = []; btnLoader: boolean;
  addForm: any = {}; editForm: any = {}; pwdForm: any = {}; permissions: any = {}; deleteForm: any = {};

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: AccountService, public commonService: CommonService) {
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

  // ADD
  onAdd() {
    this.btnLoader = true;
    this.addForm.permissions = { products: { update: true, update_type: 'stock_only' } };
    this.api.ADD_VENDOR(this.addForm).subscribe((result) => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.commonService.vendor_list = this.list;
        this.commonService.updateLocalData('vendor_list', this.list);
      }
      else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
    });
  }

  // EDIT
  onEdit(x, type, modalName) {
    this.api.VENDOR_LIST().subscribe(result => {
      if(result.status) {
        let vendorList = result.list;
        let index = vendorList.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = vendorList[index];
          this.permissions = {};
          if(this.editForm.permissions) this.permissions = this.editForm.permissions;
          if(type=='details') this.modalService.open(modalName);
          else this.modalService.open(modalName, {size: "lg"});
        }
        else console.log("invalid vendor");
      }
      else console.log("response", result);
    });
  }

  // UPDATE
  onUpdate(type) {
    if(type=='permissions') this.editForm.session_key = new Date().valueOf();
    this.editForm.permissions = this.permissions;
    this.api.UPDATE_VENDOR(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.commonService.vendor_list = this.list;
        this.commonService.updateLocalData('vendor_list', this.list);
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // DELETE
  onDelete() {
    this.api.DELETE_VENDOR(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.commonService.vendor_list = this.list;
        this.commonService.updateLocalData('vendor_list', this.list);
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
    this.deleteForm.session_key = new Date().valueOf();
    this.api.UPDATE_VENDOR(this.deleteForm).subscribe(result => {
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
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
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
  vendorForm: any = {}; pwdForm: any = {}; permissions: any = {}; deleteForm: any = {};

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
    if(this.vendorForm.form_type=='edit') {
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
  }

  // EDIT
  onEdit(x, type, modalName) {
    this.api.VENDOR_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.vendorForm = result.data;
        delete this.vendorForm.username;
        delete this.vendorForm.password;
        this.vendorForm.form_type = 'edit';
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
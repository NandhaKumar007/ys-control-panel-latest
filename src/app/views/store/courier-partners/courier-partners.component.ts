import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-courier-partners',
  templateUrl: './courier-partners.component.html',
  styleUrls: ['./courier-partners.component.scss'],
  animations: [SharedAnimations]
})

export class CourierPartnersComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  cpForm: any; deleteForm: any;
  pageLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private storeApi: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.storeApi.CP_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

	onSubmit() {
    this.cpForm.submit = true;
    if(this.cpForm.form_type=='add') {
      this.storeApi.ADD_CP(this.cpForm).subscribe(result => {
        this.cpForm.submit = false;
        if(result.status) {
          this.list = result.list;
          document.getElementById('closeModal').click();
        }
        else {
          this.cpForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.storeApi.UPDATE_CP(this.cpForm).subscribe(result => {
        this.cpForm.submit = false;
        if(result.status) {
          this.list = result.list;
          document.getElementById('closeModal').click();
        }
        else {
          this.cpForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }
  
  // EDIT
  onEdit(x, modalName) {
    this.storeApi.CP_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.cpForm = result.data;
        this.cpForm.form_type = 'edit';
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  onUpdateStatus() {
    let newStatus = 'active';
    if(this.cpForm.status=='active') newStatus = 'inactive';
    let sendData: any = {};
    for(let key in this.cpForm) {
      if(this.cpForm.hasOwnProperty(key)) sendData[key] = this.cpForm[key];
    }
    sendData.status = newStatus;
    this.cpForm.submit = true;
    this.storeApi.UPDATE_CP(sendData).subscribe(result => {
      this.cpForm.submit = false;
      if(result.status) {
        this.list = result.list;
        document.getElementById('closeModal').click();
      }
      else {
        this.cpForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  
  // DELETE
  onDelete() {
    this.storeApi.DELETE_CP(this.deleteForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        document.getElementById('closeModal').click();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}

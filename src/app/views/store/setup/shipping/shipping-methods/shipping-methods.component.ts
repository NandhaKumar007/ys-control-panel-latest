import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { SetupService } from '../../setup.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.scss'],
  animations: [SharedAnimations]
})

export class ShippingMethodsComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  addForm: any; editForm: any; deleteForm: any;
  list: any = [];
  pageLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.SHIPPING_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // Add
  onAdd() {
    this.api.ADD_SHIPPING(this.addForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeAddModal').click();
        this.ngOnInit();
      }
      else {
        this.addForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Edit
  onEdit(x, modal) {
    this.api.SHIPPING_DETAILS(x).subscribe(result => {
      if(result.status) {
        this.editForm = result.data;
        this.modalService.open(modal);
      }
    });
  }
  onUpdate() {
    this.api.UPDATE_SHIPPING(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeEditModal').click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Delete
  onDelete() {
    this.api.DELETE_SHIPPING(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeDeleteModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
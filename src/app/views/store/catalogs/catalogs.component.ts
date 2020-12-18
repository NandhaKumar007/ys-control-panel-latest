import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss'],
  animations: [SharedAnimations]
})

export class CatalogsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router,
    private storeApi: StoreApiService, private sidebar: SidebarService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.storeApi.CATALOG_LIST().subscribe(result => {
      if(result.status) this.list = result.list.sort((a, b) => 0 - (a._id > b._id ? 1 : -1));
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
	onAdd() {
    this.storeApi.ADD_CATALOG(this.addForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.sidebar.BUILD_CATEGORY_LIST();
        this.ngOnInit();
      }
      else {
        this.addForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  
  // EDIT
  onEdit(x, modalName) {
    this.editForm = { _id: x._id, name: x.name, seo_status: x.seo_status };
    if(this.editForm.seo_status) this.editForm.seo_details = x.seo_details;
    this.modalService.open(modalName);
  }

  // UPDATE
	onUpdate() {
    if(this.editForm.seo_status && this.editForm.update_seo) this.editForm.seo_details.modified = false;
    this.storeApi.UPDATE_CATALOG(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.sidebar.BUILD_CATEGORY_LIST();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  
  // DELETE
  onDelete() {
    this.storeApi.DELETE_CATALOG(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.sidebar.BUILD_CATEGORY_LIST();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
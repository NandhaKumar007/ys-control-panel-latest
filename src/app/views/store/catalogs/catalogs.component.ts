import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
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

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private storeApi: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.storeApi.CATALOG_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.commonService.catalog_list = result.list;
        this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
	onAdd() {
    this.storeApi.ADD_CATALOG(this.addForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
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
    this.storeApi.CATALOG_DETAILS({ _id: x._id }).subscribe(result => {
      if(result.status) {
        let catalogData = result.data;
        this.editForm = { _id: catalogData._id, name: catalogData.name, seo_status: catalogData.seo_status };
        this.editForm.seo_details = {};
        if(this.editForm.seo_status) this.editForm.seo_details = catalogData.seo_details;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  // UPDATE
	onUpdate() {
    if(this.editForm.seo_status && this.editForm.update_seo) this.editForm.seo_details.modified = false;
    this.storeApi.UPDATE_CATALOG(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
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
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
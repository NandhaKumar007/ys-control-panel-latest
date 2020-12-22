import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-catalog-page-content',
  templateUrl: './catalog-page-content.component.html',
  styleUrls: ['./catalog-page-content.component.scss'],
  animations: [SharedAnimations]
})

export class CatalogPageContentComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  seoForm: any = {}; pageLoader: boolean;
  catalog_name: string;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router,
    private storeApi: StoreApiService, public commonService: CommonService
  ) {
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

  // EDIT
  onEdit(x, modalName) {
    this.catalog_name = x.name;
    this.seoForm = { _id: x._id, content_status: x.content_status, content_details: x.content_details };
    this.modalService.open(modalName, {size: 'lg'});
  }

  // UPDATE
	onUpdate() {
    if(!this.seoForm.content_status) this.seoForm.content_details = {};
    this.storeApi.UPDATE_CATALOG(this.seoForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}

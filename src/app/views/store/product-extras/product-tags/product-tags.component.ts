import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-product-tags',
  templateUrl: './product-tags.component.html',
  styleUrls: ['./product-tags.component.scss'],
  animations: [SharedAnimations]
})

export class ProductTagsComponent implements OnInit {

  page = 1; pageSize = 10;
	list: any = []; maxRank: any = 0;
  tagForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  vendor_id: string = "";
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    if(this.commonService.store_details?.login_type=='vendor') this.vendor_id = this.commonService.vendor_details?._id;
    this.pageLoader = true;
    this.api.TAG_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list;
				this.maxRank = this.list.length;
        this.filterVendorTags();
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // EDIT
  onEdit(x, modalName) {
    this.api.TAG_LIST().subscribe(result => {
			if(result.status) {
        let index = result.list.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.tagForm = result.list[index];
          this.tagForm.form_type = 'edit';
          this.tagForm.prev_rank = this.tagForm.rank;
          if(this.vendor_id) {
            let vIndex = this.tagForm.vendor_list?.findIndex(obj => obj.vendor_id==this.vendor_id);
            if(vIndex!=-1) this.tagForm.option_list = this.tagForm.vendor_list[vIndex].option_list;
            else this.tagForm.option_list = [{}];
          }
          if(!this.tagForm.option_list?.length) this.tagForm.option_list = [{}];
          this.modalService.open(modalName, {size: 'lg'});
        }
        else console.log("Invalid tag");
      }
      else console.log("response", result);
		});
  }

  onSubmit() {
    this.tagForm.submit = true;
    if(this.tagForm.form_type=='add') {
      this.api.ADD_TAG(this.tagForm).subscribe(result => {
        this.tagForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
          this.filterVendorTags();
        }
        else {
          this.tagForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      if(this.vendor_id) this.tagForm.vendor_id = this.vendor_id;
      this.api.UPDATE_TAG(this.tagForm).subscribe(result => {
        this.tagForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
          this.filterVendorTags();
        }
        else {
          this.tagForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE
  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_TAG(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
        this.filterVendorTags();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  filterVendorTags() {
    if(this.vendor_id) {
      this.list.forEach(el => {
        el.option_list = [];
        let vIndex = el.vendor_list?.findIndex(obj => obj.vendor_id==this.vendor_id);
        if(vIndex!=-1) el.option_list = el.vendor_list[vIndex].option_list;
      });
    }
  }

}
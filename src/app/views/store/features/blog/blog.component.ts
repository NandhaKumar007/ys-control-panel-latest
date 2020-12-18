import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  animations: [SharedAnimations]
})
export class BlogComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; step_num: any; search_bar: any;
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; btnLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.BLOG_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
	onAdd(modalName) {
    this.btnLoader = true;
    let blogUrl = this.commonService.urlFormat(this.addForm.name);
    if(blogUrl) {
      this.addForm.seo_status = true;
      this.addForm.seo_details = {
        page_url: blogUrl,
        h1_tag: this.addForm.name.substring(0, 70),
        page_title: this.addForm.name.substring(0, 70),
        meta_desc: this.commonService.stripHtml(this.addForm.description).substring(0, 320)
      };
    }
		this.api.ADD_BLOG(this.addForm).subscribe(result => {
      this.btnLoader = false;
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
    this.btnLoader = false;
    this.step_num = 1;
    this.api.BLOG_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.editForm = result.data;
        this.editForm.exist_image = this.editForm.image;
        this.modalService.open(modalName, {size: "lg"});
      }
      else console.log("response", result);
    });
  }

  // UPDATE
  onUpdate(modalName) {
    this.btnLoader = true;
    let blogUrl = this.commonService.urlFormat(this.editForm.name);
    if(!this.editForm.seo_details) this.editForm.seo_details = {};
    if(this.editForm.update_seo) this.editForm.seo_details.modified = false;
    if(blogUrl && !this.editForm.seo_details.modified) {
      this.editForm.seo_status = true;
      this.editForm.seo_details.page_url = blogUrl;
      this.editForm.seo_details.h1_tag = this.editForm.name.substring(0, 70);
      this.editForm.seo_details.page_title = this.editForm.name.substring(0, 70);
      this.editForm.seo_details.meta_desc = this.commonService.stripHtml(this.editForm.description).substring(0, 320);
    }
    this.api.UPDATE_BLOG(this.editForm).subscribe(result => {
      this.btnLoader = false;
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

  // UPDATE STATUS
  onChangeStatus(x, status, modalName) {
    this.editForm = x;
    this.editForm.change_status = status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    this.api.UPDATE_BLOG({ _id: this.editForm._id, status: this.editForm.change_status+"d" }).subscribe(result => {
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
    this.api.DELETE_BLOG(this.deleteForm).subscribe(result => {
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

  fileChangeListener(type, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        if(type=='add') {
          this.addForm.image = (<FileReader>event.target).result;
          this.addForm.img_change = true;
        }
        else {
          this.editForm.image = (<FileReader>event.target).result;
          this.editForm.img_change = true;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
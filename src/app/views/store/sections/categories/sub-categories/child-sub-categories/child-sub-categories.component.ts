import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { SectionService } from '../../../section.service';
import { SidebarService } from '../../../../../../services/sidebar.service';
import { CommonService } from '../../../../../../services/common.service';

@Component({
  selector: 'app-child-sub-categories',
  templateUrl: './child-sub-categories.component.html',
  styleUrls: ['./child-sub-categories.component.scss'],
  animations: [SharedAnimations]
})

export class ChildSubCategoriesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
  selectedSection = JSON.parse(sessionStorage.getItem("selected_section"));
  selectedCategory = JSON.parse(sessionStorage.getItem("selected_category"));
  selectedSubCategory = JSON.parse(sessionStorage.getItem("selected_sub_category"));
  sectionId: string; categoryId: string; subCategoryId: string;
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;

  constructor(
    private router: Router, config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private api: SectionService, private sidebar: SidebarService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.sectionId = params.section_id;
      this.categoryId = params.category_id;
      this.subCategoryId = params.sub_category_id;
      this.api.CHILDSUBCATEGORY_LIST(this.sectionId, this.categoryId, this.subCategoryId).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          // get max rank
          this.maxRank = this.list.length;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  // ADD
	onAdd() {
    this.addForm.section_id = this.sectionId;
    this.addForm.category_id = this.categoryId;
    this.addForm.sub_category_id = this.subCategoryId;
		this.api.ADD_CHILDSUBCATEGORY(this.addForm).subscribe(result => {
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
    this.api.CHILDSUBCATEGORY_LIST(this.sectionId, this.categoryId, this.subCategoryId).subscribe(result => {
      if(result.status) {
        let index = result.list.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = result.list[index];
          this.editForm.prev_rank = this.editForm.rank;
          this.modalService.open(modalName);
        }
        else console.log("Invalid sub-category");
      }
      else console.log("response", result);
    });
  }

  // UPDATE
	onUpdate() {
    this.editForm.section_id = this.sectionId;
    this.editForm.category_id = this.categoryId;
    this.editForm.sub_category_id = this.subCategoryId;
    if(this.editForm.seo_status && this.editForm.update_seo) this.editForm.seo_details.modified = false;
		this.api.UPDATE_CHILDSUBCATEGORY(this.editForm).subscribe(result => {
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
    this.deleteForm.section_id = this.sectionId;
    this.deleteForm.category_id = this.categoryId;
    this.deleteForm.sub_category_id = this.subCategoryId;
    this.api.DELETE_CHILDSUBCATEGORY(this.deleteForm).subscribe(result => {
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
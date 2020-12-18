import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionService } from './section.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
  animations: [SharedAnimations]
})

export class SectionsComponent implements OnInit {

	page = 1; pageSize = 10; formType: string;
	list: any = []; maxRank: any = 0; sectionId: string;
	addForm: any; editForm: any; deleteForm: any;
	pageLoader: boolean; search_bar: string;

	constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SectionService,
    private sidebar: SidebarService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

	ngOnInit() {
		this.pageLoader = true;
		this.api.SECTION_LIST().subscribe(result => {
			if(result.status) this.list = result.list;
			else console.log("response", result);
			setTimeout(() => { this.pageLoader = false; }, 500);
		});
	}

  // ADD
	onAdd() {
		if(this.formType=='section') {
			this.api.ADD_SECTION(this.addForm).subscribe(result => {
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
		else if(this.formType=='category') {
			this.addForm.section_id = this.sectionId;
			this.api.ADD_CATEGORY(this.addForm).subscribe(result => {
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
		else console.log("Invalid form");
	}

	// EDIT
  onEdit(x, modalName) {
		if(this.formType=='section') {
			this.editForm = { _id: x._id, name: x.name, rank: x.rank, prev_rank: x.rank, seo_status: x.seo_status };
			if(this.editForm.seo_status) this.editForm.seo_details = x.seo_details;
			this.modalService.open(modalName);
		}
		else if(this.formType=='category') {
			this.api.CATEGORY_LIST(this.sectionId).subscribe(result => {
				if(result.status) {
					let index = result.list.findIndex(obj => obj._id==x._id);
					if(index!=-1) {
						this.editForm = result.list[index];
						this.editForm.prev_rank = this.editForm.rank;
						this.modalService.open(modalName);
					}
					else console.log("Invalid category");
				}
				else console.log("response", result);
			});
		}
		else console.log("Invalid form");
  }

  // UPDATE
	onUpdate() {
    if(this.editForm.seo_status && this.editForm.update_seo) this.editForm.seo_details.modified = false;
		if(this.formType=='section') {
			this.api.UPDATE_SECTION(this.editForm).subscribe(result => {
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
		else if(this.formType=='category') {
			this.editForm.section_id = this.sectionId;
			this.api.UPDATE_CATEGORY(this.editForm).subscribe(result => {
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
		else console.log("Invalid form");
  }
  
  // DELETE
  onDelete() {
		if(this.formType=='section') {
			this.api.DELETE_SECTION(this.deleteForm).subscribe(result => {
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
		else if(this.formType=='category') {
			this.deleteForm.section_id = this.sectionId;
			this.api.DELETE_CATEGORY(this.deleteForm).subscribe(result => {
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
		else console.log("Invalid form");
  }

  // Route Change
	onRouterChange(x) {
		sessionStorage.setItem("selected_section", JSON.stringify({name: x.name}));
		this.router.navigate(["sections/"+x._id]);
	}
	// View Sub-Categories
	onViewCategories(x, y) {
		this.sectionId = x._id;
		sessionStorage.setItem("selected_section", JSON.stringify({name: x.name}));
		sessionStorage.setItem("selected_category", JSON.stringify({section_id: this.sectionId, name: y.name}));
		this.router.navigate(["sections/"+this.sectionId+'/'+y._id]);
  }

}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { SectionService } from '../section.service';
import { SidebarService } from '../../../../services/sidebar.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  animations: [SharedAnimations]
})

export class CategoriesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
  selectedSection = JSON.parse(sessionStorage.getItem("selected_section"));
  sectionId: string; search_bar: string;
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute,
    private api: SectionService, private sidebar: SidebarService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.sectionId = params.section_id;
      this.api.CATEGORY_LIST(this.sectionId).subscribe(result => {
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
  
  // EDIT
  onEdit(x, modalName) {
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

  // UPDATE
	onUpdate() {
    this.editForm.section_id = this.sectionId;
    if(this.editForm.seo_status && this.editForm.update_seo) this.editForm.seo_details.modified = false;
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
  
  // DELETE
  onDelete() {
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

  // Route Change
	onRouterChange(x) {
		sessionStorage.setItem("selected_category", JSON.stringify({section_id: this.sectionId, name: x.name}));
		this.router.navigate(["sections/"+this.sectionId+'/'+x._id]);
  }

}
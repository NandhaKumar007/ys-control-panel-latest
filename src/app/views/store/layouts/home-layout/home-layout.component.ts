import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
  animations: [SharedAnimations]
})

export class HomeLayoutComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; search_bar: string;
  list: any = []; maxRank: any = 0;
  addForm: any; editForm: any; deleteForm: any;
  layoutTypes: any = [
    { name: "Primary Slider", value: "primary_slider" },
    { name: "Main Slider", value: "slider" },
    { name: "Section Grid", value: "section" },
    { name: "Featured Sections", value: "featured_section" },
    { name: "Featured Products", value: "featured_product" },
    { name: "Highlighted Section", value: "highlighted_section" },
    { name: "Multi-tab Featured Products", value: "multiple_featured_product" },
    { name: "Secondary Banner", value: "secondary" }
  ];
  multiTabOptions: any = [
    { type: "featured", disp_name: "Featured" },
    { type: "new_arrivals", disp_name: "New Arrivals" },
    { type: "discounted", disp_name: "Discounted" },
    { type: "category", disp_name: "Catalog" }
  ];

  constructor(private router: Router, config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    if(this.commonService.ys_features.indexOf('testimonials') !== -1) this.layoutTypes.push({ name: "Testimonial", value: "testimonial" });
    if(this.commonService.ys_features.indexOf('shopping_assistant') !== -1) this.layoutTypes.push({ name: "Shopping Assistant", value: "shopping_assistant" });
    if(this.commonService.ys_features.indexOf('blogs') !== -1) this.layoutTypes.push({ name: "Blogs", value: "blogs" });
    this.pageLoader = true;
    this.api.LAYOUT_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAdd() {
    if(this.addForm.type!="multiple_featured_product") delete this.addForm.multitab_list;
    this.api.ADD_LAYOUT(this.addForm).subscribe(result => {
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

  // EDIT
  onEditDetails(x, modalName) {
    this.api.LAYOUT_DETAILS(x._id).subscribe(result => {
			if(result.status) {
        this.editForm = result.data;
        this.editForm.prev_rank = this.editForm.rank;
        this.editForm.dup_type = this.findType(this.editForm.type);
        if(this.editForm.section_grid_type) {
          this.editForm.dup_grid_type = this.findGridType(this.editForm.section_grid_type);
        }
				this.modalService.open(modalName, {size: 'lg'});
			}
			else console.log("response", result);
		});
  }

  // UPDATE
	onUpdate() {
		this.api.UPDATE_LAYOUT(this.editForm).subscribe(result => {
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

  // DELETE
  onDelete() {
    this.deleteForm.btnLoader = true;
    this.api.DELETE_LAYOUT(this.deleteForm).subscribe(result => {
      this.deleteForm.btnLoader = false;
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

  findType(type) {
    let index = this.layoutTypes.findIndex(obj => obj.value==type);
    if(index!=-1) return this.layoutTypes[index].name;
    else return "";
  }

  findGridType(type) {
    let index = this.commonService.grid_list.findIndex(obj => obj.type==type);
    if(index!=-1) return this.commonService.grid_list[index].name;
    else return "";
  }

}
import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.scss'],
  animations: [SharedAnimations]
})

export class GiftcardComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: any;
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; btnLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.GIFTCARD_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
	onAdd(modalName) {
    this.btnLoader = true;
		this.api.ADD_GIFTCARD(this.addForm).subscribe(result => {
      this.btnLoader = false;
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
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
    this.api.GIFTCARD_LIST().subscribe(result => {
      if(result.status) {
        let index = result.list.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = result.list[index];
          this.editForm.exist_image = this.editForm.image;
          this.modalService.open(modalName);
        }
        else console.log("Invalid giftcard");
      }
      else console.log("response", result);
    });
  }

  // UPDATE
  onUpdate(modalName) {
    this.btnLoader = true;
    this.api.UPDATE_GIFTCARD(this.editForm).subscribe(result => {
      this.btnLoader = false;
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
      }
			else {
				this.editForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_GIFTCARD(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeDeleteModal').click();
        this.list = result.list;
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
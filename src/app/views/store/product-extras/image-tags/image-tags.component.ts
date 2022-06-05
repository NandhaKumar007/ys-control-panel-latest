import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CommonService } from '../../../../services/common.service';
import { ProductExtrasApiService } from '../product-extras-api.service';

@Component({
  selector: 'app-image-tags',
  templateUrl: './image-tags.component.html',
  styleUrls: ['./image-tags.component.scss'],
  animations: [SharedAnimations]
})

export class ImageTagsComponent implements OnInit {

  pageLoader: boolean;
  page=1; pageSize = 10; 
  maxRank: any = 0; search_bar: string;
	tagForm: any; deleteForm: any;
  imgTagConfig: any = {}; list: any = [];
  autoTagForm: any = {
    position: 'left',
    auto_tags: [
      { type: 'new_arrival', display: 'New Arrival', name: 'New Arrival', rank: 1 },
      { type: 'on_sale', display: 'On Sale', name: 'On Sale', rank: 2 },
      { type: 'sold_out', display: 'Sold Out', name: 'Sold Out', rank: 3 }
    ]
  };

  constructor(public modalService: NgbModal, public commonService: CommonService, private api: ProductExtrasApiService) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.IMGTAG_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.list = result.list;
        this.maxRank = result.list.length;
        if(result.config) this.imgTagConfig = result.config;
      }
      else console.log("response",result);
		});
  }

  onSubmit() {
    if(this.tagForm.form_type=='add') {
      this.api.ADD_IMGTAG(this.tagForm).subscribe((result) => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = result.list.length;
          if(result.config) this.imgTagConfig = result.config;
        }
        else {
          this.tagForm.errorMsg = result.message;
          console.log("response",result)
        }
      });
    }
    else {
      this.api.UPDATE_IMGTAG(this.tagForm).subscribe((result) => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = result.list.length;
          if(result.config) this.imgTagConfig = result.config;
        }
        else {
          console.log("response", result);
          this.tagForm.errorMsg = result.message;
        }
      });
    }
  }

  onUpdateStatus(x) {
    let sendData: any = {};
    for(let key in x) {
      if(x.hasOwnProperty(key)) sendData[key] = x[key];
    }
    sendData.status = 'active';
    if(x.status=='active') sendData.status = 'inactive';
    this.api.UPDATE_IMGTAG(sendData).subscribe((result) => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = result.list.length;
        if(result.config) this.imgTagConfig = result.config;
      }
      else {
        console.log("response", result);
        this.tagForm.errorMsg = result.message;
      }
    });
  }

  onEdit(x, modalName) {
    this.tagForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.tagForm[key] = x[key];
    }
    this.modalService.open(modalName);
  }

  onDelete() {
    this.api.DELETE_IMGTAG(this.deleteForm).subscribe((result) => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = result.list.length;
        if(result.config) this.imgTagConfig = result.config;
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  onEditAutoTags(modalName) {
    delete this.autoTagForm.errorMsg;
    if(this.imgTagConfig?.position) this.autoTagForm.position = this.imgTagConfig?.position;
    if(this.imgTagConfig?.auto_tags) {
      this.autoTagForm.auto_tags.forEach((el, index) => {
        delete el.selected;
        el.rank = index+1;
        let tIndex = this.imgTagConfig.auto_tags.findIndex(obj => obj.type==el.type);
        if(tIndex!=-1) {
          el.selected = true;
          el.name = this.imgTagConfig.auto_tags[tIndex].name;
          el.rank = tIndex+1;
        }
      });
    }
    this.autoTagForm.auto_tags.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1))
    this.modalService.open(modalName, {size: 'lg'});
  }

  onUpdateAutoTags() {
    let autoTags = [];
    this.autoTagForm.auto_tags.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1)).forEach(el => {
      if(el.selected) autoTags.push({ type: el.type, name: el.name });
    });
    this.api.UPDATE_AUTO_IMG_TAG({ position: this.autoTagForm.position, auto_tags: autoTags }).subscribe((result) => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = result.list.length;
        if(result.config) this.imgTagConfig = result.config;
      }
      else {
        console.log("response", result);
        this.autoTagForm.errorMsg = result.message;
      }
    });
  }
}
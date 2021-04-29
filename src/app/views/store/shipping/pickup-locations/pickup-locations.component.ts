import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ShippingService } from '../shipping.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-pickup-locations',
  templateUrl: './pickup-locations.component.html',
  styleUrls: ['./pickup-locations.component.scss'],
  animations: [SharedAnimations]
})

export class PickupLocationsComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  locForm: any; deleteForm: any;
  list: any = []; state_list: any = [];
  pageLoader: boolean; maxRank: number = 0;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ShippingService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.PICKUP_LOC_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // Add
  onSubmit() {
    if(this.locForm.form_type=='add') {
      this.api.ADD_PICKUP_LOC(this.locForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
        }
        else {
          this.locForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_PICKUP_LOC(this.locForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
        }
        else {
          this.locForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // Edit
  onEdit(x, modal) {
    this.locForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.locForm[key] = x[key];
    }
    this.modalService.open(modal);
  }

  // Delete
  onDelete() {
    this.api.DELETE_PICKUP_LOC(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) this.state_list = this.commonService.country_list[index].states;
  }

}
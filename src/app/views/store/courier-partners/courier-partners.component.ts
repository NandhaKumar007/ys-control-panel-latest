import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-courier-partners',
  templateUrl: './courier-partners.component.html',
  styleUrls: ['./courier-partners.component.scss'],
  animations: [SharedAnimations]
})

export class CourierPartnersComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean; list: any = [];
  courierForm: any = {}; deleteForm: any = {};
  courierPartnerList: any = {
    delhivery: "https://staging-express.delhivery.com",
    dunzo: "https://api.dunzo.in"
  };

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.COURIER_PARTNER_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSubmit() {
    this.courierForm.submit = true;
    this.courierForm.base_url = this.courierPartnerList[this.courierForm.name.toLowerCase()];
    if(this.courierForm.formType=='add') {
      this.api.ADD_COURIER_PARTNER(this.courierForm).subscribe((result) => {
        this.courierForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.commonService.courier_partners = this.list;
          this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
        }
        else {
          this.courierForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_COURIER_PARTNER(this.courierForm).subscribe(result => {
        this.courierForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.commonService.courier_partners = this.list;
          this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
        }
        else {
          this.courierForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    
  }

  // EDIT
  onEdit(x, modalName) {
    this.api.COURIER_PARTNER_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.courierForm = result.data;
        this.courierForm.formType = 'update';
        this.modalService.open(modalName, {size: "lg"});
      }
      else console.log("response", result);
    });
  }

  // DELETE
  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_COURIER_PARTNER(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.commonService.courier_partners = this.list;
        this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}
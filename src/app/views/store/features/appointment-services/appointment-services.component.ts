import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-appointment-services',
  templateUrl: './appointment-services.component.html',
  styleUrls: ['./appointment-services.component.scss'],
  animations: [SharedAnimations]
})

export class AppointmentServicesComponent implements OnInit {

  page = 1; pageSize = 5;
	list: any = [];
  pageLoader: boolean; search_bar: string;
  catForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.APPOINTMENT_SERVICES_LIST().subscribe(result => {
			if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // DELETE
  onDelete() {
    if(this.deleteForm.category_id) {
      this.api.DELETE_APPOINTMENT_SERVICES(this.deleteForm).subscribe(result => {
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
    else {
      this.api.DELETE_APPOINTMENT_CATEGORY(this.deleteForm).subscribe(result => {
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
  }

  onEdit(x, modalName) {
    this.catForm = { form_type: 'edit' };
    this.catForm._id = x._id;
    this.catForm.name = x.name;
    this.catForm.page_url = x.page_url;
    this.modalService.open(modalName);
  }
  onSubmit() {
    if(this.catForm.form_type=='add') {
      this.api.ADD_APPOINTMENT_CATEGORY(this.catForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_APPOINTMENT_CATEGORY(this.catForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

}
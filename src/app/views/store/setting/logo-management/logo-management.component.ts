import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-logo-management',
  templateUrl: './logo-management.component.html',
  styleUrls: ['./logo-management.component.scss']
})

export class LogoManagementComponent implements OnInit {

  logoForm: any = {}; verNum: any;
  imgBaseUrl = environment.img_baseurl; btnLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.verNum = new Date().valueOf();
  }

  onUpdate(modalName) {
    this.btnLoader = true;
    this.api.UPDATE_LOGO(this.logoForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
				this.logoForm.errorMsg = result.message;
				console.log("response", result);
			}
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.logoForm.image = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
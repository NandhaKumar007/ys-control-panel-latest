import { Component, OnInit } from '@angular/core';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-store-logo',
  templateUrl: './store-logo.component.html',
  styleUrls: ['./store-logo.component.scss']
})

export class StoreLogoComponent implements OnInit {

  logoForm: any = {};
  colorList: any = [];
  storeLogo: string;

  constructor(public commonService: CommonService, private api: StoreApiService) { }

  ngOnInit(): void {
    this.logoForm = {};
    this.storeLogo = environment.img_baseurl+'uploads/'+this.commonService.store_details._id+'/logo.png?v='+new Date().valueOf();
  }

  findColors() {
    this.api.LOGO_COLORS({ file_name: this.storeLogo }).subscribe(result => {
      this.ngOnInit();
      if(result.status) this.colorList = result.colors;
      else console.log("response", result);
    });
  }

  uploadLogo() {
    this.logoForm.submit = true; this.colorList = [];
    this.logoForm.store_id = this.commonService.store_details._id;
    this.api.UPDATE_STORE_LOGO(this.logoForm).subscribe(result => {
      this.ngOnInit();
      if(result.status) this.colorList = result.colors;
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
        this.logoForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
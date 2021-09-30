import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-deploy-logo',
  templateUrl: './deploy-logo.component.html',
  styleUrls: ['./deploy-logo.component.scss']
})

export class DeployLogoComponent implements OnInit {

  logoForm: any = {};
  colorList: any = [];
  storeLogo: string;
  colorFields: any = [
    { name: "Choose Primary Color", keyword: "primary", color_code: "" },
    { name: "Choose Secondary Color", keyword: "secondary", color_code: "" }
  ];
  colorSections: any = [];

  constructor(public commonService: CommonService, private api: DeploymentService) { }

  ngOnInit(): void {
    this.logoForm = {}; this.colorList = []; this.colorSections = [];
    this.storeLogo = environment.img_baseurl+'uploads/'+this.commonService.store_details._id+'/logo.png?v='+this.commonService.verNum;
    if(this.commonService.deploy_details.theme_colors) {
      let x = this.commonService.deploy_details.theme_colors;
      for(let key in x) {
        if(x.hasOwnProperty(key)) this.colorSections.push({ name: key, value: x[key] });
      }
    }
  }

  findColors() {
    this.api.LOGO_COLORS({ file_name: this.storeLogo }).subscribe(result => {
      this.ngOnInit();
      if(result.status) {
        let filteredList = new Set(result.colors);
        this.colorList = Array.from(filteredList);
        if(this.colorList.length) {
          if(this.commonService.deploy_details.theme_colors) {
            this.colorFields.forEach(element => {
              let existColorCode = this.commonService.deploy_details.theme_colors[element.keyword];
              element.color_code = existColorCode;
              if(this.colorList.indexOf(existColorCode)==-1) element.manual_status = true;
            });
          }
          else {
            this.colorFields.forEach(element => {
              element.color_code = this.colorList[0];
            });
          }
        }
      }
      else console.log("response", result);
    });
  }

  uploadLogo() {
    this.logoForm.submit = true; this.colorList = [];
    this.logoForm.store_id = this.commonService.store_details._id;
    this.api.UPDATE_STORE_LOGO(this.logoForm).subscribe(result => {
      this.commonService.verNum = new Date().valueOf();
      this.updateDeployStatus();
      this.ngOnInit();
      if(result.status) this.colorList = result.colors;
      else {
				this.logoForm.errorMsg = result.message;
				console.log("response", result);
			}
    });
  }

  updateThemeColor() {
    let colorForm = {};
    this.colorFields.forEach(element => {
      colorForm[element.keyword] = element.color_code;
    });
    this.api.UPDATE_DEPLOY_DETAILS({ store_id: this.commonService.store_details._id, theme_colors: colorForm }).subscribe(result => {
      if(result.status) {
        this.commonService.deploy_details = result.data;
        delete this.commonService.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
        this.ngOnInit();
      }
      else console.log("response", result);
    });
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['logo']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.logo": true };
      this.api.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
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
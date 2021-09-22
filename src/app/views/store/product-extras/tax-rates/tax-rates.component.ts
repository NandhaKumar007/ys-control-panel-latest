import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { DeploymentService } from '../../deployment/deployment.service';

@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.scss'],
  animations: [SharedAnimations]
})

export class TaxRatesComponent implements OnInit {

  page = 1; pageSize = 10; list: any = [];
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  state_list: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService,
    public commonService: CommonService, private deployApi: DeploymentService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.TAX_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
    // state list
    let index = this.commonService.country_list.findIndex(obj => obj.name==this.commonService.store_details.country);
    if(index!=-1) this.state_list = this.commonService.country_list[index].states;
  }

  onAdd() {
    this.api.ADD_TAX(this.addForm).subscribe(result => {
      this.updateDeployStatus();
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
    this.api.TAX_LIST().subscribe(result => {
			if(result.status) {
        let taxList = result.list;
        let index = taxList.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = taxList[index];
          this.editForm.prev_primary = taxList[index].primary;
          this.modalService.open(modalName, {size: "lg"});
        }
        else console.log("invalid foot note");
      }
      else console.log("response", result);
		});
  }
  
  // UPDATE
  onUpdate() {
		this.api.UPDATE_TAX(this.editForm).subscribe(result => {
      this.updateDeployStatus();
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
    this.api.DELETE_TAX(this.deleteForm).subscribe(result => {
      this.updateDeployStatus();
      if(result.status) {
        document.getElementById('closeModal').click();
				this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['tax_rates']) {
      let formData = { "deploy_stages.tax_rates": true };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

}
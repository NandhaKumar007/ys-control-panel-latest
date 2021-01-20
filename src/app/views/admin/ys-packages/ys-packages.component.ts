import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-packages',
  templateUrl: './ys-packages.component.html',
  styleUrls: ['./ys-packages.component.scss'],
  animations: [SharedAnimations]
})

export class YsPackagesComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; list: any = [];
  packageForm: any; deleteForm: any;
  formType: string; search_bar: string;
  currency_list: any = this.commonService.currency_types;
  featuresList: any = this.commonService.admin_features;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.adminApi.PACKAGE_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.commonService.admin_packages = this.list;
        this.commonService.updateLocalData('admin_packages', this.commonService.admin_packages);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAddModal(modalName) {
    this.formType = 'add';
    this.packageForm = {};
    this.modalService.open(modalName, {size: 'lg'});
    this.currency_list.forEach(element => {
      delete element.amount;
      delete element.transaction_fees;
      delete element.transaction_limit;
    });
  }

  onSubmit() {
    let currencyTypes: any = {};
    this.currency_list.forEach(element => {
      currencyTypes[element.base] = {
        amount: parseFloat(element.amount), transaction_fees: parseFloat(element.transaction_fees),
        transaction_limit: parseFloat(element.transaction_limit)
      };
    });
    if(this.formType=='add') {
      // add
      this.adminApi.ADD_PACKAGE({ name: this.packageForm.name, currency_types: currencyTypes }).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.packageForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      // update
      this.packageForm.trial_features = [];
      this.packageForm.new_feature_list.forEach(obj => {
        if(obj.selected) this.packageForm.trial_features.push(obj.keyword);
      });
      this.packageForm.currency_types = currencyTypes;
      this.adminApi.UPDATE_PACKAGE(this.packageForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.packageForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onEdit(x, modalName) {
    this.formType = 'edit';
    this.packageForm = { _id: x._id, name: x.name, trial_status: x.trial_status, trial_upto_in_days: x.trial_upto_in_days };
    this.currency_list.forEach(element => {
      element.amount = x.currency_types[element.base].amount;
      element.transaction_fees = x.currency_types[element.base].transaction_fees;
      element.transaction_limit = x.currency_types[element.base].transaction_limit;
    });
    this.packageForm.new_feature_list = [];
    this.featuresList.forEach(obj => {
      let index = obj.linked_packages.findIndex(elem => elem.package_id==x._id);
      if(index!=-1 && obj.linked_packages[index].currency_types['INR'].price > 0) {
        let featureSelected = false;
        if(x.trial_features && x.trial_features.indexOf(obj.keyword)!=-1) featureSelected = true;
        this.packageForm.new_feature_list.push({ selected: featureSelected, name: obj.name, keyword: obj.keyword });
      }
    });
    this.modalService.open(modalName, {size: "lg"});
  }

  // DELETE
  onDelete() {
    this.adminApi.DELETE_PACKAGE(this.deleteForm).subscribe(result => {
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
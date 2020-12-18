import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../setup.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-currency-types',
  templateUrl: './currency-types.component.html',
  styleUrls: ['./currency-types.component.scss'],
  animations: [SharedAnimations]
})

export class CurrencyTypesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; currencyList: any = [];
  live_currencies: any = {};
	addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;

	constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.CURRENCY_DETAILS(this.commonService.store_currency.country_code).subscribe(result => {
      this.currencyList = result.currency_list;
      this.live_currencies = result.live_currencies;
      this.getCurrencyList();
    });
  }

  getCurrencyList() {
    this.pageLoader = true;
    this.api.CURRENCY_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list;
        this.list.forEach(element => {
          element.inr_rate = this.live_currencies[element.country_code];
        });
      }
			else console.log("response", result);
			setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
	onAdd() {
    this.addForm.country_code = this.addForm.country.name;
    this.addForm.html_code = this.addForm.country.html_code;
		this.api.ADD_CURRENCY(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.getCurrencyList();
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

	// EDIT
  onEdit(x, modalName) {
    this.api.CURRENCY_LIST().subscribe(result => {
      if(result.status) {
        let index = result.list.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = result.list[index];
          this.modalService.open(modalName);
        }
        else console.log("Invalid currency type");
      }
      else console.log("response", result);
    });
  }

  // UPDATE
	onUpdate() {
		this.api.UPDATE_CURRENCY(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getCurrencyList();
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }
  
  // DELETE
  onDelete() {
    this.api.DELETE_CURRENCY(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getCurrencyList();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}
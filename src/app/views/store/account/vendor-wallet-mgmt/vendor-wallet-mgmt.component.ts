import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-vendor-wallet-mgmt',
  templateUrl: './vendor-wallet-mgmt.component.html',
  styleUrls: ['./vendor-wallet-mgmt.component.scss'],
  animations: [SharedAnimations]
})
export class VendorWalletMgmtComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; filterForm:any = {};
  balance: number = 0;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: AccountService, public commonService: CommonService, public router: Router) { 
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
    this.getList();
  }

  getList() {
    this.pageLoader = true;
    this.api.VENDOR_WALLET_STATEMENT(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.balance = result.balance;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

}

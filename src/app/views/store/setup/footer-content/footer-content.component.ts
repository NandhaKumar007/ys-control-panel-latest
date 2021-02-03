import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { send } from 'q';

@Component({
  selector: 'app-footer-content',
  templateUrl: './footer-content.component.html',
  styleUrls: ['./footer-content.component.scss']
})

export class FooterContentComponent implements OnInit {

  pageLoader: boolean;
  footer_config: any = {};
  editForm: any;
  paymentTypes: any = ["amex", "maestro", "mastercard", "paypal", "paytm", "upi", "visa"];

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.footer_config = result.data.footer_config;
      else console.log("response", result);
    });
  }

  onEditDetails(type, modalName) {
    if(type=='address') this.editForm = { type: type, title: this.footer_config.address_config.title, content: this.footer_config.address_config.content };
    else this.editForm = { type: type, title: this.footer_config.contact_config.title, content: this.footer_config.contact_config.content }
    this.modalService.open(modalName, {size: 'lg'});
  }

  onUpdateDetails() {
    let sendData = {};
    if(this.editForm.type=='address') sendData = { "footer_config.address_config": this.editForm };
    else sendData = { "footer_config.contact_config": this.editForm };
    this.api.UPDATE_STORE_PROPERTY_DETAILS(sendData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.footer_config = result.data.footer_config;
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onEditPayment(modalName) {
    this.editForm = { name: "", payment_methods: [] };
    this.footer_config.payment_methods.forEach(obj => {
      this.editForm.payment_methods.push(obj);
    });
    this.modalService.open(modalName);
  }

  onUpdatePayment() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "footer_config.payment_methods": this.editForm.payment_methods }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.footer_config = result.data.footer_config;
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
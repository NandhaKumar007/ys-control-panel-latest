import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-giftcard-order-details',
  templateUrl: './giftcard-order-details.component.html',
  styleUrls: ['./giftcard-order-details.component.scss']
})

export class GiftcardOrderDetailsComponent implements OnInit {

  imgBaseUrl = environment.img_baseurl;
  pageLoader: boolean;
  params: any = {}; details: any = {};
  editForm: any = {}; mailForm: any = {};
  btnLoader: boolean; invoice_details: any;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router,
    private api: OrderService, private activeRoute: ActivatedRoute, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.api.COUPON_DETAILS({ _id: this.params.coupon_id }).subscribe(result => {
        if(result.status) this.details = result.data;
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onEdit(modalName) {
    this.editForm = {};
    this.api.COUPON_DETAILS({ _id: this.params.coupon_id }).subscribe(result => {
      if(result.status) {
        this.editForm = result.data;
        this.modalService.open(modalName);
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // update
  onUpdate(x) {
    this.api.UPDATE_COUPON_DETAILS(x).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  sendMail() {
    this.btnLoader = true;
    this.mailForm._id = this.details._id;
    this.api.RESEND_COUPON_MAIL(this.mailForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
      }
      else {
        this.mailForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onViewInvoice(modalName) {
    this.invoice_details = this.details;
    let countryInr = this.invoice_details.currency_type.country_inr_value;
    this.invoice_details.temp_price = (this.invoice_details.price/countryInr).toFixed(2);
    this.modalService.open(modalName, { size: 'lg' });
  }

  transformHtml(string) {
    return string.replace(new RegExp('\n', 'g'), "<br />");
  }

  generatePDF() {
    let data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      let docWidth = 190;
      let docHeight = canvas.height*(docWidth/canvas.width);
      let top = 10; let left = 10;
      let contentDataURL = canvas.toDataURL('image/png');
      let doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(contentDataURL, 'PNG', left, top, docWidth, docHeight);
      doc.save(this.invoice_details.order_number+'.pdf');
    });
  }

}
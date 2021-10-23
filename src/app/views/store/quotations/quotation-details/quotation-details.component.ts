import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../quotation.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss']
})

export class QuotationDetailsComponent implements OnInit {

  params: any = {}; order_details: any = {}; courierForm: any;
  custom_model: any = {}; customNext: boolean;
  imgBaseUrl = environment.img_baseurl; updateErrorMsg: string;
  btnLoader: boolean; mailForm: any;
  errorMsg: string; pageLoader: boolean;
  editForm: any = {}; itemIndex: number;
  country_list: any = this.commonService.country_list; state_list: any = [];
  addressType: string; addressForm: any = {};
  customizationForm: any; mmIndex: number;
  custom_list: any = []; customIndex: number;
  existing_custom_list = []; selected_custom_list = [];
  invoice_details: any; invoice_order_list: any;
  quotForm: any = {};

  constructor(
    private http: HttpClient, config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private router: Router, private api: QuotationService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.courierForm = {};
      this.pageLoader = true; this.btnLoader = false; this.errorMsg = null;
      this.api.QUOTATION_DETAILS(this.params.quot_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          this.order_details.existing_status = this.order_details.quot_status;
          if(this.order_details.existing_status=='placed') this.order_details.quot_status='confirmed';
          if(this.order_details.existing_status=='confirmed') this.order_details.quot_status='dispatched';
          if(this.order_details.existing_status=='dispatched') this.order_details.quot_status='delivered';
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }
  
  onSendQuotation(x) {
    this.api.SEND_QUOTATION(x).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(["/quotations/live/"+this.params.customer_id]);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onConfirmOrder() {
    this.btnLoader = true;
    this.api.CONFIRM_QUOTATION({ _id: this.order_details._id }).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(["/quotations/confirmed/"+this.params.customer_id]);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // cancel order
  onCancelOrder() {
    this.btnLoader = true;
    this.api.CANCEL_QUOTATION({ _id: this.order_details._id }).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(["/quotations/cancelled/"+this.params.customer_id]);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onEdit(type, modalName) {
    this.api.QUOTATION_DETAILS(this.params.quot_id).subscribe(result => {
      if(result.status) {
        if(type=='address') {
          this.addressForm = result.data.company_address;
          this.onCountryChange(this.addressForm.country);
          this.modalService.open(modalName, { size: 'lg'});
        }
        else if(type=='product') {
          this.editForm = result.data;
          this.modalService.open(modalName, { size: 'lg'});
        }
        else {
          this.editForm = result.data;
          this.modalService.open(modalName);
        }
      }
      else console.log("response", result);
    });
  }

  // update
  onUpdateProduct() {
    this.editForm.final_price = 0;
    this.editForm.item_list.forEach((product) => {
      this.editForm.final_price += (product.final_price * product.quantity);
      if(product.unit!="Pcs") this.editForm.final_price += product.addon_price;
    });
    let formData = { _id: this.editForm._id, item_list: this.editForm.item_list, final_price: this.editForm.final_price };
    this.api.UPDATE_QUOTATION_DETAILS(formData).subscribe(result => {
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
  onUpdate(x) {
    this.api.UPDATE_QUOTATION_DETAILS(x).subscribe(result => {
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
  onUpdateAddress() {
    let formData: any = { _id: this.order_details._id, company_address: this.addressForm };
    this.api.UPDATE_QUOTATION_DETAILS(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.addressForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.state_list = this.country_list[index].states;
      this.addressForm.dial_code = this.country_list[index].dial_code;
    }
  }

  // INVOICE
  onViewInvoice(modalName) {
    // this.invoice_details = this.order_details;
    // this.invoice_order_list = [];
    // this.processItemList(this.invoice_details.item_list).then((respData) => {
    //   this.invoice_order_list = respData;
    // });
    // this.modalService.open(modalName, { size: 'lg' });
  }

  processItemList(itemList) {
    return new Promise((resolve, reject) => {
      let orderList: any = [];
      for(let item of itemList)
      {
        let itemFinalPrice = item.final_price * item.quantity;
        if(item.unit!="Pcs") { itemFinalPrice += item.addon_price; }
        let taxIndex = orderList.findIndex(obj => obj.taxrate_id==item.taxrate_id);
        if(taxIndex!=-1) {
          orderList[taxIndex].item_list.push(item);
          orderList[taxIndex].sub_total += itemFinalPrice;
        }
        else {
          orderList.push({ taxrate_id: item.taxrate_id, tax_details: item.tax_details, item_list: [item], sub_total: itemFinalPrice });
        }
      }
      resolve(orderList);
    });
  }

  findBaseAmount(amount, taxDetails) {
    if(taxDetails) {
      if(this.invoice_details.billing_address.country==taxDetails.home_country && this.invoice_details.billing_address.state==taxDetails.home_state) {
        let totalPercentage = 100+parseFloat(taxDetails.sgst)+parseFloat(taxDetails.cgst);
        let onePercentAmount = amount/totalPercentage;
        return (onePercentAmount*100);
      }
      else {
        let totalPercentage = 100+parseFloat(taxDetails.igst);
        let onePercentAmount = amount/totalPercentage;
        return (onePercentAmount*100);
      }
    }
    else return amount;
  }

  findTaxAmount(amount, tax, totalTax) {
    let totalPercentage = 100+parseFloat(totalTax);
    let onePercentAmount = amount/totalPercentage;
    return (onePercentAmount*tax);
  }

  transformHtml(string) {
    return string.replace(new RegExp('\n', 'g'), "<br />");
  }

}
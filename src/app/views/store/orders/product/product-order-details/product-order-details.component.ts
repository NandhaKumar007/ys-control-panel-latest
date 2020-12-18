import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../order.service';
import { ProductExtrasApiService } from '../../../product-extras/product-extras-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-order-details',
  templateUrl: './product-order-details.component.html',
  styleUrls: ['./product-order-details.component.scss']
})

export class ProductOrderDetailsComponent implements OnInit {

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
  courier_partners: any; hsncode_exist: boolean;
  country_details: any; address_fields: any = [];
  order_vendor_details: any; selected_vendor: any;
  tax_config: any = { tax: 0 };

  constructor(
    private http: HttpClient, config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private router: Router, private api: OrderService, public commonService: CommonService, public location: Location, private extrasApi: ProductExtrasApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.courierForm = {}; this.hsncode_exist = false; this.selected_vendor = {};
      this.courier_partners = this.commonService.courier_partners;
      this.courier_partners.push({name: "Others"});
      this.pageLoader = true; this.btnLoader = false; this.errorMsg = null;
      // order details
      this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          this.order_details.vendors_confirmed = true;
          if(this.order_details.vendor_list) {
            this.order_details.vendor_list.forEach(element => {
              if(element.status!='confirmed') this.order_details.vendors_confirmed = false;
              element.vendor_name = "NA";
              let vendorIndex = this.commonService.vendor_list.findIndex(obj => obj._id==element.vendor_id);
              if(vendorIndex!=-1) element.vendor_name = this.commonService.vendor_list[vendorIndex].name;
            });
            // vendor login
            if(this.commonService.store_details.login_type=='vendor') {
              let vendorIndex = this.order_details.vendor_list.findIndex(obj => obj.vendor_id==this.commonService.store_details.login_id);
              if(vendorIndex!=-1) this.order_vendor_details = this.order_details.vendor_list[vendorIndex];
            }
          }
          this.order_details.existing_status = this.order_details.order_status;
          if(this.order_details.existing_status=='placed') this.order_details.order_status='confirmed';
          if(this.order_details.existing_status=='confirmed') this.order_details.order_status='dispatched';
          if(this.order_details.existing_status=='dispatched') this.order_details.order_status='delivered';
          // address
          if(this.order_details.shipping_address) {
            this.onGetAddrDetails(this.order_details.shipping_address);
          }
          if(this.order_details.billing_address) {
            this.onGetAddrDetails(this.order_details.billing_address);
          }
          // tax details
          if(this.commonService.store_details.tax_config) {
            this.tax_config = this.commonService.store_details.tax_config;
            this.tax_config.tax = 0;
            if(this.order_details.billing_address.country==this.commonService.store_details.country) {
              if(this.tax_config.domestic_states && this.tax_config.domestic_states.length) {
                if(this.tax_config.domestic_states.indexOf(this.order_details.billing_address.state) != -1) {
                  // domestic
                  if(this.tax_config.domestic_tax) this.tax_config.tax = this.tax_config.domestic_tax;
                }
                else {
                  // international
                  if(this.tax_config.international_tax) this.tax_config.tax = this.tax_config.international_tax;
                }
              }
              else {
                // domestic
                if(this.tax_config.domestic_tax) this.tax_config.tax = this.tax_config.domestic_tax;
              }
            }
            else {
              // international
              if(this.tax_config.international_tax) this.tax_config.tax = this.tax_config.international_tax;
            }
          }
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onVendorOrderConfirm() {
    this.btnLoader = true;
    let vendorId = this.selected_vendor.vendor_id;
    if(this.commonService.store_details.login_type=='vendor') vendorId = this.commonService.store_details.login_id;
    this.api.VENDOR_ORDER_CONFIRM({ _id: this.order_details._id, vendor_id: vendorId }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        if(this.commonService.store_details.login_type=='vendor') this.location.back();
        else this.ngOnInit();
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onGetAddrDetails(address) {
    address.address_fields = [];
    let index = this.country_list.findIndex(object => object.name==address.country);
    if(index!=-1) {
      this.country_list[index].address_fields.forEach(element => {
        if(address[element.keyword]) address.address_fields.push({ label: element.label, value: address[element.keyword] });
      });
    }
  }

  // courier partner
  setCourierPartner(x) {
    let cpIndex = this.courier_partners.findIndex(obj => obj.name==x.name);
    if(x.name=='Delhivery') {
      let delhiveryMetadata = this.courier_partners[cpIndex].metadata;
      let orderedItems = this.order_details.item_list.map(function (obj) { return obj.name; }).join(', ');
      orderedItems = orderedItems.replace(/[^a-zA-Z0-9, ]/g, "");
      orderedItems = orderedItems.replace(/ +(?= )/g, "");
      let paymentMode = "COD";
      let contactNo = this.order_details.shipping_address.mobile;
      if(this.order_details.payment_success) paymentMode = "Prepaid";
      if(this.order_details.shipping_address.dial_code) contactNo = this.order_details.shipping_address.dial_code+' '+contactNo;
      let orderData: any = {
        shipments: [{ add: this.order_details.shipping_address.address, phone: contactNo,
          payment_mode: paymentMode, name: this.order_details.shipping_address.name,
          pin: this.order_details.shipping_address.pincode, order: this.order_details.order_number,
          seller_name: delhiveryMetadata.seller_name, seller_add: delhiveryMetadata.seller_addr,
          total_amount: this.order_details.final_price, products_desc: orderedItems
        }]
      };
      if(paymentMode=="COD") orderData.shipments[0].cod_amount = this.order_details.final_price;
      // return address
      if(delhiveryMetadata.return_addr) orderData.shipments[0].return_add = delhiveryMetadata.return_addr;
      if(delhiveryMetadata.return_city) orderData.shipments[0].return_city = delhiveryMetadata.return_city;
      if(delhiveryMetadata.return_state) orderData.shipments[0].return_state = delhiveryMetadata.return_state;
      if(delhiveryMetadata.return_pincode) orderData.shipments[0].return_pin = delhiveryMetadata.return_pincode;
      let stringfyOrderData = JSON.stringify(orderData).replace(/&/g, ",");
      this.api.DELHIVERY_CREATE_ORDER({ _id: this.order_details._id, form_data: "format=json&data="+stringfyOrderData }).subscribe(result => {
        if(result.status) this.ngOnInit();
        else {
          this.courierForm.btnLoader = false;
          this.courierForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else if(x.name=='Others') {
      let sendData = {
        _id: this.order_details._id, cp_status: true, "shipping_method.name": this.courierForm.name,
        "shipping_method.tracking_number": this.courierForm.tracking_number, "shipping_method.tracking_link": this.courierForm.tracking_link
      };
      this.api.UPDATE_ORDER_DETAILS(sendData).subscribe(result => {
        if(result.status) this.ngOnInit();
        else {
          this.courierForm.btnLoader = false;
          this.courierForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }
  updateCourierDetailsOnly(type, cancelStatus) {
    if(this.order_details.existing_status=='confirmed' && this.order_details.cp_orders.length) {
      if(type=='Delhivery') {
        this.api.DELHIVERY_UPDATE_ORDER({ _id: this.order_details._id, cancellation: cancelStatus }).subscribe(result => { });
      }
    }
  }
  cancelCourierPartner(type) {
    this.editForm.btnLoader = true;
    if(type=='Delhivery') {
      this.api.DELHIVERY_UPDATE_ORDER({ _id: this.order_details._id, cancellation: true }).subscribe(result => {
        this.editForm.btnLoader = false;
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
    else {
      let sendData = { _id: this.order_details._id, cp_status: false, "shipping_method.name": "", "shipping_method.tracking_number": "", "shipping_method.tracking_link": "" };
      this.api.UPDATE_ORDER_DETAILS(sendData).subscribe(result => {
        this.editForm.btnLoader = false;
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
  }

  // Update order status
  updateOrderStatus() {
    this.btnLoader = true;
    let sendData = {
      _id: this.order_details._id,
      shipping_method: this.order_details.shipping_method,
      order_status: this.order_details.order_status
    }
    this.api.UPDATE_ORDER_STATUS(sendData).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        if(this.order_details.order_status=='delivered') this.router.navigate(["/orders/product/delivered/"+this.params.customer_id]);
        else this.location.back();
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
    this.api.CANCEL_ORDER({ _id: this.order_details._id }).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        this.updateCourierDetailsOnly(this.order_details.shipping_method.name, true);
        document.getElementById('closeModal').click();
        this.router.navigate(["/orders/cancelled/"+this.params.customer_id]);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onEdit(type, modalName) {
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if(result.status) {
        if(type=='address') {
          this.addressForm = result.data.shipping_address;
          if(this.addressType=='billing') this.addressForm = result.data.billing_address;
          this.onCountryChange(this.addressForm.country);
          this.address_fields.forEach(element => {
            element.value = this.addressForm[element.keyword];
          });
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
  onEditMeasurement(modalName) {
    this.updateErrorMsg = null;
    this.mmIndex = 0;
    this.customizationForm = {};
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if(result.status) {
        this.customizationForm = result.data.item_list[this.itemIndex].customized_model;
        this.modalService.open(modalName);
      }
      else {
        this.updateErrorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onEditCustomization(customization, modalName) {
    this.updateErrorMsg = null;
    this.customizationForm = customization;
    this.existing_custom_list = customization.custom_list;
    this.extrasApi.ADDON_DETAILS(this.order_details.item_list[this.itemIndex].selected_addon._id).subscribe(result => {
      if(result.status) {
        this.customIndex = 0;
        this.custom_list = result.data.custom_list;
        this.selected_custom_list = [];
        this.onSelectOption(this.existing_custom_list[this.customIndex].value);
        this.modalService.open(modalName, { size: 'lg'});
      }
      else {
        this.updateErrorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateShippingDetails() {
    this.editForm.shipping_cost = this.editForm.shipping_method.shipping_price;
    this.editForm.grand_total = parseFloat(this.editForm.sub_total)+parseFloat(this.editForm.shipping_cost);
    if(this.editForm.grand_total > this.editForm.discount_amount)
      this.editForm.final_price = parseFloat(this.editForm.grand_total)-parseFloat(this.editForm.discount_amount);
    else this.editForm.final_price = 0;
    let sendData = {
      _id: this.order_details._id, shipping_method: this.editForm.shipping_method, shipping_cost: this.editForm.shipping_cost,
      grand_total: this.editForm.grand_total, final_price: this.editForm.final_price
    }
    this.onUpdate(sendData);
  }
  onUpdateAddress() {
    this.address_fields.forEach(element => {
      if(element.value) this.addressForm[element.keyword] = element.value;
    });
    let formData: any = {_id: this.order_details._id, shipping_address: this.addressForm };
    if(this.addressType=='billing') formData = {_id: this.order_details._id, billing_address: this.addressForm };
    // this.onUpdate(formData);
    this.api.UPDATE_ORDER_DETAILS(formData).subscribe(result => {
      if(result.status) {
        if(this.addressType=='shipping') {
          this.updateCourierDetailsOnly(this.order_details.shipping_method.name, false);
        }
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.addressForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onUpdateCustomization() {
    let reqInput = this.validateForm();
    if(reqInput===undefined) {
      this.customizationForm.custom_list = this.selected_custom_list;
      let fieldName = "item_list."+this.itemIndex+".customized_model";
      let formData: any = { _id: this.order_details._id, [fieldName]: this.customizationForm };
      this.onUpdate(formData);
    }
    else document.getElementById(reqInput).focus();
  }
  onUpdateMeasurement() {
    let reqInput = this.validateForm();
    if(reqInput===undefined) {
      let fieldName = "item_list."+this.itemIndex+".customized_model";
      let formData: any = { _id: this.order_details._id, [fieldName]: this.customizationForm };
      this.onUpdate(formData);
    }
    else document.getElementById(reqInput).focus();
  }

  onViewInvoice(modalName) {
    this.invoice_details = this.order_details;
    if(this.tax_config.tax > 0) {
      let totalPercentage = 100+parseFloat(this.tax_config.tax);
      let onePercentAmount = this.invoice_details.sub_total/totalPercentage;
      this.invoice_details.sub_total_wo_tax = onePercentAmount*100;
      this.invoice_details.tax_amount = onePercentAmount*this.tax_config.tax;
    }
    this.invoice_order_list = [];
    this.processItemList(this.invoice_details.item_list).then((respData) => {
      this.invoice_order_list = respData;
    });
    this.modalService.open(modalName, { size: 'lg' });
  }

  // update
  onUpdate(x) {
    this.api.UPDATE_ORDER_DETAILS(x).subscribe(result => {
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

  onResendMail(modalName) {
    this.errorMsg=null; this.btnLoader=false;
    let customStatus = false;
    let index = this.order_details.item_list.findIndex(object => object.customization_status);
    if(index!=-1) customStatus = true;
    let customerEmail = "";
    if(this.order_details.order_by=='guest') customerEmail = this.order_details.guest_email;
    else customerEmail = this.order_details.customerDetails[0].email;
    this.mailForm = { email: customerEmail, custom_status: customStatus };
    this.modalService.open(modalName);
  }

  sendMail() {
    this.btnLoader = true;
    this.mailForm._id = this.order_details._id;
    this.api.RESEND_ORDER_MAIL(this.mailForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // add-on functions
  onMmNext() {
    let reqInput = this.validateForm();
    if(reqInput===undefined) this.mmIndex = this.mmIndex+1;
    else document.getElementById(reqInput).focus();
  }

  onCustomNext() {
    let reqInput = this.validateForm();
    if(reqInput===undefined) {
      this.customIndex = this.customIndex+1;
      let initialCustomOption = this.existing_custom_list[this.customIndex].value;
      if(this.selected_custom_list[this.customIndex]) {
        initialCustomOption = this.selected_custom_list[this.customIndex].value;
      }
      this.onSelectOption(initialCustomOption);
    }
    else document.getElementById(reqInput).focus();
  }

  onSelectOption(x) {
    let selectedCustom = this.custom_list[this.customIndex];
    this.selected_custom_list[this.customIndex] = { name: selectedCustom.name, value: x };
  }

  onSelectCheckbox(x) {
    let index = this.selected_custom_list[this.customIndex].value.findIndex(obj => obj.name == x.name);
    if(index != -1) this.selected_custom_list[this.customIndex].value.splice(index, 1);
    else this.selected_custom_list[this.customIndex].value.push(x);
  }
  
  checkboxStatus(x) {
    if(this.selected_custom_list[this.customIndex].value.findIndex(obj => obj.name == x.name) != -1) return true;
  }

  validateForm() {
    let form: any = document.getElementById('addon-form');
    for(let i=0; i < form.elements.length; i++) {
      if(form.elements[i].value === '' && form.elements[i].hasAttribute('required')) return form.elements[i].id;
    }
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.country_details = this.country_list[index];
      this.state_list = this.country_details.states;
      this.addressForm.dial_code = this.country_details.dial_code;
      this.address_fields = this.country_details.address_fields;
    }
  }

  onChangeUnit() {
    if(this.customizationForm.mm_unit=='cms') {
      // convert inch -> cm
      this.customizationForm.mm_sets.forEach(set => {
        set.list.forEach(element => {
          if(element.value) element.value = (element.value*2.54).toFixed(1);
        });
      });
    }
    else {
      // convert cm -> inch
      this.customizationForm.mm_sets.forEach(set => {
        set.list.forEach(element => {
          if(element.value) element.value = (element.value*0.393701).toFixed(1);
        });
      });
    }
  }

  processItemList(itemList) {
    return new Promise((resolve, reject) => {
      let orderList: any = [];
      for(let item of itemList)
      {
        if(item.hsn_code) this.hsncode_exist = true;
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
    else if(this.tax_config.tax > 0) {
      let totalPercentage = 100+parseFloat(this.tax_config.tax);
      let onePercentAmount = amount/totalPercentage;
      return (onePercentAmount*100);
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
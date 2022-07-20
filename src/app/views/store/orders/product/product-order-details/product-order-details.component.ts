import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../order.service';
import { AccountService } from '../../../account/account.service';
import { CustomerApiService } from '../../../../../services/customer-api.service';
import { ProductExtrasApiService } from '../../../product-extras/product-extras-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';
import ghanaDomesDestinations from '../../../../../../assets/json/ghana-domes-destinations.json';
import ghanaInterDestinations from '../../../../../../assets/json/ghana-inter-destinations.json';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-product-order-details',
  templateUrl: './product-order-details.component.html',
  styleUrls: ['./product-order-details.component.scss']
})

export class ProductOrderDetailsComponent implements OnInit {

  params: any = {}; order_details: any = {}; courierForm: any;
  customNext: boolean; configData: any= environment.config_data;
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
  hsncode_exist: boolean; cpForm: any = {};
  country_details: any; address_fields: any = [];
  vendorInfo: any = {}; selected_vendor: any;
  tax_config: any = { tax: 0 }; itemList: any = [];
  groupForm: any; remaining_items: any = [];
  courierData: any = {}; itemInfo: any = {};
  tax_rates: any = []; addedCourier: any = { name: 'Others' };
  slip_details: any = {}; vendorDetails: any = {};
  // temp
  destList: any = []; selectedVendor: any;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute, private accApi: AccountService,
    private router: Router, private api: OrderService, public commonService: CommonService, private extrasApi: ProductExtrasApiService,
    private customerApi: CustomerApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.courierForm = {}; this.hsncode_exist = false; this.selected_vendor = {};
      this.remaining_items = []; this.pageLoader = true; this.btnLoader = false; this.errorMsg = null;
      // order details
      this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          if(this.params.type=='inactive' && this.order_details.status!='inactive') this.commonService.goBack();
          if(!this.order_details.vendor_list?.length) {
            if(this.params.type=='live') {
              if(this.order_details.order_status=='delivered' || this.order_details.order_status=='cancelled')
                this.commonService.goBack();
            }
            else {
              if(this.params.type!='inactive' && this.order_details.order_status!=this.params.type)
                this.commonService.goBack();
            }
          }
          // item list
          if(this.commonService.store_details._id==environment.config_data.uru_id) {
            this.processItemListExcludeTax(this.order_details.item_list).then((respData) => {
              this.itemList = respData;
            });
          }
          else this.itemList = this.order_details.item_list;
          // address
          if(!this.order_details.billing_address) this.order_details.billing_address = this.order_details.shipping_address;
          if(this.order_details.shipping_address) {
            this.onGetAddrDetails(this.order_details.shipping_address);
            this.destList = ghanaInterDestinations;
            if(this.commonService.store_details?.country==this.order_details.shipping_address?.country) {
              this.destList = ghanaDomesDestinations;
            }
          }
          if(this.order_details.billing_address) this.onGetAddrDetails(this.order_details.billing_address);
          // order status
          this.order_details.existing_status = this.order_details.order_status;
          if(this.order_details.existing_status=='placed') this.order_details.order_status='confirmed';
          if(this.order_details.existing_status=='confirmed') {
            if(this.order_details.item_groups.length) this.order_details.order_status='delivered';
            else this.order_details.order_status='dispatched';
          }
          if(this.order_details.existing_status=='dispatched') this.order_details.order_status='delivered';
          // shipping info
          if(this.order_details.order_type!='pickup') {
            if(this.order_details.vendor_list?.length) {
              this.order_details.vendor_list.forEach(ven => {
                let shipIndex = this.commonService.shipping_list.findIndex(obj => obj._id==ven.shipping_method._id);
                if(shipIndex!=-1) ven.shipping_info = this.commonService.shipping_list[shipIndex];
              });
            }
            else {
              let shipIndex = this.commonService.shipping_list.findIndex(obj => obj._id==this.order_details.shipping_method._id);
              if(shipIndex!=-1) this.order_details.shipping_info = this.commonService.shipping_list[shipIndex];
            }
          }
          // vendor orders
          if(this.order_details.vendor_list?.length) {
            if(this.params.type=='live') {
              this.order_details.vendor_list = this.order_details.vendor_list.filter(el => el.order_status!='delivered' && el.order_status!='cancelled');
            }
            else if(this.params.type=='delivered' || this.params.type=='cancelled') {
              this.order_details.vendor_list = this.order_details.vendor_list.filter(el => el.order_status==this.params.type);
            }
            if(!this.order_details.vendor_list?.length) this.commonService.goBack();
            if(this.commonService.store_details.login_type!='vendor') {
              this.order_details.vendor_list.forEach(element => {
                element.courierForm = {};
                element.existing_status = element.order_status;
                if(element.existing_status=='placed') element.order_status='confirmed';
                if(element.existing_status=='confirmed') element.order_status='dispatched';
                if(element.existing_status=='dispatched') element.order_status='delivered';
                element.vendor_name = "NA";
                let vendorIndex = this.commonService.vendor_list.findIndex(obj => obj._id==element.vendor_id);
                if(vendorIndex!=-1) element.vendor_name = this.commonService.vendor_list[vendorIndex].company_details.brand;
              });
            }
            // vendor login
            if(this.commonService.store_details.login_type=='vendor') {
              let vendorIndex = this.order_details.vendor_list.findIndex(obj => obj.vendor_id==this.commonService.vendor_details?._id);
              if(vendorIndex!=-1) {
                this.vendorInfo = this.order_details.vendor_list[vendorIndex];
                this.vendorInfo.existing_status = this.vendorInfo.order_status;
                if(this.vendorInfo.existing_status=='placed') this.vendorInfo.order_status='confirmed';
                if(this.vendorInfo.existing_status=='confirmed') this.vendorInfo.order_status='dispatched';
                if(this.vendorInfo.existing_status=='dispatched') this.vendorInfo.order_status='delivered';
              }
            }
          }
          // partial fulfillment
          else if(this.order_details.order_type=='delivery' && this.commonService.ys_features.indexOf('partial_fulfillment')!=-1) {
            let itemIndexList = [];
            this.order_details.item_groups.forEach(obj => {
              itemIndexList = itemIndexList.concat(obj.items);
              obj.item_list = [];
              obj.items.forEach(index => {
                obj.item_list.push(this.order_details.item_list[index]);
              });
            });
            // find items not in group
            this.order_details.item_list.forEach((elem, index) => {
              if(itemIndexList.indexOf(index)==-1) {
                elem.prod_index = index;
                this.remaining_items.push(elem);
              }
            });
            if(this.commonService.store_details._id==environment.config_data.uru_id) {
              this.processItemListExcludeTax(this.remaining_items).then((respData) => {
                this.itemList = respData;
              });
            }
            else this.itemList = this.remaining_items;
          }
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  processItemListExcludeTax(itemList) {
    let countryInr = this.order_details.currency_type.country_inr_value;
    return new Promise((resolve, reject) => {
      let newItemList: any = [];
      for(let item of itemList)
      {
        let itemData: any = {};
        for(let key in item) {
          if(item.hasOwnProperty(key)) itemData[key] = item[key];
        }
        itemData.final_price = Math.round(this.findBaseAmount(item.final_price, item.tax_details)/countryInr);
        itemData.addon_price = Math.round(this.findBaseAmount(item.addon_price, item.tax_details)/countryInr);
        newItemList.push(itemData);
      }
      resolve(newItemList);
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
  createCpOrder(vendorId, formData) {
    formData.submit = true;
    formData.order_id = this.order_details._id;
    if(vendorId) formData.vendor_id = vendorId;
    this.api.CREATE_CP_ORDER(formData).subscribe(result => {
      formData.submit = false;
      if(result.status) this.ngOnInit();
      else {
        formData.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  getCpOrderDetails(modalName) {
    this.api.CP_ORDER_DETAILS(this.courierForm.type, this.courierForm.wbn, this.courierForm.vendor_id).subscribe(result => {
      if(result.status) {
        this.slip_details = result.data.packages[0];
        this.slip_details.order_number = this.courierForm.order_number;
        this.slip_details.product_list = this.slip_details.prd.split(',');
        this.slip_details.seller_name = this.commonService.store_details?.name;
        this.slip_details.seller_addr = this.commonService.store_details?.company_details?.address;
        if(result.vendor_details) {
          this.slip_details.seller_name = result.vendor_details.company_details?.name;
          this.slip_details.seller_addr = result.vendor_details.pickup_address?.address;
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  cancelCpOrder() {
    this.courierForm.submit = true;
    this.courierForm.order_id = this.order_details._id;
    this.api.CANCEL_CP_ORDER(this.courierForm).subscribe(result => {
      this.courierForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.courierForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onCreateGhanaAWB() {
    this.cpForm.submit = true;
    this.api.GHANA_CREATE_ORDER({ _id: this.order_details._id, vendor_id: this.selectedVendor.vendor_id, destination: this.cpForm.destination, description: this.cpForm.description }).subscribe(result => {
      this.cpForm.submit = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
        this.cpForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  

  cancelVendorOrder(x, modalName) {
    this.errorMsg = null;
    this.btnLoader = false;
    this.vendorInfo = x;
    delete this.vendorInfo.errorMsg;
    this.vendorInfo.item_list = this.itemList.filter(obj => obj.vendor_id==x.vendor_id);
    this.vendorInfo.item_list.forEach(obj => { delete obj.item_checked; });
    delete this.vendorInfo.cancel_reason;
    this.modalService.open(modalName, {size: 'lg'});
  }

  // Update order status
  updateOrderStatus() {
    this.btnLoader = true;
    if(this.commonService.store_details.login_type=='vendor') {
      let sendData = {
        _id: this.order_details._id,
        vendor_id: this.vendorInfo.vendor_id,
        shipping_method: this.vendorInfo.shipping_method,
        order_status: this.vendorInfo.order_status
      }
      this.updateVendorOrderStatus(sendData);
    }
    else {
      let sendData: any = {
        _id: this.order_details._id,
        shipping_method: this.order_details.shipping_method,
        order_status: this.order_details.order_status
      };
      if(this.vendorInfo?.vendor_id) {
        sendData.vendor_id = this.vendorInfo.vendor_id;
        sendData.shipping_method = this.vendorInfo.shipping_method;
        sendData.order_status = this.vendorInfo.order_status;
      }
      this.api.UPDATE_ORDER_STATUS(sendData).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          if(result.order_completed) {
            if(this.commonService.ys_features.indexOf('product_reviews')!=-1) {
              this.btnLoader = true; let customerEmail = "";
              if(this.order_details.order_by=='guest') customerEmail = this.order_details.guest_email;
              else customerEmail = this.order_details.customerDetails[0].email;
              this.api.RESEND_ORDER_MAIL({ _id: this.order_details._id, type: 'review', email: customerEmail }).subscribe(result => {
                this.btnLoader = false;
                if(result.status) {
                  document.getElementById('closeModal').click();
                  this.router.navigate(["/orders/product/delivered/"+this.params.customer_id]);
                }
                else {
                  this.errorMsg = result.message;
                  console.log("response", result);
                }
              });
            }
            else {
              document.getElementById('closeModal').click();
              this.router.navigate(["/orders/product/delivered/"+this.params.customer_id]);
            }
          }
          else {
            document.getElementById('closeModal').click();
            this.commonService.goBack();
          }
        }
        else {
          this.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }
  // for vendor login
  updateVendorOrderStatus(formData) {
    this.api.UPDATE_ORDER_STATUS(formData).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        if(formData.order_status=='delivered') {
          document.getElementById('closeModal').click();
          this.router.navigate(["/orders/product/delivered/"+this.params.customer_id]);
        }
        else {
          document.getElementById('closeModal').click();
          this.commonService.goBack();
        }
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // mark as paid
  onMarkPaid() {
    this.btnLoader = true; delete this.errorMsg;
    this.api.UPDATE_ORDER_DETAILS({ _id: this.order_details._id, payment_success: true }).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
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
        document.getElementById('closeModal').click();
        this.router.navigate(["/orders/product/cancelled/"+this.params.customer_id]);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onCancelVendorOrder() {
    let formData: any = {
      _id: this.order_details._id, vendor_id: this.vendorInfo.vendor_id,
      selected_items: [], type: this.vendorInfo.request_type
    };
    this.vendorInfo.item_list.forEach(obj => {
      if(obj.item_checked) formData.selected_items.push(obj._id);
    });
    if(this.vendorInfo.cancel_reason) formData.cancel_reason = this.vendorInfo.cancel_reason;
    if(formData.selected_items.length) {
      this.btnLoader = true;
      this.api.CANCEL_ORDER(formData).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          if(document.getElementById('closeConfirmModal')) document.getElementById('closeConfirmModal').click();
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.vendorInfo.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else this.vendorInfo.errorMsg = "Please select minimum one item to proceed";
  }

  onEdit(type, modalName) {
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if(result.status) {
        if(type=='address') {
          this.addressForm = result.data.shipping_address;
          if(this.addressType=='billing') this.addressForm = result.data.billing_address;
          if(this.addressType!='pickup') {
            this.onCountryChange(this.addressForm.country);
            this.address_fields.forEach(element => {
              element.value = this.addressForm[element.keyword];
            });
          }
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
  onEditCustomization(customization, modalName) {
    this.updateErrorMsg = null;
    this.customizationForm = customization;
    this.existing_custom_list = customization.custom_list;
    this.extrasApi.ADDON_DETAILS(this.order_details.item_list[this.itemIndex].selected_addon._id, '').subscribe(result => {
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
  onEditNotes(modalName) {
    this.updateErrorMsg = null;
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
  onEditVendorShipping(vendorId, modalName) {
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if(result.status) {
        let orderData = result.data;
        let vIndex = orderData.vendor_list.findIndex(obj => obj.vendor_id==vendorId);
        if(vIndex != -1) {
          this.editForm = orderData.vendor_list[vIndex];
          this.editForm.formType = 'vendor';
          this.modalService.open(modalName);
        }
        else console.log("Invalid vendor");
      }
      else console.log("response", result);
    });
  }

  onUpdateShippingDetails() {
    if(this.editForm.formType=='vendor') {
      this.editForm._id = this.order_details._id;
      let tempGrandTotal = this.editForm.grand_total - this.editForm.shipping_cost;
      this.editForm.shipping_cost = parseFloat(this.editForm.shipping_method.shipping_price);
      this.editForm.grand_total = tempGrandTotal+this.editForm.shipping_cost;
      this.editForm.final_price = this.editForm.grand_total-parseFloat(this.editForm.discount_amount);
      if(this.editForm.final_price < 0) this.editForm.final_price = 0;
      this.onUpdate(this.editForm);
    }
    else {
      let tempGrandTotal = this.editForm.grand_total - this.editForm.shipping_cost;
      this.editForm.shipping_cost = parseFloat(this.editForm.shipping_method.shipping_price);
      this.editForm.grand_total = tempGrandTotal+this.editForm.shipping_cost;
      this.editForm.final_price = this.editForm.grand_total-parseFloat(this.editForm.discount_amount);
      if(this.editForm.final_price < 0) this.editForm.final_price = 0;
      let sendData = {
        _id: this.order_details._id, shipping_method: this.editForm.shipping_method, shipping_cost: this.editForm.shipping_cost,
        grand_total: this.editForm.grand_total, final_price: this.editForm.final_price
      };
      this.onUpdate(sendData);
    }
  }
  onUpdateAddress() {
    if(this.addressType!='pickup') {
      this.address_fields.forEach(element => {
        if(element.value) this.addressForm[element.keyword] = element.value;
      });
    }
    let formData: any = {_id: this.order_details._id, shipping_address: this.addressForm };
    if(this.addressType=='billing') formData = {_id: this.order_details._id, billing_address: this.addressForm };
    // this.onUpdate(formData);
    this.api.UPDATE_ORDER_DETAILS(formData).subscribe(result => {
      if(result.status) {
        if(this.addressType=='shipping') {
          // update courier details
          let cpIndex = this.order_details.cp_orders.findIndex(obj => obj.status=='active');
          if(this.order_details.existing_status=='confirmed' && cpIndex!=-1) {
            if(this.order_details.cp_orders[cpIndex].name=='Delhivery') {
              this.api.DELHIVERY_UPDATE_ORDER({ _id: this.order_details._id, cancellation: false }).subscribe(result => { });
            }
          }
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
  onUpdateNotes() {
    let reqInput = this.validateForm();
    if(reqInput===undefined) {
      let fieldName = "item_list."+this.itemIndex+".customized_model";
      let formData: any = { _id: this.order_details._id, [fieldName]: this.customizationForm };
      this.onUpdate(formData);
    }
    else document.getElementById(reqInput).focus();
  }

  // order invoice
  onViewInvoice(modalName) {
    this.invoice_details = { loader: true };
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if(result.status) {
        this.invoice_details = result.data;
        this.invoice_details.loader = true;
        if(!this.tax_rates?.length) {
          this.extrasApi.TAX_LIST().subscribe(result => {
            if(result.status) this.tax_rates = result.list;
            this.invoiceCont(modalName);
          });
        }
        else this.invoiceCont(modalName);
      }
      else console.log("response", result);
    });
  }
  // vendor order invoice
  onViewVendorInvoice(vendorInfo, modalName) {
    this.invoice_details = { loader: true };
    this.api.VENDOR_ORDER_DETAILS(vendorInfo.vendor_id, this.params.order_id).subscribe(result => {
      if(result.status) {
        let orderDetails = result.data;
        this.vendorDetails = result.vendor_info;
        let vIndex = orderDetails.vendor_list.findIndex(obj => obj.vendor_id==vendorInfo.vendor_id);
        if(vIndex!=-1) {
          setTimeout(() => { this.pageLoader = false; }, 500);
          this.invoice_details = orderDetails.vendor_list[vIndex];
          this.invoice_details.loader = true;
          this.invoice_details._id = orderDetails._id;
          this.invoice_details.created_on = orderDetails.created_on;
          this.invoice_details.currency_type = orderDetails.currency_type;
          this.invoice_details.payment_details = orderDetails.payment_details;
          this.invoice_details.billing_address = orderDetails.billing_address;
          this.invoice_details.shipping_address = orderDetails.shipping_address;
          this.invoice_details.item_list = orderDetails.item_list.filter(obj => obj.vendor_id==vendorInfo.vendor_id);
          if(!this.tax_rates?.length) {
            this.extrasApi.TAX_LIST().subscribe(result => {
              if(result.status) this.tax_rates = result.list;
              this.invoiceCont(modalName);
            });
          }
          else this.invoiceCont(modalName);
        }
        else console.log("Invalid order");
      }
      else console.log("response", result);
    });
  }
  invoiceCont(modalName) {
    delete this.invoice_details.loader;
    this.invoice_order_list = [];
    if(this.invoice_details.order_type=='pickup') this.invoice_details.billing_address = this.invoice_details.shipping_address;
    let countryInr = this.invoice_details.currency_type.country_inr_value;
    this.invoice_details.sub_total = (this.invoice_details.sub_total/countryInr).toFixed(2);
    this.invoice_details.gift_wrapper = (this.invoice_details.gift_wrapper/countryInr).toFixed(2);
    this.invoice_details.packaging_charges = (this.invoice_details.packaging_charges/countryInr).toFixed(2);
    this.invoice_details.shipping_cost = (this.invoice_details.shipping_cost/countryInr).toFixed(2);
    this.invoice_details.cod_charges = (this.invoice_details.cod_charges/countryInr).toFixed(2);
    this.invoice_details.discount_amount = (this.invoice_details.discount_amount/countryInr).toFixed(2);
    this.invoice_details.final_price = (this.invoice_details.final_price/countryInr).toFixed(2);
    this.processItemList(this.invoice_details.item_list, countryInr).then((respData) => {
      this.invoice_order_list = respData;
      for(let set of this.invoice_order_list) {
        if(set.tax_details) {
          set.temp_sub_total = (this.findBaseAmount(set.sub_total, set.tax_details)/countryInr).toFixed(2);
          set.temp_igst = (this.findTaxAmount( set.sub_total, set.tax_details.igst, set.tax_details.igst )/countryInr).toFixed(2);
          if(set.tax_details.sgst) set.temp_sgst = (this.findTaxAmount( set.sub_total, set.tax_details.sgst, ((set.tax_details.sgst*1)+(set.tax_details.cgst*1)) )/countryInr).toFixed(2);
          if(set.tax_details.cgst) set.temp_cgst = (this.findTaxAmount( set.sub_total, set.tax_details.cgst, ((set.tax_details.sgst*1)+(set.tax_details.cgst*1)) )/countryInr).toFixed(2);
        }
      }
      this.modalService.open(modalName, { size: 'lg' });
    });
  }

  processItemList(itemList, countryInr) {
    return new Promise((resolve, reject) => {
      let orderList: any = [];
      for(let item of itemList)
      {
        let itemFinalPrice = item.final_price * item.quantity;
        if(item.unit!="Pcs") { itemFinalPrice += item.addon_price; }
        // get tax info
        delete item.tax_details;
        let trIndex = this.tax_rates.findIndex(obj => obj._id==item.taxrate_id);
        if(trIndex!=-1) item.tax_details = this.tax_rates[trIndex];
        if(item.taxrate_id && item.tax_details) {
          // find tax exists in order list
          let taxIndex = orderList.findIndex(obj => obj.taxrate_id==item.taxrate_id);
          if(taxIndex!=-1) {
            let itemBaseAmt = this.findBaseAmount(itemFinalPrice, orderList[taxIndex].tax_details);
            item.temp_final_price = (itemBaseAmt/countryInr).toFixed(2);
            orderList[taxIndex].item_list.push(item);
            orderList[taxIndex].sub_total += itemFinalPrice;
          }
          else {
            let itemBaseAmt = this.findBaseAmount(itemFinalPrice, item.tax_details);
            item.temp_final_price = (itemBaseAmt/countryInr).toFixed(2);
            orderList.push({ taxrate_id: item.taxrate_id, tax_details: item.tax_details, item_list: [item], sub_total: itemFinalPrice });
          }
        }
        else {
          let itemBaseAmt = this.findBaseAmount(itemFinalPrice, null);
          item.temp_final_price = (itemBaseAmt/countryInr).toFixed(2);
          orderList.push({ item_list: [item], sub_total: itemFinalPrice });
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

  onPlaceOrder(x) {
    this.api.PLACE_INACTIVE_ORDER(x).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.goBack();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onResendMail(modalName) {
    this.errorMsg=null; this.btnLoader=false;
    // let customStatus = false;
    // let index = this.order_details.item_list.findIndex(object => object.customization_status);
    // if(index!=-1) customStatus = true;
    let customerEmail = "";
    if(this.order_details.order_by=='guest') customerEmail = this.order_details.guest_email;
    else customerEmail = this.order_details.customerDetails[0].email;
    // this.mailForm = { email: customerEmail, custom_status: customStatus };
    this.mailForm = { email: customerEmail };
    this.modalService.open(modalName);
  }
  onResendVendorMail(modalName) {
    this.errorMsg=null; this.btnLoader=false;
    // let customStatus = false;
    // let index = this.vendorInfo.item_list.findIndex(object => object.customization_status);
    // if(index!=-1) customStatus = true;
    let customerEmail = "";
    if(this.order_details.order_by=='guest') customerEmail = this.order_details.guest_email;
    else customerEmail = this.order_details.customerDetails[0].email;
    // this.mailForm = { email: customerEmail, custom_status: customStatus };
    this.mailForm = { email: customerEmail, vendor_id: this.vendorInfo.vendor_id };
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

  openUpdateItemGroupModal(modalName) {
    if(!this.order_details.shipping_method.delivery_method) {
      if(!this.groupForm.carrier_name) this.groupForm.carrier_name = this.order_details.shipping_method.name;
      if(!this.groupForm.tracking_link) this.groupForm.tracking_link = this.order_details.shipping_method.tracking_link;
    }
    this.modalService.open(modalName, {size: 'lg'});
  }
  onCreateNewGroup() {
    let selectedItems = [];
    this.remaining_items.forEach(obj => {
      if(obj.checked) selectedItems.push(obj.prod_index);
    });
    if(selectedItems.length) {
      this.groupForm.submit = true;
      this.groupForm.items = selectedItems;
      this.groupForm.order_id = this.order_details._id;
      this.api.CREATE_ITEM_GROUP(this.groupForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.groupForm.submit = false;
          this.groupForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else this.groupForm.errorMsg = "Please select any item from list";
  }
  onUpdateNewGroup() {
    this.groupForm.submit = true;
    this.groupForm.order_id = this.order_details._id;
    this.api.UPDATE_ITEM_GROUP(this.groupForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.groupForm.submit = false;
        this.groupForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onRemoveNewGroup() {
    this.groupForm.submit = true;
    this.groupForm.order_id = this.order_details._id;
    this.api.DELETE_ITEM_GROUP(this.groupForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.groupForm.submit = false;
        this.groupForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateCustomerNote() {
    this.editForm.submit = true;
    this.customerApi.UPDATE_CUSTOMER(this.editForm).subscribe(result => {
      this.editForm.submit = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
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

  generatePDF(elemName, fileName) {
    let data = document.getElementById(elemName);
    html2canvas(data).then(canvas => {
      let docWidth = 190;
      let docHeight = canvas.height*(docWidth/canvas.width);
      let top = 10; let left = 10;
      let contentDataURL = canvas.toDataURL('image/png');
      let doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(contentDataURL, 'PNG', left, top, docWidth, docHeight);
      doc.save(fileName+'.pdf');
    });
  }

  transformHtml(string) {
    return string.replace(new RegExp('\n', 'g'), "<br />");
  }

}
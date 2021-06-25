import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../order.service';
import { AccountService } from '../../../account/account.service';
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
  tax_config: any = { tax: 0 }; itemList: any = [];
  groupForm: any; remaining_items: any = [];
  addedCourier: any = { name: 'Others' };
  courierData: any = {};

  constructor(
    private http: HttpClient, config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute, private accApi: AccountService,
    private router: Router, private api: OrderService, public commonService: CommonService, public location: Location, private extrasApi: ProductExtrasApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.courierForm = {}; this.hsncode_exist = false; this.selected_vendor = {};
      this.courier_partners = this.commonService.courier_partners; this.remaining_items = [];
      this.pageLoader = true; this.btnLoader = false; this.errorMsg = null;
      // order details
      this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          if(this.order_details.order_type=='pickup') this.order_details.billing_address = this.order_details.shipping_address;
          if(this.commonService.store_details._id=='60805f647ee34b5a03e4ca0d') {
            this.processItemListExcludeTax(this.order_details.item_list).then((respData) => {
              this.itemList = respData;
            });
          }
          else this.itemList = this.order_details.item_list;
          this.order_details.vendors_confirmed = true;
          this.order_details.existing_status = this.order_details.order_status;
          if(this.order_details.existing_status=='placed') this.order_details.order_status='confirmed';
          if(this.order_details.existing_status=='confirmed') {
            if(this.order_details.item_groups.length) this.order_details.order_status='delivered';
            else this.order_details.order_status='dispatched';
          }
          if(this.order_details.existing_status=='dispatched') this.order_details.order_status='delivered';
          // vendor orders
          if(this.order_details.vendor_list && this.order_details.vendor_list.length) {
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
            if(this.commonService.store_details._id=='60805f647ee34b5a03e4ca0d') {
              this.processItemListExcludeTax(this.remaining_items).then((respData) => {
                this.itemList = respData;
              });
            }
            else this.itemList = this.remaining_items;
          }
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
    this.courierForm.btnLoader = true;
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
    else if(x.name=='Dunzo') {
      if(!this.commonService.branch_list.length) {
        this.accApi.BRANCH_LIST().subscribe(result => {
          if(result.status) {
            this.commonService.branch_list = result.list;
            this.commonService.updateLocalData('branch_list', this.commonService.branch_list);
            this.createDunzoTask();
          }
          else this.courierForm.errorMsg = "Branch does not exists";
        });
      }
      else this.createDunzoTask();
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

  createDunzoTask() {
    if(this.order_details.shipping_method.pickup_details && this.order_details.shipping_method.pickup_details.branch_id) {
      let branchIndex = this.commonService.branch_list.findIndex(obj => obj._id==this.order_details.shipping_method.pickup_details.branch_id);
      if(branchIndex!=-1) {
        let compDetails: any = this.commonService.branch_list[branchIndex];
        let shippingAddr = this.order_details.shipping_address;
        let orderPrice: any = this.order_details.final_price - this.order_details.shipping_method.added_charge;
        // pickup address
        let pickupAddr: any = {
          street_address_1: compDetails.address, country: this.commonService.store_details.country,
          lat: parseFloat(this.order_details.shipping_method.pickup_details.lat),
          lng: parseFloat(this.order_details.shipping_method.pickup_details.lng),
          contact_details: {
            name: compDetails.contact_person,
            phone_number: compDetails.mobile
          }
        };
        if(compDetails.landmark) pickupAddr.landmark = compDetails.landmark;
        if(compDetails.city) pickupAddr.city = compDetails.city;
        if(compDetails.state) pickupAddr.state = compDetails.state;
        if(compDetails.pincode) pickupAddr.pincode = compDetails.pincode;
        // drop address
        let dropAddr: any = {
          street_address_1: shippingAddr.address, country: shippingAddr.country,
          lat: parseFloat(shippingAddr.lat), lng: parseFloat(shippingAddr.lng),
          contact_details: {
            name: shippingAddr.name,
            phone_number: shippingAddr.dial_code+' '+shippingAddr.mobile
          }
        };
        if(shippingAddr.door_no) dropAddr.apartment_address = shippingAddr.door_no;
        if(shippingAddr.landmark) dropAddr.landmark = shippingAddr.landmark;
        if(shippingAddr.city) dropAddr.city = shippingAddr.city;
        if(shippingAddr.state) dropAddr.state = shippingAddr.state;
        if(shippingAddr.pincode) dropAddr.pincode = shippingAddr.pincode;
        // create dunzo form data
        let uniqueId = this.order_details._id+'-'+Math.floor(Math.random()*(999));
        let formData: any = {
          request_id: uniqueId,
          reference_id: uniqueId,
          pickup_details: [{ reference_id: "pickup1", address: pickupAddr }],
          optimised_route: true,
          drop_details: [{ reference_id: "drop1", address: dropAddr, otp_required: false }]
        };
        if(this.order_details.payment_details.name=='COD') {
          formData.drop_details[0].payment_data = { payment_method: "COD", amount: parseFloat(orderPrice) };
          formData.payment_method = "COD";
        }
        else formData.payment_method = "DUNZO_CREDIT";
        if(this.courierForm.special_instructions) formData.drop_details[0].special_instructions = this.courierForm.special_instructions;
        // scheduled time
        if(this.order_details.shipping_method.delivery_method) {
          let deliveryDate = this.order_details.shipping_method.delivery_date.split("(")[0]+this.order_details.shipping_method.delivery_time.split(" - ")[0];
          let minDelayTime = new Date().setMinutes(new Date().getMinutes() + 35);
          if(new Date(deliveryDate) > new Date(minDelayTime)) {
            formData.delivery_type = "SCHEDULED";
            formData.schedule_time = Math.round(new Date(deliveryDate).getTime() / 1000);
            this.contCreateDunzoTask(formData);
          }
          else {
            this.courierForm.btnLoader = false;
            this.courierForm.errorMsg = "Pickup time must greater than 35 minutes from current time";
          }
        }
        else this.contCreateDunzoTask(formData);
      }
      else {
        this.courierForm.btnLoader = false;
        this.courierForm.errorMsg = "Branch does not exists";
      }
    }
    else {
      this.courierForm.btnLoader = false;
      this.courierForm.errorMsg = "Branch ID does not exists";
    }
  }
  contCreateDunzoTask(formData) {
    this.api.DUNZO_CREATE_ORDER({ _id: this.order_details._id, form_data: formData }).subscribe(result => {
      if(result.status) this.ngOnInit();
      else {
        this.courierForm.btnLoader = false;
        this.courierForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  checkDunzoStatus(taskId) {
    this.courierData.submit = true;
    this.api.DUNZO_ORDER_STATUS(this.order_details._id, taskId).subscribe(result => {
      this.courierData.submit = false;
      if(result.status) this.courierData = result.data;
      else {
        this.courierData.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  cancelCourierPartner(modalName) {
    this.courierForm = { type: 'Others' };
    let cpIndex = this.order_details.cp_orders.findIndex(obj => obj.status=='active');
    if(cpIndex!=-1) this.courierForm.type = this.order_details.cp_orders[cpIndex].name;
    this.modalService.open(modalName, { centered: true });
  }
  confirmCancelCourierPartner() {
    this.courierForm.btnLoader = true;
    if(this.courierForm.type=='Delhivery') {
      this.api.DELHIVERY_UPDATE_ORDER({ _id: this.order_details._id, cancellation: true }).subscribe(result => {
        this.courierForm.btnLoader = false;
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
    else if(this.courierForm.type=='Dunzo') {
      this.api.CANCEL_DUNZO_ORDER({ _id: this.order_details._id, form_data: { cancellation_reason: this.courierForm.cancel_reason } }).subscribe(result => {
        this.courierForm.btnLoader = false;
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
    else {
      let sendData = { _id: this.order_details._id, cp_status: false, "shipping_method.name": "", "shipping_method.tracking_number": "", "shipping_method.tracking_link": "" };
      this.api.UPDATE_ORDER_DETAILS(sendData).subscribe(result => {
        this.courierForm.btnLoader = false;
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
        if(this.order_details.order_status=='delivered') {
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
          this.location.back();
        }
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
        // cancel courier partner
        let cpIndex = this.order_details.cp_orders.findIndex(obj => obj.status=='active');
        if(this.order_details.existing_status=='confirmed' && cpIndex!=-1) {
          if(this.order_details.cp_orders[cpIndex].name=='Delhivery') {
            this.api.DELHIVERY_UPDATE_ORDER({ _id: this.order_details._id, cancellation: true }).subscribe(result => {
              document.getElementById('closeModal').click();
              this.router.navigate(["/orders/product/cancelled/"+this.params.customer_id]);
            });
          }
          else if(this.order_details.cp_orders[cpIndex].name=='Dunzo') {
            this.api.CANCEL_DUNZO_ORDER({ _id: this.order_details._id, form_data: { cancellation_reason: 'Order cancelled' } }).subscribe(result => {
              document.getElementById('closeModal').click();
              this.router.navigate(["/orders/product/cancelled/"+this.params.customer_id]);
            });
          }
        }
        else {
          document.getElementById('closeModal').click();
          this.router.navigate(["/orders/product/cancelled/"+this.params.customer_id]);
        }
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

  findBaseAmount(amount, taxDetails) {
    if(taxDetails) {
      if(this.order_details.billing_address.country==taxDetails.home_country && this.order_details.billing_address.state==taxDetails.home_state) {
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
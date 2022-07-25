import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
  animations: [SharedAnimations]
})

export class VendorsComponent implements OnInit {

  search_bar: string; settingForm: any = { cmsn_config: {} };
  page = 1; pageSize = 10; parent_list: any = [];
  pageLoader: boolean; list_type: string = 'all';
  list: any = []; imgBaseUrl = environment.img_baseurl;
  vendorForm: any = {}; pwdForm: any = {}; deleteForm: any = {};
  permissionList: any = [
    { title: "PRODUCT",
      sub_list: [
        { keyword: "add_product", name: "Add" },
        { keyword: "remove_product", name: "Remove" },
        { keyword: "link_product", name: "Link to Catalog" },
        { keyword: "update_product", name: "Update", selected_option: "update_product_overall", options: [
          { keyword: "update_product_overall", name: "Overall" },
          { keyword: "update_product_stock_only", name: "Stock Only" }
        ] }
      ]
    }
  ];
  state_list: any = [];
  reg_address_fields: any = [];
  pick_address_fields: any = [];
  invForm: any = {}; invoiceNum: string;
  shippingPriceConfig: any = { price: 100, free_above: 499 };

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: AccountService,
    public commonService: CommonService, private deployService: DeploymentService
    ) {
    config.backdrop = 'static'; config.keyboard = false;
    if(this.commonService.ys_features.indexOf('measurements') != -1)
      this.permissionList.push({ keyword: "measurements", name: "Measurement Sets", sub_list: [] });
    if(this.commonService.ys_features.indexOf('addons') != -1)
      this.permissionList.push({ keyword: "addons", name: "Addons", sub_list: [] });
    if(this.commonService.ys_features.indexOf('product_filters') != -1)
      this.permissionList.push({ keyword: "product_filters", name: "Product Tags", sub_list: [] });
    if(this.commonService.ys_features.indexOf('foot_note') != -1)
      this.permissionList.push({ keyword: "foot_note", name: "Foot Note", sub_list: [] });
    if(this.commonService.ys_features.indexOf('faq') != -1)
      this.permissionList.push({ keyword: "faq", name: "FAQ", sub_list: [] });
    if(this.commonService.ys_features.indexOf('size_chart') != -1)
      this.permissionList.push({ keyword: "size_chart", name: "Size Chart", sub_list: [] });
    if(this.commonService.store_details.additional_features?.shipping_price_config)
      this.shippingPriceConfig = this.commonService.store_details.additional_features?.shipping_price_config;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.VENDOR_LIST().subscribe(result => {
      if(result.status) {
        this.parent_list = result.list;
        this.commonService.vendor_list = result.list.filter(obj => obj.status=='active');
        this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
        this.onTypeChange(this.list_type);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAddModal(modalName) {
    this.vendorForm = {
      form_type: 'add', password: this.generatePwd(), company_details: { made_in_home_country: '', shipping_type: '' },
      registered_address: { country: this.commonService.store_details?.country },
      pickup_address: { country: this.commonService.store_details?.country }, bank_details: {}
    };
    this.onCountryChange(this.commonService.store_details?.country);
    this.modalService.open(modalName, { size: 'lg' });
  }

  onSubmit() {
    delete this.vendorForm.errorMsg;
    if(this.vendorForm.form_type=='add') {
      this.reg_address_fields.forEach(element => {
        if(element.value) this.vendorForm.registered_address[element.keyword] = element.value;
      });
      this.pick_address_fields.forEach(element => {
        if(element.value) this.vendorForm.pickup_address[element.keyword] = element.value;
      });
      this.vendorForm.submit = true;
      this.vendorForm.status = "active";
      this.api.ADD_VENDOR(this.vendorForm).subscribe((result) => {
        this.vendorForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    if(this.vendorForm.form_type=='edit_details') {
      this.reg_address_fields.forEach(element => {
        if(element.value) this.vendorForm.registered_address[element.keyword] = element.value;
      });
      this.pick_address_fields.forEach(element => {
        if(element.value) this.vendorForm.pickup_address[element.keyword] = element.value;
      });
      this.vendorForm.submit = true;
      this.api.UPDATE_VENDOR(this.vendorForm).subscribe(result => {
        this.vendorForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    if(this.vendorForm.form_type=='edit_permissions') {
      let sendData = { _id: this.vendorForm._id, permission_list: [], change_key: true };
      this.permissionList.forEach(obj => {
        if(obj.selected) sendData.permission_list.push(obj.keyword);
        obj.sub_list.forEach(el => {
          if(el.selected) {
            sendData.permission_list.push(el.keyword);
            if(el.selected_option) sendData.permission_list.push(el.selected_option);
          }
        });
      });
      this.vendorForm.submit = true;
      this.api.UPDATE_VENDOR(sendData).subscribe(result => {
        this.vendorForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onOpenInvoiceModal(modalName) {
    this.invForm = { vendor_inv_status: false, vendor_inv_config: {} };
    this.deployService.DEPLOY_DETAILS(this.commonService.store_details?._id).subscribe(result => {
      if(result.status) {
        let deployDetails = result.data;
        if(deployDetails?.vendor_inv_status) this.invForm.vendor_inv_status = deployDetails.vendor_inv_status;
        if(deployDetails?.vendor_inv_config) this.invForm.vendor_inv_config = deployDetails.vendor_inv_config;
        this.invoiceNumFormat();
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateInvoiceConfig() {
    this.invForm.submit = true;
    this.invForm.store_id = this.commonService.store_details._id;
    this.deployService.UPDATE_DEPLOY_DETAILS(this.invForm).subscribe(result => {
      this.invForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.deploy_details = result.data;
        delete this.commonService.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
      }
      else {
        this.invForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // EDIT
  onEdit(x, type, modalName) {
    this.onCountryChange(this.commonService.store_details?.country);
    this.api.VENDOR_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.vendorForm = result.data;
        delete this.vendorForm.password;
        this.vendorForm.form_type = type;
        this.reg_address_fields.forEach(element => {
          element.value = this.vendorForm.registered_address[element.keyword];
        });
        this.pick_address_fields.forEach(element => {
          element.value = this.vendorForm.pickup_address[element.keyword];
        });
        // for permission
        this.permissionList.forEach(obj => {
          delete obj.selected;
          if(obj.keyword && this.vendorForm.permission_list.indexOf(obj.keyword)!=-1) obj.selected = true;
          obj.sub_list.forEach(el => {
            delete el.selected; delete el.selected_option;
            if(this.vendorForm.permission_list.indexOf(el.keyword)!=-1) el.selected = true;
            if(el.options && el.options.length) {
              el.options.forEach(elem => {
                let optExist;
                if(this.vendorForm.permission_list.indexOf(elem.keyword)!=-1) {
                  optExist = true;
                  el.selected_option = elem.keyword;
                }
                if(!optExist) el.selected_option = el.options[0].keyword;
              });
            }
          });
        });
        this.modalService.open(modalName, {size: "lg"});
      }
      else console.log("response", result);
    });
  }

  // DELETE
  onDelete() {
    this.api.DELETE_VENDOR(this.deleteForm).subscribe(result => {
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

  onUpdateStatus() {
    let newStatus = 'active';
    if(this.deleteForm.status=='active') newStatus = 'inactive';
    this.deleteForm.submit = true;
    this.api.UPDATE_VENDOR({ _id: this.deleteForm._id, form_type: 'change_status', status: newStatus, change_key: true }).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  // Link to RazorpayX
  onLink() {
    this.deleteForm.submit = true;
    delete this.deleteForm.errorMsg;
    this.api.LINK_VENDOR({ _id: this.deleteForm._id }).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  // UPDATE PWD
  onUpdatePwd() {
    delete this.pwdForm.errorMsg;
    this.api.UPDATE_VENDOR_PWD(this.pwdForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateBanner() {
    this.vendorForm.submit = true;
    this.api.UPDATE_VENDOR(this.vendorForm).subscribe(result => {
      this.vendorForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.vendorForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onOpencmsnModal(modalName) {
    this.settingForm = { cmsn_type: '', cmsn_in_pct: 0, cmsn_config: { settlem_type: 'dispatched_on' }, price_range: [] };
    if(localStorage.getItem('deploy_details')) {
      let deployDetails = this.commonService.decryptData(localStorage.getItem("deploy_details"));
      this.settingForm.price_range = deployDetails.price_range;
      if(deployDetails.cmsn_type) this.settingForm.cmsn_type = deployDetails.cmsn_type;
      if(deployDetails.cmsn_in_pct) this.settingForm.cmsn_in_pct = deployDetails.cmsn_in_pct;
      if(deployDetails.cmsn_config) this.settingForm.cmsn_config = deployDetails.cmsn_config;
    }
    this.modalService.open(modalName);
  }
  onUpdateCommission(x) {
    x.store_id = this.commonService.store_details._id;
    this.deployService.UPDATE_DEPLOY_DETAILS(x).subscribe(result => {
      if(result.status) {
        this.commonService.deploy_details = result.data;
        delete this.commonService.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
        document.getElementById("closeModal").click();
      }
      else {
        this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onActivate(x) {
    this.deleteForm.submit = true;
    this.api.VENDOR_ACTIVATION({ _id: this.deleteForm._id, type: x }).subscribe(result => {
      this.deleteForm.submit = false;
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

  invoiceNumFormat() {
    this.invoiceNum = String(this.invForm.vendor_inv_config.next_invoice_no).padStart(this.invForm.vendor_inv_config.min_digit, '0');
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.vendorForm.image = (<FileReader>event.target).result;
        this.vendorForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onTypeChange(x) {
    this.pageLoader = true;
    if(x=="active") this.list = this.parent_list.filter(obj => obj.status=='active');
    else if(x=="inactive") this.list = this.parent_list.filter(obj => obj.password && obj.status=='inactive');
    else if(x=="new") this.list = this.parent_list.filter(obj => !obj.password && obj.status=='inactive');
    else if(x=="declined") this.list = this.parent_list.filter(obj => obj.status=='declined');
    else this.list = this.parent_list;
    setTimeout(() => { this.pageLoader = false; }, 500);
  }

  onCountryChange(x) {
    this.state_list = [];
    this.reg_address_fields = []; this.pick_address_fields = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      let cDetails = this.commonService.country_list[index];
      this.state_list = cDetails.states;
      cDetails.address_fields.forEach(el => {
        this.reg_address_fields.push({ keyword: el.keyword, label: el.label });
        this.pick_address_fields.push({ keyword: el.keyword, label: el.label });
      });
    }
  }

  generatePwd() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(let i = 0; i < 8; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

}
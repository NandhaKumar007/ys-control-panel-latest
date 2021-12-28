import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { StoreApiService } from '../../../services/store-api.service';
import { ProductExtrasApiService } from '../product-extras/product-extras-api.service';
import { CommonService } from '../../../services/common.service';
import { ExcelService } from '../../../services/excel.service';
import { DeploymentService } from '../deployment/deployment.service';
import { environment } from '../../../../environments/environment';
import jsonProducts from '../../../../assets/json/products.json';

@Component({
  selector: 'app-products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [SharedAnimations]
})

export class ProductComponent implements OnInit {

  btnLoader: boolean; pageLoader: boolean; productCount: number = 0;
	page = 1; pageSize = 10;
  list: any = []; totalCount: number = 0;
  filterForm: any = { search: "", sort_by: 'created_desc' }; exportLoader: boolean;
  archiveForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  limitedProdCount = environment.limited_product_count;
  categoryList: any = []; vendorList: any = [];
  scrollPos: number = 0;

  constructor(
    private http: HttpClient, config: NgbModalConfig, public modalService: NgbModal, private storeApi: StoreApiService, private deployApi: DeploymentService,
    private router: Router, private excelService: ExcelService, public commonService: CommonService, private extraApi: ProductExtrasApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.filterForm.category_id = 'all'; this.filterForm.vendor_id = 'all';
    this.filterForm.product_type = 'all';
    // vendors
    if(this.commonService.vendor_list.length) {
      this.vendorList = [{_id: 'all', name: "All Vendors"}];
      this.commonService.vendor_list.forEach(obj => { this.vendorList.push(obj) });
    }
    if(this.commonService.product_page_attr) {
      let pageInfo = this.commonService.product_page_attr;
      delete this.commonService.product_page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.filterForm.category_id = pageInfo.filter_form.category_id;
      this.filterForm.vendor_id = pageInfo.filter_form.vendor_id;
      if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
      if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
    }
    if(this.commonService.catalog_list.length) {
      this.categoryList.push({_id: 'all', name: "All Catalogs"});
      this.commonService.catalog_list.forEach(element => {
        this.categoryList.push(element)
      });
    }
    this.getProductList(false);
  }

  importProduct() {
    this.processBeforeImport(jsonProducts).then((prodList) => {
      console.log("-------", prodList);
      // this.storeApi.PRODUCT_BULK_UPLOAD({ product_list: prodList }).subscribe(result => {
      //   console.log("-------result", result);
      // });
    });
  }
  processBeforeImport(list) {
    return new Promise((resolve, reject) => {
      for(let prod of list) {
        if(prod.variant_status) {
          prod.variant_types.forEach(element => {
            element.options = element.options.filter(obj => obj.value!='null');
          });
          prod.variant_list = prod.variant_list.filter(obj => obj.discounted_price!=null);
        }
        prod.category_id = prod.category_id.filter(obj => obj!='null');
        prod.footnote_list = prod.footnote_list.filter(obj => obj.value!='null');
        prod.image_list = prod.image_list.filter(obj => obj.image!='null');
        if(!prod.image_list.length) prod.image_list = [{}];
        let tagList = [];
        prod.tag_list.forEach(obj => {
          for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
              obj[key] = obj[key].filter(obj => obj!='null');
              if(obj[key].length) tagList.push(obj);
            }
          }
        });
        prod.tag_list = tagList;
        if(prod.aistyle_list) {
          prod.aistyle_list.forEach(obj => {
            for(let key in obj) {
              if(obj.hasOwnProperty(key)) obj[key] = obj[key].filter(obj => obj!='null');
            }
          });
        }
      }
      resolve(list);
    });
  }

  getProductList(mergeStatus) {
    if(!mergeStatus) {
      this.page = 1; this.list = [];
      this.filterForm.skip = 0; this.filterForm.limit = 50;
    }
    if(this.filterForm.from_date || this.filterForm.to_date) {
      if(this.filterForm.from_date && this.filterForm.to_date) {
        this.callApi(mergeStatus);
      }
    }
    else this.callApi(mergeStatus);
  }
  callApi(mergeStatus) {
    if(!mergeStatus) this.pageLoader = true;
    this.storeApi.PRODUCT_LIST(this.filterForm).subscribe(result => {
      if(result.status) {
        if(mergeStatus) {
          result.list.forEach(element => {
            this.list.push(element);
          });
        }
        else this.list = result.list;
        this.totalCount = result.count;
        this.productCount = result.product_count;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onChangePage(selectedPage) {
    this.page = selectedPage; this.commonService.pageTop(0);
    let totalPages = this.list.length/this.pageSize;
    if(totalPages===selectedPage && this.totalCount>this.list.length) {
      this.filterForm.skip = this.list.length;
      this.filterForm.limit = 20;
      this.getProductList(true);
    }
  }

  onMoveToArchive() {
    this.storeApi.MOVE_PRODUCT_TO_ARCHIVE(this.archiveForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getProductList(false);
      }
      else {
        this.archiveForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Delete
  onDelete() {
    this.btnLoader = true;
    this.storeApi.DELETE_PRODUCT({ _id: this.deleteForm._id, rank: this.deleteForm.rank }).subscribe(result => {
      this.updateDeployStatus();
      setTimeout(() => { this.btnLoader = false; }, 500);
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getProductList(false);
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['products']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.products": true };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

  goModifyPage(product, stepNum) {
    this.commonService.product_page_attr = { page_no: this.page, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/products/modify/"+product._id+"/"+this.productCount+"/"+stepNum]);
  }
  goReviewPage(x) {
    this.commonService.product_page_attr = { page_no: this.page, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/features/selected-product-reviews/"+x._id]);
  }

  exportAsXLSX() {
    this.exportLoader = true;
    this.createList(this.commonService.catalog_list, this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, 'product'+' export '+new Date().getTime());
      setTimeout(() => { this.exportLoader = false; }, 500);
    })
  }
  async createList(overallCategoryList, productList) {
    let updatedList = [];
    for(let i=0; i<productList.length; i++) {
      let sendData = {};
      sendData['Name'] = productList[i].name;
      sendData['SKU'] = productList[i].sku;
      sendData['Price'] = productList[i].discounted_price;
      sendData['Stock'] = productList[i].stock;
      sendData['URL'] = this.commonService.store_details.base_url+'/product/'+productList[i].seo_details.page_url;
      sendData['Description'] = productList[i].description;
      sendData['Category'] = await this.processArrayList('category', overallCategoryList, productList[i].category_id);
      sendData['Image'] = await this.processArrayList('image', overallCategoryList, productList[i].image_list);
      updatedList.push(sendData);
    }
    return updatedList;
  }
  processArrayList(type, overallCategoryList, list) {
    return new Promise((resolve, reject) => {
      let respData = "";
      if(type=="category") {
        for(let i=0; i<list.length; i++) {
          let index = overallCategoryList.findIndex(obj => obj.section_id==list[i] || obj.category_id==list[i] || obj._id==list[i]);
          if(index!=-1) respData += overallCategoryList[index].name+", ";
        }
      }
      else if(type=="image") {
        for(let i=0; i<list.length; i++) {
          respData += this.imgBaseUrl+list[i].image+", ";
        }
      }
      resolve(respData.substring(0, respData.length-2));
    });
  }

}
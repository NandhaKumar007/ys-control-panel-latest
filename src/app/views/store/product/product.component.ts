import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { StoreApiService } from '../../../services/store-api.service';
import { ProductExtrasApiService } from '../product-extras/product-extras-api.service';
import { CommonService } from '../../../services/common.service';
import { ExcelService } from '../../../services/excel.service';
import { GridSearchPipe } from '../../../shared/pipes/grid-search.pipe';
import { environment } from '../../../../environments/environment';
import jsonProducts from '../../../../assets/json/products.json';

@Component({
  selector: 'app-products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [SharedAnimations]
})

export class ProductComponent implements OnInit {

  btnLoader: boolean; pageLoader: boolean; productCount: any = 0;
	page = 1; pageSize = 10; search_bar: string;
  parent_list : any = []; list: any = [];
  filterForm: any = {}; exportLoader: boolean;
  archiveForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  limitedProdCount = environment.limited_product_count;
  categoryList: any = []; vendorList: any = [];
  product_filter: any = "all"; sort_by: any = 'created_desc'; scrollPos: number = 0;

  constructor(
    private http: HttpClient, config: NgbModalConfig, public modalService: NgbModal, private storeApi: StoreApiService,
    private router: Router, private excelService: ExcelService, public commonService: CommonService, private extraApi: ProductExtrasApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    // vendors
    this.filterForm = { category_id: 'all', vendor_id: 'all' };
    if(this.commonService.vendor_list.length) {
      this.vendorList = [{_id: 'all', name: "All Vendors"}];
      this.commonService.vendor_list.forEach(obj => { this.vendorList.push(obj) });
    }
    if(this.commonService.product_page_attr) {
      let pageInfo = this.commonService.product_page_attr;
      delete this.commonService.product_page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
      this.sort_by = pageInfo.sort;
      this.product_filter = pageInfo.filter;
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
    this.getProductList();
  }

  importProduct() {
    this.processBeforeImport(jsonProducts).then((prodList) => {
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
      }
      resolve(list);
    });
  }

  getProductList() {
    if(this.filterForm.from_date || this.filterForm.to_date) {
      if(this.filterForm.from_date && this.filterForm.to_date) {
        this.pageLoader = true;
        this.storeApi.PRODUCT_LIST(this.filterForm).subscribe(result => {
          if(result.status) {
            this.parent_list = result.list;
            this.list = result.list;
            this.productCount = result.product_count;
          }
          else console.log("response", result);
          this.onChangeFilter(this.product_filter);
          setTimeout(() => {
            this.pageLoader = false; this.onChangeSort(this.sort_by); this.commonService.pageTop(this.scrollPos);
          }, 500);
        });
      }
    }
    else {
      this.pageLoader = true;
      this.storeApi.PRODUCT_LIST(this.filterForm).subscribe(result => {
        if(result.status) {
          this.parent_list = result.list;
          this.list = result.list;
          this.productCount = result.product_count;
        }
        else console.log("response", result);
        this.onChangeFilter(this.product_filter);
        setTimeout(() => {
          this.pageLoader = false; this.onChangeSort(this.sort_by); this.commonService.pageTop(this.scrollPos);
        }, 500);
      });
    }
  }

  onChangeFilter(x) {
    let productList = this.parent_list;
    this.list = productList;
    if(x=='in') this.list = productList.filter(obj => obj.stock>0)
    else if(x=='out') this.list = productList.filter(obj => obj.stock<=0)
  }

  onChangeSort(x) {
    if(x) {
      let searchValue = this.search_bar; this.search_bar = null;
      if(x=='rank_desc') this.list.sort((a, b) => 0 - (a.rank > b.rank ? 1 : -1));
      else if(x=='price_desc') this.list.sort((a, b) => 0 - (a.discounted_price > b.discounted_price ? 1 : -1));
      else if(x=='stock_desc') this.list.sort((a, b) => 0 - (a.stock > b.stock ? 1 : -1));
      else if(x=='created_desc') this.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
      else if(x=='modified_desc') this.list.sort((a, b) => 0 - (a.modified_on > b.modified_on ? 1 : -1));
      else this.list.sort((a, b) => 0 - (a[x] > b[x] ? -1 : 1));
      setTimeout(() => { this.search_bar = searchValue; }, 10);
    }
  }

  onMoveToArchive() {
    this.storeApi.MOVE_PRODUCT_TO_ARCHIVE(this.archiveForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getProductList();
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
      setTimeout(() => { this.btnLoader = false; }, 500);
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getProductList();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  goModifyPage(product, stepNum) {
    this.commonService.product_page_attr = { page_no: this.page, search: this.search_bar, sort: this.sort_by, filter: this.product_filter, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/products/modify/"+product._id+"/"+this.productCount+"/"+stepNum]);
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let productList = new GridSearchPipe().transform(this.list, {name: this.search_bar, sku: this.search_bar});
    this.createList(this.commonService.catalog_list, productList).then((exportList: any[]) => {
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
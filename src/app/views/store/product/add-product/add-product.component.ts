import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { StoreApiService } from '../../../../services/store-api.service';
import { ProductExtrasApiService } from '../../product-extras/product-extras-api.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  animations: [SharedAnimations]
})

export class AddProductComponent implements OnInit {

  maxRank: any = 0; intForm: any = {};
  productForm: any; step_num: any;
  pageLoader: boolean; btnLoader: boolean;
  categoryList = this.commonService.catalog_list;
  addonList: any; tagList: any; noteList: any; taxRates: any;  colorList: any; amenityList: any;
  sizeCharts: any; faqList: any; taxonomyList: any; aiStyleList: any; imgTagList: any;
  cropperSettings: CropperSettings; imageIndex: any;
  imgWidth: any; imgHeight: any; primary_tax: any;
  image_count: number = environment.default_img_count;
  selectedVariantOptions: any []; selectedVariantIndex: number;
  configData: any= environment.config_data; brochForm: any = {};
  catSearch: string; productFeatures: any; vendorAdmin: boolean;
  selectedImage: any; croppedImage: any = {}; cropStatus: boolean;
  varIndex: number; imgIndex: number; resizeForm: any = {}; imgType: string;

  @ViewChild('cropper', {static: false}) cropper: ImageCropperComponent;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService,
    private peApi: ProductExtrasApiService, public commonService: CommonService, private atp: AmazingTimePickerService, private deployApi: DeploymentService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    let resolution = this.commonService.store_details.additional_features.cropper_resolution.split("x");
    this.imgWidth = parseFloat(resolution[0]); this.imgHeight = parseFloat(resolution[1]);
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.croppedWidth = this.imgWidth; this.cropperSettings.croppedHeight = this.imgHeight;
    this.cropperSettings.canvasWidth = this.imgWidth/3; this.cropperSettings.canvasHeight = this.imgHeight/3;
    this.cropperSettings.width = this.imgWidth; this.cropperSettings.height = this.imgHeight;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.noFileInput = true;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.aiStyleList = []; delete this.catSearch;
      if(this.commonService.ys_features.indexOf('vendors')!=-1 && this.commonService.store_details?.login_type!='vendor') this.vendorAdmin = true;
      if(localStorage.getItem("aistyle_list")) this.aiStyleList = this.commonService.decryptData(localStorage.getItem("aistyle_list"));
      this.categoryList.forEach(element => { element.selected = false; });
      if(this.commonService.ys_features.indexOf('variant_image_tag')!=-1) this.image_count = environment.variant_img_count;
      this.maxRank = params.rank;
      this.step_num = 1; this.btnLoader = false; this.pageLoader = true;
      this.productForm = {
        rank: this.maxRank, image_list: [{}], variant_types: [], seo_details: {}, unit: 'Pcs',
        allow_cod: true, video_details: {}, available_days: [
          { code: 0, day: "Sunday", active: false, opening_hrs: [] }, { code: 1, day: "Monday", active: false, opening_hrs: [] },
          { code: 2, day: "Tuesday", active: false, opening_hrs: [] }, { code: 3, day: "Wednesday", active: false, opening_hrs: [] },
          { code: 4, day: "Thursday", active: false, opening_hrs: [] }, { code: 5, day: "Friday", active: false, opening_hrs: [] },
          { code: 6, day: "Saturday", active: false, opening_hrs: [] }
        ]
      };
      // auto sku
      if(this.commonService.deploy_details?.auto_sku && this.commonService.deploy_details?.sku_config?.min_digit) {
        let prodCount = 0;
        this.api.PRODUCTS_COUNT().subscribe(result => {
          if(result.status) prodCount = result.count;
          let numConvert = String(prodCount+1).padStart(this.commonService.deploy_details.sku_config.min_digit, '0');
          this.productForm.sku = this.commonService.deploy_details.sku_config.prefix+numConvert;
        });
      }
      // product features
      this.addonList = []; this.tagList = []; this.noteList = []; this.taxRates = []; this.sizeCharts = []; this.taxonomyList = [];
      this.api.PRODUCT_FEATURES().subscribe(result => {
        if(result.status) {
          this.productFeatures = result.data;
          this.addonList = result.data.addon_list.filter(obj => obj.status=='active');
          this.tagList = result.data.tag_list.filter(obj => obj.status=='active');
          this.amenityList = result.data.amenities.filter(obj => obj.status=='active');
          this.faqList = result.data.faq_list.filter(obj => obj.status=='active');
          this.noteList = result.data.footnote_list;
          this.imgTagList = result.data.img_tag_list;
          this.sizeCharts = result.data.size_chart.filter(obj => obj.status=='active');
          // for vendor login
          if(this.commonService.store_details?.login_type=='vendor') this.onChangeVendor(this.commonService.vendor_details._id);
          // common features
          if(this.commonService.ys_features.indexOf('tax_rates')!=-1) {
            this.taxRates = result.data.tax_rates.filter(obj => obj.status=='active');
            if(this.taxRates.length) {
              let taxIndex = this.taxRates.findIndex(obj => obj.primary);
              if(taxIndex!=-1) {
                this.primary_tax = this.taxRates[taxIndex]._id;
                this.productForm.taxrate_id = this.primary_tax;
              }
            }
          }
          this.taxonomyList = result.data.taxonomy.filter(obj => obj.status=='active');
          if(this.taxonomyList.length) this.productForm.taxonomy_id = this.taxonomyList[0]._id;
          this.colorList = result.data.color_list;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
      if(this.commonService.ys_features.indexOf('shopping_assistant')!=-1 && !localStorage.getItem("aistyle_list")) {
        this.peApi.AI_STYLE_DETAILS().subscribe(result => {
          if(result.status) {
            this.commonService.aistyle_list = result.data;
            this.aiStyleList = this.commonService.aistyle_list;
            this.commonService.updateLocalData('aistyle_list', this.commonService.aistyle_list);
          }
        });
      }
    });
  }

  onAdd() {
    this.btnLoader = true;
    // category list
    this.productForm.category_id = [];
    this.categoryList.forEach(element => {
      if(element.selected) this.productForm.category_id.push(element._id);
    });
    // discount
    if(!this.productForm.disc_status) {
      this.productForm.disc_percentage = null;
      this.productForm.discounted_price = this.productForm.selling_price;
      if(this.productForm.variant_list) {
        this.productForm.variant_list.forEach(object => {
          object.discounted_price = object.selling_price;
        });
      }
    }
    // variants
    if(this.productForm.variant_status) {
      let totalStock = 0;
      this.productForm.variant_list.forEach(object => {
        totalStock += parseFloat(object.stock);
      });
      if(this.productForm.variant_list[0].taxrate_id) this.productForm.taxrate_id = this.productForm.variant_list[0].taxrate_id;
      this.productForm.sku = this.productForm.variant_list[0].sku;
      this.productForm.selling_price = this.productForm.variant_list[0].selling_price;
      this.productForm.discounted_price = this.productForm.variant_list[0].discounted_price;
      this.productForm.stock = totalStock;
      // construct variant list
      this.productForm.variant_list.forEach(object => {
        object.stock = parseFloat(object.stock);
        object.selling_price = parseFloat(object.selling_price);
      });
    }
    this.productForm.sku = this.productForm.sku.toUpperCase();
    // addons
    this.productForm.addon_list = [];
    if(this.productForm.addon_status) {
      this.addonList.forEach(object => {
        if(object.addon_checked) this.productForm.addon_list.push({ addon_id: object._id });
      });
    }
    if(!this.productForm.addon_status || !this.addonList.length) this.productForm.addon_must = false;
    // amenities
    this.productForm.amenity_list = [];
    if(this.productForm.amenity_status) {
      this.amenityList.forEach(el => {
        if(el.amen_checked) this.productForm.amenity_list.push(el._id);
      });
    }
    // tag
    this.productForm.tag_list = [];
    if(this.productForm.tag_status) {
      this.tagList.forEach(tagObject => {
        if(tagObject.tag_checked) {
          let optionArray = [];
          tagObject.option_list.forEach(optionObject => {
            if(optionObject.tag_option_checked) optionArray.push(optionObject.name);
          });
          this.productForm.tag_list.push({ [tagObject._id]: optionArray });
        }
      });
    }
    // ai styles
    this.productForm.aistyle_list = [];
    if(this.productForm.aistyle_status) {
      this.aiStyleList.forEach(section => {
        if(section.aistyle_checked) {
          let optionArray = [];
          if(section.type=='either_or') optionArray.push(section.selected_option);
          else {
            section.option_list.forEach(option => {
              if(option.aistyle_option_checked) optionArray.push(option._id);
            });
          }
          this.productForm.aistyle_list.push({ [section._id]: optionArray });
        }
      });
    }
    // foot note
    this.productForm.footnote_list = [];
    if(this.productForm.note_status) {
      this.noteList.forEach(object => {
        if(object.note_checked) this.productForm.footnote_list.push({ name: object.name, value: object.selected_option });
      });
    }
    // faq
    this.productForm.faq_list = [];
    if(this.productForm.faq_status) {
      this.faqList.forEach(faqObject => {
        if(faqObject.faq_checked) {
          this.productForm.faq_list.push({ [faqObject._id]: faqObject.selected_answer });
        }
      });
    }
    if(!this.productForm.availability_status) this.productForm.available_days = [];
    // seo
    let productUrl = this.commonService.urlFormat(this.productForm.name+' '+this.productForm.sku);
    if(productUrl) {
      this.productForm.seo_status = true;
      this.productForm.seo_details = {
        page_url: productUrl,
        h1_tag: this.productForm.name.substring(0, 70),
        page_title: this.productForm.name.substring(0, 70),
        meta_desc: this.commonService.stripHtml(this.productForm.description).substring(0, 320)
      };
    }
    if(this.commonService.ys_features.indexOf('limited_products')!=-1) this.productForm.limited_products = environment.limited_product_count;
    if(!this.productForm.image_tag_status) {
      this.productForm.image_list.forEach(obj => { delete obj.tag; });
    }
    // img badges
    this.productForm.badge_list = [];
    if(this.productForm.badge_status) {
      this.imgTagList.forEach(obj => {
        if(obj.checked) this.productForm.badge_list.push(obj._id);
      });
    }
    // add product
    this.api.ADD_PRODUCT(this.productForm).subscribe(result => {
      this.updateDeployStatus();
      this.btnLoader = false;
      if(result.status) {
        if(this.brochForm.src) this.onUploadBrocure(result._id);
        this.router.navigate(['/products']);
      }
      else {
        this.productForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUploadBrocure(prodId) {
    let fileData: FormData = new FormData();
    fileData.append('attachment', this.brochForm.src);
    fileData.append('data', JSON.stringify({ _id: prodId }));
    this.api.UPLOAD_BROCHURE(fileData).subscribe(result => {
      if(!result.status) console.log("response", result);
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

  /* Common Functions */
  onChangeVendor(vendorId) {
    this.api.VENDOR_FEATURES(vendorId).subscribe(result => {
      if(result.status) this.setVendorInfo(result.data);
      else {
        console.log("response", result);
        this.addonList = []; this.faqList = []; this.sizeCharts = []; this.tagList = [];
      }
    });
  }
  setVendorInfo(vInfo) {
    this.addonList = vInfo.addon_list.filter(obj => obj.status=='active');
    this.faqList = vInfo.faq_list.filter(el => el.status=='active');
    this.sizeCharts = vInfo.size_chart.filter(el => el.status=='active');
    // foot notes
    this.noteList = [];
    vInfo.footnote_list.forEach(el => { this.noteList.push(el); });
    this.productFeatures.footnote_list.forEach(el => { this.noteList.push(el); });
    // product tags
    this.tagList = [];
    this.productFeatures.tag_list.filter(obj => obj.status=='active').forEach(obj => {
      obj.option_list = [];
      let vtIndex = obj.vendor_list.findIndex(v => v.vendor_id==vInfo._id);
      if(vtIndex!=-1) {
        obj.option_list = obj.vendor_list[vtIndex].option_list;
        this.tagList.push(obj);
      }
    });
  }

  fileChangeListener(elemName, event) {
    delete this.selectedImage;
    this.croppedImage = {}; this.resizeForm = {};
    if(event.target.files && event.target.files[0]) {
      let sizekb = event.target.files[0].size/1024;
      let myReader: FileReader = new FileReader();
      myReader.onload = (event: ProgressEvent) => {
        this.croppedImage.original = (<FileReader>event.target).result;
        this.selectedImage = (<FileReader>event.target).result;
        let imgTag: any = new Image();
        imgTag.src = (<FileReader>event.target).result;
        imgTag.onload = () => {
          this.resizeForm.width = imgTag.width;
          this.resizeForm.height = imgTag.height;
          this.imgAlgorithm(sizekb);
        }
      };
      myReader.readAsDataURL(event.target.files[0]);
      document.getElementById('imageModal').click();
      let el: any = document.getElementById(elemName);
      if(el) el.value = "";
    }
  }
  onCrop(cropper: ImageCropperComponent) {
    let tempImage = new Image();
    tempImage.src = this.croppedImage.original;
    cropper.setImage(tempImage);
  }
  saveImage() {
    let objData: any = { img_change: true };
    if(this.cropStatus) objData.image = this.croppedImage?.image;
    else {
      objData.resize_config = this.resizeForm;
      objData.image = this.selectedImage;
    }
    // set image
    if(this.imgType=='product') {
      if(this.imgIndex) this.productForm.image_list[this.imgIndex-1] = objData;
      else this.productForm.image_list.push(objData);
    }
    else if(this.imgType=='video') {
      this.productForm.video_details = objData;
    }
    else if(this.imgType=='variant') {
      if(this.imgIndex) this.productForm.variant_list[this.varIndex].image_list[this.imgIndex-1] = objData;
      else this.productForm.variant_list[this.varIndex].image_list.push(objData);
    }
  }
  imgAlgorithm(sizekb) {
    let ratio = this.resizeForm.height/this.resizeForm.width;
    let customValue = (sizekb/(this.resizeForm.width*this.resizeForm.height))*100000;
    let compression = 97.005769-(0.399058*customValue);
    this.resizeForm.quality = parseFloat(compression.toFixed(0));
    if(this.resizeForm.width === this.resizeForm.height) {
      this.resizeForm.crop_width = this.imgWidth;
      this.resizeForm.crop_height = this.imgWidth;
    }
    else if(this.resizeForm.width > this.resizeForm.height) {
      this.resizeForm.crop_width = this.imgWidth;
      this.resizeForm.crop_height = this.imgWidth/this.resizeForm.width*this.resizeForm.height;
    }
    else if(this.resizeForm.width < this.resizeForm.height) {
      if(ratio <= 1.177) {
        this.resizeForm.crop_width = this.imgWidth;
        this.resizeForm.crop_height = this.imgWidth/this.resizeForm.width*this.resizeForm.height;
      }
      else {
        this.resizeForm.crop_width = this.imgHeight/this.resizeForm.height*this.resizeForm.width;
        this.resizeForm.crop_height = this.imgHeight; 
      }
    }
    else console.log("ratio", ratio);
    this.resizeForm.crop_width = parseFloat(this.resizeForm.crop_width.toFixed(0));
    this.resizeForm.crop_height = parseFloat(this.resizeForm.crop_height.toFixed(0));
  }

  selectAllAddons(value) {
    this.addonList.forEach(object => {
      object.addon_checked = value;
    });
  }
  
  discountCalc(x) {
    let discPercentage = 0;
    if(x.disc_percentage && x.disc_percentage!='') discPercentage = x.disc_percentage;
    if(x.variant_types.length) {
      x.variant_list.forEach(object => {
        let sellPrice = 0;
        if(object.selling_price && object.selling_price!='') sellPrice = object.selling_price;
        object.discounted_price = this.discountFormula(sellPrice, discPercentage);
      });
    }
    else {
      let sellPrice = 0;
      if(x.selling_price && x.selling_price!='') sellPrice = x.selling_price;
      x.discounted_price = this.discountFormula(sellPrice, discPercentage);
    }
  }

  discountFormula(price, percentage) {
    let discAmt: any = (price * (percentage/100)).toFixed(2);
    let discountedPrice = 0;
    if(parseFloat(price) >= discAmt) discountedPrice = price - discAmt;
    return discountedPrice;
  }

  onAddColorOptions(modalName) {
    this.selectedVariantOptions = [];
    this.productForm.variant_types[this.selectedVariantIndex].options.forEach(obj => {
      this.selectedVariantOptions.push({display: obj.display});
    });
    if(!this.selectedVariantOptions.length) this.selectedVariantOptions = [{}];
    this.modalService.open(modalName);
  }
  onSetVariantColors() {
    let newOptions = [];
    this.selectedVariantOptions.forEach(obj => {
      if(newOptions.findIndex(el => el.display==obj.display) == -1) newOptions.push({display: obj.display, value: obj.display});
    });
    this.productForm.variant_types[this.selectedVariantIndex].options = newOptions;
    document.getElementById('closeModal').click();
    this.onCreateVariantList(this.productForm.variant_types);
  }

  onChangeVariant(x) {
    this.productForm.variant_list=[];
    if(x) this.productForm.variant_types=[{ options: [] }];
    else this.productForm.variant_types=[];
  }

  onRemoveVariantType(x, index) {
    x.variant_types.splice(index, 1);
    if(!x.variant_types.length) x.variant_status = false;
    this.onCreateVariantList(x.variant_types);
  }

  onCreateVariantList(variantTypes) {
    this.productForm.variant_list = [];
    if(variantTypes.length===1 && variantTypes[0].options.length) {
      this.oneVariant(variantTypes[0])
    }
    else if(variantTypes.length===2) {
      if(variantTypes[0].options.length && variantTypes[1].options.length)
        this.twoVariant(variantTypes[0], variantTypes[1]);
      else if(variantTypes[0].options.length)
        this.oneVariant(variantTypes[0]);
      else if(variantTypes[1].options.length)
        this.oneVariant(variantTypes[1]);
    }
    else if(variantTypes.length===3) {
      if(variantTypes[0].options.length && variantTypes[1].options.length && variantTypes[2].options.length)
        this.threeVariant(variantTypes[0], variantTypes[1], variantTypes[2]);
      else if(variantTypes[0].options.length && variantTypes[1].options.length)
        this.twoVariant(variantTypes[0], variantTypes[1]);
      else if(variantTypes[0].options.length && variantTypes[2].options.length)
        this.twoVariant(variantTypes[0], variantTypes[2]);
      else if(variantTypes[1].options.length && variantTypes[2].options.length)
        this.twoVariant(variantTypes[1], variantTypes[2]);
      else if(variantTypes[0].options.length)
        this.oneVariant(variantTypes[0]);
      else if(variantTypes[1].options.length)
        this.oneVariant(variantTypes[1]);
      else if(variantTypes[2].options.length)
        this.oneVariant(variantTypes[2]);
    }
  }

  oneVariant(variantOne) {
    variantOne.options.forEach(objectOne => {
      let objData: any = {
        variants: [objectOne.value],
        [variantOne.name]: objectOne.value
      };
      if(this.primary_tax) objData.taxrate_id = this.primary_tax;
      if(this.productForm.sku) objData.sku = this.productForm.sku;
      this.productForm.variant_list.push(objData);
    });
  }
  twoVariant(variantOne, variantTwo) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        let objData: any = {
          variants: [objectOne.value, objectTwo.value],
          [variantOne.name]: objectOne.value,
          [variantTwo.name]: objectTwo.value
        };
        if(this.primary_tax) objData.taxrate_id = this.primary_tax;
        if(this.productForm.sku) objData.sku = this.productForm.sku;
        this.productForm.variant_list.push(objData);
      });
    });
  }
  threeVariant(variantOne, variantTwo, variantThree) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        variantThree.options.forEach(objectThree => {
          let objData: any = {
            variants: [objectOne.value, objectTwo.value, objectThree.value],
            [variantOne.name]: objectOne.value,
            [variantTwo.name]: objectTwo.value,
            [variantThree.name]: objectThree.value
          };
          if(this.primary_tax) objData.taxrate_id = this.primary_tax;
          if(this.productForm.sku) objData.sku = this.productForm.sku;
          this.productForm.variant_list.push(objData);
        });
      });
    });
  }

  timePicker(i, j, variable) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.productForm.available_days[i].opening_hrs[j][variable] = this.commonService.timeConversion(time);
    });
  }

  onAddCatalog() {
    if(!this.intForm.social_media_status) this.intForm.social_media_links = [];
    if(!this.intForm.content_status) this.intForm.content_details = {};
    this.api.ADD_CATALOG(this.intForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.api.CATALOG_LIST().subscribe(result => {
          if(result.status) {
            this.commonService.catalog_list = result.list;
            this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
            this.commonService.catalog_list.forEach(element => {
              element.selected = false;
              if(this.categoryList.findIndex(obj => obj.selected && obj._id==element._id) != -1) element.selected = true;
            });
            this.categoryList = this.commonService.catalog_list;
          }
          else console.log("response", result);
        });
      }
      else {
        this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onUpdateTag() {
    let newOptionList = []; let selectedTag = this.intForm.selected_tag;
    selectedTag.option_list.forEach(element => { newOptionList.push(element); });
    this.intForm.option_list.forEach(element => { newOptionList.push(element); });
    let formData = {
      _id: selectedTag._id, name: selectedTag.name, rank: selectedTag.rank,
      prev_rank: selectedTag.prev_rank, status: selectedTag.status, option_list: newOptionList
    };
    this.peApi.UPDATE_TAG(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        let newTagIndex = result.list.findIndex(obj => obj._id==formData._id);
        if(newTagIndex!=-1) {
          let updatedOptList = result.list[newTagIndex].option_list;
          updatedOptList.forEach(element => {
            let optIndex = newOptionList.findIndex(obj => obj.tag_option_checked && obj.name==element.name);
            if(optIndex!=-1) element.tag_option_checked = true;
          });
          let tIndex = this.tagList.findIndex(obj => obj._id==formData._id);
          if(tIndex!=-1) this.tagList[tIndex].option_list = updatedOptList;
        }
      }
      else {
				this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }
  onUpdateNote() {
    let newOptionList = []; let selectedNote = this.intForm.selected_note;
    selectedNote.option_list.forEach(element => { newOptionList.push(element); });
    this.intForm.option_list.forEach(element => { newOptionList.push(element); });
    let formData = {
      _id: selectedNote._id, name: selectedNote.name, rank: selectedNote.rank,
      prev_rank: selectedNote.prev_rank, option_list: newOptionList
    };
    this.peApi.UPDATE_FOOTNOTE(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        let newNoteIndex = result.list.findIndex(obj => obj._id==formData._id);
        if(newNoteIndex!=-1) {
          let updatedOptList = result.list[newNoteIndex].option_list;
          let nIndex = this.noteList.findIndex(obj => obj._id==formData._id);
          if(nIndex!=-1) this.noteList[nIndex].option_list = updatedOptList;
        }
      }
      else {
				this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  changeVariantNameSelect(x) {
    delete x.name;
    if(x.variant_names!='custom_name') x.name = x.variant_names;
    this.onCreateVariantList(this.productForm.variant_types);
  }

  handleFileInput(files: FileList) {
    this.brochForm.src = files[0];
  }

}
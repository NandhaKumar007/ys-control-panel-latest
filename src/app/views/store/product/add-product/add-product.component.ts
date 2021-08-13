import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { StoreApiService } from '../../../../services/store-api.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { ProductExtrasApiService } from '../../product-extras/product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  animations: [SharedAnimations]
})

export class AddProductComponent implements OnInit {

  maxRank: any = 0;
  productForm: any; step_num: any;
  pageLoader: boolean; btnLoader: boolean;
  categoryList = this.commonService.catalog_list;
  addonList: any; tagList: any; noteList: any; taxRates: any;
  sizeCharts: any; faqList: any; taxonomyList: any; aiStyleList: any;
  cropperSettings: CropperSettings; imageIndex: any;
  imgWidth: any; imgHeight: any; primary_tax: any;
  image_count: number = environment.default_img_count;

  @ViewChild('cropper', {static: false}) cropper:ImageCropperComponent;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService, private peApi: ProductExtrasApiService,
    public commonService: CommonService, private customerApi: CustomerApiService, private atp: AmazingTimePickerService
  ) {
    let resolution = this.commonService.store_details.additional_features.cropper_resolution.split("x");
    this.imgWidth = resolution[0]; this.imgHeight = resolution[1];
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.croppedWidth = this.imgWidth; this.cropperSettings.croppedHeight = this.imgHeight;
    this.cropperSettings.canvasWidth = this.imgWidth; this.cropperSettings.canvasHeight = this.imgHeight;
    this.cropperSettings.width = this.imgWidth; this.cropperSettings.height = this.imgHeight;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.noFileInput = true;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.aiStyleList = [];
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
      this.addonList = []; this.tagList = []; this.noteList = []; this.taxRates = []; this.sizeCharts = []; this.taxonomyList = [];
      // product features
      this.api.PRODUCT_FEATURES().subscribe(result => {
        if(result.status) {
          this.addonList = result.data.addon_list.filter(obj => obj.status=='active');
          this.tagList = result.data.tag_list.filter(obj => obj.status=='active');
          this.noteList = result.data.footnote_list;
          this.faqList = result.data.faq_list.filter(obj => obj.status=='active');
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
          this.sizeCharts = result.data.size_chart.filter(obj => obj.status=='active');
          this.taxonomyList = result.data.taxonomy.filter(obj => obj.status=='active');
          if(this.taxonomyList.length) this.productForm.taxonomy_id = this.taxonomyList[0]._id;
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
    // addons
    this.productForm.addon_list = [];
    if(this.productForm.addon_status) {
      this.addonList.forEach(object => {
        if(object.addon_checked) this.productForm.addon_list.push({ addon_id: object._id });
      });
    }
    if(!this.productForm.addon_status || !this.addonList.length) this.productForm.addon_must = false;
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
          section.option_list.forEach(option => {
            if(option.aistyle_option_checked) optionArray.push(option._id);
          });
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
    // add product
    this.api.ADD_PRODUCT(this.productForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        this.router.navigate(['/products']);
      }
      else {
        this.productForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  /* Common Functions */
  fileChangeListener(index, $event, cropper: ImageCropperComponent) {
    this.imageIndex = index;
    this.productForm.image_list[index].img_change = true;
    let tempImage = new Image();
    let file:File = $event.target.files[0];
    let myReader:FileReader = new FileReader();
    myReader.onloadend = function (loadEvent: any) {
      tempImage.src = loadEvent.target.result;
      cropper.setImage(tempImage);
    };
    myReader.readAsDataURL(file);
  }
  variantFileChangeListener(parentIndex, childIndex, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.productForm.variant_list[parentIndex].image_list[childIndex].image = (<FileReader>event.target).result;
        this.productForm.variant_list[parentIndex].image_list[childIndex].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  videoFileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let myReader:FileReader = new FileReader();
      myReader.onload = (event: ProgressEvent) => {
        this.productForm.video_details.image = (<FileReader>event.target).result;
        this.productForm.video_details.img_change = true;
      }
      myReader.readAsDataURL(event.target.files[0]);
    }
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
      if(this.primary_tax) {
        this.productForm.variant_list.push({
          variants: [objectOne.value],
          [variantOne.name]: objectOne.value,
          taxrate_id: this.primary_tax
        });
      }
      else {
        this.productForm.variant_list.push({
          variants: [objectOne.value],
          [variantOne.name]: objectOne.value
        });
      }
    });
  }
  twoVariant(variantOne, variantTwo) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        if(this.primary_tax) {
          this.productForm.variant_list.push({
            variants: [objectOne.value, objectTwo.value],
            [variantOne.name]: objectOne.value,
            [variantTwo.name]: objectTwo.value,
            taxrate_id: this.primary_tax
          });
        }
        else {
          this.productForm.variant_list.push({
            variants: [objectOne.value, objectTwo.value],
            [variantOne.name]: objectOne.value,
            [variantTwo.name]: objectTwo.value
          });
        }
      });
    });
  }
  threeVariant(variantOne, variantTwo, variantThree) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        variantThree.options.forEach(objectThree => {
          if(this.primary_tax) {
            this.productForm.variant_list.push({
              variants: [objectOne.value, objectTwo.value, objectThree.value],
              [variantOne.name]: objectOne.value,
              [variantTwo.name]: objectTwo.value,
              [variantThree.name]: objectThree.value,
              taxrate_id: this.primary_tax
            });
          }
          else {
            this.productForm.variant_list.push({
              variants: [objectOne.value, objectTwo.value, objectThree.value],
              [variantOne.name]: objectOne.value,
              [variantTwo.name]: objectTwo.value,
              [variantThree.name]: objectThree.value
            });
          }
        });
      });
    });
  }

  clearIdValue(idName) {
    let el: any = document.getElementById(idName);
    el.value = "";
  }

  timePicker(i, j, variable) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.productForm.available_days[i].opening_hrs[j][variable] = this.timeConversion(time);
    });
  }
  timeConversion(timeString) {
    var H = timeString.substr(0, 2);
    var convertedTime = (H % 12) || 12;
    var h = convertedTime < 10 ? "0"+ convertedTime : convertedTime;
    var ampm = H < 12 ? " AM" : " PM";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }

}
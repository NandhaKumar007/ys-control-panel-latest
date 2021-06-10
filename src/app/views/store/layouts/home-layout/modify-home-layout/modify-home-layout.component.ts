import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-modify-home-layout',
  templateUrl: './modify-home-layout.component.html',
  styleUrls: ['./modify-home-layout.component.scss']
})

export class ModifyHomeLayoutComponent implements OnInit {

  productList: any = []; layoutDetails: any = {};
  btnLoader: boolean; pageLoader: boolean; params: any;
  imgBaseUrl = environment.img_baseurl;
  positionList: any = [
    { name: "Top Left", value: "t_l" }, { name: "Top Center", value: "t_c" }, { name: "Top Right", value: "t_r" },
    { name: "Middle Left", value: "m_l" }, { name: "Middle Center", value: "m_c" }, { name: "Middle Right", value: "m_r" },
    { name: "Bottom Left", value: "b_l" }, { name: "Bottom Center", value: "b_c" }, { name: "Bottom Right", value: "b_r" }
  ];
  grid_details: any = {};
  shopping_assist_config: any;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.btnLoader = false; this.params = params
      // layout details
      this.api.LAYOUT_DETAILS(this.params.layout_id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.layoutDetails = result.data;
          if(this.layoutDetails.type=='section') {
            let gridIndex = this.commonService.grid_list.findIndex(obj => obj.type==this.layoutDetails.section_grid_type);
            if(gridIndex!=-1) {
              this.grid_details = this.commonService.grid_list[gridIndex];
              if(!this.layoutDetails.image_list.length) {
                for(let i=1; i<=this.grid_details.resolutions.length; i++) this.layoutDetails.image_list.push({ rank: i });
              }
            }
            else if(!this.layoutDetails.image_list.length) this.layoutDetails.image_list.push({ rank: 1 });
          }
          else if(this.layoutDetails.type=='testimonial') {
            if(!this.layoutDetails.image_list.length) this.layoutDetails.image_list.push({ rank: 1, content_details: {} });
          }
          else if(this.layoutDetails.type=='shopping_assistant') {
            this.shopping_assist_config = this.layoutDetails.shopping_assistant_config;
            if(this.shopping_assist_config.image) this.shopping_assist_config.exist_image = this.shopping_assist_config.image;
            if(!this.shopping_assist_config.changing_text.length) this.shopping_assist_config.changing_text = [{ value: ''}];
          }
          else if(!this.layoutDetails.image_list.length) {
            if(this.layoutDetails.type=='multiple_highlighted_section') this.layoutDetails.image_list.push({ rank: 1, content_status: true, content_details: {} });
            else this.layoutDetails.image_list.push({ rank: 1, points_list: [] });
          }
          // product list
          this.api.PRODUCT_LIST({ category_id: 'all' }).subscribe(result => {
            if(result.status) this.productList = result.list;
            else console.log("response", result);
          });
        }
        else {
          console.log("response", result);
          this.router.navigateByUrl("/layouts/home");
        }
      });
    });
  }

  addNewImg() {
    if(this.layoutDetails.type=='testimonial') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_details: {} });
    }
    else if(this.layoutDetails.type=='multiple_highlighted_section') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_status: true, content_details: {} });
    }
    else {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1 });
    }
  }

  onUpdateLayout() {
    this.btnLoader = true;
    if(this.layoutDetails.type=='shopping_assistant') this.layoutDetails.shopping_assistant_config = this.shopping_assist_config;
    this.api.UPDATE_LAYOUT_LIST(this.layoutDetails).subscribe(result => {
      if(result.status) {
        this.router.navigate(["/layouts/home"]);
      }
      else {
        this.layoutDetails.errorMsg = result.message;
        console.log("response", result);
      }
      this.btnLoader = false;
    });
  }

  fileChangeListener(devType, index, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        if(devType=='desktop') {
          this.layoutDetails.image_list[index].desktop_img = (<FileReader>event.target).result;
          this.layoutDetails.image_list[index].desktop_img_change = true;
        }
        else {
          this.layoutDetails.image_list[index].mobile_img = (<FileReader>event.target).result;
          this.layoutDetails.image_list[index].mobile_img_change = true;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  shopAssistFileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.shopping_assist_config.image = (<FileReader>event.target).result;
        this.shopping_assist_config.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
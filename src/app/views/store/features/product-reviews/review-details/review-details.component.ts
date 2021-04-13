import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss'],
  animations: [SharedAnimations]
})

export class ReviewDetailsComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  reviewDetails: any = {}; selectedReview: any = {};
  imgBaseUrl = environment.img_baseurl;
  deleteForm: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute,
    private api: FeaturesApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      if(localStorage.getItem("review_filter")) {
        let filterForm: any = JSON.parse(localStorage.getItem("review_filter"));
        filterForm.id = params.id;
        this.pageLoader = true;
        this.api.REVIEWED_PRODUCT_LIST(filterForm).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            if(result.list.length) this.reviewDetails = result.list[0];
            else this.router.navigate(['/features/product-reviews']);
          }
          else console.log("response", result);
        });
      }
      else this.router.navigate(['/features/product-reviews']);
    });
  }

  updateStatus(x) {
    let reviewStatus = 'active';
    if(x.status=='active') reviewStatus = 'inactive';
    this.api.UPDATE_REVIEW({ product_id: this.reviewDetails.productDetails[0]._id, _id: x._id, status: reviewStatus }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.selectedReview.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onDelete() {
    this.api.DELETE_REVIEW({ product_id: this.reviewDetails.productDetails[0]._id, _id: this.deleteForm._id }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeDeleteModal').click();
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}
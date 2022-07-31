import { Component, OnInit } from '@angular/core';
import { StoreApiService } from 'src/app/services/store-api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})

export class AdDetailsComponent implements OnInit {

  pageLoader: boolean; imgBaseUrl = environment.img_baseurl;
  dayList: any = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  adForm: any = {}; layoutDetails: any = {}; disabledDates: any = [];
  normalDay: any = []; peakDay: any = [];
  dispNormDay: any = []; dispPeakDay: any = [];
  totalNday: number = 0; totalPday: number = 0;

  constructor(private api: StoreApiService, private router: Router, private activeRoute: ActivatedRoute, public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      if(params.id) {
        this.pageLoader = true; this.adForm= {};
        this.api.LAYOUT_DETAILS(params.id, true).subscribe((result) => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if (result.status) {
            this.layoutDetails = result.data.ad_config;
            if(this.layoutDetails.schedule_status && this.layoutDetails.schedule_from && this.layoutDetails.schedule_to) {
              this.findDisableDays(this.layoutDetails.schedule_from, this.layoutDetails.schedule_to);
            }
            // store ad config
            this.normalDay = result.ad_config?.normal_days;
            this.peakDay = result.ad_config?.peak_days;
            this.normalDay.forEach(el => {
              this.dispNormDay.push(this.dayList[el]);
            });
            this.peakDay.forEach(el => {
              this.dispPeakDay.push(this.dayList[el]);
            });
          }
          else console.log("response", result);
        });
      }
      else this.router.navigate(['/features/ad-management'])
    });
  }

  onBook() {
    if(this.adForm.total_price) {
      console.log(this.adForm);
    }
    else {
      this.findDayCount(new Date(this.adForm.from_date), new Date(this.adForm.to_date));
      this.adForm.total_price = (this.totalNday * this.layoutDetails.normal_price)+(this.totalPday * this.layoutDetails.peak_price);
    }
  }

  fileChangeListener(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.adForm.image = (<FileReader>event.target).result;
        this.adForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  findDisableDays(start, end) {
    for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      this.disabledDates.push(new Date(dt));
    }
  }
  findDayCount(start, end) {
    for(let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      let dayCode = dt.getDay();
      if(this.normalDay.indexOf(dayCode) != -1) this.totalNday++;
      if(this.peakDay.indexOf(dayCode) != -1) this.totalPday++;
    }
  }

}
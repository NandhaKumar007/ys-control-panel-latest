import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { StoreApiService } from 'src/app/services/store-api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from '../../../../../environments/environment';
import { id } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-ad-management',
  templateUrl: './ad-management.component.html',
  styleUrls: ['./ad-management.component.scss'],
  animations: [SharedAnimations],
  providers: [AmazingTimePickerService]
})

export class AdManagementComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl;
  list: any = []; segmentList:any = [];
  adForm:any = {}; settingForm: any = {}; deleteForm:any = {};
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public api: StoreApiService,
    private atp: AmazingTimePickerService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true; this.list = []; this.segmentList = [];
    this.api.LAYOUT_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        result.list = result.list.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1));
        // highlights
        result.list.filter(el => el.type=='highlights').forEach(el => {
          if(el.ad_status) {
            el.ad_name = el.ad_config?.name;
            this.list.push(el);
          }
          else this.segmentList.push({ _id: el._id, type: el.type, name: el.name });
        });
        // except highlights
        result.list.filter(el => el.type!='highlights').forEach(el => {
          if(el.ad_status) {
            el.ad_name = el.ad_config?.name;
            this.list.push(el);
          }
          else this.segmentList.push({ _id: el._id, type: el.type, name: el.name });
        });
      }
      else console.log("response", result);
    });
  }

  onEdit(x, modalName) {
    this.adForm = { _id: x._id, layout_name: x.name };
    if(!x.ad_config) { x.ad_config = {}; }
    for(let key in x.ad_config) {
      if(x.ad_config.hasOwnProperty(key)) this.adForm[key] = x.ad_config[key];
    }
    if(this.adForm.schedule_from) this.adForm.schedule_from = new Date(this.adForm.schedule_from);
    if(this.adForm.schedule_to) this.adForm.schedule_to = new Date(this.adForm.schedule_to);
    this.modalService.open(modalName, {size: 'lg'});
  }

  onSubmit() {
    this.adForm.submit = true;
    if(this.adForm.form_type=='add') {
      this.api.ADD_AD(this.adForm).subscribe((result) => {
        this.adForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.adForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_AD(this.adForm).subscribe((result) => {
        this.adForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.adForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onUpdateStatus() {
    this.api.UPDATE_AD({ _id: this.deleteForm._id, change_status: true }).subscribe((result) => {
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

  onDelete() {
    this.api.REMOVE_AD({ _id: this.deleteForm._id }).subscribe((result) => {
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

  onGetSettingDetails(modalName) {
    this.settingForm = {
      normal_days: [
        { code: 0, day: "Sunday" }, { code: 1, day: "Monday" },
        { code: 2, day: "Tuesday" }, { code: 3, day: "Wednesday" },
        { code: 4, day: "Thursday" }, { code: 5, day: "Friday" },
        { code: 6, day: "Saturday" }
      ],
      peak_days: [
        { code: 0, day: "Sunday" }, { code: 1, day: "Monday" },
        { code: 2, day: "Tuesday" }, { code: 3, day: "Wednesday" },
        { code: 4, day: "Thursday" }, { code: 5, day: "Friday" },
        { code: 6, day: "Saturday" }
      ]
    };
    this.api.AD_SETTING({}).subscribe((result) => {
      if(result.status) {
        if(result.data?.normal_days) {
          this.settingForm.normal_days.forEach(el => {
            if(result.data.normal_days.findIndex(obj => obj.code===el.code) != -1) el.active = true;
          })
        }
        if(result.data?.peak_days) {
          this.settingForm.peak_days.forEach(el => {
            if(result.data.peak_days.findIndex(obj => obj.code===el.code) != -1) el.active = true;
          })
        }
        if(result.data?.start_time) this.settingForm.start_time = result.data.start_time;
        if(result.data?.end_time) this.settingForm.end_time = result.data.end_time;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  onUpdateSetting() {
    let formData = {
      normal_days: this.settingForm.normal_days.filter(obj => obj.active),
      peak_days: this.settingForm.peak_days.filter(obj => obj.active),
      start_time: this.settingForm.start_time, end_time: this.settingForm.end_time
    };
    this.settingForm.submit = true;
    this.api.AD_SETTING({ ad_config: formData }).subscribe((result) => {
      this.settingForm.submit = false;
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onDaySelect(dayList, dayCode) {
    let dIndex = dayList.findIndex(obj => obj.code==dayCode && obj.active);
    if(dIndex!=-1) dayList[dIndex].active = false;
  }
  timePicker(x) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.settingForm[x] = this.commonService.timeConversion(time);
    });
  }
  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.adForm.image = (<FileReader>event.target).result;
        this.adForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
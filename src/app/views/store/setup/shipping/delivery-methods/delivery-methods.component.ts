import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { SetupService } from '../../setup.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-delivery-methods',
  templateUrl: './delivery-methods.component.html',
  styleUrls: ['./delivery-methods.component.scss'],
  animations: [SharedAnimations]
})

export class DeliveryMethodsComponent implements OnInit {

  params: any;
  deliveryForm: any;
  pageLoader: boolean;
  list: any = []; btnLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: SetupService, private atp: AmazingTimePickerService,
    private router: Router, private activeRoute: ActivatedRoute, public commonService:CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.api.DELIVERY_METHODS().subscribe(result => {
        if(result.status) {
          this.deliveryForm = result.data;
          this.deliveryForm.list.forEach(list => {
            if(list.status=='active') list.list_checked = true;
            list.groups.forEach(group => {
              if(group.status=='active') group.group_checked = true;
              group.slots.forEach(slot => { if(slot.status=='active') slot.slot_checked = true; });
            });
          });
        }
        else {
          this.list = [];
          this.deliveryForm = {
            available_days: [
              { code: 0, day: "Sunday", active: false }, { code: 1, day: "Monday", active: false },
              { code: 2, day: "Tuesday", active: false }, { code: 3, day: "Wednesday", active: false },
              { code: 4, day: "Thursday", active: false }, { code: 5, day: "Friday", active: false },
              { code: 6, day: "Saturday", active: false }
            ],
            list: [
              {
                list_checked: true,
                groups: [
                  {
                    group_checked: true,
                    delay_type: "hour",
                    slots: [{ slot_checked: true }]
                  }
                ]
              }
            ]
          };
          console.log("response", result);
        }
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onUpdate() {
    this.api.UPDATE_DELIVERY_METHODS(this.deliveryForm).subscribe(result => {
      if(result.status) this.router.navigate(['/shipping/delivery-methods']);
      else {
        this.deliveryForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  timePicker(i, j, k, paramName) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.deliveryForm.list[i].groups[j].slots[k][paramName] = this.timeConversion(time);
    });
  }
  secondaryTimePicker(i, j, paramName) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.deliveryForm.list[i].groups[j][paramName] = this.timeConversion(time);
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
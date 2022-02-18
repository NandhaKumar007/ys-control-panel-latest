import { Component, HostListener } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  @HostListener('window:scroll', ['$event'])
  getScrollPosition() {
    this.commonService.scroll_y_pos = window.pageYOffset;
    this.commonService.screen_width = window.innerWidth;
  }

  constructor(private commonService: CommonService, private deviceService: DeviceDetectorService) {
    this.getScrollPosition();
    if(localStorage.getItem("darkSwitch")) {
      this.commonService.dark_theme = true;
      document.body.setAttribute("data-theme", "true");
    }
    // device type
    if(this.deviceService.isDesktop()) this.commonService.desktop_device = true;
    else {
      let iosPlatforms = ["iPad", "iPhone", "iPod", "iPod touch"];
      if(iosPlatforms.indexOf(navigator.platform) != -1) this.commonService.ios = true;
    }
  }

}
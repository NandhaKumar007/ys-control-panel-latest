import { Component, HostListener } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from './services/common.service';
import { environment } from '../environments/environment';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';

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

  constructor(config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private deviceService: DeviceDetectorService) {
    config.backdrop = 'static'; config.keyboard = false;
    this.getScrollPosition();
    if(localStorage.getItem("darkSwitch")) {
      this.commonService.dark_theme = true;
      document.body.setAttribute("data-theme", "true");
    }
    // device type
    if(this.deviceService.isDesktop()) this.commonService.desktop_device = true;
    let iosPlatforms = ["iPad", "iPhone", "iPod", "iPod touch"];
    if(iosPlatforms.indexOf(navigator.platform) != -1) this.commonService.ios = true;
  }

  ngOnInit() {
    if(environment.keep_login) {
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then(result => {
        if(result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        sessionStorage.setItem("app_token", token.value);
      });

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError', (error: any) => {
        // alert('Error on registration: ' + JSON.stringify(error));
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        // alert('Push received: ' + JSON.stringify(notification));
      });

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        // alert('click: ' + JSON.stringify(notification));
      });
    }
  }

}
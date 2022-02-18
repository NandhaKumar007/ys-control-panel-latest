import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
declare const $: any;

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})

export class WelcomeScreenComponent implements OnInit {

  interval: any;
  timer: number = 5;
  installApp: boolean;
  deferredPrompt: any;
  @HostListener('window:beforeinstallprompt', ['$event'])
  onMessage(event) {
    console.log("----event", event);
    this.deferredPrompt = event;
    // document.getElementById("openAppPrompt").click();
  }

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.timer--;
      if(this.timer===0) {
        clearInterval(this.interval);
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if(this.interval) clearTimeout(this.interval);
  }

}
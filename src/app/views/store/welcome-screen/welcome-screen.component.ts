import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})

export class WelcomeScreenComponent implements OnInit {

  interval: any;
  timer: number = 5;

  constructor(private router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.timer--;
      if(this.timer===0) {
        clearInterval(this.interval);
        this.router.navigate(['/dashboard']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if(this.interval) clearTimeout(this.interval);
  }

}
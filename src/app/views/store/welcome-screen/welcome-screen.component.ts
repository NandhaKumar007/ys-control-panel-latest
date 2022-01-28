import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})

export class WelcomeScreenComponent implements OnInit {

  params: any;
  timer: number = 5;

  constructor(private router: Router, private activeRoute: ActivatedRoute, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      if(this.params.type=='activation') {
        let interval = setInterval(() => {
          this.timer--;
          if(this.timer===0) {
            clearInterval(interval);
            this.router.navigate(['/dashboard']);
          }
        }, 1000);
      }
      else if(this.params.type=='website') {
        setTimeout(() => { this.router.navigate(['/dashboard']); }, 10000);
      }
      else this.router.navigate(['/dashboard']);
    });
  }

}
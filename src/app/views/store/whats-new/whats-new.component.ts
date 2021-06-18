import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.scss']
})

export class WhatsNewComponent implements OnInit {

  constructor(private api: ApiService, private commonService: CommonService) { }

  ngOnInit(): void {
    if(!localStorage.getItem("country_list")) {
      let countryList: any = [];
      this.api.COUNTRIES_LIST().subscribe(result => {
        if(result.status) countryList = result.list;
        this.commonService.country_list = countryList;
        this.commonService.updateLocalData('country_list', countryList);
      });
    }
  }

}
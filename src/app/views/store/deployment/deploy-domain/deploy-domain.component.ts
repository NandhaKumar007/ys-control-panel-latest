import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-deploy-domain',
  templateUrl: './deploy-domain.component.html',
  styleUrls: ['./deploy-domain.component.scss']
})

export class DeployDomainComponent implements OnInit {

  domainForm: any; buyForm: any;
  providerList: any = [
    { name: "GoDaddy" },
    { name: "Namecheap" },
    { name: "Hostgator" },
    { name: "Cloudflare" },
    { name: "Big Rock" },
    { name: "ResellerClub" },
    { name: "Bluehost" },
    { name: "Domain.com" },
    { name: "Google Domains" },
    { name: "Enom" },
    { name: "Others" }
  ];

  constructor(public commonService: CommonService, private storeApi: StoreApiService, private config: NgbModalConfig, public modalService: NgbModal) {
    config.backdrop = 'static';
  }

  ngOnInit(): void {
    this.buyForm = {};
    this.domainForm = { provider: 'GoDaddy' };
  }

  onConnectDomain() {
    this.domainForm.submit = true;
    let formData = { form_type: 'connect_domain', provider: this.domainForm.provider, domain: this.domainForm.domain };
    if(this.domainForm.provider=='Others') formData.provider = this.domainForm.other_provider;
    this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
      this.domainForm.submit = false;
      this.domainForm.success = true;
      setTimeout(() => { delete this.domainForm.success }, 3000);
      if(!result.status) console.log("response", result);
    });
  }

  onBuyDomain() {
    this.buyForm.submit = true;
    let formData = { form_type: 'buy_domain', domain: this.buyForm.buy_domain };
    this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
      this.buyForm.submit = false;
      this.buyForm.success = true;
      setTimeout(() => { delete this.buyForm.success }, 3000);
      if(!result.status) console.log("response", result);
    });
  }

}
import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
  selector: 'app-deploy-domain',
  templateUrl: './deploy-domain.component.html',
  styleUrls: ['./deploy-domain.component.scss']
})

export class DeployDomainComponent implements OnInit {

  domainForm: any;
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

  constructor(private storeApi: StoreApiService, private config: NgbModalConfig, public modalService: NgbModal) {
    config.backdrop = 'static';
  }

  ngOnInit(): void {
    this.domainForm = { provider: 'GoDaddy' };
  }

  onConnectDomain() {
    this.domainForm.submit = true;
    let formData = { form_type: 'connect_domain', provider: this.domainForm.provider, domain: this.domainForm.domain };
    if(this.domainForm.provider=='Others') formData.provider = this.domainForm.other_provider;
    this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
      this.domainForm.submit = false;
      if(result.status) console.log("response", result);
      else console.log("response", result);
    });
  }

  onBuyDomain() {
    this.domainForm.modal_submit = true;
    let formData = { form_type: 'buy_domain', domain: this.domainForm.buy_domain };
    this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
      this.domainForm.modal_submit = false;
      if(result.status) console.log("response", result);
      else console.log("response", result);
    });
  }

}
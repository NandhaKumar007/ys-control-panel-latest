import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';

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
  configData: any = environment.config_data;

  constructor(public commonService: CommonService, private storeApi: StoreApiService, private config: NgbModalConfig, public modalService: NgbModal) {
    config.backdrop = 'static';
  }

  ngOnInit(): void {
    this.domainForm = { provider: '' };
    if(localStorage.getItem("connect_domain")) this.domainForm = JSON.parse(localStorage.getItem("connect_domain"));
    this.buyForm = {};
    if(localStorage.getItem("buy_domain")) this.buyForm = JSON.parse(localStorage.getItem("buy_domain"));
    if(this.commonService.store_details?.package_details?.package_id==this.configData.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
  }

  onConnectDomain() {
    if(!this.domainForm.success) {
      this.domainForm.submit = true;
      let formData = { form_type: 'connect_domain', provider: this.domainForm.provider, domain: this.domainForm.domain };
      if(this.domainForm.provider=='Others') formData.provider = this.domainForm.other_provider;
      this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
        delete this.domainForm.submit;
        this.domainForm.success = true;
        localStorage.setItem("connect_domain", JSON.stringify(this.domainForm));
        if(!result.status) console.log("response", result);
      });
    }
  }

  onBuyDomain() {
    if(!this.buyForm.success) {
      this.buyForm.submit = true;
      let formData = { form_type: 'buy_domain', domain: this.buyForm.buy_domain };
      this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
        delete this.buyForm.submit;
        this.buyForm.success = true;
        localStorage.setItem("buy_domain", JSON.stringify(this.buyForm));
        if(!result.status) console.log("response", result);
      });
    }
  }

}
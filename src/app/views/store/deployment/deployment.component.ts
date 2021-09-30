import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { DeploymentService } from './deployment.service';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})

export class DeploymentComponent implements OnInit {

  list: any = [
    {
      keyword: "account",
      heading: "Create your account", sub_heading: "",
      description: "",
      duration: "", completed: true, redirect: this.router.url
    },
    {
      keyword: "logo", heading: "Add your logo",
      sub_heading: "",
      description: "",
      duration: "1", completed: false, redirect: "/deployment/logo"
    },
    {
      keyword: "domain", heading: "Setup your domain",
      sub_heading: "",
      description: "Choose your domain or add your domain for your website",
      duration: "5", completed: false, redirect: "/deployment/domain"
    },
    {
      keyword: "home_layouts", heading: "Design your website",
      sub_heading: "Website → Website Design",
      description: "Choose a template and add layouts to your website",
      duration: "5", completed: false, redirect: "/layouts/home"
    },
    {
      keyword: "tax_rates", heading: "Add your taxation",
      sub_heading: "Settings → Tax Rates",
      description: "Create percentage tax rates based on state laws",
      duration: "1", completed: false, redirect: "/product-extras/tax-rates"
    },
    {
      keyword: "products", heading: "List your products",
      sub_heading: "Products → All Products",
      description: "Choose a template and add layouts to your website",
      duration: "1", completed: false, redirect: "/products"
    },
    {
      keyword: "shipping", heading: "Setup shipping methods",
      sub_heading: "Settings → Shipping Methods",
      description: "Select shipping options available to customers at checkout",
      duration: "1", completed: false, redirect: "/shipping/shipping-methods"
    },
    {
      keyword: "payments", heading: "Configure payment collection",
      sub_heading: "Settings → Payment Gateway",
      description: "Choose how people pay at checkout, including credit and debit cards, UPI, cash and more",
      duration: "1", completed: false, redirect: "/setup/payment-gateway"
    },
    {
      keyword: "package", heading: "Choose plan",
      sub_heading: "",
      description: "Choose the right plan for your business",
      duration: "1", completed: false, redirect: "/deployment/plans"
    }
  ];
  pageLoader: boolean;
  completedPercentage: any = 0;

  constructor(private api: DeploymentService, public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.DEPLOY_DETAILS(this.commonService.store_details._id).subscribe(result => {
      if(result.status) {
        let completedCount = 0;
        let deployStages = result.data.deploy_stages;
        this.commonService.deploy_stages = deployStages;
        this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        this.list.forEach(element => {
          if(deployStages[element.keyword] || element.completed) {
            element.completed = true;
            completedCount++;
          }
        });
        this.completedPercentage = ((completedCount*100)/this.list.length).toFixed(1);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

}
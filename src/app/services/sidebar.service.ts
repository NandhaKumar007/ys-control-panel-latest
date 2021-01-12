import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoreApiService } from '../services/store-api.service';
import { CommonService } from '../services/common.service';

export interface IMenuItem {
	id?: string;
	title?: string;
	type: string;       // Possible values: link/dropDown/extLink
	name?: string;      // Used as display text for item and title for separator type
	state?: string;     // Router state
	icon?: string;      // Material icon name
	tooltip?: string;   // Tooltip text
	disabled?: boolean; // If true, item will not be appeared in sidenav.
	sub?: IChildItem[]; // Dropdown items
	badges?: IBadge[];
	active?: boolean;
}

export interface IChildItem {
	id?: string;
	parentId?: string;
	type?: string;
	name: string;       // Display text
	state?: string;     // Router state
	icon?: string;
	sub?: IChildItem[];
	active?: boolean;
}

interface IBadge {
	color: string;      // primary/accent/warn/hex color codes(#fff000)
	value: string;      // Display text
}

interface ISidebarState {
	sidenavOpen?: boolean;
	childnavOpen?: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class SidebarService {

	public sidebarState: ISidebarState = {
		sidenavOpen: true,
		childnavOpen: false
	};

	constructor(private storeApi: StoreApiService, private commonService: CommonService) { }

	BUILD_CATEGORY_LIST() {
		return new Promise((resolve, reject) => {
			this.storeApi.CATALOG_LIST().subscribe(result => {
        this.commonService.catalog_list = [];
        if(result.status) { this.commonService.catalog_list = result.list; }
        this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
			});
		});
  }
  
  getSidePanelList() {
    let routePermissionList = [];
    // whats new
		let sidePanelList: IMenuItem[] = [{ name: "What's New", type: 'link', icon: 'stars', state: '/whats-new' }];
    let ysFeatures = this.commonService.ys_features;
    if(ysFeatures.indexOf('pincode_service') !== -1) routePermissionList.push("pincodes");
    // admin
    if(this.commonService.store_details.login_type == 'admin') {
      routePermissionList.push("dashboard", "customers");
      // dashboard
      sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/dashboard' });
      // product extras
      let prodExtraList: IChildItem[] = [];
      if(ysFeatures.indexOf('measurements') !== -1) {
        prodExtraList.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link' });
        routePermissionList.push("measurements");
      }
      if(ysFeatures.indexOf('addons') !== -1) {
        prodExtraList.push({ name: 'Addons', state: '/product-extras/addons', type: 'link' });
        routePermissionList.push("addons");
      }
      if(ysFeatures.indexOf('product_filters') !== -1) {
        prodExtraList.push({ name: 'Tags', state: '/product-extras/tags', type: 'link' });
        routePermissionList.push("tags");
      }
      if(ysFeatures.indexOf('foot_note') !== -1) {
        prodExtraList.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link' });
        routePermissionList.push("foot_note");
      }
      if(ysFeatures.indexOf('size_chart') !== -1) {
        prodExtraList.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link' });
        routePermissionList.push("size_chart");
      }
      if(ysFeatures.indexOf('faq') !== -1) {
        prodExtraList.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link' });
        routePermissionList.push("faq");
      }
      // products
      routePermissionList.push("catalogs", "products", "product_add", "product_edit");
      let prodList: IChildItem[] = [
        { icon: 'view_carousel', name: 'Catalog Management', state: '/catalogs', type: 'link' },
        { icon: 'category', name: 'All Products', state: '/products', type: 'link' }
      ];
      if(prodExtraList.length) prodList.push({ name: 'Product Extras', type: 'dropDown', icon: 'extension', sub: prodExtraList });
      if(ysFeatures.indexOf('product_archive') !== -1) {
        prodList.push({ icon: 'archive', name: 'Archived Products', state: '/product-extras/archive', type: 'link' });
        routePermissionList.push("product_archive");
      }
      sidePanelList.push({ name: 'Products', type: 'dropDown', icon: 'category', sub: prodList });
      // quotations
      if(this.commonService.store_details.type == 'quot_based' || this.commonService.store_details.type == 'quot_with_order_based') {
        let quotList: IChildItem[] = [
          { icon: 'slow_motion_video', name: 'Live Requests', state: '/quotations/live/all', type: 'link' },
          { icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/quotations/confirmed/all', type: 'link' },
          { icon: 'highlight_off', name: 'Cancelled Requests', state: '/quotations/cancelled/all', type: 'link' },
          { icon: 'no_sim', name: 'Abandoned Quotes', state: '/abandoned-quotes', type: 'link' }
        ];
        if(this.commonService.store_details.type == 'quot_based') quotList.push({ icon: 'supervisor_account', name: 'Customers', state: '/customers', type: 'link' });
        sidePanelList.push({ name: 'Quotations', type: 'dropDown', icon: 'description', sub: quotList });
        routePermissionList.push("quotations", "abandoned_quotes");
      }
      // orders
      if(this.commonService.store_details.type == 'order_based' || this.commonService.store_details.type == 'quot_with_order_based') {
        let orderList: IChildItem[] = [
          { icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' },
          { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' },
          { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' },
          { icon: 'redeem', name: 'Gift Card Orders', state: '/orders/gift-coupon', type: 'link' },
          {
            name: 'Inactive Orders', type: 'dropDown', icon: 'error_outline',
            sub: [
              { name: 'Product', state: '/orders/inactive-orders', type: 'link' },
              { name: 'Gift Card', state: '/orders/inactive-gift-coupons', type: 'link' }
            ]
          },
          { icon: 'remove_shopping_cart', name: 'Abandoned Carts', state: '/abandoned-carts', type: 'link' }
        ];
        if(this.commonService.store_details.type == 'order_based') orderList.push({ icon: 'supervisor_account', name: 'Customers', state: '/customers', type: 'link' });
        sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore', sub: orderList });
        routePermissionList.push("orders", "abandoned_cart", "inactive_orders");
        if(this.commonService.ys_features.indexOf('manual_order')!=-1) routePermissionList.push("manual_order");
      }
      // customers
      if(this.commonService.store_details.type == 'quot_with_order_based') {
        sidePanelList.push({ name: 'Customers', type: 'link', icon: 'supervisor_account', state: '/customers' });
      }
      // marketing tools
      routePermissionList.push("offers");
      let toolList: IChildItem[] = [{ icon: 'local_offer', name: 'Offers', state: '/features/coupon-codes', type: 'link' }];
      if(ysFeatures.indexOf('giftcard') !== -1) {
        toolList.push({ icon: 'redeem', name: 'Gift Cards', state: '/features/giftcard', type: 'link' });
        routePermissionList.push("giftcard", "giftcard_orders");
      }
      if(ysFeatures.indexOf('newsletter') !== -1) {
        toolList.push({ icon: 'mail', name: 'Newsletter', state: '/newsletter', type: 'link' });
        routePermissionList.push("newsletter");
      }
      if(ysFeatures.indexOf('customer_feedback') !== -1) {
        toolList.push({ icon: 'feedback', name: 'Feedback', state: '/feedback', type: 'link' });
        routePermissionList.push("feedback");
      }
      sidePanelList.push({ name: 'Marketing Tools', type: 'dropDown', icon: 'build_circle', sub: toolList });
      // website
      let seoList: IChildItem[] = [];
      if(ysFeatures.indexOf('advanced_seo') !== -1) {
        routePermissionList.push("store_seo", "catalog_seo", "product_seo");
        seoList.push({ name: 'Store', state: '/seo/store', type: 'link' });
        seoList.push({ name: 'Catalog', state: '/seo/catalog', type: 'link' });
        if(ysFeatures.indexOf('catalog_page_content') !== -1) {
          seoList.push({ name: 'Catalog Page Content', state: '/seo/catalog-page-content', type: 'link' });
          routePermissionList.push("catalog_page_content");
        }
        seoList.push({ name: 'Product', state: '/seo/product', type: 'link' });
        if(ysFeatures.indexOf('blogs') !== -1) {
          seoList.push({ name: 'Blog', state: '/seo/blog', type: 'link' });
          routePermissionList.push("blog_seo");
        }
      }
      else { routePermissionList.push("store_seo"); }
      routePermissionList.push("home_layout", "catalog_layout", "product_layout", "menus", "policies", "contact_page", "store_locator", "extra_pages");
      let webList: IChildItem[] = [
        {
          name: 'Website Design', type: 'dropDown', icon: 'format_paint',
          sub: [
            { name: 'Home Page', state: '/layouts/home', type: 'link' },
            { name: 'Catalog', state: '/layouts/catalog', type: 'link' },
            { name: 'Product', state: '/layouts/product', type: 'link' }
          ]
        },
        { icon: 'menu_book', name: 'Menu', state: '/features/menus', type: 'link' },
        {
          name: 'Policies', type: 'dropDown', icon: 'policy',
          sub: [
            { name: 'Privacy Policy', state: '/setup/policies/privacy', type: 'link' },
            { name: 'Shipping Policy', state: '/setup/policies/shipping', type: 'link' },
            { name: 'Cancellation Policy', state: '/setup/policies/cancellation', type: 'link' },
            { name: 'Terms & Conditions', state: '/setup/policies/terms_conditions', type: 'link' }
          ]
        }
      ];
      if(seoList.length) webList.push({ name: 'SEO', type: 'dropDown', icon: 'track_changes', sub: seoList });
      else webList.push({ name: 'SEO', type: 'link', icon: 'track_changes', state: '/seo/store' });
      webList.push(
        { icon: 'contact_phone', name: 'Contact Page', state: '/setup/contact-page', type: 'link' },
        { icon: 'location_on', name: 'Store Locator', state: '/setup/store-locator', type: 'link' },
        { icon: 'note_add', name: 'Extra Pages', state: '/setup/extra-pages', type: 'link' }
      );
      sidePanelList.push({ name: 'Website', type: 'dropDown', icon: 'language', sub: webList });
      // store modules
      let moduleList: IChildItem[] = [];
      if(ysFeatures.indexOf('shopping_assistant') !== -1) {
        moduleList.push({ icon: 'assistant', name: 'Shopping Assistant', state: '/product-extras/shop-assistant', type: 'link' });
        routePermissionList.push("shopping_assistant");
      }
      if(ysFeatures.indexOf('sizing_assistant') !== -1) {
        moduleList.push({ icon: 'straighten', name: 'Sizing Assistant', state: '/product-extras/sizing-assistant', type: 'link' });
        routePermissionList.push("sizing_assistant");
      }
      if(ysFeatures.indexOf('currency_variation') !== -1) {
        moduleList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/setup/currency-types', type: 'link' });
        routePermissionList.push("currency_types");
      }
      if(ysFeatures.indexOf('blogs') !== -1) {
        moduleList.push({ icon: 'art_track', name: 'Blogs', state: '/features/blogs', type: 'link' });
        routePermissionList.push("blogs");
      }
      if(ysFeatures.indexOf('discounts_page') !== -1) {
        moduleList.push({ icon: 'local_atm', name: 'Discounts Page', state: '/features/discounts-page', type: 'link' });
        routePermissionList.push("discounts_page");
      }
      if(ysFeatures.indexOf('collections') !== -1) {
        moduleList.push({ icon: 'view_carousel', name: 'Collections', state: '/features/collections', type: 'link' });
        routePermissionList.push("collections");
      }
      if(moduleList.length) sidePanelList.push({ name: 'Store Modules', type: 'dropDown', icon: 'view_week', sub: moduleList });
      // setting
      routePermissionList.push("tax_rates");
      let settingList: IChildItem[] = [{ icon: 'local_atm', name: 'Tax Rates', state: '/product-extras/tax-rates', type: 'link' }];
      if(ysFeatures.indexOf('courier_partners') !== -1) {
        settingList.push({ icon: 'contact_mail', name: 'Courier Partners', state: '/courier-partners', type: 'link' });
        routePermissionList.push("courier_partners");
      }
      if(ysFeatures.indexOf('time_based_delivery') !== -1) {
        settingList.push({ icon: 'hourglass_top', name: 'Delivery Methods', state: '/shipping/delivery-methods', type: 'link' });
        routePermissionList.push("delivery_methods");
      }
      else {
        settingList.push({ icon: 'local_shipping', name: 'Shipping Methods', state: '/shipping/shipping-methods', type: 'link' });
        routePermissionList.push("shipping_methods");
      }
      routePermissionList.push("payment_gateway", "store_setting");
      settingList.push(
        { icon: 'payment', name: 'Payment Gateway', state: '/setup/payment-gateway', type: 'link' },
        { icon: 'room_preferences', name: 'Store Settings', state: '/store-setting', type: 'link' }
      );
      sidePanelList.push({ name: 'Settings', type: 'dropDown', icon: 'settings', sub: settingList });
      // my account
      routePermissionList.push("billing", "sub_users");
      let accountList: IChildItem[] = [
        { icon: 'receipt', name: 'Billing', state: '/account/billing', type: 'link' },
        { icon: 'supervised_user_circle', name: 'Users', state: '/account/users', type: 'link' }
      ];
      if(ysFeatures.indexOf('vendors') !== -1) {
        accountList.push({ icon: 'supervisor_account', name: 'Vendors', state: '/account/vendors', type: 'link' });
        routePermissionList.push("vendors");
      }
      sidePanelList.push({ name: 'My Account', type: 'dropDown', icon: 'account_circle', sub: accountList });
    }
    this.commonService.route_permission_list = routePermissionList;
    this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
    return sidePanelList;
  }

}
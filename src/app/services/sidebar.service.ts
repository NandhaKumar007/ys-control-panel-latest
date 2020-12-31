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
    let sidePanelList: IMenuItem[] = [
      { name: "What's New", type: 'link', icon: 'stars', state: '/whats-new' },
      { name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/dashboard' },
      {
        name: 'Catalog', type: 'dropDown', icon: 'view_carousel',
        sub: [
          { icon: 'view_carousel', name: 'Catalog Management', state: '/catalogs', type: 'link' },
          { icon: 'category', name: 'Products', state: '/products', type: 'link' },
          {
            name: 'Product Extras', type: 'dropDown', icon: 'extension',
            sub: [
              { name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link' },
              { name: 'Addons', state: '/product-extras/addons', type: 'link' },
              { name: 'Tags', state: '/product-extras/tags', type: 'link' },
              { name: 'Footnote', state: '/product-extras/footnote', type: 'link' },
              { name: 'Size Chart', state: '/product-extras/size-chart', type: 'link' },
              { name: 'FAQ', state: '/product-extras/faq', type: 'link' }
            ]
          },
          { icon: 'archive', name: 'Archive', state: '/product-extras/archive', type: 'link' }
        ]
      },
      {
        name: 'Quotations', type: 'dropDown', icon: 'description',
        sub: [
          { icon: 'slow_motion_video', name: 'Live Requests', state: '/quotations/live/all', type: 'link' },
          { icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/quotations/confirmed/all', type: 'link' },
          { icon: 'highlight_off', name: 'Cancelled Requests', state: '/quotations/cancelled/all', type: 'link' },
          { icon: 'no_sim', name: 'Abandoned Quotes', state: '/abandoned-quotes', type: 'link' },
          { icon: 'supervisor_account', name: 'Customers', state: '/customers', type: 'link' }
        ]
      },
      {
        name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore',
        sub: [
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
          { icon: 'remove_shopping_cart', name: 'Abandoned Carts', state: '/abandoned-carts', type: 'link' },
          { icon: 'supervisor_account', name: 'Customers', state: '/customers', type: 'link' }
        ]
      },
      {
        name: 'Selling Tools', type: 'dropDown', icon: 'build_circle',
        sub: [
          { icon: 'local_offer', name: 'Offers', state: '/features/coupon-codes', type: 'link' },
          { icon: 'redeem', name: 'Gift Cards', state: '/features/giftcard', type: 'link' },
          { icon: 'mail', name: 'Newsletter', state: '/newsletter', type: 'link' },
          { icon: 'feedback', name: 'Feedback', state: '/feedback', type: 'link' }
        ]
      },
      {
        name: 'Website', type: 'dropDown', icon: 'language',
        sub: [
          {
            name: 'Layouts', type: 'dropDown', icon: 'format_paint',
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
              { name: 'Terms & Conditions', state: '/setup/policies/terms-conditions', type: 'link' }
            ]
          },
          {
            name: 'SEO', type: 'dropDown', icon: 'track_changes',
            sub: [
              { name: 'Store', state: '/seo/store', type: 'link' },
              { name: 'Catalog', state: '/seo/catalog', type: 'link' },
              { name: 'Catalog Page Content', state: '/seo/catalog-page-content', type: 'link' },
              { name: 'Product', state: '/seo/product', type: 'link' },
              { name: 'Blog', state: '/seo/blog', type: 'link' }
            ]
          },
          { icon: 'contact_phone', name: 'Contact Page', state: '/setup/contact-page', type: 'link' },
          { icon: 'location_on', name: 'Store Locator', state: '/setup/store-locator', type: 'link' }
        ]
      },
      {
        name: 'Store Modules', type: 'dropDown', icon: 'view_week',
        sub: [
          { icon: 'assistant', name: 'Shopping Assistant', state: '/product-extras/shop-assistant', type: 'link' },
          { icon: 'straighten', name: 'Sizing Assistant', state: '/product-extras/sizing-assistant', type: 'link' },
          { icon: 'attach_money', name: 'Currency Convertor', state: '/setup/currency-types', type: 'link' },
          { icon: 'art_track', name: 'Blogs', state: '/features/blogs', type: 'link' },
          { icon: 'local_atm', name: 'Discounts Page', state: '/features/discounts-page', type: 'link' },
          { icon: 'view_carousel', name: 'Collections', state: '/features/collections', type: 'link' }
        ]
      },
      {
        name: 'Settings', type: 'dropDown', icon: 'settings',
        sub: [
          { icon: 'local_atm', name: 'Tax Rates', state: '/product-extras/tax-rates', type: 'link' },
          { icon: 'contact_mail', name: 'Courier Partners', state: '/courier-partners', type: 'link' },
          { icon: 'local_shipping', name: 'Shipping Methods', state: '/shipping/shipping-methods', type: 'link' },
          { icon: 'hourglass_top', name: 'Delivery Methods', state: '/shipping/delivery-methods', type: 'link' },
          { icon: 'payment', name: 'Payment Gateway', state: '/setup/payment-gateway', type: 'link' },
          { icon: 'room_preferences', name: 'Store Settings', state: '/store-setting', type: 'link' }
        ]
      },
      {
        name: 'My Account', type: 'dropDown', icon: 'account_circle',
        sub: [
          { icon: 'receipt', name: 'Billing', state: '/account/billing', type: 'link' },
          { icon: 'supervised_user_circle', name: 'Users', state: '/account/users', type: 'link' },
          { icon: 'supervisor_account', name: 'Vendors', state: '/account/vendors', type: 'link' }
        ]
      }
    ];
    return sidePanelList;
  }

	getSidePanelList2() {
		let routePermissionList = [];
		let sidePanelList: IMenuItem[] = [{ name: "What's New", type: 'link', icon: 'stars', state: '/whats-new' }];
    let ysFeatures = this.commonService.ys_features;
    if (ysFeatures.indexOf('pincode_service') !== -1) routePermissionList.push("pincodes");
    // admin
    if(this.commonService.store_details.login_type == 'admin') {
      routePermissionList.push("dashboard", "section", "products", "orders", "customers", "setting", "store_seo");
      sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/dashboard' });
      sidePanelList.push({ name: 'Sections', type: 'link', icon: 'view_carousel', state: '/sections' });
      // product extras
      let extraSubList: IChildItem[] = [];
      if (ysFeatures.indexOf('measurements') !== -1) {
        extraSubList.push({ icon: 'format_shapes', name: 'Measurement Sets', state: '/extras/measurement-sets', type: 'link' });
        routePermissionList.push("measurements");
      }
      if (ysFeatures.indexOf('addons') !== -1) {
        extraSubList.push({ icon: 'library_add', name: 'Addons', state: '/extras/addons', type: 'link' });
        routePermissionList.push("addons");
      }
      if (ysFeatures.indexOf('product_filters') !== -1) {
        extraSubList.push({ icon: 'bookmark', name: 'Tags', state: '/extras/tags', type: 'link' });
        routePermissionList.push("tags");
      }
      if (ysFeatures.indexOf('foot_note') !== -1) {
        extraSubList.push({ icon: 'subject', name: 'Foot Note', state: '/extras/foot-note', type: 'link' });
        routePermissionList.push("foot_note");
      }
      if (ysFeatures.indexOf('size_chart') !== -1) {
        extraSubList.push({ icon: 'table_chart', name: 'Size Chart', state: '/extras/size-chart', type: 'link' });
        routePermissionList.push("size_chart");
      }
      if (ysFeatures.indexOf('faq') !== -1) {
        extraSubList.push({ icon: 'question_answer', name: 'FAQ', state: '/extras/faq', type: 'link' });
        routePermissionList.push("faq");
      }
      if (extraSubList.length) sidePanelList.push({ name: 'Product Extras', type: 'dropDown', icon: 'extension', sub: extraSubList });
      // tax rates
      sidePanelList.push({ name: 'Tax Rates', type: 'link', icon: 'local_atm', state: '/tax-rates' });
      routePermissionList.push("tax_rates");
      // shopping assistant
      if (ysFeatures.indexOf('shopping_assistant') !== -1) {
        sidePanelList.push({ name: 'Shop Assistant', type: 'link', icon: 'assistant', state: '/shop-assistant' });
        routePermissionList.push("shopping_assistant");
      }
      // products
      sidePanelList.push({ name: 'Products', type: 'link', icon: 'category', state: '/products' });
      routePermissionList.push("products");
      // seo
      if (ysFeatures.indexOf('advanced_seo') !== -1) {
        routePermissionList.push("section_seo", "product_seo", "blog_seo");
        if (ysFeatures.indexOf('seo_page_content') !== -1) {
          routePermissionList.push("seo_page_content");
          let seoSubList: IChildItem[] = [
            { icon: 'store', name: 'Store SEO', state: '/seo/store', type: 'link' },
            {
              icon: 'view_carousel', name: 'Section', type: 'dropDown', sub: [
                { name: 'SEO', state: '/seo/section', type: 'link' },
                { name: 'Page Content', state: '/seo/section-page-content', type: 'link' }
              ]
            },
            { icon: 'category', name: 'Product SEO', state: '/seo/product', type: 'link' }
          ];
          if(ysFeatures.indexOf('blogs') !== -1) {
            seoSubList.push({ icon: 'art_track', name: 'Blog SEO', state: '/seo/blog', type: 'link' });
          }
          sidePanelList.push({ name: 'SEO', type: 'dropDown', icon: 'track_changes', sub: seoSubList });
        }
        else {
          let seoSubList: IChildItem[] = [
            { icon: 'store', name: 'Store SEO', state: '/seo/store', type: 'link' },
            { icon: 'view_carousel', name: 'Section SEO', state: '/seo/section', type: 'link' },
            { icon: 'category', name: 'Product SEO', state: '/seo/product', type: 'link' }
          ];
          if(ysFeatures.indexOf('blogs') !== -1) {
            seoSubList.push({ icon: 'art_track', name: 'Blog SEO', state: '/seo/blog', type: 'link' });
          }
          sidePanelList.push({ name: 'SEO', type: 'dropDown', icon: 'track_changes', sub: seoSubList });
        }
      }
      else {
        sidePanelList.push({ name: 'Store SEO', type: 'link', icon: 'track_changes', state: '/seo/store' });
      }
      // store modules
      let moduleSubList: IChildItem[] = [];
      if (ysFeatures.indexOf('currency_variation') !== -1) {
        moduleSubList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/modules/currency-types', type: 'link' });
        routePermissionList.push("currency_types");
      }
      if (ysFeatures.indexOf('blogs') !== -1) {
        moduleSubList.push({ icon: 'art_track', name: 'Blogs', state: '/modules/blogs', type: 'link' });
        routePermissionList.push("blogs");
      }
      if (ysFeatures.indexOf('giftcard') !== -1) {
        moduleSubList.push({ icon: 'redeem', name: 'Gift Cards', state: '/modules/gift-cards', type: 'link' });
        routePermissionList.push("gift_cards");
      }
      if (ysFeatures.indexOf('product_archive') !== -1) {
        moduleSubList.push({ icon: 'archive', name: 'Archive', state: '/modules/archive', type: 'link' });
        routePermissionList.push("archive");
      }
      if (ysFeatures.indexOf('newsletter') !== -1) {
        moduleSubList.push({ icon: 'mail', name: 'Newsletter', state: '/modules/newsletter-subscribers', type: 'link' });
        routePermissionList.push("newsletter");
      }
      if (ysFeatures.indexOf('basic_discount') !== -1 || ysFeatures.indexOf('advanced_discount') !== -1) {
        moduleSubList.push({ icon: 'local_offer', name: 'Offers', state: '/modules/offers', type: 'link' });
        routePermissionList.push("offers");
      }
      if (moduleSubList.length) sidePanelList.push({ name: 'Store Modules', type: 'dropDown', icon: 'view_week', sub: moduleSubList });
      // orders
      if (ysFeatures.indexOf('manual_order') !== -1) routePermissionList.push("manual_order");
      let subList: IChildItem[] = [
        { icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/live/all', type: 'link' },
        { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/delivered/all', type: 'link' },
        { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/cancelled/all', type: 'link' }
      ];
      subList.push({ icon: 'error_outline', name: 'Inactive Orders', state: '/orders/inactive', type: 'link' });
      routePermissionList.push("inactive_orders");
      if (this.commonService.store_details.abandoned_status) {
        subList.push({ icon: 'remove_shopping_cart', name: 'Abandoned Carts', state: '/abandoned-carts', type: 'link' });
        routePermissionList.push("abandoned_cart");
      }
      if (ysFeatures.indexOf('giftcard') !== -1 || ysFeatures.indexOf('manual_giftcard') !== -1) {
        subList.push({ icon: 'redeem', name: 'Gift Card Orders', state: '/gift-coupons', type: 'link' });
        routePermissionList.push("gift_coupon");
      }
      if (ysFeatures.indexOf('donation') !== -1) {
        subList.push({ icon: 'monetization_on', name: 'Donations', state: '/donations', type: 'link' });
        routePermissionList.push("donations");
      }
      // banners
      let bannerSubList = [];
      let homePageType = "Layouts"; let homePageTypeIcon = "format_paint";
      routePermissionList.push("home_layout");
      bannerSubList.push({ icon: 'view_day', name: 'Home', state: '/layout/home', type: 'link' });
      // section banner
      bannerSubList.push({ icon: 'web', name: 'Section', state: '/layout/section', type: 'link' });
      routePermissionList.push("section_layout");
      // quotations
      // let quotList: IChildItem[] = [
      // 	{ icon: 'slow_motion_video', name: 'Live Requests', state: '/quotations/live/all', type: 'link' },
      // 	{ icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/quotations/confirmed/all', type: 'link' },
      //   { icon: 'highlight_off', name: 'Cancelled Requests', state: '/quotations/cancelled/all', type: 'link' },
      //   { icon: 'no_sim', name: 'Abandoned Quotes', state: '/abandoned-quotes', type: 'link' }
      // ];
      // sidePanelList.push({ name: 'Quotations', type: 'dropDown', icon: 'description', sub: quotList });
      sidePanelList.push(
        { name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore', sub: subList },
        { name: homePageType, type: 'dropDown', icon: homePageTypeIcon, sub: bannerSubList },
        { name: 'Customers', type: 'link', icon: 'supervisor_account', state: '/customers' }
      );
      if (ysFeatures.indexOf('customer_feedback') !== -1) {
        sidePanelList.push({ name: 'Feedback', type: 'link', icon: 'feedback', state: '/feedback' });
        routePermissionList.push("feedback");
      }
      if (ysFeatures.indexOf('time_based_delivery') !== -1) {
        sidePanelList.push({ name: 'Delivery Methods', type: 'link', icon: 'local_shipping', state: '/delivery-method' });
        routePermissionList.push("delivery_method");
      }
      else if (ysFeatures.indexOf('time_based_delivery') == -1) {
        sidePanelList.push({ name: 'Shipping Methods', type: 'link', icon: 'local_shipping', state: '/shipping' });
        routePermissionList.push("shipping_method");
      }
      // sub users
      sidePanelList.push({ name: 'Users', type: 'link', icon: 'supervised_user_circle', state: '/users' });
      routePermissionList.push("sub_users");
      // vendors
      if (ysFeatures.indexOf('vendors') !== -1) {
        sidePanelList.push({ name: 'Vendors', type: 'link', icon: 'supervisor_account', state: '/vendors' });
        routePermissionList.push("vendors");
      }
      sidePanelList.push({ name: 'Settings', type: 'link', icon: 'settings', state: '/settings' });
      this.commonService.route_permission_list = routePermissionList;
      this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
    }

		return sidePanelList;
	}

}
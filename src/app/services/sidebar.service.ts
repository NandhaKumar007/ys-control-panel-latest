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
    let sidePanelList: IMenuItem[] = [];
    // let sidePanelList: IMenuItem[] = [{ name: "What's New", type: 'link', icon: 'stars', state: '/whats-new' }];
    let ysFeatures = this.commonService.ys_features;
    let subuserFeatures = this.commonService.subuser_features;;
    // admin
    if(this.commonService.store_details.login_type == 'admin') {
      routePermissionList.push("deployment", "dashboard", "customers", "profile");
      if(ysFeatures.indexOf('custom_model_history')!=-1) routePermissionList.push("custom_model_history");
      // deployment
      if(this.commonService.master_token) {
        sidePanelList.push({ name: 'Deployment', type: 'link', icon: 'construction', state: '/deployment' });
      }
      // dashboard
      sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/dashboard' });
      // product extras
      let prodExtraList: IChildItem[] = [];
      if(ysFeatures.indexOf('measurements')!=-1) {
        prodExtraList.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link' });
        routePermissionList.push("measurements");
      }
      if(ysFeatures.indexOf('addons')!=-1) {
        prodExtraList.push({ name: 'Addons', state: '/product-extras/addons', type: 'link' });
        routePermissionList.push("addons");
      }
      if(ysFeatures.indexOf('product_filters')!=-1) {
        prodExtraList.push({ name: 'Tags', state: '/product-extras/tags', type: 'link' });
        routePermissionList.push("tags");
      }
      if(ysFeatures.indexOf('foot_note')!=-1) {
        prodExtraList.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link' });
        routePermissionList.push("foot_note");
      }
      if(ysFeatures.indexOf('size_chart')!=-1) {
        prodExtraList.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link' });
        routePermissionList.push("size_chart");
      }
      if(ysFeatures.indexOf('faq')!=-1) {
        prodExtraList.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link' });
        routePermissionList.push("faq");
      }
      prodExtraList.push({ name: 'Product Taxonomy', state: '/product-extras/product-taxonomy', type: 'link' });
      routePermissionList.push("product_taxonomy");
      // products
      routePermissionList.push("catalogs", "products", "product_add", "product_edit");
      let prodList: IChildItem[] = [
        { icon: 'view_carousel', name: 'Catalog Management', state: '/catalogs', type: 'link' },
        { icon: 'category', name: 'All Products', state: '/products', type: 'link' }
      ];
      if(prodExtraList.length) prodList.push({ name: 'Product Extras', type: 'dropDown', icon: 'extension', sub: prodExtraList });
      if(ysFeatures.indexOf('product_archive')!=-1) {
        prodList.push({ icon: 'archive', name: 'Archived Products', state: '/product-extras/archive', type: 'link' });
        routePermissionList.push("product_archive");
      }
      if(ysFeatures.indexOf('product_reviews')!=-1) {
        prodList.push({ icon: 'rate_review', name: 'Product Reviews', state: '/features/product-reviews', type: 'link' });
        routePermissionList.push("product_reviews");
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
      if(this.commonService.store_details.type == 'order_based' || this.commonService.store_details.type == 'quot_with_order_based' || this.commonService.store_details.type == 'restaurant_based') {
        // product
        let orderList: IChildItem[] = [
          { icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' },
          { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' },
          { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' }
        ];
        let inactiveOrders: IChildItem[] = [{ name: 'Product', state: '/orders/inactive-orders', type: 'link' }];
        // gift card
        if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) {
          orderList.push({ icon: 'redeem', name: 'Gift Card Orders', state: '/orders/gift-coupon', type: 'link' });
          inactiveOrders.push({ name: 'Gift Card', state: '/orders/inactive-gift-coupons', type: 'link' })
          routePermissionList.push("inactive_gift_orders");
        }
        // quick order
        if(ysFeatures.indexOf('quick_order')!=-1) {
          orderList.push({ icon: 'timer', name: 'Quick Orders', state: '/features/quick-orders', type: 'link' });
          routePermissionList.push("quick_order");
        }
        // dinamic offers
        if(ysFeatures.indexOf('dinamic_offers')!=-1) {
          orderList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/orders/dinamic-offers', type: 'link' });
          inactiveOrders.push({ name: 'DiNAMIC', state: '/orders/inactive-dinamic-offers', type: 'link' })
          routePermissionList.push("inactive_dinamic_offer_orders");
        }
        // appointments
        if(ysFeatures.indexOf('appointment_scheduler')!=-1) {
          orderList.push({ icon: 'book_online', name: 'Appointments', state: '/orders/appointments', type: 'link' });
          routePermissionList.push("appointments");
        }
        // inactive orders
        if(inactiveOrders.length>1) orderList.push({ name: 'Inactive Orders', type: 'dropDown', icon: 'error_outline', sub:inactiveOrders });
        else orderList.push({ icon: 'error_outline', name: 'Inactive Orders', state: '/orders/inactive-orders', type: 'link' });
        // abandoned
        if(ysFeatures.indexOf('abandoned_cart')!=-1) {
          orderList.push({ name: 'Abandoned Cart', type: 'dropDown', icon: 'remove_shopping_cart', sub: [
            { name: 'Customers', state: '/abandoned-cart/customer', type: 'link' },
            { name: 'Guest Users', state: '/abandoned-cart/guest-user', type: 'link' }
          ] });
          routePermissionList.push("abandoned_cart");
        }
        // customer
        if(this.commonService.store_details.type == 'order_based' || this.commonService.store_details.type == 'restaurant_based') {
          orderList.push({ name: 'Customers', type: 'dropDown', icon: 'supervisor_account', sub: [
            { name: 'Customers', state: '/customers', type: 'link' },
            { name: 'Guest Users', state: '/guest-users', type: 'link' }
          ] });
        }
        sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore', sub: orderList });
        routePermissionList.push("orders", "inactive_orders");
        if(ysFeatures.indexOf('manual_order')!=-1) routePermissionList.push("manual_order");
      }
      // customers
      if(this.commonService.store_details.type == 'quot_with_order_based') {
        sidePanelList.push(
          { name: 'Customers', type: 'link', icon: 'supervisor_account', state: '/customers' },
          { name: 'Guest Users', type: 'link', icon: 'no_accounts', state: '/guest-users' }
        );
      }
      // marketing tools
      let toolList: IChildItem[] = [];
      if(ysFeatures.indexOf('basic_discount')!=-1 || ysFeatures.indexOf('advanced_discount')!=-1) {
        toolList.push({ icon: 'local_offer', name: 'Offers', state: '/features/coupon-codes', type: 'link' });
        routePermissionList.push("offers");
      }
      if(ysFeatures.indexOf('giftcard')!=-1) {
        toolList.push({ icon: 'redeem', name: 'Gift Cards', state: '/features/giftcard', type: 'link' });
        routePermissionList.push("giftcard", "giftcard_orders");
      }
      if(ysFeatures.indexOf('newsletter')!=-1) {
        toolList.push({ icon: 'mail', name: 'Newsletter', state: '/newsletter', type: 'link' });
        routePermissionList.push("newsletter");
      }
      if(ysFeatures.indexOf('customer_feedback')!=-1) {
        toolList.push({ icon: 'feedback', name: 'Feedback', state: '/feedback', type: 'link' });
        routePermissionList.push("feedback");
      }
      if(toolList.length) sidePanelList.push({ name: 'Marketing Tools', type: 'dropDown', icon: 'build_circle', sub: toolList });
      // website
      let seoList: IChildItem[] = [];
      if(ysFeatures.indexOf('advanced_seo')!=-1) {
        routePermissionList.push("store_seo", "catalog_seo", "product_seo");
        seoList.push({ name: 'Store', state: '/seo/store', type: 'link' });
        seoList.push({ name: 'Catalog', state: '/seo/catalog', type: 'link' });
        seoList.push({ name: 'Product', state: '/seo/product', type: 'link' });
        if(ysFeatures.indexOf('blogs')!=-1) {
          seoList.push({ name: 'Blog', state: '/seo/blog', type: 'link' });
          routePermissionList.push("blog_seo");
        }
        if(ysFeatures.indexOf('extra_pages')!=-1) {
          seoList.push({ name: 'Extra Pages', state: '/seo/extra-pages', type: 'link' });
          routePermissionList.push("extra_page_seo");
        }
      }
      routePermissionList.push("home_layout", "catalog_layout", "product_layout", "policies", "contact_page", "footer_content");
      let webList: IChildItem[] = [
        {
          name: 'Website Design', type: 'dropDown', icon: 'format_paint',
          sub: [
            { name: 'Home Page', state: '/layouts/home', type: 'link' },
            { name: 'Catalog Page', state: '/layouts/catalog', type: 'link' },
            { name: 'Product Page', state: '/layouts/product', type: 'link' }
          ]
        }
      ];
      if(ysFeatures.indexOf('single_menu')!=-1 || ysFeatures.indexOf('multi_menu')!=-1) {
        webList.push({ icon: 'menu_book', name: 'Menu', state: '/features/menus', type: 'link' });
        routePermissionList.push("menus");
      }
      webList.push({
        name: 'Policies', type: 'dropDown', icon: 'policy',
        sub: [
          { name: 'Privacy Policy', state: '/setup/policies/privacy', type: 'link' },
          { name: 'Shipping Policy', state: '/setup/policies/shipping', type: 'link' },
          { name: 'Cancellation Policy', state: '/setup/policies/cancellation', type: 'link' },
          { name: 'Terms & Conditions', state: '/setup/policies/terms_conditions', type: 'link' }
        ]
      });
      if(seoList.length) webList.push({ name: 'SEO', type: 'dropDown', icon: 'track_changes', sub: seoList });
      else if(ysFeatures.indexOf('basic_seo')!=-1) {
        webList.push({ name: 'SEO', type: 'link', icon: 'track_changes', state: '/seo/store' });
        routePermissionList.push("store_seo");
      }
      webList.push({ icon: 'contact_phone', name: 'Contact Page', state: '/setup/contact-page', type: 'link' });
      if(ysFeatures.indexOf('store_locator')!=-1) {
        webList.push({ icon: 'location_on', name: 'Store Locator', state: '/setup/store-locator', type: 'link' });
        routePermissionList.push("store_locator");
      }
      if(ysFeatures.indexOf('extra_pages')!=-1) {
        webList.push({ icon: 'note_add', name: 'Extra Pages', state: '/setup/extra-pages', type: 'link' });
        routePermissionList.push("extra_pages");
      }
      webList.push({ icon: 'wysiwyg', name: 'Footer Configuration', state: '/setup/footer-content', type: 'link' });
      sidePanelList.push({ name: 'Website', type: 'dropDown', icon: 'language', sub: webList });
      // store modules
      let moduleList: IChildItem[] = [];
      if(ysFeatures.indexOf('shopping_assistant')!=-1) {
        moduleList.push({ icon: 'assistant', name: 'Shopping Assistant', state: '/product-extras/shop-assistant', type: 'link' });
        routePermissionList.push("shopping_assistant");
      }
      if(ysFeatures.indexOf('sizing_assistant')!=-1) {
        moduleList.push({ icon: 'straighten', name: 'Sizing Assistant', state: '/product-extras/sizing-assistant', type: 'link' });
        routePermissionList.push("sizing_assistant");
      }
      if(ysFeatures.indexOf('currency_variation')!=-1) {
        moduleList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/setup/currency-types', type: 'link' });
        routePermissionList.push("currency_types");
      }
      if(ysFeatures.indexOf('blogs')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Blogs', state: '/features/blogs', type: 'link' });
        routePermissionList.push("blogs");
      }
      if(ysFeatures.indexOf('discounts_page')!=-1) {
        moduleList.push({ icon: 'local_atm', name: 'Discounts Page', state: '/features/discounts-page', type: 'link' });
        routePermissionList.push("discounts_page");
      }
      if(ysFeatures.indexOf('collections')!=-1) {
        moduleList.push({ icon: 'view_carousel', name: 'Collections', state: '/features/collections', type: 'link' });
        routePermissionList.push("collections");
      }
      if(ysFeatures.indexOf('dinamic_offers')!=-1) {
        moduleList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/features/dinamic-offers', type: 'link' });
        routePermissionList.push("dinamic_offers", "dinamic_offer_orders");
      }
      if(ysFeatures.indexOf('appointment_scheduler')!=-1) {
        moduleList.push({ icon: 'book_online', name: 'Appointment Services', state: '/features/appointment-categories', type: 'link' });
        routePermissionList.push("appointment_services");
      }
      if(moduleList.length) sidePanelList.push({ name: 'Store Modules', type: 'dropDown', icon: 'view_week', sub: moduleList });
      // setting
      let settingList: IChildItem[] = [];
      if(ysFeatures.indexOf('tax_rates')!=-1) {
        settingList.push({ icon: 'local_atm', name: 'Tax Rates', state: '/product-extras/tax-rates', type: 'link' });
        routePermissionList.push("tax_rates");
      }
      if(ysFeatures.indexOf('courier_partners')!=-1) {
        settingList.push({ icon: 'contact_mail', name: 'Courier Partners', state: '/courier-partners', type: 'link' });
        routePermissionList.push("courier_partners");
      }
      if(ysFeatures.indexOf('time_based_delivery')!=-1) {
        settingList.push({ icon: 'hourglass_top', name: 'Delivery Methods', state: '/shipping/delivery-methods', type: 'link' });
        routePermissionList.push("delivery_methods");
      }
      else {
        settingList.push({ icon: 'local_shipping', name: 'Shipping Methods', state: '/shipping/shipping-methods', type: 'link' });
        routePermissionList.push("shipping_methods");
      }
      if(ysFeatures.indexOf('pincode_service')!=-1) {
        settingList.push({ icon: 'fmd_good', name: 'Pincode Service', state: '/shipping/pincodes', type: 'link' });
        routePermissionList.push("pincodes");
      }
      routePermissionList.push("payment_gateway", "store_setting");
      settingList.push(
        { icon: 'payment', name: 'Payment Gateway', state: '/setup/payment-gateway', type: 'link' },
        { icon: 'room_preferences', name: 'Store Settings', state: '/store-setting', type: 'link' }
      );
      sidePanelList.push({ name: 'Settings', type: 'dropDown', icon: 'settings', sub: settingList });
      // my account
      routePermissionList.push("billing", "branches");
      let accountList: IChildItem[] = [];
      accountList.push(
        { icon: 'account_circle', name: 'Profile', state: '/account/profile', type: 'link' },
        { icon: 'store', name: 'Branches', state: '/account/branches', type: 'link' },
        // { icon: 'receipt', name: 'Billing', state: '/account/billing', type: 'link' }
      );
      if(ysFeatures.indexOf('1_staff')!=-1 || ysFeatures.indexOf('5_staff')!=-1 || ysFeatures.indexOf('10_staff')!=-1 || ysFeatures.indexOf('20_staff')!=-1) {
        accountList.push({ icon: 'supervised_user_circle', name: 'Users', state: '/account/users', type: 'link' });
        routePermissionList.push("sub_users");
      }
      if(ysFeatures.indexOf('vendors')!=-1) {
        accountList.push({ icon: 'supervisor_account', name: 'Vendors', state: '/account/vendors', type: 'link' });
        routePermissionList.push("vendors");
      }
      if(this.commonService.store_details.dp_wallet_status) {
        accountList.push({ icon: 'account_balance_wallet', name: 'Wallet', state: '/account/wallet', type: 'link' });
        routePermissionList.push("dp_wallet");
      }
      sidePanelList.push({ name: 'My Account', type: 'dropDown', icon: 'account_circle', sub: accountList });
    }
    // SUB USER
    else if(this.commonService.store_details.login_type == 'subuser') {
      if(ysFeatures.indexOf('custom_model_history')!=-1) routePermissionList.push("custom_model_history");
      if(subuserFeatures.indexOf('dashboard')!=-1) {
        sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/dashboard' });
        routePermissionList.push("dashboard");
      }
      // product extras
      let prodExtraList: IChildItem[] = [];
      if(ysFeatures.indexOf('measurements')!=-1 && subuserFeatures.indexOf('measurements')!=-1) {
        prodExtraList.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link' });
        routePermissionList.push("measurements");
      }
      if(ysFeatures.indexOf('addons')!=-1 && subuserFeatures.indexOf('addons')!=-1) {
        prodExtraList.push({ name: 'Addons', state: '/product-extras/addons', type: 'link' });
        routePermissionList.push("addons");
      }
      if(ysFeatures.indexOf('product_filters')!=-1 && subuserFeatures.indexOf('product_filters')!=-1) {
        prodExtraList.push({ name: 'Tags', state: '/product-extras/tags', type: 'link' });
        routePermissionList.push("tags");
      }
      if(ysFeatures.indexOf('foot_note')!=-1 && subuserFeatures.indexOf('foot_note')!=-1) {
        prodExtraList.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link' });
        routePermissionList.push("foot_note");
      }
      if(ysFeatures.indexOf('size_chart')!=-1 && subuserFeatures.indexOf('size_chart')!=-1) {
        prodExtraList.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link' });
        routePermissionList.push("size_chart");
      }
      if(ysFeatures.indexOf('faq')!=-1 && subuserFeatures.indexOf('faq')!=-1) {
        prodExtraList.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link' });
        routePermissionList.push("faq");
      }
      if(subuserFeatures.indexOf('product_taxonomy')!=-1) {
        prodExtraList.push({ name: 'Product Taxonomy', state: '/product-extras/product-taxonomy', type: 'link' });
        routePermissionList.push("product_taxonomy");
      }
      // products
      let prodList: IChildItem[] = [];
      if(subuserFeatures.indexOf('catalogs')!=-1) {
        prodList.push({ icon: 'view_carousel', name: 'Catalog Management', state: '/catalogs', type: 'link' });
        routePermissionList.push("catalogs");
      }
      if(subuserFeatures.indexOf('products')!=-1) {
        prodList.push({ icon: 'category', name: 'All Products', state: '/products', type: 'link' });
        routePermissionList.push("products", "product_add", "product_edit");
      }
      if(prodExtraList.length) prodList.push({ name: 'Product Extras', type: 'dropDown', icon: 'extension', sub: prodExtraList });
      if(ysFeatures.indexOf('product_archive')!=-1 && subuserFeatures.indexOf('product_archive')!=-1) {
        prodList.push({ icon: 'archive', name: 'Archived Products', state: '/product-extras/archive', type: 'link' });
        routePermissionList.push("product_archive");
      }
      if(ysFeatures.indexOf('product_reviews')!=-1 && subuserFeatures.indexOf('product_reviews')!=-1) {
        prodList.push({ icon: 'rate_review', name: 'Product Reviews', state: '/features/product-reviews', type: 'link' });
        routePermissionList.push("product_reviews");
      }
      if(prodList.length) sidePanelList.push({ name: 'Products', type: 'dropDown', icon: 'category', sub: prodList });
      // quotations
      // if(this.commonService.store_details.type == 'quot_based' || this.commonService.store_details.type == 'quot_with_order_based') {
      //   let quotList: IChildItem[] = [
      //     { icon: 'slow_motion_video', name: 'Live Requests', state: '/quotations/live/all', type: 'link' },
      //     { icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/quotations/confirmed/all', type: 'link' },
      //     { icon: 'highlight_off', name: 'Cancelled Requests', state: '/quotations/cancelled/all', type: 'link' },
      //     { icon: 'no_sim', name: 'Abandoned Quotes', state: '/abandoned-quotes', type: 'link' }
      //   ];
      //   if(this.commonService.store_details.type == 'quot_based') quotList.push({ icon: 'supervisor_account', name: 'Customers', state: '/customers', type: 'link' });
      //   sidePanelList.push({ name: 'Quotations', type: 'dropDown', icon: 'description', sub: quotList });
      //   routePermissionList.push("quotations", "abandoned_quotes");
      // }
      // orders
      if(this.commonService.store_details.type == 'order_based' || this.commonService.store_details.type == 'quot_with_order_based' || this.commonService.store_details.type == 'restaurant_based') {
        // product
        let orderList: IChildItem[] = [];
        if(subuserFeatures.indexOf('live_orders')!=-1)
          orderList.push({ icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' });
        if(subuserFeatures.indexOf('completed_orders')!=-1)
          orderList.push({ icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' });
        if(subuserFeatures.indexOf('cancelled_orders')!=-1)
          orderList.push({ icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' });
        if(orderList.length) routePermissionList.push("orders");
        let inactiveOrders: IChildItem[] = [];
        if(subuserFeatures.indexOf('inactive_orders')!=-1) {
          inactiveOrders.push({ name: 'Product', state: '/orders/inactive-orders', type: 'link' });
          routePermissionList.push("inactive_orders");
        }
        // gift card
        if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) {
          if(subuserFeatures.indexOf('giftcard_orders')!=-1) orderList.push({ icon: 'redeem', name: 'Gift Card Orders', state: '/orders/gift-coupon', type: 'link' });
          if(subuserFeatures.indexOf('inactive_giftcard_orders')!=-1) {
            inactiveOrders.push({ name: 'Gift Card', state: '/orders/inactive-gift-coupons', type: 'link' })
            routePermissionList.push("inactive_gift_orders");
          }
        }
        // quick order
        if(ysFeatures.indexOf('quick_order')!=-1 && subuserFeatures.indexOf('quick_order')!=-1) {
          orderList.push({ icon: 'timer', name: 'Quick Orders', state: '/features/quick-orders', type: 'link' });
          routePermissionList.push("quick_order");
        }
        // dinamic offers
        // if(ysFeatures.indexOf('dinamic_offers')!=-1) {
        //   orderList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/orders/dinamic-offers', type: 'link' });
        //   inactiveOrders.push({ name: 'DiNAMIC', state: '/orders/inactive-dinamic-offers', type: 'link' })
        //   routePermissionList.push("inactive_dinamic_offer_orders");
        // }
        // appointments
        if(ysFeatures.indexOf('appointment_scheduler')!=-1 && subuserFeatures.indexOf('appointment_scheduler')!=-1) {
          orderList.push({ icon: 'book_online', name: 'Appointments', state: '/orders/appointments', type: 'link' });
          routePermissionList.push("appointments");
        }
        // inactive orders
        if(inactiveOrders.length) orderList.push({ name: 'Inactive Orders', type: 'dropDown', icon: 'error_outline', sub:inactiveOrders });
        // abandoned
        if(ysFeatures.indexOf('abandoned_cart')!=-1 && subuserFeatures.indexOf('abandoned_cart')!=-1) {
          orderList.push({ name: 'Abandoned Cart', type: 'dropDown', icon: 'remove_shopping_cart', sub: [
            { name: 'Customers', state: '/abandoned-cart/customer', type: 'link' },
            { name: 'Guest Users', state: '/abandoned-cart/guest-user', type: 'link' }
          ] });
          routePermissionList.push("abandoned_cart");
        }
        // customer
        if(this.commonService.store_details.type == 'order_based' || this.commonService.store_details.type == 'restaurant_based') {
          if(subuserFeatures.indexOf('customers')!=-1) {
            orderList.push({ name: 'Customers', type: 'dropDown', icon: 'supervisor_account', sub: [
              { name: 'Customers', state: '/customers', type: 'link' },
              { name: 'Guest Users', state: '/guest-users', type: 'link' }
            ] });
            routePermissionList.push("customers");
          }
        }
        if(orderList.length) sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore', sub: orderList });
        if(ysFeatures.indexOf('manual_order')!=-1 && subuserFeatures.indexOf('manual_order')!=-1) routePermissionList.push("manual_order");
      }
      // customers
      if(this.commonService.store_details.type == 'quot_with_order_based' && subuserFeatures.indexOf('customers')!=-1) {
        sidePanelList.push(
          { name: 'Customers', type: 'link', icon: 'supervisor_account', state: '/customers' },
          { name: 'Guest Users', type: 'link', icon: 'no_accounts', state: '/guest-users' }
        );
        routePermissionList.push("customers");
      }
      // marketing tools
      let toolList: IChildItem[] = [];
      if(ysFeatures.indexOf('basic_discount')!=-1 || ysFeatures.indexOf('advanced_discount')!=-1) {
        if(subuserFeatures.indexOf('offers')!=-1) {
          toolList.push({ icon: 'local_offer', name: 'Offers', state: '/features/coupon-codes', type: 'link' });
          routePermissionList.push("offers");
        }
      }
      if(ysFeatures.indexOf('giftcard')!=-1 && subuserFeatures.indexOf('giftcard')!=-1) {
        toolList.push({ icon: 'redeem', name: 'Gift Cards', state: '/features/giftcard', type: 'link' });
        routePermissionList.push("giftcard", "giftcard_orders");
      }
      if(ysFeatures.indexOf('newsletter')!=-1 && subuserFeatures.indexOf('newsletter')!=-1) {
        toolList.push({ icon: 'mail', name: 'Newsletter', state: '/newsletter', type: 'link' });
        routePermissionList.push("newsletter");
      }
      if(ysFeatures.indexOf('customer_feedback')!=-1 && subuserFeatures.indexOf('customer_feedback')!=-1) {
        toolList.push({ icon: 'feedback', name: 'Feedback', state: '/feedback', type: 'link' });
        routePermissionList.push("feedback");
      }
      if(toolList.length) sidePanelList.push({ name: 'Marketing Tools', type: 'dropDown', icon: 'build_circle', sub: toolList });
      // website
      let seoList: IChildItem[] = [];
      if(ysFeatures.indexOf('advanced_seo')!=-1 && subuserFeatures.indexOf('seo')!=-1) {
        routePermissionList.push("store_seo", "catalog_seo", "product_seo");
        seoList.push({ name: 'Store', state: '/seo/store', type: 'link' });
        seoList.push({ name: 'Catalog', state: '/seo/catalog', type: 'link' });
        seoList.push({ name: 'Product', state: '/seo/product', type: 'link' });
        if(ysFeatures.indexOf('blogs')!=-1 && subuserFeatures.indexOf('blogs')!=-1) {
          seoList.push({ name: 'Blog', state: '/seo/blog', type: 'link' });
          routePermissionList.push("blog_seo");
        }
        if(ysFeatures.indexOf('extra_pages')!=-1 && subuserFeatures.indexOf('extra_pages')!=-1) {
          seoList.push({ name: 'Extra Pages', state: '/seo/extra-pages', type: 'link' });
          routePermissionList.push("extra_page_seo");
        }
      }
      let webList: IChildItem[] = [];
      if(subuserFeatures.indexOf('website_design')!=-1) {
        webList.push({
          name: 'Website Design', type: 'dropDown', icon: 'format_paint',
          sub: [
            { name: 'Home Page', state: '/layouts/home', type: 'link' },
            { name: 'Catalog Page', state: '/layouts/catalog', type: 'link' },
            { name: 'Product Page', state: '/layouts/product', type: 'link' }
          ]
        });
        routePermissionList.push("home_layout", "catalog_layout", "product_layout");
      }
      if(ysFeatures.indexOf('single_menu')!=-1 || ysFeatures.indexOf('multi_menu')!=-1) {
        if(subuserFeatures.indexOf('menu')!=-1) {
          webList.push({ icon: 'menu_book', name: 'Menu', state: '/features/menus', type: 'link' });
          routePermissionList.push("menus");
        }
      }
      if(subuserFeatures.indexOf('policies')!=-1) {
        webList.push({
          name: 'Policies', type: 'dropDown', icon: 'policy',
          sub: [
            { name: 'Privacy Policy', state: '/setup/policies/privacy', type: 'link' },
            { name: 'Shipping Policy', state: '/setup/policies/shipping', type: 'link' },
            { name: 'Cancellation Policy', state: '/setup/policies/cancellation', type: 'link' },
            { name: 'Terms & Conditions', state: '/setup/policies/terms_conditions', type: 'link' }
          ]
        });
        routePermissionList.push("policies");
      }
      if(seoList.length) webList.push({ name: 'SEO', type: 'dropDown', icon: 'track_changes', sub: seoList });
      else if(ysFeatures.indexOf('basic_seo')!=-1 && subuserFeatures.indexOf('seo')!=-1) {
        webList.push({ name: 'SEO', type: 'link', icon: 'track_changes', state: '/seo/store' });
        routePermissionList.push("store_seo");
      }
      if(subuserFeatures.indexOf('contact_page')!=-1) {
        webList.push({ icon: 'contact_phone', name: 'Contact Page', state: '/setup/contact-page', type: 'link' });
        routePermissionList.push("contact_page");
      }
      if(ysFeatures.indexOf('store_locator')!=-1 && subuserFeatures.indexOf('store_locator')!=-1) {
        webList.push({ icon: 'location_on', name: 'Store Locator', state: '/setup/store-locator', type: 'link' });
        routePermissionList.push("store_locator");
      }
      if(ysFeatures.indexOf('extra_pages')!=-1 && subuserFeatures.indexOf('extra_pages')!=-1) {
        webList.push({ icon: 'note_add', name: 'Extra Pages', state: '/setup/extra-pages', type: 'link' });
        routePermissionList.push("extra_pages");
      }
      if(subuserFeatures.indexOf('footer_configuration')!=-1) {
        webList.push({ icon: 'wysiwyg', name: 'Footer Configuration', state: '/setup/footer-content', type: 'link' });
        routePermissionList.push("footer_content");
      }
      if(webList.length) sidePanelList.push({ name: 'Website', type: 'dropDown', icon: 'language', sub: webList });
      // store modules
      let moduleList: IChildItem[] = [];
      if(ysFeatures.indexOf('shopping_assistant')!=-1 && subuserFeatures.indexOf('shopping_assistant')!=-1) {
        moduleList.push({ icon: 'assistant', name: 'Shopping Assistant', state: '/product-extras/shop-assistant', type: 'link' });
        routePermissionList.push("shopping_assistant");
      }
      if(ysFeatures.indexOf('sizing_assistant')!=-1 && subuserFeatures.indexOf('sizing_assistant')!=-1) {
        moduleList.push({ icon: 'straighten', name: 'Sizing Assistant', state: '/product-extras/sizing-assistant', type: 'link' });
        routePermissionList.push("sizing_assistant");
      }
      if(ysFeatures.indexOf('currency_variation')!=-1 && subuserFeatures.indexOf('currency_variation')!=-1) {
        moduleList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/setup/currency-types', type: 'link' });
        routePermissionList.push("currency_types");
      }
      if(ysFeatures.indexOf('blogs')!=-1 && subuserFeatures.indexOf('blogs')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Blogs', state: '/features/blogs', type: 'link' });
        routePermissionList.push("blogs");
      }
      if(ysFeatures.indexOf('discounts_page')!=-1 && subuserFeatures.indexOf('discounts_page')!=-1) {
        moduleList.push({ icon: 'local_atm', name: 'Discounts Page', state: '/features/discounts-page', type: 'link' });
        routePermissionList.push("discounts_page");
      }
      if(ysFeatures.indexOf('collections')!=-1 && subuserFeatures.indexOf('collections')!=-1) {
        moduleList.push({ icon: 'view_carousel', name: 'Collections', state: '/features/collections', type: 'link' });
        routePermissionList.push("collections");
      }
      // if(ysFeatures.indexOf('dinamic_offers')!=-1) {
      //   moduleList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/features/dinamic-offers', type: 'link' });
      //   routePermissionList.push("dinamic_offers", "dinamic_offer_orders");
      // }
      if(ysFeatures.indexOf('appointment_scheduler')!=-1 && subuserFeatures.indexOf('appointment_scheduler')!=-1) {
        moduleList.push({ icon: 'book_online', name: 'Appointment Services', state: '/features/appointment-categories', type: 'link' });
        routePermissionList.push("appointment_services");
      }
      if(moduleList.length) sidePanelList.push({ name: 'Store Modules', type: 'dropDown', icon: 'view_week', sub: moduleList });
      // setting
      let settingList: IChildItem[] = [];
      if(ysFeatures.indexOf('tax_rates')!=-1 && subuserFeatures.indexOf('tax_rates')!=-1) {
        settingList.push({ icon: 'local_atm', name: 'Tax Rates', state: '/product-extras/tax-rates', type: 'link' });
        routePermissionList.push("tax_rates");
      }
      if(ysFeatures.indexOf('courier_partners')!=-1 && subuserFeatures.indexOf('courier_partners')!=-1) {
        settingList.push({ icon: 'contact_mail', name: 'Courier Partners', state: '/courier-partners', type: 'link' });
        routePermissionList.push("courier_partners");
      }
      if(ysFeatures.indexOf('time_based_delivery')!=-1 && subuserFeatures.indexOf('time_based_delivery')!=-1) {
        settingList.push({ icon: 'hourglass_top', name: 'Delivery Methods', state: '/shipping/delivery-methods', type: 'link' });
        routePermissionList.push("delivery_methods");
      }
      else if(subuserFeatures.indexOf('shipping_methods')!=-1) {
        settingList.push({ icon: 'local_shipping', name: 'Shipping Methods', state: '/shipping/shipping-methods', type: 'link' });
        routePermissionList.push("shipping_methods");
      }
      if(ysFeatures.indexOf('pincode_service')!=-1 && subuserFeatures.indexOf('pincode_service')!=-1) {
        settingList.push({ icon: 'fmd_good', name: 'Pincode Service', state: '/shipping/pincodes', type: 'link' });
        routePermissionList.push("pincodes");
      }
      if(subuserFeatures.indexOf('payment_gateway')!=-1) {
        settingList.push({ icon: 'payment', name: 'Payment Gateway', state: '/setup/payment-gateway', type: 'link' });
        routePermissionList.push("payment_gateway");
      }
      if(subuserFeatures.indexOf('store_setting')!=-1) {
        settingList.push({ icon: 'room_preferences', name: 'Store Settings', state: '/store-setting', type: 'link' });
        routePermissionList.push("store_setting");
      }
      if(settingList.length) sidePanelList.push({ name: 'Settings', type: 'dropDown', icon: 'settings', sub: settingList });
      // my account
      let accountList: IChildItem[] = [];
      if(subuserFeatures.indexOf('branches')!=-1) {
        accountList.push({ icon: 'store', name: 'Branches', state: '/account/branches', type: 'link' });
        routePermissionList.push("branches");
      }
      if(ysFeatures.indexOf('vendors')!=-1 && subuserFeatures.indexOf('branches')!=-1) {
        accountList.push({ icon: 'supervisor_account', name: 'Vendors', state: '/account/vendors', type: 'link' });
        routePermissionList.push("vendors");
      }
      if(accountList.length) sidePanelList.push({ name: 'My Account', type: 'dropDown', icon: 'account_circle', sub: accountList });
    }
    this.commonService.route_permission_list = routePermissionList;
    this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
    return sidePanelList;
  }

}
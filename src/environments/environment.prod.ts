export const environment = {
  production: true,
  ws_url: 'https://yourstore.io/api',
  img_baseurl: 'https://yourstore.io/api/',
  limited_product_count: 500,
  default_img_count: 15,
  variant_img_count: 30,
  quill_config: {
    modules: {
      syntax: false,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        // ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }], 
        [{ 'size': ['small', false, 'large', 'huge'] }],  
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],       
        // [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],                           
        ['link', 'image']                
      ]
    }
  },
  base_url: "https://yourstore.io/store-login-v2",
  razorpay_payment_url: "https://api.razorpay.com/v1/checkout/embedded",
  razorpay_dp_wallet_redirect_url: "https://yourstore.io/api/others/razorpay_dp_wallet_payment/5ceb9eb971f2cb809646edd2"
};
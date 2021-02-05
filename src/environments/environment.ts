export const environment = {
  production: false,
  ws_url: 'https://yourstore.io/api',
  img_baseurl: 'https://yourstore.io/api/',
  quill_config: {
    modules: {
      syntax: false,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }], 
        [{ 'size': ['small', false, 'large', 'huge'] }],  
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],       
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],                           
        ['link', 'image', 'video']                
      ]
    }
  }
};
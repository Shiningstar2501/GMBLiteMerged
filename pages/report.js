chrome.storage.local.get('rev_reviews',({rev_reviews})=>{
  document.body.insertAdjacentHTML('afterbegin',`<p>Total scraped reviews: ${rev_reviews||0}</p>`);
});

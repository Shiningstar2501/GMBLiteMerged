console.log('🧐 rev_reviews.js injected on', location.href);


(() => {
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

  const scrapeReviews = async () => {
    const btn = document.querySelector('button[aria-label^="Reviews for"]');
    console.log("button--->",btn);
    if (btn) btn.click();
    await sleep(1000);

    const panel = document.querySelector('div[role="region"]');
    console.log("pannel-->",panel);
    if (!panel) return;
    const scrollContainer = panel.querySelector('.m6QErb[aria-label]');
    console.log("scrollcotainer-->",scrollContainer);
    if (!scrollContainer) return;

    for (let i = 0; i < 10; i++) {
      scrollContainer.scrollBy(0, 1000);
      await sleep(600);
    }

    const blocks = [...scrollContainer.querySelectorAll('.jftiEf')];
    const months = {};
    blocks.forEach(b => {
      const rating = Number(b.querySelector('.kvMYJc')?.textContent || 0);
      const dateRaw = b.querySelector('.rsqaWe')?.textContent || '';
      const parts = dateRaw.split(' ');
      const month = parts[0] + ' ' + parts[parts.length - 1];
      if (!months[month]) months[month] = { count: 0, sum: 0 };
      months[month].count += 1;
      months[month].sum += rating;
    });

    const monthly = Object.entries(months)
      .map(([month, v]) => ({ month, count: v.count, avg: v.sum / v.count }))
      .sort((a, b) => new Date('1 ' + a.month) - new Date('1 ' + b.month));
    console.log("monthly=--->",monthly);
    chrome.runtime.sendMessage({ type: 'REV_CHART_DATA', data: monthly });
    chrome.runtime.sendMessage({ type: 'REV_REVIEWS', data: blocks.length });
  };

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'scrape_reviews') scrapeReviews();
  });
})();

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Log browser console
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  page.on('response', async response => {
    if (response.url().includes('/auth/me') || response.url().includes('localhost') || response.url().includes('login')) {
      console.log('NETWORK RESPONSE:', response.url(), response.status());
    }
  });

  console.log('Navigating to login...');
  await page.goto('https://flyajwa2.vercel.app/login', { waitUntil: 'networkidle0' });

  console.log('Typing credentials...');
  await page.type('input[type="email"]', 'shamuzlaptop@gmail.com');
  await page.type('input[type="password"]', 'Shamal@123');

  console.log('Clicking sign in...');
  await page.click('button[type="submit"]');

  console.log('Waiting for navigation...');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  console.log('Current URL after navigation:', page.url());

  const token = await page.evaluate(() => localStorage.getItem('flyajwa_token'));
  console.log('Local Storage Token:', token ? token.substring(0, 30) + '...' : 'NULL');

  await browser.close();
})();

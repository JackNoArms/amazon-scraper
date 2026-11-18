import { JSDOM } from 'jsdom';

/** Parse only public search HTML into plain product data. The real site can change. */
export class AmazonParser {
  parse(html) {
    if (typeof html !== 'string' || html.length > 5_000_000) {
      throw new TypeError('Resposta HTML inválida ou muito grande.');
    }
    const { document } = new JSDOM(html).window;
    const products = [];
    const items = document.querySelectorAll('.s-result-item[data-component-type="s-search-result"]');
    items.forEach(item => {
      const titleNode = item.querySelector('h2 a') || item.querySelector('.a-text-normal');
      const title = titleNode?.textContent?.trim();
      if (!title) return;
      let url = null;
      try {
        const href = titleNode.getAttribute('href');
        const parsed = new URL(href, 'https://www.amazon.com');
        if (parsed.protocol === 'https:' && parsed.hostname === 'www.amazon.com') url = parsed.href;
      } catch { /* A product without a valid external link is still displayable. */ }
      const rawRating = item.querySelector('.a-icon-star-small .a-icon-alt')?.textContent;
      const number = Number.parseFloat(String(rawRating ?? '').replace(',', '.'));
      const rating = Number.isFinite(number) && number >= 0 && number <= 5 ? number : null;
      const reviewCount = item.querySelector('.a-size-small .a-link-normal')?.textContent?.replace(/[^0-9]/g,'') || null;
      const imageUrl = item.querySelector('.s-image')?.getAttribute('src') || null;
      const price = item.querySelector('.a-price .a-offscreen')?.textContent?.trim() || null;
      products.push({ title, url, rating, reviewCount, imageUrl, price, prime: !!item.querySelector('.a-icon-prime') });
    });
    return products;
  }
}

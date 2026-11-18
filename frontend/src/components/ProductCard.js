/** Builds cards using textContent, never interpolating untrusted scraped HTML. */
const placeholder='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 130"><rect width="180" height="130" rx="8" fill="#1e282f"/><path d="M35 95L75 45l28 30 19-19 26 39" fill="none" stroke="#607782" stroke-width="5"/><circle cx="133" cy="35" r="10" fill="#607782"/></svg>');
function safeHttps(url){
  const allowed=new Set(['m.media-amazon.com','images-na.ssl-images-amazon.com','images-eu.ssl-images-amazon.com','images-fe.ssl-images-amazon.com']);
  try{const obj=new URL(url);return obj.protocol==='https:'&&allowed.has(obj.hostname)?obj.href:null;}catch{return null;}
}
function safeAmazon(url){
  try{const obj=new URL(url);return obj.protocol==='https:'&&['amazon.com','www.amazon.com'].includes(obj.hostname)?obj.href:null;}catch{return null;}
}
export class ProductCard {
  constructor(product){this.product=product;}
  render(){
    const p=this.product||{};
    const card=document.createElement('article');
    card.className='product-card';
    const media=document.createElement('div');media.className='product-image-container';
    const image=document.createElement('img');image.className='product-image';image.loading='lazy';
    image.src=safeHttps(p.imageUrl)||placeholder;image.alt=String(p.title||'Produto');
    image.addEventListener('error',()=>{if(image.src!==placeholder)image.src=placeholder;});
    media.append(image);
    const detail=document.createElement('div');detail.className='product-details';
    const title=document.createElement('h3');title.className='product-title';
    title.textContent=String(p.title||'Produto sem título');
    const url=safeAmazon(p.url);
    if(url){const anchor=document.createElement('a');anchor.href=url;anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.textContent=title.textContent;title.replaceChildren(anchor);}
    const rating=document.createElement('div');rating.className='product-rating';
    const score=Number(p.rating);
    const rated=Number.isFinite(score)&&score>=0&&score<=5&&score!==0;
    rating.textContent=rated?'★ '+score.toFixed(1)+' / 5':'Sem avaliação';
    if(p.reviewCount){const reviews=document.createElement('small');reviews.textContent=' · '+String(p.reviewCount)+' avaliações';rating.append(reviews);}
    const price=document.createElement('div');price.className='price-section';price.textContent=p.price?String(p.price):'Preço não informado';
    detail.append(title,rating,price);
    if(p.prime){const prime=document.createElement('span');prime.className='prime-badge';prime.textContent='✓ Prime';detail.append(prime);}
    card.append(media,detail);return card;
  }
}

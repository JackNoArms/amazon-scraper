import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ProductCard} from '../frontend/src/components/ProductCard.js';
import {HomePage} from '../frontend/src/pages/HomePage.js';

function withDOM(callback){
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost:5173'});
 globalThis.window=dom.window;globalThis.document=dom.window.document;
 try{return callback(dom.window)}finally{delete globalThis.window;delete globalThis.document;dom.window.close()}
}

test('product cards render untrusted title as literal text',()=>{
 withDOM(()=>{
  const title='<img src=x onerror=alert(1)>';
  const el=new ProductCard({title,price:'US$ 12',url:'javascript:alert(1)'}).render();
  assert.equal(el.querySelector('h3').textContent,title);
  assert.equal(el.querySelector('h3 img'),null);
  assert.equal(el.querySelector('h3 a'),null);
  assert.equal(el.querySelector('.price-section').textContent,'US$ 12');
 });
});

test('only HTTPS amazon.com links become product title anchors',()=>{
 withDOM(()=>{
  const valid=new ProductCard({title:'ok',url:'https://www.amazon.com/dp/TEST'}).render().querySelector('h3 a');
  assert.ok(valid);
  assert.equal(valid.rel,'noopener noreferrer');
  assert.equal(valid.target,'_blank');
  assert.equal(new ProductCard({title:'bad',url:'https://amazon.com.evil.test/fake'}).render().querySelector('h3 a'),null);
 });
});

test('external tracking image hosts are rejected',()=>{
 withDOM(()=>{
  const card=new ProductCard({title:'ok',imageUrl:'https://tracking.bad-site.test/pixel.png'}).render();
  assert.ok(card.querySelector('img').src.startsWith('data:image/svg+xml,'));
 });
});

test('home page displays eight labeled example products without network',()=>{
 withDOM(()=>{
  const page=new HomePage({apiClient:{scrapeProducts:()=>{throw Error('demo should not call API')}}});
  const el=page.render();
  assert.equal(el.querySelectorAll('.product-card').length,8);
  assert.match(el.querySelector('.results-meta').textContent,/fictícios/);
  assert.equal(el.querySelectorAll('.product-title a').length,0);
  assert.equal(el.querySelectorAll('.pagination button').length,0);
 });
});

test('home page emits clear error and offers demo fallback',async()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost:5173'});
 globalThis.window=dom.window;globalThis.document=dom.window.document;
 try {
  const home=new HomePage({apiClient:{scrapeProducts:async()=>{throw new Error('Backend indisponível')}}});
  home.render();
  await home.handleSearch('teclado');
  assert.match(home.productsContainer.textContent,/Backend indisponível/);
  assert.equal(home.productsContainer.querySelector('[role=alert]')!==null,true);
  home.productsContainer.querySelector('.demo-btn').click();
  assert.equal(home.productsContainer.querySelectorAll('.product-card').length,8);
 } finally {delete globalThis.window;delete globalThis.document;dom.window.close()}
});

test('paginated results use backend response.products',async()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost:5173'});
 globalThis.window=dom.window;globalThis.document=dom.window.document;
 try{
  const pages=[];
  const home=new HomePage({apiClient:{scrapeProducts:async(query,page)=>{pages.push([query,page]);return {products:[{title:'Produto página '+page,price:'$20'}],page,count:1}}}});
  home.render();
  await home.handleSearch('teclado',1);
  assert.equal(home.currentPage,1);
  assert.equal(home.pagination.querySelectorAll('button').length,2);
  assert.equal(home.pagination.querySelectorAll('button')[0].disabled,true);
  await home.handleSearch('teclado',2);
  assert.match(home.productsContainer.textContent,/página 2/);
  assert.equal(home.pagination.querySelectorAll('button')[0].disabled,false);
  assert.deepEqual(pages,[['teclado',1],['teclado',2]]);
 }finally{delete globalThis.window;delete globalThis.document;dom.window.close()}
});

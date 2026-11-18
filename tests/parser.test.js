import test from 'node:test';
import assert from 'node:assert/strict';
import {AmazonParser} from '../backend/src/infrastructure/parsers/AmazonParser.js';
import {FetchAmazonProductsUseCase} from '../backend/src/domain/useCases/FetchAmazonProductsUseCase.js';

const sample = `<!doctype html><html><body>
  <div class="s-result-item" data-component-type="s-search-result">
    <h2><a href="/dp/DEMO01234"><span>Teclado seguro</span></a></h2>
    <img class="s-image" src="https://m.media-amazon.com/images/I/demo.jpg">
    <span class="a-price"><span class="a-offscreen">$45.20</span></span>
    <span class="a-icon-star-small"><span class="a-icon-alt">4.3 out of 5</span></span>
    <span class="a-icon-prime"></span>
  </div>
  <div class="s-result-item" data-component-type="s-search-result">
    <h2><a href="javascript:alert(1)">Título &amp; preço</a></h2>
  </div>
</body></html>`;

test('parser extracts title, rating, price and safe Amazon URLs', () => {
 const results = new AmazonParser().parse(sample);
 assert.equal(results.length,2);
 assert.equal(results[0].title,'Teclado seguro');
 assert.equal(results[0].price,'$45.20');
 assert.equal(results[0].rating,4.3);
 assert.equal(results[0].prime,true);
 assert.match(results[0].url,/^https:\/\/www\.amazon\.com\/dp\//);
 assert.equal(results[1].url,null);
 assert.equal(results[1].title,'Título & preço');
});

test('parser does not accept invalid or huge HTML', () => {
 const parser=new AmazonParser();
 assert.throws(()=>parser.parse(null),/inválida/);
 assert.throws(()=>parser.parse('x'.repeat(5_000_001)),/grande/);
});

test('use case rejects malformed queries without contacting provider',async()=>{
 let calls=0;
 const useCase=new FetchAmazonProductsUseCase({httpClient:{fetchSearchResults:async()=>{calls++;return sample}},parser:new AmazonParser()});
 for(const [keyword,page] of [['',1],['a',1],['b'.repeat(91),1],['fone',0],['fone',4],['fone',2.5]]){
  await assert.rejects(useCase.execute(keyword,page),RangeError);
 }
 assert.equal(calls,0);
});

test('use case uses page and safe parsed output',async()=>{
 let call;
 const useCase=new FetchAmazonProductsUseCase({
  httpClient:{fetchSearchResults:async(q,p)=>{call=[q,p];return sample}},
  parser:new AmazonParser()
 });
 const items=await useCase.execute('  teclado  ',2);
 assert.deepEqual(call,['teclado',2]);
 assert.equal(items.length,2);
});

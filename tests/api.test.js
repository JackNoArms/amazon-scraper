import test from 'node:test';
import assert from 'node:assert/strict';
import {app} from '../backend/index.js';
import {ScrapeController} from '../backend/src/presentation/controllers/ScrapeController.js';

test('API health reports only public service information',async()=>{
 const server=app.listen(0,'127.0.0.1');
 try{
  await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject)});
  const {port}=server.address();
  const res=await fetch('http://127.0.0.1:'+port+'/api/health');
  assert.equal(res.status,200);
  assert.deepEqual(await res.json(),{status:'ok',service:'product-discovery-lab'});
  assert.equal(res.headers.get('x-powered-by'),null);
 }finally{await new Promise(resolve=>server.close(resolve))}
});

test('controller maps validation failures to a 400 response',async()=>{
 const controller=new ScrapeController({execute:async()=>{throw new RangeError('A página deve estar entre 1 e 3.')}});
 const captured={status:null,payload:null};
 const res={status(n){captured.status=n;return this},json(p){captured.payload=p;return this}};
 await controller.scrapeProducts({query:{keyword:'ok',page:'0'}},res);
 assert.equal(captured.status,400);
 assert.match(captured.payload.message,/página/);
});

test('controller exposes only safe error on provider failure',async()=>{
 const controller=new ScrapeController({execute:async()=>{throw new Error('https://evil?key=PRIVATE')}});
 const captured={code:null,body:null};
 await controller.scrapeProducts({query:{keyword:'fone',page:'1'}},{
  status(v){captured.code=v;return this},
  json(v){captured.body=v;return this}
 });
 assert.equal(captured.code,502);
 assert.doesNotMatch(JSON.stringify(captured.body),/PRIVATE|evil/);
});

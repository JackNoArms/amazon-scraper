import express from 'express';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {scrapeRouter} from './src/presentation/routes/scrapeRoutes.js';

const app=express();
const backendDir=dirname(fileURLToPath(import.meta.url));
const frontendDir=resolve(backendDir,'../frontend');

app.disable('x-powered-by');
app.use((_req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; "+
    "img-src 'self' data: https://m.media-amazon.com https://images-na.ssl-images-amazon.com "+
    "https://images-eu.ssl-images-amazon.com https://images-fe.ssl-images-amazon.com; "+
    "object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  next();
});
app.use(express.json({limit:'16kb'}));
app.get('/api/health',(_req,res)=>res.json({status:'ok',service:'product-discovery-lab'}));
app.use('/api/scrape',scrapeRouter);

// Same-origin UI. Only explicitly public files are served; no node_modules or configuration.
app.get('/',(_req,res)=>res.sendFile(join(frontendDir,'index.html')));
app.use('/src',express.static(join(frontendDir,'src'),{dotfiles:'deny',index:false}));
app.use((err,_req,res,_next)=>{
  console.error('API request failed:',err?.name||'UnknownError');
  res.status(500).json({message:'Erro interno temporário.'});
});

const PORT=Number(process.env.PORT||3000);
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  app.listen(PORT,'127.0.0.1',()=>console.log('Product Discovery Lab em http://127.0.0.1:'+PORT));
}
export {app};

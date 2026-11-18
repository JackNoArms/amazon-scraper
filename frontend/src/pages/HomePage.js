import {SearchForm} from '../components/SearchForm.js';
import {ProductCard} from '../components/ProductCard.js';
import {ApiClient} from '../core/api/apiClient.js';

const demoProducts = [
 {title:'Teclado compacto sem fio · exemplo',price:'US$ 39,90',rating:4.2,reviewCount:25,prime:false},
 {title:'Fone circum-aural · exemplo',price:'US$ 59,00',rating:4.5,reviewCount:42,prime:true},
 {title:'Mouse ergonômico · exemplo',price:'US$ 24,50',rating:4.0,reviewCount:13,prime:false},
 {title:'Monitor IPS 24” · exemplo',price:'US$ 179,90',rating:4.7,reviewCount:31,prime:true},
 {title:'Webcam HD · exemplo',price:'US$ 48,20',rating:4.1,reviewCount:17,prime:false},
 {title:'Hub USB-C · exemplo',price:'US$ 29,90',rating:4.3,reviewCount:36,prime:true},
 {title:'Suporte de notebook · exemplo',price:'US$ 21,00',rating:4.4,reviewCount:20,prime:false},
 {title:'Luminária de mesa · exemplo',price:'US$ 34,80',rating:4.0,reviewCount:11,prime:false},
];

/** No fake Amazon listings: demo entries are synthetic and have no outbound links. */
export class HomePage {
 constructor({apiClient=new ApiClient()}={}){
  this.apiClient=apiClient;this.currentPage=1;this.currentKeyword='';this.demo=true;this.hasNext=false;this.requestId=0;
  this.productsContainer=document.createElement('section');this.productsContainer.className='products-container';this.productsContainer.id='products';
  this.productsContainer.setAttribute('aria-label','Resultados');
  this.pagination=document.createElement('nav');this.pagination.className='pagination';this.pagination.setAttribute('aria-label','Paginação de resultados');
  this.status=document.createElement('p');this.status.className='results-meta';this.status.setAttribute('role','status');this.status.setAttribute('aria-live','polite');
  this.loading=document.createElement('div');this.loading.className='loading hidden';this.loading.setAttribute('role','status');this.loading.textContent='Consultando dados públicos...';
 }
 displayProducts(products){
  this.productsContainer.replaceChildren();
  if(!products.length){const msg=document.createElement('p');msg.className='empty';msg.textContent='Nenhum resultado nesta página. Ajuste sua busca ou volte à página anterior.';this.productsContainer.append(msg);return;}
  const frag=document.createDocumentFragment();products.forEach(p=>frag.append(new ProductCard(p).render()));this.productsContainer.append(frag);
 }
 renderPagination(){
  this.pagination.replaceChildren();
  if(this.demo||this.currentPage===1&&!this.hasNext)return;
  const prev=document.createElement('button');prev.type='button';prev.className='paging';prev.textContent='← Anterior';prev.disabled=this.currentPage<=1;
  prev.addEventListener('click',()=>this.handleSearch(this.currentKeyword,this.currentPage-1));
  const marker=document.createElement('span');marker.className='page-number';marker.textContent='Página '+this.currentPage;
  const next=document.createElement('button');next.type='button';next.className='paging';next.textContent='Próxima →';next.disabled=!this.hasNext||this.currentPage>=3;
  next.addEventListener('click',()=>this.handleSearch(this.currentKeyword,this.currentPage+1));
  this.pagination.append(prev,marker,next);
 }
 showError(text){
  this.productsContainer.replaceChildren();
  const alert=document.createElement('div');alert.className='error-message';alert.setAttribute('role','alert');
  const heading=document.createElement('strong');heading.textContent='Não foi possível carregar a consulta';
  const explanation=document.createElement('p');explanation.textContent=String(text||'Erro desconhecido');
  const recovery=document.createElement('button');recovery.className='demo-btn';recovery.type='button';recovery.textContent='Ver dados de demonstração';
  recovery.addEventListener('click',()=>this.showDemo());
  alert.append(heading,explanation,recovery);this.productsContainer.append(alert);
 }
 showDemo(){
  this.requestId++;this.loading.classList.add('hidden');
  this.demo=true;this.currentPage=1;this.hasNext=false;
  this.status.textContent='DEMONSTRAÇÃO · 8 produtos e preços fictícios · sem coleta real';
  this.status.classList.add('demo-meta');
  this.displayProducts(demoProducts);this.renderPagination();
 }
 async handleSearch(keyword,page=1){
  if(page<1||page>3)return;
  const id=++this.requestId;this.currentKeyword=keyword;this.currentPage=page;this.demo=false;
  this.loading.classList.remove('hidden');this.status.textContent='Pesquisando dados públicos...';
  this.status.classList.remove('demo-meta');
  try{
    const response=await this.apiClient.scrapeProducts(keyword,page);
    if(id!==this.requestId)return;
    this.hasNext=response.products.length>0&&page<3;
    this.displayProducts(response.products);this.renderPagination();
    this.status.textContent=response.products.length+' resultado(s) retornado(s) · página '+page+' · dados públicos (sujeitos à disponibilidade da fonte)';
  }catch(error){
    if(id!==this.requestId)return;
    this.hasNext=false;this.showError(error.message);this.renderPagination();
    this.status.textContent='Consulta não disponível';
  }finally{if(id===this.requestId)this.loading.classList.add('hidden');}
 }
 render(){
  const page=document.createElement('main');page.className='home-page';page.id='content';
  const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='ESTUDO 03 / ENGENHARIA FULL STACK';
  const h1=document.createElement('h1');h1.textContent='Explore produtos. ';const accent=document.createElement('span');accent.className='accent';accent.textContent='Entenda os resultados.';h1.append(accent);
  const desc=document.createElement('p');desc.className='intro';desc.textContent='Uma interface de exploração de dados públicos de produtos, com atenção à procedência, validação e limitações de coleta.';
  const row=document.createElement('div');row.className='search-wrap';
  row.append(new SearchForm(term=>this.handleSearch(term,1)).render());
  const demoButton=document.createElement('button');demoButton.className='demo-btn';demoButton.type='button';demoButton.textContent='Ver demonstração';demoButton.addEventListener('click',()=>this.showDemo());row.append(demoButton);
  const heading=document.createElement('div');heading.className='results-heading';
  const sectionTitle=document.createElement('h2');sectionTitle.textContent='Resultados';heading.append(sectionTitle,this.status);
  const note=document.createElement('aside');note.className='disclaimer';note.textContent='Demonstração: os produtos e preços são fictícios. Consultas reais podem ser bloqueadas pela fonte e não usam contorno de CAPTCHA, proxies ou login automatizado.';
  page.append(eyebrow,h1,desc,row,note,this.loading,heading,this.productsContainer,this.pagination);
  this.showDemo();
  return page;
 }
}

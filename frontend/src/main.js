import {HomePage} from './pages/HomePage.js';
import './styles/main.css';

const app=document.getElementById('app');
const header=document.createElement('header');header.className='site-header';
const mark=document.createElement('a');mark.className='site-brand';mark.href='#content';mark.textContent='PRODUCT / LAB';
const caption=document.createElement('span');caption.className='header-caption';caption.textContent='DATA EXPLORATION · PORTFOLIO';
header.append(mark,caption);
const page=new HomePage();
app.append(header,page.render());

window.addEventListener('error',event=>{
  console.error('Frontend render error:',event.error?.name||'UnknownError');
  const area=document.createElement('div');area.className='global-error';area.setAttribute('role','alert');
  const title=document.createElement('h2');title.textContent='A interface encontrou um erro';
  const body=document.createElement('p');body.textContent='Atualize a página para tentar novamente.';
  const button=document.createElement('button');button.type='button';button.textContent='Recarregar';button.addEventListener('click',()=>window.location.reload());
  area.append(title,body,button);app.replaceChildren(area);
});

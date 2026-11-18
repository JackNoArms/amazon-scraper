export class SearchForm {
  constructor(onSearch) { this.onSearch = onSearch; }
  render() {
    const form = document.createElement('form');
    form.className = 'search-form';
    form.setAttribute('aria-label','Pesquisar produtos');
    const label = document.createElement('label');
    label.className = 'visually-hidden';
    label.htmlFor = 'keyword'; label.textContent = 'Nome do produto';
    const input=document.createElement('input');
    input.id='keyword'; input.name='keyword'; input.type='search';
    input.maxLength=90; input.minLength=2; input.required=true;
    input.autocomplete='off'; input.className='search-input';
    input.placeholder='Ex.: teclado mecânico, monitor...';
    const button=document.createElement('button');
    button.type='submit';button.className='search-button';
    button.textContent='Pesquisar  ↗';
    form.append(label,input,button);
    form.addEventListener('submit',event=>{
      event.preventDefault(); const term=input.value.trim();
      if(term.length<2){input.setCustomValidity('Digite pelo menos 2 caracteres.');input.reportValidity();return;}
      input.setCustomValidity('');this.onSearch(term);
    });
    input.addEventListener('input',()=>input.setCustomValidity(''));
    return form;
  }
}

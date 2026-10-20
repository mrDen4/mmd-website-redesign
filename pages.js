document.querySelectorAll('.document-card').forEach(button=>button.addEventListener('click',()=>openImageViewer(button.querySelector('img'))));
const detail=document.createElement('a');detail.className='image-detail';detail.textContent='Подробнее';detail.target='_blank';detail.rel='noopener';viewer.append(detail);
new MutationObserver(()=>{detail.href=viewer.querySelector('img').src}).observe(viewer.querySelector('img'),{attributes:true,attributeFilter:['src']});
for(const type of ['services','news','sales']){
 const list=document.querySelector('.'+type+'__list'),button=document.querySelector('.'+type+'__btn');if(!list||!button)continue;
 const cards=[...list.children];let shown=6;
 const count=document.createElement('p');count.className='page-count';count.setAttribute('aria-live','polite');list.after(count);
 const update=()=>{cards.forEach((card,i)=>card.hidden=i>=shown);count.textContent=`Показано ${Math.min(shown,cards.length)} из ${cards.length}`;button.hidden=shown>=cards.length};
 update();button.addEventListener('click',()=>{const next=cards[shown];shown+=6;update();next?.querySelector('a')?.focus({preventScroll:true})});
}
document.querySelectorAll('main img').forEach(img=>{if(!img.closest('.service-hero'))img.loading='lazy'});
// Keep long review collections compact while retaining every document.
document.querySelectorAll('.document-grid').forEach(grid=>{
 const cards=[...grid.children];if(cards.length<=4)return;
 let shown=4;const more=document.createElement('button');more.type='button';more.className='btn documents-more';more.textContent='Еще отзывы';grid.after(more);
 const update=()=>{cards.forEach((card,i)=>card.hidden=i>=shown);more.hidden=shown>=cards.length};update();more.onclick=()=>{shown+=4;update()};
});

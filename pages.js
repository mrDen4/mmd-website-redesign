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
document.querySelectorAll('main img').forEach(img=>{if(!img.closest('.service-hero, .contact-hero'))img.loading='lazy'});
// Keep long review collections compact while retaining every document.
document.querySelectorAll('.document-grid:not(.contact-reviews)').forEach(grid=>{
 const cards=[...grid.children];if(cards.length<=4)return;
 let shown=4;const more=document.createElement('button');more.type='button';more.className='btn documents-more';more.textContent='Еще отзывы';grid.after(more);
 const update=()=>{cards.forEach((card,i)=>card.hidden=i>=shown);more.hidden=shown>=cards.length};update();more.onclick=()=>{shown+=4;update()};
});

(() => {
 const track=document.querySelector('.contact-reviews');
 if(!track)return;
 const prev=document.querySelector('.contact-review-prev');
 const next=document.querySelector('.contact-review-next');
 const update=()=>{prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2};
 const move=direction=>track.scrollBy({left:direction*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',update,{passive:true});
 new ResizeObserver(update).observe(track);
 update();
})();

// Start the sequence only when both foreground layers are decoded.
(() => {
 const scene=document.querySelector('.contact-scene');
 if(!scene)return;
 Promise.all([...scene.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))).then(()=>scene.classList.add('is-ready'));
})();

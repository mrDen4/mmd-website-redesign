for(const type of ['services','brigades','news','sales']){
 const list=document.querySelector('.'+type+'__list'),button=document.querySelector('.'+type+'__btn');if(!list||!button)continue;
 const cards=[...list.children];let shown=6;
 const update=()=>{cards.forEach((card,i)=>card.hidden=i>=shown);button.hidden=shown>=cards.length};
 update();button.addEventListener('click',()=>{const next=cards[shown];shown+=6;update();next?.querySelector('a')?.focus({preventScroll:true})});
}
document.querySelectorAll('main img').forEach(img=>{if(!img.closest('.service-hero, .contact-hero'))img.loading='lazy'});
// Start the sequence only when both foreground layers are decoded.
(() => {
 const scene=document.querySelector('.contact-scene');
 if(!scene)return;
 Promise.all([...scene.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))).then(()=>scene.classList.add('is-ready'));
})();

// Review strips use arrows and swiping; every document remains available.
document.querySelectorAll('.review-carousel').forEach(track=>{
 const section=track.closest('.document-section');
 const prev=section.querySelector('.review-carousel-prev');
 const next=section.querySelector('.review-carousel-next');
 if(!prev||!next)return;
 const update=()=>{prev.disabled=track.scrollLeft<=1;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2};
 const move=direction=>track.scrollBy({left:direction*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',update,{passive:true});
 new ResizeObserver(update).observe(track);update();
});

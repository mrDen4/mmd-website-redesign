document.querySelectorAll('.review-documents').forEach(section=>{
 const track=section.querySelector('.contact-reviews');
 const prev=section.querySelector('.contact-review-prev');
 const next=section.querySelector('.contact-review-next');
 if(!track||!prev||!next)return;
 const update=()=>{prev.disabled=track.scrollLeft<=1;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2};
 const move=direction=>track.scrollBy({left:direction*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);update();
});

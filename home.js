// Animate only the visible value; structured data and the accessible price stay final.
(() => {
  const price = document.querySelector('.hero__text .text__price');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!price || motion.matches) return;
  const original = price.textContent.trim();
  const target = Number(price.dataset.price);
  if (!Number.isFinite(target) || target <= 0) return;
  const readable = document.createElement('span');
  readable.className = 'typing-readable';
  readable.textContent = original;
  const visible = document.createElement('span');
  visible.setAttribute('aria-hidden','true');
  const format = new Intl.NumberFormat('ru-RU');
  visible.textContent = 'от 0 ₽/час';
  price.replaceChildren(readable, visible);
  let frame;
  let start;
  let timer;
  function finish() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    price.textContent = original;
  }
  function tick(now) {
    if (start === undefined) start = now;
    const progress = Math.min((now-start)/1450,1);
    const eased = 1-Math.pow(1-progress,3);
    visible.textContent = 'от '+format.format(Math.round(target*eased))+' ₽/час';
    if (progress < 1) frame = requestAnimationFrame(tick);
    else finish();
  }
  timer = setTimeout(() => { frame = requestAnimationFrame(tick); }, 550);
  motion.addEventListener('change', event => { if (event.matches) finish(); });
  window.addEventListener('beforeprint', finish);
})();

const homeDetails=document.createElement('a');
homeDetails.className='btn review-details';
homeDetails.textContent='Подробнее';
viewer.append(homeDetails);
document.querySelectorAll('.slides__slide').forEach(slide=>{slide.addEventListener('click',()=>{homeDetails.href=slide.closest('.reviews')?'https://03.com.ru/otzyivyi':'https://03.com.ru/liczenzii'} ,true)});

const reviewTrack=document.querySelector('.reviews__slider');
const prevReview=document.querySelector('.review-prev');
const nextReview=document.querySelector('.review-next');
function updateReviewButtons(){prevReview.disabled=reviewTrack.scrollLeft<2;nextReview.disabled=reviewTrack.scrollLeft+reviewTrack.clientWidth>=reviewTrack.scrollWidth-2}
prevReview.addEventListener('click',()=>reviewTrack.scrollBy({left:-reviewTrack.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
nextReview.addEventListener('click',()=>reviewTrack.scrollBy({left:reviewTrack.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
reviewTrack.addEventListener('scroll',updateReviewButtons);window.addEventListener('resize',updateReviewButtons);updateReviewButtons();
document.querySelectorAll('.reviews__slide img').forEach(img=>{img.loading='lazy'});

// Reveal text in place: original wrapping, links and the phone panel stay intact.
(() => {
  const section = document.querySelector('.service-about');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!section || motion.matches || !('IntersectionObserver' in window)) return;
  const blocks = [...section.querySelectorAll('.service-about__text > p:last-child')];
  const entries = new Map();
  const active = new Set();
  let frame = 0;
  const observer = new IntersectionObserver(items => {
    for (const item of items) {
      if (!item.isIntersecting) continue;
      observer.unobserve(item.target);
      const entry = entries.get(item.target);
      if (entry && !entry.done) {
        entry.start = performance.now();
        active.add(entry);
      }
    }
    if (active.size && !frame) frame = requestAnimationFrame(tick);
  }, { threshold: 0.12 });

  function finish(entry) {
    entry.done = true;
    entry.cursor?.classList.remove('typing-cursor');
    // Restore the original text nodes for selection and assistive technology.
    for (const part of entry.parts) part.wrapper.replaceWith(part.node);
    active.delete(entry);
    observer.unobserve(entry.block);
  }
  function tick(now) {
    frame = 0;
    for (const entry of active) {
      const count = Math.min(entry.chars.length, Math.floor((now-entry.start) / entry.delay) + 1);
      entry.cursor?.classList.remove('typing-cursor');
      while (entry.shown < count) entry.chars[entry.shown++].classList.add('typed');
      if (count === entry.chars.length) { finish(entry); continue; }
      entry.cursor = entry.chars[Math.max(0, count-1)];
      entry.cursor?.classList.add('typing-cursor');
    }
    if (active.size) frame = requestAnimationFrame(tick);
  }
  for (const block of blocks) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
    const entry = { block, chars: [], parts: [], shown: 0, done: false, cursor: null };
    for (const node of nodes) {
      const wrapper = document.createElement('span');
      wrapper.className = 'typing-run';
      // One unchanged accessible copy; character animation is purely visual.
      const readable = document.createElement('span');
      readable.className = 'typing-readable';
      readable.textContent = node.textContent;
      wrapper.append(readable);
      const visual = document.createElement('span');
      visual.setAttribute('aria-hidden', 'true');
      for (const char of Array.from(node.textContent)) {
        const span = document.createElement('span');
        span.className = 'typing-char';
        span.textContent = char;
        visual.append(span);
        entry.chars.push(span);
      }
      wrapper.append(visual);
      node.replaceWith(wrapper);
      entry.parts.push({ wrapper, node });
    }
    if (!entry.chars.length) continue;
    entry.delay = Math.min(18, 4200 / entry.chars.length);
    entries.set(block, entry);
    observer.observe(block);
  }
  section.addEventListener('focusin', event => {
    const block = event.target.closest('p, h2');
    const entry = entries.get(block);
    if (entry && !entry.done) finish(entry);
  });
  const revealAll = () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
    for (const entry of entries.values()) if (!entry.done) finish(entry);
  };
  motion.addEventListener('change', event => { if (event.matches) revealAll(); });
  window.addEventListener('beforeprint', revealAll);
})();

// Animate only the visible value; structured data and the accessible price stay final.
(() => {
  const price = document.querySelector('.service-hero__text .text__price');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!price || motion.matches) return;
  const original = price.textContent.trim();
  const target = Number(price.getAttribute('content'));
  if (!Number.isFinite(target) || target <= 0) return;
  const readable = document.createElement('span');
  readable.className = 'typing-readable';
  readable.textContent = original;
  const visible = document.createElement('span');
  visible.setAttribute('aria-hidden','true');
  const format = new Intl.NumberFormat('ru-RU');
  visible.textContent = 'от 0 ₽';
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
    visible.textContent = 'от '+format.format(Math.round(target*eased))+' ₽';
    if (progress < 1) frame = requestAnimationFrame(tick);
    else finish();
  }
  timer = setTimeout(() => { frame = requestAnimationFrame(tick); }, 550);
  motion.addEventListener('change', event => { if (event.matches) finish(); });
  window.addEventListener('beforeprint', finish);
})();

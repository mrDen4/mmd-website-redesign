const menuButton=document.querySelector('.header__hamburger');
const menu=document.querySelector('.popup-menu');
const menuShade=document.createElement('div');
menuShade.className='menu-shade';
menuShade.setAttribute('aria-hidden','true');
document.body.append(menuShade);
menuButton.querySelector('img')?.setAttribute('aria-hidden','true');
const menuGlyph=document.createElement('span');
menuGlyph.className='menu-glyph';
menuGlyph.setAttribute('aria-hidden','true');
menuGlyph.innerHTML='<span></span><span></span><span></span>';
menuButton.append(menuGlyph);
menuShade.addEventListener('click',()=>closeMenu());
document.addEventListener('click',event=>{
  if(menuButton.getAttribute('aria-expanded')==='true'&&!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
});
let menuAnimation;
function setMenuOpen(open) {
  menuAnimation?.cancel();
  document.body.classList.toggle('mobile-menu-open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
  menu.inert=!open;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { menu.hidden=!open; return; }
  if (!open && menu.hidden) return;
  menu.hidden=false;
  const frames=open
    ? [{opacity:0,transform:'translateY(-18px)'},{opacity:1,transform:'translateY(0)'}]
    : [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-18px)'}];
  const animation=menu.animate(frames,{duration:open?300:200,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
  menuAnimation=animation;
  animation.finished.then(()=>{if(menuAnimation!==animation)return;menu.hidden=!open;animation.cancel();menuAnimation=null}).catch(()=>{});
}
function closeMenu(){setMenuOpen(false)}
menuButton.addEventListener('click',()=>setMenuOpen(menuButton.getAttribute('aria-expanded')!=='true'));
matchMedia('(min-width:1024px)').addEventListener('change',event=>{if(event.matches)closeMenu()});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
const popup=document.querySelector('#callback-popup');const backdrop=document.querySelector('.bg');let previousFocus;
function openPopup(){previousFocus=document.activeElement;closeMenu();popup.hidden=false;backdrop.hidden=false;document.body.style.overflow='hidden';popup.querySelector('input:not([type=hidden]):not([name=nospam])').focus()}
function closePopup(){popup.hidden=true;backdrop.hidden=true;document.body.style.overflow='';previousFocus?.focus()}
document.querySelectorAll('.btns__btn,[data-callback]').forEach(button=>button.addEventListener('click',openPopup));
document.querySelector('button.footer__btn').addEventListener('click',openPopup);
popup.querySelector('.popup__exit').addEventListener('click',closePopup);backdrop.addEventListener('click',closePopup);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!popup.hidden)closePopup();closeMenu()}if(e.key==='Tab'&&!popup.hidden){const nodes=[...popup.querySelectorAll('button,a,input')].filter(n=>n.getClientRects().length&&!n.disabled);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.querySelectorAll('form').forEach(form=>{const status=document.createElement('p');status.className='form-status';status.setAttribute('role','status');form.append(status);form.addEventListener('submit',e=>{e.preventDefault();status.textContent='Это демонстрационная версия. Заявка не отправлена. Для связи позвоните: 8-495-755-35-03.'})});
const viewer=document.createElement('dialog');viewer.className='image-dialog';viewer.innerHTML='<button type="button" aria-label="Закрыть изображение">×</button><img alt="">';document.body.append(viewer);viewer.querySelector('button').onclick=()=>viewer.close();viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});
document.querySelectorAll('.slides__slide').forEach((slide,i)=>{const img=slide.querySelector('img');img.alt=i<3?'Лицензия — документ '+(i+1):'Благодарственное письмо — документ '+(i-2);const button=document.createElement('button');button.className='image-open';button.type='button';button.setAttribute('aria-label','Увеличить: '+img.alt);while(slide.firstChild)button.append(slide.firstChild);slide.append(button);button.onclick=()=>{openImageViewer(img)}});

// FLIP: animate the viewer from the clicked thumbnail's actual viewport bounds.
let imageOpenRequest = 0;
async function openImageViewer(source) {
  const request = ++imageOpenRequest;
  const image = viewer.querySelector('img');
  image.src = source.currentSrc || source.src;
  image.alt = source.alt;
  try { await image.decode(); } catch (_) { /* Keep native broken-image feedback. */ }
  if (request !== imageOpenRequest || viewer.open) return;
  const from = source.getBoundingClientRect();
  viewer.showModal();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const to = viewer.getBoundingClientRect();
  if (!from.width || !from.height || !to.width || !to.height) return;
  viewer.getAnimations().forEach(animation => animation.cancel());
  viewer.animate([
    {transformOrigin:'top left',transform:`translate(${from.left-to.left}px, ${from.top-to.top}px) scale(${from.width/to.width}, ${from.height/to.height})`,opacity:.65},
    {transformOrigin:'top left',transform:'translate(0, 0) scale(1)',opacity:1}
  ], {duration:440,easing:'cubic-bezier(.16,1,.3,1)'});
}

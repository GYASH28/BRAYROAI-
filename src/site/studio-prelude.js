import './studio-prelude.css';

export const PRELUDE_DURATION = 900;

// An independent editorial film before the original brand impression. Native
// transforms own this disposable stage; the live site's inputs remain usable.
export function playStudioPrelude(stage) {
 const root = document.createElement('div');
 root.className = 'studio-prelude';
 root.setAttribute('aria-hidden', 'true');
 root.innerHTML = '<div class="prelude-world"><div class="prelude-frames"></div><div class="prelude-axis"></div><div class="prelude-type"><span class="prelude-be">BE</span><div class="prelude-line" data-prelude-word="UNMISS"></div><div class="prelude-line prelude-line-last" data-prelude-word="ABLE."></div></div><span class="prelude-echo">A DIFFERENT POINT OF VIEW</span></div><div class="prelude-signature"><span>BRAYRO AI</span><span>Websites. Practical AI.</span></div><div class="prelude-exit"></div>';
 const skip = document.createElement('button');
 skip.type = 'button'; skip.className = 'studio-prelude-skip'; skip.textContent = 'Skip intro';
 const compact = innerWidth < 761;
 const frames = root.querySelector('.prelude-frames');
 for (let index = 0; index < 12; index++) {
  const frame = document.createElement('i');
  frame.className = 'prelude-frame'; frames.append(frame);
 }
 for (const line of root.querySelectorAll('[data-prelude-word]')) {
  for (const letter of line.dataset.preludeWord) {
   const span = document.createElement('span'); span.textContent = letter; line.append(span);
  }
 }
 stage.dataset.preludeState = 'playing';
 stage.dataset.openingState = 'playing';
 document.body.append(root, skip);
 const controller = new AbortController(), animations = [];
 const preference = matchMedia('(prefers-reduced-motion:reduce)');
 let done = false, timer, resolveFinished;
 const finished = new Promise(resolve => { resolveFinished = resolve; });
 const finish = completed => {
  if (done) return;
  done = true; clearTimeout(timer); controller.abort(); preference.removeEventListener('change', cancel);
  for (const animation of animations) animation.cancel();
  root.remove(); skip.remove();
  stage.dataset.preludeState = completed ? 'complete' : 'skipped';
  if (!completed) stage.dataset.openingState = 'settled';
  resolveFinished(completed);
 };
 const cancel = () => finish(false);
 const listen = (target, type, handler = cancel) => target.addEventListener(type, handler, {passive:true, signal:controller.signal});
 for (const type of ['wheel','scroll','touchstart','hashchange','resize','pagehide','keydown']) listen(window, type);
 listen(window, 'pointerdown', event => { if (event.target !== skip) cancel(); });
 listen(document, 'visibilitychange', () => { if (document.hidden) cancel(); });
 skip.addEventListener('click', cancel, {signal:controller.signal});
 preference.addEventListener('change', cancel);
 const play = (element, keyframes, options = {}) => {
  const animation = element.animate(keyframes, {duration:PRELUDE_DURATION, fill:'both', easing:'linear', ...options, id:`studio-prelude-${animations.length}`});
  animations.push(animation); return animation;
 };
 try {
  const arrive = 'cubic-bezier(.16,1,.3,1)', rush = 'cubic-bezier(.66,0,.2,1)';
  play(root.querySelector('.prelude-world'), [
   {offset:0, transform:'perspective(1000px) rotateY(-14deg) rotateZ(-7deg) scale(.86)'},
   {offset:.48, transform:'perspective(1000px) rotateY(9deg) rotateZ(4deg) scale(1.03)', easing:arrive},
   {offset:.73, transform:'perspective(1000px) rotateY(0deg) rotateZ(0deg) scale(1)'},
   {offset:1, transform:'perspective(1000px) rotateY(-9deg) rotateZ(-3deg) scale(1.16)'},
  ]);
  root.querySelectorAll('.prelude-frame').forEach((frame, index) => {
   const z = -900 + index * 90, angle = (index - 5.5) * 3;
   play(frame, [
    {offset:0, opacity:0, transform:`translate(-50%,-50%) translateZ(${z}px) rotate(${angle-18}deg) scale(.62)`},
    {offset:.12, opacity:.18, transform:`translate(-50%,-50%) translateZ(${z+80}px) rotate(${angle-12}deg) scale(.75)`},
    {offset:.46, opacity:index%3===0?.75:.4, transform:`translate(-50%,-50%) translateZ(${z+250}px) rotate(${angle+12}deg) scale(.94)`, easing:rush},
    {offset:.84, opacity:.6, transform:`translate(-50%,-50%) translateZ(${z+920}px) rotate(${angle-6}deg) scale(1.12)`},
    {offset:1, opacity:0, transform:`translate(-50%,-50%) translateZ(${z+1240}px) rotate(${angle-12}deg) scale(1.22)`},
   ]);
  });
  root.querySelectorAll('.prelude-line span').forEach((letter, index) => {
   const side = index%2 ? -1 : 1, delay = index * .011;
   play(letter, [
    {offset:0, opacity:0, transform:`translate3d(${side*(compact?110:170)}px,${side*90}px,-480px) rotateY(${side*100}deg) rotateX(${side*36}deg) scale(.45)`},
    {offset:.10+delay, opacity:.15, transform:`translate3d(${side*65}px,${side*40}px,-320px) rotateY(${side*74}deg) rotateX(${side*20}deg) scale(.6)`, easing:arrive},
    {offset:.38+delay, opacity:1, transform:`translate3d(0,0,${index%2?40:0}px) rotateY(${side*8}deg) rotateX(0deg) scale(1.02)`, easing:arrive},
    {offset:.70, opacity:1, transform:'translate3d(0,0,0) rotateY(0deg) rotateX(0deg) scale(1)', easing:rush},
    {offset:1, opacity:0, transform:`translate3d(${side*60}px,${side*-35}px,600px) rotateY(${side*-24}deg) scale(1.7)`},
   ]);
  });
  play(root.querySelector('.prelude-be'), [
   {offset:0, opacity:1, transform:'translateY(0)'},
   {offset:.7, opacity:1, transform:'translateY(0)'},
   {offset:1, opacity:0, transform:'translateY(-35px)'},
  ]);
  play(root.querySelector('.prelude-axis'), [
   {offset:0, opacity:.2, transform:'translate(-50%,-50%) rotate(-26deg) scaleY(.35)'},
   {offset:.5, opacity:.7, transform:'translate(-50%,-50%) rotate(21deg) scaleY(1)'},
   {offset:.85, opacity:.5, transform:'translate(-50%,-50%) rotate(-6deg) scaleY(1.4)'},
   {offset:1, opacity:0, transform:'translate(-50%,-50%) rotate(-16deg) scaleY(1.6)'},
  ]);
  play(root.querySelector('.prelude-echo'), [
   {offset:0, opacity:0, transform:'translate3d(-20vw,0,-200px)'},
   {offset:.28, opacity:.15, transform:'translate3d(-8vw,0,-120px)'},
   {offset:.68, opacity:.18, transform:'translate3d(5vw,0,-40px)'},
   {offset:1, opacity:0, transform:'translate3d(24vw,0,200px)'},
  ]);
  play(root.querySelector('.prelude-exit'), [
   {offset:0, opacity:0, transform:'translate(-50%,-50%) scale(.04)'},
   {offset:.78, opacity:0, transform:'translate(-50%,-50%) scale(.04)', easing:rush},
   {offset:.95, opacity:1, transform:'translate(-50%,-50%) scale(1.2)'},
   {offset:1, opacity:1, transform:'translate(-50%,-50%) scale(1.5)'},
  ]);
  // The final blue depth plane peels out to the separate, original impression.
  play(root, [{offset:0,opacity:1},{offset:.94,opacity:1},{offset:1,opacity:0}]);
  Promise.allSettled(animations.map(animation => animation.finished)).then(() => finish(true));
  timer = setTimeout(() => finish(true), PRELUDE_DURATION + 180);
 } catch (error) { cancel(); throw error; }
 return {finished, cancel};
}

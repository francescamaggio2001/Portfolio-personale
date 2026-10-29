/* Lo scroll controlla direttamente i livelli, anche tornando indietro. */
(() => {
  const section = document.querySelector('.projects-intro');
  if (!section) return;
  const layers = [...section.querySelectorAll('.projects-layer')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false;
  let frame = 0;
  const render = () => {
    frame = 0;
    if (!ready) return;
    const rect = section.getBoundingClientRect();
    const distance = Math.min(1, Math.max(0,
      (innerHeight - rect.top) / (innerHeight * 0.7 + rect.height * 0.3)));
    const remaining = reduced.matches ? 0 : 1 - distance;
    const mobile = innerWidth < 600 ? 0.6 : 1;
    layers[0].style.transform = `scale(${1 + remaining * 0.08})`;
    layers[1].style.transform = `translate3d(${-remaining * 16 * mobile}%, 0, 0) scale(${1 + remaining * 0.3})`;
    layers[2].style.transform = `translate3d(${remaining * 16 * mobile}%, 0, 0) scale(${1 + remaining * 0.3})`;
    layers[3].style.transform = `translate3d(0, ${remaining * 5}%, 0) scale(${1 + remaining * 0.2}) rotate(${remaining * -4}deg)`;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  Promise.all(layers.map(image => image.decode())).then(() => {
    ready = true;
    render();
    section.classList.add('art-ready');
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    addEventListener('pageshow', schedule);
    reduced.addEventListener('change', schedule);
  }).catch(() => { /* Il JPG rimane visibile se un livello non si carica. */ });
})();

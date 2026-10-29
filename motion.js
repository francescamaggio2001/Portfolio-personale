/* Il contenuto rimane visibile anche senza JavaScript o durante un errore. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const animations = new Map();

  // Sui dispositivi touch, l'ingresso nella fascia centrale sostituisce l'hover.
  const touchFlowers = matchMedia('(hover: none), (pointer: coarse)');
  const flowerCards = [...document.querySelectorAll('.work-card:has(.pixel-flower)')];
  let flowerObserver;
  let flowerResizeFrame;
  const observeFlowers = () => {
    flowerObserver?.disconnect();
    flowerCards.forEach(card => card.classList.remove('flower-in-view'));
    if (!touchFlowers.matches || preference.matches || !flowerCards.length) return;
    const margin = Math.round(innerHeight * 0.2);
    flowerObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('flower-in-view', entry.isIntersecting);
      });
    }, { rootMargin: `-${margin}px 0px -${margin}px 0px`, threshold: 0 });
    flowerCards.forEach(card => flowerObserver.observe(card));
  };
  observeFlowers();
  touchFlowers.addEventListener('change', observeFlowers);
  preference.addEventListener('change', observeFlowers);
  if (flowerCards.length) {
    addEventListener('resize', () => {
      cancelAnimationFrame(flowerResizeFrame);
      flowerResizeFrame = requestAnimationFrame(observeFlowers);
    });
  }
  // Nei browser senza transizioni tra documenti, sfuma il contenuto in ingresso.
  if (!('onpageswap' in window) && !preference.matches) {
    const content = document.querySelector('main');
    if (content && !document.querySelector('.hero')) {
      const entrance = content.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 380, easing: 'ease-out'
      });
      animations.set(content, entrance);
      entrance.onfinish = () => animations.delete(content);
    }
  }

  // Sequenza iniziale della home: preserva il testo completo per gli screen reader.
  if (!preference.matches && document.querySelector('.hero')) {
    const play = (element, frames, options) => {
      if (!element) return;
      const animation = element.animate(frames, { fill: 'backwards', ...options });
      animations.set(element, animation);
      animation.onfinish = () => animations.delete(element);
    };
    play(document.querySelector('.hero-name'), [
      { clipPath: 'inset(-20% 100% -20% 0)' },
      { clipPath: 'inset(-20% 0% -20% 0)' }
    ], { duration: 1600, delay: 250, easing: 'steps(9, end)' });

    const fade = [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }];
    play(document.querySelector('.hero-logo'), fade, {
      duration: 1200, delay: 100, easing: 'ease-out'
    });
    play(document.querySelector('.hero-subtitle'), fade, {
      duration: 1200, delay: 1450, easing: 'ease-out'
    });
    document.querySelectorAll('.hero-navigation a').forEach((link, index) => {
      play(link, fade, { duration: 900, delay: 650 + index * 180, easing: 'ease-out' });
    });
  }

  const writeTitle = (element, delay = 0) => {
    if (preference.matches) return;
    const letters = element.textContent.trim().length;
    const animation = element.animate([
      { clipPath: 'inset(-20% 100% -20% 0)' },
      { clipPath: 'inset(-20% 0% -20% 0)' }
    ], {
      duration: Math.max(1600, letters * 100),
      delay,
      easing: `steps(${letters}, end)`,
      fill: 'backwards'
    });
    animations.set(element, animation);
    animation.onfinish = () => animations.delete(element);
  };

  document.querySelectorAll('.about-content .typewriter-title, .selected-works .typewriter-title')
    .forEach(title => writeTitle(title, 250));

  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Non basta sfiorare il bordo dello schermo: il titolo deve essere leggibile.
      if (!entry.isIntersecting || entry.intersectionRatio < 0.8) return;
      titleObserver.unobserve(entry.target);
      writeTitle(entry.target);
    });
  }, {
    threshold: 0.8,
    rootMargin: '0px 0px -80px 0px'
  });
  document.querySelectorAll('.contact-cta .typewriter-title')
    .forEach(title => titleObserver.observe(title));

  // I paragrafi di About Me mantengono la dissolvenza in sequenza.

  if (!preference.matches) {
    document.querySelectorAll('.about-content > p').forEach((text, index) => {
      const entrance = text.animate([
        { opacity: 0, translate: '0 28px' },
        { opacity: 1, translate: '0 0' }
      ], {
        duration: 1200,
        delay: 450 + index * 180,
        easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)',
        fill: 'backwards'
      });
      animations.set(text, entrance);
      entrance.onfinish = () => animations.delete(text);
    });
  }
  const targets = document.querySelectorAll(
    '.intro-text, .intro-button, .projects-intro-content, .contact-cta-button, ' +
    '.cv-section, .skill-card, ' +
    '.work-card, .contact-intro-content, .contact-form > *, .footer-logo, .footer-socials, .footer-navigation'
  );

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (preference.matches) continue;
      const isSkillCard = entry.target.classList.contains('skill-card');
      const animation = entry.target.animate([
        { opacity: isSkillCard ? 0 : 0.25, translate: isSkillCard ? '0 48px' : '0 18px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: isSkillCard ? 1100 : 620, easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)' });
      animations.set(entry.target, animation);
      animation.onfinish = () => animations.delete(entry.target);
    }
  }, { threshold: 0.08 });

  targets.forEach(target => observer.observe(target));

  // Un elemento raggiunto con Tab deve essere subito perfettamente leggibile.
  document.addEventListener('focusin', event => {
    for (const [target, animation] of animations) {
      if (target.contains(event.target)) {
        animation.cancel();
        animations.delete(target);
      }
    }
  });

  preference.addEventListener('change', () => {
    if (preference.matches) {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    }
  });
})();

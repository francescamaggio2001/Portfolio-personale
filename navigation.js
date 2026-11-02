/* Il menu resta navigabile anche se JavaScript non è disponibile. */
(() => {
  const header = document.querySelector('.site-header');
  const button = header?.querySelector('.nav-toggle');
  const nav = header?.querySelector('#main-navigation');
  if (!button || !nav) return;

  const mobile = matchMedia('(max-width: 768px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation;

  const setOpen = (open, restoreFocus = false, animate = true) => {
    const expanded = mobile.matches && open;
    if (animate && expanded === (button.getAttribute('aria-expanded') === 'true')) return;

    const wasHidden = nav.hidden;
    const style = getComputedStyle(nav);
    const from = wasHidden
      ? { opacity: 0, transform: 'translateY(-8px)' }
      : { opacity: style.opacity, transform: style.transform };
    animation?.cancel();
    animation = null;

    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    const closing = mobile.matches && !expanded;
    if (restoreFocus || (closing && nav.contains(document.activeElement))) button.focus();
    // Durante la dissolvenza in uscita, i link non sono più raggiungibili con Tab.
    nav.inert = closing;
    nav.setAttribute('aria-hidden', String(closing));

    if (!animate || !mobile.matches || reduced.matches || !nav.animate || (closing && wasHidden)) {
      nav.hidden = closing;
      return;
    }

    nav.hidden = false;
    const motion = nav.animate([
      from,
      { opacity: expanded ? 1 : 0, transform: expanded ? 'translateY(0)' : 'translateY(-8px)' }
    ], { duration: expanded ? 220 : 180, easing: 'ease-out' });
    animation = motion;
    motion.onfinish = () => {
      if (animation !== motion) return;
      nav.hidden = mobile.matches && button.getAttribute('aria-expanded') !== 'true';
      animation = null;
    };
  };

  const updateLayout = () => {
    const focusWillHide = mobile.matches && nav.contains(document.activeElement);
    const focusWasOnButton = document.activeElement === button;
    button.hidden = !mobile.matches;
    setOpen(false, focusWillHide, false);
    if (!mobile.matches && focusWasOnButton) nav.querySelector('a[aria-current="page"]')?.focus();
  };

  header.classList.add('navigation-ready');
  updateLayout();
  mobile.addEventListener('change', updateLayout);
  reduced.addEventListener('change', () => setOpen(button.getAttribute('aria-expanded') === 'true', false, false));
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
})();

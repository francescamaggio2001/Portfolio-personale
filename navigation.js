/* Il menu resta navigabile anche se JavaScript non è disponibile. */
(() => {
  const header = document.querySelector('.site-header');
  const button = header?.querySelector('.nav-toggle');
  const nav = header?.querySelector('#main-navigation');
  if (!button || !nav) return;

  const mobile = matchMedia('(max-width: 768px)');
  const label = button.querySelector('.nav-toggle-label');
  const setOpen = (open, restoreFocus = false) => {
    const expanded = mobile.matches && open;
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    label.textContent = expanded ? 'Close' : 'Menu';
    nav.hidden = mobile.matches && !expanded;
    if (restoreFocus) button.focus();
  };
  const updateLayout = () => {
    const focusWillHide = mobile.matches && nav.contains(document.activeElement);
    button.hidden = !mobile.matches;
    setOpen(false, focusWillHide);
  };

  header.classList.add('navigation-ready');
  updateLayout();
  mobile.addEventListener('change', updateLayout);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
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

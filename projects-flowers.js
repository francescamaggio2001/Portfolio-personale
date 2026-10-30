/* Carica i fiori separati nell'HTML per animare ancora i singoli pixel. */
(() => {
  document.querySelectorAll('.work-card[data-flower-src]').forEach(async card => {
    try {
      const response = await fetch(card.dataset.flowerSrc);
      if (!response.ok) throw new Error(`SVG non disponibile: ${response.status}`);

      const documentSvg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      const flower = documentSvg.documentElement;
      if (documentSvg.querySelector('parsererror') || !flower.matches('svg.pixel-flower')) {
        throw new Error('SVG del fiore non valido');
      }

      card.prepend(document.importNode(flower, true));
    } catch (error) {
      // Lo sfondo originale resta visibile se il caricamento non riesce.
      console.warn('Impossibile caricare il fiore animato:', error);
    }
  });
})();

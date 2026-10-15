// Chargé de façon bloquante dans <head> : pose data-theme et data-accent avant le
// premier rendu, pour éviter tout flash. (Fichier externe plutôt qu'inline : la CSP
// n'autorise que les scripts du site.)
(function () {
  var root = document.documentElement;
  try {
    var theme = localStorage.getItem('devtoolbox:theme');
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', theme);

    var accent = localStorage.getItem('devtoolbox:accent');
    var known = ['indigo', 'violet', 'sky', 'teal', 'emerald', 'amber', 'rose'];
    // Anciennes valeurs hexadécimales (versions 1 et 2).
    var legacy = { auto: 'indigo', '#4493f8': 'sky', '#a371f7': 'violet', '#f778ba': 'rose', '#fb923c': 'amber', '#f85149': 'rose', '#39c5cf': 'teal' };
    root.setAttribute('data-accent', known.indexOf(accent) !== -1 ? accent : legacy[accent] || 'indigo');
  } catch (e) {
    root.setAttribute('data-theme', 'light');
    root.setAttribute('data-accent', 'indigo');
  }
})();

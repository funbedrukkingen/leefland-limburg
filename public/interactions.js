// Reproduces the hover/focus style swaps from the original Claude Design export
// without depending on Claude Design's own runtime (support.js).
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[style-hover]').forEach(function (el) {
    var base = el.getAttribute('style') || '';
    var hover = el.getAttribute('style-hover');
    el.addEventListener('mouseenter', function () { el.style.cssText = base + ';' + hover; });
    el.addEventListener('mouseleave', function () { el.style.cssText = base; });
  });
  document.querySelectorAll('[style-focus]').forEach(function (el) {
    var base = el.getAttribute('style') || '';
    var focus = el.getAttribute('style-focus');
    el.addEventListener('focus', function () { el.style.cssText = base + ';' + focus; });
    el.addEventListener('blur', function () { el.style.cssText = base; });
  });
});

(function () {
  var menu = document.querySelector('.scr-header__menu');
  if (!menu) return;

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) menu.open = false;
  });
  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
})();

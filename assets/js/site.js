document.body.classList.add('stk--anim-init');

(function () {
	var header = document.getElementById('sticky-header');
	var hero = document.querySelector('[data-role="hero-section"]');
	if (header && hero) {
		new IntersectionObserver(function (entries) {
			header.classList.toggle('is-visible', !entries[0].isIntersecting);
		}, { threshold: 0 }).observe(hero);
	}
})();

(function () {
	var backToTop = document.querySelector('.ct-back-to-top');
	if (!backToTop) return;
	window.addEventListener('scroll', function () {
		backToTop.classList.toggle('ct-show', window.scrollY > 600);
	}, { passive: true });
})();

(function () {
	var strip = document.querySelectorAll('.photo-strip__item');
	var lightbox = document.getElementById('lightbox');
	if (!strip.length || !lightbox) return;

	var lbImg = lightbox.querySelector('img');
	var images = Array.prototype.map.call(strip, function (el) {
		return el.style.backgroundImage.slice(5, -2);
	});
	var current = 0;

	function show(index) {
		current = (index + images.length) % images.length;
		lbImg.src = images[current];
	}
	function open(index) {
		show(index);
		lightbox.classList.add('is-open');
	}
	function close() {
		lightbox.classList.remove('is-open');
		lbImg.src = '';
	}

	strip.forEach(function (el, index) {
		el.addEventListener('click', function () { open(index); });
	});
	lightbox.querySelector('.lightbox__close').addEventListener('click', close);
	lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
	lightbox.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });
	lightbox.addEventListener('click', function (e) {
		if (e.target === lightbox) close();
	});
	document.addEventListener('keydown', function (e) {
		if (!lightbox.classList.contains('is-open')) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') show(current - 1);
		if (e.key === 'ArrowRight') show(current + 1);
	});
})();

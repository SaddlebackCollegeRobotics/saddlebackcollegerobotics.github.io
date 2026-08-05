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

/* Loop the Open Sauce clip where our rover appears (12:32-12:54). YouTube has
   no param for looping a mid-video segment: loop=1 needs playlist=<id>, and
   playlist= makes it ignore start=/end= entirely. So we watch the clock through
   the IFrame Player API and seek back ourselves. */
(function () {
	var CLIP_START_SECONDS = 752; // 12:32
	var CLIP_END_SECONDS = 774; // 12:54
	var LOOP_CHECK_MS = 250;
	var VISIBLE_RATIO = 0.4;
	var API_SRC = 'https://www.youtube.com/iframe_api';

	var frame = document.getElementById('scr-featured-clip');
	if (!frame) return;

	function onApiReady() {
		var loopTimer = null;

		function watchForEnd(player) {
			if (loopTimer) return;
			loopTimer = setInterval(function () {
				if (typeof player.getCurrentTime !== 'function') return;
				var now = player.getCurrentTime();
				// Also catch someone dragging the scrubber behind our segment.
				if (now >= CLIP_END_SECONDS || now < CLIP_START_SECONDS - 1) {
					player.seekTo(CLIP_START_SECONDS, true);
				}
			}, LOOP_CHECK_MS);
		}
		function stopWatching() {
			clearInterval(loopTimer);
			loopTimer = null;
		}

		var player = new window.YT.Player(frame, {
			events: {
				// Wire the observer up here, not at construction time: the
				// observer callback fires as soon as it starts observing, which
				// would otherwise beat the player into existence.
				onReady: function () {
					player.seekTo(CLIP_START_SECONDS, true);
					// Only run the clip while it's actually on screen, rather
					// than playing unseen while someone reads the top of the page.
					new IntersectionObserver(function (entries) {
						if (entries[0].isIntersecting) {
							player.playVideo();
							watchForEnd(player);
						} else {
							player.pauseVideo();
							stopWatching();
						}
					}, { threshold: VISIBLE_RATIO }).observe(frame);
				},
				onError: function () {
					// Embed blocked or unavailable. Leave the iframe alone so the
					// visitor still gets YouTube's own message plus our
					// "watch the full video" link underneath.
					stopWatching();
				}
			}
		});
	}

	if (window.YT && window.YT.Player) {
		onApiReady();
		return;
	}

	window.onYouTubeIframeAPIReady = onApiReady;
	var script = document.createElement('script');
	script.src = API_SRC;
	script.async = true;
	script.onerror = function () {
		// API unreachable: the embed still plays the clip via its start/end
		// params, it just won't loop.
	};
	document.head.appendChild(script);
})();

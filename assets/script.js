(function () {
    'use strict';

    var burger = document.getElementById('burger');
    var nav = document.getElementById('main_nav');

    /* ---------- Мобильное меню ---------- */
    function closeMenu() {
        if (!nav) return;
        nav.classList.remove('is_open');
        burger.classList.remove('is_open');
        burger.setAttribute('aria-expanded', 'false');
    }

    if (burger && nav) {
        burger.addEventListener('click', function () {
            var open = nav.classList.toggle('is_open');
            burger.classList.toggle('is_open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeMenu();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 850) closeMenu();
        });

        window.addEventListener('scroll', function () {
            if (nav.classList.contains('is_open')) closeMenu();
        }, { passive: true });
    }

    /* ---------- Сворачиваемая лента соцсетей (моб.) ---------- */
    var socialRail = document.querySelector('.social_rail');
    var socialToggle = document.getElementById('social_rail_toggle');
    if (socialRail && socialToggle) {
        socialToggle.addEventListener('click', function () {
            var open = socialRail.classList.toggle('is_open');
            socialToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        window.addEventListener('scroll', function () {
            if (socialRail.classList.contains('is_open')) {
                socialRail.classList.remove('is_open');
                socialToggle.setAttribute('aria-expanded', 'false');
            }
        }, { passive: true });
    }

    /* ---------- Появление блоков при прокрутке ---------- */
    var revealSelectors = '.section_head, .service_card, .about_media, .about_list, .about_stats, .partner_item, .contact_list, .contact_form';
    var revealItems = document.querySelectorAll(revealSelectors);

    if ('IntersectionObserver' in window) {
        revealItems.forEach(function (el) { el.classList.add('reveal'); });
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is_visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealItems.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Подсветка активного пункта меню ---------- */
    var links = document.querySelectorAll('.main_nav_link');
    var sections = [];
    links.forEach(function (link) {
        var id = link.getAttribute('href');
        if (id && id.charAt(0) === '#' && id.length > 1) {
            var sec = document.querySelector(id);
            if (sec) sections.push({ link: link, sec: sec });
        }
    });

    if ('IntersectionObserver' in window && sections.length) {
        var navIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (l) { l.classList.remove('is_active'); });
                var match = sections.filter(function (s) { return s.sec === entry.target; })[0];
                if (match) match.link.classList.add('is_active');
            });
        }, { threshold: 0.5 });
        sections.forEach(function (s) { navIo.observe(s.sec); });
    }

    /* ---------- Слайдер изображений в баннере ---------- */
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
        var track = slider.querySelector('.hero_slider_track');
        var slides = slider.querySelectorAll('.hero_slide');
        var dotsWrap = slider.querySelector('.hero_slider_dots');
        var prev = slider.querySelector('.hero_slider_prev');
        var next = slider.querySelector('.hero_slider_next');
        if (!track || slides.length < 2) return;

        var index = 0;
        var timer;
        var dots = [];

        if (dotsWrap) {
            slides.forEach(function (_, i) {
                var d = document.createElement('button');
                d.type = 'button';
                d.className = 'hero_slider_dot' + (i === 0 ? ' is_active' : '');
                d.setAttribute('aria-label', 'Слайд ' + (i + 1));
                d.addEventListener('click', function () { go(i); });
                dotsWrap.appendChild(d);
                dots.push(d);
            });
        }

        function render() {
            track.style.transform = 'translateX(' + (-index * 100) + '%)';
            dots.forEach(function (d, i) { d.classList.toggle('is_active', i === index); });
        }
        function go(i) {
            index = (i + slides.length) % slides.length;
            render();
            restart();
        }
        function restart() {
            clearInterval(timer);
            timer = setInterval(function () { go(index + 1); }, 4500);
        }

        if (prev) prev.addEventListener('click', function () { go(index - 1); });
        if (next) next.addEventListener('click', function () { go(index + 1); });
        render();
        restart();
    });

    /* ---------- Демо-обработка формы (статический вариант) ---------- */
    var form = document.querySelector('.contact_form');
    if (form) {
        var note = form.querySelector('.form_note');
        var noteText = note ? note.textContent : '';
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            if (note) note.textContent = 'Заявка отправлена. Мы свяжемся с вами в рабочее время.';
            form.reset();
            setTimeout(function () { if (note) note.textContent = noteText; }, 6000);
        });
    }
})();

// ============================================================
// 1. REGISTER GSAP PLUGINS
// ============================================================
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// 2. LOADER 
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader-overlay');
    const spinner = document.querySelector('.spinner');
    const wrapper = document.querySelector('.wrapper');

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const preparedHeadings = prepareBannerHeadings();
    const bannerParas = document.querySelectorAll('.banner p');
    gsap.set(bannerParas, { opacity: 0, y: 24, filter: 'blur(6px)' });

    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    tl.fromTo(spinner,
        { scale: 0.3, opacity: 0, rotation: 0 },
        { scale: 1, opacity: 1, rotation: 360, duration: 1.2, ease: 'back.out(1.7)' }
    )
        .to(spinner, {
            scale: 1.05,
            duration: 0.6,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut'
        }, '-=0.3');

    const loadTime = 1000 + Math.random() * 800;

    function unlockScroll() {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    setTimeout(() => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.classList.add('loader-hidden');
            }
        });

        gsap.to(spinner, {
            scale: 0.5,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.in'
        });

        if (wrapper) {
            wrapper.classList.add('wrapper-visible');
            gsap.fromTo(wrapper,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    onStart: () => {
                        animateBannerText(preparedHeadings);
                        animateBannerParagraphs();
                        animateCounters();
                    },
                    onComplete: () => {
                        ScrollTrigger.refresh();
                        unlockScroll();
                    }
                }
            );
        } else {
            animateBannerText(preparedHeadings);
            animateBannerParagraphs();
            animateCounters();
            unlockScroll();
        }
    }, loadTime);
});
// ============================================================
// 3. BANNER TEXT 
// ============================================================
function splitHeadingToChars(heading) {
    const text = heading.textContent.trim();
    const chars = text.split('');

    heading.textContent = '';
    heading.classList.add('reveal-heading-done');

    chars.forEach((char) => {
        const span = document.createElement('span');
        span.className = 'reveal-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateX(-20px)';
        span.style.filter = 'blur(4px)';
        heading.appendChild(span);
    });

    return heading.querySelectorAll('.reveal-char');
}
function prepareBannerHeadings() {
    const headings = document.querySelectorAll('.banner .web-title');
    const prepared = [];

    headings.forEach((heading, idx) => {
        const spans = splitHeadingToChars(heading);
        prepared.push({ spans, idx });
    });

    return prepared;
}
function animateBannerText(preparedHeadings) {
    preparedHeadings.forEach(({ spans, idx }) => {
        gsap.fromTo(spans,
            {
                opacity: 0,
                x: -30,
                filter: 'blur(10px)',
                rotationY: 90
            },
            {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                rotationY: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.04,
                delay: idx * 0.15,
                overwrite: 'auto'
            }
        );
    });
}
function animateBannerParagraphs() {
    const paras = document.querySelectorAll('.banner p');
    gsap.fromTo(paras,
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.15,
            delay: 0.2
        }
    );
    paras.forEach(p => p.classList.add('reveal-p-done'));
}
// ============================================================
// 4. COUNTER ANIMATION
// ============================================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter-box .counter');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const obj = { val: 0 };

        gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: counter.closest('.counter-box'),
                start: 'top 100%',
                toggleActions: 'play none none none'
            },
            onUpdate: () => {
                counter.textContent = Math.floor(obj.val) + '+';
            },
            onComplete: () => {
                counter.textContent = target + '+';
            }
        });
    });
}
// ============================================================
// 5. BANNER MOUSE-TRAIL 
// ============================================================
const banner = document.querySelector('.banner');
const images = gsap.utils.toArray('.brand-trail');

let index = 0;
let gap = 80;
let mouse = { x: 0, y: 0 };
let last = { x: 0, y: 0 };

if (banner) {
    banner.addEventListener('mousemove', function (e) {
        const rect = banner.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        const distance = Math.hypot(mouse.x - last.x, mouse.y - last.y);
        if (distance > gap) {
            showImage(mouse.x, mouse.y);
            last.x = mouse.x;
            last.y = mouse.y;
        }
    });
}
function showImage(x, y) {
    const img = images[index % images.length];
    gsap.killTweensOf(img);
    gsap.set(img, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50,
        scale: 0.5,
        rotation: gsap.utils.random(-20, 20),
        opacity: 1
    });
    gsap.timeline()
        .fromTo(img, {
            scale: 0.6,
            opacity: 0,
            filter: 'blur(8px)'
        }, {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'power3.out'
        })
        .to(img, {
            y: '-=30',
            opacity: 0,
            filter: 'blur(8px)',
            duration: 1,
            ease: 'power2.out'
        });
    index++;
}
// ============================================================
// 6. VIDEO PLAYER
// ============================================================
document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('.custom-video');
    const overlay = wrapper.querySelector('.video-overlay');
    const icon = overlay.querySelector('i');

    function updateIcon() {
        if (video.paused) {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            overlay.classList.remove('hide');
        } else {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            setTimeout(() => {
                if (!video.paused) {
                    overlay.classList.add('hide');
                }
            }, 600);
        }
    }

    function toggleVideo() {
        document.querySelectorAll('.custom-video').forEach(v => {
            if (v !== video) {
                v.pause();
                const otherWrapper = v.closest('.video-wrapper');
                const otherOverlay = otherWrapper.querySelector('.video-overlay');
                const otherIcon = otherOverlay.querySelector('i');
                otherOverlay.classList.remove('hide');
                otherIcon.classList.remove('fa-pause');
                otherIcon.classList.add('fa-play');
            }
        });
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        updateIcon();
    }

    overlay.addEventListener('click', toggleVideo);
    video.addEventListener('click', toggleVideo);
    video.addEventListener('play', updateIcon);
    video.addEventListener('pause', updateIcon);
});
// ============================================================
// 7. PRICING SWIPER
// ============================================================
const swiperConfig = {
    slidesPerView: 1.1,
    spaceBetween: 18,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 0 },
        575: { slidesPerView: 2, spaceBetween: 15 },
        768: { slidesPerView: 2.2, spaceBetween: 18 },
        992: { slidesPerView: 2.5, spaceBetween: 22 },
        1200: { slidesPerView: 3, spaceBetween: 20 }
    }
};
const swipers = {};
document.querySelectorAll('.tab-pane').forEach((pane) => {
    const el = pane.querySelector('.pricing-swiper');
    if (el) {
        swipers[pane.id] = new Swiper(el, swiperConfig);
    }
});

document.querySelectorAll('button[data-bs-toggle="tab"]').forEach((tabBtn) => {
    tabBtn.addEventListener('shown.bs.tab', (e) => {
        const targetSelector = e.target.getAttribute('data-bs-target');
        const paneId = targetSelector.replace('#', '');
        if (swipers[paneId]) {
            swipers[paneId].update();
            swipers[paneId].slideTo(0, 0);
        }
    });
});

// ============================================================
// 8. BEST SECTION HOVER IMAGE
// ============================================================
gsap.set('.container img.swipeimage', { yPercent: -200, xPercent: -200 });
let firstEnter;
gsap.utils.toArray('.container-best').forEach((el) => {
    const image = el.querySelector('img.swipeimage');
    const setX = gsap.quickTo(image, 'x', { duration: 0.4, ease: 'power3' });
    const setY = gsap.quickTo(image, 'y', { duration: 0.4, ease: 'power3' });

    const align = (e) => {
        if (firstEnter) {
            setX(e.clientX, e.clientX);
            setY(e.clientY, e.clientY);
            firstEnter = false;
        } else {
            setX(e.clientX);
            setY(e.clientY);
        }
    };

    const startFollow = () => document.addEventListener('mousemove', align);
    const stopFollow = () => document.removeEventListener('mousemove', align);

    const fade = gsap.to(image, {
        autoAlpha: 1,
        ease: 'none',
        paused: true,
        duration: 0.1,
        onReverseComplete: stopFollow
    });

    el.addEventListener('mouseenter', (e) => {
        firstEnter = true;
        fade.play();
        startFollow();
        align(e);
    });

    el.addEventListener('mouseleave', () => fade.reverse());
});
// ============================================================
// 9. TESTIMONIAL SLIDER 
// ============================================================
const testSlider = new Swiper('.testslider', {
    slidesPerView: 2.8,
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,
    breakpoints: {
        320: { slidesPerView: 1.2 },
        768: { slidesPerView: 2.3 },
        1200: { slidesPerView: 2.8 }
    }
});
// ============================================================
// 10. PORTFOLIO SLIDER
// ============================================================
const portfolioSwiper = new Swiper('.portfolioSwiper', {
    slidesPerView: 9.9,
    spaceBetween: 10,
    loop: true,
    speed: 9000,
    allowTouchMove: false,
    autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
    },
    breakpoints: {
        320: { slidesPerView: 4.5 },
        768: { slidesPerView: 5 },
        992: { slidesPerView: 7 },
        1200: { slidesPerView: 9.6 }
    }
});
// ============================================================
// 11. RESPONSIVE MOBILE MENU
// ============================================================
(function mobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (!toggle || !nav || !overlay) return;

    function openMenu() {
        toggle.classList.add('active');
        nav.classList.add('active');
        overlay.classList.add('active');
        gsap.fromTo(nav.querySelectorAll('ul li'),
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.25 }
        );
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
        if (window.innerWidth > 991) closeMenu();
    });
})();
// ============================================================
// 12. CUSTOM CURSOR
// ============================================================
(function customCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (!dot || !outline) return;

    const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth <= 991;
    if (isTouch) return;

    document.documentElement.classList.add('has-cursor');

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'power3.out' });
    const setOutlineX = gsap.quickTo(outline, 'x', { duration: 0.35, ease: 'power3.out' });
    const setOutlineY = gsap.quickTo(outline, 'y', { duration: 0.35, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
        setDotX(e.clientX);
        setDotY(e.clientY);
        setOutlineX(e.clientX);
        setOutlineY(e.clientY);
    });

    document.addEventListener('mousedown', () => outline.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => outline.classList.remove('cursor-click'));

    const hoverTargets = 'a, button, .swiper-slide, .video-wrapper, input, textarea, .package-item, .portfolioSwiper .item';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            outline.classList.add('cursor-hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            outline.classList.remove('cursor-hover');
        }
    });

    document.addEventListener('mouseleave', () => {
        gsap.to([dot, outline], { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to([dot, outline], { opacity: 1, duration: 0.3 });
    });
})();
// ============================================================
// 13. SITEWIDE PARAGRAPH REVEAL
// ============================================================
(function paragraphsReveal() {
    const paras = document.querySelectorAll('p:not(.banner p)');

    paras.forEach((p) => {
        ScrollTrigger.create({
            trigger: p,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.fromTo(p,
                    { opacity: 0, y: 24, filter: 'blur(6px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }
                );
            }
        });
    });
})();
// ============================================================
// 14. GENERIC SECTION SCROLL REVEAL
// ============================================================
(function sectionsReveal() {
    const selectors = [
        '.discover-main .img',
        '.discover-main .head',
        '.video-section .video-wrapper',
        '.portfolio-btns',
        '.package-item',
        '.container-best',
        '.testi-box',
        '.site-logo',
        '.social-links',
        '.info-item',
        '.fot-top-head'
    ];

    selectors.forEach((sel) => {
        const items = gsap.utils.toArray(sel);
        if (!items.length) return;

        ScrollTrigger.batch(items, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) => {
                gsap.fromTo(batch,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, overwrite: 'auto' }
                );
            }
        });
    });
})();
// ============================================================
// 15. OUR WORK
// ============================================================
(function portfolioSection() {
    const section = document.querySelector('.portfolio-section');
    if (!section || typeof portfolioSwiper === 'undefined') return;

    portfolioSwiper.autoplay.stop();

    ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
            portfolioSwiper.slideToLoop(0, 0);
            portfolioSwiper.autoplay.start();
        },
        onEnterBack: () => {
            portfolioSwiper.autoplay.start();
        },
        onLeave: () => {
            portfolioSwiper.autoplay.stop();
        },
        onLeaveBack: () => {
            portfolioSwiper.autoplay.stop();
        }
    });
    document.querySelectorAll('.portfolioSwiper .item').forEach((item) => {
        const top = item.querySelector('.top');
        const bottom = item.querySelector('.bottom');
        const mainImg = item.querySelector(':scope > img');

        gsap.set(top, { xPercent: -50, yPercent: -60 });
        gsap.set(bottom, { xPercent: -50, yPercent: 60 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
        tl.to(top, { xPercent: -50, yPercent: 0, opacity: 1, visibility: 'visible', duration: 0.6 }, 0)
            .to(bottom, { xPercent: -50, yPercent: 0, opacity: 1, visibility: 'visible', duration: 0.6 }, 0)
            .to(mainImg, { scale: 1.06, filter: 'brightness(0.6)', duration: 0.6 }, 0);

        item.addEventListener('mouseenter', () => tl.play());
        item.addEventListener('mouseleave', () => tl.reverse());
    });
})();

// ============================================================
// 16. SIGNATURE MARQUEE
// ============================================================
(function awMarquee() {
    const track = document.getElementById('awMarquee');
    const wrap = document.querySelector('.aw-marquee-wrap');
    if (!track || !wrap) return;

    let marqueeTween;

    function buildMarquee() {
        if (marqueeTween) marqueeTween.kill();
        gsap.set(track, { x: 0 });

        const distance = track.scrollWidth / 2;

        marqueeTween = gsap.to(track, {
            x: -distance,
            duration: distance / 60,
            ease: 'none',
            repeat: -1
        });
    }

    buildMarquee();

    gsap.fromTo(wrap,
        { opacity: 0, y: 24 },
        {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: wrap,
                start: 'top 95%',
                once: true
            }
        }
    );

    wrap.addEventListener('mouseenter', () => {
        if (marqueeTween) gsap.to(marqueeTween, { timeScale: 0.25, duration: 0.6, ease: 'power2.out' });
    });
    wrap.addEventListener('mouseleave', () => {
        if (marqueeTween) gsap.to(marqueeTween, { timeScale: 1, duration: 0.6, ease: 'power2.out' });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildMarquee, 250);
    });
})();
// ============================================================
// 17. PORTFOLIO GRID (FILTER + REVEAL)
// ============================================================
(function awPortfolioGrid() {
    const grid = document.getElementById('awGrid');
    const filterBar = document.getElementById('awFilters');
    if (!grid || !filterBar) return;

    const cards = gsap.utils.toArray(grid.querySelectorAll('.aw-card'));
    const filterBtns = gsap.utils.toArray(filterBar.querySelectorAll('.aw-filter-btn'));

    // --- entrance reveal on scroll ---
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.94, filter: 'blur(8px)' });

    ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.12,
                overwrite: 'auto'
            });
        }
    });

    // --- per-card hover (image zoom + arrow slide) ---
    cards.forEach((card) => {
        const img = card.querySelector('img');
        const arrow = card.querySelector('.aw-card-arrow');
        const overlay = card.querySelector('.aw-card-overlay');

        const hoverTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.5 } });
        hoverTl.to(img, { scale: 1.08 }, 0);
        if (overlay) hoverTl.to(overlay, { y: -6 }, 0);
        if (arrow) hoverTl.to(arrow, { x: 6, rotation: 45 }, 0);

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // --- filter switching ---
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('is-active')) return;

            filterBtns.forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const filter = btn.dataset.filter;
            const toHide = cards.filter((card) => filter !== 'all' && card.dataset.cat !== filter);
            const toShow = cards.filter((card) => filter === 'all' || card.dataset.cat === filter);

            const tl = gsap.timeline();

            tl.to(cards, {
                opacity: 0,
                y: 24,
                scale: 0.96,
                filter: 'blur(6px)',
                duration: 0.35,
                ease: 'power2.in',
                stagger: 0.03,
                onComplete: () => {
                    toHide.forEach((card) => { card.style.display = 'none'; });
                    toShow.forEach((card) => { card.style.display = ''; });
                    ScrollTrigger.refresh();
                }
            })
                .fromTo(toShow,
                    { opacity: 0, y: 24, scale: 0.96, filter: 'blur(6px)' },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 0.55,
                        ease: 'power3.out',
                        stagger: 0.06
                    }
                );
        });
    });
})();

// --- CONFIGURATION ---
const SERVICES = [
    { name: "Web Development", tag: "WEB", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=70" },
    { name: "App Development", tag: "APP", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=70" },
    { name: "UI/UX Design", tag: "DESIGN", image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=70" },
    { name: "Logo Design", tag: "BRAND", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=70" },
    { name: "SaaS Platforms", tag: "SAAS", image: "https://images.unsplash.com/photo-1686061592689-312bbfb5c055?auto=format&fit=crop&w=800&q=70" },
    { name: "Product Design", tag: "PRODUCT", image: "https://images.unsplash.com/photo-1602576666092-bf6447a729fc?auto=format&fit=crop&w=800&q=70" },
    { name: "AI Solutions", tag: "AI", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=70" },
    { name: "Content Writing", tag: "CONTENT", image: "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?auto=format&fit=crop&w=800&q=70" },
    { name: "Digital Marketing", tag: "MARKETING", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=70" },
    { name: "E-Commerce Development", tag: "COMMERCE", image: "https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&w=800&q=70" },
    { name: "Cloud-Based Solutions", tag: "CLOUD", image: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&w=800&q=70" },
    { name: "Custom Development", tag: "CUSTOM", image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=70" },
];

const CONFIG = {
    itemCount: SERVICES.length, // one item per service, no repeats
    starCount: 150,
    zGap: 900,
    loopSize: 0,
    camSpeed: 2.5,
    colors: ["#ff003c", "#00f3ff", "#ccff00", "#ffffff"],
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

// --- STATE ---
const state = {
    scroll: 0,
    targetScroll: 0,
    velocity: 0,
    targetSpeed: 0,
    mouseX: 0,
    mouseY: 0,
};

const world = document.getElementById("world");
const viewport = document.getElementById("viewport");
const items = [];

// --- INIT ---
function init() {
    for (let i = 0; i < CONFIG.itemCount; i++) {
        const el = document.createElement("div");
        el.className = "item";

        const service = SERVICES[i];

        const card = document.createElement("div");
        card.className = "card-main";
        if (service.image) {
            card.style.backgroundImage = `url('${service.image}')`;
        }

        card.innerHTML = `
            <div class="card-header">
                <h6 class="web-title">${service.tag}</h6>
                <div style="width: 10px; height: 10px; background: var(--accent);"></div>
            </div>
            <h2 class="web-title">${service.name}</h2>
            <div style="position:absolute; bottom:2rem; right:2rem; font-size:4rem; opacity:0.1; font-weight:900;">${String(i + 1).padStart(2, "0")}</div>
        `;
        el.appendChild(card);

        const angle = (i / CONFIG.itemCount) * Math.PI * 6;
        const x = Math.cos(angle) * (window.innerWidth * 0.3);
        const y = Math.sin(angle) * (window.innerHeight * 0.3);
        const rot = (Math.random() - 0.5) * 30;

        items.push({
            el,
            type: "card",
            x,
            y,
            rot,
            baseZ: -i * CONFIG.zGap,
        });

        world.appendChild(el);
    }


    // Mouse move
    window.addEventListener("mousemove", (e) => {
        state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
}
init();

// --- LENIS ---
const lenis = new Lenis({
    smooth: true,
    lerp: 0.08,
    direction: "vertical",
    gestureDirection: "vertical",
    smoothTouch: true,
});
lenis.on("scroll", ({ scroll, velocity }) => {
});

const hyperSection = document.querySelector(".hyper-contaier");

const lastCardBaseZ = -(CONFIG.itemCount - 1) * CONFIG.zGap;
const hyperMaxScroll = Math.ceil((Math.abs(lastCardBaseZ) + 600) / CONFIG.camSpeed);

// Section must be at least this % visible in the viewport before it is
// allowed to take over the scroll (mouse/wheel/touch).
const HYPER_VISIBILITY_THRESHOLD = 0.9;
let isHyperActive = false;

if (hyperSection) {
    const hyperObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                isHyperActive = entry.intersectionRatio >= HYPER_VISIBILITY_THRESHOLD;

                // Section scrolled below the visibility threshold (either
                // not reached yet, or scrolled past) -> release control
                // back to the normal page scroll immediately.
                if (!isHyperActive) {
                    state.targetSpeed = 0;
                    lenis.start();
                }
            });
        },
        {
            threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        }
    );
    hyperObserver.observe(hyperSection);

    hyperSection.addEventListener("mouseenter", () => {
        if (!isHyperActive) return;
        lenis.stop();
    });

    hyperSection.addEventListener("mouseleave", () => {
        lenis.start();
        state.targetSpeed = 0;
    });

    let wheelIdleTimer = null;
    hyperSection.addEventListener(
        "wheel",
        (e) => {
            if (!isHyperActive) return; // not 90% visible yet -> let the page scroll normally

            const goingDown = e.deltaY > 0;
            const goingUp = e.deltaY < 0;
            const atEnd = state.targetScroll >= hyperMaxScroll;
            const atStart = state.targetScroll <= 0;

            if ((goingDown && atEnd) || (goingUp && atStart)) {
                lenis.start();
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            lenis.stop();

            state.targetScroll += e.deltaY;
            if (state.targetScroll < 0) state.targetScroll = 0;
            if (state.targetScroll > hyperMaxScroll) state.targetScroll = hyperMaxScroll;

            state.targetSpeed = e.deltaY;

            clearTimeout(wheelIdleTimer);
            wheelIdleTimer = setTimeout(() => {
                state.targetSpeed = 0;
            }, 120);
        },
        { passive: false }
    );

    let touchStartY = null;
    hyperSection.addEventListener(
        "touchstart",
        (e) => {
            if (!isHyperActive) return;
            lenis.stop();
            touchStartY = e.touches[0].clientY;
        },
        { passive: true }
    );
    hyperSection.addEventListener(
        "touchmove",
        (e) => {
            if (!isHyperActive || touchStartY === null) return;
            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY - currentY;

            const goingDown = deltaY > 0;
            const goingUp = deltaY < 0;
            const atEnd = state.targetScroll >= hyperMaxScroll;
            const atStart = state.targetScroll <= 0;

            if ((goingDown && atEnd) || (goingUp && atStart)) {
                lenis.start();
                touchStartY = currentY;
                return;
            }

            e.preventDefault();
            touchStartY = currentY;

            state.targetScroll += deltaY * 2;
            if (state.targetScroll < 0) state.targetScroll = 0;
            if (state.targetScroll > hyperMaxScroll) state.targetScroll = hyperMaxScroll;
            state.targetSpeed = deltaY;
        },
        { passive: false }
    );
    hyperSection.addEventListener("touchend", () => {
        touchStartY = null;
        lenis.start();
        state.targetSpeed = 0;
    });
}

// --- RAF LOOP ---
let lastTime = 0;
function raf(time) {
    lenis.raf(time);
    const delta = time - lastTime;
    lastTime = time;

    state.scroll += (state.targetScroll - state.scroll) * 0.12;

    state.velocity += (state.targetSpeed - state.velocity) * 0.1;

    const tiltX = state.mouseY * 5 - state.velocity * 0.5;
    const tiltY = state.mouseX * 5;
    world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    viewport.style.perspective = `${1000 - Math.min(Math.abs(state.velocity) * 10, 600)}px`;

    const cameraZ = state.scroll * CONFIG.camSpeed;

    items.forEach((item) => {
        let relZ = item.baseZ + cameraZ;
        let vizZ;

        if (item.type === "star") {
            const modC = CONFIG.loopSize;
            vizZ = ((relZ % modC) + modC) % modC;
            if (vizZ > 500) vizZ -= modC;
        } else {
            vizZ = relZ;
        }

        let alpha = 1;
        if (vizZ < -3000) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
        if (vizZ > 100 && item.type !== "star")
            alpha = 1 - (vizZ - 100) / 400;
        if (alpha < 0) alpha = 0;
        item.el.style.opacity = alpha;

        if (alpha > 0) {
            let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;
            if (item.type === "star") {
                trans += ` scale3d(1,1,${Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.1, 10))})`;
            } else if (item.type === "text") {
                trans += ` rotateZ(${item.rot}deg)`;
                if (Math.abs(state.velocity) > 1) {
                    const offset = state.velocity * 2;
                    item.el.style.textShadow = `${offset}px 0 red, ${-offset}px 0 cyan`;
                } else item.el.style.textShadow = "none";
            } else {
                const t = time * 0.001;
                const float = Math.sin(t + item.x) * 10;
                trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
            }
            item.el.style.transform = trans;
        }
    });

    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "0",
        width: "0",
        videoId: "h7MYJghRWt0",
        playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: "h7MYJghRWt0",
            modestbranding: 1,
        },
        events: {
            onReady: (event) => {
                event.target.playVideo();
            },
        },
    });
}
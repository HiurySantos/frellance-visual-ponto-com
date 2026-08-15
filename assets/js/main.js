// ========== MOBILE MENU TOGGLE ==========
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenuState(isOpen, returnFocus = false) {
    if (!navToggle || !navMenu) return;

    navToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    navMenu.inert = !isOpen && window.innerWidth <= 768;
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

    if (!isOpen && returnFocus) {
        navToggle.focus();
    }
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        setMenuState(!isOpen);
    });

    document.addEventListener('click', (event) => {
        if (navToggle.getAttribute('aria-expanded') === 'true'
            && !navMenu.contains(event.target)
            && !navToggle.contains(event.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
            setMenuState(false, true);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navToggle.getAttribute('aria-expanded') === 'true') {
            setMenuState(false);
        } else {
            navMenu.inert = navToggle.getAttribute('aria-expanded') !== 'true' && window.innerWidth <= 768;
        }
    });

    setMenuState(false);
}

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setMenuState(false);
    });
});

// ========== HEADER SHADOW ON SCROLL ==========
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ========== SMOOTH SCROLL NAVIGATION ==========
const scrollLinks = document.querySelectorAll('a[href^="#"]');

scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Ignorar links vazios ou que não são âncoras de seção
        if (href === '#' || href === '#privacidade') {
            return;
        }

        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: reducedMotionQuery.matches ? 'auto' : 'smooth'
            });

            if (link.classList.contains('skip-link')) {
                targetSection.focus({ preventScroll: true });
            }
        }
    });
});

// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');

function setFaqState(item, isOpen) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question) return;

    item.classList.toggle('active', isOpen);
    question.setAttribute('aria-expanded', String(isOpen));
    if (answer) answer.setAttribute('aria-hidden', String(!isOpen));
}

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
        const shouldOpen = question.getAttribute('aria-expanded') !== 'true';

        // Fechar outros itens
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                setFaqState(otherItem, false);
            }
        });

        // Toggle item atual
        setFaqState(item, shouldOpen);
    });
});

// ========== SCROLL TO TOP BUTTON ==========
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;

    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotionQuery.matches ? 'auto' : 'smooth'
        });
    });
}

// ========== COUNTER ANIMATION FOR STATS ==========
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let countersActivated = false;

function animateCounters() {
    if (countersActivated || statNumbers.length === 0) return;

    if (reducedMotionQuery.matches) {
        statNumbers.forEach(stat => {
            stat.textContent = stat.getAttribute('data-target');
        });
        countersActivated = true;
        return;
    }

    const firstStat = statNumbers[0];
    const statPosition = firstStat.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (statPosition < screenPosition) {
        countersActivated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;

            const updateCounter = () => {
                current += increment;

                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Elementos para animar
const animatedElements = document.querySelectorAll(`
    .servico-card,
    .destaque-card,
    .beneficio-card,
    .depoimento-card,
    .polo-card,
    .sobre-content > *,
    .info-item
`);

function showAnimatedElementsImmediately() {
    animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
    });
}

if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
    showAnimatedElementsImmediately();
} else {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========== PARALLAX EFFECT ON HERO ==========
const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    if (reducedMotionQuery.matches) {
        if (heroBackground) heroBackground.style.transform = 'none';
        return;
    }

    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

function handleReducedMotionChange(event) {
    if (event.matches) {
        showAnimatedElementsImmediately();
        if (heroBackground) heroBackground.style.transform = 'none';
        statNumbers.forEach(stat => {
            stat.textContent = stat.getAttribute('data-target');
        });
        countersActivated = true;
    }
}

if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
} else if (typeof reducedMotionQuery.addListener === 'function') {
    reducedMotionQuery.addListener(handleReducedMotionChange);
}

// ========== LAZY LOADING IMAGES ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Se a imagem tiver data-src, carregá-la
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }

                imageObserver.unobserve(img);
            }
        });
    });

    // Observar todas as imagens
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========== ADD ANIMATION TO ELEMENTS ON LOAD ==========
window.addEventListener('load', () => {
    // Remover preloader se existir
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }

    // Ativar animações iniciais
    document.body.classList.add('loaded');
});

// ========== PREVENT SCROLL RESTORATION ON PAGE RELOAD ==========
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// ========== ADICIONAR EFEITO DE HOVER NOS CARDS ==========
const cards = document.querySelectorAll('.servico-card, .destaque-card, .beneficio-card, .depoimento-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

const botoes = document.querySelectorAll(".unidade-botao");

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    const conteudo = document.getElementById(botao.getAttribute('aria-controls'));
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    if (!conteudo) return;

    document.querySelectorAll(".unidade-botao").forEach(b => {
      b.classList.remove("ativo");
      b.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll(".unidade-conteudo").forEach(c => {
      c.style.maxHeight = null;
      c.setAttribute('aria-hidden', 'true');
    });

    if (!aberto) {
      botao.classList.add("ativo");
      botao.setAttribute('aria-expanded', 'true');
      conteudo.setAttribute('aria-hidden', 'false');
      conteudo.style.maxHeight = conteudo.scrollHeight + "px";
    }
  });
});

// ========== MINI GALERIA DOS POLOS NA HOME ==========
const galeriasHome = {
    guarapari: [
        { base: "assets/images/units/guarapari/guarapari-03", width: 960, height: 1280 },
        { base: "assets/images/units/guarapari/guarapari-01", width: 960, height: 1280 }
    ],

    serra: [
        { base: "assets/images/units/serra/serra-01", width: 960, height: 1280 },
        { base: "assets/images/units/serra/serra-10", width: 960, height: 1280 }
    ],

    cariacica: [
        { base: "assets/images/units/cariacica/cariacica-11", width: 738, height: 1600 },
        { base: "assets/images/units/cariacica/cariacica-01", width: 720, height: 1600 }
    ]
};

function carregarMiniGaleria(id, nomeUnidade, fotos) {
    const container = document.getElementById(id);

    if (!container) return;

    fotos.forEach((foto, index) => {
        const imagem = document.createElement('img');
        imagem.src = `${foto.base}-480.webp`;
        imagem.srcset = `${foto.base}-480.webp 480w, ${foto.base}-960.webp 960w`;
        imagem.sizes = '(max-width: 768px) 50vw, 300px';
        imagem.width = foto.width;
        imagem.height = foto.height;
        imagem.alt = `Imagem ${index + 1} da unidade de ${nomeUnidade}`;
        imagem.loading = 'lazy';
        imagem.decoding = 'async';
        container.append(imagem);
    });
}

carregarMiniGaleria("galeria-guarapari", 'Guarapari', galeriasHome.guarapari);
carregarMiniGaleria("galeria-serra", 'Serra', galeriasHome.serra);
carregarMiniGaleria("galeria-cariacica", 'Cariacica', galeriasHome.cariacica);

// Rastrear clique no WhatsApp
document.addEventListener('DOMContentLoaded', function () {
    const botoesWhatsapp = document.querySelectorAll('.botao-whatsapp');

    botoesWhatsapp.forEach((botao) => {
        botao.addEventListener('click', function () {
            const unidade = this.dataset.unidade || 'nao_informada';
            const link = this.href;

            if (typeof gtag === 'function') {
                gtag('event', 'click_whatsapp', {
                    event_category: 'contato',
                    event_label: unidade,
                    unidade: unidade,
                    link_destino: link,
                    transport_type: 'beacon'
                });

            }
        });
    });
});

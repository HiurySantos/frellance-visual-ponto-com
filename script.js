// ========== MOBILE MENU TOGGLE ==========
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========== HEADER SHADOW ON SCROLL ==========
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
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
        if (href === '#' || href === '#privacidade' || href === '#termos') {
            return;
        }

        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Fechar outros itens
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle item atual
        item.classList.toggle('active');
    });
});

// ========== SCROLL TO TOP BUTTON ==========
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== COUNTER ANIMATION FOR STATS ==========
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let countersActivated = false;

function animateCounters() {
    if (countersActivated) return;

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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

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

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========== PARALLAX EFFECT ON HERO ==========
const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

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

// ========== ANALYTICS E TRACKING (PLACEHOLDER) ==========
// Aqui você pode adicionar código para Google Analytics, Facebook Pixel, etc.
// Exemplo:
// gtag('config', 'GA_MEASUREMENT_ID');

// ========== CONSOLE INFO ==========
console.log('%c🎓 Visual Ponto Com - Cursos Profissionalizantes', 'color: #1e3a5f; font-size: 20px; font-weight: bold;');
console.log('%cDesenvolvido com dedicação para transformar vidas através dos idiomas', 'color: #f59e0b; font-size: 14px;');
console.log('%cVisite-nos: Av. Paulista, 1234 - São Paulo/SP', 'color: #64748b; font-size: 12px;');

// ========== SERVICE WORKER (OPCIONAL - PWA) ==========
// Descomente para adicionar suporte PWA
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('Erro ao registrar Service Worker:', error);
            });
    });
}
*/

// ========== DARK MODE TOGGLE (OPCIONAL) ==========
// Descomente para adicionar suporte a modo escuro
/*
const darkModeToggle = document.getElementById('darkModeToggle');

if (darkModeToggle) {
    // Verificar preferência salva
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', null);
        }
    });
}
*/

// ========== EASTER EGG ==========
// Pequeno easter egg para desenvolvedores curiosos
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

window.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        console.log('%c🎉 Você encontrou o Easter Egg!', 'color: #f59e0b; font-size: 24px; font-weight: bold;');
        console.log('%c🌍 Continue explorando e aprendendo !', 'color: #1e3a5f; font-size: 16px;');

        // Adicionar confetti ou algum efeito visual
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
});
const botoes = document.querySelectorAll(".unidade-botao");

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    const conteudo = botao.nextElementSibling;
    const aberto = botao.classList.contains("ativo");

    document.querySelectorAll(".unidade-botao").forEach(b => b.classList.remove("ativo"));
    document.querySelectorAll(".unidade-conteudo").forEach(c => c.style.maxHeight = null);

    if (!aberto) {
      botao.classList.add("ativo");
      conteudo.style.maxHeight = conteudo.scrollHeight + "px";
    }
  });
});

// ========== MINI GALERIA DOS POLOS NA HOME ==========
const galeriasHome = {
    guarapari: [
        "img/Polo Guarapari/WhatsApp Image 2026-04-02 at 04.50.40.jpeg",
        "img/Polo Guarapari/WhatsApp Image 2026-04-02 at 04.48.48 (1).jpeg"
    ],

    serra: [
        "img/Polo Serra/WhatsApp Image 2026-04-02 at 04.59.17.jpeg",
        "img/Polo Serra/WhatsApp Image 2026-04-02 at 05.34.48.jpeg"
    ],

    cariacica: [
        "img/Polo Cariacica/WhatsApp Image 2026-04-02 at 05.29.50.jpeg",
        "img/Polo Cariacica/WhatsApp Image 2026-04-02 at 05.12.08.jpeg"
    ],

    vilavelha: [
        "img/Polo Vila Velha/WhatsApp Image 2026-04-07 at 11.47.12.jpeg",
        "img/Polo Vila Velha/WhatsApp Image 2026-04-07 at 11.47.121.jpeg"
    ]
};

function carregarMiniGaleria(id, fotos) {
    const container = document.getElementById(id);

    if (!container) return;

    fotos.forEach((foto, index) => {
        container.innerHTML += `
            <img src="${foto}" alt="Foto ${index + 1}" loading="lazy">
        `;
    });
}

carregarMiniGaleria("galeria-guarapari", galeriasHome.guarapari);
carregarMiniGaleria("galeria-serra", galeriasHome.serra);
carregarMiniGaleria("galeria-cariacica", galeriasHome.cariacica);
carregarMiniGaleria("galeria-vilavelha", galeriasHome.vilavelha);
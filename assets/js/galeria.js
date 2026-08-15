const preferenciaMovimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
const INTERVALO_CARROSSEL = 8000;

function criarImagens(unidade, dimensoes) {
    return dimensoes.map(([width, height], index) => {
        const numero = String(index + 1).padStart(2, '0');
        const base = `assets/images/units/${unidade}/${unidade}-${numero}`;

        return {
            tipo: 'imagem',
            src: `${base}-480.webp`,
            srcset: `${base}-480.webp 480w, ${base}-960.webp 960w`,
            width,
            height
        };
    });
}

function criarVideos(unidade, dimensoes) {
    return dimensoes.map(([width, height], index) => {
        const numero = String(index + 1).padStart(2, '0');
        const base = `assets/videos/units/${unidade}/${unidade}-video-${numero}`;

        return {
            tipo: 'video',
            src: `${base}.mp4`,
            poster: `${base}-poster.webp`,
            width,
            height
        };
    });
}

const unidades = [
    {
        slug: 'cariacica',
        nome: 'Cariacica',
        ativa: true,
        midias: [
            ...criarImagens('cariacica', [
                [720, 1600], [720, 1600], [720, 1600], [720, 1600], [720, 1600], [720, 1280],
                [960, 540], [900, 1600], [900, 1600], [900, 1600], [738, 1600], [720, 1600],
                [720, 1600], [705, 1599], [720, 1600], [720, 1600], [720, 1600], [720, 1600]
            ]),
            ...criarVideos('cariacica', [
                [382, 850], [720, 1280], [478, 850], [478, 850], [478, 850], [478, 850]
            ])
        ]
    },
    {
        slug: 'guarapari',
        nome: 'Guarapari',
        ativa: true,
        midias: [
            ...criarImagens('guarapari', [[960, 1280], [960, 1280], [960, 1280]]),
            ...criarVideos('guarapari', [[480, 848]])
        ]
    },
    {
        slug: 'serra',
        nome: 'Serra',
        ativa: true,
        midias: [
            ...criarImagens('serra', [
                [960, 1280], [960, 720], [960, 1280], [960, 1280], [960, 720], [960, 1280],
                [960, 1280], [960, 720], [960, 1280], [960, 1280], [960, 1280], [960, 1280],
                [868, 1156], [960, 720], [960, 720]
            ]),
            ...criarVideos('serra', [
                [1280, 720], [720, 1280], [720, 1280], [720, 1280], [720, 1280], [720, 1280], [720, 1280]
            ])
        ]
    },
    {
        slug: 'vila-velha',
        nome: 'Vila Velha',
        // Unidade de Vila Velha temporariamente desativada. Altere ativa para true quando a unidade voltar a funcionar.
        ativa: false,
        midias: [
            ...criarImagens('vila-velha', [
                [960, 561], [960, 1280], [960, 720], [960, 1280], [960, 1280],
                [960, 720], [960, 1280], [960, 720], [960, 1280], [960, 720]
            ]),
            ...criarVideos('vila-velha', [[720, 1280]])
        ]
    }
];

function criarElementoMidia(midia, nomeUnidade, posicao) {
    if (midia.tipo === 'imagem') {
        const imagem = document.createElement('img');
        imagem.src = midia.src;
        imagem.srcset = midia.srcset;
        imagem.sizes = '(max-width: 768px) 100vw, 1100px';
        imagem.width = midia.width;
        imagem.height = midia.height;
        imagem.alt = `Imagem ${posicao} da unidade de ${nomeUnidade}`;
        imagem.loading = 'lazy';
        imagem.decoding = 'async';
        return imagem;
    }

    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'none';
    video.poster = midia.poster;
    video.width = midia.width;
    video.height = midia.height;
    video.playsInline = true;
    video.setAttribute('aria-label', `Vídeo da unidade de ${nomeUnidade}`);

    const fonte = document.createElement('source');
    fonte.src = midia.src;
    fonte.type = 'video/mp4';
    video.append(fonte, document.createTextNode('Seu navegador não suporta vídeo.'));
    return video;
}

function montarCarrossel(unidade) {
    const secao = document.createElement('section');
    secao.className = 'bloco-galeria';
    secao.id = unidade.slug;

    const titulo = document.createElement('h2');
    titulo.id = `titulo-${unidade.slug}`;
    titulo.textContent = unidade.nome;

    const carrossel = document.createElement('div');
    carrossel.className = 'carrossel';
    carrossel.tabIndex = 0;
    carrossel.setAttribute('role', 'region');
    carrossel.setAttribute('aria-roledescription', 'carrossel');
    carrossel.setAttribute('aria-labelledby', titulo.id);

    const trilha = document.createElement('div');
    trilha.className = 'carrossel-trilha';

    const slides = unidade.midias.map((midia, index) => {
        const slide = document.createElement('figure');
        slide.className = 'carrossel-slide';
        slide.dataset.indice = String(index);
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${index + 1} de ${unidade.midias.length}`);
        slide.setAttribute('aria-hidden', 'true');
        slide.dataset.carregada = 'false';
        trilha.append(slide);
        return slide;
    });

    const controles = document.createElement('div');
    controles.className = 'carrossel-controles';
    controles.setAttribute('aria-label', `Controles da galeria de ${unidade.nome}`);

    const anterior = document.createElement('button');
    anterior.className = 'carrossel-botao carrossel-anterior';
    anterior.type = 'button';
    anterior.setAttribute('aria-label', `Mostrar mídia anterior de ${unidade.nome}`);
    anterior.textContent = '‹';

    const proximo = document.createElement('button');
    proximo.className = 'carrossel-botao carrossel-proximo';
    proximo.type = 'button';
    proximo.setAttribute('aria-label', `Mostrar próxima mídia de ${unidade.nome}`);
    proximo.textContent = '›';

    const rodape = document.createElement('div');
    rodape.className = 'carrossel-rodape';

    const pausar = document.createElement('button');
    pausar.className = 'carrossel-pausa';
    pausar.type = 'button';
    pausar.setAttribute('aria-label', `Pausar galeria de ${unidade.nome}`);
    pausar.setAttribute('aria-pressed', 'false');
    pausar.textContent = 'Pausar';

    const indicador = document.createElement('span');
    indicador.className = 'carrossel-indicador';
    indicador.setAttribute('aria-live', 'polite');

    controles.append(anterior, proximo);
    rodape.append(pausar, indicador);
    carrossel.append(trilha, controles, rodape);
    secao.append(titulo, carrossel);

    let indiceAtual = 0;
    let pausaSolicitada = false;
    let intervalo = null;

    function carregarSlide(indice) {
        const slide = slides[indice];
        if (!slide || slide.dataset.carregada === 'true') return;
        slide.append(criarElementoMidia(unidade.midias[indice], unidade.nome, indice + 1));
        slide.dataset.carregada = 'true';
    }

    function devePausar() {
        return pausaSolicitada || document.hidden || preferenciaMovimentoReduzido.matches || unidade.midias[indiceAtual].tipo === 'video';
    }

    function pararRotacao() {
        if (intervalo !== null) {
            window.clearInterval(intervalo);
            intervalo = null;
        }
    }

    function iniciarRotacao() {
        pararRotacao();
        if (devePausar()) return;
        intervalo = window.setInterval(() => exibirSlide(indiceAtual + 1), INTERVALO_CARROSSEL);
    }

    function atualizarPausa() {
        const reduzido = preferenciaMovimentoReduzido.matches;
        pausar.disabled = reduzido;
        pausar.setAttribute('aria-pressed', String(pausaSolicitada || reduzido));
        pausar.setAttribute('aria-label', `${pausaSolicitada ? 'Continuar' : 'Pausar'} galeria de ${unidade.nome}`);
        pausar.textContent = pausaSolicitada ? 'Continuar' : 'Pausar';
    }

    function exibirSlide(indice) {
        const normalizado = (indice + slides.length) % slides.length;
        carregarSlide(normalizado);

        slides.forEach((slide, index) => {
            const ativo = index === normalizado;
            slide.classList.toggle('ativo', ativo);
            slide.setAttribute('aria-hidden', String(!ativo));
            if (!ativo) slide.querySelector('video')?.pause();
        });

        indiceAtual = normalizado;
        indicador.textContent = `${indiceAtual + 1} / ${slides.length}`;
        iniciarRotacao();
    }

    anterior.addEventListener('click', () => exibirSlide(indiceAtual - 1));
    proximo.addEventListener('click', () => exibirSlide(indiceAtual + 1));
    pausar.addEventListener('click', () => {
        pausaSolicitada = !pausaSolicitada;
        atualizarPausa();
        iniciarRotacao();
    });

    carrossel.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            exibirSlide(indiceAtual - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            exibirSlide(indiceAtual + 1);
        }
    });

    document.addEventListener('visibilitychange', iniciarRotacao);
    const atualizarMovimento = () => {
        atualizarPausa();
        iniciarRotacao();
    };

    if (typeof preferenciaMovimentoReduzido.addEventListener === 'function') {
        preferenciaMovimentoReduzido.addEventListener('change', atualizarMovimento);
    } else if (typeof preferenciaMovimentoReduzido.addListener === 'function') {
        preferenciaMovimentoReduzido.addListener(atualizarMovimento);
    }

    atualizarPausa();
    exibirSlide(0);
    return secao;
}

const containerGalerias = document.getElementById('galerias-unidades');

if (containerGalerias) {
    unidades.filter(unidade => unidade.ativa).forEach(unidade => {
        containerGalerias.append(montarCarrossel(unidade));
    });
}

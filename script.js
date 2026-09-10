// Animaciones al hacer scroll (fade-up)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Sombra en Nav al hacer Scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.style.boxShadow = '0 2px 24px rgba(28, 20, 9, 0.1)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

// Menu hamburguesa (movil)
const navToggle = document.getElementById('navToggle');
const navMenuMobile = document.getElementById('navMenuMobile');

if (navToggle && navMenuMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenuMobile.classList.contains('open');
    if (isOpen) {
      navMenuMobile.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      navMenuMobile.classList.add('open');
      navToggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  navMenuMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenuMobile.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Filtros por categoria
const bubbleBtns = document.querySelectorAll('.bubble-btn');
const activityCards = document.querySelectorAll('.activity-card');

function filtrarCategorias(categoria) {
  // Actualizar clase activa en botones
  bubbleBtns.forEach(btn => {
    if (btn.dataset.category === categoria) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Mostrar / Ocultar Tarjetas
  activityCards.forEach(card => {
    if (categoria === 'all' || card.dataset.category === categoria) {
      card.style.display = 'flex';
      setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => { card.style.display = 'none'; }, 300);
    }
  });
}

bubbleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtrarCategorias(btn.dataset.category);
  });
});



// Modal de detalles de actividades
const activityModal = document.getElementById('activityModal');
const modalClose = document.getElementById('modalClose');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalMeta = document.getElementById('modalMeta');

function abrirModal(card) {
  if (!activityModal) return;
  
  modalTag.textContent = card.dataset.tag || 'Actividad';
  modalTitle.textContent = card.dataset.title || 'Detalle de la actividad';
  modalDesc.textContent = card.dataset.desc || 'Descripción de la actividad comunitaria.';
  
  if (modalMeta) {
    const categoryNames = {
      'formacion': 'Formación y Mediación',
      'materiales': 'Creación de Material Didáctico',
      'talleres': 'Talleres y Comunidad'
    };
    const cat = card.dataset.category || '';
    const catLabel = categoryNames[cat] || 'Iniciativa territorial';

    modalMeta.innerHTML = `
      <div class="modal-meta-item">
        <strong>Área de trabajo:</strong>
        <span>${catLabel}</span>
      </div>
      <div class="modal-meta-item">
        <strong>Territorio:</strong>
        <span>Rancagua, Región de O'Higgins</span>
      </div>
    `;
  }
  
  activityModal.classList.add('open');
  activityModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  if (!activityModal) return;
  activityModal.classList.remove('open');
  activityModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

activityCards.forEach(card => {
  card.addEventListener('click', () => abrirModal(card));
});

if (modalClose) modalClose.addEventListener('click', cerrarModal);

if (activityModal) {
  activityModal.addEventListener('click', (e) => {
    if (e.target === activityModal) cerrarModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activityModal && activityModal.classList.contains('open')) {
    cerrarModal();
  }
});

// Manejo del formulario de contacto / colaboradores
const colaboraForm = document.getElementById('colaboraForm');
const formFeedback = document.getElementById('formFeedback');

if (colaboraForm) {
  colaboraForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formFeedback) {
      formFeedback.style.display = 'flex';
      formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    colaboraForm.reset();
  });
}

// ─── Animacion Pop-Up 3D: Pliego Inicial del Libro (POC) ───
function initPopUpBookHero() {
  if (typeof gsap === 'undefined') return;

  const stage = document.querySelector('.popup-book-stage');
  const bookContainer = document.querySelector('.book-container');
  const pageLeft = document.querySelector('.page-left');
  const bookLeaf = document.getElementById('bookLeaf');
  const leafFront = document.querySelector('.leaf-front');
  const leafBack = document.querySelector('.leaf-back');
  const figureLayer = document.querySelector('.popup-figure-layer');
  const quoteCard = document.querySelector('.popup-quote-card');
  const popupShadow = document.querySelector('.popup-shadow');
  const leafShading = document.querySelector('.leaf-shading');
  const underlayPage = document.querySelector('.page-right-underlay');
  const manifiestoCards = document.querySelectorAll('.manifiesto-card');

  if (!stage || !bookContainer || !bookLeaf) return;

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.innerWidth > 1024;

  if (isReduced) return;

  if (isDesktop && typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Estado inicial de apertura física al cargar la página
    gsap.set(bookContainer, { rotateX: 6, rotateY: -3, z: -40 });
    gsap.set(pageLeft, { rotateY: 10 });
    gsap.set(bookLeaf, { rotateY: 0, transformOrigin: 'left center' });
    if (figureLayer) gsap.set(figureLayer, { rotateX: -65, z: 0, opacity: 0 });
    if (quoteCard) gsap.set(quoteCard, { rotateX: -30, z: 5, opacity: 0 });
    if (popupShadow) gsap.set(popupShadow, { scaleX: 0.4, opacity: 0 });

    const openTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    openTl.to(pageLeft, { rotateY: 0, duration: 1.2, delay: 0.15 })
      .to(bookContainer, { rotateX: 0, rotateY: 0, z: 0, duration: 1.3 }, '<')
      .to(figureLayer, { rotateX: 0, z: 35, opacity: 1, duration: 1.1, ease: 'back.out(1.4)' }, '-=0.8')
      .to(popupShadow, { scaleX: 1, opacity: 1, duration: 1.1 }, '<')
      .to(quoteCard, { rotateX: 0, z: 22, opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.6');

    // 2. Efecto Paso de Hoja 3D (Page-Flip) vinculado a ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      const flipTl = gsap.timeline({
        scrollTrigger: {
          id: 'bookFlipTrigger',
          trigger: '#hero',
          start: 'top 84px',
          end: '+=800',
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      // Paso de página progresivo:
      flipTl
        // La figura pop-up y la cita se pliegan al despegar la hoja
        .to(figureLayer, {
          rotateX: -75,
          z: 5,
          opacity: 0.2,
          duration: 0.35,
          ease: 'power2.in'
        }, 0)
        .to(quoteCard, {
          rotateX: -40,
          z: 2,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, 0)
        // La hoja gira 180 grados hacia la izquierda sobre el lomo
        .to(bookLeaf, {
          rotateY: -180,
          duration: 1,
          ease: 'power1.inOut'
        }, 0)
        // Sombra de flexión y relieve que sube hasta el punto vertical y luego se disipa
        .to(leafShading, {
          opacity: 0.85,
          duration: 0.45,
          ease: 'power2.in'
        }, 0.05)
        .to(leafShading, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out'
        }, 0.55)
        // Aparecen las tarjetas de Misión y Visión de la página que quedó revelada
        .from(manifiestoCards, {
          y: 20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.4,
          ease: 'power2.out'
        }, 0.6);
    }

    // 3. Microinteracción de paralaje sutil con el cursor (cuando el libro está en reposo)
    stage.addEventListener('mousemove', (e) => {
      // Solo mover si la hoja está cerrada o casi cerrada
      const currentRot = gsap.getProperty(bookLeaf, 'rotateY');
      if (Math.abs(currentRot) > 30) return;

      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(bookContainer, {
        rotateY: x * 3.5,
        rotateX: -y * 3.5,
        duration: 0.8,
        ease: 'power1.out'
      });

      if (figureLayer && currentRot > -20) {
        gsap.to(figureLayer, {
          x: x * 8,
          rotateY: x * 5,
          duration: 0.6,
          ease: 'power1.out'
        });
      }
    });

    stage.addEventListener('mouseleave', () => {
      gsap.to(bookContainer, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.out' });
      if (figureLayer) gsap.to(figureLayer, { x: 0, rotateY: 0, duration: 1, ease: 'power2.out' });
    });

    // 4. Soporte para enlaces directos y botones de pasar/volver página
    const btnNextLeaf = document.getElementById('btnNextLeaf');
    const btnPrevLeaf = document.getElementById('btnPrevLeaf');

    const scrollToPageFlipped = () => {
      const trigger = ScrollTrigger.getById('bookFlipTrigger') || ScrollTrigger.getAll()[0];
      if (trigger) {
        window.scrollTo({
          top: trigger.end + 10,
          behavior: 'smooth'
        });
      }
    };

    const scrollToCover = () => {
      const trigger = ScrollTrigger.getById('bookFlipTrigger') || ScrollTrigger.getAll()[0];
      if (trigger) {
        window.scrollTo({
          top: trigger.start,
          behavior: 'smooth'
        });
      }
    };

    if (btnNextLeaf) btnNextLeaf.addEventListener('click', scrollToPageFlipped);
    if (btnPrevLeaf) btnPrevLeaf.addEventListener('click', scrollToCover);

    const navFundacionLinks = document.querySelectorAll('a[href="#fundacion"]');
    navFundacionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          scrollToPageFlipped();
        }
      });
    });

  } else {
    // Modo Móvil / Tablet: Entrada natural vertical sin distorsiones 3D
    gsap.from([pageLeft, leafFront, leafBack, underlayPage], {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out'
    });
    if (figureLayer) {
      gsap.from(figureLayer, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'back.out(1.2)'
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopUpBookHero);
} else {
  initPopUpBookHero();
}


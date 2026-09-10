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

// ══════════════════════════════════════════════════════════════
// CONTROLADOR INTEGRAL DEL LIBRO POP-UP (StPageFlip & Responsive)
// ══════════════════════════════════════════════════════════════
const BookController = {
  pageFlip: null,
  currentPage: 0,
  totalPages: 12,
  isInitialized: false,

  init() {
    const bookEl = document.getElementById('bookContainer');
    const pages = document.querySelectorAll('#bookContainer .book-page');
    if (!bookEl || !pages.length) return;

    // Verificar si StPageFlip está disponible y la pantalla es de escritorio/tablet
    const isDesktop = window.innerWidth > 900;
    const hasStPageFlip = typeof St !== 'undefined' && typeof St.PageFlip !== 'undefined';

    if (hasStPageFlip && isDesktop) {
      this.initStPageFlip(bookEl, pages);
    } else {
      this.initFallback(pages);
    }

    this.bindGlobalEvents();
    this.initHeroMistralAnimation();
  },

  initStPageFlip(bookEl, pages) {
    try {
      // Ajustar dimensiones del libro según el viewport
      const containerW = Math.min(1160, window.innerWidth - 60);
      const pageW = Math.floor(containerW / 2);
      const pageH = Math.min(680, Math.max(520, window.innerHeight - 140));

      this.pageFlip = new St.PageFlip(bookEl, {
        width: pageW,
        height: pageH,
        size: 'stretch',
        minWidth: 320,
        maxWidth: 600,
        minHeight: 480,
        maxHeight: 720,
        maxShadowOpacity: 0.5,
        showCover: false,
        usePortrait: true,
        autoSize: true,
        drawShadow: true,
        flippingTime: 850,
        useMouseEvents: true,
        clickEventForward: true
      });

      this.pageFlip.loadFromHTML(pages);

      // Evento al pasar de página
      this.pageFlip.on('flip', (e) => {
        this.currentPage = e.data;
        this.updateNavState(e.data);

        // Erguir a Gabriela Mistral cuando se visualiza la portada (página 0 o 1)
        if (e.data === 0 || e.data === 1) {
          this.initHeroMistralAnimation();
        }
      });

      this.isInitialized = true;
    } catch (err) {
      console.warn('StPageFlip falló al inicializar, activando modo editorial:', err);
      this.initFallback(pages);
    }
  },

  initFallback(pages) {
    // Modo editorial limpio si StPageFlip no está disponible o en pantallas reducidas
    this.totalPages = pages.length;
    pages.forEach((p, idx) => {
      p.style.display = (idx === 0 || idx === 1) ? 'flex' : 'none';
    });
    this.updateNavState(0);
  },

  bindGlobalEvents() {
    // 1. Botones con data-go-page
    document.querySelectorAll('[data-go-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = parseInt(btn.getAttribute('data-go-page'), 10);
        if (!isNaN(target)) {
          this.goToPage(target);
        }
      });
    });

    // 2. Enlaces del menú de navegación (Desktop & Móvil)
    const navMapping = {
      '#': 0,
      '#hero': 0,
      '#fundacion': 2,
      '#que-hacemos': 4,
      '#proyectos': 6,
      '#puntos-donacion': 7,
      '#alianzas': 8,
      '#equipo': 9,
      '#colaborar': 10
    };

    document.querySelectorAll('.nav-links a, .nav-menu-mobile a, .footer-links a, .nav-logo').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && navMapping[href] !== undefined) {
          e.preventDefault();
          this.goToPage(navMapping[href]);

          // Scroll hacia el libro si se hace clic desde el footer o navbar
          const bookView = document.getElementById('libro-experiencia');
          if (bookView) {
            bookView.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Cerrar menú móvil si está abierto
          if (typeof navMenuMobile !== 'undefined' && navMenuMobile.classList.contains('open')) {
            navMenuMobile.classList.remove('open');
            if (typeof navToggle !== 'undefined') navToggle.classList.remove('open');
            document.body.style.overflow = '';
          }
        }
      });
    });

    // 3. Navegación con teclado (Flechas)
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      if (document.getElementById('activityModal')?.classList.contains('open')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        this.nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.prevPage();
      }
    });

    // 4. Parallax 3D suave con el cursor sobre el escenario
    const stage = document.getElementById('bookStage');
    const container = document.getElementById('bookContainer');
    if (stage && container && window.innerWidth > 1024) {
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(container, {
          rotateY: x * 3,
          rotateX: -y * 3,
          duration: 0.8,
          ease: 'power1.out'
        });
      });

      stage.addEventListener('mouseleave', () => {
        gsap.to(container, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.out' });
      });
    }
  },

  goToPage(pageIndex) {
    if (this.pageFlip && this.isInitialized) {
      try {
        this.pageFlip.flip(pageIndex);
        return;
      } catch (e) {
        console.warn('flip() error:', e);
      }
    }

    // Fallback manual
    const pages = document.querySelectorAll('#bookContainer .book-page');
    const leftPageIdx = pageIndex % 2 === 0 ? pageIndex : pageIndex - 1;
    const rightPageIdx = leftPageIdx + 1;

    pages.forEach((p, idx) => {
      p.style.display = (idx === leftPageIdx || idx === rightPageIdx) ? 'flex' : 'none';
    });

    this.currentPage = leftPageIdx;
    this.updateNavState(leftPageIdx);
    if (leftPageIdx === 0) this.initHeroMistralAnimation();
  },

  nextPage() {
    if (this.pageFlip && this.isInitialized) {
      this.pageFlip.flipNext();
    } else {
      if (this.currentPage + 2 < this.totalPages) {
        this.goToPage(this.currentPage + 2);
      }
    }
  },

  prevPage() {
    if (this.pageFlip && this.isInitialized) {
      this.pageFlip.flipPrev();
    } else {
      if (this.currentPage - 2 >= 0) {
        this.goToPage(this.currentPage - 2);
      }
    }
  },

  initHeroMistralAnimation() {
    if (typeof gsap === 'undefined') return;
    const figureLayer = document.querySelector('.popup-figure-layer');
    const quoteCard = document.querySelector('.popup-quote-card');
    const popupShadow = document.querySelector('.popup-shadow');

    if (!figureLayer) return;

    gsap.set(figureLayer, { rotateX: -65, z: 0, opacity: 0 });
    if (quoteCard) gsap.set(quoteCard, { rotateX: -30, z: 5, opacity: 0 });
    if (popupShadow) gsap.set(popupShadow, { scaleX: 0.4, opacity: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(figureLayer, { rotateX: 0, z: 35, opacity: 1, duration: 1.1, ease: 'back.out(1.4)', delay: 0.15 })
      .to(popupShadow, { scaleX: 1, opacity: 1, duration: 1.1 }, '<')
      .to(quoteCard, { rotateX: 0, z: 22, opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.6');
  },

  updateNavState(pageIndex) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));

    const pageToHash = {
      0: '#hero',
      1: '#hero',
      2: '#fundacion',
      3: '#fundacion',
      4: '#que-hacemos',
      5: '#que-hacemos',
      6: '#proyectos',
      7: '#puntos-donacion',
      8: '#alianzas',
      9: '#equipo',
      10: '#colaborar',
      11: '#colaborar'
    };

    const targetHash = pageToHash[pageIndex];
    if (targetHash) {
      document.querySelectorAll(`.nav-links a[href="${targetHash}"]`).forEach(l => l.classList.add('active'));
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BookController.init());
} else {
  BookController.init();
}


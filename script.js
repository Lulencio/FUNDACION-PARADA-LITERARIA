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
// CONTROLADOR INTEGRAL DEL LIBRO POP-UP (6 PLIEGOS EDITORIALES)
// ══════════════════════════════════════════════════════════════
const BookController = {
  currentSpread: 0,
  totalSpreads: 6,
  isAnimating: false,
  spreads: [],

  init() {
    this.spreads = Array.from(document.querySelectorAll('.book-spread'));
    if (!this.spreads.length) return;

    this.bindEvents();
    this.initFirstSpreadAnimation();
    this.updateNavState(0);
  },

  bindEvents() {
    // 1. Botones con data-go-spread (Pasar página / Volver / Botones de acción)
    document.querySelectorAll('[data-go-spread]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = parseInt(btn.getAttribute('data-go-spread'), 10);
        if (!isNaN(target)) {
          this.goToSpread(target);
        }
      });
    });

    // 2. Enlaces de navegación principal (Desktop & Móvil)
    const navMapping = {
      '#': 0,
      '#hero': 0,
      '#fundacion': 1,
      '#que-hacemos': 2,
      '#proyectos': 3,
      '#puntos-donacion': 3,
      '#alianzas': 4,
      '#equipo': 4,
      '#colaborar': 5
    };

    document.querySelectorAll('.nav-links a, .nav-menu-mobile a, .nav-logo').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && navMapping[href] !== undefined) {
          e.preventDefault();
          this.goToSpread(navMapping[href]);

          // Si el menú móvil está abierto, cerrarlo
          if (typeof navMenuMobile !== 'undefined' && navMenuMobile.classList.contains('open')) {
            navMenuMobile.classList.remove('open');
            if (typeof navToggle !== 'undefined') navToggle.classList.remove('open');
            document.body.style.overflow = '';
          }
        }
      });
    });

    // 3. Navegación con teclado (Flechas Izquierda / Derecha)
    document.addEventListener('keydown', (e) => {
      // Ignorar si el usuario está escribiendo en el formulario o modal abierto
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      if (document.getElementById('activityModal')?.classList.contains('open')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (this.currentSpread < this.totalSpreads - 1) this.goToSpread(this.currentSpread + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (this.currentSpread > 0) this.goToSpread(this.currentSpread - 1);
      }
    });

    // 4. Efecto de inclinación 3D sutil con el cursor (Parallax en el libro)
    const stage = document.getElementById('bookStage');
    const container = document.getElementById('bookContainer');
    if (stage && container && window.innerWidth > 1024) {
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(container, {
          rotateY: x * 4,
          rotateX: -y * 4,
          duration: 0.8,
          ease: 'power1.out'
        });
      });

      stage.addEventListener('mouseleave', () => {
        gsap.to(container, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.out' });
      });
    }
  },

  goToSpread(targetIndex) {
    if (targetIndex === this.currentSpread || this.isAnimating) return;
    if (targetIndex < 0 || targetIndex >= this.totalSpreads) return;

    this.isAnimating = true;
    const currentEl = this.spreads[this.currentSpread];
    const targetEl = this.spreads[targetIndex];
    const goingForward = targetIndex > this.currentSpread;

    const isDesktop = window.innerWidth > 1024;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isDesktop && !isReduced && typeof gsap !== 'undefined') {
      // Transición física 3D de paso de página
      const tl = gsap.timeline({
        onComplete: () => {
          currentEl.classList.remove('active');
          targetEl.classList.add('active');
          this.currentSpread = targetIndex;
          this.updateNavState(targetIndex);
          this.isAnimating = false;

          // Si entramos al pliego 0, erguir a Gabriela Mistral
          if (targetIndex === 0) this.initFirstSpreadAnimation();
        }
      });

      // Efecto de levantamiento y giro de la hoja
      tl.to(currentEl, {
        opacity: 0,
        scale: 0.98,
        rotateY: goingForward ? -8 : 8,
        duration: 0.35,
        ease: 'power2.in'
      })
      .set(currentEl, { visibility: 'hidden' })
      .set(targetEl, {
        visibility: 'visible',
        opacity: 0,
        scale: 0.98,
        rotateY: goingForward ? 8 : -8
      })
      .to(targetEl, {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 0.45,
        ease: 'power2.out'
      });

    } else {
      // Cambio instantáneo limpio para móviles o movimiento reducido
      currentEl.classList.remove('active');
      targetEl.classList.add('active');
      this.currentSpread = targetIndex;
      this.updateNavState(targetIndex);
      this.isAnimating = false;

      // Scroll suave hacia la parte superior del libro en móvil
      const stage = document.getElementById('bookStage');
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  },

  initFirstSpreadAnimation() {
    if (typeof gsap === 'undefined') return;
    const figureLayer = document.querySelector('.popup-figure-layer');
    const quoteCard = document.querySelector('.popup-quote-card');
    const popupShadow = document.querySelector('.popup-shadow');

    if (!figureLayer) return;

    gsap.set(figureLayer, { rotateX: -65, z: 0, opacity: 0 });
    if (quoteCard) gsap.set(quoteCard, { rotateX: -30, z: 5, opacity: 0 });
    if (popupShadow) gsap.set(popupShadow, { scaleX: 0.4, opacity: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(figureLayer, { rotateX: 0, z: 35, opacity: 1, duration: 1.1, ease: 'back.out(1.4)', delay: 0.1 })
      .to(popupShadow, { scaleX: 1, opacity: 1, duration: 1.1 }, '<')
      .to(quoteCard, { rotateX: 0, z: 22, opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.6');
  },

  updateNavState(index) {
    // Sincronizar estilo activo en los enlaces del navbar
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));

    const spreadToHash = {
      0: '#hero',
      1: '#fundacion',
      2: '#que-hacemos',
      3: '#proyectos',
      4: '#alianzas',
      5: '#colaborar'
    };

    const targetHash = spreadToHash[index];
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


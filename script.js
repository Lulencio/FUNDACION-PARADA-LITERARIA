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


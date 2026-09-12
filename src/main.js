// ESSENSUALS BY TONI&GUY THAILAVARAM - INTERACTIVE APPLICATION LOGIC

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRecommender();
  initServicesTabs();
  initBookingModal();
  initGalleryLightbox();
  initSmoothScroll();
});

// 1. Header Scroll & Mobile Nav Toggle
function initNavigation() {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link, .mobile-nav .btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  function toggleMobileNav(open) {
    if (open) {
      mobileNav.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    toggleMobileNav(!isOpen);
  });

  backdrop?.addEventListener('click', () => toggleMobileNav(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });
}

// 2. Interactive Consultation & Hairstyle Recommender
function initRecommender() {
  const faceSelect = document.getElementById('recommend-face');
  const goalSelect = document.getElementById('recommend-goal');
  const serviceText = document.getElementById('rec-service-name');
  const stylistText = document.getElementById('rec-stylist-name');
  const recReason = document.getElementById('rec-reason');
  const recBookBtn = document.getElementById('rec-book-btn');

  const recommendations = {
    'oval-transformation': {
      service: 'Modern Precision Haircut & Styling',
      stylists: ['Arul', 'Subhan'],
      reason: 'Oval face shapes pair perfectly with layered modern cuts and textured pompadours. Arul and Subhan are frequently praised for personalized haircut recommendations.'
    },
    'oval-volume': {
      service: 'Luxury Hair Spa & Volume Conditioning',
      stylists: ['Vinitha', 'Abirami'],
      reason: 'Deep conditioning restores high shine and natural volume for versatile oval face framing.'
    },
    'oval-color': {
      service: 'Custom Balayage & Dimensional Colour',
      stylists: ['Taj', 'Waseem'],
      reason: 'Tailored hair colouring with personalized tone selection to complement skin tone.'
    },
    'oval-beard': {
      service: 'Beard Sculpting & Haircut Combo',
      stylists: ['Waseem', 'Arul'],
      reason: 'Precision razor edging to maintain natural facial contours and sharp neckline.'
    },
    'square-transformation': {
      service: 'Textured Crop / Soft Layered Haircut',
      stylists: ['Arul', 'Vinitha'],
      reason: 'Soft textured fringe and layered tops soften strong jawlines effortlessly.'
    },
    'square-beard': {
      service: 'Sharp Beard Shaping & Fade Grooming',
      stylists: ['Waseem', 'Subhan'],
      reason: 'Architectural beard contouring highlights cheek structure while defining the jawline.'
    },
    'round-transformation': {
      service: 'High-Volume Pompadour / Angular Cut',
      stylists: ['Subhan', 'Taj'],
      reason: 'Adding height on top creates an elongate silhouette for round facial profiles.'
    },
    'heart-transformation': {
      service: 'Chin-Length Layered Cut / Textured Style',
      stylists: ['Abirami', 'Arul'],
      reason: 'Balances forehead width with fuller textured mid-lengths.'
    }
  };

  function updateRecommendation() {
    if (!faceSelect || !goalSelect) return;
    const key = `${faceSelect.value}-${goalSelect.value}`;
    const match = recommendations[key] || {
      service: 'Personalised Hair & Styling Consultation',
      stylists: ['Arul', 'Waseem', 'Vinitha'],
      reason: 'Our expert stylists will assess your face shape, hair type, and desired look during your appointment.'
    };

    if (serviceText) serviceText.textContent = match.service;
    if (stylistText) stylistText.textContent = match.stylists.join(' or ');
    if (recReason) recReason.textContent = match.reason;

    if (recBookBtn) {
      recBookBtn.onclick = () => {
        openBookingModal(match.service, match.stylists[0]);
      };
    }
  }

  faceSelect?.addEventListener('change', updateRecommendation);
  goalSelect?.addEventListener('change', updateRecommendation);
}

// 3. Services Filtering
function initServicesTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. Booking Modal & Form Handling
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = modal?.querySelector('.modal-close');
  const triggers = document.querySelectorAll('[data-open-booking]');
  const form = document.getElementById('appointment-form');
  const confirmationView = document.getElementById('booking-confirmation');
  const dateInput = document.getElementById('book-date');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const service = trigger.getAttribute('data-service') || '';
      const stylist = trigger.getAttribute('data-stylist') || '';
      openBookingModal(service, stylist);
    });
  });

  closeBtn?.addEventListener('click', closeBookingModal);
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeBookingModal();
  });

  form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const service = document.getElementById('book-service')?.value;
  const stylist = document.getElementById('book-stylist')?.value;
  const date = document.getElementById('book-date')?.value;
  const selectedTime = document.getElementById('book-time')?.value;

const [timePart, modifier] = selectedTime.split(' ');
let [hours, minutes] = timePart.split(':').map(Number);

if (modifier === 'PM' && hours !== 12) {
  hours += 12;
}

if (modifier === 'AM' && hours === 12) {
  hours = 0;
}

const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  const name = document.getElementById('book-name')?.value;
  const phone = document.getElementById('book-phone')?.value;

  try {
    const response = await fetch('https://essensuals-thailavaram.onrender.com/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        phone,
        service,
        stylist,
        appointment_date: date,
        appointment_time: time
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to save appointment');
    }

    const refCode = 'EG-' + String(data.appointmentId).padStart(6, '0');

    const summaryText = document.getElementById('conf-summary');

    if (summaryText) {
      summaryText.innerHTML = `
        <strong>Ref #:</strong> ${refCode}<br>
        <strong>Client:</strong> ${name}<br>
        <strong>Phone:</strong> ${phone}<br>
        <strong>Service:</strong> ${service}<br>
        <strong>Stylist:</strong> ${stylist || 'First Available Specialist'}<br>
        <strong>Schedule:</strong> ${date} at ${time}
      `;
    }

    form.style.display = 'none';

    if (confirmationView) {
      confirmationView.style.display = 'block';
    }

  } catch (error) {
    console.error('Booking error:', error);

    alert(
      'Unable to save the appointment. Please make sure the backend server is running.'
    );
  }
});

  const resetBtn = document.getElementById('conf-reset-btn');
  resetBtn?.addEventListener('click', () => {
    form?.reset();
    if (form) form.style.display = 'block';
    if (confirmationView) confirmationView.style.display = 'none';
    closeBookingModal();
  });
}

function openBookingModal(service = '', stylist = '') {
  const modal = document.getElementById('booking-modal');
  const serviceSelect = document.getElementById('book-service');
  const stylistSelect = document.getElementById('book-stylist');

  if (serviceSelect && service) {
    for (let opt of serviceSelect.options) {
      if (opt.value.toLowerCase().includes(service.toLowerCase()) || service.toLowerCase().includes(opt.value.toLowerCase())) {
        opt.selected = true;
        break;
      }
    }
  }

  if (stylistSelect && stylist) {
    for (let opt of stylistSelect.options) {
      if (opt.value.toLowerCase().includes(stylist.toLowerCase())) {
        opt.selected = true;
        break;
      }
    }
  }

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// 5. Gallery Lightbox
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxImg && lightbox) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Salon Gallery';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightbox?.addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// 6. Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

window.openBookingModal = openBookingModal;

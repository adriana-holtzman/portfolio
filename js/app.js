// Navbar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    
    if (navbarToggle && navbarLinks) {
      navbarToggle.addEventListener('click', function() {
        navbarLinks.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const isClickInside = event.target.closest('.navbar');
        if (!isClickInside && navbarLinks.classList.contains('active')) {
          navbarLinks.classList.remove('active');
        }
      });
      
      // Close menu when a link is clicked
      const links = navbarLinks.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', function() {
          navbarLinks.classList.remove('active');
        });
      });
    }
  });

// Gallery lightbox: click a photo to view it large
document.addEventListener('DOMContentLoaded', function() {
  const photos = Array.from(document.querySelectorAll('#personal .column img'));
  if (!photos.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous photo">&#8592;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lightbox-next" aria-label="Next photo">&#8594;</button>';
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  let current = 0;
  let lastFocused = null;

  function show(index) {
    current = (index + photos.length) % photos.length;
    image.src = photos[current].src;
    image.alt = photos[current].alt;
    caption.textContent = photos[current].alt;
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  photos.forEach(function(photo, index) {
    photo.tabIndex = 0;
    photo.addEventListener('click', function() { open(index); });
    photo.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(index);
      }
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', function() { show(current - 1); });
  lightbox.querySelector('.lightbox-next').addEventListener('click', function() { show(current + 1); });

  // Clicking the dark backdrop closes it
  lightbox.addEventListener('click', function(event) {
    if (event.target === lightbox || event.target.tagName === 'FIGURE') close();
  });

  document.addEventListener('keydown', function(event) {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
});


// Scroll motion: sections fade up as they come into view
document.addEventListener('DOMContentLoaded', function() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.section h1, .section > p, .research_project, .column img, .project-media > *'
  );

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function(target) {
    // Gallery photos ripple in one after another
    if (target.matches('.column img')) {
      const column = Array.from(target.parentElement.parentElement.children).indexOf(target.parentElement);
      target.style.transitionDelay = (column * 80) + 'ms';
    }
    target.classList.add('reveal');
    observer.observe(target);
  });
});

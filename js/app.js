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

// Lightbox: click a photo or video to view it large.
// Gallery photos can be browsed with arrows; research and project media open on their own.
document.addEventListener('DOMContentLoaded', function() {
  const gallery = Array.from(document.querySelectorAll('#personal .column img'));
  const singles = Array.from(document.querySelectorAll('.research_project .photocolumn img, .research_project .photocolumn video'));
  if (!gallery.length && !singles.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous photo">&#8592;</button>' +
    '<figure><img alt=""><video muted loop playsinline></video><figcaption></figcaption></figure>' +
    '<button class="lightbox-next" aria-label="Next photo">&#8594;</button>';
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('img');
  const video = lightbox.querySelector('video');
  const caption = lightbox.querySelector('figcaption');
  let items = [];
  let current = 0;
  let lastFocused = null;

  function show(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const isVideo = item.tagName === 'VIDEO';
    const label = item.alt || item.getAttribute('aria-label') || '';

    image.hidden = isVideo;
    video.hidden = !isVideo;
    if (isVideo) {
      video.src = item.currentSrc || item.querySelector('source').src;
      video.setAttribute('aria-label', label);
      video.play();
    } else {
      video.pause();
      video.removeAttribute('src');
      image.src = item.src;
      image.alt = label;
    }
    caption.textContent = label;
  }

  function open(group, index) {
    lastFocused = document.activeElement;
    items = group;
    lightbox.classList.toggle('single', items.length === 1);
    show(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function close() {
    lightbox.classList.remove('open');
    video.pause();
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function makeOpenable(element, group, index) {
    element.tabIndex = 0;
    element.addEventListener('click', function() { open(group, index); });
    element.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(group, index);
      }
    });
  }

  gallery.forEach(function(photo, index) { makeOpenable(photo, gallery, index); });
  singles.forEach(function(media) { makeOpenable(media, [media], 0); });

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
    if (items.length > 1 && event.key === 'ArrowLeft') show(current - 1);
    if (items.length > 1 && event.key === 'ArrowRight') show(current + 1);
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


// Topic filter: show only research and projects with the chosen topic
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.topic-filter button');
  if (!buttons.length) return;

  const entries = document.querySelectorAll('.research_project[data-topics]');

  function applyFilter(topic) {
    buttons.forEach(function(button) {
      const active = button.dataset.topic === topic;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active);
    });

    entries.forEach(function(entry) {
      const match = topic === 'all' || entry.dataset.topics.split(',').includes(topic);
      const wasHidden = entry.hidden;
      entry.hidden = !match;
      // Fade back in, unless scroll motion hasn't revealed it yet
      if (match && wasHidden && !entry.matches('.reveal:not(.visible)')) {
        entry.classList.remove('filter-in');
        void entry.offsetWidth;
        entry.classList.add('filter-in');
      }
    });

    // Explain empty sections instead of leaving a bare heading
    document.querySelectorAll('.topic-empty').forEach(function(note) {
      note.hidden = !!note.parentElement.querySelector('.research_project:not([hidden])');
    });

    // Keep the topic in the URL so a filtered view can be shared
    const url = new URL(window.location);
    if (topic === 'all') url.searchParams.delete('topic');
    else url.searchParams.set('topic', topic);
    history.replaceState(null, '', url);
  }

  buttons.forEach(function(button) {
    button.addEventListener('click', function() { applyFilter(button.dataset.topic); });
  });

  // The small topic chips on each card filter too
  document.querySelectorAll('.topic-chips button').forEach(function(chip) {
    chip.addEventListener('click', function() { applyFilter(chip.dataset.topic); });
  });

  const fromUrl = new URLSearchParams(window.location.search).get('topic');
  const known = Array.from(buttons).some(function(b) { return b.dataset.topic === fromUrl; });
  if (fromUrl && known) applyFilter(fromUrl);
});


// Apple bites: each click swaps the cursor from whole apple, to slice, to core, and back
document.addEventListener('DOMContentLoaded', function() {
  const stages = ['', 'bite-1', 'bite-2'];
  let stage = 0;

  document.addEventListener('pointerdown', function(event) {
    if (event.pointerType !== 'mouse') return;
    if (stages[stage]) document.documentElement.classList.remove(stages[stage]);
    stage = (stage + 1) % stages.length;
    if (stages[stage]) document.documentElement.classList.add(stages[stage]);
  });
});

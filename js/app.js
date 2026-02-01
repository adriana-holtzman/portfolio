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
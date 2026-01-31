# Script to update all blog post navbars
$navbarHTML = @'
    <!-- Navigation -->
    <nav class="navbar">
      <div class="container nav-container">
        <a href="../" class="logo">
          <img src="../logo-light.png" alt="Bytesync Logo" class="logo-image" id="logoImage" width="414" height="413" />
          <span class="logo-text">Bytesync</span>
        </a>
        <ul class="nav-menu">
          <li><a href="../#home" class="nav-link">Home</a></li>
          <li><a href="../#services" class="nav-link">Services</a></li>
          <li><a href="../#about" class="nav-link">About</a></li>
          <li><a href="../#portfolio" class="nav-link">Portfolio</a></li>
          <li><a href="../#testimonials" class="nav-link">Testimonials</a></li>
          <li><a href="./" class="nav-link active">Blog</a></li>
          <li><a href="../#contact" class="nav-link">Contact</a></li>
        </ul>
        <div class="nav-actions">
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
            <svg class="sun-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="2" />
              <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.657 4.343L14.243 5.757M5.757 14.243L4.343 15.657M15.657 15.657L14.243 14.243M5.757 5.757L4.343 4.343" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg class="moon-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <button class="mobile-toggle" id="mobileToggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
'@

$themeScript = @'
    <!-- Mobile Menu Script -->
    <script>
      // Mobile Menu Toggle
      const mobileToggle = document.getElementById('mobileToggle');
      const navMenu = document.querySelector('.nav-menu');
      
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      // Theme Toggle
      const themeToggle = document.getElementById('themeToggle');
      const body = document.body;
      const logoImage = document.getElementById('logoImage');

      // Check for saved theme preference or default to dark mode
      const currentTheme = localStorage.getItem('theme') || 'dark';
      if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (logoImage) logoImage.src = '../logo-dark.png';
      }

      // Theme toggle handler
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          body.classList.toggle('light-mode');
          const isLightMode = body.classList.contains('light-mode');
          
          // Update logo
          if (logoImage) {
            logoImage.src = isLightMode ? '../logo-dark.png' : '../logo-light.png';
          }
          
          // Save preference
          localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        });
      }
    </script>
'@

Write-Host "Navbar HTML and Theme Script prepared for manual replacement"

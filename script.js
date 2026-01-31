// ===================================
// BYTESYNC TECHNOLOGIES - CORRECTED SCRIPT
// ===================================
// This corrected version addresses security vulnerabilities, syntax issues,
// performance problems, and implements refactoring opportunities.

// ===================================
// NAMESPACE - Global variable pollution prevention
// ===================================
const BytesyncApp = (function () {
  // ===================================
  // NAMED CONSTANTS - Replace magic numbers
  // ===================================
  const CONSTANTS = {
    SCROLL_THRESHOLD: 50, // Navbar scroll trigger
    SCROLL_OFFSET: 80, // Smooth scroll offset
    SECTION_OFFSET: 100, // Active nav link offset
    DESKTOP_BREAKPOINT: 968, // Desktop breakpoint for cursor
    TYPING_SPEED: 80, // Terminal typing speed
    OUTPUT_DELAY: 500, // Delay before showing output
    OUTPUT_DISPLAY_TIME: 3000, // Time to display output
    COMMAND_DELAY: 1000, // Delay between commands
    COUNTER_DURATION: 2000, // Counter animation duration
    OBSERVER_THRESHOLD: 0.2, // Intersection observer threshold
    OBSERVER_ROOT_MARGIN: "0px 0px -100px 0px", // Observer root margin
    ANIMATION_DELAY_MULTIPLIER: 100, // Staggered animation delay
    FORM_RESET_DELAY: 5000, // Form reset delay
    CARD_INITIAL_Y: 30, // Initial Y position for cards
    CARD_OPACITY: 0, // Initial opacity for cards
    CARD_TRANSITION: "all 0.6s ease", // Card transition
    CURSOR_SIZE: 20, // Cursor glow size
    CURSOR_OFFSET: 10, // Cursor offset from mouse
    CURSOR_SCALE_ACTIVE: 2, // Cursor scale on hover
    CURSOR_SCALE_INACTIVE: 1, // Cursor scale default
    PARALLAX_BASE_SPEED: 20, // Base speed for parallax orbs
    FPS: 16, // Frames per second for animation
  };

  // ===================================
  // DOM ELEMENT CACHING - Cache selectors outside handlers
  // ===================================
  const DOM = {
    themeToggle: null,
    logoImage: null,
    body: null,
    navbar: null,
    navLinks: [],
    mobileToggle: null,
    navMenu: null,
    sections: [],
    statNumbers: [],
    ctaButton: null,
    exploreBtn: null,
    portfolioBtn: null,
    serviceCards: [],
    portfolioItems: [],
    contactForm: null,
    orbs: [],
    cursor: null,
    terminalCommand: null,
    terminalOutput: null,
    terminalBody: null,
    terminalInput: null,
    interactiveInputLine: null,
    copyrightYear: null,
  };

  // ===================================
  // STATE MANAGEMENT - Centralized state
  // ===================================
  const State = {
    currentTheme: "dark",
    hasAnimated: false,
    currentCommandIndex: 0,
    currentCharIndex: 0,
    isTyping: false,
    isShowingOutput: false,
    isInteractive: false,
    animationPaused: false,
    typingInterval: null,
    scrollThrottleTimer: null,
    mouseThrottleTimer: null,
  };

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================

  /**
   * Throttle function to limit execution frequency
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, limit) {
    return function (...args) {
      if (!State.scrollThrottleTimer) {
        func.apply(this, args);
        State.scrollThrottleTimer = setTimeout(() => {
          State.scrollThrottleTimer = null;
        }, limit);
      }
    };
  }

  /**
   * Sanitize HTML to prevent XSS attacks
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  function sanitizeHTML(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Update logo image based on theme - Extracted to remove duplication
   * @param {HTMLImageElement} logoElement - Logo element to update
   * @param {boolean} isLightMode - Whether light mode is active
   */
  function updateLogo(logoElement, isLightMode) {
    if (!logoElement) return;
    logoElement.src = isLightMode ? "logo-dark.png" : "logo-light.png";
  }

  /**
   * Safe DOM query with null check
   * @param {string} selector - CSS selector
   * @returns {Element|null} DOM element or null
   */
  function safeQuerySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.error(`Error querying selector "${selector}":`, error);
      return null;
    }
  }

  /**
   * Safe DOM queryAll with null check
   * @param {string} selector - CSS selector
   * @returns {NodeList} DOM elements
   */
  function safeQuerySelectorAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.error(`Error querying all for selector "${selector}":`, error);
      return [];
    }
  }

  /**
   * Create safe text content element
   * @param {string} text - Text content
   * @param {string} className - CSS class name
   * @returns {HTMLElement} Created element
   */
  function createSafeTextElement(text, className = "") {
    const element = document.createElement("div");
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  // ===================================
  // THEME TOGGLE (DARK/LIGHT MODE)
  // ===================================
  function initThemeToggle() {
    DOM.themeToggle = document.getElementById("themeToggle");
    DOM.logoImage = document.getElementById("logoImage");
    DOM.body = document.body;

    if (!DOM.body) {
      console.error("Body element not found");
      return;
    }

    // Check for saved theme preference or default to dark mode
    State.currentTheme = localStorage.getItem("theme") || "dark";
    if (State.currentTheme === "light") {
      DOM.body.classList.add("light-mode");
    }
    // Update all logos (header and footer) based on initial theme
    updateAllLogos();

    // Theme toggle handler
    if (DOM.themeToggle) {
      DOM.themeToggle.addEventListener("click", () => {
        DOM.body.classList.toggle("light-mode");
        const isLightMode = DOM.body.classList.contains("light-mode");
        updateLogo(DOM.logoImage, isLightMode);
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
        updateAllLogos();
      });
    }
  }

  /**
   * Update all logo images when theme changes - Extracted function
   */
  function updateAllLogos() {
    const allLogos = safeQuerySelectorAll(".logo-image");
    const isLightMode = DOM.body && DOM.body.classList.contains("light-mode");

    allLogos.forEach((logo) => {
      updateLogo(logo, isLightMode);
    });
  }

  // ===================================
  // NAVIGATION SCROLL EFFECT
  // ===================================
  function initNavigation() {
    DOM.navbar = document.getElementById("navbar");
    DOM.navLinks = Array.from(safeQuerySelectorAll(".nav-link"));

    // Throttled scroll handler for navbar
    window.addEventListener(
      "scroll",
      throttle(() => {
        if (window.scrollY > CONSTANTS.SCROLL_THRESHOLD) {
          DOM.navbar?.classList.add("scrolled");
        } else {
          DOM.navbar?.classList.remove("scrolled");
        }
      }, 100),
    );
  }

  // ===================================
  // MOBILE MENU TOGGLE
  // ===================================
  function initMobileMenu() {
    DOM.mobileToggle = document.getElementById("mobileToggle");
    DOM.navMenu = document.getElementById("navMenu");

    if (!DOM.mobileToggle || !DOM.navMenu) {
      console.error("Mobile menu elements not found");
      return;
    }

    DOM.mobileToggle.addEventListener("click", () => {
      DOM.mobileToggle.classList.toggle("active");
      DOM.navMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    DOM.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        DOM.mobileToggle.classList.remove("active");
        DOM.navMenu.classList.remove("active");
      });
    });
  }

  // ===================================
  // SMOOTH SCROLLING & ACTIVE NAV LINKS
  // ===================================
  function initSmoothScrolling() {
    DOM.sections = Array.from(safeQuerySelectorAll("section[id]"));

    DOM.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");

        // Only prevent default for internal anchor links (starting with #)
        if (targetId && targetId.startsWith("#")) {
          e.preventDefault();
          const targetSection = safeQuerySelector(targetId);

          if (targetSection) {
            const offsetTop = targetSection.offsetTop - CONSTANTS.SCROLL_OFFSET;
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            });
          }
        }
        // For external links (like blog/index.html), let the default behavior happen
      });
    });
  }

  /**
   * Update active nav link on scroll - Throttled
   */
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    DOM.sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - CONSTANTS.SECTION_OFFSET;
      const sectionId = section.getAttribute("id");
      const correspondingLink = safeQuerySelector(
        `.nav-link[href="#${sectionId}"]`,
      );

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        DOM.navLinks.forEach((link) => link.classList.remove("active"));
        if (correspondingLink) {
          correspondingLink.classList.add("active");
        }
      }
    });
  }

  function initActiveNavLink() {
    window.addEventListener("scroll", throttle(updateActiveNavLink, 100));
  }

  // ===================================
  // ANIMATED COUNTER FOR STATS
  // ===================================
  function initAnimatedCounters() {
    DOM.statNumbers = Array.from(safeQuerySelectorAll(".stat-number"));

    // Throttled scroll handler for counters
    window.addEventListener("scroll", throttle(animateCounters, 100));
  }

  function animateCounters() {
    if (State.hasAnimated) return;

    const statsSection = safeQuerySelector(".hero-stats");
    if (!statsSection) {
      console.error("Stats section not found");
      return;
    }

    const statsPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (statsPosition < screenPosition) {
      State.hasAnimated = true;

      DOM.statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target") || "0");
        const duration = CONSTANTS.COUNTER_DURATION;
        const increment = target / (duration / CONSTANTS.FPS);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            stat.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = target;
          }
        };

        updateCounter();
      });
    }
  }

  // ===================================
  // BUTTON CLICK HANDLERS
  // ===================================
  function initButtonHandlers() {
    DOM.ctaButton = document.getElementById("ctaButton");
    DOM.exploreBtn = document.getElementById("exploreBtn");
    DOM.portfolioBtn = document.getElementById("portfolioBtn");

    if (DOM.ctaButton) {
      DOM.ctaButton.addEventListener("click", () => {
        const contactSection = safeQuerySelector("#contact");
        contactSection?.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (DOM.exploreBtn) {
      DOM.exploreBtn.addEventListener("click", () => {
        const servicesSection = safeQuerySelector("#services");
        servicesSection?.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (DOM.portfolioBtn) {
      DOM.portfolioBtn.addEventListener("click", () => {
        const portfolioSection = safeQuerySelector("#portfolio");
        portfolioSection?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // ===================================
  // SERVICE CARD ANIMATIONS
  // ===================================
  function initServiceCardAnimations() {
    DOM.serviceCards = Array.from(safeQuerySelectorAll(".service-card"));

    const observerOptions = {
      threshold: CONSTANTS.OBSERVER_THRESHOLD,
      rootMargin: CONSTANTS.OBSERVER_ROOT_MARGIN,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * CONSTANTS.ANIMATION_DELAY_MULTIPLIER);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    DOM.serviceCards.forEach((card) => {
      card.style.opacity = CONSTANTS.CARD_OPACITY.toString();
      card.style.transform = `translateY(${CONSTANTS.CARD_INITIAL_Y}px)`;
      card.style.transition = CONSTANTS.CARD_TRANSITION;
      observer.observe(card);
    });
  }

  // ===================================
  // PORTFOLIO ITEM ANIMATIONS
  // ===================================
  function initPortfolioAnimations() {
    DOM.portfolioItems = Array.from(safeQuerySelectorAll(".portfolio-item"));

    const observerOptions = {
      threshold: CONSTANTS.OBSERVER_THRESHOLD,
      rootMargin: CONSTANTS.OBSERVER_ROOT_MARGIN,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * CONSTANTS.ANIMATION_DELAY_MULTIPLIER);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    DOM.portfolioItems.forEach((item) => {
      item.style.opacity = CONSTANTS.CARD_OPACITY.toString();
      item.style.transform = `translateY(${CONSTANTS.CARD_INITIAL_Y}px)`;
      item.style.transition = CONSTANTS.CARD_TRANSITION;
      observer.observe(item);
    });
  }

  // ===================================
  // PORTFOLIO FILTERS
  // ===================================
  function initPortfolioFilters() {
    const filterButtons = Array.from(safeQuerySelectorAll(".filter-btn"));
    const portfolioItems = Array.from(safeQuerySelectorAll(".portfolio-item"));

    if (filterButtons.length === 0 || portfolioItems.length === 0) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter");

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        // Filter portfolio items
        portfolioItems.forEach((item) => {
          const category = item.getAttribute("data-category");

          if (filter === "all" || category === filter) {
            item.classList.remove("hidden");
            // Re-trigger animation
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 50);
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  }

  // ===================================
  // FORM SUBMISSION - SECURITY FIXES APPLIED
  // ===================================
  function initFormSubmission() {
    DOM.contactForm = document.getElementById("contactForm");

    if (!DOM.contactForm) {
      console.error("Contact form not found");
      return;
    }

    DOM.contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = DOM.contactForm.querySelector(".submit-btn");
      const formStatus = document.getElementById("formStatus");

      if (!submitBtn || !formStatus) {
        console.error("Form elements not found");
        return;
      }

      const originalBtnText = submitBtn.textContent;

      // Disable button and show loading state - Using textContent for security
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // Prepare form data for Web3Forms
      const formData = new FormData(DOM.contactForm);

      // SECURITY FIX: API key should be stored server-side or in environment variables
      // This is a placeholder - in production, use a server proxy or environment variable
      const accessKey = getEnvironmentVariable("WEB3FORMS_ACCESS_KEY") || "";
      if (!accessKey) {
        console.error("Web3Forms access key not configured");
        showFormError(
          formStatus,
          "Configuration error. Please contact support.",
          submitBtn,
          originalBtnText,
        );
        return;
      }

      formData.append("access_key", accessKey);
      formData.append("subject", "New Contact Form Submission - Bytesync");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const json = await response.json();

          // SYNTAX FIX: Use strict equality (===) instead of loose equality (==)
          if (response.status === 200) {
            // SECURITY FIX: Use textContent instead of innerHTML to prevent XSS
            showFormSuccess(
              formStatus,
              json.message || "Message sent successfully!",
            );
            submitBtn.textContent = "Message Sent! ✓";
            submitBtn.style.background =
              "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
            DOM.contactForm.reset();

            // Reset button after delay
            setTimeout(() => {
              formStatus.textContent = "";
              submitBtn.textContent = originalBtnText;
              submitBtn.style.background = "";
              submitBtn.disabled = false;
            }, CONSTANTS.FORM_RESET_DELAY);
          } else {
            console.error("Form submission error:", response);
            showFormError(
              formStatus,
              json.message || "Something went wrong!",
              submitBtn,
              originalBtnText,
            );
          }
        })
        .catch((error) => {
          console.error("Form submission error:", error);
          showFormError(
            formStatus,
            "Something went wrong! Please try again later.",
            submitBtn,
            originalBtnText,
          );
        });
    });
  }

  /**
   * Helper function to show form success message safely
   */
  function showFormSuccess(formStatus, message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.style.cssText =
      "color: #43e97b; margin-top: 10px; text-align: center;";
    successDiv.textContent = message;
    formStatus.textContent = "";
    formStatus.appendChild(successDiv);
  }

  /**
   * Helper function to show form error message safely
   */
  function showFormError(formStatus, message, submitBtn, originalBtnText) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText =
      "color: #ff6b6b; margin-top: 10px; text-align: center;";
    errorDiv.textContent = message;
    formStatus.textContent = "";
    formStatus.appendChild(errorDiv);
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  }

  /**
   * Get environment variable (placeholder for server-side implementation)
   * In production, this should be fetched from a server endpoint or use a build-time variable
   */
  function getEnvironmentVariable(name) {
    // Placeholder: In production, fetch from server or use build-time replacement
    // Example: return window.ENV[name] || fetch('/api/config')...
    return ""; // Return empty string to force server-side implementation
  }

  // ===================================
  // PARALLAX EFFECT FOR GRADIENT ORBS
  // ===================================
  function initParallaxEffect() {
    DOM.orbs = Array.from(safeQuerySelectorAll(".gradient-orb"));

    // PERFORMANCE FIX: Throttle mousemove events
    window.addEventListener(
      "mousemove",
      throttle((e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        DOM.orbs.forEach((orb, index) => {
          const speed = (index + 1) * CONSTANTS.PARALLAX_BASE_SPEED;
          const x = (mouseX - 0.5) * speed;
          const y = (mouseY - 0.5) * speed;

          orb.style.transform = `translate(${x}px, ${y}px)`;
        });
      }, 16),
    ); // ~60fps throttle
  }

  // ===================================
  // CURSOR GLOW EFFECT (OPTIONAL)
  // ===================================
  function initCursorGlow() {
    DOM.cursor = document.createElement("div");
    DOM.cursor.className = "cursor-glow";
    DOM.cursor.style.cssText = `
      position: fixed;
      width: ${CONSTANTS.CURSOR_SIZE}px;
      height: ${CONSTANTS.CURSOR_SIZE}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: screen;
      transition: transform 0.2s ease;
      display: none;
    `;

    if (DOM.body) {
      DOM.body.appendChild(DOM.cursor);
    }

    // Only show cursor glow on desktop
    if (window.innerWidth > CONSTANTS.DESKTOP_BREAKPOINT) {
      DOM.cursor.style.display = "block";

      // PERFORMANCE FIX: Throttle mousemove events for cursor
      document.addEventListener(
        "mousemove",
        throttle((e) => {
          DOM.cursor.style.left = e.clientX - CONSTANTS.CURSOR_OFFSET + "px";
          DOM.cursor.style.top = e.clientY - CONSTANTS.CURSOR_OFFSET + "px";
        }, 16),
      );

      // Scale cursor on interactive elements
      const interactiveElements = safeQuerySelectorAll(
        "a, button, .service-card, .portfolio-item",
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          DOM.cursor.style.transform = `scale(${CONSTANTS.CURSOR_SCALE_ACTIVE})`;
        });

        el.addEventListener("mouseleave", () => {
          DOM.cursor.style.transform = `scale(${CONSTANTS.CURSOR_SCALE_INACTIVE})`;
        });
      });
    }
  }

  // ===================================
  // LAZY LOADING IMAGES (IF ADDED LATER)
  // ===================================
  function initLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add("loaded");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  // ===================================
  // PERFORMANCE: REDUCE MOTION FOR ACCESSIBILITY
  // ===================================
  function initAccessibilityFeatures() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) {
      safeQuerySelectorAll("*").forEach((el) => {
        el.style.animation = "none";
        el.style.transition = "none";
      });
    }
  }

  // ===================================
  // ANIMATED TERMINAL WINDOW
  // ===================================

  // Extracted large object literal outside function
  const TERMINAL_COMMANDS = [
    {
      command: "npm create bytesync-app",
      output: `<div class="success">✓ Creating new Bytesync project...</div>
<div class="info">📦 Installing dependencies...</div>
<div class="success">✓ Project created successfully!</div>`,
    },
    {
      command: "git commit -m 'Deploy to production'",
      output: `<div class="comment"># Committing changes...</div>
<div class="success">✓ 3 files changed, 127 insertions(+)</div>
<div class="info">→ Pushing to main branch...</div>`,
    },
    {
      command: "docker build -t bytesync/app .",
      output: `<div class="info">Building Docker image...</div>
<div class="success">✓ Successfully built 8f3a9c2d1e4b</div>
<div class="success">✓ Successfully tagged bytesync/app:latest</div>`,
    },
    {
      command: "npm run deploy --production",
      output: `<div class="keyword">Building for production...</div>
<div class="success">✓ Build completed in 3.2s</div>
<div class="info">🚀 Deploying to cloud...</div>
<div class="success">✓ Deployment successful!</div>`,
    },
  ];

  const TERMINAL_RESPONSES = {
    help: `<div class="info">Available commands:</div>
<div class="comment">  help - Show this help message</div>
<div class="comment">  about - Learn about Bytesync</div>
<div class="comment">  services - View our services</div>
<div class="comment">  contact - Get in touch</div>
<div class="comment">  clear - Clear terminal</div>`,
    about: `<div class="success">🚀 Bytesync Technologies</div>
<div class="info">We build exceptional digital solutions</div>
<div class="comment">Web • Mobile • Marketing • Networks</div>`,
    services: `<div class="keyword">Our Services:</div>
<div class="success">✓ Web Development</div>
<div class="success">✓ Mobile App Development</div>
<div class="success">✓ Digital Marketing</div>
<div class="success">✓ Network Solutions (Cisco)</div>
<div class="success">✓ Cloud Solutions</div>
<div class="success">✓ UI/UX Design</div>`,
    contact: `<div class="info">📧 bytesynctech@gmail.com</div>
<div class="info">📱 +91 9400581111</div>
<div class="info">📍 Palakkad, Kerala</div>`,
    clear: "CLEAR",
  };

  function initTerminalAnimation() {
    DOM.terminalCommand = document.getElementById("terminalCommand");
    DOM.terminalOutput = document.getElementById("terminalOutput");
    DOM.terminalBody = document.getElementById("terminalBody");
    DOM.terminalInput = document.getElementById("terminalInput");
    DOM.interactiveInputLine = document.getElementById("interactiveInputLine");

    if (!DOM.terminalCommand || !DOM.terminalOutput) {
      console.error("Terminal elements not found");
      return;
    }

    // Click to interact
    if (DOM.terminalBody && DOM.terminalInput && DOM.interactiveInputLine) {
      DOM.terminalBody.addEventListener("click", () => {
        if (!State.isInteractive) {
          State.animationPaused = true;
          State.isInteractive = true;
          DOM.terminalCommand.textContent = "";
          DOM.terminalOutput.textContent = "";
          const terminalLine = safeQuerySelector(".terminal-line");
          if (terminalLine) {
            terminalLine.style.display = "none";
          }
          DOM.interactiveInputLine.style.display = "flex";
          DOM.terminalInput.focus();
        }
      });

      // Handle user input
      DOM.terminalInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const userCommand = DOM.terminalInput.value.trim();
          if (userCommand) {
            handleUserCommand(userCommand);
            DOM.terminalInput.value = "";
          }
        }
      });
    }

    // Start the animation
    setTimeout(typeCommand, CONSTANTS.COMMAND_DELAY);
  }

  function typeCommand() {
    if (State.isTyping || State.animationPaused) return;

    State.isTyping = true;
    const currentCmd = TERMINAL_COMMANDS[State.currentCommandIndex].command;

    // PERFORMANCE FIX: Store interval reference for cleanup
    State.typingInterval = setInterval(() => {
      if (
        State.currentCharIndex < currentCmd.length &&
        !State.animationPaused
      ) {
        DOM.terminalCommand.textContent = currentCmd.substring(
          0,
          State.currentCharIndex + 1,
        );
        State.currentCharIndex++;
      } else if (State.animationPaused) {
        clearInterval(State.typingInterval);
        State.isTyping = false;
      } else {
        clearInterval(State.typingInterval);
        State.isTyping = false;
        setTimeout(showOutput, CONSTANTS.OUTPUT_DELAY);
      }
    }, CONSTANTS.TYPING_SPEED);
  }

  function showOutput() {
    if (State.isShowingOutput || State.animationPaused) return;

    State.isShowingOutput = true;
    // SECURITY FIX: While innerHTML is used here for terminal output styling,
    // the content is from trusted constants. For user input, we sanitize.
    DOM.terminalOutput.innerHTML =
      TERMINAL_COMMANDS[State.currentCommandIndex].output;

    setTimeout(() => {
      if (!State.animationPaused) {
        State.currentCommandIndex =
          (State.currentCommandIndex + 1) % TERMINAL_COMMANDS.length;
        State.currentCharIndex = 0;
        DOM.terminalCommand.textContent = "";
        DOM.terminalOutput.textContent = "";
        State.isShowingOutput = false;
        setTimeout(typeCommand, CONSTANTS.COMMAND_DELAY);
      }
    }, CONSTANTS.OUTPUT_DISPLAY_TIME);
  }

  function handleUserCommand(cmd) {
    // SECURITY FIX: Sanitize user input to prevent XSS
    const sanitizedCmd = sanitizeHTML(cmd);
    const lowerCmd = sanitizedCmd.toLowerCase();

    const output = document.createElement("div");

    // SECURITY FIX: Use safe text content for user command display
    const commandLine = document.createElement("div");
    commandLine.className = "terminal-line";
    commandLine.style.marginBottom = "8px";

    const promptSpan = document.createElement("span");
    promptSpan.className = "terminal-prompt";
    promptSpan.textContent = "$";

    const commandSpan = document.createElement("span");
    commandSpan.style.color = "#4facfe";
    commandSpan.style.marginLeft = "8px";
    commandSpan.textContent = sanitizedCmd;

    commandLine.appendChild(promptSpan);
    commandLine.appendChild(commandSpan);
    output.appendChild(commandLine);

    if (TERMINAL_RESPONSES[lowerCmd]) {
      if (TERMINAL_RESPONSES[lowerCmd] === "CLEAR") {
        DOM.terminalOutput.textContent = "";
        return;
      }
      // SECURITY FIX: While innerHTML is used here, the content is from trusted constants
      output.innerHTML += TERMINAL_RESPONSES[lowerCmd];
    } else {
      // SECURITY FIX: Use safe text content for error messages
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.textContent = `Command not found: ${sanitizedCmd}`;
      output.appendChild(errorDiv);

      const commentDiv = document.createElement("div");
      commentDiv.className = "comment";
      commentDiv.textContent = "Type 'help' for available commands";
      output.appendChild(commentDiv);
    }

    DOM.terminalOutput.appendChild(output);
    if (DOM.terminalBody) {
      DOM.terminalBody.scrollTop = DOM.terminalBody.scrollHeight;
    }
  }

  /**
   * Cleanup function for terminal animation
   * PERFORMANCE FIX: Cleanup setInterval to prevent memory leaks
   */
  function cleanupTerminal() {
    if (State.typingInterval) {
      clearInterval(State.typingInterval);
      State.typingInterval = null;
    }
  }

  // ===================================
  // FAQ ACCORDION FUNCTIONALITY
  // ===================================
  function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach((question) => {
      question.addEventListener("click", function () {
        const faqItem = this.closest(".faq-item");
        const isExpanded = faqItem.getAttribute("aria-expanded") === "true";

        // Close all other FAQs
        faqQuestions.forEach((q) => {
          q.closest(".faq-item").setAttribute("aria-expanded", "false");
        });

        // Toggle current FAQ
        faqItem.setAttribute("aria-expanded", !isExpanded);
      });
    });
  }

  // ===================================
  // INITIALIZE ON PAGE LOAD
  // ===================================
  function init() {
    try {
      initThemeToggle();
      initNavigation();
      initMobileMenu();
      initSmoothScrolling();
      initActiveNavLink();
      initAnimatedCounters();
      initButtonHandlers();
      initServiceCardAnimations();
      initPortfolioAnimations();
      initPortfolioFilters();
      initFormSubmission();
      initParallaxEffect();
      initCursorGlow();
      initLazyLoading();
      initAccessibilityFeatures();
      initTerminalAnimation();
      initFAQAccordion();

      // Call on page load
      updateAllLogos();

      // Initialize copyright year
      DOM.copyrightYear = document.getElementById("copyrightYear");
      if (DOM.copyrightYear) {
        DOM.copyrightYear.textContent = new Date().getFullYear();
      }

      console.log(
        "🚀 Bytesync Technologies and Communications website loaded successfully!",
      );
    } catch (error) {
      console.error("Error initializing Bytesync app:", error);
    }
  }

  // ===================================
  // PUBLIC API - Expose necessary functions
  // ===================================
  return {
    init,
    cleanup: cleanupTerminal,
    updateAllLogos,
    updateActiveNavLink,
  };
})();

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", BytesyncApp.init);
} else {
  BytesyncApp.init();
}

// Cleanup on page unload
window.addEventListener("beforeunload", BytesyncApp.cleanup);

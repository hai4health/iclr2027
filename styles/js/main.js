// Main JavaScript

(function() {
  "use strict";

  const themeStorageKey = 'hcai4health-theme';
  const themeChoices = ['light', 'dark'];

  const getThemeChoice = () => {
    const storedTheme = localStorage.getItem(themeStorageKey);
    return themeChoices.includes(storedTheme) ? storedTheme : 'dark';
  };

  const resolveTheme = (choice) => {
    return themeChoices.includes(choice) ? choice : 'dark';
  };

  const applyTheme = (choice) => {
    const root = document.documentElement;
    const theme = resolveTheme(choice);
    root.dataset.theme = theme;
    root.dataset.themeChoice = choice;
    root.style.colorScheme = theme;

    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      const isActive = button.dataset.themeOption === choice;
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  const initThemeSwitcher = () => {
    let currentChoice = getThemeChoice();
    applyTheme(currentChoice);

    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.addEventListener('click', () => {
        currentChoice = button.dataset.themeOption;
        localStorage.setItem(themeStorageKey, currentChoice);
        applyTheme(currentChoice);
      });
    });
  };

  window.addEventListener('DOMContentLoaded', initThemeSwitcher);

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header');
    let offset = header.offsetHeight;
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  };

  /**
   * Toggle .scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 40) {
        selectHeader.classList.add('scrolled');
      } else {
        selectHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();
      let navbar = select('#navbar');
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Fade-in animation for .fade-in elements
   */
  const fadeElements = select('.fade-in', true);
  const handleFadeIn = () => {
    const triggerBottom = window.innerHeight * 0.85;
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < triggerBottom) {
        element.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', handleFadeIn);
  window.addEventListener('load', handleFadeIn);

})();

// Bento box topic hover image swap
const bentoTopics = document.querySelectorAll('.bento-topic');
const bentoImageTag = document.getElementById('bentoImageTag');
bentoTopics.forEach(topic => {
  topic.addEventListener('mouseenter', function() {
    bentoTopics.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const imgSrc = this.getAttribute('data-img');
    if (bentoImageTag && imgSrc) {
      bentoImageTag.src = imgSrc;
    }
  });
});

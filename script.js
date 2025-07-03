document.addEventListener("DOMContentLoaded", function () {
  const throttle = (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const initParticles = () => {
    try {
      if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#64ffda",
            },
            shape: {
              type: "circle",
              stroke: {
                width: 0,
                color: "#000000",
              },
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false,
              },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#3498db",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "grab",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1,
                },
              },
              push: {
                particles_nb: 4,
              },
            },
          },
          retina_detect: true,
        });
      } else {
        console.warn("Particles.js library not loaded");
      }
    } catch (error) {
      console.error("Failed to initialize particles:", error);
      // Hide particles container if it fails
      const particlesContainer = document.getElementById("particles-js");
      if (particlesContainer) {
        particlesContainer.style.display = "none";
      }
    }
  };

  const initTypedAnimation = () => {
    try {
      if (
        typeof Typed !== "undefined" &&
        document.querySelector(".navbar-brand .tech-font")
      ) {
        new Typed(".navbar-brand .tech-font", {
          strings: ["Mahmoud Kebbi", ""],
          typeSpeed: 70,
          backSpeed: 50,
          backDelay: 5000,
          loop: true,
          showCursor: true,
        });
      }
    } catch (error) {
      console.error("Failed to initialize typed animation:", error);
    }
  };

  // Theme Toggle
  const initThemeToggle = () => {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    // Check for saved theme preference from browser local storage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
      document.body.setAttribute("data-theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";

      document.body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      themeToggle.style.transform = "rotate(360deg)";
      setTimeout(() => {
        themeToggle.innerHTML =
          newTheme === "light"
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        themeToggle.style.transform = "rotate(0deg)";
      }, 150);

      updateParticlesTheme(newTheme);

      setTimeout(() => {
        highlightNavigation();
      }, 200);
    });
  };
  // Update particle colors to match theme
  const updateParticlesTheme = (theme) => {
    if (window.pJSDom && window.pJSDom[0]) {
      const particles = window.pJSDom[0].pJS.particles;
      const newColor = theme === "light" ? "#0066cc" : "#64ffda";
      const newLineColor = theme === "light" ? "#0066cc" : "#3498db";

      particles.color.value = newColor;
      particles.line_linked.color = newLineColor;

      window.pJSDom[0].pJS.fn.particlesRefresh();
    }
  };

  const initContactForm = () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea");
    const submitBtn = form.querySelector(".btn-submit");

    // validate input
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => clearFieldError(input));
    });

    // submit
    form.addEventListener("submit", handleFormSubmit);
  };

  const validateField = (field) => {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = `${getFieldLabel(field)} is required.`;
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address.";
      }
    }

    if (field.name === "name" && value) {
      if (value.length < 2) {
        isValid = false;
        errorMessage = "Name must be at least 2 characters long.";
      }
    }

    if (field.name === "message" && value) {
      if (value.length < 10) {
        isValid = false;
        errorMessage = "Message must be at least 10 characters long.";
      }
    }

    updateFieldValidation(field, isValid, errorMessage);
    return isValid;
  };

  const clearFieldError = (field) => {
    field.classList.remove("is-invalid", "is-valid");
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains("invalid-feedback")) {
      feedback.textContent = "";
    }
  };

  const updateFieldValidation = (field, isValid, errorMessage) => {
    const feedback = field.nextElementSibling;

    if (isValid) {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "";
      }
    } else {
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = errorMessage;
      }
    }
  };

  const getFieldLabel = (field) => {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace("*", "").trim() : field.name;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const inputs = form.querySelectorAll("input, textarea");
    const submitBtn = form.querySelector(".btn-submit");

    let isFormValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      showFormMessage("Please correct the errors above.", "danger");
      return;
    }

    toggleSubmitButton(submitBtn, true);

    try {
      await submitContactForm(formData);

      showFormMessage(
        "Thank you! Your message has been sent successfully. I'll get back to you soon.",
        "success"
      );
      form.reset();

      inputs.forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
      });
    } catch (error) {
      console.error("Form submission error:", error);
      showFormMessage(
        "Sorry, there was an error sending your message. Please try again or contact me directly.",
        "danger"
      );
    } finally {
      toggleSubmitButton(submitBtn, false);
    }
  };

  const submitContactForm = async (formData) => {
    const response = await fetch("https://formspree.io/f/mdkzjdez", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const toggleSubmitButton = (btn, isLoading) => {
    const btnText = btn.querySelector(".btn-text");
    const btnLoader = btn.querySelector(".btn-loader");

    if (isLoading) {
      btn.disabled = true;
      btnText.style.display = "none";
      btnLoader.style.display = "inline-block";
    } else {
      btn.disabled = false;
      btnText.style.display = "inline-block";
      btnLoader.style.display = "none";
    }
  };

  const showFormMessage = (message, type) => {
    const messagesContainer = document.getElementById("formMessages");
    const alertDiv = messagesContainer.querySelector(".alert");

    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    messagesContainer.style.display = "block";

    if (type === "success") {
      setTimeout(() => {
        messagesContainer.style.display = "none";
      }, 5000);
    }
  };

  const initSearchFilter = () => {
    const searchInput = document.getElementById("projectSearch");
    const clearBtn = document.getElementById("clearSearch");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");
    const noResults = document.getElementById("noResults");

    if (!searchInput || !projectItems.length) return;

    let currentFilter = "all";

    // Debounce function
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    searchInput.addEventListener("input", debounce(handleSearch, 300));
    clearBtn.addEventListener("click", clearSearch);
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", handleFilter);
    });

    function handleSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      clearBtn.style.display = searchTerm ? "block" : "none";
      filterProjects(searchTerm, currentFilter);
    }

    function clearSearch() {
      searchInput.value = "";
      clearBtn.style.display = "none";
      filterProjects("", currentFilter);
      searchInput.focus();
    }

    function handleFilter(e) {
      filterBtns.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      const searchTerm = searchInput.value.toLowerCase().trim();
      filterProjects(searchTerm, currentFilter);
    }

    function filterProjects(searchTerm, filter) {
      let visibleCount = 0;

      projectItems.forEach((item) => {
        const tags = item.dataset.tags.toLowerCase();
        const title = item.querySelector("h3").textContent.toLowerCase();
        const description = item.querySelector("p").textContent.toLowerCase();

        const searchMatch =
          !searchTerm ||
          tags.includes(searchTerm) ||
          title.includes(searchTerm) ||
          description.includes(searchTerm);

        const filterMatch = filter === "all" || tags.includes(filter);

        if (searchMatch && filterMatch) {
          showProjectItem(item);
          visibleCount++;
        } else {
          hideProjectItem(item);
        }
      });

      if (visibleCount === 0) {
        showNoResults();
      } else {
        hideNoResults();
      }

      updateURL(searchTerm, filter);
    }

    function showProjectItem(item) {
      item.classList.remove("hidden");
      item.classList.add("show");
    }

    function hideProjectItem(item) {
      item.classList.remove("show");
      item.classList.add("hidden");
    }

    function showNoResults() {
      noResults.style.display = "block";
      setTimeout(() => noResults.classList.add("show"), 10);
    }

    function hideNoResults() {
      noResults.classList.remove("show");
      setTimeout(() => (noResults.style.display = "none"), 300);
    }

    function updateURL(searchTerm, filter) {
      const url = new URL(window.location);

      if (searchTerm) {
        url.searchParams.set("search", searchTerm);
      } else {
        url.searchParams.delete("search");
      }

      if (filter !== "all") {
        url.searchParams.set("filter", filter);
      } else {
        url.searchParams.delete("filter");
      }

      window.history.replaceState({}, "", url);
    }

    function loadFromURL() {
      const url = new URL(window.location);
      const searchTerm = url.searchParams.get("search") || "";
      const filter = url.searchParams.get("filter") || "all";

      if (searchTerm) {
        searchInput.value = searchTerm;
        clearBtn.style.display = "block";
      }

      if (filter !== "all") {
        filterBtns.forEach((btn) => {
          btn.classList.remove("active");
          if (btn.dataset.filter === filter) {
            btn.classList.add("active");
          }
        });
        currentFilter = filter;
      }

      filterProjects(searchTerm, filter);
    }

    loadFromURL();
  };

  document.querySelectorAll('a.nav-link[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navbarHeight = 70;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight -
          20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
          const navbarToggler = document.querySelector(".navbar-toggler");
          if (navbarToggler) {
            navbarToggler.click();
          }
        }
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  const highlightNavigation = () => {
    const scrollY = window.pageYOffset;
    const navbarHeight = 70;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbarHeight - 50;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  const animateOnScroll = () => {
    const cards = document.querySelectorAll(
      ".neo-card, .project-card, .timeline-item"
    );

    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      const triggerBottom = window.innerHeight * 0.8;

      if (cardTop < triggerBottom && !card.classList.contains("show")) {
        card.classList.add("show");
      }
    });
  };

  const handleScroll = throttle(() => {
    highlightNavigation();
    animateOnScroll();
  }, 16);

  const initGitHubActivity = () => {
    const username = "MahmoudKebbi";

    fetchGitHubEvents(username);

    fetchGitHubRepos(username);
  };

  const fetchGitHubEvents = async (username) => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=7`
      );
      if (!response.ok) throw new Error("Failed to fetch GitHub events");

      const events = await response.json();
      displayGitHubEvents(events);
    } catch (error) {
      console.error("Error fetching GitHub events:", error);
      displayGitHubError("contributions");
    }
  };

  const fetchGitHubRepos = async (username) => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
      );
      if (!response.ok) throw new Error("Failed to fetch GitHub repositories");

      const repos = await response.json();
      displayGitHubRepos(repos);
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      displayGitHubError("repos");
    }
  };

  const displayGitHubEvents = (events) => {
    const container = document.getElementById("github-contributions");
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML =
        '<p class="text-center">No recent activity found.</p>';
      return;
    }

    let html = "";

    events.slice(0, 5).forEach((event) => {
      const eventTime = new Date(event.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      let eventDescription = "";
      let repoName = event.repo.name.split("/")[1];
      let repoUrl = `https://github.com/${event.repo.name}`;

      switch (event.type) {
        case "PushEvent":
          const commits = event.payload.commits;
          const commitCount = commits ? commits.length : 0;
          eventDescription = `Pushed ${commitCount} commit${
            commitCount !== 1 ? "s" : ""
          } to`;
          break;
        case "CreateEvent":
          eventDescription = `Created ${event.payload.ref_type} in`;
          break;
        case "PullRequestEvent":
          eventDescription = `${event.payload.action} a pull request in`;
          break;
        case "IssuesEvent":
          eventDescription = `${event.payload.action} an issue in`;
          break;
        case "IssueCommentEvent":
          eventDescription = "Commented on an issue in";
          break;
        case "WatchEvent":
          eventDescription = "Starred";
          break;
        case "ForkEvent":
          eventDescription = "Forked";
          break;
        default:
          eventDescription = "Activity in";
          break;
      }

      html += `
        <div class="event-item">
          <div class="event-time">${eventTime}</div>
          <div class="event-title">
            ${eventDescription} <a href="${repoUrl}" target="_blank">${repoName}</a>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const displayGitHubRepos = (repos) => {
    const container = document.getElementById("github-repos");
    if (!container) return;

    if (repos.length === 0) {
      container.innerHTML = '<p class="text-center">No repositories found.</p>';
      return;
    }

    let html = "";

    repos.forEach((repo) => {
      const updatedAt = new Date(repo.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      html += `
        <div class="repo-item">
          <div class="repo-name">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            ${repo.fork ? '<span class="badge bg-secondary">Fork</span>' : ""}
          </div>
          <div class="repo-description">${
            repo.description || "No description available"
          }</div>
          <div class="repo-meta">
            ${
              repo.language
                ? `<div class="repo-meta-item"><i class="fas fa-code"></i> ${repo.language}</div>`
                : ""
            }
            <div class="repo-meta-item"><i class="fas fa-star"></i> ${
              repo.stargazers_count
            }</div>
            <div class="repo-meta-item"><i class="fas fa-code-branch"></i> ${
              repo.forks_count
            }</div>
            <div class="repo-meta-item"><i class="fas fa-history"></i> Updated ${updatedAt}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const displayGitHubError = (type) => {
    const container = document.getElementById(`github-${type}`);
    if (container) {
      container.innerHTML = `
        <div class="text-center p-3">
          <i class="fas fa-exclamation-circle fa-2x mb-3" style="color: var(--text-secondary);"></i>
          <p>Could not fetch GitHub data.</p>
          <p class="small">Please try again later or check your connection.</p>
        </div>
      `;
    }
  };

  initParticles();
  initTypedAnimation();
  initThemeToggle();
  initContactForm();
  initSearchFilter();
  initGitHubActivity();

  document
    .querySelectorAll(".neo-card, .project-card, .timeline-item")
    .forEach((el) => {
      el.classList.add("animate-on-scroll");
    });

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Trigger initial animations
  highlightNavigation();
  animateOnScroll();
});

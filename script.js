/* ------------- ALL -------------- */
const page = document.body.dataset.page;

/* GO BACK TO TOP ON REFRESH */
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

/* SOUNDS */

// Function to load Base64-encoded audio from a URL
async function fetchBase64(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Base64 data: ${response.statusText}`);
  }
  return response.text();
}

// Variables
let hoverSound = null;
let clickSound = null;
let soundEnabled = sessionStorage.getItem("soundEnabled") === "true"; // Start OFF by default
let lottieInstance = null; // Store Lottie animation instance

// Function to load sounds
async function loadSounds() {
  try {
    const hoverSoundUrl = "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/6777d580f0bc14516e1541fc_hover-sound.txt";
    const clickSoundUrl = "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/678153d4aada1967690f015e_click.txt";

    const [hoverBase64, clickBase64] = await Promise.all([
      fetchBase64(hoverSoundUrl),
      fetchBase64(clickSoundUrl),
    ]);

    hoverSound = new Audio(`data:audio/wav;base64,${hoverBase64}`);
    clickSound = new Audio(`data:audio/wav;base64,${clickBase64}`);

    console.log("🔊 Sounds Loaded");
  } catch (error) {
    console.error("Error loading sounds:", error);
  }
}

// Function to play hover sounds
function playHoverSound() {
  if (soundEnabled && hoverSound) {
    hoverSound.currentTime = 0;
    hoverSound.play();
  }
}

// Function to play click sounds
function playClickSound() {
  if (soundEnabled && clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

// Function to initialize sounds & Lottie once elements are available
function checkAndInit() {
  const soundBtn = document.querySelector(".sound-btn");
  const soundIcon = document.querySelector(".sound-icon");
  const hoverElements = document.querySelectorAll("[hover-sound]");
  const clickElements = document.querySelectorAll("[click-sound]");

  if (soundBtn && soundIcon && hoverElements.length > 0 && clickElements.length > 0) {
    // Load sounds in the background
    loadSounds();

    // Attach hover and click sound listeners
    hoverElements.forEach((element) => element.addEventListener("mouseenter", playHoverSound));
    clickElements.forEach((element) => element.addEventListener("click", playClickSound));

    // Initialize Lottie animation
    lottieInstance = bodymovin.loadAnimation({
      container: soundIcon,
      renderer: "svg",
      loop: true,
      autoplay: false, // Don't autoplay yet
      path: "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/67adf537fb7c431b8891109c_sound-lottie.json",
    });

    // Ensure Lottie is in the correct state on load
    updateButtonState(soundBtn, soundEnabled);

    // Add click event to toggle sound
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      sessionStorage.setItem("soundEnabled", soundEnabled);
      updateButtonState(soundBtn, soundEnabled);
    });

    return true; // Elements found, stop checking
  }

  return false; // Keep checking
}

// Retry checking for elements every 100ms until found
const interval = setInterval(() => {
  if (checkAndInit()) {
    clearInterval(interval);
  }
}, 100);

// Function to update the sound toggle button & Lottie animation
function updateButtonState(button, enabled) {
  if (enabled) {
    button.classList.add("active");
    if (lottieInstance) lottieInstance.goToAndPlay(0, true);
  } else {
    button.classList.remove("active");
    if (lottieInstance) lottieInstance.goToAndStop(0, true);
  }
}


/* Check Section Theme on Scroll */
function initCheckSectionThemeScroll() {
  const navBar = document.querySelector("[data-nav-bar-height]");
  const themeObserverOffset = navBar ? navBar.offsetHeight / 2 : 0;

  function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");
    themeSections.forEach((themeSection) => {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      if (
        themeSectionTop <= themeObserverOffset &&
        themeSectionBottom >= themeObserverOffset
      ) {
        const themeSectionActive = themeSection.getAttribute("data-theme-section") || "";
        const bgSectionActive = themeSection.getAttribute("data-bg-section") || "";

        document.querySelectorAll("[data-theme-nav]").forEach((elem) => {
          if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
            elem.setAttribute("data-theme-nav", themeSectionActive);
          }
        });

        document.querySelectorAll("[data-bg-nav]").forEach((elem) => {
          if (elem.getAttribute("data-bg-nav") !== bgSectionActive) {
            elem.setAttribute("data-bg-nav", bgSectionActive);
          }
        });
      }
    });
  }

  function startThemeCheck() {
    document.addEventListener("scroll", checkThemeSection);
  }

  checkThemeSection();
  startThemeCheck();
}

// Initialize Check Section Theme on Scroll
initCheckSectionThemeScroll();


/* Menu Open */
const menuBtn = document.querySelector(".menu-btn");
const btnText = document.querySelector(".menu-btn .btn-text");
const navBg = document.querySelector(".nav-bg");
const navFill = document.querySelector(".nav-fill");
const navLinks = document.querySelectorAll(".nav-link");
const navLogo = document.querySelector(".logo-svg");
const soundBtn = document.querySelector(".sound-btn");
const soundSvg = document.querySelector(".sound-icon");

let menuOpen = false;
const menuColor = "#03020C";

menuBtn.addEventListener("click", () => {
  if (!menuOpen) {
    navBg.style.display = "block";

    gsap.to(navFill, {
      y: "0%",
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        menuOpen = true;
        btnText.textContent = "Close";
      },
    });

    gsap.to([menuBtn, soundBtn, navLinks, navLogo, soundSvg], {
      color: menuColor,
      duration: 0.3,
    });

    gsap.to([menuBtn, soundBtn], {
      borderColor: menuColor,
      duration: 0.3,
    });
  } else {
    gsap.to(navFill, {
      y: "-100%",
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        navBg.style.display = "none";
        menuOpen = false;
        btnText.textContent = "Menu"; // Change text back to "Menu"
      },
    });

    gsap.to([menuBtn, soundBtn, navLinks, navLogo, soundSvg], {
      color: "",
      duration: 0.3,
    });

    gsap.to([menuBtn, soundBtn], {
      borderColor: "",
      duration: 0.3,
    });
  }
});

/* Buttons Hover */
if (window.innerWidth > 991) {
let splitText;
function runSplit() {
  splitText = new SplitType("[stagger-link]", {
    types: "words, chars",
  });
}
runSplit();

// ————— Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    splitText.revert();
    runSplit();
  }
});

// ———— animation
const staggerLinks = document.querySelectorAll("[stagger-link]");
staggerLinks.forEach((link) => {
  const letters = link.querySelectorAll("[stagger-link-text]");
  link.addEventListener("mouseenter", function () {
    gsap.to(letters, {
      yPercent: -130,
      duration: 0.3,
      ease: "power4.inOut",
      stagger: { each: 0.05, from: "start" },
      overwrite: true,
    });
  });
  link.addEventListener("mouseleave", function () {
    gsap.to(letters, {
      yPercent: 0,
      duration: 0.3,
      ease: "power4.inOut",
      stagger: { each: 0.05, from: "start" },
    });
  });
});
}

gsap.registerPlugin(ScrollTrigger);

/* Scroll Indicator */
const indicator = document.querySelector(".scroll-indicator-span");

ScrollTrigger.create({
  trigger: document.body,
  start: "top top",
  end: "bottom bottom",
  ease: "power2.out",
  onUpdate: (self) => {
    const progress = Math.round(self.progress * 100);
    indicator.textContent = `${progress}%`;
  },
});

gsap.to(".scroll-indicator", {
  opacity: 0,
  duration: 0.5,
  scrollTrigger: {
    trigger: ".footer",
    start: "top bottom",
    end: "top center",
    scrub: true,
  },
});

/* Parallax Images */
document.querySelectorAll("[data-parallax-container]").forEach((container) => {
  const image = container.querySelector("[data-parallax-img]");

  if (image) {
    const containerHeight = container.offsetHeight;
    const imageHeight = image.offsetHeight;
    const heightDifference = imageHeight - containerHeight;

    // Apply the parallax effect
    gsap.to(image, {
      y: -heightDifference,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }
});


/* Footer Logo Reveal */
gsap.fromTo(
  ".glyph",
  { y: "100%" },
  {
    y: "0%",
    ease: "power1.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".footer",
      start: "top 60%",
      end: "35% 60%",
      scrub: 1,
    },
  }
);  


/* ------------- END OF ALL -------------- */

/* ------------- HOME -------------- */
if (page === "home") {
  gsap.registerPlugin(ScrollTrigger);

  /* Homepage Hero Animation */
  if (window.innerWidth > 991) {
    let heroImage = gsap.timeline({
      scrollTrigger: {
        trigger: ".home-hero-bg",
        start: "center center",
        end: "80% center",
        scrub: true,
        pin: true,
      },
    });

    // Scale down hero background
    heroImage.to(".home-hero-bg", {
      scale: 0.4,
      duration: 3,
      onComplete: () => ScrollTrigger.refresh(),
    });

    // Fade out hero content and change colors dynamically
    heroImage.to(".home-hero-wrapper", { opacity: 0, duration: 1 }, "-=3");
  }

/* Homepage Social Proof Horizontal Scroll */
let horizontalSections = gsap.utils.toArray(".section_social-proof");

horizontalSections.forEach((container) => {
  let sections = container.querySelectorAll(".social-proof-item");

  // Create the horizontal scroll animation
  let containerAnim = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
  });

  // Create the ScrollTrigger for horizontal scrolling
  ScrollTrigger.create({
    trigger: container,
    animation: containerAnim,
    scrub: 1,
    start: "top center",
    end: "bottom center",
  });

  // Use matchMedia for responsive font size animation
  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Desktop Animation
    sections.forEach((section) => {
      let h3 = section.querySelector(".social-proof-h3");
      if (h3) {
        gsap.fromTo(
          h3,
          { fontSize: "6.25em" },
          {
            fontSize: "12em",
            scrollTrigger: {
              containerAnimation: containerAnim,
              trigger: section,
              start: "center right",
              end: "center center",
              scrub: true,
            },
          }
        );
      }
    });
  });

  mm.add("(max-width: 767px)", () => {
    // Mobile Animation
    sections.forEach((section) => {
      let h3 = section.querySelector(".social-proof-h3");
      if (h3) {
        gsap.fromTo(
          h3,
          { fontSize: "1.5em" },
          {
            fontSize: "4em",
            scrollTrigger: {
              containerAnimation: containerAnim,
              trigger: section,
              start: "center right",
              end: "center center",
              scrub: true,
            },
          }
        );
      }
    });
  });
});


  // if (window.innerWidth > 991) {
  //   // Set the cursor position to follow the mouse
  //   gsap.set(".tooltip", { xPercent: -0, yPercent: -50 });

  //   let cursorX = gsap.quickTo(".tooltip", "x", {
  //     duration: 0.5,
  //     ease: "power2",
  //   });
  //   let cursorY = gsap.quickTo(".tooltip", "y", {
  //     duration: 0.5,
  //     ease: "power2",
  //   });

  //   // Update cursor position on mouse movement
  //   window.addEventListener("mousemove", (e) => {
  //     cursorX(e.clientX);
  //     cursorY(e.clientY);
  //   });

  //   // Ensure cursor is always visible
  //   const cursor = document.querySelector(".tooltip");
  //   cursor.style.display = "block";

  //   // Hide cursor on click
  //   window.addEventListener("click", () => {
  //     cursor.style.display = "none";
  //   });
  // }

  /*
  function initMarqueeScrollDirection() {
    document
      .querySelectorAll("[data-marquee-scroll-direction-target]")
      .forEach((marquee) => {
        // Query marquee elements
        const marqueeContent = marquee.querySelector(
          "[data-marquee-collection-target]"
        );
        const marqueeScroll = marquee.querySelector(
          "[data-marquee-scroll-target]"
        );
        if (!marqueeContent || !marqueeScroll) return;

        // Get data attributes
        const {
          marqueeSpeed: speed,
          marqueeDirection: direction,
          marqueeDuplicate: duplicate,
          marqueeScrollSpeed: scrollSpeed,
        } = marquee.dataset;

        // Convert data attributes to usable types
        const marqueeSpeedAttr = parseFloat(speed);
        const marqueeDirectionAttr = direction === "right" ? 1 : -1; // 1 for right, -1 for left
        const duplicateAmount = parseInt(duplicate || 0);
        const scrollSpeedAttr = parseFloat(scrollSpeed);
        const speedMultiplier =
          window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

        let marqueeSpeed =
          marqueeSpeedAttr *
          (marqueeContent.offsetWidth / window.innerWidth) *
          speedMultiplier;

        // Precompute styles for the scroll container
        marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
        marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

        // Duplicate marquee content
        if (duplicateAmount > 0) {
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < duplicateAmount; i++) {
            fragment.appendChild(marqueeContent.cloneNode(true));
          }
          marqueeScroll.appendChild(fragment);
        }

        // GSAP animation for marquee content
        const marqueeItems = marquee.querySelectorAll(
          "[data-marquee-collection-target]"
        );
        const animation = gsap
          .to(marqueeItems, {
            xPercent: -100, // Move completely out of view
            repeat: -1,
            duration: marqueeSpeed,
            ease: "linear",
          })
          .totalProgress(0.5);

        // Initialize marquee in the correct direction
        gsap.set(marqueeItems, {
          xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
        });
        animation.timeScale(marqueeDirectionAttr); // Set correct direction
        animation.play(); // Start animation immediately

        // Set initial marquee status
        marquee.setAttribute("data-marquee-status", "normal");

        // ScrollTrigger logic for direction inversion
        ScrollTrigger.create({
          trigger: marquee,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const isInverted = self.direction === 1; // Scrolling down
            const currentDirection = isInverted
              ? -marqueeDirectionAttr
              : marqueeDirectionAttr;

            // Update animation direction and marquee status
            animation.timeScale(currentDirection);
            marquee.setAttribute(
              "data-marquee-status",
              isInverted ? "normal" : "inverted"
            );
          },
        });

        // Extra speed effect on scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: marquee,
            start: "0% 100%",
            end: "100% 0%",
            scrub: 0,
          },
        });

        const scrollStart =
          marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
        const scrollEnd = -scrollStart;

        tl.fromTo(
          marqueeScroll,
          { x: `${scrollStart}vw` },
          { x: `${scrollEnd}vw`, ease: "none" }
        );
      });
  }

  initMarqueeScrollDirection();
*/

  /* Home About Images Parallax */

  // Function to get y translation based on image height
  const getY = (element) => {
    const height = element.clientHeight;
    const maxScrollSpeed = -300; // Negative maximum scroll speed for smallest images
    const minScrollSpeed = -10; // Negative minimum scroll speed for largest images
    const referenceHeight = 600; // Reference height for scaling

    // Adjust speed factor based on the height relative to the reference height
    const speedFactor =
      maxScrollSpeed +
      (height / referenceHeight) * (minScrollSpeed - maxScrollSpeed);
    console.log({ height, speedFactor });
    return speedFactor;
  };

  document
    .querySelectorAll(".home-about-parallax-wrap")
    .forEach((homeAboutImage) => {
      gsap.to(homeAboutImage, {
        y: getY(homeAboutImage),
        ease: "none",
        scrollTrigger: {
          trigger: homeAboutImage,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
        onComplete: () => ScrollTrigger.refresh(),
      });
    });

  /* Values Scroll Animation */
  if (window.innerWidth > 991) {
    gsap.set(".home-values-item-sub-wrap", {
      height: 0,
      opacity: 0,
      margin: 0,
    });

    let homeValues = gsap.timeline({
      scrollTrigger: {
        trigger: ".section_home-values",
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        pinSpacing: false,
        //markers: true
      },
    });

    const items = document.querySelectorAll(".home-values-item-wrap");
    const subItems = document.querySelectorAll(".home-values-item-sub-wrap");
    const headers = document.querySelectorAll(".values-h3");

    items.forEach((item, index) => {
      if (index > 0) {
        homeValues.to(
          subItems[index - 1],
          {
            height: 0,
            opacity: 0,
            marginTop: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          ">"
        );

        homeValues.to(
          items[index - 1],
          {
            color: "#03020C",
            duration: 0.5,
            ease: "power2.out",
          },
          "<"
        );

        homeValues.to(
          headers[index - 1],
          {
            color: "#03020C",
            duration: 0.5,
            ease: "power2.out",
          },
          "<"
        );
      }

      homeValues.to(
        headers[index],
        {
          color: "#C85204",
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      );

      homeValues.to(
        item,
        {
          color: "#C85204",
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      );

      homeValues.to(
        subItems[index],
        {
          height: "auto",
          opacity: 1,
          marginTop: "2em",
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        },
        "<"
      );
    });
  }
}

/* ------------- END OF HOME -------------- */

/* ------------- ABOUT -------------- */

if (page === "about") {
  gsap.registerPlugin(ScrollTrigger);

  /* Team */
  document.querySelectorAll(".team-item").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card.querySelector(".team-item-wrap"), {
        height: "100%",
        backgroundColor: "#B44A04",
        color: "#FAFAFA",
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.to(card.querySelector(".team-bio"), {
        opacity: 1,
        color: "#FAFAFA",
        duration: 0.5,
        ease: "power3.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card.querySelector(".team-item-wrap"), {
        height: "6.2em",
        backgroundColor: "#E1E1E2",
        color: "#03020C",
        duration: 0.5,
        ease: "power3.in",
      });

      gsap.to(card.querySelector(".team-bio"), {
        opacity: 0,
        color: "#03020C",
        duration: 0.5,
        ease: "power3.in",
      });
    });
  });

  if (window.innerWidth > 991) {
    const teamMembers = document.querySelectorAll(".team-item");
  
    teamMembers.forEach((member, index) => {
      if ((index + 1) % 5 === 0) {
        // Create the special div
        const specialDiv = document.createElement("div");
        specialDiv.classList.add("team-item-strokes");
  
        // Create and append 36 stroke divs
        for (let i = 0; i < 36; i++) {
          const strokeDiv = document.createElement("div");
          strokeDiv.classList.add("stroke");
          specialDiv.appendChild(strokeDiv);
        }
  
        // Insert after the current team member
        member.parentNode.insertBefore(specialDiv, member.nextSibling);
  
        // Optional: GSAP Animation
        gsap.from(specialDiv, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: "power2.out",
        });
      }
    });
  
    // Make strokes rotate towards cursor
    const strokes = document.querySelectorAll(".stroke");
  
    const updateRotation = (e) => {
      strokes.forEach((stroke) => {
        const rect = stroke.getBoundingClientRect();
        const strokeX = rect.left + rect.width / 2;
        const strokeY = rect.bottom;
  
        let angle =
          Math.atan2(e.clientY - strokeY, e.clientX - strokeX) * (180 / Math.PI);
  
        let currentRotation = gsap.getProperty(stroke, "rotation");
        let delta = ((angle - currentRotation + 540) % 360) - 180;
  
        gsap.to(stroke, {
          rotation: currentRotation + delta,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    };
    window.addEventListener("mousemove", updateRotation);
  }

// Partners Marquee
function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');
  
  // Duplicate each [data-css-marquee-list] element inside its container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list => 
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });
  
  // Calculate the width and set the animation duration accordingly
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}

// Initialize CSS Marquee

  initCSSMarquee();


}



/* ------------- END OF ABOUT -------------- */

/* ------------- CAREERS -------------- */

if (page === "careers") {
  /* Open position form name */
  document.querySelectorAll(".position-item").forEach((button) => {
    button.addEventListener("click", function () {
      let positionName = this.getAttribute("data-position");
      let heading = document.querySelector(".career-form-h2");

      if (positionName && heading) {
        // Get the original Webflow text (before replacement)
        let originalText = heading.getAttribute("data-original-text");

        // Store the original text if it hasn't been stored yet
        if (!originalText) {
          originalText = heading.textContent;
          heading.setAttribute("data-original-text", originalText);
        }

        // Set the text dynamically, replacing {position} placeholder if it exists
        heading.textContent = originalText.replace("{position}", positionName);
      }
    });
  });
}

/* ------------- END OF CAREERS -------------- */

/* ------------- FUNDS -------------- */
if (page === "funds") {
  /* Dif Modal Open */
  const openModalBtns = document.querySelectorAll("[open-modal]");
  const closeModalBtns = document.querySelectorAll(".close-btn");
  const modalBg = document.querySelector(".modal-bg");
  const modalFill = document.querySelector(".modal-fill");

  let modalOpen = false;

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!modalOpen) {
        modalBg.style.display = "flex";

        gsap.to(modalFill, {
          x: "0%",
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            modalOpen = true;
          },
        });
      }
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (modalOpen) {
        gsap.to(modalFill, {
          x: "100%",
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            modalBg.style.display = "none";
            modalOpen = false;
          },
        });
      }
    });
  });

  const stickyCards = () => {
    const panels = Array.from(document.querySelectorAll(".funds-item"));

    panels.forEach((panel, index) => {
      const isLast = index === panels.length - 1;

      // Skip animation for the last panel
      if (!isLast) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: panel,
              start: `top ${10 + index * 15}%`, // Staggered start
              scrub: 1,
              //markers: true,
            },
          })
          .to(
            panel,
            {
              ease: "none",
              startAt: { filter: "blur(0px)", opacity: 1 },
              filter: "blur(4px)",
              opacity: 0,
              scale: 0.8,
            },
            "<"
          );
      }
    });
  };
  stickyCards();
}
/* ------------- END OF FUNDS -------------- */

if (page === "funds-detail") {
  // function initMarqueeScrollDirection() {
  //   document
  //     .querySelectorAll("[data-marquee-scroll-direction-target]")
  //     .forEach((marquee) => {
  //       // Query marquee elements
  //       const marqueeContent = marquee.querySelector(
  //         "[data-marquee-collection-target]"
  //       );
  //       const marqueeScroll = marquee.querySelector(
  //         "[data-marquee-scroll-target]"
  //       );
  //       if (!marqueeContent || !marqueeScroll) return;

  //       // Get data attributes
  //       const {
  //         marqueeSpeed: speed,
  //         marqueeDirection: direction,
  //         marqueeDuplicate: duplicate,
  //         marqueeScrollSpeed: scrollSpeed,
  //       } = marquee.dataset;

  //       // Convert data attributes to usable types
  //       const marqueeSpeedAttr = parseFloat(speed);
  //       const marqueeDirectionAttr = direction === "right" ? 1 : -1; // 1 for right, -1 for left
  //       const duplicateAmount = parseInt(duplicate || 0);
  //       const scrollSpeedAttr = parseFloat(scrollSpeed);
  //       const speedMultiplier =
  //         window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

  //       let marqueeSpeed =
  //         marqueeSpeedAttr *
  //         (marqueeContent.offsetWidth / window.innerWidth) *
  //         speedMultiplier;

  //       // Precompute styles for the scroll container
  //       marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
  //       marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

  //       // Duplicate marquee content
  //       if (duplicateAmount > 0) {
  //         const fragment = document.createDocumentFragment();
  //         for (let i = 0; i < duplicateAmount; i++) {
  //           fragment.appendChild(marqueeContent.cloneNode(true));
  //         }
  //         marqueeScroll.appendChild(fragment);
  //       }

  //       // GSAP animation for marquee content
  //       const marqueeItems = marquee.querySelectorAll(
  //         "[data-marquee-collection-target]"
  //       );
  //       const animation = gsap
  //         .to(marqueeItems, {
  //           xPercent: -100, // Move completely out of view
  //           repeat: -1,
  //           duration: marqueeSpeed,
  //           ease: "linear",
  //         })
  //         .totalProgress(0.5);

  //       // Initialize marquee in the correct direction
  //       gsap.set(marqueeItems, {
  //         xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
  //       });
  //       animation.timeScale(marqueeDirectionAttr); // Set correct direction
  //       animation.play(); // Start animation immediately

  //       // Set initial marquee status
  //       marquee.setAttribute("data-marquee-status", "normal");

  //       // ScrollTrigger logic for direction inversion
  //       ScrollTrigger.create({
  //         trigger: marquee,
  //         start: "top bottom",
  //         end: "bottom top",
  //         onUpdate: (self) => {
  //           const isInverted = self.direction === 1; // Scrolling down
  //           const currentDirection = isInverted
  //             ? -marqueeDirectionAttr
  //             : marqueeDirectionAttr;

  //           // Update animation direction and marquee status
  //           animation.timeScale(currentDirection);
  //           marquee.setAttribute(
  //             "data-marquee-status",
  //             isInverted ? "normal" : "inverted"
  //           );
  //         },
  //       });

  //       // Extra speed effect on scroll
  //       const tl = gsap.timeline({
  //         scrollTrigger: {
  //           trigger: marquee,
  //           start: "0% 100%",
  //           end: "100% 0%",
  //           scrub: 0,
  //         },
  //       });

  //       const scrollStart =
  //         marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
  //       const scrollEnd = -scrollStart;

  //       tl.fromTo(
  //         marqueeScroll,
  //         { x: `${scrollStart}vw` },
  //         { x: `${scrollEnd}vw`, ease: "none" }
  //       );
  //     });
  // }

  // initMarqueeScrollDirection();

  /* Homepage Social Proof Horizontal Scroll */
let horizontalSections = gsap.utils.toArray(".section_social-proof");

horizontalSections.forEach((container) => {
  let sections = container.querySelectorAll(".social-proof-item");

  // Create the horizontal scroll animation
  let containerAnim = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
  });

  // Create the ScrollTrigger for horizontal scrolling
  ScrollTrigger.create({
    trigger: container,
    animation: containerAnim,
    scrub: 1,
    start: "top center",
    end: "bottom center",
  });

  // Use matchMedia for responsive font size animation
  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Desktop Animation
    sections.forEach((section) => {
      let h3 = section.querySelector(".social-proof-h3");
      if (h3) {
        gsap.fromTo(
          h3,
          { fontSize: "6.25em" },
          {
            fontSize: "12em",
            scrollTrigger: {
              containerAnimation: containerAnim,
              trigger: section,
              start: "center right",
              end: "center center",
              scrub: true,
            },
          }
        );
      }
    });
  });

  mm.add("(max-width: 767px)", () => {
    // Mobile Animation
    sections.forEach((section) => {
      let h3 = section.querySelector(".social-proof-h3");
      if (h3) {
        gsap.fromTo(
          h3,
          { fontSize: "1.5em" },
          {
            fontSize: "4em",
            scrollTrigger: {
              containerAnimation: containerAnim,
              trigger: section,
              start: "center right",
              end: "center center",
              scrub: true,
            },
          }
        );
      }
    });
  });
});

  function checkCollectionItems() {
    const sectionKPI = document.querySelector(".section-kpi");
    const collectionList = document.querySelector(".section_social-proof"); // Adjust the class to match your Webflow collection list

    if (collectionList && sectionKPI) {
      const visibleItems = collectionList.querySelectorAll(
        ".social-proof-item:not([style*='display: none'])"
      );

      if (visibleItems.length === 0) {
        sectionKPI.style.display = "none"; // Hide section if no items are visible
      } else {
        sectionKPI.style.display = "block"; // Show section if items exist
      }
    }
  }

  // Run the check initially
  checkCollectionItems();

  // Run again if filters are applied (adjust according to your filter system)
  const observer = new MutationObserver(checkCollectionItems);
  observer.observe(document.querySelector(".section_social-proof"), {
    childList: true,
    subtree: true,
  });

  function checkCollectionItems() {
    const sectionKPI = document.querySelector(".section-kpi");
    const collectionList = document.querySelector(".marquee-advanced__scroll");
  
    if (!collectionList || !sectionKPI) return; // Exit if elements are missing
  
    const visibleItems = Array.from(
      collectionList.querySelectorAll(".marquee-advanced__item")
    ).filter((item) => item.offsetParent !== null); // More reliable check
  
    if (visibleItems.length === 0) {
      sectionKPI.style.display = "none";
      sectionKPI.setAttribute("data-theme-section", "dark"); // Set to dark
      sectionKPI.setAttribute("data-bg-section", "white"); // Set to white
    } else {
      sectionKPI.style.display = "block";
  
      // Restore attributes if needed
      if (!sectionKPI.hasAttribute("data-theme-section")) {
        sectionKPI.setAttribute("data-theme-section", "light");
      }
      if (!sectionKPI.hasAttribute("data-bg-section")) {
        sectionKPI.setAttribute("data-bg-section", "black");
      }
    }
  }
  
  // Run the check initially after a slight delay to ensure elements are loaded
  setTimeout(checkCollectionItems, 100);
  
  // Observe changes in the collection list
  const collectionList = document.querySelector(".marquee-advanced__scroll");
  if (collectionList) {
    const observer = new MutationObserver(checkCollectionItems);
    observer.observe(collectionList, { childList: true, subtree: true });
  }
  
  
  
}
if (page === "assets-detail") {
  // function initMarqueeScrollDirection() {
  //   document
  //     .querySelectorAll("[data-marquee-scroll-direction-target]")
  //     .forEach((marquee) => {
  //       // Query marquee elements
  //       const marqueeContent = marquee.querySelector(
  //         "[data-marquee-collection-target]"
  //       );
  //       const marqueeScroll = marquee.querySelector(
  //         "[data-marquee-scroll-target]"
  //       );
  //       if (!marqueeContent || !marqueeScroll) return;

  //       // Get data attributes
  //       const {
  //         marqueeSpeed: speed,
  //         marqueeDirection: direction,
  //         marqueeDuplicate: duplicate,
  //         marqueeScrollSpeed: scrollSpeed,
  //       } = marquee.dataset;

  //       // Convert data attributes to usable types
  //       const marqueeSpeedAttr = parseFloat(speed);
  //       const marqueeDirectionAttr = direction === "right" ? 1 : -1; // 1 for right, -1 for left
  //       const duplicateAmount = parseInt(duplicate || 0);
  //       const scrollSpeedAttr = parseFloat(scrollSpeed);
  //       const speedMultiplier =
  //         window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

  //       let marqueeSpeed =
  //         marqueeSpeedAttr *
  //         (marqueeContent.offsetWidth / window.innerWidth) *
  //         speedMultiplier;

  //       // Precompute styles for the scroll container
  //       marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
  //       marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

  //       // Duplicate marquee content
  //       if (duplicateAmount > 0) {
  //         const fragment = document.createDocumentFragment();
  //         for (let i = 0; i < duplicateAmount; i++) {
  //           fragment.appendChild(marqueeContent.cloneNode(true));
  //         }
  //         marqueeScroll.appendChild(fragment);
  //       }

  //       // GSAP animation for marquee content
  //       const marqueeItems = marquee.querySelectorAll(
  //         "[data-marquee-collection-target]"
  //       );
  //       const animation = gsap
  //         .to(marqueeItems, {
  //           xPercent: -100, // Move completely out of view
  //           repeat: -1,
  //           duration: marqueeSpeed,
  //           ease: "linear",
  //         })
  //         .totalProgress(0.5);

  //       // Initialize marquee in the correct direction
  //       gsap.set(marqueeItems, {
  //         xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
  //       });
  //       animation.timeScale(marqueeDirectionAttr); // Set correct direction
  //       animation.play(); // Start animation immediately

  //       // Set initial marquee status
  //       marquee.setAttribute("data-marquee-status", "normal");

  //       // ScrollTrigger logic for direction inversion
  //       ScrollTrigger.create({
  //         trigger: marquee,
  //         start: "top bottom",
  //         end: "bottom top",
  //         onUpdate: (self) => {
  //           const isInverted = self.direction === 1; // Scrolling down
  //           const currentDirection = isInverted
  //             ? -marqueeDirectionAttr
  //             : marqueeDirectionAttr;

  //           // Update animation direction and marquee status
  //           animation.timeScale(currentDirection);
  //           marquee.setAttribute(
  //             "data-marquee-status",
  //             isInverted ? "normal" : "inverted"
  //           );
  //         },
  //       });

  //       // Extra speed effect on scroll
  //       const tl = gsap.timeline({
  //         scrollTrigger: {
  //           trigger: marquee,
  //           start: "0% 100%",
  //           end: "100% 0%",
  //           scrub: 0,
  //         },
  //       });

  //       const scrollStart =
  //         marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
  //       const scrollEnd = -scrollStart;

  //       tl.fromTo(
  //         marqueeScroll,
  //         { x: `${scrollStart}vw` },
  //         { x: `${scrollEnd}vw`, ease: "none" }
  //       );
  //     });
  // }

  // initMarqueeScrollDirection();

/* Homepage Social Proof Horizontal Scroll */
let horizontalSections = gsap.utils.toArray(".section_social-proof");

horizontalSections.forEach((container) => {
  let sections = container.querySelectorAll(".social-proof-item");

  // Create the horizontal scroll animation
  let containerAnim = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
  });

  // Create the ScrollTrigger for horizontal scrolling
  ScrollTrigger.create({
    trigger: container,
    animation: containerAnim,
    scrub: 1,
    start: "top center",
    end: "bottom center",
  });

  // Use matchMedia for responsive font size animation
  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Desktop Animation
    sections.forEach((section) => {
      let h3 = section.querySelector(".social-proof-h3");
      if (h3) {
        gsap.fromTo(
          h3,
          { fontSize: "6.25em" },
          {
            fontSize: "12em",
            scrollTrigger: {
              containerAnimation: containerAnim,
              trigger: section,
              start: "center right",
              end: "center center",
              scrub: true,
            },
          }
        );
      }
    });
  });

  mm.add("(max-width: 767px)", () => {
    // Mobile Animation
    sections.forEach((section) => {
      let h3 = section.querySelector(".social-proof-h3");
      if (h3) {
        gsap.fromTo(
          h3,
          { fontSize: "1.5em" },
          {
            fontSize: "4em",
            scrollTrigger: {
              containerAnimation: containerAnim,
              trigger: section,
              start: "center right",
              end: "center center",
              scrub: true,
            },
          }
        );
      }
    });
  });
});

  function checkCollectionItems() {
    const sectionKPI = document.querySelector(".section-kpi");
    const collectionList = document.querySelector(".section_social-proof"); // Adjust the class to match your Webflow collection list

    if (collectionList && sectionKPI) {
      const visibleItems = collectionList.querySelectorAll(
        ".social-proof-item:not([style*='display: none'])"
      );

      if (visibleItems.length === 0) {
        sectionKPI.style.display = "none"; // Hide section if no items are visible
      } else {
        sectionKPI.style.display = "block"; // Show section if items exist
      }
    }
  }

  // Run the check initially
  checkCollectionItems();

  // Run again if filters are applied (adjust according to your filter system)
  const observer = new MutationObserver(checkCollectionItems);
  observer.observe(document.querySelector(".section_social-proof"), {
    childList: true,
    subtree: true,
  });
}

if (page === "assets") {

  const items = document.querySelectorAll('.assets-item');

  items.forEach((item, index) => {
    const baseTop = 10; // 10%
    const increment = 5; // 5% per item
    const top = baseTop + index * increment;
    item.style.top = `${top}%`;
  });
  
  

  const stickyCards = () => {
    const panels = Array.from(document.querySelectorAll(".assets-item"));

    panels.forEach((panel, index) => {
      const isLast = index === panels.length - 1;

      if (!isLast) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: panel,
              start: `top ${10 + index * 15}%`,
              scrub: 1,
              //markers: true,
            },
          })
          .to(
            panel,
            {
              ease: "none",
              startAt: { filter: "blur(0px)", opacity: 1 },
              filter: "blur(4px)",
              //opacity: 0,
              scale: 0.8,
            },
            "<"
          );
      }
    });
  };
  stickyCards();
}

if (page === "assets-detail") {
  if (window.innerWidth > 991) {
  }
}

/* ------------- CAREERS -------------- */

if (page === "careers") {
  /* Dif Modal Open */
  const openModalBtns = document.querySelectorAll("[open-modal]");
  const closeModalBtns = document.querySelectorAll(".close-btn");
  const modalBg = document.querySelector(".modal-bg");
  const modalFill = document.querySelector(".modal-fill");

  let modalOpen = false;

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!modalOpen) {
        modalBg.style.display = "flex";

        gsap.to(modalFill, {
          x: "0%",
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            modalOpen = true;
          },
        });
      }
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (modalOpen) {
        gsap.to(modalFill, {
          x: "100%",
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            modalBg.style.display = "none";
            modalOpen = false;
          },
        });
      }
    });
  });
}

if (page === "sustainability") {
  /* Sustainability Values Scroll Animation */
  if (window.innerWidth > 991) {
    gsap.set(".sus-values-item-sub-wrap", {
      height: 0,
      opacity: 0,
      margin: 0,
    });

    let homeValues = gsap.timeline({
      scrollTrigger: {
        trigger: ".section_sus-values",
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        //pinSpacing: false,
      },
    });

    const items = document.querySelectorAll(".sus-values-item-wrap");
    const subItems = document.querySelectorAll(".sus-values-item-sub-wrap");
    const headers = document.querySelectorAll(".values-h3");

    items.forEach((item, index) => {
      // Close the previous sub-wrap and reset its color
      if (index > 0) {
        homeValues.to(
          subItems[index - 1],
          {
            height: 0,
            opacity: 0,
            marginTop: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          ">"
        ); // Starts when the next one begins opening

        homeValues.to(
          items[index - 1],
          {
            color: "#03020C", // Replace with your default color
            duration: 0.5,
            ease: "power2.out",
          },
          "<"
        ); // Aligns with the start of the closing animation

        homeValues.to(
          headers[index - 1],
          {
            color: "#03020C", // Replace with your default color
            duration: 0.5,
            ease: "power2.out",
          },
          "<"
        ); // Aligns with the item color reset
      }

      // Change the color of the current header
      homeValues.to(
        headers[index],
        {
          color: "#C85204",
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      ); // Aligns with the start of the previous close animation

      // Change the color of the current item
      homeValues.to(
        item,
        {
          color: "#C85204",
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      ); // Aligns with the header color change

      // Open the current sub-wrap
      homeValues.to(
        subItems[index],
        {
          height: "auto",
          opacity: 1,
          marginTop: "2em",
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        },
        "<"
      ); // Overlaps with the closing animation of the previous sub-wrap
    });
  }

  function initMarqueeScrollDirection() {
    document
      .querySelectorAll("[data-marquee-scroll-direction-target]")
      .forEach((marquee) => {
        // Query marquee elements
        const marqueeContent = marquee.querySelector(
          "[data-marquee-collection-target]"
        );
        const marqueeScroll = marquee.querySelector(
          "[data-marquee-scroll-target]"
        );
        if (!marqueeContent || !marqueeScroll) return;

        // Get data attributes
        const {
          marqueeSpeed: speed,
          marqueeDirection: direction,
          marqueeDuplicate: duplicate,
          marqueeScrollSpeed: scrollSpeed,
        } = marquee.dataset;

        // Convert data attributes to usable types
        const marqueeSpeedAttr = parseFloat(speed);
        const marqueeDirectionAttr = direction === "right" ? 1 : -1; // 1 for right, -1 for left
        const duplicateAmount = parseInt(duplicate || 0);
        const scrollSpeedAttr = parseFloat(scrollSpeed);
        const speedMultiplier =
          window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

        let marqueeSpeed =
          marqueeSpeedAttr *
          (marqueeContent.offsetWidth / window.innerWidth) *
          speedMultiplier;

        // Precompute styles for the scroll container
        marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
        marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

        // Duplicate marquee content
        if (duplicateAmount > 0) {
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < duplicateAmount; i++) {
            fragment.appendChild(marqueeContent.cloneNode(true));
          }
          marqueeScroll.appendChild(fragment);
        }

        // GSAP animation for marquee content
        const marqueeItems = marquee.querySelectorAll(
          "[data-marquee-collection-target]"
        );
        const animation = gsap
          .to(marqueeItems, {
            xPercent: -100, // Move completely out of view
            repeat: -1,
            duration: marqueeSpeed,
            ease: "linear",
          })
          .totalProgress(0.5);

        // Initialize marquee in the correct direction
        gsap.set(marqueeItems, {
          xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
        });
        animation.timeScale(marqueeDirectionAttr); // Set correct direction
        animation.play(); // Start animation immediately

        // Set initial marquee status
        marquee.setAttribute("data-marquee-status", "normal");

        // ScrollTrigger logic for direction inversion
        ScrollTrigger.create({
          trigger: marquee,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const isInverted = self.direction === 1; // Scrolling down
            const currentDirection = isInverted
              ? -marqueeDirectionAttr
              : marqueeDirectionAttr;

            // Update animation direction and marquee status
            animation.timeScale(currentDirection);
            marquee.setAttribute(
              "data-marquee-status",
              isInverted ? "normal" : "inverted"
            );
          },
        });

        // Extra speed effect on scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: marquee,
            start: "0% 100%",
            end: "100% 0%",
            scrub: 0,
          },
        });

        const scrollStart =
          marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
        const scrollEnd = -scrollStart;

        tl.fromTo(
          marqueeScroll,
          { x: `${scrollStart}vw` },
          { x: `${scrollEnd}vw`, ease: "none" }
        );
      });
  }

  initMarqueeScrollDirection();

  function checkCollectionItems() {
    const sectionKPI = document.querySelector(".section-kpi");
    const collectionList = document.querySelector(".marquee-advanced__scroll"); // Adjust the class to match your Webflow collection list

    if (collectionList && sectionKPI) {
      const visibleItems = collectionList.querySelectorAll(
        ".marquee-advanced__item:not([style*='display: none'])"
      );

      if (visibleItems.length === 0) {
        sectionKPI.style.display = "none"; // Hide section if no items are visible
      } else {
        sectionKPI.style.display = "block"; // Show section if items exist
      }
    }
  }

  // Run the check initially
  checkCollectionItems();

  // Run again if filters are applied (adjust according to your filter system)
  const observer = new MutationObserver(checkCollectionItems);
  observer.observe(document.querySelector(".marquee-advanced__scroll"), {
    childList: true,
    subtree: true,
  });
}
/* ------------- END OF CAREERS -------------- */


if (page === "blog") {
  const filters = document.querySelectorAll('.blog-category-field input[type="radio"]');
  const highlight = document.querySelector('.blog-highlight');

  filters.forEach(filter => {
      filter.addEventListener('change', function() {
          if (document.querySelector('.blog-category-field input[type="radio"]:checked')) {
              highlight.style.display = "none"; // Hide when any filter is checked
          } else {
              highlight.style.display = "flex"; // Show if no filter is selected
          }
      });
  });
  
}

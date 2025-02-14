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
  return response.text(); // Return the raw text content (Base64 string)
}

// Initialize and preload sounds
let hoverSound, clickSound;
let soundEnabled = sessionStorage.getItem("soundEnabled") === "true"; // Retrieve state

(async function preloadSounds() {
  try {
    // Replace these URLs with the URLs of your .txt files on Webflow
    const hoverSoundUrl =
      "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/6777d580f0bc14516e1541fc_hover-sound.txt";
    const clickSoundUrl =
      "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/678153d4aada1967690f015e_click.txt";

    const hoverBase64 = await fetchBase64(hoverSoundUrl);
    const clickBase64 = await fetchBase64(clickSoundUrl);

    hoverSound = new Audio(`data:audio/wav;base64,${hoverBase64}`);
    clickSound = new Audio(`data:audio/wav;base64,${clickBase64}`);

    // Add event listeners for hover and click sounds
    document.querySelectorAll("[hover-sound]").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        if (soundEnabled) {
          hoverSound.currentTime = 0; // Reset sound to the start
          hoverSound.play();
        }
      });
    });

    document.querySelectorAll("[click-sound]").forEach((element) => {
      element.addEventListener("click", () => {
        if (soundEnabled) {
          clickSound.currentTime = 0; // Reset sound to the start
          clickSound.play();
        }
      });
    });

    // Toggle sound button
    const soundBtn = document.querySelector(".sound-btn");
    const soundIcon = document.querySelector(".sound-icon"); // Lottie animation element

    if (soundBtn && soundIcon) {
      const lottieInstance = bodymovin.loadAnimation({
        container: soundIcon,
        renderer: "svg",
        loop: true,
        autoplay: soundEnabled, // Autoplay only if sound is enabled
        path: "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/67adf537fb7c431b8891109c_sound-lottie.json", // Update with your Lottie JSON file path
      });

      updateButtonState(soundBtn, lottieInstance, soundEnabled); // Update button state on page load

      soundBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled; // Toggle sound state
        sessionStorage.setItem("soundEnabled", soundEnabled); // Save state
        updateButtonState(soundBtn, lottieInstance, soundEnabled);
      });
    }
  } catch (error) {
    console.error("Error loading sounds:", error);
  }
})();

// Function to update button UI and control Lottie animation
function updateButtonState(button, lottieInstance, enabled) {
  if (enabled) {
    button.classList.add("active"); // Add class to indicate sound is on (optional styling)
    lottieInstance.play(); // Play Lottie animation
  } else {
    button.classList.remove("active");
    lottieInstance.stop(); // Stop Lottie animation
  }
}

/* Check Section Theme on Scroll */
function initCheckSectionThemeScroll() {
  // Get detection offset, in this case the navbar
  const navBarHeight = document.querySelector("[data-nav-bar-height]");
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;

  function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");

    themeSections.forEach(function (themeSection) {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      // If the offset is between the top & bottom of the current section
      if (
        themeSectionTop <= themeObserverOffset &&
        themeSectionBottom >= themeObserverOffset
      ) {
        // Check [data-theme-section]
        const themeSectionActive =
          themeSection.getAttribute("data-theme-section");
        document.querySelectorAll("[data-theme-nav]").forEach(function (elem) {
          if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
            elem.setAttribute("data-theme-nav", themeSectionActive);
          }
        });

        // Check [data-bg-section]
        const bgSectionActive = themeSection.getAttribute("data-bg-section");
        document.querySelectorAll("[data-bg-nav]").forEach(function (elem) {
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

  // Initial check and start listening for scroll
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
  const letters = link.querySelectorAll("[stagger-link-text] .word");
  link.addEventListener("mouseenter", function () {
    gsap.to(letters, {
      yPercent: -130,
      duration: 0.5,
      ease: "power4.inOut",
      stagger: { each: 0.05, from: "start" },
      overwrite: true,
    });
  });
  link.addEventListener("mouseleave", function () {
    gsap.to(letters, {
      yPercent: 0,
      duration: 0.4,
      ease: "power4.inOut",
      stagger: { each: 0.05, from: "end" },
    });
  });
});

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

/* Quick Links Reveal */
gsap.to(".quick-item", {
  y: "3em",
  duration: 0.3,
  stagger: 0.1,
  ease: "power2.in",
  scrollTrigger: {
    trigger: ".section_quick-links",
    start: "top 75%",
    end: "bottom 75%",
    onComplete: () => ScrollTrigger.refresh(),
  },
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
        //end: "bottom top",
        end: "+=200%",
        scrub: true,
        pin: true,
        //pinSpacing: false, // Prevents adding extra space after unpinning
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


/* ------------- END OF ALL -------------- */

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
        height: "6em",
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
}

/* ------------- END OF ABOUT -------------- */

/* ------------- CAREERS -------------- */

if (page === "careers") {
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

  // const fundsItems = document.querySelectorAll(".funds-item");

  // fundsItems.forEach((item, index) => {
  //   item.style.top = `${5 + index * 5}em`; // First item: 5em, Second: 10em, Third: 15em, etc.
  // });
}
/* ------------- END OF FUNDS -------------- */

if (page === "assets") {
  const stickyCards = () => {
    const panels = Array.from(document.querySelectorAll(".assets-item"));

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

if (page === "assets-detail") {
if (window.innerWidth > 991) {

  /* Custom Cursor */

  // Set the cursor position to follow the mouse
  gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

  let cursorX = gsap.quickTo(".cursor", "x", { duration: 0.5, ease: "power2" });
  let cursorY = gsap.quickTo(".cursor", "y", { duration: 0.5, ease: "power2" });

  window.addEventListener("mousemove", (e) => {
    cursorX(e.clientX);
    cursorY(e.clientY);
  });

  // Select all elements with the [data-cursor] attribute
  let links = document.querySelectorAll("[data-cursor]");
  let cursorText = document.querySelector(".cursor p"); // Select the <p> inside .cursor

  links.forEach((link) => {
    let text = link.getAttribute("data-cursor"); // Get the attribute value

    link.addEventListener("mouseenter", () => {
      cursorText.textContent = text; // Update the <p> text inside .cursor
    });

    link.addEventListener("mouseleave", () => {
      cursorText.textContent = ""; // Reset the text when the mouse leaves
    });
  });

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
      end: "bottom top",
      scrub: true,
      pin: true,
      //markers: true,
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
}
/* ------------- END OF CAREERS -------------- */

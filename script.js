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

    // Add event listeners after sounds are loaded
    document.querySelectorAll("[hover-sound]").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0; // Reset sound to the start
        hoverSound.play();
      });
    });

    document.querySelectorAll("[click-sound]").forEach((element) => {
      element.addEventListener("click", () => {
        clickSound.currentTime = 0; // Reset sound to the start
        clickSound.play();
      });
    });
  } catch (error) {
    console.error("Error loading sounds:", error);
  }
})();

/* Menu Open */
const menuBtn = document.querySelector('.menu-btn');
const navBg = document.querySelector('.nav-bg');
const navFill = document.querySelector('.nav-fill');
const navbar = document.querySelector('.navbar');

let menuOpen = false;

menuBtn.addEventListener('click', () => {
  if (!menuOpen) {
    navBg.style.display = 'block';
    gsap.to(navFill, {
      y: '0%',
      duration: 0.6,
      ease: 'power2.out',
      onStart: () => {
        navbar.style.mixBlendMode = 'normal';
      },
      onComplete: () => {
        menuOpen = true;
      }
    });
  } else {
    gsap.to(navFill, {
      y: '-100%',
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        navBg.style.display = 'none';
        navbar.style.mixBlendMode = 'difference';
        menuOpen = false;
      }
    });
  }
});


/* Buttons Hover */
let splitText;
function runSplit() {
  splitText = new SplitType("[stagger-link]", {
    types: "words, chars"
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
      overwrite: true
    });
  });
  link.addEventListener("mouseleave", function () {
    gsap.to(letters, {
      yPercent: 0,
      duration: 0.4,
      ease: "power4.inOut",
      stagger: { each: 0.05, from: "end" }
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
  }
});

gsap.to(indicator, {
  opacity: 0,
  duration: 0.5,
  scrollTrigger: {
    trigger: ".footer",
    start: "top bottom", // When the top of the footer touches the bottom of the viewport
    end: "top center",   // Fully fade out before footer is fully in view
    scrub: true,
    markers: true,
  }
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
    //markers: true,
    //toggleActions: "play reverse play reverse",
  },
});

/* ------------- END OF ALL -------------- */

/* ------------- HOME -------------- */
if (page === "home") {

gsap.registerPlugin(ScrollTrigger);

/* Homepage Hero Animation */
let heroImage = gsap.timeline({
  scrollTrigger: {
    trigger: ".home-hero-bg",
    start: "center center",
    end: "80% center",
    scrub: true,
    pin: true,
  },
});

heroImage.to(".home-hero-bg", {
  //width: "36em",
  //height: "100%",
  scale: 0.4,
  duration: 3,
  onComplete: () => ScrollTrigger.refresh(),
});

heroImage.to(
  ".home-hero-wrapper",
  {
    opacity: 0,
    duration: 1,
  },
  "-=3"
);

// heroImage.to(
//   ".nav-link",
//   {
//     color: "#03020C",
//     duration: 1,
//   },
//   "<"
// );

// heroImage.to(
//   ".logo-svg",
//   {
//     color: "#03020C",
//     duration: 1,
//   },
//   "<"
// );
// heroImage.to(
//   ".menu-btn",
//   {
//     color: "#03020C",
//     duration: 1,
//   },
//   "<"
// );
// heroImage.to(
//   ".sound-icon",
//   {
//     color: "#03020C",
//     duration: 1,
//   },
//   "<"
// );

// heroImage.to(
//   ".menu-btn",
//   {
//     borderColor: "#03020C",
//     duration: 1,
//   },
//   "<"
// );

// heroImage.to(
//   ".sound-btn",
//   {
//     borderColor: "#03020C",
//     duration: 1,
//   },
//   "<"
// );


/* Homepage Social Proof Horizontal Scroll */

let horizontalSections = gsap.utils.toArray(".section_social-proof");

horizontalSections.forEach((container) => {
  let sections = container.querySelectorAll(".social-proof-item");

  // Create the horizontal scroll animation
  let containerAnim = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
  });

  // Create the ScrollTrigger for the horizontal scrolling
  ScrollTrigger.create({
    trigger: container,
    animation: containerAnim,
    //pin: true,
    scrub: 1,
    start: "top center",
    //end: "+=3500",
    end: "bottom center",
    //markers: true,
  });

  // Animate each h3 based on scroll progress
  sections.forEach((section, index) => {
    let h3 = section.querySelector(".social-proof-h3");

    if (h3) {
      gsap.fromTo(
        h3,
        { fontSize: "6.25em" },
        {
          fontSize: "17em",
          scrollTrigger: {
            containerAnimation: containerAnim,
            trigger: section,
            start: "center right",
            end: "center center",
            scrub: true,
            // markers: {
            //   startColor: "green",
            //   endColor: "blue",
            //   fontSize: "12px",
            // },
          },
        }
      );
    }
  });
});

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

gsap.set(".home-values-item-sub-wrap", {
  height: 0,
  opacity: 0,
  margin: 0,
});

let homeValues = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_home-values",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    //markers: true,
  },
});

const items = document.querySelectorAll(".home-values-item-wrap");
const subItems = document.querySelectorAll(".home-values-item-sub-wrap");
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
  
  let fundsTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_funds",
      start: "top top",
      end: "bottom top",
      scrub: true,
      //pin: true,
      //markers: true,
    }
  });
  
  // Animate each item
  gsap.utils.toArray('.funds-item').forEach((item, index) => {
    let itemTl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top center",
        end: "bottom center",
        scrub: true,
        //pin: true,
      }
    });
  
    itemTl.to(item, {
      scale: 0.9,
      opacity: 0.5,
      duration: 1,
      ease: "power1.out",
    });
  });


}
/* ------------- END OF FUNDS -------------- */

/* ------------- CAREERS -------------- */

if (page === "sustainability") {

/* Sustainability Values Scroll Animation */

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

/* ------------- END OF CAREERS -------------- */

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
      "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/675c5386dd0b1d91f2ad9cae_hover-sound.txt";
    const clickSoundUrl =
      "https://cdn.prod.website-files.com/6756dbc5ed5ad48503f2c85a/675c460b9f9df14b91bcaade_click.txt";

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

heroImage.to(
  ".nav-link",
  {
    color: "#03020C",
    duration: 1,
  },
  "<"
);

heroImage.to(
  ".logo-svg",
  {
    color: "#03020C",
    duration: 1,
  },
  "<"
);
heroImage.to(
  ".menu-btn",
  {
    color: "#03020C",
    duration: 1,
  },
  "<"
);
heroImage.to(
  ".sound-icon",
  {
    color: "#03020C",
    duration: 1,
  },
  "<"
);

heroImage.to(
  ".menu-btn",
  {
    borderColor: "#03020C",
    duration: 1,
  },
  "<"
);

heroImage.to(
  ".sound-btn",
  {
    borderColor: "#03020C",
    duration: 1,
  },
  "<"
);

/* Menu on scroll color change */

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

/* Parallax animation for About Image */

const container = document.querySelector(".home-about-img-wrap");
const image = document.querySelector(".home-about-img");

const containerHeight = container.offsetHeight;
const imageHeight = image.offsetHeight;
const heightDifference = imageHeight - containerHeight;

// console.log('Height Difference:', heightDifference);

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

/* Quick Links Reveal */

gsap.to(".quick-item", {
  y: "3em",
  duration: 0.3,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".section_quick-links",
    start: "top 35%",
    end: "bottom 35%",
    //markers: true,
    //toggleActions: "play reverse play reverse",
  },
});

/* Footer Logo Reveal */

// gsap.set(".footer-logo", {y: "12em"});

// gsap.to(".footer-logo",
//   {
//     y: "0",
//     scrollTrigger: {
//       trigger: ".footer",
//       start: "top 35%",
//       end: "top 35%",
//       markers: true,
//     }
//   }
// );

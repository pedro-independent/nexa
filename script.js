/* GO BACK TO TOP ON REFRESH */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

/* SOUNDS */
  // Preload sound files
  const hoverSound = new Audio("URL_OF_YOUR_HOVER_SOUND_FILE");
  const clickSound = new Audio("URL_OF_YOUR_CLICK_SOUND_FILE");

  // Add event listeners for hover and click
  document.querySelectorAll('.hover-element').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0; // Reset sound to the start
      hoverSound.play();
    });
  });

  document.querySelectorAll('.click-element').forEach((element) => {
    element.addEventListener('click', () => {
      clickSound.currentTime = 0; // Reset sound to the start
      clickSound.play();
    });
  });


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
    onComplete: () => ScrollTrigger.refresh()
  });

heroImage.to(".home-hero-wrapper", {
    opacity: 0,
    duration: 1,
},"-=3");

/* Homepage Social Proof Horizontal Scroll */

let socialHeading = document.querySelectorAll(".social-proof-h3");

let scrollTrack = gsap.to(".menu-track", {
    x: "-200vw",
    ease: "none",
    scrollTrigger: {
      trigger: ".menu-track",
      //pin: true,
      scrub: true,
      start: "center 25%",
      end: "+=3500",
    },
  });

  socialHeading.forEach((item) => {
    gsap.fromTo(
      item,
      {
        fontSize: "10em", // Set the initial fontSize or other properties you want to animate from
      },
      {
        fontSize: "17em", // Set the final fontSize or other properties you want to animate to
        ease: "none",
        stagger: 0.7,
        scrollTrigger: {
          trigger: item.closest(".social-proof-item"),
          containerAnimation: scrollTrack,
          start: "left center",
          end: "right center",
          scrub: 1,
          markers: true,
        },
      }
    );
  });

gsap.fromTo(
    socialHeading,
    {
      fontSize: "3.125em",
    },
    {
      fontSize: "17em",
      ease: "none",
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".social-proof-wrap",
        containerAnimation: scrollTrack,
        start: "left 25%",
        end: "right center",
        scrub: 1,
        //markers: true,
      },
    }
  );
  
  
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
  
  document.querySelectorAll(".home-about-parallax-wrap").forEach((homeAboutImage) => {
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
gsap.to(".home-about-img", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
    trigger: ".home-about-img-wrap",
    start: "top 60%",
    end: "bottom 60%",
    scrub: true,
    //markers: true,
    },
    onComplete: () => ScrollTrigger.refresh(),
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
        homeValues.to(subItems[index - 1], {
            height: 0,
            opacity: 0,
            marginTop: 0,
            duration: 1,
            ease: "power2.inOut",
        }, ">"); // Starts when the next one begins opening

        homeValues.to(items[index - 1], {
            color: "#03020C", // Replace with your default color
            duration: 0.5,
            ease: "power2.out",
        }, "<"); // Aligns with the start of the closing animation

        homeValues.to(headers[index - 1], {
            color: "#03020C", // Replace with your default color
            duration: 0.5,
            ease: "power2.out",
        }, "<"); // Aligns with the item color reset
    }

    // Change the color of the current header
    homeValues.to(headers[index], {
        color: "#C85204",
        duration: 0.5,
        ease: "power2.out",
    }, "<"); // Aligns with the start of the previous close animation

    // Change the color of the current item
    homeValues.to(item, {
        color: "#C85204",
        duration: 0.5,
        ease: "power2.out",
    }, "<"); // Aligns with the header color change

    // Open the current sub-wrap
    homeValues.to(subItems[index], {
        height: "auto",
        opacity: 1,
        marginTop: "2em",
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => ScrollTrigger.refresh(),
    }, "<"); // Overlaps with the closing animation of the previous sub-wrap
});

/* Quick Links Reveal */

gsap.to(".quick-item", {
    y: "3em",
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".section_quick-links",
        start: "top 35%",
        end: "bottom 35%",
        //markers: true,
        toggleActions: "play reverse play reverse"
    }
});

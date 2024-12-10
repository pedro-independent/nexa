/* GO BACK TO TOP ON REFRESH */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

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

// let scrollTrack = gsap.to(".menu-track", {
//     scrollTrigger: {
//         trigger:".menu-wrap",
//         start:"top 5%",
//         end: "bottom 5%",
//         scrub: true,
//         invalidateOnRefresh:true,
//         //markers:true,
//         onUpdate: (self) => {
//                     gsap.to(".menu-track", {
//                         x: `${-200 * self.progress}vw`,
//                         duration: 0.5,
//                         ease: "power3.out"
//                      })
//             }
//     }
// })

let socialHeading = document.querySelectorAll(".social-proof-h3");

let scrollTrack = gsap.to(".menu-track", {
    x: "-200vw",
    ease: "none",
    scrollTrigger: {
      trigger: ".menu-track",
      //pin: true,
      scrub: true,
      start: "center center",
      end: "+=3500",
    },
  });

//   socialHeading.forEach((item) => {
//     gsap.to(item, {
//         ease: "none",
//         fontSize: "17em",
//         stagger: 0.7,
//       scrollTrigger: {
//         trigger: item.closest(".social-proof-item"),
//         containerAnimation: scrollTrack,
//         start: "left center",
//         end: "right center",
//         scrub: 1,
//         markers: true,
//       },
//     });
//   });

gsap.to(socialHeading, {
    ease: "none",
    fontSize: "17em",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".social-proof-wrap",
      containerAnimation: scrollTrack,
      start: "left 25%",
      end: "right center",
      scrub: 1,
      //markers: true,
    },
  });
  

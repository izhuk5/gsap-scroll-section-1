import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';

const config = {
  theme: 'dark',
  animate: true,
  snap: true,
  debug: false
};

let items;
let dimmerScrub;

const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.animate = config.animate;
  document.documentElement.dataset.snap = config.snap;
  document.documentElement.dataset.debug = config.debug;

  if (!config.animate) {
    dimmerScrub?.disable(true, false);
    gsap.set(items, { opacity: 1 });
  } else {
    gsap.set(items, { opacity: i => i !== 0 ? 0.2 : 1 });
    dimmerScrub?.enable(true, true);
  }
};

// backfill the scroll functionality with GSAP
if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
  gsap.registerPlugin(ScrollTrigger);

  // animate the items with GSAP if there's no CSS support
  items = gsap.utils.toArray('ul li');

  gsap.set(items, { opacity: i => i !== 0 ? 0.2 : 1 });

  const dimmer = gsap
    .timeline()
    .to(items.slice(1), {
      opacity: 1,
      stagger: 0.5
    })
    .to(
      items.slice(0, items.length - 1),
      {
        opacity: 0.2,
        stagger: 0.5
      },
      0
    );

  dimmerScrub = ScrollTrigger.create({
    trigger: items[0],
    endTrigger: items[items.length - 1],
    start: 'center center',
    end: 'center center',
    animation: dimmer,
    scrub: 0.2
  });
}

// run it
update();

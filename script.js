import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';

document.addEventListener('DOMContentLoaded', () => {
  const config = {
    animate: true,
    snap: true
  };

  let items;
  let dimmerScrub;

  const update = () => {
    document.documentElement.dataset.animate = config.animate;
    document.documentElement.dataset.snap = config.snap;

    if (!config.animate) {
      dimmerScrub?.disable(true, false);
      gsap.set(items, { opacity: 1 });
    } else {
      gsap.set(items, { opacity: i => i !== 0 ? 0.2 : 0.2 });
      dimmerScrub?.enable(true, true);
    }
  };

  // backfill the scroll functionality with GSAP
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    gsap.registerPlugin(ScrollTrigger);

    // animate the items with GSAP if there's no CSS support
    items = gsap.utils.toArray('.craft_list .craft_item');

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
  update();
});

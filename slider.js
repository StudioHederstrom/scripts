
let splitType = new SplitType(".slider_cms_title", {
  types: "words, chars",
  tagName: "span"
});

$(".slider_wrap").each(function () {
  let childArrow = $(this).find(".slider_btn");
  let childItems = $(this).find(".slider_cms_item").hide();
  let childDots = $(this).find(".slider_dot_item");
  let totalSlides = childItems.length;
  let activeIndex = 0;

  childItems.first().css("display", "flex");
  gsap.set(childDots.eq(0).find(".slider_dot_line"), { x: "0%" });

  // DOT LINES
  let tl2 = gsap.timeline({ repeat: -1 });
  childDots.each(function (index) {
    tl2.addLabel(`step${index}`);
    tl2.to($(this).find(".slider_dot_line"), {
      scaleX: "1.0",
      ease: "none"
    });
  });

  // MAIN SLIDER CODE
  function moveSlide(nextIndex, forwards) {
    let tl3 = gsap.timeline();
    tl3.set(childDots.eq(nextIndex).find(".slider_dot_line"), { x: "0%" });
    tl3.fromTo(childDots.eq(activeIndex).find(".slider_dot_line"), { x: "0%" }, { x: "100%" });

    tl2.seek(`step${nextIndex}`);

    let titleFrom = -100;
    let titleDelay = "<";
    if (forwards) {
      titleFrom = 100;
      titleDelay = "<50%";
    }

    childItems.hide();
    let prevItem = childItems.eq(activeIndex).css("display", "flex");
    let nextItem = childItems.eq(nextIndex).css("display", "flex");
    let tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.inOut" } });
    if (forwards) {
      tl.fromTo(nextItem, { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, -30% 100%)" });
      tl.fromTo(prevItem, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 0% 0%, -30% 100%, 0% 100%)" }, "<");
    } else {
      tl.fromTo(nextItem, { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 130% 100%, 0% 100%)" });
      tl.fromTo(prevItem, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 130% 100%)" }, "<");
    }

    tl.fromTo(nextItem.find(".slider_cms_title .char"), { yPercent: titleFrom }, { yPercent: 0, duration: 0.5, stagger: { amount: 0.5 } }, titleDelay);

    activeIndex = nextIndex;
  }

  // ARROWS
  function goNext(num) {
    let nextIndex = num;
    if (nextIndex > totalSlides - 1) nextIndex = 0;
    moveSlide(nextIndex, true);
  }

  // go next
  childArrow.filter(".is-next").on("click", function () {
    goNext(activeIndex + 1);
  });

  // go prev
  childArrow.filter(".is-prev").on("click", function () {
    let nextIndex = activeIndex - 1;
    if (nextIndex < 0) nextIndex = totalSlides - 1;
    moveSlide(nextIndex, false);
  });

  // CLICK OF DOTS
  childDots.on("click", function () {
    let dotIndex = $(this).index();
    if (activeIndex > dotIndex) {
      moveSlide(dotIndex, false);
    } else if (activeIndex < dotIndex) {
      moveSlide(dotIndex, true);
    }
  });

  // Debounce function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// SCROLL WHEEL CONTROL
let isScrolling = false;
$(this).on("wheel", function (event) {
  if (isScrolling) return;

  isScrolling = true;
  setTimeout(function () {
    isScrolling = false;
  }, 1000); // Assuming slide transition takes 1 second

  event.preventDefault();
  if (event.originalEvent.deltaY < 0) {
    // Scroll up
    let nextIndex = activeIndex - 1;
    if (nextIndex < 0) nextIndex = totalSlides - 1;
    moveSlide(nextIndex, false);
  } else {
    // Scroll down
    goNext(activeIndex + 1);
  }
});
// CHECKING FOR UPDATE

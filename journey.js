(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || document.documentElement.classList.contains("a11y-reduce-motion")
    || document.body.classList.contains("a11y-reduce-motion");

  if (!reduceMotion) document.documentElement.classList.add("journey-arrived");
})();

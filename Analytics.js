// analytics.js: shared tracking for the ENGR 170 self-guided lectures.
// Each page needs only: <script defer src="analytics.js"></script>
(function () {
  const SITE_ID = '249fb28c-931c-4a2f-b359-428486ef51b0';   // paste from your Umami dashboard

  // Load the Umami script (counts page views automatically)
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.dataset.websiteId = SITE_ID;
  document.head.appendChild(s);

  function track(name, data) {
    if (window.umami) window.umami.track(name, data);
  }

  // Pages without a solver (like index.html) stop here
  if (typeof window.render !== 'function') return;

  // Every solver advances by calling render() with a new value of `stage`,
  // so wrap render() and log an event whenever the step changes.
  const lecture = document.title;
  const total = stages.length;
  let last = stage;
  let done = false;
  const original = window.render;
  window.render = function () {
    original.apply(this, arguments);
    if (stage !== last) {
      last = stage;
      track('step', { lecture: lecture, step: stage + 1, of: total });
      if (stage === total - 1 && !done) { done = true; track('finished', { lecture: lecture }); }
    }
  };
})();
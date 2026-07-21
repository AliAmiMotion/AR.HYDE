const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach(item => revealObserver.observe(item));

const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function formatValue(value) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

const statsSection = document.querySelector("#stats");

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || countersStarted) return;
      countersStarted = true;

      counters.forEach(counter => {
        const target = Number(counter.dataset.value);
        const suffix = counter.dataset.suffix || "";
        const duration = 1300;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          counter.textContent = `${formatValue(current)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = `${formatValue(target)}${suffix}`;
          }
        }

        requestAnimationFrame(update);
      });

      counterObserver.disconnect();
    });
  },
  { threshold: 0.35 }
);

if (statsSection) counterObserver.observe(statsSection);

document.getElementById("year").textContent = new Date().getFullYear();

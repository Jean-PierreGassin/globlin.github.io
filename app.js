(() => {
  const revealNodes = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('visible'));
  }

  const countNodes = document.querySelectorAll('[data-count]');
  const runCount = (node) => {
    const target = Number(node.getAttribute('data-count'));
    if (!Number.isFinite(target) || target <= 0) {
      return;
    }

    const original = node.textContent || '';
    const hasSeconds = original.includes('s');
    const hasRange = original.includes('-');
    const hasRealmLabel = original.includes('realm');

    if (hasRange) {
      node.textContent = original;
      return;
    }

    const startAt = performance.now();
    const duration = 900;

    const step = (now) => {
      const elapsed = now - startAt;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.max(1, Math.round(target * eased));

      if (hasSeconds) {
        node.textContent = `${value}s`;
      } else if (hasRealmLabel) {
        node.textContent = `${value} realms`;
      } else {
        node.textContent = String(value);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    countNodes.forEach((node) => counterObserver.observe(node));
  } else {
    countNodes.forEach(runCount);
  }
})();

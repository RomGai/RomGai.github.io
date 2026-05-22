document.getElementById("year").textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function smoothScrollTo(target) {
  const header = document.querySelector(".site-header");
  const headerOffset = header ? header.offsetHeight + 16 : 0;
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  const distance = end - start;
  const duration = prefersReducedMotion ? 0 : 240;
  const startedAt = performance.now();

  if (!duration) {
    window.scrollTo(0, end);
    return;
  }

  function step(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, start + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  step(startedAt + 8);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");

    if (!hash || hash === "#") {
      return;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    event.preventDefault();
    smoothScrollTo(target);
    history.pushState(null, "", hash);
  });
});

const bibtexDialog = document.getElementById("bibtex-dialog");
const bibtexContent = document.getElementById("bibtex-content");
const copyBibtex = document.getElementById("copy-bibtex");

document.querySelectorAll(".bibtex-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const template = document.getElementById(button.dataset.bibtexId);

    if (!template || !bibtexDialog || !bibtexContent) {
      return;
    }

    bibtexContent.textContent = template.content.textContent.trim();
    copyBibtex.textContent = "Copy";
    bibtexDialog.showModal();
  });
});

document.querySelector(".dialog-close")?.addEventListener("click", () => {
  bibtexDialog.close();
});

bibtexDialog?.addEventListener("click", (event) => {
  if (event.target === bibtexDialog) {
    bibtexDialog.close();
  }
});

copyBibtex?.addEventListener("click", async () => {
  const text = bibtexContent.textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyBibtex.textContent = "Copied";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(bibtexContent);
    selection.removeAllRanges();
    selection.addRange(range);
    copyBibtex.textContent = "Selected";
  }
});

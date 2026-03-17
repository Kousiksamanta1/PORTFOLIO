const bootLines = [
  "Mounting encrypted evidence archive...",
  "Verifying operator credentials...",
  "Loading red team tradecraft modules...",
  "Parsing command-and-control telemetry...",
  "Indexing incident replay snapshots...",
  "Synchronizing covert access playbooks...",
  "Hardening secure transmission channel...",
  "Finalizing dossier integrity checks...",
];

const body = document.body;
const bootScreen = document.getElementById("boot-screen");
const bootLog = document.getElementById("boot-log");
const bootProgress = document.getElementById("boot-progress");
const bootProgressValue = document.getElementById("boot-progress-value");
const bootClock = document.getElementById("boot-clock");
const navToggle = document.getElementById("nav-toggle");
const navBackdrop = document.getElementById("nav-backdrop");
const fileSidebar = document.getElementById("file-sidebar");
const paletteToggle = document.getElementById("palette-toggle");
const sidebarPaletteToggle = document.getElementById("sidebar-palette-toggle");
const commandPalette = document.getElementById("command-palette");
const commandPaletteInput = document.getElementById("command-palette-input");
const commandPaletteList = document.getElementById("command-palette-list");
const commandPaletteClose = document.getElementById("command-palette-close");
const commandForm = document.getElementById("command-form");
const commandInput = document.getElementById("command-input");
const commandLog = document.getElementById("command-log");
const transmissionForm = document.getElementById("transmission-form");
const transmissionLog = document.getElementById("transmission-log");
const transmissionSubmit = document.getElementById("transmission-submit");
const directoryLinks = document.querySelectorAll("[data-section-link]");
const revealItems = document.querySelectorAll(".reveal");
const dossierCards = document.querySelectorAll(".dossier-card");
const decryptCopy = document.getElementById("decrypt-copy");
const sections = document.querySelectorAll("main section[id]");
const motionItems = document.querySelectorAll("[data-motion-depth]");
const copyActions = document.querySelectorAll(".copy-action");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let paletteResults = [];
let paletteSelectedIndex = 0;
let activeSectionId = "";
let isScrollFrameQueued = false;

body.classList.add("booting");

function formatClock() {
  const now = new Date();
  return `${String(now.getUTCHours()).padStart(2, "0")}:${String(
    now.getUTCMinutes()
  ).padStart(2, "0")}:${String(now.getUTCSeconds()).padStart(2, "0")} UTC`;
}

function appendBootLine(line, index) {
  const entry = document.createElement("div");
  entry.className = "boot-line";
  entry.innerHTML = `
    <span class="boot-line__time">[${formatClock()}]</span>
    <span>${line}</span>
  `;
  bootLog.appendChild(entry);

  const progress = Math.min(100, Math.round(((index + 1) / bootLines.length) * 100));
  bootProgress.style.width = `${progress}%`;
  bootProgressValue.textContent = `${progress}%`;
  bootLog.scrollTop = bootLog.scrollHeight;
}

function finishBootSequence() {
  bootScreen.classList.add("is-hidden");
  body.classList.remove("booting");
}

function runBootSequence() {
  bootClock.textContent = formatClock();
  const intervalMs = 230;

  bootLines.forEach((line, index) => {
    window.setTimeout(() => {
      bootClock.textContent = formatClock();
      appendBootLine(line, index);
    }, index * intervalMs);
  });

  window.setTimeout(finishBootSequence, 2100);
}

function setSidebarOpen(isOpen) {
  if (!navToggle || !navBackdrop || !fileSidebar) {
    return;
  }

  fileSidebar.classList.toggle("translate-x-full", !isOpen);
  navBackdrop.classList.toggle("hidden", !isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

function addTransmissionLine(text) {
  const line = document.createElement("p");
  line.className = "terminal-output-line";
  line.textContent = text;
  transmissionLog.appendChild(line);
}

function setTransmissionSubmitting(isSubmitting) {
  if (!transmissionSubmit) {
    return;
  }

  transmissionSubmit.disabled = isSubmitting;
  transmissionSubmit.textContent = isSubmitting ? "Transmitting..." : "Send Transmission";
}

function appendCommandLine(text) {
  if (!commandLog) {
    return;
  }

  const line = document.createElement("p");
  line.className = "terminal-output-line";
  line.textContent = text;
  commandLog.appendChild(line);

  while (commandLog.children.length > 8) {
    commandLog.removeChild(commandLog.firstElementChild);
  }

  commandLog.scrollTop = commandLog.scrollHeight;
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }

  section.scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start",
  });

  if (window.innerWidth < 768) {
    setSidebarOpen(false);
  }
}

function navigateToSection(sectionId, label) {
  scrollToSection(sectionId);
  appendCommandLine(`> Routing :: ${label}`);
}

function setCopyButtonState(button, text) {
  if (!button) {
    return;
  }

  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = button.textContent.trim();
  }

  if (button._restoreTimer) {
    window.clearTimeout(button._restoreTimer);
  }

  button.textContent = text;
  button.classList.add("is-copied");
  button._restoreTimer = window.setTimeout(() => {
    button.textContent = button.dataset.defaultLabel || "Copy";
    button.classList.remove("is-copied");
  }, 1600);
}

async function copyToClipboard(value, label, button) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const fallbackInput = document.createElement("textarea");
      fallbackInput.value = value;
      fallbackInput.setAttribute("readonly", "");
      fallbackInput.style.position = "absolute";
      fallbackInput.style.left = "-9999px";
      document.body.appendChild(fallbackInput);
      fallbackInput.select();
      document.execCommand("copy");
      fallbackInput.remove();
    }

    setCopyButtonState(button, "Copied");
    appendCommandLine(`> Clipboard :: ${label} copied.`);
    return true;
  } catch {
    setCopyButtonState(button, "Failed");
    appendCommandLine(`> Clipboard :: Could not copy ${label.toLowerCase()}.`);
    return false;
  }
}

function initReveals() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initTouchDossiers() {
  const shouldUseTapMode = window.matchMedia(
    "(hover: none), (pointer: coarse), (max-width: 767px)"
  ).matches;

  if (!shouldUseTapMode) {
    return;
  }

  if (decryptCopy) {
    decryptCopy.textContent = "Tap to decrypt cyber project dossiers.";
  }

  dossierCards.forEach((card) => {
    const lockText = card.querySelector(".dossier-lock__text");
    const stamp = card.querySelector(".dossier-lock__stamp");

    if (lockText) {
      lockText.textContent = "Tap To Decrypt";
      lockText.setAttribute("data-text", "Tap To Decrypt");
    }

    if (stamp) {
      stamp.textContent = "Tap To Unlock";
    }

    card.addEventListener("click", () => {
      card.classList.toggle("is-unlocked");
    });
  });
}

const commands = [
  {
    id: "help",
    label: "Help",
    description: "Show the available navigation and utility commands.",
    query: "help",
    aliases: ["commands", "?"],
    run() {
      appendCommandLine(
        "> Commands :: operator, about, arsenal, projects, contact, copy email, copy linkedin, copy github, cv."
      );
    },
  },
  {
    id: "operator",
    label: "Open Operator",
    description: "Jump to the hero dossier section.",
    query: "operator",
    aliases: ["hero", "home"],
    run() {
      navigateToSection("hero", "/root/operator");
    },
  },
  {
    id: "about",
    label: "Open About",
    description: "Jump to the personnel bio section.",
    query: "about",
    aliases: ["about_me", "bio"],
    run() {
      navigateToSection("about", "/root/about_me");
    },
  },
  {
    id: "arsenal",
    label: "Open Arsenal",
    description: "Jump to the cyber capability readout.",
    query: "arsenal",
    aliases: ["skills", "stack"],
    run() {
      navigateToSection("arsenal", "/root/arsenal");
    },
  },
  {
    id: "projects",
    label: "Open Projects",
    description: "Jump to the classified project dossiers.",
    query: "projects",
    aliases: ["project", "portfolio", "investigations"],
    run() {
      navigateToSection("investigations", "/root/investigations");
    },
  },
  {
    id: "contact",
    label: "Open Contact",
    description: "Jump to the transmission terminal section.",
    query: "contact",
    aliases: ["transmission", "reach"],
    run() {
      navigateToSection("contact", "/root/transmission");
    },
  },
  {
    id: "copy-email",
    label: "Copy Email",
    description: "Copy the portfolio email address.",
    query: "copy email",
    aliases: ["email", "mail"],
    run() {
      copyToClipboard("kousik83@gmail.com", "Email");
    },
  },
  {
    id: "copy-linkedin",
    label: "Copy LinkedIn",
    description: "Copy the LinkedIn profile URL.",
    query: "copy linkedin",
    aliases: ["linkedin"],
    run() {
      copyToClipboard(
        "https://www.linkedin.com/in/kousik-samanta-b4736428a",
        "LinkedIn"
      );
    },
  },
  {
    id: "copy-github",
    label: "Copy GitHub",
    description: "Copy the GitHub profile URL.",
    query: "copy github",
    aliases: ["github"],
    run() {
      copyToClipboard("https://github.com/Kousiksamanta1", "GitHub");
    },
  },
  {
    id: "cv",
    label: "Open CV",
    description: "Open the downloadable CV dossier.",
    query: "cv",
    aliases: ["resume", "download cv"],
    run() {
      window.open("./MAIN%20CV.pdf", "_blank", "noopener,noreferrer");
      appendCommandLine("> Routing :: Opening CV dossier.");
    },
  },
];

function normalizeCommandInput(value) {
  return value.trim().toLowerCase().replace(/^\/+/, "").replace(/^go\s+/, "");
}

function getCommandTerms(command) {
  return [command.query, command.label, command.description, ...command.aliases]
    .join(" ")
    .toLowerCase();
}

function findCommand(query) {
  const normalized = normalizeCommandInput(query);
  if (!normalized) {
    return null;
  }

  const exactMatch = commands.find((command) => {
    const variants = [command.query, ...command.aliases].map((item) =>
      item.toLowerCase()
    );
    return variants.includes(normalized);
  });

  if (exactMatch) {
    return exactMatch;
  }

  return (
    commands.find((command) =>
      getCommandTerms(command).includes(normalized)
    ) || null
  );
}

function executeCommand(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    return;
  }

  appendCommandLine(`> ${input}`);
  const command = findCommand(input);

  if (!command) {
    appendCommandLine("> Unknown command. Type `help` to list valid routes.");
    return;
  }

  command.run();
}

function renderCommandPaletteResults(filter = "") {
  if (!commandPaletteList) {
    return;
  }

  const normalizedFilter = filter.trim().toLowerCase();
  paletteResults = commands.filter((command) =>
    !normalizedFilter || getCommandTerms(command).includes(normalizedFilter)
  );
  paletteSelectedIndex = 0;

  commandPaletteList.innerHTML = "";

  if (paletteResults.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "command-palette__item";
    emptyState.innerHTML = `
      <div>
        <strong>No Match</strong>
        <span>Try \`help\`, \`projects\`, \`contact\`, or a copy command.</span>
      </div>
      <span class="command-palette__shortcut">---</span>
    `;
    commandPaletteList.appendChild(emptyState);
    return;
  }

  paletteResults.forEach((command, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "command-palette__item";
    if (index === paletteSelectedIndex) {
      item.classList.add("is-selected");
    }

    item.innerHTML = `
      <div>
        <strong>${command.label}</strong>
        <span>${command.description}</span>
      </div>
      <span class="command-palette__shortcut">${command.query}</span>
    `;

    item.addEventListener("click", () => {
      closeCommandPalette();
      executeCommand(command.query);
    });

    commandPaletteList.appendChild(item);
  });
}

function refreshPaletteSelection() {
  if (!commandPaletteList) {
    return;
  }

  const items = commandPaletteList.querySelectorAll(".command-palette__item");
  items.forEach((item, index) => {
    item.classList.toggle("is-selected", index === paletteSelectedIndex);
  });
}

function openCommandPalette(initialValue = "") {
  if (!commandPalette || !commandPaletteInput) {
    return;
  }

  commandPalette.classList.remove("hidden");
  commandPalette.setAttribute("aria-hidden", "false");
  body.classList.add("palette-open");
  commandPaletteInput.value = initialValue;
  renderCommandPaletteResults(initialValue);
  window.setTimeout(() => commandPaletteInput.focus(), 0);
}

function closeCommandPalette() {
  if (!commandPalette) {
    return;
  }

  commandPalette.classList.add("hidden");
  commandPalette.setAttribute("aria-hidden", "true");
  body.classList.remove("palette-open");
}

function setActiveSection(sectionId) {
  if (!sectionId || activeSectionId === sectionId) {
    return;
  }

  activeSectionId = sectionId;
  directoryLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveSection() {
  if (!sections.length) {
    return;
  }

  const scanLine = window.scrollY + window.innerHeight * 0.32;
  let nextActiveSection = sections[0].id;

  sections.forEach((section) => {
    if (section.offsetTop <= scanLine) {
      nextActiveSection = section.id;
    }
  });

  setActiveSection(nextActiveSection);
}

function updateScrollMotion() {
  if (prefersReducedMotion.matches) {
    motionItems.forEach((item) => {
      item.style.removeProperty("--motion-offset");
      item.style.removeProperty("opacity");
    });
    return;
  }

  motionItems.forEach((item) => {
    const depth = Number(item.dataset.motionDepth || 0);
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = (itemCenter - viewportCenter) / window.innerHeight;
    const offset = Math.max(-depth, Math.min(depth, distance * -depth));
    const opacity = Math.max(0.86, 1 - Math.abs(distance) * 0.2);

    item.style.setProperty("--motion-offset", `${offset.toFixed(2)}px`);
    item.style.opacity = opacity.toFixed(3);
  });
}

function handleScrollEffects() {
  if (isScrollFrameQueued) {
    return;
  }

  isScrollFrameQueued = true;
  window.requestAnimationFrame(() => {
    updateActiveSection();
    updateScrollMotion();
    isScrollFrameQueued = false;
  });
}

runBootSequence();
initReveals();
initTouchDossiers();
updateActiveSection();
updateScrollMotion();
renderCommandPaletteResults();

navToggle?.addEventListener("click", () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  setSidebarOpen(!isExpanded);
});

navBackdrop?.addEventListener("click", () => {
  setSidebarOpen(false);
});

directoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  });
});

[paletteToggle, sidebarPaletteToggle].forEach((trigger) => {
  trigger?.addEventListener("click", () => {
    openCommandPalette();
  });
});

commandPaletteClose?.addEventListener("click", () => {
  closeCommandPalette();
});

commandPalette?.addEventListener("click", (event) => {
  const target = event.target;
  if (
    target instanceof HTMLElement &&
    (target.hasAttribute("data-palette-close") || target === commandPalette)
  ) {
    closeCommandPalette();
  }
});

commandPaletteInput?.addEventListener("input", (event) => {
  const target = event.target;
  renderCommandPaletteResults(target instanceof HTMLInputElement ? target.value : "");
});

commandPaletteInput?.addEventListener("keydown", (event) => {
  if (!paletteResults.length) {
    if (event.key === "Escape") {
      closeCommandPalette();
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    paletteSelectedIndex = (paletteSelectedIndex + 1) % paletteResults.length;
    refreshPaletteSelection();
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    paletteSelectedIndex =
      (paletteSelectedIndex - 1 + paletteResults.length) % paletteResults.length;
    refreshPaletteSelection();
  }

  if (event.key === "Enter") {
    event.preventDefault();
    closeCommandPalette();
    executeCommand(paletteResults[paletteSelectedIndex].query);
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeCommandPalette();
  }
});

commandForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!(commandInput instanceof HTMLInputElement)) {
    return;
  }

  const value = commandInput.value.trim();
  if (!value) {
    return;
  }

  executeCommand(value);
  commandForm.reset();
});

copyActions.forEach((button) => {
  button.addEventListener("click", () => {
    copyToClipboard(button.dataset.copy || "", button.dataset.copyName || "Value", button);
  });
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (commandPalette?.classList.contains("hidden")) {
      openCommandPalette();
    } else {
      closeCommandPalette();
    }
    return;
  }

  if (
    event.key === "/" &&
    !isTypingTarget(document.activeElement) &&
    commandPalette?.classList.contains("hidden")
  ) {
    event.preventDefault();
    openCommandPalette();
    return;
  }

  if (event.key === "Escape" && commandPalette && !commandPalette.classList.contains("hidden")) {
    closeCommandPalette();
  }
});

window.addEventListener("scroll", handleScrollEffects, { passive: true });
window.addEventListener("resize", handleScrollEffects);

if (typeof prefersReducedMotion.addEventListener === "function") {
  prefersReducedMotion.addEventListener("change", handleScrollEffects);
} else if (typeof prefersReducedMotion.addListener === "function") {
  prefersReducedMotion.addListener(handleScrollEffects);
}

transmissionForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(transmissionForm);
  const operator = String(formData.get("name") || "UNKNOWN").trim().toUpperCase();
  const channel = String(formData.get("email") || "").trim();
  const brief = String(formData.get("message") || "").trim();
  const endpoint = transmissionForm.action;

  transmissionLog.innerHTML = "";
  addTransmissionLine("> Establishing encrypted uplink...");

  if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
    addTransmissionLine("> STATUS :: Delivery route not configured.");
    addTransmissionLine("> ACTION :: Create a Formspree form and replace YOUR_FORM_ID.");
    addTransmissionLine("> TARGET :: New submissions will then reach your inbox and dashboard.");
    return;
  }

  setTransmissionSubmitting(true);

  window.setTimeout(() => {
    addTransmissionLine(`> AUTH OK :: ${operator || "UNKNOWN"} validated.`);
  }, 120);
  window.setTimeout(() => {
    addTransmissionLine(`> ROUTE :: ${channel} queued on secure relay.`);
  }, 240);
  window.setTimeout(() => {
    addTransmissionLine(`> BRIEF :: ${brief.slice(0, 72)}${brief.length > 72 ? "..." : ""}`);
  }, 360);

  fetch(endpoint, {
    method: transmissionForm.method || "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then(async (response) => {
      if (response.ok) {
        addTransmissionLine("> STATUS :: Transmission delivered successfully.");
        addTransmissionLine("> CONFIRM :: Check your Formspree dashboard or inbox notification.");
        transmissionForm.reset();
        return;
      }

      const data = await response.json().catch(() => null);
      const errorMessage =
        data && Array.isArray(data.errors) && data.errors.length > 0
          ? data.errors.map((error) => error.message).join(", ")
          : "Form submission failed.";
      addTransmissionLine(`> ERROR :: ${errorMessage}`);
    })
    .catch(() => {
      addTransmissionLine("> ERROR :: Network issue or blocked request.");
    })
    .finally(() => {
      setTransmissionSubmitting(false);
    });
});

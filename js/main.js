const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HOURS = {
  Sun: { open: 9 * 60, close: 24 * 60 },
  Mon: { open: 7 * 60, close: 26 * 60 },
  Tue: { open: 7 * 60, close: 24 * 60 },
  Wed: { open: 7 * 60, close: 24 * 60 },
  Thu: { open: 7 * 60, close: 24 * 60 },
  Fri: { open: 7 * 60, close: 26 * 60 },
  Sat: { open: 9 * 60, close: 26 * 60 },
};

export function formatMinutes(total) {
  const mins = ((total % 1440) + 1440) % 1440;
  if (mins === 0) return "midnight";
  let hour = Math.floor(mins / 60);
  const minute = mins % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  if (minute === 0) return `${hour} ${suffix}`;
  return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function nextDay(day) {
  return DAY_ORDER[(DAY_ORDER.indexOf(day) + 1) % 7];
}

function prevDay(day) {
  return DAY_ORDER[(DAY_ORDER.indexOf(day) + 6) % 7];
}

export function partsInNewYork(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const grab = (type) => parts.find((part) => part.type === type)?.value ?? "";
  let hour = Number(grab("hour"));
  if (hour === 24) hour = 0;
  return {
    day: grab("weekday").replace(".", ""),
    minutes: hour * 60 + Number(grab("minute")),
  };
}

export function loungeStatus(date = new Date()) {
  const { day, minutes } = partsInNewYork(date);
  const yesterday = prevDay(day);
  const spill = HOURS[yesterday].close - 1440;
  if (spill > 0 && minutes < spill) {
    return {
      open: true,
      day,
      label: `Open now · until ${formatMinutes(HOURS[yesterday].close)}`,
    };
  }
  const today = HOURS[day];
  if (minutes >= today.open && minutes < Math.min(today.close, 1440)) {
    return {
      open: true,
      day,
      label: `Open now · until ${formatMinutes(today.close)}`,
    };
  }
  if (minutes < today.open) {
    return {
      open: false,
      day,
      label: `Closed · opens ${formatMinutes(today.open)}`,
    };
  }
  const tomorrow = nextDay(day);
  return {
    open: false,
    day,
    label: `Closed · opens ${tomorrow} ${formatMinutes(HOURS[tomorrow].open)}`,
  };
}

function init() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");
  const label = toggle?.querySelector(".nav-toggle-label");

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    if (label) label.textContent = open ? "Close" : "Menu";
  }

  toggle?.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) {
      setMenu(false);
      toggle?.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) setMenu(false);
  });

  try {
    const status = loungeStatus();
    document.querySelectorAll("[data-hours-status]").forEach((el) => {
      el.hidden = false;
      el.dataset.state = status.open ? "open" : "closed";
      const text = el.querySelector("[data-hours-text]");
      if (text) text.textContent = status.label;
    });
    const row = document.querySelector(`[data-day="${status.day}"]`);
    if (row) {
      row.classList.add("is-today");
      const heading = row.querySelector("th");
      if (heading && !heading.querySelector(".today-flag")) {
        const flag = document.createElement("span");
        flag.className = "today-flag";
        flag.textContent = "Today";
        heading.append(flag);
      }
    }
  } catch {
    // The hours table stays readable if the clock lookup fails.
  }

  const revealables = document.querySelectorAll(".reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && revealables.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) return;
      el.classList.add("will-reveal");
      observer.observe(el);
    });
  }

  const sectionLinks = [...document.querySelectorAll("[data-nav]")];
  const byId = new Map(sectionLinks.map((link) => [link.getAttribute("href").slice(1), link]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((item) => item.removeAttribute("aria-current"));
          byId.get(entry.target.id)?.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -48% 0px", threshold: 0 }
    );
    sections.forEach((section) => current.observe(section));
  }
}

if (typeof document !== "undefined") init();

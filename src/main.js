import "./styles.css";
import { siteContent } from "./content.js";
import { initAnimations } from "./animations.js";

const app = document.querySelector("#app");

const formatCurrency = (value) =>
  `${new Intl.NumberFormat("tr-TR").format(value)} TL`;

const heroPanelMarkup = siteContent.hero.panelItems
  .map(
    (item) => `
      <div class="hero-panel-card">
        <small>${item.label}</small>
        <strong>${item.value}</strong>
      </div>
    `
  )
  .join("");

const frameMarkup = siteContent.frames
  .map(
    (frame, index) => `
      <figure
        class="story-frame"
        data-story-frame
        data-frame-asset
        data-frame-id="${frame.id}"
        data-enter-scale="${frame.enterScale}"
        data-exit-scale="${frame.exitScale}"
        data-enter-y="${frame.enterY}"
        data-exit-y="${frame.exitY}"
        data-enter-blur="${frame.enterBlur}"
        data-exit-blur="${frame.exitBlur}"
        aria-hidden="${index === 0 ? "false" : "true"}"
      >
        <img
          class="story-frame__image"
          data-frame-image
          src="${frame.src}"
          alt="${frame.alt}"
          loading="${index < 2 ? "eager" : "lazy"}"
          decoding="async"
          fetchpriority="${index === 0 ? "high" : "auto"}"
        />
        <span class="story-frame__placeholder">
          Görsel yerleştirilmedi
          <small>${frame.fileName}</small>
        </span>
      </figure>
    `
  )
  .join("");

const frameCaptionMarkup = siteContent.frames
  .map(
    (frame, index) => `
      <article
        class="frame-caption glass-panel"
        data-frame-caption
        aria-hidden="${index === 0 ? "false" : "true"}"
      >
        <span class="frame-caption__step">${frame.stepLabel}</span>
        <h3>${frame.title}</h3>
        <p>${frame.description}</p>
      </article>
    `
  )
  .join("");

const frameListMarkup = siteContent.frames
  .map(
    (frame) => `
      <article class="frame-list-card glass-panel" data-reveal>
        <div class="frame-list-card__media" data-frame-asset data-frame-id="${frame.id}">
          <img
            class="frame-list-card__image"
            data-frame-image
            src="${frame.src}"
            alt="${frame.alt}"
            loading="lazy"
            decoding="async"
          />
          <span class="story-frame__placeholder story-frame__placeholder--list">
            Görsel yerleştirilmedi
            <small>${frame.fileName}</small>
          </span>
        </div>
        <div class="frame-list-card__content">
          <span class="frame-caption__step">${frame.stepLabel}</span>
          <h3>${frame.title}</h3>
          <p>${frame.description}</p>
        </div>
      </article>
    `
  )
  .join("");

const conceptFlowMarkup = siteContent.opticalConcept.flow
  .map(
    (item) => `
      <article class="concept-flow__item">
        <span class="concept-flow__step">${item.step}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `
  )
  .join("");

const conceptLayerMarkup = siteContent.opticalConcept.layers
  .map(
    (item) => `
      <article class="concept-layer-card glass-panel" data-reveal>
        <h3>${item.name}</h3>
        <p>${item.text}</p>
      </article>
    `
  )
  .join("");

const originalValueMarkup = siteContent.originalValue.items
  .map(
    (item) => `
      <article class="value-card glass-panel" data-reveal>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `
  )
  .join("");

const feasibilityMarkup = siteContent.feasibility.items
  .map((item) => {
    if (item.flow) {
      return `
        <article class="feasibility-card glass-panel" data-reveal>
          <h3>${item.title}</h3>
          <div class="feasibility-card__flow">${item.flow}</div>
        </article>
      `;
    }

    return `
      <article class="feasibility-card glass-panel" data-reveal>
        <h3>${item.title}</h3>
        <ul class="feasibility-card__list">
          ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
        </ul>
      </article>
    `;
  })
  .join("");

const challengesMarkup = siteContent.challenges.items
  .map(
    (item) => `
      <article class="challenge-card glass-panel" data-challenge-card>
        <h3>${item.title}</h3>
        <span class="challenge-card__label">Sorun</span>
        <p class="challenge-card__problem">${item.problem}</p>
        <span class="challenge-card__label">Çözüm / Plan B</span>
        <ul class="challenge-card__list">
          ${item.solutions.map((solution) => `<li>${solution}</li>`).join("")}
        </ul>
      </article>
    `
  )
  .join("");

const budgetCardsMarkup = siteContent.budget.items
  .map(
    (item) => `
      <article class="budget-card glass-panel" data-reveal>
        <span class="budget-card__label">${item.label}</span>
        <strong
          class="budget-card__value"
          data-budget-value="${item.value}"
        >${formatCurrency(item.value)}</strong>
        <p>${item.detail}</p>
      </article>
    `
  )
  .join("");

const budgetCsv = [
  ["Kategori", "Malzeme", "Tahmini Maliyet (TL)", "Muhendislik Gerekcesi"],
  ...siteContent.budget.breakdown.map((item) => [
    item.category,
    item.material,
    item.cost,
    item.rationale
  ])
]
  .map((row) =>
    row
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  )
  .join("\n");

const budgetDownloadHref = `data:text/csv;charset=utf-8,${encodeURIComponent(
  budgetCsv
)}`;

const budgetBreakdownMarkup = siteContent.budget.breakdown
  .map(
    (item) => `
      <article class="budget-breakdown-card glass-panel" data-reveal>
        <span class="budget-breakdown-card__category">${item.category}</span>
        <h3>${item.material}</h3>
        <strong class="budget-breakdown-card__cost">${item.cost}</strong>
        <p>${item.rationale}</p>
      </article>
    `
  )
  .join("");

app.innerHTML = `
  <main class="page-shell">
    <section class="hero">
      <div class="hero__backdrop" aria-hidden="true"></div>
      <div class="section-inner hero__grid">
        <div class="hero__content">
          <span class="section-kicker" data-hero-reveal>${siteContent.hero.eyebrow}</span>
          <h1 class="hero__title" data-hero-reveal>${siteContent.hero.title}</h1>
          <p class="hero__subtitle" data-hero-reveal>${siteContent.hero.subtitle}</p>
          <p class="hero__description" data-hero-reveal>${siteContent.hero.description}</p>
          <div class="hero__highlights" data-hero-reveal>
            ${siteContent.hero.highlights
              .map((item) => `<span class="hero-highlight">${item}</span>`)
              .join("")}
          </div>
        </div>

        <aside class="hero__panel glass-panel" data-hero-reveal>
          <span class="panel-badge">${siteContent.hero.panelTitle}</span>
          <div class="hero__panel-grid">
            ${heroPanelMarkup}
          </div>
        </aside>
      </div>

      <div class="scroll-cue" data-hero-reveal>
        <span></span>
        <p>Aşağı kaydırın ve 7 karelik sunumu izleyin</p>
      </div>
    </section>

    <section class="story-section">
      <div class="section-inner">
        <header class="section-heading story-section__heading" data-reveal>
          <span class="section-kicker">${siteContent.sequence.eyebrow}</span>
          <h2>${siteContent.sequence.title}</h2>
          <p>${siteContent.sequence.description}</p>
        </header>
      </div>

      <div class="frame-sequence" data-frame-scroll>
        <div class="frame-sequence__pin">
          <div class="frame-stage">
            <div class="frame-stage__grid" aria-hidden="true"></div>
            <div class="frame-stage__glow" aria-hidden="true"></div>
            <div class="frame-stage__vignette" aria-hidden="true"></div>

            <div class="frame-stack" data-frame-stack>
              ${frameMarkup}
            </div>

            <div class="frame-caption-layer">
              ${frameCaptionMarkup}
            </div>
          </div>
        </div>
      </div>

      <div class="section-inner frame-list">
        ${frameListMarkup}
      </div>
    </section>

    <section class="section-block">
      <div class="section-inner">
        <header class="section-heading" data-reveal>
          <span class="section-kicker">${siteContent.opticalConcept.eyebrow}</span>
          <h2>${siteContent.opticalConcept.title}</h2>
          <p>${siteContent.opticalConcept.description}</p>
        </header>

        <div class="concept-layout">
          <div class="concept-flow glass-panel" data-reveal>
            <div class="concept-flow__track" aria-hidden="true"></div>
            ${conceptFlowMarkup}
          </div>

          <div class="concept-layers">
            <div class="concept-layers__header" data-reveal>
              <span class="panel-badge">${siteContent.opticalConcept.layersTitle}</span>
            </div>
            <div class="concept-layers__grid">
              ${conceptLayerMarkup}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-block section-block--original-value">
      <div class="section-inner">
        <header class="section-heading" data-reveal>
          <span class="section-kicker">${siteContent.originalValue.eyebrow}</span>
          <h2>${siteContent.originalValue.title}</h2>
          <p>${siteContent.originalValue.description}</p>
        </header>

        <div class="value-grid">
          ${originalValueMarkup}
        </div>
      </div>
    </section>

    <section class="section-block section-block--feasibility">
      <div class="section-inner">
        <header class="section-heading" data-reveal>
          <span class="section-kicker">${siteContent.feasibility.eyebrow}</span>
          <h2>${siteContent.feasibility.title}</h2>
          <p>${siteContent.feasibility.description}</p>
        </header>

        <div class="feasibility-grid">
          ${feasibilityMarkup}
        </div>
      </div>
    </section>

    <section id="challenges" class="section-block section-block--challenges">
      <div class="section-inner">
        <header class="section-heading" data-reveal>
          <span class="section-kicker">${siteContent.challenges.eyebrow}</span>
          <h2>${siteContent.challenges.title}</h2>
          <p>${siteContent.challenges.description}</p>
        </header>

        <div class="challenges-grid">
          ${challengesMarkup}
        </div>
      </div>
    </section>

    <section class="section-block section-block--budget">
      <div class="section-inner">
        <header class="section-heading" data-reveal>
          <span class="section-kicker">${siteContent.budget.eyebrow}</span>
          <h2>${siteContent.budget.title}</h2>
          <p>${siteContent.budget.description}</p>
        </header>

        <div class="budget-grid">
          ${budgetCardsMarkup}

          <article class="budget-card budget-card--summary glass-panel" data-reveal>
            <span class="budget-card__label">${siteContent.budget.totalLabel}</span>
            <strong
              class="budget-card__value budget-card__value--summary"
              data-budget-value="${siteContent.budget.totalValue}"
            >${formatCurrency(siteContent.budget.totalValue)}</strong>
            <p>
              Optik yapı, gövde üretimi, görüntüleme, bağlantı ve test kalemlerini
              bir araya getiren toplam konsept bütçesi.
            </p>
          </article>
        </div>

        <details class="budget-breakdown glass-panel" data-reveal>
          <summary class="budget-breakdown__summary">
            <div>
              <span class="panel-badge">${siteContent.budget.breakdownTitle}</span>
              <p>${siteContent.budget.breakdownDescription}</p>
            </div>
            <span class="budget-breakdown__toggle">Aç / Kapat</span>
          </summary>

          <div class="budget-breakdown__actions">
            <a
              class="budget-breakdown__download"
              href="${budgetDownloadHref}"
              download="butce-kirimi.csv"
            >${siteContent.budget.downloadLabel}</a>
          </div>

          <div class="budget-breakdown__grid">
            ${budgetBreakdownMarkup}
          </div>
        </details>
      </div>
    </section>

    <section class="closing">
      <div class="section-inner">
        <div class="closing__panel glass-panel" data-reveal>
          <span class="section-kicker">${siteContent.closing.eyebrow}</span>
          <h2>${siteContent.closing.title}</h2>
          <p>${siteContent.closing.text}</p>
        </div>
      </div>
    </section>
  </main>
`;

document.querySelectorAll("[data-frame-image]").forEach((image) => {
  const asset = image.closest("[data-frame-asset]");

  const markLoaded = () => {
    asset?.classList.remove("is-missing");
  };

  const markMissing = () => {
    asset?.classList.add("is-missing");
  };

  if (image.complete && image.naturalWidth > 0) {
    markLoaded();
  } else if (image.complete) {
    markMissing();
  } else {
    image.addEventListener("load", markLoaded, { once: true });
    image.addEventListener("error", markMissing, { once: true });
  }
});

initAnimations();

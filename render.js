function entryCard(item) {
  return `
    <a class="entry-card" href="${item.href}">
      <span>${item.label}</span>
      <strong>${item.title}</strong>
      <p>${item.description}</p>
    </a>
  `;
}

function textCard(item) {
  return `<article><span>${item.label}</span><h3>${item.title}</h3><p>${item.text}</p></article>`;
}

function setHero(selector, hero) {
  const root = document.querySelector(selector);
  if (!root || !hero) return;
  root.querySelector("[data-eyebrow]").textContent = hero.eyebrow || "";
  root.querySelector("[data-title]").textContent = hero.title || "";
  root.querySelector("[data-subtitle]").textContent = hero.subtitle || "";
}

function setHeading(selector, data) {
  const root = document.querySelector(selector);
  if (!root || !data) return;
  const eyebrow = root.querySelector("[data-eyebrow]");
  const title = root.querySelector("[data-title]");
  const text = root.querySelector("[data-text]");
  if (eyebrow) eyebrow.textContent = data.eyebrow || "";
  if (title) title.textContent = data.title || "";
  if (text) text.textContent = data.text || "";
}

function renderTextCards(selector, cards) {
  const root = document.querySelector(selector);
  if (!root || !cards) return;
  root.innerHTML = cards.map(textCard).join("");
}

function renderPortfolio() {
  const data = window.siteContent?.portfolio;
  if (!data) return;

  const hero = document.querySelector("[data-portfolio-hero]");
  if (hero) {
    hero.querySelector("[data-eyebrow]").textContent = data.hero.eyebrow;
    hero.querySelector("[data-title]").textContent = data.hero.title;
    hero.querySelector("[data-subtitle]").textContent = data.hero.subtitle;
  }

  const byFormat = document.querySelector("[data-section='by-format']");
  const recommended = document.querySelector("[data-section='recommended']");
  if (recommended && data.recommended) {
    recommended.querySelector("[data-eyebrow]").textContent = data.recommended.eyebrow;
    recommended.querySelector("[data-title]").textContent = data.recommended.title;
    recommended.querySelector("[data-grid]").innerHTML = data.recommended.items.map(entryCard).join("");
  }

  if (byFormat) {
    byFormat.querySelector("[data-eyebrow]").textContent = data.byFormat.eyebrow;
    byFormat.querySelector("[data-title]").textContent = data.byFormat.title;
    byFormat.querySelector("[data-grid]").innerHTML = data.byFormat.items.map(entryCard).join("");
  }

  const byProject = document.querySelector("[data-section='by-project']");
  if (byProject) {
    byProject.querySelector("[data-eyebrow]").textContent = data.byProject.eyebrow;
    byProject.querySelector("[data-title]").textContent = data.byProject.title;
    byProject.querySelector("[data-grid]").innerHTML = data.byProject.items.map(entryCard).join("");
  }
}

function assetCard(item) {
  const image = item.image
    ? `<img class="asset-preview" src="${item.image}" alt="${item.title}" loading="lazy" />`
    : "";
  const link = item.href
    ? `<a class="text-button" href="${item.href}" target="_blank" rel="noreferrer">${item.button || "打开作品"}</a>`
    : "";
  return `<article>${image}<span>${item.label}</span><h3>${item.title}</h3><p>${item.text}</p>${link}</article>`;
}

function renderHomePage() {
  const data = window.siteContent?.homePage;
  if (!data) return;

  setHero("[data-home-hero]", data.hero);
  const actions = document.querySelector("[data-home-actions]");
  if (actions) {
    actions.innerHTML = data.hero.actions
      .map((action) => `<a class="button ${action.style}" href="${action.href}">${action.label}</a>`)
      .join("");
  }
  const signals = document.querySelector("[data-home-signals]");
  if (signals) {
    signals.innerHTML = data.hero.signals.map((item) => `<span>${item}</span>`).join("");
  }

  const callout = document.querySelector("[data-home-callout]");
  if (callout) {
    callout.querySelector("[data-eyebrow]").textContent = data.portfolioCallout.eyebrow;
    callout.querySelector("[data-title]").textContent = data.portfolioCallout.title;
    callout.querySelector("[data-text]").textContent = data.portfolioCallout.text;
    const link = callout.querySelector("[data-link]");
    link.textContent = data.portfolioCallout.button;
    link.href = data.portfolioCallout.href;
  }

  setHeading("[data-home-featured-heading]", data.featuredWorks);
  const featuredGrid = document.querySelector("[data-home-featured-grid]");
  if (featuredGrid) featuredGrid.innerHTML = data.featuredWorks.items.map(entryCard).join("");

  setHeading("[data-home-ai-heading]", data.aiEra);
  const aiGrid = document.querySelector("[data-home-ai-grid]");
  if (aiGrid) {
    aiGrid.innerHTML = data.aiEra.cards
      .map(
        (card) => `
          <article class="project-card ${card.accent}">
            <div class="card-topline">${card.meta.map((item) => `<span>${item}</span>`).join("")}</div>
            <h3>${card.title}</h3>
            <p>${card.text}</p>
            <div class="format-row">${card.formats.map((item) => `<span>${item}</span>`).join("")}</div>
            <a class="text-button" href="${card.href}">进入项目</a>
          </article>
        `
      )
      .join("");
  }

  setHeading("[data-home-bridge-heading]", data.bridge);
  renderTextCards("[data-home-bridge-grid]", data.bridge.cards);
  setHeading("[data-home-media-heading]", data.mediaFoundation);
  const mediaGrid = document.querySelector("[data-home-media-grid]");
  if (mediaGrid) mediaGrid.innerHTML = data.mediaFoundation.entries.map(entryCard).join("");
  setHeading("[data-home-other-heading]", data.otherEntrances);
  const otherGrid = document.querySelector("[data-home-other-grid]");
  if (otherGrid) otherGrid.innerHTML = data.otherEntrances.entries.map(entryCard).join("");
}

function videoCard(video) {
  const tags = video.tags.map((tag) => `<span>${tag}</span>`).join("");
  const link = video.url
    ? `<a href="${video.url}" target="_blank" rel="noreferrer">打开作品</a>`
    : `<span class="video-meta">链接待补</span>`;
  return `
    <article class="video-card">
      <div class="tags">${tags}</div>
      <h3>${video.title}</h3>
      <div class="video-meta">${video.metric}</div>
      ${link}
    </article>
  `;
}

function renderMediaPage() {
  const data = window.siteContent?.mediaPage;
  if (!data) return;
  setHero("[data-media-hero]", data.hero);
  setHeading("[data-media-training-heading]", data.training);
  renderTextCards("[data-media-training-grid]", data.training.cards);
  const featured = document.querySelector("[data-media-featured]");
  if (featured && data.featuredCase) {
    featured.querySelector("[data-eyebrow]").textContent = data.featuredCase.eyebrow;
    featured.querySelector("[data-title]").textContent = data.featuredCase.title;
    featured.querySelector("[data-subtitle]").textContent = data.featuredCase.subtitle;
    featured.querySelector("[data-case-title]").textContent = data.featuredCase.titleFull;
    featured.querySelector("[data-case-text]").textContent = data.featuredCase.text;
    featured.querySelector("[data-case-metrics]").innerHTML = data.featuredCase.metrics
      .map((item) => `<article><span>${item.label}</span><strong>${item.value}</strong></article>`)
      .join("");
    featured.querySelector("[data-case-notes]").innerHTML = data.featuredCase.notes
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  setHeading("[data-media-selected-heading]", data.selectedWorks);
  const dataLink = document.querySelector("[data-media-data-link]");
  if (dataLink && data.selectedWorks.file) {
    dataLink.href = data.selectedWorks.file;
    dataLink.textContent = data.selectedWorks.button || "打开数据表";
    dataLink.hidden = false;
  }
  const videoGrid = document.querySelector("#videoGrid");
  if (videoGrid) videoGrid.innerHTML = data.videos.map(videoCard).join("");
  setHeading("[data-media-topic-heading]", data.topicMap);
  renderTextCards("[data-media-topic-grid]", data.topicMap.cards);
}

function renderSystemsPage() {
  const data = window.siteContent?.systemsPage;
  if (!data) return;
  setHero("[data-systems-hero]", data.hero);
  setHeading("[data-systems-why-heading]", data.why);
  renderTextCards("[data-systems-why-grid]", data.why.cards);
  setHeading("[data-systems-agents-heading]", data.agents);
  renderTextCards("[data-systems-agents-grid]", data.agents.cards);
  setHeading("[data-systems-workflow-heading]", data.workflow);
  renderTextCards("[data-systems-workflow-grid]", data.workflow.cards);
}

function renderInputsPage() {
  const data = window.siteContent?.inputsPage;
  if (!data) return;
  setHero("[data-inputs-hero]", data.hero);
  setHeading("[data-inputs-why-heading]", data.why);
  setHeading("[data-inputs-sources-heading]", data.sources);
  renderTextCards("[data-inputs-sources-grid]", data.sources.cards);
  setHeading("[data-inputs-impact-heading]", data.impact);
  renderTextCards("[data-inputs-impact-grid]", data.impact.cards);
}

function renderSocialPage() {
  const data = window.siteContent?.socialPage;
  if (!data) return;
  setHero("[data-social-hero]", data.hero);
  setHeading("[data-social-channels-heading]", data.channels);
  const channels = document.querySelector("[data-social-channels-grid]");
  if (channels) {
    channels.innerHTML = data.channels.cards
      .map(
        (card) => `
          <a href="${card.href}" aria-disabled="${card.href === "#"}" class="social-page-card">
            <span>${card.label}</span>
            <h3>${card.title}</h3>
            <p>${card.text}</p>
            <strong>${card.cta}</strong>
          </a>
        `
      )
      .join("");
  }
  setHeading("[data-social-expectation-heading]", data.expectation);
  renderTextCards("[data-social-expectation-grid]", data.expectation.cards);
  setHeading("[data-social-contact-heading]", data.contact);
  const contact = document.querySelector("[data-social-contact-grid]");
  if (contact) {
    contact.innerHTML = data.contact.cards
      .map((card) => `<a href="${card.href}" aria-disabled="${card.href === "#"}"><span>${card.label}</span><strong>${card.value}</strong></a>`)
      .join("");
  }
}

function renderCreativePage() {
  const data = window.siteContent?.creativePage;
  if (!data) return;
  setHero("[data-creative-hero]", data.hero);
  setHeading("[data-creative-what-heading]", data.what);
  renderTextCards("[data-creative-what-grid]", data.what.cards);
  setHeading("[data-creative-slots-heading]", data.slots);
  const slots = document.querySelector("[data-creative-slots-grid]");
  if (slots) {
    slots.innerHTML = data.slots.cards
      .map(
        (card) => `
          <article class="creative-video-card">
            <div class="video-frame">${
              card.src ? `<video src="${card.src}" controls></video>` : `<span>${card.label}</span>`
            }</div>
            <h3>${card.title}</h3>
            <p>${card.text}</p>
          </article>
        `
      )
      .join("");
  }
}

function renderWorksPage() {
  const data = window.siteContent?.worksPage;
  if (!data) return;
  setHero("[data-works-hero]", data.hero);
  const list = document.querySelector("[data-works-list]");
  if (!list) return;
  list.innerHTML = data.sections
    .map((section) => {
      const tintClass = section.tint ? " project-tint" : "";
      const cards = section.cards?.length
        ? `<div class="asset-grid">${section.cards.map(assetCard).join("")}</div>`
        : "";
      const link = section.href
        ? `<a class="button secondary" href="${section.href}">${section.button}</a>`
        : "";
      return `
        <section id="${section.id}" class="section work-type-section${tintClass}">
          <div class="detail-title"><span>${section.number}</span><h2>${section.title}</h2></div>
          <p class="project-lead">${section.text}</p>
          ${cards}
          ${link}
        </section>
      `;
    })
    .join("");
}

function renderNamiStoryDocPage() {
  const pageKey = document.body?.dataset?.docPage || "namiStoryDocPage";
  const data = window.siteContent?.[pageKey];
  if (!data) return;
  setHero("[data-doc-hero]", data.hero);
  setHeading("[data-doc-overview-heading]", data.overview);
  renderTextCards("[data-doc-overview-grid]", data.overview.cards);
  setHeading("[data-doc-preview-heading]", data.preview);
  const previewLink = document.querySelector("[data-doc-preview-link]");
  if (previewLink) {
    previewLink.href = data.preview.file;
    previewLink.textContent = data.preview.button;
  }
  const pptLink = document.querySelector("[data-doc-ppt-link]");
  if (pptLink && data.preview.ppt) {
    pptLink.href = data.preview.ppt;
    pptLink.textContent = data.preview.pptButton || "打开 PPT";
    pptLink.hidden = false;
  }
  const grid = document.querySelector("[data-doc-preview-grid]");
  if (grid) {
    grid.innerHTML = (data.preview.images || [])
      .map((image, index) => `<figure><img src="${image}" alt="${data.hero.title}第 ${index + 1} 页预览" loading="lazy" /><figcaption>Preview ${index + 1}</figcaption></figure>`)
      .join("");
  }
}

function renderAssetLibraryPage() {
  const data = window.siteContent?.assetLibraryPage;
  if (!data) return;
  setHero("[data-assets-hero]", data.hero);
  const list = document.querySelector("[data-assets-list]");
  if (!list) return;
  list.innerHTML = data.sections
    .map(
      (section) => `
        <section class="section work-type-section">
          <div class="detail-title"><span>Asset</span><h2>${section.title}</h2></div>
          <div class="asset-grid">
            ${section.items
              .map(
                (item) => `
                  <article>
                    <span>${item.label}</span>
                    <h3>${item.title}</h3>
                    <p>${item.note}</p>
                    <code class="asset-path">${item.path}</code>
                    <a class="text-button" href="${item.path}" target="_blank" rel="noreferrer">打开</a>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function renderSiteFooter() {
  const data = window.siteContent?.siteFooter;
  if (!data || document.body.classList.contains("no-site-footer")) return;
  const main = document.querySelector("main");
  if (!main || document.querySelector(".site-footer")) return;
  const footer = document.createElement("footer");
  footer.className = "site-footer section";
  footer.innerHTML = `
    <div>
      <p class="eyebrow">${data.eyebrow}</p>
      <h2>${data.title}</h2>
    </div>
    <nav class="footer-links" aria-label="页脚导航">
      ${data.links.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
    </nav>
  `;
  main.appendChild(footer);
}

function renderProject(project) {
  const tintClass = project.theme === "tint" ? " project-tint" : "";
  const profile = project.profile
    .map((item) => `<article><span>${item.label}</span><p>${item.text}</p></article>`)
    .join("");
  const assets = project.assets.map(assetCard).join("");
  const result = project.result
    ? `<div class="result-strip"><span>${project.result.label}</span><p>${project.result.text}</p></div>`
    : "";

  return `
    <section id="${project.id}" class="section project-case${tintClass}">
      <div class="project-cover">
        <p class="eyebrow">${project.eyebrow}</p>
        <h2>${project.title}</h2>
        <p>${project.intro}</p>
      </div>
      <div class="case-profile">${profile}</div>
      <div class="case-section">
        <h3>${project.thinkingTitle}</h3>
        <p>${project.thinking}</p>
      </div>
      <div class="asset-grid">${assets}</div>
      ${result}
    </section>
  `;
}

function renderProjectsPage() {
  const data = window.siteContent?.projectsPage;
  if (!data) return;

  const hero = document.querySelector("[data-projects-hero]");
  if (hero) {
    hero.querySelector("[data-eyebrow]").textContent = data.hero.eyebrow;
    hero.querySelector("[data-title]").textContent = data.hero.title;
    hero.querySelector("[data-subtitle]").textContent = data.hero.subtitle;
  }

  const evolution = document.querySelector("[data-projects-evolution]");
  if (evolution) {
    evolution.querySelector("[data-eyebrow]").textContent = data.evolution.eyebrow;
    evolution.querySelector("[data-title]").textContent = data.evolution.title;
    evolution.querySelector("[data-description]").textContent = data.evolution.description;
  }

  const list = document.querySelector("[data-projects-list]");
  if (list) {
    list.innerHTML = data.projects.map(renderProject).join("");
  }
}

renderPortfolio();
renderProjectsPage();
renderHomePage();
renderMediaPage();
renderSystemsPage();
renderInputsPage();
renderSocialPage();
renderCreativePage();
renderWorksPage();
renderNamiStoryDocPage();
renderAssetLibraryPage();
renderSiteFooter();

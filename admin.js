const DRAFT_KEY = "portfolio-hub-content-draft-v1";

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let editable = structuredClone(loadDraft() || window.siteContent);

const statusEl = document.querySelector("#adminStatus");
const projectEditor = document.querySelector("#projectEditor");
const portfolioEditor = document.querySelector("#portfolioEditor");
const pageContentEditor = document.querySelector("#pageContentEditor");

function getByPath(obj, path) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

function setByPath(obj, path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  const target = parts.reduce((current, key) => current[key], obj);
  target[last] = value;
}

function setStatus(message) {
  statusEl.textContent = message;
}

function saveDraft(silent = true) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(editable));
  if (!silent) setStatus("已保存本地草稿。正式生效还需要保存到 content.js。");
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  setStatus("已清除本地草稿。");
}

function markDirty() {
  saveDraft();
  setStatus("有未保存的修改。");
}

function moveItem(list, from, to) {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
}

function bindSimpleFields() {
  document.querySelectorAll("[data-path]").forEach((fieldEl) => {
    fieldEl.value = getByPath(editable, fieldEl.dataset.path) || "";
    fieldEl.oninput = () => {
      setByPath(editable, fieldEl.dataset.path, fieldEl.value);
      markDirty();
    };
  });
}

function field(label, value, onInput, textarea = false) {
  const wrapper = document.createElement("label");
  wrapper.textContent = label;
  const input = document.createElement(textarea ? "textarea" : "input");
  input.value = value || "";
  input.addEventListener("input", () => {
    onInput(input.value);
    markDirty();
  });
  wrapper.appendChild(input);
  return wrapper;
}

function smallButton(text, onClick, options = {}) {
  const button = document.createElement("button");
  button.className = options.danger ? "small-button danger" : "small-button";
  button.type = "button";
  button.textContent = text;
  button.disabled = Boolean(options.disabled);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  });
  return button;
}

function rowActions(actions) {
  const wrap = document.createElement("div");
  wrap.className = "admin-row-actions";
  actions.forEach((action) => wrap.appendChild(action));
  return wrap;
}

function cardList(title, items, onAdd, renderItem) {
  const wrap = document.createElement("div");
  wrap.appendChild(rowActions([smallButton(`新增${title}`, onAdd)]));

  const grid = document.createElement("div");
  grid.className = "admin-subgrid";
  items.forEach((item, index) => grid.appendChild(renderItem(item, index)));
  wrap.appendChild(grid);
  return wrap;
}

function itemControls(list, index, rerender) {
  return rowActions([
    smallButton("上移", () => {
      moveItem(list, index, index - 1);
      rerender();
      markDirty();
    }, { disabled: index === 0 }),
    smallButton("下移", () => {
      moveItem(list, index, index + 1);
      rerender();
      markDirty();
    }, { disabled: index === list.length - 1 }),
  ]);
}

function renderProjects() {
  projectEditor.innerHTML = "";
  editable.projectsPage.projects.forEach((project, projectIndex) => {
    const card = document.createElement("details");
    card.className = "project-edit-card admin-detail";
    card.open = projectIndex === 0;

    const head = document.createElement("summary");
    head.className = "project-edit-head";
    const title = document.createElement("h3");
    title.textContent = project.title || `项目 ${projectIndex + 1}`;
    const actions = document.createElement("div");
    actions.className = "project-edit-actions";
    actions.append(
      smallButton("上移", () => {
        moveItem(editable.projectsPage.projects, projectIndex, projectIndex - 1);
        renderProjects();
        markDirty();
      }, { disabled: projectIndex === 0 }),
      smallButton("下移", () => {
        moveItem(editable.projectsPage.projects, projectIndex, projectIndex + 1);
        renderProjects();
        markDirty();
      }, { disabled: projectIndex === editable.projectsPage.projects.length - 1 }),
      smallButton("删除项目", () => {
        editable.projectsPage.projects.splice(projectIndex, 1);
        renderProjects();
        markDirty();
      }, { danger: true })
    );
    head.append(title, actions);
    const body = document.createElement("div");
    body.className = "admin-detail-body";
    card.appendChild(head);

    body.appendChild(field("锚点 ID", project.id, (value) => (project.id = value)));
    body.appendChild(field("英文小字", project.eyebrow, (value) => (project.eyebrow = value)));
    body.appendChild(field("项目标题", project.title, (value) => {
      project.title = value;
      title.textContent = value || `项目 ${projectIndex + 1}`;
    }));
    body.appendChild(field("项目介绍", project.intro, (value) => (project.intro = value), true));
    body.appendChild(field("表达思路标题", project.thinkingTitle, (value) => (project.thinkingTitle = value)));
    body.appendChild(field("表达思路正文", project.thinking, (value) => (project.thinking = value), true));

    body.appendChild(
      cardList(
        "信息卡",
        project.profile,
        () => {
          project.profile.push({ label: "新字段", text: "待补内容" });
          renderProjects();
          markDirty();
        },
        (item, index) => {
          const itemCard = document.createElement("div");
          itemCard.className = "admin-panel";
          itemCard.appendChild(field("标题", item.label, (value) => (item.label = value)));
          itemCard.appendChild(field("正文", item.text, (value) => (item.text = value), true));
          itemCard.appendChild(itemControls(project.profile, index, renderProjects));
          itemCard.appendChild(smallButton("删除", () => {
            project.profile.splice(index, 1);
            renderProjects();
            markDirty();
          }, { danger: true }));
          return itemCard;
        }
      )
    );

    body.appendChild(
      cardList(
        "作品卡",
        project.assets,
        () => {
          project.assets.push({ label: "新类型", title: "新作品", text: "待补内容。", href: "", button: "打开作品" });
          renderProjects();
          markDirty();
        },
        (item, index) => {
          const itemCard = document.createElement("div");
          itemCard.className = "admin-panel";
          itemCard.appendChild(field("类型", item.label, (value) => (item.label = value)));
          itemCard.appendChild(field("标题", item.title, (value) => (item.title = value)));
          itemCard.appendChild(field("正文", item.text, (value) => (item.text = value), true));
          itemCard.appendChild(field("预览图路径", item.image, (value) => (item.image = value)));
          itemCard.appendChild(field("链接", item.href, (value) => (item.href = value)));
          itemCard.appendChild(field("按钮文字", item.button, (value) => (item.button = value)));
          itemCard.appendChild(itemControls(project.assets, index, renderProjects));
          itemCard.appendChild(smallButton("删除", () => {
            project.assets.splice(index, 1);
            renderProjects();
            markDirty();
          }, { danger: true }));
          return itemCard;
        }
      )
    );

    card.appendChild(body);
    projectEditor.appendChild(card);
  });
}

function renderPortfolioGroup(title, groupKey) {
  const group = editable.portfolio[groupKey];
  const section = document.createElement("div");
  section.className = "admin-section-divider";
  section.appendChild(field(`${title}：英文小字`, group.eyebrow, (value) => (group.eyebrow = value)));
  section.appendChild(field(`${title}：标题`, group.title, (value) => (group.title = value)));
  section.appendChild(field(`${title}：说明`, group.text || "", (value) => (group.text = value), true));
  section.appendChild(
    cardList(
      `${title}入口`,
      group.items,
      () => {
        group.items.push({
          label: "新分类",
          title: "新入口",
          description: "待补说明。",
          href: "./works.html",
        });
        renderPortfolio();
        markDirty();
      },
      (item, index) => {
        const itemCard = document.createElement("div");
        itemCard.className = "admin-panel";
        itemCard.appendChild(field("标签", item.label, (value) => (item.label = value)));
        itemCard.appendChild(field("标题", item.title, (value) => (item.title = value)));
        itemCard.appendChild(field("说明", item.description, (value) => (item.description = value), true));
        itemCard.appendChild(field("跳转链接", item.href, (value) => (item.href = value)));
        itemCard.appendChild(itemControls(group.items, index, renderPortfolio));
        itemCard.appendChild(smallButton("删除", () => {
          group.items.splice(index, 1);
          renderPortfolio();
          markDirty();
        }, { danger: true }));
        return itemCard;
      }
    )
  );
  return section;
}

function renderPortfolio() {
  portfolioEditor.innerHTML = "";
  portfolioEditor.appendChild(field("页面英文小字", editable.portfolio.hero.eyebrow, (value) => (editable.portfolio.hero.eyebrow = value)));
  portfolioEditor.appendChild(field("页面标题", editable.portfolio.hero.title, (value) => (editable.portfolio.hero.title = value)));
  portfolioEditor.appendChild(field("页面说明", editable.portfolio.hero.subtitle, (value) => (editable.portfolio.hero.subtitle = value), true));
  portfolioEditor.appendChild(renderPortfolioGroup("推荐先看", "recommended"));
  portfolioEditor.appendChild(renderPortfolioGroup("按作品用途看", "byUseCase"));
  portfolioEditor.appendChild(renderPortfolioGroup("按项目看", "byProject"));
}

const pageLabels = {
  homePage: "首页",
  mediaPage: "商业故事页",
  systemsPage: "Agent/Skill 页",
  inputsPage: "输入系统页",
  socialPage: "社媒页",
  creativePage: "AI 创意视频页",
  worksPage: "按作品用途看作品页",
  namiStoryDocPage: "纳米漫剧文档详情页",
  safeLobsterDocPage: "安全龙虾文档详情页",
  assetLibraryPage: "素材库",
  siteFooter: "全站页脚",
};

const fieldLabels = {
  hero: "页面开头",
  eyebrow: "英文小字",
  title: "标题",
  subtitle: "说明",
  text: "正文",
  label: "标签",
  description: "说明",
  href: "跳转链接",
  url: "作品链接",
  cta: "按钮文字",
  value: "内容",
  src: "本地视频路径",
  button: "按钮文字",
  accent: "样式色",
  metric: "数据口径",
  id: "锚点 ID",
  number: "序号",
  tint: "浅底样式",
  sections: "页面板块",
  overview: "阅读说明",
  preview: "预览区",
  file: "文件路径",
  images: "预览图",
  actions: "按钮",
  signals: "能力标签",
  cards: "卡片",
  entries: "入口",
  videos: "视频作品",
  formats: "作品形式",
  meta: "顶部标签",
  tags: "标签",
};

function labelFor(key) {
  return fieldLabels[key] || key;
}

function defaultValueFrom(value) {
  if (Array.isArray(value)) return [];
  if (typeof value === "boolean") return false;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, defaultValueFrom(val)]));
  }
  return "待补";
}

function renderArrayEditor(title, list, rerender, renderObject) {
  return cardList(
    title,
    list,
    () => {
      const sample = list[0] || { title: "新内容", text: "待补内容。" };
      list.push(defaultValueFrom(sample));
      rerender();
      markDirty();
    },
    (item, index) => {
      const itemCard = document.createElement("div");
      itemCard.className = "admin-panel";
      if (item && typeof item === "object" && !Array.isArray(item)) {
        renderObject(item, itemCard);
      } else {
        itemCard.appendChild(field("内容", item, (value) => (list[index] = value)));
      }
      itemCard.appendChild(itemControls(list, index, rerender));
      itemCard.appendChild(smallButton("删除", () => {
        list.splice(index, 1);
        rerender();
        markDirty();
      }, { danger: true }));
      return itemCard;
    }
  );
}

function renderObjectFields(obj, container, rerender, depth = 0) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string") {
      const useTextarea = value.length > 26 || ["subtitle", "text", "description"].includes(key);
      container.appendChild(field(labelFor(key), value, (next) => (obj[key] = next), useTextarea));
      return;
    }

    if (typeof value === "boolean") {
      const wrapper = document.createElement("label");
      wrapper.textContent = labelFor(key);
      const input = document.createElement("select");
      input.innerHTML = `<option value="false">否</option><option value="true">是</option>`;
      input.value = String(value);
      input.addEventListener("change", () => {
        obj[key] = input.value === "true";
        markDirty();
      });
      wrapper.appendChild(input);
      container.appendChild(wrapper);
      return;
    }

    if (Array.isArray(value)) {
      if (value.every((item) => typeof item === "string")) {
        container.appendChild(field(labelFor(key), value.join("，"), (next) => {
          obj[key] = next
            .split(/[，,]/)
            .map((item) => item.trim())
            .filter(Boolean);
        }));
        return;
      }
      const arrayWrap = document.createElement("div");
      arrayWrap.className = depth === 0 ? "admin-section-divider" : "";
      const heading = document.createElement("h3");
      heading.textContent = labelFor(key);
      arrayWrap.appendChild(heading);
      arrayWrap.appendChild(renderArrayEditor(labelFor(key), value, rerender, (item, target) => renderObjectFields(item, target, rerender, depth + 1)));
      container.appendChild(arrayWrap);
      return;
    }

    if (value && typeof value === "object") {
      const group = document.createElement("div");
      group.className = "admin-section-divider";
      const heading = document.createElement("h3");
      heading.textContent = labelFor(key);
      group.appendChild(heading);
      renderObjectFields(value, group, rerender, depth + 1);
      container.appendChild(group);
    }
  });
}

function renderPageContent() {
  pageContentEditor.innerHTML = "";
  Object.entries(pageLabels).forEach(([pageKey, pageTitle]) => {
    const page = editable[pageKey];
    if (!page) return;
    const section = document.createElement("details");
    section.className = "project-edit-card admin-detail";
    section.open = pageKey === "homePage";
    const head = document.createElement("summary");
    head.className = "project-edit-head";
    const title = document.createElement("h3");
    title.textContent = pageTitle;
    head.appendChild(title);
    section.appendChild(head);
    const body = document.createElement("div");
    body.className = "admin-detail-body";
    renderObjectFields(page, body, renderPageContent);
    section.appendChild(body);
    pageContentEditor.appendChild(section);
  });
}

function contentJsText() {
  return `window.siteContent = ${JSON.stringify(editable, null, 2)};\n`;
}

document.querySelector("#addProject").addEventListener("click", () => {
  editable.projectsPage.projects.push({
    id: `project-${Date.now()}`,
    theme: "default",
    eyebrow: "New project",
    title: "新项目",
    intro: "待补项目介绍。",
    profile: [{ label: "产品是什么", text: "待补内容。" }],
    thinkingTitle: "我的表达思路",
    thinking: "待补内容。",
    assets: [{ label: "Asset", title: "新作品", text: "待补内容。" }],
  });
  renderProjects();
  markDirty();
});

document.querySelector("#saveDraft").addEventListener("click", () => saveDraft(false));

document.querySelector("#clearDraft").addEventListener("click", () => clearDraft());

document.querySelector("#saveToContent").addEventListener("click", async () => {
  if (!window.showOpenFilePicker) {
    setStatus("当前浏览器不支持直接覆盖本地文件。请用“下载新版 content.js”替换原文件。");
    return;
  }

  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [{ description: "content.js", accept: { "text/javascript": [".js"] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(contentJsText());
    await writable.close();
    clearDraft();
    setStatus("已保存到你选择的 content.js。刷新对应页面即可看到修改。");
  } catch (error) {
    if (error?.name !== "AbortError") {
      setStatus("没有保存成功。可以先下载新版 content.js，再替换原文件。");
    }
  }
});

document.querySelector("#downloadContent").addEventListener("click", () => {
  const blob = new Blob([contentJsText()], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "content.js";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("已下载新版 content.js。用它替换 site/content.js 后刷新页面。");
});

document.querySelector("#copyContent").addEventListener("click", async () => {
  await navigator.clipboard.writeText(contentJsText());
  setStatus("已复制新版 content.js 内容。");
});

document.querySelector("#resetContent").addEventListener("click", () => {
  clearDraft();
  editable = structuredClone(window.siteContent);
  bindSimpleFields();
  renderProjects();
  renderPortfolio();
  renderPageContent();
  setStatus("已恢复到当前 content.js 内容。");
});

bindSimpleFields();
renderProjects();
renderPortfolio();
renderPageContent();
if (loadDraft()) {
  setStatus("已载入本地草稿。确认无误后，请保存到 content.js。");
}

const videos = [
  {
    title: "一个员工都没有，却年入千万美金",
    tags: ["一人公司", "工具产品"],
    metric: "待补链接 / 待核对数据",
  },
  {
    title: "“中国英伟达”要 IPO 了，估值超 250 亿",
    tags: ["AI", "芯片", "科技商业"],
    metric: "已收到抖音链接 / 待核对全平台数据",
    url: "https://v.douyin.com/Sdx0s3i5rQA/",
  },
  {
    title: "Pika：4 人公司，半年估值超 2 亿美金",
    tags: ["AI 视频", "创业公司"],
    metric: "待补链接 / 待核对数据",
  },
  {
    title: "Craigslist：美国大叔，靠土掉渣的网站，年入 10 亿美金",
    tags: ["互联网产品", "反常识商业"],
    metric: "待补链接 / 待核对数据",
  },
  {
    title: "Scale AI：97 年华裔小伙，干出 500 亿估值独角兽",
    tags: ["AI 数据", "独角兽"],
    metric: "表格已找到疑似记录 / 待补链接",
  },
  {
    title: "市值 200 亿港元！东北夫妻“卖大米”卖到上市",
    tags: ["消费品牌", "商业故事"],
    metric: "待补链接 / 待核对数据",
  },
  {
    title: "肯德基、麦当劳的汉堡为什么越卖越小？",
    tags: ["消费品牌", "餐饮"],
    metric: "快手单平台 80 万+播放",
    url: "https://v.kuaishou.com/Je5Eyo4X",
  },
  {
    title: "阿里女员工跑到沙特干快递，打造“中东版顺丰”",
    tags: ["出海", "中东", "物流创业"],
    metric: "表格已找到 / 待匹配链接",
  },
  {
    title: "中国零食界“大王”，靠“抄袭”，每天躺赚半个亿",
    tags: ["消费品牌", "零食"],
    metric: "表格显示 200 万级以上候选",
    url: "https://v.douyin.com/gj3vIQPFyas/",
  },
  {
    title: "黑神话悟空上线即回本",
    tags: ["游戏", "文化热点"],
    metric: "快手单平台 30 万+播放",
    url: "https://v.kuaishou.com/71tAsuF1",
  },
];

const details = {
  lobster: {
    title: "360 安全龙虾产品介绍",
    intro:
      "一个 AI Agent 产品传播案例。重点不是把功能讲全，而是把产品翻译成普通人能理解、愿意试的表达。",
    bullets: [
      "独立完成产品介绍与叙事表达。",
      "V1 从「更好养、更好用、更省钱」切入，V2 进一步统一到「杠杆」隐喻。",
      "核心价值：把云端 AI Agent、工具调用、云端办公室等复杂能力，转译成用户能感知的时间、人力和资金杠杆。",
    ],
  },
  nami: {
    title: "纳米漫剧流水线产品介绍",
    intro:
      "一个复杂 AI 产品商业化表达案例。长版讲清楚产品，短版服务成交转化。",
    bullets: [
      "独立完成长版产品介绍与短版 PPT 表达。",
      "把用户痛点拆成：分镜像大头贴、一步错步步错、人物大变脸。",
      "再把产品能力转译为：AI 导演、空间引擎、工业化产线和算力包。",
    ],
  },
  site: {
    title: "个人作品中枢网页",
    intro:
      "这个网页本身也是作品：它把作品、想法、视频、PPT、社媒入口和后续可产品化的结构放到同一个可转发空间。",
    bullets: [
      "从定位、标杆研究、素材整理到页面结构，按产品方式推进。",
      "不做简历页，而做一个可以服务面试、合作、关注的个人空间。",
      "后续可以扩展给更多创作者、求职者和 AI 实践者使用。",
    ],
  },
};

const videoGrid = document.querySelector("#videoGrid");
if (videoGrid) {
  videoGrid.innerHTML = videos
    .map((video) => {
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
    })
    .join("");
}

const dialog = document.querySelector("#detailDialog");
const dialogContent = document.querySelector("#dialogContent");
const closeButton = document.querySelector(".dialog-close");

if (dialog && dialogContent && closeButton) {
  document.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = details[button.dataset.detail];
      if (!item) return;
      dialogContent.innerHTML = `
        <div class="dialog-body">
          <p class="eyebrow">Case detail</p>
          <h2>${item.title}</h2>
          <p>${item.intro}</p>
          <ul>${item.bullets.map((line) => `<li>${line}</li>`).join("")}</ul>
        </div>
      `;
      dialog.showModal();
    });
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (isOutside) dialog.close();
  });
}

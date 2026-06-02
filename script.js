const app = document.querySelector("[data-app]");
const runner = document.querySelector("[data-runner]");
const coinsEl = document.querySelector("[data-coins]");
const stageLabel = document.querySelector("[data-stage-label]");
const toastStack = document.querySelector("[data-toast-stack]");
const profileOutput = document.querySelector("[data-profile-output]");
const hobbyDetail = document.querySelector("[data-hobby-detail]");
const travelMapEl = document.querySelector("[data-travel-map]");
const travelPreviewImg = document.querySelector("[data-travel-preview-img]");
const travelPreviewTitle = document.querySelector("[data-travel-preview-title]");
const travelPreviewFlag = document.querySelector("[data-travel-preview-flag]");
const travelPreviewCapital = document.querySelector("[data-travel-preview-capital]");
const strengthOutput = document.querySelector("[data-strength-output]");
const soundButton = document.querySelector("[data-sound-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const welcomeScreen = document.querySelector("[data-welcome]");
const clearModal = document.querySelector("[data-clear-modal]");
const clearClose = document.querySelector("[data-clear-close]");

const hobbyContent = {
  photo: {
    rarity: "属性：观察 +10",
    title: "摄影",
    body: "喜欢拍城市边角、路灯、窗户和旅途中突然安静的时刻。摄影让我习惯先观察，再表达。",
  },
  travel: {
    rarity: "属性：探索 +8",
    title: "旅行",
    body: "把城市当成开放地图，收集路线、餐厅、街角光线和一些只会在路上出现的灵感。",
  },
  game: {
    rarity: "属性：反馈 +9",
    title: "游戏",
    body: "偏爱地图探索、支线任务和把世界观藏进细节里的作品，也会把这些体验转译到产品设计里。",
  },
  read: {
    rarity: "属性：表达 +7",
    title: "阅读",
    body: "阅读帮我整理语言和判断力。做页面或项目时，我会更在意信息顺序、语气和节奏。",
  },
};

const visitedCountries = [
  {
    country: "韩国",
    capital: "首尔",
    latLng: [35.9078, 127.7669],
    labelPoint: [875, 154],
    flag: "./assets/flag-kr.png",
    capitalImage:
      "./assets/travel-kr-seoul.jpg",
  },
  {
    country: "越南",
    capital: "河内",
    latLng: [14.0583, 108.2772],
    labelPoint: [840, 214],
    flag: "./assets/flag-vn.png",
    capitalImage:
      "./assets/travel-vn-hanoi.jpg",
  },
  {
    country: "新加坡",
    capital: "新加坡",
    latLng: [1.3521, 103.8198],
    labelPoint: [786, 318],
    flag: "./assets/flag-sg.png",
    capitalImage:
      "./assets/travel-sg-singapore.jpg",
  },
  {
    country: "马来西亚",
    capital: "吉隆坡",
    latLng: [4.2105, 101.9758],
    labelPoint: [630, 286],
    flag: "./assets/flag-my.png",
    capitalImage:
      "./assets/travel-my-kuala-lumpur.jpg",
  },
  {
    country: "泰国",
    capital: "曼谷",
    latLng: [15.87, 100.9925],
    labelPoint: [846, 252],
    flag: "./assets/flag-th.png",
    capitalImage:
      "./assets/travel-th-bangkok.jpg",
  },
  {
    country: "英国",
    capital: "伦敦",
    latLng: [55.3781, -3.436],
    labelPoint: [430, 154],
    flag: "./assets/flag-gb.png",
    capitalImage:
      "./assets/travel-gb-london.jpeg",
  },
  {
    country: "意大利",
    capital: "罗马",
    latLng: [41.8719, 12.5674],
    labelPoint: [498, 188],
    flag: "./assets/flag-it.png",
    capitalImage:
      "./assets/travel-it-rome.jpg",
  },
  {
    country: "奥地利",
    capital: "维也纳",
    latLng: [47.5162, 14.5501],
    labelPoint: [574, 150],
    flag: "./assets/flag-at.png",
    capitalImage:
      "./assets/travel-at-vienna.jpg",
  },
  {
    country: "丹麦",
    capital: "哥本哈根",
    latLng: [56.2639, 9.5018],
    labelPoint: [548, 88],
    flag: "./assets/flag-dk.png",
    capitalImage:
      "./assets/travel-dk-copenhagen.jpg",
  },
  {
    country: "冰岛",
    capital: "雷克雅未克",
    latLng: [64.9631, -19.0208],
    labelPoint: [420, 52],
    flag: "./assets/flag-is.png",
    capitalImage:
      "./assets/travel-is-reykjavik.jpg",
  },
  {
    country: "美国",
    capital: "华盛顿 D.C.",
    latLng: [37.0902, -95.7129],
    labelPoint: [260, 186],
    flag: "./assets/flag-us.png",
    capitalImage:
      "./assets/travel-us-washington-dc.jpg",
  },
];

const state = {
  coins: 0,
  rewards: new Set(),
  collectedCoins: new Set(),
  totalStageCoins: 0,
  finalVisited: false,
  clearShown: false,
  scrollTimer: null,
  sound: false,
  audio: null,
  musicTimer: null,
};

function setCoins(value) {
  state.coins = value;
  if (coinsEl) coinsEl.textContent = String(state.coins).padStart(2, "0");
}

function toast(title, body) {
  if (!toastStack) return;

  const item = document.createElement("div");
  const badge = document.createElement("span");
  const copy = document.createElement("div");
  const strong = document.createElement("strong");
  const text = document.createElement("p");

  item.className = "toast";
  badge.textContent = "COIN";
  strong.textContent = title;
  text.textContent = body;
  copy.append(strong, text);
  item.append(badge, copy);
  toastStack.append(item);
  window.setTimeout(() => item.remove(), 2400);
}

function popCoin(source) {
  const coin = document.createElement("span");
  const rect = source?.getBoundingClientRect?.();
  coin.className = "pop-coin";
  coin.style.left = `${Math.round((rect?.left ?? window.innerWidth / 2) + (rect?.width ?? 0) / 2)}px`;
  coin.style.top = `${Math.round((rect?.top ?? window.innerHeight - 100) + (rect?.height ?? 0) / 2)}px`;
  document.body.append(coin);
  coin.addEventListener("animationend", () => coin.remove(), { once: true });
}

function reward(key, label, source) {
  if (state.rewards.has(key)) return;
  state.rewards.add(key);
  setCoins(state.coins + 1);
  popCoin(source);
  toast("+1 COIN", label);
  runnerJump();
  playSfx("coin");
}

function checkClearCondition() {
  const collectedAllCoins = state.totalStageCoins > 0 && state.collectedCoins.size >= state.totalStageCoins;
  if (!collectedAllCoins || !state.finalVisited || state.clearShown) return;
  showClearModal();
}

function showClearModal() {
  state.clearShown = true;
  playSfx("level");

  if (!clearModal) {
    window.alert("恭喜你已通关！看起来你已经认识Weasley了，接下来快去联系他吧！");
    return;
  }

  clearModal.hidden = false;
  clearClose?.focus?.({ preventScroll: true });
}

function hideClearModal() {
  if (clearModal) clearModal.hidden = true;
}

function runnerJump() {
  if (!runner) return;
  runner.classList.remove("is-jumping");
  void runner.offsetWidth;
  runner.classList.add("is-jumping");
  window.setTimeout(() => runner.classList.remove("is-jumping"), 560);
}

function updateRunner() {
  if (!runner) return;

  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = window.scrollY / maxScroll;
  const track = document.querySelector(".runway-track");
  const maxY = Math.max(0, (track?.clientHeight ?? 0) - 72);
  runner.style.setProperty("--runner-y", `${Math.round(progress * maxY)}px`);
  app?.style.setProperty("--scroll-progress", progress.toFixed(3));

  runner.classList.add("is-running");
  window.clearTimeout(state.scrollTimer);
  state.scrollTimer = window.setTimeout(() => runner.classList.remove("is-running"), 150);
}

function setStage(label) {
  if (stageLabel) stageLabel.textContent = label;
}

function observeStages() {
  const stages = document.querySelectorAll("[data-stage-title]");
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (active?.target?.dataset.stageTitle) {
        setStage(active.target.dataset.stageTitle);
        if (active.target.id === "contact") {
          state.finalVisited = true;
          checkClearCondition();
        }
      }
    },
    { threshold: [0.32, 0.55, 0.72] }
  );

  stages.forEach((stage) => observer.observe(stage));
}

function renderHobby(key) {
  if (!hobbyDetail) return;
  const item = hobbyContent[key] || hobbyContent.photo;
  hobbyDetail.innerHTML = `
    <p class="rarity">${item.rarity}</p>
    <h3>${item.title}</h3>
    <p>${item.body}</p>
    <div class="mini-gallery" aria-label="${item.title}像素画廊">
      <span></span><span></span><span></span>
    </div>
  `;
}

const travelPassportSpreads = [
  {
    region: "亚洲",
    code: "ASIA",
    title: "近海冒险页",
    countries: ["韩国", "越南", "泰国", "马来西亚", "新加坡"],
    stampTone: "#90f0cd",
    route: "首尔 / 河内 / 曼谷 / 吉隆坡 / 新加坡",
  },
  {
    region: "欧洲",
    code: "EUROPE",
    title: "长途列车页",
    countries: ["英国", "意大利", "奥地利", "丹麦", "冰岛"],
    stampTone: "#d8c7f2",
    route: "伦敦 / 罗马 / 维也纳 / 哥本哈根 / 雷克雅未克",
  },
  {
    region: "北美",
    code: "N.AMERICA",
    title: "远航入境页",
    countries: ["美国"],
    stampTone: "#f3cb74",
    route: "华盛顿 D.C.",
  },
];

function findVisitedCountry(countryName) {
  return visitedCountries.find((country) => country.country === countryName);
}

function selectTravelCountry(country, source, shouldReward = false) {
  if (!country) return;

  visitedCountries.forEach((item) => item.marker?.classList.remove("is-active"));
  country.marker?.classList.add("is-active");

  if (travelPreviewTitle) travelPreviewTitle.textContent = country.country;
  if (travelPreviewCapital) travelPreviewCapital.textContent = `首都：${country.capital}`;

  if (travelPreviewImg) {
    travelPreviewImg.src = country.capitalImage;
    travelPreviewImg.alt = `${country.country}首都${country.capital}图片`;
  }

  if (travelPreviewFlag) {
    travelPreviewFlag.src = country.flag;
    travelPreviewFlag.alt = `${country.country}国旗`;
  }

  if (shouldReward) {
    reward(`travel-${country.country}`, `点亮旅行地图：${country.country}`, source);
  }
}

function renderTravelListFallback() {
  if (!travelMapEl) return;

  const fallback = document.createElement("div");
  fallback.className = "travel-map-fallback";

  visitedCountries.forEach((country, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = country.country;
    if (index === 0) button.classList.add("is-active");
    button.addEventListener("click", () => {
      fallback.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      selectTravelCountry(country, button, false);
    });
    fallback.append(button);
  });

  travelMapEl.replaceChildren(fallback);
  selectTravelCountry(visitedCountries[0], null, false);
}

function renderTravelPassport() {
  if (!travelMapEl) {
    renderTravelListFallback();
    return;
  }

  let pageIndex = 0;
  let selectedCountry = findVisitedCountry(travelPassportSpreads[0].countries[0]) || visitedCountries[0];

  const countryNames = (spread) => spread.countries.map(findVisitedCountry).filter(Boolean);

  const renderPage = (flipDirection = "") => {
    const spread = travelPassportSpreads[pageIndex];
    const spreadCountries = countryNames(spread);
    if (!spreadCountries.includes(selectedCountry)) {
      selectedCountry = spreadCountries[0] || visitedCountries[0];
    }

    travelMapEl.classList.remove("is-atlas");
    travelMapEl.classList.add("is-passport");
    travelMapEl.innerHTML = `
      <div class="passport-shell">
        <div class="passport-toolbar">
          <div class="passport-led">
            <strong>${spread.code}</strong>
            <span>PAGE ${String(pageIndex + 1).padStart(2, "0")} / ${String(travelPassportSpreads.length).padStart(2, "0")}</span>
          </div>
          <div class="passport-controls" aria-label="护照翻页">
            <button type="button" data-passport-prev aria-label="上一页签证章">&lt;</button>
            <button type="button" data-passport-next aria-label="下一页签证章">&gt;</button>
          </div>
        </div>

        <div class="passport-book ${flipDirection ? "is-flipping" : ""}" data-passport-book>
          <section class="passport-page passport-page-left">
            <div class="passport-page-top">
              <span>WEASLEY PASSPORT</span>
              <b>${spread.region}</b>
            </div>
            <div class="passport-id-strip">
              <span>VISITED</span>
              <strong>${String(spreadCountries.length).padStart(2, "0")}</strong>
              <em>${spread.title}</em>
            </div>
            <div class="stamp-grid" data-stamp-grid></div>
          </section>

          <section class="passport-page passport-page-right">
            <div class="passport-page-top">
              <span>ENTRY RECORD</span>
              <b>${selectedCountry.country}</b>
            </div>
            <div class="passport-visa-detail">
              <div class="passport-photo-stamp">
                <img src="${selectedCountry.flag}" alt="${selectedCountry.country}国旗" loading="lazy" />
                <span>APPROVED</span>
              </div>
              <div class="passport-entry-copy">
                <strong>${selectedCountry.country}</strong>
                <span>CAPITAL · ${selectedCountry.capital}</span>
                <p>${spread.route}</p>
              </div>
            </div>
            <div class="boarding-pass">
              <span>BOARDING PASS</span>
              <strong>${spread.code} -> ${selectedCountry.country}</strong>
              <em>STAMPED / UNLOCKED</em>
            </div>
          </section>
        </div>
      </div>
    `;

    const stampGrid = travelMapEl.querySelector("[data-stamp-grid]");
    spreadCountries.forEach((country, index) => {
      const stamp = document.createElement("button");
      stamp.type = "button";
      stamp.className = `visa-stamp${country === selectedCountry ? " is-active" : ""}`;
      stamp.style.setProperty("--stamp-tone", spread.stampTone);
      stamp.style.setProperty("--stamp-tilt", `${[-4, 3, -2, 4, -3][index % 5]}deg`);
      stamp.setAttribute("aria-label", `查看${country.country}签证章`);
      stamp.innerHTML = `
        <img src="${country.flag}" alt="" loading="lazy" />
        <strong>${country.country}</strong>
        <span>${country.capital}</span>
        <em>VISITED</em>
      `;
      country.marker = stamp;
      stamp.addEventListener("click", () => {
        selectedCountry = country;
        renderPage();
      });
      stampGrid?.append(stamp);
    });

    travelMapEl.querySelector("[data-passport-prev]")?.addEventListener("click", () => {
      pageIndex = (pageIndex - 1 + travelPassportSpreads.length) % travelPassportSpreads.length;
      selectedCountry = countryNames(travelPassportSpreads[pageIndex])[0] || selectedCountry;
      renderPage("prev");
      playSfx("open");
    });

    travelMapEl.querySelector("[data-passport-next]")?.addEventListener("click", () => {
      pageIndex = (pageIndex + 1) % travelPassportSpreads.length;
      selectedCountry = countryNames(travelPassportSpreads[pageIndex])[0] || selectedCountry;
      renderPage("next");
      playSfx("open");
    });

    selectTravelCountry(selectedCountry, selectedCountry.marker, false);
  };

  renderPage();
}

function getAudioContext() {
  if (state.audio) return state.audio;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  state.audio = new AudioContext();
  return state.audio;
}

function playTone(freq, duration = 0.1, type = "square", volume = 0.035) {
  if (!state.sound) return;
  const audio = getAudioContext();
  if (!audio) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audio.currentTime);
  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + duration + 0.03);
}

function playSfx(type) {
  const patterns = {
    coin: [880, 1175],
    brick: [330, 494, 660],
    open: [523, 659, 784],
    level: [523, 659, 784, 1046],
  };

  (patterns[type] || patterns.coin).forEach((freq, index) => {
    window.setTimeout(() => playTone(freq, 0.09 + index * 0.015), index * 52);
  });
}

function startMusic() {
  if (state.musicTimer) return;
  const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 392];
  let index = 0;
  state.musicTimer = window.setInterval(() => {
    playTone(notes[index % notes.length], 0.13, "square", 0.014);
    if (index % 4 === 0) playTone(notes[index % notes.length] / 2, 0.2, "triangle", 0.01);
    index += 1;
  }, 280);
}

function stopMusic() {
  window.clearInterval(state.musicTimer);
  state.musicTimer = null;
}

async function toggleSound() {
  state.sound = !state.sound;
  const audio = getAudioContext();
  await audio?.resume?.();

  soundButton?.setAttribute("aria-pressed", String(state.sound));
  const label = soundButton?.querySelector("b");
  if (label) label.textContent = state.sound ? "ON" : "OFF";

  if (state.sound) {
    startMusic();
    playSfx("level");
  } else {
    stopMusic();
  }
}

function bindCoins() {
  const stageCoins = document.querySelectorAll("[data-coin]");
  state.totalStageCoins = stageCoins.length;

  stageCoins.forEach((coin) => {
    coin.addEventListener("click", () => {
      const coinKey = coin.dataset.coin;
      if (!coinKey || state.collectedCoins.has(coinKey)) return;

      state.collectedCoins.add(coinKey);
      coin.classList.add("is-collected");
      reward(`coin-${coinKey}`, "收集路上的金币", coin);
      checkClearCondition();
    });
  });
}

function popBlockText(block, text) {
  const rect = block.getBoundingClientRect();
  const bubble = document.createElement("span");
  bubble.className = "block-pop";
  bubble.textContent = text;
  bubble.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
  bubble.style.top = `${Math.round(rect.top)}px`;
  document.body.append(bubble);
  bubble.addEventListener("animationend", () => bubble.remove(), { once: true });
}

function bindProfileBlocks() {
  document.querySelectorAll("[data-reveal]").forEach((block) => {
    block.addEventListener("click", () => {
      document.querySelectorAll("[data-reveal]").forEach((item) => item.classList.remove("is-active"));
      block.classList.remove("is-hit");
      void block.offsetWidth;
      block.classList.add("is-hit", "is-active");
      if (profileOutput) profileOutput.textContent = block.dataset.reveal;
      popBlockText(block, block.dataset.reveal);
      reward(`profile-${block.dataset.reveal}`, `解锁个人标签：${block.dataset.reveal}`, block);
      playSfx("brick");
    });
  });
}

function bindHobbies() {
  document.querySelectorAll("[data-hobby]").forEach((slot) => {
    slot.addEventListener("click", () => {
      document.querySelectorAll("[data-hobby]").forEach((item) => item.classList.remove("is-active"));
      slot.classList.add("is-active");
      renderHobby(slot.dataset.hobby);
      reward(`hobby-${slot.dataset.hobby}`, `打开爱好：${slot.querySelector("strong")?.textContent || ""}`, slot);
    });
  });
}

function bindTravelPins() {
  if (!travelMapEl) return;
  renderTravelPassport();
}

function bindStrengths() {
  document.querySelectorAll("[data-strength]").forEach((block) => {
    const show = () => {
      document.querySelectorAll("[data-strength]").forEach((item) => item.classList.remove("is-active"));
      block.classList.add("is-active");
      if (strengthOutput) {
        strengthOutput.textContent = block.dataset.detail || `${block.dataset.strength} · 能量 ${block.dataset.power}%`;
      }
    };

    block.addEventListener("mouseenter", show);
    block.addEventListener("focus", show);
    block.addEventListener("click", () => {
      show();
      reward(`strength-${block.dataset.strength}`, `点亮技能：${block.dataset.strength}`, block);
    });
  });
}

function bindProjects() {
  document.querySelectorAll("[data-project-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-project-card]");
      card?.classList.add("is-flipped");
      reward(`project-${card?.dataset.project}`, "完成一次项目挑战", button);
      playSfx("level");
    });
  });

  document.querySelectorAll("[data-project-close]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("[data-project-card]")?.classList.remove("is-flipped");
      playSfx("open");
    });
  });
}

function bindContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    const form = new FormData(contactForm);
    const name = String(form.get("name") || "访客");
    const contact = String(form.get("contact") || "未填写");
    const message = String(form.get("message") || "想和你聊聊。");
    const mailTo = contactForm.dataset.mailTo || "yangsihan222@163.com";
    const directEndpoint = contactForm.getAttribute("action") || "";
    const subject = encodeURIComponent(`来自像素主页的联系：${name}`);
    const body = encodeURIComponent(`称呼：${name}\n联系方式：${contact}\n\n${message}`);

    reward("contact-submit", "准备发送联系信息", contactForm.querySelector("button"));

    if (/^https?:\/\//.test(directEndpoint)) {
      return;
    }

    event.preventDefault();
    window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;
  });
}

function bindClearModal() {
  clearClose?.addEventListener("click", hideClearModal);
  clearModal?.addEventListener("click", (event) => {
    if (event.target === clearModal) hideClearModal();
  });
}

function bindInteractions() {
  bindCoins();
  bindProfileBlocks();
  bindHobbies();
  bindTravelPins();
  bindStrengths();
  bindProjects();
  bindContactForm();
  bindClearModal();
  soundButton?.addEventListener("click", toggleSound);
}

function showWelcome() {
  if (!welcomeScreen) return;

  window.setTimeout(() => {
    welcomeScreen.classList.add("is-hidden");
  }, 3000);

  window.setTimeout(() => {
    welcomeScreen.remove();
  }, 3400);
}

window.addEventListener("scroll", updateRunner, { passive: true });
window.addEventListener("resize", updateRunner);

bindInteractions();
observeStages();
renderHobby("photo");
setCoins(0);
setStage("个人信息");
updateRunner();
showWelcome();

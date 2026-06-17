const input = document.getElementById("jpInput");
const searchBtn = document.getElementById("searchBtn");
const resultArea = document.getElementById("resultArea");
const hotList = document.getElementById("hotList");
const historyList = document.getElementById("historyList");
const favoriteList = document.getElementById("favoriteList");

function getStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function translateKeyword(text) {
  let result = text.trim();

  Object.keys(IP_DICTIONARY).forEach(jp => {
    if (result.includes(jp)) {
      result = result.replaceAll(jp, IP_DICTIONARY[jp]);
    }
  });

  return result;
}

function makeKeywords(text) {
  const cn = translateKeyword(text);

  return [
    `${cn} 拼豆 图纸`,
    `${cn} 拼豆 模板`,
    `${cn} 拼豆 教程`,
    `${cn} perler beads pattern`,
    `${text} アイロンビーズ 図案`
  ];
}

function makeUrl(platform, keyword) {
  const q = encodeURIComponent(keyword);

  if (platform === "xhs") {
    return `https://www.xiaohongshu.com/search_result?keyword=${q}`;
  }

  if (platform === "google") {
    return `https://www.google.com/search?tbm=isch&q=${q}`;
  }

  if (platform === "pinterest") {
    return `https://www.pinterest.com/search/pins/?q=${q}`;
  }

  if (platform === "bing") {
    return `https://www.bing.com/images/search?q=${q}`;
  }
}

function saveHistory(text) {
  let history = getStorage("searchHistory");
  history = history.filter(item => item !== text);
  history.unshift(text);
  history = history.slice(0, 12);
  setStorage("searchHistory", history);
  renderHistory();
}

function addFavorite(keyword) {
  let favorites = getStorage("favorites");

  if (!favorites.includes(keyword)) {
    favorites.unshift(keyword);
  }

  setStorage("favorites", favorites);
  renderFavorites();
}

function removeFavorite(keyword) {
  let favorites = getStorage("favorites");
  favorites = favorites.filter(item => item !== keyword);
  setStorage("favorites", favorites);
  renderFavorites();
}

function search(text) {
  const value = text || input.value.trim();

  if (!value) {
    resultArea.innerHTML = `<p class="empty">请先输入日语关键词。</p>`;
    return;
  }

  input.value = value;
  saveHistory(value);

  const cn = translateKeyword(value);
  const keywords = makeKeywords(value);

  resultArea.innerHTML = `
    <h2>搜索结果</h2>
    <div class="card">
      <div class="sub">中文识别</div>
      <div class="keyword">${cn}</div>
    </div>

    ${keywords.map(keyword => `
      <div class="card">
        <div class="keyword">${keyword}</div>
        <div class="sub">选择平台打开搜索结果</div>

        <div class="link-grid">
          <a class="link" href="${makeUrl("xhs", keyword)}" target="_blank">小红书</a>
          <a class="link" href="${makeUrl("google", keyword)}" target="_blank">Google图片</a>
          <a class="link" href="${makeUrl("pinterest", keyword)}" target="_blank">Pinterest</a>
          <a class="link" href="${makeUrl("bing", keyword)}" target="_blank">Bing图片</a>
        </div>

        <button class="favorite-btn" onclick="addFavorite('${keyword.replaceAll("'", "\\'")}')">
          收藏这个关键词
        </button>
      </div>
    `).join("")}
  `;
}

function renderHotList() {
  hotList.innerHTML = HOT_IP.map(item => `
    <button class="tag" onclick="search('${item}')">${item}</button>
  `).join("");
}

function renderHistory() {
  const history = getStorage("searchHistory");

  if (!history.length) {
    historyList.innerHTML = `<p class="empty">暂无搜索历史</p>`;
    return;
  }

  historyList.innerHTML = history.map(item => `
    <button class="tag" onclick="search('${item}')">${item}</button>
  `).join("");
}

function renderFavorites() {
  const favorites = getStorage("favorites");

  if (!favorites.length) {
    favoriteList.innerHTML = `<p class="empty">暂无收藏</p>`;
    return;
  }

  favoriteList.innerHTML = favorites.map(item => `
    <button class="tag" onclick="search('${item}')">⭐ ${item}</button>
  `).join("");
}

searchBtn.addEventListener("click", () => search());

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    search();
  }
});

renderHotList();
renderHistory();
renderFavorites();
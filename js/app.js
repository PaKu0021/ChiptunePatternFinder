const dictionary = {
  "ナルト": "火影忍者",
  "なると": "火影忍者",
  "サスケ": "佐助",
  "カカシ": "卡卡西",
  "ちいかわ": "吉伊卡哇",
  "ハチワレ": "小八",
  "うさぎ": "乌萨奇",
  "初音ミク": "初音未来",
  "ミク": "初音未来",
  "ポケモン": "宝可梦",
  "ピカチュウ": "皮卡丘",
  "マリオ": "马里奥",
  "カービィ": "卡比",
  "ワンピース": "海贼王",
  "ルフィ": "路飞",
  "鬼滅の刃": "鬼灭之刃",
  "炭治郎": "炭治郎",
  "スパイファミリー": "间谍过家家",
  "アーニャ": "阿尼亚"
};

function translateToChinese(text) {
  let result = text.trim();

  for (const jp in dictionary) {
    if (result.includes(jp)) {
      result = result.replaceAll(jp, dictionary[jp]);
    }
  }

  return result;
}

function searchPattern() {
  const input = document.getElementById("jpInput").value.trim();
  const resultBox = document.getElementById("result");

  if (!input) {
    resultBox.innerHTML = "<p>请先输入日语关键词。</p>";
    return;
  }

  const cn = translateToChinese(input);

  const keywords = [
    `${cn} 拼豆 图纸`,
    `${cn} 拼豆 模板`,
    `${cn} perler beads 图纸`,
    `${cn} アイロンビーズ 図案`
  ];

  resultBox.innerHTML = keywords.map(keyword => {
    const url = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}`;

    return `
      <div class="card">
        <div class="keyword">${keyword}</div>
        <div>搜索小红书相关拼豆图纸</div>
        <a href="${url}" target="_blank">打开小红书搜索结果</a>
      </div>
    `;
  }).join("");
}

document.getElementById("searchBtn").addEventListener("click", searchPattern);
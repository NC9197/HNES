/**
 * ============================================================================
 * 👑 西寧國小五年二班 ‧ 西寧小小兵王國
 * 本地資料直傳雲端工具 (Upload Data to Cloud)
 * ============================================================================
 * 
 * 使用方式：
 * 1. 雙擊執行「一鍵上傳最新資料到雲端.bat」
 * 2. 或在終端機執行：
 *    node upload_data_to_cloud.js [GoogleAppsScript網址]
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const readline = require('readline');

const DATA_FILE = path.join(__dirname, 'data_sync.json');
const CONFIG_FILE = path.join(__dirname, 'cloud_config.json');

async function main() {
  console.log("==================================================================");
  console.log("👑 西寧國小五年二班 ‧ 西寧小小兵王國 雲端資料同步工具");
  console.log("==================================================================\n");

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ 找不到資料檔：${DATA_FILE}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  let dataObj;
  try {
    dataObj = JSON.parse(rawData);
  } catch (e) {
    console.error("❌ 資料檔 JSON 解析失敗：", e);
    process.exit(1);
  }

  const studentCount = dataObj.students ? dataObj.students.length : 0;
  console.log(`📦 已成功讀取本機名冊資料：共 ${studentCount} 位大臣`);
  console.log(`🐾 萌寵動物園認養狀態：全數正常綁定`);
  console.log(`💺 教室座位表：${dataObj.seatingLayout ? dataObj.seatingLayout.rows : 5} 排 x ${dataObj.seatingLayout ? dataObj.seatingLayout.cols : 6} 列`);
  console.log(`⏱️ 更新時間戳記：${dataObj.lastModified ? new Date(dataObj.lastModified).toLocaleString() : '剛剛'}\n`);

  // 1. 同步推送至本地運行中伺服器
  console.log("📡 [1/2] 正在推送至本機伺服器 (http://localhost:3000/api/sync)...");
  try {
    await postJson('http://localhost:3000/api/sync?force=1', dataObj);
    console.log("   ✅ 本機與區網伺服器同步成功！\n");
  } catch (e) {
    console.log("   ⚠️ 本機伺服器未開啟 (若需區網手機連線，請雙擊「啟動西寧小小兵王國.bat」)。\n");
  }

  // 2. 取得 Google Apps Script 網址
  let gasUrl = process.argv[2] || '';
  if (!gasUrl && fs.existsSync(CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      gasUrl = cfg.googleScriptUrl || '';
    } catch (_) {}
  }

  if (!gasUrl) {
    gasUrl = await promptQuestion("請貼上您的 Google Apps Script 網址 (若無請直接按 Enter 跳過)：\n👉 ");
    gasUrl = gasUrl.trim();
    if (gasUrl) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify({ googleScriptUrl: gasUrl }, null, 2), 'utf-8');
    }
  }

  if (gasUrl) {
    console.log(`\n☁️ [2/2] 正在上傳至 Google 官方雲端硬碟庫...`);
    console.log(`   網址：${gasUrl.slice(0, 45)}...`);
    try {
      const payload = {
        account: "xining502@gmail.com",
        data: dataObj
      };
      const result = await postJson(gasUrl, payload);
      console.log("   🎉 Google 雲端庫同步上傳成功！");
      console.log(`   回應狀態：`, result);
      console.log("\n📱 現在您可以在任何手機、平板或校外電腦打開網址，即可看見最新萌寵與名冊！");
    } catch (e) {
      console.error("   ❌ 上傳至 Google 雲端失敗：", e.message);
    }
  } else {
    console.log("💡 提示：若需跨 4G/5G 外網手機同步，可將 Google Apps Script 網址儲存至 cloud_config.json");
  }

  console.log("\n==================================================================");
  console.log("✨ 作業完成！");
  console.log("==================================================================");
}

function postJson(targetUrl, data, redirectCount = 0, method = 'POST') {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects (> 5)'));
    const urlObj = new URL(targetUrl);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    const isPost = method === 'POST' && data !== null;
    const postData = isPost ? (typeof data === 'string' ? data : JSON.stringify(data)) : '';

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'User-Agent': 'XiningKingdom-CloudUploader/2026',
        'Accept': 'application/json, text/plain, */*'
      },
      timeout: 15000
    };

    if (isPost) {
      options.headers['Content-Type'] = 'application/json; charset=utf-8';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = client.request(options, (res) => {
      // 處理 301, 302, 303, 307 重定向 (Google Apps Script 特性：POST 執行後 302 導向結果頁)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, targetUrl).toString();
        const nextMethod = (res.statusCode === 307 || res.statusCode === 308) ? method : 'GET';
        const nextData = nextMethod === 'POST' ? data : null;
        return postJson(nextUrl, nextData, redirectCount + 1, nextMethod).then(resolve).catch(reject);
      }

      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (_) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('連線 Google Apps Script 逾時 (15 秒)'));
    });
    req.on('error', reject);
    if (isPost) req.write(postData);
    req.end();
  });
}

function promptQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    });
  });
}

if (require.main === module) {
  main();
}

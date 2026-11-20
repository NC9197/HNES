/**
 * 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * 輕量本機 HTTP 伺服器 (Zero-dependency Web Server)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const BACKUPS_DIR = path.join(ROOT_DIR, 'backups');

// 確保備份資料夾存在
if (!fs.existsSync(BACKUPS_DIR)) {
  try { fs.mkdirSync(BACKUPS_DIR, { recursive: true }); } catch (_) {}
}

/**
 * 自動磁碟時光機快照 (保留最新 30 份)
 */
function backupFileBeforeOverwrite(sourcePath, label = 'autosave') {
  try {
    if (fs.existsSync(sourcePath)) {
      if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const dateTag = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const backupName = `backup_${dateTag}_${label}.json`;
      fs.copyFileSync(sourcePath, path.join(BACKUPS_DIR, backupName));

      // 滾動維持最新 30 份
      const all = fs.readdirSync(BACKUPS_DIR).filter(f => f.startsWith('backup_') && f.endsWith('.json'));
      if (all.length > 30) {
        all.sort();
        const toDelete = all.slice(0, all.length - 30);
        toDelete.forEach(f => {
          try { fs.unlinkSync(path.join(BACKUPS_DIR, f)); } catch (_) {}
        });
      }
    }
  } catch (err) {
    console.warn('[Backup] 備份檔案失敗:', err.message);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

const server = http.createServer((req, res) => {
  // CORS & Security & Cache-Busting Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // 取得本機區網 IP 與連線資訊 API
  if (pathname === '/api/network-info' || pathname === '/api/info') {
    const ips = getLocalIpAddresses();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      port: PORT,
      ips: ips,
      primaryIp: ips[0] || 'localhost'
    }));
    return;
  }

  // 取得或儲存全域雲端設定 API (供本機伺服器、網頁與手機共享 Google Apps Script 網址)
  if (pathname === '/api/sync/config') {
    const configPath = path.join(ROOT_DIR, 'cloud_config.json');
    if (req.method === 'GET') {
      let cfg = { googleScriptUrl: '', googleAccount: 'xining502@gmail.com' };
      if (fs.existsSync(configPath)) {
        try { cfg = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (_) {}
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, ...cfg }));
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          let currentCfg = {};
          if (fs.existsSync(configPath)) {
            try { currentCfg = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (_) {}
          }
          const updated = { ...currentCfg, ...parsed };
          fs.writeFileSync(configPath, JSON.stringify(updated, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, message: '雲端同步設定已儲存', config: updated }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return;
    }
  }

  // 查詢伺服器歷史快照清單
  if (pathname === '/api/sync/snapshots') {
    try {
      if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
      const files = fs.readdirSync(BACKUPS_DIR)
        .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
        .sort().reverse();
      const snapshots = files.map(filename => {
        const fullPath = path.join(BACKUPS_DIR, filename);
        const stat = fs.statSync(fullPath);
        return {
          filename,
          size: stat.size,
          mtime: stat.mtimeMs,
          timeString: new Date(stat.mtimeMs).toLocaleString()
        };
      });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, count: snapshots.length, snapshots }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // 還原指定歷史快照或電腦原始完整存檔
  if (pathname === '/api/sync/restore' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const defaultSyncFilePath = path.join(ROOT_DIR, 'data_sync.json');
        let restoreSource = '';

        if (payload.snapshotName) {
          const safeName = path.basename(payload.snapshotName);
          const candidate = path.join(BACKUPS_DIR, safeName);
          if (fs.existsSync(candidate)) {
            restoreSource = candidate;
          }
        }

        // 若未指定或找不到，優先尋找 11/17 完整存檔或最新備份
        if (!restoreSource) {
          const specificPath = path.join(ROOT_DIR, 'data_sync_xining502@gmail.com.json');
          if (fs.existsSync(specificPath)) {
            restoreSource = specificPath;
          } else if (fs.existsSync(defaultSyncFilePath)) {
            restoreSource = defaultSyncFilePath;
          }
        }

        if (!restoreSource || !fs.existsSync(restoreSource)) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, message: '找不到可還原的歷史備份檔' }));
          return;
        }

        // 先備份現有檔案
        backupFileBeforeOverwrite(defaultSyncFilePath, 'before_restore');

        // 讀取還原檔並打上全新時間戳，保證所有連線裝置拉取後立刻同步
        const restoredData = JSON.parse(fs.readFileSync(restoreSource, 'utf8'));
        restoredData.lastModified = Date.now();
        fs.writeFileSync(defaultSyncFilePath, JSON.stringify(restoredData, null, 2), 'utf8');
        const specificPath = path.join(ROOT_DIR, 'data_sync_xining502@gmail.com.json');
        if (fs.existsSync(specificPath)) {
          fs.writeFileSync(specificPath, JSON.stringify(restoredData, null, 2), 'utf8');
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          message: `已成功還原存檔 (${path.basename(restoreSource)})！`,
          lastModified: restoredData.lastModified,
          studentCount: restoredData.students ? restoredData.students.length : 0,
          data: restoredData
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 跨裝置雲端/區網同步 REST API (具備防舊覆蓋新、強制版本校驗、自動備份快照)
  if (pathname === '/api/sync') {
    const accountParam = reqUrl.searchParams.get('account') || reqUrl.searchParams.get('key') || '';
    const safeAccount = accountParam.replace(/[^a-zA-Z0-9_\-@.]/g, '_');
    const specificPath = safeAccount ? path.join(ROOT_DIR, `data_sync_${safeAccount}.json`) : null;
    const defaultSyncFilePath = path.join(ROOT_DIR, 'data_sync.json');
    const primaryFilePath = specificPath || defaultSyncFilePath;

    if (req.method === 'GET') {
      // 優先讀取特定帳號檔，若無則讀取預設存檔
      const fileToRead = (specificPath && fs.existsSync(specificPath)) ? specificPath : defaultSyncFilePath;
      fs.readFile(fileToRead, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, message: '目前尚無同步存檔' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.students)) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, error: '存檔內容缺少學生名冊或格式無效' }));
            return;
          }

          const isForce = reqUrl.searchParams.get('force') === '1' || reqUrl.searchParams.get('force') === 'true';
          const incomingTime = parsed.lastModified || 0;

          // 讀取伺服器現存檔案時間戳
          let existingTime = 0;
          let targetPath = (specificPath && fs.existsSync(specificPath)) ? specificPath : defaultSyncFilePath;
          if (fs.existsSync(targetPath)) {
            try {
              const currentOnDisk = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
              existingTime = currentOnDisk.lastModified || 0;
            } catch (_) {}
          }

          // 核心防護：若傳入的時間小於伺服器現存時間，且非強制覆蓋，嚴格拒絕舊資料蓋新資料！
          if (!isForce && incomingTime > 0 && existingTime > 0 && incomingTime < existingTime) {
            console.warn(`[Sync Guard] 攔截過期資料推送！用戶端時間: ${new Date(incomingTime).toLocaleString()}, 伺服器時間: ${new Date(existingTime).toLocaleString()}`);
            res.writeHead(409, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
              success: false,
              conflict: true,
              clientTime: incomingTime,
              serverTime: existingTime,
              message: `伺服器上有更新的資料版本 (${new Date(existingTime).toLocaleString()})，拒絕以較舊的裝置資料 (${new Date(incomingTime).toLocaleString()}) 覆蓋！請先從伺服器拉取最新資料。`
            }));
            return;
          }

          // 防呆名冊校準：嚴防任何裝置將舊測試名冊（王品捷、李宇軒）推送到伺服器覆蓋五年二班真實名冊（洪永恩、莊淇勛）
          const hasStaleDemoNames = parsed.students && parsed.students.some(s => s.name === "王品捷" || s.name === "李宇軒" || s.name === "林冠廷");
          if (hasStaleDemoNames) {
            console.warn('[Sync Guard] 攔截含有舊示範人名的過期推送，強制校準為真實名冊！');
            const masterFile = path.join(ROOT_DIR, 'data_sync.json');
            if (fs.existsSync(masterFile)) {
              try {
                const master = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
                if (master.students && Array.isArray(master.students)) {
                  master.students.forEach((mst, idx) => {
                    const target = parsed.students.find(s => s.seatNo === mst.seatNo || s.id === mst.id) || parsed.students[idx];
                    if (target) {
                      target.name = mst.name;
                      target.title = mst.title;
                      target.gender = mst.gender;
                      target.birthday = mst.birthday;
                    }
                  });
                  parsed.students = parsed.students.filter(s => s.seatNo <= 27 && s.id <= 27);
                }
              } catch (_) {}
            }
          }

          // 寫入前自動保留快照留底
          backupFileBeforeOverwrite(defaultSyncFilePath, `push_${incomingTime || Date.now()}`);

          // 確保寫入之 lastModified 時間戳永遠保持最新遞增
          parsed.lastModified = Math.max(incomingTime, existingTime, Date.now());

          // 同步寫入預設存檔與指定帳號檔
          fs.writeFileSync(defaultSyncFilePath, JSON.stringify(parsed, null, 2), 'utf8');
          if (specificPath) {
            fs.writeFileSync(specificPath, JSON.stringify(parsed, null, 2), 'utf8');
          }

          console.log(`[Sync Success] 資料成功同步！大臣人數: ${parsed.students.length}, 時間戳: ${new Date(parsed.lastModified).toLocaleString()}`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            lastModified: parsed.lastModified,
            studentCount: parsed.students.length
          }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: '無效的 JSON 格式: ' + e.message }));
        }
      });
      return;
    }
  }

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, pathname);

  // 防止路徑遍歷攻擊
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 存取受限');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>🏰 找不到王國頁面 (404 Not Found)</h2>
          <p><a href="/">返回西寧小小兵王國首頁</a></p>
        </div>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const localIps = getLocalIpAddresses();
  console.log('================================================================');
  console.log('👑 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統伺服器已啟動！');
  console.log('================================================================');
  console.log(`\n💻 本機電腦瀏覽網址：`);
  console.log(`   👉 http://localhost:${PORT}`);
  console.log(`\n📱 手機/平板/區域網路查閱網址 (同一 Wi-Fi 連線下)：`);
  if (localIps.length > 0) {
    localIps.forEach(ip => {
      console.log(`   👉 http://${ip}:${PORT}`);
      console.log(`   👉 家長專用直達通道: http://${ip}:${PORT}/?parent=1`);
    });
  } else {
    console.log(`   👉 http://localhost:${PORT}/?parent=1`);
  }
  console.log('\n按下 Ctrl + C 可隨時停止伺服器。');
  console.log('================================================================\n');
});

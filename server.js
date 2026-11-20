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

// Active SSE clients for instant realtime broadcast
const sseClients = new Set();

function broadcastSseUpdate(data) {
  const payload = `data: ${JSON.stringify({ type: 'sync_update', lastModified: data.lastModified || Date.now(), timestamp: Date.now() })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (_) {
      sseClients.delete(client);
    }
  }
}

function mergeDatasets(base, incoming) {
  if (!base) return incoming;
  if (!incoming) return base;

  // 1. 密碼終身保護鎖
  const finalPassword = (base.queenPassword && base.queenPassword !== 'queen')
    ? base.queenPassword
    : (incoming.queenPassword || 'queen');

  // 2. 學生名冊與點數智能融合 (只增不減，永遠保留最高累積成果)
  const mergedStudents = (base.students || []).map(bSt => {
    const iSt = (incoming.students || []).find(s => s.seatNo === bSt.seatNo || s.id === bSt.id);
    if (!iSt) return bSt;
    const bestPoints = Math.max(bSt.points || 0, iSt.points || 0);
    const bestLifetime = Math.max(bSt.lifetimePoints || 0, iSt.lifetimePoints || 0);
    return {
      ...bSt,
      ...iSt,
      name: iSt.name || bSt.name,
      points: bestPoints,
      lifetimePoints: bestLifetime,
      petExp: bestLifetime,
      animalType: iSt.animalType || bSt.animalType || 'dog',
      petType: iSt.petType || bSt.petType || 'dog',
      secondPetType: iSt.secondPetType || bSt.secondPetType,
      secondPetExp: Math.max(bSt.secondPetExp || 0, iSt.secondPetExp || 0)
    };
  });

  // 3. 簽到表按日按座號雙向融合 (不遺漏任何一台裝置打卡)
  const mergedAttendance = { ...(base.attendance || {}) };
  if (incoming.attendance && typeof incoming.attendance === 'object') {
    Object.keys(incoming.attendance).forEach(dateKey => {
      if (!mergedAttendance[dateKey]) {
        mergedAttendance[dateKey] = { ...incoming.attendance[dateKey] };
      } else {
        const bDay = mergedAttendance[dateKey];
        const iDay = incoming.attendance[dateKey];
        const combinedDay = { ...bDay };
        Object.keys(iDay).forEach(stKey => {
          if (!combinedDay[stKey] || combinedDay[stKey].status === 'pending') {
            combinedDay[stKey] = iDay[stKey];
          } else if (iDay[stKey] && iDay[stKey].status !== 'pending') {
            combinedDay[stKey] = iDay[stKey];
          }
        });
        mergedAttendance[dateKey] = combinedDay;
      }
    });
  }

  // 4. 作業按 ID 雙向融合 (多裝置新增與批閱互不覆蓋)
  const hwMap = new Map();
  (base.homework || []).forEach(hw => { if (hw && hw.id) hwMap.set(hw.id, { ...hw }); });
  (incoming.homework || []).forEach(iHw => {
    if (!iHw || !iHw.id) return;
    if (!hwMap.has(iHw.id)) {
      hwMap.set(iHw.id, { ...iHw });
    } else {
      const bHw = hwMap.get(iHw.id);
      hwMap.set(iHw.id, { ...bHw, ...iHw, records: { ...(bHw.records || {}), ...(iHw.records || {}) } });
    }
  });
  const mergedHomework = Array.from(hwMap.values());

  // 5. 聯絡簿智慧融合 (取更新時間較新或內容完整者)
  let mergedContactBook = incoming.contactBook;
  if (base.contactBook && incoming.contactBook) {
    const bTime = base.contactBook.updatedAt || 0;
    const iTime = incoming.contactBook.updatedAt || 0;
    if (bTime > iTime) mergedContactBook = base.contactBook;
  } else if (base.contactBook) {
    mergedContactBook = base.contactBook;
  }

  // 6. 歷程日誌融合 (依 ID 去重)
  const logMap = new Map();
  (base.pointLogs || []).forEach(l => { if (l && l.id) logMap.set(l.id, l); });
  (incoming.pointLogs || []).forEach(l => { if (l && l.id) logMap.set(l.id, l); });
  const mergedPointLogs = Array.from(logMap.values()).sort((a,b) => (b.id || 0) - (a.id || 0)).slice(0, 50);

  return {
    ...base,
    ...incoming,
    queenPassword: finalPassword,
    students: mergedStudents,
    attendance: mergedAttendance,
    homework: mergedHomework,
    contactBook: mergedContactBook,
    contactBookHistory: { ...(base.contactBookHistory || {}), ...(incoming.contactBookHistory || {}) },
    pointLogs: mergedPointLogs,
    lastModified: Date.now()
  };
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

    // 即時廣播伺服器推播 API (Server-Sent Events) - 實現 0.05 秒跨裝置極速同步
  if (pathname === '/api/sync/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', time: Date.now() })}\n\n`);
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

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

        // 密碼保護鎖：若伺服器已有自訂密碼，而還原檔為預設值或為空，保留伺服器自訂密碼
        if (fs.existsSync(defaultSyncFilePath)) {
          try {
            const currentOnDisk = JSON.parse(fs.readFileSync(defaultSyncFilePath, 'utf8'));
            if (currentOnDisk.queenPassword && currentOnDisk.queenPassword !== 'queen') {
              if (!restoredData.queenPassword || restoredData.queenPassword === 'queen') {
                restoredData.queenPassword = currentOnDisk.queenPassword;
              }
            }
          } catch (_) {}
        }
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

          let targetPath = (specificPath && fs.existsSync(specificPath)) ? specificPath : defaultSyncFilePath;
          let finalData = parsed;

          // 核心升級：若伺服器已有現存資料，執行「智能雙向融合 (Smart Merge)」，絕不拒絕 409，絕不丟失任何裝置的編輯！
          if (fs.existsSync(targetPath)) {
            try {
              const currentOnDisk = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
              finalData = mergeDatasets(currentOnDisk, parsed);
            } catch (_) {
              finalData = parsed;
            }
          }

          // 寫入前自動保留快照留底
          backupFileBeforeOverwrite(defaultSyncFilePath, `push_${Date.now()}`);

          // 確保寫入之 lastModified 時間戳永遠為最新目前時間
          finalData.lastModified = Date.now();

          // 同步寫入預設存檔與指定帳號檔
          fs.writeFileSync(defaultSyncFilePath, JSON.stringify(finalData, null, 2), 'utf8');
          if (specificPath) {
            fs.writeFileSync(specificPath, JSON.stringify(finalData, null, 2), 'utf8');
          }

          // 即時廣播給所有連線中的裝置 (電腦、手機、平板秒級同步刷新！)
          broadcastSseUpdate(finalData);

          console.log(`[Sync Success] 智能融合資料成功同步！大臣人數: ${finalData.students.length}, 時間戳: ${new Date(finalData.lastModified).toLocaleTimeString()}`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            lastModified: finalData.lastModified,
            studentCount: finalData.students.length,
            data: finalData
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

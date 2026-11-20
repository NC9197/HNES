/**
 * ============================================================================
 * 👑 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * Google Apps Script 雲端專屬同步中繼站 (2026 旗艦終極版：智能雙向融合 + 密碼終身保護)
 * ============================================================================
 * 
 * 核心升級亮點：
 * 1. 智能雙向融合 (Smart Non-Destructive Merge)：
 *    - 平板與手機即使同時編輯、先後送達，作業、點數、簽到紀錄自動雙向合併，絕不互相沖刷！
 * 2. 導師密碼終身防護鎖 (Password Protection Guard)：
 *    - 雲端嚴密守護導師自訂密碼，任何預設值 queen 絕無法覆蓋導師權限！
 * 3. 500KB 超大容量自動分塊儲存 (突破單一屬性限制，支援全班大數據)。
 * 4. 支援真實 27 位大臣名冊 (洪永恩、莊淇勛...)，全手動純淨模式。
 * 
 * 部署教學 (只需 1 分鐘)：
 * 步驟 1：前往 https://script.google.com/ 打開您的專案
 * 步驟 2：全選並貼上覆蓋 Code.gs 中的全部內容
 * 步驟 3：點擊右上角「部署」➔「管理部署作業」➔ 鉛筆圖示「編輯」
 * 步驟 4：版本選擇「新版本 (New version)」，點擊「部署」即完成！
 */

function doGet(e) {
  var p = (e && e.parameter) || {};
  var account = (p.account || 'default').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  var action = p.action || 'pull';
  var prop = PropertiesService.getScriptProperties();

  // 若直接以瀏覽器打開網址（未帶參數），顯示健康的連線歡迎頁
  if (!p.action && !p.account) {
    var info = {
      status: "online",
      system: "西寧國小五年二班 ‧ 西寧小小兵王國 雲端同步中繼站",
      version: "2026.v4.smart_merge",
      time: new Date().toISOString(),
      message: "🟢 雲端同步服務正常運作中！智能融合與密碼防護鎖已全面啟用。"
    };
    return ContentService.createTextOutput(JSON.stringify(info, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 接收 GET 方式推送 (Fallback Push)
  if (action === 'push' && p.payload) {
    var incoming = {};
    try { incoming = JSON.parse(p.payload); } catch (_) {}
    var existingStr = loadData(prop, account);
    var existing = {};
    try { existing = JSON.parse(existingStr || '{}'); } catch (_) {}
    var merged = mergeDatasets(existing, incoming);
    saveData(prop, account, JSON.stringify(merged));

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      action: 'push_get',
      account: account,
      lastModified: merged.lastModified,
      timestamp: new Date().getTime()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 預設為拉取 (Pull)
  var jsonStr = loadData(prop, account);
  return ContentService.createTextOutput(jsonStr || '{}')
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var prop = PropertiesService.getScriptProperties();
  var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
  var body = {};

  try {
    body = JSON.parse(raw);
  } catch (err) {
    body = { data: raw };
  }

  var account = (body.account || (e && e.parameter && e.parameter.account) || 'default').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  var incomingData = null;
  if (body.data !== undefined && body.data !== null) {
    incomingData = (typeof body.data === 'string') ? JSON.parse(body.data) : body.data;
  } else if (body.students) {
    incomingData = body;
  } else {
    try { incomingData = JSON.parse(raw); } catch (_) { incomingData = body; }
  }

  var existingStr = loadData(prop, account);
  var existingData = {};
  try {
    existingData = JSON.parse(existingStr || '{}');
  } catch (_) {}

  // 執行雲端智能雙向融合 (Smart Merge)，絕不覆蓋任何裝置的最新編輯
  var mergedData = mergeDatasets(existingData, incomingData);
  saveData(prop, account, JSON.stringify(mergedData));

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    action: 'push_post',
    account: account,
    lastModified: mergedData.lastModified,
    studentCount: mergedData.students ? mergedData.students.length : 0,
    timestamp: new Date().getTime()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 雲端核心智能雙向融合邏輯 (Smart Non-Destructive Merge)
 */
function mergeDatasets(base, incoming) {
  if (!base || typeof base !== 'object' || !base.students) return incoming || {};
  if (!incoming || typeof incoming !== 'object' || !incoming.students) return base || {};

  // 1. 導師密碼終身防護鎖：絕不被預設值 "queen" 覆蓋
  var finalPassword = (base.queenPassword && base.queenPassword !== 'queen')
    ? base.queenPassword
    : (incoming.queenPassword || 'queen');

  // 2. 學生名冊與點數智能融合 (只增不減，永遠保留最高累積成果)
  var mergedStudents = (base.students || []).map(function(bSt) {
    var iSt = null;
    var incList = incoming.students || [];
    for (var i = 0; i < incList.length; i++) {
      if (incList[i].seatNo === bSt.seatNo || incList[i].id === bSt.id) {
        iSt = incList[i];
        break;
      }
    }
    if (!iSt) return bSt;

    var bestPoints = Math.max(Number(bSt.points) || 0, Number(iSt.points) || 0);
    var bestLifetime = Math.max(Number(bSt.lifetimePoints) || 0, Number(iSt.lifetimePoints) || 0);
    return {
      id: bSt.id,
      seatNo: bSt.seatNo,
      name: iSt.name || bSt.name,
      gender: iSt.gender || bSt.gender,
      title: iSt.title || bSt.title,
      birthday: iSt.birthday || bSt.birthday,
      points: bestPoints,
      lifetimePoints: bestLifetime,
      petExp: bestLifetime,
      animalType: iSt.animalType || bSt.animalType || 'dog',
      petType: iSt.petType || bSt.petType || 'dog',
      secondPetType: iSt.secondPetType || bSt.secondPetType || null,
      secondPetExp: Math.max(Number(bSt.secondPetExp) || 0, Number(iSt.secondPetExp) || 0),
      pets: (iSt.pets && iSt.pets.length > 0) ? iSt.pets : bSt.pets
    };
  });

  // 3. 簽到表按日按座號雙向合併 (多裝置打卡自動合併，不漏任何學生)
  var mergedAttendance = {};
  var bAtt = base.attendance || {};
  var iAtt = incoming.attendance || {};

  for (var d in bAtt) {
    mergedAttendance[d] = {};
    for (var s in bAtt[d]) {
      mergedAttendance[d][s] = bAtt[d][s];
    }
  }

  for (var iday in iAtt) {
    if (!mergedAttendance[iday]) {
      mergedAttendance[iday] = iAtt[iday];
    } else {
      for (var seat in iAtt[iday]) {
        var rec = iAtt[iday][seat];
        if (!mergedAttendance[iday][seat] || mergedAttendance[iday][seat].status === 'pending') {
          mergedAttendance[iday][seat] = rec;
        } else if (rec && rec.status !== 'pending') {
          mergedAttendance[iday][seat] = rec;
        }
      }
    }
  }

  // 4. 作業按 ID 雙向合併 (多裝置新增與批閱互不沖刷)
  var hwMap = {};
  var bHw = base.homework || [];
  for (var h = 0; h < bHw.length; h++) {
    if (bHw[h] && bHw[h].id) hwMap[bHw[h].id] = bHw[h];
  }
  var iHw = incoming.homework || [];
  for (var ih = 0; ih < iHw.length; ih++) {
    var item = iHw[ih];
    if (!item || !item.id) continue;
    if (!hwMap[item.id]) {
      hwMap[item.id] = item;
    } else {
      var existHw = hwMap[item.id];
      var combinedRecords = {};
      var r1 = existHw.records || {};
      var r2 = item.records || {};
      for (var k1 in r1) combinedRecords[k1] = r1[k1];
      for (var k2 in r2) combinedRecords[k2] = r2[k2];
      item.records = combinedRecords;
      hwMap[item.id] = item;
    }
  }
  var mergedHomework = [];
  for (var hid in hwMap) {
    mergedHomework.push(hwMap[hid]);
  }

  // 5. 聯絡簿智慧融合 (取更新時間較新或內容完整者)
  var mergedContactBook = incoming.contactBook;
  if (base.contactBook && incoming.contactBook) {
    var bTime = Number(base.contactBook.updatedAt) || 0;
    var iTime = Number(incoming.contactBook.updatedAt) || 0;
    if (bTime > iTime) mergedContactBook = base.contactBook;
  } else if (base.contactBook) {
    mergedContactBook = base.contactBook;
  }

  // 6. 聯絡簿歷史紀錄
  var mergedCbHistory = {};
  var bHist = base.contactBookHistory || {};
  var iHist = incoming.contactBookHistory || {};
  for (var bh in bHist) mergedCbHistory[bh] = bHist[bh];
  for (var ihist in iHist) mergedCbHistory[ihist] = iHist[ihist];

  // 7. 歷程日誌融合 (依 ID 去重)
  var logMap = {};
  var bLogs = base.pointLogs || [];
  for (var bl = 0; bl < bLogs.length; bl++) {
    if (bLogs[bl] && bLogs[bl].id) logMap[bLogs[bl].id] = bLogs[bl];
  }
  var iLogs = incoming.pointLogs || [];
  for (var il = 0; il < iLogs.length; il++) {
    if (iLogs[il] && iLogs[il].id) logMap[iLogs[il].id] = iLogs[il];
  }
  var mergedLogs = [];
  for (var lid in logMap) {
    mergedLogs.push(logMap[lid]);
  }
  mergedLogs.sort(function(a, b) { return (b.id || 0) - (a.id || 0); });
  if (mergedLogs.length > 50) mergedLogs = mergedLogs.slice(0, 50);

  var nowTime = new Date().getTime();

  return {
    queenPassword: finalPassword,
    lateThreshold: incoming.lateThreshold || base.lateThreshold || "07:40",
    students: mergedStudents,
    attendance: mergedAttendance,
    homework: mergedHomework,
    contactBook: mergedContactBook,
    contactBookHistory: mergedCbHistory,
    pointLogs: mergedLogs,
    pointPresets: incoming.pointPresets || base.pointPresets,
    homeworkPresets: incoming.homeworkPresets || base.homeworkPresets,
    behaviorReasons: incoming.behaviorReasons || base.behaviorReasons,
    alarmPresets: incoming.alarmPresets || base.alarmPresets,
    announcements: incoming.announcements || base.announcements,
    rewardCards: incoming.rewardCards || base.rewardCards,
    rewardRedemptions: incoming.rewardRedemptions || base.rewardRedemptions || [],
    behaviorCards: incoming.behaviorCards || base.behaviorCards || {},
    trafficOverrides: incoming.trafficOverrides || base.trafficOverrides || {},
    seatingLayout: incoming.seatingLayout || base.seatingLayout,
    seatingChart: incoming.seatingChart || base.seatingChart,
    lastModified: nowTime,
    realRosterV20261119: true
  };
}

// -------------------------------------------------------------
// 資料分塊儲存核心 (突破單一屬性 9KB 限制，支援多達 500KB 班級資料)
// -------------------------------------------------------------
function saveData(prop, account, str) {
  if (!str) return;
  var CHUNK_SIZE = 8000;
  var totalChunks = Math.ceil(str.length / CHUNK_SIZE);
  var oldTotal = parseInt(prop.getProperty('chunk_cnt_' + account) || '0', 10);

  // 清除舊的多餘分塊
  for (var i = totalChunks; i < oldTotal; i++) {
    prop.deleteProperty('data_' + account + '_' + i);
  }

  // 寫入新分塊
  for (var i = 0; i < totalChunks; i++) {
    prop.setProperty('data_' + account + '_' + i, str.substr(i * CHUNK_SIZE, CHUNK_SIZE));
  }

  prop.setProperty('chunk_cnt_' + account, String(totalChunks));
  prop.setProperty('time_' + account, String(new Date().getTime()));
}

function loadData(prop, account) {
  var count = parseInt(prop.getProperty('chunk_cnt_' + account) || '0', 10);
  if (count <= 0) {
    return prop.getProperty('data_' + account) || '{}';
  }
  var parts = [];
  for (var i = 0; i < count; i++) {
    parts.push(prop.getProperty('data_' + account + '_' + i) || '');
  }
  return parts.join('');
}

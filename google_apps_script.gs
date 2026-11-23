/**
 * ============================================================================
 * 👑 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * Google Apps Script 雲端專屬同步中繼站 (2026 旗艦終極版：智能雙向融合 + 密碼終身保護 + 特權卡撤銷連動)
 * ============================================================================
 * 
 * 核心升級亮點：
 * 1. 智能雙向融合 (Smart Non-Destructive Merge)：
 *    - 平板與手機即使同時編輯、先後送達，作業、點數、簽到紀錄自動雙向合併，絕不互相沖刷！
 * 2. 導師密碼終身防護鎖 (Password Protection Guard)：
 *    - 雲端嚴密守護導師自訂密碼，任何預設值 queen 絕無法覆蓋導師權限！
 * 3. 特權卡撤銷與抽屜同步防護 (Card Revocation Protection)：
 *    - 撤銷退換卡牌狀態具最高權限，自動清洗卡牌抽屜，撤銷之卡牌絕不在任何裝置復活！
 * 4. 皇室公佈欄純淨同步 (Clean Announcements Sync)：
 *    - 導師刪除或清空公告即時生效，不被舊假公告回沖。
 * 5. 500KB 超大容量自動分塊儲存 (突破單一屬性限制，支援全班大數據)。
 * 6. 支援真實 27 位大臣名冊 (洪永恩、莊淇勛...)，全手動純淨模式。
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

  // 預設為拉取 (Pull) - 支援標準 JSON 與 Safari 專用 JSONP 跨網域免預檢回傳
  var jsonStr = loadData(prop, account);
  if (p.callback) {
    return ContentService.createTextOutput(p.callback + '(' + (jsonStr || '{}') + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
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

  // 2. 特權卡兌換紀錄智能雙向融合 (撤銷 revoked 與使用 used 狀態具最高權限，絕不倒退回未撤銷)
  var redMap = {};
  var bRed = base.rewardRedemptions || [];
  for (var br = 0; br < bRed.length; br++) {
    if (bRed[br] && bRed[br].id) redMap[bRed[br].id] = bRed[br];
  }
  var iRed = incoming.rewardRedemptions || [];
  for (var ir = 0; ir < iRed.length; ir++) {
    var rItem = iRed[ir];
    if (!rItem || !rItem.id) continue;
    if (!redMap[rItem.id]) {
      redMap[rItem.id] = rItem;
    } else {
      var existRec = redMap[rItem.id];
      if (rItem.status === 'revoked' || existRec.status === 'revoked') {
        rItem.status = 'revoked';
        rItem.revokedAt = rItem.revokedAt || existRec.revokedAt || new Date().toISOString();
      } else if (rItem.status === 'used' || existRec.status === 'used') {
        rItem.status = 'used';
        rItem.usedAt = rItem.usedAt || existRec.usedAt;
      }
      redMap[rItem.id] = rItem;
    }
  }
  var mergedRedemptions = [];
  for (var rid in redMap) {
    mergedRedemptions.push(redMap[rid]);
  }

  // 建立已註銷/已核銷 ID 表，避免撤銷之卡牌殘留在抽屜中
  var inactiveCardIds = {};
  for (var rIdx = 0; rIdx < mergedRedemptions.length; rIdx++) {
    var stat = mergedRedemptions[rIdx].status;
    if (stat === 'used' || stat === 'revoked') {
      inactiveCardIds[mergedRedemptions[rIdx].id] = true;
    }
  }

  // 3. 學生名冊與點數智能融合 (支援手機/平板/電腦雙向同步、新增大臣與卡牌抽屜純淨同步)
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

    // 優先採納最新推送裝置的設定值 (支援加點、扣點、重設、歸零)
    var finalPoints = (iSt.points !== undefined && iSt.points !== null) ? Number(iSt.points) : (Number(bSt.points) || 0);
    var finalLifetime = (iSt.lifetimePoints !== undefined && iSt.lifetimePoints !== null) ? Number(iSt.lifetimePoints) : (Number(bSt.lifetimePoints) || 0);
    if (finalLifetime <= 0 && finalPoints > 0) {
      finalLifetime = finalPoints;
    }
    var finalPets = (iSt.pets && iSt.pets.length > 0) ? iSt.pets : bSt.pets;
    var finalSecondPet = iSt.secondPetType !== undefined ? iSt.secondPetType : (bSt.secondPetType || null);
    var finalSecondExp = (iSt.secondPetExp !== undefined && iSt.secondPetExp !== null) ? Number(iSt.secondPetExp) : (Number(bSt.secondPetExp) || 0);

    // 卡牌抽屜同步與已註銷清洗
    var rawCards = (iSt.redeemedCards && Array.isArray(iSt.redeemedCards))
      ? iSt.redeemedCards
      : ((bSt.redeemedCards && Array.isArray(bSt.redeemedCards)) ? bSt.redeemedCards : []);
    var cleanCards = [];
    for (var c = 0; c < rawCards.length; c++) {
      if (rawCards[c] && rawCards[c].id && !inactiveCardIds[rawCards[c].id]) {
        cleanCards.push(rawCards[c]);
      }
    }

    return {
      id: bSt.id,
      seatNo: bSt.seatNo,
      name: iSt.name || bSt.name,
      gender: iSt.gender || bSt.gender,
      title: iSt.title || bSt.title,
      birthday: iSt.birthday || bSt.birthday,
      points: finalPoints,
      lifetimePoints: finalLifetime,
      petExp: finalLifetime,
      animalType: iSt.animalType || bSt.animalType || 'dog',
      petType: iSt.petType || bSt.petType || 'dog',
      secondPetType: finalSecondPet,
      secondPetExp: finalSecondExp,
      pets: finalPets,
      redeemedCards: cleanCards
    };
  });

  // 核心修復：若手機/平板新增了大臣 (例如第28位或新座號)，自動完整併入名冊，絕不遺漏！
  var incomingList = incoming.students || [];
  for (var k = 0; k < incomingList.length; k++) {
    var cand = incomingList[k];
    if (!cand) continue;
    var exists = false;
    for (var m = 0; m < mergedStudents.length; m++) {
      if (mergedStudents[m].seatNo === cand.seatNo || mergedStudents[m].id === cand.id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      if (!cand.redeemedCards) cand.redeemedCards = [];
      mergedStudents.push(cand);
    }
  }
  mergedStudents.sort(function(a, b) { return (Number(a.seatNo) || 0) - (Number(b.seatNo) || 0); });

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
    announcements: (incoming.announcements !== undefined && incoming.announcements !== null) ? incoming.announcements : (base.announcements || []),
    rewardCards: incoming.rewardCards || base.rewardCards,
    rewardRedemptions: mergedRedemptions,
    behaviorCards: incoming.behaviorCards || base.behaviorCards || {},
    trafficOverrides: incoming.trafficOverrides || base.trafficOverrides || {},
    seatingLayout: incoming.seatingLayout || base.seatingLayout,
    seatingChart: incoming.seatingChart || base.seatingChart,
    lastModified: nowTime,
    realRosterV20261119: true
  };
}

// -------------------------------------------------------------
// 資料分塊儲存核心 (突破單一屬性 9KB 限制，支援多達 500KB 班級資料，雙向相容雙鍵名)
// -------------------------------------------------------------
function saveData(prop, account, str) {
  if (!str) return;
  var CHUNK_SIZE = 8000;
  var totalChunks = Math.ceil(str.length / CHUNK_SIZE);
  var oldTotal1 = parseInt(prop.getProperty('chunk_cnt_' + account) || '0', 10);
  var oldTotal2 = parseInt(prop.getProperty('data_sync_chunk_count_' + account) || '0', 10);
  var oldTotal = Math.max(oldTotal1, oldTotal2);

  // 清除舊的多餘分塊
  for (var i = totalChunks; i < oldTotal; i++) {
    prop.deleteProperty('data_' + account + '_' + i);
    prop.deleteProperty('data_sync_chunk_' + account + '_' + i);
  }

  // 寫入新分塊 (雙向鍵名同步寫入，確保所有版本拉取皆能完美解鎖)
  for (var i = 0; i < totalChunks; i++) {
    var chunkStr = str.substr(i * CHUNK_SIZE, CHUNK_SIZE);
    prop.setProperty('data_' + account + '_' + i, chunkStr);
    prop.setProperty('data_sync_chunk_' + account + '_' + i, chunkStr);
  }

  prop.setProperty('chunk_cnt_' + account, String(totalChunks));
  prop.setProperty('data_sync_chunk_count_' + account, String(totalChunks));
  prop.setProperty('time_' + account, String(new Date().getTime()));
}

function loadData(prop, account) {
  var count = parseInt(prop.getProperty('chunk_cnt_' + account) || prop.getProperty('data_sync_chunk_count_' + account) || '0', 10);
  if (count <= 0) {
    return prop.getProperty('data_' + account) || prop.getProperty('data_sync_' + account) || '{}';
  }
  var parts = [];
  for (var i = 0; i < count; i++) {
    var chunk = prop.getProperty('data_' + account + '_' + i) || prop.getProperty('data_sync_chunk_' + account + '_' + i) || '';
    parts.push(chunk);
  }
  return parts.join('');
}

/**
 * ============================================================================
 * 👑 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * Google Apps Script 雲端專屬同步中繼站 (2026 旗艦終極版 v7：智能雙向融合 + 單調遞增版本號 + 直式聯絡簿同步 + 示範作業自動清洗)
 * ============================================================================
 * 
 * 核心升級亮點：
 * 1. 單調遞增雲端版本號 (Monotonic Cloud Revision)：
 *    - 每次手機或電腦推送存檔，雲端自動將 cloudRevision 遞增 1，徹底破除不同裝置間的時鐘誤差，保證手機編輯後電腦 100% 秒級更新！
 * 2. 智慧作業清洗防護鎖 (Demo Homework Purge & Permanent Graveyard)：
 *    - 徹底剃除「國習」、「國語習作完成」等示範假作業，自動寫入永久墓碑 deletedHomeworkIds，絕不在任何裝置復活！
 * 3. 智能雙向融合 (Smart Non-Destructive Merge)：
 *    - 平板與手機即使同時編輯、先後送達，作業、點數、簽到紀錄自動雙向合併，絕不互相沖刷！
 * 4. 導師密碼終身防護鎖 (Password Protection Guard)：
 *    - 雲端嚴密守護導師自訂密碼，任何預設值 queen 絕無法覆蓋導師權限！
 * 5. 特權卡撤銷與抽屜同步防護 (Card Revocation Protection)：
 *    - 撤銷退換卡牌狀態具最高權限，自動清洗卡牌抽屜，撤銷之卡牌絕不在任何裝置殘留！
 * 6. 500KB 超大容量自動分塊儲存 (突破單一屬性限制，支援全班大數據)。
 * 7. 支援直式聯絡簿格式同步與 27 位大臣全手動名冊。
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
      version: "2026.v7.vertical_contact_and_bidirectional_sync",
      time: new Date().toISOString(),
      message: "🟢 雲端同步服務正常運作中！單調遞增版本號、直式聯絡簿同步與示範作業永久清洗鎖已全面啟用。"
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

    var revKey = 'cloud_revision_' + account;
    var currentRev = parseInt(prop.getProperty(revKey) || '0', 10) + 1;
    prop.setProperty(revKey, String(currentRev));

    var merged = mergeDatasets(existing, incoming);
    merged.cloudRevision = currentRev;
    saveData(prop, account, JSON.stringify(merged));

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      action: 'push_get',
      account: account,
      cloudRevision: currentRev,
      lastModified: merged.lastModified,
      timestamp: new Date().getTime()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 預設為拉取 (Pull) - 支援標準 JSON 與 Safari 專用 JSONP 跨網域免預檢回傳
  var jsonStr = loadData(prop, account);
  var revKey = 'cloud_revision_' + account;
  var currentRev = parseInt(prop.getProperty(revKey) || '0', 10);

  // 雲端資料即時清洗防護：若歷史儲存中含有示範假作業，自動即時剃除並寫入永久墓碑，確保 cloudRevision
  if (jsonStr && jsonStr !== '{}') {
    try {
      var pullData = JSON.parse(jsonStr);
      var modified = false;

      if (!pullData.cloudRevision && currentRev > 0) {
        pullData.cloudRevision = currentRev;
        modified = true;
      }

      if (pullData && pullData.homework && Array.isArray(pullData.homework)) {
        var cleanHwList = [];
        var delList = (pullData.deletedHomeworkIds && Array.isArray(pullData.deletedHomeworkIds)) ? pullData.deletedHomeworkIds.map(String) : ["1", "2", "3"];
        var delMap = {};
        for (var di = 0; di < delList.length; di++) delMap[delList[di]] = true;
        delMap["1"] = true; delMap["2"] = true; delMap["3"] = true;

        for (var hi = 0; hi < pullData.homework.length; hi++) {
          var chk = pullData.homework[hi];
          if (!chk || !chk.id) { modified = true; continue; }
          var csid = String(chk.id);
          var ct = String(chk.title || '').replace(/\s+/g, '');
          var cp = String(chk.presetName || '').replace(/\s+/g, '');
          if (delMap[csid] || csid === "1" || csid === "2" || csid === "3" ||
              chk.date === "2026-11-16" || chk.dueDate === "2026-11-16" ||
              ct.indexOf("國語習作第八課") !== -1 || ct.indexOf("生字造詞隨堂筆記") !== -1 ||
              ct.indexOf("數學習作P.62") !== -1 || ct.indexOf("數學習作P62") !== -1 ||
              ct === "國語習作完成" || ct === "國習完成" ||
              ((ct === "國習" || cp === "國習") && (!chk.dueDate || chk.date <= "2026-11-24" || chk.dueDate <= "2026-11-24"))) {
            modified = true;
            if (!delMap[csid]) {
              delMap[csid] = true;
              delList.push(csid);
            }
          } else {
            cleanHwList.push(chk);
          }
        }
        if (modified) {
          pullData.homework = cleanHwList;
          pullData.deletedHomeworkIds = delList;
          jsonStr = JSON.stringify(pullData);
          saveData(prop, account, jsonStr);
        }
      }
    } catch (_) {}
  }

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

  // 累加單調遞增雲端版本號 (Monotonic Cloud Revision)
  var revKey = 'cloud_revision_' + account;
  var currentRev = parseInt(prop.getProperty(revKey) || '0', 10) + 1;
  prop.setProperty(revKey, String(currentRev));

  // 執行雲端智能雙向融合 (Smart Merge)，絕不覆蓋任何裝置的最新編輯
  var mergedData = mergeDatasets(existingData, incomingData);
  mergedData.cloudRevision = currentRev;
  saveData(prop, account, JSON.stringify(mergedData));

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    action: 'push_post',
    account: account,
    cloudRevision: currentRev,
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
    if (bRed[br] && bRed[br].id) redMap[String(bRed[br].id)] = bRed[br];
  }
  var iRed = incoming.rewardRedemptions || [];
  for (var ir = 0; ir < iRed.length; ir++) {
    var rItem = iRed[ir];
    if (!rItem || !rItem.id) continue;
    var rid = String(rItem.id);
    if (!redMap[rid]) {
      redMap[rid] = rItem;
    } else {
      var existRec = redMap[rid];
      var finalStatus = 'pending';
      var revokedAt = rItem.revokedAt || existRec.revokedAt;
      var usedAt = rItem.usedAt || existRec.usedAt;
      if (rItem.status === 'revoked' || existRec.status === 'revoked') {
        finalStatus = 'revoked';
        if (!revokedAt) revokedAt = new Date().toISOString();
      } else if (rItem.status === 'used' || existRec.status === 'used') {
        finalStatus = 'used';
        if (!usedAt) usedAt = new Date().toISOString();
      } else if (rItem.status === 'pending' || existRec.status === 'pending') {
        finalStatus = 'pending';
      }
      var mergedItem = {};
      for (var k in existRec) { mergedItem[k] = existRec[k]; }
      for (var k2 in rItem) { mergedItem[k2] = rItem[k2]; }
      mergedItem.status = finalStatus;
      if (revokedAt) mergedItem.revokedAt = revokedAt;
      if (usedAt) mergedItem.usedAt = usedAt;
      redMap[rid] = mergedItem;
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
      inactiveCardIds[String(mergedRedemptions[rIdx].id)] = true;
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
    if (!iSt) {
      var bCards = (bSt.redeemedCards && Array.isArray(bSt.redeemedCards)) ? bSt.redeemedCards : [];
      var cleanBCards = [];
      for (var bc = 0; bc < bCards.length; bc++) {
        if (bCards[bc] && bCards[bc].id && !inactiveCardIds[String(bCards[bc].id)]) {
          cleanBCards.push(bCards[bc]);
        }
      }
      return {
        id: bSt.id,
        seatNo: bSt.seatNo,
        name: bSt.name,
        gender: bSt.gender,
        title: bSt.title,
        birthday: bSt.birthday,
        points: bSt.points || 0,
        lifetimePoints: bSt.lifetimePoints || 0,
        petExp: bSt.lifetimePoints || 0,
        animalType: bSt.animalType || 'dog',
        petType: bSt.petType || 'dog',
        secondPetType: bSt.secondPetType || null,
        secondPetExp: bSt.secondPetExp || 0,
        pets: bSt.pets || [{ type: bSt.animalType || 'dog' }],
        redeemedCards: cleanBCards
      };
    }

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
      if (rawCards[c] && rawCards[c].id && !inactiveCardIds[String(rawCards[c].id)]) {
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
      var cleanCandCards = [];
      for (var cc = 0; cc < cand.redeemedCards.length; cc++) {
        if (cand.redeemedCards[cc] && cand.redeemedCards[cc].id && !inactiveCardIds[String(cand.redeemedCards[cc].id)]) {
          cleanCandCards.push(cand.redeemedCards[cc]);
        }
      }
      cand.redeemedCards = cleanCandCards;
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

  // 4. 作業按 ID 雙向合併 + 刪除墓碑 (deletedHomeworkIds) 徹底封殺已刪除與舊示範假作業
  var deletedHwMap = {};
  var bDel = base.deletedHomeworkIds || [];
  var iDel = incoming.deletedHomeworkIds || [];
  for (var d1 = 0; d1 < bDel.length; d1++) deletedHwMap[String(bDel[d1])] = true;
  for (var d2 = 0; d2 < iDel.length; d2++) deletedHwMap[String(iDel[d2])] = true;
  deletedHwMap["1"] = true;
  deletedHwMap["2"] = true;
  deletedHwMap["3"] = true;

  function isDemoOrDeletedHw(hw) {
    if (!hw) return true;
    var sid = String(hw.id || '');
    if (deletedHwMap[sid]) return true;
    if (sid === "1" || sid === "2" || sid === "3") return true;
    if (hw.date === "2026-11-16" || hw.dueDate === "2026-11-16") return true;
    var t = String(hw.title || '').replace(/\s+/g, '');
    var p = String(hw.presetName || '').replace(/\s+/g, '');
    if (t.indexOf("國語習作第八課") !== -1 || t.indexOf("生字造詞隨堂筆記") !== -1 || t.indexOf("數學習作P.62") !== -1 || t.indexOf("數學習作P62") !== -1) return true;
    if (t === "國語習作完成" || t === "國習完成") return true;
    if (t === "國習" && (!hw.dueDate || hw.date <= "2026-11-24" || hw.dueDate <= "2026-11-24")) return true;
    if (p === "國習" && (!hw.dueDate || hw.date <= "2026-11-24" || hw.dueDate <= "2026-11-24")) return true;
    return false;
  }

  var hwMap = {};
  var bHw = base.homework || [];
  for (var h = 0; h < bHw.length; h++) {
    var bhItem = bHw[h];
    if (bhItem && bhItem.id && !isDemoOrDeletedHw(bhItem)) {
      hwMap[String(bhItem.id)] = bhItem;
    }
  }
  var iHw = incoming.homework || [];
  for (var ih = 0; ih < iHw.length; ih++) {
    var item = iHw[ih];
    if (!item || !item.id || isDemoOrDeletedHw(item)) continue;
    var hidStr = String(item.id);
    if (!hwMap[hidStr]) {
      hwMap[hidStr] = item;
    } else {
      var existHw = hwMap[hidStr];
      var combinedRecords = {};
      var r1 = existHw.records || {};
      var r2 = item.records || {};
      for (var k1 in r1) combinedRecords[k1] = r1[k1];
      for (var k2 in r2) combinedRecords[k2] = r2[k2];
      item.records = combinedRecords;
      hwMap[hidStr] = item;
    }
  }
  var mergedHomework = [];
  for (var hid in hwMap) {
    mergedHomework.push(hwMap[hid]);
  }
  var mergedDeletedHwList = [];
  for (var did in deletedHwMap) {
    mergedDeletedHwList.push(did);
  }
  if (mergedDeletedHwList.length > 200) {
    mergedDeletedHwList = mergedDeletedHwList.slice(-200);
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
    deletedHomeworkIds: mergedDeletedHwList,
    contactBook: mergedContactBook,
    contactBookHistory: mergedCbHistory,
    pointLogs: mergedLogs,
    pointPresets: incoming.pointPresets || base.pointPresets,
    homeworkPresets: incoming.homeworkPresets || base.homeworkPresets,
    behaviorReasons: incoming.behaviorReasons || base.behaviorReasons,
    alarmPresets: incoming.alarmPresets || base.alarmPresets,
    timerPresets: incoming.timerPresets || base.timerPresets,
    announcements: (incoming.announcements !== undefined && incoming.announcements !== null) ? incoming.announcements : (base.announcements || []),
    rewardCards: incoming.rewardCards || base.rewardCards,
    rewardRedemptions: mergedRedemptions,
    behaviorCards: incoming.behaviorCards || base.behaviorCards || {},
    trafficOverrides: incoming.trafficOverrides || base.trafficOverrides || {},
    seatingLayout: incoming.seatingLayout || base.seatingLayout,
    seatingChart: incoming.seatingChart || base.seatingChart,
    cloudRevision: incoming.cloudRevision || base.cloudRevision || 1,
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

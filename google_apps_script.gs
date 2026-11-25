/**
 * ============================================================================
 * 👑 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * Google Apps Script 雲端專屬同步中繼站 (2026 旗艦精煉版 v8.1：常規提醒單融合 + 座位表紅綠燈 + 單調遞增版本號 + 直式聯絡簿同步 + 示範作業自動清洗)
 * ============================================================================
 * 
 * 部署教學 (只需 30 秒)：
 * 步驟 1：前往 https://script.google.com/ 打開您的專案
 * 步驟 2：按 Ctrl+A 全選並貼上覆蓋 程式碼.gs / Code.gs 中的全部內容
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
      version: "2026.v8.streamlined",
      time: new Date().toISOString(),
      message: "🟢 雲端同步服務正常運作中！常規提醒單融合、單調遞增版本號、直式聯絡簿同步與示範作業永久清洗鎖已全面啟用。"
    };
    return ContentService.createTextOutput(JSON.stringify(info, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var revKey = 'cloud_revision_' + account;

  // 接收 GET 方式推送 (Fallback Push)
  if (action === 'push' && p.payload) {
    var incoming = {};
    try { incoming = JSON.parse(p.payload); } catch (_) {}
    var existing = {};
    try { existing = JSON.parse(loadData(prop, account) || '{}'); } catch (_) {}
    var currentRev = parseInt(prop.getProperty(revKey) || '0', 10) + 1;
    prop.setProperty(revKey, String(currentRev));
    var merged = mergeDatasets(existing, incoming);
    merged.cloudRevision = currentRev;
    saveData(prop, account, JSON.stringify(merged));
    return ContentService.createTextOutput(JSON.stringify({
      success: true, action: 'push_get', account: account,
      cloudRevision: currentRev, lastModified: merged.lastModified, timestamp: new Date().getTime()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 預設為拉取 (Pull) - 支援標準 JSON 與 Safari 專用 JSONP 跨網域免預檢回傳
  var jsonStr = loadData(prop, account);
  var currentRev = parseInt(prop.getProperty(revKey) || '0', 10);

  // 雲端資料即時清洗防護：若歷史儲存中含有示範假作業，自動即時剃除並寫入永久墓碑
  if (jsonStr && jsonStr !== '{}') {
    try {
      var pullData = JSON.parse(jsonStr);
      var modified = false;
      if (!pullData.cloudRevision && currentRev > 0) {
        pullData.cloudRevision = currentRev;
        modified = true;
      }
      if (pullData && Array.isArray(pullData.homework)) {
        var cleanHw = [];
        var delMap = { "1": true, "2": true, "3": true };
        var delList = Array.isArray(pullData.deletedHomeworkIds) ? pullData.deletedHomeworkIds.map(String) : ["1", "2", "3"];
        delList.forEach(function(id) { delMap[id] = true; });

        pullData.homework.forEach(function(chk) {
          if (!chk || !chk.id) { modified = true; return; }
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
            if (!delMap[csid]) { delMap[csid] = true; delList.push(csid); }
          } else {
            cleanHw.push(chk);
          }
        });
        if (modified) {
          pullData.homework = cleanHw;
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
  try { body = JSON.parse(raw); } catch (_) { body = { data: raw }; }

  var account = (body.account || (e && e.parameter && e.parameter.account) || 'default').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  var incomingData = null;
  if (body.data !== undefined && body.data !== null) {
    incomingData = (typeof body.data === 'string') ? JSON.parse(body.data) : body.data;
  } else if (body.students) {
    incomingData = body;
  } else {
    try { incomingData = JSON.parse(raw); } catch (_) { incomingData = body; }
  }

  var existing = {};
  try { existing = JSON.parse(loadData(prop, account) || '{}'); } catch (_) {}

  // 累加單調遞增雲端版本號 (Monotonic Cloud Revision)
  var revKey = 'cloud_revision_' + account;
  var currentRev = parseInt(prop.getProperty(revKey) || '0', 10) + 1;
  prop.setProperty(revKey, String(currentRev));

  // 執行雲端智能雙向融合 (Smart Merge)
  var mergedData = mergeDatasets(existing, incomingData);
  mergedData.cloudRevision = currentRev;
  saveData(prop, account, JSON.stringify(mergedData));

  return ContentService.createTextOutput(JSON.stringify({
    success: true, action: 'push_post', account: account,
    cloudRevision: currentRev, lastModified: mergedData.lastModified,
    studentCount: mergedData.students ? mergedData.students.length : 0, timestamp: new Date().getTime()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 雲端核心智能雙向融合邏輯 (Smart Non-Destructive Merge)
 */
function mergeDatasets(base, incoming) {
  if (!base || typeof base !== 'object' || !base.students) return incoming || {};
  if (!incoming || typeof incoming !== 'object' || !incoming.students) return base || {};

  // 1. 導師密碼終身防護鎖
  var finalPassword = (base.queenPassword && base.queenPassword !== 'queen')
    ? base.queenPassword : (incoming.queenPassword || 'queen');

  // 2. 特權卡兌換紀錄融合 (撤銷與已用具最高優先級，避免已撤銷卡牌在抽屜殘留)
  var redMap = {}, inactiveCardIds = {};
  (base.rewardRedemptions || []).concat(incoming.rewardRedemptions || []).forEach(function(r) {
    if (!r || !r.id) return;
    var rid = String(r.id);
    if (!redMap[rid]) {
      redMap[rid] = r;
    } else {
      var prev = redMap[rid];
      var status = (r.status === 'revoked' || prev.status === 'revoked') ? 'revoked'
                 : ((r.status === 'used' || prev.status === 'used') ? 'used' : 'pending');
      redMap[rid] = Object.assign({}, prev, r, {
        status: status,
        revokedAt: r.revokedAt || prev.revokedAt,
        usedAt: r.usedAt || prev.usedAt
      });
    }
    if (redMap[rid].status === 'used' || redMap[rid].status === 'revoked') {
      inactiveCardIds[rid] = true;
    }
  });
  var mergedRedemptions = Object.keys(redMap).map(function(k) { return redMap[k]; });

  // 3. 學生名冊與點數智能融合
  var incStudentMap = {};
  (incoming.students || []).forEach(function(s) { if (s) incStudentMap[s.seatNo] = s; });

  var mergedStudents = (base.students || []).map(function(bSt) {
    var iSt = incStudentMap[bSt.seatNo] || {};
    var rawCards = Array.isArray(iSt.redeemedCards) ? iSt.redeemedCards : (Array.isArray(bSt.redeemedCards) ? bSt.redeemedCards : []);
    var cleanCards = rawCards.filter(function(c) { return c && c.id && !inactiveCardIds[String(c.id)]; });

    var sSeat = Number(bSt.seatNo);
    var gender = (sSeat >= 1 && sSeat <= 13) ? 'M' : ((sSeat >= 14 && sSeat <= 27) ? 'F' : (iSt.gender || bSt.gender || 'M'));
    var pts = (iSt.points !== undefined && iSt.points !== null) ? Number(iSt.points) : (Number(bSt.points) || 0);
    var life = (iSt.lifetimePoints !== undefined && iSt.lifetimePoints !== null) ? Number(iSt.lifetimePoints) : (Number(bSt.lifetimePoints) || 0);
    if (life <= 0 && pts > 0) life = pts;

    return {
      id: bSt.id, seatNo: bSt.seatNo, name: iSt.name || bSt.name, gender: gender,
      title: iSt.title || bSt.title, birthday: iSt.birthday || bSt.birthday,
      points: pts, lifetimePoints: life, petExp: life,
      animalType: iSt.animalType || bSt.animalType || 'dog', petType: iSt.petType || bSt.petType || 'dog',
      secondPetType: iSt.secondPetType !== undefined ? iSt.secondPetType : (bSt.secondPetType || null),
      secondPetExp: (iSt.secondPetExp !== undefined && iSt.secondPetExp !== null) ? Number(iSt.secondPetExp) : (Number(bSt.secondPetExp) || 0),
      pets: (iSt.pets && iSt.pets.length > 0) ? iSt.pets : bSt.pets,
      redeemedCards: cleanCards
    };
  });

  // 補齊新加入的大臣
  (incoming.students || []).forEach(function(cand) {
    if (!cand) return;
    var exists = mergedStudents.some(function(s) { return s.seatNo === cand.seatNo || s.id === cand.id; });
    if (!exists) {
      var cCards = (cand.redeemedCards || []).filter(function(c) { return c && c.id && !inactiveCardIds[String(c.id)]; });
      mergedStudents.push(Object.assign({}, cand, { redeemedCards: cCards }));
    }
  });
  mergedStudents.sort(function(a, b) { return (Number(a.seatNo) || 0) - (Number(b.seatNo) || 0); });

  // 4. 簽到表按日雙向合併
  var mergedAttendance = Object.assign({}, base.attendance || {});
  var iAtt = incoming.attendance || {};
  for (var day in iAtt) {
    mergedAttendance[day] = Object.assign({}, mergedAttendance[day] || {});
    for (var seat in iAtt[day]) {
      var rec = iAtt[day][seat];
      if (!mergedAttendance[day][seat] || mergedAttendance[day][seat].status === 'pending' || (rec && rec.status !== 'pending')) {
        mergedAttendance[day][seat] = rec;
      }
    }
  }

  // 5. 作業合併與示範作業永久墓碑
  var delMap = { "1": true, "2": true, "3": true };
  (base.deletedHomeworkIds || []).concat(incoming.deletedHomeworkIds || []).forEach(function(d) { delMap[String(d)] = true; });

  function isDeleted(hw) {
    if (!hw || !hw.id) return true;
    var sid = String(hw.id);
    if (delMap[sid] || sid === "1" || sid === "2" || sid === "3") return true;
    if (hw.date === "2026-11-16" || hw.dueDate === "2026-11-16") return true;
    var t = String(hw.title || '').replace(/\s+/g, ''), p = String(hw.presetName || '').replace(/\s+/g, '');
    if (t.indexOf("國語習作第八課") !== -1 || t.indexOf("生字造詞隨堂筆記") !== -1 || t.indexOf("數學習作P.62") !== -1 || t.indexOf("數學習作P62") !== -1) return true;
    if (t === "國語習作完成" || t === "國習完成") return true;
    if ((t === "國習" || p === "國習") && (!hw.dueDate || hw.date <= "2026-11-24" || hw.dueDate <= "2026-11-24")) return true;
    return false;
  }

  var hwMap = {};
  (base.homework || []).concat(incoming.homework || []).forEach(function(item) {
    if (!item || isDeleted(item)) return;
    var hid = String(item.id);
    if (!hwMap[hid]) {
      hwMap[hid] = item;
    } else {
      var comb = Object.assign({}, hwMap[hid].records || {}, item.records || {});
      // 已完成防倒灌
      var rBase = hwMap[hid].records || {}, rIn = item.records || {};
      for (var k in comb) {
        if ((rBase[k] === 'submitted' || rBase[k] === 'excellent') && (rIn[k] === 'pending' || rIn[k] === 'revision')) {
          comb[k] = rBase[k];
        }
      }
      hwMap[hid] = Object.assign({}, hwMap[hid], item, { records: comb });
    }
  });
  var mergedHomework = Object.keys(hwMap).map(function(k) { return hwMap[k]; });
  var mergedDelList = Object.keys(delMap).slice(-200);

  // 6. 聯絡簿智慧融合
  var mergedContactBook = incoming.contactBook;
  if (base.contactBook && incoming.contactBook) {
    var bTime = Number(base.contactBook.updatedAt) || 0, iTime = Number(incoming.contactBook.updatedAt) || 0;
    if (bTime > iTime) mergedContactBook = base.contactBook;
  } else if (base.contactBook) {
    mergedContactBook = base.contactBook;
  }
  var mergedCbHistory = Object.assign({}, base.contactBookHistory || {}, incoming.contactBookHistory || {});

  // 7. 歷程日誌 (去重取前50筆)
  var logMap = {};
  (base.pointLogs || []).concat(incoming.pointLogs || []).forEach(function(l) { if (l && l.id) logMap[l.id] = l; });
  var mergedLogs = Object.keys(logMap).map(function(k) { return logMap[k]; })
    .sort(function(a, b) { return (b.id || 0) - (a.id || 0); }).slice(0, 50);

  // 8. 行為卡牌與常規提醒單融合
  var mergedBehaviorCards = {};
  var allStKeys = {};
  Object.keys(base.behaviorCards || {}).concat(Object.keys(incoming.behaviorCards || {})).forEach(function(k) { allStKeys[k] = true; });

  for (var stId in allStKeys) {
    var bC = (base.behaviorCards && base.behaviorCards[stId]) || {};
    var iC = (incoming.behaviorCards && incoming.behaviorCards[stId]) || {};
    var slipMap = {};
    (bC.reminderSlips || []).concat(iC.reminderSlips || []).forEach(function(s) {
      if (!s || !s.id) return;
      if (!slipMap[s.id] || s.status === 'completed') slipMap[s.id] = s;
    });
    var combinedSlips = Object.keys(slipMap).map(function(k) { return slipMap[k]; });

    var refMap = {};
    var refSource = (inTime >= baseTime)
      ? (iC.reflectionReasons || []).concat((bC.reflectionReasons || []).filter(function(r) { return !r.isAutoHw; }))
      : (bC.reflectionReasons || []).concat((iC.reflectionReasons || []).filter(function(r) { return !r.isAutoHw; }));
    refSource.forEach(function(r) {
      if (r && r.text) refMap[r.text + '_' + (r.hwId || '')] = r;
    });
    var combinedRef = Object.keys(refMap).map(function(k) { return refMap[k]; });

    var srvMap = {};
    (bC.serviceReasons || []).concat(iC.serviceReasons || []).forEach(function(s) {
      if (s && s.text) srvMap[s.text] = s;
    });
    var combinedSrv = Object.keys(srvMap).map(function(k) { return srvMap[k]; });

    var baseObj = (iC.reflectionCount !== undefined) ? iC : bC;
    var pendingCount = combinedSlips.filter(function(s) { return s.status === 'pending'; }).length;
    mergedBehaviorCards[stId] = Object.assign({}, baseObj, {
      reminderSlips: combinedSlips, reminderCount: pendingCount,
      reflectionReasons: combinedRef, reflectionCount: combinedRef.length, reflectionCard: combinedRef.length > 0,
      reflectionReason: combinedRef.map(function(r) { return r.text; }).join('、'),
      serviceReasons: combinedSrv, serviceCount: combinedSrv.length, serviceCard: combinedSrv.length > 0,
      serviceReason: combinedSrv.map(function(s) { return s.text; }).join('、')
    });
  }

  return {
    queenPassword: finalPassword,
    lateThreshold: incoming.lateThreshold || base.lateThreshold || "07:40",
    students: mergedStudents, attendance: mergedAttendance,
    homework: mergedHomework, deletedHomeworkIds: mergedDelList,
    contactBook: mergedContactBook, contactBookHistory: mergedCbHistory,
    pointLogs: mergedLogs,
    pointPresets: incoming.pointPresets || base.pointPresets,
    homeworkPresets: incoming.homeworkPresets || base.homeworkPresets,
    behaviorReasons: incoming.behaviorReasons || base.behaviorReasons,
    alarmPresets: incoming.alarmPresets || base.alarmPresets,
    timerPresets: incoming.timerPresets || base.timerPresets,
    bellSchedule: incoming.bellSchedule || base.bellSchedule,
    announcements: (incoming.announcements !== undefined && incoming.announcements !== null) ? incoming.announcements : (base.announcements || []),
    rewardCards: incoming.rewardCards || base.rewardCards,
    rewardRedemptions: mergedRedemptions,
    behaviorCards: mergedBehaviorCards,
    trafficOverrides: incoming.trafficOverrides || base.trafficOverrides || {},
    seatingLayout: incoming.seatingLayout || base.seatingLayout,
    seatingChart: incoming.seatingChart || base.seatingChart,
    cloudRevision: incoming.cloudRevision || base.cloudRevision || 1,
    lastModified: new Date().getTime(),
    realRosterV20261119: true
  };
}

// -------------------------------------------------------------
// 資料分塊儲存核心 (支援多達 500KB 班級資料，雙向相容雙鍵名)
// -------------------------------------------------------------
function saveData(prop, account, str) {
  if (!str) return;
  var CHUNK_SIZE = 8000;
  var totalChunks = Math.ceil(str.length / CHUNK_SIZE);
  var oldTotal1 = parseInt(prop.getProperty('chunk_cnt_' + account) || '0', 10);
  var oldTotal2 = parseInt(prop.getProperty('data_sync_chunk_count_' + account) || '0', 10);
  var oldTotal = Math.max(oldTotal1, oldTotal2);

  for (var i = totalChunks; i < oldTotal; i++) {
    prop.deleteProperty('data_' + account + '_' + i);
    prop.deleteProperty('data_sync_chunk_' + account + '_' + i);
  }
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
    parts.push(prop.getProperty('data_' + account + '_' + i) || prop.getProperty('data_sync_chunk_' + account + '_' + i) || '');
  }
  return parts.join('');
}

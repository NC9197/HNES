/**
 * ============================================================================
 * 👑 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * Google Apps Script 雲端專屬同步中繼站腳本 (2026 最新萌寵動物園旗艦版)
 * ============================================================================
 * 
 * 功能特點：
 * 1. 免費且永久：完全架設在 Google 官方雲端，免維護、不需付費伺服器。
 * 2. 500KB 超大容量自動分塊儲存：支援全班 27 位大臣、9大萌寵動物、歷史作業、晨檢打卡等大數據。
 * 3. 雙向同步：電腦修改即時上傳，手機/平板隨時拉取最新紀錄。
 * 4. 權限說明：部署時設定「誰可以存取：所有人」，家長透過專屬通道進入時為前端唯讀，無法更動後台點數。
 * 
 * 部署教學：
 * 步驟 1：前往 https://script.google.com/ 點擊左上角「+ 新專案」
 * 步驟 2：將本檔案全部內容複製，貼上覆蓋 Code.gs 中的程式碼
 * 步驟 3：點擊右上角「部署」➔「新增部署作業」（若已部署過請選「管理部署作業」➔「編輯」➔版本選「新版本」）
 * 步驟 4：種類選「網頁應用程式」，「執行身分」選「我」，「誰可以存取」選「所有人」
 * 步驟 5：點擊「部署」，複製產生的網頁應用程式網址（URL），貼回系統「跨裝置雲端同步中心」即完成！
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
      version: "2026.v3.zoo",
      time: new Date().toISOString(),
      message: "🟢 雲端同步服務正常運作中！請將本網址複製貼回王國系統設定即可。"
    };
    return ContentService.createTextOutput(JSON.stringify(info, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 接收 GET 方式推送 (Fallback Push)
  if (action === 'push' && p.payload) {
    saveData(prop, account, p.payload);
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      action: 'push_get',
      account: account,
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

  var account = (body.account || 'default').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  var payloadStr = typeof body.data === 'string' ? body.data : JSON.stringify(body.data || {});

  saveData(prop, account, payloadStr);

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    action: 'push_post',
    account: account,
    timestamp: new Date().getTime()
  })).setMimeType(ContentService.MimeType.JSON);
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

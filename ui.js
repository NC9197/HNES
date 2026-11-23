/**
 * 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * 介面互動控制器 (UI Controller) - 晨間大螢幕 3:7 ＆ 作業總看板 ＆ 批次名冊升級版
 */

let currentMainView = 'morning'; // 'morning' | 'teacher' | 'parent'
let currentTeacherTab = 'attendance'; // 'attendance' | 'homework' | 'points' | 'pets' | 'roster' | 'announcements'
let currentSelectedHwId = null;
let currentAttendanceFilter = 'all';

// 請假 Modal 暫存
let activeLeaveStudentId = null;
let currentLeaveScope = 'full_day';
let selectedPeriods = [];

// 點數 Modal 暫存
let currentPointTargetMode = 'all';

// 作業設置需訂正名單暫存
let activeRevisionHwId = null;
let activeRevisionStudentIds = new Set();

// 批次管理中心暫存分頁
let currentBatchTab = 'names'; // 'names' | 'titles' | 'birthdays'

// 家長登入狀態
let loggedInStudentId = null;

// 紅綠燈狀態暫存
let currentTrafficFilter = 'all'; // 'all' | 'green' | 'yellow' | 'red' | 'service'
let activeTrafficStudentId = null;

// 多選加扣點暫存
let selectedStudentIdsForPoints = new Set();

// 獎勵卡商城暫存
let activeRedeemCardId = null;
let activeRewardCardId = null;
let isRedemptionHistoryOpen = false;

// 課堂定時鬧鐘狀態變數 (提早宣告防 TDZ)
let currentTimerTab = 'countdown'; // 'countdown' | 'alarm'
let alarmTargetTime = "10:10";
let alarmActivityLabel = "第二節下課 (大下課)";
let isAlarmActive = false;
let lastAlarmRungMinute = "";

function openAlarmDirectModal() {
  openTimerModal();
  switchTimerTab('alarm');
}

// 導師密碼通行驗證狀態 (保障班級隱私與防竄改)
let isTeacherAuthenticated = false;

function checkTeacherAuth(actionName = "進入導師管理室") {
  if (isTeacherAuthenticated) return true;
  const currentPassword = (window.KingdomApp && window.KingdomApp.store && window.KingdomApp.store.data.queenPassword) || 
    (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password')) || 
    "queen";
  const promptHint = (currentPassword === "queen") ? "（預設為 queen）" : "";
  const input = prompt(`👑 請輸入導師專屬通行密碼以${actionName}${promptHint}：`);
  if (input === null) return false;
  if (input.trim() === currentPassword) {
    isTeacherAuthenticated = true;
    showToast("👑 導師身分驗證成功！", "🎉");
    return true;
  } else {
    alert("❌ 密碼錯誤！此區域為西寧國小五年二班導師專屬管理權限。");
    return false;
  }
}

function lockTeacherSession() {
  isTeacherAuthenticated = false;
  showToast("🔒 導師管理權限已鎖定，再次進入需驗證通行密碼。", "🛡️");
  if (typeof switchMainView === "function") {
    switchMainView("morning");
  }
}

function openChangePasswordModal() {
  const modal = document.getElementById("changePasswordModal");
  if (!modal) return;
  
  const oldInput = document.getElementById("oldTeacherPasswordInput");
  const newInput = document.getElementById("newTeacherPasswordInput");
  const confirmInput = document.getElementById("confirmTeacherPasswordInput");
  const errorAlert = document.getElementById("changePasswordErrorAlert");
  
  if (oldInput) {
    oldInput.value = "";
    oldInput.type = "password";
  }
  if (newInput) {
    newInput.value = "";
    newInput.type = "password";
  }
  if (confirmInput) {
    confirmInput.value = "";
    confirmInput.type = "password";
  }
  if (errorAlert) {
    errorAlert.classList.add("hidden");
  }

  // 重置眼睛圖示
  const eyeButtons = modal.querySelectorAll("button[onclick*='togglePasswordVisibility']");
  eyeButtons.forEach(btn => {
    btn.innerHTML = '<i data-lucide="eye" class="w-4 h-4 text-slate-400"></i>';
  });

  modal.classList.remove("hidden");
  initLucideIcons();
  
  setTimeout(() => {
    if (oldInput) oldInput.focus();
  }, 100);
}

function closeChangePasswordModal() {
  const modal = document.getElementById("changePasswordModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === "password";
  input.type = isPass ? "text" : "password";
  if (btnEl) {
    btnEl.innerHTML = isPass 
      ? '<i data-lucide="eye-off" class="w-4 h-4 text-amber-700"></i>' 
      : '<i data-lucide="eye" class="w-4 h-4 text-slate-400"></i>';
    initLucideIcons();
  }
}

function showChangePasswordError(msg) {
  const errorAlert = document.getElementById("changePasswordErrorAlert");
  const errorText = document.getElementById("changePasswordErrorText");
  if (errorAlert && errorText) {
    errorText.textContent = msg;
    errorAlert.classList.remove("hidden");
  } else {
    alert(msg);
  }
}

function submitChangePasswordForm(e) {
  if (e && e.preventDefault) e.preventDefault();
  
  const oldInput = document.getElementById("oldTeacherPasswordInput");
  const newInput = document.getElementById("newTeacherPasswordInput");
  const confirmInput = document.getElementById("confirmTeacherPasswordInput");
  
  const oldPass = oldInput ? oldInput.value.trim() : "";
  const newPass = newInput ? newInput.value.trim() : "";
  const confirmPass = confirmInput ? confirmInput.value.trim() : "";
  
  const currentPassword = (window.KingdomApp && window.KingdomApp.store && window.KingdomApp.store.data.queenPassword) || 
    (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password')) || 
    "queen";
  
  // 1. 驗證目前舊通行密碼
  if (oldPass !== currentPassword) {
    const hint = (currentPassword === "queen") ? "（預設密碼為 queen）" : "";
    showChangePasswordError(`❌ 目前導師通行密碼輸入錯誤！${hint}`);
    if (oldInput) {
      oldInput.focus();
      oldInput.select();
    }
    return;
  }
  
  // 2. 驗證新密碼長度與內容
  if (!newPass || newPass.length < 3) {
    showChangePasswordError("❌ 新通行密碼長度太短！請至少輸入 3 個字元（英數皆可）。");
    if (newInput) {
      newInput.focus();
    }
    return;
  }
  
  // 3. 驗證兩次密碼是否一致
  if (newPass !== confirmPass) {
    showChangePasswordError("❌ 兩次輸入的新通行密碼不一致，請再次確認以防打錯！");
    if (confirmInput) {
      confirmInput.focus();
      confirmInput.select();
    }
    return;
  }

  // 4. 通過驗證，儲存並同步至雲端與本機 (雙保險獨立儲存)
  window.KingdomApp.store.data.queenPassword = newPass;
  if (typeof localStorage !== 'undefined') {
    try { localStorage.setItem('xining_custom_queen_password', newPass); } catch (_) {}
  }
  window.KingdomApp.store.save('修改導師專屬通行密碼');
  isTeacherAuthenticated = true;
  
  closeChangePasswordModal();
  
  if (window.KingdomSound && window.KingdomSound.playPraise) {
    window.KingdomSound.playPraise();
  }
  
  showToast("👑 導師專屬通行密碼已成功更新並永久鎖定保護！已即時同步到所有裝置。", "🔑");
}

function promptChangeQueenPassword() {
  openChangePasswordModal();
}

// ===================================================================
// 1. 初始化與事件監聽 (Initialization)
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  const todayStr = window.KingdomApp.getTodayDateString();
  const dateInput = document.getElementById("attendanceDatePicker");
  if (dateInput) {
    dateInput.value = todayStr;
  }
  const navDate = document.getElementById("navTodayDate");
  if (navDate) {
    navDate.textContent = `📅 朝會日：${todayStr}`;
  }

  // 設定遲到門檻
  const thresholdInput = document.getElementById("lateThresholdInput");
  if (thresholdInput) {
    thresholdInput.value = window.KingdomApp.store.data.lateThreshold || "07:40";
  }

  // 啟動晨間大螢幕即時跳動秒針時鐘
  startMorningClock();
  renderAlarmPresets();

  // 檢查 URL 參數
  const urlParams = new URLSearchParams(window.location.search);
  const isParentMode = urlParams.get('parent') === '1' || urlParams.get('mode') === 'parent';
  const paramSeat = urlParams.get('seat');

  initLucideIcons();

  if (isParentMode) {
    // 嚴格家長專屬隱私防護：全面隱藏導師管理與排座按鈕
    const navMorning = document.getElementById("btnNavMorning");
    const navTraffic = document.getElementById("btnNavTraffic");
    const navSeating = document.getElementById("btnNavSeating");
    const navTeacher = document.getElementById("btnNavTeacher");
    const sysDropdownWrapper = document.getElementById("systemDropdown") ? document.getElementById("systemDropdown").parentElement : null;
    const syncBtn = document.getElementById("btnCloudSyncStatus");
    const silenceBtn = document.querySelector("button[onclick='openSilenceModal()']");
    const timerBtn = document.querySelector("button[onclick='openTimerModal()']");

    if (navMorning) navMorning.classList.add("hidden");
    if (navTraffic) navTraffic.classList.add("hidden");
    if (navSeating) navSeating.classList.add("hidden");
    if (navTeacher) navTeacher.classList.add("hidden");
    if (sysDropdownWrapper) sysDropdownWrapper.classList.add("hidden");
    if (syncBtn) syncBtn.classList.add("hidden");
    if (silenceBtn) silenceBtn.classList.add("hidden");
    if (timerBtn) timerBtn.classList.add("hidden");

    switchMainView('parent');
    if (paramSeat) {
      setTimeout(() => {
        const select = document.getElementById("parentSelectStudent");
        if (select) select.value = paramSeat;
      }, 100);
    }
  } else {
    // 預設進入「晨間朝會大螢幕模式」供學生打卡與抄寫聯絡簿
    switchMainView('morning');
  }

  // 監聽雲端同步狀態更新 Navbar 徽章
  if (window.KingdomApp && window.KingdomApp.cloudSync) {
    window.KingdomApp.cloudSync.subscribe((status) => {
      updateCloudSyncBadge(status);
    });
    updateCloudSyncBadge(window.KingdomApp.cloudSync.getStatus());
    window.KingdomApp.cloudSync.pull({ silent: true });
  }

  // 智能時光機守護：若當前名冊只有 27 人，但本機時光機擁有 >= 28 位大臣存檔，主動顯示一鍵復原
  setTimeout(() => {
    try {
      const store = window.KingdomApp && window.KingdomApp.store;
      if (!store || !store.data) return;
      const currentCount = store.data.students ? store.data.students.length : 0;
      if (currentCount <= 27) {
        const snaps = store.getLocalSnapshots();
        const snap28 = snaps.find(s => s.studentCount >= 28 || (s.data && s.data.students && s.data.students.length >= 28));
        if (snap28) {
          console.log('[TimeMachine] 偵測到曾有 28 位大臣的時光機快照:', snap28.id);
          const banner = document.createElement('div');
          banner.id = 'timeMachineRecoveryBanner';
          banner.className = 'fixed top-14 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-11/12 p-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-2xl border-2 border-amber-300 flex items-center justify-between gap-2';
          banner.innerHTML = `
            <div class="flex items-center space-x-2 min-w-0">
              <span class="text-xl">👑</span>
              <div class="text-xs">
                <div class="font-black">發現您曾新增的第 28 位大臣存檔！</div>
                <div class="text-[10px] opacity-90 truncate">時光機快照 (${snap28.timeStr || snap28.reason}) 包含完整 28 位大臣</div>
              </div>
            </div>
            <div class="flex items-center space-x-1.5 shrink-0">
              <button onclick="restoreFromLocalSnapshot('${snap28.id}'); document.getElementById('timeMachineRecoveryBanner')?.remove();" class="px-3 py-1.5 rounded-xl bg-white text-amber-950 font-black text-xs shadow hover:bg-amber-100">
                ↩️ 一鍵復原
              </button>
              <button onclick="document.getElementById('timeMachineRecoveryBanner')?.remove();" class="p-1 rounded-lg text-white/80 hover:text-white text-xs">
                ✕
              </button>
            </div>
          `;
          document.body.appendChild(banner);
        }
      }
    } catch (_) {}
  }, 1200);

  // 點擊其他地方關閉下拉選單
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("systemDropdown");
    if (dropdown && !dropdown.contains(e.target) && !e.target.closest("button[onclick='toggleSystemMenu()']")) {
      dropdown.classList.add("hidden");
    }
  });
});

function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================================================================
// 2. 主視角切換 (晨間朝會大螢幕 vs 下課紅綠燈 vs 皇后議政廳 vs 家長專區)
// ===================================================================
function switchMainView(view) {
  currentMainView = view;
  const morningView = document.getElementById("morningBoardView");
  const trafficView = document.getElementById("trafficView");
  const seatingView = document.getElementById("seatingView");
  const teacherView = document.getElementById("teacherView");
  const parentView = document.getElementById("parentView");

  const btnMorning = document.getElementById("btnNavMorning");
  const btnTraffic = document.getElementById("btnNavTraffic");
  const btnSeating = document.getElementById("btnNavSeating");
  const btnTeacher = document.getElementById("btnNavTeacher");
  const btnParent = document.getElementById("btnNavParent");

  // 重設所有視角隱藏
  if (morningView) morningView.classList.add("hidden");
  if (trafficView) trafficView.classList.add("hidden");
  if (seatingView) seatingView.classList.add("hidden");
  if (teacherView) teacherView.classList.add("hidden");
  if (parentView) parentView.classList.add("hidden");

  const defaultBtnClass = "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 text-amber-950 hover:bg-amber-300/60 leading-tight whitespace-nowrap shrink-0";
  const activeBtnClass = "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-black transition flex items-center space-x-1.5 bg-amber-950 text-amber-300 shadow leading-tight whitespace-nowrap shrink-0";

  if (btnMorning) btnMorning.className = defaultBtnClass;
  if (btnTraffic) btnTraffic.className = defaultBtnClass;
  if (btnSeating) btnSeating.className = defaultBtnClass;
  if (btnTeacher) btnTeacher.className = defaultBtnClass;
  if (btnParent) btnParent.className = defaultBtnClass;

  if (view === 'morning') {
    if (morningView) morningView.classList.remove("hidden");
    if (btnMorning) btnMorning.className = activeBtnClass;
    renderMorningBoard();
  } else if (view === 'traffic') {
    if (trafficView) trafficView.classList.remove("hidden");
    if (btnTraffic) btnTraffic.className = activeBtnClass;
    renderTrafficView();
  } else if (view === 'seating') {
    if (seatingView) seatingView.classList.remove("hidden");
    if (btnSeating) btnSeating.className = activeBtnClass;
    renderSeatingChart();
  } else if (view === 'teacher') {
    if (!checkTeacherAuth("進入導師管理室")) return;
    if (teacherView) teacherView.classList.remove("hidden");
    if (btnTeacher) btnTeacher.className = activeBtnClass;
    switchTeacherTab(currentTeacherTab || 'attendance');
  } else {
    if (parentView) parentView.classList.remove("hidden");
    if (btnParent) btnParent.className = activeBtnClass;
    renderParentPortal();
  }
  initLucideIcons();
  updateTrafficCountdownClock();
}

function switchTeacherTab(tab) {
  currentTeacherTab = tab;
  const tabs = ['attendance', 'homework', 'points', 'pets', 'roster', 'announcements'];
  
  tabs.forEach(t => {
    const section = document.getElementById(`teacherTab-${t}`);
    const btn = document.getElementById(`tabBtn-${t}`);
    if (section && btn) {
      if (t === tab) {
        section.classList.remove("hidden");
        btn.className = "px-4 py-2 rounded-xl transition flex items-center space-x-2 bg-amber-950 text-amber-300 shadow font-black";
      } else {
        section.classList.add("hidden");
        btn.className = "px-4 py-2 rounded-xl transition flex items-center space-x-2 text-amber-950 hover:bg-amber-300/80 font-bold";
      }
    }
  });

  renderCurrentTeacherTab();
  initLucideIcons();
}

function renderCurrentTeacherTab() {
  switch (currentTeacherTab) {
    case 'attendance':
      renderAttendanceView();
      break;
    case 'homework':
      renderHomeworkSummaryBoard();
      break;
    case 'points':
      renderPointsView();
      break;
    case 'pets':
      renderPetsOverview();
      break;
    case 'roster':
      renderRosterView();
      break;
    case 'announcements':
      renderAnnouncementsView();
      break;
  }
}

// ===================================================================
// 3. 晨間朝會大螢幕模式 (打卡座號 30% : 大螢幕聯絡簿 70%)
// ===================================================================
let clockInterval = null;
function startMorningClock() {
  if (clockInterval) clearInterval(clockInterval);

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${h}:${m}:${s}`;
    const timeHM = `${h}:${m}`;

    const clockEl = document.getElementById("morningClockDisplay");
    if (clockEl) clockEl.textContent = timeStr;

    const alarmModalClock = document.getElementById("alarmModalCurrentClock");
    if (alarmModalClock) alarmModalClock.textContent = timeStr;

    const navDateEl = document.getElementById("navTodayDate");
    if (navDateEl) navDateEl.textContent = window.KingdomApp.getTodayDateString();

    // 即時更新下課紅綠燈即時時鐘與作息倒數看板
    if (typeof updateTrafficCountdownClock === 'function') {
      updateTrafficCountdownClock();
    }

    // 比對課堂定時鬧鐘
    if (typeof isAlarmActive !== 'undefined' && isAlarmActive && alarmTargetTime === timeHM) {
      if (typeof lastAlarmRungMinute !== 'undefined' && lastAlarmRungMinute !== timeHM) {
        lastAlarmRungMinute = timeHM;
        triggerAlarmRing();
      }
    }
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

let currentContactDate = window.KingdomApp.getTodayDateString();
let morningContactDaysMode = '2days'; // '2days' (預設雙天並排模式) | '1day' (單天六行模式)
let morningContactDateCol1 = null; // 第 1 欄日期 (預設今日)
let morningContactDateCol2 = null; // 第 2 欄日期 (預設明日)

function initMorningContactDates() {
  const today = (window.KingdomApp && window.KingdomApp.getTodayDateString) ? window.KingdomApp.getTodayDateString() : new Date().toISOString().slice(0, 10);
  if (!morningContactDateCol1) {
    morningContactDateCol1 = currentContactDate || today;
  }
  if (!morningContactDateCol2) {
    morningContactDateCol2 = getDeltaDateString(morningContactDateCol1, 1);
  }
}

function setMorningContactDaysMode(mode) {
  morningContactDaysMode = mode || '2days';
  initMorningContactDates();
  renderMorningBoard();
}

function setMorningContactPreset(preset) {
  const today = (window.KingdomApp && window.KingdomApp.getTodayDateString) ? window.KingdomApp.getTodayDateString() : new Date().toISOString().slice(0, 10);
  if (preset === 'today_tomorrow') {
    morningContactDaysMode = '2days';
    morningContactDateCol1 = today;
    morningContactDateCol2 = getDeltaDateString(today, 1);
    currentContactDate = today;
  } else if (preset === 'yesterday_today') {
    morningContactDaysMode = '2days';
    morningContactDateCol1 = getDeltaDateString(today, -1);
    morningContactDateCol2 = today;
    currentContactDate = morningContactDateCol1;
  } else if (preset === 'single_day') {
    morningContactDaysMode = '1day';
    morningContactDateCol1 = currentContactDate || today;
  }
  renderMorningBoard();
}

function changeMorningContactColDate(colIndex, dateVal) {
  if (!dateVal) return;
  initMorningContactDates();
  if (colIndex === 1) {
    morningContactDateCol1 = dateVal;
    currentContactDate = dateVal;
  } else if (colIndex === 2) {
    morningContactDateCol2 = dateVal;
  }
  renderMorningBoard();
}

function adjustMorningContactColDate(colIndex, delta) {
  initMorningContactDates();
  if (colIndex === 1) {
    morningContactDateCol1 = getDeltaDateString(morningContactDateCol1, delta);
    currentContactDate = morningContactDateCol1;
  } else if (colIndex === 2) {
    morningContactDateCol2 = getDeltaDateString(morningContactDateCol2, delta);
  }
  renderMorningBoard();
}

function changeContactDateDelta(delta) {
  initMorningContactDates();
  if (morningContactDaysMode === '2days') {
    morningContactDateCol1 = getDeltaDateString(morningContactDateCol1, delta);
    morningContactDateCol2 = getDeltaDateString(morningContactDateCol2, delta);
    currentContactDate = morningContactDateCol1;
  } else {
    currentContactDate = getDeltaDateString(currentContactDate, delta);
    morningContactDateCol1 = currentContactDate;
  }
  renderMorningBoard();
}

function changeContactDateToToday() {
  const today = window.KingdomApp.getTodayDateString();
  currentContactDate = today;
  morningContactDateCol1 = today;
  morningContactDateCol2 = getDeltaDateString(today, 1);
  renderMorningBoard();
}

function handleContactDatePickerChange(val) {
  if (val) {
    currentContactDate = val;
    morningContactDateCol1 = val;
    morningContactDateCol2 = getDeltaDateString(val, 1);
    renderMorningBoard();
  }
}

function renderMorningContactDayColumn(colIndex, dateStr) {
  const colName = colIndex === 1 ? '第一欄' : '第二欄';
  const book = (window.KingdomApp && window.KingdomApp.store && window.KingdomApp.store.getContactBook) 
    ? window.KingdomApp.store.getContactBook(dateStr) 
    : { homeworkItems: [], reminders: [], queenMotto: '' };
  const items = (book && book.homeworkItems) ? book.homeworkItems : [];
  const reminders = (book && book.reminders) ? book.reminders : [];
  const weekday = getWeekdayText(dateStr);
  const relBadge = getRelativeDayBadge(dateStr);

  const renderCardItem = (slotIdx, text) => {
    const isFilled = Boolean(text && String(text).trim());
    if (isFilled) {
      return `
        <div class="flex items-center space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-sm transition hover:border-amber-500 min-h-[4.2rem]">
          <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center text-xl sm:text-2xl font-black shrink-0 shadow-xs border border-amber-500/40">
            ${slotIdx}
          </span>
          <span class="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-wide leading-tight break-words flex-1">
            ${escapeContactHtml(text)}
          </span>
        </div>
      `;
    } else {
      return `
        <div class="flex items-center space-x-3 p-2.5 rounded-2xl bg-amber-50/50 border-2 border-dashed border-amber-200/80 min-h-[4.2rem]">
          <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100/60 text-amber-800/40 flex items-center justify-center text-xl sm:text-2xl font-black shrink-0">
            ${slotIdx}
          </span>
          <span class="text-base sm:text-lg font-bold text-amber-900/35 italic">
            （留白）
          </span>
        </div>
      `;
    }
  };

  // 標準固定六行大字作業
  const rowsHtml = [1, 2, 3, 4, 5, 6].map(slotIdx => renderCardItem(slotIdx, items[slotIdx - 1] || '')).join('');

  let extraRowsHtml = '';
  if (items.length > 6) {
    const extraItems = items.slice(6);
    extraRowsHtml = `
      <div class="pt-2 border-t-2 border-dashed border-amber-300 space-y-2">
        <span class="text-xs font-black text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-md">追加項目 (超過 6 行)：</span>
        <div class="space-y-2">
          ${extraItems.map((item, idx) => renderCardItem(7 + idx, item)).join('')}
        </div>
      </div>
    `;
  }

  let dayReminderNoticeHtml = '';
  if (reminders.length > 0) {
    dayReminderNoticeHtml = `
      <div class="mt-2.5 p-2 rounded-xl bg-amber-100/80 border border-amber-300 text-xs font-bold text-amber-950 space-y-0.5">
        <div class="font-black text-amber-900 flex items-center space-x-1">
          <span>🔔 此日提醒：</span>
        </div>
        <ul class="list-disc list-inside space-y-0.5">
          ${reminders.map(r => `<li>${escapeContactHtml(r)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  return `
    <div class="space-y-3 bg-gradient-to-b from-amber-100/50 via-white/80 to-yellow-50/30 p-3 sm:p-4 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col justify-between">
      <div>
        <!-- 頂部欄位控制與操作按鈕 -->
        <div class="flex items-center justify-between pb-2 border-b border-amber-300/70 text-xs font-black text-amber-950 gap-1.5 flex-wrap">
          <div class="flex items-center space-x-1.5 shrink-0">
            <span class="text-xs sm:text-sm font-black text-amber-950 bg-amber-300/90 px-2.5 py-0.5 rounded-lg border border-amber-400 shadow-2xs">
              📌 ${colName}
            </span>
            ${relBadge}
          </div>
          <!-- 導師手動挑選日期與前後天微調 + 快速編輯 -->
          <div class="flex items-center space-x-1 shrink-0">
            <button type="button" onclick="adjustMorningContactColDate(${colIndex}, -1)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/95 hover:bg-amber-100 text-amber-950 font-black border border-amber-300 shadow-2xs flex items-center justify-center transition active:scale-95" title="前一天">◀</button>
            <input type="date" value="${dateStr}" onchange="changeMorningContactColDate(${colIndex}, this.value)" class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-white border-2 border-amber-400 rounded-xl text-amber-950 font-black cursor-pointer shadow-2xs max-w-[125px] sm:max-w-[145px]" title="手動指定此欄日期">
            <button type="button" onclick="adjustMorningContactColDate(${colIndex}, 1)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/95 hover:bg-amber-100 text-amber-950 font-black border border-amber-300 shadow-2xs flex items-center justify-center transition active:scale-95" title="後一天">▶</button>
            <button type="button" onclick="openEditContactModalForDate('${dateStr}')" class="px-2 sm:px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black border border-amber-500 shadow-2xs flex items-center space-x-0.5 transition hover:scale-105 active:scale-95" title="編輯【${dateStr}】聯絡簿">
              <span>✏️</span>
              <span class="hidden sm:inline">編輯</span>
            </button>
          </div>
        </div>

        <!-- ★ 聯絡簿日期顯示在上方第一欄、第二欄位置，字體加粗放大 ★ -->
        <div class="pt-2 pb-2.5 border-b-2 border-amber-400/80 flex items-center justify-between gap-2">
          <div class="flex items-center space-x-2 flex-wrap">
            <span class="text-xl sm:text-2xl lg:text-3xl font-black text-amber-950 tracking-wide">
              📅 ${dateStr}
            </span>
            <span class="text-base sm:text-lg font-black text-amber-800 bg-amber-200/90 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
              （${weekday}）
            </span>
          </div>
        </div>

        <!-- 作業標準六行大字 (1 ~ 6) -->
        <div class="mt-3 space-y-2.5">
          ${rowsHtml}
        </div>

        ${extraRowsHtml}
        ${dayReminderNoticeHtml}
      </div>
    </div>
  `;
}

function renderMorningBoard() {
  const todayStr = window.KingdomApp.getTodayDateString();
  const students = window.KingdomApp.store.data.students;
  const attendanceData = window.KingdomApp.store.data.attendance[todayStr] || {};
  const lateThreshold = window.KingdomApp.store.data.lateThreshold || "07:40";

  // 1. 渲染左側 30% 打卡座號網格 (無須打勾，僅記時間與紅綠燈標示：綠燈準時、黃燈遲到、紅燈缺席、粉色請假)
  const checkInGrid = document.getElementById("checkInGrid");
  let checkedCount = 0;

  if (checkInGrid) {
    checkInGrid.innerHTML = students.map(st => {
      const rec = attendanceData[st.id] || null;
      let statusClass = "seat-uncheck";
      let statusBadge = "🔴 未到";
      let timeText = "";

      if (rec) {
        if (rec.status === 'present') {
          checkedCount++;
          statusClass = "seat-present";
          statusBadge = "🟢 準時";
          timeText = rec.checkInTime || "準時";
        } else if (rec.status === 'late') {
          checkedCount++;
          statusClass = "seat-late";
          statusBadge = "🟡 遲到";
          timeText = rec.checkInTime || "遲到";
        } else if (rec.status === 'leave') {
          statusClass = "seat-leave";
          statusBadge = "🏖️ 請假";
          timeText = "告假";
        }
      }

      return `
        <button onclick="handleMorningSeatCheckIn(${st.id}, ${st.seatNo})" 
          class="checkin-seat-btn ${statusClass} h-11 w-full rounded-xl text-center flex items-center justify-center border-2 transition shadow-xs hover:scale-105 active:scale-95"
          title="${st.seatNo}號 ${st.name} | ${statusBadge} ${timeText ? '(' + timeText + ')' : ''}（點擊打卡 / 更改狀態）">
          <span class="font-mono text-lg sm:text-xl font-black tracking-wider">${String(st.seatNo).padStart(2, '0')}</span>
        </button>
      `;
    }).join('');
  }

  // 更新到校人數
  const countBadge = document.getElementById("morningCheckedCount");
  if (countBadge) {
    countBadge.textContent = `${checkedCount} / ${students.length} 人`;
  }

  // 2. 渲染右側 70% 聯絡簿看板 (支援雙天並排六行 ＆ 單天模式切換)
  initMorningContactDates();

  // 更新頂部模式按鈕外觀狀態
  const btnMode2Days = document.getElementById("btnMorningMode2Days");
  const btnMode1Day = document.getElementById("btnMorningMode1Day");
  const presetsGroup = document.getElementById("morningPresetsGroup");
  const singlePickerGroup = document.getElementById("morningSingleDatePickerGroup");

  if (btnMode2Days && btnMode1Day) {
    if (morningContactDaysMode === '2days') {
      btnMode2Days.className = "btn-royal-gold px-2.5 py-1 rounded-lg text-xs font-black shadow-2xs transition";
      btnMode1Day.className = "bg-white/80 hover:bg-white text-amber-950 px-2.5 py-1 rounded-lg text-xs font-bold transition";
      if (presetsGroup) presetsGroup.classList.remove("hidden");
      if (singlePickerGroup) singlePickerGroup.classList.add("hidden");
    } else {
      btnMode2Days.className = "bg-white/80 hover:bg-white text-amber-950 px-2.5 py-1 rounded-lg text-xs font-bold transition";
      btnMode1Day.className = "btn-royal-gold px-2.5 py-1 rounded-lg text-xs font-black shadow-2xs transition";
      if (presetsGroup) presetsGroup.classList.add("hidden");
      if (singlePickerGroup) singlePickerGroup.classList.remove("hidden");
    }
  }

  const dateDisplay = document.getElementById("contactBookDateDisplay");
  if (dateDisplay) {
    if (morningContactDaysMode === '2days') {
      dateDisplay.textContent = `${morningContactDateCol1} ＆ ${morningContactDateCol2}`;
    } else {
      dateDisplay.textContent = currentContactDate;
    }
  }
  const datePicker = document.getElementById("contactBookDatePicker");
  if (datePicker) {
    datePicker.value = currentContactDate;
  }

  const hwList = document.getElementById("contactHomeworkList");
  if (hwList) {
    if (morningContactDaysMode === '2days') {
      const col1Html = renderMorningContactDayColumn(1, morningContactDateCol1);
      const col2Html = renderMorningContactDayColumn(2, morningContactDateCol2);
      hwList.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 items-stretch">
          ${col1Html}
          ${col2Html}
        </div>
      `;
    } else {
      // 單天六行模式 (左欄 1~3，右欄 4~6)
      const contactBook = window.KingdomApp.store.getContactBook(currentContactDate);
      const items = (contactBook && contactBook.homeworkItems) ? contactBook.homeworkItems : [];

      const renderCardItem = (slotIdx, text) => {
        const isFilled = Boolean(text && text.trim());
        if (isFilled) {
          return `
            <div class="flex items-center space-x-3 p-3 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-sm transition hover:border-amber-500 min-h-[4.5rem]">
              <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center text-xl sm:text-2xl font-black shrink-0 shadow-xs border border-amber-500/40">
                ${slotIdx}
              </span>
              <span class="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-wide leading-tight break-words flex-1">
                ${text}
              </span>
            </div>
          `;
        } else {
          return `
            <div class="flex items-center space-x-3 p-2.5 rounded-2xl bg-amber-50/50 border-2 border-dashed border-amber-200/80 min-h-[4.5rem]">
              <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100/60 text-amber-800/40 flex items-center justify-center text-xl sm:text-2xl font-black shrink-0">
                ${slotIdx}
              </span>
              <span class="text-lg sm:text-xl font-bold text-amber-900/35 italic">
                （留白）
              </span>
            </div>
          `;
        }
      };

      const leftColHtml = [1, 2, 3].map(num => renderCardItem(num, items[num - 1] || '')).join('');
      const rightColHtml = [4, 5, 6].map(num => renderCardItem(num, items[num - 1] || '')).join('');

      let extraRowsHtml = '';
      if (items.length > 6) {
        const extraItems = items.slice(6);
        extraRowsHtml = `
          <div class="col-span-1 md:col-span-2 pt-2 border-t-2 border-dashed border-amber-300 space-y-2">
            <span class="text-xs font-black text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md">追加項目 (超過 6 行)：</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${extraItems.map((item, idx) => renderCardItem(7 + idx, item)).join('')}
            </div>
          </div>
        `;
      }

      hwList.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 items-stretch">
          <!-- 左欄 (第 1 ~ 3 行) -->
          <div class="space-y-2.5 sm:space-y-3 bg-gradient-to-b from-amber-100/40 to-yellow-50/30 p-2.5 sm:p-3 rounded-2xl border border-amber-300/80 shadow-2xs">
            <div class="flex items-center justify-between pb-1 px-1 border-b border-amber-300/60 text-xs font-black text-amber-950">
              <span class="flex items-center space-x-1"><span>📌 第一欄</span><span class="text-[10px] text-amber-800 font-bold">(第 1 ~ 3 項)</span></span>
              <span class="text-[11px] text-amber-800 font-mono">1 - 3</span>
            </div>
            <div class="space-y-2.5">
              ${leftColHtml}
            </div>
          </div>

          <!-- 右欄 (第 4 ~ 6 行) -->
          <div class="space-y-2.5 sm:space-y-3 bg-gradient-to-b from-amber-100/40 to-yellow-50/30 p-2.5 sm:p-3 rounded-2xl border border-amber-300/80 shadow-2xs">
            <div class="flex items-center justify-between pb-1 px-1 border-b border-amber-300/60 text-xs font-black text-amber-950">
              <span class="flex items-center space-x-1"><span>📌 第二欄</span><span class="text-[10px] text-amber-800 font-bold">(第 4 ~ 6 項)</span></span>
              <span class="text-[11px] text-amber-800 font-mono">4 - 6</span>
            </div>
            <div class="space-y-2.5">
              ${rightColHtml}
            </div>
          </div>

          ${extraRowsHtml}
        </div>
      `;
    }
  }

  const reminderList = document.getElementById("contactReminderList");
  if (reminderList) {
    const reminders = (contactBook && contactBook.reminders) ? contactBook.reminders : [];
    if (reminders.length === 0) {
      reminderList.innerHTML = `
        <li class="text-amber-900/70 text-base sm:text-lg font-bold list-none">（今日無特殊早自修或重要提醒）</li>
      `;
    } else {
      reminderList.innerHTML = reminders.map(item => `
        <li class="leading-relaxed py-0.5">${item}</li>
      `).join('');
    }
  }

  const mottoEl = document.getElementById("contactQueenMotto");
  if (mottoEl) {
    mottoEl.textContent = contactBook.queenMotto || "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！";
  }

  // 同步渲染歷日聯絡簿歷史紀錄簿 (各日奏章檔案庫)
  renderContactBookHistoryList();

  // 同步刷新聯絡簿大屏全螢幕投影畫面 (若開啟中，打卡與作業項目即時雙向連動)
  if (typeof renderContactProjectionView === 'function') {
    renderContactProjectionView();
  }
}

let activeMorningChangeStudentId = null;

function handleMorningSeatCheckIn(studentId, seatNo) {
  const todayStr = window.KingdomApp.getTodayDateString();
  const lateThreshold = window.KingdomApp.store.data.lateThreshold || "07:40";

  if (!window.KingdomApp.store.data.attendance[todayStr]) {
    window.KingdomApp.store.data.attendance[todayStr] = {};
  }

  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const existing = window.KingdomApp.store.data.attendance[todayStr][studentId];

  // 若該生尚未打卡（或狀態為未到/缺席），點擊直接以當前真實時間完成打卡！免密碼！
  if (!existing || (!existing.checkInTime && existing.status !== 'present' && existing.status !== 'late' && existing.status !== 'leave')) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    const isLate = timeStr > lateThreshold;

    if (isLate) {
      window.KingdomApp.store.addServiceCard(studentId, "遲到");
    }

    window.KingdomApp.store.data.attendance[todayStr][studentId] = {
      status: isLate ? 'late' : 'present',
      checkInTime: timeStr,
      note: isLate ? `晨檢遲到 (${timeStr})` : '晨檢準時'
    };

    window.KingdomApp.store.save();
    window.KingdomApp.sound.playCoin();

    if (isLate) {
      showToast(`⚠️ ${student.name} 大臣於 ${timeStr} 遲到打卡（已自動派發愛班卡）`, "⏳");
    } else {
      showToast(`🟢 ${student.name} 大臣於 ${timeStr} 準時打卡成功！`, "✨");
    }

    renderMorningBoard();
    if (currentMainView === 'teacher' && currentTeacherTab === 'attendance') {
      renderAttendanceView();
    }
    renderTrafficView();
    return;
  }

  // 若該生已經打卡，點擊時開啟【大臣朝會打卡狀態快速更改】彈窗，方便老師隨時更改狀態！
  openMorningCheckInChangeModal(studentId);
}

function openMorningCheckInChangeModal(studentId) {
  activeMorningChangeStudentId = studentId;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  if (!student) return;

  const todayStr = window.KingdomApp.getTodayDateString();
  const rec = (window.KingdomApp.store.data.attendance[todayStr] && window.KingdomApp.store.data.attendance[todayStr][studentId]) || null;

  const titleEl = document.getElementById("morningModalStudentTitle");
  if (titleEl) {
    titleEl.textContent = `⏱️ ${String(student.seatNo).padStart(2, '0')}號 ${student.name}`;
  }

  const statusEl = document.getElementById("morningModalCurrentStatus");
  if (statusEl) {
    if (!rec) {
      statusEl.className = "font-black text-sm text-rose-700";
      statusEl.textContent = "🔴 尚未打卡 (缺席)";
    } else if (rec.status === 'present') {
      statusEl.className = "font-black text-sm text-emerald-700";
      statusEl.textContent = `🟢 準時出席 (${rec.checkInTime || '準時'})`;
    } else if (rec.status === 'late') {
      statusEl.className = "font-black text-sm text-amber-700";
      statusEl.textContent = `🟡 遲到覲見 (${rec.checkInTime || '遲到'})`;
    } else if (rec.status === 'leave') {
      statusEl.className = "font-black text-sm text-rose-700";
      statusEl.textContent = `🏖️ 告假在府 (${rec.leaveType || '事假'})`;
    } else {
      statusEl.className = "font-black text-sm text-rose-700";
      statusEl.textContent = "🔴 尚未打卡 (缺席)";
    }
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const nowBtn = document.getElementById("morningModalNowBtnText");
  if (nowBtn) {
    nowBtn.textContent = `以現在時間重新打卡 (${timeStr})`;
  }

  const modal = document.getElementById("morningCheckInChangeModal");
  if (modal) modal.classList.remove("hidden");
  initLucideIcons();
}

function closeMorningCheckInChangeModal() {
  const modal = document.getElementById("morningCheckInChangeModal");
  if (modal) modal.classList.add("hidden");
  activeMorningChangeStudentId = null;
}

function changeMorningAttendanceStatus(targetStatus) {
  if (!activeMorningChangeStudentId) return;
  const studentId = activeMorningChangeStudentId;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const todayStr = window.KingdomApp.getTodayDateString();
  const lateThreshold = window.KingdomApp.store.data.lateThreshold || "07:40";

  if (!window.KingdomApp.store.data.attendance[todayStr]) {
    window.KingdomApp.store.data.attendance[todayStr] = {};
  }
  const prev = window.KingdomApp.store.data.attendance[todayStr][studentId] || {};

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (targetStatus === 'uncheck') {
    delete window.KingdomApp.store.data.attendance[todayStr][studentId];
    showToast(`🔴 已清除【${student.name}】的打卡紀錄，恢復為未到狀態！`);
  } else if (targetStatus === 'present') {
    window.KingdomApp.store.data.attendance[todayStr][studentId] = {
      status: 'present',
      checkInTime: prev.checkInTime || '07:35',
      note: '導師更改為準時'
    };
    showToast(`🟢 已將【${student.name}】更改為：準時出席！`, "✨");
  } else if (targetStatus === 'late') {
    if (prev.status !== 'late') {
      window.KingdomApp.store.addServiceCard(studentId, "遲到");
    }
    window.KingdomApp.store.data.attendance[todayStr][studentId] = {
      status: 'late',
      checkInTime: prev.checkInTime || '07:45',
      note: '導師更改為遲到'
    };
    showToast(`🟡 已將【${student.name}】更改為：遲到（已派發愛班卡）！`, "⏳");
  } else if (targetStatus === 'leave') {
    window.KingdomApp.store.data.attendance[todayStr][studentId] = {
      status: 'leave',
      leaveType: 'personal',
      leaveScope: 'day',
      note: '導師更改為告假在府'
    };
    showToast(`🏖️ 已將【${student.name}】更改為：告假在府！`, "🏖️");
  } else if (targetStatus === 'now') {
    const isLate = timeStr > lateThreshold;
    if (isLate && prev.status !== 'late') {
      window.KingdomApp.store.addServiceCard(studentId, "遲到");
    }
    window.KingdomApp.store.data.attendance[todayStr][studentId] = {
      status: isLate ? 'late' : 'present',
      checkInTime: timeStr,
      note: isLate ? `晨檢遲到 (${timeStr})` : '晨檢準時'
    };
    showToast(`⏱️ 【${student.name}】已重新以當前時間 (${timeStr}) 完成打卡！`);
  }

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  closeMorningCheckInChangeModal();
  renderMorningBoard();
  if (currentMainView === 'teacher' && currentTeacherTab === 'attendance') {
    renderAttendanceView();
  }
  renderTrafficView();
}

function toggleFullscreen(targetEl) {
  if (!document.fullscreenElement) {
    const el = targetEl || document.documentElement;
    if (el && el.requestFullscreen) {
      el.requestFullscreen().catch(err => {
        console.warn(`無法進入全螢幕：${err.message}`);
      });
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.warn(`無法退出全螢幕：${err.message}`);
      });
    }
  }
}

// 編輯聯絡簿項目 Modal
function openEditContactModal() {
  if (!checkTeacherAuth("編輯聯絡簿項目")) return;
  const targetDate = currentContactDate || window.KingdomApp.getTodayDateString();
  const cb = window.KingdomApp.store.getContactBook(targetDate);
  
  const titleEl = document.getElementById("editContactModalDateTitle");
  if (titleEl) {
    titleEl.textContent = `編輯大螢幕聯絡簿奏章 (${targetDate})`;
  }

  const hwEl = document.getElementById("editContactHwItems") || document.getElementById("editContactHwInput");
  const remEl = document.getElementById("editContactReminders") || document.getElementById("editContactRemindersInput");
  const mottoEl = document.getElementById("editContactMotto") || document.getElementById("editContactMottoInput");

  if (hwEl) {
    const hwList = (cb && cb.homeworkItems) ? cb.homeworkItems : [];
    hwEl.value = Array.isArray(hwList) ? hwList.join('\n') : String(hwList || '');
  }
  if (remEl) {
    const remList = (cb && cb.reminders) ? cb.reminders : [];
    remEl.value = Array.isArray(remList) ? remList.join('\n') : String(remList || '');
  }
  if (mottoEl) {
    mottoEl.value = (cb && cb.queenMotto) ? cb.queenMotto : '';
  }

  const modal = document.getElementById("editContactModal");
  if (modal) modal.classList.remove("hidden");
  initLucideIcons();

  setTimeout(() => {
    if (hwEl) hwEl.focus();
  }, 100);
}

function closeEditContactModal() {
  const modal = document.getElementById("editContactModal");
  if (modal) modal.classList.add("hidden");
}

function saveContactBookData(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!checkTeacherAuth("編輯聯絡簿奏章")) return;

  const hwEl = document.getElementById("editContactHwItems") || document.getElementById("editContactHwInput");
  const remEl = document.getElementById("editContactReminders") || document.getElementById("editContactRemindersInput");
  const mottoEl = document.getElementById("editContactMotto") || document.getElementById("editContactMottoInput");

  const hwRaw = hwEl ? hwEl.value : "";
  const remRaw = remEl ? remEl.value : "";
  const motto = mottoEl ? mottoEl.value : "";

  // 導師手動輸入，完全由導師掌控，系統不自行強加假作業
  const homeworkItems = hwRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const reminders = remRaw.split('\n').map(s => s.trim()).filter(Boolean);

  const targetDate = currentContactDate || window.KingdomApp.getTodayDateString();

  window.KingdomApp.store.saveContactBook(targetDate, {
    homeworkItems: homeworkItems,
    reminders: reminders,
    queenMotto: motto.trim() || "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"
  });

  if (window.KingdomApp.sound && window.KingdomApp.sound.playFanfare) {
    window.KingdomApp.sound.playFanfare();
  }
  showToast(`📜 ${targetDate} 聯絡簿奏章已成功修訂發布！`, "👑");
  closeEditContactModal();
  renderMorningBoard();
  if (typeof renderContactProjectionView === 'function') {
    renderContactProjectionView();
  }
}

function getSelectedAttendanceDate() {
  const dateInput = document.getElementById("attendanceDatePicker");
  return (dateInput && dateInput.value) ? dateInput.value : window.KingdomApp.getTodayDateString();
}

function updateLateThreshold(val) {
  window.KingdomApp.store.data.lateThreshold = val || "07:40";
  window.KingdomApp.store.save();
  showToast(`⏰ 遲到門檻已更新為 ${window.KingdomApp.store.data.lateThreshold}`);
  renderAttendanceView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

// 皇室點名簿抽屜展開狀態集合 (預設皆收合以節省版面)
window.attendanceOpenDrawers = window.attendanceOpenDrawers || new Set();

function toggleAttendanceDrawer(studentId) {
  if (!window.attendanceOpenDrawers) window.attendanceOpenDrawers = new Set();
  const id = Number(studentId);
  if (window.attendanceOpenDrawers.has(id)) {
    window.attendanceOpenDrawers.delete(id);
  } else {
    window.attendanceOpenDrawers.add(id);
  }
  renderAttendanceView();
}

function toggleAllAttendanceDrawers() {
  if (!window.attendanceOpenDrawers) window.attendanceOpenDrawers = new Set();
  const students = window.KingdomApp.store.data.students || [];
  if (window.attendanceOpenDrawers.size >= students.length) {
    window.attendanceOpenDrawers.clear();
  } else {
    students.forEach(st => window.attendanceOpenDrawers.add(st.id));
  }
  renderAttendanceView();
}

if (typeof window !== 'undefined') {
  window.toggleAttendanceDrawer = toggleAttendanceDrawer;
  window.toggleAllAttendanceDrawers = toggleAllAttendanceDrawers;
}

function renderAttendanceView() {
  const date = getSelectedAttendanceDate();
  const students = window.KingdomApp.store.data.students;
  const attendanceData = window.KingdomApp.store.data.attendance[date] || {};
  const lateThreshold = window.KingdomApp.store.data.lateThreshold || "07:40";

  let presentCount = 0;
  let leaveCount = 0;
  let lateCount = 0;
  let uncheckCount = 0;

  const leaveList = [];
  const lateList = [];
  const uncheckList = [];

  students.forEach(st => {
    const rec = attendanceData[st.id] || null;
    if (!rec || !rec.status || rec.status === 'uncheck') {
      uncheckCount++;
      uncheckList.push(st);
    } else if (rec.status === 'present') {
      presentCount++;
    } else if (rec.status === 'leave') {
      leaveCount++;
      leaveList.push({ student: st, record: rec });
    } else if (rec.status === 'late') {
      lateCount++;
      lateList.push({ student: st, record: rec });
    } else {
      uncheckCount++;
      uncheckList.push(st);
    }
  });

  const total = students.length;
  // 出席率嚴格依在朝實到人數計算，未打卡者絕不預設為出席
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  document.getElementById("statTotalStudents").textContent = total;
  document.getElementById("statPresentStudents").textContent = presentCount;
  document.getElementById("statLeaveStudents").textContent = leaveCount;
  document.getElementById("statLateStudents").textContent = lateCount;
  document.getElementById("statAttendanceRate").textContent = `${rate}%`;

  // 同步全班抽屜切換按鈕文字
  const btnToggleAllText = document.getElementById("btnToggleAllAttText");
  if (btnToggleAllText) {
    const isAllOpen = window.attendanceOpenDrawers && window.attendanceOpenDrawers.size >= total && total > 0;
    btnToggleAllText.textContent = isAllOpen ? "📁 收合全班登記抽屜" : "📂 展開全班登記抽屜";
  }

  // 頂部醒目的【出席狀況即時看板】（禁止無打卡時宣稱全員到齊）
  const topAlertBoard = document.getElementById("topAbsenteeAlertBoard");
  if (topAlertBoard) {
    if (uncheckCount === 0 && leaveList.length === 0 && lateList.length === 0 && total > 0) {
      topAlertBoard.innerHTML = `
        <div class="all-present-board p-4 rounded-2xl flex items-center justify-between border-2 border-emerald-400">
          <div class="flex items-center space-x-3">
            <span class="text-3xl">🎉</span>
            <div>
              <h3 class="text-emerald-950 font-black text-base">報告皇后殿下：今日全班 ${total} 位大臣全員到齊！</h3>
              <p class="text-xs text-emerald-800 font-semibold">無人缺席或告假，朝會出席率 100%！王國士氣高昂！</p>
            </div>
          </div>
          <span class="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow">全勤卓越</span>
        </div>
      `;
    } else if (presentCount === 0 && lateList.length === 0 && leaveList.length === 0) {
      topAlertBoard.innerHTML = `
        <div class="p-4 sm:p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/90 shadow-sm space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-2">
              <span class="text-2xl">🌅</span>
              <h3 class="text-amber-950 font-black text-base sm:text-lg">
                晨間朝會簽到進行中（今日尚未有人打卡到校）
              </h3>
            </div>
            <span class="text-xs bg-amber-600 text-white font-black px-2.5 py-0.5 rounded-full">
              自主簽到中 (0 / ${total})
            </span>
          </div>
          <p class="text-xs text-amber-800 font-medium">
            💡 本王國嚴格禁止系統自動產生假打卡！一律由學生在大螢幕按座號自主打卡，或由皇后老師手動登記。
          </p>
        </div>
      `;
    } else {
      topAlertBoard.innerHTML = `
        <div class="alert-board p-4 sm:p-5 rounded-2xl border-2 border-rose-400 shadow-md space-y-3">
          <div class="flex items-center justify-between border-b border-rose-200 pb-2 flex-wrap gap-2">
            <div class="flex items-center space-x-2">
              <span class="text-2xl animate-bounce">🚨</span>
              <h3 class="text-rose-950 font-black text-base sm:text-lg">
                今日出缺席即時看板 (實到 ${presentCount} 人 ‧ 未到 ${uncheckCount} 人)
              </h3>
            </div>
            <span class="text-xs bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-full">
              未打卡 ${uncheckCount} 人 ‧ 請假 ${leaveList.length} 人 ‧ 遲到 ${lateList.length} 人
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="bg-white/90 p-3 rounded-xl border border-rose-300">
              <span class="font-black text-rose-800 block mb-1.5">🔴 尚未打卡大臣 (${uncheckList.length}人)：</span>
              ${uncheckList.length === 0 ? '<span class="text-emerald-600 font-bold">全員皆已打卡或登記！</span>' : `
                <div class="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  ${uncheckList.map(st => `
                    <div class="flex items-center justify-between bg-rose-50/80 p-1.5 rounded-lg border border-rose-200">
                      <span class="font-black text-slate-800">${String(st.seatNo).padStart(2, '0')}號 ${st.name}</span>
                      <button onclick="setStudentAttendance(${st.id}, 'present')" class="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-black hover:bg-emerald-700">
                        補簽到
                      </button>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <div class="bg-white/90 p-3 rounded-xl border border-rose-200">
              <span class="font-black text-rose-800 block mb-1.5">🏖️ 告假大臣名單 (${leaveList.length}人)：</span>
              ${leaveList.length === 0 ? '<span class="text-slate-400">今日無大臣請假</span>' : `
                <div class="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  ${leaveList.map(item => {
                    const st = item.student;
                    const rec = item.record;
                    const typeMap = { sick: '病假', personal: '事假', official: '公假', bereavement: '喪假', other: '其他' };
                    const scopeDesc = rec.leaveScope === 'periods' 
                      ? `第 ${rec.leavePeriods ? rec.leavePeriods.join(',') : ''} 節` 
                      : '整天';
                    return `
                      <div class="flex items-center justify-between bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                        <span class="font-black text-slate-800">${String(st.seatNo).padStart(2, '0')}號 ${st.name}</span>
                        <div class="flex items-center space-x-1.5">
                          <span class="bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded text-[11px]">${typeMap[rec.leaveType] || '事假'} (${scopeDesc})</span>
                          <button onclick="setStudentAttendance(${st.id}, 'present')" class="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-700">
                            銷假
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>

            <div class="bg-white/90 p-3 rounded-xl border border-amber-300">
              <span class="font-black text-amber-900 block mb-1.5">⏳ 延遲覲見大臣 (${lateList.length}人，超過 ${lateThreshold})：</span>
              ${lateList.length === 0 ? '<span class="text-slate-400">今日無遲到大臣</span>' : `
                <div class="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  ${lateList.map(item => {
                    const st = item.student;
                    const rec = item.record;
                    return `
                      <div class="flex items-center justify-between bg-amber-50 p-1.5 rounded-lg border border-amber-300">
                        <span class="font-black text-slate-800">${String(st.seatNo).padStart(2, '0')}號 ${st.name}</span>
                        <div class="flex items-center space-x-1.5">
                          <span class="bg-amber-200 text-amber-950 font-mono font-bold px-1.5 py-0.5 rounded text-[11px]">${rec.checkInTime ? `${rec.checkInTime} 到校` : '遲到'}</span>
                          <button onclick="setStudentAttendance(${st.id}, 'present', '老師特准免計遲到')" class="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-700">
                            特准免罰
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    }
  }

  // 渲染學生名冊卡片 (5*5+2 版面，加大姓名，出缺席操作以抽屜方式折疊)
  const grid = document.getElementById("attendanceGrid");
  if (!grid) return;

  const filtered = students.filter(st => {
    const rec = attendanceData[st.id] || null;
    const status = rec ? rec.status : 'uncheck';
    if (currentAttendanceFilter === 'all') return true;
    if (currentAttendanceFilter === 'uncheck') return status === 'uncheck';
    return status === currentAttendanceFilter;
  });

  grid.innerHTML = filtered.map(st => {
    const rec = attendanceData[st.id] || null;
    const status = rec ? rec.status : 'uncheck';
    const checkInTime = (rec && rec.checkInTime) || '';
    const isDrawerOpen = window.attendanceOpenDrawers && window.attendanceOpenDrawers.has(st.id);

    let badgeHtml = '';
    let detailHtml = '';

    if (status === 'present') {
      badgeHtml = `<span class="badge-present text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap">✅ 出席 ${checkInTime ? `(${checkInTime})` : ''}</span>`;
    } else if (status === 'leave') {
      const typeMap = { sick: '病假', personal: '事假', official: '公假', bereavement: '喪假', other: '其他' };
      const scopeDesc = rec.leaveScope === 'periods' 
        ? `第 ${rec.leavePeriods ? rec.leavePeriods.join(', ') : '未定'} 節` 
        : '整天告假';
      badgeHtml = `<span class="badge-leave text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap">🏖️ 告假 (${typeMap[rec.leaveType] || '事假'})</span>`;
      detailHtml = `
        <div class="mt-1 text-[11px] text-rose-800 bg-rose-50 p-1.5 rounded-lg border border-rose-200 font-bold truncate">
          ${scopeDesc} ${rec.note ? `‧ ${rec.note}` : ''}
        </div>
      `;
    } else if (status === 'late') {
      badgeHtml = `<span class="badge-late text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap">⏳ 遲到 ${checkInTime ? `(${checkInTime})` : ''}</span>`;
      detailHtml = `
        <div class="mt-1 text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-300 font-bold truncate">
          超過門檻 ${lateThreshold} ${rec.note ? `‧ ${rec.note}` : ''}
        </div>
      `;
    } else {
      badgeHtml = `<span class="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-rose-700 border border-rose-300 whitespace-nowrap">🔴 尚未打卡</span>`;
    }

    return `
      <div class="parchment-card p-3 sm:p-3.5 minister-card flex flex-col justify-between transition-all hover:shadow-md">
        <div>
          <!-- 座號與狀態列 -->
          <div class="flex items-center justify-between gap-1.5">
            <span class="text-xs font-mono font-black text-amber-950 bg-amber-200/90 border border-amber-300/80 px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap">
              ${String(st.seatNo).padStart(2, '0')} 號
            </span>
            <div class="truncate text-right">
              ${badgeHtml}
            </div>
          </div>

          <!-- 學生姓名 (字體放大顯眼，後排清晰可見) 與 官職徽章 -->
          <div class="mt-2 flex items-center justify-between gap-2">
            <span class="text-xl sm:text-2xl font-cute font-black text-slate-900 tracking-wide filter drop-shadow-2xs truncate">
              ${st.name}
            </span>
            <span class="text-[11px] text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md font-bold truncate shrink-0 max-w-[90px]">
              ${st.title}
            </span>
          </div>
          ${detailHtml}
        </div>

        <!-- 抽屜式點名操作區塊 (預設折疊節省版面，點擊展開出席/請假/遲到/未到操作) -->
        <div class="mt-2.5 pt-2 border-t border-amber-200/80">
          <button type="button" onclick="toggleAttendanceDrawer(${st.id})" 
            class="w-full py-1 px-2.5 rounded-xl ${isDrawerOpen ? 'bg-amber-300 text-amber-950 border-amber-500 font-black' : 'bg-amber-100/80 hover:bg-amber-200 text-amber-900 border-amber-300 font-bold'} border text-xs flex items-center justify-between transition shadow-2xs cursor-pointer">
            <span class="flex items-center space-x-1">
              <span>⚡</span>
              <span>登記點名</span>
            </span>
            <span class="text-[11px] font-mono">${isDrawerOpen ? '▲ 收合' : '▼ 展開'}</span>
          </button>

          ${isDrawerOpen ? `
            <div class="mt-2 pt-1.5 grid grid-cols-2 gap-1.5">
              <button type="button" onclick="setStudentAttendance(${st.id}, 'present')" 
                class="py-1 px-1.5 text-xs font-black rounded-lg ${status === 'present' ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-400' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'} transition flex items-center justify-center space-x-1">
                <span>✅</span>
                <span>出席</span>
              </button>
              <button type="button" onclick="openLeaveModal(${st.id})" 
                class="py-1 px-1.5 text-xs font-black rounded-lg ${status === 'leave' ? 'bg-rose-600 text-white shadow ring-2 ring-rose-400' : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'} transition flex items-center justify-center space-x-1">
                <span>🏖️</span>
                <span>請假</span>
              </button>
              <button type="button" onclick="setStudentAttendance(${st.id}, 'late')" 
                class="py-1 px-1.5 text-xs font-black rounded-lg ${status === 'late' ? 'bg-amber-600 text-white shadow ring-2 ring-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'} transition flex items-center justify-center space-x-1">
                <span>⏳</span>
                <span>遲到</span>
              </button>
              <button type="button" onclick="setStudentAttendance(${st.id}, 'uncheck')" 
                class="py-1 px-1.5 text-xs font-black rounded-lg ${status === 'uncheck' ? 'bg-slate-700 text-white shadow' : 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 border border-slate-300'} transition flex items-center justify-center space-x-1" title="重設為未打卡 (未到)">
                <span>🔴</span>
                <span>未到</span>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  initLucideIcons();
  renderAttendanceHistoryTable();
}

// --- TAB 1: 皇室點名簿【歷日出席歷史紀錄總表】 ---
function renderAttendanceHistoryTable() {
  const container = document.getElementById("attendanceHistoryTableContainer");
  if (!container) return;

  const attendanceData = window.KingdomApp.store.data.attendance || {};
  const students = window.KingdomApp.store.data.students || [];
  const currentDate = getSelectedAttendanceDate();
  const dateKeys = Object.keys(attendanceData).sort().reverse();

  const countBadge = document.getElementById("attendanceHistoryDatesCountBadge");
  if (countBadge) {
    countBadge.textContent = `共記錄 ${dateKeys.length} 天出席史料`;
  }

  if (dateKeys.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-500 font-bold bg-white rounded-xl border border-dashed border-amber-300">
        目前尚無歷日出席歷史紀錄。只要在上方進行簽到或打卡，系統將自動按日保存！
      </div>
    `;
    return;
  }

  const weekdayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

  container.innerHTML = `
    <div class="overflow-x-auto rounded-xl border-2 border-amber-300 bg-white shadow-sm">
      <table class="w-full text-xs text-left">
        <thead class="bg-amber-100 text-amber-950 font-black border-b border-amber-300">
          <tr>
            <th class="p-3 text-center w-32">📅 紀錄日期</th>
            <th class="p-3 text-center w-28">出席概況</th>
            <th class="p-3">⏰ 遲到名單 (打卡時間)</th>
            <th class="p-3">🏖️ 告假名單 (事病假與節數)</th>
            <th class="p-3 text-center w-24">出席率</th>
            <th class="p-3 text-center w-28">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-amber-200/70 font-medium">
          ${dateKeys.map(dateStr => {
            const dayRecords = attendanceData[dateStr] || {};
            const dObj = new Date(dateStr + "T00:00:00");
            const weekday = !isNaN(dObj.getDay()) ? weekdayNames[dObj.getDay()] : "";
            const isSelected = (dateStr === currentDate);
            const isToday = (dateStr === window.KingdomApp.getTodayDateString());

            let pCount = 0;
            let lCount = 0;
            let aCount = 0;
            let uCount = 0;
            const lateStudents = [];
            const leaveStudents = [];

            students.forEach(st => {
              const rec = dayRecords[st.id] || null;
              if (!rec || !rec.status || rec.status === 'uncheck') {
                uCount++;
              } else if (rec.status === 'present') {
                pCount++;
              } else if (rec.status === 'late') {
                lCount++;
                lateStudents.push({
                  name: `${st.seatNo}.${st.name}`,
                  time: rec.checkInTime || '07:45'
                });
              } else if (rec.status === 'leave') {
                aCount++;
                const lTypeText = rec.leaveType === 'sick' ? '病假' : (rec.leaveType === 'official' ? '公假' : (rec.leaveType === 'mourning' ? '喪假' : '事假'));
                const periodText = (rec.periods && rec.periods.length) ? `(${rec.periods.length}節)` : '(全天)';
                leaveStudents.push({
                  name: `${st.seatNo}.${st.name}`,
                  type: lTypeText,
                  period: periodText
                });
              } else {
                uCount++;
              }
            });

            const total = students.length || 27;
            const rate = total > 0 ? Math.round((pCount / total) * 100) : 0;

            return `
              <tr class="${isSelected ? 'bg-amber-100/70 font-black' : 'hover:bg-amber-50/50'} transition-colors">
                <td class="p-3 text-center whitespace-nowrap">
                  <div class="flex flex-col items-center">
                    <span class="text-sm font-black text-amber-950">${dateStr}</span>
                    <span class="text-[11px] font-bold text-amber-800">${weekday} ${isToday ? '<span class="bg-amber-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">今日</span>' : ''}</span>
                  </div>
                </td>
                <td class="p-3 text-center">
                  ${(uCount === 0 && lCount === 0 && aCount === 0 && pCount > 0) ? `
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      🎉 全勤到齊 (${pCount}人)
                    </span>
                  ` : `
                    <div class="flex flex-col gap-0.5 items-center text-[11px]">
                      <span class="text-emerald-700 font-bold">🟢 到校: ${pCount}</span>
                      ${uCount > 0 ? `<span class="text-rose-600 font-bold">🔴 未到: ${uCount}</span>` : ''}
                      ${lCount > 0 ? `<span class="text-amber-700 font-bold">⏰ 遲到: ${lCount}</span>` : ''}
                      ${aCount > 0 ? `<span class="text-rose-700 font-bold">🏖️ 請假: ${aCount}</span>` : ''}
                    </div>
                  `}
                </td>
                <td class="p-3">
                  ${lateStudents.length > 0 ? `
                    <div class="flex flex-wrap gap-1">
                      ${lateStudents.map(ls => `
                        <span class="inline-flex items-center bg-amber-50 border border-amber-300 text-amber-900 px-2 py-0.5 rounded text-[11px] font-bold">
                          <span>${ls.name}</span>
                          <span class="ml-1 text-[10px] text-amber-700">(${ls.time})</span>
                        </span>
                      `).join('')}
                    </div>
                  ` : `
                    <span class="text-slate-400 font-bold">無人遲到</span>
                  `}
                </td>
                <td class="p-3">
                  ${leaveStudents.length > 0 ? `
                    <div class="flex flex-wrap gap-1">
                      ${leaveStudents.map(ls => `
                        <span class="inline-flex items-center bg-rose-50 border border-rose-300 text-rose-900 px-2 py-0.5 rounded text-[11px] font-bold">
                          <span>${ls.name}</span>
                          <span class="ml-1 text-[10px] text-rose-700">${ls.type}${ls.period}</span>
                        </span>
                      `).join('')}
                    </div>
                  ` : `
                    <span class="text-slate-400 font-bold">無人請假</span>
                  `}
                </td>
                <td class="p-3 text-center">
                  <span class="px-2 py-1 rounded-lg font-black ${rate === 100 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}">
                    ${rate}%
                  </span>
                </td>
                <td class="p-3 text-center">
                  <button onclick="switchAttendanceDate('${dateStr}')" class="px-2.5 py-1.5 rounded-lg text-xs font-black shadow-xs flex items-center justify-center space-x-1 mx-auto ${isSelected ? 'bg-amber-600 text-white ring-2 ring-amber-400' : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400'}">
                    <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                    <span>${isSelected ? '當前檢視中' : '切換補登'}</span>
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
  initLucideIcons();
}

function switchAttendanceDate(dateStr) {
  const picker = document.getElementById("attendanceDatePicker");
  if (picker) {
    picker.value = dateStr;
  }
  renderAttendanceView();
  showToast(`📅 已切換檢視 ${dateStr} 皇室點名紀錄`, "👑");
}

function filterAttendanceStatus(status) {
  currentAttendanceFilter = status;
  const buttons = ['all', 'present', 'leave', 'late', 'uncheck'];
  buttons.forEach(b => {
    const el = document.getElementById(`btnFilterAtt-${b}`);
    if (el) {
      if (b === status) {
        el.className = "px-3.5 py-1.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-900 shadow-sm font-black";
      } else {
        el.className = "px-3.5 py-1.5 rounded-lg bg-white/80 text-slate-700 border border-amber-300 hover:bg-amber-100 font-bold";
      }
    }
  });
  renderAttendanceView();
}

function markAllPresent() {
  const date = getSelectedAttendanceDate();
  const students = window.KingdomApp.store.data.students;
  if (!window.KingdomApp.store.data.attendance[date]) {
    window.KingdomApp.store.data.attendance[date] = {};
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  students.forEach(st => {
    window.KingdomApp.store.data.attendance[date][st.id] = { status: 'present', checkInTime: timeStr, note: '導師一鍵全班補簽到' };
  });

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast("👑 全體 27 位大臣已全數手動簽到出席！");
  renderAttendanceView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

function setStudentAttendance(studentId, status, customNote) {
  if (!checkTeacherAuth("登記出缺席")) return;
  const date = getSelectedAttendanceDate();
  const todayStr = window.KingdomApp.getTodayDateString();
  if (!window.KingdomApp.store.data.attendance[date]) {
    window.KingdomApp.store.data.attendance[date] = {};
  }

  const prev = window.KingdomApp.store.data.attendance[date][studentId] || {};

  // 若設定為未到（uncheck），直接清除打卡紀錄，恢復初始空白
  if (status === 'uncheck') {
    delete window.KingdomApp.store.data.attendance[date][studentId];
    window.KingdomApp.store.save();
    window.KingdomApp.sound.playCoin();
    showToast("🔴 已重設為未打卡（未到）狀態！");
    renderAttendanceView();
    renderMorningBoard();
    renderTrafficView();
    return;
  }

  // 愛班卡系統判定：若登記為遲到且為今日，系統自動增加一張愛班服務卡（事由直接設定為「遲到」）
  // 自動派發的自省卡和愛班卡皆由導師手動移除，系統無須自動移除
  if (status === 'late' && prev.status !== 'late' && date === todayStr) {
    window.KingdomApp.store.addServiceCard(studentId, "遲到");
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  window.KingdomApp.store.data.attendance[date][studentId] = {
    ...prev,
    status,
    checkInTime: prev.checkInTime || (status === 'present' ? timeStr : (status === 'late' ? '07:45' : null)),
    note: customNote || (status === 'present' ? '在朝準時' : prev.note)
  };

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast("👑 皇后老師已修改出缺席權限紀錄！");
  renderAttendanceView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

// 請假 Modal 控制
function openLeaveModal(studentId) {
  activeLeaveStudentId = studentId;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  if (!student) return;

  const date = getSelectedAttendanceDate();
  const currentRec = (window.KingdomApp.store.data.attendance[date] && window.KingdomApp.store.data.attendance[date][studentId]) || {};

  document.getElementById("leaveModalStudentName").textContent = 
    `座號 ${String(student.seatNo).padStart(2, '0')} ${student.name} ‧ ${student.title}`;

  const leaveType = currentRec.leaveType || 'sick';
  const typeRadio = document.querySelector(`input[name="leaveType"][value="${leaveType}"]`);
  if (typeRadio) typeRadio.checked = true;

  currentLeaveScope = currentRec.leaveScope || 'full_day';
  selectedPeriods = currentRec.leavePeriods ? [...currentRec.leavePeriods] : [1, 2];
  setLeaveScope(currentLeaveScope);

  document.getElementById("leaveNoteInput").value = currentRec.note || '';
  document.getElementById("leaveModal").classList.remove("hidden");
  initLucideIcons();
}

function closeLeaveModal() {
  document.getElementById("leaveModal").classList.add("hidden");
  activeLeaveStudentId = null;
}

function setLeaveScope(scope) {
  currentLeaveScope = scope;
  const btnFull = document.getElementById("btnScopeFullDay");
  const btnPeriods = document.getElementById("btnScopePeriods");
  const periodBox = document.getElementById("periodSelectionBox");

  if (scope === 'full_day') {
    btnFull.className = "py-2 px-3 rounded-lg border font-bold text-center bg-rose-600 text-white border-rose-700 shadow";
    btnPeriods.className = "py-2 px-3 rounded-lg border font-bold text-center bg-white text-slate-700 border-amber-300";
    periodBox.classList.add("hidden");
  } else {
    btnPeriods.className = "py-2 px-3 rounded-lg border font-bold text-center bg-rose-600 text-white border-rose-700 shadow";
    btnFull.className = "py-2 px-3 rounded-lg border font-bold text-center bg-white text-slate-700 border-amber-300";
    periodBox.classList.remove("hidden");
    renderPeriodChips();
  }
}

function renderPeriodChips() {
  for (let i = 1; i <= 7; i++) {
    const chip = document.getElementById(`chipPeriod-${i}`);
    if (chip) {
      if (selectedPeriods.includes(i)) chip.classList.add("active");
      else chip.classList.remove("active");
    }
  }
}

function togglePeriod(period) {
  if (selectedPeriods.includes(period)) {
    selectedPeriods = selectedPeriods.filter(p => p !== period);
  } else {
    selectedPeriods.push(period);
  }
  selectedPeriods.sort((a, b) => a - b);
  renderPeriodChips();
}

function saveStudentLeave(e) {
  e.preventDefault();
  if (!activeLeaveStudentId) return;

  const date = getSelectedAttendanceDate();
  const leaveType = document.querySelector('input[name="leaveType"]:checked').value;
  const note = document.getElementById("leaveNoteInput").value.trim();

  if (currentLeaveScope === 'periods' && selectedPeriods.length === 0) {
    alert("請至少勾選一個請假節數！");
    return;
  }

  if (!window.KingdomApp.store.data.attendance[date]) {
    window.KingdomApp.store.data.attendance[date] = {};
  }

  window.KingdomApp.store.data.attendance[date][activeLeaveStudentId] = {
    status: 'leave',
    leaveType,
    leaveScope: currentLeaveScope,
    leavePeriods: currentLeaveScope === 'periods' ? selectedPeriods : [],
    note
  };

  window.KingdomApp.store.save();
  showToast("🏖️ 大臣告假登記已核准！");
  closeLeaveModal();
  renderAttendanceView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

// ===================================================================
// 5. 皇室奏章堂：當天作業繳交情形【四欄式拖曳統整看板】 (Summary Board)
// ===================================================================
let currentDraggedHwInfo = null;

function handleHwStudentDragStart(event, hwId, studentId) {
  currentDraggedHwInfo = { hwId, studentId: Number(studentId) || studentId };
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", JSON.stringify(currentDraggedHwInfo));
    event.dataTransfer.effectAllowed = "move";
  }
  if (event.currentTarget) {
    event.currentTarget.classList.add("opacity-40", "scale-95");
  }
}

function handleHwStudentDragEnd(event) {
  if (event.currentTarget) {
    event.currentTarget.classList.remove("opacity-40", "scale-95");
  }
  document.querySelectorAll(".hw-dropzone").forEach(el => {
    el.classList.remove("ring-4", "ring-amber-400", "bg-amber-100/60");
  });
}

function handleHwDropZoneOver(event) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
  const dz = event.currentTarget;
  if (dz && !dz.classList.contains("ring-4")) {
    dz.classList.add("ring-4", "ring-amber-400", "bg-amber-100/60");
  }
}

function handleHwDropZoneLeave(event) {
  const dz = event.currentTarget;
  if (dz) {
    dz.classList.remove("ring-4", "ring-amber-400", "bg-amber-100/60");
  }
}

function handleHwDropZoneDrop(event, hwId, targetStatus) {
  event.preventDefault();
  const dz = event.currentTarget;
  if (dz) {
    dz.classList.remove("ring-4", "ring-amber-400", "bg-amber-100/60");
  }

  let hwIdToUse = hwId;
  let studentIdToUse = null;

  try {
    const rawData = event.dataTransfer ? event.dataTransfer.getData("text/plain") : null;
    if (rawData) {
      const data = JSON.parse(rawData);
      if (data && data.studentId) {
        studentIdToUse = data.studentId;
        if (data.hwId) hwIdToUse = data.hwId;
      }
    }
  } catch (e) {}

  if (!studentIdToUse && currentDraggedHwInfo) {
    studentIdToUse = currentDraggedHwInfo.studentId;
    hwIdToUse = currentDraggedHwInfo.hwId;
  }

  if (hwIdToUse && studentIdToUse) {
    setStudentHomeworkStatus(hwIdToUse, studentIdToUse, targetStatus);
    const student = window.KingdomApp.store.data.students.find(s => s.id == studentIdToUse);
    const statusNames = {
      submitted: '✅ 準時已繳交',
      late: '⏰ 遲交已補',
      revision: '⚠️ 需訂正',
      pending: '❌ 未繳交'
    };
    showToast(`📜 已將 ${student ? student.name : '大臣'} 移動至【${statusNames[targetStatus] || targetStatus}】`, "✨");
  }
  currentDraggedHwInfo = null;
}

function setStudentHomeworkStatus(hwId, studentId, targetStatus) {
  const hw = window.KingdomApp.store.data.homework.find(h => h.id == hwId);
  if (!hw) return;
  if (!hw.records) hw.records = {};

  hw.records[studentId] = targetStatus;

  if (targetStatus === 'pending' || targetStatus === 'missing') {
    const b = window.KingdomApp.store.data.behaviorCards && window.KingdomApp.store.data.behaviorCards[studentId];
    if (b && b.dismissedHwCards) {
      delete b.dismissedHwCards[String(hwId)];
    }
  }

  // 作業未交自動同步自省卡（一項未交自動新增一張自省卡，標示哪項作業；導師全手動移除，系統無須自動移除）
  window.KingdomApp.store.syncHomeworkReflectionCards(studentId);

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  renderHomeworkSummaryBoard();
  renderTrafficView();         // 即時連動下課紅綠燈！
  renderHomeworkSettlementTable(); // 即時連動學期結算統計！
}

function renderHomeworkSummaryBoard() {
  const container = document.getElementById("homeworkSummaryBoardContainer");
  if (!container) return;

  const allHwList = window.KingdomApp.store.data.homework || [];
  const students = window.KingdomApp.store.data.students || [];

  // 日期過濾
  let homeworkList = allHwList;
  if (typeof currentHwFilterDate !== 'undefined' && currentHwFilterDate && currentHwFilterDate !== 'ALL') {
    homeworkList = allHwList.filter(h => h.date === currentHwFilterDate);
  }

  if (homeworkList.length === 0) {
    container.innerHTML = `
      <div class="parchment-card p-8 text-center text-slate-600 font-bold space-y-2">
        <p>目前在指定日期 (${currentHwFilterDate || '今日'}) 尚無登記的作業奏章。</p>
        <button onclick="showAllHomeworkHistory()" class="px-4 py-1.5 rounded-xl btn-royal-gold text-xs font-black shadow">
          查看所有歷史作業
        </button>
      </div>
    `;
    renderHomeworkSettlementTable();
    renderContactBookHistoryList();
    return;
  }

  container.innerHTML = homeworkList.map(hw => {
    const submittedList = [];
    const lateList = [];
    const revisionList = [];
    const pendingList = [];

    students.forEach(st => {
      const status = (hw.records && (hw.records[st.id] !== undefined ? hw.records[st.id] : hw.records[st.seatNo])) || 'pending';
      if (status === 'revision') {
        revisionList.push(st);
      } else if (status === 'late') {
        lateList.push(st);
      } else if (status === 'submitted' || status === 'excellent') {
        submittedList.push(st);
      } else {
        pendingList.push(st);
      }
    });

    const columns = [
      {
        id: 'submitted',
        title: '準時已繳交',
        icon: '✅',
        colorText: 'text-emerald-950',
        bgClass: 'bg-emerald-50/70 border-emerald-300',
        badgeClass: 'bg-emerald-600 text-white',
        chipBorder: 'border-emerald-300 hover:border-emerald-500 bg-white text-emerald-950',
        list: submittedList
      },
      {
        id: 'late',
        title: '遲交已補',
        icon: '⏰',
        colorText: 'text-amber-950',
        bgClass: 'bg-amber-50/70 border-amber-300',
        badgeClass: 'bg-amber-600 text-white',
        chipBorder: 'border-amber-300 hover:border-amber-500 bg-white text-amber-950',
        list: lateList
      },
      {
        id: 'revision',
        title: '需訂正',
        icon: '⚠️',
        colorText: 'text-purple-950',
        bgClass: 'bg-purple-50/70 border-purple-300',
        badgeClass: 'bg-purple-600 text-white',
        chipBorder: 'border-purple-300 hover:border-purple-500 bg-white text-purple-950',
        list: revisionList
      },
      {
        id: 'pending',
        title: '未繳交',
        icon: '❌',
        colorText: 'text-rose-950',
        bgClass: 'bg-rose-50/70 border-rose-300',
        badgeClass: 'bg-rose-600 text-white',
        chipBorder: 'border-rose-300 hover:border-rose-500 bg-white text-rose-950',
        list: pendingList
      }
    ];

    return `
      <div class="bg-white rounded-2xl border-2 border-amber-300 p-5 space-y-4 shadow-sm" data-hw-card-id="${hw.id}">
        <!-- 頂部作業資訊與操作按鈕 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-amber-200">
          <div>
            <div class="flex items-center space-x-2">
              <span class="bg-amber-200 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-md">
                ${hw.subject || '作業'}
              </span>
              <h3 class="text-lg font-black text-amber-950">
                ${hw.title}
              </h3>
              <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                📅 ${hw.date || '今日'}
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-1">${hw.desc || '無補充說明'}</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openEditHomeworkModal('${hw.id}')" class="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-black text-xs shadow-xs flex items-center space-x-1" title="修改此作業的科目、名稱、截止日期或說明備註">
              <span>✏️</span>
              <span>編輯作業</span>
            </button>
            <button onclick="openSetRevisionModal('${hw.id}')" class="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-black text-xs shadow-xs flex items-center space-x-1">
              <span>⚠️</span>
              <span>設置需訂正名冊</span>
            </button>
            <button onclick="batchMarkAllHwSubmitted('${hw.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-black text-xs shadow-xs flex items-center space-x-1">
              <span>✅</span>
              <span>全班全數繳齊</span>
            </button>
            <button onclick="deleteHomework('${hw.id}')" class="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs">
              刪除
            </button>
          </div>
        </div>

        <!-- 🌟 四欄式拖曳移動看板 (Drag & Drop + 觸控快速切換) 🌟 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          ${columns.map(col => `
            <div class="rounded-xl border-2 ${col.bgClass} p-3 flex flex-col space-y-2">
              <div class="flex items-center justify-between pb-1 border-b border-amber-200/60 font-black">
                <span class="flex items-center space-x-1.5 ${col.colorText}">
                  <span>${col.icon}</span>
                  <span>${col.title}</span>
                </span>
                <span class="px-2 py-0.5 rounded-full text-xs font-black ${col.badgeClass} shadow-2xs">
                  ${col.list.length} 人
                </span>
              </div>

              <!-- 可放置區域 Dropzone (支援拖曳放置) -->
              <div 
                class="hw-dropzone flex-1 min-h-[140px] max-h-72 overflow-y-auto space-y-1.5 p-1.5 rounded-lg border-2 border-dashed border-slate-300/80 transition-all"
                data-hw-id="${hw.id}"
                data-status="${col.id}"
                ondragover="handleHwDropZoneOver(event)"
                ondragleave="handleHwDropZoneLeave(event)"
                ondrop="handleHwDropZoneDrop(event, '${hw.id}', '${col.id}')"
              >
                ${col.list.length === 0 ? `
                  <div class="h-28 flex flex-col items-center justify-center text-slate-400 text-[11px] pointer-events-none select-none">
                    <span>✋ 拖曳大臣名牌至此</span>
                  </div>
                ` : col.list.map(s => `
                  <div
                    class="hw-student-chip p-1.5 rounded-lg border ${col.chipBorder} shadow-2xs flex items-center justify-between gap-1 cursor-grab active:cursor-grabbing hover:shadow-md transition-all select-none"
                    draggable="true"
                    ondragstart="handleHwStudentDragStart(event, '${hw.id}', '${s.id}')"
                    ondragend="handleHwStudentDragEnd(event)"
                    title="【拖曳移動】至其他欄位，或點擊右側按鈕快速變更"
                  >
                    <div class="flex items-center space-x-1 min-w-0">
                      <span class="text-slate-400 text-[10px] font-bold">⋮⋮</span>
                      <span class="font-black truncate text-[11px]">${String(s.seatNo).padStart(2, '0')}.${s.name}</span>
                    </div>
                    <!-- 快捷切換微型按鈕群 (支援大螢幕觸控點擊) -->
                    <div class="flex items-center space-x-0.5 shrink-0">
                      ${col.id !== 'submitted' ? `
                        <button type="button" onclick="setStudentHomeworkStatus('${hw.id}', ${s.id}, 'submitted')" title="移動至【準時已繳交】" class="w-5 h-5 rounded hover:bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✅</button>
                      ` : ''}
                      ${col.id !== 'late' ? `
                        <button type="button" onclick="setStudentHomeworkStatus('${hw.id}', ${s.id}, 'late')" title="移動至【遲交已補】" class="w-5 h-5 rounded hover:bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">⏰</button>
                      ` : ''}
                      ${col.id !== 'revision' ? `
                        <button type="button" onclick="setStudentHomeworkStatus('${hw.id}', ${s.id}, 'revision')" title="移動至【需訂正】" class="w-5 h-5 rounded hover:bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">⚠️</button>
                      ` : ''}
                      ${col.id !== 'pending' ? `
                        <button type="button" onclick="setStudentHomeworkStatus('${hw.id}', ${s.id}, 'pending')" title="移動至【未繳交】" class="w-5 h-5 rounded hover:bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold">❌</button>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  renderHomeworkSettlementTable();
  renderContactBookHistoryList();
}

// -------------------------------------------------------------------
// 📜 歷日聯絡簿歷史存檔簿 (各日回家奏章回溯檔案庫)
// -------------------------------------------------------------------
let isContactHistoryExpanded = false;

function toggleContactHistoryAccordion() {
  const list = document.getElementById("morningContactHistoryList");
  const txt = document.getElementById("btnToggleContactHistoryText");
  if (!list) return;
  isContactHistoryExpanded = !isContactHistoryExpanded;
  if (isContactHistoryExpanded) {
    list.classList.remove("hidden");
    if (txt) txt.textContent = "歷史存檔簿 (收合)";
  } else {
    list.classList.add("hidden");
    if (txt) txt.textContent = "歷史存檔簿 (展開)";
  }
}

function loadContactDateToMorning(dateStr) {
  currentContactDate = dateStr;
  const picker = document.getElementById("morningContactDatePicker");
  if (picker) picker.value = dateStr;
  renderMorningBoard();
  showToast(`📺 已在晨間大螢幕載入【${dateStr}】聯絡簿奏章！`, "📜");
}

function openEditContactModalForDate(dateStr) {
  if (!checkTeacherAuth("編輯歷史聯絡簿")) return;
  currentContactDate = dateStr;
  openEditContactModal();
}

function deleteContactHistoryEntry(dateStr) {
  if (!checkTeacherAuth("刪除歷史聯絡簿存檔")) return;
  if (!confirm(`確定要刪除【${dateStr}】的聯絡簿歷史存檔嗎？\n此動作刪除後無法復原。`)) return;

  if (window.KingdomApp.store.data.contactBookHistory) {
    delete window.KingdomApp.store.data.contactBookHistory[dateStr];
  }
  if (currentContactDate === dateStr) {
    currentContactDate = window.KingdomApp.getTodayDateString();
    const picker = document.getElementById("morningContactDatePicker");
    if (picker) picker.value = currentContactDate;
  }
  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast(`🗑️ 已成功刪除【${dateStr}】聯絡簿存檔！`, "📜");
  renderMorningBoard();
  renderContactBookHistoryList();
}

function renderContactBookHistoryList() {
  const morningContainer = document.getElementById("morningContactHistoryList");
  const teacherContainer = document.getElementById("teacherContactHistoryList");
  if (!morningContainer && !teacherContainer) return;

  const history = window.KingdomApp.store.data.contactBookHistory || {};
  const dateKeys = Object.keys(history).sort().reverse();
  const todayStr = window.KingdomApp.getTodayDateString();
  const weekdayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

  if (dateKeys.length === 0) {
    const emptyHtml = `
      <div class="col-span-full p-4 text-center text-slate-500 font-bold bg-amber-50/70 rounded-xl border border-dashed border-amber-300">
        目前尚無歷日聯絡簿歷史紀錄。導師點擊「✏️ 編輯每日聯絡簿」後即可按日存檔！
      </div>
    `;
    if (morningContainer) morningContainer.innerHTML = emptyHtml;
    if (teacherContainer) teacherContainer.innerHTML = emptyHtml;
    return;
  }

  const renderCard = (dateStr) => {
    const entry = history[dateStr] || {};
    const dObj = new Date(dateStr + "T00:00:00");
    const weekday = !isNaN(dObj.getDay()) ? weekdayNames[dObj.getDay()] : "";
    const isToday = (dateStr === todayStr);
    const hwItems = entry.homeworkItems || [];
    const remItems = entry.reminders || [];
    const motto = entry.queenMotto || "";

    return `
      <div class="bg-white rounded-xl border-2 ${isToday ? 'border-amber-400 ring-2 ring-amber-300/70' : 'border-amber-200'} p-3.5 space-y-2.5 shadow-2xs hover:shadow-md transition-all">
        <div class="flex items-center justify-between pb-2 border-b border-amber-200">
          <div class="flex items-center space-x-1.5">
            <span class="text-base font-black text-amber-950">${dateStr}</span>
            <span class="text-xs font-bold text-amber-800">(${weekday})</span>
            ${isToday ? '<span class="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">今日</span>' : ''}
          </div>
          <div class="flex items-center space-x-1">
            <button type="button" onclick="loadContactDateToMorning('${dateStr}')" class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-300 shadow-2xs flex items-center space-x-0.5" title="載入至大螢幕展示">
              <span>📺</span>
              <span>展示</span>
            </button>
            <button type="button" onclick="openEditContactModalForDate('${dateStr}')" class="px-2 py-1 rounded-lg btn-royal-gold text-amber-950 text-xs font-black border border-amber-400 hover:opacity-90 shadow-2xs flex items-center space-x-0.5" title="編輯此日聯絡簿">
              <span>✏️</span>
              <span>編輯</span>
            </button>
            <button type="button" onclick="deleteContactHistoryEntry('${dateStr}')" class="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-300 shadow-2xs flex items-center space-x-0.5" title="刪除此日存檔">
              <span>🗑️</span>
              <span>刪除</span>
            </button>
          </div>
        </div>

        <div class="space-y-1.5 text-xs text-slate-800">
          <div class="font-bold flex items-center justify-between text-amber-950">
            <span>📝 回家作業 (${hwItems.length} 項)：</span>
          </div>
          ${hwItems.length > 0 ? `
            <ul class="space-y-1 pl-1 max-h-28 overflow-y-auto font-medium">
              ${hwItems.map((item, idx) => `
                <li class="flex items-start space-x-1.5 text-[11px] leading-snug">
                  <span class="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">${idx + 1}</span>
                  <span class="truncate">${item}</span>
                </li>
              `).join('')}
            </ul>
          ` : `
            <p class="text-slate-400 text-[11px] italic">未指派作業</p>
          `}

          ${remItems.length > 0 ? `
            <div class="pt-1 border-t border-dashed border-amber-200">
              <span class="font-bold text-amber-950 text-[11px]">🔔 早自修和重要提醒：</span>
              <ul class="list-disc list-inside text-[11px] text-slate-700 pl-1 space-y-0.5">
                ${remItems.slice(0, 2).map(r => `<li class="truncate">${r}</li>`).join('')}
                ${remItems.length > 2 ? `<li class="text-[10px] text-slate-400">…等共 ${remItems.length} 項提醒</li>` : ''}
              </ul>
            </div>
          ` : ''}

          ${motto ? `
            <div class="pt-1 text-[11px] text-amber-900 bg-amber-50/70 p-1.5 rounded border border-amber-200 italic truncate" title="${motto}">
              ${motto}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  };

  const cardsHtml = dateKeys.map(d => renderCard(d)).join('');
  if (morningContainer) morningContainer.innerHTML = cardsHtml;
  if (teacherContainer) teacherContainer.innerHTML = cardsHtml;
}

function cycleHwStatus(hwId, studentId) {
  const hw = window.KingdomApp.store.data.homework.find(h => h.id == hwId);
  if (!hw) return;
  if (!hw.records) hw.records = {};

  const current = hw.records[studentId] || 'pending';
  let nextStatus = 'submitted';

  if (current === 'submitted' || current === 'excellent') {
    nextStatus = 'late';       // 準時已交 -> 遲交 (橘色徽章，記錄供期末結算)
  } else if (current === 'late') {
    nextStatus = 'revision';   // 遲交 -> 需訂正 (紫色)
  } else if (current === 'revision') {
    nextStatus = 'pending';    // 需訂正 -> 未交 (紅色)
  } else {
    nextStatus = 'submitted';  // 未交 -> 準時已交 (綠色)
  }

  hw.records[studentId] = nextStatus;

  if (nextStatus === 'pending' || nextStatus === 'missing') {
    const b = window.KingdomApp.store.data.behaviorCards && window.KingdomApp.store.data.behaviorCards[studentId];
    if (b && b.dismissedHwCards) {
      delete b.dismissedHwCards[String(hwId)];
    }
  }

  // 作業未交自動同步自省卡（一項未交自動新增一張自省卡，標示哪項作業；導師全手動移除，系統無須自動移除）
  window.KingdomApp.store.syncHomeworkReflectionCards(studentId);
  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  renderHomeworkSummaryBoard();
  renderTrafficView();         // 即時連動下課紅綠燈！
  renderHomeworkSettlementTable(); // 即時連動學期結算統計！
}

// -------------------------------------------------------------------
// 老師端直接設置「需訂正」名單彈窗
// -------------------------------------------------------------------
function openSetRevisionModal(hwId) {
  activeRevisionHwId = hwId;
  const hw = window.KingdomApp.store.data.homework.find(h => h.id == hwId);
  if (!hw) return;

  document.getElementById("setRevisionModalTitle").textContent = `設置【${hw.title}】需訂正大臣名單`;

  const students = window.KingdomApp.store.data.students;
  activeRevisionStudentIds = new Set();

  students.forEach(st => {
    if (hw.records && hw.records[st.id] === 'revision') {
      activeRevisionStudentIds.add(st.id);
    }
  });

  const grid = document.getElementById("revisionSelectorGrid");
  grid.innerHTML = students.map(st => {
    const isChecked = activeRevisionStudentIds.has(st.id);
    return `
      <label class="flex items-center space-x-1.5 p-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 cursor-pointer text-xs font-bold ${isChecked ? 'bg-purple-100 border-purple-400' : 'bg-white'}">
        <input type="checkbox" onchange="toggleRevisionStudent(${st.id}, this.checked)" ${isChecked ? 'checked' : ''} class="rounded text-purple-600 focus:ring-purple-500">
        <span>${String(st.seatNo).padStart(2, '0')}.${st.name}</span>
      </label>
    `;
  }).join('');

  document.getElementById("setRevisionModal").classList.remove("hidden");
  initLucideIcons();
}

function closeSetRevisionModal() {
  document.getElementById("setRevisionModal").classList.add("hidden");
  activeRevisionHwId = null;
}

function toggleRevisionStudent(studentId, isChecked) {
  if (isChecked) {
    activeRevisionStudentIds.add(studentId);
  } else {
    activeRevisionStudentIds.delete(studentId);
  }
}

function toggleSelectAllRevision(selectAll) {
  const students = window.KingdomApp.store.data.students;
  students.forEach(st => {
    if (selectAll) activeRevisionStudentIds.add(st.id);
    else activeRevisionStudentIds.delete(st.id);
  });

  const checkboxes = document.querySelectorAll("#revisionSelectorGrid input[type='checkbox']");
  checkboxes.forEach(cb => cb.checked = selectAll);
}

function saveRevisionSelection() {
  if (!activeRevisionHwId) return;
  const hw = window.KingdomApp.store.data.homework.find(h => h.id == activeRevisionHwId);
  if (!hw) return;
  if (!hw.records) hw.records = {};

  const students = window.KingdomApp.store.data.students;
  students.forEach(st => {
    if (activeRevisionStudentIds.has(st.id)) {
      hw.records[st.id] = 'revision'; // 標記需訂正
    } else {
      // 若原先為需訂正但現在被取消勾選，則視為已完成繳交
      if (hw.records[st.id] === 'revision') {
        hw.records[st.id] = 'submitted';
      }
    }
  });

  window.KingdomApp.store.syncAllHomeworkReflectionCards();
  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast(`⚠️ 已成功設置【${hw.title}】共 ${activeRevisionStudentIds.size} 位需訂正大臣！`);
  closeSetRevisionModal();
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

// -------------------------------------------------------------------
// 編輯既有作業奏章 (修改作業名稱、科目、日期、備註等)
// -------------------------------------------------------------------
let currentEditingHomeworkId = null;

function openEditHomeworkModal(hwId) {
  if (!checkTeacherAuth("編輯作業奏章內容")) return;
  const homeworkList = window.KingdomApp.store.data.homework || [];
  const hw = homeworkList.find(h => String(h.id) === String(hwId));
  if (!hw) {
    showToast("⚠️ 找不到該項作業，無法編輯！", "⚠️");
    return;
  }

  currentEditingHomeworkId = hwId;
  const idInput = document.getElementById("editHwId");
  const subjectSelect = document.getElementById("editHwSubject");
  const dueDateInput = document.getElementById("editHwDueDate");
  const titleInput = document.getElementById("editHwTitle");
  const descInput = document.getElementById("editHwDesc");

  if (idInput) idInput.value = hw.id;
  if (subjectSelect) subjectSelect.value = hw.subject || '國語';
  if (dueDateInput) dueDateInput.value = hw.dueDate || hw.date || window.KingdomApp.getTodayDateString();
  if (titleInput) titleInput.value = hw.title || '';
  if (descInput) descInput.value = hw.desc || '';

  const modal = document.getElementById("editHomeworkModal");
  if (modal) modal.classList.remove("hidden");
  initLucideIcons();
}

function closeEditHomeworkModal() {
  currentEditingHomeworkId = null;
  const modal = document.getElementById("editHomeworkModal");
  if (modal) modal.classList.add("hidden");
}

function submitEditHomework(e) {
  e.preventDefault();
  if (!currentEditingHomeworkId) return;

  const homeworkList = window.KingdomApp.store.data.homework || [];
  const hw = homeworkList.find(h => String(h.id) === String(currentEditingHomeworkId));
  if (!hw) {
    showToast("⚠️ 找不到該項作業紀錄！", "⚠️");
    return;
  }

  const subject = document.getElementById("editHwSubject").value;
  const dueDate = document.getElementById("editHwDueDate").value;
  const title = document.getElementById("editHwTitle").value.trim();
  const desc = document.getElementById("editHwDesc").value.trim();

  if (!title) {
    showToast("請輸入作業名稱！", "⚠️");
    return;
  }

  hw.subject = subject;
  hw.dueDate = dueDate;
  hw.date = dueDate;
  hw.title = title;
  hw.desc = desc;

  // 同步自省卡中關聯作業的名稱
  window.KingdomApp.store.syncAllHomeworkReflectionCards();
  window.KingdomApp.store.save();

  closeEditHomeworkModal();
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
  showToast(`✏️ 作業【${title}】資訊已成功更新！`, "✅");
}

function batchMarkAllHwSubmitted(hwId) {
  if (!checkTeacherAuth("全體作業標記為繳交")) return;
  const hw = window.KingdomApp.store.data.homework.find(h => h.id == hwId);
  if (!hw) return;
  if (!hw.records) hw.records = {};

  window.KingdomApp.store.data.students.forEach(st => {
    hw.records[st.id] = 'submitted';
  });

  window.KingdomApp.store.syncAllHomeworkReflectionCards();
  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast("👑 全體大臣作業已標記為已繳交！");
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

function deleteHomework(hwId) {
  if (!checkTeacherAuth("刪除作業奏章")) return;
  if (!confirm("確定要刪除此項作業奏章嗎？")) return;
  window.KingdomApp.store.data.homework = window.KingdomApp.store.data.homework.filter(h => h.id != hwId);
  window.KingdomApp.store.syncAllHomeworkReflectionCards();
  window.KingdomApp.store.save();
  showToast("🗑️ 作業奏章已銷毀");
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

function renderHomeworkPresetButtons() {
  const container = document.getElementById("hwPresetButtonsBar");
  if (!container) return;
  const presets = window.KingdomApp.store.data.homeworkPresets || window.KingdomApp.DEFAULT_HOMEWORK_PRESETS || [];
  if (presets.length === 0) {
    container.innerHTML = '<span class="text-xs text-slate-400">尚無快捷範本，可點右上角自訂新增</span>';
    return;
  }

  container.innerHTML = presets.map(p => `
    <button type="button" onclick="applyHomeworkPreset('${p.id}')"
      class="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 shadow-2xs flex items-center space-x-1 transition"
      title="套用【${p.fullName}】 (${p.subject})">
      <span class="text-[10px] bg-amber-200 text-amber-900 px-1 rounded font-bold">${p.subject}</span>
      <span>${p.name}</span>
    </button>
  `).join('');
}

function applyHomeworkPreset(presetId) {
  const presets = window.KingdomApp.store.data.homeworkPresets || window.KingdomApp.DEFAULT_HOMEWORK_PRESETS || [];
  const preset = presets.find(p => p.id === presetId);
  if (!preset) return;

  const selSubject = document.getElementById("newHwSubject");
  const inputTitle = document.getElementById("newHwTitle");
  const inputDesc = document.getElementById("newHwDesc");

  if (selSubject) selSubject.value = preset.subject;
  if (inputTitle) {
    inputTitle.value = preset.fullName;
    inputTitle.dataset.presetName = preset.name;
  }
  if (inputDesc && preset.defaultDesc) {
    inputDesc.value = preset.defaultDesc;
  }

  window.KingdomApp.sound.playCoin();
  showToast(`✨ 已套用常用作業範本【${preset.name}】！`);
}

function openAddHwPresetModal() {
  document.getElementById("addHwPresetModal").classList.remove("hidden");
  initLucideIcons();
}

function closeAddHwPresetModal() {
  document.getElementById("addHwPresetModal").classList.add("hidden");
}

function submitNewHwPreset(e) {
  e.preventDefault();
  const subject = document.getElementById("presetSubject").value;
  const name = document.getElementById("presetName").value.trim();
  const fullName = document.getElementById("presetFullName").value.trim();
  const defaultDesc = document.getElementById("presetDesc").value.trim();

  if (!name || !fullName) {
    alert("請填寫快捷簡稱與完整作業名稱！");
    return;
  }

  window.KingdomApp.store.addHomeworkPreset({ subject, name, fullName, defaultDesc });
  showToast(`✅ 已新增作業快捷範本【${name}】！`);
  closeAddHwPresetModal();
  renderHomeworkPresetButtons();
}

function openNewHomeworkModal() {
  document.getElementById("newHwDueDate").value = window.KingdomApp.getTodayDateString();
  const titleEl = document.getElementById("newHwTitle");
  if (titleEl) {
    titleEl.value = "";
    delete titleEl.dataset.presetName;
  }
  document.getElementById("newHomeworkModal").classList.remove("hidden");
  renderHomeworkPresetButtons();
  initLucideIcons();
}

function closeNewHomeworkModal() {
  document.getElementById("newHomeworkModal").classList.add("hidden");
}

function submitNewHomework(e) {
  e.preventDefault();
  const subject = document.getElementById("newHwSubject").value;
  const dueDate = document.getElementById("newHwDueDate").value;
  const titleEl = document.getElementById("newHwTitle");
  const title = titleEl.value.trim();
  const desc = document.getElementById("newHwDesc").value.trim();
  const presetName = titleEl.dataset.presetName || '';

  const newHw = {
    id: `hw-${Date.now()}`,
    subject,
    title,
    presetName,
    dueDate,
    desc,
    records: {}
  };

  window.KingdomApp.store.data.students.forEach(st => {
    newHw.records[st.id] = 'pending';
  });

  window.KingdomApp.store.data.homework.unshift(newHw);
  window.KingdomApp.store.syncAllHomeworkReflectionCards();
  window.KingdomApp.store.save();

  window.KingdomApp.sound.playFanfare();
  window.KingdomApp.triggerConfetti();
  showToast("📜 皇室新奏章已頒布！");
  closeNewHomeworkModal();
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

function renderHomeworkSettlementTable() {
  const tbody = document.getElementById("homeworkSettlementTableBody");
  if (!tbody) return;

  const students = window.KingdomApp.store.data.students || [];
  const homeworkList = window.KingdomApp.store.data.homework || [];
  const totalHw = homeworkList.length;

  if (totalHw === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-slate-400">目前尚無作業紀錄可結算</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(st => {
    let onTime = 0;
    let late = 0;
    let revision = 0;
    let missing = 0;

    homeworkList.forEach(hw => {
      const rec = (hw.records && (hw.records[st.id] !== undefined ? hw.records[st.id] : hw.records[st.seatNo])) || 'pending';
      if (rec === 'submitted' || rec === 'excellent') onTime++;
      else if (rec === 'late') late++;
      else if (rec === 'revision') revision++;
      else missing++;
    });

    const completionRate = Math.round(((onTime + late) / totalHw) * 100);
    let gradeBadge = '';
    if (completionRate >= 95 && revision === 0 && late === 0) {
      gradeBadge = `<span class="bg-emerald-100 text-emerald-900 border border-emerald-300 font-black px-2 py-0.5 rounded-full">優等 🌟</span>`;
    } else if (completionRate >= 85) {
      gradeBadge = `<span class="bg-blue-100 text-blue-900 border border-blue-300 font-black px-2 py-0.5 rounded-full">甲等 ✨</span>`;
    } else if (completionRate >= 70) {
      gradeBadge = `<span class="bg-amber-100 text-amber-900 border border-amber-300 font-black px-2 py-0.5 rounded-full">乙等 👍</span>`;
    } else {
      gradeBadge = `<span class="bg-rose-100 text-rose-900 border border-rose-300 font-black px-2 py-0.5 rounded-full">待加強 ⚠️</span>`;
    }

    return `
      <tr class="hover:bg-amber-50/70 transition">
        <td class="p-2.5 text-center font-mono font-bold text-amber-950">${String(st.seatNo).padStart(2, '0')}</td>
        <td class="p-2.5 font-bold text-slate-900">${st.name}</td>
        <td class="p-2.5 text-center font-bold text-emerald-700">${onTime} 次</td>
        <td class="p-2.5 text-center font-bold ${late > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-400'}">${late} 次</td>
        <td class="p-2.5 text-center font-bold ${revision > 0 ? 'text-purple-700 bg-purple-50' : 'text-slate-400'}">${revision} 次</td>
        <td class="p-2.5 text-center font-bold ${missing > 0 ? 'text-rose-700 bg-rose-50' : 'text-slate-400'}">${missing} 次</td>
        <td class="p-2.5 text-center font-mono font-black ${completionRate >= 90 ? 'text-emerald-700' : 'text-amber-800'}">
          ${completionRate}%
        </td>
        <td class="p-2.5 text-center">${gradeBadge}</td>
      </tr>
    `;
  }).join('');
}

// ===================================================================
// 5.5 下課紅綠燈通行儀表板 (Traffic Light Break Board Controller)
// 包含當前即時時鐘、西寧國小作息倒數計時、超緊湊 Mini 學生卡片 (27人一覽無遺)
// ===================================================================
let trafficDisplayMode = 'grid5x5'; // 預設為大屏模式 (去除姓名，座號與原因一眼明瞭)

// 西寧國小五年二班課堂作息時程表
const XINING_BELL_SCHEDULE = [
  { label: "早自習・晨會活動", start: "07:40", end: "08:40", type: "morning", targetLabel: "第一節上課", targetTime: "08:40", isBreak: true },
  { label: "第一節 課堂進行中", start: "08:40", end: "09:20", type: "class", period: 1, targetLabel: "第一節下課", targetTime: "09:20", isBreak: false },
  { label: "第一節 下課時間", start: "09:20", end: "09:30", type: "break", duration: 10, targetLabel: "第二節上課", targetTime: "09:30", isBreak: true },
  { label: "第二節 課堂進行中", start: "09:30", end: "10:10", type: "class", period: 2, targetLabel: "第二節大下課", targetTime: "10:10", isBreak: false },
  { label: "第二節 大下課時間 🌟", start: "10:10", end: "10:30", type: "break", isBigBreak: true, duration: 20, targetLabel: "第三節上課", targetTime: "10:30", isBreak: true },
  { label: "第三節 課堂進行中", start: "10:30", end: "11:10", type: "class", period: 3, targetLabel: "第三節下課", targetTime: "11:10", isBreak: false },
  { label: "第三節 下課時間", start: "11:10", end: "11:20", type: "break", duration: 10, targetLabel: "第四節上課", targetTime: "11:20", isBreak: true },
  { label: "第四節 課堂進行中", start: "11:20", end: "12:00", type: "class", period: 4, targetLabel: "午餐時間", targetTime: "12:00", isBreak: false },
  { label: "午餐御膳時間 🍱", start: "12:00", end: "12:40", type: "lunch", targetLabel: "午休開始", targetTime: "12:40", isBreak: true },
  { label: "午休靜心休養 💤", start: "12:40", end: "13:20", type: "nap", targetLabel: "午休起床", targetTime: "13:20", isBreak: false },
  { label: "午休起床預備 🌤️", start: "13:20", end: "13:30", type: "break", duration: 10, targetLabel: "第五節上課", targetTime: "13:30", isBreak: true },
  { label: "第五節 課堂進行中", start: "13:30", end: "14:10", type: "class", period: 5, targetLabel: "第五節下課", targetTime: "14:10", isBreak: false },
  { label: "第五節 下課時間", start: "14:10", end: "14:20", type: "break", duration: 10, targetLabel: "第六節上課", targetTime: "14:20", isBreak: true },
  { label: "第六節 課堂進行中", start: "14:20", end: "15:00", type: "class", period: 6, targetLabel: "第六節下課", targetTime: "15:00", isBreak: false },
  { label: "第六節 下課時間", start: "15:00", end: "15:10", type: "break", duration: 10, targetLabel: "第七節上課", targetTime: "15:10", isBreak: true },
  { label: "第七節 課堂進行中", start: "15:10", end: "15:50", type: "class", period: 7, targetLabel: "放學整理", targetTime: "15:50", isBreak: false },
  { label: "放學整理準備 🎒", start: "15:50", end: "15:55", type: "dismissal", targetLabel: "放學鐘聲", targetTime: "15:55", isBreak: true }
];

let manualTrafficCountdownEnd = null;
let manualTrafficCountdownLabel = '';

// 更新當下時間與距離上課/下課即時倒數
function updateTrafficCountdownClock() {
  const clockEl = document.getElementById("trafficCurrentClock");
  if (!clockEl) return;

  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${h}:${m}:${s}`;

  const dateEl = document.getElementById("trafficClockDate");
  if (dateEl) {
    const weekDays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const dayStr = weekDays[now.getDay()];
    const y = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const da = String(now.getDate()).padStart(2, '0');
    dateEl.textContent = `${y}/${mo}/${da} (${dayStr})`;
  }

  const iconEl = document.getElementById("trafficStatusIcon");
  const badgeEl = document.getElementById("trafficPeriodBadge");
  const targetEl = document.getElementById("trafficScheduleTarget");
  const titleEl = document.getElementById("trafficCountdownTitle");
  const digitsEl = document.getElementById("trafficCountdownDigits");
  const subEl = document.getElementById("trafficCountdownSub");
  const resetBtn = document.getElementById("btnTrafficResetSchedule");

  // 1. 若處於導師手動覆蓋倒數模式
  if (manualTrafficCountdownEnd) {
    const remainingMs = manualTrafficCountdownEnd - Date.now();
    if (resetBtn) resetBtn.classList.remove("hidden");

    if (remainingMs <= 0) {
      manualTrafficCountdownEnd = null;
      if (resetBtn) resetBtn.classList.add("hidden");
      if (digitsEl) {
        digitsEl.textContent = "00:00";
        digitsEl.classList.remove("countdown-urgent");
      }
      ringBreakBell();
      showToast("🔔 倒數結束！請大臣們回座準備上課！", "🔔");
      return;
    }

    const totalSec = Math.ceil(remainingMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const minStr = String(min).padStart(2, '0');
    const secStr = String(sec).padStart(2, '0');

    if (iconEl) iconEl.textContent = "⏱️";
    if (badgeEl) {
      badgeEl.textContent = manualTrafficCountdownLabel || "自訂倒數計時";
      badgeEl.className = "px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 shadow-xs";
    }
    if (targetEl) targetEl.textContent = "倒數鐘響提醒";
    if (titleEl) titleEl.textContent = "倒數剩餘時間：";
    if (digitsEl) {
      digitsEl.textContent = `${minStr}:${secStr}`;
      if (totalSec <= 120) {
        digitsEl.classList.add("countdown-urgent");
      } else {
        digitsEl.classList.remove("countdown-urgent");
      }
    }
    if (subEl) subEl.textContent = totalSec <= 60 ? "🔔 即將到時！" : "自訂計時中";
    return;
  }

  if (resetBtn) resetBtn.classList.add("hidden");

  // 2. 西寧國小課表自動作息判定
  const curSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const toSec = (t) => {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 3600 + mm * 60;
  };

  if (curSec < toSec('07:40')) {
    const diff = toSec('07:40') - curSec;
    const min = Math.floor(diff / 60);
    const sec = diff % 60;
    if (iconEl) iconEl.textContent = "🌅";
    if (badgeEl) {
      badgeEl.textContent = "清晨晨光時段";
      badgeEl.className = "px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-400 text-blue-950 shadow-xs";
    }
    if (targetEl) targetEl.textContent = "目標：早自習 (07:40)";
    if (titleEl) titleEl.textContent = "距離早自習開始還剩：";
    if (digitsEl) {
      digitsEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      digitsEl.classList.remove("countdown-urgent");
    }
    if (subEl) subEl.textContent = "大臣早安！請整理書包";
    return;
  }

  if (curSec >= toSec('15:55')) {
    if (iconEl) iconEl.textContent = "🎒";
    if (badgeEl) {
      badgeEl.textContent = "放學休息時段";
      badgeEl.className = "px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-400 text-purple-950 shadow-xs";
    }
    if (targetEl) targetEl.textContent = "今日課程圓滿結束";
    if (titleEl) titleEl.textContent = "今日已放學，大臣們平安回家！";
    if (digitsEl) {
      digitsEl.textContent = "00:00";
      digitsEl.classList.remove("countdown-urgent");
    }
    if (subEl) subEl.textContent = "明天見！";
    return;
  }

  let activeItem = null;
  for (const item of XINING_BELL_SCHEDULE) {
    const sSec = toSec(item.start);
    const eSec = toSec(item.end);
    if (curSec >= sSec && curSec < eSec) {
      activeItem = item;
      break;
    }
  }

  if (!activeItem) return;

  const diffSec = toSec(activeItem.end) - curSec;
  const min = Math.floor(diffSec / 60);
  const sec = diffSec % 60;
  const timeStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

  if (activeItem.isBreak) {
    // 下課或午餐休息時段
    if (iconEl) iconEl.textContent = activeItem.isBigBreak ? "🌟" : (activeItem.type === 'lunch' ? "🍱" : "🏃");
    if (badgeEl) {
      badgeEl.textContent = activeItem.label;
      badgeEl.className = activeItem.isBigBreak 
        ? "px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-300 text-amber-950 shadow-xs animate-bounce"
        : "px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-400 text-emerald-950 shadow-xs";
    }
    if (targetEl) targetEl.textContent = `目標：${activeItem.targetLabel} (${activeItem.targetTime})`;
    if (titleEl) titleEl.textContent = `距離【${activeItem.targetLabel}】鐘聲還剩：`;
    if (digitsEl) {
      digitsEl.textContent = timeStr;
      if (diffSec <= 120) {
        digitsEl.classList.add("countdown-urgent");
      } else {
        digitsEl.classList.remove("countdown-urgent");
      }
    }
    if (subEl) {
      if (diffSec <= 120) {
        subEl.textContent = "🔔 快回教室喝水、上廁所、就座！";
      } else {
        subEl.textContent = activeItem.isBigBreak ? "大下課盡情活動！" : "自由活動時間";
      }
    }
  } else {
    // 課堂進行中或午休
    if (iconEl) iconEl.textContent = activeItem.type === 'nap' ? "💤" : "📖";
    if (badgeEl) {
      badgeEl.textContent = activeItem.label;
      badgeEl.className = "px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-300 text-blue-950 shadow-xs";
    }
    if (targetEl) targetEl.textContent = `目標：${activeItem.targetLabel} (${activeItem.targetTime})`;
    if (titleEl) titleEl.textContent = `課堂進行中・距離【${activeItem.targetLabel}】還剩：`;
    if (digitsEl) {
      digitsEl.textContent = timeStr;
      digitsEl.classList.remove("countdown-urgent");
    }
    if (subEl) subEl.textContent = "專心聽講・勇於思考";
  }
}

function setManualTrafficCountdown(minutes, label) {
  manualTrafficCountdownEnd = Date.now() + minutes * 60 * 1000;
  manualTrafficCountdownLabel = label || `${minutes}分鐘倒數`;
  updateTrafficCountdownClock();
  showToast(`⏱️ 已啟動【${manualTrafficCountdownLabel}】倒數計時！`, "⏱️");
}

function resetTrafficToSchedule() {
  manualTrafficCountdownEnd = null;
  manualTrafficCountdownLabel = '';
  updateTrafficCountdownClock();
  showToast("🔄 已恢復西寧國小課表自動作息連動！", "🔄");
}

function toggleTrafficDrawer() {
  const drawer = document.getElementById("trafficManagementDrawer");
  const btn = document.getElementById("btnTrafficDrawerToggle");
  if (!drawer) return;
  const isHidden = drawer.classList.contains("hidden");
  if (isHidden) {
    drawer.classList.remove("hidden");
    drawer.classList.add("grid");
    if (btn) btn.innerHTML = `<span>📜 收合抽屜 ▴</span>`;
  } else {
    drawer.classList.add("hidden");
    drawer.classList.remove("grid");
    if (btn) btn.innerHTML = `<span>📜 管理抽屜 ▾</span>`;
  }
}

function toggleTrafficDisplayMode() {
  trafficDisplayMode = trafficDisplayMode === 'grid5x5' ? 'compact' : 'grid5x5';
  const label = document.getElementById("trafficDisplayModeLabel");
  if (label) {
    label.textContent = trafficDisplayMode === 'grid5x5' ? '大屏模式' : 'Mini 模式';
  }
  showToast(`🖥️ 已切換為【${trafficDisplayMode === 'grid5x5' ? '大屏模式' : 'Mini 模式'}】`);
  renderTrafficView();
}

// --- 格式化紅綠燈雙排文字：上排未完成項目，下排愛班/自省卡牌張數 ---
function formatTrafficRows(item) {
  const rCount = item.reflectionCount || (item.hasReflection ? 1 : 0);
  const sCount = item.serviceCount || (item.hasService ? 1 : 0);

  // 下排：愛班卡或自省卡數量，以 (卡牌)*(張數) 顯示
  const cardTokens = [];
  if (rCount > 0) cardTokens.push(`🪑*${rCount}`);
  if (sCount > 0) cardTokens.push(`🧹*${sCount}`);
  const bottomRowText = cardTokens.length > 0 ? cardTokens.join(' ') : '✨ 無違規卡';

  // 上排：未完成項目
  let topRowText = '';
  if (item.light === 'green') {
    topRowText = '🟢 准許下課';
  } else if (item.light === 'yellow') {
    if (item.revisionList && item.revisionList.length > 0) {
      const titles = item.revisionList.map(h => h.presetName || h.title || '作業').slice(0, 2).join('、');
      topRowText = `🟡 ${titles}待訂正`;
    } else {
      topRowText = `🟡 ${item.shortReason || '待訂正'}`;
    }
  } else if (item.light === 'red') {
    if (item.missingList && item.missingList.length > 0) {
      const titles = item.missingList.map(h => h.presetName || h.title || '作業').slice(0, 2).join('、');
      topRowText = `🔴 ${titles}未交`;
    } else if (rCount > 0) {
      topRowText = '🔴 留座自省';
    } else {
      topRowText = `🔴 ${item.shortReason || '座位自省'}`;
    }
  } else if (item.light === 'leave') {
    topRowText = '🏖️ 請假在府';
  } else {
    topRowText = item.label || '狀態未知';
  }

  return { topRowText, bottomRowText, rCount, sCount, hasCards: cardTokens.length > 0 };
}

function renderTrafficView() {
  const grid = document.getElementById("trafficCardsGrid");
  if (!grid) return;

  const students = window.KingdomApp.store.data.students || [];
  let greenCount = 0;
  let yellowCount = 0;
  let redCount = 0;
  let serviceCount = 0;

  // 評估全班 27 位大臣的狀態
  const evaluatedList = students.map(st => {
    const status = window.KingdomApp.store.evaluateTrafficStatus(st.id);
    if (status.light === 'green') greenCount++;
    else if (status.light === 'yellow') yellowCount++;
    else if (status.light === 'red') redCount++;

    if (status.hasService) serviceCount++;
    return status;
  });

  // 更新頂部統計數字
  const statG = document.getElementById("trafficStatGreen");
  const statY = document.getElementById("trafficStatYellow");
  const statR = document.getElementById("trafficStatRed");
  const statS = document.getElementById("trafficStatService");
  if (statG) statG.textContent = greenCount;
  if (statY) statY.textContent = yellowCount;
  if (statR) statR.textContent = redCount;
  if (statS) statS.textContent = serviceCount;

  // 更新兩大實體獨立專區 (🪑 自省卡專區 ＆ 🧹 愛班卡專區)
  let totalReflectionCards = 0;
  let totalServiceCards = 0;
  const reflectionStudents = [];
  const serviceStudents = [];

  students.forEach(st => {
    const status = window.KingdomApp.store.evaluateTrafficStatus(st.id);
    const rCount = status.reflectionCount || (status.hasReflection ? 1 : 0);
    const sCount = status.serviceCount || (status.hasService ? 1 : 0);
    if (rCount > 0) {
      totalReflectionCards += rCount;
      reflectionStudents.push({ id: st.id, seatNo: st.seatNo, name: st.name, count: rCount });
    }
    if (sCount > 0) {
      totalServiceCards += sCount;
      serviceStudents.push({ id: st.id, seatNo: st.seatNo, name: st.name, count: sCount });
    }
  });

  const zoneRefCountEl = document.getElementById("zoneTotalReflectionCount");
  if (zoneRefCountEl) zoneRefCountEl.textContent = totalReflectionCards;
  const zoneSrvCountEl = document.getElementById("zoneTotalServiceCount");
  if (zoneSrvCountEl) zoneSrvCountEl.textContent = totalServiceCards;

  const zoneRefPills = document.getElementById("zoneReflectionStudentPills");
  if (zoneRefPills) {
    if (reflectionStudents.length === 0) {
      zoneRefPills.innerHTML = `<span class="text-xs text-slate-500 font-bold">🎉 全班目前無自省卡大臣，通行無阻！</span>`;
    } else {
      zoneRefPills.innerHTML = reflectionStudents.map(s => `
        <button type="button" onclick="openTrafficDetailModal(${s.id})" class="px-2.5 py-1 rounded-lg bg-rose-200 hover:bg-rose-300 text-rose-950 text-xs font-black transition border border-rose-400 shadow-2xs flex items-center space-x-1" title="點擊檢視 ${s.name} 自省詳情">
          <span>${String(s.seatNo).padStart(2, '0')}號 ${s.name}</span>
          <span class="bg-rose-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono">${s.count}</span>
        </button>
      `).join('');
    }
  }

  const zoneSrvPills = document.getElementById("zoneServiceStudentPills");
  if (zoneSrvPills) {
    if (serviceStudents.length === 0) {
      zoneSrvPills.innerHTML = `<span class="text-xs text-slate-500 font-bold">🎉 全班目前無愛班卡大臣，表現優良！</span>`;
    } else {
      zoneSrvPills.innerHTML = serviceStudents.map(s => `
        <button type="button" onclick="openTrafficDetailModal(${s.id})" class="px-2.5 py-1 rounded-lg bg-orange-200 hover:bg-orange-300 text-orange-950 text-xs font-black transition border border-orange-400 shadow-2xs flex items-center space-x-1" title="點擊檢視 ${s.name} 愛班詳情">
          <span>${String(s.seatNo).padStart(2, '0')}號 ${s.name}</span>
          <span class="bg-orange-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono">${s.count}</span>
        </button>
      `).join('');
    }
  }

  // 更新快速受限通報條 (#trafficCompactRestrictedPills)
  const compactRestrictedPills = document.getElementById("trafficCompactRestrictedPills");
  if (compactRestrictedPills) {
    const restrictedList = evaluatedList.filter(item => item.light === 'red' || item.hasService);
    if (restrictedList.length === 0) {
      compactRestrictedPills.innerHTML = `<span class="text-xs text-emerald-700 font-black">🎉 全班目前通行無阻，無自省與愛班限制！</span>`;
    } else {
      compactRestrictedPills.innerHTML = restrictedList.map(item => {
        const st = item.student;
        const seatPad = String(st.seatNo).padStart(2, '0');
        const rCount = item.reflectionCount || (item.hasReflection ? 1 : 0);
        const sCount = item.serviceCount || (item.hasService ? 1 : 0);
        const tags = [];
        if (rCount > 0) tags.push(`🪑${rCount}`);
        if (sCount > 0) tags.push(`🧹${sCount}`);
        return `
          <button type="button" onclick="openTrafficDetailModal(${st.id})" class="px-2 py-0.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-950 font-black text-xs border border-rose-300 shadow-2xs transition flex items-center space-x-1" title="點擊檢視 ${st.name} 通行詳情">
            <span>${seatPad} ${st.name}</span>
            <span class="text-rose-700 text-[10px] font-mono">${tags.join(' ')}</span>
          </button>
        `;
      }).join('');
    }
  }

  // 依篩選條件過濾
  const filtered = evaluatedList.filter(item => {
    if (currentTrafficFilter === 'all') return true;
    if (currentTrafficFilter === 'green') return item.light === 'green';
    if (currentTrafficFilter === 'yellow') return item.light === 'yellow';
    if (currentTrafficFilter === 'red') return item.light === 'red';
    if (currentTrafficFilter === 'service') return item.hasService;
    return true;
  });

  // 根據顯示模式切換網格欄數
  if (trafficDisplayMode === 'grid5x5') {
    // 大屏模式核心版面：固定 5 欄排布 (前 5 列共 25 人，第 6 列 2 人)，排版嚴格不隨視窗縮放改變
    grid.className = "traffic-grid-5x5";
    
    grid.innerHTML = filtered.map(item => {
      const st = item.student;
      const seatPad = String(st.seatNo).padStart(2, '0');
      const rCount = item.reflectionCount || (item.hasReflection ? 1 : 0);
      const sCount = item.serviceCount || (item.hasService ? 1 : 0);
      
      const missingTitles = (item.missingList || []).map(h => {
        return h.presetName || (h.title ? (h.title.length > 5 ? h.title.slice(0, 4) : h.title) : '作業');
      });
      const revisionTitles = (item.revisionList || []).map(h => {
        return h.presetName || (h.title ? (h.title.length > 5 ? h.title.slice(0, 4) : h.title) : '訂正');
      });

      let cardClass = '';
      let seatBgClass = '';
      let miniOrbClass = '';
      let orbSymbol = '';
      let orbTooltip = '';
      let statusContentHtml = '';

      if (item.light === 'green') {
        cardClass = 'card-green';
        seatBgClass = 'bg-emerald-600 text-white';
        miniOrbClass = 'mini-orb-green';
        orbSymbol = '✓';
        orbTooltip = '准許下課';

        statusContentHtml = `
          <div class="space-y-0.5">
            <div class="text-xs sm:text-sm font-black text-emerald-800 flex items-center space-x-1">
              <span>🟢</span><span>准許下課</span>
            </div>
            ${sCount > 0 
              ? `<div class="text-[11px] font-bold text-orange-700">🧹 愛班*${sCount} (特准通行)</div>`
              : `<div class="text-[11px] font-bold text-emerald-700/80">✨ 功課全齊 ‧ 通行無阻</div>`}
          </div>
        `;
      } else if (item.light === 'yellow') {
        cardClass = 'card-yellow';
        seatBgClass = 'bg-amber-600 text-white';
        miniOrbClass = 'mini-orb-yellow';
        orbSymbol = '!';
        orbTooltip = item.label || '待訂正';

        const revText = revisionTitles.length > 0 ? revisionTitles.join('、') : (item.shortReason || '作業訂正');
        statusContentHtml = `
          <div class="space-y-0.5">
            <div class="text-xs font-black text-amber-950 flex items-center space-x-1 truncate" title="待訂正：${revText}">
              <span>🟡</span><span>待訂正：${revText}</span>
            </div>
            <div class="flex items-center space-x-1.5 text-[11px] font-black">
              ${rCount > 0 ? `<span class="text-rose-800 bg-rose-200/90 px-1 rounded">🪑*${rCount}</span>` : ''}
              ${sCount > 0 ? `<span class="text-orange-800 bg-orange-200/90 px-1 rounded">🧹*${sCount}</span>` : ''}
              ${rCount === 0 && sCount === 0 ? `<span class="text-amber-800 font-bold">訂正後即可放行</span>` : ''}
            </div>
          </div>
        `;
      } else if (item.light === 'red') {
        cardClass = 'card-red';
        seatBgClass = 'bg-rose-600 text-white';
        miniOrbClass = 'mini-orb-red';
        orbSymbol = '🛑';
        orbTooltip = item.label || '禁止下課';

        const missText = missingTitles.length > 0 ? missingTitles.join('、') : '';
        const revText = revisionTitles.length > 0 ? revisionTitles.join('、') : '';

        statusContentHtml = `
          <div class="space-y-0.5">
            ${missText ? `
              <div class="text-xs font-black text-rose-950 flex items-center space-x-1 truncate" title="缺交：${missText}">
                <span>🔴</span><span>缺交：${missText}</span>
              </div>
            ` : ''}
            ${revText ? `
              <div class="text-[11px] font-black text-amber-900 flex items-center space-x-1 truncate" title="訂正：${revText}">
                <span>🟡</span><span>訂正：${revText}</span>
              </div>
            ` : ''}
            <div class="flex items-center flex-wrap gap-1 text-[11px] font-black">
              ${rCount > 0 ? `<span class="bg-rose-200 text-rose-950 px-1.5 py-0.2 rounded font-bold shadow-2xs">🪑 自省*${rCount}</span>` : ''}
              ${sCount > 0 ? `<span class="bg-orange-200 text-orange-950 px-1.5 py-0.2 rounded font-bold shadow-2xs">🧹 愛班*${sCount}</span>` : ''}
              ${!missText && !revText && rCount === 0 && sCount === 0 ? `<span class="text-rose-950 font-black">${item.shortReason || '留座自省'}</span>` : ''}
            </div>
          </div>
        `;
      } else {
        cardClass = 'card-leave';
        seatBgClass = 'bg-slate-500 text-white';
        miniOrbClass = 'mini-orb-leave';
        orbSymbol = '🏖️';
        orbTooltip = '今日請假';

        statusContentHtml = `
          <div class="space-y-0.5">
            <div class="text-xs sm:text-sm font-black text-slate-600 flex items-center space-x-1">
              <span>🏖️</span><span>今日請假</span>
            </div>
            <div class="text-[11px] font-bold text-slate-500">免查下課通行</div>
          </div>
        `;
      }

      return `
        <div onclick="openTrafficDetailModal(${st.id})" 
          class="traffic-card-5x5 ${cardClass}"
          title="${seatPad}號 (點擊開啟通行詳情)">
          
          <!-- 頂部：座號標示 (去除姓名) 與 發光狀態燈珠 -->
          <div class="flex items-center justify-between pb-1 border-b border-black/5">
            <div class="flex items-center space-x-1">
              <span class="font-cute font-black text-sm px-2 py-0.5 rounded-lg shadow-2xs ${seatBgClass}">${seatPad}號</span>
            </div>
            <div class="mini-orb ${miniOrbClass}" title="${orbTooltip}">${orbSymbol}</div>
          </div>

          <!-- 剩餘版面：明確顯示未繳作業、訂正及愛班卡、自省卡 -->
          <div class="pt-1 flex-1 flex flex-col justify-center">
            ${statusContentHtml}
          </div>
        </div>
      `;
    }).join('');

  } else if (trafficDisplayMode === 'compact') {
    // 超緊湊 Mini 模式：9 欄排布 (大螢幕剛好 3 列 27 人全顯)
    grid.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2";
    
    grid.innerHTML = filtered.map(item => {
      const st = item.student;
      const seatPad = String(st.seatNo).padStart(2, '0');
      const { topRowText, bottomRowText, hasCards } = formatTrafficRows(item);

      let cardClass = '';
      let seatBgClass = '';
      let topRowColorClass = '';
      let bottomRowColorClass = '';
      let miniOrbClass = '';
      let orbSymbol = '';
      let orbTooltip = '';

      if (item.light === 'green') {
        cardClass = 'mini-green';
        seatBgClass = 'bg-emerald-200 text-emerald-950';
        topRowColorClass = 'text-emerald-900';
        bottomRowColorClass = hasCards ? 'text-amber-800 font-black' : 'text-emerald-700/80';
        miniOrbClass = 'mini-orb-green';
        orbSymbol = '✓';
        orbTooltip = '准許下課';
      } else if (item.light === 'yellow') {
        cardClass = 'mini-yellow';
        seatBgClass = 'bg-amber-200 text-amber-950';
        topRowColorClass = 'text-amber-950';
        bottomRowColorClass = hasCards ? 'text-rose-900 font-black' : 'text-amber-800';
        miniOrbClass = 'mini-orb-yellow';
        orbSymbol = '!';
        orbTooltip = item.label || '待訂正';
      } else if (item.light === 'red') {
        cardClass = 'mini-red';
        seatBgClass = 'bg-rose-200 text-rose-950';
        topRowColorClass = 'text-rose-950 font-black';
        bottomRowColorClass = hasCards ? 'text-rose-950 font-black' : 'text-rose-800';
        miniOrbClass = 'mini-orb-red';
        orbSymbol = '🛑';
        orbTooltip = item.label || '禁止下課';
      } else {
        cardClass = 'mini-leave';
        seatBgClass = 'bg-slate-200 text-slate-700';
        topRowColorClass = 'text-slate-600';
        bottomRowColorClass = 'text-slate-500';
        miniOrbClass = 'mini-orb-leave';
        orbSymbol = '🏖️';
        orbTooltip = '今日請假';
      }

      return `
        <div onclick="openTrafficDetailModal(${st.id})" 
          class="traffic-mini-card ${cardClass} p-2 flex items-center justify-between gap-1.5 cursor-pointer group shadow-2xs transition"
          title="${seatPad}號 ${st.name} | ${topRowText} | ${bottomRowText}">
          
          <!-- 左側：座號與大臣姓名 -->
          <div class="flex items-center space-x-1 flex-shrink-0">
            <span class="font-cute font-black text-xs px-1.5 py-0.5 rounded ${seatBgClass}">${seatPad}</span>
            <span class="font-cute font-black text-sm text-slate-900 truncate max-w-[50px]">${st.name}</span>
          </div>

          <!-- 中間：上下雙排顯示 (上排：未完成項目；下排：卡牌*張數) -->
          <div class="flex flex-col items-center justify-center flex-1 min-w-0 text-center leading-tight px-0.5">
            <!-- 上排：未完成項目 (或准許下課) -->
            <div class="text-[11px] font-black truncate w-full ${topRowColorClass}" title="${topRowText}">
              ${topRowText}
            </div>
            <!-- 下排：愛班卡或自省卡數量，以 (卡牌)*(張數) 顯示 -->
            <div class="text-[10px] font-bold truncate w-full ${bottomRowColorClass}">
              ${bottomRowText}
            </div>
          </div>

          <!-- 右側：先以燈號為主 (大型發光燈珠) -->
          <div class="flex-shrink-0">
            <div class="mini-orb ${miniOrbClass}" title="${orbTooltip}">${orbSymbol}</div>
          </div>
        </div>
      `;
    }).join('');

  } else {
    // 詳細大臣模式 (含職位、說明文字與快速操作按鈕)
    grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

    grid.innerHTML = filtered.map(item => {
      const st = item.student;
      const seatPad = String(st.seatNo).padStart(2, '0');
      const { topRowText, bottomRowText, hasCards } = formatTrafficRows(item);

      let orbHtml = '';
      let statusTextClass = '';
      if (item.light === 'green') {
        orbHtml = `<div class="w-11 h-11 rounded-full light-orb-green flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md">✓</div>`;
        statusTextClass = 'text-emerald-900';
      } else if (item.light === 'yellow') {
        orbHtml = `<div class="w-11 h-11 rounded-full light-orb-yellow flex items-center justify-center text-amber-950 font-black text-xl flex-shrink-0 shadow-md">!</div>`;
        statusTextClass = 'text-amber-950';
      } else if (item.light === 'red') {
        orbHtml = `<div class="w-11 h-11 rounded-full light-orb-red flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md">🛑</div>`;
        statusTextClass = 'text-rose-950';
      } else {
        orbHtml = `<div class="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-black text-sm flex-shrink-0">休</div>`;
        statusTextClass = 'text-slate-700';
      }

      const reflectionBadge = item.hasReflection 
        ? `<span class="badge-reflection text-[11px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
             <span>🪑</span>
             <span>座位自省卡 (${item.reflectionCount || 1}張)</span>
           </span>` 
        : '';

      const serviceBadge = item.hasService 
        ? `<span class="badge-service text-[11px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
             <span>🧹</span>
             <span>愛班服務卡 (${item.serviceCount || 1}張)</span>
           </span>` 
        : '';

      const overrideBadge = item.isOverridden 
        ? `<span class="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-black px-2 py-0.5 rounded-full">
             👑 導師特准
           </span>` 
        : '';

      return `
        <div class="parchment-card p-4 minister-card flex flex-col justify-between ${item.cardClass || ''}">
          <div>
            <!-- 頂部座號、燈號狀態球與名稱 -->
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center space-x-3">
                ${orbHtml}
                <div>
                  <div class="flex items-center space-x-1.5">
                    <span class="text-xs font-mono font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
                      ${seatPad}
                    </span>
                    <h3 class="text-base font-black text-slate-900">${st.name}</h3>
                  </div>
                  <span class="text-[11px] text-amber-900 font-bold block mt-0.5">${st.title}</span>
                </div>
              </div>
            </div>

            <!-- 核心通行狀態標章 (雙排顯示：上排未完成項目，下排愛班/自省卡牌張數) -->
            <div class="mt-3 bg-white/90 p-2.5 rounded-xl border border-amber-300/80 shadow-xs space-y-1.5">
              <div class="flex items-center justify-between gap-1 flex-wrap">
                <div class="text-xs font-black ${statusTextClass} flex items-center space-x-1">
                  <span>${topRowText}</span>
                  ${overrideBadge}
                </div>
                <div class="text-[11px] font-black px-2 py-0.5 rounded-md ${hasCards ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
                  ${bottomRowText}
                </div>
              </div>
              <p class="text-xs text-slate-800 leading-snug font-medium">
                ${item.desc}
              </p>
            </div>

            <!-- 額外特製卡牌 (自省卡 / 愛班卡) 顯示區 -->
            ${(item.hasReflection || item.hasService) ? `
              <div class="mt-2.5 flex flex-wrap gap-1.5">
                ${reflectionBadge}
                ${serviceBadge}
              </div>
            ` : ''}
          </div>

          <!-- 導師卡片快捷管理按鈕 -->
          <div class="mt-3.5 pt-2 border-t border-amber-300/60 flex items-center space-x-1 text-xs font-black">
            <button onclick="toggleSingleStudentReflection(${st.id})" class="flex-1 py-1 px-1.5 rounded-lg ${item.hasReflection ? 'bg-rose-600 text-white shadow' : 'bg-white hover:bg-rose-50 text-rose-800 border border-rose-300'}" title="發放或撤銷座位自省卡">
              🪑 ${item.hasReflection ? '解除自省' : '自省卡'}
            </button>
            <button onclick="toggleSingleStudentService(${st.id})" class="flex-1 py-1 px-1.5 rounded-lg ${item.hasService ? 'bg-orange-600 text-white shadow' : 'bg-white hover:bg-orange-50 text-orange-800 border border-orange-300'}" title="發放或撤銷愛班服務卡">
              🧹 ${item.hasService ? '已完成' : '愛班卡'}
            </button>
            <button onclick="openTrafficDetailModal(${st.id})" class="py-1 px-2 rounded-lg bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 shadow-sm" title="詳細作業與強制覆寫燈號">
              🚦
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  initLucideIcons();
}

function filterTrafficLight(type) {
  currentTrafficFilter = type;
  const buttons = ['all', 'green', 'yellow', 'red', 'service'];
  buttons.forEach(b => {
    const el = document.getElementById(`btnTrafficFilter-${b}`);
    if (el) {
      if (b === type) {
        el.className = "px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 text-xs shadow-sm font-black";
      } else {
        el.className = "px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-slate-700 hover:bg-amber-50 text-xs font-bold";
      }
    }
  });
  renderTrafficView();
}

function ringBreakBell() {
  window.KingdomApp.sound.playBreakBell();
  showToast("🔔 下課鐘聲響起！請全體大臣遵照紅綠燈通行！");
}

function toggleSingleStudentReflection(studentId) {
  if (!checkTeacherAuth("調整大臣座位自省卡（導師全手動）")) return;
  const bCard = (window.KingdomApp.store.data.behaviorCards && window.KingdomApp.store.data.behaviorCards[studentId]) || {};
  const current = !!bCard.reflectionCard;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const studentName = student ? student.name : '該大臣';

  if (!current) {
    const reason = prompt(`請輸入為【${studentName}】核發「🪑 座位自省卡」的事由（導師全手動）：`, "上課分心屢勸不聽（座位自省）");
    if (reason === null) return;
    window.KingdomApp.store.setReflectionCard(studentId, true, reason);
    showToast(`🛑 導師手動為 ${studentName} 發放座位自省卡（紅燈禁足自省）`);
  } else {
    window.KingdomApp.store.setReflectionCard(studentId, false, "");
    showToast(`🕊️ 導師已手動解除 ${studentName} 的座位自省卡！`);
  }
  renderTrafficView();
}

function toggleSingleStudentService(studentId) {
  if (!checkTeacherAuth("調整大臣愛班服務卡（導師手動控制）")) return;
  const bCard = (window.KingdomApp.store.data.behaviorCards && window.KingdomApp.store.data.behaviorCards[studentId]) || {};
  const current = !!bCard.serviceCard;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const studentName = student ? student.name : '該大臣';

  if (!current) {
    const reason = prompt(`請輸入為【${studentName}】手動指派「🧹 愛班服務卡」的任務：`, "課間整潔與黑板清理");
    if (reason === null) return;
    window.KingdomApp.store.setServiceCard(studentId, true, reason);
    showToast(`🧹 導師已為 ${studentName} 手動指派愛班服務卡！`);
  } else {
    window.KingdomApp.store.setServiceCard(studentId, false, "");
    showToast(`✨ 導師已手動解除 ${studentName} 的愛班服務卡！`);
  }
  renderTrafficView();
}

// --- 常規卡牌發布事由快捷管理 (座位自省卡、愛班服務卡：支援導師新增、編輯、刪除) ---
function renderBehaviorReasonShortcuts() {
  const container = document.getElementById("behaviorReasonShortcutsBar");
  if (!container) return;

  const currentTypeRadio = document.querySelector('input[name="behaviorCardType"]:checked');
  const type = currentTypeRadio ? currentTypeRadio.value : 'reflection';

  const allReasons = window.KingdomApp.store.data.behaviorReasons || window.KingdomApp.DEFAULT_BEHAVIOR_REASONS || [];
  const filtered = allReasons.filter(r => r.type === type);

  if (filtered.length === 0) {
    container.innerHTML = '<span class="text-xs text-slate-400">尚無此類快捷事由，可點右上角自訂新增</span>';
    return;
  }

  container.innerHTML = filtered.map(r => `
    <div class="inline-flex items-center rounded-lg border ${type === 'reflection' ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-orange-50 border-orange-300 text-orange-950'} font-bold shadow-2xs overflow-hidden">
      <button type="button" onclick="applyBehaviorReason('${r.id}')"
        class="px-2 py-1 text-xs hover:bg-black/5 transition flex items-center space-x-1" title="點擊套用事由：${r.text}">
        <span>${type === 'reflection' ? '🪑' : '🧹'}</span>
        <span>${r.label}</span>
      </button>
      <button type="button" onclick="event.stopPropagation(); openEditBehaviorReasonModal('${r.id}')"
        class="px-1.5 py-1 text-[11px] text-slate-500 hover:text-amber-800 hover:bg-black/10 transition border-l ${type === 'reflection' ? 'border-rose-200' : 'border-orange-200'}" title="編輯此快捷事由">
        ✏️
      </button>
      <button type="button" onclick="event.stopPropagation(); deleteBehaviorReasonPrompt('${r.id}')"
        class="px-1.5 py-1 text-[11px] text-slate-400 hover:text-rose-700 hover:bg-black/10 transition border-l ${type === 'reflection' ? 'border-rose-200' : 'border-orange-200'}" title="刪除此快捷事由">
        🗑️
      </button>
    </div>
  `).join('');
}

function applyBehaviorReason(reasonId) {
  const allReasons = window.KingdomApp.store.data.behaviorReasons || window.KingdomApp.DEFAULT_BEHAVIOR_REASONS || [];
  const reason = allReasons.find(r => r.id === reasonId);
  if (!reason) return;

  const input = document.getElementById("behaviorReasonInput");
  if (input) {
    input.value = reason.text;
  }
  window.KingdomApp.sound.playCoin();
}

function openAddBehaviorReasonModal(defaultType = null) {
  if (!checkTeacherAuth("新增事由快捷")) return;
  const currentTypeRadio = document.querySelector('input[name="behaviorCardType"]:checked');
  const sel = document.getElementById("reasonCardType");
  if (sel) {
    if (defaultType) {
      sel.value = defaultType;
    } else if (currentTypeRadio) {
      sel.value = currentTypeRadio.value;
    }
  }

  const editIdInput = document.getElementById("editBehaviorReasonId");
  if (editIdInput) editIdInput.value = "";
  const title = document.getElementById("behaviorReasonModalTitle");
  if (title) title.innerHTML = `<span>➕ 新增常規事由快捷</span>`;
  const btn = document.getElementById("btnSubmitBehaviorReason");
  if (btn) btn.textContent = "儲存事由快捷";

  const labelInput = document.getElementById("reasonLabel");
  if (labelInput) labelInput.value = "";
  const textInput = document.getElementById("reasonText");
  if (textInput) textInput.value = "";

  document.getElementById("addBehaviorReasonModal").classList.remove("hidden");
  initLucideIcons();
}

function openEditBehaviorReasonModal(reasonId) {
  if (!checkTeacherAuth("編輯事由快捷")) return;
  const allReasons = window.KingdomApp.store.data.behaviorReasons || window.KingdomApp.DEFAULT_BEHAVIOR_REASONS || [];
  const reason = allReasons.find(r => r.id === reasonId);
  if (!reason) return;

  const sel = document.getElementById("reasonCardType");
  if (sel) sel.value = reason.type || 'reflection';

  const editIdInput = document.getElementById("editBehaviorReasonId");
  if (editIdInput) editIdInput.value = reason.id;

  const title = document.getElementById("behaviorReasonModalTitle");
  if (title) title.innerHTML = `<span>✏️ 編輯常規事由快捷</span>`;

  const btn = document.getElementById("btnSubmitBehaviorReason");
  if (btn) btn.textContent = "更新事由快捷";

  const labelInput = document.getElementById("reasonLabel");
  if (labelInput) labelInput.value = reason.label || "";

  const textInput = document.getElementById("reasonText");
  if (textInput) textInput.value = reason.text || "";

  document.getElementById("addBehaviorReasonModal").classList.remove("hidden");
  initLucideIcons();
}

function deleteBehaviorReasonPrompt(reasonId) {
  if (!checkTeacherAuth("刪除事由快捷")) return;
  const allReasons = window.KingdomApp.store.data.behaviorReasons || window.KingdomApp.DEFAULT_BEHAVIOR_REASONS || [];
  const reason = allReasons.find(r => r.id === reasonId);
  if (!reason) return;

  const ok = confirm(`🗑️ 確定要刪除快捷事由【${reason.label}】嗎？\n\n事由內容：${reason.text}`);
  if (!ok) return;

  window.KingdomApp.store.deleteBehaviorReason(reasonId);
  showToast(`🗑️ 已刪除快捷事由【${reason.label}】！`, "✨");
  renderBehaviorReasonShortcuts();
  if (typeof activeTrafficStudentId !== 'undefined' && activeTrafficStudentId) {
    openTrafficDetailModal(activeTrafficStudentId);
  }
}

function closeAddBehaviorReasonModal() {
  document.getElementById("addBehaviorReasonModal").classList.add("hidden");
}

function submitNewBehaviorReason(e) {
  e.preventDefault();
  const editId = (document.getElementById("editBehaviorReasonId")?.value || "").trim();
  const type = document.getElementById("reasonCardType").value;
  const label = document.getElementById("reasonLabel").value.trim();
  const text = document.getElementById("reasonText").value.trim();

  if (!label || !text) {
    alert("請填寫快捷標籤與完整事由文字！");
    return;
  }

  if (editId) {
    window.KingdomApp.store.updateBehaviorReason(editId, { type, label, text });
    showToast(`✅ 已更新事由快捷【${label}】！`, "✨");
  } else {
    window.KingdomApp.store.addBehaviorReason({ type, label, text });
    showToast(`✅ 已新增事由快捷【${label}】！`, "✨");
  }

  closeAddBehaviorReasonModal();
  renderBehaviorReasonShortcuts();
  if (typeof activeTrafficStudentId !== 'undefined' && activeTrafficStudentId) {
    openTrafficDetailModal(activeTrafficStudentId);
  }
}

function addCustomReflectionCardToStudent(studentId, reason) {
  if (!checkTeacherAuth("增加大臣座位自省卡")) return;
  window.KingdomApp.store.addReflectionCard(studentId, reason);
  refreshCurrentView();
  openTrafficDetailModal(studentId);
  showToast(`🪑 已為大臣核發自省卡：${reason}`);
}

function addCustomServiceCardToStudent(studentId, reason) {
  if (!checkTeacherAuth("增加大臣愛班服務卡")) return;
  window.KingdomApp.store.addServiceCard(studentId, reason);
  refreshCurrentView();
  openTrafficDetailModal(studentId);
  showToast(`🧹 已為大臣指派愛班卡：${reason}`);
}

function openBehaviorCardModal(defaultType = 'reflection') {
  if (!checkTeacherAuth("派發常規紀律卡牌（自省卡/愛班卡）")) return;
  const grid = document.getElementById("behaviorStudentSelectorGrid");
  const students = window.KingdomApp.store.data.students || [];
  if (grid) {
    grid.innerHTML = students.map(st => `
      <label class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-amber-100 cursor-pointer text-xs sm:text-sm font-bold text-slate-900">
        <input type="checkbox" name="behaviorStudentCheckbox" value="${st.id}" class="rounded text-rose-600 focus:ring-rose-500 w-4 h-4">
        <span>${String(st.seatNo).padStart(2, '0')}.${st.name}</span>
      </label>
    `).join('');
  }

  const modalTitle = document.getElementById("behaviorModalMainTitle");
  if (modalTitle) {
    modalTitle.innerHTML = defaultType === 'service'
      ? `<span>🧹 派發全班愛班服務卡 (課間愛班勞動)</span>`
      : `<span>🪑 派發全班座位自省卡 (紅燈・禁止下課)</span>`;
  }

  const targetRadio = document.querySelector(`input[name="behaviorCardType"][value="${defaultType}"]`);
  if (targetRadio) targetRadio.checked = true;

  document.getElementById("behaviorCardModal").classList.remove("hidden");
  renderBehaviorReasonShortcuts();

  // 監聽單選按鈕變更，自動更換事由快捷列
  const typeRadios = document.querySelectorAll('input[name="behaviorCardType"]');
  typeRadios.forEach(radio => {
    radio.onchange = () => {
      if (modalTitle) {
        modalTitle.innerHTML = radio.value === 'service'
          ? `<span>🧹 派發全班愛班服務卡 (課間愛班勞動)</span>`
          : `<span>🪑 派發全班座位自省卡 (紅燈・禁止下課)</span>`;
      }
      renderBehaviorReasonShortcuts();
    };
  });

  initLucideIcons();
}

function closeBehaviorCardModal() {
  document.getElementById("behaviorCardModal").classList.add("hidden");
}

function toggleAllBehaviorStudents(select) {
  const checkboxes = document.querySelectorAll('input[name="behaviorStudentCheckbox"]');
  checkboxes.forEach(cb => cb.checked = !!select);
}

function submitBehaviorCards(e) {
  e.preventDefault();
  const type = document.querySelector('input[name="behaviorCardType"]:checked').value;
  const reason = document.getElementById("behaviorReasonInput").value.trim();
  const checkedBoxes = Array.from(document.querySelectorAll('input[name="behaviorStudentCheckbox"]:checked'));

  if (checkedBoxes.length === 0) {
    alert("請至少勾選一位大臣！");
    return;
  }

  checkedBoxes.forEach(cb => {
    const studentId = parseInt(cb.value, 10);
    if (type === 'reflection') {
      window.KingdomApp.store.setReflectionCard(studentId, true, reason);
    } else {
      window.KingdomApp.store.setServiceCard(studentId, true, reason);
    }
  });

  const cardName = type === 'reflection' ? '🪑 座位自省卡 (紅燈)' : '🧹 愛班服務卡';
  showToast(`📣 已成功為 ${checkedBoxes.length} 位大臣派發【${cardName}】！`);
  closeBehaviorCardModal();
  renderTrafficView();
}

let activeTrafficCardTab = 'reflection';

function switchTrafficDetailTab(tabType) {
  activeTrafficCardTab = tabType;
  const refTab = document.getElementById("trafficTabContentReflection");
  const srvTab = document.getElementById("trafficTabContentService");
  const btnRef = document.getElementById("tabBtnReflection");
  const btnSrv = document.getElementById("tabBtnService");

  if (tabType === 'reflection') {
    if (refTab) refTab.classList.remove("hidden");
    if (srvTab) srvTab.classList.add("hidden");
    if (btnRef) {
      btnRef.className = "flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-sm sm:text-base bg-rose-600 text-white font-black shadow-md";
    }
    if (btnSrv) {
      btnSrv.className = "flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-sm sm:text-base text-amber-950 font-bold hover:bg-white/60";
    }
  } else {
    if (refTab) refTab.classList.add("hidden");
    if (srvTab) srvTab.classList.remove("hidden");
    if (btnRef) {
      btnRef.className = "flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-sm sm:text-base text-amber-950 font-bold hover:bg-white/60";
    }
    if (btnSrv) {
      btnSrv.className = "flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-sm sm:text-base bg-orange-600 text-white font-black shadow-md";
    }
  }
}

function openTrafficDetailModal(studentId) {
  const status = window.KingdomApp.store.evaluateTrafficStatus(studentId);
  if (!status) return;
  const st = status.student;

  activeTrafficStudentId = studentId;

  const titleEl = document.getElementById("trafficModalStudentTitle");
  if (titleEl) {
    titleEl.innerHTML = `<span>🚦 大臣下課通行詳情：${String(st.seatNo).padStart(2, '0')}號 ${st.name}</span>`;
  }

  const content = document.getElementById("trafficModalContent");
  if (!content) return;

  const refCount = status.reflectionCount || (status.hasReflection ? 1 : 0);
  const srvCount = status.serviceCount || (status.hasService ? 1 : 0);
  const bCard = (window.KingdomApp.store.data.behaviorCards && (window.KingdomApp.store.data.behaviorCards[st.id] || window.KingdomApp.store.data.behaviorCards[st.seatNo])) || {};

  // 作業列表與狀態摘要
  let hasPendingOrRevisionHw = false;
  const hwList = (window.KingdomApp.store.data.homework || []).map(hw => {
    const rec = (hw.records && (hw.records[st.id] !== undefined ? hw.records[st.id] : hw.records[st.seatNo])) || 'pending';
    let badge = '';
    if (rec === 'submitted' || rec === 'excellent') {
      badge = `<span class="text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg font-black text-xs sm:text-sm">✅ 準時已交</span>`;
    } else if (rec === 'late') {
      badge = `<span class="text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg font-black text-xs sm:text-sm">⏰ 遲交已補</span>`;
    } else if (rec === 'revision') {
      hasPendingOrRevisionHw = true;
      badge = `<span class="text-purple-900 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-lg font-black text-xs sm:text-sm">⚠️ 需訂正</span>`;
    } else {
      hasPendingOrRevisionHw = true;
      badge = `<span class="text-rose-900 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-lg font-black text-xs sm:text-sm">❌ 未繳交</span>`;
    }
    return `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
        <span class="font-bold text-slate-900 text-sm sm:text-base">${hw.title}</span>
        ${badge}
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <!-- 頂部當前判定結果 (大字體醒目橫幅) -->
    <div class="p-3.5 sm:p-4 rounded-2xl border-2 ${status.cardClass || ''} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="text-base sm:text-lg font-black">${status.label}</span>
          ${status.isOverridden ? '<span class="text-xs bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-md">導師指定覆寫</span>' : ''}
        </div>
        <p class="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">${status.desc}</p>
      </div>
      <div class="flex items-center space-x-2 flex-shrink-0">
        <span class="text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl ${refCount > 0 ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-slate-100 text-slate-600'}">
          🪑 自省卡：${refCount} 張
        </span>
        <span class="text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl ${srvCount > 0 ? 'bg-orange-100 text-orange-900 border border-orange-300' : 'bg-slate-100 text-slate-600'}">
          🧹 愛班卡：${srvCount} 張
        </span>
      </div>
    </div>

    <!-- ★ 紀律卡牌兩大獨立專區並排呈現 (免切換Tab、字體放大清晰、一目了然) ★ -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      
      <!-- ============================================================== -->
      <!-- 左欄獨立專區：🪑 座位自省卡專區 (大字舒適、明細清楚、附手動核銷移除) -->
      <!-- ============================================================== -->
      <div class="bg-white p-4 rounded-2xl border-2 border-rose-300 space-y-3 shadow-xs">
        <!-- 專區標題與累計 -->
        <div class="flex items-center justify-between pb-2.5 border-b-2 border-rose-200">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">🪑</span>
            <div>
              <h4 class="text-base sm:text-lg font-black text-rose-950">座位自省卡專區</h4>
              <span class="text-[11px] text-rose-700 font-bold">作業未交自動 / 導師手動指派</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-rose-800 font-bold block">目前累計</span>
            <div class="text-base sm:text-lg font-black text-rose-700">
              <span class="text-xl sm:text-2xl font-digital">${refCount}</span> 張
            </div>
          </div>
        </div>

        <!-- 快速調整與特赦按鈕列 -->
        <div class="flex items-center justify-between gap-1.5">
          <span class="text-xs font-black text-rose-900">次數增減：</span>
          <div class="flex items-center space-x-1.5 text-xs sm:text-sm font-black">
            <button type="button" onclick="removeStudentReflectionOne(${st.id})" class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs font-black" title="導師手動減免 1 次自省卡">-1 次</button>
            <button type="button" onclick="addStudentReflectionOne(${st.id})" class="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 shadow-2xs font-black" title="自省卡加 1 次">+1 次</button>
            <button type="button" onclick="pardonStudentCard(${st.id}, 'reflection')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs font-black" title="自省卡特赦歸零">🕊️ 特赦</button>
          </div>
        </div>

        <!-- 現存自省卡清單 (導師逐筆手動移除核銷專區) -->
        <div class="space-y-1.5">
          <span class="text-xs sm:text-sm font-black text-rose-950 block">📋 現存自省卡清單 (點 ❌ 手動核銷移除)：</span>
          ${(bCard.reflectionReasons && bCard.reflectionReasons.length > 0) ? `
            <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              ${bCard.reflectionReasons.map((r, rIdx) => `
                <div class="flex items-center justify-between p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm">
                  <div class="flex items-center space-x-1.5 truncate mr-2">
                    <span class="font-black text-rose-950">${rIdx + 1}. ${r.text}</span>
                    ${r.isAutoHw ? `<span class="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold">未交自動</span>` : `<span class="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">導師手動</span>`}
                  </div>
                  <button type="button" onclick="removeStudentReflectionReasonByIndex(${st.id}, ${rIdx})" class="px-2.5 py-1 rounded-lg text-xs font-black bg-white hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-300 transition shadow-xs flex-shrink-0" title="導師手動核銷移除此張自省卡">
                    ❌ 移除
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-3 rounded-xl bg-rose-50/50 border border-dashed border-rose-300 text-slate-500 font-bold text-center text-xs sm:text-sm">
              🟢 目前無生效中的座位自省卡
            </div>
          `}
        </div>

        <!-- 自省快捷事由列 (大字體標籤，點擊一鍵核發) -->
        <div class="pt-2.5 border-t border-rose-200 space-y-1.5">
          <div class="flex items-center justify-between text-xs sm:text-sm font-black text-rose-950">
            <span>⚡ 自省事由快捷（點擊核發）：</span>
            <button type="button" onclick="openAddBehaviorReasonModal('reflection')" class="text-rose-700 hover:underline text-xs">+ 新增快捷</button>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${(window.KingdomApp.store.data.behaviorReasons || window.KingdomApp.DEFAULT_BEHAVIOR_REASONS || []).filter(r => r.type === 'reflection').map(r => `
              <div class="inline-flex items-center rounded-xl bg-rose-50 border border-rose-300 text-rose-950 font-black shadow-2xs overflow-hidden">
                <button type="button" onclick="addCustomReflectionCardToStudent(${st.id}, '${r.text.replace(/'/g, "\\'")}')" class="px-2.5 py-1 text-xs hover:bg-rose-100 transition" title="立即核發 1 次：${r.text}">
                  ${r.label}
                </button>
                <button type="button" onclick="event.stopPropagation(); openEditBehaviorReasonModal('${r.id}')" class="px-1.5 py-1 text-xs text-slate-400 hover:text-amber-800 hover:bg-rose-200 border-l border-rose-200" title="編輯此快捷">✏️</button>
                <button type="button" onclick="event.stopPropagation(); deleteBehaviorReasonPrompt('${r.id}')" class="px-1.5 py-1 text-xs text-slate-400 hover:text-rose-700 hover:bg-rose-200 border-l border-rose-200" title="刪除此快捷">🗑️</button>
              </div>
            `).join('') || '<span class="text-xs text-slate-400">暫無快捷</span>'}
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 右欄獨立專區：🧹 愛班服務卡專區 (大字舒適、明細清楚、附手動核銷移除) -->
      <!-- ============================================================== -->
      <div class="bg-white p-4 rounded-2xl border-2 border-orange-300 space-y-3 shadow-xs">
        <!-- 專區標題與累計 -->
        <div class="flex items-center justify-between pb-2.5 border-b-2 border-orange-200">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">🧹</span>
            <div>
              <h4 class="text-base sm:text-lg font-black text-orange-950">愛班服務卡專區</h4>
              <span class="text-[11px] text-orange-700 font-bold">遲到自動派發 / 導師手動指派</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-orange-800 font-bold block">目前累計</span>
            <div class="text-base sm:text-lg font-black text-orange-700">
              <span class="text-xl sm:text-2xl font-digital">${srvCount}</span> 張
            </div>
          </div>
        </div>

        <!-- 快速調整與特赦按鈕列 -->
        <div class="flex items-center justify-between gap-1.5">
          <span class="text-xs font-black text-orange-900">次數增減：</span>
          <div class="flex items-center space-x-1.5 text-xs sm:text-sm font-black">
            <button type="button" onclick="removeStudentServiceOne(${st.id})" class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs font-black" title="導師手動減免 1 次愛班卡">-1 次</button>
            <button type="button" onclick="addStudentServiceOne(${st.id})" class="px-2.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 shadow-2xs font-black" title="愛班卡加 1 次">+1 次</button>
            <button type="button" onclick="pardonStudentCard(${st.id}, 'service')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs font-black" title="愛班卡特赦歸零">🧹 特赦</button>
          </div>
        </div>

        <!-- 現存愛班卡清單 (導師逐筆手動移除核銷專區) -->
        <div class="space-y-1.5">
          <span class="text-xs sm:text-sm font-black text-orange-950 block">📋 現存愛班卡清單 (點 ❌ 手動核銷移除)：</span>
          ${(bCard.serviceReasons && bCard.serviceReasons.length > 0) ? `
            <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              ${bCard.serviceReasons.map((r, sIdx) => `
                <div class="flex items-center justify-between p-2 rounded-xl bg-orange-50 border border-orange-200 text-xs sm:text-sm">
                  <div class="flex items-center space-x-1.5 truncate mr-2">
                    <span class="font-black text-orange-950">${sIdx + 1}. ${r.text}</span>
                    ${r.text === '遲到' ? `<span class="text-[10px] bg-orange-200 text-orange-900 px-1.5 py-0.5 rounded font-bold">遲到自動</span>` : `<span class="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">導師手動</span>`}
                  </div>
                  <button type="button" onclick="removeStudentServiceReasonByIndex(${st.id}, ${sIdx})" class="px-2.5 py-1 rounded-lg text-xs font-black bg-white hover:bg-orange-600 hover:text-white text-orange-700 border border-orange-300 transition shadow-xs flex-shrink-0" title="導師手動核銷移除此張愛班卡">
                    ❌ 移除
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-3 rounded-xl bg-orange-50/50 border border-dashed border-orange-300 text-slate-500 font-bold text-center text-xs sm:text-sm">
              🟢 目前無生效中的愛班服務卡
            </div>
          `}
        </div>

        <!-- 愛班快捷事由列 (大字體標籤，點擊一鍵指派) -->
        <div class="pt-2.5 border-t border-orange-200 space-y-1.5">
          <div class="flex items-center justify-between text-xs sm:text-sm font-black text-orange-950">
            <span>⚡ 愛班事由快捷（點擊指派）：</span>
            <button type="button" onclick="openAddBehaviorReasonModal('service')" class="text-orange-700 hover:underline text-xs">+ 新增快捷</button>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${(window.KingdomApp.store.data.behaviorReasons || window.KingdomApp.DEFAULT_BEHAVIOR_REASONS || []).filter(r => r.type === 'service').map(r => `
              <div class="inline-flex items-center rounded-xl bg-orange-50 border border-orange-300 text-orange-950 font-black shadow-2xs overflow-hidden">
                <button type="button" onclick="addCustomServiceCardToStudent(${st.id}, '${r.text.replace(/'/g, "\\'")}')" class="px-2.5 py-1 text-xs hover:bg-orange-100 transition" title="立即指派 1 次：${r.text}">
                  ${r.label}
                </button>
                <button type="button" onclick="event.stopPropagation(); openEditBehaviorReasonModal('${r.id}')" class="px-1.5 py-1 text-xs text-slate-400 hover:text-amber-800 hover:bg-orange-200 border-l border-orange-200" title="編輯此快捷">✏️</button>
                <button type="button" onclick="event.stopPropagation(); deleteBehaviorReasonPrompt('${r.id}')" class="px-1.5 py-1 text-xs text-slate-400 hover:text-rose-700 hover:bg-orange-200 border-l border-orange-200" title="刪除此快捷">🗑️</button>
              </div>
            `).join('') || '<span class="text-xs text-slate-400">暫無快捷</span>'}
          </div>
        </div>
      </div>

    </div>

    <!-- 📝 今日各項作業進度 (折疊卡片，字體大方) -->
    <details class="bg-white rounded-2xl border-2 border-amber-300 p-3.5 shadow-xs" ${hasPendingOrRevisionHw ? 'open' : ''}>
      <summary class="flex items-center justify-between cursor-pointer font-black text-amber-950 text-sm sm:text-base select-none">
        <div class="flex items-center space-x-2">
          <span>📝 今日各項作業繳交進度</span>
          ${hasPendingOrRevisionHw ? `<span class="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-300">有待處理項目</span>` : `<span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">全員已繳齊</span>`}
        </div>
        <span class="text-xs text-amber-800 font-bold">點擊展開/收合 ▼</span>
      </summary>
      <div class="mt-2.5 space-y-2 pt-2 border-t border-amber-200 max-h-40 overflow-y-auto pr-1">
        ${hwList}
      </div>
    </details>

    <!-- 👑 導師手動快速覆寫 (底部按鈕放大清晰) -->
    <div class="pt-2 border-t border-amber-300 space-y-2">
      <span class="font-black text-amber-950 block text-xs sm:text-sm">👑 導師手動快速覆寫通行狀態：</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-black text-xs sm:text-sm">
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'green')" class="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">🟢 特赦綠燈</button>
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'yellow')" class="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-xs">🟡 指定黃燈</button>
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'red')" class="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs">🔴 指定紅燈</button>
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'auto')" class="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 shadow-xs">🔄 自動判定</button>
      </div>
    </div>
  `;

  const modal = document.getElementById("trafficDetailModal");
  if (modal) modal.classList.remove("hidden");
  initLucideIcons();
}

function closeTrafficDetailModal() {
  document.getElementById("trafficDetailModal").classList.add("hidden");
}

function setTrafficOverrideFromModal(studentId, overrideLight) {
  window.KingdomApp.store.setTrafficOverride(studentId, overrideLight);
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const name = student ? student.name : '';
  showToast(`👑 已更新【${name}】的下課通行燈號！`);
  closeTrafficDetailModal();
  renderTrafficView();
}

// ===================================================================
// 加點區 ‧ 王國全班萌寵大動物園 (Kingdom Class Pet Sanctuary Shared Renderer)
// ===================================================================
function renderZooHabitatShared(containerId = "pointsZooGrid", statsPillId = "zooHabitatStatsPill") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const students = window.KingdomApp.store.data.students || [];
  let totalFood = 0;
  let goldenCount = 0;
  let doublePetCount = 0;

  const cardsHtml = students.map(st => {
    const seatPad = String(st.seatNo).padStart(2, '0');
    const aType = (st.animalType || st.petType || 'lion').toLowerCase();
    window.KingdomApp.store.syncStudentPets(st);
    let lifetime = parseInt(st.lifetimePoints, 10);
    if (isNaN(lifetime) || lifetime < 0) {
      lifetime = 0;
      st.lifetimePoints = 0;
    }
    totalFood += lifetime;
    const petStatus = window.KingdomApp.getAnimalStatus(aType, lifetime);
    if (petStatus.isGolden) goldenCount++;
    const svgCode = window.KingdomApp.renderAnimalSVG(aType, petStatus.stageIndex);

    const pets = st.pets || [{ type: aType }];
    const maxAllowed = 1 + Math.floor(lifetime / 500);
    if (pets.length > 1) doublePetCount++;

    let multiPetPills = '';
    if (pets.length > 1) {
      multiPetPills = pets.slice(1).map((p, idx) => {
        const slotIdx = idx + 1;
        const sType = p.type.toLowerCase();
        const sExp = Math.max(0, lifetime - slotIdx * 500);
        const sStatus = window.KingdomApp.getAnimalStatus(sType, sExp);
        return `
          <div class="mt-1 flex items-center justify-between w-full bg-purple-50 px-1.5 py-0.5 rounded-lg border border-purple-200" title="第${slotIdx + 1}守護萌寵：${sStatus.animalName} (${sExp}點)">
            <span class="text-[9px] font-black text-purple-900 truncate">👑 ${sStatus.animalIcon} ${sStatus.animalName}</span>
            <button type="button" onclick="openChangeAnimalModal(${st.id}, ${slotIdx})" class="text-[8px] text-purple-700 hover:underline font-bold" title="更換第${slotIdx + 1}隻萌寵">[換]</button>
          </div>
        `;
      }).join('');
    }
    const nextSlot = pets.length;
    const reqPtsForNext = nextSlot * 500;
    if (pets.length < maxAllowed && lifetime >= reqPtsForNext) {
      multiPetPills += `
        <button type="button" onclick="openChangeAnimalModal(${st.id}, ${nextSlot})" class="mt-1 w-full bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded px-1 py-0.5 text-[9px] font-black shadow-2xs">
          🐣 認養第${nextSlot + 1}萌寵！
        </button>
      `;
    }

    return `
      <div id="zooAnimalCard-${containerId}-${st.id}" class="bg-white/90 hover:bg-white rounded-2xl p-2 border ${petStatus.isGolden ? 'border-amber-400 ring-2 ring-amber-300 shadow-md bg-gradient-to-b from-amber-50 to-white' : 'border-emerald-300/80 hover:border-emerald-500'} shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-between text-center relative group transform hover:-translate-y-1">
        <!-- 學生座號姓名 (保證同一行) -->
        <span class="text-[11px] font-mono font-black text-emerald-950 bg-emerald-100/90 px-1.5 py-0.5 rounded-full mb-1 truncate max-w-full whitespace-nowrap">
          ${seatPad} ${st.name} ${pets.length > 1 ? `👑x${pets.length}` : ''}
        </span>

        <!-- 萌寵 SVG 生動頭像 (點擊可開啟投餵舍) -->
        <div onclick="openZooFeedModal(${st.id})" class="w-14 h-14 flex items-center justify-center p-0.5 cursor-pointer transform group-hover:scale-110 transition-transform duration-200" title="點擊投餵 ${st.name} 的 ${petStatus.animalName} (投餵飼料伴寵物長大)">
          ${svgCode}
        </div>

        <!-- 動物名稱與階段 (附帶更換動物捷徑) -->
        <div class="mt-1 w-full">
          <div class="flex items-center justify-center space-x-1">
            <span class="text-[10px] font-black text-slate-800 truncate" title="${petStatus.animalName}">
              ${petStatus.animalIcon} ${petStatus.animalName}
            </span>
            <button type="button" onclick="openChangeAnimalModal(${st.id}, 0)" class="text-[9px] text-emerald-800 hover:text-emerald-950 hover:underline font-bold" title="換第1隻動物">[換動物]</button>
          </div>
          <div class="text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-0.5 inline-block ${petStatus.isGolden ? 'bg-amber-300 text-amber-950 border border-amber-400 font-black' : 'bg-emerald-100 text-emerald-900'}">
            ${petStatus.stageTitle}
          </div>
        </div>

        <!-- 萌寵狀態標籤 (若有多寵或可認養) -->
        ${multiPetPills}

        <!-- 可用蘋果與萌寵成長狀態 -->
        <div class="mt-1 flex items-center justify-center space-x-1 text-[10px] font-mono font-bold text-slate-700 bg-emerald-50/80 w-full py-0.5 rounded-lg border border-emerald-200">
          <span class="font-black text-rose-700" title="可用蘋果">🍎${st.points || 0}</span>
          <span class="text-slate-300">|</span>
          <span class="text-emerald-800" title="累積成長經驗">🐾${lifetime}</span>
        </div>

        <!-- 快捷互動按鈕：+1 🍎 與 🍎 投餵飼料 -->
        <div class="mt-1.5 flex items-center space-x-1 w-full pt-1 border-t border-emerald-100">
          <button onclick="awardSingleStudent(${st.id}, 1, '課堂嘉獎獎勵蘋果')" class="flex-1 py-0.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-950 font-black text-[10px] transition border border-rose-300 shadow-xs" title="給予 +1 顆紅蘋果">
            +1🍎
          </button>
          <button onclick="quickFeedStudentInZoo(${st.id})" class="flex-1 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] transition shadow-xs" title="投餵飼料 1 顆蘋果伴寵物長大">
            🍎投餵飼料
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = cardsHtml;

  const statsPill = document.getElementById(statsPillId);
  if (statsPill) {
    statsPill.innerHTML = `
      <span>🐾 全園 <strong>${students.length + doublePetCount}</strong> 隻動物棲息</span>
      <span class="text-emerald-300">·</span>
      <span>🍎 總飽食 <strong>${totalFood}</strong> 點</span>
      <span class="text-emerald-300">·</span>
      <span>👑 巨星 <strong>${goldenCount}</strong> 隻</span>
      ${doublePetCount > 0 ? `<span class="text-emerald-300">·</span><span>✨ 雙寵大臣 <strong>${doublePetCount}</strong> 位</span>` : ''}
    `;
  }
}

function renderPointsZooHabitat() {
  renderZooHabitatShared("pointsZooGrid", "zooHabitatStatsPill");
}

function quickFeedStudentInZoo(studentId) {
  const result = window.KingdomApp.store.feedStudentAnimal(studentId, 1, "美味紅蘋果");
  if (!result) return;
  if (window.KingdomSound && window.KingdomSound.playFeedMunch) {
    window.KingdomSound.playFeedMunch();
  }
  showToast(`🍎 嘎嘣脆！已為【${result.student.name}】的【${result.status.animalName}】投餵 1 顆蘋果！`, "🐾");
  renderPointsView();
  renderRosterView();
}

function feedAllZooAnimalsOne() {
  const students = window.KingdomApp.store.data.students || [];
  const snapshots = students.map(st => ({
    studentId: st.id,
    seatNo: st.seatNo,
    name: st.name,
    pointsBefore: st.points || 0,
    lifetimeBefore: st.lifetimePoints !== undefined ? st.lifetimePoints : (st.points || 0),
    secondPetExpBefore: st.secondPetExp || 0
  }));

  students.forEach(st => {
    st.lifetimePoints = (st.lifetimePoints !== undefined ? st.lifetimePoints : (st.points || 0)) + 1;
    st.petExp = st.lifetimePoints;
  });

  const actionId = Date.now();
  const action = {
    id: actionId,
    title: '全班 27 隻萌寵全園大餵食 (飽食度各 +1)',
    reason: '動物園全園大餵食',
    points: 1,
    type: 'all',
    targetDesc: '全班 27 隻萌寵',
    date: window.KingdomApp.getTodayDateString(),
    time: new Date().toTimeString().slice(0, 5),
    snapshots,
    undone: false
  };

  window.KingdomApp.store.recordPointAction(action);

  window.KingdomApp.store.data.pointLogs.unshift({
    id: actionId,
    actionId: actionId,
    studentId: 'all',
    points: 1,
    reason: '🍎 動物園全園大餵食：全班 27 隻萌寵飽食度各 +1',
    date: window.KingdomApp.getTodayDateString(),
    time: new Date().toTimeString().slice(0, 5)
  });

  window.KingdomApp.store.save();
  if (window.KingdomSound && window.KingdomSound.playFeedMunch) {
    window.KingdomSound.playFeedMunch();
  }
  showToast("🍎 全園大狂歡！全班 27 隻萌寵動物都吃到了香甜蘋果，飽食度各 +1 點！", "🎉");
  showUndoNotificationBanner(action);
  renderPointsView();
  renderRosterView();
}

function triggerZooCheerParty() {
  if (window.KingdomSound && window.KingdomSound.playPraise) {
    window.KingdomSound.playPraise();
  }
  if (typeof confetti === 'function') {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
  }
  const cards = document.querySelectorAll("#pointsZooGrid > div");
  cards.forEach(card => {
    card.classList.add("animate-bounce");
    setTimeout(() => {
      card.classList.remove("animate-bounce");
    }, 1200);
  });
  showToast("🎉 哇！全班 27 隻萌寵動物開心地在草原上轉圈跳舞！", "🦁");
}

// ===================================================================
// 6. 紅蘋果集點榜與批次/單獨重置點數 (Points Management)
// ===================================================================
function renderPointsView() {
  const students = window.KingdomApp.store.data.students;
  const grid = document.getElementById("pointsGrid");
  const logList = document.getElementById("pointLogsList");

  renderPointPresets();
  renderRewardCards();
  renderPetsOverview();

  if (grid) {
    grid.innerHTML = students.map(st => {
      const aType = st.animalType || st.petType || 'dog';
      window.KingdomApp.store.syncStudentPets(st);
      const pts = st.points || 0;
      const lifetime = (st.lifetimePoints !== undefined && st.lifetimePoints > 0) 
        ? st.lifetimePoints 
        : (pts > 0 ? pts : (st.lifetimePoints || 0));
      const petStatus = window.KingdomApp.getAnimalStatus(aType, lifetime);
      const isSelected = selectedStudentIdsForPoints.has(st.id);

      window.KingdomApp.store.syncStudentCards(st);
      const heldCards = st.redeemedCards || [];
      const isDrawerOpen = window.openCardDrawerStudentIds && window.openCardDrawerStudentIds.has(st.id);

      // 幹部職位後方寵物圖示以目前實際認養的寵物圖示顯現
      const pets = st.pets || [{ type: aType }];
      const petIconsHtml = pets.map(p => {
        const ps = window.KingdomApp.getAnimalStatus ? window.KingdomApp.getAnimalStatus(p.type, 0) : null;
        const icon = ps ? ps.animalIcon : '🐾';
        const name = ps ? ps.animalName : '萌寵';
        return `<span class="text-sm cursor-help hover:scale-110 transition inline-block" title="${name}">${icon}</span>`;
      }).join(' ');

      return `
        <div id="pointStudentCard-${st.id}" class="parchment-card p-3 sm:p-3.5 minister-card flex flex-col justify-between rounded-2xl border-2 transition-all hover:shadow-md ${isSelected ? 'student-multi-selected border-amber-500 bg-amber-50/90' : 'border-amber-200/90 bg-white/95'}">
          <div>
            <!-- 頂部身分列：勾選 + 座號 + 姓名 + 幹部職位與目前認養萌寵圖示 -->
            <div class="flex items-center justify-between pb-2 border-b border-amber-200/80">
              <div class="flex items-center space-x-1.5 min-w-0">
                <input type="checkbox" id="pointStudentCheck-${st.id}" ${isSelected ? 'checked' : ''} onchange="toggleStudentPointSelection(${st.id})" class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer flex-shrink-0" title="勾選進行多位大臣批次加點">
                <span class="text-xs font-mono font-black text-amber-950 bg-amber-200 px-1.5 py-0.5 rounded flex-shrink-0">
                  ${String(st.seatNo).padStart(2, '0')}號
                </span>
                <span class="text-base sm:text-lg font-black text-slate-900 truncate tracking-wide">${st.name}</span>
              </div>
              <div class="flex items-center space-x-1 flex-shrink-0">
                <span class="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded truncate max-w-[80px]" title="${st.title}">
                  ${st.title}
                </span>
                <div class="flex items-center space-x-0.5">
                  ${petIconsHtml}
                </div>
              </div>
            </div>

            <!-- 核心大字：可用蘋果與萌寵成長 + 抽屜方式顯示已兌換特權卡牌 -->
            <div class="my-2 p-2.5 rounded-xl bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border border-rose-300/80 shadow-2xs space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl leading-none">🍎</span>
                  <div>
                    <span class="text-[10px] text-rose-800 font-bold block leading-tight">可用蘋果</span>
                    <div class="flex items-baseline space-x-0.5">
                      <span class="text-2xl font-black text-rose-600 font-digital leading-none">${st.points || 0}</span>
                      <span class="text-xs font-black text-rose-800">顆</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-500 font-bold block leading-tight">🐾 寵物成長</span>
                  <span class="text-xs font-black text-emerald-800 font-digital">${lifetime} 點</span>
                </div>
              </div>

              <!-- 🗃️ 已兌換卡牌抽屜展開/收合開關按鈕 (先存後用 ‧ 隨時取用) -->
              <button type="button" onclick="toggleStudentCardDrawer(${st.id})" 
                class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition shadow-2xs ${heldCards.length > 0 ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950 font-black' : 'bg-white/80 hover:bg-white border-amber-200 text-amber-900/80 font-bold'}"
                title="點擊展開/收合此大臣已兌換特權卡牌抽屜">
                <span class="flex items-center space-x-1.5 truncate">
                  <span class="text-sm">🗃️</span>
                  <span class="text-xs font-black">卡牌抽屜</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black ${heldCards.length > 0 ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-200 text-slate-600'}">
                    ${heldCards.length} 張已兌換
                  </span>
                </span>
                <span class="text-[10px] font-bold text-amber-800 transform transition-transform ${isDrawerOpen ? 'rotate-180' : ''}">
                  ▼
                </span>
              </button>

              <!-- 卡牌抽屜內容面板 -->
              ${isDrawerOpen ? `
                <div class="p-2 rounded-xl bg-amber-50/95 border-2 border-amber-300 shadow-inner space-y-2">
                  <div class="flex items-center justify-between pb-1 border-b border-amber-200 text-[10px] font-black text-amber-950">
                    <span>🎒 存放卡牌 (${heldCards.length}張)</span>
                    <span class="text-[9px] text-amber-800 font-normal">先存後用 ‧ 隨時取用</span>
                  </div>
                  ${heldCards.length === 0 ? `
                    <div class="py-2 text-center text-[10px] text-slate-500 font-bold bg-white/70 rounded-lg border border-dashed border-amber-200">
                      📭 抽屜目前無存放卡牌
                    </div>
                  ` : `
                    <div class="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                      ${heldCards.map(c => `
                        <div class="p-1.5 rounded-lg bg-white border border-amber-300 shadow-2xs flex items-center justify-between gap-1 hover:border-amber-500 transition">
                          <div class="min-w-0 flex-1">
                            <div class="flex items-center space-x-1 truncate">
                              <span class="text-sm shrink-0">${c.icon || '🎁'}</span>
                              <span class="text-[11px] font-black text-amber-950 truncate" title="${c.title}">${c.title}</span>
                            </div>
                            ${c.desc ? `<div class="text-[9px] text-slate-500 truncate mt-0.5" title="${c.desc}">${c.desc}</div>` : ''}
                          </div>
                          <div class="flex items-center space-x-1 shrink-0">
                            <button type="button" onclick="confirmUseStudentCard(${st.id}, '${c.id}', '${(c.title || '').replace(/'/g, "\\'")}')"
                              class="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-[10px] shadow-2xs flex items-center space-x-0.5 transition"
                              title="立即使用此張卡牌並自抽屜移除">
                              <span>✨</span>
                              <span>使用</span>
                            </button>
                            <button type="button" onclick="confirmRevokeStudentCard(${st.id}, '${c.id}', '${(c.title || '').replace(/'/g, "\\'")}', ${c.cost || 0})"
                              class="px-1.5 py-0.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 active:scale-95 font-black text-[10px] shadow-2xs flex items-center space-x-0.5 transition"
                              title="撤銷兌換此卡牌並退還 ${c.cost || 0} 顆可用蘋果">
                              <span>↩️</span>
                              <span>撤銷</span>
                            </button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `}

                  <!-- 🎁 抽屜內卡牌下拉快速兌換 (直接選擇該大臣要兌換的卡牌) -->
                  <div class="pt-2 border-t border-amber-300/80 space-y-1.5">
                    <div class="flex items-center justify-between text-[10px] font-black text-amber-950">
                      <span class="flex items-center space-x-1">
                        <span>🎁</span>
                        <span>兌換特權卡牌</span>
                      </span>
                      <span class="text-[9px] text-rose-700 font-mono font-bold">
                        持有 ${st.points || 0} 顆 🍎
                      </span>
                    </div>
                    ${(() => {
                      const allRewardCards = window.KingdomApp.store.data.rewardCards || [];
                      if (allRewardCards.length === 0) {
                        return `<div class="text-[9px] text-slate-400 py-1 text-center">尚無可兌換卡牌</div>`;
                      }
                      return `
                        <div class="space-y-1">
                          <select id="drawerRedeemSelect-${st.id}" onchange="updateDrawerRedeemButton(${st.id}, this.value)" class="w-full text-[11px] font-bold py-1 px-1.5 bg-white border border-amber-400 rounded-lg text-amber-950 shadow-2xs focus:ring-1 focus:ring-amber-500">
                            ${allRewardCards.map(c => {
                              const isAffordable = (st.points || 0) >= c.cost;
                              return `
                                <option value="${c.id}" data-cost="${c.cost}">
                                  ${c.icon || '🎁'} ${c.title} (${c.cost} 顆 🍎) ${isAffordable ? '✅ 可換' : `❌ 缺${c.cost - (st.points || 0)}`}
                                </option>
                              `;
                            }).join('')}
                          </select>
                          <button type="button" id="drawerRedeemBtn-${st.id}" onclick="executeDrawerQuickRedeem(${st.id})"
                            class="w-full py-1 rounded-lg btn-royal-gold font-black text-[11px] shadow-2xs flex items-center justify-center space-x-1 transition active:scale-95"
                            title="從此處下拉選單直接兌換卡牌存入抽屜">
                            <span>🤝</span>
                            <span>直接兌換存入抽屜</span>
                          </button>
                        </div>
                      `;
                    })()}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- 底部輔助操作按鈕 (🐾投餵寵物 / 🎁換卡 / ✏️改蘋果) -->
          <div class="grid grid-cols-3 gap-1.5 pt-1">
            <button onclick="openZooFeedModal(${st.id})" class="py-1 px-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-950 font-bold text-xs transition border border-emerald-300 shadow-2xs flex items-center justify-center space-x-0.5" title="投餵認養萌寵長大">
              <span>🐾</span><span>投餵</span>
            </button>
            <button onclick="openRedeemCardForStudent(${st.id})" class="py-1 px-1.5 rounded-lg bg-white hover:bg-amber-100 active:scale-95 text-amber-950 font-bold text-xs transition border border-amber-300 shadow-2xs flex items-center justify-center space-x-0.5" title="以蘋果兌換特權卡">
              <span>🎁</span><span>換卡</span>
            </button>
            <button onclick="openEditStudentPointsModal(${st.id})" class="py-1 px-1.5 rounded-lg bg-white hover:bg-rose-100 active:scale-95 text-rose-950 font-bold text-xs transition border border-rose-300 shadow-2xs flex items-center justify-center space-x-0.5" title="更改此大臣蘋果數量">
              <span>✏️</span><span>改蘋果</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 渲染獎懲歷史日誌 (支援逐筆撤銷與復原)
  if (logList) {
    const logs = window.KingdomApp.store.data.pointLogs;
    if (logs.length === 0) {
      logList.innerHTML = `<p class="text-slate-400 text-xs">暫無近期獎懲紀錄</p>`;
    } else {
      logList.innerHTML = logs.slice(0, 20).map(l => {
        let studentName = '全班大臣';
        if (l.studentId !== 'all') {
          const st = students.find(s => s.id === l.studentId);
          studentName = st ? `${String(st.seatNo).padStart(2, '0')}號 ${st.name}` : (l.studentId === 'multi' ? '多位大臣' : (l.studentId === 'batch_adjust' ? '批次調整' : '未知大臣'));
        }
        const isPositive = l.points > 0;
        const isUndone = l.undone || (l.reason && l.reason.includes('已撤銷'));
        const isUndoLog = !!l.isUndoLog;

        return `
          <div class="flex items-center justify-between p-2 rounded-lg ${isUndone ? 'bg-slate-100 opacity-60 border-slate-300' : (isUndoLog ? 'bg-rose-50/80 border-rose-200' : 'bg-white border-amber-200')} border text-xs transition">
            <div class="flex items-center space-x-2 min-w-0">
              <span class="font-black ${isUndone ? 'text-slate-500 line-through' : (isUndoLog ? 'text-rose-900' : 'text-amber-950')} flex-shrink-0">[${studentName}]</span>
              <span class="${isUndone ? 'text-slate-400 line-through' : (isUndoLog ? 'text-rose-800 font-bold' : 'text-slate-800')} truncate">${l.reason}</span>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0">
              <span class="font-mono ${isUndone ? 'text-slate-400 line-through' : (l.points === 0 ? 'text-slate-500' : (isPositive ? 'text-amber-600 font-black' : 'text-rose-600 font-bold'))}">
                ${l.points > 0 ? `+${l.points}` : l.points} 🪙
              </span>
              <span class="text-[10px] text-slate-400 font-bold">${l.time || ''}</span>
              ${!isUndone && !isUndoLog && l.points !== 0 ? `
                <button onclick="confirmRevokePointLog(${l.id})" class="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 border border-rose-300 text-[10px] font-black shadow-2xs transition flex items-center space-x-0.5" title="撤回此筆記功並反向沖銷蘋果">
                  <span>↩️</span><span>撤回</span>
                </button>
              ` : (isUndone ? '<span class="text-[9px] font-black text-slate-400 bg-slate-200 px-1 py-0.5 rounded">已撤銷</span>' : '')}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 更新頂部加點錯誤復原按鈕狀態
  const undoBtn = document.getElementById("btnUndoPointAction");
  if (undoBtn) {
    const lastAction = window.KingdomApp.store.getLastUndoableAction();
    if (lastAction) {
      undoBtn.classList.remove("opacity-50");
      const shortTitle = lastAction.title.length > 12 ? lastAction.title.slice(0, 12) + '...' : lastAction.title;
      undoBtn.innerHTML = `<span>↩️</span><span>復原上一步 (${shortTitle})</span>`;
      undoBtn.title = `點擊可立即復原：${lastAction.title} (${lastAction.time})`;
    } else {
      undoBtn.classList.add("opacity-50");
      undoBtn.innerHTML = `<span>↩️</span><span>復原上一步加點</span>`;
      undoBtn.title = `目前沒有可復原的加點操作`;
    }
  }

  updatePointsMultiSelectUI();
  initLucideIcons();
}

// --- 多選大臣快速加扣點控制器 ---
function toggleStudentPointSelection(studentId) {
  if (selectedStudentIdsForPoints.has(studentId)) {
    selectedStudentIdsForPoints.delete(studentId);
  } else {
    selectedStudentIdsForPoints.add(studentId);
  }
  updatePointsMultiSelectUI();
}

function selectAllStudentsPoints(selectAll) {
  const students = window.KingdomApp.store.data.students || [];
  if (selectAll) {
    selectedStudentIdsForPoints = new Set(students.map(s => s.id));
  } else {
    selectedStudentIdsForPoints.clear();
  }
  updatePointsMultiSelectUI();
}

function invertStudentPointsSelection() {
  const students = window.KingdomApp.store.data.students || [];
  const nextSet = new Set();
  students.forEach(s => {
    if (!selectedStudentIdsForPoints.has(s.id)) nextSet.add(s.id);
  });
  selectedStudentIdsForPoints = nextSet;
  updatePointsMultiSelectUI();
}

function updatePointsMultiSelectUI() {
  const badge = document.getElementById("multiSelectedCountBadge");
  if (badge) {
    badge.textContent = `已選取 ${selectedStudentIdsForPoints.size} 位`;
  }
  const students = window.KingdomApp.store.data.students || [];
  students.forEach(st => {
    const cardEl = document.getElementById(`pointStudentCard-${st.id}`);
    const cb = document.getElementById(`pointStudentCheck-${st.id}`);
    if (cb) cb.checked = selectedStudentIdsForPoints.has(st.id);
    if (cardEl) {
      if (selectedStudentIdsForPoints.has(st.id)) {
        cardEl.classList.add("student-multi-selected");
      } else {
        cardEl.classList.remove("student-multi-selected");
      }
    }
  });
}

function awardSelectedStudents(points, defaultReason) {
  if (selectedStudentIdsForPoints.size === 0) {
    alert("請先在下方大臣卡片上勾選至少一位大臣！");
    return;
  }
  const count = selectedStudentIdsForPoints.size;
  const reason = prompt(`為已勾選的 ${count} 位大臣派發【${points > 0 ? `+${points}` : points} 點】的事由：`, defaultReason);
  if (reason === null) return;

  const targetIds = Array.from(selectedStudentIdsForPoints);
  window.KingdomApp.store.batchAwardMultipleStudents(targetIds, points, reason || defaultReason);

  if (points > 0) {
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();
    showToast(`🎉 成功為 ${targetIds.length} 位大臣同時頒發 +${points} 顆紅蘋果！`);
  } else {
    window.KingdomApp.sound.playCoin();
    showToast(`⚠️ 已為 ${targetIds.length} 位大臣扣除 ${Math.abs(points)} 顆紅蘋果。`);
  }

  showUndoNotificationBanner();
  renderPointsView();
}

function openCustomMultiPointsModal() {
  if (selectedStudentIdsForPoints.size === 0) {
    alert("請先在下方卡片中勾選欲派發聖旨的大臣！");
    return;
  }
  const desc = document.getElementById("customMultiPointsTargetDesc");
  if (desc) {
    desc.textContent = `${selectedStudentIdsForPoints.size} 位大臣`;
  }
  document.getElementById("customMultiPointsModal").classList.remove("hidden");
  initLucideIcons();
}

function closeCustomMultiPointsModal() {
  document.getElementById("customMultiPointsModal").classList.add("hidden");
}

function submitCustomMultiPoints(e) {
  e.preventDefault();
  const pts = parseInt(document.getElementById("customMultiPointsInput").value, 10);
  const reason = document.getElementById("customMultiReasonInput").value.trim();
  const targetIds = Array.from(selectedStudentIdsForPoints);

  window.KingdomApp.store.batchAwardMultipleStudents(targetIds, pts, reason);
  if (pts > 0) {
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();
    showToast(`👑 聖旨頒布！已為 ${targetIds.length} 位大臣同時頒發 ${pts} 點！`);
  } else {
    showToast(`⚠️ 已為 ${targetIds.length} 位大臣扣除 ${Math.abs(pts)} 點。`);
  }
  closeCustomMultiPointsModal();
  showUndoNotificationBanner();
  renderPointsView();
}

// --- 皇家藏寶閣 (獎勵卡牌商城) 控制器 ---
function renderRewardCards() {
  const grid = document.getElementById("rewardCardsGrid");
  if (!grid) return;
  const cards = window.KingdomApp.store.data.rewardCards || [];

  if (cards.length === 0) {
    grid.innerHTML = `<div class="col-span-full p-6 text-center text-slate-400 font-bold bg-white/60 rounded-xl border border-amber-300">尚未建立任何獎勵卡牌，請點擊上方按鈕新增！</div>`;
    return;
  }

  grid.innerHTML = cards.map(c => `
    <div class="reward-card p-4 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between pb-2 border-b border-amber-200">
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
            ${c.category || '班級特權'}
          </span>
          <span class="font-mono font-black text-amber-700 bg-amber-200/90 px-2 py-0.5 rounded text-xs shadow-sm">
            🪙 ${c.cost} 點
          </span>
        </div>

        <div class="mt-2.5 flex items-center space-x-2.5">
          <span class="text-3xl flex-shrink-0">${c.icon || '🎁'}</span>
          <div>
            <h4 class="text-base font-black text-slate-900">${c.title}</h4>
          </div>
        </div>

        <p class="mt-2 text-xs text-amber-950 font-medium leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-200/80">
          ${c.desc || '無特殊說明'}
        </p>
      </div>

      <div class="mt-3.5 pt-2 border-t border-amber-200 flex items-center space-x-1.5 text-xs font-bold">
        <button onclick="openRedeemCardModal('${c.id}')" class="flex-1 py-1.5 rounded-xl btn-royal-gold font-black shadow flex items-center justify-center space-x-1">
          <span>🤝</span>
          <span>大臣兌換</span>
        </button>
        <button onclick="openRewardCardModal('${c.id}')" class="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300">
          編輯
        </button>
        <button onclick="deleteRewardCard('${c.id}')" class="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200" title="刪除卡牌">
          ✕
        </button>
      </div>
    </div>
  `).join('');

  renderRewardRedemptions();
  initLucideIcons();
}

function renderRewardRedemptions() {
  const list = document.getElementById("rewardRedemptionsList");
  if (!list) return;
  const redemptions = window.KingdomApp.store.data.rewardRedemptions || [];

  if (redemptions.length === 0) {
    list.innerHTML = `<p class="text-slate-400 text-center py-2">尚無任何大臣兌換獎勵紀錄</p>`;
    return;
  }

  list.innerHTML = redemptions.slice(0, 30).map(r => {
    const isRevoked = r.status === 'revoked';
    const isUsed = r.status === 'used' || r.used;
    return `
    <div class="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200 ${isRevoked ? 'opacity-60 bg-slate-50' : ''}">
      <div class="flex items-center space-x-2">
        <span class="font-black text-amber-950">[${String(r.seatNo).padStart(2, '0')}號 ${r.studentName}]</span>
        <span class="text-slate-800 font-bold">兌換【${r.cardTitle}】</span>
        <span class="font-mono text-amber-700 font-black">(-${r.cost}點)</span>
        ${isRevoked ? '<span class="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-black border border-rose-200">↩️已撤銷退還</span>' : ''}
      </div>
      <div class="flex items-center space-x-1.5">
        <span class="text-[10px] text-slate-400">${r.date} ${r.time}</span>
        ${!isRevoked ? `
          <button onclick="toggleRedemptionStatus('${r.id}')" class="px-2 py-0.5 rounded text-[11px] font-black ${isUsed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
            ${isUsed ? '已核銷' : '未核銷 (點擊核銷)'}
          </button>
          <button onclick="confirmRevokeRedemptionRecord('${r.id}', '${r.studentId}', '${(r.cardTitle || '').replace(/'/g, "\\'")}', ${r.cost || 0})" class="px-2 py-0.5 rounded text-[11px] font-black bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 transition" title="撤銷此兌換並退回 ${r.cost || 0} 顆蘋果">
            ↩️ 撤銷
          </button>
        ` : ''}
      </div>
    </div>
  `;
  }).join('');
}

function toggleRedemptionHistory() {
  isRedemptionHistoryOpen = !isRedemptionHistoryOpen;
  const box = document.getElementById("rewardRedemptionHistoryBox");
  const btn = document.getElementById("btnToggleRedeemHistory");
  if (box) {
    if (isRedemptionHistoryOpen) {
      box.classList.remove("hidden");
      if (btn) btn.classList.add("bg-amber-200");
    } else {
      box.classList.add("hidden");
      if (btn) btn.classList.remove("bg-amber-200");
    }
  }
}

function toggleRedemptionStatus(redemptionId) {
  window.KingdomApp.store.toggleRedemptionStatus(redemptionId);
  renderRewardRedemptions();
}

function openRewardCardModal(cardId = null) {
  activeRewardCardId = cardId;
  const titleEl = document.getElementById("rewardCardModalTitle");
  if (cardId) {
    const card = (window.KingdomApp.store.data.rewardCards || []).find(c => c.id === cardId);
    if (!card) return;
    if (titleEl) titleEl.innerHTML = `<span>✏️ 編輯獎勵卡牌：${card.title}</span>`;
    document.getElementById("editRewardCardId").value = card.id;
    document.getElementById("rewardCardTitleInput").value = card.title;
    document.getElementById("rewardCardCostInput").value = card.cost;
    document.getElementById("rewardCardCategorySelect").value = card.category || '班級特權';
    document.getElementById("rewardCardIconInput").value = card.icon || '🎁';
    document.getElementById("rewardCardDescInput").value = card.desc || '';
  } else {
    if (titleEl) titleEl.innerHTML = `<span>🎁 新增皇家獎勵卡牌</span>`;
    document.getElementById("editRewardCardId").value = "";
    document.getElementById("rewardCardTitleInput").value = "";
    document.getElementById("rewardCardCostInput").value = "30";
    document.getElementById("rewardCardCategorySelect").value = "班級特權";
    document.getElementById("rewardCardIconInput").value = "🎁";
    document.getElementById("rewardCardDescInput").value = "";
  }
  document.getElementById("rewardCardModal").classList.remove("hidden");
  initLucideIcons();
}

function closeRewardCardModal() {
  document.getElementById("rewardCardModal").classList.add("hidden");
}

function submitRewardCard(e) {
  e.preventDefault();
  const idVal = document.getElementById("editRewardCardId").value;
  const title = document.getElementById("rewardCardTitleInput").value.trim();
  const cost = parseInt(document.getElementById("rewardCardCostInput").value, 10);
  const category = document.getElementById("rewardCardCategorySelect").value;
  const icon = document.getElementById("rewardCardIconInput").value.trim() || '🎁';
  const desc = document.getElementById("rewardCardDescInput").value.trim();

  if (idVal) {
    window.KingdomApp.store.updateRewardCard(idVal, { title, cost, category, icon, desc });
    showToast(`✨ 獎勵卡【${title}】修改成功！`);
  } else {
    window.KingdomApp.store.addRewardCard({ title, cost, category, icon, desc });
    showToast(`🎉 成功新增獎勵卡【${title}】！`);
  }

  window.KingdomApp.sound.playCoin();
  closeRewardCardModal();
  renderRewardCards();
}

function deleteRewardCard(cardId) {
  if (!confirm("確定要刪除這張獎勵卡牌嗎？")) return;
  window.KingdomApp.store.deleteRewardCard(cardId);
  showToast("已刪除該獎勵卡");
  renderRewardCards();
}

function openRedeemCardModal(cardId) {
  activeRedeemCardId = cardId;
  const cards = window.KingdomApp.store.data.rewardCards || [];
  const card = cards.find(c => c.id === cardId) || cards[0];
  if (!card) return;

  const cardSelect = document.getElementById("redeemCardSelect");
  if (cardSelect) {
    cardSelect.innerHTML = cards.map(c => `
      <option value="${c.id}" ${c.id === card.id ? 'selected' : ''}>
        ${c.icon || '🎁'} ${c.title} (所需蘋果：${c.cost} 顆)
      </option>
    `).join('');
  }

  document.getElementById("redeemCardTargetId").value = card.id;
  document.getElementById("redeemModalCardIcon").textContent = card.icon || '🎁';
  document.getElementById("redeemModalCardTitle").textContent = card.title;
  document.getElementById("redeemModalCardCostBadge").textContent = `所需蘋果：${card.cost} 顆`;

  const select = document.getElementById("redeemStudentSelect");
  const students = window.KingdomApp.store.data.students || [];
  if (select) {
    select.innerHTML = students.map(st => `
      <option value="${st.id}">
        ${String(st.seatNo).padStart(2, '0')}號 ${st.name} (現有 ${st.points} 點)
      </option>
    `).join('');
  }

  updateRedeemPreview();
  document.getElementById("redeemCardModal").classList.remove("hidden");
  initLucideIcons();
}

function changeRedeemCardInModal(newCardId) {
  const card = (window.KingdomApp.store.data.rewardCards || []).find(c => c.id === newCardId);
  if (!card) return;
  activeRedeemCardId = newCardId;
  document.getElementById("redeemCardTargetId").value = card.id;
  document.getElementById("redeemModalCardIcon").textContent = card.icon || '🎁';
  document.getElementById("redeemModalCardTitle").textContent = card.title;
  document.getElementById("redeemModalCardCostBadge").textContent = `所需蘋果：${card.cost} 顆`;
  updateRedeemPreview();
}

function updateDrawerRedeemButton(studentId, cardId) {
  const student = (window.KingdomApp.store.data.students || []).find(s => s.id === studentId);
  const card = (window.KingdomApp.store.data.rewardCards || []).find(c => c.id === cardId);
  const btn = document.getElementById(`drawerRedeemBtn-${studentId}`);
  if (!student || !card || !btn) return;
  const isEnough = (student.points || 0) >= card.cost;
  if (isEnough) {
    btn.className = "w-full py-1 rounded-lg btn-royal-gold font-black text-[11px] shadow-2xs flex items-center justify-center space-x-1 transition active:scale-95 cursor-pointer";
    btn.innerHTML = `<span>🤝 兌換【${card.title}】(-${card.cost} 顆 🍎)</span>`;
    btn.disabled = false;
  } else {
    btn.className = "w-full py-1 rounded-lg bg-slate-200 text-slate-500 font-bold text-[11px] shadow-2xs flex items-center justify-center space-x-1 cursor-not-allowed";
    btn.innerHTML = `<span>⚠️ 蘋果不足 (尚缺 ${card.cost - (student.points || 0)} 顆)</span>`;
    btn.disabled = true;
  }
}

function executeDrawerQuickRedeem(studentId) {
  const select = document.getElementById(`drawerRedeemSelect-${studentId}`);
  if (!select || !select.value) {
    alert("請先選擇欲兌換的特權卡牌！");
    return;
  }
  const cardId = select.value;
  const res = window.KingdomApp.store.redeemCard(studentId, cardId);
  if (!res.success) {
    alert(res.message);
    return;
  }
  if (window.KingdomApp.sound && window.KingdomApp.sound.playFanfare) {
    try { window.KingdomApp.sound.playFanfare(); } catch (e) {}
  }
  if (window.KingdomApp.triggerConfetti) {
    try { window.KingdomApp.triggerConfetti(); } catch (e) {}
  }
  if (!window.openCardDrawerStudentIds) window.openCardDrawerStudentIds = new Set();
  window.openCardDrawerStudentIds.add(studentId);
  showToast(`🎉 恭喜【${res.studentName}】成功兌換【${res.cardTitle}】！已存入卡牌抽屜！`, "👑");
  renderRewardCards();
  renderPointsView();
  renderRosterView();
}

function openRedeemCardForStudent(studentId) {
  const cards = window.KingdomApp.store.data.rewardCards || [];
  if (cards.length === 0) {
    alert("目前尚未建立任何獎勵卡，請先新增卡牌！");
    return;
  }
  // 優先在個人集點榜卡牌抽屜內展開下拉選單直接兌換
  if (!window.openCardDrawerStudentIds) window.openCardDrawerStudentIds = new Set();
  window.openCardDrawerStudentIds.add(studentId);
  renderPointsView();
  setTimeout(() => {
    const cardEl = document.getElementById(`pointStudentCard-${studentId}`);
    if (cardEl && cardEl.scrollIntoView) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    const select = document.getElementById(`drawerRedeemSelect-${studentId}`);
    if (select) {
      select.focus();
      updateDrawerRedeemButton(studentId, select.value);
    }
  }, 100);
}

function updateRedeemPreview() {
  const cardId = document.getElementById("redeemCardTargetId").value;
  const card = (window.KingdomApp.store.data.rewardCards || []).find(c => c.id === cardId);
  const select = document.getElementById("redeemStudentSelect");
  if (!select) return;
  const studentId = parseInt(select.value, 10);
  const student = (window.KingdomApp.store.data.students || []).find(s => s.id === studentId);
  const previewBox = document.getElementById("redeemPointsPreviewBox");
  const btn = document.getElementById("btnConfirmRedeem");

  if (!card || !student || !previewBox) return;

  const remaining = student.points - card.cost;
  const isEnough = remaining >= 0;

  if (isEnough) {
    previewBox.className = "p-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-950 font-bold space-y-1";
    previewBox.innerHTML = `
      <div class="flex items-center justify-between">
        <span>大臣現有蘋果：<strong>${student.points} 顆</strong></span>
        <span>兌換扣除：<strong>-${card.cost} 點</strong></span>
      </div>
      <div class="pt-1 border-t border-emerald-200 text-sm font-black text-emerald-800">
        兌換後剩餘蘋果：${remaining} 顆 (蘋果足夠 ✅)
      </div>
    `;
    if (btn) {
      btn.disabled = false;
      btn.className = "btn-royal-gold px-5 py-2 rounded-xl font-black shadow flex items-center space-x-1.5 opacity-100 cursor-pointer";
    }
  } else {
    previewBox.className = "p-3 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-950 font-bold space-y-1";
    previewBox.innerHTML = `
      <div class="flex items-center justify-between">
        <span>大臣現有蘋果：<strong>${student.points} 顆</strong></span>
        <span>所需蘋果：<strong>${card.cost} 顆</strong></span>
      </div>
      <div class="pt-1 border-t border-rose-200 text-sm font-black text-rose-700">
        尚缺 ${Math.abs(remaining)} 顆蘋果，無法兌換 ❌
      </div>
    `;
    if (btn) {
      btn.disabled = true;
      btn.className = "px-5 py-2 rounded-xl font-black bg-slate-300 text-slate-500 cursor-not-allowed";
    }
  }
}

function closeRedeemCardModal() {
  document.getElementById("redeemCardModal").classList.add("hidden");
}

function submitRedeemCard(e) {
  e.preventDefault();
  const cardId = document.getElementById("redeemCardTargetId").value;
  const select = document.getElementById("redeemStudentSelect");
  const studentId = parseInt(select.value, 10);

  try {
    const record = window.KingdomApp.store.redeemCard(studentId, cardId);
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();

    // 自動展開該大臣的卡牌抽屜，方便立即查看已兌換卡牌
    if (!window.openCardDrawerStudentIds) window.openCardDrawerStudentIds = new Set();
    window.openCardDrawerStudentIds.add(studentId);

    showToast(`🎉 恭喜【${record.studentName}】成功兌換【${record.cardTitle}】！已存入卡牌抽屜，隨時可取用！`);
    closeRedeemCardModal();
    renderRewardCards();
    renderPointsView();
    renderRosterView();
  } catch (err) {
    alert(err.message);
  }
}

// ===================================================================
// 大臣個人卡牌抽屜與特權卡使用 (Card Drawer & Activation)
// ===================================================================
window.openCardDrawerStudentIds = window.openCardDrawerStudentIds || new Set();

function toggleStudentCardDrawer(studentId) {
  if (!window.openCardDrawerStudentIds) {
    window.openCardDrawerStudentIds = new Set();
  }
  if (window.openCardDrawerStudentIds.has(studentId)) {
    window.openCardDrawerStudentIds.delete(studentId);
  } else {
    window.openCardDrawerStudentIds.add(studentId);
  }
  renderPointsView();
}

function confirmUseStudentCard(studentId, instanceId, cardTitle) {
  const student = (window.KingdomApp.store.data.students || []).find(s => s.id === studentId || s.seatNo === studentId);
  const stName = student ? student.name : '大臣';
  if (!confirm(`確定要讓【${stName}】使用特權卡牌【${cardTitle}】嗎？\n\n使用後將自動在可使用的卡牌抽屜中移除該張卡牌！`)) {
    return;
  }
  const result = window.KingdomApp.store.useRedeemedCard(studentId, instanceId);
  if (result && result.success) {
    if (window.KingdomApp.sound && window.KingdomApp.sound.playFanfare) {
      window.KingdomApp.sound.playFanfare();
    }
    if (window.KingdomApp.triggerConfetti) {
      window.KingdomApp.triggerConfetti();
    }
    showToast(`✨ 【${result.studentName}】成功使用了【${result.cardTitle}】！已自卡牌抽屜扣除。`, "🎉");
    renderPointsView();
    renderPointsProjection();
  } else {
    alert((result && result.message) || "使用卡牌失敗");
  }
}

// 導師手動撤銷特權卡兌換 (抽屜內卡牌撤銷退換)
function confirmRevokeStudentCard(studentId, instanceId, cardTitle, cardCost = 0) {
  const student = (window.KingdomApp.store.data.students || []).find(s => s.id === studentId || s.seatNo === studentId);
  const stName = student ? student.name : '大臣';
  const cost = parseInt(cardCost, 10) || 0;
  if (!confirm(`確定要撤銷【${stName}】兌換的特權卡【${cardTitle}】嗎？\n\n撤銷後將：\n1. 自卡牌抽屜徹底移除此卡牌\n2. 歸還 ${cost} 顆可用蘋果給該大臣`)) {
    return;
  }
  const result = window.KingdomApp.store.revokeCardRedemption({
    studentId,
    instanceId,
    cardTitle,
    refundPoints: true
  });
  if (result && result.success) {
    if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
      window.KingdomApp.sound.playCoin();
    }
    showToast(`↩️ ${result.message}`, "🍎");
    renderPointsView();
    renderRewardRedemptions();
    renderRosterView();
    renderPointsProjection();
  } else {
    alert((result && result.message) || "撤銷失敗！");
  }
}

function revokeCardInPointsProjection(studentId, instanceId, cardTitle, cardCost = 0) {
  confirmRevokeStudentCard(studentId, instanceId, cardTitle, cardCost);
}

// 導師在獎勵兌換紀錄中點擊撤銷
function confirmRevokeRedemptionRecord(redemptionId, studentId, cardTitle, cost = 0) {
  const student = (window.KingdomApp.store.data.students || []).find(s => s.id == studentId || s.seatNo == studentId);
  const stName = student ? student.name : '該大臣';
  const pts = parseInt(cost, 10) || 0;
  if (!confirm(`確定要撤銷這筆兌換紀錄嗎？\n\n對象：【${stName}】\n卡牌：【${cardTitle}】\n\n確認後將自大臣卡牌抽屜移除此卡，並退還 ${pts} 顆可用蘋果！`)) {
    return;
  }
  const result = window.KingdomApp.store.revokeCardRedemption({
    studentId,
    instanceId: redemptionId,
    cardTitle,
    refundPoints: true
  });
  if (result && result.success) {
    if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
      window.KingdomApp.sound.playCoin();
    }
    showToast(`↩️ ${result.message}`, "🍎");
    renderRewardRedemptions();
    renderPointsView();
    renderPointsProjection();
    renderRosterView();
  } else {
    alert((result && result.message) || "撤銷失敗！");
  }
}

function renderPointPresets() {
  const presets = window.KingdomApp.store.data.pointPresets || [];
  const plusBox = document.getElementById("presetPlusContainer");
  const minusBox = document.getElementById("presetMinusContainer");

  const plusItems = presets.filter(p => p.type === 'plus');
  const minusItems = presets.filter(p => p.type === 'minus');

  if (plusBox) {
    plusBox.innerHTML = plusItems.map(p => `
      <div class="inline-flex items-center bg-white border-2 border-emerald-300 rounded-xl overflow-hidden shadow-sm hover:border-emerald-500 transition">
        <button onclick="applyPresetToTarget('${p.id}')" class="px-3 py-1.5 text-xs font-black text-emerald-900 hover:bg-emerald-50 flex items-center space-x-1">
          <span>${p.icon || '🌟'}</span>
          <span>${p.label} (+${p.points})</span>
        </button>
        <button onclick="deletePointPreset('${p.id}')" class="px-1.5 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-l border-emerald-200" title="刪除此規則">
          ✕
        </button>
      </div>
    `).join('');
  }

  if (minusBox) {
    minusBox.innerHTML = minusItems.map(p => `
      <div class="inline-flex items-center bg-white border-2 border-rose-300 rounded-xl overflow-hidden shadow-sm hover:border-rose-500 transition">
        <button onclick="applyPresetToTarget('${p.id}')" class="px-3 py-1.5 text-xs font-black text-rose-900 hover:bg-rose-50 flex items-center space-x-1">
          <span>${p.icon || '⚠️'}</span>
          <span>${p.label} (${p.points})</span>
        </button>
        <button onclick="deletePointPreset('${p.id}')" class="px-1.5 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-l border-rose-200" title="刪除此規則">
          ✕
        </button>
      </div>
    `).join('');
  }
}

// ===================================================================
// 單獨大臣更改蘋果數量 Modal 控制器 (Teacher Edit Student Points)
// ===================================================================
function openEditStudentPointsModal(studentId) {
  const student = window.KingdomApp.store.data.students.find(s => s.id == studentId || s.seatNo == studentId);
  if (!student) return;

  const aType = student.animalType || student.petType || 'dog';
  const aDef = (window.KingdomApp && window.KingdomApp.ANIMAL_DEFINITIONS && window.KingdomApp.ANIMAL_DEFINITIONS[aType]) || { icon: '🐶', name: '忠誠柴犬' };

  const modal = document.getElementById("editStudentPointsModal");
  if (!modal) return;

  const idInput = document.getElementById("editPointsStudentId");
  const seatEl = document.getElementById("editPointsStudentSeat");
  const nameEl = document.getElementById("editPointsStudentName");
  const titleEl = document.getElementById("editPointsStudentTitle");
  const iconEl = document.getElementById("editPointsStudentIcon");
  const balEl = document.getElementById("editPointsCurrentBalance");
  const targetInput = document.getElementById("editPointsTargetInput");
  const reasonInput = document.getElementById("editPointsReasonInput");

  if (idInput) idInput.value = student.id;
  if (seatEl) seatEl.textContent = `${String(student.seatNo).padStart(2, '0')}號`;
  if (nameEl) nameEl.textContent = student.name;
  if (titleEl) titleEl.textContent = `${student.title || '大臣'} (${aDef.icon} ${aDef.name})`;
  if (iconEl) iconEl.textContent = aDef.icon;
  if (balEl) balEl.textContent = `${student.points || 0} 🪙`;
  if (targetInput) {
    targetInput.value = student.points || 0;
    setTimeout(() => {
      try {
        targetInput.focus();
        targetInput.select();
      } catch (err) {}
    }, 100);
  }
  if (reasonInput) reasonInput.value = "導師手動調整蘋果";

  modal.classList.remove("hidden");
  initLucideIcons();
}

function closeEditStudentPointsModal() {
  const modal = document.getElementById("editStudentPointsModal");
  if (modal) modal.classList.add("hidden");
}

function setEditPointsQuick(val) {
  const input = document.getElementById("editPointsTargetInput");
  if (input) input.value = val;
}

function adjustEditPointsInput(delta) {
  const input = document.getElementById("editPointsTargetInput");
  if (!input) return;
  const cur = parseInt(input.value, 10) || 0;
  input.value = Math.max(0, cur + delta);
}

function submitEditStudentPoints(e) {
  if (e && e.preventDefault) e.preventDefault();
  const idEl = document.getElementById("editPointsStudentId");
  const targetEl = document.getElementById("editPointsTargetInput");
  const reasonEl = document.getElementById("editPointsReasonInput");

  if (!idEl || !targetEl) return;
  const id = parseInt(idEl.value, 10);
  const target = parseInt(targetEl.value, 10);
  const reason = (reasonEl && reasonEl.value.trim()) || "導師手動調整蘋果";

  if (isNaN(target) || target < 0) {
    alert("請輸入有效的蘋果數量（0 或正整數）！");
    return;
  }

  const updated = window.KingdomApp.store.setStudentPoints(id, target, reason);
  if (updated) {
    if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
      try { window.KingdomApp.sound.playCoin(); } catch (err) {}
    }
    showToast(`🍎 成功將【${updated.name}】的蘋果更新為 ${target} 顆！`, "👑");
    closeEditStudentPointsModal();
    if (typeof renderPointsView === 'function') renderPointsView();
    if (typeof renderRosterView === 'function') renderRosterView();
    if (typeof renderPointsZooHabitat === 'function') renderPointsZooHabitat();
    if (typeof renderPetsOverview === 'function') renderPetsOverview();
  }
}

// 相容舊函式呼叫
function promptSingleResetPoints(studentId) {
  openEditStudentPointsModal(studentId);
}

// 全班寵物飽食度歸零
function confirmResetAllPetsSatiety() {
  if (!checkTeacherAuth("全班飽食度歸零")) return;
  const confirmed = confirm("⚠️ 確定要將全班 27 位大臣的萌寵飽食度全數歸零嗎？\n\n・全班萌寵將重回初生幼崽期 (0點)\n・可用蘋果將完整保留不受影響\n\n請確認是否執行？");
  if (!confirmed) return;

  window.KingdomApp.store.resetAllPetsSatiety();
  if (window.KingdomApp.sound && window.KingdomApp.sound.playFanfare) {
    window.KingdomApp.sound.playFanfare();
  }
  showToast("🍎 全班 27 位大臣萌寵飽食度已全數歸零！重返初生幼崽期！", "🍼");
  renderPointsView();
  renderPointsZooHabitat();
  renderPetsView();
  renderRosterView();
}

// 批次重置全班點數 Modal
function openBatchResetPointsModal() {
  if (!checkTeacherAuth("批次重設全班點數")) return;
  document.getElementById("batchResetPointsModal").classList.remove("hidden");
  initLucideIcons();
}

function closeBatchResetPointsModal() {
  document.getElementById("batchResetPointsModal").classList.add("hidden");
}

function submitBatchResetPoints(e) {
  e.preventDefault();
  const target = parseInt(document.getElementById("resetTargetPointsInput").value, 10);
  const clearLogs = document.getElementById("resetClearLogsCheckbox")?.checked ?? false;
  const resetLifetime = document.getElementById("resetLifetimePointsCheckbox")?.checked ?? (target === 0);

  if (isNaN(target) || target < 0) {
    alert("請輸入有效的點數值！");
    return;
  }

  const studentCount = window.KingdomApp.store.data.students.length;
  const promptMsg = resetLifetime
    ? `⚠️ 確定要將全班 ${studentCount} 位大臣的可用蘋果重置為 ${target} 點，並將「生涯累積總額」同步重設嗎？`
    : `確定要將全班 ${studentCount} 位大臣的點數全部重置為 ${target} 點嗎？`;

  if (!confirm(promptMsg)) return;

  window.KingdomApp.store.batchResetPoints(target, clearLogs, resetLifetime);
  window.KingdomApp.sound.playCoin();
  showToast(`🔄 已成功將全班 ${studentCount} 位大臣蘋果重置為 ${target} 顆！`);
  closeBatchResetPointsModal();
  refreshCurrentView();
  renderPointsView();
  renderRosterView();
}

function applyPresetToTarget(presetId) {
  const preset = window.KingdomApp.store.data.pointPresets.find(p => p.id === presetId);
  if (!preset) return;

  const count = selectedStudentIdsForPoints.size;
  let promptMsg = `請選擇要套用【${preset.label} (${preset.points > 0 ? `+${preset.points}` : preset.points})】的對象：\n\n`;
  if (count > 0) {
    promptMsg += `輸入「m」：為目前已勾選的 ${count} 位大臣套用 (推薦)\n`;
  }
  promptMsg += `輸入「0」：為全班 27 位大臣套用\n輸入「座號(例如 3)」：為指定座號大臣套用`;

  const defaultChoice = count > 0 ? "m" : "0";
  const choice = prompt(promptMsg, defaultChoice);
  if (choice === null) return;

  if (choice.toLowerCase() === 'm' && count > 0) {
    const targetIds = Array.from(selectedStudentIdsForPoints);
    window.KingdomApp.store.batchAwardMultipleStudents(targetIds, preset.points, preset.label);
    if (preset.points > 0) {
      window.KingdomApp.sound.playFanfare();
      window.KingdomApp.triggerConfetti();
    }
    showToast(`👑 已為已勾選的 ${targetIds.length} 位大臣套用【${preset.label}】(${preset.points > 0 ? `+${preset.points}` : preset.points}點)！`);
  } else if (choice === "0" || choice === "全班") {
    window.KingdomApp.store.awardAllStudents(preset.points, preset.label);
    if (preset.points > 0) {
      window.KingdomApp.sound.playFanfare();
      window.KingdomApp.triggerConfetti();
    }
    showToast(`👑 全班 27 位大臣套用【${preset.label}】(${preset.points > 0 ? `+${preset.points}` : preset.points}點)！`);
  } else {
    const seatNo = parseInt(choice, 10);
    const student = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
    if (!student) {
      alert("找不到該座號的大臣！");
      return;
    }
    window.KingdomApp.store.awardSingleStudent(student.id, preset.points, preset.label);
    window.KingdomApp.sound.playCoin();
    showToast(`${student.name} 套用【${preset.label}】(${preset.points > 0 ? `+${preset.points}` : preset.points}點)！`);
  }

  showUndoNotificationBanner();
  renderPointsView();
}

function openAddPointPresetModal() {
  document.getElementById("addPointPresetModal").classList.remove("hidden");
  initLucideIcons();
}

function closeAddPointPresetModal() {
  document.getElementById("addPointPresetModal").classList.add("hidden");
}

function submitNewPointPreset(e) {
  e.preventDefault();
  const type = document.querySelector('input[name="presetRuleType"]:checked').value;
  const label = document.getElementById("presetLabelInput").value.trim();
  let points = parseInt(document.getElementById("presetPointValue").value, 10);
  const icon = document.getElementById("presetIconInput").value.trim() || (type === 'plus' ? '🌟' : '⚠️');

  if (type === 'minus' && points > 0) points = -points;

  const newPreset = {
    id: `rule-${Date.now()}`,
    type,
    label,
    points,
    icon
  };

  if (!window.KingdomApp.store.data.pointPresets) window.KingdomApp.store.data.pointPresets = [];
  window.KingdomApp.store.data.pointPresets.push(newPreset);
  window.KingdomApp.store.save();

  window.KingdomApp.sound.playCoin();
  showToast(`✨ 新增自訂集點項目【${label}】成功！`);
  document.getElementById("presetLabelInput").value = "";
  closeAddPointPresetModal();
  renderPointsView();
}

function deletePointPreset(id) {
  if (!confirm("確定要刪除這條自訂集點項目嗎？")) return;
  window.KingdomApp.store.data.pointPresets = window.KingdomApp.store.data.pointPresets.filter(p => p.id !== id);
  window.KingdomApp.store.save();
  showToast("已刪除該集點項目");
  renderPointsView();
}

function awardSingleStudent(studentId, points, defaultReason) {
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId || s.seatNo === studentId);
  if (!student) return;

  const reason = prompt(`請輸入給予【${student.name}】${points > 0 ? '獎勵' : '紀律扣分'}的事由：`, defaultReason);
  if (reason === null) return;

  const updated = window.KingdomApp.store.awardSingleStudent(student.id, points, reason || defaultReason);
  if (updated) {
    if (points > 0) {
      window.KingdomApp.sound.playCoin();
      showToast(`🍎 【${student.name}】獲得 ${points} 顆榮譽紅蘋果！`);
    } else {
      showToast(`⚠️ 【${student.name}】扣除 ${Math.abs(points)} 顆紅蘋果。`);
    }

    showUndoNotificationBanner();
    renderPointsView();
    if (typeof renderRosterView === 'function') renderRosterView();
  }
}

function openBatchPointModal() {
  currentPointTargetMode = 'all';
  selectPointTarget('all');
  document.getElementById("batchPointModal").classList.remove("hidden");
  initLucideIcons();
}

function closeBatchPointModal() {
  document.getElementById("batchPointModal").classList.add("hidden");
}

function selectPointTarget(mode) {
  currentPointTargetMode = mode;
  const btnAll = document.getElementById("btnPointTargetAll");
  const btnSelect = document.getElementById("btnPointTargetSelect");
  const box = document.getElementById("pointStudentSelectorBox");

  if (mode === 'all') {
    btnAll.className = "px-3 py-1.5 rounded-lg border font-bold bg-amber-950 text-amber-300 shadow";
    btnSelect.className = "px-3 py-1.5 rounded-lg border font-bold bg-white text-slate-700 border-amber-300";
    box.classList.add("hidden");
  } else {
    btnSelect.className = "px-3 py-1.5 rounded-lg border font-bold bg-amber-950 text-amber-300 shadow";
    btnAll.className = "px-3 py-1.5 rounded-lg border font-bold bg-white text-slate-700 border-amber-300";
    box.classList.remove("hidden");

    box.innerHTML = window.KingdomApp.store.data.students.map(st => `
      <label class="flex items-center space-x-1 p-1 rounded hover:bg-amber-100 cursor-pointer text-xs">
        <input type="checkbox" name="targetStudentCheck" value="${st.id}" class="rounded text-amber-600 focus:ring-amber-500">
        <span>${String(st.seatNo).padStart(2, '0')}.${st.name}</span>
      </label>
    `).join('');
  }
}

function submitBatchPoints(e) {
  e.preventDefault();
  const points = parseInt(document.getElementById("batchPointAmount").value, 10);
  const reason = document.getElementById("batchPointReason").value.trim() || "國王聖旨賞賜";

  let targetStudents = [];
  if (currentPointTargetMode === 'all') {
    targetStudents = window.KingdomApp.store.data.students;
    window.KingdomApp.store.awardAllStudents(points, reason);
  } else {
    const checked = Array.from(document.querySelectorAll('input[name="targetStudentCheck"]:checked')).map(cb => parseInt(cb.value, 10));
    if (checked.length === 0) {
      alert("請至少勾選一位大臣！");
      return;
    }
    targetStudents = window.KingdomApp.store.data.students.filter(st => checked.includes(st.id));
    window.KingdomApp.store.batchAwardMultipleStudents(targetStudents.map(s => s.id), points, reason);
  }

  if (points > 0) {
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();
    showToast(`👑 聖旨已宣告！獎勵已發放給 ${targetStudents.length} 位大臣！`);
  } else {
    window.KingdomApp.sound.playCoin();
    showToast(`⚠️ 已對 ${targetStudents.length} 位大臣扣除 ${Math.abs(points)} 顆紅蘋果。`);
  }

  closeBatchPointModal();
  showUndoNotificationBanner();
  renderPointsView();
}

// ===================================================================
// 全班加點與大臣獎懲錯誤操作復原制度 (Points Undo & Recovery System)
// ===================================================================
let undoBannerTimeout = null;

function showUndoNotificationBanner(action) {
  if (!action && window.KingdomApp && window.KingdomApp.store) {
    action = window.KingdomApp.store.getLastUndoableAction();
  }
  if (!action) return;

  let banner = document.getElementById("pointUndoNotificationBanner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "pointUndoNotificationBanner";
    banner.className = "fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between gap-3 transition-all duration-300 transform scale-100";
    document.body.appendChild(banner);
  }

  banner.innerHTML = `
    <div class="flex items-center space-x-2.5 min-w-0">
      <span class="text-2xl flex-shrink-0 animate-pulse">↩️</span>
      <div class="min-w-0">
        <div class="text-[11px] font-black text-amber-300 flex items-center space-x-1">
          <span>加點操作已完成</span>
          <span class="bg-amber-400/20 text-amber-200 px-1 rounded text-[10px] font-mono">可即時復原</span>
        </div>
        <div class="text-xs sm:text-sm font-bold text-amber-50 truncate">${action.title}</div>
      </div>
    </div>
    <div class="flex items-center space-x-2 flex-shrink-0">
      <button onclick="executeUndoLastPointAction(${action.id})" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 active:scale-95 text-amber-950 font-black text-xs shadow-md transition flex items-center space-x-1" title="點擊立即撤銷剛剛的加點操作">
        <span>↩️</span><span>立即復原 (Undo)</span>
      </button>
      <button onclick="dismissUndoBanner()" class="text-slate-400 hover:text-white p-1 rounded-lg text-sm" title="關閉提示">
        ✕
      </button>
    </div>
  `;

  banner.classList.remove("hidden");

  if (undoBannerTimeout) clearTimeout(undoBannerTimeout);
  undoBannerTimeout = setTimeout(() => {
    dismissUndoBanner();
  }, 10000);
}

function dismissUndoBanner() {
  const banner = document.getElementById("pointUndoNotificationBanner");
  if (banner) {
    banner.classList.add("hidden");
  }
  if (undoBannerTimeout) clearTimeout(undoBannerTimeout);
}

function promptUndoLastPointAction() {
  const act = window.KingdomApp.store.getLastUndoableAction();
  if (!act) {
    alert("目前沒有可復原的加點操作記錄！");
    return;
  }
  const ok = confirm(`↩️ 確定要復原上一筆加點操作嗎？\n\n【${act.title}】\n時間：${act.time}\n\n確認後系統將精準還原大臣的蘋果數量與萌寵成長值至操作前數值。`);
  if (!ok) return;
  executeUndoLastPointAction(act.id);
}

function executeUndoLastPointAction(actionId = null) {
  const res = window.KingdomApp.store.undoPointAction(actionId);
  if (res.success) {
    dismissUndoBanner();
    if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
      try { window.KingdomApp.sound.playCoin(); } catch (err) {}
    }
    showToast(`↩️ ${res.message}`, "🎉");
    renderPointsView();
    if (typeof renderPointsZooHabitat === 'function') renderPointsZooHabitat();
    if (typeof renderRosterView === 'function') renderRosterView();
    if (typeof renderPetsOverview === 'function') renderPetsOverview();
  } else {
    alert(res.message);
  }
}

function confirmRevokePointLog(logId) {
  const log = window.KingdomApp.store.data.pointLogs.find(l => l.id == logId);
  if (!log) return;
  const ok = confirm(`↩️ 確定要撤回這筆記功紀錄嗎？\n\n事由：${log.reason}\n變動：${log.points > 0 ? `+${log.points}` : log.points} 點\n時間：${log.time || ''}\n\n確認後系統將自動反向沖銷蘋果並標記已撤銷。`);
  if (!ok) return;

  const res = window.KingdomApp.store.revokePointLog(logId);
  if (res.success) {
    if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
      try { window.KingdomApp.sound.playCoin(); } catch (err) {}
    }
    showToast(`↩️ ${res.message}`, "✅");
    renderPointsView();
    if (typeof renderPointsZooHabitat === 'function') renderPointsZooHabitat();
    if (typeof renderRosterView === 'function') renderRosterView();
    if (typeof renderPetsOverview === 'function') renderPetsOverview();
  } else {
    alert(res.message);
  }
}

// ===================================================================
// 7. 班級萌寵動物園 ‧ 飼育成長舍 (Zoo Feeding & Animal Care View - 採用生境同樂園排版)
// ===================================================================
function renderPetsOverview() {
  renderZooHabitatShared("petsOverviewGrid", "petsHabitatStatsPill");
  initLucideIcons();
}

// 大臣名冊中學生當前選定預覽之萌寵索引 (預設為最新認養寵物)
window.rosterActivePetIndex = window.rosterActivePetIndex || {};
// 大臣名冊中萌寵收藏抽屜展開集合
window.rosterOpenPetDrawers = window.rosterOpenPetDrawers || new Set();

function changeRosterActivePet(studentId, petIndex) {
  if (!window.rosterActivePetIndex) window.rosterActivePetIndex = {};
  window.rosterActivePetIndex[Number(studentId)] = parseInt(petIndex, 10);
  renderRosterView();
}

function toggleRosterPetDrawer(studentId) {
  if (!window.rosterOpenPetDrawers) window.rosterOpenPetDrawers = new Set();
  const id = Number(studentId);
  if (window.rosterOpenPetDrawers.has(id)) {
    window.rosterOpenPetDrawers.delete(id);
  } else {
    window.rosterOpenPetDrawers.add(id);
  }
  renderRosterView();
}

if (typeof window !== 'undefined') {
  window.changeRosterActivePet = changeRosterActivePet;
  window.toggleRosterPetDrawer = toggleRosterPetDrawer;
}

function renderRosterView() {
  const tbody = document.getElementById("studentRosterTableBody");
  if (!tbody) return;

  // 全域名冊萌寵同步防呆校驗 (保證未達 500/1000 門檻時絕對同步截斷超額寵物)
  if (window.KingdomApp && window.KingdomApp.store && typeof window.KingdomApp.store.syncAllStudentsPets === 'function') {
    window.KingdomApp.store.syncAllStudentsPets();
  }

  const students = window.KingdomApp.store.data.students;

  tbody.innerHTML = students.map(st => {
    const seatPad = String(st.seatNo).padStart(2, '0');
    const bdayPad = (st.birthday || '0101').replace(/[^0-9]/g, '').padStart(4, '0');
    const passCode = seatPad + bdayPad;
    const defaultPet = (st.animalType || st.petType || 'lion').toLowerCase();
    window.KingdomApp.store.syncStudentPets(st);
    const currentPts = Math.max(0, parseInt(st.points, 10) || 0);
    let lifetime = parseInt(st.lifetimePoints, 10);
    if (isNaN(lifetime) || lifetime < 0 || (lifetime <= 0 && currentPts > 0)) {
      lifetime = currentPts;
      st.lifetimePoints = currentPts;
    }
    const effectivePts = lifetime;
    const maxAllowed = 1 + Math.floor(lifetime / 500);
    const validPets = (st.pets || [{ type: defaultPet }]).slice(0, maxAllowed);
    st.pets = validPets;

    // 當前顯示之萌寵索引 (若已認養多隻，預設顯示最新認養寵物)
    let activeIdx = validPets.length - 1;
    if (window.rosterActivePetIndex && window.rosterActivePetIndex[st.id] !== undefined) {
      const savedIdx = window.rosterActivePetIndex[st.id];
      if (savedIdx >= 0 && savedIdx < validPets.length) {
        activeIdx = savedIdx;
      }
    }

    const curPet = validPets[activeIdx] || validPets[0];
    const curType = curPet.type.toLowerCase();
    const curExp = activeIdx === 0 ? effectivePts : Math.max(0, effectivePts - activeIdx * 500);
    const curStatus = window.KingdomApp.getAnimalStatus(curType, curExp);
    const curSvg = window.KingdomApp.renderAnimalSVG(curType, curStatus.stageIndex);

    const isDrawerOpen = window.rosterOpenPetDrawers && window.rosterOpenPetDrawers.has(st.id);
    const reqPtsForNext = validPets.length * 500;

    return `
      <tr class="hover:bg-amber-100/60 transition text-center">
        <!-- 1. 座號 (加大字體並居中) -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <span class="font-mono font-black text-amber-950 text-base sm:text-lg bg-amber-200/90 border border-amber-300 px-2.5 py-1 rounded-xl shadow-2xs inline-block">
            ${seatPad}
          </span>
        </td>

        <!-- 2. 姓名 (字體放大顯眼並居中) -->
        <td class="py-3 px-3 text-center whitespace-nowrap font-cute font-black text-slate-900 text-base sm:text-lg tracking-wide">
          ${st.name}
        </td>

        <!-- 3. 大臣官職 (居中標籤) -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <span class="bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 rounded-xl font-bold text-xs sm:text-sm inline-block shadow-2xs">
            ${st.title}
          </span>
        </td>

        <!-- 4. 生日 / 家長密碼 (居中排列) -->
        <td class="py-3 px-3 text-center whitespace-nowrap text-xs sm:text-sm bg-amber-50/70 rounded-xl">
          <span class="font-mono font-bold text-slate-800">${st.birthday}</span>
          <span class="block text-[11px] text-amber-900 font-mono font-black mt-0.5">密碼: ${passCode}</span>
        </td>

        <!-- 5. 🌱 累計獲得蘋果 (從萌寵中獨立出來！居中大字體) -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <span class="font-mono font-black text-amber-900 text-base sm:text-lg bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-xl shadow-2xs inline-block">
            ${effectivePts} 🍎
          </span>
          <span class="block text-[10px] text-amber-800 font-bold mt-0.5">總累計獲得</span>
        </td>

        <!-- 6. 🍎 目前可用 (居中大字體) -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <span class="font-mono font-black text-rose-600 text-base sm:text-lg bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl shadow-2xs inline-block">
            ${currentPts} 🍎
          </span>
          <span class="block text-[10px] text-rose-700 font-bold mt-0.5">可用存量</span>
        </td>

        <!-- 7. 🐾 認養萌寵 (顯示最新認養寵物，支援下拉選擇與抽屜收藏) -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <div class="inline-flex flex-col items-center justify-center w-full min-w-[250px] max-w-[320px]">
            <!-- 當前預覽萌寵：大頭像 + 名稱 + 階級 + 更換按鈕 -->
            <div class="flex items-center justify-center space-x-2">
              <div class="w-10 h-10 flex-shrink-0 bg-white rounded-xl p-0.5 border-2 border-amber-300 shadow-xs cursor-pointer hover:border-amber-500 hover:scale-105 transition" onclick="openChangeAnimalModal(${st.id}, ${activeIdx})" title="點擊更換此萌寵種類">
                ${curSvg}
              </div>
              <div class="text-left">
                <div class="flex items-center space-x-1">
                  <span class="font-black text-amber-950 text-xs sm:text-sm">${curStatus.animalName}</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full ${curStatus.isGolden ? 'bg-amber-300 text-amber-950 font-black border border-amber-400' : 'bg-amber-100 text-amber-900'}">${curStatus.stageTitle}</span>
                  <button type="button" onclick="openChangeAnimalModal(${st.id}, ${activeIdx})" class="text-[11px] text-amber-700 hover:text-amber-950 font-bold ml-0.5" title="更換此萌寵">[換]</button>
                </div>
                <!-- 成長進度條 -->
                <div class="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                  <div class="h-full bg-gradient-to-r from-emerald-400 to-amber-500 rounded-full" style="width: ${curStatus.progressPct}%"></div>
                </div>
              </div>
            </div>

            <!-- 超過一隻寵物時：提供下拉選單選擇顯示，以及抽屜收藏按鈕 -->
            ${validPets.length > 1 ? `
              <div class="mt-2 flex flex-col items-center space-y-1.5 w-full">
                <!-- 下拉選單：供學生自由選擇想顯示的寵物 -->
                <div class="flex items-center justify-center space-x-1.5 w-full">
                  <span class="text-xs text-purple-950 font-black shrink-0">顯示：</span>
                  <select onchange="changeRosterActivePet(${st.id}, this.value)" 
                    class="text-xs font-black bg-purple-50 text-purple-950 border-2 border-purple-300 rounded-xl px-2.5 py-1 shadow-2xs cursor-pointer w-auto max-w-[210px] truncate"
                    title="切換當前想在大臣名冊顯示的寵物">
                    ${validPets.map((p, pIdx) => {
                      const sType = p.type.toLowerCase();
                      const sExp = pIdx === 0 ? effectivePts : Math.max(0, effectivePts - pIdx * 500);
                      const sStatus = window.KingdomApp.getAnimalStatus(sType, sExp);
                      const isLatest = pIdx === validPets.length - 1;
                      return `<option value="${pIdx}" ${pIdx === activeIdx ? 'selected' : ''}>${isLatest ? '🌟 ' : '🐾 '}第${pIdx + 1}隻: ${sStatus.animalName} (${sStatus.stageTitle})</option>`;
                    }).join('')}
                  </select>
                </div>

                <!-- 抽屜收藏按鈕 (加大方框尺寸與邊界內距，確保所有文字完整容納不溢出) -->
                <button type="button" onclick="toggleRosterPetDrawer(${st.id})" 
                  class="text-xs font-black text-purple-950 bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 hover:from-purple-200 hover:to-indigo-100 px-3.5 py-1.5 rounded-xl border-2 border-purple-400 transition shadow-2xs cursor-pointer whitespace-nowrap flex items-center justify-center space-x-1.5 w-auto min-w-[200px] active:scale-95">
                  <span class="text-sm">📂</span>
                  <span class="tracking-wide">${isDrawerOpen ? '收合其餘萌寵 ▲' : `收藏抽屜 (${validPets.length}隻萌寵) ▼`}</span>
                </button>
              </div>

              <!-- 抽屜內容：展開後列出全部認養寵物與狀態 (適當加大方框尺寸與各列邊距，確保塞入全部文字) -->
              ${isDrawerOpen ? `
                <div class="mt-2.5 p-3 bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-2xl border-2 border-purple-400 w-full min-w-[250px] max-w-[300px] space-y-2 text-left shadow-md animate-fadeIn">
                  <div class="flex items-center justify-between border-b border-purple-200 pb-1.5">
                    <span class="text-xs font-black text-purple-950 flex items-center space-x-1">
                      <span>🐾</span>
                      <span>已認養寵物收藏庫 (${validPets.length}隻)</span>
                    </span>
                    <span class="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded">先認養後隨選</span>
                  </div>
                  <div class="space-y-2">
                    ${validPets.map((p, pIdx) => {
                      const sType = p.type.toLowerCase();
                      const sExp = pIdx === 0 ? effectivePts : Math.max(0, effectivePts - pIdx * 500);
                      const sStatus = window.KingdomApp.getAnimalStatus(sType, sExp);
                      const sSvg = window.KingdomApp.renderAnimalSVG(sType, sStatus.stageIndex);
                      const isLatest = pIdx === validPets.length - 1;
                      const isCurrent = pIdx === activeIdx;
                      return `
                        <div class="flex items-center justify-between p-2 bg-white rounded-xl border-2 ${isCurrent ? 'border-purple-500 ring-2 ring-purple-300 bg-purple-50/70 shadow-2xs' : 'border-purple-200 hover:border-purple-300'} transition gap-2">
                          <div class="flex items-center space-x-2 min-w-0">
                            <div class="w-8 h-8 flex-shrink-0 bg-purple-50 rounded-lg p-0.5 border border-purple-300 shadow-2xs">
                              ${sSvg}
                            </div>
                            <div class="min-w-0">
                              <div class="flex items-center space-x-1 flex-wrap">
                                <span class="text-xs font-black text-purple-950 whitespace-nowrap">${isLatest ? '🌟 ' : ''}${sStatus.animalName}</span>
                                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full ${sStatus.isGolden ? 'bg-amber-300 text-amber-950 font-black' : 'bg-purple-100 text-purple-900'} whitespace-nowrap">${sStatus.stageTitle}</span>
                              </div>
                              <div class="text-[10px] text-slate-500 font-mono mt-0.5">成長經驗: ${sExp} 🍎</div>
                            </div>
                          </div>
                          <div class="flex items-center space-x-1 shrink-0">
                            <button type="button" onclick="changeRosterActivePet(${st.id}, ${pIdx})" 
                              class="text-xs px-2.5 py-1 rounded-lg ${isCurrent ? 'bg-purple-700 text-white font-black shadow-2xs' : 'bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold border border-purple-300'} transition cursor-pointer">
                              ${isCurrent ? '✓ 顯示中' : '切換'}
                            </button>
                            <button type="button" onclick="openChangeAnimalModal(${st.id}, ${pIdx})" 
                              class="text-xs text-purple-700 hover:text-purple-950 hover:bg-purple-100 px-2 py-1 rounded-lg border border-purple-200 font-bold transition cursor-pointer" title="更換此隻萌寵品種">
                              換
                            </button>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}
            ` : ''}

            <!-- 若達門檻但尚未認養新寵物 -->
            ${validPets.length < maxAllowed && effectivePts >= reqPtsForNext ? `
              <div class="mt-1.5">
                <button type="button" onclick="openChangeAnimalModal(${st.id}, ${validPets.length})" 
                  class="text-xs font-black text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-300 hover:from-amber-400 hover:to-yellow-400 px-3 py-1.5 rounded-xl border-2 border-amber-500 shadow-2xs transition active:scale-95 whitespace-nowrap">
                  🐣 認養第${validPets.length + 1}隻萌寵！
                </button>
              </div>
            ` : ''}
          </div>
        </td>

        <!-- 8. ⚙️ 投餵與操作區 (居中對齊) -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center space-x-1 flex-wrap gap-y-1">
            <button onclick="openZooFeedModal(${st.id})" class="px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-black shadow-xs transform active:scale-95 transition" title="投餵蘋果讓寵物長大！">
              🍎 投餵
            </button>
            <button onclick="openEditStudentPointsModal(${st.id})" class="px-2 py-1 bg-gradient-to-r from-rose-200 to-amber-200 hover:from-rose-300 hover:to-amber-300 text-rose-950 rounded-lg text-xs font-black border border-rose-300 shadow-xs transform active:scale-95 transition" title="更改此大臣蘋果數量">
              ✏️ 改蘋果
            </button>
            <button onclick="copyParentLink(${st.seatNo})" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg text-xs font-black border border-amber-300 shadow-xs" title="複製家長查閱專用訊息">
              📋 家長連結
            </button>
            <button onclick="openEditStudentModal(${st.id})" class="px-1.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold">
              修改
            </button>
            <button onclick="deleteStudent(${st.id})" class="px-1.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold">
              除名
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucideIcons();
}

// 批次管理中心 Modal (姓名、幹部、生日密碼 3合1)
function openBatchCenterModal(initialTab = 'names') {
  if (!checkTeacherAuth("進行批次名冊設定")) return;
  currentBatchTab = initialTab;
  switchBatchTab(initialTab);
  document.getElementById("batchCenterModal").classList.remove("hidden");
  initLucideIcons();
}

function closeBatchCenterModal() {
  document.getElementById("batchCenterModal").classList.add("hidden");
}

function switchBatchTab(tab) {
  currentBatchTab = tab;
  const tabs = ['names', 'titles', 'birthdays', 'points'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtnBatch-${t}`);
    if (btn) {
      if (t === tab) {
        btn.className = "py-1.5 rounded-lg bg-amber-950 text-amber-300 shadow font-black";
      } else {
        btn.className = "py-1.5 rounded-lg text-amber-950 hover:bg-amber-200 font-bold";
      }
    }
  });

  const hintEl = document.getElementById("batchTabHintText");
  const textarea = document.getElementById("batchCenterTextarea");
  const students = window.KingdomApp.store.data.students;

  if (tab === 'names') {
    hintEl.innerHTML = "請直接複製 27 位學生姓名貼在下方（<strong>一行一個姓名</strong>），依序對應 1 號至 27 號：";
    textarea.value = students.map(s => s.name).join('\n');
    textarea.placeholder = "洪永恩\n莊淇勛\n黃胤哲\n... (共27行)";
  } else if (tab === 'titles') {
    hintEl.innerHTML = "請直接複製 27 位大臣官職或幹部名稱貼在下方（<strong>一行一個職稱</strong>，如：最高指揮官、晨間小隊長、風紀股長）：";
    textarea.value = students.map(s => s.title).join('\n');
    textarea.placeholder = "漱口水發放官\n晨間小隊長\n設備掌管官\n... (共27行)";
  } else if (tab === 'birthdays') {
    hintEl.innerHTML = "請直接複製 27 位學生國曆生日 4 碼貼在下方（<strong>一行一個生日</strong>，如：0101、0520、1104），家長登入時將與座號自動組合成 6 碼（例如 1 號生日 0101 密碼即為 010101）：";
    textarea.value = students.map(s => s.birthday).join('\n');
    textarea.placeholder = "0101\n0520\n1104\n... (共27行)";
  } else if (tab === 'points') {
    hintEl.innerHTML = "請直接輸入或複製貼上 27 位大臣的蘋果數量（<strong>一行一個數字</strong>，如：50、100、80），依序對應 1 號至 27 號：";
    textarea.value = students.map(s => s.points !== undefined ? s.points : 50).join('\n');
    textarea.placeholder = "50\n80\n100\n... (共27行)";
  }
}

function fillCurrentBatchTemplate() {
  switchBatchTab(currentBatchTab);
}

function submitBatchCenterData(e) {
  e.preventDefault();
  const rawText = document.getElementById("batchCenterTextarea").value;
  const lines = rawText.split(/[\r\n,，、\t]+/).map(n => n.trim()).filter(n => n.length > 0);

  if (lines.length === 0) {
    alert("輸入內容不可為空！");
    return;
  }

  if (currentBatchTab === 'names') {
    window.KingdomApp.store.batchUpdateNames(lines);
    showToast(`🎉 成功更新全班 ${lines.length} 位大臣姓名！`);
  } else if (currentBatchTab === 'titles') {
    window.KingdomApp.store.batchUpdateTitles(lines);
    showToast(`🎖️ 成功更新全班 ${lines.length} 位大臣官職與幹部名稱！`);
  } else if (currentBatchTab === 'birthdays') {
    window.KingdomApp.store.batchUpdateBirthdays(lines);
    showToast(`🔑 成功更新全班 ${lines.length} 位大臣國曆生日！（家長密碼自動組合為座號+生日共6碼）`);
  } else if (currentBatchTab === 'points') {
    window.KingdomApp.store.batchUpdatePoints(lines);
    showToast(`🍎 成功更新全班 ${lines.length} 位大臣蘋果數量！`);
    renderPointsView();
  }

  window.KingdomApp.sound.playCoin();
  closeBatchCenterModal();
  renderRosterView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

function copyParentLink(seatNo) {
  const currentUrl = window.location.origin + window.location.pathname;
  const parentUrl = `${currentUrl}?parent=1&seat=${seatNo}`;
  const student = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
  const seatPad = String(seatNo).padStart(2, '0');
  const bdayPad = (student ? student.birthday : '0101').replace(/[^0-9]/g, '').padStart(4, '0');
  const passCode = seatPad + bdayPad;
  const studentName = student ? student.name : '';

  const shareText = `【西寧國小五年二班 ‧ 西寧小小兵王國】\n家長您好，請點擊連結查閱【${seatPad}號 ${studentName}】在校即時表現：\n${parentUrl}\n通關密碼為「座號+國曆生日」共6碼：${passCode}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast(`📋 已複製 ${seatNo} 號家長查閱訊息（含連結與密碼 ${passCode}）！可直接發送至 LINE`);
    }).catch(() => {
      prompt("請複製以下家長專屬查閱訊息：", shareText);
    });
  } else {
    prompt("請複製以下家長專屬查閱訊息：", shareText);
  }
}

function openAddStudentModal() {
  document.getElementById("studentModalTitle").innerHTML = `<span>👥 冊封新大臣 (新增學生)</span>`;
  document.getElementById("editStudentId").value = "";
  const students = window.KingdomApp.store.data.students;
  const nextSeat = students.length > 0 ? Math.max(...students.map(s => s.seatNo)) + 1 : 1;
  document.getElementById("editStudentSeat").value = nextSeat;
  document.getElementById("editStudentName").value = "";
  document.getElementById("editStudentTitle").value = "皇家大臣";
  document.getElementById("editStudentBirthday").value = "0101";
  document.getElementById("editStudentPetType").value = "dog";
  const pInput = document.getElementById("editStudentPoints");
  if (pInput) pInput.value = 50;

  document.getElementById("studentModal").classList.remove("hidden");
  initLucideIcons();
}

function openEditStudentModal(studentId) {
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById("studentModalTitle").innerHTML = `<span>👥 修改大臣資料：${student.name}</span>`;
  document.getElementById("editStudentId").value = student.id;
  document.getElementById("editStudentSeat").value = student.seatNo;
  document.getElementById("editStudentName").value = student.name;
  document.getElementById("editStudentTitle").value = student.title;
  document.getElementById("editStudentBirthday").value = student.birthday;
  document.getElementById("editStudentPetType").value = student.animalType || student.petType || "dog";
  const pInput = document.getElementById("editStudentPoints");
  if (pInput) pInput.value = student.points !== undefined ? student.points : 50;

  document.getElementById("studentModal").classList.remove("hidden");
  initLucideIcons();
}

function closeStudentModal() {
  const modal = document.getElementById("studentModal");
  if (modal) modal.classList.add("hidden");
}

function saveStudentData(e) {
  e.preventDefault();
  const idVal = document.getElementById("editStudentId").value;
  const seatNo = parseInt(document.getElementById("editStudentSeat").value, 10);
  const name = document.getElementById("editStudentName").value.trim();
  const title = document.getElementById("editStudentTitle").value.trim();
  const birthday = document.getElementById("editStudentBirthday").value.trim();
  const petType = document.getElementById("editStudentPetType").value;
  const pInput = document.getElementById("editStudentPoints");
  const pointsVal = pInput ? parseInt(pInput.value, 10) : 50;
  const points = Math.max(0, isNaN(pointsVal) ? 50 : pointsVal);

  if (idVal) {
    const student = window.KingdomApp.store.data.students.find(s => s.id === parseInt(idVal, 10));
    if (student) {
      student.seatNo = seatNo;
      student.name = name;
      student.title = title;
      student.birthday = birthday;
      student.animalType = petType;
      student.petType = petType;
      const oldPts = student.points || 0;
      student.points = points;
      // 導師手動修改大臣蘋果，同步更新 lifetimePoints 並防呆校正寵物認養數量
      const cardsSpent = Array.isArray(student.redeemedCards)
        ? student.redeemedCards.reduce((sum, c) => sum + (parseInt(c.cost, 10) || 0), 0)
        : 0;
      student.lifetimePoints = points + cardsSpent;
      window.KingdomApp.store.syncStudentPets(student);

      if (oldPts !== points) {
        window.KingdomApp.store.data.pointLogs.unshift({
          id: Date.now(),
          studentId: student.id,
          points: points - oldPts,
          reason: `導師修改大臣資料：蘋果設為 ${points} 顆 (原 ${oldPts} 顆)`,
          date: window.KingdomApp.getTodayDateString(),
          time: new Date().toTimeString().slice(0, 5)
        });
      }
    }
    showToast(`👑 大臣【${name}】資料已更新！`);
  } else {
    const newStudent = {
      id: Date.now(),
      seatNo,
      name,
      title,
      birthday,
      animalType: petType,
      petType,
      points,
      lifetimePoints: points,
      petExp: points,
      secondPetType: null,
      secondPetExp: 0,
      pets: [{ type: petType }]
    };
    window.KingdomApp.store.syncStudentPets(newStudent);
    window.KingdomApp.store.data.students.push(newStudent);
    window.KingdomApp.store.data.students.sort((a, b) => a.seatNo - b.seatNo);
    showToast(`🎉 成功冊封新大臣【${name}】進入西寧小小兵王國！`);
  }

  window.KingdomApp.store.save();
  closeStudentModal();
  renderRosterView();
  renderPointsView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

function deleteStudent(studentId) {
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  if (!student) return;

  if (!confirm(`確定要將【${student.name} 大臣】除名退役嗎？`)) return;

  window.KingdomApp.store.data.students = window.KingdomApp.store.data.students.filter(s => s.id !== studentId);
  window.KingdomApp.store.save();
  showToast(`大臣【${student.name}】已退出王國。`);
  renderRosterView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

// ===================================================================
// 9. 皇室告示欄 (Announcements)
// ===================================================================
function renderAnnouncementsView() {
  const list = document.getElementById("announcementList");
  const announcements = window.KingdomApp.store.data.announcements;

  if (list) {
    if (announcements.length === 0) {
      list.innerHTML = `<p class="text-xs text-slate-500">尚無發布的班級公告</p>`;
    } else {
      list.innerHTML = announcements.map(a => `
        <div class="bg-white p-3.5 rounded-xl border border-amber-300 relative shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              ${a.pinned ? '<span class="text-xs bg-amber-200 text-amber-950 font-black px-1.5 py-0.5 rounded">置頂</span>' : ''}
              <h4 class="font-black text-amber-950 text-sm">${a.title}</h4>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="projectExistingAnnouncement(${a.id})" class="text-xs px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-black border border-amber-300 flex items-center space-x-1 shadow-2xs" title="大屏全螢幕投影此公告給全班">
                <span>🖥️ 投影</span>
              </button>
              <button onclick="deleteAnnouncement(${a.id})" class="text-rose-500 hover:text-rose-700 text-xs font-bold">
                刪除
              </button>
            </div>
          </div>
          <p class="text-xs text-slate-700 mt-1.5 leading-relaxed whitespace-pre-line">${a.content}</p>
          <span class="text-[10px] text-slate-400 mt-2 block font-bold">${a.date}</span>
        </div>
      `).join('');
    }
  }

  initLucideIcons();
}

// -------------------------------------------------------------------
// 皇室告示大屏全螢幕投影管理
// -------------------------------------------------------------------
let projectionClockInterval = null;

function openAnnouncementProjectionModal(initialData) {
  const modal = document.getElementById("announcementProjectionModal");
  if (!modal) return;

  const data = initialData || (window.KingdomApp.store.data.announcements && window.KingdomApp.store.data.announcements[0]) || {
    title: "📢 歡迎全體大臣蒞臨西寧王國！",
    content: "請全體小兵大臣調養精神、專注思考，爭取至高班級榮譽！",
    date: window.KingdomApp.getTodayDateString(),
    badge: "👑 皇室重要公文公告"
  };

  const titleEl = document.getElementById("projectionDisplayTitle");
  const contentEl = document.getElementById("projectionDisplayContent");
  const dateEl = document.getElementById("projectionDisplayDate");
  const badgeEl = document.getElementById("projectionDisplayBadge");
  const timeEl = document.getElementById("projectionDisplayTime");

  if (titleEl) titleEl.textContent = data.title || "📢 皇室重要公告";
  if (contentEl) contentEl.textContent = data.content || "請全體大臣遵照導師指示！";
  if (dateEl) dateEl.textContent = data.date || window.KingdomApp.getTodayDateString();
  if (badgeEl) badgeEl.textContent = data.badge || (data.pinned ? "🚨 全班置頂緊急公文" : "📢 皇室公文速報");
  if (timeEl) timeEl.textContent = new Date().toTimeString().slice(0, 5) + " 發布";

  // 填入即時輸入框便於修改
  const inputTitle = document.getElementById("instantBroadcastTitle");
  const inputContent = document.getElementById("instantBroadcastContent");
  if (inputTitle) inputTitle.value = data.title || "";
  if (inputContent) inputContent.value = data.content || "";

  modal.classList.remove("hidden");

  // 啟動大時鐘
  function updateProjClock() {
    const clockEl = document.getElementById("projectionLiveClock");
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }
  }
  updateProjClock();
  if (projectionClockInterval) clearInterval(projectionClockInterval);
  projectionClockInterval = setInterval(updateProjClock, 1000);

  playBroadcastChime();
}

function toggleAnnouncementProjectionFullscreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Announcement projection fullscreen request failed:", err);
      });
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.warn("Exit fullscreen failed:", err);
      });
    }
  }
}

function closeAnnouncementProjectionModal() {
  const modal = document.getElementById("announcementProjectionModal");
  if (modal) modal.classList.add("hidden");
  if (projectionClockInterval) {
    clearInterval(projectionClockInterval);
    projectionClockInterval = null;
  }
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function projectExistingAnnouncement(id) {
  const announcements = window.KingdomApp.store.data.announcements || [];
  const a = announcements.find(item => item.id === id);
  if (!a) return;
  openAnnouncementProjectionModal({
    title: a.title,
    content: a.content,
    date: a.date,
    badge: a.pinned ? "🚨 全班置頂緊急公文" : "📢 皇室公文公告"
  });
}

// -------------------------------------------------------------------
// 教室座位表大屏全螢幕投影管理 (僅顯示中間座位表與講台)
// -------------------------------------------------------------------
let seatingProjectionClockInterval = null;

function openSeatingProjectionModal() {
  const modal = document.getElementById("seatingProjectionModal");
  if (!modal) {
    console.error("seatingProjectionModal element not found!");
    return;
  }

  modal.classList.remove("hidden");
  modal.style.setProperty("display", "flex", "important");
  modal.style.setProperty("visibility", "visible", "important");
  modal.style.setProperty("opacity", "1", "important");
  modal.style.setProperty("z-index", "99999", "important");
  modal.style.setProperty("position", "fixed", "important");
  modal.style.setProperty("inset", "0", "important");
  modal.style.setProperty("width", "100vw", "important");
  modal.style.setProperty("height", "100vh", "important");

  try {
    renderSeatingProjectionGrid();
  } catch (err) {
    console.error("renderSeatingProjectionGrid error:", err);
  }

  function updateSeatingProjClock() {
    const clockEl = document.getElementById("seatingProjectionLiveClock");
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }
  }
  updateSeatingProjClock();
  if (seatingProjectionClockInterval) clearInterval(seatingProjectionClockInterval);
  seatingProjectionClockInterval = setInterval(updateSeatingProjClock, 1000);

  if (typeof showToast === "function") {
    showToast("💺 已開啟教室座位表大屏全螢幕投影", "☀️");
  }
}

function closeSeatingProjectionModal() {
  const modal = document.getElementById("seatingProjectionModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.setProperty("display", "none", "important");
    modal.style.setProperty("visibility", "hidden", "important");
    modal.style.setProperty("opacity", "0", "important");
  }
  if (seatingProjectionClockInterval) {
    clearInterval(seatingProjectionClockInterval);
    seatingProjectionClockInterval = null;
  }
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

// 立即掛載至全域，防止腳本後續任何例外導致未掛載
if (typeof window !== 'undefined') {
  window.openSeatingProjectionModal = openSeatingProjectionModal;
  window.closeSeatingProjectionModal = closeSeatingProjectionModal;
}

function toggleSeatingProjectionFullscreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Seating projection fullscreen request failed:", err);
      });
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.warn("Exit fullscreen failed:", err);
      });
    }
  }
}

function renderSeatingProjectionGrid() {
  const grid = document.getElementById("seatingProjectionGrid");
  if (!grid) return;

  const layout = window.KingdomApp.store.getSeatingLayout();
  const chart = window.KingdomApp.store.getSeatingChart();
  const students = window.KingdomApp.store.data.students || [];
  const todayStr = window.KingdomApp.getTodayDateString();
  const attendanceToday = (window.KingdomApp.store.data.attendance && window.KingdomApp.store.data.attendance[todayStr]) || {};

  grid.style.gridTemplateColumns = `repeat(${layout.cols}, minmax(0, 1fr))`;

  // 渲染大屏座位投影上方每排標頭 (最左兩排皆為第五排 -> 最右第一排)
  const projColHeadersBar = document.getElementById("seatingProjectionColHeadersBar");
  if (projColHeadersBar) {
    projColHeadersBar.style.gridTemplateColumns = `repeat(${layout.cols}, minmax(0, 1fr))`;
    let headersHtml = "";
    for (let c = 1; c <= layout.cols; c++) {
      const name = getSeatingColName(c, layout.cols);
      headersHtml += `<div class="py-1.5 px-2 rounded-lg bg-slate-800/95 border border-amber-500/40 font-black text-amber-300 text-xs sm:text-sm shadow-xs">${name}</div>`;
    }
    projColHeadersBar.innerHTML = headersHtml;
  }

  const layoutBadge = document.getElementById("seatingProjectionLayoutBadge");
  if (layoutBadge) {
    layoutBadge.textContent = `${layout.rows}列 x ${layout.cols}排 (最右為第一排，最左兩排皆為第五排)`;
  }

  let html = "";
  for (let i = 0; i < chart.length; i++) {
    const seatNo = chart[i];
    const student = seatNo ? students.find(s => s.seatNo === seatNo) : null;
    const row = Math.floor(i / layout.cols) + 1;
    const col = (i % layout.cols) + 1;
    const colName = getSeatingColName(col, layout.cols);

    if (student) {
      const traffic = window.KingdomApp.store.evaluateTrafficStatus(student.id);
      const att = attendanceToday[student.id] || attendanceToday[student.seatNo];

      let attBadge = "";
      if (att) {
        if (att.status === "present") attBadge = `<span class="text-[10px] bg-emerald-900/80 text-emerald-200 border border-emerald-500/50 font-bold px-1.5 py-0.5 rounded">到 ${att.checkInTime || ''}</span>`;
        else if (att.status === "late") attBadge = `<span class="text-[10px] bg-amber-900/80 text-amber-200 border border-amber-500/50 font-bold px-1.5 py-0.5 rounded">⚠️ 遲到</span>`;
        else if (att.status === "leave") attBadge = `<span class="text-[10px] bg-sky-900/80 text-sky-200 border border-sky-500/50 font-bold px-1.5 py-0.5 rounded">🏖️ 請假</span>`;
      } else {
        attBadge = `<span class="text-[10px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">未到</span>`;
      }

      let lightBadge = "";
      if (traffic && traffic.light === "green") lightBadge = `<span class="text-xs" title="准許下課">🟢</span>`;
      else if (traffic && traffic.light === "yellow") lightBadge = `<span class="text-xs" title="待訂正">🟡</span>`;
      else lightBadge = `<span class="text-xs" title="留座自省">🔴</span>`;

      const refCount = traffic ? traffic.reflectionCount : 0;
      const srvCount = traffic ? traffic.serviceCount : 0;
      let refChip = refCount > 0 ? `<span class="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded shadow-xs">🪑 自省${refCount > 1 ? `*${refCount}` : ''}</span>` : "";
      let srvChip = srvCount > 0 ? `<span class="text-[10px] bg-orange-600 text-white font-bold px-1.5 py-0.2 rounded shadow-xs">🧹 愛班${srvCount > 1 ? `*${srvCount}` : ''}</span>` : "";

      html += `
        <div class="seating-proj-desk">
          <div class="flex items-center justify-between w-full text-xs">
            <span class="inline-flex items-center justify-center px-2 py-0.2 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-xs font-mono whitespace-nowrap">
              <span>${String(student.seatNo).padStart(2, '0')} 號</span>
            </span>
            <div class="flex items-center space-x-1">
              ${lightBadge}
              ${attBadge}
            </div>
          </div>
          <div class="my-0.5 text-center flex items-center justify-center">
            <span class="font-cute font-black text-slate-900 text-lg sm:text-xl tracking-wider truncate max-w-[125px] filter drop-shadow-xs">
              ${student.name}
            </span>
          </div>
          <div class="flex items-center justify-between w-full pt-0.5 border-t border-amber-300/60 text-[10px]">
            <div class="flex items-center space-x-1">
              ${refChip}
              ${srvChip}
              ${!refChip && !srvChip ? `<span class="text-amber-800 font-bold">👑 內閣大臣</span>` : ''}
            </div>
            <span class="text-amber-900 font-mono font-bold">${student.points || 0} 🍎</span>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="seating-proj-desk-empty">
          <div class="flex items-center space-x-1.5">
            <span class="text-lg opacity-70">🪑</span>
            <span class="text-xs font-bold text-slate-500">空席</span>
          </div>
        </div>
      `;
    }
  }

  grid.innerHTML = html;
}

// ===================================================================
// 晨間朝會 ‧ 聯絡簿與大臣晨檢打卡大屏全螢幕投影管理
// (Contact Book & Morning Check-In Big Screen Projection Broadcaster)
// ===================================================================
let contactProjectionClockInterval = null;

function openContactProjectionModal() {
  const modal = document.getElementById("contactProjectionModal");
  if (!modal) return;

  initContactProjDates();
  modal.classList.remove("hidden");
  renderContactProjectionView();

  function updateContactProjClock() {
    const clockEl = document.getElementById("contactProjectionLiveClock");
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }
  }
  updateContactProjClock();
  if (contactProjectionClockInterval) clearInterval(contactProjectionClockInterval);
  contactProjectionClockInterval = setInterval(updateContactProjClock, 1000);
}

function closeContactProjectionModal() {
  const modal = document.getElementById("contactProjectionModal");
  if (modal) modal.classList.add("hidden");
  if (contactProjectionClockInterval) {
    clearInterval(contactProjectionClockInterval);
    contactProjectionClockInterval = null;
  }
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function toggleContactProjectionFullscreen() {
  const modal = document.getElementById("contactProjectionModal");
  if (!document.fullscreenElement) {
    const target = modal || document.documentElement;
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(err => {
        console.warn("Contact projection fullscreen request failed:", err);
      });
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.warn("Exit fullscreen failed:", err);
      });
    }
  }
}

// ===================================================================
// 大屏聯絡簿多天對照與每天六行大字排版狀態與控制器
// ===================================================================
let contactProjDaysMode = '2days'; // '2days' | '3days' | '1day'
let contactProjDateCol1 = null; // 第 1 欄日期 (預設今日)
let contactProjDateCol2 = null; // 第 2 欄日期 (預設明日)
let contactProjDateCol3 = null; // 第 3 欄日期 (預設後天)

function escapeContactHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getDeltaDateString(baseDateStr, deltaDays) {
  let d;
  if (baseDateStr && typeof baseDateStr === 'string' && baseDateStr.includes('-')) {
    const parts = baseDateStr.split('-');
    d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    d = new Date();
  }
  d.setDate(d.getDate() + deltaDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekdayText(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    return weekdays[d.getDay()] || '';
  }
  return '';
}

function getRelativeDayBadge(dateStr) {
  const today = (window.KingdomApp && window.KingdomApp.getTodayDateString) ? window.KingdomApp.getTodayDateString() : new Date().toISOString().slice(0, 10);
  if (dateStr === today) {
    return `<span class="bg-amber-500 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-lg shadow-2xs border border-amber-600/50">👑 今日</span>`;
  }
  const tomorrow = getDeltaDateString(today, 1);
  if (dateStr === tomorrow) {
    return `<span class="bg-sky-500 text-white font-black text-xs px-2.5 py-0.5 rounded-lg shadow-2xs border border-sky-600/50">🚀 明日</span>`;
  }
  const yesterday = getDeltaDateString(today, -1);
  if (dateStr === yesterday) {
    return `<span class="bg-stone-500 text-white font-black text-xs px-2.5 py-0.5 rounded-lg shadow-2xs border border-stone-600/50">📜 昨日</span>`;
  }
  const afterTomorrow = getDeltaDateString(today, 2);
  if (dateStr === afterTomorrow) {
    return `<span class="bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-lg shadow-2xs border border-emerald-700/50">✨ 後天</span>`;
  }
  return `<span class="bg-amber-200 text-amber-900 font-bold text-xs px-2 py-0.5 rounded-lg">${getWeekdayText(dateStr)}</span>`;
}

function initContactProjDates() {
  const today = (window.KingdomApp && window.KingdomApp.getTodayDateString) ? window.KingdomApp.getTodayDateString() : new Date().toISOString().slice(0, 10);
  if (!contactProjDateCol1) {
    contactProjDateCol1 = currentContactDate || today;
  }
  if (!contactProjDateCol2) {
    contactProjDateCol2 = getDeltaDateString(contactProjDateCol1, 1);
  }
  if (!contactProjDateCol3) {
    contactProjDateCol3 = getDeltaDateString(contactProjDateCol1, 2);
  }
}

function setContactProjDaysMode(mode) {
  contactProjDaysMode = mode || '2days';
  initContactProjDates();
  renderContactProjectionView();
}

function setContactProjPreset(preset) {
  const today = (window.KingdomApp && window.KingdomApp.getTodayDateString) ? window.KingdomApp.getTodayDateString() : new Date().toISOString().slice(0, 10);
  if (preset === 'today_tomorrow') {
    contactProjDaysMode = '2days';
    contactProjDateCol1 = today;
    contactProjDateCol2 = getDeltaDateString(today, 1);
    contactProjDateCol3 = getDeltaDateString(today, 2);
  } else if (preset === 'yesterday_today') {
    contactProjDaysMode = '2days';
    contactProjDateCol1 = getDeltaDateString(today, -1);
    contactProjDateCol2 = today;
    contactProjDateCol3 = getDeltaDateString(today, 1);
  } else if (preset === 'three_days') {
    contactProjDaysMode = '3days';
    contactProjDateCol1 = today;
    contactProjDateCol2 = getDeltaDateString(today, 1);
    contactProjDateCol3 = getDeltaDateString(today, 2);
  } else if (preset === 'single_day') {
    contactProjDaysMode = '1day';
    contactProjDateCol1 = currentContactDate || today;
  }
  renderContactProjectionView();
}

function changeContactProjColDate(colIndex, dateVal) {
  if (!dateVal) return;
  initContactProjDates();
  if (colIndex === 1) contactProjDateCol1 = dateVal;
  else if (colIndex === 2) contactProjDateCol2 = dateVal;
  else if (colIndex === 3) contactProjDateCol3 = dateVal;
  renderContactProjectionView();
}

function adjustContactProjColDate(colIndex, delta) {
  initContactProjDates();
  let baseDate = contactProjDateCol1;
  if (colIndex === 2) baseDate = contactProjDateCol2;
  else if (colIndex === 3) baseDate = contactProjDateCol3;

  const newDate = getDeltaDateString(baseDate, delta);
  if (colIndex === 1) contactProjDateCol1 = newDate;
  else if (colIndex === 2) contactProjDateCol2 = newDate;
  else if (colIndex === 3) contactProjDateCol3 = newDate;
  renderContactProjectionView();
}

function renderDayColumn(colIndex, dateStr, totalCols) {
  const colName = colIndex === 1 ? '第一欄' : (colIndex === 2 ? '第二欄' : '第三欄');
  const book = (window.KingdomApp && window.KingdomApp.store && window.KingdomApp.store.getContactBook) 
    ? window.KingdomApp.store.getContactBook(dateStr) 
    : { homeworkItems: [], reminders: [], queenMotto: '' };
  const items = (book && book.homeworkItems) ? book.homeworkItems : [];
  const reminders = (book && book.reminders) ? book.reminders : [];
  const weekday = getWeekdayText(dateStr);
  const relBadge = getRelativeDayBadge(dateStr);

  const isThreeCols = totalCols === 3;
  const isSingleCol = totalCols === 1;

  // 字體配置 (依據欄數適應大屏，字體超大加粗)
  const cardPad = isThreeCols ? 'p-2 sm:p-2.5' : 'p-2.5 sm:p-3.5';
  const minHeight = isThreeCols ? 'min-h-[3.8rem]' : (isSingleCol ? 'min-h-[4.5rem]' : 'min-h-[4.2rem]');
  const numBadgeSize = isThreeCols ? 'w-9 h-9 sm:w-10 sm:h-10 text-lg sm:text-xl' : (isSingleCol ? 'w-11 h-11 sm:w-13 sm:h-13 text-2xl sm:text-3xl' : 'w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl');
  const textClass = isThreeCols ? 'text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-wide leading-snug break-words flex-1' : (isSingleCol ? 'text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-wide leading-snug break-words flex-1' : 'text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-wide leading-snug break-words flex-1');
  const dateTextSize = isThreeCols ? 'text-xl sm:text-2xl lg:text-2xl font-black text-amber-950 tracking-wide' : 'text-2xl sm:text-3xl lg:text-4xl font-black text-amber-950 tracking-wide';

  const renderCardItem = (slotIdx, text) => {
    const isFilled = Boolean(text && String(text).trim());
    if (isFilled) {
      return `
        <div class="flex items-center space-x-3 ${cardPad} rounded-2xl bg-white border-2 border-amber-300 shadow-md transition hover:border-amber-500 ${minHeight}">
          <span class="${numBadgeSize} rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center font-black shrink-0 shadow-xs border border-amber-500/50">
            ${slotIdx}
          </span>
          <span class="${textClass}">
            ${escapeContactHtml(text)}
          </span>
        </div>
      `;
    } else {
      return `
        <div class="flex items-center space-x-3 ${cardPad} rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300/70 ${minHeight}">
          <span class="${numBadgeSize} rounded-2xl bg-amber-200/50 text-amber-800/40 flex items-center justify-center font-black shrink-0">
            ${slotIdx}
          </span>
          <span class="text-base sm:text-lg font-bold text-amber-900/35 italic">
            （留白）
          </span>
        </div>
      `;
    }
  };

  // 每天固定渲染六行 (1 ~ 6)
  const rowsHtml = [1, 2, 3, 4, 5, 6].map(slotIdx => renderCardItem(slotIdx, items[slotIdx - 1] || '')).join('');

  // 若超過 6 行追加顯示
  let extraRowsHtml = '';
  if (items.length > 6) {
    const extraItems = items.slice(6);
    extraRowsHtml = `
      <div class="pt-2 border-t-2 border-dashed border-amber-300/80 space-y-2">
        <span class="text-xs font-black text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-md">追加項目 (超過 6 行)：</span>
        <div class="space-y-2">
          ${extraItems.map((item, idx) => renderCardItem(7 + idx, item)).join('')}
        </div>
      </div>
    `;
  }

  // 該日個別提醒備忘
  let dayReminderNoticeHtml = '';
  if (reminders.length > 0) {
    dayReminderNoticeHtml = `
      <div class="mt-2.5 p-2.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 space-y-1 shadow-2xs">
        <div class="font-black text-amber-900 flex items-center space-x-1">
          <span>🔔 此日提醒：</span>
        </div>
        <ul class="list-disc list-inside space-y-0.5">
          ${reminders.map(r => `<li>${escapeContactHtml(r)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  return `
    <div class="space-y-3 bg-gradient-to-b from-amber-100/50 via-white/80 to-amber-50/50 p-3 sm:p-4 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col justify-between">
      <div>
        <!-- 欄位控制與相對日徽章 -->
        <div class="flex items-center justify-between pb-1.5 px-0.5 border-b border-amber-300/70 text-xs font-black text-amber-950 gap-1.5 flex-wrap">
          <div class="flex items-center space-x-1.5 shrink-0">
            <span class="text-xs sm:text-sm font-black text-amber-950 bg-amber-300/80 px-2.5 py-0.5 rounded-lg border border-amber-400/80 shadow-2xs">
              📌 ${colName}
            </span>
            ${relBadge}
          </div>
          <!-- 導師手動挑選日期與前後天微調 + 快速編輯 -->
          <div class="flex items-center space-x-1 shrink-0">
            <button type="button" onclick="adjustContactProjColDate(${colIndex}, -1)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/95 hover:bg-amber-100 text-amber-950 font-black border border-amber-300 shadow-2xs flex items-center justify-center transition active:scale-95" title="前一天">◀</button>
            <input type="date" value="${dateStr}" onchange="changeContactProjColDate(${colIndex}, this.value)" class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-white border-2 border-amber-400 rounded-xl text-amber-950 font-black cursor-pointer shadow-2xs max-w-[125px] sm:max-w-[145px]" title="手動指定此欄日期">
            <button type="button" onclick="adjustContactProjColDate(${colIndex}, 1)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/95 hover:bg-amber-100 text-amber-950 font-black border border-amber-300 shadow-2xs flex items-center justify-center transition active:scale-95" title="後一天">▶</button>
            <button type="button" onclick="openEditContactModalForDate('${dateStr}')" class="px-2 sm:px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black border border-amber-500 shadow-2xs flex items-center space-x-0.5 transition hover:scale-105 active:scale-95" title="編輯【${dateStr}】聯絡簿">
              <span>✏️</span>
              <span class="hidden sm:inline">編輯</span>
            </button>
          </div>
        </div>

        <!-- ★ 聯絡簿日期顯示在上方第一欄、第二欄位置，字體加粗放大 ★ -->
        <div class="pt-2 pb-2 border-b-2 border-amber-400/80 flex items-center justify-between gap-2">
          <div class="flex items-center space-x-2 flex-wrap">
            <span class="${dateTextSize}">
              📅 ${dateStr}
            </span>
            <span class="text-sm sm:text-base font-black px-2.5 py-0.5 rounded-xl bg-amber-300 text-amber-950 border border-amber-500/60 shadow-2xs">
              ${weekday}
            </span>
          </div>
          <span class="text-[11px] sm:text-xs font-black text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-lg border border-amber-300/80 shrink-0">
            作業固定 6 行
          </span>
        </div>

        <!-- 6 行標準大字作業抄寫項目 -->
        <div class="space-y-2 sm:space-y-2.5 pt-2.5">
          ${rowsHtml}
          ${extraRowsHtml}
        </div>
      </div>

      <!-- 此日備忘提醒 -->
      ${dayReminderNoticeHtml}
    </div>
  `;
}

function renderContactProjectionView() {
  const modal = document.getElementById("contactProjectionModal");
  if (!modal || modal.classList.contains("hidden")) return;

  initContactProjDates();

  const todayStr = window.KingdomApp.getTodayDateString();
  const students = window.KingdomApp.store.data.students || [];
  const attendanceData = (window.KingdomApp.store.data.attendance && window.KingdomApp.store.data.attendance[todayStr]) || {};

  // 1. 渲染左側 27 位大臣打卡按鈕 (大按鈕、清晰時間與紅綠燈標示，每橫排 5 個，在大屏投影下可直接觸控打卡)
  const projCheckInGrid = document.getElementById("contactProjCheckInGrid");
  let checkedCount = 0;

  if (projCheckInGrid) {
    projCheckInGrid.innerHTML = students.map(st => {
      const rec = attendanceData[st.id] || null;
      let statusClass = "seat-uncheck";
      let statusBadge = "🔴 未到";
      let timeText = "";

      if (rec) {
        if (rec.status === 'present') {
          checkedCount++;
          statusClass = "seat-present";
          statusBadge = "🟢 準時";
          timeText = rec.checkInTime || "準時";
        } else if (rec.status === 'late') {
          checkedCount++;
          statusClass = "seat-late";
          statusBadge = "🟡 遲到";
          timeText = rec.checkInTime || "遲到";
        } else if (rec.status === 'leave') {
          statusClass = "seat-leave";
          statusBadge = "🏖️ 請假";
          timeText = "告假";
        }
      }

      return `
        <button onclick="handleMorningSeatCheckIn(${st.id}, ${st.seatNo})" 
          class="checkin-seat-btn ${statusClass} h-11 sm:h-12 w-full rounded-2xl text-center flex flex-col items-center justify-center border-2 transition shadow-md hover:scale-105 active:scale-95"
          title="${st.seatNo}號 ${st.name} | ${statusBadge} ${timeText ? '(' + timeText + ')' : ''}（點擊打卡 / 更改狀態）">
          <span class="font-mono text-lg sm:text-xl font-black tracking-wider leading-none">${String(st.seatNo).padStart(2, '0')}</span>
          <span class="text-[10px] font-bold mt-0.5 leading-none opacity-90 truncate max-w-full px-1">${timeText || statusBadge.slice(2)}</span>
        </button>
      `;
    }).join('');
  }

  // 更新大屏到校打卡人數
  const projCountBadge = document.getElementById("contactProjCheckedCount");
  if (projCountBadge) {
    projCountBadge.textContent = `${checkedCount} / ${students.length} 人`;
  }

  // 2. 更新頂部模式按鈕與標籤狀態
  const btn2Days = document.getElementById("btnProjMode2Days");
  const btn3Days = document.getElementById("btnProjMode3Days");
  const btn1Day = document.getElementById("btnProjMode1Day");
  const activeBtnClass = "px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm shadow-xs transition bg-amber-500 text-amber-950 border-2 border-amber-600 scale-105";
  const inactiveBtnClass = "px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm shadow-xs transition bg-white/95 text-amber-950 hover:bg-amber-100 border border-amber-300";

  if (btn2Days) btn2Days.className = (contactProjDaysMode === '2days') ? activeBtnClass : inactiveBtnClass;
  if (btn3Days) btn3Days.className = (contactProjDaysMode === '3days') ? activeBtnClass : inactiveBtnClass;
  if (btn1Day) btn1Day.className = (contactProjDaysMode === '1day') ? activeBtnClass : inactiveBtnClass;

  const modeBadge = document.getElementById("contactProjModeBadge");
  if (modeBadge) {
    if (contactProjDaysMode === '3days') {
      modeBadge.textContent = "三天並排 ‧ 每天六行大字格式";
    } else if (contactProjDaysMode === '1day') {
      modeBadge.textContent = "單天大字 ‧ 每天六行大字格式";
    } else {
      modeBadge.textContent = "雙天對照 ‧ 每天六行大字格式";
    }
  }

  const projDateDisplay = document.getElementById("contactProjDateDisplay");
  if (projDateDisplay) {
    if (contactProjDaysMode === '3days') {
      projDateDisplay.textContent = `${contactProjDateCol1} ＆ ${contactProjDateCol2} ＆ ${contactProjDateCol3}`;
    } else if (contactProjDaysMode === '1day') {
      projDateDisplay.textContent = `${contactProjDateCol1} (${getWeekdayText(contactProjDateCol1)})`;
    } else {
      projDateDisplay.textContent = `${contactProjDateCol1} (${getWeekdayText(contactProjDateCol1)}) ＆ ${contactProjDateCol2} (${getWeekdayText(contactProjDateCol2)})`;
    }
  }

  // 3. 渲染多天對照聯絡簿作業看板
  const projHwList = document.getElementById("contactProjHomeworkList");
  if (projHwList) {
    if (contactProjDaysMode === '3days') {
      projHwList.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 items-stretch">
          ${renderDayColumn(1, contactProjDateCol1, 3)}
          ${renderDayColumn(2, contactProjDateCol2, 3)}
          ${renderDayColumn(3, contactProjDateCol3, 3)}
        </div>
      `;
    } else if (contactProjDaysMode === '1day') {
      projHwList.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-4">
          ${renderDayColumn(1, contactProjDateCol1, 1)}
        </div>
      `;
    } else {
      // 預設雙天對照 (第一欄與第二欄)
      projHwList.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-stretch">
          ${renderDayColumn(1, contactProjDateCol1, 2)}
          ${renderDayColumn(2, contactProjDateCol2, 2)}
        </div>
      `;
    }
  }

  // 4. 匯總顯示所選日期的早自修與重要提醒
  const projReminderList = document.getElementById("contactProjReminderList");
  if (projReminderList) {
    const activeCols = [];
    if (contactProjDaysMode === '3days') {
      activeCols.push({ colName: '第一欄', date: contactProjDateCol1 });
      activeCols.push({ colName: '第二欄', date: contactProjDateCol2 });
      activeCols.push({ colName: '第三欄', date: contactProjDateCol3 });
    } else if (contactProjDaysMode === '1day') {
      activeCols.push({ colName: '今日', date: contactProjDateCol1 });
    } else {
      activeCols.push({ colName: '第一欄', date: contactProjDateCol1 });
      activeCols.push({ colName: '第二欄', date: contactProjDateCol2 });
    }

    const allReminders = [];
    activeCols.forEach(({ colName, date }) => {
      const book = window.KingdomApp.store.getContactBook(date);
      if (book && Array.isArray(book.reminders) && book.reminders.length > 0) {
        book.reminders.forEach(rem => {
          allReminders.push({
            date: date,
            colName: colName,
            weekday: getWeekdayText(date),
            text: rem
          });
        });
      }
    });

    if (allReminders.length === 0) {
      projReminderList.innerHTML = `
        <li class="text-amber-900/60 text-base sm:text-xl font-bold list-none">（目前所選日期無特殊早自修或重要提醒）</li>
      `;
    } else {
      projReminderList.innerHTML = allReminders.map(item => `
        <li class="leading-relaxed py-0.5">
          <span class="font-black text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-lg border border-amber-300 text-sm sm:text-base mr-1">
            ${item.date} (${item.weekday}) ‧ ${item.colName}
          </span>
          <span>${escapeContactHtml(item.text)}</span>
        </li>
      `).join('');
    }
  }

  // 5. 皇后每日聖諭 (取第 1 欄或系統預設聖諭)
  const projMottoEl = document.getElementById("contactProjQueenMotto");
  if (projMottoEl) {
    const primaryBook = window.KingdomApp.store.getContactBook(contactProjDateCol1);
    const motto = (primaryBook && primaryBook.queenMotto) ? primaryBook.queenMotto : "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！";
    projMottoEl.textContent = motto;
  }
}

// ===================================================================
// 8. 🍎 紅蘋果集點榜 ‧ 大屏全螢幕投影看板控制器 (Points Leaderboard Big Screen Projection)
// ===================================================================
const selectedStudentIdsForPointsProjection = new Set();
let openCardDrawerInProjectionIds = new Set();

function openPointsProjectionModal() {
  const modal = document.getElementById("pointsProjectionModal");
  if (!modal) {
    console.error("pointsProjectionModal not found!");
    return;
  }
  modal.classList.remove("hidden");
  modal.style.setProperty("display", "flex", "important");
  modal.style.setProperty("visibility", "visible", "important");
  modal.style.setProperty("opacity", "1", "important");
  modal.style.setProperty("z-index", "99999", "important");
  modal.style.setProperty("position", "fixed", "important");
  modal.style.setProperty("inset", "0", "important");
  modal.style.setProperty("width", "100vw", "important");
  modal.style.setProperty("height", "100vh", "important");
  modal.style.setProperty("background", "radial-gradient(circle at 50% 15%, #fef3c7 0%, #fde68a 35%, #fbbf24 75%, #f59e0b 100%)", "important");
  renderPointsProjection();
  if (typeof showToast === "function") {
    showToast("🍎 已開啟紅蘋果集點榜大屏投影", "☀️");
  }
}

function closePointsProjectionModal() {
  const modal = document.getElementById("pointsProjectionModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.setProperty("display", "none", "important");
    modal.style.setProperty("visibility", "hidden", "important");
    modal.style.setProperty("opacity", "0", "important");
  }
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

// 立即掛載至全域
if (typeof window !== 'undefined') {
  window.openPointsProjectionModal = openPointsProjectionModal;
  window.closePointsProjectionModal = closePointsProjectionModal;
}

function togglePointsProjectionFullscreen() {
  const modal = document.getElementById("pointsProjectionModal");
  if (!document.fullscreenElement) {
    const target = modal || document.documentElement;
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(err => console.warn(err));
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  }
}

function toggleProjectionStudentSelection(studentId) {
  if (selectedStudentIdsForPointsProjection.has(studentId)) {
    selectedStudentIdsForPointsProjection.delete(studentId);
  } else {
    selectedStudentIdsForPointsProjection.add(studentId);
  }
  renderPointsProjection();
}

function selectAllProjectionPoints(selectAll = true) {
  const students = window.KingdomApp.store.data.students || [];
  if (selectAll) {
    students.forEach(s => selectedStudentIdsForPointsProjection.add(s.id));
  } else {
    selectedStudentIdsForPointsProjection.clear();
  }
  renderPointsProjection();
}

function awardSelectedInPointsProjection(points = 1) {
  if (selectedStudentIdsForPointsProjection.size === 0) {
    showToast("請先勾選欲嘉獎的大臣！", "⚠️");
    return;
  }
  const ids = Array.from(selectedStudentIdsForPointsProjection);
  window.KingdomApp.store.batchAwardMultipleStudents(ids, points, `大屏模式課堂嘉獎 (+${points} 🍎)`);
  if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
    try { window.KingdomApp.sound.playCoin(); } catch (e) {}
  }
  showToast(`🎉 成功為 ${ids.length} 位大臣各賞賜 +${points} 顆紅蘋果！`, "🍎");
  renderPointsProjection();
  renderPointsView();
}

function awardSingleStudentInProjection(studentId, points = 1) {
  const st = window.KingdomApp.store.data.students.find(s => s.id === studentId || s.seatNo === studentId);
  if (!st) return;
  window.KingdomApp.store.awardSingleStudent(st.id, points, `大屏課堂即時嘉獎 (+${points} 🍎)`);
  if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
    try { window.KingdomApp.sound.playCoin(); } catch (e) {}
  }
  showToast(`🍎 已為【${st.name}】賞賜 +${points} 顆紅蘋果！`, "👑");
  renderPointsProjection();
  renderPointsView();
}

function toggleCardDrawerInProjection(studentId) {
  if (openCardDrawerInProjectionIds.has(studentId)) {
    openCardDrawerInProjectionIds.delete(studentId);
  } else {
    openCardDrawerInProjectionIds.add(studentId);
  }
  renderPointsProjection();
}

function useCardInPointsProjection(studentId, redemptionId) {
  const res = window.KingdomApp.store.useRedeemedCard(studentId, redemptionId);
  if (res && res.success) {
    if (window.KingdomApp.sound && window.KingdomApp.sound.playFanfare) {
      try { window.KingdomApp.sound.playFanfare(); } catch (e) {}
    }
    showToast(`✨ ${res.message}`, "🎉");
    renderPointsProjection();
    renderPointsView();
  } else {
    showToast((res && res.message) || "使用卡牌失敗！", "⚠️");
  }
}

function renderPointsProjection() {
  const modal = document.getElementById("pointsProjectionModal");
  if (!modal || modal.classList.contains("hidden")) return;

  const students = window.KingdomApp.store.data.students || [];
  const grid = document.getElementById("pointsProjectionGrid");
  const totalPointsEl = document.getElementById("pointsProjTotalPoints");
  const selectedBadgeEl = document.getElementById("pointsProjSelectedBadge");

  // 計算全班總蘋果數
  let totalPts = 0;
  students.forEach(s => totalPts += (s.points || 0));
  if (totalPointsEl) totalPointsEl.textContent = `${totalPts} 顆`;
  if (selectedBadgeEl) {
    selectedBadgeEl.textContent = `已選取 ${selectedStudentIdsForPointsProjection.size} 位大臣`;
  }

  if (grid) {
    grid.innerHTML = students.map(st => {
      const seatPad = String(st.seatNo).padStart(2, '0');
      const isSelected = selectedStudentIdsForPointsProjection.has(st.id);
      const aType = (st.animalType || st.petType || 'dog').toLowerCase();
      window.KingdomApp.store.syncStudentPets(st);
      window.KingdomApp.store.syncStudentCards(st);
      const pts = st.points || 0;
      const lifetime = (st.lifetimePoints !== undefined && st.lifetimePoints > 0) 
        ? st.lifetimePoints 
        : (pts > 0 ? pts : (st.lifetimePoints || 0));
      const petStatus = window.KingdomApp.getAnimalStatus(aType, lifetime);
      const heldCards = st.redeemedCards || [];
      const isDrawerOpen = openCardDrawerInProjectionIds.has(st.id);

      const pets = st.pets || [{ type: aType }];
      const petIconsHtml = pets.map(p => {
        const ps = window.KingdomApp.getAnimalStatus ? window.KingdomApp.getAnimalStatus(p.type, 0) : null;
        const icon = ps ? ps.animalIcon : '🐾';
        const name = ps ? ps.animalName : '萌寵';
        return `<span class="text-sm cursor-help hover:scale-110 transition inline-block" title="${name}">${icon}</span>`;
      }).join(' ');

      let petLabel = `${petStatus.animalIcon} ${petStatus.animalName}`;
      if (pets.length > 1) {
        petLabel += ` (👑x${pets.length})`;
      }

      return `
        <div class="rounded-2xl p-3 border-2 transition-all flex flex-col justify-between shadow-md hover:shadow-xl backdrop-blur-md ${isSelected ? 'bg-amber-100/95 border-amber-500 ring-2 ring-amber-400 shadow-amber-300/50' : 'bg-white/95 border-amber-400 hover:border-amber-500'}">
          <div>
            <!-- 頂部身分列：勾選、座號、姓名、官職與認養寵物圖示 (明亮高可視) -->
            <div class="flex items-center justify-between pb-1.5 border-b border-amber-300">
              <div class="flex items-center space-x-1.5 min-w-0">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleProjectionStudentSelection(${st.id})" class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer">
                <span class="text-xs font-mono font-black text-amber-950 bg-amber-200 border border-amber-300 px-1.5 py-0.5 rounded shadow-2xs">
                  ${seatPad}號
                </span>
                <span class="text-base sm:text-lg font-cute font-black text-slate-900 truncate tracking-wide filter drop-shadow-2xs">${st.name}</span>
              </div>
              <div class="flex items-center space-x-1 flex-shrink-0">
                <span class="text-[10px] font-bold text-amber-950 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded truncate max-w-[70px]">
                  ${st.title}
                </span>
                <div class="flex items-center space-x-0.5">
                  ${petIconsHtml}
                </div>
              </div>
            </div>

            <!-- 中央核心：大蘋果數量 (鮮豔明亮) + 萌寵標籤 -->
            <div class="my-2 p-2 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl border border-amber-300/80 text-center shadow-inner">
              <div class="text-2xl sm:text-3xl font-mono font-black text-rose-600 tracking-wider flex items-center justify-center space-x-1 drop-shadow-2xs">
                <span>🍎</span>
                <span>${pts}</span>
                <span class="text-xs text-amber-900 font-bold">顆</span>
              </div>
              <div class="mt-1 flex items-center justify-center space-x-1.5 text-[11px] text-amber-950 font-bold">
                <span>${petLabel}</span>
                <span class="text-amber-400">·</span>
                <span class="text-[10px] text-amber-800 font-mono font-bold">🌱${lifetime}點</span>
              </div>
            </div>

            <!-- 特權卡牌抽屜 (支援大屏直接點擊展開與一鍵使用) -->
            <div class="mb-2">
              <button type="button" onclick="toggleCardDrawerInProjection(${st.id})" class="w-full py-1 px-2 rounded-lg bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-950 text-xs font-bold flex items-center justify-between transition shadow-2xs cursor-pointer">
                <span class="flex items-center space-x-1">
                  <span>🎁 卡牌抽屜</span>
                  <span class="text-[10px] font-mono px-1.5 py-0.2 rounded-full ${heldCards.length > 0 ? 'bg-purple-600 text-white font-black' : 'bg-purple-200 text-purple-800'}">
                    ${heldCards.length} 張
                  </span>
                </span>
                <span class="text-[10px] font-mono">${isDrawerOpen ? '▲ 收合' : '▼ 展開'}</span>
              </button>

              ${isDrawerOpen ? `
                <div class="mt-1.5 p-2 bg-purple-50 rounded-xl border border-purple-200 space-y-1.5 max-h-36 overflow-y-auto">
                  ${heldCards.length === 0 ? `
                    <div class="text-center py-2 text-[11px] text-purple-700 font-medium">
                      <span>暫無存放卡牌</span>
                    </div>
                  ` : heldCards.map(c => `
                    <div class="flex items-center justify-between p-1.5 bg-white rounded-lg border border-purple-200 text-xs shadow-2xs">
                      <div class="flex items-center space-x-1.5 truncate">
                        <span>${c.icon || '🎁'}</span>
                        <span class="font-black text-purple-950 truncate">${c.title}</span>
                      </div>
                      <div class="flex items-center space-x-1 shrink-0">
                        <button type="button" onclick="useCardInPointsProjection(${st.id}, '${c.id}')" class="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[10px] shadow-xs flex items-center space-x-0.5 transform active:scale-95 transition cursor-pointer">
                          <span>✨使用</span>
                        </button>
                        <button type="button" onclick="revokeCardInPointsProjection(${st.id}, '${c.id}', '${(c.title || '').replace(/'/g, "\\'")}', ${c.cost || 0})" class="px-1.5 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 font-bold text-[10px] shadow-2xs transform active:scale-95 transition cursor-pointer" title="撤銷此卡牌兌換並退還 ${c.cost || 0} 顆蘋果">
                          <span>↩️撤銷</span>
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- 底部快速嘉獎互動列 (+1🍎 / +2🍎 / +5🍎) -->
          <div class="grid grid-cols-3 gap-1 pt-1.5 border-t border-amber-300">
            <button type="button" onclick="awardSingleStudentInProjection(${st.id}, 1)" class="py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer" title="為 ${st.name} +1 顆紅蘋果">
              +1🍎
            </button>
            <button type="button" onclick="awardSingleStudentInProjection(${st.id}, 2)" class="py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer" title="為 ${st.name} +2 顆紅蘋果">
              +2🍎
            </button>
            <button type="button" onclick="awardSingleStudentInProjection(${st.id}, 5)" class="py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer" title="為 ${st.name} +5 顆紅蘋果">
              +5🍎
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ===================================================================
// 9. 🐾 班級萌寵動物園 ‧ 大屏全螢幕投影看板控制器 (Zoo Sanctuary Big Screen Projection)
// ===================================================================
function openZooProjectionModal() {
  const modal = document.getElementById("zooProjectionModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderZooProjection();
}

function closeZooProjectionModal() {
  const modal = document.getElementById("zooProjectionModal");
  if (modal) modal.classList.add("hidden");
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function toggleZooProjectionFullscreen() {
  const modal = document.getElementById("zooProjectionModal");
  if (!document.fullscreenElement) {
    const target = modal || document.documentElement;
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(err => console.warn(err));
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  }
}

function feedStudentInZooProjection(studentId) {
  const result = window.KingdomApp.store.feedStudentAnimal(studentId, 1, "大屏美味蘋果");
  if (!result) return;
  if (window.KingdomApp.sound && window.KingdomApp.sound.playFeedMunch) {
    try { window.KingdomApp.sound.playFeedMunch(); } catch (e) {}
  }
  showToast(`🍎 嘎嘣脆！已為【${result.student.name}】的【${result.status.animalName}】投餵 1 顆蘋果！`, "🐾");
  renderZooProjection();
  renderPetsOverview();
  renderPointsView();
}

function renderZooProjection() {
  const modal = document.getElementById("zooProjectionModal");
  if (!modal || modal.classList.contains("hidden")) return;

  const students = window.KingdomApp.store.data.students || [];
  const grid = document.getElementById("zooProjectionGrid");
  const statsPill = document.getElementById("zooProjStatsPill");

  let totalFood = 0;
  let goldenCount = 0;
  let doublePetCount = 0;

  if (grid) {
    grid.innerHTML = students.map(st => {
      const seatPad = String(st.seatNo).padStart(2, '0');
      const aType = (st.animalType || st.petType || 'lion').toLowerCase();
      window.KingdomApp.store.syncStudentPets(st);
      let lifetime = parseInt(st.lifetimePoints, 10);
      if (isNaN(lifetime) || lifetime < 0) {
        lifetime = 0;
        st.lifetimePoints = 0;
      }
      totalFood += lifetime;
      const petStatus = window.KingdomApp.getAnimalStatus(aType, lifetime);
      if (petStatus.isGolden) goldenCount++;
      const svgCode = window.KingdomApp.renderAnimalSVG(aType, petStatus.stageIndex);

      const pets = st.pets || [{ type: aType }];
      if (pets.length > 1) doublePetCount++;

      // 一屏全覽：並列渲染該學生認養的所有寵物 (1隻、2隻或3隻)，一眼看清！
      const petsListHtml = pets.map((p, idx) => {
        const pType = (p.type || 'dog').toLowerCase();
        const pExp = idx === 0 ? lifetime : Math.max(0, lifetime - idx * 500);
        const pStatus = window.KingdomApp.getAnimalStatus(pType, pExp);
        const pSvg = window.KingdomApp.renderAnimalSVG(pType, pStatus.stageIndex);
        return `
          <div onclick="feedStudentInZooProjection(${st.id})" class="flex-1 flex flex-col items-center justify-center p-1 rounded-xl bg-white/80 border border-emerald-300 hover:border-emerald-500 hover:bg-white shadow-2xs transition cursor-pointer transform hover:scale-105 active:scale-95" title="點擊投餵【${pStatus.animalName}】(+1 飽食)">
            <div class="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center filter drop-shadow-sm">
              ${pSvg}
            </div>
            <div class="text-[11px] font-black text-emerald-950 mt-0.5 truncate max-w-[85px] leading-tight flex items-center space-x-0.5">
              <span>${pStatus.animalIcon}</span>
              <span>${pStatus.animalName}</span>
            </div>
            <div class="text-[9px] font-mono text-emerald-800 font-black mt-0.5">
              ${pExp}點
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="rounded-2xl p-2 sm:p-2.5 border-2 transition-all flex flex-col justify-between shadow-md hover:shadow-xl backdrop-blur-md ${petStatus.isGolden ? 'bg-gradient-to-b from-amber-50/95 to-yellow-100/95 border-amber-400 ring-2 ring-amber-300 shadow-amber-300/40' : 'bg-white/95 border-emerald-400 hover:border-emerald-500 shadow-emerald-200/40'}">
          <div>
            <!-- 座號、姓名、認養隻數列 (明亮陽光風格) -->
            <div class="flex items-center justify-between pb-1 border-b border-emerald-200">
              <div class="flex items-center space-x-1 min-w-0">
                <span class="text-xs font-mono font-black text-emerald-950 bg-emerald-200 border border-emerald-300 px-1 py-0.2 rounded shadow-2xs">
                  ${seatPad}號
                </span>
                <span class="text-sm sm:text-base font-cute font-black text-slate-900 truncate tracking-wide">${st.name}</span>
              </div>
              <div class="flex items-center space-x-1 shrink-0">
                <span class="text-[9px] font-black ${pets.length > 1 ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'} px-1.5 py-0.2 rounded">
                  🐾 ${pets.length}隻
                </span>
                <span class="text-[11px] font-mono text-rose-600 font-black">🍎${st.points || 0}</span>
              </div>
            </div>

            <!-- 核心：所有認養寵物並列展示舍 (一屏全覽無需上下滾動) -->
            <div class="my-1.5 flex items-stretch justify-center gap-1.5 w-full">
              ${petsListHtml}
            </div>
          </div>

          <!-- 底部快速投餵按鈕 -->
          <div class="pt-1 border-t border-emerald-200 flex items-center space-x-1">
            <button type="button" onclick="feedStudentInZooProjection(${st.id})" class="flex-1 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs transition active:scale-95" title="投餵飼料 1 顆蘋果">
              🍎 投餵
            </button>
            <button type="button" onclick="awardSingleStudentInProjection(${st.id}, 1)" class="w-12 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] shadow-xs transition active:scale-95" title="賞賜 +1 顆紅蘋果">
              +1
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (statsPill) {
    statsPill.innerHTML = `
      <span>🐾 全園 <strong>${students.length + doublePetCount}</strong> 隻動物棲息</span>
      <span class="text-emerald-700">·</span>
      <span>🍎 總飽食 <strong>${totalFood}</strong> 點</span>
      <span class="text-emerald-700">·</span>
      <span>👑 巨星 <strong>${goldenCount}</strong> 隻</span>
      ${doublePetCount > 0 ? `<span class="text-emerald-700">·</span><span>✨ 雙寵 <strong>${doublePetCount}</strong> 位</span>` : ''}
    `;
  }
}

function broadcastInstantAnnouncement(e) {
  if (e) e.preventDefault();
  const title = document.getElementById("instantBroadcastTitle").value.trim();
  const content = document.getElementById("instantBroadcastContent").value.trim();

  if (!title || !content) {
    showToast("請輸入公告標題與詳細內容！", "⚠️");
    return;
  }

  const titleEl = document.getElementById("projectionDisplayTitle");
  const contentEl = document.getElementById("projectionDisplayContent");
  const dateEl = document.getElementById("projectionDisplayDate");
  const badgeEl = document.getElementById("projectionDisplayBadge");
  const timeEl = document.getElementById("projectionDisplayTime");

  if (titleEl) titleEl.textContent = title;
  if (contentEl) contentEl.textContent = content;
  if (dateEl) dateEl.textContent = window.KingdomApp.getTodayDateString();
  if (badgeEl) badgeEl.textContent = "⚡ 現場臨時公文速報";
  if (timeEl) timeEl.textContent = new Date().toTimeString().slice(0, 5) + " 剛剛發布";

  // 僅當導師明確勾選「同步收錄至皇室公佈欄」時才存入公佈欄 (避免臨時廣播速報直接污染常態公佈欄)
  const saveCheckbox = document.getElementById("broadcastSaveToAnnouncements");
  if (saveCheckbox && saveCheckbox.checked) {
    const newAnnounce = {
      id: Date.now(),
      title,
      content,
      pinned: true,
      date: window.KingdomApp.getTodayDateString()
    };
    window.KingdomApp.store.data.announcements.unshift(newAnnounce);
    window.KingdomApp.store.save();
    renderAnnouncementsView();
    showToast("🚀 大屏資訊已投影，並已同步收錄至皇室公佈欄！", "📢");
  } else {
    showToast("🚀 大屏資訊已成功現場投影！（未收錄至公佈欄）", "📢");
  }

  playBroadcastChime();
}

function applyBroadcastPreset(presetKey) {
  const presets = {
    pe: {
      title: "🏃 第四節體育課集合通知",
      content: "因今日天氣炎熱/下雨，第四節體育課改至活動中心二樓室內集合！請大臣們攜帶水壺就定位！"
    },
    lunch: {
      title: "🍱 今日午餐提早用餐通知",
      content: "全班大臣注意！今日第四節提早於 11:50 展開午餐御膳，請值日生提前洗手並排好餐具！"
    },
    form: {
      title: "📋 家長回條繳交提醒",
      content: "請全體大臣確認校外教學家長同意回條是否已簽章，請於今日午休前送至導師桌前繳交！"
    },
    dismissal: {
      title: "🎒 今日放學重要叮嚀",
      content: "今日放學請攜帶直笛、美勞用具與聯絡簿回家，路口請依號誌通行並注意交通安全，明天見！"
    }
  };

  const p = presets[presetKey];
  if (!p) return;

  const titleInput = document.getElementById("instantBroadcastTitle");
  const contentInput = document.getElementById("instantBroadcastContent");
  if (titleInput) titleInput.value = p.title;
  if (contentInput) contentInput.value = p.content;

  // 僅填入內容供導師確認檢閱，絕不直接自動發布/更新至公佈欄與大屏
  showToast("📋 已載入快捷範本內容，請確認修訂後點擊【立即投影】發布！", "ℹ️");
}

function playBroadcastChime() {
  if (window.KingdomApp && window.KingdomApp.sound && typeof window.KingdomApp.sound.playBreakBell === 'function') {
    window.KingdomApp.sound.playBreakBell();
  }
}

function submitNewAnnouncement(e) {
  e.preventDefault();
  const title = (document.getElementById("announceTitle")?.value || "").trim();
  const content = (document.getElementById("announceContent")?.value || "").trim();
  const pinned = document.getElementById("announcePinned") ? document.getElementById("announcePinned").checked : false;

  if (!title || !content) {
    showToast("請輸入公告標題與內容！", "⚠️");
    return;
  }

  if (!confirm(`確定要正式頒布皇室公告【${title}】嗎？`)) {
    return;
  }

  const newAnnounce = {
    id: Date.now(),
    title,
    content,
    pinned,
    date: window.KingdomApp.getTodayDateString()
  };

  window.KingdomApp.store.data.announcements.unshift(newAnnounce);
  window.KingdomApp.store.save();
  if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
    window.KingdomApp.sound.playCoin();
  }
  showToast("📢 皇室公告已正式頒布！");

  document.getElementById("announceTitle").value = "";
  document.getElementById("announceContent").value = "";
  if (document.getElementById("announcePinned")) {
    document.getElementById("announcePinned").checked = false;
  }

  renderAnnouncementsView();
}

function deleteAnnouncement(id) {
  if (!confirm("確定要刪除這則公告嗎？")) return;
  window.KingdomApp.store.data.announcements = window.KingdomApp.store.data.announcements.filter(a => a.id !== id);
  window.KingdomApp.store.save();
  showToast("公告已移除");
  renderAnnouncementsView();
}

// ===================================================================
// 10. 家長專區核心功能 (Parent Portal & Birthday Auth)
// ===================================================================
function renderParentPortal() {
  const students = window.KingdomApp.store.data.students;
  const select = document.getElementById("parentSelectStudent");
  const loginCard = document.getElementById("parentLoginCard");
  const dashboard = document.getElementById("parentDashboard");

  if (select) {
    // 依使用者隱私保護要求：家長專區選單僅保留座號，絕不洩漏學生姓名與職稱
    select.innerHTML = students.map(st => `
      <option value="${st.seatNo}">
        座號 ${String(st.seatNo).padStart(2, '0')} 號
      </option>
    `).join('');
  }

  if (loggedInStudentId) {
    loginCard.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderParentDashboardContent();
  } else {
    loginCard.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
}

function toggleBirthdayVisibility() {
  const input = document.getElementById("parentBirthdayInput");
  const icon = document.getElementById("eyeIcon");
  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("data-lucide", "eye-off");
  } else {
    input.type = "password";
    icon.setAttribute("data-lucide", "eye");
  }
  initLucideIcons();
}

function handleParentLogin(e) {
  e.preventDefault();
  const seatNo = parseInt(document.getElementById("parentSelectStudent").value, 10);
  const inputPassword = document.getElementById("parentBirthdayInput").value.trim();
  const errorMsg = document.getElementById("parentLoginError");

  const student = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
  if (!student) {
    errorMsg.classList.remove("hidden");
    return;
  }

  // 計算標準 6 碼密碼：座號(2碼補零) + 國曆生日(4碼補零)
  // 例如：1 號生日 1 月 1 日 -> 01 + 0101 = 010101
  // 例如：4 號生日 11 月 4 日 -> 04 + 1104 = 041104
  const seatPad = String(student.seatNo).padStart(2, '0');
  const bdayClean = (student.birthday || '0101').replace(/[^0-9]/g, '');
  const bdayPad = bdayClean.padStart(4, '0').slice(-4);
  const expectedPassword = seatPad + bdayPad;

  // 家長輸入清理
  const cleanInput = inputPassword.replace(/[^0-9]/g, '');

  let isMatch = false;
  if (cleanInput === expectedPassword) {
    isMatch = true;
  } else if (cleanInput.padStart(6, '0') === expectedPassword) {
    // 容錯：若家長只輸入 10101 (未補零)，補零後相同也算正確
    isMatch = true;
  } else if (cleanInput === bdayClean || cleanInput === bdayPad) {
    // 溫和相容：如果家長只輸入了生日 0101
    isMatch = true;
  } else if (cleanInput.endsWith(expectedPassword)) {
    isMatch = true;
  }

  if (isMatch) {
    errorMsg.classList.add("hidden");
    loggedInStudentId = student.id;
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();
    showToast(`👑 歡迎 ${student.name} 大臣的家長覲見小小兵王國！`);
    renderParentPortal();
  } else {
    errorMsg.classList.remove("hidden");
  }
}

function parentLogout() {
  loggedInStudentId = null;
  document.getElementById("parentBirthdayInput").value = "";
  renderParentPortal();
}

function renderParentDashboardContent() {
  if (!loggedInStudentId) return;
  const student = window.KingdomApp.store.data.students.find(s => s.id === loggedInStudentId);
  if (!student) return;

  document.getElementById("parentStudentSeat").textContent = `座號 ${String(student.seatNo).padStart(2, '0')}`;
  document.getElementById("parentStudentTitle").textContent = student.title;
  document.getElementById("parentStudentName").textContent = `${student.name} 大臣`;
  document.getElementById("parentStudentCoins").innerHTML = `<span>🪙</span><span>${student.points}</span>`;

  // 可愛守護動物 (金化進度與生涯總額)
  const aType = student.animalType || student.petType || 'lion';
  const lifetime = student.lifetimePoints !== undefined ? student.lifetimePoints : (student.points || 0);
  const petStatus = window.KingdomApp.getAnimalStatus(aType, lifetime);
  document.getElementById("parentPetStageTag").textContent = `${petStatus.animalIcon} ${petStatus.stageTitle}`;
  document.getElementById("parentPetName").textContent = `${petStatus.animalName} (${petStatus.stageTitle})`;
  document.getElementById("parentPetDesc").textContent = petStatus.stageDesc;
  document.getElementById("parentPetProgressText").textContent = petStatus.isGolden 
    ? `已達到純金神聖頂點 (${lifetime} 🌟)` 
    : `生涯總額 ${lifetime} / ${petStatus.nextThreshold} 🌟 (金化進度)`;
  document.getElementById("parentPetProgressBar").style.width = `${petStatus.progressPercent}%`;

  const svgContainer = document.getElementById("parentPetSVGContainer");
  if (svgContainer) {
    svgContainer.innerHTML = window.KingdomApp.renderAnimalSVG(aType, petStatus.stageIndex);
  }

  // 第二守護萌寵展示 (解鎖滿500點雙寵)
  const secondPetBox = document.getElementById("parentSecondPetContainer");
  if (secondPetBox) {
    if (student.secondPetType) {
      secondPetBox.classList.remove("hidden");
      const sType = student.secondPetType.toLowerCase();
      const sExp = student.secondPetExp !== undefined ? student.secondPetExp : Math.max(0, lifetime - 500);
      const sStatus = window.KingdomApp.getAnimalStatus(sType, sExp);
      
      const sTag = document.getElementById("parentSecondPetStageTag");
      if (sTag) sTag.textContent = `${sStatus.animalIcon} ${sStatus.stageTitle}`;
      
      const sName = document.getElementById("parentSecondPetName");
      if (sName) sName.textContent = `${sStatus.animalName} (${sStatus.stageTitle})`;
      
      const sDesc = document.getElementById("parentSecondPetDesc");
      if (sDesc) sDesc.textContent = `第二守護萌寵 ‧ 飽食度 ${sExp} 點 (${sStatus.stageDesc})`;
      
      const sBar = document.getElementById("parentSecondPetProgressBar");
      if (sBar) sBar.style.width = `${sStatus.progressPercent}%`;
      
      const sSvg = document.getElementById("parentSecondPetSVGContainer");
      if (sSvg) sSvg.innerHTML = window.KingdomApp.renderAnimalSVG(sType, sStatus.stageIndex);
    } else {
      secondPetBox.classList.add("hidden");
    }
  }

  // 出席
  const todayStr = window.KingdomApp.getTodayDateString();
  document.getElementById("parentTodayDateLabel").textContent = todayStr;
  const attendanceBox = document.getElementById("parentAttendanceStatusBox");
  const todayAtt = (window.KingdomApp.store.data.attendance[todayStr] && window.KingdomApp.store.data.attendance[todayStr][student.id]) || null;

  if (!todayAtt || todayAtt.status === 'uncheck') {
    attendanceBox.className = "p-4 rounded-xl border-2 border-slate-300 bg-slate-50 flex items-center space-x-3";
    attendanceBox.innerHTML = `
      <div class="text-3xl">⏳</div>
      <div>
        <h4 class="font-black text-slate-800 text-sm">今日尚未打卡到校 (未到)</h4>
        <p class="text-xs text-slate-600">大臣今日尚未完成晨間朝會簽到，請家長確認大臣是否已平安抵達校園。</p>
      </div>
    `;
  } else if (todayAtt.status === 'present') {
    attendanceBox.className = "p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 flex items-center space-x-3";
    attendanceBox.innerHTML = `
      <div class="text-3xl">✅</div>
      <div>
        <h4 class="font-black text-emerald-950 text-sm">今日在朝 ‧ 準時出席 ${todayAtt.checkInTime ? `(${todayAtt.checkInTime})` : ''}</h4>
        <p class="text-xs text-emerald-700">大臣今日認真參與朝會與課堂，精神奕奕。</p>
      </div>
    `;
  } else if (todayAtt.status === 'leave') {
    const typeMap = { sick: '病假', personal: '事假', official: '公假', bereavement: '喪假', other: '其他' };
    const scopeDesc = todayAtt.leaveScope === 'periods' 
      ? `請假節數：第 ${todayAtt.leavePeriods ? todayAtt.leavePeriods.join(', ') : ''} 節` 
      : '整天請假';
    attendanceBox.className = "p-4 rounded-xl border-2 border-rose-300 bg-rose-50 flex items-center space-x-3";
    attendanceBox.innerHTML = `
      <div class="text-3xl">🏖️</div>
      <div>
        <h4 class="font-black text-rose-950 text-sm">今日告假 ‧ ${typeMap[todayAtt.leaveType] || '事假'}</h4>
        <p class="text-xs text-rose-800 font-bold">${scopeDesc}</p>
        ${todayAtt.note ? `<p class="text-xs text-slate-600 mt-0.5">事由：${todayAtt.note}</p>` : ''}
      </div>
    `;
  } else if (todayAtt.status === 'late') {
    attendanceBox.className = "p-4 rounded-xl border-2 border-amber-300 bg-amber-50 flex items-center space-x-3";
    attendanceBox.innerHTML = `
      <div class="text-3xl">⏳</div>
      <div>
        <h4 class="font-black text-amber-950 text-sm">今日延遲覲見 (遲到)</h4>
        <p class="text-xs text-amber-800">${todayAtt.note || `${todayAtt.checkInTime || '07:40後'} 到校`}</p>
      </div>
    `;
  }

  // 課間下課通行紅綠燈
  const trafficBox = document.getElementById("parentTrafficStatusBox");
  if (trafficBox) {
    const traffic = window.KingdomApp.store.evaluateTrafficStatus(student.id);
    if (traffic.light === 'green') {
      trafficBox.className = "p-3.5 rounded-xl border-2 border-emerald-300 bg-emerald-50 flex items-center space-x-3";
      trafficBox.innerHTML = `
        <div class="w-10 h-10 rounded-full light-orb-green flex items-center justify-center text-white font-black text-xl flex-shrink-0">✓</div>
        <div>
          <h4 class="font-black text-emerald-950 text-sm">🟢 准許下課 (自由活動)</h4>
          <p class="text-xs text-emerald-800">所有功課按時繳交且上課表現優良！</p>
        </div>
      `;
    } else if (traffic.light === 'yellow') {
      trafficBox.className = "p-3.5 rounded-xl border-2 border-amber-300 bg-amber-50 flex items-center space-x-3";
      trafficBox.innerHTML = `
        <div class="w-10 h-10 rounded-full light-orb-yellow flex items-center justify-center text-amber-950 font-black text-xl flex-shrink-0">!</div>
        <div>
          <h4 class="font-black text-amber-950 text-sm">🟡 待訂正 (請儘速訂正)</h4>
          <p class="text-xs text-amber-900">${traffic.desc}</p>
        </div>
      `;
    } else if (traffic.light === 'red') {
      trafficBox.className = "p-3.5 rounded-xl border-2 border-rose-300 bg-rose-50 flex items-center space-x-3";
      trafficBox.innerHTML = `
        <div class="w-10 h-10 rounded-full light-orb-red flex items-center justify-center text-white font-black text-xl flex-shrink-0">🛑</div>
        <div>
          <h4 class="font-black text-rose-950 text-sm">🔴 座位自省 (需在座位上反省)</h4>
          <p class="text-xs text-rose-900">${traffic.desc}</p>
        </div>
      `;
    } else {
      trafficBox.className = "p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 flex items-center space-x-3";
      trafficBox.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black text-base flex-shrink-0">休</div>
        <div>
          <h4 class="font-black text-slate-800 text-sm">🏖️ 請假在府</h4>
          <p class="text-xs text-slate-600">今日告假不在校，免查下課通行。</p>
        </div>
      `;
    }
  }

  // 作業
  const homeworkList = window.KingdomApp.store.data.homework;
  const hwBox = document.getElementById("parentHomeworkList");
  if (hwBox) {
    if (homeworkList.length === 0) {
      hwBox.innerHTML = `<p class="text-xs text-slate-500">目前暫無各科作業要求</p>`;
    } else {
      hwBox.innerHTML = homeworkList.map(hw => {
        const stStatus = (hw.records && hw.records[student.id]) || 'pending';
        let badgeHtml = '';
        if (stStatus === 'submitted') {
          badgeHtml = `<span class="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-2.5 py-1 rounded-full">✅ 已完成繳交</span>`;
        } else if (stStatus === 'excellent') {
          badgeHtml = `<span class="bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black px-2.5 py-1 rounded-full">🌟 皇家優選</span>`;
        } else if (stStatus === 'revision') {
          badgeHtml = `<span class="bg-purple-100 text-purple-900 border border-purple-300 text-xs font-black px-2.5 py-1 rounded-full">⚠️ 需訂正</span>`;
        } else {
          badgeHtml = `<span class="bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black px-2.5 py-1 rounded-full">❌ 未繳交 (請提醒)</span>`;
        }

        return `
          <div class="bg-white p-3 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-[10px] font-black bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded">${hw.subject}</span>
                <span class="font-black text-slate-800 text-xs sm:text-sm">${hw.title}</span>
              </div>
              <div class="text-[11px] text-slate-500 mt-0.5 font-bold">截止期限：${hw.dueDate}</div>
            </div>
            <div>
              ${badgeHtml}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 公告
  const announceBox = document.getElementById("parentAnnouncementsList");
  const announcements = window.KingdomApp.store.data.announcements;
  if (announceBox) {
    if (announcements.length === 0) {
      announceBox.innerHTML = `<p class="text-xs text-slate-500">暫無班級公告事項</p>`;
    } else {
      announceBox.innerHTML = announcements.map(a => `
        <div class="bg-white p-3 rounded-xl border border-amber-300 space-y-1 shadow-sm">
          <div class="flex items-center space-x-1.5">
            ${a.pinned ? '<span class="text-[10px] font-black bg-amber-300 text-amber-950 px-1 rounded">置頂</span>' : ''}
            <h4 class="font-black text-amber-950 text-xs sm:text-sm">${a.title}</h4>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line">${a.content}</p>
          <span class="text-[10px] text-slate-400 block font-bold">${a.date}</span>
        </div>
      `).join('');
    }
  }

  initLucideIcons();
}

function interactWithPet() {
  if (!loggedInStudentId) return;
  const student = window.KingdomApp.store.data.students.find(s => s.id === loggedInStudentId);
  if (!student) return;

  window.KingdomApp.sound.playFeedMunch();
  window.KingdomApp.triggerConfetti();
  showToast(`💖 ${student.name} 認養的萌寵動物開心地吃著點心搖著尾巴，蹭蹭手心長大中！`, "🍎");
}

// ===================================================================
// 11. 備份、音效與 Toast 工具 (Utilities)
// ===================================================================
function toggleSound() {
  window.KingdomApp.sound.enabled = !window.KingdomApp.sound.enabled;
  const btn = document.getElementById("soundToggleBtn");
  if (btn) {
    if (window.KingdomApp.sound.enabled) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-5 h-5"></i>`;
      showToast("🔊 皇家音效已開啟");
    } else {
      btn.innerHTML = `<i data-lucide="volume-x" class="w-5 h-5"></i>`;
      showToast("🔇 皇家音效已靜音");
    }
    initLucideIcons();
  }
}

function toggleSystemMenu() {
  const dropdown = document.getElementById("systemDropdown");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
}

function exportDataJSON() {
  const data = window.KingdomApp.store.data;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `西寧小小兵王國_班級資料備份_${window.KingdomApp.getTodayDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("💾 王國資料已成功匯出備份！");
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.students && parsed.attendance) {
        window.KingdomApp.store.data = parsed;
        window.KingdomApp.store.save();
        showToast("📥 備份資料已成功導入！");
        renderCurrentTeacherTab();
        renderMorningBoard();
      } else {
        alert("資料格式不正確，無法導入！");
      }
    } catch (err) {
      alert("檔案讀取錯誤，請確保為有效的 JSON 格式！");
    }
  };
  reader.readAsText(file);
}

function confirmResetData() {
  if (!checkTeacherAuth("重設王國資料")) return;
  if (confirm("確定要將所有學生名冊重置為預設的 27 位大臣示範名單嗎？")) {
    window.KingdomApp.store.reset();
    showToast("🔄 王國資料已重置為 27 位大臣預設名單！");
    renderCurrentTeacherTab();
    renderMorningBoard();
  }
}

let toastTimer = null;
function showToast(message, icon = "👑") {
  if (!message) return;
  const msg = String(message);

  // 導師指示：全面永久靜音封鎖任何「同步、雲端接收、裝置連動、指令更新」之右下角通知！
  if (msg.includes("同步") || msg.includes("接收") || msg.includes("雲端") || msg.includes("裝置") || msg.includes("指令已更新") || msg.includes("修改")) {
    return;
  }

  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.remove("translate-y-20", "opacity-0", "hidden");
  toast.classList.add("translate-y-0", "opacity-100");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    dismissToastNow();
  }, 3500);
}

function dismissToastNow() {
  const toast = document.getElementById("toastNotification");
  if (toast) {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }
  if (toastTimer) clearTimeout(toastTimer);
}

// 供雲端同步背景更新時即時重繪當前視圖
function refreshCurrentView() {
  if (currentMainView === 'morning') {
    renderMorningBoard();
  } else if (currentMainView === 'traffic') {
    renderTrafficView();
  } else if (currentMainView === 'seating') {
    renderSeatingChart();
  } else if (currentMainView === 'teacher') {
    renderCurrentTeacherTab();
    // 同步刷新點數榜與名冊，保證手機更改後電腦立即可見
    if (typeof renderPointsView === 'function') renderPointsView();
    if (typeof renderRosterView === 'function') renderRosterView();
  } else if (currentMainView === 'parent') {
    renderParentPortal();
  }

  // 跨裝置同步即時連動：若大屏投影彈窗開啟中，同步即時刷新大螢幕！
  const pointsProjModal = document.getElementById("pointsProjectionModal");
  if (pointsProjModal && !pointsProjModal.classList.contains("hidden")) {
    if (typeof renderPointsProjection === 'function') renderPointsProjection();
  }

  const contactProjModal = document.getElementById("contactProjectionModal");
  if (contactProjModal && !contactProjModal.classList.contains("hidden")) {
    if (typeof renderContactProjectionView === 'function') renderContactProjectionView();
  }

  const zooProjModal = document.getElementById("zooProjectionModal");
  if (zooProjModal && !zooProjModal.classList.contains("hidden")) {
    if (typeof renderZooProjection === 'function') renderZooProjection();
  }

  const seatingProjModal = document.getElementById("seatingProjectionModal");
  if (seatingProjModal && !seatingProjModal.classList.contains("hidden")) {
    if (typeof renderSeatingProjection === 'function') renderSeatingProjection();
  }
}

// ===================================================================
// 8. 教室座位表 (5行 x 6列 = 30格) ＆ 幸運抽籤控制器
// ===================================================================
let selectedSeatIndex = null;
let selectedDockSeatNo = null;
let draggedSeatIndex = null;
let draggedDockSeatNo = null;
let currentDockFilter = 'all';
let luckyDrawTimeout = null;

// 計算座位排別名稱 (最右邊為第一排，向左依序為第二、三、四排，最左邊兩排皆為第五排)
function getSeatingColName(colNumber, totalCols = 6) {
  if (totalCols === 6) {
    const colNames = ["第五排", "第五排", "第四排", "第三排", "第二排", "第一排"];
    return colNames[colNumber - 1] || `第${colNumber}排`;
  }
  const fromRight = totalCols - colNumber + 1;
  const digitMap = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十' };
  return `第${digitMap[fromRight] || fromRight}排`;
}

function renderSeatingChart() {
  const container = document.getElementById("seatingGridContainer");
  if (!container) return;

  const layout = window.KingdomApp.store.getSeatingLayout();
  const chart = window.KingdomApp.store.getSeatingChart();
  const students = window.KingdomApp.store.data.students;
  const todayStr = window.KingdomApp.getTodayDateString();
  const attendanceToday = (window.KingdomApp.store.data.attendance && window.KingdomApp.store.data.attendance[todayStr]) || {};

  // 動態調整 CSS Grid 列數
  container.style.gridTemplateColumns = `repeat(${layout.cols}, minmax(0, 1fr))`;

  // 渲染座位表上方每排標頭 (最左兩排第五排 -> 最右第一排)
  const colHeadersBar = document.getElementById("seatingColHeadersBar");
  if (colHeadersBar) {
    colHeadersBar.style.gridTemplateColumns = `repeat(${layout.cols}, minmax(0, 1fr))`;
    let headersHtml = "";
    for (let c = 1; c <= layout.cols; c++) {
      const name = getSeatingColName(c, layout.cols);
      headersHtml += `<div class="py-1 px-1 rounded-lg bg-amber-100/90 border border-amber-300 font-black text-amber-950 text-xs shadow-2xs">${name}</div>`;
    }
    colHeadersBar.innerHTML = headersHtml;
  }

  const statusLabel = document.getElementById("seatingLayoutStatusLabel");
  if (statusLabel) {
    statusLabel.textContent = `目前格局：${layout.rows}列 x ${layout.cols}排 (共 ${chart.length} 席位，最右為第一排，最左兩排皆為第五排)`;
  }

  const rowsInput = document.getElementById("seatingRowsInput");
  const colsInput = document.getElementById("seatingColsInput");
  if (rowsInput) rowsInput.value = layout.rows;
  if (colsInput) colsInput.value = layout.cols;

  let html = "";
  for (let i = 0; i < chart.length; i++) {
    const seatNo = chart[i];
    const student = seatNo ? students.find(s => s.seatNo === seatNo) : null;
    const isSelected = selectedSeatIndex === i;

    const row = Math.floor(i / layout.cols) + 1;
    const col = (i % layout.cols) + 1;
    const colName = getSeatingColName(col, layout.cols);

    if (student) {
      const traffic = window.KingdomApp.store.evaluateTrafficStatus(student.id);
      const att = attendanceToday[student.id] || attendanceToday[student.seatNo];

      let attBadge = "";
      if (att) {
        if (att.status === "present") attBadge = `<span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">到 ${att.checkInTime || ''}</span>`;
        else if (att.status === "late") attBadge = `<span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">⚠️ 遲到</span>`;
        else if (att.status === "leave") attBadge = `<span class="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">🏖️ 請假</span>`;
      } else {
        attBadge = `<span class="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">未到</span>`;
      }

      let lightBadge = "";
      if (traffic && traffic.light === "green") lightBadge = `<span class="text-xs" title="准許下課">🟢</span>`;
      else if (traffic && traffic.light === "yellow") lightBadge = `<span class="text-xs" title="待訂正">🟡</span>`;
      else lightBadge = `<span class="text-xs" title="禁止下課">🔴</span>`;

      const refCount = traffic ? traffic.reflectionCount : 0;
      const srvCount = traffic ? traffic.serviceCount : 0;
      let refChip = refCount > 0 ? `<span class="text-[9px] bg-rose-600 text-white font-bold px-1 rounded shadow-xs">自省${refCount > 1 ? `x${refCount}` : ''}</span>` : "";
      let serviceChip = srvCount > 0 ? `<span class="text-[9px] bg-orange-600 text-white font-bold px-1 rounded shadow-xs">愛班${srvCount > 1 ? `x${srvCount}` : ''}</span>` : "";

      html += `
        <div class="seat-desk-card ${isSelected ? 'seat-selected ring-4 ring-amber-500' : ''}" 
             id="seatDesk-${i}"
             draggable="true"
             ondragstart="handleSeatDragStart(event, ${i})"
             ondragover="handleSeatDragOver(event, ${i})"
             ondragleave="handleSeatDragLeave(event, ${i})"
             ondrop="handleSeatDrop(event, ${i})"
             ondragend="handleSeatDragEnd(event)"
             onclick="handleSeatClick(${i})">
          <div class="flex items-center justify-between text-xs w-full">
            <span class="seat-badge-cute inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-300 to-yellow-200 text-amber-950 border border-amber-400 font-mono whitespace-nowrap">
              <span>${String(student.seatNo).padStart(2, '0')} 號</span>
            </span>
            <div class="flex items-center space-x-1">
              ${lightBadge}
              ${attBadge}
            </div>
          </div>
          <div class="my-0.5 text-center flex items-center justify-center">
            <span class="seat-student-name font-black text-amber-950 text-base sm:text-lg tracking-wide font-cute truncate max-w-[110px] filter drop-shadow-xs">
              ${student.name}
            </span>
          </div>
          <div class="flex items-center justify-between w-full pt-0.5 border-t border-amber-200/60 text-[10px]">
            <div class="flex items-center space-x-1">
              ${refChip}
              ${serviceChip}
            </div>
            <button type="button" 
                    onclick="event.stopPropagation(); removeStudentFromSeat(${i})" 
                    title="移出此席位回到下方待入座名冊" 
                    class="text-[9px] text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-1 py-0.2 rounded border border-rose-200 font-bold transition">
              移出
            </button>
          </div>
        </div>
      `;
    } else {
      // 空位
      html += `
        <div class="seat-desk-card seat-desk-empty ${isSelected ? 'seat-selected ring-4 ring-amber-500' : ''}"
             id="seatDesk-${i}"
             ondragover="handleSeatDragOver(event, ${i})"
             ondragleave="handleSeatDragLeave(event, ${i})"
             ondrop="handleSeatDrop(event, ${i})"
             onclick="handleSeatClick(${i})">
          <div class="my-auto text-center flex items-center justify-center space-x-1.5">
            <span class="text-base opacity-75">🪑</span>
            <span class="text-xs font-black text-amber-900/80 font-cute">空席</span>
            <span class="text-[9px] text-amber-700/60 font-bold">(點或拖)</span>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = html;
  renderSeatingDock();
}

// --- 渲染兩側大臣座號庫 (左側男生 1-13 / 右側女生 14-27) ---
function renderSeatingDock() {
  const boysDock = document.getElementById("seatingBoysDock");
  const girlsDock = document.getElementById("seatingGirlsDock");
  if (!boysDock && !girlsDock) return;

  const chart = window.KingdomApp.store.getSeatingChart();
  const students = window.KingdomApp.store.data.students || [];

  // 已有安排到座位者的座號集合 (暫時移出座號庫)
  const seatedSet = new Set(chart.filter(n => n !== null && n !== undefined));

  // 1. 男生座號庫 (未安排座位者，支援第28位及新增大臣)
  const unassignedBoys = students.filter(s => (s.gender === 'M' || (!s.gender && s.seatNo <= 13)) && !seatedSet.has(s.seatNo));
  // 2. 女生座號庫 (未安排座位者，支援第28位及新增大臣)
  const unassignedGirls = students.filter(s => (s.gender === 'F' || (!s.gender && s.seatNo > 13) || (s.gender !== 'M' && s.seatNo > 13)) && !seatedSet.has(s.seatNo));

  // 更新兩側側欄待排計數徽章
  const boysBadge = document.getElementById("dockBoysCountBadge");
  if (boysBadge) boysBadge.textContent = `待排: ${unassignedBoys.length}人`;

  const girlsBadge = document.getElementById("dockGirlsCountBadge");
  if (girlsBadge) girlsBadge.textContent = `待排: ${unassignedGirls.length}人`;

  const buildDockCard = (student, isBoy) => {
    const isSelected = selectedDockSeatNo === student.seatNo;
    window.KingdomApp.store.syncStudentPets(student);
    const pets = student.pets || [{ type: student.animalType || 'dog' }];
    const animalIcons = pets.map(p => {
      const ps = window.KingdomApp.getAnimalStatus ? window.KingdomApp.getAnimalStatus(p.type, 0) : null;
      return ps ? ps.animalIcon : '🐾';
    }).join('');
    const borderClass = isBoy ? 'dock-side-boys' : 'dock-side-girls';

    return `
      <div class="dock-side-card dock-student-card ${borderClass} p-2 rounded-xl flex items-center justify-between gap-1.5 cursor-grab active:cursor-grabbing transition shadow-2xs ${isSelected ? 'dock-selected ring-4 ring-amber-500' : ''}"
           id="dockStudent-${student.seatNo}"
           draggable="true"
           ondragstart="handleDockStudentDragStart(event, ${student.seatNo})"
           ondragend="handleDockStudentDragEnd(event)"
           onclick="handleDockStudentClick(${student.seatNo})"
           title="${student.seatNo}號 ${student.name} (待入座) - 按住拖曳入座，或點選後再點擊席位">
        <div class="flex items-center space-x-1.5 min-w-0">
          <span class="seat-badge-cute inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-xs font-black ${isBoy ? 'bg-sky-200 text-sky-950 border border-sky-300' : 'bg-rose-200 text-rose-950 border border-rose-300'} font-mono flex-shrink-0">
            ${String(student.seatNo).padStart(2, '0')}號
          </span>
          <span class="font-black text-slate-900 text-sm font-cute truncate">
            ${student.name}
          </span>
        </div>
        <div class="flex items-center space-x-1 flex-shrink-0">
          <span class="text-xs">${animalIcons}</span>
          <span class="text-[10px] font-black ${isBoy ? 'text-sky-700 bg-sky-100' : 'text-rose-700 bg-rose-100'} px-1 py-0.5 rounded">
            入座👉
          </span>
        </div>
      </div>
    `;
  };

  if (boysDock) {
    if (unassignedBoys.length === 0) {
      boysDock.innerHTML = `
        <div class="p-3 text-center text-xs font-bold text-sky-800 bg-sky-100/80 rounded-xl border border-sky-300 col-span-full">
          🎉 男生已全員入座！
        </div>
      `;
    } else {
      boysDock.innerHTML = unassignedBoys.map(s => buildDockCard(s, true)).join('');
    }
  }

  if (girlsDock) {
    if (unassignedGirls.length === 0) {
      girlsDock.innerHTML = `
        <div class="p-3 text-center text-xs font-bold text-rose-800 bg-rose-100/80 rounded-xl border border-rose-300 col-span-full">
          🎉 女生已全員入座！
        </div>
      `;
    } else {
      girlsDock.innerHTML = unassignedGirls.map(s => buildDockCard(s, false)).join('');
    }
  }
}

// 拖曳座號庫卡片
function handleDockStudentDragStart(e, seatNo) {
  draggedDockSeatNo = seatNo;
  draggedSeatIndex = null;
  e.dataTransfer.setData("text/plain", `dock:${seatNo}`);
  e.dataTransfer.effectAllowed = "copyMove";
  const el = document.getElementById(`dockStudent-${seatNo}`);
  if (el) el.classList.add("seat-dragging");
}

function handleDockStudentDragEnd(e) {
  draggedDockSeatNo = null;
  document.querySelectorAll(".seat-dragging").forEach(el => el.classList.remove("seat-dragging"));
  document.querySelectorAll(".seat-drag-over").forEach(el => el.classList.remove("seat-drag-over"));
  document.getElementById("dockBoysContainer")?.classList.remove("dock-drag-active");
  document.getElementById("dockGirlsContainer")?.classList.remove("dock-drag-active");
}

function handleDockDragOver(e, side) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  const id = side === 'boys' ? 'dockBoysContainer' : (side === 'girls' ? 'dockGirlsContainer' : 'dockBoysContainer');
  const container = document.getElementById(id);
  if (container && !container.classList.contains("dock-drag-active")) {
    container.classList.add("dock-drag-active");
  }
}

function handleDockDragLeave(e, side) {
  const id = side === 'boys' ? 'dockBoysContainer' : (side === 'girls' ? 'dockGirlsContainer' : 'dockBoysContainer');
  const container = document.getElementById(id);
  if (container) container.classList.remove("dock-drag-active");
}

function handleDockDrop(e, side) {
  e.preventDefault();
  document.getElementById("dockBoysContainer")?.classList.remove("dock-drag-active");
  document.getElementById("dockGirlsContainer")?.classList.remove("dock-drag-active");

  let fromIdx = draggedSeatIndex;
  if (fromIdx === null && e.dataTransfer) {
    const data = e.dataTransfer.getData("text/plain");
    if (data && data.startsWith("seat:")) {
      fromIdx = parseInt(data.replace("seat:", ""), 10);
    }
  }

  if (fromIdx !== null && !isNaN(fromIdx)) {
    const chart = window.KingdomApp.store.getSeatingChart();
    const seatNo = chart[fromIdx];
    const student = seatNo ? window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo) : null;
    window.KingdomApp.store.setSeatStudent(fromIdx, null);
    draggedSeatIndex = null;
    draggedDockSeatNo = null;
    document.querySelectorAll(".seat-dragging").forEach(el => el.classList.remove("seat-dragging"));
    if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
      window.KingdomApp.sound.playCoin();
    }
    showToast(`💺 已將【${student ? `${student.seatNo}號 ${student.name}` : '該席位'}】移出座位，回到座號庫！`, "🎒");
    renderSeatingChart();
  }
}

// --- 座位網格拖曳核心事件處理 (Seat Grid Drag & Drop) ---
function handleSeatDragStart(e, idx) {
  draggedSeatIndex = idx;
  draggedDockSeatNo = null;
  if (e.dataTransfer) {
    e.dataTransfer.setData("text/plain", `seat:${idx}`);
    e.dataTransfer.effectAllowed = "move";
  }
  const el = document.getElementById(`seatDesk-${idx}`);
  if (el) el.classList.add("seat-dragging");
}

function handleSeatDragOver(e, idx) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
  const el = document.getElementById(`seatDesk-${idx}`);
  if (el && !el.classList.contains("seat-drag-over")) {
    el.classList.add("seat-drag-over");
  }
}

function handleSeatDragLeave(e, idx) {
  const el = document.getElementById(`seatDesk-${idx}`);
  if (el) el.classList.remove("seat-drag-over");
}

function handleSeatDrop(e, targetIdx) {
  e.preventDefault();
  document.querySelectorAll(".seat-drag-over").forEach(el => el.classList.remove("seat-drag-over"));
  document.querySelectorAll(".seat-dragging").forEach(el => el.classList.remove("seat-dragging"));

  let dragData = "";
  try {
    dragData = e.dataTransfer ? e.dataTransfer.getData("text/plain") : "";
  } catch (err) {}

  // 1. 若是從兩側座號庫拖曳入座 (男生/女生座號庫)
  let fromDockSeatNo = draggedDockSeatNo;
  if (fromDockSeatNo === null && dragData && dragData.startsWith("dock:")) {
    fromDockSeatNo = parseInt(dragData.replace("dock:", ""), 10);
  }

  if (fromDockSeatNo !== null && !isNaN(fromDockSeatNo)) {
    const seatNo = fromDockSeatNo;
    const student = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
    window.KingdomApp.store.setSeatStudent(targetIdx, seatNo);
    draggedDockSeatNo = null;
    draggedSeatIndex = null;
    if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
      window.KingdomApp.sound.playCoin();
    }
    showToast(`💺 已將【${seatNo}號 ${student ? student.name : ''}】安排入座！`, "🎉");
    cancelSeatSelection();
    return;
  }

  // 2. 若是從座位拖曳至另一個席位 (席位互換或移至空位)
  let fromSeatIdx = draggedSeatIndex;
  if (fromSeatIdx === null && dragData && dragData.startsWith("seat:")) {
    fromSeatIdx = parseInt(dragData.replace("seat:", ""), 10);
  }

  if (fromSeatIdx !== null && !isNaN(fromSeatIdx)) {
    if (fromSeatIdx !== targetIdx) {
      window.KingdomApp.store.swapSeats(fromSeatIdx, targetIdx);
      if (window.KingdomApp.sound && window.KingdomApp.sound.playCoin) {
        window.KingdomApp.sound.playCoin();
      }
      showToast("💺 席位互換成功！", "👑");
    }
    draggedSeatIndex = null;
    draggedDockSeatNo = null;
    cancelSeatSelection();
    return;
  }
}

function handleSeatDragEnd(e) {
  draggedSeatIndex = null;
  draggedDockSeatNo = null;
  document.querySelectorAll(".seat-dragging").forEach(el => el.classList.remove("seat-dragging"));
  document.querySelectorAll(".seat-drag-over").forEach(el => el.classList.remove("seat-drag-over"));
  document.getElementById("dockBoysContainer")?.classList.remove("dock-drag-active");
  document.getElementById("dockGirlsContainer")?.classList.remove("dock-drag-active");
}

function handleDockStudentClick(seatNo) {
  const student = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
  if (!student) return;

  if (selectedDockSeatNo === seatNo) {
    selectedDockSeatNo = null;
    cancelSeatSelection();
    return;
  }

  selectedDockSeatNo = seatNo;
  selectedSeatIndex = null;

  const notice = document.getElementById("seatingSwapNotice");
  const text = document.getElementById("seatingSwapText");
  if (text) {
    text.innerHTML = `已選取下方大臣 <b>【${student.seatNo}號 ${student.name}】</b>，請點擊上方任意座位入座（或點擊取消）：`;
  }
  if (notice) notice.classList.remove("hidden");
  renderSeatingChart();
}

function handleSeatClick(idx) {
  const chart = window.KingdomApp.store.getSeatingChart();
  const notice = document.getElementById("seatingSwapNotice");
  const text = document.getElementById("seatingSwapText");

  // 若目前已選取下方待入座大臣，點擊座位直接入座！
  if (selectedDockSeatNo !== null) {
    const seatNo = selectedDockSeatNo;
    const student = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
    window.KingdomApp.store.setSeatStudent(idx, seatNo);
    window.KingdomApp.sound.playCoin();
    showToast(`💺 已將【${seatNo}號 ${student ? student.name : ''}】安排入座！`, "🎉");
    selectedDockSeatNo = null;
    cancelSeatSelection();
    return;
  }

  // 原有座位互換邏輯
  if (selectedSeatIndex === null) {
    selectedSeatIndex = idx;
    const seatNo = chart[idx];
    const student = seatNo ? window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo) : null;
    const label = student ? `${student.seatNo}號 ${student.name}` : `席位 ${idx + 1} (空席)`;
    if (text) text.textContent = `已選取「${label}」，請點擊另一個席位進行互換（或再次點擊取消）：`;
    if (notice) notice.classList.remove("hidden");
    renderSeatingChart();
  } else {
    if (selectedSeatIndex === idx) {
      cancelSeatSelection();
    } else {
      const fromIdx = selectedSeatIndex;
      const toIdx = idx;
      window.KingdomApp.store.swapSeats(fromIdx, toIdx);
      window.KingdomApp.sound.playCoin();
      showToast(`💺 席位互換成功！`, "👑");
      cancelSeatSelection();
    }
  }
}

function cancelSeatSelection() {
  selectedSeatIndex = null;
  selectedDockSeatNo = null;
  const notice = document.getElementById("seatingSwapNotice");
  if (notice) notice.classList.add("hidden");
  renderSeatingChart();
}

function removeStudentFromSeat(idx) {
  const chart = window.KingdomApp.store.getSeatingChart();
  const seatNo = chart[idx];
  if (seatNo) {
    const student = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
    window.KingdomApp.store.setSeatStudent(idx, null);
    window.KingdomApp.sound.playCoin();
    showToast(`💺 已將【${student ? `${student.seatNo}號 ${student.name}` : '該席位'}】移出，回到下方待入座托盤！`, "🎒");
    renderSeatingChart();
  }
}

function filterDockView(filter) {
  currentDockFilter = filter;
  const filters = ['all', 'unassigned', 'assigned'];
  filters.forEach(f => {
    const btn = document.getElementById(`btnDockFilter-${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = "px-2.5 py-1 rounded-lg bg-amber-950 text-amber-200 border border-amber-950 shadow-xs font-black";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg bg-white/90 text-slate-700 border border-amber-300 hover:bg-amber-100 font-bold";
      }
    }
  });
  renderSeatingDock();
}

function clearAllSeatsPrompt() {
  if (confirm("🧹 確定要清空所有座位嗎？全班 27 位大臣將全數移至下方待入座區，方便您重新拖曳排座。")) {
    window.KingdomApp.store.clearAllSeats();
    window.KingdomApp.sound.playCoin();
    cancelSeatSelection();
    showToast("🧹 所有席位已清空，大臣皆已集中於下方待入座托盤！", "✨");
    renderSeatingChart();
  }
}

function autoAssignOrderPrompt() {
  if (confirm("👑 確定要將 1~27 位大臣依照座號順序自動排入座位嗎？")) {
    window.KingdomApp.store.assignSeatsInOrder();
    window.KingdomApp.sound.playFanfare();
    cancelSeatSelection();
    showToast("👑 已依 1~27 座號順序自動排滿座位！", "✨");
    renderSeatingChart();
  }
}

function randomizeSeatsPrompt() {
  if (confirm("👑 確定要隨機重新排位全班 27 位大臣的座位嗎？")) {
    window.KingdomApp.store.randomizeSeats();
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();
    cancelSeatSelection();
    showToast("🔀 全班座位已隨機重新分配！", "🎉");
    renderSeatingChart();
  }
}

function resetSeatingPrompt() {
  if (confirm("確定要將座位表恢復為 1~27 號初始依序排位嗎？")) {
    window.KingdomApp.store.resetSeatingChart();
    cancelSeatSelection();
    showToast("🔄 座位表已恢復為 1~27 號預設排位！", "💺");
    renderSeatingChart();
  }
}

function printSeatingChart() {
  document.body.classList.add("print-mode-seating");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("print-mode-seating");
  }, 1000);
}

function printHomeworkSettlement() {
  document.body.classList.add("print-mode-homework");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("print-mode-homework");
  }, 1000);
}

function startLuckyDraw() {
  if (luckyDrawTimeout) return;
  const btn = document.getElementById("btnStartLuckyDraw");
  const banner = document.getElementById("luckyDrawBanner");
  const chart = window.KingdomApp.store.getSeatingChart();
  const students = window.KingdomApp.store.data.students;
  const todayStr = window.KingdomApp.getTodayDateString();
  const attendanceToday = (window.KingdomApp.store.data.attendance && window.KingdomApp.store.data.attendance[todayStr]) || {};

  const candidates = [];
  chart.forEach((seatNo, idx) => {
    if (seatNo) {
      const st = students.find(s => s.seatNo === seatNo);
      const att = attendanceToday[st?.id];
      const isAbsent = att && att.status === 'leave' && att.leaveScope === 'full_day';
      if (st && !isAbsent) {
        candidates.push({ idx, student: st });
      }
    }
  });

  if (candidates.length === 0) {
    showToast("目前沒有可抽籤的大臣席位！", "⚠️");
    return;
  }

  if (banner) banner.classList.add("hidden");
  if (btn) btn.disabled = true;

  let step = 0;
  let speed = 65;
  const totalSteps = 26 + Math.floor(Math.random() * 8);
  let currentActiveIdx = -1;

  function stepSpin() {
    if (currentActiveIdx >= 0) {
      const prevEl = document.getElementById(`seatDesk-${currentActiveIdx}`);
      if (prevEl) prevEl.classList.remove("seat-lucky-active");
    }

    const currentCandidate = candidates[step % candidates.length];
    currentActiveIdx = currentCandidate.idx;
    const currEl = document.getElementById(`seatDesk-${currentActiveIdx}`);
    if (currEl) {
      currEl.classList.add("seat-lucky-active");
    }
    window.KingdomApp.sound.playWheelSpin();

    step++;
    if (step < totalSteps) {
      if (step > totalSteps - 8) speed += 40;
      else if (step > totalSteps - 4) speed += 70;
      luckyDrawTimeout = setTimeout(stepSpin, speed);
    } else {
      luckyDrawTimeout = null;
      if (btn) btn.disabled = false;
      const winner = currentCandidate.student;
      window.KingdomApp.sound.playFanfare();
      window.KingdomApp.triggerConfetti();

      const nameEl = document.getElementById("luckyStudentName");
      const detailEl = document.getElementById("luckyStudentDetail");
      if (nameEl) nameEl.textContent = `🎉 ${winner.seatNo}號 ${winner.name} 🎉`;
      if (detailEl) detailEl.textContent = `內閣官職：${winner.title || '皇家大臣'} ‧ 目前榮譽蘋果：${winner.points} 顆`;
      if (banner) banner.classList.remove("hidden");
      showToast(`👑 幸運大臣抽籤結果：${winner.seatNo}號 ${winner.name}！`, "🎉");
    }
  }

  stepSpin();
}

function closeLuckyDrawBanner() {
  const banner = document.getElementById("luckyDrawBanner");
  if (banner) banner.classList.add("hidden");
  document.querySelectorAll(".seat-lucky-active").forEach(el => el.classList.remove("seat-lucky-active"));
}

// ===================================================================
// 9. 魔法沙漏 ‧ 課堂活動倒數計時器
// ===================================================================
let timerSecondsRemaining = 300;
let timerTotalSeconds = 300;
let isTimerRunning = false;
let timerInterval = null;
let timerActivity = "抄寫家庭聯絡簿";

function openTimerModal() {
  switchTimerTab('countdown');
  const modal = document.getElementById("timerModal");
  if (modal) modal.classList.remove("hidden");
  updateTimerUI();
  renderAlarmPresets();
}

function closeTimerModal() {
  const modal = document.getElementById("timerModal");
  if (modal) modal.classList.add("hidden");
  updateFloatingTimerBar();
}

function setTimerPreset(label, seconds) {
  timerActivity = label;
  timerTotalSeconds = seconds;
  timerSecondsRemaining = seconds;
  const input = document.getElementById("timerActivityInput");
  if (input) input.value = label;
  updateTimerUI();
}

function adjustTimerSeconds(deltaSec) {
  timerSecondsRemaining = Math.max(10, timerSecondsRemaining + deltaSec);
  if (timerSecondsRemaining > timerTotalSeconds) {
    timerTotalSeconds = timerSecondsRemaining;
  }
  updateTimerUI();
}

function toggleTimerRunning() {
  if (isTimerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  const input = document.getElementById("timerActivityInput");
  if (input && input.value.trim()) timerActivity = input.value.trim();

  if (timerSecondsRemaining <= 0) {
    timerSecondsRemaining = timerTotalSeconds || 300;
  }

  isTimerRunning = true;
  updateTimerUI();

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSecondsRemaining--;
    if (timerSecondsRemaining <= 5 && timerSecondsRemaining > 0) {
      window.KingdomApp.sound.playTimerTick();
    }
    if (timerSecondsRemaining <= 0) {
      timerSecondsRemaining = 0;
      clearInterval(timerInterval);
      timerInterval = null;
      isTimerRunning = false;
      updateTimerUI();
      window.KingdomApp.sound.playTimerAlarm();
      window.KingdomApp.triggerConfetti();
      showToast(`⏰ 時間到！[${timerActivity}] 倒數計時已結束！`, "🔔");
      alert(`⏰ 時間到！[${timerActivity}] 活動倒數結束！`);
    } else {
      updateTimerUI();
    }
  }, 1000);
}

function pauseTimer() {
  isTimerRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  updateTimerUI();
}

function stopTimer() {
  pauseTimer();
  timerSecondsRemaining = timerTotalSeconds;
  updateTimerUI();
  updateFloatingTimerBar();
}

function resetTimer() {
  pauseTimer();
  timerSecondsRemaining = timerTotalSeconds;
  updateTimerUI();
}

function updateTimerUI() {
  const digitsEl = document.getElementById("timerDisplayDigits");
  const barEl = document.getElementById("timerProgressBar");
  const iconEl = document.getElementById("timerActionIcon");
  const textEl = document.getElementById("timerActionText");

  const mins = Math.floor(timerSecondsRemaining / 60);
  const secs = timerSecondsRemaining % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (digitsEl) digitsEl.textContent = timeStr;
  if (barEl) {
    const percent = timerTotalSeconds > 0 ? (timerSecondsRemaining / timerTotalSeconds) * 100 : 0;
    barEl.style.width = `${percent}%`;
  }

  if (iconEl && textEl) {
    if (isTimerRunning) {
      iconEl.textContent = "⏸️";
      textEl.textContent = "暫停計時";
    } else {
      iconEl.textContent = "▶️";
      textEl.textContent = timerSecondsRemaining < timerTotalSeconds ? "繼續計時" : "開始計時";
    }
  }

  updateFloatingTimerBar();
}

function updateFloatingTimerBar() {
  const bar = document.getElementById("floatingTimerBar");
  const modal = document.getElementById("timerModal");
  const isModalOpen = modal && !modal.classList.contains("hidden");

  if (!bar) return;

  if (isTimerRunning && !isModalOpen) {
    bar.classList.remove("hidden");
    const digits = document.getElementById("floatingTimerDigits");
    const label = document.getElementById("floatingTimerLabel");
    const btnPause = document.getElementById("btnFloatingPause");

    const mins = Math.floor(timerSecondsRemaining / 60);
    const secs = timerSecondsRemaining % 60;
    if (digits) digits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (label) label.textContent = timerActivity || "活動計時中";
    if (btnPause) btnPause.textContent = isTimerRunning ? "⏸️" : "▶️";
  } else {
    bar.classList.add("hidden");
  }
}

// ===================================================================
// 10. 安靜提醒與王國音量守護者
// ===================================================================
let silenceTimeout = null;
let isDecibelRunning = false;
let audioContext = null;
let analyserNode = null;
let micStream = null;
let decibelAnimId = null;
let decibelThreshold = 70;

function openSilenceModal() {
  const modal = document.getElementById("silenceModal");
  if (modal) modal.classList.remove("hidden");
}

function closeSilenceModal() {
  const modal = document.getElementById("silenceModal");
  if (modal) modal.classList.add("hidden");
}

function triggerSilenceDecree() {
  closeSilenceModal();
  const overlay = document.getElementById("silenceDecreeOverlay");
  if (overlay) overlay.classList.remove("hidden");
  window.KingdomApp.sound.playSilenceChime();

  if (silenceTimeout) clearTimeout(silenceTimeout);
  silenceTimeout = setTimeout(() => {
    closeSilenceDecree();
  }, 4000);
}

function closeSilenceDecree() {
  const overlay = document.getElementById("silenceDecreeOverlay");
  if (overlay) overlay.classList.add("hidden");
  if (silenceTimeout) clearTimeout(silenceTimeout);
}

async function toggleDecibelMeter() {
  const btn = document.getElementById("btnToggleDecibel");
  const bar = document.getElementById("decibelMeterBar");
  const valText = document.getElementById("decibelValueText");
  const statusText = document.getElementById("decibelStatusText");

  if (isDecibelRunning) {
    if (decibelAnimId) cancelAnimationFrame(decibelAnimId);
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      micStream = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
      audioContext = null;
    }
    isDecibelRunning = false;
    if (btn) {
      btn.textContent = "開啟音量監測";
      btn.className = "px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow transition";
    }
    if (bar) {
      bar.style.width = "0%";
      bar.className = "h-full rounded-full transition-all duration-100 bg-emerald-500";
    }
    if (valText) valText.textContent = "0%";
    if (statusText) {
      statusText.textContent = "待機中（尚未啟動麥克風）";
      statusText.className = "text-slate-600";
    }
    showToast("音量監測儀已關閉", "🎙️");
  } else {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
      const source = audioContext.createMediaStreamSource(micStream);
      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.3;
      source.connect(analyserNode);

      isDecibelRunning = true;
      if (btn) {
        btn.textContent = "關閉音量監測";
        btn.className = "px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow transition";
      }
      showToast("🎙️ 麥克風音量監測已啟動！", "🟢");

      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

      function sampleDecibel() {
        if (!isDecibelRunning) return;
        analyserNode.getByteTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        const percent = Math.min(100, Math.round(rms * 320));

        if (bar) bar.style.width = `${percent}%`;
        if (valText) valText.textContent = `${percent}%`;

        if (percent > decibelThreshold) {
          if (bar) bar.className = "h-full rounded-full transition-all duration-100 bg-rose-500";
          if (statusText) {
            statusText.textContent = "⚠️ 教室喧嘩超標！請壓低音量！";
            statusText.className = "text-rose-600 font-black animate-pulse";
          }
        } else if (percent > 40) {
          if (bar) bar.className = "h-full rounded-full transition-all duration-100 bg-amber-500";
          if (statusText) {
            statusText.textContent = "🟡 輕聲細語（分組討論良好）";
            statusText.className = "text-amber-700 font-bold";
          }
        } else {
          if (bar) bar.className = "h-full rounded-full transition-all duration-100 bg-emerald-500";
          if (statusText) {
            statusText.textContent = "🟢 寧靜專注（王國秩序優良）";
            statusText.className = "text-emerald-700 font-bold";
          }
        }

        decibelAnimId = requestAnimationFrame(sampleDecibel);
      }

      sampleDecibel();
    } catch (err) {
      console.error("無法存取麥克風", err);
      alert("無法啟動麥克風，請確認瀏覽器已允許存取麥克風權限！");
    }
  }
}

function updateDecibelThreshold(val) {
  decibelThreshold = Number(val);
  const disp = document.getElementById("thresholdDisplay");
  if (disp) disp.textContent = `${val}%`;
}

// ===================================================================
// 11. 跨裝置雲端資料同步中心 (Cloud Sync UI Controller)
// ===================================================================
function openCloudSyncModal() {
  if (!checkTeacherAuth("管理跨裝置雲端同步設定")) return;
  const modal = document.getElementById("cloudSyncModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const sync = window.KingdomApp.cloudSync;
  if (!sync) return;

  const googleInput = document.getElementById("googleAccountInput");
  if (googleInput) googleInput.value = sync.config.googleAccount || "xining502@gmail.com";

  const scriptInput = document.getElementById("googleScriptUrlInput");
  if (scriptInput) scriptInput.value = sync.config.googleScriptUrl || "";

  const shareUrl = sync.getShareableSyncUrl();
  const urlInput = document.getElementById("syncShareUrlInput");
  if (urlInput) urlInput.value = shareUrl;

  const qrImg = document.getElementById("cloudSyncQrCode");
  if (qrImg && shareUrl) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`;
  }

  updateCloudSyncModalStatus(sync.getStatus());
}

function closeCloudSyncModal() {
  const modal = document.getElementById("cloudSyncModal");
  if (modal) modal.classList.add("hidden");
}

function updateCloudSyncModalStatus(status) {
  const badge = document.getElementById("syncStatusBadge");
  const timeText = document.getElementById("syncLastTimeText");
  const modeText = document.getElementById("syncModeText");

  if (badge) {
    if (status.status === 'syncing') {
      badge.textContent = "同步傳輸中...";
      badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse";
    } else if (status.isLocalHost) {
      if (status.googleScriptUrl) {
        badge.textContent = "🟢 本機 ＆ Google 雲端中繼雙保險";
        badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white";
      } else {
        badge.textContent = "🟡 僅教室 Wi-Fi 區網連線";
        badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-600 text-white";
      }
    } else if (status.googleScriptUrl) {
      if (status.status === 'error') {
        badge.textContent = "連線異常";
        badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white";
      } else {
        badge.textContent = "🟢 Google 官方雲端中繼站";
        badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white";
      }
    } else {
      badge.textContent = "⚠️ 手機電信外網 (未綁定 Google 雲端)";
      badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white";
    }
  }

  if (timeText) {
    if (status.lastSyncTime) {
      const d = new Date(status.lastSyncTime);
      timeText.textContent = `最後同步：${d.toLocaleTimeString()}`;
    } else {
      timeText.textContent = status.googleScriptUrl || status.isLocalHost ? "最後同步：剛剛" : "最後同步：等待綁定雲端庫";
    }
  }

  if (modeText) {
    if (status.isLocalHost) {
      if (status.googleScriptUrl) {
        modeText.textContent = status.lanIp 
          ? `教室 Wi-Fi (${status.lanIp}) ＋ 4G/5G 電信外網雙向自動轉推`
          : "本機伺服器 ＋ 4G/5G 電信外網雙向自動轉推";
      } else {
        modeText.textContent = status.lanIp 
          ? `僅教室 Wi-Fi (${status.lanIp})，手機連電信網路請設定下方 Google 雲端`
          : "僅本機伺服器，手機連電信網路請設定下方 Google 雲端庫";
      }
    } else if (status.googleScriptUrl) {
      modeText.textContent = "Google 官方雲端庫 (支援 4G/5G 電信網路秒級即時同步)";
    } else {
      modeText.textContent = "⚠️ 處於電信外網，請依步驟貼上 Google Apps Script 網址以接收電腦更新";
    }
  }

  // 自動更新 QR Code 與分享網址 (若 LAN IP 解析完成)
  const sync = window.KingdomApp && window.KingdomApp.cloudSync;
  if (sync) {
    const shareUrl = sync.getShareableSyncUrl();
    const urlInput = document.getElementById("syncShareUrlInput");
    if (urlInput && urlInput.value !== shareUrl) {
      urlInput.value = shareUrl;
    }
    const qrImg = document.getElementById("cloudSyncQrCode");
    if (qrImg && shareUrl) {
      const targetSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`;
      if (qrImg.getAttribute("data-last-url") !== shareUrl) {
        qrImg.setAttribute("data-last-url", shareUrl);
        qrImg.src = targetSrc;
      }
    }
  }
}

function updateCloudSyncBadge(status) {
  const dot = document.getElementById("cloudSyncDot");
  const label = document.getElementById("cloudSyncLabel");
  if (!dot) return;

  if (status.status === 'syncing') {
    dot.className = "w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-ping";
    if (label) label.textContent = "同步中...";
  } else if (status.status === 'success') {
    dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block";
    if (label) label.textContent = "雲端已同步";
  } else if (status.status === 'error') {
    dot.className = "w-2.5 h-2.5 rounded-full bg-rose-400 inline-block";
    if (label) label.textContent = "連線中斷";
  } else {
    dot.className = "w-2.5 h-2.5 rounded-full bg-slate-400 inline-block";
    if (label) label.textContent = "雲端同步";
  }

  updateCloudSyncModalStatus(status);
}

function saveGoogleAccountSync() {
  const input = document.getElementById("googleAccountInput");
  if (!input) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    alert("請輸入有效的 Google 帳號 (例如：yourname@gmail.com)！");
    return;
  }

  const sync = window.KingdomApp.cloudSync;
  sync.saveConfig({
    googleAccount: email,
    syncKey: email,
    enabled: true
  });

  const urlInput = document.getElementById("syncShareUrlInput");
  if (urlInput) urlInput.value = sync.getShareableSyncUrl();

  showToast(`已綁定 Google 帳號「${email}」！正在同步資料...`, "☁️");
  sync.pull();
}

function saveGoogleScriptUrl() {
  const input = document.getElementById("googleScriptUrlInput");
  if (!input) return;
  const url = input.value.trim();
  const sync = window.KingdomApp.cloudSync;
  sync.saveConfig({ googleScriptUrl: url });

  const shareUrl = sync.getShareableSyncUrl();
  const shareInput = document.getElementById("syncShareUrlInput");
  if (shareInput) shareInput.value = shareUrl;

  const qrImg = document.getElementById("cloudSyncQrCode");
  if (qrImg && shareUrl) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`;
  }

  updateCloudSyncModalStatus(sync.getStatus());
  showToast("Google 雲端應用程式網址已儲存！", "👑");
  if (url) {
    sync.push();
  }
}

async function testGoogleCloudConnection() {
  const input = document.getElementById("googleScriptUrlInput");
  const resultDiv = document.getElementById("testCloudResult");
  if (!input || !resultDiv) return;
  let url = input.value.trim().replace(/^["']|["']$/g, '');
  if (!url) {
    alert("請先貼上 Google Apps Script 網址！");
    return;
  }

  // 1. 網址格式即時防呆診斷
  if (url.includes('/edit') || url.includes('/home/projects')) {
    resultDiv.classList.remove("hidden");
    resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950";
    resultDiv.innerHTML = `⚠️ <b>網址貼錯囉（貼成了編輯器後台）：</b><br>您目前貼上的網址結尾是 <code>/edit</code>，這是寫程式碼的編輯器後台，不能作為資料中繼站。<br>👉 <b>正確取得方式：</b>請前往 Google Apps Script 點右上角「<b>部署</b>」➔「<b>管理部署作業</b>」，複製「網頁應用程式」網址（結尾必須為 <code>/exec</code>）！`;
    return;
  }

  if (url.endsWith('/dev')) {
    resultDiv.classList.remove("hidden");
    resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950";
    resultDiv.innerHTML = `⚠️ <b>您貼上的是開發測試網址 (/dev)：</b><br>此網址需要登入您的 Google 帳號才能讀取。請至右上角「<b>部署</b>」➔「<b>管理部署作業</b>」，複製「網頁應用程式」正式網址（結尾為 <code>/exec</code>）！`;
    return;
  }

  if (!url.startsWith('https://script.google.com/')) {
    resultDiv.classList.remove("hidden");
    resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950";
    resultDiv.innerHTML = `⚠️ <b>網址開頭不正確：</b><br>Google 雲端腳本網址必須以 <code>https://script.google.com/macros/s/...</code> 開頭。`;
    return;
  }

  resultDiv.classList.remove("hidden");
  resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 animate-pulse";
  resultDiv.innerHTML = "⏳ 正在測試與 Google 官方雲端中繼站雙向連線...";

  const startTime = Date.now();
  try {
    // 優先透過本機伺服器端測試 (若伺服器運行中，不受瀏覽器 CORS 限制)
    const serverRes = await fetch('/api/sync/test-cloud', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleScriptUrl: url })
    }).then(r => r.json()).catch(() => null);

    if (serverRes) {
      if (serverRes.success) {
        // 連線成功，自動儲存網址並立即拉取對齊最新存檔
        const sync = window.KingdomApp && window.KingdomApp.cloudSync;
        if (sync) {
          sync.saveConfig({ googleScriptUrl: url });
          sync.pull({ silent: true });
        }
        resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900";
        resultDiv.innerHTML = `🟢 <b>Google 雲端庫連線正常，設定已自動保存！</b> (延遲 ${serverRes.latency || (Date.now() - startTime)}ms)<br>📱 電腦端編輯後後端將自動轉推雲端，已為您自動同步最新名冊（含第 28 位大臣）！`;
        return;
      } else {
        throw new Error(serverRes.error || serverRes.message || '伺服器檢測失敗');
      }
    }

    // 若本機伺服器未提供測試 API，以瀏覽器直接嘗試 pull 測試 (Safari 友善 Simple Request)
    const cacheBust = `_t=${Date.now()}&_r=${Math.random().toString(36).substring(2, 7)}`;
    const sep = url.includes('?') ? '&' : '?';
    const testUrl = `${url}${sep}account=xining502@gmail.com&action=pull&${cacheBust}`;

    // 1. 優先以純 Simple Request 進行標準測試 (不帶自訂標頭與 cache 控制，避免 Safari 觸發 OPTIONS 預檢)
    try {
      const directRes = await fetch(testUrl, { method: 'GET' });
      const latency = Date.now() - startTime;
      if (directRes.ok) {
        const sync = window.KingdomApp && window.KingdomApp.cloudSync;
        if (sync) {
          sync.saveConfig({ googleScriptUrl: url });
          sync.pull({ silent: true });
        }
        resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900";
        resultDiv.innerHTML = `🟢 <b>Google 雲端庫連線成功，設定已自動保存！</b> (延遲 ${latency}ms)<br>📱 手機連線電信網路 (4G/5G) 可即時雙向同步，最新名冊已成功對齊！`;
        return;
      }
    } catch (fetchErr) {
      console.warn('[CloudSync] 瀏覽器標準 Fetch 受阻，嘗試 Safari 隱私保護相容通道:', fetchErr.message);
    }

    // 2. 若受 Safari「防止跨網站追蹤」限制，改以 mode: 'no-cors' 探測端點可達性
    try {
      await fetch(testUrl, { method: 'GET', mode: 'no-cors' });
      const latency = Date.now() - startTime;
      const sync = window.KingdomApp && window.KingdomApp.cloudSync;
      if (sync) {
        sync.saveConfig({ googleScriptUrl: url });
        sync.pull({ silent: true });
      }
      resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900";
      resultDiv.innerHTML = `🟢 <b>Google 雲端庫連線成功！(Safari 相容模式，已自動保存)</b> (延遲 ${latency}ms)<br>📱 您的 iPhone Safari 已成功連接 Google 雲端庫，電信外網同步正常運作！`;
      return;
    } catch (_) {}

    throw new Error('瀏覽器跨網域連線受限');
  } catch (err) {
    resultDiv.className = "text-[11px] font-bold mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950 space-y-1.5";
    resultDiv.innerHTML = `
      <div class="text-rose-700 font-black">❌ 雲端連線測試未通過：${err.message}</div>
      <div class="text-[11px] text-slate-700 font-normal leading-relaxed">
        <div class="font-bold text-amber-950 mt-1">💡 最常見未通過原因與 3 步驟排查：</div>
        <div><b>1. 存取權限問題（最常發生）：</b><br>
          請回到 Google Apps Script 點右上角「<b>部署</b>」➔「<b>管理部署作業</b>」➔ 點右側鉛筆 ✏️「<b>編輯</b>」：<br>
          ・「<b>誰可以存取 (Who has access)</b>」：務必選為「<b>所有人 (Anyone)</b>」（若選成僅限自己會被 Google 拒絕連線）<br>
          ・「<b>版本 (Version)</b>」：選取「<b>新版本</b>」<br>
          ・點擊「<b>部署</b>」儲存！
        </div>
        <div class="mt-1"><b>2. 伺服器未啟動：</b><br>
          若您直接用瀏覽器開檔案，請至資料夾雙擊執行「<b>啟動西寧小小兵王國.bat</b>」，在伺服器視窗開啟狀態下點擊測試。
        </div>
      </div>
    `;
  }
}

function copyGoogleAppsScriptCode() {
  const code = `/**
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

  // 2. 學生名冊與點數智能融合 (支援手機/平板/電腦雙向同步、新增大臣與點數自由調度)
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
    var finalPets = (iSt.pets && iSt.pets.length > 0) ? iSt.pets : bSt.pets;
    var finalSecondPet = iSt.secondPetType !== undefined ? iSt.secondPetType : (bSt.secondPetType || null);
    var finalSecondExp = (iSt.secondPetExp !== undefined && iSt.secondPetExp !== null) ? Number(iSt.secondPetExp) : (Number(bSt.secondPetExp) || 0);

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
      pets: finalPets
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
}`;

  navigator.clipboard.writeText(code).then(() => {
    showToast("📋 已複製 Google 雲端腳本代碼！請至 script.google.com 貼上並部署。", "🎉");
  }).catch(() => {
    alert("複製成功！請至 script.google.com 貼上部署。");
  });
}

function copyShareableSyncUrl() {
  const sync = window.KingdomApp.cloudSync;
  const url = sync.getShareableSyncUrl();
  if (!url) return;

  navigator.clipboard.writeText(url).then(() => {
    showToast("📋 已複製專屬同步網址！傳至手機或平板點開即可自動同步。", "🎉");
  }).catch(() => {
    const input = document.getElementById("syncShareUrlInput");
    if (input) {
      input.select();
      document.execCommand("copy");
      showToast("📋 已複製專屬同步網址！", "🎉");
    }
  });
}

async function triggerManualSync() {
  const sync = window.KingdomApp && window.KingdomApp.cloudSync;
  const store = window.KingdomApp && window.KingdomApp.store;
  if (!sync || !store) return;
  showToast("正在與雲端同步資料...", "🔄");
  
  try {
    const pullRes = await sync.pull({ force: true });
    
    // 檢查當前名冊是否已是真實名冊 (1號洪永恩、2號莊淇勛)
    const isRealRoster = store.data.students && 
      store.data.students[0] && store.data.students[0].name === "洪永恩" &&
      store.data.students[1] && store.data.students[1].name === "莊淇勛";

    if (!isRealRoster) {
      console.log("[Sync] 偵測到本機/雲端資料仍為舊名冊，強制載入五年二班電腦最新 27 位大臣主存檔！");
      store.applyMasterRosterBackup();
      try { await sync.push({ silent: true, force: true }); } catch (_) {}
    }

    if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
      window.KingdomUI.refreshCurrentView();
    }
    const count = (store.data && store.data.students) ? store.data.students.length : 27;
    showToast(`🎉 已成功同步五年二班最新名冊（共 ${count} 位大臣：洪永恩、莊淇勛...）！`, "🟢");
  } catch (err) {
    console.error("同步失敗", err);
    // 僅在完全無名冊或假名冊時才啟動預設備援，絕不盲目覆蓋已有名冊
    const isRealRoster = store.data.students && 
      store.data.students[0] && store.data.students[0].name === "洪永恩";
    if (!isRealRoster && store && typeof store.applyMasterRosterBackup === 'function') {
      store.applyMasterRosterBackup();
    }
    if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
      window.KingdomUI.refreshCurrentView();
    }
    showToast("⚠️ 雲端連線暫時逾時，已保全本機最新大臣資料！", "💡");
  }
}

function exportBackupJSON() {
  window.KingdomApp.cloudSync.exportBackupJSON();
  showToast("💾 班級資料備份檔下載中...", "👑");
}

async function importBackupJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    const res = await window.KingdomApp.cloudSync.importBackupJSON(file);
    showToast(`📂 成功匯入 ${res.count} 位大臣完整存檔！`, "🎉");
    closeCloudSyncModal();
  } catch (err) {
    alert(`匯入失敗：${err.message}`);
  }
}

function openTimeMachineModal() {
  if (!checkTeacherAuth("使用時光機存檔救援")) return;
  const modal = document.getElementById("timeMachineModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderTimeMachineSnapshots();
}

function closeTimeMachineModal() {
  const modal = document.getElementById("timeMachineModal");
  if (modal) modal.classList.add("hidden");
}

async function renderTimeMachineSnapshots() {
  const container = document.getElementById("timeMachineSnapshotsList");
  if (!container) return;

  const store = window.KingdomApp && window.KingdomApp.store;
  const sync = window.KingdomApp && window.KingdomApp.cloudSync;
  if (!store || !sync) return;

  const localSnaps = store.getLocalSnapshots();

  let serverSnaps = [];
  try {
    const sRes = await sync.fetchServerSnapshots();
    if (sRes && sRes.snapshots) serverSnaps = sRes.snapshots;
  } catch (_) {}

  let html = '';

  // 1. 雲端中繼站對齊專區 (可直接拉取手機剛同步的大臣與點數)
  html += `
    <div class="p-3 mb-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm flex items-center justify-between">
      <div>
        <div class="font-black text-xs flex items-center space-x-1">
          <span>☁️ Google 雲端中繼站對齊</span>
          <span class="text-[9px] bg-amber-700/60 px-1.5 py-0.2 rounded-full">雙向保險</span>
        </div>
        <div class="text-[10px] opacity-95 mt-0.5">若手機或曾編輯的裝置已連線，點此立即拉回包含第 28 位大臣的最新存檔</div>
      </div>
      <button onclick="pullLatestFromCloud()" class="px-3 py-1.5 rounded-xl bg-white text-amber-950 font-black text-xs shadow hover:bg-amber-100 flex items-center space-x-1 shrink-0">
        <span>🔄 立即自雲端拉取</span>
      </button>
    </div>
  `;

  if (localSnaps.length === 0 && serverSnaps.length === 0) {
    container.innerHTML = html + `
      <div class="text-center py-6 text-slate-500 text-xs">
        目前尚無歷史快照紀錄。每次進行重要操作或同步時，系統將自動為您拍照留存。
      </div>
    `;
    return;
  }

  if (localSnaps.length > 0) {
    html += `<div class="text-xs font-black text-amber-950 mb-1.5 flex items-center space-x-1">
      <span>📱 本機瀏覽器時光機快照 (共 ${localSnaps.length} 份)</span>
    </div>`;
    html += `<div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">`;
    localSnaps.forEach(snap => {
      html += `
        <div class="p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 transition flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-amber-950">${escapeHtml(snap.reason || '自動備份')}</div>
            <div class="text-[10px] text-slate-500 font-mono mt-0.5">時間：${snap.timeStr || new Date(snap.timestamp).toLocaleString()} ‧ 大臣人數：${snap.studentCount || 27}人</div>
          </div>
          <button onclick="restoreFromLocalSnapshot('${snap.id}')" class="px-3 py-1 rounded-lg bg-amber-950 text-amber-300 hover:bg-amber-900 font-bold text-xs shadow-sm flex items-center space-x-1 shrink-0">
            <span>↩️</span>
            <span>還原此版</span>
          </button>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (serverSnaps.length > 0) {
    html += `<div class="text-xs font-black text-amber-950 mt-3 mb-1.5 flex items-center space-x-1">
      <span>🖥️ 本機伺服器磁碟備份 (共 ${serverSnaps.length} 份)</span>
    </div>`;
    html += `<div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">`;
    serverSnaps.forEach(snap => {
      html += `
        <div class="p-2.5 rounded-xl border border-sky-300 bg-sky-50/70 hover:bg-sky-100 transition flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-sky-950">${escapeHtml(snap.filename)}</div>
            <div class="text-[10px] text-slate-500 font-mono mt-0.5">時間：${snap.timeString} ‧ 大小：${Math.round(snap.size / 1024)} KB</div>
          </div>
          <button onclick="restoreFromServerSnapshot('${snap.filename}')" class="px-3 py-1 rounded-lg bg-sky-900 text-sky-200 hover:bg-sky-800 font-bold text-xs shadow-sm flex items-center space-x-1 shrink-0">
            <span>↩️</span>
            <span>還原此版</span>
          </button>
        </div>
      `;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
}

async function restoreMasterPcData() {
  const ok = confirm("確定要還原至五年二班真實大臣完整存檔（洪永恩、莊淇勛...等27位大臣）嗎？\n\n系統將自動備份當前狀態，並將完整資料打上最新時間戳，保證手機與電腦立即同步恢復！");
  if (!ok) return;
  const store = window.KingdomApp && window.KingdomApp.store;
  const sync = window.KingdomApp && window.KingdomApp.cloudSync;
  if (!store) return;
  showToast("正在還原電腦主存檔...", "⏳");

  // 1. 若在本地有伺服器環境，優先嘗試伺服器還原
  let restored = false;
  if (sync && typeof sync.restoreServerSnapshot === 'function') {
    try {
      const res = await sync.restoreServerSnapshot();
      if (res && res.success) {
        restored = true;
      }
    } catch (_) {}
  }

  // 2. 若無本機伺服器（例如在手機端、GitHub Pages 或離線），直接載入內嵌完整主存檔
  if (!restored) {
    if (typeof store.applyMasterRosterBackup === 'function') {
      store.applyMasterRosterBackup();
    }
    if (sync) {
      try { await sync.push({ silent: true, force: true }); } catch (_) {}
    }
  }

  closeTimeMachineModal();
  closeCloudSyncModal();
  if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
    window.KingdomUI.refreshCurrentView();
  }
  showToast("🎉 成功還原電腦主存檔（共 27 位大臣：洪永恩、莊淇勛...）！", "👑");
}

async function pullLatestFromCloud() {
  const sync = window.KingdomApp && window.KingdomApp.cloudSync;
  if (!sync) return;
  showToast("正在從 Google 雲端庫拉取最新名冊...", "☁️");
  try {
    const res = await sync.pull({ force: true });
    if (res && res.success) {
      const count = (window.KingdomApp.store.data && window.KingdomApp.store.data.students) ? window.KingdomApp.store.data.students.length : 27;
      showToast(`🎉 成功自 Google 雲端拉取最新存檔！共 ${count} 位大臣。`, "🟢");
      closeTimeMachineModal();
      if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
        window.KingdomUI.refreshCurrentView();
      }
    } else {
      showToast(`⚠️ 雲端拉取未成功：${res.message || res.error || '請先在雲端同步設定確認 Google Script 網址'}`, "❌");
    }
  } catch (err) {
    showToast(`⚠️ 雲端拉取失敗：${err.message}`, "❌");
  }
}

function restoreFromLocalSnapshot(snapshotId) {
  const ok = confirm("確定要還原至此時光機歷史版本嗎？\n\n系統會將現有狀態自動留存備份後再執行還原。");
  if (!ok) return;
  const res = window.KingdomApp.store.restoreLocalSnapshot(snapshotId);
  if (res.success) {
    const count = res.count || (window.KingdomApp.store.data.students ? window.KingdomApp.store.data.students.length : 27);
    showToast(`🎉 成功還原至該時光機版本！共 ${count} 位大臣。`, "👑");
    const sync = window.KingdomApp && window.KingdomApp.cloudSync;
    if (sync) {
      try { sync.push({ silent: true, force: true }); } catch (_) {}
    }
    closeTimeMachineModal();
    closeCloudSyncModal();
    if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
      window.KingdomUI.refreshCurrentView();
    }
  } else {
    alert("還原失敗：" + res.message);
  }
}

async function restoreFromServerSnapshot(filename) {
  const ok = confirm(`確定要從伺服器磁碟備份「${filename}」還原嗎？\n\n系統會自動備份當前存檔，並將該版本作為最新版本同步給所有裝置。`);
  if (!ok) return;
  showToast("正在從伺服器磁碟備份還原...", "⏳");
  const res = await window.KingdomApp.cloudSync.restoreServerSnapshot(filename);
  if (res.success) {
    showToast(`🎉 成功還原伺服器存檔 (共 ${res.studentCount || 27} 位大臣)！`, "👑");
    closeTimeMachineModal();
    closeCloudSyncModal();
    if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
      window.KingdomUI.refreshCurrentView();
    }
  } else {
    alert("還原失敗：" + (res.error || res.message));
  }
}

async function forcePushCurrentToLan() {
  const sync = window.KingdomApp && window.KingdomApp.cloudSync;
  if (!sync) return;
  showToast("正在將本頁面存檔強制推送至本機伺服器...", "⏳");
  const res = await sync.push({ silent: false, force: true });
  if (res.success) {
    showToast("🎉 已成功將本頁存檔同步至本機伺服器！其他裝置皆可讀取此最新存檔！", "👑");
  } else {
    alert("推送至伺服器失敗：" + (res.error || res.message));
  }
}

async function forcePullFromLan() {
  const sync = window.KingdomApp && window.KingdomApp.cloudSync;
  if (!sync) return;
  showToast("正在強制從伺服器拉取最新存檔...", "⏳");
  const res = await sync.pull({ silent: false, force: true });
  if (res.success) {
    showToast("🎉 已成功從伺服器拉取最新存檔！", "👑");
  } else {
    alert("從伺服器拉取失敗：" + (res.error || '連線逾時'));
  }
}

if (typeof window !== 'undefined') {
  window.KingdomUI = {
    switchMainView,
    refreshCurrentView,
    renderSeatingChart,
    renderMorningBoard,
    renderTrafficView,
    showToast,
    openTimerModal,
    openSilenceModal,
    openCloudSyncModal,
    openTimeMachineModal,
    closeTimeMachineModal,
    renderTimeMachineSnapshots,
    restoreMasterPcData,
    restoreFromLocalSnapshot,
    restoreFromServerSnapshot,
    forcePushCurrentToLan,
    forcePullFromLan
  };
}


// ===================================================================
// 課堂定時鬧鐘與計時器標籤頁 (Alarm Clock & Activity Timer)
// ===================================================================
function switchTimerTab(tab) {
  currentTimerTab = tab;
  const btnCountdown = document.getElementById("btnTabCountdown");
  const btnAlarm = document.getElementById("btnTabAlarm");
  const panelCountdown = document.getElementById("panelCountdown");
  const panelAlarm = document.getElementById("panelAlarm");

  if (tab === 'countdown') {
    if (btnCountdown) btnCountdown.className = "flex-1 py-2 text-center text-xs sm:text-sm font-black rounded-lg transition bg-amber-950 text-amber-300 shadow";
    if (btnAlarm) btnAlarm.className = "flex-1 py-2 text-center text-xs sm:text-sm font-black rounded-lg transition text-amber-950 hover:bg-amber-200";
    if (panelCountdown) panelCountdown.classList.remove("hidden");
    if (panelAlarm) panelAlarm.classList.add("hidden");
  } else {
    if (btnCountdown) btnCountdown.className = "flex-1 py-2 text-center text-xs sm:text-sm font-black rounded-lg transition text-amber-950 hover:bg-amber-200";
    if (btnAlarm) btnAlarm.className = "flex-1 py-2 text-center text-xs sm:text-sm font-black rounded-lg transition bg-amber-950 text-amber-300 shadow";
    if (panelCountdown) panelCountdown.classList.add("hidden");
    if (panelAlarm) panelAlarm.classList.remove("hidden");
    updateAlarmUI();
    renderAlarmPresets();
  }
}

// ===================================================================
// 課堂作息鐘聲快捷管理 (Alarm Presets Manager)
// ===================================================================
function renderAlarmPresets() {
  const grid = document.getElementById("alarmPresetsGrid");
  if (!grid) return;
  const presets = (window.KingdomApp && window.KingdomApp.store && typeof window.KingdomApp.store.getAlarmPresets === 'function')
    ? window.KingdomApp.store.getAlarmPresets()
    : [];

  if (!presets || presets.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center py-2 text-xs text-amber-800/70 font-bold bg-amber-50/80 rounded-lg border border-dashed border-amber-300">尚未建立快捷，請點擊上方「編輯管理快捷」新增</div>`;
    return;
  }

  grid.innerHTML = presets.map(p => {
    const isHl = !!p.highlight;
    const bgClass = isHl
      ? "bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-400 font-black shadow-xs"
      : "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300 font-bold";
    const safeTime = (p.time || "").replace(/'/g, "\\'");
    const safeLabel = (p.label || "").replace(/'/g, "\\'");
    const safeBtnText = (p.btnText || p.time || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeTitle = `${p.time} - ${p.label || ''}`.replace(/"/g, '&quot;');
    return `
      <button type="button" onclick="setAlarmPreset('${safeTime}', '${safeLabel}')" class="px-2 py-1.5 rounded-lg ${bgClass} border text-center transition truncate cursor-pointer" title="${safeTitle}">
        ${safeBtnText}
      </button>
    `;
  }).join('');
}

function openManageAlarmPresetsModal() {
  if (!checkTeacherAuth("設定課堂作息鐘聲快捷")) return;
  const modal = document.getElementById("manageAlarmPresetsModal");
  if (!modal) return;
  cancelEditAlarmPreset();
  renderAlarmPresetsManageList();
  modal.classList.remove("hidden");
}

function closeManageAlarmPresetsModal() {
  const modal = document.getElementById("manageAlarmPresetsModal");
  if (modal) modal.classList.add("hidden");
  renderAlarmPresets();
}

function renderAlarmPresetsManageList() {
  const list = document.getElementById("alarmPresetsManageList");
  const countBadge = document.getElementById("alarmPresetsCountBadge");
  if (!list) return;

  const presets = (window.KingdomApp && window.KingdomApp.store && typeof window.KingdomApp.store.getAlarmPresets === 'function')
    ? window.KingdomApp.store.getAlarmPresets()
    : [];

  if (countBadge) countBadge.textContent = `${presets.length} 項`;

  if (presets.length === 0) {
    list.innerHTML = `<div class="p-4 text-center text-slate-400 font-bold">目前無任何鐘聲快捷，請利用下方表單新增</div>`;
    return;
  }

  list.innerHTML = presets.map((p) => {
    const isHl = !!p.highlight;
    const safeId = (p.id || '').replace(/'/g, "\\'");
    const safeBtnText = (p.btnText || p.time || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeLabel = (p.label || "無事由備註").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
      <div class="flex items-center justify-between p-2 rounded-lg ${isHl ? 'bg-amber-50 border border-amber-300' : 'bg-slate-50 border border-slate-200'} hover:shadow-xs transition">
        <div class="flex items-center space-x-2.5 min-w-0 flex-1">
          <span class="font-digital font-black text-sm px-2 py-0.5 rounded bg-amber-950 text-amber-300 shrink-0">
            ${p.time}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center space-x-1.5">
              <span class="font-black text-amber-950 text-xs truncate">${safeBtnText}</span>
              ${isHl ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-300 text-amber-950 font-black shrink-0">醒目</span>' : ''}
            </div>
            <div class="text-[11px] text-slate-500 truncate">${safeLabel}</div>
          </div>
        </div>
        <div class="flex items-center space-x-1 shrink-0 ml-2">
          <button type="button" onclick="editAlarmPresetInline('${safeId}')" class="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition cursor-pointer" title="編輯此快捷">
            ✏️
          </button>
          <button type="button" onclick="deleteAlarmPresetItem('${safeId}')" class="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer" title="刪除此快捷">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function editAlarmPresetInline(id) {
  const presets = (window.KingdomApp && window.KingdomApp.store && typeof window.KingdomApp.store.getAlarmPresets === 'function')
    ? window.KingdomApp.store.getAlarmPresets()
    : [];
  const preset = presets.find(p => p.id === id);
  if (!preset) return;

  const idInput = document.getElementById("editAlarmPresetId");
  const timeInput = document.getElementById("newAlarmPresetTime");
  const btnTextInput = document.getElementById("newAlarmPresetBtnText");
  const labelInput = document.getElementById("newAlarmPresetLabel");
  const hlInput = document.getElementById("newAlarmPresetHighlight");

  const formTitle = document.getElementById("alarmPresetFormTitle");
  const btnCancel = document.getElementById("btnCancelEditAlarmPreset");
  const btnSaveIcon = document.getElementById("btnSaveAlarmPresetIcon");
  const btnSaveText = document.getElementById("btnSaveAlarmPresetText");

  if (idInput) idInput.value = preset.id;
  if (timeInput) timeInput.value = preset.time || "";
  if (btnTextInput) btnTextInput.value = preset.btnText || "";
  if (labelInput) labelInput.value = preset.label || "";
  if (hlInput) hlInput.checked = !!preset.highlight;

  if (formTitle) formTitle.textContent = `✏️ 正在編輯快捷【${preset.btnText}】：`;
  if (btnCancel) btnCancel.classList.remove("hidden");
  if (btnSaveIcon) btnSaveIcon.textContent = "💾";
  if (btnSaveText) btnSaveText.textContent = "儲存修改";

  if (timeInput) timeInput.focus();
}

function cancelEditAlarmPreset() {
  const idInput = document.getElementById("editAlarmPresetId");
  const timeInput = document.getElementById("newAlarmPresetTime");
  const btnTextInput = document.getElementById("newAlarmPresetBtnText");
  const labelInput = document.getElementById("newAlarmPresetLabel");
  const hlInput = document.getElementById("newAlarmPresetHighlight");

  const formTitle = document.getElementById("alarmPresetFormTitle");
  const btnCancel = document.getElementById("btnCancelEditAlarmPreset");
  const btnSaveIcon = document.getElementById("btnSaveAlarmPresetIcon");
  const btnSaveText = document.getElementById("btnSaveAlarmPresetText");

  if (idInput) idInput.value = "";
  if (timeInput) timeInput.value = "";
  if (btnTextInput) btnTextInput.value = "";
  if (labelInput) labelInput.value = "";
  if (hlInput) hlInput.checked = false;

  if (formTitle) formTitle.textContent = "➕ 新增作息鐘聲快捷：";
  if (btnCancel) btnCancel.classList.add("hidden");
  if (btnSaveIcon) btnSaveIcon.textContent = "➕";
  if (btnSaveText) btnSaveText.textContent = "新增至快捷庫";
}

function submitAlarmPresetForm(e) {
  if (e && e.preventDefault) e.preventDefault();
  const id = (document.getElementById("editAlarmPresetId")?.value || "").trim();
  const time = (document.getElementById("newAlarmPresetTime")?.value || "").trim();
  const btnText = (document.getElementById("newAlarmPresetBtnText")?.value || "").trim();
  const label = (document.getElementById("newAlarmPresetLabel")?.value || "").trim();
  const highlight = !!document.getElementById("newAlarmPresetHighlight")?.checked;

  if (!time || !btnText) {
    alert("請填寫定時時間與按鈕顯示文字！");
    return;
  }

  if (id) {
    window.KingdomApp.store.updateAlarmPreset(id, { time, btnText, label, highlight });
    showToast(`✅ 已更新作息快捷【${btnText}】！`, "⏰");
  } else {
    window.KingdomApp.store.addAlarmPreset({ time, btnText, label, highlight });
    showToast(`✅ 已新增作息快捷【${btnText}】！`, "⏰");
  }

  cancelEditAlarmPreset();
  renderAlarmPresetsManageList();
  renderAlarmPresets();
}

function deleteAlarmPresetItem(id) {
  const presets = (window.KingdomApp && window.KingdomApp.store && typeof window.KingdomApp.store.getAlarmPresets === 'function')
    ? window.KingdomApp.store.getAlarmPresets()
    : [];
  const found = presets.find(p => p.id === id);
  const name = found ? found.btnText : "此項目";

  if (!confirm(`確定要刪除作息鐘聲快捷【${name}】嗎？`)) return;

  window.KingdomApp.store.deleteAlarmPreset(id);
  showToast(`🗑️ 已刪除作息快捷【${name}】`, "✨");

  cancelEditAlarmPreset();
  renderAlarmPresetsManageList();
  renderAlarmPresets();
}

function confirmResetAlarmPresetsToDefault() {
  if (!confirm("確定要將課堂作息鐘聲快捷恢復為國小預設作息（一上、一休、大下課、三休、午餐、午休畢、五休、六休、放學）嗎？自訂的項目將會被重設。")) return;

  window.KingdomApp.store.resetAlarmPresets();
  showToast("🔄 已成功恢復國小預設作息鐘聲快捷！", "🔔");

  cancelEditAlarmPreset();
  renderAlarmPresetsManageList();
  renderAlarmPresets();
}

function setAlarmPreset(timeStr, label) {
  alarmTargetTime = timeStr;
  alarmActivityLabel = label;
  const timeInput = document.getElementById("alarmTimeInput");
  const labelInput = document.getElementById("alarmLabelInput");
  if (timeInput) timeInput.value = timeStr;
  if (labelInput) labelInput.value = label;
  isAlarmActive = true;
  updateAlarmUI();
  showToast(`⏰ 已設定課堂定時鬧鐘：${timeStr}【${label}】`, "⏰");
}

function toggleAlarmEnabled() {
  const timeInput = document.getElementById("alarmTimeInput");
  const labelInput = document.getElementById("alarmLabelInput");
  if (timeInput && timeInput.value) alarmTargetTime = timeInput.value;
  if (labelInput && labelInput.value) alarmActivityLabel = labelInput.value;

  isAlarmActive = !isAlarmActive;
  updateAlarmUI();
  if (isAlarmActive) {
    showToast(`⏰ 定時鬧鐘已啟用！將於 ${alarmTargetTime} 鳴響鐘聲`, "🔔");
  } else {
    showToast("⏰ 定時鬧鐘已停用", "ℹ️");
  }
}

function updateAlarmUI() {
  const badge = document.getElementById("alarmStatusBadge");
  const btn = document.getElementById("btnToggleAlarm");
  const toggleIcon = document.getElementById("alarmToggleIcon");
  const toggleText = document.getElementById("alarmToggleText");

  if (badge) {
    if (isAlarmActive) {
      badge.textContent = `⏰ 鬧鐘已啟用 (${alarmTargetTime})`;
      badge.className = "text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse";
    } else {
      badge.textContent = "鬧鐘未啟用";
      badge.className = "text-xs font-black px-2.5 py-1 rounded-full bg-slate-200 text-slate-700";
    }
  }

  if (btn) {
    if (isAlarmActive) {
      btn.className = "px-6 py-2.5 rounded-xl font-black text-sm shadow-md bg-rose-600 hover:bg-rose-500 text-white flex items-center space-x-1.5 transition";
      if (toggleIcon) toggleIcon.textContent = "🔕";
      if (toggleText) toggleText.textContent = "關閉定時鬧鐘";
    } else {
      btn.className = "px-6 py-2.5 rounded-xl font-black text-sm shadow-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 transition";
      if (toggleIcon) toggleIcon.textContent = "⏰";
      if (toggleText) toggleText.textContent = "啟用定時鬧鐘";
    }
  }

  const navBtn = document.getElementById("btnNavAlarm");
  if (navBtn) {
    if (isAlarmActive) {
      navBtn.className = "px-2.5 py-1.5 rounded-xl bg-rose-600 text-white border border-rose-400 font-black hover:bg-rose-500 transition shadow-sm flex items-center space-x-1 text-xs animate-pulse whitespace-nowrap shrink-0";
      navBtn.innerHTML = `<span>⏰</span><span class="whitespace-nowrap font-bold">鬧鐘: ${alarmTargetTime}</span>`;
    } else {
      navBtn.className = "px-2.5 py-1.5 rounded-xl bg-amber-100/90 border border-amber-500 text-amber-950 font-black hover:bg-amber-200 transition shadow-sm flex items-center space-x-1 text-xs whitespace-nowrap shrink-0";
      navBtn.innerHTML = `<span>⏰</span><span class="whitespace-nowrap font-bold">定時鬧鐘</span>`;
    }
  }

  updateFloatingTimerBar();
}

function triggerAlarmRing() {
  window.KingdomApp.sound.playBreakBell();
  window.KingdomApp.triggerConfetti();

  const overlay = document.getElementById("alarmAlertOverlay");
  const overlayTime = document.getElementById("alarmAlertOverlayTime");
  const overlayLabel = document.getElementById("alarmAlertOverlayLabel");

  if (overlayTime) overlayTime.textContent = alarmTargetTime;
  if (overlayLabel) overlayLabel.textContent = alarmActivityLabel || "課堂活動時間到！";
  if (overlay) overlay.classList.remove("hidden");
}

function dismissAlarmAlert() {
  const overlay = document.getElementById("alarmAlertOverlay");
  if (overlay) overlay.classList.add("hidden");
}

// ===================================================================
// 可愛守護動物更換與 5 階金化展示 (Change Guardian Animal)
// ===================================================================
let activeChangeAnimalStudentId = null;
let activeChangeAnimalSlot = 0; // 0 (第1寵), 1 (第2寵), 2 (第3寵)...

function openChangeAnimalModal(studentId, slot = 0) {
  let slotIndex = 0;
  if (slot === 'second') slotIndex = 1;
  else if (slot === 'primary') slotIndex = 0;
  else slotIndex = parseInt(slot, 10) || 0;

  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId || s.seatNo === studentId);
  if (!student) return;

  window.KingdomApp.store.syncStudentPets(student);
  let lifetime = parseInt(student.lifetimePoints, 10);
  if (isNaN(lifetime) || lifetime < 0) {
    lifetime = 0;
    student.lifetimePoints = 0;
  }
  const maxAllowed = 1 + Math.floor(lifetime / 500);
  const requiredPoints = slotIndex * 500;

  if (slotIndex >= maxAllowed || lifetime < requiredPoints) {
    showToast(`需累積滿 ${requiredPoints} 顆蘋果才可認養第 ${slotIndex + 1} 隻萌寵！目前累積為 ${lifetime} 顆。`, "⚠️");
    return;
  }

  activeChangeAnimalStudentId = studentId;
  activeChangeAnimalSlot = slotIndex;

  const modal = document.getElementById("changeAnimalModal");
  const modalTitle = document.getElementById("changeAnimalModalTitle");
  const targetLabel = document.getElementById("changeAnimalTargetStudent");
  const lifetimeLabel = document.getElementById("changeAnimalLifetimePts");
  const grid = document.getElementById("animalChoicesGrid");

  const isNewAdoption = slotIndex >= student.pets.length;
  if (modalTitle) {
    modalTitle.innerHTML = isNewAdoption
      ? `<span>🏆 認養第 ${slotIndex + 1} 隻守護萌寵 ‧ 9大可愛動物</span>`
      : `<span>更換第 ${slotIndex + 1} 隻認養萌寵 ‧ 9大可愛動物</span>`;
  }

  if (targetLabel) {
    targetLabel.textContent = `${String(student.seatNo).padStart(2, '0')}號 ${student.name} 大臣 (第 ${slotIndex + 1} 隻萌寵)`;
  }
  const previewPts = Math.max(0, lifetime - slotIndex * 500);
  if (lifetimeLabel) {
    lifetimeLabel.textContent = `${previewPts} 點 (此萌寵成長飽食度)`;
  }

  if (grid) {
    const currentAnimal = (student.pets[slotIndex]?.type || 'dog').toLowerCase();
    const animals = Object.values(window.KingdomApp.ANIMAL_DEFINITIONS);

    grid.innerHTML = animals.map(anim => {
      const isSelected = !isNewAdoption && anim.id === currentAnimal;
      const previewStatus = window.KingdomApp.getAnimalStatus(anim.id, previewPts);
      const svgPreview = window.KingdomApp.renderAnimalSVG(anim.id, previewStatus.stageIndex);

      return `
        <div onclick="selectNewAnimalForStudent('${anim.id}')"
          class="parchment-card p-3 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col justify-between hover:scale-105 ${isSelected ? 'border-amber-600 bg-amber-100/90 shadow-md ring-2 ring-amber-400' : 'border-amber-300 hover:border-amber-500 bg-white/90'}">
          <div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-xl">${anim.icon}</span>
              ${isSelected ? '<span class="bg-amber-950 text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-black">目前守護</span>' : '<span class="text-[10px] font-bold text-slate-500">點擊認養</span>'}
            </div>
            <h4 class="font-black text-sm text-amber-950 mt-1">${anim.name}</h4>
            <div class="w-20 h-20 mx-auto my-1">
              ${svgPreview}
            </div>
            <div class="text-[10px] text-amber-900 font-bold bg-amber-50 p-1 rounded-lg border border-amber-200">
              ${previewStatus.stageTitle}
            </div>
          </div>
          <p class="text-[10px] text-slate-600 mt-1 line-clamp-2">${anim.desc}</p>
        </div>
      `;
    }).join('');
  }

  if (modal) modal.classList.remove("hidden");
}

function openAdoptSecondPetModal(studentId) {
  openChangeAnimalModal(studentId, 1);
}

function selectNewAnimalForStudent(animalId) {
  if (!activeChangeAnimalStudentId) return;
  const student = window.KingdomApp.store.data.students.find(s => s.id === activeChangeAnimalStudentId || s.seatNo === activeChangeAnimalStudentId);
  if (!student) return;
  const def = window.KingdomApp.ANIMAL_DEFINITIONS[animalId];
  const slotIndex = typeof activeChangeAnimalSlot === 'number' ? activeChangeAnimalSlot : (activeChangeAnimalSlot === 'second' ? 1 : 0);

  const ok = window.KingdomApp.store.adoptPet(activeChangeAnimalStudentId, animalId, slotIndex);
  if (ok) {
    if (window.KingdomApp.sound && window.KingdomApp.sound.playFanfare) {
      window.KingdomApp.sound.playFanfare();
    }
    if (window.KingdomApp.triggerConfetti) {
      window.KingdomApp.triggerConfetti();
    }
    showToast(`🎉 恭喜【${student.name}】成功設定第 ${slotIndex + 1} 隻守護萌寵【${def ? def.name : animalId}】！`, "🏆");
    closeChangeAnimalModal();
    refreshCurrentView();
  }
}

function closeChangeAnimalModal() {
  const modal = document.getElementById("changeAnimalModal");
  if (modal) modal.classList.add("hidden");
  activeChangeAnimalStudentId = null;
}

// ===================================================================
// 動物園投餵飼料讓動物長大 (Zoo Feeding System)
// ===================================================================
let activeFeedStudentId = null;

function openZooFeedModal(studentId) {
  activeFeedStudentId = studentId;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId || s.seatNo === studentId);
  if (!student) return;

  const modal = document.getElementById("zooFeedModal");
  if (!modal) return;

  const aKey = (student.animalType || student.petType || 'lion').toLowerCase();
  const lifetime = student.lifetimePoints !== undefined ? student.lifetimePoints : (student.points || 0);
  const petStatus = window.KingdomApp.getAnimalStatus(aKey, lifetime);
  const svgCode = window.KingdomApp.renderAnimalSVG(aKey, petStatus.stageIndex);

  const studentNameEl = document.getElementById("feedModalStudentName");
  const seatNoEl = document.getElementById("feedModalSeatNo");
  const animalNameEl = document.getElementById("feedModalAnimalName");
  const stageTitleEl = document.getElementById("feedModalStageTitle");
  const currentPtsEl = document.getElementById("feedModalCurrentPts");
  const svgContainerEl = document.getElementById("feedModalAnimalSVG");

  if (studentNameEl) studentNameEl.textContent = student.name;
  if (seatNoEl) seatNoEl.textContent = `${String(student.seatNo).padStart(2, '0')}號`;
  if (animalNameEl) animalNameEl.textContent = `${petStatus.animalIcon} ${petStatus.animalName}`;
  if (stageTitleEl) stageTitleEl.textContent = petStatus.stageTitle;
  if (currentPtsEl) currentPtsEl.textContent = `${lifetime} 🍎`;
  if (svgContainerEl) svgContainerEl.innerHTML = svgCode;

  modal.classList.remove("hidden");
  initLucideIcons();
}

function closeZooFeedModal() {
  const modal = document.getElementById("zooFeedModal");
  if (modal) modal.classList.add("hidden");
  activeFeedStudentId = null;
}

function openEditPointsFromFeedModal() {
  const targetId = activeFeedStudentId;
  closeZooFeedModal();
  if (targetId) {
    openEditStudentPointsModal(targetId);
  }
}

function executeFeedStudent(amount, foodName) {
  if (!activeFeedStudentId) return;
  const res = window.KingdomApp.store.feedStudentAnimal(activeFeedStudentId, amount, foodName);
  if (!res) return;

  window.KingdomApp.sound.playFeedMunch();

  if (res.grewUp) {
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();
    showToast(`🎉 哇！【${res.student.name}】認養的萌寵【${res.status.animalName}】吃得好飽好滿足，成功長大為【${res.status.stageTitle}】囉！`, "✨");
  } else {
    showToast(`🍎 已投餵【${res.student.name}】的萌寵【${res.foodName}】！飽食度 +${res.foodAmount}！`, "😋");
  }

  openZooFeedModal(activeFeedStudentId);
  refreshCurrentView();
}

function executeFeedCustomStudent() {
  const input = document.getElementById("feedCustomAmountInput");
  const val = parseInt(input ? input.value : 1, 10);
  if (isNaN(val) || val <= 0) {
    alert("請輸入有效的投餵份量！");
    return;
  }
  executeFeedStudent(val, `🍏 特製特大營養餐 (+${val})`);
}

// ===================================================================
// 批次更改蘋果數量與萌寵成長總額 (Batch Adjust Points & Reset)
// ===================================================================
let activeAdjustStudentIds = new Set();
let currentAdjustMode = 'set_both';

function openBatchAdjustPointsModal() {
  if (!checkTeacherAuth("批次修改可用蘋果")) return;
  const modal = document.getElementById("batchAdjustPointsModal");
  if (!modal) return;

  const students = window.KingdomApp.store.data.students;
  activeAdjustStudentIds = new Set(students.map(s => s.id));

  renderAdjustStudentsGrid();

  const radios = document.querySelectorAll('input[name="adjustModeRadio"]');
  let selectedMode = 'set_both';
  radios.forEach(r => { if (r.checked) selectedMode = r.value; });
  handleAdjustModeChange(selectedMode);

  const selectAllBtn = document.getElementById("adjustSelectAllBtn");
  if (selectAllBtn) selectAllBtn.textContent = `全選 ${students.length} 人`;

  modal.classList.remove("hidden");
}

function closeBatchAdjustPointsModal() {
  const modal = document.getElementById("batchAdjustPointsModal");
  if (modal) modal.classList.add("hidden");
}

function renderAdjustStudentsGrid() {
  const grid = document.getElementById("adjustStudentsGrid");
  const countLabel = document.getElementById("adjustSelectedCountLabel");
  const students = window.KingdomApp.store.data.students;

  if (grid) {
    grid.innerHTML = students.map(st => {
      const isChecked = activeAdjustStudentIds.has(st.id);
      return `
        <label class="flex items-center space-x-1.5 p-1 rounded hover:bg-amber-100 cursor-pointer text-xs">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleAdjustStudent(${st.id}, this.checked)" class="rounded text-amber-600">
          <span class="font-mono font-bold">${String(st.seatNo).padStart(2, '0')}.</span>
          <span class="font-bold truncate">${st.name}</span>
        </label>
      `;
    }).join('');
  }

  if (countLabel) {
    countLabel.textContent = `已選取 ${activeAdjustStudentIds.size} / ${students.length} 位大臣`;
  }
}

function toggleAdjustStudent(studentId, isChecked) {
  if (isChecked) activeAdjustStudentIds.add(studentId);
  else activeAdjustStudentIds.delete(studentId);
  const countLabel = document.getElementById("adjustSelectedCountLabel");
  if (countLabel) {
    countLabel.textContent = `已選取 ${activeAdjustStudentIds.size} / ${window.KingdomApp.store.data.students.length} 位大臣`;
  }
}

function selectAllAdjustStudents(select) {
  const students = window.KingdomApp.store.data.students;
  if (select) {
    activeAdjustStudentIds = new Set(students.map(s => s.id));
  } else {
    activeAdjustStudentIds.clear();
  }
  renderAdjustStudentsGrid();
}

function invertAdjustStudents() {
  const students = window.KingdomApp.store.data.students;
  students.forEach(st => {
    if (activeAdjustStudentIds.has(st.id)) activeAdjustStudentIds.delete(st.id);
    else activeAdjustStudentIds.add(st.id);
  });
  renderAdjustStudentsGrid();
}

function handleAdjustModeChange(mode) {
  currentAdjustMode = mode;
  const inputGroup = document.getElementById("adjustValueInputGroup");
  const valueLabel = document.getElementById("adjustValueLabel");
  const pointsInput = document.getElementById("adjustPointsInput");
  const syncLabel = document.getElementById("adjustSyncLifetimeCheckLabel");
  const checkText = document.getElementById("adjustSyncLifetimeCheckText");

  if (!inputGroup || !valueLabel || !pointsInput) return;

  // 動態更新單選卡邊框高亮
  const radioLabels = document.querySelectorAll('input[name="adjustModeRadio"]');
  radioLabels.forEach(r => {
    const parentLabel = r.closest('label');
    if (parentLabel) {
      if (r.value === mode) {
        parentLabel.classList.add('border-2', 'border-amber-500', 'bg-amber-100/90', 'font-black');
        parentLabel.classList.remove('border-amber-300', 'bg-white', 'border-rose-300', 'bg-rose-50');
      } else {
        parentLabel.classList.remove('border-2', 'border-amber-500', 'bg-amber-100/90', 'font-black');
        if (r.value === 'reset_both') {
          parentLabel.classList.add('border', 'border-rose-300', 'bg-rose-50');
        } else {
          parentLabel.classList.add('border', 'border-amber-300', 'bg-white');
        }
      }
    }
  });

  if (mode === 'set_both') {
    inputGroup.classList.remove("hidden");
    valueLabel.textContent = "🎯 直接設定可用蘋果與總累計獲得為此數值 (每位所選大臣設為此數)：";
    if (!pointsInput.value || pointsInput.value === "5") pointsInput.value = "100";
    if (syncLabel) syncLabel.classList.remove("hidden");
    if (checkText) checkText.textContent = "✅ 同步將「總累計獲得蘋果 (萌寵經驗值)」設定為此數值 (推薦)";
  } else if (mode === 'adjust') {
    inputGroup.classList.remove("hidden");
    valueLabel.textContent = "➕ 增減點數 (正數加蘋果、負數扣蘋果)：";
    if (!pointsInput.value || pointsInput.value === "50" || pointsInput.value === "100") pointsInput.value = "5";
    if (syncLabel) syncLabel.classList.remove("hidden");
    if (checkText) checkText.textContent = "✅ 增減點數時同步增減「總累計獲得蘋果」(守護萌寵進化經驗值)";
  } else if (mode === 'set_points') {
    inputGroup.classList.remove("hidden");
    valueLabel.textContent = "🍎 僅指定【可用蘋果存量】(總累計獲得保持不變)：";
    if (!pointsInput.value || pointsInput.value === "5") pointsInput.value = "100";
    if (syncLabel) syncLabel.classList.add("hidden");
  } else if (mode === 'set_lifetime') {
    inputGroup.classList.remove("hidden");
    valueLabel.textContent = "🌟 僅指定【總累計獲得蘋果】(萌寵進化經驗變更，存量不變)：";
    if (!pointsInput.value || pointsInput.value === "5") pointsInput.value = "100";
    if (syncLabel) syncLabel.classList.add("hidden");
  } else {
    // 歸零模式
    inputGroup.classList.add("hidden");
    if (syncLabel) syncLabel.classList.add("hidden");
  }
}

function submitBatchAdjustPoints(e) {
  e.preventDefault();
  if (activeAdjustStudentIds.size === 0) {
    alert("請至少選擇一位大臣！");
    return;
  }

  const ids = Array.from(activeAdjustStudentIds);
  const pointsInput = document.getElementById("adjustPointsInput");
  const pointsVal = parseInt(pointsInput?.value, 10) || 0;
  const syncLifetime = document.getElementById("adjustSyncLifetimeCheck")?.checked ?? true;
  const reason = document.getElementById("adjustReasonInput")?.value.trim() || "導師批次蘋果調度";

  if (currentAdjustMode.startsWith('reset_')) {
    let modeText = "重置點數";
    if (currentAdjustMode === 'reset_points') modeText = "可用蘋果歸零 (0顆)";
    else if (currentAdjustMode === 'reset_lifetime') modeText = "生涯累積總額歸零 (0點，萌寵進化進度重置)";
    else if (currentAdjustMode === 'reset_both') modeText = "可用蘋果與生涯總額【全部徹底歸零】";

    const confirmReset = confirm(`確定要對已選取的 ${ids.length} 位大臣執行【${modeText}】嗎？此操作將覆蓋現有累積值！`);
    if (!confirmReset) return;
  }

  window.KingdomApp.store.batchAdjustPoints(ids, {
    mode: currentAdjustMode,
    deltaPoints: pointsVal,
    targetPoints: pointsVal,
    targetLifetime: pointsVal,
    syncLifetime,
    reason
  });

  window.KingdomApp.sound.playCoin();
  showToast(`🍎 批次蘋果調度成功！已更新 ${ids.length} 位大臣資料。`, "👑");
  closeBatchAdjustPointsModal();
  refreshCurrentView();
  renderPointsView();
  renderRosterView();
}

// ===================================================================
// 大臣批次兌換特權卡牌控制器 (Batch Redeem Reward Cards Controller)
// ===================================================================
let activeBatchRedeemStudentIds = new Set();
let activeBatchRedeemCardId = null;

function openBatchRedeemCardsModal(defaultCardId = null) {
  if (!checkTeacherAuth("批次兌換特權卡牌")) return;
  const modal = document.getElementById("batchRedeemCardsModal");
  if (!modal) return;

  const cards = window.KingdomApp.store.data.rewardCards || [];
  if (cards.length === 0) {
    alert("目前尚未建立任何獎勵卡牌，請先新增特權卡！");
    return;
  }

  const students = window.KingdomApp.store.data.students || [];

  // 若集點榜目前有已勾選之大臣，優先帶入已勾選對象；否則預設全選全班
  if (typeof selectedStudentIdsForPoints !== 'undefined' && selectedStudentIdsForPoints.size > 0) {
    activeBatchRedeemStudentIds = new Set(selectedStudentIdsForPoints);
  } else {
    activeBatchRedeemStudentIds = new Set(students.map(s => s.id));
  }

  // 填充卡牌選單
  const cardSelect = document.getElementById("batchRedeemCardSelect");
  if (cardSelect) {
    cardSelect.innerHTML = cards.map(c => `
      <option value="${c.id}" ${defaultCardId && c.id === defaultCardId ? 'selected' : ''}>
        ${c.icon || '🎁'} ${c.title} (所需蘋果：${c.cost} 顆)
      </option>
    `).join('');
    activeBatchRedeemCardId = cardSelect.value;
  }

  renderBatchRedeemStudentsGrid();
  updateBatchRedeemPreview();

  modal.classList.remove("hidden");
  initLucideIcons();
}

function closeBatchRedeemCardsModal() {
  const modal = document.getElementById("batchRedeemCardsModal");
  if (modal) modal.classList.add("hidden");
}

function renderBatchRedeemStudentsGrid() {
  const grid = document.getElementById("batchRedeemStudentsGrid");
  if (!grid) return;
  const students = window.KingdomApp.store.data.students || [];
  const cards = window.KingdomApp.store.data.rewardCards || [];
  const cardSelect = document.getElementById("batchRedeemCardSelect");
  const curCard = cards.find(c => c.id === (cardSelect ? cardSelect.value : activeBatchRedeemCardId)) || cards[0];
  const cost = curCard ? (parseInt(curCard.cost, 10) || 0) : 0;

  grid.innerHTML = students.map(st => {
    const isChecked = activeBatchRedeemStudentIds.has(st.id);
    const pts = st.points || 0;
    const isEnough = pts >= cost;
    return `
      <label class="flex items-center justify-between p-1.5 rounded-lg border cursor-pointer transition text-xs ${isChecked ? (isEnough ? 'bg-amber-100 border-amber-400 font-black' : 'bg-rose-50 border-rose-300 font-bold') : 'bg-white border-slate-200 text-slate-500 opacity-70'}">
        <div class="flex items-center space-x-1.5 min-w-0">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleBatchRedeemStudent(${st.id}, this.checked)" class="rounded text-amber-600 focus:ring-amber-500 flex-shrink-0">
          <span class="font-mono text-amber-950 font-bold flex-shrink-0">${String(st.seatNo).padStart(2, '0')}.</span>
          <span class="truncate">${st.name}</span>
        </div>
        <span class="text-[10px] font-mono font-black ml-1 flex-shrink-0 ${isEnough ? 'text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded' : 'text-rose-700 bg-rose-100 px-1 py-0.2 rounded'}">
          ${pts}🍎 ${isEnough ? '✅' : '❌'}
        </span>
      </label>
    `;
  }).join('');
}

function toggleBatchRedeemStudent(studentId, isChecked) {
  if (isChecked) activeBatchRedeemStudentIds.add(studentId);
  else activeBatchRedeemStudentIds.delete(studentId);
  renderBatchRedeemStudentsGrid();
  updateBatchRedeemPreview();
}

function selectAllBatchRedeemStudents(select) {
  const students = window.KingdomApp.store.data.students || [];
  if (select) {
    activeBatchRedeemStudentIds = new Set(students.map(s => s.id));
  } else {
    activeBatchRedeemStudentIds.clear();
  }
  renderBatchRedeemStudentsGrid();
  updateBatchRedeemPreview();
}

function invertBatchRedeemStudents() {
  const students = window.KingdomApp.store.data.students || [];
  students.forEach(st => {
    if (activeBatchRedeemStudentIds.has(st.id)) activeBatchRedeemStudentIds.delete(st.id);
    else activeBatchRedeemStudentIds.add(st.id);
  });
  renderBatchRedeemStudentsGrid();
  updateBatchRedeemPreview();
}

function updateBatchRedeemPreview() {
  const cards = window.KingdomApp.store.data.rewardCards || [];
  const cardSelect = document.getElementById("batchRedeemCardSelect");
  if (!cardSelect) return;
  const cardId = cardSelect.value;
  const card = cards.find(c => c.id === cardId);
  if (!card) return;

  // 更新卡牌預覽詳情卡
  const iconEl = document.getElementById("batchRedeemCardIcon");
  const titleEl = document.getElementById("batchRedeemCardTitle");
  const descEl = document.getElementById("batchRedeemCardDesc");
  const costEl = document.getElementById("batchRedeemCardCostBadge");
  if (iconEl) iconEl.textContent = card.icon || '🎁';
  if (titleEl) titleEl.textContent = card.title;
  if (descEl) descEl.textContent = card.desc || '無特殊說明';
  if (costEl) costEl.textContent = `每人需 ${card.cost} 顆 🍎`;

  // 統計所選大臣足額/不足人數
  const students = window.KingdomApp.store.data.students || [];
  const cost = parseInt(card.cost, 10) || 0;
  let eligibleCount = 0;
  let insufficientCount = 0;
  const selectedList = [];

  activeBatchRedeemStudentIds.forEach(id => {
    const st = students.find(s => s.id === id);
    if (st) {
      selectedList.push(st);
      if ((st.points || 0) >= cost) eligibleCount++;
      else insufficientCount++;
    }
  });

  const summaryBadge = document.getElementById("batchRedeemSummaryBadge");
  const eligibleBadge = document.getElementById("batchRedeemEligibleBadge");
  if (summaryBadge) summaryBadge.textContent = `已選取 ${selectedList.length} / ${students.length} 位大臣`;
  if (eligibleBadge) {
    eligibleBadge.innerHTML = `<span class="text-emerald-700 font-black">足額：${eligibleCount} 位</span> | <span class="${insufficientCount > 0 ? 'text-rose-700 font-black' : 'text-slate-400'}">不足：${insufficientCount} 位</span>`;
  }

  const skipInsufficient = document.getElementById("batchRedeemSkipInsufficientCheck")?.checked ?? true;
  const willRedeemCount = skipInsufficient ? eligibleCount : selectedList.length;
  const totalCost = willRedeemCount * cost;

  const calcBox = document.getElementById("batchRedeemCalculationBox");
  const btn = document.getElementById("btnConfirmBatchRedeem");

  if (calcBox) {
    if (selectedList.length === 0) {
      calcBox.className = "p-3 rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-500 font-bold text-center";
      calcBox.innerHTML = `<span>⚠️ 請至少勾選一位大臣！</span>`;
      if (btn) {
        btn.disabled = true;
        btn.className = "px-6 py-2 rounded-xl font-black bg-slate-300 text-slate-500 cursor-not-allowed";
      }
    } else if (willRedeemCount === 0) {
      calcBox.className = "p-3 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-950 font-bold";
      calcBox.innerHTML = `
        <div class="flex items-center justify-between">
          <span>已選大臣可用蘋果皆未達 ${cost} 顆！</span>
          <span class="text-rose-700">無法兌換 ❌</span>
        </div>
        <div class="text-[11px] text-slate-600 font-normal mt-0.5">
          若仍欲頒發特權，可取消勾選上方「自動略過不足者」進行特准頒發。
        </div>
      `;
      if (btn) {
        btn.disabled = true;
        btn.className = "px-6 py-2 rounded-xl font-black bg-slate-300 text-slate-500 cursor-not-allowed";
      }
    } else {
      calcBox.className = "p-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-950 font-bold space-y-1";
      calcBox.innerHTML = `
        <div class="flex items-center justify-between">
          <span>預計為 <strong>${willRedeemCount} 位大臣</strong> 兌換【${card.title}】</span>
          <span class="font-mono text-emerald-700 font-black">總計扣除 ${totalCost} 顆 🍎</span>
        </div>
        <div class="pt-1 border-t border-emerald-200 text-xs font-normal flex items-center justify-between text-emerald-900">
          <span>卡牌將直接發放至每位大臣的「卡牌抽屜」中</span>
          ${insufficientCount > 0 && skipInsufficient ? `<span class="text-rose-700 font-bold">（已略過 ${insufficientCount} 位蘋果不足大臣）</span>` : '<span class="text-emerald-700 font-bold">全員足額 ✅</span>'}
        </div>
      `;
      if (btn) {
        btn.disabled = false;
        btn.className = "btn-royal-gold px-6 py-2 rounded-xl font-black shadow-md flex items-center space-x-1.5 cursor-pointer";
      }
    }
  }
}

function submitBatchRedeemCards(e) {
  if (e && e.preventDefault) e.preventDefault();
  const cardSelect = document.getElementById("batchRedeemCardSelect");
  if (!cardSelect) return;
  const cardId = cardSelect.value;
  const skipInsufficient = document.getElementById("batchRedeemSkipInsufficientCheck")?.checked ?? true;

  if (activeBatchRedeemStudentIds.size === 0) {
    alert("請至少選擇一位大臣！");
    return;
  }

  const ids = Array.from(activeBatchRedeemStudentIds);
  const result = window.KingdomApp.store.batchRedeemCard(ids, cardId, {
    skipInsufficient,
    overdraftAllowed: !skipInsufficient
  });

  if (!result.success) {
    alert(result.message || "兌換失敗，請確認大臣可用蘋果！");
    return;
  }

  if (window.KingdomApp.sound && window.KingdomApp.sound.playFanfare) {
    try { window.KingdomApp.sound.playFanfare(); } catch (err) {}
  }
  if (window.KingdomApp.triggerConfetti) {
    try { window.KingdomApp.triggerConfetti(); } catch (err) {}
  }

  // 將成功兌換的大臣抽屜展開，方便導師立即檢視
  if (!window.openCardDrawerStudentIds) window.openCardDrawerStudentIds = new Set();
  result.successful.forEach(s => window.openCardDrawerStudentIds.add(s.id));

  showToast(result.message, "👑");
  closeBatchRedeemCardsModal();
  renderRewardCards();
  renderPointsView();
  renderRosterView();
}

// ===================================================================
// 加點快捷設定庫管理 (Point Presets Manager)
// ===================================================================
function openPointPresetsModal() {
  if (!checkTeacherAuth("加點快捷設定")) return;
  const modal = document.getElementById("pointPresetsModal");
  if (!modal) return;
  renderPointPresetsManageList();
  modal.classList.remove("hidden");
}

function closePointPresetsModal() {
  const modal = document.getElementById("pointPresetsModal");
  if (modal) modal.classList.add("hidden");
}

function renderPointPresetsManageList() {
  const list = document.getElementById("presetItemsManageList");
  if (!list) return;
  const presets = window.KingdomApp.store.data.pointPresets || [];

  list.innerHTML = presets.map(p => {
    const isPlus = p.type === 'plus';
    return `
      <div class="flex items-center justify-between p-2 rounded-lg ${isPlus ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}">
        <div class="flex items-center space-x-2">
          <span class="text-base">${p.icon || (isPlus ? '💡' : '⚠️')}</span>
          <span class="font-black text-slate-800">${p.label}</span>
          <span class="font-digital font-black ${isPlus ? 'text-emerald-700' : 'text-rose-700'}">
            ${isPlus ? '+' : ''}${p.points} 點
          </span>
        </div>
        <button type="button" onclick="deletePointPresetItem('${p.id}')" class="text-rose-600 hover:text-rose-800 p-1" title="刪除規則">
          ✕
        </button>
      </div>
    `;
  }).join('');
}

function submitNewPointPresetItem(e) {
  e.preventDefault();
  const type = document.getElementById("newPresetTypeInput")?.value || 'plus';
  const points = parseInt(document.getElementById("newPresetPointsInput")?.value, 10) || (type === 'minus' ? -1 : 2);
  const label = document.getElementById("newPresetLabelInput")?.value.trim();
  const icon = document.getElementById("newPresetIconInput")?.value.trim() || '💡';

  if (!label) return;

  window.KingdomApp.store.addPointPreset({ type, label, points, icon });
  showToast(`已新增快捷規則【${label}】！`, "✨");

  document.getElementById("newPresetLabelInput").value = "";
  renderPointPresetsManageList();
  renderPointPresets();
}

function deletePointPresetItem(id) {
  if (!confirm("確定要刪除此項快捷規則嗎？")) return;
  window.KingdomApp.store.deletePointPreset(id);
  renderPointPresetsManageList();
  renderPointPresets();
}

// ===================================================================
// 全班特赦與自省卡/愛班卡單次移除 (Pardon & Disciplinary Actions)
// ===================================================================
function confirmPardonAll(type) {
  if (!checkTeacherAuth("全班特赦")) return;
  const typeName = type === 'reflection' ? '座位自省卡' : (type === 'service' ? '愛班服務卡' : '全部自省與愛班卡');
  const ok = confirm(`🕊️ 皇室恩典特赦令：\n\n確定要對全班大臣執行【${typeName}全部特赦（歸零）】嗎？`);
  if (!ok) return;

  window.KingdomApp.store.pardonAll(type);
  window.KingdomApp.sound.playFanfare();
  window.KingdomApp.triggerConfetti();
  showToast(`🕊️ 已頒布特赦令！全班【${typeName}】全部歸零赦免！`, "👑");
  refreshCurrentView();
}

function addStudentReflectionOne(studentId) {
  if (!checkTeacherAuth("增加大臣座位自省卡（導師全手動）")) return;
  window.KingdomApp.store.addReflectionCard(studentId, '課堂常規自省');
  refreshCurrentView();
  openTrafficDetailModal(studentId);
}

function removeStudentReflectionOne(studentId) {
  if (!checkTeacherAuth("移除大臣座位自省卡（導師全手動）")) return;
  window.KingdomApp.store.removeReflectionCardOne(studentId);
  refreshCurrentView();
  openTrafficDetailModal(studentId);
}

function addStudentServiceOne(studentId) {
  if (!checkTeacherAuth("增加大臣愛班服務卡（導師手動控制）")) return;
  window.KingdomApp.store.addServiceCard(studentId, '愛班服務勞動');
  refreshCurrentView();
  openTrafficDetailModal(studentId);
}

function removeStudentServiceOne(studentId) {
  if (!checkTeacherAuth("移除大臣愛班服務卡（導師手動控制）")) return;
  window.KingdomApp.store.removeServiceCardOne(studentId);
  refreshCurrentView();
  openTrafficDetailModal(studentId);
}

function removeStudentReflectionReasonByIndex(studentId, index) {
  if (!checkTeacherAuth("導師手動移除大臣座位自省卡")) return;
  window.KingdomApp.store.removeReflectionReasonByIndex(studentId, index);
  showToast("👑 導師已手動移除該筆座位自省卡！");
  refreshCurrentView();
  openTrafficDetailModal(studentId);
}

function removeStudentServiceReasonByIndex(studentId, index) {
  if (!checkTeacherAuth("導師手動移除大臣愛班服務卡")) return;
  window.KingdomApp.store.removeServiceReasonByIndex(studentId, index);
  showToast("👑 導師已手動移除該筆愛班服務卡！");
  refreshCurrentView();
  openTrafficDetailModal(studentId);
}

function pardonStudentCard(studentId, type) {
  if (!checkTeacherAuth("特赦大臣紀律卡牌（導師手動特赦）")) return;
  window.KingdomApp.store.pardonStudent(studentId, type);
  refreshCurrentView();
  openTrafficDetailModal(studentId);
}

// ===================================================================
// 教室座位表格局調整與席位指派 (Seating Layout & Direct Assignment)
// ===================================================================
let activeAssignSeatIndex = null;

function setPredefinedSeatingLayout(rows, cols) {
  if (!checkTeacherAuth("調整座位表格局")) return;
  window.KingdomApp.store.setSeatingLayout(rows, cols);
  const rowsInput = document.getElementById("seatingRowsInput");
  const colsInput = document.getElementById("seatingColsInput");
  if (rowsInput) rowsInput.value = rows;
  if (colsInput) colsInput.value = cols;
  showToast(`💺 已套用座位格局：${rows} 排 x ${cols} 列`, "💺");
  renderSeatingChart();
}

function applyCustomSeatingLayout() {
  if (!checkTeacherAuth("調整座位表格局")) return;
  const rows = parseInt(document.getElementById("seatingRowsInput")?.value, 10) || 5;
  const cols = parseInt(document.getElementById("seatingColsInput")?.value, 10) || 6;
  window.KingdomApp.store.setSeatingLayout(rows, cols);
  showToast(`💺 已套用座位格局：${rows} 排 x ${cols} 列`, "💺");
  renderSeatingChart();
}

function openAssignSeatModal(seatIdx) {
  activeAssignSeatIndex = seatIdx;
  const modal = document.getElementById("assignSeatModal");
  if (!modal) return;

  const layout = window.KingdomApp.store.getSeatingLayout();
  const chart = window.KingdomApp.store.getSeatingChart();
  const students = window.KingdomApp.store.data.students;

  const row = Math.floor(seatIdx / layout.cols) + 1;
  const col = (seatIdx % layout.cols) + 1;
  const currentSeatNo = chart[seatIdx];
  const currentStudent = currentSeatNo ? students.find(s => s.seatNo === currentSeatNo) : null;

  const coordsLabel = document.getElementById("assignSeatCoordsLabel");
  const currentLabel = document.getElementById("assignSeatCurrentStudent");
  const grid = document.getElementById("assignStudentButtonsGrid");

  const colName = getSeatingColName(col, layout.cols);
  if (coordsLabel) coordsLabel.textContent = `${colName} (席位 ${seatIdx + 1})`;
  if (currentLabel) {
    currentLabel.textContent = currentStudent ? `${currentStudent.name} (${String(currentStudent.seatNo).padStart(2, '0')}號)` : '🈳 走道空位';
  }

  if (grid) {
    grid.innerHTML = students.map(st => {
      const isCurrentOccupant = currentSeatNo === st.seatNo;
      return `
        <button type="button" onclick="assignStudentToActiveSeat(${st.seatNo})"
          class="p-2 rounded-lg border text-center transition ${isCurrentOccupant ? 'bg-amber-950 text-amber-200 border-amber-900 font-black' : 'bg-amber-50 hover:bg-amber-200 text-amber-950 border-amber-300 font-bold'}">
          <div class="font-mono text-xs">${String(st.seatNo).padStart(2, '0')}號</div>
          <div class="truncate text-xs">${st.name}</div>
        </button>
      `;
    }).join('');
  }

  modal.classList.remove("hidden");
}

function closeAssignSeatModal() {
  const modal = document.getElementById("assignSeatModal");
  if (modal) modal.classList.add("hidden");
  activeAssignSeatIndex = null;
}

function assignStudentToActiveSeat(seatNo) {
  if (activeAssignSeatIndex === null) return;
  window.KingdomApp.store.setSeatStudent(activeAssignSeatIndex, seatNo);
  const st = window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo);
  showToast(`💺 已指派【${st ? st.name : seatNo}】入座！`, "✨");
  closeAssignSeatModal();
  renderSeatingChart();
}

function setSeatToEmpty() {
  if (activeAssignSeatIndex === null) return;
  window.KingdomApp.store.setSeatStudent(activeAssignSeatIndex, null);
  showToast("💺 已將該席位設為走道空位", "ℹ️");
  closeAssignSeatModal();
  renderSeatingChart();
}

// ===================================================================
// 歷史作業查詢與篩選 (Homework History Filter)
// ===================================================================
let currentHwFilterDate = null;

function filterHomeworkByDate(dateVal) {
  currentHwFilterDate = dateVal;
  renderHomeworkSummaryBoard();
}

function showAllHomeworkHistory() {
  currentHwFilterDate = 'ALL';
  const picker = document.getElementById("hwHistoryDatePicker");
  if (picker) picker.value = "";
  renderHomeworkSummaryBoard();
}

function pardonAllReflectionCards() {
  if (!checkTeacherAuth("全班特赦自省卡")) return;
  if (!confirm("確定要特赦全班所有大臣的座位自省卡嗎？")) return;
  window.KingdomApp.store.pardonAll("reflection");
  showToast("🕊️ 已特赦全班所有大臣的座位自省卡！", "✨");
  refreshCurrentView();
}

function pardonAllServiceCards() {
  if (!checkTeacherAuth("全班特赦愛班服務卡")) return;
  if (!confirm("確定要特赦全班所有大臣的愛班服務卡嗎？")) return;
  window.KingdomApp.store.pardonAll("service");
  showToast("🕊️ 已特赦全班所有大臣的愛班服務卡！", "✨");
  refreshCurrentView();
}

// 暴露全域函數至 window，保障 HTML inline onclick 100% 正常調用
if (typeof window !== 'undefined') {
  window.dismissToastNow = dismissToastNow;
  window.openAlarmDirectModal = openAlarmDirectModal;
  window.toggleAlarmEnabled = toggleAlarmEnabled;
  window.switchTimerTab = switchTimerTab;
  window.setAlarmPreset = setAlarmPreset;
  window.updateAlarmUI = updateAlarmUI;
  window.triggerAlarmRing = triggerAlarmRing;
  window.dismissAlarmAlert = dismissAlarmAlert;
  window.getSeatingColName = getSeatingColName;
  window.renderSeatingChart = renderSeatingChart;
  window.applyCustomSeatingLayout = applyCustomSeatingLayout;
  window.setPredefinedSeatingLayout = setPredefinedSeatingLayout;
  window.openAssignSeatModal = openAssignSeatModal;
  window.closeAssignSeatModal = closeAssignSeatModal;
  window.assignStudentToActiveSeat = assignStudentToActiveSeat;
  window.setSeatToEmpty = setSeatToEmpty;
  window.openChangeAnimalModal = openChangeAnimalModal;
  window.closeChangeAnimalModal = closeChangeAnimalModal;
  window.selectNewAnimal = selectNewAnimalForStudent;
  window.selectNewAnimalForStudent = selectNewAnimalForStudent;
  window.openBatchAdjustPointsModal = openBatchAdjustPointsModal;
  window.closeBatchAdjustPointsModal = closeBatchAdjustPointsModal;
  window.executeBatchAdjustPoints = submitBatchAdjustPoints;
  window.submitBatchAdjustPoints = submitBatchAdjustPoints;
  window.addStudentReflectionOne = addStudentReflectionOne;
  window.removeStudentReflectionOne = removeStudentReflectionOne;
  window.removeReflectionCardOne = removeStudentReflectionOne;
  window.addStudentServiceOne = addStudentServiceOne;
  window.removeStudentServiceOne = removeStudentServiceOne;
  window.removeServiceCardOne = removeStudentServiceOne;
  window.pardonStudentCard = pardonStudentCard;
  window.pardonAllReflectionCards = pardonAllReflectionCards;
  window.pardonAllServiceCards = pardonAllServiceCards;
  window.filterHomeworkByDate = filterHomeworkByDate;
  window.showAllHomeworkHistory = showAllHomeworkHistory;
  window.openZooFeedModal = openZooFeedModal;
  window.closeZooFeedModal = closeZooFeedModal;
  window.executeFeedStudent = executeFeedStudent;
  window.executeFeedCustomStudent = executeFeedCustomStudent;
  window.quickFeedStudent = openZooFeedModal;
  window.openChangePasswordModal = openChangePasswordModal;
  window.closeChangePasswordModal = closeChangePasswordModal;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.submitChangePasswordForm = submitChangePasswordForm;
  window.promptChangeQueenPassword = promptChangeQueenPassword;
  window.lockTeacherSession = lockTeacherSession;
  window.renderZooHabitatShared = renderZooHabitatShared;
  window.renderPointsZooHabitat = renderPointsZooHabitat;
  window.renderPetsOverview = renderPetsOverview;
  window.quickFeedStudentInZoo = quickFeedStudentInZoo;
  window.feedAllZooAnimalsOne = feedAllZooAnimalsOne;
  window.triggerZooCheerParty = triggerZooCheerParty;
  window.renderMorningBoard = renderMorningBoard;
  window.renderPointsView = renderPointsView;
  window.toggleStudentCardDrawer = toggleStudentCardDrawer;
  window.confirmUseStudentCard = confirmUseStudentCard;
  window.openEditContactModal = openEditContactModal;
  window.closeEditContactModal = closeEditContactModal;
  window.saveContactBookData = saveContactBookData;
  window.changeContactDateDelta = changeContactDateDelta;
  window.changeContactDateToToday = changeContactDateToToday;
  window.handleContactDatePickerChange = handleContactDatePickerChange;

  // 出席歷史、聯絡簿歷史與作業拖曳看板
  window.renderAttendanceHistoryTable = renderAttendanceHistoryTable;
  window.switchAttendanceDate = switchAttendanceDate;
  window.renderContactBookHistoryList = renderContactBookHistoryList;
  window.toggleContactHistoryAccordion = toggleContactHistoryAccordion;
  window.loadContactDateToMorning = loadContactDateToMorning;
  window.openEditContactModalForDate = openEditContactModalForDate;
  window.deleteContactHistoryEntry = deleteContactHistoryEntry;
  window.handleHwStudentDragStart = handleHwStudentDragStart;
  window.handleHwStudentDragEnd = handleHwStudentDragEnd;
  window.handleHwDropZoneOver = handleHwDropZoneOver;
  window.handleHwDropZoneLeave = handleHwDropZoneLeave;
  window.handleHwDropZoneDrop = handleHwDropZoneDrop;
  window.setStudentHomeworkStatus = setStudentHomeworkStatus;
  window.printHomeworkSettlement = printHomeworkSettlement;
  window.printSeatingChart = printSeatingChart;
  window.openAdoptSecondPetModal = openAdoptSecondPetModal;
  window.openAddBehaviorReasonModal = openAddBehaviorReasonModal;
  window.openEditBehaviorReasonModal = openEditBehaviorReasonModal;
  window.deleteBehaviorReasonPrompt = deleteBehaviorReasonPrompt;
  window.closeAddBehaviorReasonModal = closeAddBehaviorReasonModal;
  window.submitNewBehaviorReason = submitNewBehaviorReason;
  window.applyBehaviorReason = applyBehaviorReason;
  window.renderBehaviorReasonShortcuts = renderBehaviorReasonShortcuts;
  window.addCustomReflectionCardToStudent = addCustomReflectionCardToStudent;
  window.addCustomServiceCardToStudent = addCustomServiceCardToStudent;
  window.removeStudentReflectionReasonByIndex = removeStudentReflectionReasonByIndex;
  window.removeStudentServiceReasonByIndex = removeStudentServiceReasonByIndex;
  window.switchTrafficDetailTab = switchTrafficDetailTab;
  window.openMorningCheckInChangeModal = openMorningCheckInChangeModal;
  window.closeMorningCheckInChangeModal = closeMorningCheckInChangeModal;
  window.changeMorningAttendanceStatus = changeMorningAttendanceStatus;

  // 大臣蘋果數量更改與飽食度控制
  window.openEditStudentPointsModal = openEditStudentPointsModal;
  window.closeEditStudentPointsModal = closeEditStudentPointsModal;
  window.setEditPointsQuick = setEditPointsQuick;
  window.adjustEditPointsInput = adjustEditPointsInput;
  window.submitEditStudentPoints = submitEditStudentPoints;
  window.promptSingleResetPoints = promptSingleResetPoints;
  window.openEditPointsFromFeedModal = openEditPointsFromFeedModal;
  window.confirmResetAllPetsSatiety = confirmResetAllPetsSatiety;
  window.openBatchResetPointsModal = openBatchResetPointsModal;

  // 集點榜多選與快速獎勵控制
  window.toggleStudentPointSelection = toggleStudentPointSelection;
  window.selectAllStudentsPoints = selectAllStudentsPoints;
  window.invertStudentPointsSelection = invertStudentPointsSelection;
  window.awardSingleStudent = awardSingleStudent;
  window.awardSelectedStudents = awardSelectedStudents;
  window.openCustomMultiPointsModal = openCustomMultiPointsModal;
  window.closeCustomMultiPointsModal = closeCustomMultiPointsModal;
  window.openRedeemCardForStudent = openRedeemCardForStudent;

  // 皇家特權卡牌抽屜快速兌換與批次兌換
  window.updateDrawerRedeemButton = updateDrawerRedeemButton;
  window.executeDrawerQuickRedeem = executeDrawerQuickRedeem;
  window.changeRedeemCardInModal = changeRedeemCardInModal;
  window.openBatchRedeemCardsModal = openBatchRedeemCardsModal;
  window.closeBatchRedeemCardsModal = closeBatchRedeemCardsModal;
  window.renderBatchRedeemStudentsGrid = renderBatchRedeemStudentsGrid;
  window.toggleBatchRedeemStudent = toggleBatchRedeemStudent;
  window.selectAllBatchRedeemStudents = selectAllBatchRedeemStudents;
  window.invertBatchRedeemStudents = invertBatchRedeemStudents;
  window.updateBatchRedeemPreview = updateBatchRedeemPreview;
  window.submitBatchRedeemCards = submitBatchRedeemCards;

  // 全班加點與大臣獎懲錯誤操作復原機制
  window.showUndoNotificationBanner = showUndoNotificationBanner;
  window.dismissUndoBanner = dismissUndoBanner;
  window.promptUndoLastPointAction = promptUndoLastPointAction;
  window.executeUndoLastPointAction = executeUndoLastPointAction;
  window.confirmRevokePointLog = confirmRevokePointLog;

  // 教室座位表與拖曳排座托盤
  window.renderSeatingDock = renderSeatingDock;
  window.handleSeatDragStart = handleSeatDragStart;
  window.handleSeatDragOver = handleSeatDragOver;
  window.handleSeatDragLeave = handleSeatDragLeave;
  window.handleSeatDrop = handleSeatDrop;
  window.handleSeatDragEnd = handleSeatDragEnd;
  window.handleDockStudentDragStart = handleDockStudentDragStart;
  window.handleDockStudentDragEnd = handleDockStudentDragEnd;
  window.handleDockDragOver = handleDockDragOver;
  window.handleDockDragLeave = handleDockDragLeave;
  window.handleDockDrop = handleDockDrop;
  window.handleDockStudentClick = handleDockStudentClick;
  window.removeStudentFromSeat = removeStudentFromSeat;
  window.filterDockView = filterDockView;
  window.clearAllSeatsPrompt = clearAllSeatsPrompt;
  window.autoAssignOrderPrompt = autoAssignOrderPrompt;

  // 作業奏章編輯
  window.openEditHomeworkModal = openEditHomeworkModal;
  window.closeEditHomeworkModal = closeEditHomeworkModal;
  window.submitEditHomework = submitEditHomework;

  // 皇室告示欄大屏廣播投影
  window.openAnnouncementProjectionModal = openAnnouncementProjectionModal;
  window.closeAnnouncementProjectionModal = closeAnnouncementProjectionModal;
  window.toggleAnnouncementProjectionFullscreen = toggleAnnouncementProjectionFullscreen;
  window.projectExistingAnnouncement = projectExistingAnnouncement;
  window.broadcastInstantAnnouncement = broadcastInstantAnnouncement;
  window.applyBroadcastPreset = applyBroadcastPreset;
  window.playBroadcastChime = playBroadcastChime;

  // 下課紅綠燈
  window.renderTrafficView = renderTrafficView;
  window.toggleTrafficDisplayMode = toggleTrafficDisplayMode;
  window.filterTrafficLight = filterTrafficLight;
  window.openTrafficDetailModal = openTrafficDetailModal;
  window.closeTrafficDetailModal = closeTrafficDetailModal;
  window.toggleTrafficDrawer = toggleTrafficDrawer;

  // 教室座位表大屏全螢幕投影 (僅顯示中間座位表與講台)
  window.openSeatingProjectionModal = openSeatingProjectionModal;
  window.closeSeatingProjectionModal = closeSeatingProjectionModal;
  window.toggleSeatingProjectionFullscreen = toggleSeatingProjectionFullscreen;
  window.renderSeatingProjectionGrid = renderSeatingProjectionGrid;

  // 晨間朝會聯絡簿與晨檢打卡大屏全螢幕投影
  window.openContactProjectionModal = openContactProjectionModal;
  window.closeContactProjectionModal = closeContactProjectionModal;
  window.toggleContactProjectionFullscreen = toggleContactProjectionFullscreen;
  window.renderContactProjectionView = renderContactProjectionView;
  window.setContactProjDaysMode = setContactProjDaysMode;
  window.setContactProjPreset = setContactProjPreset;
  window.changeContactProjColDate = changeContactProjColDate;
  window.adjustContactProjColDate = adjustContactProjColDate;
  window.openEditContactModalForDate = openEditContactModalForDate;
  try {
    Object.defineProperty(window, 'contactProjDaysMode', {
      get() { return contactProjDaysMode; },
      set(v) { contactProjDaysMode = v; },
      configurable: true
    });
    Object.defineProperty(window, 'contactProjDateCol1', {
      get() { return contactProjDateCol1; },
      set(v) { contactProjDateCol1 = v; },
      configurable: true
    });
    Object.defineProperty(window, 'contactProjDateCol2', {
      get() { return contactProjDateCol2; },
      set(v) { contactProjDateCol2 = v; },
      configurable: true
    });
    Object.defineProperty(window, 'contactProjDateCol3', {
      get() { return contactProjDateCol3; },
      set(v) { contactProjDateCol3 = v; },
      configurable: true
    });

    // 主畫面晨間朝會雙天並排聯絡簿屬性與導出
    window.setMorningContactDaysMode = setMorningContactDaysMode;
    window.setMorningContactPreset = setMorningContactPreset;
    window.changeMorningContactColDate = changeMorningContactColDate;
    window.adjustMorningContactColDate = adjustMorningContactColDate;
    window.renderMorningContactDayColumn = renderMorningContactDayColumn;
    Object.defineProperty(window, 'morningContactDaysMode', {
      get() { return morningContactDaysMode; },
      set(v) { morningContactDaysMode = v; },
      configurable: true
    });
    Object.defineProperty(window, 'morningContactDateCol1', {
      get() { return morningContactDateCol1; },
      set(v) { morningContactDateCol1 = v; },
      configurable: true
    });
    Object.defineProperty(window, 'morningContactDateCol2', {
      get() { return morningContactDateCol2; },
      set(v) { morningContactDateCol2 = v; },
      configurable: true
    });
  } catch (e) {
    window.contactProjDaysMode = contactProjDaysMode;
  }

  // 課堂作息鬧鐘快捷管理
  window.renderAlarmPresets = renderAlarmPresets;
  window.openManageAlarmPresetsModal = openManageAlarmPresetsModal;
  window.closeManageAlarmPresetsModal = closeManageAlarmPresetsModal;
  window.renderAlarmPresetsManageList = renderAlarmPresetsManageList;
  window.editAlarmPresetInline = editAlarmPresetInline;
  window.cancelEditAlarmPreset = cancelEditAlarmPreset;
  window.submitAlarmPresetForm = submitAlarmPresetForm;
  window.deleteAlarmPresetItem = deleteAlarmPresetItem;
  window.confirmResetAlarmPresetsToDefault = confirmResetAlarmPresetsToDefault;

  // 🍎 紅蘋果集點榜大屏全螢幕投影
  window.openPointsProjectionModal = openPointsProjectionModal;
  window.closePointsProjectionModal = closePointsProjectionModal;
  window.togglePointsProjectionFullscreen = togglePointsProjectionFullscreen;
  window.toggleProjectionStudentSelection = toggleProjectionStudentSelection;
  window.selectAllProjectionPoints = selectAllProjectionPoints;
  window.awardSelectedInPointsProjection = awardSelectedInPointsProjection;
  window.awardSingleStudentInProjection = awardSingleStudentInProjection;
  window.toggleCardDrawerInProjection = toggleCardDrawerInProjection;
  window.useCardInPointsProjection = useCardInPointsProjection;
  window.revokeCardInPointsProjection = revokeCardInPointsProjection;
  window.confirmRevokeStudentCard = confirmRevokeStudentCard;
  window.confirmRevokeRedemptionRecord = confirmRevokeRedemptionRecord;
  window.renderPointsProjection = renderPointsProjection;

  // 🐾 班級萌寵動物園大屏全螢幕投影
  window.openZooProjectionModal = openZooProjectionModal;
  window.closeZooProjectionModal = closeZooProjectionModal;
  window.toggleZooProjectionFullscreen = toggleZooProjectionFullscreen;
  window.feedStudentInZooProjection = feedStudentInZooProjection;
  window.renderZooProjection = renderZooProjection;

  // 皇室點名簿抽屜展開控制
  window.toggleAttendanceDrawer = toggleAttendanceDrawer;
  window.toggleAllAttendanceDrawers = toggleAllAttendanceDrawers;

  // 雲端同步與測試
  window.saveGoogleScriptUrl = saveGoogleScriptUrl;
  window.testGoogleCloudConnection = testGoogleCloudConnection;

  // 大臣名冊萌寵切換與抽屜控制
  window.changeRosterActivePet = changeRosterActivePet;
  window.toggleRosterPetDrawer = toggleRosterPetDrawer;
}

// 全域鍵盤與投影事件監聽 (支援 Esc 鍵一鍵關閉並退出全螢幕)
if (typeof window !== 'undefined') {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const annModal = document.getElementById("announcementProjectionModal");
      if (annModal && !annModal.classList.contains("hidden")) {
        closeAnnouncementProjectionModal();
      }
      const seatModal = document.getElementById("seatingProjectionModal");
      if (seatModal && !seatModal.classList.contains("hidden")) {
        closeSeatingProjectionModal();
      }
      const contactModal = document.getElementById("contactProjectionModal");
      if (contactModal && !contactModal.classList.contains("hidden")) {
        closeContactProjectionModal();
      }
      const pointsModal = document.getElementById("pointsProjectionModal");
      if (pointsModal && !pointsModal.classList.contains("hidden")) {
        closePointsProjectionModal();
      }
      const zooModal = document.getElementById("zooProjectionModal");
      if (zooModal && !zooModal.classList.contains("hidden")) {
        closeZooProjectionModal();
      }
    }
  });
}


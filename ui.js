/**
 * 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * 介面互動控制器 (UI Controller) - 晨間大螢幕 3:7 ＆ 作業總看板 ＆ 批次名冊升級版
 */

let currentMainView = 'morning'; // 'morning' | 'teacher' | 'parent'
let currentTeacherTab = 'homework'; // 'attendance' | 'homework' | 'points' | 'pets' | 'roster' | 'announcements'
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

  // 檢查 URL 參數
  const urlParams = new URLSearchParams(window.location.search);
  const isParentMode = urlParams.get('parent') === '1' || urlParams.get('mode') === 'parent';
  const paramSeat = urlParams.get('seat');

  initLucideIcons();

  if (isParentMode) {
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

  const defaultBtnClass = "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 text-amber-950 hover:bg-amber-300/60";
  const activeBtnClass = "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition flex items-center space-x-1.5 bg-amber-950 text-amber-300 shadow";

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
    if (teacherView) teacherView.classList.remove("hidden");
    if (btnTeacher) btnTeacher.className = activeBtnClass;
    renderCurrentTeacherTab();
  } else {
    if (parentView) parentView.classList.remove("hidden");
    if (btnParent) btnParent.className = activeBtnClass;
    renderParentPortal();
  }
  initLucideIcons();
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
    const clockEl = document.getElementById("morningClockDisplay");
    if (clockEl) {
      clockEl.textContent = `${h}:${m}:${s}`;
    }
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

function renderMorningBoard() {
  const todayStr = window.KingdomApp.getTodayDateString();
  const students = window.KingdomApp.store.data.students;
  const attendanceData = window.KingdomApp.store.data.attendance[todayStr] || {};
  const lateThreshold = window.KingdomApp.store.data.lateThreshold || "07:40";

  // 1. 渲染左側 30% 打卡座號網格 (1 ~ 27 號，純顯示座號與打卡狀態)
  const checkInGrid = document.getElementById("checkInGrid");
  let checkedCount = 0;

  if (checkInGrid) {
    checkInGrid.innerHTML = students.map(st => {
      const rec = attendanceData[st.id] || null;
      let statusClass = "seat-uncheck";
      let statusIcon = "";
      let timeText = "";

      if (rec && rec.checkInTime) {
        checkedCount++;
        if (rec.status === 'present') {
          statusClass = "seat-present";
          statusIcon = "✓";
          timeText = rec.checkInTime;
        } else if (rec.status === 'late') {
          statusClass = "seat-late";
          statusIcon = "⏳";
          timeText = rec.checkInTime;
        } else if (rec.status === 'leave') {
          statusClass = "seat-leave";
          statusIcon = "🏖️";
          timeText = "告假";
        }
      } else if (rec && rec.status === 'leave') {
        statusClass = "seat-leave";
        statusIcon = "🏖️";
        timeText = "告假";
      }

      return `
        <button onclick="handleMorningSeatCheckIn(${st.id}, ${st.seatNo})" 
          class="checkin-seat-btn ${statusClass} py-2.5 px-1.5 rounded-xl text-center flex flex-col items-center justify-center border-2 transition shadow-sm"
          title="${st.seatNo}號 ${st.name}（點擊打卡）">
          <div class="flex items-center space-x-1">
            <span class="font-mono text-base font-black">${String(st.seatNo).padStart(2, '0')}</span>
            ${statusIcon ? `<span class="text-xs font-bold">${statusIcon}</span>` : ''}
          </div>
          <span class="text-[10px] font-mono font-bold mt-0.5 leading-none">
            ${timeText ? timeText : '未打卡'}
          </span>
        </button>
      `;
    }).join('');
  }

  // 更新到校人數
  const countBadge = document.getElementById("morningCheckedCount");
  if (countBadge) {
    countBadge.textContent = `${checkedCount} / ${students.length} 人`;
  }

  // 2. 渲染右側 70% 聯絡簿超大字體看板
  const contactBook = window.KingdomApp.store.data.contactBook || window.KingdomApp.DEFAULT_CONTACT_BOOK;
  
  const dateDisplay = document.getElementById("contactBookDateDisplay");
  if (dateDisplay) {
    dateDisplay.textContent = `朝會日期：${todayStr}`;
  }

  const hwList = document.getElementById("contactHomeworkList");
  if (hwList) {
    hwList.innerHTML = contactBook.homeworkItems.map((item, idx) => `
      <li class="flex items-start space-x-2 py-1 border-b border-amber-200/60 last:border-0">
        <span class="bg-amber-400 text-amber-950 w-8 h-8 rounded-full flex items-center justify-center text-base sm:text-lg font-black flex-shrink-0 shadow-sm">
          ${idx + 1}
        </span>
        <span class="pt-0.5">${item}</span>
      </li>
    `).join('');
  }

  const reminderList = document.getElementById("contactReminderList");
  if (reminderList) {
    reminderList.innerHTML = contactBook.reminders.map(item => `
      <li class="leading-relaxed py-0.5">${item}</li>
    `).join('');
  }

  const mottoEl = document.getElementById("contactQueenMotto");
  if (mottoEl) {
    mottoEl.textContent = contactBook.queenMotto || "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！";
  }
}

// 學生點擊座號打卡 (記錄當下時間，超過 07:40 標遲到)
function handleMorningSeatCheckIn(studentId, seatNo) {
  const todayStr = window.KingdomApp.getTodayDateString();
  const lateThreshold = window.KingdomApp.store.data.lateThreshold || "07:40";

  if (!window.KingdomApp.store.data.attendance[todayStr]) {
    window.KingdomApp.store.data.attendance[todayStr] = {};
  }

  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const existing = window.KingdomApp.store.data.attendance[todayStr][studentId];

  // 若已經打過卡，提示確認
  if (existing && existing.checkInTime) {
    const change = confirm(`【${String(seatNo).padStart(2, '0')}號 ${student.name}】已於 ${existing.checkInTime} 完成打卡！\n\n是否要以「現在時間」重新覆蓋打卡紀錄？`);
    if (!change) return;
  }

  // 獲取當下真實時間 HH:mm
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const isLate = timeStr > lateThreshold;

  window.KingdomApp.store.data.attendance[todayStr][studentId] = {
    status: isLate ? 'late' : 'present',
    checkInTime: timeStr,
    note: isLate ? `${timeStr} 到校（超過門檻 ${lateThreshold}）` : '準時到校'
  };

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();

  if (isLate) {
    showToast(`⏳ ${String(seatNo).padStart(2, '0')}號 ${student.name} 於 ${timeStr} 打卡，標記為遲到 (超過${lateThreshold})`);
  } else {
    showToast(`✅ ${String(seatNo).padStart(2, '0')}號 ${student.name} 於 ${timeStr} 準時打卡在朝！`);
  }

  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

// 投影機全螢幕切換
function toggleFullscreen() {
  const container = document.getElementById("contactBoardContainer");
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      alert(`無法進入全螢幕：${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// 編輯聯絡簿項目 Modal
function openEditContactModal() {
  const cb = window.KingdomApp.store.data.contactBook || window.KingdomApp.DEFAULT_CONTACT_BOOK;
  document.getElementById("editContactHwItems").value = cb.homeworkItems.join('\n');
  document.getElementById("editContactReminders").value = cb.reminders.join('\n');
  document.getElementById("editContactMotto").value = cb.queenMotto || '';
  document.getElementById("editContactModal").classList.remove("hidden");
  initLucideIcons();
}

function closeEditContactModal() {
  document.getElementById("editContactModal").classList.add("hidden");
}

function saveContactBookData(e) {
  e.preventDefault();
  const rawHw = document.getElementById("editContactHwItems").value;
  const rawReminders = document.getElementById("editContactReminders").value;
  const motto = document.getElementById("editContactMotto").value.trim();

  const homeworkItems = rawHw.split('\n').map(i => i.trim()).filter(i => i.length > 0);
  const reminders = rawReminders.split('\n').map(i => i.trim()).filter(i => i.length > 0);

  window.KingdomApp.store.data.contactBook = {
    date: window.KingdomApp.getTodayDateString(),
    homeworkItems,
    reminders,
    queenMotto: motto
  };

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast("📜 教室大螢幕聯絡簿已成功發布更新！");
  closeEditContactModal();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

// ===================================================================
// 4. 皇室點名簿功能 (Attendance Management)
// ===================================================================
function getSelectedAttendanceDate() {
  const dateInput = document.getElementById("attendanceDatePicker");
  return dateInput ? dateInput.value : window.KingdomApp.getTodayDateString();
}

function updateLateThreshold(val) {
  window.KingdomApp.store.data.lateThreshold = val || "07:40";
  window.KingdomApp.store.save();
  showToast(`⏰ 遲到門檻已更新為 ${window.KingdomApp.store.data.lateThreshold}`);
  renderAttendanceView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

function renderAttendanceView() {
  const date = getSelectedAttendanceDate();
  const students = window.KingdomApp.store.data.students;
  const attendanceData = window.KingdomApp.store.data.attendance[date] || {};
  const lateThreshold = window.KingdomApp.store.data.lateThreshold || "07:40";

  let presentCount = 0;
  let leaveCount = 0;
  let lateCount = 0;

  const leaveList = [];
  const lateList = [];

  students.forEach(st => {
    const rec = attendanceData[st.id] || { status: 'present' };
    if (rec.status === 'present') {
      presentCount++;
    } else if (rec.status === 'leave') {
      leaveCount++;
      leaveList.push({ student: st, record: rec });
    } else if (rec.status === 'late') {
      lateCount++;
      lateList.push({ student: st, record: rec });
    }
  });

  const total = students.length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  document.getElementById("statTotalStudents").textContent = total;
  document.getElementById("statPresentStudents").textContent = presentCount;
  document.getElementById("statLeaveStudents").textContent = leaveCount;
  document.getElementById("statLateStudents").textContent = lateCount;
  document.getElementById("statAttendanceRate").textContent = `${rate}%`;

  // 頂部醒目的【缺席與遲到大臣即時看板】
  const topAlertBoard = document.getElementById("topAbsenteeAlertBoard");
  if (topAlertBoard) {
    if (leaveList.length === 0 && lateList.length === 0) {
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
    } else {
      topAlertBoard.innerHTML = `
        <div class="alert-board p-4 sm:p-5 rounded-2xl border-2 border-rose-400 shadow-md space-y-3">
          <div class="flex items-center justify-between border-b border-rose-200 pb-2">
            <div class="flex items-center space-x-2">
              <span class="text-2xl animate-bounce">🚨</span>
              <h3 class="text-rose-950 font-black text-base sm:text-lg">
                今日缺席與延遲覲見名單 (共 ${leaveList.length + lateList.length} 人)
              </h3>
            </div>
            <span class="text-xs bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-full">
              請假 ${leaveList.length} 人 ‧ 遲到 ${lateList.length} 人
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="bg-white/90 p-3 rounded-xl border border-rose-200">
              <span class="font-black text-rose-800 block mb-1.5">🏖️ 告假大臣名單 (${leaveList.length}人)：</span>
              ${leaveList.length === 0 ? '<span class="text-slate-400">今日無大臣請假</span>' : `
                <div class="space-y-1.5">
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
                <div class="space-y-1.5">
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

  // 渲染學生名冊卡片
  const grid = document.getElementById("attendanceGrid");
  if (!grid) return;

  const filtered = students.filter(st => {
    const rec = attendanceData[st.id] || { status: 'present' };
    if (currentAttendanceFilter === 'all') return true;
    return rec.status === currentAttendanceFilter;
  });

  grid.innerHTML = filtered.map(st => {
    const rec = attendanceData[st.id] || { status: 'present' };
    const status = rec.status;
    const checkInTime = rec.checkInTime || '';

    let badgeHtml = '';
    let detailHtml = '';

    if (status === 'present') {
      badgeHtml = `<span class="badge-present text-xs font-black px-2 py-0.5 rounded-full">✅ 在朝出席 ${checkInTime ? `(${checkInTime})` : ''}</span>`;
    } else if (status === 'leave') {
      const typeMap = { sick: '病假', personal: '事假', official: '公假', bereavement: '喪假', other: '其他' };
      const scopeDesc = rec.leaveScope === 'periods' 
        ? `節數：第 ${rec.leavePeriods ? rec.leavePeriods.join(', ') : '未定'} 節` 
        : '整天告假';
      badgeHtml = `<span class="badge-leave text-xs font-black px-2 py-0.5 rounded-full">🏖️ 告假 (${typeMap[rec.leaveType] || '事假'})</span>`;
      detailHtml = `
        <div class="mt-2 text-[11px] text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200 font-bold">
          <div>${scopeDesc}</div>
          ${rec.note ? `<div class="text-slate-600 font-normal mt-0.5">${rec.note}</div>` : ''}
        </div>
      `;
    } else if (status === 'late') {
      badgeHtml = `<span class="badge-late text-xs font-black px-2 py-0.5 rounded-full">⏳ 遲到 ${checkInTime ? `(${checkInTime})` : ''}</span>`;
      detailHtml = `
        <div class="mt-2 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-300 font-bold">
          超過門檻 ${lateThreshold} ${rec.note ? `‧ ${rec.note}` : ''}
        </div>
      `;
    }

    return `
      <div class="parchment-card p-4 minister-card flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
              座號 ${String(st.seatNo).padStart(2, '0')}
            </span>
            ${badgeHtml}
          </div>
          <div class="mt-2 flex items-center space-x-2">
            <span class="text-lg font-black text-slate-800">${st.name}</span>
            <span class="text-xs text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-bold">${st.title}</span>
          </div>
          ${detailHtml}
        </div>

        <div class="mt-3 pt-2.5 border-t border-amber-200 flex items-center space-x-1.5">
          <button onclick="setStudentAttendance(${st.id}, 'present')" class="flex-1 py-1 px-1.5 text-xs font-black rounded-lg ${status === 'present' ? 'bg-emerald-600 text-white shadow' : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'}">
            出席
          </button>
          <button onclick="openLeaveModal(${st.id})" class="flex-1 py-1 px-1.5 text-xs font-black rounded-lg ${status === 'leave' ? 'bg-rose-600 text-white shadow' : 'bg-white hover:bg-rose-50 text-rose-800 border border-rose-300'}">
            請假
          </button>
          <button onclick="setStudentAttendance(${st.id}, 'late')" class="flex-1 py-1 px-1.5 text-xs font-black rounded-lg ${status === 'late' ? 'bg-amber-600 text-white shadow' : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-300'}">
            遲到
          </button>
        </div>
      </div>
    `;
  }).join('');

  initLucideIcons();
}

function filterAttendanceStatus(status) {
  currentAttendanceFilter = status;
  const buttons = ['all', 'present', 'leave', 'late'];
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

  students.forEach(st => {
    window.KingdomApp.store.data.attendance[date][st.id] = { status: 'present', checkInTime: '07:30' };
  });

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast("👑 全體 27 位大臣已全數完成簽到出席！");
  renderAttendanceView();
  renderMorningBoard();
  renderTrafficView(); // 連動下課紅綠燈與愛班卡判定
}

function setStudentAttendance(studentId, status, customNote) {
  const date = getSelectedAttendanceDate();
  if (!window.KingdomApp.store.data.attendance[date]) {
    window.KingdomApp.store.data.attendance[date] = {};
  }

  const prev = window.KingdomApp.store.data.attendance[date][studentId] || {};
  window.KingdomApp.store.data.attendance[date][studentId] = {
    ...prev,
    status,
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
// 5. 皇室奏章堂：當天作業繳交情形【統整大看板】 (Summary Board)
// ===================================================================
function renderHomeworkSummaryBoard() {
  const container = document.getElementById("homeworkSummaryBoardContainer");
  if (!container) return;

  const homeworkList = window.KingdomApp.store.data.homework || [];
  const students = window.KingdomApp.store.data.students || [];

  if (homeworkList.length === 0) {
    container.innerHTML = `
      <div class="parchment-card p-8 text-center text-slate-600 font-bold">
        目前尚無指派的作業奏章，點擊右上角「頒發新奏章」即可開始統整！
      </div>
    `;
    renderHomeworkSettlementTable();
    return;
  }

  container.innerHTML = homeworkList.map(hw => {
    // 四大分類：準時已交 (submitted / excellent)、遲交 (late)、需訂正 (revision)、未交 (pending)
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

    return `
      <div class="bg-white rounded-2xl border-2 border-amber-300 p-5 space-y-4 shadow-sm">
        
        <!-- 作業抬頭與快捷按鈕 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-amber-200">
          <div>
            <div class="flex items-center space-x-2">
              <span class="bg-amber-200 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-md">
                ${hw.subject}
              </span>
              <h3 class="text-lg font-black text-amber-950">
                ${hw.title}
              </h3>
            </div>
            <p class="text-xs text-slate-600 mt-1">${hw.desc || '無補充說明'}</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <!-- 老師端直接設置需訂正名單快捷鈕 -->
            <button onclick="openSetRevisionModal('${hw.id}')" class="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-black text-xs shadow-sm flex items-center space-x-1">
              <span>⚠️ 設置需訂正名單</span>
            </button>
            <button onclick="batchMarkAllHwSubmitted('${hw.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-black text-xs shadow-sm flex items-center space-x-1">
              <span>✓ 全員標記已交</span>
            </button>
            <button onclick="deleteHomework('${hw.id}')" class="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs" title="刪除此作業">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- ★★★ 當天繳交情形四欄看板 (準時已交 / 遲交 / 需訂正 / 未交) ★★★ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <!-- 1. 準時已交名單欄 (綠色) -->
          <div class="bg-emerald-50/80 rounded-xl border-2 border-emerald-300 p-3 space-y-2">
            <div class="flex items-center justify-between pb-1.5 border-b border-emerald-200">
              <span class="font-black text-emerald-900 text-xs flex items-center space-x-1">
                <span>✅ 準時已交 (${submittedList.length}人)</span>
              </span>
              <span class="text-[10px] text-emerald-700 font-bold">點擊切換</span>
            </div>
            <div class="flex flex-wrap gap-1.5 min-h-[46px]">
              ${submittedList.length === 0 ? '<span class="text-xs text-slate-400">目前尚無已交</span>' : 
                submittedList.map(st => `
                  <button onclick="cycleHwStatus('${hw.id}', ${st.id})" 
                    class="px-2 py-1 rounded-lg bg-white border border-emerald-400 text-emerald-950 font-black text-xs hover:bg-emerald-100 transition shadow-2xs flex items-center space-x-1"
                    title="點擊切換為【遲交】">
                    <span class="font-mono text-[11px] text-emerald-700">${String(st.seatNo).padStart(2, '0')}</span>
                    <span>${st.name}</span>
                  </button>
                `).join('')
              }
            </div>
          </div>

          <!-- 2. 遲交名單欄 (橙黃色，學期結算評分依據) -->
          <div class="bg-amber-50/90 rounded-xl border-2 border-amber-400 p-3 space-y-2">
            <div class="flex items-center justify-between pb-1.5 border-b border-amber-200">
              <span class="font-black text-amber-950 text-xs flex items-center space-x-1">
                <span>⏰ 遲交 (${lateList.length}人)</span>
              </span>
              <span class="text-[10px] text-amber-700 font-bold">已補交</span>
            </div>
            <div class="flex flex-wrap gap-1.5 min-h-[46px]">
              ${lateList.length === 0 ? '<span class="text-xs text-slate-400">全員準時無遲交</span>' : 
                lateList.map(st => `
                  <button onclick="cycleHwStatus('${hw.id}', ${st.id})" 
                    class="px-2 py-1 rounded-lg bg-amber-500 text-white font-black text-xs hover:bg-amber-600 transition shadow-2xs flex items-center space-x-1"
                    title="點擊切換為【需訂正】">
                    <span class="font-mono text-[11px] text-amber-100">${String(st.seatNo).padStart(2, '0')}</span>
                    <span>${st.name}</span>
                    <span class="text-[10px] bg-amber-700 px-1 rounded">遲</span>
                  </button>
                `).join('')
              }
            </div>
          </div>

          <!-- 3. 需訂正名單欄 (紫色高醒目，小學老師最核心關注) -->
          <div class="bg-purple-50/90 rounded-xl border-2 border-purple-400 p-3 space-y-2 shadow-2xs">
            <div class="flex items-center justify-between pb-1.5 border-b border-purple-200">
              <span class="font-black text-purple-950 text-xs flex items-center space-x-1">
                <span>⚠️ 需訂正 (${revisionList.length}人)</span>
              </span>
              <button onclick="openSetRevisionModal('${hw.id}')" class="text-[11px] text-purple-700 font-black hover:underline">
                + 快速勾選
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5 min-h-[46px]">
              ${revisionList.length === 0 ? '<span class="text-xs text-slate-400">全數無須訂正，優良！</span>' : 
                revisionList.map(st => `
                  <button onclick="cycleHwStatus('${hw.id}', ${st.id})" 
                    class="px-2 py-1 rounded-lg bg-purple-700 text-white font-black text-xs hover:bg-purple-800 transition shadow-2xs flex items-center space-x-1"
                    title="點擊切換為【未交】">
                    <span class="font-mono text-[11px] text-purple-200">${String(st.seatNo).padStart(2, '0')}</span>
                    <span>${st.name}</span>
                    <span class="text-[10px]">改</span>
                  </button>
                `).join('')
              }
            </div>
          </div>

          <!-- 4. 未繳交名單欄 (紅色醒目) -->
          <div class="bg-rose-50/80 rounded-xl border-2 border-rose-300 p-3 space-y-2">
            <div class="flex items-center justify-between pb-1.5 border-b border-rose-200">
              <span class="font-black text-rose-900 text-xs flex items-center space-x-1">
                <span>❌ 未繳交 (${pendingList.length}人)</span>
              </span>
              <span class="text-[10px] text-rose-700 font-bold">待催繳</span>
            </div>
            <div class="flex flex-wrap gap-1.5 min-h-[46px]">
              ${pendingList.length === 0 ? '<span class="text-xs text-slate-400">已全數繳交！</span>' : 
                pendingList.map(st => `
                  <button onclick="cycleHwStatus('${hw.id}', ${st.id})" 
                    class="px-2 py-1 rounded-lg bg-white border border-rose-300 text-rose-900 font-black text-xs hover:bg-rose-100 transition shadow-2xs flex items-center space-x-1"
                    title="點擊切換為【準時已交】">
                    <span class="font-mono text-[11px] text-rose-600">${String(st.seatNo).padStart(2, '0')}</span>
                    <span>${st.name}</span>
                  </button>
                `).join('')
              }
            </div>
          </div>

        </div>

      </div>
    `;
  }).join('');

  renderHomeworkSettlementTable();
  initLucideIcons();
}

// 點擊學生徽章快速在「準時已交 ⇄ 遲交 ⇄ 需訂正 ⇄ 未交」之間一鍵輪替
function cycleHwStatus(hwId, studentId) {
  const hw = window.KingdomApp.store.data.homework.find(h => h.id === hwId);
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
  const hw = window.KingdomApp.store.data.homework.find(h => h.id === hwId);
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
  const hw = window.KingdomApp.store.data.homework.find(h => h.id === activeRevisionHwId);
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

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast(`⚠️ 已成功設置【${hw.title}】共 ${activeRevisionStudentIds.size} 位需訂正大臣！`);
  closeSetRevisionModal();
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

function batchMarkAllHwSubmitted(hwId) {
  const hw = window.KingdomApp.store.data.homework.find(h => h.id === hwId);
  if (!hw) return;
  if (!hw.records) hw.records = {};

  window.KingdomApp.store.data.students.forEach(st => {
    hw.records[st.id] = 'submitted';
  });

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast("👑 全體大臣作業已標記為已繳交！");
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

function deleteHomework(hwId) {
  if (!confirm("確定要刪除此項作業奏章嗎？")) return;
  window.KingdomApp.store.data.homework = window.KingdomApp.store.data.homework.filter(h => h.id !== hwId);
  window.KingdomApp.store.save();
  showToast("🗑️ 作業奏章已銷毀");
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

// --- 作業常用快捷範本 (國習、造詞、生字本、數習等) 渲染與套用 ---
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
  window.KingdomApp.store.save();

  window.KingdomApp.sound.playFanfare();
  window.KingdomApp.triggerConfetti();
  showToast("📜 皇室新奏章已頒布！");
  closeNewHomeworkModal();
  renderHomeworkSummaryBoard();
  renderTrafficView();
  renderHomeworkSettlementTable();
}

// --- 學期平時成績與作業總結算表 ---
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
// ===================================================================
let trafficDisplayMode = 'compact'; // 預設為大屏極簡大字模式 (大螢幕首選)

function toggleTrafficDisplayMode() {
  trafficDisplayMode = trafficDisplayMode === 'compact' ? 'detailed' : 'compact';
  const label = document.getElementById("trafficDisplayModeLabel");
  if (label) {
    label.textContent = trafficDisplayMode === 'compact' ? '極簡大屏模式' : '詳細大臣模式';
  }
  showToast(`🖥️ 已切換為【${trafficDisplayMode === 'compact' ? '極簡大屏模式' : '詳細大臣模式'}】`);
  renderTrafficView();
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
  if (trafficDisplayMode === 'compact') {
    grid.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";
    
    grid.innerHTML = filtered.map(item => {
      const st = item.student;
      const seatPad = String(st.seatNo).padStart(2, '0');

      // 服務卡標籤 (超過07:40未打卡或愛班勞動，請假者豁免)
      const serviceBadge = item.hasService
        ? `<span class="badge-service text-[11px] font-black px-1.5 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs flex-shrink-0">
             <span>🧹</span>
             <span>補打掃</span>
           </span>`
        : '';

      // 1. 綠燈：僅顯示大綠燈 + 座號 + 姓名，不需多餘冗長理由
      if (item.light === 'green') {
        return `
          <div onclick="openTrafficDetailModal(${st.id})" 
            class="parchment-card p-3 rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 hover:bg-emerald-100 transition shadow-sm cursor-pointer flex flex-col justify-between min-h-[96px] group"
            title="點擊查看或調整 ${st.name} 通行狀態">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-9 h-9 rounded-full light-orb-green flex items-center justify-center text-white font-black text-lg shadow flex-shrink-0">✓</div>
                <div class="flex items-center space-x-1.5">
                  <span class="text-xs font-mono font-black text-emerald-900 bg-emerald-200 px-1.5 py-0.5 rounded">${seatPad}</span>
                  <span class="text-base font-black text-slate-900">${st.name}</span>
                </div>
              </div>
              ${serviceBadge}
            </div>
            <div class="mt-2 flex items-center justify-between text-[11px]">
              <span class="font-black text-emerald-800">🟢 准許下課</span>
              <span class="text-slate-400 text-[10px] opacity-0 group-hover:opacity-100 transition">管理 ❯</span>
            </div>
          </div>
        `;
      }

      // 2. 黃燈：顯示黃燈 + 座號 + 姓名 + 理由 (如：黃燈(國習訂正未繳交))
      if (item.light === 'yellow') {
        return `
          <div onclick="openTrafficDetailModal(${st.id})" 
            class="parchment-card p-3 rounded-2xl border-2 border-amber-400 bg-amber-50/95 hover:bg-amber-100 transition shadow-sm cursor-pointer flex flex-col justify-between min-h-[96px] group"
            title="點擊查看或調整 ${st.name} 訂正名冊">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-9 h-9 rounded-full light-orb-yellow flex items-center justify-center text-amber-950 font-black text-lg shadow flex-shrink-0">!</div>
                <div class="flex items-center space-x-1.5">
                  <span class="text-xs font-mono font-black text-amber-950 bg-amber-200 px-1.5 py-0.5 rounded">${seatPad}</span>
                  <span class="text-base font-black text-slate-900">${st.name}</span>
                </div>
              </div>
              ${serviceBadge}
            </div>
            <div class="mt-2 text-xs font-black text-amber-950 bg-amber-200/90 px-2 py-1 rounded-lg truncate shadow-2xs" title="${item.label}">
              ${item.label}
            </div>
          </div>
        `;
      }

      // 3. 紅燈：顯示紅燈 + 座號 + 姓名 + 理由 (如：紅燈(數習未交) 或 紅燈(座位自省))
      if (item.light === 'red') {
        return `
          <div onclick="openTrafficDetailModal(${st.id})" 
            class="parchment-card p-3 rounded-2xl border-2 border-rose-500 bg-rose-50/95 hover:bg-rose-100 transition shadow-sm cursor-pointer flex flex-col justify-between min-h-[96px] group"
            title="點擊查看或調整 ${st.name} 缺交與自省狀態">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-9 h-9 rounded-full light-orb-red flex items-center justify-center text-white font-black text-lg shadow flex-shrink-0">🛑</div>
                <div class="flex items-center space-x-1.5">
                  <span class="text-xs font-mono font-black text-rose-950 bg-rose-200 px-1.5 py-0.5 rounded">${seatPad}</span>
                  <span class="text-base font-black text-slate-900">${st.name}</span>
                </div>
              </div>
              ${serviceBadge}
            </div>
            <div class="mt-2 text-xs font-black text-rose-950 bg-rose-200/90 px-2 py-1 rounded-lg truncate shadow-2xs" title="${item.label}">
              ${item.label}
            </div>
          </div>
        `;
      }

      // 4. 請假：顯示🏖️ + 座號 + 姓名 + (請假在府)，嚴格免頒發愛班卡
      return `
        <div onclick="openTrafficDetailModal(${st.id})" 
          class="parchment-card p-3 rounded-2xl border-2 border-slate-300 bg-slate-100/80 hover:bg-slate-200/70 transition shadow-2xs cursor-pointer flex flex-col justify-between min-h-[96px] opacity-75"
          title="${st.name} 今日請假在府休養，免查通行">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-black text-sm flex-shrink-0">🏖️</div>
              <div class="flex items-center space-x-1.5">
                <span class="text-xs font-mono font-black text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">${seatPad}</span>
                <span class="text-base font-black text-slate-600">${st.name}</span>
              </div>
            </div>
          </div>
          <div class="mt-2 text-xs font-bold text-slate-500 bg-slate-200/70 px-2 py-1 rounded-lg">
            🏖️ 請假在府 (免愛班服務)
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
             <span>座位自省卡</span>
           </span>` 
        : '';

      const serviceBadge = item.hasService 
        ? `<span class="badge-service text-[11px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
             <span>🧹</span>
             <span>愛班服務卡</span>
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

            <!-- 核心通行狀態標章 -->
            <div class="mt-3 bg-white/80 p-2.5 rounded-xl border border-amber-300/80 shadow-sm space-y-1.5">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-xs font-black ${statusTextClass}">${item.label}</span>
                ${overrideBadge}
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
  const bCard = (window.KingdomApp.store.data.behaviorCards && window.KingdomApp.store.data.behaviorCards[studentId]) || {};
  const current = !!bCard.reflectionCard;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const studentName = student ? student.name : '該大臣';

  if (!current) {
    const reason = prompt(`請輸入為【${studentName}】核發「🪑 座位自省卡」的事由：`, "上課分心屢勸不聽（座位自省）");
    if (reason === null) return;
    window.KingdomApp.store.setReflectionCard(studentId, true, reason);
    showToast(`🛑 已為 ${studentName} 發放座位自省卡（紅燈禁足自省）`);
  } else {
    window.KingdomApp.store.setReflectionCard(studentId, false, "");
    showToast(`🕊️ 已解除 ${studentName} 的座位自省卡！`);
  }
  renderTrafficView();
}

function toggleSingleStudentService(studentId) {
  const bCard = (window.KingdomApp.store.data.behaviorCards && window.KingdomApp.store.data.behaviorCards[studentId]) || {};
  const current = !!bCard.serviceCard;
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  const studentName = student ? student.name : '該大臣';

  if (!current) {
    const reason = prompt(`請輸入為【${studentName}】指派「🧹 愛班服務卡」的任務：`, "課間整潔與黑板清理");
    if (reason === null) return;
    window.KingdomApp.store.setServiceCard(studentId, true, reason);
    showToast(`🧹 已為 ${studentName} 指派愛班服務卡！`);
  } else {
    window.KingdomApp.store.setServiceCard(studentId, false, "");
    showToast(`✨ ${studentName} 已完成愛班服務！`);
  }
  renderTrafficView();
}

// --- 常規卡牌發布事由快捷管理 (座位自省卡、愛班服務卡) ---
function renderBehaviorReasonShortcuts() {
  const container = document.getElementById("behaviorReasonShortcutsBar");
  if (!container) return;

  const currentTypeRadio = document.querySelector('input[name="behaviorCardType"]:checked');
  const type = currentTypeRadio ? currentTypeRadio.value : 'reflection';

  const allReasons = window.KingdomApp.store.data.behaviorReasons || window.KingdomApp.DEFAULT_BEHAVIOR_REASONS || [];
  const filtered = allReasons.filter(r => r.type === type);

  if (filtered.length === 0) {
    container.innerHTML = '<span class="text-xs text-slate-400">尚無事由快捷，可點右上方自訂新增</span>';
    return;
  }

  container.innerHTML = filtered.map(r => `
    <button type="button" onclick="applyBehaviorReason('${r.id}')"
      class="px-2 py-0.5 rounded-lg ${type === 'reflection' ? 'bg-rose-100 hover:bg-rose-200 text-rose-950 border border-rose-300' : 'bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300'} font-bold transition shadow-2xs">
      ${r.label}
    </button>
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

function openAddBehaviorReasonModal() {
  const currentTypeRadio = document.querySelector('input[name="behaviorCardType"]:checked');
  const sel = document.getElementById("reasonCardType");
  if (sel && currentTypeRadio) sel.value = currentTypeRadio.value;
  document.getElementById("addBehaviorReasonModal").classList.remove("hidden");
  initLucideIcons();
}

function closeAddBehaviorReasonModal() {
  document.getElementById("addBehaviorReasonModal").classList.add("hidden");
}

function submitNewBehaviorReason(e) {
  e.preventDefault();
  const type = document.getElementById("reasonCardType").value;
  const label = document.getElementById("reasonLabel").value.trim();
  const text = document.getElementById("reasonText").value.trim();

  if (!label || !text) {
    alert("請填寫快捷標籤與完整事由文字！");
    return;
  }

  window.KingdomApp.store.addBehaviorReason({ type, label, text });
  showToast(`✅ 已新增事由快捷【${label}】！`);
  closeAddBehaviorReasonModal();
  renderBehaviorReasonShortcuts();
}

function openBehaviorCardModal() {
  const grid = document.getElementById("behaviorStudentSelectorGrid");
  const students = window.KingdomApp.store.data.students || [];
  if (grid) {
    grid.innerHTML = students.map(st => `
      <label class="flex items-center space-x-1.5 p-1 rounded hover:bg-amber-100 cursor-pointer text-xs">
        <input type="checkbox" name="behaviorStudentCheckbox" value="${st.id}" class="rounded text-rose-600 focus:ring-rose-500">
        <span>${String(st.seatNo).padStart(2, '0')}.${st.name}</span>
      </label>
    `).join('');
  }
  document.getElementById("behaviorCardModal").classList.remove("hidden");
  renderBehaviorReasonShortcuts();

  // 監聽單選按鈕變更，自動更換事由快捷列
  const typeRadios = document.querySelectorAll('input[name="behaviorCardType"]');
  typeRadios.forEach(radio => {
    radio.onchange = () => renderBehaviorReasonShortcuts();
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

function openTrafficDetailModal(studentId) {
  activeTrafficStudentId = studentId;
  const status = window.KingdomApp.store.evaluateTrafficStatus(studentId);
  if (!status) return;
  const st = status.student;

  const titleEl = document.getElementById("trafficModalStudentTitle");
  if (titleEl) {
    titleEl.innerHTML = `<span>🚦 大臣下課通行詳情：${String(st.seatNo).padStart(2, '0')}號 ${st.name}</span>`;
  }

  const content = document.getElementById("trafficModalContent");
  if (!content) return;

  const hwList = (window.KingdomApp.store.data.homework || []).map(hw => {
    const rec = (hw.records && (hw.records[st.id] !== undefined ? hw.records[st.id] : hw.records[st.seatNo])) || 'pending';
    let badge = '';
    if (rec === 'submitted' || rec === 'excellent') badge = `<span class="text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-black">✅ 準時已交</span>`;
    else if (rec === 'late') badge = `<span class="text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-black">⏰ 遲交已補</span>`;
    else if (rec === 'revision') badge = `<span class="text-purple-800 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded font-black">⚠️ 需訂正</span>`;
    else badge = `<span class="text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded font-black">❌ 未繳交</span>`;
    return `
      <div class="flex items-center justify-between p-2 rounded-lg bg-white border border-amber-200">
        <span class="font-bold text-slate-800">${hw.title}</span>
        ${badge}
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <!-- 當前判定結果 -->
    <div class="p-3.5 rounded-xl border-2 ${status.cardClass || ''} space-y-1">
      <div class="flex items-center space-x-2">
        <span class="text-base font-black">${status.label}</span>
      </div>
      <p class="text-xs font-medium text-slate-800">${status.desc}</p>
    </div>

    <!-- 作業清單 -->
    <div class="space-y-1.5">
      <span class="font-black text-amber-950 block">📝 今日各項作業進度：</span>
      <div class="space-y-1 max-h-36 overflow-y-auto pr-1">
        ${hwList}
      </div>
    </div>

    <!-- 特殊卡牌狀態 -->
    <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-300 space-y-2">
      <span class="font-black text-amber-950 block">🏷️ 紀律卡牌狀態：</span>
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-800">🪑 座位自省卡：</span>
        <span class="font-black ${status.hasReflection ? 'text-rose-600' : 'text-slate-400'}">
          ${status.hasReflection ? `領取中 (${status.reflectionReason})` : '無'}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-800">🧹 愛班服務卡：</span>
        <span class="font-black ${status.hasService ? 'text-orange-600' : 'text-slate-400'}">
          ${status.hasService ? `進行中 (${status.serviceReason})` : '無'}
        </span>
      </div>
    </div>

    <!-- 導師手動覆寫通行燈號 -->
    <div class="pt-2 border-t border-amber-200 space-y-2">
      <span class="font-black text-amber-950 block">👑 導師手動快速裁定：</span>
      <div class="grid grid-cols-4 gap-1.5 font-black text-xs">
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'green')" class="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow">🟢 特赦綠燈</button>
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'yellow')" class="py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-amber-950 shadow">🟡 指定黃燈</button>
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'red')" class="py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow">🔴 指定紅燈</button>
        <button onclick="setTrafficOverrideFromModal(${st.id}, 'auto')" class="py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300">🔄 系統自動</button>
      </div>
    </div>
  `;

  document.getElementById("trafficDetailModal").classList.remove("hidden");
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
// 6. 榮譽集點榜與批次/單獨重置點數 (Points Management)
// ===================================================================
function renderPointsView() {
  const students = window.KingdomApp.store.data.students;
  const grid = document.getElementById("pointsGrid");
  const logList = document.getElementById("pointLogsList");

  renderPointPresets();
  renderRewardCards();

  if (grid) {
    grid.innerHTML = students.map(st => {
      const petStatus = window.KingdomApp.getPetStatus(st.petType, st.points);
      const isSelected = selectedStudentIdsForPoints.has(st.id);
      return `
        <div id="pointStudentCard-${st.id}" class="parchment-card p-4 minister-card flex flex-col justify-between ${isSelected ? 'student-multi-selected' : ''}">
          <div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="pointStudentCheck-${st.id}" ${isSelected ? 'checked' : ''} onchange="toggleStudentPointSelection(${st.id})" class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer">
                <span class="text-xs font-mono font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
                  座號 ${String(st.seatNo).padStart(2, '0')}
                </span>
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background-color: ${petStatus.stageColor}20; color: ${petStatus.stageColor}">
                ${petStatus.stageTitle}
              </span>
            </div>

            <div class="mt-2 flex items-center space-x-2">
              <span class="text-base font-black text-slate-800">${st.name}</span>
              <span class="text-xs text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-bold">${st.title}</span>
            </div>

            <div class="mt-3 flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-300">
              <div class="flex items-center space-x-1.5">
                <span class="text-xl">🪙</span>
                <div>
                  <span class="text-[10px] text-amber-800 font-bold block">皇家金幣</span>
                  <span class="text-base font-black text-amber-600">${st.points} 點</span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-[10px] text-slate-500 font-bold block">神獸能量</span>
                <span class="text-xs font-black text-slate-700">${petStatus.progressPercent}%</span>
              </div>
            </div>

            <div class="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="h-full bg-amber-500 transition-all duration-300" style="width: ${petStatus.progressPercent}%"></div>
            </div>
          </div>

          <!-- 快速個人加減分、兌換獎勵與重置 -->
          <div class="mt-3 pt-2 border-t border-amber-200 flex items-center space-x-1">
            <button onclick="awardSingleStudent(${st.id}, 1, '課堂嘉獎')" class="flex-1 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs transition border border-amber-300">
              +1
            </button>
            <button onclick="awardSingleStudent(${st.id}, 2, '表現優良')" class="flex-1 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs transition border border-amber-300">
              +2
            </button>
            <button onclick="awardSingleStudent(${st.id}, 5, '建樹卓越')" class="flex-1 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs transition border border-amber-500 shadow-sm">
              +5
            </button>
            <button onclick="openRedeemCardForStudent(${st.id})" class="py-1 px-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs transition border border-amber-400 shadow-sm" title="以金幣兌換獎勵卡">
              🎁換卡
            </button>
            <button onclick="promptSingleResetPoints(${st.id})" class="py-1 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-300" title="單獨重置此學生點數">
              🔄
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 渲染獎懲歷史日誌
  if (logList) {
    const logs = window.KingdomApp.store.data.pointLogs;
    if (logs.length === 0) {
      logList.innerHTML = `<p class="text-slate-400 text-xs">暫無近期獎懲紀錄</p>`;
    } else {
      logList.innerHTML = logs.slice(0, 15).map(l => {
        let studentName = '全班大臣';
        if (l.studentId !== 'all') {
          const st = students.find(s => s.id === l.studentId);
          studentName = st ? `${String(st.seatNo).padStart(2, '0')}號 ${st.name}` : (l.studentId === 'multi' ? '多位大臣' : '未知大臣');
        }
        const isPositive = l.points >= 0;
        return `
          <div class="flex items-center justify-between p-2 rounded-lg bg-white border border-amber-200 text-xs">
            <div class="flex items-center space-x-2">
              <span class="font-black text-amber-950">[${studentName}]</span>
              <span class="text-slate-800">${l.reason}</span>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0">
              <span class="font-mono ${isPositive ? 'text-amber-600 font-black' : 'text-rose-600 font-bold'}">
                ${isPositive ? `+${l.points}` : l.points} 🪙
              </span>
              <span class="text-[10px] text-slate-400 font-bold">${l.time || ''}</span>
            </div>
          </div>
        `;
      }).join('');
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
    showToast(`🎉 成功為 ${targetIds.length} 位大臣同時頒發 +${points} 點金幣！`);
  } else {
    window.KingdomApp.sound.playCoin();
    showToast(`⚠️ 已為 ${targetIds.length} 位大臣扣除 ${Math.abs(points)} 點金幣。`);
  }

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

  list.innerHTML = redemptions.slice(0, 15).map(r => `
    <div class="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200">
      <div class="flex items-center space-x-2">
        <span class="font-black text-amber-950">[${String(r.seatNo).padStart(2, '0')}號 ${r.studentName}]</span>
        <span class="text-slate-800 font-bold">兌換【${r.cardTitle}】</span>
        <span class="font-mono text-amber-700 font-black">(-${r.cost}點)</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-[10px] text-slate-400">${r.date} ${r.time}</span>
        <button onclick="toggleRedemptionStatus('${r.id}')" class="px-2 py-0.5 rounded text-[11px] font-black ${r.used ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
          ${r.used ? '已核銷' : '未核銷 (點擊核銷)'}
        </button>
      </div>
    </div>
  `).join('');
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
  const card = (window.KingdomApp.store.data.rewardCards || []).find(c => c.id === cardId);
  if (!card) return;

  document.getElementById("redeemCardTargetId").value = card.id;
  document.getElementById("redeemModalCardIcon").textContent = card.icon || '🎁';
  document.getElementById("redeemModalCardTitle").textContent = card.title;
  document.getElementById("redeemModalCardCostBadge").textContent = `所需金幣：${card.cost} 點`;

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

function openRedeemCardForStudent(studentId) {
  const cards = window.KingdomApp.store.data.rewardCards || [];
  if (cards.length === 0) {
    alert("目前尚未建立任何獎勵卡，請先新增卡牌！");
    return;
  }
  openRedeemCardModal(cards[0].id);
  const select = document.getElementById("redeemStudentSelect");
  if (select) {
    select.value = studentId;
    updateRedeemPreview();
  }
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
        <span>大臣現有金幣：<strong>${student.points} 點</strong></span>
        <span>兌換扣除：<strong>-${card.cost} 點</strong></span>
      </div>
      <div class="pt-1 border-t border-emerald-200 text-sm font-black text-emerald-800">
        兌換後剩餘金幣：${remaining} 點 (金幣足夠 ✅)
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
        <span>大臣現有金幣：<strong>${student.points} 點</strong></span>
        <span>所需金幣：<strong>${card.cost} 點</strong></span>
      </div>
      <div class="pt-1 border-t border-rose-200 text-sm font-black text-rose-700">
        尚缺 ${Math.abs(remaining)} 點金幣，無法兌換 ❌
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
    showToast(`🎉 恭喜【${record.studentName}】成功兌換【${record.cardTitle}】！`);
    closeRedeemCardModal();
    renderRewardCards();
    renderPointsView();
    renderRosterView();
  } catch (err) {
    alert(err.message);
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

// 單獨重置點數
function promptSingleResetPoints(studentId) {
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  if (!student) return;

  const targetStr = prompt(`請輸入要將【${student.name} 大臣】的金幣重置為多少點？\n(輸入 0 即可歸零)`, "0");
  if (targetStr === null) return;

  const target = parseInt(targetStr, 10);
  if (isNaN(target) || target < 0) {
    alert("請輸入有效的正整數或 0！");
    return;
  }

  window.KingdomApp.store.resetSingleStudentPoints(studentId, target);
  showToast(`🔄 已將 ${student.name} 的金幣重置為 ${target} 點！`);
  renderPointsView();
  renderRosterView();
}

// 批次重置全班點數 Modal
function openBatchResetPointsModal() {
  document.getElementById("batchResetPointsModal").classList.remove("hidden");
  initLucideIcons();
}

function closeBatchResetPointsModal() {
  document.getElementById("batchResetPointsModal").classList.add("hidden");
}

function submitBatchResetPoints(e) {
  e.preventDefault();
  const target = parseInt(document.getElementById("resetTargetPointsInput").value, 10);
  const clearLogs = document.getElementById("resetClearLogsCheckbox").checked;

  if (isNaN(target) || target < 0) {
    alert("請輸入有效的點數值！");
    return;
  }

  if (!confirm(`確定要將全班 27 位大臣的點數全部重置為 ${target} 點嗎？此操作不可逆！`)) return;

  window.KingdomApp.store.batchResetPoints(target, clearLogs);
  window.KingdomApp.sound.playCoin();
  showToast(`🔄 已成功將全班 27 位大臣金幣重置為 ${target} 點！`);
  closeBatchResetPointsModal();
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
    window.KingdomApp.store.data.students.forEach(st => {
      st.points = Math.max(0, (st.points || 0) + preset.points);
    });
    window.KingdomApp.store.data.pointLogs.unshift({
      id: Date.now(),
      studentId: 'all',
      points: preset.points,
      reason: preset.label,
      date: window.KingdomApp.getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    window.KingdomApp.store.save();
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
    student.points = Math.max(0, (student.points || 0) + preset.points);
    window.KingdomApp.store.data.pointLogs.unshift({
      id: Date.now(),
      studentId: student.id,
      points: preset.points,
      reason: preset.label,
      date: window.KingdomApp.getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    window.KingdomApp.store.save();
    window.KingdomApp.sound.playCoin();
    showToast(`${student.name} 套用【${preset.label}】(${preset.points > 0 ? `+${preset.points}` : preset.points}點)！`);
  }

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
  const student = window.KingdomApp.store.data.students.find(s => s.id === studentId);
  if (!student) return;

  const reason = prompt(`請輸入給予【${student.name}】${points > 0 ? '獎勵' : '紀律扣分'}的事由：`, defaultReason);
  if (reason === null) return;

  const oldStage = window.KingdomApp.getPetStatus(student.petType, student.points).stageIndex;
  student.points = Math.max(0, (student.points || 0) + points);
  const newStage = window.KingdomApp.getPetStatus(student.petType, student.points).stageIndex;

  window.KingdomApp.store.data.pointLogs.unshift({
    id: Date.now(),
    studentId: student.id,
    points,
    reason: reason || defaultReason,
    date: window.KingdomApp.getTodayDateString(),
    time: new Date().toTimeString().slice(0, 5)
  });

  window.KingdomApp.store.save();

  if (points > 0) {
    window.KingdomApp.sound.playCoin();
    if (newStage > oldStage) {
      window.KingdomApp.sound.playFanfare();
      window.KingdomApp.triggerConfetti();
      showToast(`🎉 恭喜！${student.name} 的守護神獸吸收充足榮譽能量，成功進化！`);
    } else {
      showToast(`🪙 ${student.name} 獲得 ${points} 點皇家金幣！`);
    }
  } else {
    showToast(`⚠️ ${student.name} 扣除 ${Math.abs(points)} 點金幣。`);
  }

  renderPointsView();
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
  const reason = document.getElementById("batchPointReason").value.trim();

  let targetStudents = [];
  if (currentPointTargetMode === 'all') {
    targetStudents = window.KingdomApp.store.data.students;
  } else {
    const checked = Array.from(document.querySelectorAll('input[name="targetStudentCheck"]:checked')).map(cb => parseInt(cb.value, 10));
    if (checked.length === 0) {
      alert("請至少勾選一位大臣！");
      return;
    }
    targetStudents = window.KingdomApp.store.data.students.filter(st => checked.includes(st.id));
  }

  targetStudents.forEach(st => {
    st.points = Math.max(0, (st.points || 0) + points);
  });

  window.KingdomApp.store.data.pointLogs.unshift({
    id: Date.now(),
    studentId: currentPointTargetMode === 'all' ? 'all' : targetStudents[0].id,
    points,
    reason: currentPointTargetMode === 'all' ? reason : `${reason} (${targetStudents.map(s => s.name).join('、')})`,
    date: window.KingdomApp.getTodayDateString(),
    time: new Date().toTimeString().slice(0, 5)
  });

  window.KingdomApp.store.save();
  window.KingdomApp.sound.playFanfare();
  window.KingdomApp.triggerConfetti();
  showToast(`👑 聖旨已宣告！獎勵已發放給 ${targetStudents.length} 位大臣！`);
  closeBatchPointModal();
  renderPointsView();
}

// ===================================================================
// 7. 皇家神獸閣總覽 (Pet Evolution View)
// ===================================================================
function renderPetsOverview() {
  const grid = document.getElementById("petsOverviewGrid");
  if (!grid) return;

  const students = window.KingdomApp.store.data.students;

  grid.innerHTML = students.map(st => {
    const petStatus = window.KingdomApp.getPetStatus(st.petType, st.points);
    const svgCode = window.KingdomApp.renderPetSVG(st.petType, petStatus.stageIndex);

    return `
      <div class="parchment-card p-4 minister-card flex flex-col justify-between text-center">
        <div>
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
              座號 ${String(st.seatNo).padStart(2, '0')}
            </span>
            <span class="font-bold px-2 py-0.5 rounded-full" style="background-color: ${petStatus.stageColor}20; color: ${petStatus.stageColor}">
              階級 ${petStatus.stageIndex}/4
            </span>
          </div>

          <div class="mt-2 text-sm font-black text-slate-800">${st.name}</div>
          <div class="text-[11px] text-amber-800 font-bold">${st.title}</div>

          <div class="w-32 h-32 mx-auto my-2 pet-animated">
            ${svgCode}
          </div>

          <h4 class="font-black text-slate-900 text-sm mt-1">${petStatus.stageTitle}</h4>
          <p class="text-[10px] text-slate-600 line-clamp-2 px-1">${petStatus.desc}</p>
        </div>

        <div class="mt-3 pt-2 border-t border-amber-200">
          <div class="flex justify-between text-[11px] font-bold text-amber-900 mb-1">
            <span>累積金幣</span>
            <span>${st.points} 🪙</span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full" style="width: ${petStatus.progressPercent}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initLucideIcons();
}

// ===================================================================
// 8. 內閣大臣名冊與批次管理中心 (姓名、幹部名稱、生日密碼 3合1)
// ===================================================================
function renderRosterView() {
  const tbody = document.getElementById("studentRosterTableBody");
  if (!tbody) return;

  const students = window.KingdomApp.store.data.students;

  tbody.innerHTML = students.map(st => {
    const seatPad = String(st.seatNo).padStart(2, '0');
    const bdayPad = (st.birthday || '0101').replace(/[^0-9]/g, '').padStart(4, '0');
    const passCode = seatPad + bdayPad;

    return `
      <tr class="hover:bg-amber-100/60 transition">
        <td class="py-2.5 px-3 font-mono font-black text-amber-950">${seatPad}</td>
        <td class="py-2.5 px-3 font-black text-slate-900">${st.name}</td>
        <td class="py-2.5 px-3 text-xs">
          <span class="bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded font-bold">${st.title}</span>
        </td>
        <td class="py-2.5 px-3 text-xs bg-amber-50/80 rounded">
          <span class="font-mono font-bold text-slate-800">${st.birthday}</span>
          <span class="block text-[10px] text-amber-800 font-mono font-bold">密碼: ${passCode}</span>
        </td>
        <td class="py-2.5 px-3 text-xs font-bold text-slate-700">
          ${st.petType === 'dragon' ? '🐲 烈焰龍' : st.petType === 'unicorn' ? '🦄 獨角獸' : st.petType === 'cat' ? '🐱 靈貓' : '🦁 戰獅'}
        </td>
        <td class="py-2.5 px-3 font-mono font-black text-amber-600">${st.points}</td>
        <td class="py-2.5 px-3 text-right space-x-1">
          <button onclick="promptSingleResetPoints(${st.id})" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold border border-slate-300" title="重置該生金幣點數">
            🔄重置點數
          </button>
          <button onclick="copyParentLink(${st.seatNo})" class="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded text-xs font-black shadow-sm" title="複製家長查閱專用訊息">
            📋 家長連結
          </button>
          <button onclick="openEditStudentModal(${st.id})" class="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-bold">
            修改
          </button>
          <button onclick="deleteStudent(${st.id})" class="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded text-xs font-bold">
            除名
          </button>
        </td>
      </tr>
    `;
  }).join('');

  initLucideIcons();
}

// 批次管理中心 Modal (姓名、幹部、生日密碼 3合1)
function openBatchCenterModal(initialTab = 'names') {
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
  const tabs = ['names', 'titles', 'birthdays'];
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
    textarea.placeholder = "王品捷\n李宇軒\n林冠廷\n... (共27行)";
  } else if (tab === 'titles') {
    hintEl.innerHTML = "請直接複製 27 位大臣官職或幹部名稱貼在下方（<strong>一行一個職稱</strong>，如：首輔大臣、副班長、風紀股長）：";
    textarea.value = students.map(s => s.title).join('\n');
    textarea.placeholder = "內閣首輔大臣\n皇家騎士團長\n國庫財政大臣\n... (共27行)";
  } else if (tab === 'birthdays') {
    hintEl.innerHTML = "請直接複製 27 位學生國曆生日 4 碼貼在下方（<strong>一行一個生日</strong>，如：0101、0520、1104），家長登入時將與座號自動組合成 6 碼（例如 1 號生日 0101 密碼即為 010101）：";
    textarea.value = students.map(s => s.birthday).join('\n');
    textarea.placeholder = "0101\n0520\n1104\n... (共27行)";
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
  document.getElementById("editStudentPetType").value = "dragon";

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
  document.getElementById("editStudentPetType").value = student.petType;

  document.getElementById("studentModal").classList.remove("hidden");
  initLucideIcons();
}

function closeStudentModal() {
  document.getElementById("studentModal").classList.add("hidden");
}

function saveStudentData(e) {
  e.preventDefault();
  const idVal = document.getElementById("editStudentId").value;
  const seatNo = parseInt(document.getElementById("editStudentSeat").value, 10);
  const name = document.getElementById("editStudentName").value.trim();
  const title = document.getElementById("editStudentTitle").value.trim();
  const birthday = document.getElementById("editStudentBirthday").value.trim();
  const petType = document.getElementById("editStudentPetType").value;

  if (idVal) {
    const student = window.KingdomApp.store.data.students.find(s => s.id === parseInt(idVal, 10));
    if (student) {
      student.seatNo = seatNo;
      student.name = name;
      student.title = title;
      student.birthday = birthday;
      student.petType = petType;
    }
    showToast(`👑 大臣【${name}】資料已更新！`);
  } else {
    const newStudent = {
      id: Date.now(),
      seatNo,
      name,
      title,
      birthday,
      petType,
      points: 50
    };
    window.KingdomApp.store.data.students.push(newStudent);
    window.KingdomApp.store.data.students.sort((a, b) => a.seatNo - b.seatNo);
    showToast(`🎉 成功冊封新大臣【${name}】進入西寧小小兵王國！`);
  }

  window.KingdomApp.store.save();
  closeStudentModal();
  renderRosterView();
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
            <button onclick="deleteAnnouncement(${a.id})" class="text-rose-500 hover:text-rose-700 text-xs font-bold">
              刪除
            </button>
          </div>
          <p class="text-xs text-slate-700 mt-1.5 leading-relaxed whitespace-pre-line">${a.content}</p>
          <span class="text-[10px] text-slate-400 mt-2 block font-bold">${a.date}</span>
        </div>
      `).join('');
    }
  }

  initLucideIcons();
}

function submitNewAnnouncement(e) {
  e.preventDefault();
  const title = document.getElementById("announceTitle").value.trim();
  const content = document.getElementById("announceContent").value.trim();
  const pinned = document.getElementById("announcePinned").checked;

  const newAnnounce = {
    id: Date.now(),
    title,
    content,
    pinned,
    date: window.KingdomApp.getTodayDateString()
  };

  window.KingdomApp.store.data.announcements.unshift(newAnnounce);
  window.KingdomApp.store.save();
  window.KingdomApp.sound.playCoin();
  showToast("📢 皇后告示已正式頒布！");

  document.getElementById("announceTitle").value = "";
  document.getElementById("announceContent").value = "";
  document.getElementById("announcePinned").checked = false;

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
    select.innerHTML = students.map(st => `
      <option value="${st.seatNo}">
        座號 ${String(st.seatNo).padStart(2, '0')} ── ${st.name}（${st.title}）
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

  // 神獸
  const petStatus = window.KingdomApp.getPetStatus(student.petType, student.points);
  document.getElementById("parentPetStageTag").textContent = `第 ${petStatus.stageIndex} 階 ‧ ${petStatus.stageTitle}`;
  document.getElementById("parentPetName").textContent = petStatus.stageTitle;
  document.getElementById("parentPetDesc").textContent = petStatus.desc;
  document.getElementById("parentPetProgressText").textContent = petStatus.isMaxStage 
    ? `已達到最高境界 (${student.points} 點)` 
    : `${student.points} / ${petStatus.nextThreshold} 點`;
  document.getElementById("parentPetProgressBar").style.width = `${petStatus.progressPercent}%`;

  const svgContainer = document.getElementById("parentPetSVGContainer");
  if (svgContainer) {
    svgContainer.innerHTML = window.KingdomApp.renderPetSVG(student.petType, petStatus.stageIndex);
  }

  // 出席
  const todayStr = window.KingdomApp.getTodayDateString();
  document.getElementById("parentTodayDateLabel").textContent = todayStr;
  const attendanceBox = document.getElementById("parentAttendanceStatusBox");
  const todayAtt = (window.KingdomApp.store.data.attendance[todayStr] && window.KingdomApp.store.data.attendance[todayStr][student.id]) || { status: 'present' };

  if (todayAtt.status === 'present') {
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

  window.KingdomApp.sound.playCoin();
  window.KingdomApp.triggerConfetti();
  showToast(`💖 ${student.name} 的守護神獸開心地搖著尾巴，心情大好！`);
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
  if (confirm("確定要將所有學生名冊重置為預設的 27 位大臣示範名單嗎？")) {
    window.KingdomApp.store.reset();
    showToast("🔄 王國資料已重置為 27 位大臣預設名單！");
    renderCurrentTeacherTab();
    renderMorningBoard();
  }
}

let toastTimer = null;
function showToast(message, icon = "👑") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3500);
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
  } else if (currentMainView === 'parent') {
    renderParentPortal();
  }
}

// ===================================================================
// 8. 教室座位表 (5行 x 6列 = 30格) ＆ 幸運抽籤控制器
// ===================================================================
let selectedSeatIndex = null;
let luckyDrawTimeout = null;
let draggedSeatIndex = null;

function renderSeatingChart() {
  const container = document.getElementById("seatingGridContainer");
  if (!container) return;

  const chart = window.KingdomApp.store.getSeatingChart();
  const students = window.KingdomApp.store.data.students;
  const todayStr = window.KingdomApp.getTodayDateString();
  const attendanceToday = (window.KingdomApp.store.data.attendance && window.KingdomApp.store.data.attendance[todayStr]) || {};

  let html = "";
  for (let i = 0; i < 30; i++) {
    const seatNo = chart[i];
    const student = seatNo ? students.find(s => s.seatNo === seatNo) : null;
    const isSelected = selectedSeatIndex === i;

    const row = Math.floor(i / 5) + 1;
    const col = (i % 5) + 1;

    if (student) {
      const traffic = window.KingdomApp.store.evaluateStudentTraffic(student.id);
      const att = attendanceToday[student.id];

      let attBadge = "";
      if (att) {
        if (att.status === "present") attBadge = `<span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">到 ${att.checkInTime || ''}</span>`;
        else if (att.status === "late") attBadge = `<span class="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded">⚠️ 遲到</span>`;
        else if (att.status === "leave") attBadge = `<span class="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">🏖️ 請假</span>`;
      } else {
        attBadge = `<span class="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">未打卡</span>`;
      }

      let lightBadge = "";
      if (traffic.light === "green") lightBadge = `<span class="text-xs" title="准許下課">🟢</span>`;
      else if (traffic.light === "yellow") lightBadge = `<span class="text-xs" title="待訂正">🟡</span>`;
      else lightBadge = `<span class="text-xs" title="禁止下課">🔴</span>`;

      let serviceChip = traffic.hasServiceCard ? `<span class="text-[9px] bg-orange-600 text-white font-bold px-1 rounded shadow-xs">🧹愛班</span>` : "";

      html += `
        <div class="seat-desk-card ${isSelected ? 'seat-selected' : ''}" 
             id="seatDesk-${i}"
             draggable="true"
             ondragstart="handleSeatDragStart(event, ${i})"
             ondragover="handleSeatDragOver(event, ${i})"
             ondragleave="handleSeatDragLeave(event, ${i})"
             ondrop="handleSeatDrop(event, ${i})"
             ondragend="handleSeatDragEnd(event)"
             onclick="handleSeatClick(${i})">
          
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-amber-900/70">席位 ${i + 1} (${row}排${col}列)</span>
            <div class="flex items-center space-x-1">
              ${serviceChip}
              ${lightBadge}
            </div>
          </div>

          <div class="my-1 flex items-baseline justify-between">
            <div class="flex items-baseline space-x-1.5">
              <span class="font-digital text-lg font-black text-amber-950">${student.seatNo}號</span>
              <span class="text-base font-black text-slate-900">${student.name}</span>
            </div>
            ${attBadge}
          </div>

          <div class="flex items-center justify-between text-[10px] text-amber-950/70 border-t border-amber-200/60 pt-1">
            <span class="truncate max-w-[100px] font-medium">${student.title || '大臣'}</span>
            <span class="font-bold text-amber-900">🪙 ${student.points}</span>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="seat-empty-card ${isSelected ? 'seat-selected' : ''}" 
             id="seatDesk-${i}"
             ondragover="handleSeatDragOver(event, ${i})"
             ondragleave="handleSeatDragLeave(event, ${i})"
             ondrop="handleSeatDrop(event, ${i})"
             onclick="handleSeatClick(${i})">
          <span class="text-xs font-bold text-slate-400">席位 ${i + 1}</span>
          <span class="text-xs font-bold text-amber-700/80 mt-1">+ 空席</span>
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

function handleSeatDragStart(e, idx) {
  draggedSeatIndex = idx;
  e.dataTransfer.setData("text/plain", String(idx));
  e.dataTransfer.effectAllowed = "move";
  const el = document.getElementById(`seatDesk-${idx}`);
  if (el) el.classList.add("seat-dragging");
}

function handleSeatDragOver(e, idx) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
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
  const sourceIdx = draggedSeatIndex;
  draggedSeatIndex = null;

  document.querySelectorAll(".seat-drag-over").forEach(el => el.classList.remove("seat-drag-over"));
  document.querySelectorAll(".seat-dragging").forEach(el => el.classList.remove("seat-dragging"));

  if (sourceIdx !== null && sourceIdx !== targetIdx) {
    window.KingdomApp.store.swapSeats(sourceIdx, targetIdx);
    window.KingdomApp.sound.playCoin();
    showToast(`💺 席位 ${sourceIdx + 1} 與 席位 ${targetIdx + 1} 已成功調換！`, "👑");
    renderSeatingChart();
  }
}

function handleSeatDragEnd(e) {
  draggedSeatIndex = null;
  document.querySelectorAll(".seat-drag-over").forEach(el => el.classList.remove("seat-drag-over"));
  document.querySelectorAll(".seat-dragging").forEach(el => el.classList.remove("seat-dragging"));
}

function handleSeatClick(idx) {
  const chart = window.KingdomApp.store.getSeatingChart();
  const notice = document.getElementById("seatingSwapNotice");
  const text = document.getElementById("seatingSwapText");

  if (selectedSeatIndex === null) {
    selectedSeatIndex = idx;
    const seatNo = chart[idx];
    const student = seatNo ? window.KingdomApp.store.data.students.find(s => s.seatNo === seatNo) : null;
    const label = student ? `${student.seatNo}號 ${student.name}` : `席位 ${idx + 1} (空席)`;
    if (text) text.textContent = `已選取「${label}」，請點擊另一個席位進行互換：`;
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
  const notice = document.getElementById("seatingSwapNotice");
  if (notice) notice.classList.add("hidden");
  renderSeatingChart();
}

function randomizeSeatsPrompt() {
  if (confirm("👑 確定要隨機重新排位全班 27 位大臣的座位嗎？")) {
    window.KingdomApp.store.randomizeSeats();
    window.KingdomApp.sound.playFanfare();
    window.KingdomApp.triggerConfetti();
    showToast("🔀 全班座位已隨機重新分配！", "🎉");
    renderSeatingChart();
  }
}

function resetSeatingPrompt() {
  if (confirm("確定要將座位表恢復為 1~27 號初始依序排位嗎？")) {
    window.KingdomApp.store.resetSeatingChart();
    showToast("🔄 座位表已恢復為 1~27 號預設排位！", "💺");
    renderSeatingChart();
  }
}

function printSeatingChart() {
  window.print();
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
      if (detailEl) detailEl.textContent = `內閣官職：${winner.title || '皇家大臣'} ‧ 目前榮譽金幣：${winner.points} 點`;
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
  const modal = document.getElementById("timerModal");
  if (modal) modal.classList.remove("hidden");
  updateTimerUI();
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
      badge.textContent = "🟢 教室區網連線中";
      badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white";
    } else if (status.googleScriptUrl) {
      if (status.status === 'error') {
        badge.textContent = "連線異常";
        badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white";
      } else {
        badge.textContent = "🟢 Google 雲端連線中";
        badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white";
      }
    } else {
      badge.textContent = "⚠️ 尚未連線 Google 雲端庫";
      badge.className = "text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-600 text-white";
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
      modeText.textContent = "教室 Wi-Fi 區網同步";
    } else if (status.googleScriptUrl) {
      modeText.textContent = "Google 官方雲端庫 (即時雙向同步)";
    } else {
      modeText.textContent = "請完成下方 3 步驟啟用";
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

function copyGoogleAppsScriptCode() {
  const code = `// === 西寧小小兵王國 ‧ Google 雲端專屬同步腳本 ===
// 本腳本支援分塊儲存，容量高達 500KB，完全免費且安全！

function doGet(e) {
  var p = (e && e.parameter) || {};
  var account = (p.account || 'default').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  var action = p.action || 'pull';
  var prop = PropertiesService.getScriptProperties();

  if (action === 'push' && p.payload) {
    saveData(prop, account, p.payload);
    return ContentService.createTextOutput(JSON.stringify({ success: true, timestamp: new Date().getTime() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

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
  return ContentService.createTextOutput(JSON.stringify({ success: true, timestamp: new Date().getTime() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveData(prop, account, str) {
  var CHUNK_SIZE = 8000;
  var totalChunks = Math.ceil(str.length / CHUNK_SIZE);
  var oldTotal = parseInt(prop.getProperty('chunk_cnt_' + account) || '0', 10);
  for (var i = totalChunks; i < oldTotal; i++) {
    prop.deleteProperty('data_' + account + '_' + i);
  }
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
  const sync = window.KingdomApp.cloudSync;
  showToast("正在與雲端同步資料...", "🔄");
  const pullRes = await sync.pull();
  if (pullRes.success) {
    showToast("📥 已成功自雲端下載最新班級存檔！", "🟢");
  } else {
    const pushRes = await sync.push();
    if (pushRes.success) {
      showToast("☁️ 已成功將本機最新資料上傳至雲端！", "🟢");
    } else {
      showToast(`同步失敗：${pushRes.error || '連線逾時'}`, "⚠️");
    }
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
    openCloudSyncModal
  };
}

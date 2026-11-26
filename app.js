/**
 * 西寧國小五年二班 ‧ 西寧小小兵王國 (27人旗艦完整版)
 * 核心數據架構、可愛守護動物九大神獸 (五階金化進化)、雲端即時同步、歷史紀錄與狀態管理
 */

// ============================================================================
// 1. 27位大臣初始名冊資料 (支援雙軌金幣制度：可用金幣 points 與生涯累積總額 lifetimePoints)
// ============================================================================
const DEFAULT_STUDENTS_27 = [
  { id: 1, seatNo: 1, name: "洪永恩", gender: "M", title: "漱口水發放官", birthday: "0315", points: 85, lifetimePoints: 85, animalType: "dog", petType: "dog", petExp: 85, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 2, seatNo: 2, name: "莊淇勛", gender: "M", title: "晨間小隊長", birthday: "0520", points: 160, lifetimePoints: 160, animalType: "dog", petType: "dog", petExp: 160, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 3, seatNo: 3, name: "黃胤哲", gender: "M", title: "設備掌管官", birthday: "0812", points: 210, lifetimePoints: 210, animalType: "dog", petType: "dog", petExp: 210, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 4, seatNo: 4, name: "吳秉叡", gender: "M", title: "清運小隊長", birthday: "1104", points: 65, lifetimePoints: 65, animalType: "dog", petType: "dog", petExp: 65, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 5, seatNo: 5, name: "王添福", gender: "M", title: "午休巡查官", birthday: "0228", points: 130, lifetimePoints: 130, animalType: "dog", petType: "dog", petExp: 130, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 6, seatNo: 6, name: "王邑丞", gender: "M", title: "清潔指揮官", birthday: "0709", points: 520, lifetimePoints: 520, animalType: "dog", petType: "dog", petExp: 520, secondPetType: "cat", secondPetExp: 20, pets: [{ type: "dog" }, { type: "cat" }] },
  { id: 7, seatNo: 7, name: "王識齊", gender: "M", title: "體能大將軍", birthday: "0923", points: 95, lifetimePoints: 95, animalType: "dog", petType: "dog", petExp: 95, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 8, seatNo: 8, name: "陳楷衡", gender: "M", title: "歸位巡查員", birthday: "0416", points: 145, lifetimePoints: 145, animalType: "dog", petType: "dog", petExp: 145, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 9, seatNo: 9, name: "王少謙", gender: "M", title: "回收清理官", birthday: "1205", points: 50, lifetimePoints: 50, animalType: "dog", petType: "dog", petExp: 50, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 10, seatNo: 10, name: "李承翰", gender: "M", title: "掌電小侍衛", birthday: "0630", points: 175, lifetimePoints: 175, animalType: "dog", petType: "dog", petExp: 175, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 11, seatNo: 11, name: "巫律杋", gender: "M", title: "香蕉御廚長", birthday: "0118", points: 115, lifetimePoints: 115, animalType: "dog", petType: "dog", petExp: 115, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 12, seatNo: 12, name: "陳彥廷", gender: "M", title: "值日勤務官", birthday: "1010", points: 240, lifetimePoints: 240, animalType: "dog", petType: "dog", petExp: 240, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 13, seatNo: 13, name: "林詰程", gender: "M", title: "日誌紀錄官", birthday: "0403", points: 190, lifetimePoints: 190, animalType: "dog", petType: "dog", petExp: 190, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 14, seatNo: 14, name: "顏珦菲", gender: "F", title: "清潔指揮官", birthday: "0825", points: 155, lifetimePoints: 155, animalType: "dog", petType: "dog", petExp: 155, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 15, seatNo: 15, name: "王瑜嫣", gender: "F", title: "作業點收官", birthday: "0614", points: 535, lifetimePoints: 535, animalType: "dog", petType: "dog", petExp: 535, secondPetType: "rabbit", secondPetExp: 35, pets: [{ type: "dog" }, { type: "rabbit" }] },
  { id: 16, seatNo: 16, name: "李堇夢", gender: "F", title: "體能大將軍", birthday: "0329", points: 80, lifetimePoints: 80, animalType: "dog", petType: "dog", petExp: 80, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 17, seatNo: 17, name: "廖妘熙", gender: "F", title: "潔牙督導官", birthday: "1119", points: 125, lifetimePoints: 125, animalType: "dog", petType: "dog", petExp: 125, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 18, seatNo: 18, name: "方庭妤", gender: "F", title: "餐具小總長", birthday: "0508", points: 205, lifetimePoints: 205, animalType: "dog", petType: "dog", petExp: 205, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 19, seatNo: 19, name: "楊晏熏", gender: "F", title: "訂正審查官", birthday: "0915", points: 140, lifetimePoints: 140, animalType: "dog", petType: "dog", petExp: 140, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 20, seatNo: 20, name: "吳沛岑", gender: "F", title: "清潔指揮官", birthday: "0722", points: 165, lifetimePoints: 165, animalType: "dog", petType: "dog", petExp: 165, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 21, seatNo: 21, name: "林倢希", gender: "F", title: "暖心小小兵", birthday: "0107", points: 280, lifetimePoints: 280, animalType: "dog", petType: "dog", petExp: 280, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 22, seatNo: 22, name: "廖紫婷", gender: "F", title: "公告佈達官", birthday: "1224", points: 90, lifetimePoints: 90, animalType: "dog", petType: "dog", petExp: 90, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 23, seatNo: 23, name: "吳欣菲", gender: "F", title: "秩序執法官", birthday: "0214", points: 135, lifetimePoints: 135, animalType: "dog", petType: "dog", petExp: 135, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 24, seatNo: 24, name: "林詠泓", gender: "F", title: "最高指揮官", birthday: "1002", points: 70, lifetimePoints: 70, animalType: "dog", petType: "dog", petExp: 70, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 25, seatNo: 25, name: "王子芸", gender: "F", title: "小小兵宰相", birthday: "0606", points: 225, lifetimePoints: 225, animalType: "dog", petType: "dog", petExp: 225, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 26, seatNo: 26, name: "梁語倢", gender: "F", title: "香蕉點數官", birthday: "0918", points: 110, lifetimePoints: 110, animalType: "dog", petType: "dog", petExp: 110, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] },
  { id: 27, seatNo: 27, name: "楊淳閔", gender: "F", title: "公告佈達官", birthday: "0425", points: 140, lifetimePoints: 140, animalType: "dog", petType: "dog", petExp: 140, secondPetType: null, secondPetExp: 0, pets: [{ type: "dog" }] }
];

// 預設自訂集點項目庫 (加分 & 扣分，導師可自由新增、修改、刪除)
const DEFAULT_POINT_PRESETS = [
  // 加分項目
  { id: 'p1', type: 'plus', label: '課堂積極發表', points: 2, icon: '💡' },
  { id: 'p2', type: 'plus', label: '遵守班級常規', points: 2, icon: '🛡️' },
  { id: 'p3', type: 'plus', label: '皇宮整潔認真', points: 3, icon: '🧹' },
  { id: 'p4', type: 'plus', label: '友愛互助同儕', points: 3, icon: '🤝' },
  { id: 'p5', type: 'plus', label: '奏章字跡優良', points: 3, icon: '📜' },
  { id: 'p6', type: 'plus', label: '特殊卓越貢獻', points: 5, icon: '👑' },
  // 扣分項目
  { id: 'm1', type: 'minus', label: '上課分心聊天', points: -1, icon: '🤐' },
  { id: 'm2', type: 'minus', label: '忘記帶學用品', points: -1, icon: '🎒' },
  { id: 'm3', type: 'minus', label: '走廊危險奔跑', points: -2, icon: '🏃' },
  { id: 'm4', type: 'minus', label: '作業未按時交', points: -2, icon: '⚠️' }
];

// 預設作業常用快捷項目庫
const DEFAULT_HOMEWORK_PRESETS = [
  { id: 'hw_pre_1', subject: '國語', name: '國習', fullName: '國語習作完成' },
  { id: 'hw_pre_2', subject: '國語', name: '造詞', fullName: '生字造詞甲乙本' },
  { id: 'hw_pre_3', subject: '國語', name: '圈詞', fullName: '國語圈詞隨堂本' },
  { id: 'hw_pre_4', subject: '數學', name: '數習', fullName: '數學習作進度' },
  { id: 'hw_pre_5', subject: '數學', name: '數練', fullName: '數學隨堂練習本' },
  { id: 'hw_pre_6', subject: '自然', name: '自習', fullName: '自然習作觀察記錄' },
  { id: 'hw_pre_7', subject: '社會', name: '社習', fullName: '社會習作重點作業' },
  { id: 'hw_pre_8', subject: '綜合', name: '聯絡簿', fullName: '家長簽名聯絡簿' }
];

// 預設行為登記原因庫 (支援自省卡、愛班卡與常規提醒單快捷，導師可自由新增、編輯、刪除)
const DEFAULT_BEHAVIOR_REASONS = [
  { id: 'br_ref_1', type: 'reflection', label: '作業未交', text: '作業未交留座反省' },
  { id: 'br_ref_2', type: 'reflection', label: '上課分心聊私事', text: '上課分心聊私事' },
  { id: 'br_ref_3', type: 'reflection', label: '未帶課堂學用品', text: '未帶課堂學用品' },
  { id: 'br_ref_4', type: 'reflection', label: '未經許可擅離位', text: '未經許可擅離位' },
  { id: 'br_ref_5', type: 'reflection', label: '走廊危險奔跑追逐', text: '走廊危險奔跑追逐' },
  { id: 'br_srv_1', type: 'service', label: '遲到', text: '遲到' },
  { id: 'br_srv_2', type: 'service', label: '個人座位整潔不佳', text: '個人座位周遭整潔不佳' },
  { id: 'br_srv_3', type: 'service', label: '打掃責任區未落實', text: '打掃責任區未落實' },
  { id: 'br_srv_4', type: 'service', label: '忘記清空抽屜置物櫃', text: '忘記抽屜與置物櫃清空' },
  { id: 'br_srv_5', type: 'service', label: '公物使用後未歸位', text: '公物使用後未歸位' },
  // 常規提醒單快捷 (自我提醒書寫，支援指定書寫目標次數)
  { id: 'br_rem_1', type: 'reminder', label: '聽寫記得簽名', text: '聽寫要記得簽名', targetCount: 50 },
  { id: 'br_rem_2', type: 'reminder', label: '聯絡簿未簽名', text: '聯絡簿要記得請家長簽名', targetCount: 30 },
  { id: 'br_rem_3', type: 'reminder', label: '學用品記得帶', text: '每天出門前檢查書包學用品', targetCount: 30 },
  { id: 'br_rem_4', type: 'reminder', label: '走廊慢行不奔跑', text: '走廊常規慢行不奔跑', targetCount: 50 },
  { id: 'br_rem_5', type: 'reminder', label: '課堂專心不聊天', text: '上課專心聽講不說話', targetCount: 30 },
  { id: 'br_rem_6', type: 'reminder', label: '座位周遭保持整潔', text: '隨手撿垃圾保持座位整潔', targetCount: 30 }
];

// 預設早自修與重要提醒快捷項目庫 (導師可自由新增、修改、刪除、恢復預設)
const DEFAULT_REMINDER_PRESETS = [
  { id: 'rem_pre_1', label: '📖 專注靜心自修', text: '早自修：全班保持專注靜心自修' },
  { id: 'rem_pre_2', label: '✍️ 國語生字練習', text: '早自修：國語生字造詞隨堂練習' },
  { id: 'rem_pre_3', label: '➗ 數學隨堂演練', text: '早自修：數學隨堂演練計算題' },
  { id: 'rem_pre_4', label: '📚 閱讀班書日誌', text: '早自修：閱讀班書並記錄閱讀日誌' },
  { id: 'rem_pre_5', label: '🏃 明穿運動服鞋', text: '重要提醒：明日有體育課，請穿著西寧王國運動服與運動鞋' },
  { id: 'rem_pre_6', label: '📝 聯絡簿簽名', text: '重要提醒：請檢查家長聯絡簿簽名並繳交' },
  { id: 'rem_pre_7', label: '🎨 攜帶美勞用具', text: '重要提醒：攜帶美勞課所需用具與剪刀色紙' },
  { id: 'rem_pre_8', label: '🪥 餐後潔牙整理', text: '生活提醒：用餐完畢徹底潔牙並整理桌面' }
];

// 預設課堂作息鐘聲快捷項目庫 (導師可自由新增、修改、刪除、恢復預設)
const DEFAULT_ALARM_PRESETS = [
  { id: 'alarm_pre_1', time: '08:40', btnText: '08:40 一上', label: '第一節上課', highlight: false },
  { id: 'alarm_pre_2', time: '09:20', btnText: '09:20 一休', label: '第一節下課', highlight: false },
  { id: 'alarm_pre_3', time: '10:10', btnText: '10:10 大下課 🌟', label: '第二節下課 (大下課)', highlight: true },
  { id: 'alarm_pre_4', time: '11:10', btnText: '11:10 三休', label: '第三節下課', highlight: false },
  { id: 'alarm_pre_5', time: '12:00', btnText: '12:00 午餐 🍱', label: '午餐御膳時間', highlight: false },
  { id: 'alarm_pre_6', time: '13:20', btnText: '13:20 午休畢', label: '午休結束醒盹', highlight: false },
  { id: 'alarm_pre_7', time: '14:10', btnText: '14:10 五休', label: '第五節下課', highlight: false },
  { id: 'alarm_pre_8', time: '15:00', btnText: '15:00 六休', label: '第六節下課', highlight: false },
  { id: 'alarm_pre_9', time: '15:55', btnText: '15:55 放學 🎒', label: '放學鐘聲回家', highlight: true }
];

// 預設課堂活動倒數計時情境快捷庫 (導師可自由新增、修改、刪除、恢復預設)
const DEFAULT_TIMER_PRESETS = [
  { id: 'tm_1', label: '抄寫家庭聯絡簿', btnText: '📜 寫聯絡簿 (5分)', seconds: 300 },
  { id: 'tm_2', label: '課堂小組討論', btnText: '👥 小組討論 (10分)', seconds: 600 },
  { id: 'tm_3', label: '隨堂練習測驗', btnText: '✏️ 課堂測驗 (15分)', seconds: 900 },
  { id: 'tm_4', label: '晨間寧靜閱讀', btnText: '📖 晨讀專注 (20分)', seconds: 1200 },
  { id: 'tm_5', label: '課間下課倒數', btnText: '🔔 下課倒數 (10分)', seconds: 600 }
];

// 預設下課紅綠燈課堂作息時程表 (各校作息時間可由導師自訂編輯、新增、刪除、恢復預設)
const DEFAULT_BELL_SCHEDULE = [
  { id: 'sch_1', label: "早自習・晨會活動", start: "07:40", end: "08:40", type: "morning", targetLabel: "第一節上課", targetTime: "08:40", isBreak: true },
  { id: 'sch_2', label: "第一節 課堂進行中", start: "08:40", end: "09:20", type: "class", period: 1, targetLabel: "第一節下課", targetTime: "09:20", isBreak: false },
  { id: 'sch_3', label: "第一節 下課時間", start: "09:20", end: "09:30", type: "break", duration: 10, targetLabel: "第二節上課", targetTime: "09:30", isBreak: true },
  { id: 'sch_4', label: "第二節 課堂進行中", start: "09:30", end: "10:10", type: "class", period: 2, targetLabel: "第二節大下課", targetTime: "10:10", isBreak: false },
  { id: 'sch_5', label: "第二節 大下課時間 🌟", start: "10:10", end: "10:30", type: "break", isBigBreak: true, duration: 20, targetLabel: "第三節上課", targetTime: "10:30", isBreak: true },
  { id: 'sch_6', label: "第三節 課堂進行中", start: "10:30", end: "11:10", type: "class", period: 3, targetLabel: "第三節下課", targetTime: "11:10", isBreak: false },
  { id: 'sch_7', label: "第三節 下課時間", start: "11:10", end: "11:20", type: "break", duration: 10, targetLabel: "第四節上課", targetTime: "11:20", isBreak: true },
  { id: 'sch_8', label: "第四節 課堂進行中", start: "11:20", end: "12:00", type: "class", period: 4, targetLabel: "午餐時間", targetTime: "12:00", isBreak: false },
  { id: 'sch_9', label: "午餐御膳時間 🍱", start: "12:00", end: "12:40", type: "lunch", targetLabel: "午休開始", targetTime: "12:40", isBreak: true },
  { id: 'sch_10', label: "午休靜心休養 💤", start: "12:40", end: "13:20", type: "nap", targetLabel: "午休起床", targetTime: "13:20", isBreak: false },
  { id: 'sch_11', label: "午休起床預備 🌤️", start: "13:20", end: "13:30", type: "break", duration: 10, targetLabel: "第五節上課", targetTime: "13:30", isBreak: true },
  { id: 'sch_12', label: "第五節 課堂進行中", start: "13:30", end: "14:10", type: "class", period: 5, targetLabel: "第五節下課", targetTime: "14:10", isBreak: false },
  { id: 'sch_13', label: "第五節 下課時間", start: "14:10", end: "14:20", type: "break", duration: 10, targetLabel: "第六節上課", targetTime: "14:20", isBreak: true },
  { id: 'sch_14', label: "第六節 課堂進行中", start: "14:20", end: "15:00", type: "class", period: 6, targetLabel: "第六節下課", targetTime: "15:00", isBreak: false },
  { id: 'sch_15', label: "第六節 下課時間", start: "15:00", end: "15:10", type: "break", duration: 10, targetLabel: "第七節上課", targetTime: "15:10", isBreak: true },
  { id: 'sch_16', label: "第七節 課堂進行中", start: "15:10", end: "15:50", type: "class", period: 7, targetLabel: "放學整理", targetTime: "15:50", isBreak: false },
  { id: 'sch_17', label: "放學整理準備 🎒", start: "15:50", end: "15:55", type: "dismissal", targetLabel: "放學鐘聲", targetTime: "15:55", isBreak: true }
];

// 預設教室座位表 (5行 x 6列 = 30格)
// 最右邊為第一排 (1~5號)，向左依序為第二排 (6~10號)、第三排 (11~15號)、第四排 (16~20號)，最左邊兩排皆為第五排 (21~27號)
const DEFAULT_SEATING_CHART = [
  22, 21, 16, 11,  6,  1,
  24, 23, 17, 12,  7,  2,
  26, 25, 18, 13,  8,  3,
  null, 27, 19, 14,  9,  4,
  null, null, 20, 15, 10,  5
];


// 預設今日聯絡簿資料 (全手動純淨版，作業由導師每日自行填寫發布，系統絕不自動生成任何假作業)
const DEFAULT_CONTACT_BOOK = {
  date: getTodayDateString(),
  homeworkItems: [],
  reminders: [],
  queenMotto: "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"
};

// 歷日聯絡簿歷史紀錄 (全手動純淨版，完全由導師手動發布與保存)
const DEFAULT_CONTACT_BOOK_HISTORY = {};

// ============================================================================
// 2. 可愛守護動物九大神獸庫 (5階金化進化門檻：0, 30, 60, 100, 150)
// ============================================================================
const ANIMAL_DEFINITIONS = {
  lion: {
    id: "lion",
    name: "威嚴戰獅",
    icon: "🦁",
    color: "#f59e0b",
    bgGradient: "from-amber-400 to-amber-600",
    desc: "象徵勇氣、正義與領導力，食量充沛、體格雄偉壯碩。",
    stages: [
      { min: 0, title: "🍼 喝奶小幼獅 (幼幼期)", icon: "🍼", desc: "剛來到動物園的巴掌大初生小獅子寶寶，最喜歡大口大口喝溫牛奶！" },
      { min: 30, title: "🌿 蹦跳小獅童 (成長期)", icon: "🦁", desc: "在草地上活蹦亂跳，食量逐漸變大，開始吃碎肉泥和營養小點心！" },
      { min: 60, title: "🏃 健壯少年獅 (探索期)", icon: "🍖", desc: "體格健美、長出帥氣小鬃毛，最喜歡追著小皮球練習奔跑！" },
      { min: 100, title: "🦁 威風大成雄獅 (成熟期)", icon: "🦁", desc: "體魄魁梧、鬃毛濃密健康，每天吃飽飽、精神奕奕的大成體！" },
      { min: 150, title: "👑 動物園鎮園獅王 (巨星期)", icon: "🌟", desc: "被全班大臣餵得圓滾滾、體格雄偉健康，佩戴金色榮譽勳章的園區第一招牌巨星！" }
    ]
  },
  dog: {
    id: "dog",
    name: "忠誠柴犬",
    icon: "🐶",
    color: "#f97316",
    bgGradient: "from-orange-400 to-amber-600",
    desc: "象徵忠誠、守望與溫暖，永遠陪伴在大臣身旁。",
    stages: [
      { min: 0, title: "🍼 圓滾萌奶柴 (幼幼期)", icon: "🍼", desc: "毛茸茸肉嘟嘟的柴犬幼崽，走起路來東倒西歪，愛喝奶愛撒嬌。" },
      { min: 30, title: "🌿 搖尾小幼柴 (成長期)", icon: "🐶", desc: "學會搖尾巴打招呼，天天大口嗑磨牙餅乾，耳朵開始立起來囉！" },
      { min: 60, title: "🏃 敏捷少年柴 (探索期)", icon: "🦴", desc: "活力滿點的接飛盤高手，體態勻稱結實，最愛啃營養潔牙大骨！" },
      { min: 100, title: "🐶 忠誠成年柴 (成熟期)", icon: "🐶", desc: "英挺帥氣的成熟柴犬，腮幫子肉嘟嘟，是班級最忠心耿耿的守護者！" },
      { min: 150, title: "👑 動物園超人氣名柴 (巨星期)", icon: "🌟", desc: "被投餵得圓滾滾、笑咪咪的網紅大明星，胸前掛著金色冠軍獎牌！" }
    ]
  },
  cat: {
    id: "cat",
    name: "敏捷靈貓",
    icon: "🐱",
    color: "#a855f7",
    bgGradient: "from-purple-400 to-indigo-600",
    desc: "象徵敏捷、智慧與冷靜，擁有看穿一切問題的慧眼。",
    stages: [
      { min: 0, title: "🍼 呼嚕小萌貓 (幼幼期)", icon: "🍼", desc: "掌心大小的粉嫩肉球小貓咪，喝完奶就發出舒服的呼嚕呼嚕聲。" },
      { min: 30, title: "🌿 撲球小貓童 (成長期)", icon: "🐱", desc: "長出尖尖小耳朵，最愛撲逗貓棒和吃美味肉泥點心條！" },
      { min: 60, title: "🏃 輕盈少年貓 (探索期)", icon: "🐟", desc: "身手矯健敏捷，喜歡在高跳台散步，每天都要吃一罐香噴噴魚肉罐頭！" },
      { min: 100, title: "🐱 優雅成年貓 (成熟期)", icon: "🐱", desc: "毛皮如絲綢般亮麗順滑，舉止優雅從容，健康又自信的大貓咪。" },
      { min: 150, title: "👑 動物園人氣招財貓皇 (巨星期)", icon: "🌟", desc: "被大家疼愛投餵得胖嘟嘟圓滾滾、全園最受寵愛的頂流貓皇大巨星！" }
    ]
  },
  rabbit: {
    id: "rabbit",
    name: "活潑飛兔",
    icon: "🐰",
    color: "#ec4899",
    bgGradient: "from-pink-400 to-rose-600",
    desc: "象徵純潔、友善與蓬勃生機，步伐輕盈飛躍。",
    stages: [
      { min: 0, title: "🍼 垂耳萌兔崽 (幼幼期)", icon: "🍼", desc: "巴掌大的雪白小毛球，抱在手心暖呼呼，正在安心喝幼兔奶。" },
      { min: 30, title: "🌿 啃草小幼兔 (成長期)", icon: "🐰", desc: "兩顆門牙喀滋喀滋啃新鮮牧草與紅蘿蔔，長耳朵一晃一晃超級萌！" },
      { min: 60, title: "🏃 飛躍少年兔 (探索期)", icon: "🥕", desc: "後腿肌肉健壯發達，輕輕一躍就能跳過障礙，最愛吃甘甜蘋果丁！" },
      { min: 100, title: "🐰 健美成年大白兔 (成熟期)", icon: "🐰", desc: "毛茸茸的健美大白兔，眼睛亮晶晶，體能滿分精力充沛！" },
      { min: 150, title: "👑 動物園人氣福氣巨兔 (巨星期)", icon: "🌟", desc: "像大棉花糖一樣巨大圓潤又毛茸茸的超級明星兔，全園小朋友都搶著看它！" }
    ]
  },
  bear: {
    id: "bear",
    name: "沉穩棕熊",
    icon: "🐻",
    color: "#854d0e",
    bgGradient: "from-amber-600 to-yellow-800",
    desc: "象徵穩健、厚重與堅毅，是動物園最厚實強大的大將。",
    stages: [
      { min: 0, title: "🍼 抱抱小奶熊 (幼幼期)", icon: "🍼", desc: "抱著小奶瓶打瞌睡的毛茸茸熊寶寶，憨態可掬惹人憐愛。" },
      { min: 30, title: "🌿 爬樹小熊童 (成長期)", icon: "🐻", desc: "好奇地在草地上翻跟斗，愛吃甜甜蘋果和香濃燕麥蜂蜜粥！" },
      { min: 60, title: "🏃 壯碩少年熊 (探索期)", icon: "🍎", desc: "體格快速抽高變壯，能輕鬆抓起大木頭，食量驚人最愛鮮魚！" },
      { min: 100, title: "🐻 沉穩大棕熊 (成熟期)", icon: "🐻", desc: "厚實可靠的森林巨獸，穩如泰山，是五年二班最堅實的依靠！" },
      { min: 150, title: "👑 動物園榮譽大熊王 (巨星期)", icon: "🌟", desc: "吃飽飽、肚子圓滾滾的招牌巨熊，深受全校師生喜愛的超大隻吉祥物！" }
    ]
  },
  penguin: {
    id: "penguin",
    name: "冰原企鵝",
    icon: "🐧",
    color: "#0284c7",
    bgGradient: "from-sky-400 to-blue-600",
    desc: "象徵冷靜、秩序與不屈毅力，步伐優雅從容。",
    stages: [
      { min: 0, title: "🍼 絨毛企鵝寶寶 (幼幼期)", icon: "🍼", desc: "全身包覆灰色軟綿絨毛的小企鵝，乖乖躲在育兒箱喝營養魚湯。" },
      { min: 30, title: "🌿 搖擺小企鵝 (成長期)", icon: "🐧", desc: "換上黑白相間的小燕尾服，走路左右搖擺，開始大口吞小沙丁魚！" },
      { min: 60, title: "🏃 泳速少年企鵝 (探索期)", icon: "🐟", desc: "在水道中像火箭般滑水飛馳，捕魚身手超一流，精神百倍！" },
      { min: 100, title: "🐧 挺拔帝王企鵝 (成熟期)", icon: "🐧", desc: "胸膛金黃、氣宇軒昂的企鵝紳士，體格健康端莊，秩序第一！" },
      { min: 150, title: "👑 動物園極地大明星 (巨星期)", icon: "🌟", desc: "肚子被小魚乾餵得圓溜溜、戴著金獎牌的極地大明星企鵝！" }
    ]
  },
  owl: {
    id: "owl",
    name: "睿智貓頭鷹",
    icon: "🦉",
    color: "#0d9488",
    bgGradient: "from-teal-400 to-emerald-600",
    desc: "象徵深邃學識、博學與遠見，黑夜中的智慧燈塔。",
    stages: [
      { min: 0, title: "🍼 咕嚕小雛鷹 (幼幼期)", icon: "🍼", desc: "剛換上細軟羽毛的小幼梟，大眼睛圓滾滾地盯著世界看，喝溫流質食物。" },
      { min: 30, title: "🌿 展翼小鷹童 (成長期)", icon: "🦉", desc: "在低枝頭上練習張開翅膀，開始吃營養綜合堅果與高蛋白餐點！" },
      { min: 60, title: "🏃 巡弋少年梟 (探索期)", icon: "🍇", desc: "羽翼漸漸豐滿堅硬，飛行悄無聲息，最喜歡在黃昏翱翔巡視！" },
      { min: 100, title: "🦉 威儀大成貓頭鷹 (成熟期)", icon: "🦉", desc: "雙翼展開氣勢雄偉，目光炯炯有神，是守護班級智慧的博學象徵！" },
      { min: 150, title: "👑 動物園智慧神鵰校長 (巨星期)", icon: "🌟", desc: "羽毛泛著健康金色光澤、吃得飽足健康的超級智慧明星貓頭鷹！" }
    ]
  },
  fox: {
    id: "fox",
    name: "機智靈狐",
    icon: "🦊",
    color: "#ea580c",
    bgGradient: "from-orange-500 to-red-600",
    desc: "象徵機靈、創造力與靈活變通，思維敏捷如閃電。",
    stages: [
      { min: 0, title: "🍼 蜷曲小狐崽 (幼幼期)", icon: "🍼", desc: "把小鼻子藏在大尾巴裡睡覺的小狐狸，小巧玲瓏，正在喝幼獸奶。" },
      { min: 30, title: "🌿 靈動小狐童 (成長期)", icon: "🦊", desc: "兩隻耳朵尖尖立起，愛在落葉堆捉迷藏，最愛吃香甜莓果肉片！" },
      { min: 60, title: "🏃 俊朗少年狐 (探索期)", icon: "🫐", desc: "毛色如紅楓烈火般光鮮亮麗，奔跑如風，食量充沛元氣滿載！" },
      { min: 100, title: "🦊 健美成年赤狐 (成熟期)", icon: "🦊", desc: "大尾巴蓬鬆如同雲朵，體型修長健美，聰穎機敏的健康成年狐！" },
      { min: 150, title: "👑 動物園九天仙氣靈狐 (巨星期)", icon: "🌟", desc: "毛髮保養得晶瑩柔順、被愛心投餵得豐滿圓潤的超人氣靈狐！" }
    ]
  },
  hamster: {
    id: "hamster",
    name: "勤奮倉鼠",
    icon: "🐹",
    color: "#eab308",
    bgGradient: "from-yellow-400 to-amber-500",
    desc: "象徵勤奮累積、踏實與自律，一點一滴創造奇蹟。",
    stages: [
      { min: 0, title: "🍼 拇指萌鼠崽 (幼幼期)", icon: "🍼", desc: "只有半隻手指頭大的粉紅小毛球，在暖暖木屑堆裡喝特調奶。" },
      { min: 30, title: "🌿 塞頰小幼鼠 (成長期)", icon: "🐹", desc: "學會用兩隻小爪子捧著葵花子，把腮幫子塞得鼓鼓的！" },
      { min: 60, title: "🏃 跑輪少年鼠 (探索期)", icon: "🌻", desc: "體態健壯圓實，滾輪轉得飛快，最喜歡吃新鮮高麗菜與黃金核桃！" },
      { min: 100, title: "🐹 圓胖成年大金絲鼠 (成熟期)", icon: "🐹", desc: "毛色金黃油亮，肚子圓滾滾，糧倉堆得滿滿的健康大倉鼠！" },
      { min: 150, title: "👑 動物園招牌圓滾滾金鼠 (巨星期)", icon: "🌟", desc: "圓成一顆金黃色大湯圓、吃得超滿足的超級鎮園福氣金鼠大明星！" }
    ]
  }
};

// 舊神獸名稱相容指標
const PET_DEFINITIONS = ANIMAL_DEFINITIONS;

function getTodayDateString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 歷日出席歷史紀錄 (全手動純淨版，完全依賴學生自主打卡或導師手動操作)
const DEFAULT_ATTENDANCE = {};

// 預設作業項目 (全手動純淨版，由導師手動派發，系統絕不預設假作業)
const DEFAULT_HOMEWORK = [];

// 歷次集點與扣分紀錄 (全手動純淨版，完全依賴課堂即時加減分操作)
const DEFAULT_POINT_LOGS = [];

const DEFAULT_REWARD_CARDS = [
  { id: 'rc_1', title: '榮譽免死金牌 (免罰卡)', cost: 30, icon: '🛡️', desc: '可抵銷一次未帶學用品或遲到愛班服務登記', category: 'special' },
  { id: 'rc_2', title: '一日皇家座位特權卡', cost: 45, icon: '💺', desc: '可自主挑選一日心儀王位（需經導師核可）', category: 'privilege' },
  { id: 'rc_3', title: '御膳房優先盛飯令', cost: 20, icon: '🍱', desc: '享有當日午餐第一順位盛飯與加菜特權', category: 'item' },
  { id: 'rc_4', title: '御花園特別免差役令', cost: 25, icon: '🧹', desc: '可免除一日外掃或教室值日生職務', category: 'privilege' },
  { id: 'rc_5', title: '宮廷圖書館自由閱覽證', cost: 15, icon: '📚', desc: '午休或早自習可至班級圖書角借閱傳奇秘笈', category: 'study' },
  { id: 'rc_6', title: '國王特赦奏章豁免卷', cost: 50, icon: '📜', desc: '可減免一項指定短篇日常作業（不含段考與作文）', category: 'special' }
];

// 行為卡累計資料 (座位自省卡：作業未交自動新增/導師手動控制；愛班服務卡：打卡遲到自動設定為「遲到」/導師手動控制，全班預設全數歸零)
const DEFAULT_BEHAVIOR_CARDS = {};

// 皇室公佈欄公告 (由導師全手動發布，系統不自行強加假公告)
const DEFAULT_ANNOUNCEMENTS = [];

const STORAGE_KEY = "xining_kingdom_v3_dashboard";

// ============================================================================
// 3. KingdomStore (狀態管理核心)
// ============================================================================
const MASTER_ROSTER_BACKUP_20261119 = {"queenPassword":"queen","lateThreshold":"07:40","students":[{"id":1,"seatNo":1,"name":"洪永恩","gender":"M","title":"漱口水發放官","birthday":"0315","points":85,"lifetimePoints":85,"animalType":"dog","petType":"dog","petExp":85,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":2,"seatNo":2,"name":"莊淇勛","gender":"M","title":"晨間小隊長","birthday":"0520","points":160,"lifetimePoints":160,"animalType":"dog","petType":"dog","petExp":160,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":3,"seatNo":3,"name":"黃胤哲","gender":"M","title":"設備掌管官","birthday":"0812","points":210,"lifetimePoints":210,"animalType":"dog","petType":"dog","petExp":210,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":4,"seatNo":4,"name":"吳秉叡","gender":"M","title":"清運小隊長","birthday":"1104","points":65,"lifetimePoints":65,"animalType":"dog","petType":"dog","petExp":65,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":5,"seatNo":5,"name":"王添福","gender":"M","title":"午休巡查官","birthday":"0228","points":130,"lifetimePoints":130,"animalType":"dog","petType":"dog","petExp":130,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":6,"seatNo":6,"name":"王邑丞","gender":"M","title":"清潔指揮官","birthday":"0709","points":520,"lifetimePoints":520,"animalType":"dog","petType":"dog","petExp":520,"secondPetType":"cat","secondPetExp":20,"pets":[{"type":"dog"},{"type":"cat"}]},{"id":7,"seatNo":7,"name":"王識齊","gender":"M","title":"體能大將軍","birthday":"0923","points":95,"lifetimePoints":95,"animalType":"dog","petType":"dog","petExp":95,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":8,"seatNo":8,"name":"陳楷衡","gender":"M","title":"歸位巡查員","birthday":"0416","points":145,"lifetimePoints":145,"animalType":"dog","petType":"dog","petExp":145,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":9,"seatNo":9,"name":"王少謙","gender":"M","title":"回收清理官","birthday":"1205","points":50,"lifetimePoints":50,"animalType":"dog","petType":"dog","petExp":50,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":10,"seatNo":10,"name":"李承翰","gender":"M","title":"掌電小侍衛","birthday":"0630","points":175,"lifetimePoints":175,"animalType":"dog","petType":"dog","petExp":175,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":11,"seatNo":11,"name":"巫律杋","gender":"M","title":"香蕉御廚長","birthday":"0118","points":115,"lifetimePoints":115,"animalType":"dog","petType":"dog","petExp":115,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":12,"seatNo":12,"name":"陳彥廷","gender":"M","title":"值日勤務官","birthday":"1010","points":240,"lifetimePoints":240,"animalType":"dog","petType":"dog","petExp":240,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":13,"seatNo":13,"name":"林詰程","gender":"M","title":"日誌紀錄官","birthday":"0403","points":190,"lifetimePoints":190,"animalType":"dog","petType":"dog","petExp":190,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":14,"seatNo":14,"name":"顏珦菲","gender":"F","title":"清潔指揮官","birthday":"0825","points":155,"lifetimePoints":155,"animalType":"dog","petType":"dog","petExp":155,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":15,"seatNo":15,"name":"王瑜嫣","gender":"F","title":"作業點收官","birthday":"0614","points":535,"lifetimePoints":535,"animalType":"dog","petType":"dog","petExp":535,"secondPetType":"rabbit","secondPetExp":35,"pets":[{"type":"dog"},{"type":"rabbit"}]},{"id":16,"seatNo":16,"name":"李堇夢","gender":"F","title":"體能大將軍","birthday":"0329","points":80,"lifetimePoints":80,"animalType":"dog","petType":"dog","petExp":80,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":17,"seatNo":17,"name":"廖妘熙","gender":"F","title":"潔牙督導官","birthday":"1119","points":125,"lifetimePoints":125,"animalType":"dog","petType":"dog","petExp":125,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":18,"seatNo":18,"name":"方庭妤","gender":"F","title":"餐具小總長","birthday":"0508","points":205,"lifetimePoints":205,"animalType":"dog","petType":"dog","petExp":205,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":19,"seatNo":19,"name":"楊晏熏","gender":"F","title":"訂正審查官","birthday":"0915","points":140,"lifetimePoints":140,"animalType":"dog","petType":"dog","petExp":140,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":20,"seatNo":20,"name":"吳沛岑","gender":"F","title":"清潔指揮官","birthday":"0722","points":165,"lifetimePoints":165,"animalType":"dog","petType":"dog","petExp":165,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":21,"seatNo":21,"name":"林倢希","gender":"F","title":"暖心小小兵","birthday":"0107","points":280,"lifetimePoints":280,"animalType":"dog","petType":"dog","petExp":280,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":22,"seatNo":22,"name":"廖紫婷","gender":"F","title":"公告佈達官","birthday":"1224","points":90,"lifetimePoints":90,"animalType":"dog","petType":"dog","petExp":90,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":23,"seatNo":23,"name":"吳欣菲","gender":"F","title":"秩序執法官","birthday":"0214","points":135,"lifetimePoints":135,"animalType":"dog","petType":"dog","petExp":135,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":24,"seatNo":24,"name":"林詠泓","gender":"F","title":"最高指揮官","birthday":"1002","points":70,"lifetimePoints":70,"animalType":"dog","petType":"dog","petExp":70,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":25,"seatNo":25,"name":"王子芸","gender":"F","title":"小小兵宰相","birthday":"0606","points":225,"lifetimePoints":225,"animalType":"dog","petType":"dog","petExp":225,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":26,"seatNo":26,"name":"梁語倢","gender":"F","title":"香蕉點數官","birthday":"0918","points":110,"lifetimePoints":110,"animalType":"dog","petType":"dog","petExp":110,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]},{"id":27,"seatNo":27,"name":"楊淳閔","gender":"F","title":"公告佈達官","birthday":"0425","points":140,"lifetimePoints":140,"animalType":"dog","petType":"dog","petExp":140,"secondPetType":null,"secondPetExp":0,"pets":[{"type":"dog"}]}],"pointPresets":[{"id":"p1","type":"plus","label":"課堂積極發表","points":2,"icon":"💡"},{"id":"p2","type":"plus","label":"遵守班級常規","points":2,"icon":"🛡️"},{"id":"p3","type":"plus","label":"皇宮整潔認真","points":3,"icon":"🧹"},{"id":"p4","type":"plus","label":"友愛互助同儕","points":3,"icon":"🤝"},{"id":"p5","type":"plus","label":"奏章字跡優良","points":3,"icon":"📜"},{"id":"p6","type":"plus","label":"特殊卓越貢獻","points":5,"icon":"👑"},{"id":"m1","type":"minus","label":"上課分心聊天","points":-1,"icon":"🤐"},{"id":"m2","type":"minus","label":"忘記帶學用品","points":-1,"icon":"🎒"},{"id":"m3","type":"minus","label":"走廊危險奔跑","points":-2,"icon":"🏃"},{"id":"m4","type":"minus","label":"作業未按時交","points":-2,"icon":"⚠️"}],"homeworkPresets":[{"id":"hw_pre_1","subject":"國語","name":"國習","fullName":"國語習作完成"},{"id":"hw_pre_2","subject":"國語","name":"造詞","fullName":"生字造詞甲乙本"},{"id":"hw_pre_3","subject":"國語","name":"圈詞","fullName":"國語圈詞隨堂本"},{"id":"hw_pre_4","subject":"數學","name":"數習","fullName":"數學習作進度"},{"id":"hw_pre_5","subject":"數學","name":"數練","fullName":"數學隨堂練習本"},{"id":"hw_pre_6","subject":"自然","name":"自習","fullName":"自然習作觀察記錄"},{"id":"hw_pre_7","subject":"社會","name":"社習","fullName":"社會習作重點作業"},{"id":"hw_pre_8","subject":"綜合","name":"聯絡簿","fullName":"家長簽名聯絡簿"}],"behaviorReasons":[{"id":"br_ref_1","type":"reflection","label":"上課分心聊私事","text":"上課分心聊私事"},{"id":"br_ref_2","type":"reflection","label":"未帶課堂學用品","text":"未帶課堂學用品"},{"id":"br_ref_3","type":"reflection","label":"未經許可擅離位","text":"未經許可擅離位"},{"id":"br_ref_4","type":"reflection","label":"走廊危險奔跑追逐","text":"走廊危險奔跑追逐"},{"id":"br_ref_5","type":"reflection","label":"對師長同儕禮貌欠佳","text":"對師長同儕禮貌欠佳"},{"id":"br_srv_1","type":"service","label":"超過07:40未打卡","text":"超過07:40未打卡（留班補打掃）"},{"id":"br_srv_2","type":"service","label":"個人座位周遭整潔不佳","text":"個人座位周遭整潔不佳"},{"id":"br_srv_3","type":"service","label":"打掃責任區未落實","text":"打掃責任區未落實"},{"id":"br_srv_4","type":"service","label":"忘記抽屜與置物櫃清空","text":"忘記抽屜與置物櫃清空"},{"id":"br_srv_5","type":"service","label":"公物使用後未歸位","text":"公物使用後未歸位"}],"contactBook":{"date":"2026-11-20","homeworkItems":[],"reminders":[],"queenMotto":"👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"},"contactBookHistory":{},"attendance":{},"homework":[],"pointLogs":[],"announcements":[{"id":1,"title":"五年二班班親會將於本週五晚間隆重召開","content":"歡迎全體皇親國戚（各位家長）蒞臨王國議政廳，共同研商小兵成長大計！","date":"2026-11-12","important":true},{"id":2,"title":"下週即將迎來王國期中學力大評量","content":"請全體小兵大臣調養精神、溫故知新，發揮平素所學爭取至高榮譽！","date":"2026-11-10","important":false}],"rewardCards":[{"id":"rc_1","title":"榮譽免死金牌 (免罰卡)","cost":30,"icon":"🛡️","desc":"可抵銷一次未帶學用品或遲到愛班服務登記","category":"special"},{"id":"rc_2","title":"一日皇家座位特權卡","cost":45,"icon":"💺","desc":"可自主挑選一日心儀王位（需經導師核可）","category":"privilege"},{"id":"rc_3","title":"御膳房優先盛飯令","cost":20,"icon":"🍱","desc":"享有當日午餐第一順位盛飯與加菜特權","category":"item"},{"id":"rc_4","title":"御花園特別免差役令","cost":25,"icon":"🧹","desc":"可免除一日外掃或教室值日生職務","category":"privilege"},{"id":"rc_5","title":"宮廷圖書館自由閱覽證","cost":15,"icon":"📚","desc":"午休或早自習可至班級圖書角借閱傳奇秘笈","category":"study"},{"id":"rc_6","title":"國王特赦奏章豁免卷","cost":50,"icon":"📜","desc":"可減免一項指定短篇日常作業（不含段考與作文）","category":"special"}],"rewardRedemptions":[],"behaviorCards":{},"trafficOverrides":{},"seatingLayout":{"rows":5,"cols":6},"seatingChart":[22,21,16,11,6,1,24,23,17,12,7,2,26,25,18,13,8,3,null,27,19,14,9,4,null,null,20,15,10,5],"lastModified":1795175485119,"satietyResetV20261116":true,"petDefaultDogV20261116":true,"seatingColsV20261117":true,"updatedAt":"2026-11-19T13:47:02.078Z","realRosterV20261119":true,"pointActionHistory":[]};

class KingdomStore {
  applyMasterRosterBackup() {
    try {
      this.recordLocalSnapshot("載入五年二班電腦主存檔前快照");
    } catch (_) {}
    // 密碼保護鎖：先保存導師現有的自訂密碼
    const currentPass = (this.data && this.data.queenPassword) || 
      (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password')) || 
      "queen";
    
    // 核心安全保全：保全現有名冊中超過 27 號的大臣（如導師或手機手動新增之第 28 號大臣）
    const extraStudents = [];
    if (this.data && Array.isArray(this.data.students)) {
      this.data.students.forEach(st => {
        if (st && (Number(st.seatNo) > 27 || (st.id && !MASTER_ROSTER_BACKUP_20261119.students.some(m => m.id === st.id || m.seatNo === st.seatNo)))) {
          extraStudents.push(JSON.parse(JSON.stringify(st)));
        }
      });
    }

    const masterCopy = JSON.parse(JSON.stringify(MASTER_ROSTER_BACKUP_20261119));
    extraStudents.forEach(extra => {
      if (!masterCopy.students.some(s => s.seatNo === extra.seatNo || s.id === extra.id)) {
        masterCopy.students.push(extra);
      }
    });
    masterCopy.students.sort((a, b) => (Number(a.seatNo) || 0) - (Number(b.seatNo) || 0));

    masterCopy.lastModified = Math.max(Date.now(), 1795096022078);
    masterCopy.realRosterV20261119 = true;
    if (currentPass && currentPass !== 'queen') {
      masterCopy.queenPassword = currentPass;
    }
    this.data = this.normalizeData(masterCopy);
    if (currentPass && currentPass !== 'queen') {
      this.data.queenPassword = currentPass;
      if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem('xining_custom_queen_password', currentPass); } catch (_) {}
      }
    }
    this.saveInternal({ updateTimestamp: true, triggerPush: false });
    return this.data;
  }

  constructor() {
    this.lastLocalHomeworkEditTime = 0;
    this.data = this.load();
    this.syncAllHomeworkReflectionCards({ saveQuietly: true });
  }

  /**
   * 智能遠端數據雙向融合 (Smart Non-Destructive Merge)
   * 保證跨裝置（平板、手機、電腦）互不覆蓋，作業、點數與簽到完整保留！
   */
  mergeRemoteData(remoteData) {
    if (!remoteData || typeof remoteData !== 'object') return this.data;
    const local = this.data;
    const remote = this.normalizeData(remoteData);
    if (!remote) return local;

    // 1. 密碼保護鎖：永遠尊重自訂密碼
    const localPass = (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password')) || local.queenPassword;
    const finalPassword = (localPass && localPass !== 'queen') ? localPass : (remote.queenPassword || 'queen');

    const rTime = Number(remote.lastModified) || 0;
    const lTime = Number(local.lastModified) || 0;
    const isRemoteNewer = rTime >= lTime;

    // 2. 獎勵卡兌換紀錄智能雙向融合 (撤銷 revoked 與使用 used 狀態具絕對最高不可逆權限，絕不倒退回 pending！)
    const redMap = new Map();
    const allRedemptions = [
      ...(remote.rewardRedemptions || []),
      ...(local.rewardRedemptions || [])
    ];
    allRedemptions.forEach(r => {
      if (!r || !r.id) return;
      const key = String(r.id);
      if (!redMap.has(key)) {
        redMap.set(key, { ...r });
      } else {
        const existing = redMap.get(key);
        let finalStatus = 'pending';
        let revokedAt = r.revokedAt || existing.revokedAt;
        let usedAt = r.usedAt || existing.usedAt;

        // 規則：revoked > used > pending (跨裝置只要有一端撤銷或核銷，即鎖定為最高不可逆狀態)
        if (r.status === 'revoked' || existing.status === 'revoked') {
          finalStatus = 'revoked';
          if (!revokedAt) revokedAt = getTodayDateString() + ' ' + new Date().toTimeString().slice(0, 5);
        } else if (r.status === 'used' || existing.status === 'used') {
          finalStatus = 'used';
          if (!usedAt) usedAt = getTodayDateString() + ' ' + new Date().toTimeString().slice(0, 5);
        } else if (r.status === 'pending' || existing.status === 'pending') {
          finalStatus = 'pending';
        }

        redMap.set(key, {
          ...existing,
          ...r,
          status: finalStatus,
          revokedAt: revokedAt,
          usedAt: usedAt
        });
      }
    });
    const mergedRedemptions = Array.from(redMap.values());

    // 建立所有已核銷 (used) 與已撤銷 (revoked) 卡牌的 ID 集合，供卡牌抽屜過濾清洗
    const inactiveCardIds = new Set();
    mergedRedemptions.forEach(r => {
      if (r && (r.status === 'used' || r.status === 'revoked') && r.id) {
        inactiveCardIds.add(String(r.id));
      }
    });

    // 3. 學生名冊與點數智能雙向融合 (全方位支援手機/平板/電腦雙向同步、新增大臣如28號、點數自由調度與卡牌抽屜乾淨同步)
    const allStudentsMap = new Map();

    // 先填入本地現有名冊
    (local.students || []).forEach(localSt => {
      if (localSt && (localSt.id !== undefined || localSt.seatNo !== undefined)) {
        allStudentsMap.set(localSt.seatNo || localSt.id, { ...localSt });
      }
    });

    // 融合遠端最新資料 (若遠端有新大臣直接追加，若已有則以遠端最新數值與點數覆寫融合)
    (remote.students || []).forEach(remoteSt => {
      if (!remoteSt || (remoteSt.id === undefined && remoteSt.seatNo === undefined)) return;
      const key = remoteSt.seatNo || remoteSt.id;
      const localSt = allStudentsMap.get(key);

      if (!localSt) {
        // 本地沒有的全新大臣（例如手機新增的第28號大臣）：直接完整加入並清洗已撤銷卡牌
        const newSt = JSON.parse(JSON.stringify(remoteSt));
        if (Array.isArray(newSt.redeemedCards)) {
          newSt.redeemedCards = newSt.redeemedCards.filter(c => c && c.id && !inactiveCardIds.has(String(c.id)));
        } else {
          newSt.redeemedCards = [];
        }
        allStudentsMap.set(key, newSt);
      } else {
        // 雙方皆有的大臣：優先採納 remote 的點數、生涯累積總額與萌寵設定
        const finalPoints = (remoteSt.points !== undefined && remoteSt.points !== null) ? Number(remoteSt.points) : (Number(localSt.points) || 0);
        let finalLifetime = (remoteSt.lifetimePoints !== undefined && remoteSt.lifetimePoints !== null) ? Number(remoteSt.lifetimePoints) : (Number(localSt.lifetimePoints) || 0);
        if (finalLifetime <= 0 && finalPoints > 0) {
          finalLifetime = finalPoints;
        }
        const finalPets = (remoteSt.pets && remoteSt.pets.length > 0) ? remoteSt.pets : (localSt.pets || [{ type: remoteSt.animalType || localSt.animalType || 'dog' }]);
        const finalSecondPet = remoteSt.secondPetType !== undefined ? remoteSt.secondPetType : localSt.secondPetType;
        const finalSecondExp = (remoteSt.secondPetExp !== undefined && remoteSt.secondPetExp !== null) ? Number(remoteSt.secondPetExp) : (Number(localSt.secondPetExp) || 0);

        // 卡牌抽屜清洗：採用較新端抽屜或本地抽屜，並徹底移除已核銷與已撤銷卡牌
        let baseCards = [];
        if (isRemoteNewer && Array.isArray(remoteSt.redeemedCards)) {
          baseCards = remoteSt.redeemedCards;
        } else if (Array.isArray(localSt.redeemedCards)) {
          baseCards = localSt.redeemedCards;
        } else if (Array.isArray(remoteSt.redeemedCards)) {
          baseCards = remoteSt.redeemedCards;
        }
        const cleanCards = baseCards.filter(c => c && c.id && !inactiveCardIds.has(String(c.id)));

        allStudentsMap.set(key, {
          ...localSt,
          ...remoteSt,
          id: remoteSt.id || localSt.id,
          seatNo: remoteSt.seatNo || localSt.seatNo,
          name: remoteSt.name || localSt.name,
          title: remoteSt.title || localSt.title,
          birthday: remoteSt.birthday || localSt.birthday,
          gender: remoteSt.gender || localSt.gender,
          points: finalPoints,
          lifetimePoints: finalLifetime,
          petExp: finalLifetime,
          animalType: remoteSt.animalType || localSt.animalType || 'dog',
          petType: remoteSt.petType || localSt.petType || 'dog',
          secondPetType: finalSecondPet,
          secondPetExp: finalSecondExp,
          pets: finalPets,
          redeemedCards: cleanCards
        });
      }
    });

    const mergedStudents = Array.from(allStudentsMap.values()).sort((a, b) => (Number(a.seatNo) || 0) - (Number(b.seatNo) || 0));

    // 4. 簽到表按日融合 (多裝置打卡自動合併，不遺漏任何學生)
    const mergedAttendance = { ...(local.attendance || {}) };
    if (remote.attendance && typeof remote.attendance === 'object') {
      Object.keys(remote.attendance).forEach(dateKey => {
        if (!mergedAttendance[dateKey]) {
          mergedAttendance[dateKey] = { ...remote.attendance[dateKey] };
        } else {
          const localDay = mergedAttendance[dateKey];
          const remoteDay = remote.attendance[dateKey];
          const combinedDay = { ...localDay };
          Object.keys(remoteDay).forEach(stKey => {
            if (!combinedDay[stKey] || combinedDay[stKey].status === 'pending') {
              combinedDay[stKey] = remoteDay[stKey];
            } else if (remoteDay[stKey] && remoteDay[stKey].status !== 'pending') {
              combinedDay[stKey] = remoteDay[stKey];
            }
          });
          mergedAttendance[dateKey] = combinedDay;
        }
      });
    }

    // 5. 作業與刪除墓碑 (deletedHomeworkIds) 融合 (徹底阻絕已刪除作業與歷史示範假作業跨裝置起死回生)
    const mergedDeletedHwIds = new Set([
      '1', '2', '3', // 歷史示範假作業 ID 永固封殺
      ...(local.deletedHomeworkIds || []).map(String),
      ...(remote.deletedHomeworkIds || []).map(String)
    ]);

    const isFakeOrDeletedHw = (hw) => {
      if (!hw) return true;
      const idStr = String(hw.id || '');
      if (mergedDeletedHwIds.has(idStr)) return true;
      if (idStr === '1' || idStr === '2' || idStr === '3') return true;
      if (hw.date === '2026-11-16' || hw.dueDate === '2026-11-16') return true;
      const t = String(hw.title || '').replace(/\s+/g, '');
      const p = String(hw.presetName || '').replace(/\s+/g, '');
      if (t.includes('國語習作第八課') || t.includes('生字造詞隨堂筆記') || t.includes('數學習作P.62') || t.includes('數學習作P62')) return true;
      if (t === '國語習作完成' || t === '國習完成') return true;
      if ((t === '國習' || p === '國習') && (!hw.dueDate || hw.date <= '2026-11-24' || hw.dueDate <= '2026-11-24')) return true;
      return false;
    };

    const hwMap = new Map();
    (local.homework || []).forEach(hw => {
      if (hw && hw.id && !isFakeOrDeletedHw(hw)) hwMap.set(String(hw.id), JSON.parse(JSON.stringify(hw)));
    });
    (remote.homework || []).forEach(rHw => {
      if (!rHw || !rHw.id || isFakeOrDeletedHw(rHw)) return;
      const key = String(rHw.id);
      if (!hwMap.has(key)) {
        hwMap.set(key, JSON.parse(JSON.stringify(rHw)));
      } else {
        const lHw = hwMap.get(key);
        // 核心作業防倒灌鎖：
        // 若本地剛在 6 秒內被手動編輯過，或者本地時間戳較新 (!isRemoteNewer)，本地紀錄具最高優先權！
        const isRecentLocalHwEdit = (this.lastLocalHomeworkEditTime && (Date.now() - this.lastLocalHomeworkEditTime < 6000));
        let combinedRecords = {};
        if (isRecentLocalHwEdit || !isRemoteNewer) {
          // 本地優先：遠端為基底，本地紀錄覆寫遠端紀錄，絕不被舊狀態覆蓋倒灌
          combinedRecords = { ...(rHw.records || {}), ...(lHw.records || {}) };
        } else {
          // 遠端較新：以遠端為準，但若本地紀錄已標為 'submitted' 或 'excellent'，且遠端還是舊的 'pending' 或 'revision'，本地完成狀態絕對不倒退！
          combinedRecords = { ...(lHw.records || {}) };
          const rRecs = rHw.records || {};
          Object.keys(rRecs).forEach(stId => {
            const lStatus = combinedRecords[stId];
            const rStatus = rRecs[stId];
            if ((lStatus === 'submitted' || lStatus === 'excellent') && (rStatus === 'pending' || rStatus === 'revision')) {
              // 保留本地已完成狀態，不被倒灌回未交/需訂正
            } else {
              combinedRecords[stId] = rStatus;
            }
          });
        }
        const mergedSingleHw = (isRecentLocalHwEdit || !isRemoteNewer)
          ? { ...rHw, ...lHw, records: combinedRecords }
          : { ...lHw, ...rHw, records: combinedRecords };
        hwMap.set(key, mergedSingleHw);
      }
    });
    const mergedHomework = Array.from(hwMap.values());

    // 6. 聯絡簿融合
    let mergedContactBook = remote.contactBook;
    if (local.contactBook && remote.contactBook) {
      const localTime = local.contactBook.updatedAt || 0;
      const remoteTime = remote.contactBook.updatedAt || 0;
      if (localTime > remoteTime) {
        mergedContactBook = local.contactBook;
      }
    } else if (local.contactBook) {
      mergedContactBook = local.contactBook;
    }

    // 7. 聯絡簿歷史紀錄
    const mergedCbHistory = { ...(remote.contactBookHistory || {}), ...(local.contactBookHistory || {}) };

    // 8. 歷程日誌融合
    const logMap = new Map();
    (local.pointLogs || []).forEach(l => { if (l && l.id) logMap.set(l.id, l); });
    (remote.pointLogs || []).forEach(l => { if (l && l.id) logMap.set(l.id, l); });
    const mergedPointLogs = Array.from(logMap.values()).sort((a,b) => (b.id || 0) - (a.id || 0)).slice(0, 50);

    const remoteTime = remote.lastModified || 0;
    const localTime = local.lastModified || 0;
    const mergedSeatingLayout = (remoteTime >= localTime) ? (remote.seatingLayout || local.seatingLayout) : (local.seatingLayout || remote.seatingLayout);
    const mergedSeatingChart = (remoteTime >= localTime) ? (remote.seatingChart || local.seatingChart) : (local.seatingChart || remote.seatingChart);

    // 9. 皇室公佈欄公告融合 (保留導師真實發布之公告，不被隨意覆蓋)
    let mergedAnnouncements = local.announcements || remote.announcements || [];
    if (Array.isArray(local.announcements) && Array.isArray(remote.announcements)) {
      const annMap = new Map();
      remote.announcements.forEach(a => { if (a && a.id) annMap.set(a.id, a); });
      local.announcements.forEach(a => { if (a && a.id) annMap.set(a.id, a); });
      mergedAnnouncements = Array.from(annMap.values());
    }

    // 10. 行為卡牌與常規提醒單融合 (雙向融合兩端的自省卡理由與常規提醒單，絕不丟失任何一方新增的提醒)
    const mergedBehaviorCards = {};
    const localBc = local.behaviorCards || {};
    const remoteBc = remote.behaviorCards || {};
    const allBcStudentIds = new Set([...Object.keys(localBc), ...Object.keys(remoteBc)]);

    allBcStudentIds.forEach(id => {
      const l = localBc[id] || {};
      const r = remoteBc[id] || {};

      // 合併提醒單 (根據 slip.id 去重)
      const slipMap = new Map();
      (r.reminderSlips || []).forEach(s => { if (s && s.id) slipMap.set(s.id, s); });
      (l.reminderSlips || []).forEach(s => {
        if (s && s.id) {
          if (!slipMap.has(s.id)) {
            slipMap.set(s.id, s);
          } else {
            const existing = slipMap.get(s.id);
            if (s.status === 'completed' || existing.status === 'completed') {
              existing.status = 'completed';
            }
          }
        }
      });
      const mergedSlips = Array.from(slipMap.values());

      // 合併自省卡 (保留手動自省卡，自動作業自省卡以較新一端為準，避免請假撤銷後被舊資料倒灌復活)
      const primaryRef = isRemoteNewer ? (r.reflectionReasons || []) : (l.reflectionReasons || []);
      const secondaryRef = isRemoteNewer ? (l.reflectionReasons || []).filter(lr => !lr.isAutoHw) : (r.reflectionReasons || []).filter(rr => !rr.isAutoHw);
      const refReasons = [...primaryRef];
      secondaryRef.forEach(sr => {
        if (!refReasons.some(rr => rr.text === sr.text && rr.isAutoHw === sr.isAutoHw && rr.hwId === sr.hwId)) {
          refReasons.push(sr);
        }
      });

      // 合併愛班卡
      const srvReasons = [...(r.serviceReasons || [])];
      (l.serviceReasons || []).forEach(ls => {
        if (!srvReasons.some(rs => rs.text === ls.text)) {
          srvReasons.push(ls);
        }
      });

      const primary = isRemoteNewer ? r : l;
      mergedBehaviorCards[id] = {
        ...primary,
        reminderSlips: mergedSlips,
        reminderCount: mergedSlips.filter(s => s && s.status === 'pending').length,
        reflectionReasons: refReasons,
        reflectionCount: refReasons.length,
        reflectionCard: refReasons.length > 0,
        reflectionReason: refReasons.map(rr => rr.text).join('、'),
        serviceReasons: srvReasons,
        serviceCount: srvReasons.length,
        serviceCard: srvReasons.length > 0,
        serviceReason: srvReasons.map(rs => rs.text).join('、')
      };
    });

    const finalLastModified = Math.max(localTime, remoteTime, Date.now());

    const mergedData = {
      ...(isRemoteNewer ? local : remote),
      ...(isRemoteNewer ? remote : local),
      queenPassword: finalPassword,
      students: mergedStudents,
      attendance: mergedAttendance,
      homework: mergedHomework,
      deletedHomeworkIds: Array.from(mergedDeletedHwIds).slice(-200),
      contactBook: mergedContactBook,
      contactBookHistory: mergedCbHistory,
      pointLogs: mergedPointLogs,
      announcements: mergedAnnouncements,
      rewardRedemptions: mergedRedemptions,
      behaviorCards: mergedBehaviorCards,
      seatingLayout: mergedSeatingLayout,
      seatingChart: mergedSeatingChart,
      lastModified: finalLastModified
    };

    // 在輸出前，以校準後的 mergedRedemptions 對所有大臣執行抽屜雙向核驗
    if (Array.isArray(mergedData.students)) {
      mergedData.students.forEach(st => {
        this.syncStudentCards(st, mergedData);
      });
    }

    return this.normalizeData(mergedData);
  }

  normalizeData(parsed) {
    if (!parsed || typeof parsed !== 'object') return null;

    // --- 導師密碼終身保護鎖 (嚴防被預設值 "queen" 覆蓋) ---
    const localCustomPass = (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password')) || (this.data && this.data.queenPassword);
    if (localCustomPass && localCustomPass !== 'queen') {
      if (!parsed.queenPassword || parsed.queenPassword === 'queen') {
        parsed.queenPassword = localCustomPass;
      }
    }
    if (!parsed.queenPassword) parsed.queenPassword = "queen";
    // 若傳入之資料含有導師自訂密碼（且非預設值），同時同步儲存至獨立雙保險金鑰
    if (parsed.queenPassword && parsed.queenPassword !== 'queen' && typeof localStorage !== 'undefined') {
      try { localStorage.setItem('xining_custom_queen_password', parsed.queenPassword); } catch (_) {}
    }

    if (!parsed.lateThreshold) parsed.lateThreshold = "07:40";
    if (!parsed.pointPresets) parsed.pointPresets = JSON.parse(JSON.stringify(DEFAULT_POINT_PRESETS));
    if (!parsed.homeworkPresets) parsed.homeworkPresets = JSON.parse(JSON.stringify(DEFAULT_HOMEWORK_PRESETS));
    if (!parsed.behaviorReasons || !Array.isArray(parsed.behaviorReasons)) {
      parsed.behaviorReasons = JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_REASONS));
    } else {
      const hasRem = parsed.behaviorReasons.some(r => r && r.type === 'reminder');
      if (!hasRem) {
        DEFAULT_BEHAVIOR_REASONS.filter(r => r.type === 'reminder').forEach(r => parsed.behaviorReasons.push(JSON.parse(JSON.stringify(r))));
      } else {
        parsed.behaviorReasons.forEach(r => {
          if (r && r.type === 'reminder' && (!r.targetCount || isNaN(r.targetCount))) {
            const def = DEFAULT_BEHAVIOR_REASONS.find(d => d.id === r.id);
            r.targetCount = def ? def.targetCount : 50;
          }
        });
      }
    }
    if (!parsed.alarmPresets || !Array.isArray(parsed.alarmPresets) || parsed.alarmPresets.length === 0) {
      parsed.alarmPresets = JSON.parse(JSON.stringify(DEFAULT_ALARM_PRESETS));
    }
    if (!parsed.timerPresets || !Array.isArray(parsed.timerPresets) || parsed.timerPresets.length === 0) {
      parsed.timerPresets = JSON.parse(JSON.stringify(DEFAULT_TIMER_PRESETS));
    }
    if (!parsed.bellSchedule || !Array.isArray(parsed.bellSchedule) || parsed.bellSchedule.length === 0) {
      parsed.bellSchedule = JSON.parse(JSON.stringify(DEFAULT_BELL_SCHEDULE));
    }
    if (!parsed.reminderPresets || !Array.isArray(parsed.reminderPresets) || parsed.reminderPresets.length === 0) {
      parsed.reminderPresets = JSON.parse(JSON.stringify(DEFAULT_REMINDER_PRESETS));
    }

    // --- 聯絡簿純淨全手動模式 (絕不自動生成假作業) ---
    const todayStr = getTodayDateString();
    if (!parsed.contactBook || typeof parsed.contactBook !== 'object') {
      parsed.contactBook = {
        date: todayStr,
        homeworkItems: [],
        reminders: [],
        queenMotto: "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"
      };
    } else {
      if (!Array.isArray(parsed.contactBook.homeworkItems)) parsed.contactBook.homeworkItems = [];
      if (!Array.isArray(parsed.contactBook.reminders)) parsed.contactBook.reminders = [];
      if (!parsed.contactBook.date) parsed.contactBook.date = todayStr;
      if (parsed.contactBook.queenMotto === undefined) {
        parsed.contactBook.queenMotto = "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！";
      }
      // 自動清理舊版預設假作業
      if (parsed.contactBook.homeworkItems.length > 0 && parsed.contactBook.homeworkItems[0] === "1. 國語習作第八課 P.58 ~ P.62") {
        parsed.contactBook.homeworkItems = [];
        parsed.contactBook.reminders = [];
      }
    }

    if (!parsed.contactBookHistory || typeof parsed.contactBookHistory !== 'object') {
      parsed.contactBookHistory = {};
    } else {
      // 清理舊版自動注入的示範假聯絡簿歷史
      ["2026-11-16", "2026-11-13", "2026-11-12"].forEach(fakeDate => {
        const item = parsed.contactBookHistory[fakeDate];
        if (item && Array.isArray(item.homeworkItems) && item.homeworkItems.length > 0) {
          if (item.homeworkItems[0] && (item.homeworkItems[0].includes("國語習作第八課") || item.homeworkItems[0].includes("國語習作第 九 課") || item.homeworkItems[0].includes("國語隨堂造句本"))) {
            delete parsed.contactBookHistory[fakeDate];
          }
        }
      });
    }

    // --- 簽到打卡純淨全手動模式 (絕不自動預設打卡，一律由學生自主按座號打卡或導師手動操作) ---
    if (!parsed.attendance || typeof parsed.attendance !== 'object') {
      parsed.attendance = {};
    } else {
      // 清理舊版本遺留的示範打卡紀錄
      ["2026-11-16", "2026-11-13", "2026-11-12"].forEach(fakeDate => {
        const dayRec = parsed.attendance[fakeDate];
        if (dayRec && typeof dayRec === 'object') {
          if ((dayRec[1] && dayRec[1].checkInTime === '07:21') || (dayRec[1] && dayRec[1].checkInTime === '13:44' && dayRec[2] && dayRec[2].checkInTime === '14:16')) {
            delete parsed.attendance[fakeDate];
          }
        }
      });
    }
    if (!parsed.attendance[todayStr]) {
      parsed.attendance[todayStr] = {};
    }

    // --- 作業批閱純淨全手動模式 (完全由導師自行派發作業與登記，絕不自動生成假作業) ---
    if (!parsed.deletedHomeworkIds || !Array.isArray(parsed.deletedHomeworkIds)) {
      parsed.deletedHomeworkIds = ['1', '2', '3'];
    } else {
      ['1', '2', '3'].forEach(id => {
        if (!parsed.deletedHomeworkIds.includes(id)) parsed.deletedHomeworkIds.push(id);
      });
    }

    const normDeletedHwSet = new Set(parsed.deletedHomeworkIds.map(String));

    const isNormFakeOrDeletedHw = (hw) => {
      if (!hw) return true;
      const idStr = String(hw.id || '');
      if (normDeletedHwSet.has(idStr)) return true;
      if (idStr === '1' || idStr === '2' || idStr === '3') return true;
      if (hw.date === '2026-11-16' || hw.dueDate === '2026-11-16') return true;
      const t = String(hw.title || '').replace(/\s+/g, '');
      const p = String(hw.presetName || '').replace(/\s+/g, '');
      if (t.includes('國語習作第八課') || t.includes('生字造詞隨堂筆記') || t.includes('數學習作P.62') || t.includes('數學習作P62')) return true;
      if (t === '國語習作完成' || t === '國習完成') return true;
      if ((t === '國習' || p === '國習') && (!hw.dueDate || hw.date <= '2026-11-24' || hw.dueDate <= '2026-11-24')) return true;
      return false;
    };

    if (!parsed.homework || !Array.isArray(parsed.homework)) {
      parsed.homework = [];
    } else {
      // 清理舊版示範假作業與已刪除作業
      parsed.homework = parsed.homework.filter(hw => !isNormFakeOrDeletedHw(hw));
    }

    // --- 集點歷程純淨全手動模式 ---
    if (!parsed.pointLogs || !Array.isArray(parsed.pointLogs)) {
      parsed.pointLogs = [];
    } else {
      parsed.pointLogs = parsed.pointLogs.filter(log => {
        if (!log) return false;
        if (log.id >= 101 && log.id <= 104 && (log.reason === "奏章字跡工整端正" || log.reason === "課堂主動發表演練" || log.reason === "熱心指導同儕算術" || log.reason === "主動協助整理班級圖書")) {
          return false;
        }
        return true;
      });
    }
    if (!parsed.pointActionHistory || !Array.isArray(parsed.pointActionHistory)) parsed.pointActionHistory = [];
    if (!parsed.announcements) parsed.announcements = JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    if (!parsed.rewardCards) parsed.rewardCards = JSON.parse(JSON.stringify(DEFAULT_REWARD_CARDS));
    if (!parsed.rewardRedemptions) parsed.rewardRedemptions = [];
    if (!parsed.behaviorCards || (parsed.behaviorCards[8] && parsed.behaviorCards[8].serviceReason === "遲到" && !parsed.behaviorCards[8].serviceCount)) {
      parsed.behaviorCards = {};
    }
    if (!parsed.trafficOverrides) parsed.trafficOverrides = {};
    if (!parsed.seatingLayout || !parsed.seatingLayout.rows || !parsed.seatingLayout.cols) {
      parsed.seatingLayout = { rows: 5, cols: 6 };
    }
    const totalSeats = parsed.seatingLayout.rows * parsed.seatingLayout.cols;
    if (!parsed.seatingChart || !Array.isArray(parsed.seatingChart)) {
      parsed.seatingChart = [...DEFAULT_SEATING_CHART];
    }
    while (parsed.seatingChart.length < totalSeats) {
      parsed.seatingChart.push(null);
    }
    if (!parsed.lastModified) parsed.lastModified = 0;

    // 確保 27 位大臣全員齊備且動物全面金化與合規
    const ANIMAL_KEYS = ['lion', 'dog', 'cat', 'rabbit', 'bear', 'penguin', 'owl', 'fox', 'hamster'];
    if (!parsed.students || !Array.isArray(parsed.students) || parsed.students.length < 25) {
      parsed.students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS_27));
    } else {
      // 補齊到 27 位大臣
      DEFAULT_STUDENTS_27.forEach(defSt => {
        const found = parsed.students.find(s => s.seatNo === defSt.seatNo || s.id === defSt.id);
        if (!found) {
          parsed.students.push(JSON.parse(JSON.stringify(defSt)));
        }
      });
      parsed.students.sort((a, b) => a.seatNo - b.seatNo);
    }

    // 五年二班真實名冊強制校準 (v20261119：全班 27 位大臣全面升級為「洪永恩、莊淇勛」真實名冊，並精確保留原有累積點數與紀錄)
    if (!parsed.realRosterV20261119 || (parsed.students && parsed.students.some(s => s.name === "王品捷" || s.name === "李宇軒" || s.name === "林冠廷"))) {
      if (Array.isArray(parsed.students)) {
        DEFAULT_STUDENTS_27.forEach((defSt, idx) => {
          const st = parsed.students.find(s => s.seatNo === defSt.seatNo || s.id === defSt.id) || parsed.students[idx];
          if (st) {
            st.name = defSt.name;
            st.title = defSt.title;
            st.gender = defSt.gender;
            st.birthday = defSt.birthday;
          }
        });
        parsed.students.sort((a, b) => a.seatNo - b.seatNo);
      }
      parsed.realRosterV20261119 = true;
      parsed.lastModified = Math.max(parsed.lastModified || 0, Date.now());
    }

    // 寵物飽食度歸零校驗 (v20261116：全班 27 位大臣萌寵飽食度與成長經驗歸零校準標記)
    if (!parsed.satietyResetV20261116) {
      parsed.satietyResetV20261116 = true;
    }

    // 守護萌寵預設全體柴犬校驗 (v20261116：全班 27 位大臣預設守護動物為忠誠柴犬)
    if (!parsed.petDefaultDogV20261116) {
      if (Array.isArray(parsed.students)) {
        parsed.students.forEach(st => {
          st.animalType = "dog";
          st.petType = "dog";
        });
      }
      parsed.petDefaultDogV20261116 = true;
    }

    // 愛班卡與自省卡全體歸零校驗 (v20261117：全班 27 位大臣愛班卡與自省卡全數歸零，待正式啟用後導師手動編輯)
    if (!parsed.behaviorCardsResetV20261117) {
      parsed.behaviorCards = {};
      parsed.behaviorCardsResetV20261117 = true;
    }

    // 座位表最右邊第一排校驗遷移 (v20261117: 最右邊為第一排，向左依序為二、三、四排，最左邊兩排皆為第五排)
    if (!parsed.seatingColsV20261117) {
      if (parsed.seatingChart && (parsed.seatingChart[0] === 1 && parsed.seatingChart[5] === 6)) {
        parsed.seatingChart = [...DEFAULT_SEATING_CHART];
      }
      parsed.seatingColsV20261117 = true;
    }

    // 確保可用金幣與生涯累積總額 (支援導師手動歸零與從 0 累加)
    parsed.students.forEach((st, idx) => {
      // 五年二班性別標準規範：1~13 號為男生 (M)，14~27 號為女生 (F)，嚴防舊快取/雲端歷史殘留錯誤覆蓋
      const seat = Number(st.seatNo || idx + 1);
      if (seat >= 1 && seat <= 13) {
        st.gender = 'M';
      } else if (seat >= 14 && seat <= 27) {
        st.gender = 'F';
      }

      const ptsVal = Math.max(0, parseInt(st.points, 10) || 0);
      st.points = ptsVal;
      let lifeVal = parseInt(st.lifetimePoints, 10);
      if (isNaN(lifeVal) || lifeVal < 0 || (lifeVal <= 0 && ptsVal > 0)) {
        lifeVal = ptsVal;
      }
      st.lifetimePoints = lifeVal;
      st.petExp = lifeVal;

      // 強制將舊神獸 (dragon, unicorn 等) 或空值徹底遷移至柴犬預設
      let a = (st.animalType || st.petType || '').toLowerCase();
      if (!a || a === 'dragon' || a === 'unicorn' || !ANIMAL_DEFINITIONS[a]) {
        a = 'dog';
      }
      st.animalType = a;
      st.petType = a;

      // 確保第二隻守護萌寵結構 (滿 500 點可認養)
      if (st.secondPetType === undefined) st.secondPetType = null;
      if (st.secondPetExp === undefined) st.secondPetExp = Math.max(0, (st.lifetimePoints || 0) - 500);

      // 同步多萌寵防呆結構 (每 500 點可多認養一隻，未達標自動裁切超額認養)
      this.syncStudentPets(st);

      // 同步卡牌抽屜結構 (存放已兌換卡牌)
      this.syncStudentCards(st, parsed);

      // 確保行為卡結構
      if (!parsed.behaviorCards[st.id]) {
        parsed.behaviorCards[st.id] = {
          reflectionCard: false,
          reflectionCount: 0,
          reflectionReason: '',
          reflectionReasons: [],
          serviceCard: false,
          serviceCount: 0,
          serviceReason: '',
          serviceReasons: [],
          reminderSlips: [],
          reminderCount: 0,
          history: []
        };
      } else {
        const b = parsed.behaviorCards[st.id];
        if (b.reflectionReasons && Array.isArray(b.reflectionReasons)) {
          b.reflectionReasons = b.reflectionReasons.filter(r => !(r.isAutoHw && (normDeletedHwSet.has(String(r.hwId)) || String(r.hwId) === '1' || String(r.hwId) === '2' || String(r.hwId) === '3')));
          b.reflectionCount = b.reflectionReasons.length;
          b.reflectionCard = b.reflectionCount > 0;
          b.reflectionReason = b.reflectionReasons.map(r => r.text).join('、');
        }
        if (!Array.isArray(b.reminderSlips)) {
          b.reminderSlips = [];
        }
        b.reminderCount = b.reminderSlips.filter(s => s && s.status === 'pending').length;
      }
    });

    return parsed;
  }

  load() {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = this.normalizeData(parsed);
        if (normalized) return normalized;
      }
    } catch (e) {
      console.warn("讀取本機資料失敗，載入預設值", e);
    }

    const localSavedPass = (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password')) || "queen";
    return this.normalizeData({
      queenPassword: localSavedPass,
      lateThreshold: "07:40",
      students: JSON.parse(JSON.stringify(DEFAULT_STUDENTS_27)),
      attendance: {},
      homework: [],
      deletedHomeworkIds: ['1', '2', '3'],
      pointLogs: [],
      pointActionHistory: [],
      announcements: JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENTS)),
      lastModified: 0,
      _isFreshInit: true
    });
  }

  /**
   * 核心儲存邏輯 (支援靜默儲存與本機快照)
   */
  saveInternal({ updateTimestamp = true, triggerPush = true, snapshotReason = '' } = {}) {
    try {
      if (updateTimestamp) {
        this.data.lastModified = Date.now();
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        if (snapshotReason) {
          this.recordLocalSnapshot(snapshotReason);
        }
      }
      if (triggerPush && typeof window !== 'undefined' && window.KingdomApp && window.KingdomApp.cloudSync) {
        window.KingdomApp.cloudSync.schedulePush();
      }
    } catch (e) {
      console.error("儲存至 localStorage 失敗", e);
    }
  }

  save(snapshotReason = '') {
    this.saveInternal({ updateTimestamp: true, triggerPush: true, snapshotReason });
  }

  /**
   * 本機滾動式時光機快照 (保留最新 20 次操作)
   */
  recordLocalSnapshot(reason = '操作自動備份') {
    if (typeof localStorage === 'undefined') return;
    // ⚡ 效能極速優化：非同步防抖快照儲存 (Debounced Snapshot)，按鈕響應時間降至 0ms，杜絕同步卡頓
    this._pendingSnapshotReason = reason;
    if (this._snapshotTimer) {
      clearTimeout(this._snapshotTimer);
    }
    this._snapshotTimer = setTimeout(() => {
      this._doRecordLocalSnapshot();
    }, 800);
  }

  _doRecordLocalSnapshot() {
    try {
      const SNAPSHOT_KEY = 'xining_502_kingdom_snapshots';
      let snaps = [];
      const saved = localStorage.getItem(SNAPSHOT_KEY);
      if (saved) {
        try { snaps = JSON.parse(saved); } catch (_) {}
      }
      if (!Array.isArray(snaps)) snaps = [];

      snaps.unshift({
        id: 'snap_' + Date.now(),
        timestamp: Date.now(),
        timeStr: new Date().toLocaleString(),
        reason: this._pendingSnapshotReason || '操作自動備份',
        studentCount: this.data.students ? this.data.students.length : 0,
        data: JSON.parse(JSON.stringify(this.data))
      });

      // 限制快照保留最新 5 份，節省 75% 記憶體與磁碟 I/O，杜絕瀏覽器主線程凍結
      if (snaps.length > 5) snaps = snaps.slice(0, 5);
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snaps));
    } catch (e) {
      console.warn("記錄本機快照失敗", e);
    }
  }

  getLocalSnapshots() {
    if (typeof localStorage === 'undefined') return [];
    try {
      const saved = localStorage.getItem('xining_502_kingdom_snapshots');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  restoreLocalSnapshot(snapshotId) {
    const snaps = this.getLocalSnapshots();
    const target = snaps.find(s => s.id === snapshotId);
    if (!target || !target.data) return { success: false, message: '找不到該快照' };

    this.recordLocalSnapshot('還原前自動備份');
    this.data = this.normalizeData(target.data);
    this.save('還原至快照: ' + (target.timeStr || target.reason));
    return { success: true, count: this.data.students.length };
  }

  reset() {
    const localSavedPass = (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password')) || (this.data && this.data.queenPassword) || "queen";
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.data = {
      queenPassword: localSavedPass,
      lateThreshold: "07:40",
      students: JSON.parse(JSON.stringify(DEFAULT_STUDENTS_27)),
      pointPresets: JSON.parse(JSON.stringify(DEFAULT_POINT_PRESETS)),
      homeworkPresets: JSON.parse(JSON.stringify(DEFAULT_HOMEWORK_PRESETS)),
      behaviorReasons: JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_REASONS)),
      alarmPresets: JSON.parse(JSON.stringify(DEFAULT_ALARM_PRESETS)),
      timerPresets: JSON.parse(JSON.stringify(DEFAULT_TIMER_PRESETS)),
      bellSchedule: JSON.parse(JSON.stringify(DEFAULT_BELL_SCHEDULE)),
      reminderPresets: JSON.parse(JSON.stringify(DEFAULT_REMINDER_PRESETS)),
      contactBook: JSON.parse(JSON.stringify(DEFAULT_CONTACT_BOOK)),
      contactBookHistory: {},
      attendance: {},
      homework: [],
      deletedHomeworkIds: ['1', '2', '3'],
      pointLogs: [],
      pointActionHistory: [],
      announcements: JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENTS)),
      rewardCards: JSON.parse(JSON.stringify(DEFAULT_REWARD_CARDS)),
      rewardRedemptions: [],
      behaviorCards: {},
      trafficOverrides: {},
      seatingLayout: { rows: 5, cols: 6 },
      seatingChart: [...DEFAULT_SEATING_CHART],
      lastModified: Date.now()
    };
    this.save();
  }

  // --- 教室座位表 (自訂格局與學生座位) ---
  getSeatingLayout() {
    if (!this.data.seatingLayout || !this.data.seatingLayout.rows || !this.data.seatingLayout.cols) {
      this.data.seatingLayout = { rows: 5, cols: 6 };
    }
    return this.data.seatingLayout;
  }

  setSeatingLayout(rows, cols) {
    const r = Math.max(2, Math.min(10, parseInt(rows, 10) || 5));
    const c = Math.max(2, Math.min(10, parseInt(cols, 10) || 6));
    this.data.seatingLayout = { rows: r, cols: c };
    const total = r * c;
    let chart = this.data.seatingChart || [];
    if (chart.length < total) {
      while (chart.length < total) chart.push(null);
    } else if (chart.length > total) {
      chart = chart.slice(0, total);
    }
    this.data.seatingChart = chart;
    this.save();
    return this.data.seatingLayout;
  }

  getSeatingChart() {
    const layout = this.getSeatingLayout();
    const total = layout.rows * layout.cols;
    if (!this.data.seatingChart || !Array.isArray(this.data.seatingChart)) {
      this.data.seatingChart = [...DEFAULT_SEATING_CHART];
    }
    while (this.data.seatingChart.length < total) {
      this.data.seatingChart.push(null);
    }
    return this.data.seatingChart;
  }

  swapSeats(fromIdx, toIdx) {
    const chart = this.getSeatingChart();
    if (fromIdx < 0 || fromIdx >= chart.length || toIdx < 0 || toIdx >= chart.length) return false;
    const temp = chart[fromIdx];
    chart[fromIdx] = chart[toIdx];
    chart[toIdx] = temp;
    this.save();
    return true;
  }

  setSeatStudent(idx, studentSeatNo) {
    const chart = this.getSeatingChart();
    if (idx < 0 || idx >= chart.length) return false;
    const targetSeatNo = studentSeatNo === null ? null : parseInt(studentSeatNo, 10);
    // 若該座號已在別的座位，進行交換
    if (targetSeatNo !== null) {
      const existingIdx = chart.indexOf(targetSeatNo);
      if (existingIdx !== -1 && existingIdx !== idx) {
        chart[existingIdx] = chart[idx];
      }
    }
    chart[idx] = targetSeatNo;
    this.save();
    return true;
  }

  randomizeSeats() {
    const layout = this.getSeatingLayout();
    const total = layout.rows * layout.cols;
    const activeSeatNos = this.data.students.map(s => s.seatNo);
    for (let i = activeSeatNos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeSeatNos[i], activeSeatNos[j]] = [activeSeatNos[j], activeSeatNos[i]];
    }
    const newChart = new Array(total).fill(null);
    for (let i = 0; i < total; i++) {
      if (i < activeSeatNos.length) {
        newChart[i] = activeSeatNos[i];
      }
    }
    this.data.seatingChart = newChart;
    this.save();
    return newChart;
  }

  resetSeatingChart() {
    this.data.seatingLayout = { rows: 5, cols: 6 };
    this.data.seatingChart = [...DEFAULT_SEATING_CHART];
    this.save();
    return this.data.seatingChart;
  }

  clearAllSeats() {
    const layout = this.getSeatingLayout();
    const total = layout.rows * layout.cols;
    this.data.seatingChart = new Array(total).fill(null);
    this.save();
    return this.data.seatingChart;
  }

  assignSeatsInOrder() {
    const layout = this.getSeatingLayout();
    const total = layout.rows * layout.cols;
    if (layout.rows === 5 && layout.cols === 6) {
      this.data.seatingChart = [...DEFAULT_SEATING_CHART];
      this.save();
      return this.data.seatingChart;
    }
    const chart = new Array(total).fill(null);
    const seatNos = this.data.students.map(s => s.seatNo).sort((a, b) => a - b);
    for (let i = 0; i < total && i < seatNos.length; i++) {
      chart[i] = seatNos[i];
    }
    this.data.seatingChart = chart;
    this.save();
    return chart;
  }

  removeStudentFromSeat(idx) {
    const chart = this.getSeatingChart();
    if (idx >= 0 && idx < chart.length) {
      chart[idx] = null;
      this.save();
      return true;
    }
    return false;
  }

  // --- 每日聯絡簿按日歷史記錄 (由導師每日填寫更新，系統不自行強加假作業) ---
  getContactBook(dateStr) {
    const targetDate = dateStr || getTodayDateString();
    if (this.data.contactBookHistory && this.data.contactBookHistory[targetDate]) {
      return this.data.contactBookHistory[targetDate];
    }
    // 若該日是當前主要聯絡簿設定的日期，回傳該聯絡簿
    if (this.data.contactBook && this.data.contactBook.date === targetDate) {
      return this.data.contactBook;
    }
    // 若查詢今日且尚未存入歷史，使用目前最新導師儲存之聯絡簿
    if (targetDate === getTodayDateString() && this.data.contactBook) {
      return {
        ...this.data.contactBook,
        date: targetDate
      };
    }
    // 若該特定日期尚未建立，返回純淨空白範本 (不跨日套用，方便多天聯絡簿獨立顯示)
    return {
      date: targetDate,
      homeworkItems: [],
      reminders: [],
      queenMotto: (this.data.contactBook && this.data.contactBook.queenMotto) || "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"
    };
  }

  saveContactBook(dateStr, bookData) {
    const targetDate = dateStr || getTodayDateString();
    if (!this.data.contactBookHistory) this.data.contactBookHistory = {};
    const entry = {
      ...bookData,
      date: targetDate,
      updatedAt: Date.now()
    };
    this.data.contactBookHistory[targetDate] = entry;
    // 無論編輯何日，同時更新當前最新之 contactBook
    this.data.contactBook = entry;
    this.save();
    return entry;
  }

  // --- 大臣名冊批次更新 ---
  batchUpdateNames(nameArray) {
    if (!Array.isArray(nameArray) || nameArray.length === 0) return;
    const maxSeat = 27;
    for (let i = 0; i < maxSeat; i++) {
      const seatNo = i + 1;
      const newName = (nameArray[i] || "").trim();
      const existing = this.data.students.find(s => s.seatNo === seatNo);
      if (existing) {
        if (newName) existing.name = newName;
      } else if (newName) {
        this.data.students.push({
          id: seatNo,
          seatNo: seatNo,
          name: newName,
          gender: "M",
          title: "守護大臣",
          birthday: "0101",
          points: 50,
          lifetimePoints: 0,
          animalType: "dog",
          petType: "dog",
          petExp: 0,
          secondPetType: null,
          secondPetExp: 0
        });
      }
    }
    this.data.students.sort((a, b) => a.seatNo - b.seatNo);
    this.save();
  }

  batchUpdateBirthdays(bdayArray) {
    if (!Array.isArray(bdayArray)) return;
    bdayArray.forEach((bday, idx) => {
      const seatNo = idx + 1;
      const student = this.data.students.find(s => s.seatNo === seatNo);
      if (student && bday) {
        student.birthday = String(bday).trim();
      }
    });
    this.save();
  }

  batchUpdateTitles(titleArray) {
    if (!Array.isArray(titleArray)) return;
    titleArray.forEach((title, idx) => {
      const seatNo = idx + 1;
      const student = this.data.students.find(s => s.seatNo === seatNo);
      if (student && title) {
        student.title = String(title).trim();
      }
    });
    this.save();
  }

  batchUpdatePoints(pointsArray) {
    if (!Array.isArray(pointsArray)) return;
    let modifiedCount = 0;
    pointsArray.forEach((ptsStr, idx) => {
      const seatNo = idx + 1;
      const student = this.data.students.find(s => s.seatNo === seatNo);
      if (student && ptsStr !== undefined && ptsStr !== null && String(ptsStr).trim() !== "") {
        const pts = Math.max(0, parseInt(ptsStr, 10) || 0);
        student.points = pts;
        student.lifetimePoints = pts;
        this.syncStudentPets(student);
        modifiedCount++;
      }
    });
    if (modifiedCount > 0) {
      this.data.pointLogs.unshift({
        id: Date.now(),
        studentId: 'batch_adjust',
        points: 0,
        reason: `導師名冊批次更新蘋果 (${modifiedCount} 位大臣)`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5)
      });
      this.save();
    }
  }

  // --- 萌寵認養上限計算 (0~499顆 1隻，滿500顆 2隻，滿1000顆 3隻，以此類推) ---
  getMaxAllowedPets(lifetimePoints, currentPoints) {
    const p1 = Math.max(0, parseInt(lifetimePoints, 10) || 0);
    const p2 = currentPoints !== undefined ? Math.max(0, parseInt(currentPoints, 10) || 0) : p1;
    const pts = Math.min(p1, p2);
    return 1 + Math.floor(pts / 500);
  }

  // --- 同步與防呆校驗學生萌寵 (支援生涯累積總額歸零與自由調度) ---
  syncStudentPets(student) {
    if (!student) return [];
    let lifetime = parseInt(student.lifetimePoints, 10);
    if (isNaN(lifetime) || lifetime < 0) {
      lifetime = 0;
      student.lifetimePoints = 0;
    }
    student.petExp = lifetime;
    const maxAllowed = 1 + Math.floor(lifetime / 500);

    // 初始化 pets 陣列 (至少有一隻預設萌寵)
    if (!Array.isArray(student.pets)) {
      student.pets = [];
      const p1 = (student.animalType || student.petType || 'dog').toLowerCase();
      student.pets.push({ type: ANIMAL_DEFINITIONS[p1] ? p1 : 'dog' });
      if (student.secondPetType && ANIMAL_DEFINITIONS[student.secondPetType.toLowerCase()]) {
        student.pets.push({ type: student.secondPetType.toLowerCase() });
      }
    }

    if (student.pets.length === 0) {
      const p1 = (student.animalType || student.petType || 'dog').toLowerCase();
      student.pets.push({ type: ANIMAL_DEFINITIONS[p1] ? p1 : 'dog' });
    }

    // 核心防呆裁切：若因生涯總額歸零或扣除未達門檻，自動移除超出上限之第二隻或第三隻認養寵物
    // 每 500 點可額外認養一隻 (0~499點 1隻、500~999點 2隻、1000點以上 3隻)
    if (student.pets.length > maxAllowed) {
      student.pets = student.pets.slice(0, maxAllowed);
    }

    // 同步向下相容欄位
    student.animalType = student.pets[0]?.type || 'dog';
    student.petType = student.animalType;
    student.secondPetType = student.pets[1]?.type || null;
    student.secondPetExp = student.secondPetType ? Math.max(0, lifetime - 500) : 0;

    return student.pets;
  }

  syncAllStudentsPets() {
    if (!this.data.students || !Array.isArray(this.data.students)) return;
    this.data.students.forEach(st => this.syncStudentPets(st));
  }

  // --- 卡牌抽屜同步 (管理每位大臣持有的已兌換特權卡) ---
  syncStudentCards(student, dataObj = null) {
    if (!student) return [];
    if (!Array.isArray(student.redeemedCards)) {
      student.redeemedCards = [];
    }
    const data = dataObj || this.data;
    if (data && Array.isArray(data.rewardRedemptions)) {
      // 1. 如果兌換紀錄已被核銷 (used) 或已被撤銷 (revoked)，確保不留在抽屜中 (以 String 強制比對防型別失真)
      const inactiveIds = new Set(
        data.rewardRedemptions
          .filter(r => r && (r.status === 'used' || r.status === 'revoked') && r.id)
          .map(r => String(r.id))
      );
      if (inactiveIds.size > 0) {
        student.redeemedCards = student.redeemedCards.filter(c => c && c.id && !inactiveIds.has(String(c.id)));
      }

      // 2. 將未核銷 (pending) 且未撤銷之卡牌注入抽屜
      data.rewardRedemptions.forEach(r => {
        if (!r || !r.id) return;
        const matchesStudent = (r.studentId !== undefined && (String(r.studentId) === String(student.id) || String(r.studentId) === String(student.seatNo))) ||
                               (r.seatNo !== undefined && String(r.seatNo) === String(student.seatNo));
        if (matchesStudent && r.status !== 'used' && r.status !== 'revoked') {
          const exists = student.redeemedCards.some(c => c && String(c.id) === String(r.id));
          if (!exists) {
            const cardDef = (data.rewardCards || []).find(cd => cd && String(cd.id) === String(r.cardId));
            student.redeemedCards.push({
              id: r.id,
              cardId: r.cardId,
              title: r.cardTitle || (cardDef ? cardDef.title : '特權獎勵卡'),
              cost: r.cost !== undefined ? r.cost : (cardDef ? cardDef.cost : 0),
              icon: (cardDef && cardDef.icon) || '🎁',
              desc: (cardDef && cardDef.desc) || '',
              category: (cardDef && cardDef.category) || 'special',
              redeemedAt: (r.date && r.time) ? `${r.date} ${r.time}` : (r.date || '')
            });
          }
        }
      });
    }
    return student.redeemedCards;
  }

  syncAllStudentsCards() {
    if (!this.data.students || !Array.isArray(this.data.students)) return;
    this.data.students.forEach(st => this.syncStudentCards(st));
    this.save();
  }

  // --- 認養或更換萌寵 (slotIndex: 0 為第1隻主寵，1 為第2隻，2 為第3隻...) ---
  adoptPet(studentId, animalType, slotIndex = 0) {
    const student = this.data.students.find(s => s.id == studentId || s.seatNo == studentId);
    if (!student) return false;
    this.syncStudentPets(student);
    const effectivePts = Math.max(0, parseInt(student.lifetimePoints, 10) || parseInt(student.points, 10) || 0);
    const maxAllowed = 1 + Math.floor(effectivePts / 500);
    const slot = parseInt(slotIndex, 10) || 0;
    const reqPts = slot * 500;

    if (slot >= maxAllowed || effectivePts < reqPts) {
      if (typeof alert === 'function') {
        alert(`累積總蘋果需滿 ${reqPts} 顆才可認養第 ${slot + 1} 隻萌寵！目前累積為 ${effectivePts} 顆。`);
      } else {
        console.warn(`累積總蘋果需滿 ${reqPts} 顆才可認養第 ${slot + 1} 隻萌寵！目前累積為 ${effectivePts} 顆。`);
      }
      return false;
    }

    let aKey = (animalType || 'dog').toLowerCase();
    if (aKey === 'dragon') aKey = 'lion';
    if (aKey === 'unicorn') aKey = 'rabbit';
    if (!ANIMAL_DEFINITIONS[aKey]) aKey = 'dog';

    if (slot < student.pets.length) {
      student.pets[slot].type = aKey;
    } else {
      student.pets.push({ type: aKey });
    }

    this.syncStudentPets(student);
    this.save();
    return true;
  }

  // --- 守護動物自選設定 (更換第1隻主寵) ---
  setStudentAnimal(studentId, animalType) {
    return this.adoptPet(studentId, animalType, 0);
  }

  // --- 認養與更換第二隻守護動物 (滿 500 點皇家特權) ---
  adoptSecondPet(studentId, animalType) {
    return this.adoptPet(studentId, animalType, 1);
  }

  setSecondPet(studentId, animalType) {
    return this.adoptPet(studentId, animalType, 1);
  }

  // --- 動物園餵食投餵飼料讓動物長大 (Zoo Feeding) ---
  feedStudentAnimal(studentId, foodAmount = 1, foodName = "🍎 營養蘋果") {
    const pts = parseInt(foodAmount, 10);
    if (isNaN(pts) || pts <= 0) return null;
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (!student) return null;

    if (student.lifetimePoints === undefined) student.lifetimePoints = student.points || 0;
    const aKey = (student.animalType || student.petType || 'lion').toLowerCase();
    const oldStage = getAnimalStatus(aKey, student.lifetimePoints).stageIndex;

    student.points = (student.points || 0) + pts;
    student.lifetimePoints = (student.lifetimePoints || 0) + pts;
    this.syncStudentPets(student);

    const newStatus = getAnimalStatus(aKey, student.lifetimePoints);

    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: student.id,
      points: pts,
      reason: `🍎 動物園投餵飼料：${foodName} (+${pts} 飽食成長)`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });

    this.save();
    return {
      student,
      oldStage,
      newStage: newStatus.stageIndex,
      grewUp: newStatus.stageIndex > oldStage,
      status: newStatus,
      foodName,
      foodAmount: pts
    };
  }

  // --- 加扣點操作記錄器 (支援全班加點與個人加點錯誤復原機制) ---
  recordPointAction(action) {
    if (!this.data.pointActionHistory) this.data.pointActionHistory = [];
    this.data.pointActionHistory.unshift(action);
    if (this.data.pointActionHistory.length > 30) {
      this.data.pointActionHistory = this.data.pointActionHistory.slice(0, 30);
    }
  }

  canUndoPointAction() {
    return Array.isArray(this.data.pointActionHistory) && this.data.pointActionHistory.some(a => !a.undone);
  }

  getLastUndoableAction() {
    if (!Array.isArray(this.data.pointActionHistory)) return null;
    return this.data.pointActionHistory.find(a => !a.undone) || null;
  }

  // --- 全班 27 位大臣一鍵加點 (支援完整復原制度) ---
  awardAllStudents(points, reason = "全班課堂嘉獎") {
    const allIds = this.data.students.map(s => s.id);
    return this.batchAwardMultipleStudents(allIds, points, reason);
  }

  // --- 雙軌金幣制度：單一大臣加點 (自動支援復原制度) ---
  awardSingleStudent(studentId, points, reason = "課堂嘉獎") {
    const res = this.batchAwardMultipleStudents([studentId], points, reason);
    return res && res.length > 0;
  }

  // --- 批次/多選/全班大臣加扣點主函式 (支援加點前快照與 100% 精準復原) ---
  batchAwardMultipleStudents(studentIds, points, reason = "課堂嘉獎") {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return [];
    const pts = parseInt(points, 10);
    if (isNaN(pts)) return [];

    const updatedStudents = [];
    const snapshots = [];

    studentIds.forEach(id => {
      const student = this.data.students.find(s => s.id === id || s.seatNo === id);
      if (student) {
        if (student.lifetimePoints === undefined || student.lifetimePoints === null || isNaN(student.lifetimePoints)) {
          student.lifetimePoints = student.points || 0;
        }
        if (student.lifetimePoints <= 0 && (student.points || 0) > 0) {
          student.lifetimePoints = student.points || 0;
        }

        // 加點前精準快照 (含金幣、總飽食度、第二寵物經驗值)
        snapshots.push({
          studentId: student.id,
          seatNo: student.seatNo,
          name: student.name,
          pointsBefore: student.points || 0,
          lifetimeBefore: student.lifetimePoints || 0,
          secondPetExpBefore: student.secondPetExp || 0
        });

        if (pts > 0) {
          student.points = (student.points || 0) + pts;
          student.lifetimePoints = (student.lifetimePoints || 0) + pts;
          this.syncStudentPets(student);
        } else {
          student.points = Math.max(0, (student.points || 0) + pts);
        }
        updatedStudents.push(student);
      }
    });

    if (updatedStudents.length > 0) {
      const isAll = updatedStudents.length === this.data.students.length;
      const namesStr = isAll 
        ? "全班 27 位大臣" 
        : (updatedStudents.length <= 5 
            ? updatedStudents.map(s => `${String(s.seatNo).padStart(2, '0')}.${s.name}`).join('、')
            : `${updatedStudents.length} 位大臣 (${updatedStudents.slice(0, 3).map(s => s.name).join('、')}等)`);

      const actionId = Date.now();
      const actionTitle = isAll
        ? `全班 27 位大臣 ${pts > 0 ? `+${pts}` : pts} 點 (${reason})`
        : (updatedStudents.length === 1
            ? `${updatedStudents[0].name} ${pts > 0 ? `+${pts}` : pts} 點 (${reason})`
            : `${updatedStudents.length} 位大臣 ${pts > 0 ? `+${pts}` : pts} 點 (${reason})`);

      const action = {
        id: actionId,
        title: actionTitle,
        reason,
        points: pts,
        type: isAll ? 'all' : (updatedStudents.length === 1 ? 'single' : 'batch'),
        targetDesc: namesStr,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5),
        snapshots,
        undone: false
      };

      this.recordPointAction(action);

      this.data.pointLogs.unshift({
        id: actionId,
        actionId: actionId,
        studentId: isAll ? 'all' : (updatedStudents.length === 1 ? updatedStudents[0].id : 'multi'),
        points: pts,
        reason: `${reason} 【對象：${namesStr}】`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5)
      });

      this.save();
    }
    return updatedStudents;
  }

  // --- 加點錯誤復原函式 (Undo Point Action) ---
  undoPointAction(actionId = null) {
    if (!this.data.pointActionHistory || this.data.pointActionHistory.length === 0) {
      return { success: false, message: "目前沒有可復原的加點操作記錄！" };
    }

    let action = null;
    if (actionId) {
      action = this.data.pointActionHistory.find(a => a.id == actionId && !a.undone);
    } else {
      action = this.data.pointActionHistory.find(a => !a.undone);
    }

    if (!action) {
      return { success: false, message: "找不到可復原的操作或該操作先前已被復原過！" };
    }

    let restoredCount = 0;
    if (Array.isArray(action.snapshots)) {
      action.snapshots.forEach(snap => {
        const student = this.data.students.find(s => s.id === snap.studentId || s.seatNo === snap.seatNo);
        if (student) {
          student.points = snap.pointsBefore;
          student.lifetimePoints = snap.lifetimeBefore;
          this.syncStudentPets(student);
          restoredCount++;
        }
      });
    }

    action.undone = true;
    action.undoneAt = new Date().toISOString();

    // 在 pointLogs 中標註原記錄並新增復原沖正記錄
    if (Array.isArray(this.data.pointLogs)) {
      const origLog = this.data.pointLogs.find(l => l.actionId === action.id || l.id === action.id);
      if (origLog) {
        origLog.undone = true;
        if (!origLog.reason.startsWith('[↩️已撤銷]')) {
          origLog.reason = `[↩️已撤銷] ${origLog.reason}`;
        }
      }
      this.data.pointLogs.unshift({
        id: Date.now(),
        actionId: action.id,
        studentId: action.type === 'all' ? 'all' : (action.snapshots.length === 1 ? action.snapshots[0].studentId : 'multi'),
        points: -action.points,
        reason: `↩️ 導師已復原：【${action.title}】(原加扣點已全數沖正)`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5),
        isUndoLog: true
      });
    }

    this.save();
    return {
      success: true,
      action,
      restoredCount,
      message: `成功復原【${action.title}】！已將 ${restoredCount} 位大臣蘋果與成長值精準還原！`
    };
  }

  // --- 撤銷指定的記功簿記錄 (Revoke Point Log) ---
  revokePointLog(logId) {
    if (!Array.isArray(this.data.pointLogs)) return { success: false, message: "無記功簿記錄" };
    const log = this.data.pointLogs.find(l => l.id == logId);
    if (!log) return { success: false, message: "找不到該筆記功紀錄" };
    if (log.undone) return { success: false, message: "此筆紀錄先前已被撤回過！" };

    // 若有 actionId，優先使用完整快照復原
    if (log.actionId && Array.isArray(this.data.pointActionHistory)) {
      const act = this.data.pointActionHistory.find(a => a.id == log.actionId && !a.undone);
      if (act) {
        return this.undoPointAction(log.actionId);
      }
    }

    // 否則進行單純數值反向沖銷
    const delta = parseInt(log.points, 10) || 0;
    let count = 0;
    if (log.studentId === 'all') {
      this.data.students.forEach(st => {
        st.points = Math.max(0, (st.points || 0) - delta);
        if (delta > 0 && st.lifetimePoints !== undefined) {
          st.lifetimePoints = Math.max(0, st.lifetimePoints - delta);
        }
        this.syncStudentPets(st);
        count++;
      });
    } else if (log.studentId === 'batch_adjust' || log.studentId === 'multi') {
      if (Array.isArray(log.batchRecords) && log.batchRecords.length > 0) {
        const perCost = log.cardCost || Math.round(Math.abs(delta) / log.batchRecords.length);
        log.batchRecords.forEach(br => {
          const st = this.data.students.find(s => s.id == br.studentId || s.seatNo == br.studentId);
          if (st) {
            st.points = (st.points || 0) + perCost;
            this.syncStudentPets(st);
            count++;
          }
        });
      }
    } else {
      const st = this.data.students.find(s => s.id == log.studentId || s.seatNo == log.studentId);
      if (st) {
        st.points = Math.max(0, (st.points || 0) - delta);
        if (delta > 0 && st.lifetimePoints !== undefined) {
          st.lifetimePoints = Math.max(0, st.lifetimePoints - delta);
        }
        this.syncStudentPets(st);
        count++;
      }
    }

    log.undone = true;
    if (!log.reason.startsWith('[↩️已撤銷]')) {
      log.reason = `[↩️已撤銷] ${log.reason}`;
    }

    // 檢查是否為特權卡兌換紀錄，若為是，同步從卡牌抽屜與兌換紀錄移除/標記撤銷
    // 註：此處 refundPoints 設為 false，因為上方的 delta 數值沖銷已經將花費的蘋果退還回大臣帳戶
    const isCardRedeem = log.isRedeemCard || (log.reason && log.reason.includes('兌換特權卡'));
    if (isCardRedeem) {
      if (log.studentId === 'batch_adjust' && Array.isArray(log.batchRecords)) {
        log.batchRecords.forEach(br => {
          this.revokeCardRedemption({
            studentId: br.studentId,
            instanceId: br.instanceId,
            cardId: br.cardId,
            refundPoints: false
          });
        });
      } else {
        let fallbackTitle = '';
        const m = log.reason && log.reason.match(/【(.*?)】/);
        if (m) fallbackTitle = m[1];

        this.revokeCardRedemption({
          studentId: log.studentId,
          instanceId: log.cardInstanceId,
          cardId: log.cardId,
          cardTitle: fallbackTitle,
          refundPoints: false
        });
      }
    }

    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: log.studentId,
      points: -delta,
      reason: `↩️ 導師已手動撤銷此筆記功：【${log.reason.replace('[↩️已撤銷] ', '')}】${isCardRedeem ? '（同步自抽屜註銷卡牌）' : ''}`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5),
      isUndoLog: true
    });

    this.save();
    return {
      success: true,
      message: `已成功撤銷該筆紀錄！受影響的大臣蘋果已沖銷還原${isCardRedeem ? '，卡牌亦已自抽屜安全註銷' : ''}。`
    };
  }

  // --- 批次更改金幣與重置功能 ---
  batchAdjustPoints(studentIds, { mode = 'set_both', deltaPoints = 0, targetPoints = 0, targetLifetime = 0, syncLifetime = true, reason = "導師批次調整" } = {}) {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return [];
    const updated = [];

    studentIds.forEach(id => {
      const st = this.data.students.find(s => s.id === id || s.seatNo === id);
      if (!st) return;
      if (st.lifetimePoints === undefined) st.lifetimePoints = st.points || 0;

      if (mode === 'set_both') {
        const target = Math.max(0, parseInt(targetPoints, 10) || 0);
        st.points = target;
        // 生涯蘋果數量從 0 開始累計，並將設定的 target 蘋果數量加進去
        st.lifetimePoints = target;
        st.petExp = target;
      } else if (mode === 'set_points') {
        const target = Math.max(0, parseInt(targetPoints, 10) || 0);
        const oldPts = st.points || 0;
        st.points = target;
        // 核心修復：若原先生涯為 0 或勾選同步，從 0 累計加上這次新增的蘋果數量 (target)！
        // 若原先生涯已有數值且未勾選同步，若有淨增蘋果則自動累加淨增額，確保生涯永遠不低於可用蘋果！
        if (syncLifetime || !st.lifetimePoints || st.lifetimePoints <= 0) {
          st.lifetimePoints = target;
        } else if (target > oldPts) {
          st.lifetimePoints = (st.lifetimePoints || 0) + (target - oldPts);
        }
        st.lifetimePoints = Math.max(target, st.lifetimePoints || 0);
        st.petExp = st.lifetimePoints;
      } else if (mode === 'adjust') {
        const pts = parseInt(deltaPoints, 10) || 0;
        st.points = Math.max(0, (st.points || 0) + pts);
        // 只要是增加蘋果，生涯累積必定累加；若扣蘋果且勾選同步，則同步扣減但最低不為負
        if (pts > 0) {
          st.lifetimePoints = Math.max(0, (st.lifetimePoints || 0) + pts);
        } else if (pts < 0 && syncLifetime) {
          st.lifetimePoints = Math.max(0, (st.lifetimePoints || 0) + pts);
        }
        st.petExp = st.lifetimePoints;
      } else if (mode === 'set_lifetime') {
        const target = Math.max(0, parseInt(targetLifetime, 10) || 0);
        st.lifetimePoints = target;
        st.petExp = target;
      } else if (mode === 'reset_points') {
        st.points = 0;
      } else if (mode === 'reset_lifetime') {
        const target = Math.max(0, parseInt(targetLifetime, 10) || 0);
        st.lifetimePoints = target;
        st.petExp = target;
        st.secondPetType = null;
        st.secondPetExp = 0;
        if (Array.isArray(st.pets)) st.pets = st.pets.slice(0, 1);
      } else if (mode === 'reset_both') {
        const target = Math.max(0, parseInt(targetPoints, 10) || 0);
        st.points = target;
        st.lifetimePoints = target;
        st.petExp = target;
        st.secondPetType = null;
        st.secondPetExp = 0;
        if (Array.isArray(st.pets)) st.pets = st.pets.slice(0, 1);
      }
      this.syncStudentPets(st);
      updated.push(st);
    });

    if (updated.length > 0) {
      let logPts = 0;
      if (mode === 'adjust') logPts = deltaPoints || 0;
      else if (mode === 'set_points' || mode === 'set_both') logPts = targetPoints || 0;

      let modeDesc = mode;
      if (mode === 'set_both') modeDesc = `同步設定可用與總累計為 ${targetPoints} 顆`;
      else if (mode === 'set_points') modeDesc = `指定可用蘋果為 ${targetPoints} 顆${syncLifetime ? '(同步總累計)' : ''}`;
      else if (mode === 'adjust') modeDesc = `增減 ${deltaPoints} 顆${syncLifetime ? '(同步增減總累計)' : ''}`;
      else if (mode === 'set_lifetime') modeDesc = `指定總累計為 ${targetLifetime} 點`;
      else if (mode === 'reset_points') modeDesc = `可用蘋果歸零`;
      else if (mode === 'reset_lifetime') modeDesc = `總累計總額歸零`;
      else if (mode === 'reset_both') modeDesc = `兩者全部徹底歸零`;

      this.data.pointLogs.unshift({
        id: Date.now(),
        studentId: updated.length === 1 ? updated[0].id : 'batch_adjust',
        points: logPts,
        reason: `${reason} 【${modeDesc}，${updated.length} 位大臣】`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5)
      });
      this.save('批次調度大臣點數');
    }
    return updated;
  }

  batchResetPoints(targetPoints = 0, clearLogs = false, resetLifetime = true) {
    const pts = Math.max(0, parseInt(targetPoints, 10) || 0);
    this.data.students.forEach(s => {
      s.points = pts;
      if (resetLifetime) {
        s.lifetimePoints = pts;
        s.petExp = pts;
        s.secondPetType = null;
        s.secondPetExp = 0;
        if (Array.isArray(s.pets)) s.pets = s.pets.slice(0, 1);
      }
      this.syncStudentPets(s);
    });
    if (clearLogs) {
      this.data.pointLogs = [];
    }
    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: 'batch_adjust',
      points: pts,
      reason: `導師批次重置全班大臣點數為 ${pts} 顆${resetLifetime ? '（生涯總額同步歸零重設）' : ''}`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    this.save('批次重置全班點數');
  }

  resetSingleStudentPoints(studentId, targetPoints = 0) {
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (student) {
      const pts = Math.max(0, parseInt(targetPoints, 10) || 0);
      student.points = pts;
      student.lifetimePoints = pts;
      this.syncStudentPets(student);
      this.save();
    }
  }

  // --- 導師自由設定/更改個別大臣金幣數量 ---
  setStudentPoints(studentId, targetPoints, reason = "導師調整蘋果") {
    const student = this.data.students.find(s => s.id == studentId || s.seatNo == studentId);
    if (!student) return null;
    const oldPoints = student.points || 0;
    const newPts = Math.max(0, parseInt(targetPoints, 10) || 0);
    const diff = newPts - oldPoints;
    student.points = newPts;
    student.lifetimePoints = newPts; // 導師修正誤植，生涯累積立即同步校正為該數值！
    this.syncStudentPets(student); // 自動防呆裁切超出上限之認養寵物
    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: student.id,
      points: diff,
      reason: `${reason} 【蘋果設為 ${newPts} 顆 (原 ${oldPoints} 顆)】`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    this.save();
    return student;
  }

  // --- 全班萌寵飽食度全數歸零 ---
  resetAllPetsSatiety() {
    this.data.students.forEach(st => {
      st.lifetimePoints = 0;
      st.pets = [{ type: st.animalType || 'dog' }];
      this.syncStudentPets(st);
    });
    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: 'all',
      points: 0,
      reason: '🍎 導師指令：全班萌寵飽食度全數歸零 (重返幼幼期)',
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    this.save();
    return true;
  }

  // --- 加點快捷項目管理 ---
  addPointPreset({ type = 'plus', label, points, icon = '💡' }) {
    if (!label) return false;
    if (!this.data.pointPresets) this.data.pointPresets = [...DEFAULT_POINT_PRESETS];
    const newId = 'p_' + Date.now();
    const pts = parseInt(points, 10) || (type === 'minus' ? -1 : 2);
    this.data.pointPresets.push({
      id: newId,
      type: type === 'minus' ? 'minus' : 'plus',
      label: String(label).trim(),
      points: pts,
      icon: icon || (type === 'minus' ? '⚠️' : '💡')
    });
    this.save('新增加扣點快捷: ' + label);
    return true;
  }

  updatePointPreset(id, data) {
    if (!this.data.pointPresets) return false;
    const item = this.data.pointPresets.find(p => p.id === id);
    if (!item) return false;
    if (data.label) item.label = data.label.trim();
    if (data.points !== undefined) item.points = parseInt(data.points, 10) || 1;
    if (data.icon) item.icon = data.icon.trim();
    if (data.type) item.type = data.type;
    this.save('修改加扣點快捷: ' + item.label);
    return true;
  }

  deletePointPreset(presetId) {
    if (!this.data.pointPresets) return false;
    const found = this.data.pointPresets.find(p => p.id === presetId);
    const name = found ? found.label : presetId;
    this.data.pointPresets = this.data.pointPresets.filter(p => p.id !== presetId);
    this.save('刪除加扣點快捷: ' + name);
    return true;
  }

  resetPointPresets() {
    this.data.pointPresets = JSON.parse(JSON.stringify(DEFAULT_POINT_PRESETS));
    this.save('恢復預設加扣點規則');
    return this.data.pointPresets;
  }

  // --- 課堂作息鐘聲快捷管理 ---
  getAlarmPresets() {
    if (!this.data.alarmPresets || !Array.isArray(this.data.alarmPresets) || this.data.alarmPresets.length === 0) {
      this.data.alarmPresets = JSON.parse(JSON.stringify(DEFAULT_ALARM_PRESETS));
    }
    return this.data.alarmPresets;
  }

  addAlarmPreset({ time, btnText, label, highlight = false }) {
    if (!time) return null;
    if (!this.data.alarmPresets) this.data.alarmPresets = [];
    const newPreset = {
      id: 'alarm_pre_' + Date.now(),
      time: String(time).trim(),
      btnText: String(btnText || time).trim(),
      label: String(label || '課堂鐘聲').trim(),
      highlight: !!highlight
    };
    this.data.alarmPresets.push(newPreset);
    this.save('新增作息鐘聲快捷: ' + newPreset.btnText);
    return newPreset;
  }

  updateAlarmPreset(id, { time, btnText, label, highlight }) {
    if (!this.data.alarmPresets) return false;
    const preset = this.data.alarmPresets.find(p => p.id === id);
    if (!preset) return false;
    if (time !== undefined) preset.time = String(time).trim();
    if (btnText !== undefined) preset.btnText = String(btnText).trim();
    if (label !== undefined) preset.label = String(label).trim();
    if (highlight !== undefined) preset.highlight = !!highlight;
    this.save('修改作息鐘聲快捷: ' + preset.btnText);
    return true;
  }

  deleteAlarmPreset(id) {
    if (!this.data.alarmPresets) return false;
    const found = this.data.alarmPresets.find(p => p.id === id);
    const name = found ? found.btnText : id;
    this.data.alarmPresets = this.data.alarmPresets.filter(p => p.id !== id);
    this.save('刪除作息鐘聲快捷: ' + name);
    return true;
  }

  resetAlarmPresets() {
    this.data.alarmPresets = JSON.parse(JSON.stringify(DEFAULT_ALARM_PRESETS));
    this.save('恢復預設作息鐘聲快捷');
    return this.data.alarmPresets;
  }

  // --- 課堂作息時程管理 (下課紅綠燈倒數時程，可編輯、新增、刪除、恢復預設) ---
  getBellSchedule() {
    if (!this.data.bellSchedule || !Array.isArray(this.data.bellSchedule) || this.data.bellSchedule.length === 0) {
      this.data.bellSchedule = JSON.parse(JSON.stringify(DEFAULT_BELL_SCHEDULE));
    }
    return this.data.bellSchedule.slice().sort((a, b) => (a.start || '').localeCompare(b.start || ''));
  }

  addBellScheduleItem({ label, start, end, isBreak = false, targetLabel = '', isBigBreak = false, type = 'class' }) {
    if (!label || !start || !end) return null;
    if (!this.data.bellSchedule) this.data.bellSchedule = [];
    const resolvedIsBreak = Boolean(isBreak);
    const newItem = {
      id: 'sch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      label: String(label).trim(),
      start: String(start).trim(),
      end: String(end).trim(),
      isBreak: resolvedIsBreak,
      targetLabel: String(targetLabel || (resolvedIsBreak ? '上課' : '下課')).trim(),
      targetTime: String(end).trim(),
      isBigBreak: Boolean(isBigBreak),
      type: String(type || (resolvedIsBreak ? 'break' : 'class')).trim()
    };
    this.data.bellSchedule.push(newItem);
    this.save('新增課堂作息時段: ' + newItem.label);
    return newItem;
  }

  updateBellScheduleItem(id, { label, start, end, isBreak, targetLabel, isBigBreak, type }) {
    if (!this.data.bellSchedule) return false;
    const item = this.data.bellSchedule.find(p => p.id === id);
    if (!item) return false;
    if (label !== undefined) item.label = String(label).trim();
    if (start !== undefined) item.start = String(start).trim();
    if (end !== undefined) {
      item.end = String(end).trim();
      item.targetTime = item.end;
    }
    if (isBreak !== undefined) item.isBreak = Boolean(isBreak);
    if (targetLabel !== undefined) item.targetLabel = String(targetLabel).trim();
    if (isBigBreak !== undefined) item.isBigBreak = Boolean(isBigBreak);
    if (type !== undefined) item.type = String(type).trim();
    this.save('修改課堂作息時段: ' + item.label);
    return true;
  }

  deleteBellScheduleItem(id) {
    if (!this.data.bellSchedule) return false;
    const found = this.data.bellSchedule.find(p => p.id === id);
    const name = found ? found.label : id;
    this.data.bellSchedule = this.data.bellSchedule.filter(p => p.id !== id);
    this.save('刪除課堂作息時段: ' + name);
    return true;
  }

  resetBellSchedule() {
    this.data.bellSchedule = JSON.parse(JSON.stringify(DEFAULT_BELL_SCHEDULE));
    this.save('恢復預設課堂作息時程表');
    return this.data.bellSchedule;
  }

  // --- 課堂活動倒數計時情境快捷 ---
  getTimerPresets() {
    if (!this.data.timerPresets || !Array.isArray(this.data.timerPresets) || this.data.timerPresets.length === 0) {
      this.data.timerPresets = JSON.parse(JSON.stringify(DEFAULT_TIMER_PRESETS));
    }
    return this.data.timerPresets;
  }

  addTimerPreset({ label, btnText, seconds }) {
    if (!label) return null;
    if (!this.data.timerPresets) this.data.timerPresets = [];
    const sec = parseInt(seconds, 10) || 300;
    const newPreset = {
      id: 'tm_' + Date.now(),
      label: String(label).trim(),
      btnText: String(btnText || label).trim(),
      seconds: sec
    };
    this.data.timerPresets.push(newPreset);
    this.save('新增活動計時快捷: ' + newPreset.btnText);
    return newPreset;
  }

  updateTimerPreset(id, { label, btnText, seconds }) {
    if (!this.data.timerPresets) return false;
    const preset = this.data.timerPresets.find(p => p.id === id);
    if (!preset) return false;
    if (label !== undefined) preset.label = String(label).trim();
    if (btnText !== undefined) preset.btnText = String(btnText).trim();
    if (seconds !== undefined) preset.seconds = parseInt(seconds, 10) || 300;
    this.save('修改活動計時快捷: ' + preset.btnText);
    return true;
  }

  deleteTimerPreset(id) {
    if (!this.data.timerPresets) return false;
    const found = this.data.timerPresets.find(p => p.id === id);
    const name = found ? found.btnText : id;
    this.data.timerPresets = this.data.timerPresets.filter(p => p.id !== id);
    this.save('刪除活動計時快捷: ' + name);
    return true;
  }

  resetTimerPresets() {
    this.data.timerPresets = JSON.parse(JSON.stringify(DEFAULT_TIMER_PRESETS));
    this.save('恢復預設活動計時快捷');
    return this.data.timerPresets;
  }

  // --- 作業常用快捷範本管理 (新增、編輯、刪除、恢復預設) ---
  addHomeworkPreset({ subject = "國語", name, fullName, defaultDesc = "", defaultDate = null }) {
    if (!name) return null;
    if (!this.data.homeworkPresets) this.data.homeworkPresets = JSON.parse(JSON.stringify(DEFAULT_HOMEWORK_PRESETS));
    const newPreset = {
      id: "hw_pre_" + Date.now(),
      subject: String(subject || "國語").trim(),
      name: String(name).trim(),
      fullName: String(fullName || name).trim(),
      defaultDesc: String(defaultDesc || "").trim(),
      defaultDate
    };
    this.data.homeworkPresets.push(newPreset);
    this.save('新增作業快捷範本: ' + newPreset.name);
    return newPreset;
  }

  updateHomeworkPreset(presetId, { subject, name, fullName, defaultDesc }) {
    if (!this.data.homeworkPresets) return false;
    const preset = this.data.homeworkPresets.find(p => p.id === presetId);
    if (!preset) return false;
    if (subject !== undefined) preset.subject = String(subject).trim();
    if (name !== undefined) preset.name = String(name).trim();
    if (fullName !== undefined) preset.fullName = String(fullName || name).trim();
    if (defaultDesc !== undefined) preset.defaultDesc = String(defaultDesc).trim();
    this.save('修改作業快捷範本: ' + preset.name);
    return true;
  }

  deleteHomeworkPreset(presetId) {
    if (!this.data.homeworkPresets) return false;
    const found = this.data.homeworkPresets.find(p => p.id === presetId);
    const name = found ? found.name : presetId;
    this.data.homeworkPresets = this.data.homeworkPresets.filter(p => p.id !== presetId);
    this.save('刪除作業快捷範本: ' + name);
    return true;
  }

  resetHomeworkPresets() {
    this.data.homeworkPresets = JSON.parse(JSON.stringify(DEFAULT_HOMEWORK_PRESETS));
    this.save('恢復預設作業快捷範本');
    return this.data.homeworkPresets;
  }

  // --- 早自修與重要提醒快捷管理 (新增、編輯、刪除、恢復預設) ---
  getReminderPresets() {
    if (!this.data.reminderPresets || !Array.isArray(this.data.reminderPresets) || this.data.reminderPresets.length === 0) {
      this.data.reminderPresets = JSON.parse(JSON.stringify(DEFAULT_REMINDER_PRESETS));
    }
    return this.data.reminderPresets;
  }

  addReminderPreset({ label, text }) {
    if (!label) return null;
    const presets = this.getReminderPresets();
    const newPreset = {
      id: "rem_pre_" + Date.now(),
      label: String(label).trim(),
      text: String(text || label).trim()
    };
    presets.push(newPreset);
    this.save('新增早自修與提醒快捷: ' + newPreset.label);
    return newPreset;
  }

  updateReminderPreset(id, { label, text }) {
    const presets = this.getReminderPresets();
    const target = presets.find(p => p.id === id);
    if (!target) return false;
    if (label) target.label = String(label).trim();
    if (text !== undefined) target.text = String(text).trim();
    this.save('更新早自修與提醒快捷: ' + target.label);
    return true;
  }

  deleteReminderPreset(id) {
    const presets = this.getReminderPresets();
    const idx = presets.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = presets.splice(idx, 1)[0];
    this.save('刪除早自修與提醒快捷: ' + (removed ? removed.label : id));
    return true;
  }

  resetReminderPresets() {
    this.data.reminderPresets = JSON.parse(JSON.stringify(DEFAULT_REMINDER_PRESETS));
    this.save('恢復預設早自修與提醒快捷');
    return this.data.reminderPresets;
  }

  // --- 常規事由快捷管理 (新增、編輯、刪除、恢復預設) ---
  addBehaviorReason({ type = "reflection", label, text, targetCount }) {
    if (!label) return null;
    if (!this.data.behaviorReasons) this.data.behaviorReasons = JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_REASONS));
    const resolvedType = type === "service" ? "service" : (type === "reminder" ? "reminder" : "reflection");
    const newReason = {
      id: "br_" + Date.now(),
      type: resolvedType,
      label: label.trim(),
      text: (text || label).trim()
    };
    if (resolvedType === 'reminder') {
      newReason.targetCount = parseInt(targetCount, 10) || 50;
    } else if (targetCount !== undefined && targetCount !== null) {
      newReason.targetCount = parseInt(targetCount, 10) || undefined;
    }
    this.data.behaviorReasons.push(newReason);
    this.save('新增常規事由快捷: ' + newReason.label);
    return newReason;
  }

  deleteBehaviorReason(reasonId) {
    if (!this.data.behaviorReasons) return false;
    const found = this.data.behaviorReasons.find(p => p.id === reasonId);
    const name = found ? found.label : reasonId;
    this.data.behaviorReasons = this.data.behaviorReasons.filter(p => p.id !== reasonId);
    this.save('刪除常規事由快捷: ' + name);
    return true;
  }

  updateBehaviorReason(reasonId, { type, label, text, targetCount }) {
    if (!this.data.behaviorReasons) return false;
    const found = this.data.behaviorReasons.find(p => p.id === reasonId);
    if (!found) return false;
    if (type) found.type = type === "service" ? "service" : (type === "reminder" ? "reminder" : "reflection");
    if (label) found.label = label.trim();
    if (text !== undefined) found.text = (text || label).trim();
    if (targetCount !== undefined) {
      found.targetCount = parseInt(targetCount, 10) || (found.type === 'reminder' ? 50 : undefined);
    }
    this.save('修改常規事由快捷: ' + found.label);
    return true;
  }

  resetBehaviorReasons() {
    this.data.behaviorReasons = JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_REASONS));
    this.save('恢復預設常規事由快捷');
    return this.data.behaviorReasons;
  }

  // --- 榮譽卡牌商城與兌換 (兌換只扣除可用點數 points，不扣除 lifetimePoints) ---
  addRewardCard({ title, cost, icon = "🎁", desc = "", category = "item" }) {
    if (!title || !cost) return;
    if (!this.data.rewardCards) this.data.rewardCards = [];
    const newCard = {
      id: "rc_" + Date.now(),
      title: title.trim(),
      cost: parseInt(cost, 10) || 10,
      icon: icon || "🎁",
      desc: desc ? desc.trim() : "",
      category: category || "item"
    };
    this.data.rewardCards.push(newCard);
    this.save();
    return newCard;
  }

  updateRewardCard(cardId, { title, cost, icon, desc, category }) {
    if (!this.data.rewardCards) return;
    const card = this.data.rewardCards.find(c => c.id === cardId);
    if (!card) return;
    if (title) card.title = title.trim();
    if (cost !== undefined) card.cost = parseInt(cost, 10) || card.cost;
    if (icon) card.icon = icon;
    if (desc !== undefined) card.desc = desc.trim();
    if (category) card.category = category;
    this.save();
  }

  deleteRewardCard(cardId) {
    if (!this.data.rewardCards) return;
    this.data.rewardCards = this.data.rewardCards.filter(c => c.id !== cardId);
    this.save();
  }

  redeemCard(studentId, cardId) {
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (!student) return { success: false, message: "查無此大臣" };
    const card = (this.data.rewardCards || []).find(c => c.id === cardId);
    if (!card) return { success: false, message: "查無此卡牌" };

    if (student.points < card.cost) {
      return { success: false, message: `蘋果不足！持有：${student.points} 顆，需要：${card.cost} 顆` };
    }

    // 扣除可用蘋果，保留 lifetimePoints！
    student.points -= card.cost;

    // 將已兌換卡牌存放在個人卡牌抽屜（不要求兌換當下立即使用）
    this.syncStudentCards(student);
    const instanceId = 'rc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const redeemedCard = {
      id: instanceId,
      cardId: card.id,
      title: card.title,
      cost: card.cost,
      icon: card.icon || '🎁',
      desc: card.desc || '',
      category: card.category || 'special',
      redeemedAt: getTodayDateString() + ' ' + new Date().toTimeString().slice(0, 5)
    };
    student.redeemedCards.push(redeemedCard);

    if (!this.data.rewardRedemptions) this.data.rewardRedemptions = [];
    const record = {
      id: instanceId,
      studentId: student.id,
      seatNo: student.seatNo,
      studentName: student.name,
      cardId: card.id,
      cardTitle: card.title,
      cost: card.cost,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5),
      status: 'pending' // pending | used
    };
    this.data.rewardRedemptions.unshift(record);

    this.data.pointLogs.unshift({
      id: Date.now() + 1,
      studentId: student.id,
      points: -card.cost,
      reason: `兌換特權卡【${card.title}】（已存入卡牌抽屜）`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5),
      isRedeemCard: true,
      cardInstanceId: instanceId,
      cardId: card.id,
      cardTitle: card.title,
      cardCost: card.cost
    });

    this.save();
    return {
      success: true,
      studentName: student.name,
      cardTitle: card.title,
      card: redeemedCard,
      message: `成功兌換【${card.title}】！已扣除 ${card.cost} 顆可用蘋果並存入卡牌抽屜，隨時可取用！`
    };
  }

  // --- 批次為多位大臣兌換同一種特權卡牌 ---
  batchRedeemCard(studentIds, cardId, { skipInsufficient = true, overdraftAllowed = false } = {}) {
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return { success: false, message: "請至少選擇一位大臣", successful: [], skipped: [] };
    }
    const card = (this.data.rewardCards || []).find(c => c.id === cardId);
    if (!card) return { success: false, message: "查無此獎勵卡牌", successful: [], skipped: [] };

    const successful = [];
    const skipped = [];
    const nowTimeStr = new Date().toTimeString().slice(0, 5);
    const todayStr = getTodayDateString();
    const cost = parseInt(card.cost, 10) || 0;

    if (!this.data.rewardRedemptions) this.data.rewardRedemptions = [];

    studentIds.forEach(id => {
      const student = this.data.students.find(s => s.id === id || s.seatNo === id);
      if (!student) return;

      if ((student.points || 0) < cost) {
        if (!overdraftAllowed && skipInsufficient) {
          skipped.push({ student, points: student.points || 0, required: cost });
          return;
        }
      }

      // 扣除可用蘋果 (保留 lifetimePoints 萌寵成長經驗)
      student.points = Math.max(0, (student.points || 0) - cost);

      this.syncStudentCards(student);
      const instanceId = 'rc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const redeemedCard = {
        id: instanceId,
        cardId: card.id,
        title: card.title,
        cost: card.cost,
        icon: card.icon || '🎁',
        desc: card.desc || '',
        category: card.category || 'special',
        redeemedAt: todayStr + ' ' + nowTimeStr
      };
      student.redeemedCards.push(redeemedCard);

      const record = {
        id: instanceId,
        studentId: student.id,
        seatNo: student.seatNo,
        studentName: student.name,
        cardId: card.id,
        cardTitle: card.title,
        cost: card.cost,
        date: todayStr,
        time: nowTimeStr,
        status: 'pending'
      };
      this.data.rewardRedemptions.unshift(record);
      successful.push({ student, instanceId });
    });

    if (successful.length > 0) {
      this.data.pointLogs.unshift({
        id: Date.now() + 1,
        studentId: successful.length === 1 ? successful[0].student.id : 'batch_adjust',
        points: -(cost * successful.length),
        reason: `批次兌換特權卡【${card.title}】（已發放至 ${successful.length} 位大臣抽屜）`,
        date: todayStr,
        time: nowTimeStr,
        isRedeemCard: true,
        cardId: card.id,
        cardTitle: card.title,
        cardCost: cost,
        batchRecords: successful.map(s => ({
          studentId: s.student.id,
          instanceId: s.instanceId,
          cardId: card.id
        }))
      });
      this.save('大臣批次兌換特權卡牌');
    }

    return {
      success: successful.length > 0,
      cardTitle: card.title,
      cost,
      successful,
      skipped,
      message: `成功為 ${successful.length} 位大臣兌換【${card.title}】！${skipped.length > 0 ? `（${skipped.length} 位大臣因蘋果不足略過）` : ''}`
    };
  }

  // --- 使用大臣已兌換的卡牌 (自抽屜中移除並生效) ---
  useRedeemedCard(studentId, instanceId) {
    const student = this.data.students.find(s => s.id == studentId || s.seatNo == studentId);
    if (!student) return { success: false, message: "查無此大臣" };
    this.syncStudentCards(student);
    if (!Array.isArray(student.redeemedCards) || student.redeemedCards.length === 0) {
      return { success: false, message: "該大臣卡牌抽屜中無可用卡牌" };
    }
    const idx = student.redeemedCards.findIndex(c => c && (String(c.id) === String(instanceId) || String(c.cardId) === String(instanceId)));
    if (idx === -1) {
      return { success: false, message: "卡牌抽屜中查無此卡牌" };
    }
    const usedCard = student.redeemedCards.splice(idx, 1)[0];

    // 同步更新 rewardRedemptions 紀錄狀態為 used
    if (Array.isArray(this.data.rewardRedemptions)) {
      const rec = this.data.rewardRedemptions.find(r => 
        (usedCard && usedCard.id && String(r.id) === String(usedCard.id)) ||
        (r.studentId == student.id && r.cardId == usedCard.cardId && r.status !== 'used') ||
        (r.seatNo == student.seatNo && r.cardId == usedCard.cardId && r.status !== 'used')
      );
      if (rec) {
        rec.status = 'used';
        rec.usedAt = getTodayDateString() + ' ' + new Date().toTimeString().slice(0, 5);
      }
    }

    if (!Array.isArray(this.data.pointLogs)) this.data.pointLogs = [];
    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: student.id,
      points: 0,
      reason: `✨ 使用特權卡【${usedCard.title}】（已自卡牌抽屜移除）`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });

    this.syncStudentCards(student);
    this.save();
    return {
      success: true,
      studentName: student.name,
      cardTitle: usedCard.title,
      usedCard: usedCard,
      message: `【${student.name}】已成功使用【${usedCard.title}】！已自卡牌抽屜中移除。`
    };
  }

  toggleRedemptionStatus(redemptionId) {
    if (!this.data.rewardRedemptions) return;
    const rec = this.data.rewardRedemptions.find(r => r && String(r.id) === String(redemptionId));
    if (rec) {
      rec.status = rec.status === 'used' ? 'pending' : 'used';
      if (rec.status === 'used') {
        rec.usedAt = getTodayDateString() + ' ' + new Date().toTimeString().slice(0, 5);
      } else {
        delete rec.usedAt;
      }
      this.syncAllStudentsCards();
      this.save();
    }
  }

  // --- 撤銷卡牌兌換 (自卡牌抽屜徹底註銷移除、更新兌換清單狀態，並可安全沖正退回可用蘋果) ---
  revokeCardRedemption({ studentId, instanceId, cardId, cardTitle, refundPoints = true, logReason = '' }) {
    let student = null;
    if (studentId) {
      student = (this.data.students || []).find(s => s.id == studentId || s.seatNo == studentId);
    }

    // 1. 在 rewardRedemptions 中尋找對應紀錄並註銷
    let redRecord = null;
    if (Array.isArray(this.data.rewardRedemptions)) {
      if (instanceId) {
        redRecord = this.data.rewardRedemptions.find(r => r && String(r.id) === String(instanceId));
      }
      if (!redRecord && student && (cardId || cardTitle)) {
        redRecord = this.data.rewardRedemptions.find(r => 
          (r.studentId == student.id || r.seatNo == student.seatNo) && 
          r.status !== 'revoked' &&
          (cardId ? (String(r.cardId) === String(cardId) || String(r.id) === String(cardId)) : true) &&
          (cardTitle ? r.cardTitle === cardTitle : true)
        );
      }
    }

    if (redRecord) {
      redRecord.status = 'revoked';
      redRecord.revokedAt = getTodayDateString() + ' ' + new Date().toTimeString().slice(0, 5);
      if (!student && redRecord.studentId) {
        student = (this.data.students || []).find(s => s.id == redRecord.studentId || s.seatNo == redRecord.studentId);
      }
    }

    if (!student && !instanceId) {
      return { success: false, message: "找不到對應的大臣或卡牌紀錄" };
    }

    // 2. 從大臣的卡牌抽屜 (student.redeemedCards) 中安全移除
    let removedCard = null;
    if (student) {
      this.syncStudentCards(student);
      if (Array.isArray(student.redeemedCards) && student.redeemedCards.length > 0) {
        let idx = -1;
        if (instanceId) {
          idx = student.redeemedCards.findIndex(c => c && String(c.id) === String(instanceId));
        }
        if (idx === -1 && redRecord) {
          idx = student.redeemedCards.findIndex(c => c && String(c.id) === String(redRecord.id));
        }
        if (idx === -1 && cardId) {
          idx = student.redeemedCards.findIndex(c => c && (String(c.cardId) === String(cardId) || String(c.id) === String(cardId)));
        }
        if (idx === -1 && cardTitle) {
          idx = student.redeemedCards.findIndex(c => c && c.title === cardTitle);
        }
        if (idx !== -1) {
          removedCard = student.redeemedCards.splice(idx, 1)[0];
        }
      }
      this.syncStudentCards(student);
    }

    const title = (removedCard && removedCard.title) || (redRecord && redRecord.cardTitle) || cardTitle || '特權卡';
    const cost = (removedCard && removedCard.cost !== undefined) 
      ? parseInt(removedCard.cost, 10) 
      : ((redRecord && redRecord.cost !== undefined) ? parseInt(redRecord.cost, 10) : 0);

    // 3. 若需要退還可用蘋果 (refundPoints)
    if (refundPoints && student && cost > 0) {
      student.points = (student.points || 0) + cost;
      if (!Array.isArray(this.data.pointLogs)) this.data.pointLogs = [];
      this.data.pointLogs.unshift({
        id: Date.now(),
        studentId: student.id,
        points: cost,
        reason: logReason || `↩️ 導師已撤銷兌換特權卡【${title}】（已退還 ${cost} 顆蘋果並自抽屜註銷）`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5),
        isUndoLog: true
      });
    }

    this.save();
    return {
      success: true,
      studentName: student ? student.name : '',
      cardTitle: title,
      refundedPoints: refundPoints ? cost : 0,
      removedCard,
      message: `已成功撤銷【${student ? student.name : '大臣'}】的特權卡【${title}】！${refundPoints && cost > 0 ? `已退還 ${cost} 顆可用蘋果，並自抽屜彻底移除。` : '已自抽屜安全註銷。'}`
    };
  }

  // --- 行為卡牌累計與特赦管理 (座位自省卡、愛班服務卡、常規提醒單) ---
  getReflectionCount(studentId) {
    const b = (this.data.behaviorCards && (this.data.behaviorCards[studentId])) || {};
    return b.reflectionCount !== undefined ? b.reflectionCount : (b.reflectionCard ? 1 : 0);
  }

  getServiceCount(studentId) {
    const b = (this.data.behaviorCards && (this.data.behaviorCards[studentId])) || {};
    return b.serviceCount !== undefined ? b.serviceCount : (b.serviceCard ? 1 : 0);
  }

  getReminderSlipCount(studentId) {
    const b = (this.data.behaviorCards && (this.data.behaviorCards[studentId])) || {};
    if (!Array.isArray(b.reminderSlips)) return 0;
    return b.reminderSlips.filter(s => s && s.status === 'pending').length;
  }

  getStudentReminderSlips(studentId) {
    const b = (this.data.behaviorCards && (this.data.behaviorCards[studentId])) || {};
    return Array.isArray(b.reminderSlips) ? b.reminderSlips : [];
  }

  addReminderSlip(studentId, { reason = "常規提醒", content = "寫字提醒", targetCount = 50 } = {}) {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = {
        reflectionCount: 0,
        serviceCount: 0,
        reflectionReasons: [],
        serviceReasons: [],
        reminderSlips: [],
        reminderCount: 0,
        dismissedHwCards: {}
      };
    }
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.reminderSlips)) b.reminderSlips = [];
    const count = parseInt(targetCount, 10) || 50;
    const slip = {
      id: 'slip_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      reason: String(reason || '常規提醒').trim(),
      content: String(content || reason || '寫字提醒').trim(),
      targetCount: count,
      status: 'pending',
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    };
    b.reminderSlips.push(slip);
    b.reminderCount = b.reminderSlips.filter(s => s && s.status === 'pending').length;
    this.save('新增常規提醒單');
    return slip;
  }

  completeReminderSlip(studentId, slipId) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return;
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.reminderSlips)) return;
    const slip = b.reminderSlips.find(s => s && s.id === slipId);
    if (slip) {
      slip.status = 'completed';
      slip.completedDate = getTodayDateString();
      slip.completedTime = new Date().toTimeString().slice(0, 5);
    }
    b.reminderCount = b.reminderSlips.filter(s => s && s.status === 'pending').length;
    this.save('完成結清提醒單');
  }

  removeReminderSlip(studentId, slipId) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return;
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.reminderSlips)) return;
    const idx = b.reminderSlips.findIndex(s => s && s.id === slipId);
    if (idx !== -1) {
      b.reminderSlips.splice(idx, 1);
    }
    b.reminderCount = b.reminderSlips.filter(s => s && s.status === 'pending').length;
    this.save('刪除常規提醒單');
  }

  // --- 判斷特定學生在某日是否為請假狀態 (支援 student 物件或 ID/座號、多種出缺席鍵名與請假格式) ---
  isStudentOnLeaveOnDate(studentOrId, dateStr) {
    if (!studentOrId || !dateStr || !this.data.attendance) return false;
    const student = typeof studentOrId === 'object'
      ? studentOrId
      : (this.data.students || []).find(s => s.id === studentOrId || s.seatNo === studentOrId);
    if (!student) return false;
    const dayRec = this.data.attendance[dateStr];
    if (!dayRec || typeof dayRec !== 'object') return false;
    const rec = dayRec[student.id] !== undefined ? dayRec[student.id] :
                (dayRec[student.seatNo] !== undefined ? dayRec[student.seatNo] :
                (dayRec[String(student.id)] !== undefined ? dayRec[String(student.id)] : dayRec[String(student.seatNo)]));
    if (!rec) return false;
    return rec.status === 'leave' || rec.status === '請假' || Boolean(rec.leaveType);
  }

  // --- 作業未交自動派發座位自省卡同步 (一項未交自動新增一張自省卡，標示哪項作業；導師手動移除；若學生請假則免自動派發) ---
  syncHomeworkReflectionCards(studentId) {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = {
        reflectionCount: 0,
        reflectionCard: false,
        reflectionReason: '',
        reflectionReasons: [],
        serviceCount: 0,
        serviceCard: false,
        serviceReason: '',
        serviceReasons: [],
        dismissedHwCards: {}
      };
    }
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.reflectionReasons)) b.reflectionReasons = [];
    if (!b.dismissedHwCards || typeof b.dismissedHwCards !== 'object') b.dismissedHwCards = {};

    const student = (this.data.students || []).find(s => s.id === studentId || s.seatNo === studentId);
    if (!student) return;

    const today = getTodayDateString();

    // 找出該學生目前所有未交作業 (pending 或 missing)
    const missingHws = (this.data.homework || []).filter(hw => {
      const rec = (hw.records && (hw.records[student.id] !== undefined ? hw.records[student.id] : hw.records[student.seatNo])) || 'pending';
      return rec === 'pending' || rec === 'missing';
    });

    // 依使用者指示：
    // 若系統偵測到當日沒有交作業的學生是請假的，就不需自動派發自省卡！
    // 檢查條件：作業應交日 (dueDate)、頒布日 (date) 或 今日，該生是否處於請假狀態。
    missingHws.forEach(hw => {
      const hwIdStr = String(hw.id);
      const hwDate = hw.dueDate || hw.date || today;
      const isOnLeave = this.isStudentOnLeaveOnDate(student, hwDate) ||
                        this.isStudentOnLeaveOnDate(student, hw.date) ||
                        this.isStudentOnLeaveOnDate(student, hw.dueDate) ||
                        this.isStudentOnLeaveOnDate(student, today);

      if (isOnLeave) {
        // 請假學生：嚴格豁免！不需自動派發自省卡；若先前已有系統自動產生的該作業自省卡，亦自動予以撤除
        b.reflectionReasons = b.reflectionReasons.filter(r => !(r.isAutoHw && String(r.hwId) === hwIdStr));
      } else {
        const exists = b.reflectionReasons.some(r => r.isAutoHw && String(r.hwId) === hwIdStr);
        const dismissed = b.dismissedHwCards && b.dismissedHwCards[hwIdStr];
        if (!exists && !dismissed) {
          const hwName = hw.title || hw.presetName || '日常作業';
          b.reflectionReasons.push({
            text: `作業未交（${hwName}）`,
            hwId: hwIdStr,
            isAutoHw: true,
            date: today,
            time: new Date().toTimeString().slice(0, 5)
          });
        }
      }
    });

    // 額外保險清理：所有自動作業自省卡中，若其作業應交日或今日該生登記為請假，自動清除
    b.reflectionReasons = b.reflectionReasons.filter(r => {
      if (!r.isAutoHw || !r.hwId) return true;
      const targetHw = (this.data.homework || []).find(h => String(h.id) === String(r.hwId));
      if (!targetHw) return true;
      const hwDate = targetHw.dueDate || targetHw.date || today;
      const isOnLeave = this.isStudentOnLeaveOnDate(student, hwDate) ||
                        this.isStudentOnLeaveOnDate(student, targetHw.date) ||
                        this.isStudentOnLeaveOnDate(student, targetHw.dueDate) ||
                        this.isStudentOnLeaveOnDate(student, today);
      return !isOnLeave;
    });

    // 重新計算累計自省卡數量與事由摘要
    b.reflectionCount = b.reflectionReasons.length;
    b.reflectionCard = b.reflectionCount > 0;
    b.reflectionReason = b.reflectionReasons.map(r => r.text).join('、');
  }

  syncAllHomeworkReflectionCards({ saveQuietly = false } = {}) {
    (this.data.students || []).forEach(st => {
      this.syncHomeworkReflectionCards(st.id);
    });
    if (saveQuietly) {
      this.saveInternal({ updateTimestamp: false, triggerPush: false });
    } else {
      this.save('同步作業自省卡');
    }
  }

  addReflectionCard(studentId, reason = "") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = { reflectionCount: 0, serviceCount: 0, reflectionReasons: [], serviceReasons: [], dismissedHwCards: {} };
    }
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.reflectionReasons)) b.reflectionReasons = [];
    b.reflectionReasons.push({
      text: reason || "課堂座位自省",
      isAutoHw: false,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    b.reflectionCount = b.reflectionReasons.length;
    b.reflectionCard = true;
    b.reflectionReason = b.reflectionReasons.map(r => r.text).join('、');
    this.save();
    return b.reflectionCount;
  }

  // 導師手動移除自省卡一張（由最新一筆移除）
  removeReflectionCardOne(studentId) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return 0;
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.reflectionReasons)) b.reflectionReasons = [];
    if (!b.dismissedHwCards || typeof b.dismissedHwCards !== 'object') b.dismissedHwCards = {};
    if (b.reflectionReasons.length > 0) {
      const removed = b.reflectionReasons.pop();
      if (removed && removed.isAutoHw && removed.hwId) {
        b.dismissedHwCards[String(removed.hwId)] = true;
      }
    }
    b.reflectionCount = b.reflectionReasons.length;
    b.reflectionCard = b.reflectionCount > 0;
    b.reflectionReason = b.reflectionReasons.map(r => r.text).join('、');
    this.save();
    return b.reflectionCount;
  }

  // 導師手動指定索引移除特定自省卡
  removeReflectionReasonByIndex(studentId, index) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return 0;
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.reflectionReasons)) b.reflectionReasons = [];
    if (!b.dismissedHwCards || typeof b.dismissedHwCards !== 'object') b.dismissedHwCards = {};
    if (index >= 0 && index < b.reflectionReasons.length) {
      const [removed] = b.reflectionReasons.splice(index, 1);
      if (removed && removed.isAutoHw && removed.hwId) {
        b.dismissedHwCards[String(removed.hwId)] = true;
      }
    }
    b.reflectionCount = b.reflectionReasons.length;
    b.reflectionCard = b.reflectionCount > 0;
    b.reflectionReason = b.reflectionReasons.map(r => r.text).join('、');
    this.save();
    return b.reflectionCount;
  }

  addServiceCard(studentId, reason = "遲到") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = { reflectionCount: 0, serviceCount: 0, reflectionReasons: [], serviceReasons: [], dismissedHwCards: {} };
    }
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.serviceReasons)) b.serviceReasons = [];
    b.serviceReasons.push({
      text: reason || "遲到",
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    b.serviceCount = b.serviceReasons.length;
    b.serviceCard = true;
    b.serviceReason = b.serviceReasons.map(r => r.text).join('、');
    this.save();
    return b.serviceCount;
  }

  // 導師手動移除愛班卡一張（由最新一筆移除）
  removeServiceCardOne(studentId) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return 0;
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.serviceReasons)) b.serviceReasons = [];
    if (b.serviceReasons.length > 0) {
      b.serviceReasons.pop();
    }
    b.serviceCount = b.serviceReasons.length;
    b.serviceCard = b.serviceCount > 0;
    b.serviceReason = b.serviceReasons.map(r => r.text).join('、');
    this.save();
    return b.serviceCount;
  }

  // 導師手動指定索引移除特定愛班卡
  removeServiceReasonByIndex(studentId, index) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return 0;
    const b = this.data.behaviorCards[studentId];
    if (!Array.isArray(b.serviceReasons)) b.serviceReasons = [];
    if (index >= 0 && index < b.serviceReasons.length) {
      b.serviceReasons.splice(index, 1);
    }
    b.serviceCount = b.serviceReasons.length;
    b.serviceCard = b.serviceCount > 0;
    b.serviceReason = b.serviceReasons.map(r => r.text).join('、');
    this.save();
    return b.serviceCount;
  }

  pardonStudent(studentId, type = "all") {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return;
    const b = this.data.behaviorCards[studentId];
    if (!b.dismissedHwCards || typeof b.dismissedHwCards !== 'object') b.dismissedHwCards = {};
    if (type === 'all' || type === 'reflection') {
      if (Array.isArray(b.reflectionReasons)) {
        b.reflectionReasons.forEach(r => {
          if (r && r.isAutoHw && r.hwId) {
            b.dismissedHwCards[String(r.hwId)] = true;
          }
        });
      }
      b.reflectionCount = 0;
      b.reflectionCard = false;
      b.reflectionReason = "";
      b.reflectionReasons = [];
    }
    if (type === 'all' || type === 'service') {
      b.serviceCount = 0;
      b.serviceCard = false;
      b.serviceReason = "";
      b.serviceReasons = [];
    }
    if (type === 'all' || type === 'reminder') {
      if (Array.isArray(b.reminderSlips)) {
        b.reminderSlips.forEach(s => { if (s) s.status = 'completed'; });
      }
      b.reminderCount = 0;
    }
    this.save();
  }

  pardonAll(type = "all") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    this.data.students.forEach(st => {
      const b = this.data.behaviorCards[st.id] || (this.data.behaviorCards[st.id] = {});
      if (!b.dismissedHwCards || typeof b.dismissedHwCards !== 'object') b.dismissedHwCards = {};
      if (type === 'all' || type === 'reflection') {
        if (Array.isArray(b.reflectionReasons)) {
          b.reflectionReasons.forEach(r => {
            if (r && r.isAutoHw && r.hwId) {
              b.dismissedHwCards[String(r.hwId)] = true;
            }
          });
        }
        b.reflectionCount = 0;
        b.reflectionCard = false;
        b.reflectionReason = "";
        b.reflectionReasons = [];
      }
      if (type === 'all' || type === 'service') {
        b.serviceCount = 0;
        b.serviceCard = false;
        b.serviceReason = "";
        b.serviceReasons = [];
      }
      if (type === 'all' || type === 'reminder') {
        if (Array.isArray(b.reminderSlips)) {
          b.reminderSlips.forEach(s => { if (s) s.status = 'completed'; });
        }
        b.reminderCount = 0;
      }
    });
    this.save();
  }

  // 相容舊函式
  setReflectionCard(studentId, active, reason = "") {
    if (active) {
      this.addReflectionCard(studentId, reason);
    } else {
      this.pardonStudent(studentId, 'reflection');
    }
  }

  setServiceCard(studentId, active, reason = "") {
    if (active) {
      this.addServiceCard(studentId, reason);
    } else {
      this.pardonStudent(studentId, 'service');
    }
  }

  setTrafficOverride(studentId, overrideLight) {
    if (!this.data.trafficOverrides) this.data.trafficOverrides = {};
    if (overrideLight === null || overrideLight === 'auto') {
      delete this.data.trafficOverrides[studentId];
    } else {
      this.data.trafficOverrides[studentId] = overrideLight;
    }
    this.save();
  }

  evaluateTrafficStatus(studentId) {
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (!student) return null;
    const sId = student.id;
    const seatNo = student.seatNo;
    const today = getTodayDateString();
    const att = (this.data.attendance[today] && (this.data.attendance[today][sId] || this.data.attendance[today][seatNo])) || null;

    // 1. 若今日請假：定為請假，則嚴格豁免！絕不頒發愛班卡與自省卡
    if (att && (att.status === 'leave' || att.status === '請假' || Boolean(att.leaveType))) {
      return {
        student,
        light: 'leave',
        label: '🏖️ 請假在府',
        shortReason: '今日請假',
        badgeClass: 'badge-leave',
        cardClass: 'border-slate-300 bg-slate-100/90 text-slate-500',
        desc: '今日告假休養中，免查下課通行',
        hasReflection: false,
        reflectionCount: 0,
        reflectionReason: '',
        hasService: false,
        serviceCount: 0,
        serviceReason: '',
        missingList: [],
        revisionList: [],
        lateList: [],
        isLate: false
      };
    }

    // 2. 自省卡與愛班服務累計判定
    // 自省卡：作業未交自動新增（一項未交自動新增1張，標示哪項作業；當日請假嚴格豁免）＋ 導師手動控制
    const bCard = (this.data.behaviorCards && (this.data.behaviorCards[sId] || this.data.behaviorCards[seatNo])) || {};
    const reflectionCount = this.getReflectionCount(sId);
    const hasReflection = reflectionCount > 0;
    const reflectionReason = bCard.reflectionReason || (bCard.reflectionReasons ? bCard.reflectionReasons.map(r => r.text).join('、') : '');

    // 愛班卡：系統判定打卡遲到自動加入（事由直接為「遲到」）＋ 導師手動控制兩種，實體儲存於 behaviorCards
    const isLateCheckIn = !!(att && att.status === 'late');
    const serviceCount = this.getServiceCount(sId);
    const hasService = serviceCount > 0;
    const serviceReason = bCard.serviceReason || (hasService ? '遲到' : '');

    // 2.5 常規提醒單判定 (常規問題提醒書寫，如聽寫簽名未交*50次)
    const pendingSlips = (Array.isArray(bCard.reminderSlips) ? bCard.reminderSlips : []).filter(s => s && s.status === 'pending');
    const reminderCount = pendingSlips.length;
    const hasReminder = reminderCount > 0;
    const reminderReason = pendingSlips.map(s => `${s.content || s.reason}*${s.targetCount}次`).join('、');

    // 3. 檢查今日各項作業繳交情形 (支援 submitted, late, revision, pending；若作業當日學生請假則豁免不計入未交)
    const missingList = [];
    const revisionList = [];
    const lateList = [];

    (this.data.homework || []).forEach(hw => {
      const rec = (hw.records && (hw.records[seatNo] !== undefined ? hw.records[seatNo] : hw.records[sId])) || 'pending';
      if (rec === 'pending' || rec === 'missing') {
        const hwDate = hw.dueDate || hw.date || today;
        const isOnLeave = this.isStudentOnLeaveOnDate(student, hwDate) ||
                          this.isStudentOnLeaveOnDate(student, hw.date) ||
                          this.isStudentOnLeaveOnDate(student, hw.dueDate);
        if (!isOnLeave) {
          missingList.push(hw);
        }
      } else if (rec === 'revision') {
        revisionList.push(hw);
      } else if (rec === 'late') {
        lateList.push(hw);
      }
    });

    const getShortHwName = (hw) => {
      if (!hw) return '作業';
      if (hw.presetName) return hw.presetName;
      const t = hw.title || '';
      if (t.includes('國語習作') || t.includes('國習')) return '國習';
      if (t.includes('造詞')) return '造詞';
      if (t.includes('生字')) return '生字本';
      if (t.includes('圈詞')) return '圈詞';
      if (t.includes('數學習作') || t.includes('數習')) return '數習';
      if (t.includes('數練') || t.includes('隨堂練習')) return '數練';
      if (t.includes('數作')) return '數作';
      if (t.includes('自然') || t.includes('自習')) return '自習';
      if (t.includes('社會') || t.includes('社習')) return '社習';
      if (t.includes('聯絡簿')) return '聯絡簿';
      return t.length > 5 ? t.slice(0, 4) : t;
    };

    // 老師手動覆寫判斷
    const override = this.data.trafficOverrides && (this.data.trafficOverrides[sId] || this.data.trafficOverrides[seatNo]);
    if (override && override !== 'auto') {
      const isGreen = override === 'green';
      const isYellow = override === 'yellow';
      return {
        student,
        light: override,
        label: isGreen ? '🟢 准許下課' : isYellow ? '🟡 待訂正 (特准)' : '🔴 座位自省 (特准)',
        shortReason: isGreen ? '' : (isYellow ? '導師指定暫緩' : '導師指定自省'),
        badgeClass: isGreen ? 'badge-present' : isYellow ? 'badge-late' : 'badge-leave',
        cardClass: isGreen ? 'traffic-card-green' : isYellow ? 'traffic-card-yellow' : 'traffic-card-red',
        desc: isGreen ? '👑 導師手動特赦准予通行下課！' : (isYellow ? '⚠️ 導師指定暫緩放行' : '🛑 導師指定座位自省'),
        hasReflection,
        reflectionCount,
        reflectionReason,
        hasService,
        serviceCount,
        serviceReason,
        hasReminder,
        reminderCount,
        reminderReason,
        reminderSlips: bCard.reminderSlips || [],
        pendingReminderSlips: pendingSlips,
        missingList,
        revisionList,
        lateList,
        isLate: isLateCheckIn,
        isOverridden: true
      };
    }

    // 依規則嚴格判定：
    // A. 作業未繳交或是上課表現不佳有座位自省卡者 -> 紅燈 (需在座位上反省)
    if (hasReflection || missingList.length > 0) {
      const reasons = [];
      if (bCard.reflectionReasons && bCard.reflectionReasons.length > 0) {
        reasons.push(...bCard.reflectionReasons.map(r => r.text));
      } else if (reflectionReason) {
        reasons.push(reflectionReason);
      } else if (missingList.length > 0) {
        reasons.push(...missingList.map(h => `作業未交（${h.title || h.presetName || '日常作業'}）`));
      }
      if (hasReminder) {
        reasons.push(...pendingSlips.map(s => `提醒單待寫（${s.content || s.reason}*${s.targetCount}次）`));
      }
      const shortReason = reasons.join('、');

      return {
        student,
        light: 'red',
        label: `🔴 紅燈 (${shortReason})`,
        shortReason,
        badgeClass: 'badge-leave',
        cardClass: 'traffic-card-red',
        desc: `🛑 無法下課原因：${shortReason}`,
        hasReflection,
        reflectionCount,
        reflectionReason,
        hasService,
        serviceCount,
        serviceReason,
        hasReminder,
        reminderCount,
        reminderReason,
        reminderSlips: bCard.reminderSlips || [],
        pendingReminderSlips: pendingSlips,
        missingList,
        revisionList,
        lateList,
        isLate: isLateCheckIn
      };
    }

    // B. 若是有待訂正的項目或有未完成提醒單 -> 黃燈 (需先完成訂正或完成提醒單)
    if (revisionList.length > 0 || hasReminder) {
      const yellowReasons = [];
      if (revisionList.length > 0) {
        yellowReasons.push(...revisionList.map(h => `${getShortHwName(h)}訂正未繳交`));
      }
      if (hasReminder) {
        yellowReasons.push(...pendingSlips.map(s => `提醒單待寫（${s.content || s.reason}*${s.targetCount}次）`));
      }
      const shortReason = yellowReasons.join('、');
      return {
        student,
        light: 'yellow',
        label: `🟡 黃燈 (${shortReason})`,
        shortReason,
        badgeClass: 'badge-late',
        cardClass: 'traffic-card-yellow',
        desc: `⚠️ 無法下課原因：${shortReason}，請在座位上完成！`,
        hasReflection: false,
        reflectionCount: 0,
        reflectionReason: '',
        hasService,
        serviceCount,
        serviceReason,
        hasReminder,
        reminderCount,
        reminderReason,
        reminderSlips: bCard.reminderSlips || [],
        pendingReminderSlips: pendingSlips,
        missingList: [],
        revisionList,
        lateList,
        isLate: isLateCheckIn
      };
    }

    // C. 綠燈 (可以下課)
    return {
      student,
      light: 'green',
      label: '🟢 准許下課',
      shortReason: '',
      badgeClass: 'badge-present',
      cardClass: 'traffic-card-green',
      desc: '✨ 作業全齊・表現優良，准予暢行王國！',
      hasReflection: false,
      reflectionCount: 0,
      reflectionReason: '',
      hasService,
      serviceCount,
      serviceReason,
      hasReminder: false,
      reminderCount: 0,
      reminderReason: '',
      reminderSlips: bCard.reminderSlips || [],
      pendingReminderSlips: [],
      missingList: [],
      revisionList,
      lateList,
      isLate: isLateCheckIn
    };
  }
}

const store = new KingdomStore();

// ============================================================================
// 4. 可愛守護動物狀態計算與 SVG 圖繪渲染器 (5階金化神聖期)
// ============================================================================
function getAnimalStatus(animalType, lifetimePoints = 0) {
  let key = (animalType || 'lion').toLowerCase();
  if (key === 'dragon') key = 'lion';
  if (key === 'unicorn') key = 'rabbit';
  const def = ANIMAL_DEFINITIONS[key] || ANIMAL_DEFINITIONS.lion;
  const pts = Math.max(0, parseInt(lifetimePoints, 10) || 0);

  let stageIndex = 0;
  for (let i = def.stages.length - 1; i >= 0; i--) {
    if (pts >= def.stages[i].min) {
      stageIndex = i;
      break;
    }
  }

  const currentStage = def.stages[stageIndex];
  const nextStage = def.stages[stageIndex + 1] || null;
  const nextPoints = nextStage ? nextStage.min : def.stages[def.stages.length - 1].min;
  const prevPoints = currentStage.min;

  let progressPct = 100;
  if (nextStage) {
    const range = nextStage.min - prevPoints;
    const currentInRange = pts - prevPoints;
    progressPct = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  }

  return {
    animalKey: key,
    animalName: def.name,
    animalIcon: def.icon,
    animalColor: def.color,
    stageIndex, // 0 to 4
    stageTitle: currentStage.title,
    stageIcon: currentStage.icon,
    stageDesc: currentStage.desc,
    currentPoints: pts,
    nextThreshold: nextStage ? nextStage.min : null,
    pointsToNext: nextStage ? Math.max(0, nextStage.min - pts) : 0,
    progressPct,
    isGolden: stageIndex === 4
  };
}

// 相容舊函式
function getPetStatus(petType, points) {
  return getAnimalStatus(petType, points);
}

function renderAnimalSVG(animalKey, stage = 0) {
  let key = (animalKey || 'lion').toLowerCase();
  if (key === 'dragon') key = 'lion';
  if (key === 'unicorn') key = 'rabbit';

  const isGolden = stage >= 4;
  const stageNum = Math.min(4, Math.max(0, parseInt(stage, 10) || 0));

  const colorMap = {
    lion: { base: '#f59e0b', dark: '#b45309', light: '#fde68a', accent: '#ef4444' },
    dog: { base: '#f97316', dark: '#c2410c', light: '#ffedd5', accent: '#dc2626' },
    cat: { base: '#a855f7', dark: '#7e22ce', light: '#f3e8ff', accent: '#ec4899' },
    rabbit: { base: '#ec4899', dark: '#be185d', light: '#fce7f3', accent: '#3b82f6' },
    bear: { base: '#92400e', dark: '#713f12', light: '#fef3c7', accent: '#059669' },
    penguin: { base: '#0284c7', dark: '#0369a1', light: '#e0f2fe', accent: '#f59e0b' },
    owl: { base: '#0d9488', dark: '#0f766e', light: '#ccfbf1', accent: '#eab308' },
    fox: { base: '#ea580c', dark: '#9a3412', light: '#ffedd5', accent: '#6366f1' },
    hamster: { base: '#eab308', dark: '#ca8a04', light: '#fef9c3', accent: '#f43f5e' }
  };

  const pal = isGolden ? {
    base: '#f59e0b',
    dark: '#92400e',
    light: '#fef08a',
    accent: '#fbbf24',
    goldGlow: true
  } : (colorMap[key] || colorMap.lion);


  let ears = '';
  let faceDetails = '';
  let accessory = '';

  switch (key) {
    case 'lion':
      ears = `
        <circle cx="80" cy="80" r="54" fill="${isGolden ? '#f59e0b' : '#b45309'}" stroke="${pal.dark}" stroke-width="3" />
        <circle cx="48" cy="48" r="14" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2" />
        <circle cx="112" cy="48" r="14" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2" />
      `;
      faceDetails = `
        <ellipse cx="80" cy="94" rx="18" ry="12" fill="${pal.light}" />
        <polygon points="76,88 84,88 80,94" fill="${pal.dark}" />
        <path d="M76 94 Q80 99 84 94" stroke="${pal.dark}" stroke-width="2" fill="none" />
      `;
      break;
    case 'dog':
      ears = `
        <polygon points="40,65 52,26 72,52" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <polygon points="46,58 54,34 66,50" fill="${pal.light}" />
        <polygon points="120,65 108,26 88,52" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <polygon points="114,58 106,34 94,50" fill="${pal.light}" />
      `;
      faceDetails = `
        <ellipse cx="62" cy="62" rx="4" ry="3" fill="${pal.light}" />
        <ellipse cx="98" cy="62" rx="4" ry="3" fill="${pal.light}" />
        <ellipse cx="80" cy="94" rx="20" ry="14" fill="${pal.light}" />
        <ellipse cx="80" cy="88" rx="6" ry="4" fill="${pal.dark}" />
        <path d="M75 92 Q80 97 85 92" stroke="${pal.dark}" stroke-width="2" fill="none" />
      `;
      break;
    case 'cat':
      ears = `
        <polygon points="42,65 50,28 72,54" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <polygon points="48,58 52,36 66,50" fill="#f472b6" />
        <polygon points="118,65 110,28 88,54" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <polygon points="112,58 108,36 94,50" fill="#f472b6" />
      `;
      faceDetails = `
        <ellipse cx="80" cy="92" rx="14" ry="10" fill="${pal.light}" />
        <polygon points="76,87 84,87 80,92" fill="#ec4899" />
        <line x1="42" y1="88" x2="62" y2="90" stroke="${pal.dark}" stroke-width="2" stroke-linecap="round"/>
        <line x1="42" y1="96" x2="62" y2="94" stroke="${pal.dark}" stroke-width="2" stroke-linecap="round"/>
        <line x1="118" y1="88" x2="98" y2="90" stroke="${pal.dark}" stroke-width="2" stroke-linecap="round"/>
        <line x1="118" y1="96" x2="98" y2="94" stroke="${pal.dark}" stroke-width="2" stroke-linecap="round"/>
      `;
      break;
    case 'rabbit':
      ears = `
        <ellipse cx="58" cy="38" rx="12" ry="32" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" transform="rotate(-10 58 38)" />
        <ellipse cx="58" cy="38" rx="6" ry="24" fill="#f472b6" transform="rotate(-10 58 38)" />
        <ellipse cx="102" cy="38" rx="12" ry="32" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" transform="rotate(10 102 38)" />
        <ellipse cx="102" cy="38" rx="6" ry="24" fill="#f472b6" transform="rotate(10 102 38)" />
      `;
      faceDetails = `
        <ellipse cx="80" cy="94" rx="16" ry="12" fill="${pal.light}" />
        <polygon points="77,88 83,88 80,93" fill="#f43f5e" />
        <path d="M76 93 Q80 97 84 93" stroke="${pal.dark}" stroke-width="2" fill="none" />
      `;
      break;
    case 'bear':
      ears = `
        <circle cx="50" cy="46" r="16" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <circle cx="50" cy="46" r="8" fill="${pal.light}" />
        <circle cx="110" cy="46" r="16" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <circle cx="110" cy="46" r="8" fill="${pal.light}" />
      `;
      faceDetails = `
        <ellipse cx="80" cy="95" rx="22" ry="16" fill="${pal.light}" />
        <ellipse cx="80" cy="88" rx="7" ry="5" fill="${pal.dark}" />
        <path d="M76 93 Q80 97 84 93" stroke="${pal.dark}" stroke-width="2" fill="none" />
      `;
      break;
    case 'penguin':
      ears = `
        <ellipse cx="44" cy="95" rx="10" ry="25" fill="${pal.dark}" transform="rotate(20 44 95)" />
        <ellipse cx="116" cy="95" rx="10" ry="25" fill="${pal.dark}" transform="rotate(-20 116 95)" />
      `;
      faceDetails = `
        <ellipse cx="80" cy="85" rx="28" ry="32" fill="#ffffff" />
        <polygon points="74,86 86,86 80,98" fill="#f59e0b" stroke="#d97706" stroke-width="1.5" />
        <circle cx="56" cy="78" r="6" fill="#fde047" opacity="0.6" />
        <circle cx="104" cy="78" r="6" fill="#fde047" opacity="0.6" />
      `;
      break;
    case 'owl':
      ears = `
        <polygon points="46,55 54,30 70,48" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2" />
        <polygon points="114,55 106,30 90,48" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2" />
      `;
      faceDetails = `
        <circle cx="64" cy="76" r="16" fill="#ffffff" stroke="${pal.dark}" stroke-width="2" />
        <circle cx="96" cy="76" r="16" fill="#ffffff" stroke="${pal.dark}" stroke-width="2" />
        <polygon points="77,84 83,84 80,94" fill="#f59e0b" stroke="#d97706" stroke-width="1.5" />
      `;
      break;
    case 'fox':
      ears = `
        <polygon points="38,62 48,22 72,50" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <polygon points="44,54 50,30 66,46" fill="#ffffff" />
        <polygon points="122,62 112,22 88,50" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2.5" />
        <polygon points="116,54 110,30 94,46" fill="#ffffff" />
      `;
      faceDetails = `
        <polygon points="52,85 80,105 80,85" fill="#ffffff" />
        <polygon points="108,85 80,105 80,85" fill="#ffffff" />
        <ellipse cx="80" cy="88" rx="6" ry="4" fill="${pal.dark}" />
        <path d="M76 93 Q80 97 84 93" stroke="${pal.dark}" stroke-width="2" fill="none" />
      `;
      break;
    case 'hamster':
      ears = `
        <circle cx="50" cy="46" r="13" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2" />
        <circle cx="50" cy="46" r="6" fill="#f472b6" />
        <circle cx="110" cy="46" r="13" fill="${pal.base}" stroke="${pal.dark}" stroke-width="2" />
        <circle cx="110" cy="46" r="6" fill="#f472b6" />
      `;
      faceDetails = `
        <ellipse cx="56" cy="90" rx="14" ry="12" fill="${pal.light}" />
        <ellipse cx="104" cy="90" rx="14" ry="12" fill="${pal.light}" />
        <ellipse cx="80" cy="86" rx="5" ry="3.5" fill="#f43f5e" />
        <path d="M77 91 Q80 95 83 91" stroke="${pal.dark}" stroke-width="2" fill="none" />
        <ellipse cx="80" cy="100" rx="4" ry="7" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" transform="rotate(20 80 100)" />
      `;
      break;
  }

  // 動物園長大體型與飾品配件 (Zoo Growth Scale & Accessories)
  let scaleTransform = '';
  if (stageNum === 0) {
    scaleTransform = 'transform="translate(14, 14) scale(0.82)"';
    accessory = `
      <text x="110" y="130" font-size="24">🍼</text>
      <path d="M68 114 Q80 120 92 114" stroke="#f472b6" stroke-width="4" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="118" r="6" fill="#fbcfe8" stroke="#f472b6" stroke-width="1.5" />
    `;
  } else if (stageNum === 1) {
    scaleTransform = 'transform="translate(6, 6) scale(0.92)"';
    accessory = `
      <text x="110" y="130" font-size="24">🍎</text>
      <path d="M68 114 Q80 122 92 114" stroke="#10b981" stroke-width="5" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="119" r="6" fill="#a7f3d0" stroke="#10b981" stroke-width="1.5" />
    `;
  } else if (stageNum === 2) {
    scaleTransform = '';
    accessory = `
      <text x="110" y="130" font-size="22">✨</text>
      <path d="M60 112 Q80 124 100 112" stroke="${pal.accent}" stroke-width="8" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="120" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
    `;
  } else if (stageNum === 3) {
    scaleTransform = 'transform="translate(-6, -6) scale(1.08)"';
    accessory = `
      <polygon points="62,34 70,44 80,30 90,44 98,34 94,52 66,52" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
      <circle cx="80" cy="33" r="3.5" fill="#ef4444" />
      <path d="M52 110 Q80 130 108 110" stroke="#dc2626" stroke-width="10" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="122" r="8" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
    `;
  } else if (stageNum === 4) {
    scaleTransform = 'transform="translate(-12, -12) scale(1.15)"';
    accessory = `
      <circle cx="80" cy="80" r="76" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="6,4" opacity="0.8" />
      <circle cx="80" cy="80" r="72" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.6" />
      <polygon points="58,26 68,40 80,22 92,40 102,26 98,48 62,48" fill="#fef08a" stroke="#b45309" stroke-width="2" />
      <circle cx="80" cy="24" r="4.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />
      <circle cx="62" cy="28" r="3" fill="#3b82f6" />
      <circle cx="98" cy="28" r="3" fill="#10b981" />
      <text x="25" y="40" font-size="16">✨</text>
      <text x="125" y="40" font-size="16">✨</text>
      <text x="80" y="145" font-size="14">🌟</text>
      <path d="M48 108 Q80 134 112 108" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="124" r="9" fill="#fef08a" stroke="#b45309" stroke-width="2.5" />
    `;
  }

  return `
    <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
      <defs>
        <radialGradient id="animGrad_${key}_${stageNum}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${pal.light}" />
          <stop offset="65%" stop-color="${pal.base}" />
          <stop offset="100%" stop-color="${pal.dark}" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="68" fill="${isGolden ? '#fef9c3' : '#fef3c7'}" opacity="${isGolden ? 0.9 : 0.5}" />
      <g ${scaleTransform}>
        ${ears}
        <circle cx="80" cy="82" r="42" fill="url(#animGrad_${key}_${stageNum})" stroke="${pal.dark}" stroke-width="3" />
        ${faceDetails}
        <circle cx="68" cy="74" r="4.5" fill="#1e293b" />
        <circle cx="69.5" cy="72.5" r="1.5" fill="#ffffff" />
        <circle cx="92" cy="74" r="4.5" fill="#1e293b" />
        <circle cx="93.5" cy="72.5" r="1.5" fill="#ffffff" />
        <circle cx="60" cy="83" r="5" fill="#f43f5e" opacity="0.35" />
        <circle cx="100" cy="83" r="5" fill="#f43f5e" opacity="0.35" />
      </g>
      ${accessory}
    </svg>
  `;
}

function renderPetSVG(petType, stageIndex) {
  return renderAnimalSVG(petType, stageIndex);
}

// 提取原 sound & cloudSync 區塊
class KingdomSound {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    const notes = [440, 554.37, 659.25, 880];
    const times = [0, 0.12, 0.24, 0.38];
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = this.ctx.currentTime + times[i];
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  playCoin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1318.51, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // 動物園餵食可愛咀嚼聲 (Cute Munch & Happy Eating)
  playFeedMunch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const times = [0, 0.09, 0.19];
    const freqs = [380, 520, 880];
    times.forEach((t, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i === 2 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freqs[i], this.ctx.currentTime + t);
      if (i === 2) {
        osc.frequency.exponentialRampToValueAtTime(1150, this.ctx.currentTime + t + 0.15);
      }
      const st = this.ctx.currentTime + t;
      gain.gain.setValueAtTime(0.22, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(st);
      osc.stop(st + 0.13);
    });
  }

  playBreakBell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    // 下課鐘聲旋律 (西敏寺鐘聲片段)
    const notes = [659.25, 523.25, 587.33, 392.00, 392.00, 587.33, 659.25, 523.25];
    const times = [0, 0.35, 0.7, 1.05, 1.5, 1.85, 2.2, 2.55];
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = this.ctx.currentTime + times[i];
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.33);
    });
  }

  // 安靜提醒水晶鈴聲 (柔和清脆空靈)
  playSilenceChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
    const startTime = this.ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

      gain.gain.setValueAtTime(0.2, startTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + i * 0.08 + 2.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + 2.1);
    });
  }

  // 倒數計時最後5秒滴答聲
  playTimerTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 倒數結束歡慶鬧鈴聲
  playTimerAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const delays = [0, 0.14, 0.28, 0.42, 0.65, 0.85];
    const duration = 0.32;
    delays.forEach((delay, idx) => {
      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(melody[idx], startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  // 幸運輪盤/抽籤旋轉音效
  playWheelSpin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950 + Math.random() * 250, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }
}

// ===================================================================
// 5. 跨裝置雲端同步引擎 (Cloud & LAN Synchronizer)
// ===================================================================
function isLocalHostOrLAN(hostname) {
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.protocol === 'file:') return true;
    if (window.location.port !== '') return true;
  }
  if (!hostname) return true;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
  // RFC 1918 私有 IP 與教育網/區網網段 (如台灣中小學 TANet 10.x.x.x 等)
  if (/^10\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/\.local$/.test(hostname)) return true;
  return false;
}

class KingdomCloudSync {
  constructor(store) {
    this.store = store;
    this.configKey = "xining_cloud_sync_config";
    this.config = this.loadConfig();
    this.syncStatus = 'idle'; // 'idle', 'syncing', 'success', 'error'
    this.lastSyncTime = null;
    this.lastError = null;
    this.listeners = [];
    this.pushTimeout = null;
    this.pollInterval = null;
    this.hasCompletedInitialPull = false;
    this.primaryLanIp = '';
    this.lanFailCount = 0;
    this.lanTemporarilyDisabled = false;

    if (typeof window !== 'undefined') {
      this.checkUrlParams();

      // 1. 視窗焦點與分頁切換 (聚焦立即拉取最新，電信網路 4G/5G 秒級喚醒對齊)
      window.addEventListener('focus', () => {
        if (this.config.autoPull && this.config.enabled) {
          this.pull({ silent: true });
        }
      });

      // 2. 手機/平板休眠防護與喚醒對齊 (visibilitychange)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // 螢幕關閉或切換 APP 瞬間，立即衝刺推送本地所有變動，嚴防休眠漏推
          this.flushPush();
        } else if (document.visibilityState === 'visible') {
          // 喚醒瞬間立即拉取遠端最新變動 (強制快取阻斷)
          if (this.config.autoPull && this.config.enabled) {
            this.pull({ silent: true });
          }
        }
      });

      // 3. 瀏覽器離頁與切換防護 (pagehide & beforeunload)
      window.addEventListener('pagehide', () => this.flushPush());
      window.addEventListener('beforeunload', () => this.flushPush());

      // 4. 網路斷線重連 (online)
      window.addEventListener('online', () => {
        this.lanTemporarilyDisabled = false;
        this.lanFailCount = 0;
        if (this.config.enabled) {
          this.pull({ silent: true });
          this.flushPush();
        }
      });

      // 5. 連接本機伺服器 SSE 即時推播 (0.05 秒極速聯動)
      this.connectSse();

      // 6. 同一裝置跨分頁即時聯動 (storage event)
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed && (!parsed.lastModified || parsed.lastModified > (this.store.data.lastModified || 0))) {
              this.store.data = this.store.normalizeData(parsed);
              if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
                window.KingdomUI.refreshCurrentView();
              }
            }
          } catch (_) {}
        }
      });

      // 7. 本機伺服器聯動：載入主機區網 IP 與雙向同步 Google Apps Script 網址
      const isLocalHost = isLocalHostOrLAN(window.location.hostname);
      if (isLocalHost) {
        // 取得主機區網 IP (供手機掃碼專用網址自動轉換 localhost 為區網真實 IP)
        try {
          fetch(this.getLocalApiUrl('/api/network-info'))
            .then(r => r.json())
            .then(info => {
              if (info && info.primaryIp) {
                this.primaryLanIp = info.primaryIp;
                this.notify();
              }
            })
            .catch(() => {});
        } catch (_) {}

        // 與伺服器 cloud_config.json 雙向同步
        try {
          fetch(this.getLocalApiUrl('/api/sync/config'))
            .then(r => r.json())
            .then(data => {
              if (data && data.googleScriptUrl) {
                if (!this.config.googleScriptUrl || this.config.googleScriptUrl !== data.googleScriptUrl) {
                  this.config.googleScriptUrl = data.googleScriptUrl;
                  this.saveConfig(this.config, false);
                  console.log('[CloudSync] 自動自本機伺服器載入 Google 雲端連接網址:', data.googleScriptUrl);
                  // 取得雲端網址後立即進行一次標準雲端拉取，對齊最新 28 位大臣存檔
                  this.pull({ silent: true });
                }
              } else if (this.config.googleScriptUrl) {
                // 本機瀏覽器有但伺服器端沒有，回傳給伺服器保存供全域與後端轉推使用
                fetch(this.getLocalApiUrl('/api/sync/config'), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    googleScriptUrl: this.config.googleScriptUrl,
                    googleAccount: this.config.googleAccount || 'xining502@gmail.com'
                  })
                }).catch(() => {});
              }
            })
            .catch(() => {});
        } catch (_) {}
      }

      // 開機優先拉取 (Pull-First)：載入後立即與伺服器對齊最新資料
      setTimeout(() => {
        this.pull({ silent: true });
      }, 300);
      this.startPolling();
    }
  }

  loadConfig() {
    const defaultCfg = {
      enabled: true,
      googleAccount: "xining502@gmail.com",
      syncKey: "xining502@gmail.com",
      googleScriptUrl: "",
      autoPull: true,
      intervalSec: 25
    };
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.configKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...defaultCfg,
            ...parsed,
            googleAccount: parsed.googleAccount || parsed.syncKey || defaultCfg.googleAccount
          };
        }
      }
    } catch (e) {
      console.warn("讀取雲端同步設定失敗", e);
    }
    return defaultCfg;
  }

  saveConfig(newConfig, syncToServer = true) {
    this.config = { ...this.config, ...newConfig };
    if (this.config.googleAccount) {
      this.config.syncKey = this.config.googleAccount;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.configKey, JSON.stringify(this.config));
      }
    } catch (e) {
      console.error(e);
    }
    // 若在本地環境，同時寫入伺服器端 cloud_config.json
    const isLocal = isLocalHostOrLAN(typeof window !== 'undefined' ? window.location.hostname : '');
    if (isLocal && syncToServer) {
      try {
        fetch(this.getLocalApiUrl('/api/sync/config'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleScriptUrl: this.config.googleScriptUrl || '',
            googleAccount: this.config.googleAccount || 'xining502@gmail.com'
          })
        }).catch(() => {});
      } catch (_) {}
    }
    this.notify();
    this.startPolling();
  }

  checkUrlParams() {
    if (typeof window === 'undefined' || !window.location || !window.location.search) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const googleParam = params.get('google') || params.get('account') || params.get('email') || params.get('sync') || params.get('key');
      const gasParam = params.get('gas') || params.get('script') || params.get('url');
      let changed = false;

      if (googleParam) {
        this.config.googleAccount = googleParam.trim();
        this.config.syncKey = googleParam.trim();
        this.config.enabled = true;
        changed = true;
      }
      if (gasParam) {
        this.config.googleScriptUrl = gasParam.trim();
        changed = true;
      }
      if (changed) {
        this.saveConfig(this.config);
        console.log(`[CloudSync] 網址自動綁定 Google 帳號同步: ${this.config.googleAccount}`);
      }
    } catch (e) {
      console.warn("解析網址同步參數失敗", e);
    }
  }

  getLocalApiUrl(endpoint = '/api/sync') {
    const account = encodeURIComponent(this.config.googleAccount || 'xining502@gmail.com');
    const query = endpoint.includes('?') ? `&account=${account}` : `?account=${account}`;
    if (typeof window !== 'undefined' && window.location && (window.location.protocol === 'file:' || !window.location.host)) {
      return `http://localhost:3000${endpoint}${query}`;
    }
    return `${endpoint}${query}`;
  }

  startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (!this.config.enabled || !this.config.autoPull) return;
    const intervalMs = 25000; // ⚡ 效能優化：優雅巡查間隔 (25秒)，徹底避免過度密集的 5 秒無效輪詢與網路線程卡頓
    this.pollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      this.pull({ silent: true });
    }, intervalMs);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    const status = this.getStatus();
    this.listeners.forEach(cb => {
      try { cb(status); } catch (e) { console.error(e); }
    });
  }

  getStatus() {
    const isLocalHost = isLocalHostOrLAN(typeof window !== 'undefined' ? window.location.hostname : '');

    return {
      status: this.syncStatus,
      lastSyncTime: this.lastSyncTime,
      lastError: this.lastError,
      enabled: this.config.enabled,
      googleAccount: this.config.googleAccount || 'xining502@gmail.com',
      syncKey: this.config.googleAccount || 'xining502@gmail.com',
      googleScriptUrl: this.config.googleScriptUrl || '',
      isLocalHost: isLocalHost,
      lanIp: this.primaryLanIp || (isLocalHost && typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.hostname : '')
    };
  }

  connectSse() {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;
    const isLocal = isLocalHostOrLAN(window.location.hostname);
    if (!isLocal) return;

    try {
      const sseUrl = this.getLocalApiUrl('/api/sync/events');
      const es = new EventSource(sseUrl);
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data && data.type === 'sync_update') {
            // 只要收到伺服器推播廣播，立即秒級拉取刷新！
            this.pull({ silent: true });
          }
        } catch (_) {}
      };
      es.onerror = () => {
        // EventSource 內建自動斷線重連機制
      };
    } catch (_) {}
  }

  flushPush() {
    if (this.pushTimeout) {
      clearTimeout(this.pushTimeout);
      this.pushTimeout = null;
      this.push({ silent: true, force: true });
    }
  }

  schedulePush({ force = false } = {}) {
    if (!this.config.enabled) return;
    if (this.pushTimeout) clearTimeout(this.pushTimeout);
    // 防抖大幅縮短至 150ms，實現幾乎零延遲的極速推送！
    this.pushTimeout = setTimeout(() => {
      this.push({ silent: true, force });
    }, 150);
  }

  async push({ silent = false, force = false } = {}) {
    if (!this.config.enabled) return { success: false, message: '雲端同步未啟用' };

    // 關鍵防舊覆蓋新保護：若裝置剛開機/喚醒且尚未完成首次 Pull，且非使用者直接觸發的操作，優先拉取遠端最新！
    if (!this.hasCompletedInitialPull && !force) {
      await this.pull({ silent: true });
    }

    this.syncStatus = 'syncing';
    this.notify();

    let pushedToAny = false;
    let pushError = null;
    const payload = JSON.stringify(this.store.data);
    const account = this.config.googleAccount || 'xining502@gmail.com';

    // 1. 若運行於本機伺服器、區網或 file:// 模式，推送到 local /api/sync
    const isLocal = isLocalHostOrLAN(typeof window !== 'undefined' ? window.location.hostname : '');
    
    if (isLocal && !this.lanTemporarilyDisabled) {
      try {
        const localController = new AbortController();
        const localTimeout = setTimeout(() => localController.abort(), 3500);
        const localUrl = this.getLocalApiUrl(force ? '/api/sync?force=1' : '/api/sync');
        const localRes = await fetch(localUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          signal: localController.signal
        });
        clearTimeout(localTimeout);

        if (localRes.ok) {
          pushedToAny = true;
          this.lanFailCount = 0;
          this.lanTemporarilyDisabled = false;
          try {
            const resJson = await localRes.json();
            if (resJson && resJson.lastModified) {
              this.store.data.lastModified = resJson.lastModified;
              if (resJson.data) {
                // 接收伺服器智能融合後的最全能版本
                this.store.data = this.store.normalizeData(resJson.data);
              }
              this.store.saveInternal({ updateTimestamp: false, triggerPush: false });
            }
          } catch (_) {}
        } else if (localRes.status === 409) {
          const conflictJson = await localRes.json();
          console.warn('[CloudSync] 伺服器有更新版本，主動觸發 Pull 拉取最新資料！', conflictJson);
          this.syncStatus = 'error';
          this.lastError = conflictJson.message || '伺服器已有更新版本';
          this.notify();
          await this.pull({ silent: false });
          return { success: false, conflict: true, message: this.lastError };
        } else {
          pushError = `伺服器回應狀態 ${localRes.status}`;
        }
      } catch (err) {
        console.warn('[CloudSync] 本地區網推送失敗:', err.message);
      }
    }

    // 2. 若有設定 Google Apps Script Web App 網址，推送到 Google 雲端庫 (電信外網雙向核心)
    if (this.config.googleScriptUrl) {
      try {
        const gasController = new AbortController();
        const gasTimeout = setTimeout(() => gasController.abort(), 8500);
        const postPayload = JSON.stringify({
          account: account,
          data: this.store.data
        });

        await fetch(this.config.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          redirect: 'follow',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: postPayload,
          keepalive: true,
          signal: gasController.signal
        });
        clearTimeout(gasTimeout);
        pushedToAny = true;
      } catch (err) {
        pushError = err.message;
        console.warn('[CloudSync] Google 雲端標準推送失敗:', err.message);

        // 手機/離頁保護：若 Fetch 失敗，嘗試使用 sendBeacon 終極衝刺推送
        try {
          if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const blob = new Blob([JSON.stringify({ account: account, data: this.store.data })], { type: 'text/plain;charset=utf-8' });
            navigator.sendBeacon(this.config.googleScriptUrl, blob);
            pushedToAny = true;
            pushError = null;
          }
        } catch (_) {}
      }
    }

    if (pushedToAny || !pushError) {
      this.syncStatus = 'success';
      this.lastSyncTime = new Date();
      this.lastError = null;
      this.notify();
      return { success: true, timestamp: this.lastSyncTime };
    } else {
      this.syncStatus = 'error';
      this.lastError = pushError || '連線錯誤';
      this.notify();
      return { success: false, error: this.lastError };
    }
  }

  async pull({ silent = false, force = false } = {}) {
    if (!this.config.enabled) return { success: false, message: '雲端同步未啟用' };
    this.syncStatus = 'syncing';
    this.notify();

    const account = this.config.googleAccount || 'xining502@gmail.com';
    let remoteData = null;
    let pullError = null;

    // 1. 優先嘗試 Google Apps Script Web App (跨裝置、跨電信外網 4G/5G 最佳且唯一雙向中繼站)
    if (this.config.googleScriptUrl) {
      try {
        const cacheBust = `_t=${Date.now()}&_r=${Math.random().toString(36).substring(2, 7)}`;
        const sep = this.config.googleScriptUrl.includes('?') ? '&' : '?';
        const gasUrl = `${this.config.googleScriptUrl}${sep}account=${encodeURIComponent(account)}&action=pull&${cacheBust}`;

        const gasController = new AbortController();
        const gasTimeout = setTimeout(() => gasController.abort(), 6500);

        // Safari 友善設計：不傳送 Cache-Control / Pragma 自訂標頭，避免觸發 Google Apps Script 不支援的 OPTIONS 預檢
        const res = await fetch(gasUrl, {
          method: 'GET',
          signal: gasController.signal
        });
        clearTimeout(gasTimeout);

        if (res.ok) {
          const json = await res.json();
          if (json && json.students && Array.isArray(json.students)) {
            remoteData = json;
          }
        }
      } catch (err) {
        pullError = err.name === 'AbortError' ? 'Google 雲端回應逾時 (6.5s)' : err.message;
        console.warn('[CloudSync] Google 雲端標準拉取失敗:', err.message);

        // 若 iPhone/iPad Safari 跨網站追蹤限制導致 Fetch 受阻，自動切換至 Safari JSONP 終極相容通道
        if (!remoteData && typeof window !== 'undefined' && typeof document !== 'undefined') {
          try {
            const jsonpData = await this.pullViaJsonp(this.config.googleScriptUrl, account);
            if (jsonpData && jsonpData.students && Array.isArray(jsonpData.students)) {
              remoteData = jsonpData;
              pullError = null;
              console.log('[CloudSync] ✅ 透過 Safari JSONP 通道成功載入最新雲端存檔！');
            }
          } catch (_) {}
        }
      }
    }

    // 2. 若在本地區網或 file:// 環境且尚未取得遠端資料，從本地 /api/sync 讀取
    const isLocal = isLocalHostOrLAN(typeof window !== 'undefined' ? window.location.hostname : '');

    // 注意：若手機切換至 4G/5G 電信網路，連線 192.168.x.x 會卡死，因此本地拉取設定 2.5 秒嚴格超時
    if (!remoteData && isLocal && !this.lanTemporarilyDisabled) {
      try {
        const localController = new AbortController();
        const localTimeout = setTimeout(() => localController.abort(), 2500);

        const localRes = await fetch(this.getLocalApiUrl(), {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          signal: localController.signal
        });
        clearTimeout(localTimeout);

        if (localRes.ok) {
          const json = await localRes.json();
          if (json && json.students && Array.isArray(json.students)) {
            remoteData = json;
            this.lanFailCount = 0;
            this.lanTemporarilyDisabled = false;
          }
        }
      } catch (err) {
        this.lanFailCount = (this.lanFailCount || 0) + 1;
        // 連續 2 次區網連線失敗/超時，且目前不是本機 localhost，判定手機已離開 Wi-Fi 進入電信外網
        if (this.lanFailCount >= 2 && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          console.warn('[CloudSync] 偵測到手機處於 4G/5G 電信外網環境，暫停區網嘗試，切換為雲端中繼模式');
          this.lanTemporarilyDisabled = true;
          setTimeout(() => { this.lanTemporarilyDisabled = false; }, 30000);
        }
        console.warn('[CloudSync] 本地區網拉取失敗 (若處於電信外網屬正常現象):', err.message);
      }
    }

    // 3. 靜態環境 (GitHub Pages / 靜態託管) 自動拉取同目錄下已被上傳的 data_sync.json
    if (!remoteData && typeof window !== 'undefined' && window.location) {
      try {
        const cacheBuster = `t=${Date.now()}`;
        const staticUrls = [
          `./data_sync_${encodeURIComponent(account)}.json?${cacheBuster}`,
          `./data_sync.json?${cacheBuster}`
        ];
        for (const url of staticUrls) {
          try {
            const sRes = await fetch(url, { cache: 'no-cache' });
            if (sRes.ok) {
              const sJson = await sRes.json();
              if (sJson && sJson.students && Array.isArray(sJson.students)) {
                remoteData = sJson;
                console.log(`[CloudSync] 成功自靜態檔案 (${url}) 載入最新班級存檔！`);
                break;
              }
            }
          } catch (_) {}
        }
      } catch (err) {
        console.warn('[CloudSync] 靜態檔案拉取失敗:', err);
      }
    }

    // 4. 若以上遠端皆無回應，且使用者在手動強制同步 (force === true)，自動採用內嵌主存檔
    if (!remoteData && force) {
      console.log('[CloudSync] 遠端無回應，採用內嵌電腦主存檔作為同步來源');
      remoteData = JSON.parse(JSON.stringify(MASTER_ROSTER_BACKUP_20261119));
    }

    if (remoteData) {
      let isUpdated = false;
      const normalizedRemote = this.store.normalizeData(remoteData);
      if (normalizedRemote) {
        // --- 密碼防護鎖：遠端若是預設密碼且本地已有自訂密碼，嚴格保留本地密碼 ---
        const localPass = (this.store.data && this.store.data.queenPassword) || 
          (typeof localStorage !== 'undefined' && localStorage.getItem('xining_custom_queen_password'));
        if (localPass && localPass !== 'queen') {
          if (!normalizedRemote.queenPassword || normalizedRemote.queenPassword === 'queen') {
            normalizedRemote.queenPassword = localPass;
          }
        } else if (normalizedRemote.queenPassword && normalizedRemote.queenPassword !== 'queen') {
          if (typeof localStorage !== 'undefined') {
            try { localStorage.setItem('xining_custom_queen_password', normalizedRemote.queenPassword); } catch (_) {}
          }
        }

        const remoteTime = normalizedRemote.lastModified || 0;
        const localTime = this.store.data.lastModified || 0;

        const localIsReal = this.store.data.students && this.store.data.students[0] && this.store.data.students[0].name === "洪永恩";
        const remoteIsReal = normalizedRemote.students && normalizedRemote.students[0] && normalizedRemote.students[0].name === "洪永恩";

        if (localIsReal && !remoteIsReal && !force) {
          console.warn('[CloudSync] 遠端資料非真實名冊，嚴防覆蓋，並反向推送正確名冊至遠端！');
          this.push({ silent: true, force: true });
          this.syncStatus = 'success';
          this.notify();
          return { success: true, timestamp: new Date(), updated: false };
        }

        // 核心防舊倒灌鎖：若本機大臣人數多於遠端且時間戳更新，遠端為缺漏大臣之舊存檔，嚴防覆蓋，反向推送更新遠端！
        const localCount = (this.store.data.students || []).length;
        const remoteCount = (normalizedRemote.students || []).length;
        if (localCount > remoteCount && localTime >= remoteTime && !force) {
          console.warn(`[CloudSync] 本機名冊擁有更多大臣 (${localCount} 人 > 遠端 ${remoteCount} 人)，嚴防被缺少大臣的舊遠端倒灌，反向推送保全最新資料！`);
          this.push({ silent: true, force: true });
          this.syncStatus = 'success';
          this.notify();
          return { success: true, timestamp: new Date(), updated: false };
        }

        // 智慧比對：若遠端時間戳較新、或遠端有新增點數/打卡紀錄，立即進行雙向融合
        const hasUpdates = this.hasRemoteUpdates(this.store.data, normalizedRemote);

        if (force || remoteTime > localTime || hasUpdates || (!localIsReal && remoteIsReal)) {
          this.store.recordLocalSnapshot(`雲端拉取前備份 (遠端: ${remoteTime ? new Date(remoteTime).toLocaleTimeString() : '無時間戳'})`);
          // 核心修復：使用「智能融合」取代盲目整包覆蓋，保證本機與手機新編輯完整融合！
          this.store.data = this.store.mergeRemoteData(normalizedRemote);
          this.store.saveInternal({ updateTimestamp: false, triggerPush: false });
          if (typeof window !== 'undefined') {
            if (this.store && typeof this.store.syncAllStudentsCards === 'function') {
              this.store.syncAllStudentsCards();
            }
            if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
              window.KingdomUI.refreshCurrentView();
            }
            // ⚡ 效能優化：僅對當前使用者眼前可見的視圖進行渲染，隱藏分頁於點選時即時渲染，節省 85% 運算
            const isElVisible = (id) => {
              const el = document.getElementById(id);
              return el && !el.classList.contains('hidden') && el.style.display !== 'none';
            };
            if (isElVisible('morningBoardView') && typeof renderMorningBoard === 'function') renderMorningBoard();
            if (isElVisible('trafficView') && typeof renderTrafficView === 'function') renderTrafficView();
            if (isElVisible('seatingView') && typeof renderSeatingChart === 'function') renderSeatingChart();
            if (isElVisible('teacherView')) {
              if (typeof renderCurrentTeacherTab === 'function') renderCurrentTeacherTab();
              if (typeof renderHomeworkSummaryBoard === 'function') renderHomeworkSummaryBoard();
              if (typeof renderPointsView === 'function') renderPointsView();
              if (typeof renderRosterView === 'function') renderRosterView();
            }
            if (isElVisible('contactProjectionModal') && typeof renderContactProjectionView === 'function') renderContactProjectionView();
            if (isElVisible('pointsProjectionModal') && typeof renderPointsProjection === 'function') renderPointsProjection();
          }
          // 徹底移除背景自動同步時彈出的右下角 Toast，保持大螢幕與操作介面極致純淨，不再干擾導師
          isUpdated = true;
          // 若本地剛在 3.5 秒內編輯過作業，排程推送以確保雲端即時同步，嚴防背景拉取延遲
          if (this.store.lastLocalHomeworkEditTime && (Date.now() - this.store.lastLocalHomeworkEditTime < 3500)) {
            this.schedulePush();
          }
        }
        // 注意：拉取操作 (pull) 絕不反向自動觸發 push，徹底杜絕多裝置間的互推循環 (Ping-Pong Loop)
      }

      this.hasCompletedInitialPull = true;
      this.syncStatus = 'success';
      this.lastSyncTime = new Date();
      this.lastError = null;
      this.notify();
      return { success: true, timestamp: this.lastSyncTime, updated: isUpdated };
    } else {
      this.hasCompletedInitialPull = true;
      if (this.config.googleScriptUrl || isLocal) {
        this.syncStatus = 'error';
        this.lastError = pullError || '尚無同步存檔';
      } else {
        this.syncStatus = 'idle';
      }
      this.notify();
      return { success: false, error: this.lastError };
    }
  }

  // Safari / iOS 專用 JSONP 跨網域拉取通道 (完全免疫 CORS 與 302 重定向跨域阻擋)
  pullViaJsonp(gasUrl, account) {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') return resolve(null);
      const callbackName = `__gas_cb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const script = document.createElement('script');
      const timer = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 6500);

      function cleanup() {
        clearTimeout(timer);
        if (script.parentNode) script.parentNode.removeChild(script);
        try { delete window[callbackName]; } catch (_) {}
      }

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        cleanup();
        resolve(null);
      };

      const cacheBust = `_t=${Date.now()}`;
      const sep = gasUrl.includes('?') ? '&' : '?';
      script.src = `${gasUrl}${sep}account=${encodeURIComponent(account)}&action=pull&callback=${callbackName}&${cacheBust}`;
      document.head.appendChild(script);
    });
  }

  // 檢查遠端存檔是否含有本地尚未擁有的最新資訊 (版本號遞增、新增大臣、點數變動、打卡更新、作業新交/訂正、聯絡簿更新等)
  hasRemoteUpdates(local, remote) {
    if (!remote || !remote.students || !Array.isArray(remote.students)) return false;
    if (!local || !local.students || !Array.isArray(local.students)) return true;

    // 0. 單調遞增雲端版本號 (cloudRevision)：若遠端版本號大於本地，100% 判定有更新！
    const rRev = Number(remote.cloudRevision) || 0;
    const lRev = Number(local.cloudRevision) || 0;
    if (rRev > lRev) return true;

    const rTime = Number(remote.lastModified) || 0;
    const lTime = Number(local.lastModified) || 0;

    // 1. 若遠端時間戳明確較新（考慮時鐘 1 秒誤差容差），一律視為有更新
    if (rTime > lTime + 1000) return true;

    // 關鍵防舊覆蓋保護：若本地大臣人數多於遠端，且本地時間戳不小於遠端，代表遠端為缺少大臣的舊檔，絕不可視為更新！
    if (local.students.length > remote.students.length && lTime >= rTime) {
      return false;
    }

    // 2. 名冊人數比對：若遠端大臣人數更多（例如手機剛冊封新大臣），100% 判定有更新！
    if (remote.students.length > local.students.length) return true;

    // 檢查遠端是否有本地缺少的大臣
    const hasNewStudent = remote.students.some(rSt => !local.students.some(lSt => lSt.seatNo === rSt.seatNo || lSt.id === rSt.id));
    if (hasNewStudent) return true;

    // 3. 加扣點歷程與點數比對 (遠端是否有更新的記功紀錄或不同的點數)
    const rLogs = remote.pointLogs || [];
    const lLogs = local.pointLogs || [];
    const rLatestLogId = (rLogs[0] && rLogs[0].id) || 0;
    const lLatestLogId = (lLogs[0] && lLogs[0].id) || 0;
    if (rLatestLogId > lLatestLogId) return true;

    // 4. 比對個別大臣點數與生涯累積總額是否不同（支援手機加扣點、重設、歸零秒級同步到電腦與平板）
    for (let i = 0; i < remote.students.length; i++) {
      const rSt = remote.students[i];
      const lSt = local.students.find(s => s.seatNo === rSt.seatNo || s.id === rSt.id);
      if (lSt) {
        if (Number(rSt.points) !== Number(lSt.points) || Number(rSt.lifetimePoints) !== Number(lSt.lifetimePoints)) {
          return true;
        }
        if (rSt.name !== lSt.name || rSt.title !== lSt.title || rSt.birthday !== lSt.birthday) {
          return true;
        }
      }
    }

    // 4.5. 特權獎勵卡兌換與核銷/撤銷比對 (支援多裝置使用卡牌、撤銷換卡即時秒級連動)
    const rRed = remote.rewardRedemptions || [];
    const lRed = local.rewardRedemptions || [];
    if (rRed.length !== lRed.length) return true;
    const lRedMap = new Map();
    lRed.forEach(r => { if (r && r.id) lRedMap.set(String(r.id), r); });
    for (let i = 0; i < rRed.length; i++) {
      const rItem = rRed[i];
      if (!rItem || !rItem.id) continue;
      const lItem = lRedMap.get(String(rItem.id));
      if (!lItem || rItem.status !== lItem.status) return true;
    }

    // 比對大臣個人卡牌抽屜數量是否有變動
    for (let i = 0; i < remote.students.length; i++) {
      const rSt = remote.students[i];
      const lSt = local.students.find(s => s.seatNo === rSt.seatNo || s.id === rSt.id);
      if (lSt) {
        const rCards = Array.isArray(rSt.redeemedCards) ? rSt.redeemedCards.length : -1;
        const lCards = Array.isArray(lSt.redeemedCards) ? lSt.redeemedCards.length : -1;
        if (rCards !== -1 && lCards !== -1 && rCards !== lCards) return true;
      }
    }

    // 5. 簽到表比對 (任何狀態不同或時間戳不同即時觸發更新)
    const rAtt = remote.attendance || {};
    const lAtt = local.attendance || {};
    for (const d in rAtt) {
      if (!lAtt[d]) return true;
      for (const seat in rAtt[d]) {
        const rRec = rAtt[d][seat];
        const lRec = lAtt[d][seat];
        const rStat = (rRec && rRec.status) || 'pending';
        const lStat = (lRec && lRec.status) || 'pending';
        if (rStat !== lStat) return true;
        if (rRec && lRec && rRec.checkInTime !== lRec.checkInTime) return true;
      }
    }

    // 6. 作業與刪除墓碑比對 (支援跨裝置新增、批閱與即時刪除同步)
    const lDelSet = new Set((local.deletedHomeworkIds || ['1', '2', '3']).map(String));
    const rDelSet = new Set((remote.deletedHomeworkIds || ['1', '2', '3']).map(String));

    // 若遠端含有本地尚未記錄的已刪除作業 ID，視為有更新
    for (const did of rDelSet) {
      if (!lDelSet.has(did)) return true;
    }

    const isCheckFakeOrDeleted = (hw) => {
      if (!hw) return true;
      const idStr = String(hw.id || '');
      if (lDelSet.has(idStr) || rDelSet.has(idStr)) return true;
      if (idStr === '1' || idStr === '2' || idStr === '3') return true;
      if (hw.date === '2026-11-16' || hw.dueDate === '2026-11-16') return true;
      const t = String(hw.title || '').replace(/\s+/g, '');
      const p = String(hw.presetName || '').replace(/\s+/g, '');
      if (t.includes('國語習作第八課') || t.includes('生字造詞隨堂筆記') || t.includes('數學習作P.62') || t.includes('數學習作P62')) return true;
      if (t === '國語習作完成' || t === '國習完成') return true;
      if ((t === '國習' || p === '國習') && (!hw.dueDate || hw.date <= '2026-11-24' || hw.dueDate <= '2026-11-24')) return true;
      return false;
    };

    const rHw = (remote.homework || []).filter(h => !isCheckFakeOrDeleted(h));
    const lHw = (local.homework || []).filter(h => !isCheckFakeOrDeleted(h));
    if (rHw.length !== lHw.length) return true;
    const lHwMap = new Map();
    lHw.forEach(h => { if (h && h.id) lHwMap.set(String(h.id), h); });
    for (let i = 0; i < rHw.length; i++) {
      const rh = rHw[i];
      if (!rh || !rh.id) continue;
      const lh = lHwMap.get(String(rh.id));
      if (!lh) return true;
      if (rh.title !== lh.title || rh.dueDate !== lh.dueDate || rh.subject !== lh.subject) return true;
      const rRecs = rh.records || {};
      const lRecs = lh.records || {};
      for (const s in rRecs) {
        const rVal = typeof rRecs[s] === 'string' ? rRecs[s] : ((rRecs[s] && rRecs[s].status) || 'pending');
        const lVal = typeof lRecs[s] === 'string' ? lRecs[s] : ((lRecs[s] && lRecs[s].status) || 'pending');
        if (rVal !== lVal) {
          return true; // 準時、遲交、訂正、未交狀態任一改變立即融合
        }
      }
    }

    // 7. 聯絡簿深度比對
    if (remote.contactBook || local.contactBook) {
      const rHwItems = (remote.contactBook && remote.contactBook.homeworkItems) || [];
      const lHwItems = (local.contactBook && local.contactBook.homeworkItems) || [];
      if (JSON.stringify(rHwItems) !== JSON.stringify(lHwItems)) return true;

      const rReminders = (remote.contactBook && remote.contactBook.reminders) || [];
      const lReminders = (local.contactBook && local.contactBook.reminders) || [];
      if (JSON.stringify(rReminders) !== JSON.stringify(lReminders)) return true;

      const rMotto = (remote.contactBook && remote.contactBook.queenMotto) || '';
      const lMotto = (local.contactBook && local.contactBook.queenMotto) || '';
      if (rMotto !== lMotto) return true;
    }

    // 8. 常用作業快捷範本比對
    if (remote.homeworkPresets && local.homeworkPresets) {
      if (JSON.stringify(remote.homeworkPresets) !== JSON.stringify(local.homeworkPresets)) return true;
    }

    // 9. 皇室公告比對
    if (remote.announcements && local.announcements) {
      if (JSON.stringify(remote.announcements) !== JSON.stringify(local.announcements)) return true;
    }

    // 10. 行為卡牌與常規提醒單比對 (自省卡、愛班卡、常規提醒單跨裝置即時秒同步)
    if (remote.behaviorCards || local.behaviorCards) {
      if (JSON.stringify(remote.behaviorCards || {}) !== JSON.stringify(local.behaviorCards || {})) return true;
    }

    // 11. 座位表格局與排列比對
    if (remote.seatingChart && local.seatingChart) {
      if (JSON.stringify(remote.seatingChart) !== JSON.stringify(local.seatingChart)) return true;
    }

    return false;
  }

  // 取得伺服器歷史快照清單
  async fetchServerSnapshots() {
    try {
      const url = this.getLocalApiUrl('/api/sync/snapshots');
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[CloudSync] 取得伺服器快照失敗:', e);
    }
    return { success: false, snapshots: [] };
  }

  // 還原伺服器歷史快照或電腦原始完整存檔
  async restoreServerSnapshot(snapshotName = '') {
    try {
      const url = this.getLocalApiUrl('/api/sync/restore');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshotName })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          this.store.recordLocalSnapshot('還原伺服器存檔前備份');
          this.store.data = this.store.normalizeData(result.data);
          this.store.saveInternal({ updateTimestamp: true, triggerPush: false });
          if (typeof window !== 'undefined') {
            if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
              window.KingdomUI.refreshCurrentView();
            }
            if (typeof renderPointsView === 'function') renderPointsView();
            if (typeof renderRosterView === 'function') renderRosterView();
            if (typeof renderMorningBoard === 'function') renderMorningBoard();
          }
          return { success: true, message: result.message, studentCount: result.studentCount };
        }
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
    return { success: false, message: '還原失敗' };
  }

  exportBackupJSON() {
    if (typeof window === 'undefined') return;
    const dataStr = JSON.stringify(this.store.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xining_502_kingdom_backup_${getTodayDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async importBackupJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.students || !Array.isArray(parsed.students)) {
            throw new Error('匯入的檔案不是合法的西寧小小兵王國存檔');
          }
          parsed.lastModified = Date.now();
          this.store.data = parsed;
          this.store.save();
          if (typeof window !== 'undefined') {
            if (window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
              window.KingdomUI.refreshCurrentView();
            }
            if (typeof renderPointsView === 'function') renderPointsView();
            if (typeof renderRosterView === 'function') renderRosterView();
            if (typeof renderMorningBoard === 'function') renderMorningBoard();
          }
          await this.push({ silent: true });
          resolve({ success: true, count: parsed.students.length });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('讀取檔案失敗'));
      reader.readAsText(file);
    });
  }

  getShareableSyncUrl() {
    if (typeof window === 'undefined' || !window.location) return '';
    let origin = window.location.origin;
    const pathname = window.location.pathname;
    const account = encodeURIComponent(this.config.googleAccount || 'xining502@gmail.com');

    // 若本機是 localhost 或 127.0.0.1，替換為伺服器真實區域 IP，讓手機掃描可以直接開啟！
    if (this.primaryLanIp && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      const port = window.location.port ? `:${window.location.port}` : '';
      origin = `${window.location.protocol}//${this.primaryLanIp}${port}`;
    }

    let url = `${origin}${pathname}?google=${account}`;
    if (this.config.googleScriptUrl) {
      url += `&gas=${encodeURIComponent(this.config.googleScriptUrl)}`;
    }
    return url;
  }
}

const sound = new KingdomSound();
const cloudSync = new KingdomCloudSync(store);

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#facc15', '#f59e0b', '#fbbf24', '#e11d48', '#10b981']
    });
  }
}

if (typeof window !== 'undefined') {
  window.store = store;
  window.sound = sound;
  window.cloudSync = cloudSync;
  window.KingdomApp = {
    store,
    sound,
    cloudSync,
    getAnimalStatus,
    renderAnimalSVG,
    getPetStatus,
    renderPetSVG,
    triggerConfetti,
    getTodayDateString,
    ANIMAL_DEFINITIONS,
    PET_DEFINITIONS,
    DEFAULT_STUDENTS_27,
    DEFAULT_CONTACT_BOOK,
    DEFAULT_HOMEWORK_PRESETS,
    DEFAULT_BEHAVIOR_REASONS,
    DEFAULT_ALARM_PRESETS,
    DEFAULT_REMINDER_PRESETS,
    DEFAULT_SEATING_CHART
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    KingdomStore,
    KingdomSound,
    KingdomCloudSync,
    store,
    sound,
    cloudSync,
    ANIMAL_DEFINITIONS,
    getAnimalStatus,
    renderAnimalSVG,
    DEFAULT_STUDENTS_27,
    DEFAULT_SEATING_CHART,
    DEFAULT_CONTACT_BOOK,
    DEFAULT_HOMEWORK_PRESETS,
    DEFAULT_BEHAVIOR_REASONS,
    DEFAULT_ALARM_PRESETS,
    DEFAULT_REMINDER_PRESETS
  };
}

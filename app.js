/**
 * 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統
 * 核心應用邏輯 (Core Application Logic) - 27人亮黃專屬版
 */

// ===================================================================
// 1. 27位內閣大臣預設名冊 (Default 27 Students Roster)
// ===================================================================
const DEFAULT_STUDENTS_27 = [
  { id: 1, seatNo: 1, name: "王品捷", gender: "M", title: "內閣首輔大臣", birthday: "0315", points: 85, petType: "dragon", petExp: 85 },
  { id: 2, seatNo: 2, name: "李宇軒", gender: "M", title: "皇家騎士團長", birthday: "0520", points: 160, petType: "lion", petExp: 160 },
  { id: 3, seatNo: 3, name: "林冠廷", gender: "M", title: "國庫財政大臣", birthday: "0812", points: 210, petType: "cat", petExp: 210 },
  { id: 4, seatNo: 4, name: "張宸睿", gender: "M", title: "宮廷禮儀大臣", birthday: "1104", points: 65, petType: "unicorn", petExp: 65 },
  { id: 5, seatNo: 5, name: "陳奕安", gender: "M", title: "皇家文書大臣", birthday: "0228", points: 130, petType: "cat", petExp: 130 },
  { id: 6, seatNo: 6, name: "黃柏瀚", gender: "M", title: "奇蹟魔法大臣", birthday: "0709", points: 310, petType: "dragon", petExp: 310 },
  { id: 7, seatNo: 7, name: "楊子賢", gender: "M", title: "守護壁壘大將", birthday: "0923", points: 95, petType: "lion", petExp: 95 },
  { id: 8, seatNo: 8, name: "趙偉豪", gender: "M", title: "皇家圖書大臣", birthday: "0416", points: 145, petType: "cat", petExp: 145 },
  { id: 9, seatNo: 9, name: "劉承佑", gender: "M", title: "生態綠意大臣", birthday: "1205", points: 50, petType: "unicorn", petExp: 50 },
  { id: 10, seatNo: 10, name: "蔡秉恩", gender: "M", title: "國境先鋒騎士", birthday: "0630", points: 175, petType: "dragon", petExp: 175 },
  { id: 11, seatNo: 11, name: "吳宗翰", gender: "M", title: "皇家衛隊隊長", birthday: "0118", points: 115, petType: "lion", petExp: 115 },
  { id: 12, seatNo: 12, name: "許翔宇", gender: "M", title: "智慧科技大臣", birthday: "1010", points: 240, petType: "dragon", petExp: 240 },
  { id: 13, seatNo: 13, name: "鄭予涵", gender: "F", title: "體育競技女將軍", birthday: "0403", points: 190, petType: "lion", petExp: 190 },
  { id: 14, seatNo: 14, name: "謝孟庭", gender: "F", title: "藝術壁畫大臣", birthday: "0825", points: 155, petType: "unicorn", petExp: 155 },
  { id: 15, seatNo: 15, name: "周語晴", gender: "F", title: "皇家音樂總監", birthday: "0614", points: 320, petType: "cat", petExp: 320 },
  { id: 16, seatNo: 16, name: "郭心妍", gender: "F", title: "晨曦敲鐘官", birthday: "0329", points: 80, petType: "unicorn", petExp: 80 },
  { id: 17, seatNo: 17, name: "曾詩涵", gender: "F", title: "皇家糧餉大臣", birthday: "1119", points: 125, petType: "lion", petExp: 125 },
  { id: 18, seatNo: 18, name: "洪若菲", gender: "F", title: "萬國外交特使", birthday: "0508", points: 205, petType: "dragon", petExp: 205 },
  { id: 19, seatNo: 19, name: "邱品萱", gender: "F", title: "秩序執法女官", birthday: "0915", points: 140, petType: "cat", petExp: 140 },
  { id: 20, seatNo: 20, name: "孫瑀恩", gender: "F", title: "歡樂慶典大臣", birthday: "0722", points: 165, petType: "unicorn", petExp: 165 },
  { id: 21, seatNo: 21, name: "莊宜璇", gender: "F", title: "皇家天文占星官", birthday: "0107", points: 280, petType: "unicorn", petExp: 280 },
  { id: 22, seatNo: 22, name: "賴采婕", gender: "F", title: "星光守望騎士", birthday: "1224", points: 90, petType: "dragon", petExp: 90 },
  { id: 23, seatNo: 23, name: "鍾佩芸", gender: "F", title: "皇宮環境大臣", birthday: "0214", points: 135, petType: "cat", petExp: 135 },
  { id: 24, seatNo: 24, name: "方雅筑", gender: "F", title: "皇家廣播宣令官", birthday: "1002", points: 70, petType: "lion", petExp: 70 },
  { id: 25, seatNo: 25, name: "羅晴文", gender: "F", title: "智慧博學顧問", birthday: "0606", points: 225, petType: "cat", petExp: 225 },
  { id: 26, seatNo: 26, name: "簡宏宇", gender: "M", title: "皇家工務大臣", birthday: "0918", points: 110, petType: "lion", petExp: 110 },
  { id: 27, seatNo: 27, name: "蘇品睿", gender: "M", title: "皇家巡察御史", birthday: "0425", points: 140, petType: "dragon", petExp: 140 }
];

// 預設自訂集點項目庫 (加分 & 扣分，老師可自由新增刪除)
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

// 預設作業常用快捷項目庫 (例如：國習、造詞、生字本、數習、數練等，導師可自由新增刪除與一鍵套用)
const DEFAULT_HOMEWORK_PRESETS = [
  { id: 'hwp-1', subject: '國語', name: '國習', fullName: '國語習作', defaultDesc: '習作錯題請用紅筆打叉確實訂正並簽名' },
  { id: 'hwp-2', subject: '國語', name: '造詞', fullName: '生字造詞本', defaultDesc: '每字造二詞並標註注音，字跡端正' },
  { id: 'hwp-3', subject: '國語', name: '生字本', fullName: '生字甲/乙本', defaultDesc: '生字筆順部首描寫正確' },
  { id: 'hwp-4', subject: '國語', name: '圈詞', fullName: '國語圈詞本', defaultDesc: '每課圈詞二遍並完成造句' },
  { id: 'hwp-5', subject: '數學', name: '數習', fullName: '數學習作', defaultDesc: '計算過程完整寫在空白處，記得約分' },
  { id: 'hwp-6', subject: '數學', name: '數練', fullName: '數學隨堂練習', defaultDesc: '完成課堂延伸題並用藍筆訂正' },
  { id: 'hwp-7', subject: '數學', name: '數作', fullName: '數學作業簿', defaultDesc: '直式計算整齊對齊，驗算確實' },
  { id: 'hwp-8', subject: '自然', name: '自習', fullName: '自然習作', defaultDesc: '實驗記錄完整，觀測結果填寫詳實' },
  { id: 'hwp-9', subject: '社會', name: '社習', fullName: '社會習作', defaultDesc: '配合課本閱讀填寫並劃記重點' },
  { id: 'hwp-10', subject: '綜合', name: '聯絡簿', fullName: '每日家庭聯絡簿', defaultDesc: '抄寫完整，作業清點齊全，家長簽名' }
];

// 預設常規卡牌發布事由快捷庫 (座位自省卡、愛班服務卡，導師可自訂新增刪除)
const DEFAULT_BEHAVIOR_REASONS = [
  // 座位自省事由 (紅燈)
  { id: 'br-1', type: 'reflection', label: '上課分心', text: '上課分心聊天屢次提醒' },
  { id: 'br-2', type: 'reflection', label: '走廊奔跑', text: '走廊危險奔跑常規提醒' },
  { id: 'br-3', type: 'reflection', label: '作業未帶', text: '課堂作業未帶留座補寫' },
  { id: 'br-4', type: 'reflection', label: '學用品缺', text: '未帶課本與必備學用品' },
  { id: 'br-5', type: 'reflection', label: '課間推擠', text: '課間推擠嬉鬧影響安全' },
  // 愛班服務事由 (愛班卡)
  { id: 'br-6', type: 'service', label: '07:40未打卡', text: '超過07:40未打卡（留班補打掃）' },
  { id: 'br-7', type: 'service', label: '值日怠惰', text: '值日生怠惰未清黑板倒垃圾' },
  { id: 'br-8', type: 'service', label: '桌面雜亂', text: '座位周邊紙屑髒亂整潔不佳' },
  { id: 'br-9', type: 'service', label: '廚餘未分類', text: '午餐餐具未收拾、廚餘未妥善分類' }
];

// 預設教室座位表 (5 行 x 6 列 = 30 格，座號 1~27 號，後 3 格為空位 null)
const DEFAULT_SEATING_CHART = [
  1,  2,  3,  4,  5,
  6,  7,  8,  9,  10,
  11, 12, 13, 14, 15,
  16, 17, 18, 19, 20,
  21, 22, 23, 24, 25,
  26, 27, null, null, null
];

// 預設教室大螢幕聯絡簿內容
const DEFAULT_CONTACT_BOOK = {
  date: getTodayDateString(),
  homeworkItems: [
    "國語習作第八課完成並確實用紅筆打叉訂正 (P.54~P.58)",
    "數學習作 P.46 ~ P.48 (分數四則運算，約分至最簡分數)",
    "背誦國語第八課課文第二、三段",
    "訂正數學習作第七單元錯題並簽名"
  ],
  reminders: [
    "明日為校外教學日，請著運動服布鞋，帶水壺、輕便雨衣",
    "交回自然科「月相連續觀測紀錄表」 (需家長簽章確認)"
  ],
  queenMotto: "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"
};

// 神獸定義 (4 種王國神獸，4 階進化)
const PET_DEFINITIONS = {
  dragon: {
    name: "烈焰守護神龍",
    element: "火系 ‧ 勇氣與力量",
    stages: [
      { min: 0, title: "初生暖暖龍蛋", icon: "🥚", color: "#f97316", desc: "散發微熱溫度的神秘紅晶蛋，正在吸收大臣的榮譽能量。" },
      { min: 50, title: "噴火萌幼龍", icon: "🐲", color: "#ea580c", desc: "破殼而出的頑皮幼龍，偶爾會打出溫暖的小火苗花火！" },
      { min: 150, title: "熾翼赤戰龍", icon: "🐉", color: "#c2410c", desc: "展開燃燒雙翼，守護王國疆域的英勇赤紅巨龍。" },
      { min: 300, title: "皇家神聖熾炎天龍", icon: "👑", color: "#7c2d12", desc: "擁有傳奇聖火冠冕的王國終極守護神，無堅不摧！" }
    ]
  },
  unicorn: {
    name: "星月天角聖獸",
    element: "光系 ‧ 仁愛與純潔",
    stages: [
      { min: 0, title: "幻彩星光蛋", icon: "🥚", color: "#ec4899", desc: "表面有星芒流轉的柔光蛋，散發甜甜的星塵香氣。" },
      { min: 50, title: "踏雲小萌駒", icon: "🦄", color: "#db2777", desc: "剛長出金色小角蹄的萌馬，踩在地上會留下彩虹足跡。" },
      { min: 150, title: "幻光神聖獨角獸", icon: "✨", color: "#be185d", desc: "身披月光銀鬃，能以聖光治癒一切心靈疲倦的靈獸。" },
      { min: 300, title: "璀璨星宿守護聖尊", icon: "🌟", color: "#9d174d", desc: "化身星河傳說的永恆守護者，為王國帶來祥和與榮耀！" }
    ]
  },
  cat: {
    name: "智慧符文靈貓",
    element: "秘法系 ‧ 智慧與敏捷",
    stages: [
      { min: 0, title: "神秘魔法毛球蛋", icon: "🥚", color: "#8b5cf6", desc: "偶爾會發出呼嚕呼嚕神秘聲響的紫色法術水晶蛋。" },
      { min: 50, title: "巫師小靈貓", icon: "🐱", color: "#7c3aed", desc: "戴著微型巫師帽的聰明喵喵，喜歡蹲在奏章上監督功課。" },
      { min: 150, title: "符文夜行魔貓", icon: "🔮", color: "#6d28d9", desc: "尾巴浮動古代符文，擁有敏銳心智與超強洞察力。" },
      { min: 300, title: "皇家大賢者靈貓聖尊", icon: "🧙‍♂️", color: "#5b21b6", desc: "參透王國萬物奧秘的至高靈貓，是皇后與大臣的得力智囊！" }
    ]
  },
  lion: {
    name: "太陽聖王金獅",
    element: "雷系 ‧ 忠誠與正義",
    stages: [
      { min: 0, title: "金紋守護石蛋", icon: "🥚", color: "#eab308", desc: "雕刻著西寧皇家盾牌的金石神蛋，沉穩如泰山。" },
      { min: 50, title: "蓬蓬毛小幼獅", icon: "🦁", color: "#ca8a04", desc: "搖頭晃腦的小幼獅，練習咆哮時聲音像吹泡泡一樣可愛！" },
      { min: 150, title: "狂雷戰吼雄獅", icon: "⚡", color: "#a16207", desc: "鬃毛泛著雷電金芒，一聲怒吼即可驅散所有怠惰與邪惡。" },
      { min: 300, title: "太陽聖王尊者雄獅", icon: "☀️", color: "#854d0e", desc: "威震四方的皇家無上王獅，象徵西寧小小兵王國的無敵榮光！" }
    ]
  }
};

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 預設今日出缺席範例 (包含 07:40 遲到規則示範)
const DEFAULT_ATTENDANCE = {
  [getTodayDateString()]: {
    1: { status: "present", checkInTime: "07:28" },
    2: { status: "present", checkInTime: "07:31" },
    3: { status: "present", checkInTime: "07:35" },
    4: { status: "leave", leaveType: "sick", leaveScope: "full_day", leavePeriods: [], note: "腸胃炎發燒看診在家休養" },
    5: { status: "present", checkInTime: "07:25" },
    6: { status: "present", checkInTime: "07:33" },
    7: { status: "present", checkInTime: "07:30" },
    8: { status: "present", checkInTime: "07:38" },
    9: { status: "leave", leaveType: "personal", leaveScope: "periods", leavePeriods: [1, 2], note: "看牙醫門診，預計第3節返校" },
    10: { status: "present", checkInTime: "07:29" },
    11: { status: "present", checkInTime: "07:32" },
    12: { status: "present", checkInTime: "07:20" },
    13: { status: "present", checkInTime: "07:36" },
    14: { status: "present", checkInTime: "07:34" },
    15: { status: "present", checkInTime: "07:22" },
    16: { status: "late", checkInTime: "07:48", note: "07:48 到校（超過 07:40 門禁）" },
    17: { status: "present", checkInTime: "07:33" },
    18: { status: "present", checkInTime: "07:30" },
    19: { status: "present", checkInTime: "07:37" },
    20: { status: "present", checkInTime: "07:26" },
    21: { status: "present", checkInTime: "07:28" },
    22: { status: "present", checkInTime: "07:39" },
    23: { status: "present", checkInTime: "07:24" },
    24: { status: "present", checkInTime: "07:35" },
    25: { status: "present", checkInTime: "07:31" },
    26: { status: "present", checkInTime: "07:35" },
    27: { status: "present", checkInTime: "07:32" }
  }
};

const DEFAULT_HOMEWORK = [
  {
    id: "hw-1",
    subject: "國語",
    title: "國語習作第八課完成並訂正",
    presetName: "國習",
    dueDate: getTodayDateString(),
    desc: "完成習作 P.54~58，字跡端正，寫錯處用紅筆打叉訂正。",
    records: {
      1: "submitted", 2: "submitted", 3: "late", 4: "pending", 5: "submitted",
      6: "submitted", 7: "submitted", 8: "revision", 9: "pending", 10: "submitted",
      11: "submitted", 12: "submitted", 13: "submitted", 14: "submitted", 15: "submitted",
      16: "late", 17: "revision", 18: "submitted", 19: "submitted", 20: "submitted",
      21: "submitted", 22: "revision", 23: "submitted", 24: "pending", 25: "submitted",
      26: "submitted", 27: "submitted"
    }
  },
  {
    id: "hw-2",
    subject: "數學",
    title: "數學習作 P.46~48（分數運算）",
    presetName: "數習",
    dueDate: getTodayDateString(),
    desc: "記得約分到最簡分數，計算過程要寫完整在空白處。",
    records: {
      1: "submitted", 2: "submitted", 3: "submitted", 4: "revision", 5: "submitted",
      6: "submitted", 7: "submitted", 8: "submitted", 9: "submitted", 10: "revision",
      11: "submitted", 12: "submitted", 13: "submitted", 14: "submitted", 15: "submitted",
      16: "pending", 17: "submitted", 18: "submitted", 19: "submitted", 20: "submitted",
      21: "submitted", 22: "revision", 23: "submitted", 24: "submitted", 25: "submitted",
      26: "submitted", 27: "submitted"
    }
  },
  {
    id: "hw-3",
    subject: "自然",
    title: "月相連續觀測紀錄單",
    presetName: "自習",
    dueDate: getTodayDateString(),
    desc: "帶回紀錄單，請家長在確認簽章欄簽名。",
    records: {
      1: "submitted", 2: "submitted", 3: "submitted", 4: "pending", 5: "submitted",
      6: "submitted", 7: "submitted", 8: "submitted", 9: "pending", 10: "submitted",
      11: "submitted", 12: "submitted", 13: "submitted", 14: "submitted", 15: "submitted",
      16: "revision", 17: "submitted", 18: "submitted", 19: "submitted", 20: "submitted",
      21: "submitted", 22: "submitted", 23: "submitted", 24: "pending", 25: "submitted",
      26: "submitted", 27: "submitted"
    }
  }
];

const DEFAULT_POINT_LOGS = [
  { id: 1, studentId: 6, points: 5, reason: "課堂數學解題清晰有條理，為王國獻策！", date: getTodayDateString(), time: "09:30" },
  { id: 2, studentId: 15, points: 3, reason: "音樂直笛練習熱心指導同僚大臣", date: getTodayDateString(), time: "10:15" },
  { id: 3, studentId: 3, points: 5, reason: "管理班級公費帳冊字跡清晰無誤", date: getTodayDateString(), time: "11:00" },
  { id: 4, studentId: 16, points: -1, reason: "上課分心聊天提醒", date: getTodayDateString(), time: "13:10" }
];

// 預設皇家藏寶閣獎勵卡牌庫 (導師可自由新增、修改點數、刪除)
const DEFAULT_REWARD_CARDS = [
  { id: "rc-1", title: "免死金牌 (作業遲交豁免券)", cost: 30, icon: "🛡️", desc: "當日作業若不慎遲交或忘帶，可向皇后抵免一次登記與紀律處分（限用一次）。", category: "作業特權" },
  { id: "rc-2", title: "欽點寶座卡 (自由選位一日券)", cost: 50, icon: "💺", desc: "可自由選擇一整天的上課座位（需維護課堂專注與秩序）。", category: "班級特權" },
  { id: "rc-3", title: "御膳甜點券 (皇室精緻點心一份)", cost: 20, icon: "🍪", desc: "向皇后換取精美餅乾、布丁或健康小點心一份。", category: "生活獎勵" },
  { id: "rc-4", title: "提早放風卡 (下課提早2分鐘)", cost: 40, icon: "🏃", desc: "鐘聲響起前2分鐘，可獲准提早出發至球場活動或洗手間。", category: "下課特權" },
  { id: "rc-5", title: "早自習免抄卡 (皇室印章蓋印券)", cost: 25, icon: "📜", desc: "當日聯絡簿可由小幫手協助蓋章張貼，免手抄作業項目一次。", category: "課業減免" },
  { id: "rc-6", title: "一日皇家副班長體驗卡", cost: 35, icon: "🎖️", desc: "擔任一日副班長，協助整隊、喊起立敬禮與協助班務管理。", category: "榮譽幹部" }
];

// 預設下課紅綠燈特別行為卡牌 (座位自省卡、遲到愛班服務卡)
const DEFAULT_BEHAVIOR_CARDS = {
  16: { serviceCard: true, serviceReason: "07:48 晨檢打卡遲到愛班服務", reflectionCard: false, reflectionReason: "" },
  24: { reflectionCard: true, reflectionReason: "上課分心屢次交談（座位自省）", serviceCard: false, serviceReason: "" }
};

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "👑 皇后給五年二班大臣與家長的一封信",
    date: getTodayDateString(),
    pinned: true,
    content: "各位五年二班優秀大臣與家長好！王國朝會每日於 07:40 截止打卡，請大臣們養成規律作息準時覲見！本週進行自然科月相觀測，請攜帶紀錄單。感謝家長們共同守護小小兵王國！"
  }
];

// ===================================================================
// 2. 狀態管理器 (State Store & Persistence)
// ===================================================================
const STORAGE_KEY = "xining_kingdom_v3_dashboard";

class KingdomStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.students && parsed.students.length >= 25) {
          if (!parsed.pointPresets) parsed.pointPresets = DEFAULT_POINT_PRESETS;
          if (!parsed.homeworkPresets) parsed.homeworkPresets = DEFAULT_HOMEWORK_PRESETS;
          if (!parsed.behaviorReasons) parsed.behaviorReasons = DEFAULT_BEHAVIOR_REASONS;
          if (!parsed.lateThreshold) parsed.lateThreshold = "07:40";
          if (!parsed.contactBook) parsed.contactBook = DEFAULT_CONTACT_BOOK;
          if (!parsed.rewardCards) parsed.rewardCards = DEFAULT_REWARD_CARDS;
          if (!parsed.rewardRedemptions) parsed.rewardRedemptions = [];
          if (!parsed.behaviorCards) parsed.behaviorCards = DEFAULT_BEHAVIOR_CARDS;
          if (!parsed.trafficOverrides) parsed.trafficOverrides = {};
          if (!parsed.seatingChart || !Array.isArray(parsed.seatingChart) || parsed.seatingChart.length !== 30) {
            parsed.seatingChart = [...DEFAULT_SEATING_CHART];
          }
          if (!parsed.lastModified) parsed.lastModified = Date.now();
          return parsed;
        }
      }
    } catch (e) {
      console.warn("讀取本機資料失敗，載入預設值", e);
    }

    return {
      queenPassword: "queen",
      lateThreshold: "07:40",
      students: DEFAULT_STUDENTS_27,
      pointPresets: DEFAULT_POINT_PRESETS,
      homeworkPresets: DEFAULT_HOMEWORK_PRESETS,
      behaviorReasons: DEFAULT_BEHAVIOR_REASONS,
      contactBook: DEFAULT_CONTACT_BOOK,
      attendance: DEFAULT_ATTENDANCE,
      homework: DEFAULT_HOMEWORK,
      pointLogs: DEFAULT_POINT_LOGS,
      announcements: DEFAULT_ANNOUNCEMENTS,
      rewardCards: JSON.parse(JSON.stringify(DEFAULT_REWARD_CARDS)),
      rewardRedemptions: [],
      behaviorCards: JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_CARDS)),
      trafficOverrides: {},
      seatingChart: [...DEFAULT_SEATING_CHART],
      lastModified: Date.now()
    };
  }

  save() {
    try {
      this.data.lastModified = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      if (typeof window !== 'undefined' && window.KingdomApp && window.KingdomApp.cloudSync) {
        window.KingdomApp.cloudSync.schedulePush();
      }
    } catch (e) {
      console.error("儲存至 localStorage 失敗", e);
    }
  }

  reset() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.data = {
      queenPassword: "queen",
      lateThreshold: "07:40",
      students: JSON.parse(JSON.stringify(DEFAULT_STUDENTS_27)),
      pointPresets: JSON.parse(JSON.stringify(DEFAULT_POINT_PRESETS)),
      homeworkPresets: JSON.parse(JSON.stringify(DEFAULT_HOMEWORK_PRESETS)),
      behaviorReasons: JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_REASONS)),
      contactBook: JSON.parse(JSON.stringify(DEFAULT_CONTACT_BOOK)),
      attendance: JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE)),
      homework: JSON.parse(JSON.stringify(DEFAULT_HOMEWORK)),
      pointLogs: JSON.parse(JSON.stringify(DEFAULT_POINT_LOGS)),
      announcements: JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENTS)),
      rewardCards: JSON.parse(JSON.stringify(DEFAULT_REWARD_CARDS)),
      rewardRedemptions: [],
      behaviorCards: JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_CARDS)),
      trafficOverrides: {},
      seatingChart: [...DEFAULT_SEATING_CHART],
      lastModified: Date.now()
    };
    this.save();
  }

  // --- 教室座位表 (5行 x 6列 = 30格) ---
  getSeatingChart() {
    if (!this.data.seatingChart || !Array.isArray(this.data.seatingChart) || this.data.seatingChart.length !== 30) {
      this.data.seatingChart = [...DEFAULT_SEATING_CHART];
    }
    return this.data.seatingChart;
  }

  swapSeats(fromIdx, toIdx) {
    if (fromIdx < 0 || fromIdx >= 30 || toIdx < 0 || toIdx >= 30) return false;
    const chart = this.getSeatingChart();
    const temp = chart[fromIdx];
    chart[fromIdx] = chart[toIdx];
    chart[toIdx] = temp;
    this.save();
    return true;
  }

  setSeatStudent(idx, studentSeatNo) {
    if (idx < 0 || idx >= 30) return false;
    const chart = this.getSeatingChart();
    chart[idx] = studentSeatNo ? Number(studentSeatNo) : null;
    this.save();
    return true;
  }

  randomizeSeats() {
    const activeSeatNos = this.data.students.map(s => s.seatNo);
    for (let i = activeSeatNos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeSeatNos[i], activeSeatNos[j]] = [activeSeatNos[j], activeSeatNos[i]];
    }
    const newChart = [];
    for (let i = 0; i < 30; i++) {
      newChart.push(i < activeSeatNos.length ? activeSeatNos[i] : null);
    }
    this.data.seatingChart = newChart;
    this.save();
    return newChart;
  }

  resetSeatingChart() {
    this.data.seatingChart = [...DEFAULT_SEATING_CHART];
    this.save();
    return this.data.seatingChart;
  }

  // 批次更新學生姓名
  batchUpdateNames(nameArray) {
    if (!Array.isArray(nameArray)) return;
    nameArray.forEach((name, index) => {
      const seatNo = index + 1;
      const cleanName = name.trim();
      if (!cleanName) return;

      const existing = this.data.students.find(s => s.seatNo === seatNo);
      if (existing) {
        existing.name = cleanName;
      } else {
        this.data.students.push({
          id: Date.now() + index,
          seatNo,
          name: cleanName,
          title: "皇家大臣",
          birthday: "0101",
          points: 50,
          petType: "dragon",
          petExp: 50
        });
      }
    });

    this.data.students = this.data.students.slice(0, Math.max(27, nameArray.length));
    this.data.students.sort((a, b) => a.seatNo - b.seatNo);
    this.save();
  }

  // 批次更新學生生日 (密碼)
  batchUpdateBirthdays(bdayArray) {
    if (!Array.isArray(bdayArray)) return;
    bdayArray.forEach((bday, index) => {
      const seatNo = index + 1;
      const cleanBday = bday.trim();
      if (!cleanBday) return;
      const student = this.data.students.find(s => s.seatNo === seatNo);
      if (student) {
        student.birthday = cleanBday;
      }
    });
    this.save();
  }

  // 批次更新大臣幹部名稱 (官職)
  batchUpdateTitles(titleArray) {
    if (!Array.isArray(titleArray)) return;
    titleArray.forEach((title, index) => {
      const seatNo = index + 1;
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      const student = this.data.students.find(s => s.seatNo === seatNo);
      if (student) {
        student.title = cleanTitle;
      }
    });
    this.save();
  }

  // 批次重置全班點數
  batchResetPoints(targetPoints = 0, clearLogs = false) {
    this.data.students.forEach(st => {
      st.points = targetPoints;
    });
    if (clearLogs) {
      this.data.pointLogs = [];
    } else {
      this.data.pointLogs.unshift({
        id: Date.now(),
        studentId: 'all',
        points: targetPoints,
        reason: `👑 皇后重置全班大臣金幣為 ${targetPoints} 點`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5)
      });
    }
    this.save();
  }

  // 單獨重置某位學生點數
  resetSingleStudentPoints(studentId, targetPoints = 0) {
    const student = this.data.students.find(s => s.id === studentId);
    if (!student) return;
    student.points = targetPoints;
    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: student.id,
      points: targetPoints,
      reason: `重置 ${student.name} 金幣為 ${targetPoints} 點`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });
    this.save();
  }

  // --- 作業常用快捷範本管理 (老師可自由自訂國習、造詞等快捷) ---
  addHomeworkPreset({ subject = "國語", name, fullName, defaultDesc = "" }) {
    if (!this.data.homeworkPresets) this.data.homeworkPresets = [];
    const newPreset = {
      id: `hwp-${Date.now()}`,
      subject: (subject || "國語").trim(),
      name: (name || "").trim(),
      fullName: (fullName || name || "").trim(),
      defaultDesc: (defaultDesc || "").trim()
    };
    this.data.homeworkPresets.push(newPreset);
    this.save();
    return newPreset;
  }

  deleteHomeworkPreset(presetId) {
    if (!this.data.homeworkPresets) return;
    this.data.homeworkPresets = this.data.homeworkPresets.filter(p => p.id !== presetId);
    this.save();
  }

  // --- 常規卡牌發布事由快捷管理 (老師可自訂新增/刪除事由) ---
  addBehaviorReason({ type = "reflection", label, text }) {
    if (!this.data.behaviorReasons) this.data.behaviorReasons = [];
    const newReason = {
      id: `br-${Date.now()}`,
      type: type || "reflection",
      label: (label || "").trim(),
      text: (text || label || "").trim()
    };
    this.data.behaviorReasons.push(newReason);
    this.save();
    return newReason;
  }

  deleteBehaviorReason(reasonId) {
    if (!this.data.behaviorReasons) return;
    this.data.behaviorReasons = this.data.behaviorReasons.filter(r => r.id !== reasonId);
    this.save();
  }

  // --- 獎勵兌換卡牌管理 (教師可編輯、設定點數、學生兌換) ---
  addRewardCard({ title, cost, icon = "🎁", desc = "", category = "班級特權" }) {
    if (!this.data.rewardCards) this.data.rewardCards = [];
    const newCard = {
      id: `rc-${Date.now()}`,
      title: title.trim(),
      cost: parseInt(cost, 10) || 10,
      icon: icon.trim() || "🎁",
      desc: desc.trim(),
      category: category.trim() || "班級特權"
    };
    this.data.rewardCards.push(newCard);
    this.save();
    return newCard;
  }

  updateRewardCard(cardId, { title, cost, icon, desc, category }) {
    if (!this.data.rewardCards) return null;
    const card = this.data.rewardCards.find(c => c.id === cardId);
    if (!card) return null;
    if (title !== undefined) card.title = title.trim();
    if (cost !== undefined) card.cost = parseInt(cost, 10);
    if (icon !== undefined) card.icon = icon.trim();
    if (desc !== undefined) card.desc = desc.trim();
    if (category !== undefined) card.category = category.trim();
    this.save();
    return card;
  }

  deleteRewardCard(cardId) {
    if (!this.data.rewardCards) return;
    this.data.rewardCards = this.data.rewardCards.filter(c => c.id !== cardId);
    this.save();
  }

  redeemCard(studentId, cardId) {
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (!student) throw new Error("找不到該大臣！");
    const card = (this.data.rewardCards || []).find(c => c.id === cardId);
    if (!card) throw new Error("找不到該獎勵卡！");
    if (student.points < card.cost) {
      throw new Error(`金幣不足！大臣目前有 ${student.points} 點，兌換【${card.title}】需要 ${card.cost} 點。`);
    }

    // 扣除點數
    student.points -= card.cost;

    // 記功簿日誌
    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: student.id,
      points: -card.cost,
      reason: `🎁 兌換獎勵卡【${card.title}】`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });

    // 兌換紀錄庫
    if (!this.data.rewardRedemptions) this.data.rewardRedemptions = [];
    const record = {
      id: `red-${Date.now()}`,
      studentId: student.id,
      seatNo: student.seatNo,
      studentName: student.name,
      cardId: card.id,
      cardTitle: card.title,
      cost: card.cost,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5),
      used: false
    };
    this.data.rewardRedemptions.unshift(record);
    this.save();
    return record;
  }

  toggleRedemptionStatus(redemptionId) {
    if (!this.data.rewardRedemptions) return;
    const rec = this.data.rewardRedemptions.find(r => r.id === redemptionId);
    if (rec) {
      rec.used = !rec.used;
      this.save();
    }
  }

  // --- 同時選擇多位學生進行批次加扣點 ---
  batchAwardMultipleStudents(studentIds, points, reason = "課堂嘉獎") {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return [];
    const pts = parseInt(points, 10);
    if (isNaN(pts)) return [];

    const updatedStudents = [];
    studentIds.forEach(id => {
      const student = this.data.students.find(s => s.id === id || s.seatNo === id);
      if (student) {
        student.points = Math.max(0, (student.points || 0) + pts);
        updatedStudents.push(student);
      }
    });

    if (updatedStudents.length > 0) {
      const namesStr = updatedStudents.length <= 5 
        ? updatedStudents.map(s => `${String(s.seatNo).padStart(2, '0')}.${s.name}`).join('、')
        : `${updatedStudents.length} 位大臣 (${updatedStudents.slice(0, 3).map(s => s.name).join('、')}等)`;

      this.data.pointLogs.unshift({
        id: Date.now(),
        studentId: updatedStudents.length === 1 ? updatedStudents[0].id : 'multi',
        points: pts,
        reason: `${reason} 【對象：${namesStr}】`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5)
      });

      this.save();
    }
    return updatedStudents;
  }

  // --- 紅綠燈與行為卡牌管理 (座位自省卡、愛班服務卡) ---
  setReflectionCard(studentId, active, reason = "") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = { reflectionCard: false, reflectionReason: "", serviceCard: false, serviceReason: "" };
    }
    this.data.behaviorCards[studentId].reflectionCard = !!active;
    if (reason) this.data.behaviorCards[studentId].reflectionReason = reason;
    this.save();
  }

  setServiceCard(studentId, active, reason = "") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = { reflectionCard: false, reflectionReason: "", serviceCard: false, serviceReason: "" };
    }
    this.data.behaviorCards[studentId].serviceCard = !!active;
    if (reason) this.data.behaviorCards[studentId].serviceReason = reason;
    this.save();
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
    const att = (this.data.attendance[today] && (this.data.attendance[today][sId] || this.data.attendance[today][seatNo])) || { status: 'present' };

    // 1. 若今日請假：定為請假，則嚴格豁免！絕不頒發愛班卡
    if (att.status === 'leave') {
      return {
        student,
        light: 'leave',
        label: '🏖️ 請假在府',
        shortReason: '今日請假',
        badgeClass: 'badge-leave',
        cardClass: 'border-slate-300 bg-slate-100/90 text-slate-500',
        desc: '今日告假休養中，免查下課通行',
        hasReflection: false,
        reflectionReason: '',
        hasService: false, // 嚴格豁免！請假絕不頒發愛班卡
        serviceReason: '',
        missingList: [],
        revisionList: [],
        lateList: [],
        isLate: false
      };
    }

    // 2. 愛班服務卡判定：
    // 規則：超過 07:40 未打卡者，系統直接頒發愛班卡（下課留班補打掃）；定為請假則不頒發
    const bCard = (this.data.behaviorCards && (this.data.behaviorCards[sId] || this.data.behaviorCards[seatNo])) || {};
    const hasManualReflection = !!bCard.reflectionCard;
    const reflectionReason = bCard.reflectionReason || '';
    const hasManualService = !!bCard.serviceCard;

    const isLateCheckIn = att.status === 'late';
    // 若無打卡紀錄且非請假，或打卡時間超過 07:40
    const isUncheckedLate = (!att.checkInTime && att.status !== 'present');
    const autoServiceFromLate = isLateCheckIn || isUncheckedLate;
    const hasService = hasManualService || autoServiceFromLate;
    const serviceReason = bCard.serviceReason || (isLateCheckIn ? '超過07:40未打卡（留班補打掃）' : (isUncheckedLate ? '超過07:40未打卡（留班補打掃）' : '愛班服務勞動'));

    // 3. 檢查今日各項作業繳交情形 (支援 submitted, late, revision, pending)
    const missingList = [];
    const revisionList = [];
    const lateList = [];

    (this.data.homework || []).forEach(hw => {
      const rec = (hw.records && (hw.records[seatNo] !== undefined ? hw.records[seatNo] : hw.records[sId])) || 'pending';
      if (rec === 'pending' || rec === 'missing') {
        missingList.push(hw);
      } else if (rec === 'revision') {
        revisionList.push(hw);
      } else if (rec === 'late') {
        lateList.push(hw);
      }
    });

    // 取得作業極簡稱謂 (如國習、數習、造詞、自習、社習等，大螢幕排版俐落)
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
        hasReflection: hasManualReflection,
        reflectionReason,
        hasService,
        serviceReason,
        missingList,
        revisionList,
        lateList,
        isLate: isLateCheckIn,
        isOverridden: true
      };
    }

    // 依使用者指示嚴格判定：
    // A. 作業未繳交或是上課表現不佳有座位自省卡者 -> 紅燈 (需在座位上反省)
    // 大螢幕規格：僅紅燈及黃燈需顯示無法下課之理由
    if (hasManualReflection || missingList.length > 0) {
      const reasons = [];
      if (missingList.length > 0) {
        reasons.push(missingList.map(h => `${getShortHwName(h)}未交`).join('、'));
      }
      if (hasManualReflection) {
        reasons.push(reflectionReason ? `座位自省(${reflectionReason})` : '座位自省');
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
        hasReflection: hasManualReflection,
        reflectionReason,
        hasService,
        serviceReason,
        missingList,
        revisionList,
        lateList,
        isLate: isLateCheckIn
      };
    }

    // B. 若是有待訂正的項目 -> 黃燈 (需先完成訂正)
    if (revisionList.length > 0) {
      const shortReason = revisionList.map(h => `${getShortHwName(h)}訂正未繳交`).join('、');
      return {
        student,
        light: 'yellow',
        label: `🟡 黃燈 (${shortReason})`,
        shortReason,
        badgeClass: 'badge-late',
        cardClass: 'traffic-card-yellow',
        desc: `⚠️ 無法下課原因：${shortReason}`,
        hasReflection: false,
        reflectionReason: '',
        hasService,
        serviceReason,
        missingList: [],
        revisionList,
        lateList,
        isLate: isLateCheckIn
      };
    }

    // C. 若是所有作業皆按時/遲交繳交且上課表現優良 -> 綠燈 (可以下課)
    // 綠燈直接顯示紅綠燈，無須冗長理由！
    return {
      student,
      light: 'green',
      label: '🟢 准許下課',
      shortReason: '',
      badgeClass: 'badge-present',
      cardClass: 'traffic-card-green',
      desc: '✨ 作業全齊・表現優良，准予暢行王國！',
      hasReflection: false,
      reflectionReason: '',
      hasService,
      serviceReason,
      missingList: [],
      revisionList,
      lateList,
      isLate: isLateCheckIn
    };
  }
}

const store = new KingdomStore();

// ===================================================================
// 3. 神獸進化計算與 SVG 繪製引擎
// ===================================================================
function getPetStatus(petType, points) {
  const def = PET_DEFINITIONS[petType] || PET_DEFINITIONS.dragon;
  const stages = def.stages;
  let currentStageIndex = 0;

  for (let i = stages.length - 1; i >= 0; i--) {
    if (points >= stages[i].min) {
      currentStageIndex = i;
      break;
    }
  }

  const currentStage = stages[currentStageIndex];
  const nextStage = stages[currentStageIndex + 1] || null;
  const currentMin = currentStage.min;
  const nextMin = nextStage ? nextStage.min : currentMin + 100;
  const progressPercent = nextStage 
    ? Math.min(100, Math.max(0, Math.round(((points - currentMin) / (nextMin - currentMin)) * 100)))
    : 100;

  return {
    defName: def.name,
    element: def.element,
    stageIndex: currentStageIndex + 1,
    maxStages: stages.length,
    stageTitle: currentStage.title,
    stageIcon: currentStage.icon,
    stageColor: currentStage.color,
    desc: currentStage.desc,
    progressPercent,
    currentPoints: points,
    nextThreshold: nextStage ? nextStage.min : null,
    isMaxStage: !nextStage
  };
}

function renderPetSVG(petType, stageIndex) {
  switch(petType) {
    case 'dragon': return renderDragonSVG(stageIndex);
    case 'unicorn': return renderUnicornSVG(stageIndex);
    case 'cat': return renderCatSVG(stageIndex);
    case 'lion':
    default: return renderLionSVG(stageIndex);
  }
}

function renderDragonSVG(stage) {
  if (stage === 1) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <defs>
          <radialGradient id="eggGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fdba74" />
            <stop offset="60%" stop-color="#ea580c" />
            <stop offset="100%" stop-color="#9a3412" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="140" rx="45" ry="12" fill="#d97706" opacity="0.25" />
        <ellipse cx="80" cy="85" rx="46" ry="56" fill="url(#eggGrad)" />
        <path d="M 65 75 Q 80 50 95 75 T 75 110" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round" />
        <ellipse cx="62" cy="60" rx="10" ry="16" fill="#ffffff" opacity="0.45" transform="rotate(-20 62 60)" />
      </svg>
    `;
  } else if (stage === 2) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <ellipse cx="80" cy="142" rx="42" ry="10" fill="#d97706" opacity="0.25" />
        <path d="M 45 80 Q 20 60 35 95 Z" fill="#c2410c" />
        <path d="M 115 80 Q 140 60 125 95 Z" fill="#c2410c" />
        <ellipse cx="80" cy="98" rx="36" ry="38" fill="#ea580c" />
        <ellipse cx="80" cy="104" rx="24" ry="26" fill="#fed7aa" />
        <polygon points="62,60 55,42 70,55" fill="#f59e0b" />
        <polygon points="98,60 105,42 90,55" fill="#f59e0b" />
        <circle cx="80" cy="72" r="32" fill="#ea580c" />
        <ellipse cx="68" cy="68" rx="7" ry="9" fill="#1e293b" />
        <ellipse cx="92" cy="68" rx="7" ry="9" fill="#1e293b" />
        <circle cx="66" cy="65" r="3" fill="#ffffff" />
        <circle cx="90" cy="65" r="3" fill="#ffffff" />
        <ellipse cx="60" cy="78" rx="5" ry="3" fill="#fda4af" />
        <ellipse cx="100" cy="78" rx="5" ry="3" fill="#fda4af" />
        <path d="M 76 80 Q 80 85 84 80" fill="none" stroke="#7c2d12" stroke-width="2" />
      </svg>
    `;
  } else if (stage === 3) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-lg">
        <ellipse cx="80" cy="144" rx="50" ry="12" fill="#d97706" opacity="0.3" />
        <path d="M 40 75 Q 5 35 15 85 Q 35 95 45 90 Z" fill="#b91c1c" />
        <path d="M 120 75 Q 155 35 145 85 Q 125 95 115 90 Z" fill="#b91c1c" />
        <ellipse cx="80" cy="100" rx="38" ry="40" fill="#dc2626" />
        <path d="M 70 85 Q 80 80 90 85 L 85 130 Q 80 135 75 130 Z" fill="#fde047" />
        <polygon points="58,52 42,28 66,45" fill="#f59e0b" />
        <polygon points="102,52 118,28 94,45" fill="#f59e0b" />
        <ellipse cx="80" cy="65" rx="34" ry="28" fill="#dc2626" />
        <polygon points="62,60 74,65 64,68" fill="#fef08a" />
        <polygon points="98,60 86,65 96,68" fill="#fef08a" />
        <circle cx="68" cy="64" r="2.5" fill="#000" />
        <circle cx="92" cy="64" r="2.5" fill="#000" />
      </svg>
    `;
  } else {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-xl">
        <circle cx="80" cy="80" r="70" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="8 4" />
        <path d="M 35 70 Q -5 20 10 90 Q 30 110 45 95 Z" fill="#991b1b" />
        <path d="M 125 70 Q 165 20 150 90 Q 130 110 115 95 Z" fill="#991b1b" />
        <polygon points="70,30 80,15 90,30 98,22 92,36 68,36 62,22" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
        <ellipse cx="80" cy="102" rx="40" ry="40" fill="#b91c1c" />
        <circle cx="80" cy="62" r="34" fill="#b91c1c" />
        <polygon points="80,88 95,105 80,128 65,105" fill="#f59e0b" stroke="#fef08a" stroke-width="2" />
        <ellipse cx="66" cy="58" rx="8" ry="6" fill="#fde047" />
        <ellipse cx="94" cy="58" rx="8" ry="6" fill="#fde047" />
        <circle cx="66" cy="58" rx="3" ry="5" fill="#78350f" />
        <circle cx="94" cy="58" rx="3" ry="5" fill="#78350f" />
      </svg>
    `;
  }
}

function renderUnicornSVG(stage) {
  if (stage === 1) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <defs>
          <radialGradient id="uniEgg" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fbcfe8" />
            <stop offset="60%" stop-color="#f472b6" />
            <stop offset="100%" stop-color="#db2777" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="140" rx="42" ry="12" fill="#d97706" opacity="0.2" />
        <ellipse cx="80" cy="85" rx="46" ry="56" fill="url(#uniEgg)" />
        <path d="M 60 70 Q 80 90 100 70" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round" />
        <polygon points="80,35 84,45 76,45" fill="#facc15" />
      </svg>
    `;
  } else if (stage === 2) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <ellipse cx="80" cy="138" rx="50" ry="14" fill="#e0f2fe" opacity="0.8" />
        <ellipse cx="80" cy="102" rx="34" ry="32" fill="#fdf2f8" stroke="#fbcfe8" stroke-width="2" />
        <polygon points="80,30 84,52 76,52" fill="#facc15" stroke="#eab308" stroke-width="1.5" />
        <circle cx="80" cy="70" r="28" fill="#fdf2f8" stroke="#fbcfe8" stroke-width="2" />
        <path d="M 68 46 Q 60 65 65 78" fill="none" stroke="#f472b6" stroke-width="6" stroke-linecap="round" />
        <circle cx="70" cy="68" r="6" fill="#3b0764" />
        <circle cx="90" cy="68" r="6" fill="#3b0764" />
        <circle cx="68" cy="66" r="2" fill="#ffffff" />
        <circle cx="88" cy="66" r="2" fill="#ffffff" />
      </svg>
    `;
  } else if (stage === 3) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-lg">
        <ellipse cx="80" cy="142" rx="46" ry="12" fill="#d97706" opacity="0.2" />
        <path d="M 45 80 Q 15 50 25 100 Q 45 105 50 90 Z" fill="#fce7f3" stroke="#f472b6" stroke-width="1.5" />
        <path d="M 115 80 Q 145 50 135 100 Q 115 105 110 90 Z" fill="#fce7f3" stroke="#f472b6" stroke-width="1.5" />
        <ellipse cx="80" cy="98" rx="36" ry="36" fill="#ffffff" stroke="#f472b6" stroke-width="2" />
        <polygon points="80,20 86,52 74,52" fill="#f59e0b" />
        <circle cx="80" cy="68" r="30" fill="#ffffff" stroke="#f472b6" stroke-width="2" />
        <path d="M 62 45 Q 52 70 58 92" fill="none" stroke="#ec4899" stroke-width="5" stroke-linecap="round" />
        <ellipse cx="72" cy="68" rx="5" ry="7" fill="#4c1d95" />
        <ellipse cx="92" cy="68" rx="5" ry="7" fill="#4c1d95" />
      </svg>
    `;
  } else {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-xl">
        <circle cx="80" cy="80" r="72" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="6 3" />
        <path d="M 40 75 Q -8 30 15 105 Q 40 115 50 95 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="2" />
        <path d="M 120 75 Q 168 30 145 105 Q 120 115 110 95 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="2" />
        <polygon points="80,10 86,46 74,46" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
        <ellipse cx="80" cy="100" rx="38" ry="38" fill="#ffffff" stroke="#db2777" stroke-width="2" />
        <circle cx="80" cy="65" r="32" fill="#ffffff" stroke="#db2777" stroke-width="2" />
        <path d="M 60 95 Q 80 112 100 95" stroke="#fbbf24" stroke-width="4" fill="none" />
      </svg>
    `;
  }
}

function renderCatSVG(stage) {
  if (stage === 1) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <defs>
          <radialGradient id="catEgg" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#c4b5fd" />
            <stop offset="60%" stop-color="#8b5cf6" />
            <stop offset="100%" stop-color="#5b21b6" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="140" rx="42" ry="12" fill="#d97706" opacity="0.2" />
        <ellipse cx="80" cy="85" rx="46" ry="56" fill="url(#catEgg)" />
        <path d="M 60 75 Q 80 55 100 75 Q 80 95 60 75" fill="none" stroke="#ddd6fe" stroke-width="3" />
      </svg>
    `;
  } else if (stage === 2) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <ellipse cx="80" cy="140" rx="40" ry="10" fill="#d97706" opacity="0.2" />
        <polygon points="80,22 62,56 98,56" fill="#4c1d95" />
        <circle cx="80" cy="74" r="30" fill="#8b5cf6" />
        <ellipse cx="80" cy="108" rx="34" ry="30" fill="#7c3aed" />
        <ellipse cx="68" cy="72" rx="7" ry="8" fill="#10b981" />
        <ellipse cx="92" cy="72" rx="7" ry="8" fill="#10b981" />
        <polygon points="80,78 77,81 83,81" fill="#f43f5e" />
      </svg>
    `;
  } else if (stage === 3) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-lg">
        <ellipse cx="80" cy="142" rx="44" ry="11" fill="#d97706" opacity="0.2" />
        <circle cx="80" cy="68" r="32" fill="#7c3aed" />
        <polygon points="54,50 42,30 68,42" fill="#6d28d9" stroke="#facc15" stroke-width="1.5" />
        <polygon points="106,50 118,30 92,42" fill="#6d28d9" stroke="#facc15" stroke-width="1.5" />
        <ellipse cx="68" cy="68" rx="7" ry="8" fill="#fbbf24" />
        <ellipse cx="92" cy="68" rx="7" ry="8" fill="#fbbf24" />
        <circle cx="80" cy="115" r="14" fill="#38bdf8" opacity="0.85" />
      </svg>
    `;
  } else {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-xl">
        <circle cx="80" cy="80" r="70" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="8 4" />
        <polygon points="65,36 80,18 95,36 102,28 98,42 62,42 58,28" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
        <circle cx="80" cy="66" r="34" fill="#6b21a8" />
        <ellipse cx="80" cy="105" rx="38" ry="32" fill="#581c87" stroke="#facc15" stroke-width="2" />
        <ellipse cx="68" cy="66" rx="8" ry="9" fill="#facc15" />
        <ellipse cx="92" cy="66" rx="8" ry="9" fill="#facc15" />
      </svg>
    `;
  }
}

function renderLionSVG(stage) {
  if (stage === 1) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <defs>
          <radialGradient id="lionEgg" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="60%" stop-color="#eab308" />
            <stop offset="100%" stop-color="#a16207" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="140" rx="42" ry="12" fill="#d97706" opacity="0.2" />
        <ellipse cx="80" cy="85" rx="46" ry="56" fill="url(#lionEgg)" />
        <polygon points="80,60 92,72 80,84 68,72" fill="#ca8a04" />
      </svg>
    `;
  } else if (stage === 2) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <ellipse cx="80" cy="140" rx="42" ry="10" fill="#d97706" opacity="0.2" />
        <circle cx="80" cy="74" r="38" fill="#ca8a04" />
        <circle cx="56" cy="46" r="10" fill="#eab308" />
        <circle cx="104" cy="46" r="10" fill="#eab308" />
        <circle cx="80" cy="76" r="28" fill="#facc15" />
        <ellipse cx="80" cy="108" rx="34" ry="28" fill="#eab308" />
        <circle cx="70" cy="74" r="6" fill="#451a03" />
        <circle cx="90" cy="74" r="6" fill="#451a03" />
        <polygon points="80,80 77,83 83,83" fill="#991b1b" />
      </svg>
    `;
  } else if (stage === 3) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-lg">
        <ellipse cx="80" cy="142" rx="46" ry="12" fill="#d97706" opacity="0.2" />
        <path d="M 80 20 L 92 40 L 115 30 L 112 52 L 135 56 L 122 75 L 140 90 L 120 100 L 125 120 L 100 115 L 80 130 L 60 115 L 35 120 L 40 100 L 20 90 L 38 75 L 25 56 L 48 52 L 45 30 L 68 40 Z" fill="#b45309" />
        <circle cx="80" cy="74" r="32" fill="#f59e0b" />
        <ellipse cx="80" cy="106" rx="36" ry="30" fill="#d97706" />
        <ellipse cx="68" cy="74" rx="7" ry="8" fill="#fef08a" />
        <ellipse cx="92" cy="74" rx="7" ry="8" fill="#fef08a" />
      </svg>
    `;
  } else {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-xl">
        <circle cx="80" cy="80" r="72" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="10 5" />
        <circle cx="80" cy="74" r="44" fill="#b45309" />
        <polygon points="66,32 80,14 94,32 102,24 98,38 62,38 58,24" fill="#fef08a" stroke="#b45309" stroke-width="2" />
        <circle cx="80" cy="76" r="32" fill="#fbbf24" />
        <ellipse cx="80" cy="108" rx="38" ry="32" fill="#d97706" stroke="#fef08a" stroke-width="2" />
        <ellipse cx="68" cy="72" rx="7" ry="8" fill="#ffffff" />
        <ellipse cx="92" cy="72" rx="7" ry="8" fill="#ffffff" />
      </svg>
    `;
  }
}

// ===================================================================
// 4. 音效生成器 (Web Audio API Synthesizer)
// ===================================================================
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

    if (typeof window !== 'undefined') {
      this.checkUrlParams();
      window.addEventListener('focus', () => {
        if (this.config.autoPull && this.config.enabled) {
          this.pull({ silent: true });
        }
      });
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

  saveConfig(newConfig) {
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

  getLocalApiUrl() {
    const account = encodeURIComponent(this.config.googleAccount || 'xining502@gmail.com');
    return `/api/sync?account=${account}`;
  }

  startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (!this.config.enabled || !this.config.autoPull) return;
    const intervalMs = Math.max(15, this.config.intervalSec || 25) * 1000;
    this.pollInterval = setInterval(() => {
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
    const isLocalHost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^192\.168\./.test(window.location.hostname));

    return {
      status: this.syncStatus,
      lastSyncTime: this.lastSyncTime,
      lastError: this.lastError,
      enabled: this.config.enabled,
      googleAccount: this.config.googleAccount || 'xining502@gmail.com',
      syncKey: this.config.googleAccount || 'xining502@gmail.com',
      googleScriptUrl: this.config.googleScriptUrl || '',
      isLocalHost: isLocalHost
    };
  }

  schedulePush() {
    if (!this.config.enabled) return;
    if (this.pushTimeout) clearTimeout(this.pushTimeout);
    this.pushTimeout = setTimeout(() => {
      this.push({ silent: true });
    }, 1500);
  }

  async push({ silent = false } = {}) {
    if (!this.config.enabled) return { success: false, message: '雲端同步未啟用' };
    this.syncStatus = 'syncing';
    this.notify();

    let pushedToAny = false;
    let pushError = null;
    const payload = JSON.stringify(this.store.data);
    const account = this.config.googleAccount || 'xining502@gmail.com';

    // 1. 若運行於本機伺服器或區網 (localhost / 192.168.x.x)，推送到 local /api/sync
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^192\.168\./.test(window.location.hostname));
    
    if (isLocal) {
      try {
        const localRes = await fetch(this.getLocalApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });
        if (localRes.ok) pushedToAny = true;
      } catch (err) {
        console.warn('[CloudSync] 本地區網推送失敗:', err);
      }
    }

    // 2. 若有設定 Google Apps Script Web App 網址，推送到 Google 雲端
    if (this.config.googleScriptUrl) {
      try {
        await fetch(this.config.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            account: account,
            data: this.store.data
          })
        });
        pushedToAny = true;
      } catch (err) {
        pushError = err.message;
        console.warn('[CloudSync] Google 雲端推送失敗:', err);
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

  async pull({ silent = false } = {}) {
    if (!this.config.enabled) return { success: false, message: '雲端同步未啟用' };
    this.syncStatus = 'syncing';
    this.notify();

    const account = this.config.googleAccount || 'xining502@gmail.com';
    let remoteData = null;
    let pullError = null;

    // 1. 優先嘗試 Google Apps Script Web App (跨裝置、跨外網最佳)
    if (this.config.googleScriptUrl) {
      try {
        const gasUrl = `${this.config.googleScriptUrl}?account=${encodeURIComponent(account)}&action=pull&_t=${Date.now()}`;
        const res = await fetch(gasUrl, { cache: 'no-cache' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.students && Array.isArray(json.students)) {
            remoteData = json;
          }
        }
      } catch (err) {
        pullError = err.message;
        console.warn('[CloudSync] Google 雲端拉取失敗:', err);
      }
    }

    // 2. 若在本地區網環境且尚未取得遠端資料，從本地 /api/sync 讀取
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^192\.168\./.test(window.location.hostname));

    if (!remoteData && isLocal) {
      try {
        const localRes = await fetch(this.getLocalApiUrl(), { cache: 'no-cache' });
        if (localRes.ok) {
          const json = await localRes.json();
          if (json && json.students && Array.isArray(json.students)) {
            remoteData = json;
          }
        }
      } catch (err) {
        console.warn('[CloudSync] 本地區網拉取失敗:', err);
      }
    }

    if (remoteData) {
      const remoteTime = remoteData.lastModified || 0;
      const localTime = this.store.data.lastModified || 0;

      if (!silent || remoteTime > localTime) {
        this.store.data = remoteData;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store.data));
        }
        if (typeof window !== 'undefined' && window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
          window.KingdomUI.refreshCurrentView();
        }
      }

      this.syncStatus = 'success';
      this.lastSyncTime = new Date();
      this.lastError = null;
      this.notify();
      return { success: true, timestamp: this.lastSyncTime, updated: remoteTime > localTime };
    } else {
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
          if (typeof window !== 'undefined' && window.KingdomUI && typeof window.KingdomUI.refreshCurrentView === 'function') {
            window.KingdomUI.refreshCurrentView();
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
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const account = encodeURIComponent(this.config.googleAccount || 'xining502@gmail.com');
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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#f59e0b', '#fbbf24', '#e11d48', '#10b981']
    });
  }
}

if (typeof window !== 'undefined') {
  window.KingdomApp = {
    store,
    sound,
    cloudSync,
    getPetStatus,
    renderPetSVG,
    triggerConfetti,
    getTodayDateString,
    PET_DEFINITIONS,
    DEFAULT_STUDENTS_27,
    DEFAULT_CONTACT_BOOK,
    DEFAULT_HOMEWORK_PRESETS,
    DEFAULT_BEHAVIOR_REASONS,
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
    DEFAULT_STUDENTS_27,
    DEFAULT_SEATING_CHART,
    DEFAULT_CONTACT_BOOK,
    DEFAULT_HOMEWORK_PRESETS,
    DEFAULT_BEHAVIOR_REASONS
  };
}

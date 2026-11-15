/**
 * 西寧國小五年二班 ‧ 西寧小小兵王國 (27人旗艦完整版)
 * 核心數據架構、可愛守護動物九大神獸 (五階金化進化)、雲端即時同步、歷史紀錄與狀態管理
 */

// ============================================================================
// 1. 27位大臣初始名冊資料 (支援雙軌金幣制度：可用金幣 points 與生涯累積總額 lifetimePoints)
// ============================================================================
const DEFAULT_STUDENTS_27 = [
  { id: 1, seatNo: 1, name: "王品捷", gender: "M", title: "內閣首輔大臣", birthday: "0315", points: 85, lifetimePoints: 85, animalType: "lion", petType: "lion", petExp: 85 },
  { id: 2, seatNo: 2, name: "李宇軒", gender: "M", title: "皇家騎士團長", birthday: "0520", points: 160, lifetimePoints: 160, animalType: "dog", petType: "dog", petExp: 160 },
  { id: 3, seatNo: 3, name: "林冠廷", gender: "M", title: "國庫財政大臣", birthday: "0812", points: 210, lifetimePoints: 210, animalType: "cat", petType: "cat", petExp: 210 },
  { id: 4, seatNo: 4, name: "張宸睿", gender: "M", title: "宮廷禮儀大臣", birthday: "1104", points: 65, lifetimePoints: 65, animalType: "rabbit", petType: "rabbit", petExp: 65 },
  { id: 5, seatNo: 5, name: "陳奕安", gender: "M", title: "皇家文書大臣", birthday: "0228", points: 130, lifetimePoints: 130, animalType: "bear", petType: "bear", petExp: 130 },
  { id: 6, seatNo: 6, name: "黃柏瀚", gender: "M", title: "奇蹟魔法大臣", birthday: "0709", points: 310, lifetimePoints: 310, animalType: "penguin", petType: "penguin", petExp: 310 },
  { id: 7, seatNo: 7, name: "楊子賢", gender: "M", title: "守護壁壘大將", birthday: "0923", points: 95, lifetimePoints: 95, animalType: "owl", petType: "owl", petExp: 95 },
  { id: 8, seatNo: 8, name: "趙偉豪", gender: "M", title: "皇家圖書大臣", birthday: "0416", points: 145, lifetimePoints: 145, animalType: "fox", petType: "fox", petExp: 145 },
  { id: 9, seatNo: 9, name: "劉承佑", gender: "M", title: "生態綠意大臣", birthday: "1205", points: 50, lifetimePoints: 50, animalType: "hamster", petType: "hamster", petExp: 50 },
  { id: 10, seatNo: 10, name: "蔡秉恩", gender: "M", title: "國境先鋒騎士", birthday: "0630", points: 175, lifetimePoints: 175, animalType: "lion", petType: "lion", petExp: 175 },
  { id: 11, seatNo: 11, name: "吳宗翰", gender: "M", title: "皇家衛隊隊長", birthday: "0118", points: 115, lifetimePoints: 115, animalType: "dog", petType: "dog", petExp: 115 },
  { id: 12, seatNo: 12, name: "許翔宇", gender: "M", title: "智慧科技大臣", birthday: "1010", points: 240, lifetimePoints: 240, animalType: "cat", petType: "cat", petExp: 240 },
  { id: 13, seatNo: 13, name: "鄭予涵", gender: "F", title: "體育競技女將軍", birthday: "0403", points: 190, lifetimePoints: 190, animalType: "rabbit", petType: "rabbit", petExp: 190 },
  { id: 14, seatNo: 14, name: "謝孟庭", gender: "F", title: "藝術壁畫大臣", birthday: "0825", points: 155, lifetimePoints: 155, animalType: "bear", petType: "bear", petExp: 155 },
  { id: 15, seatNo: 15, name: "周語晴", gender: "F", title: "皇家音樂總監", birthday: "0614", points: 320, lifetimePoints: 320, animalType: "penguin", petType: "penguin", petExp: 320 },
  { id: 16, seatNo: 16, name: "郭心妍", gender: "F", title: "晨曦敲鐘官", birthday: "0329", points: 80, lifetimePoints: 80, animalType: "owl", petType: "owl", petExp: 80 },
  { id: 17, seatNo: 17, name: "曾詩涵", gender: "F", title: "皇家糧餉大臣", birthday: "1119", points: 125, lifetimePoints: 125, animalType: "fox", petType: "fox", petExp: 125 },
  { id: 18, seatNo: 18, name: "洪若菲", gender: "F", title: "萬國外交特使", birthday: "0508", points: 205, lifetimePoints: 205, animalType: "hamster", petType: "hamster", petExp: 205 },
  { id: 19, seatNo: 19, name: "邱品萱", gender: "F", title: "秩序執法女官", birthday: "0915", points: 140, lifetimePoints: 140, animalType: "lion", petType: "lion", petExp: 140 },
  { id: 20, seatNo: 20, name: "孫瑀恩", gender: "F", title: "歡樂慶典大臣", birthday: "0722", points: 165, lifetimePoints: 165, animalType: "dog", petType: "dog", petExp: 165 },
  { id: 21, seatNo: 21, name: "莊宜璇", gender: "F", title: "皇家天文占星官", birthday: "0107", points: 280, lifetimePoints: 280, animalType: "cat", petType: "cat", petExp: 280 },
  { id: 22, seatNo: 22, name: "賴采婕", gender: "F", title: "星光守望騎士", birthday: "1224", points: 90, lifetimePoints: 90, animalType: "rabbit", petType: "rabbit", petExp: 90 },
  { id: 23, seatNo: 23, name: "鍾佩芸", gender: "F", title: "皇宮環境大臣", birthday: "0214", points: 135, lifetimePoints: 135, animalType: "bear", petType: "bear", petExp: 135 },
  { id: 24, seatNo: 24, name: "方雅筑", gender: "F", title: "皇家廣播宣令官", birthday: "1002", points: 70, lifetimePoints: 70, animalType: "penguin", petType: "penguin", petExp: 70 },
  { id: 25, seatNo: 25, name: "羅晴文", gender: "F", title: "智慧博學顧問", birthday: "0606", points: 225, lifetimePoints: 225, animalType: "owl", petType: "owl", petExp: 225 },
  { id: 26, seatNo: 26, name: "簡宏宇", gender: "M", title: "皇家工務大臣", birthday: "0918", points: 110, lifetimePoints: 110, animalType: "fox", petType: "fox", petExp: 110 },
  { id: 27, seatNo: 27, name: "蘇品睿", gender: "M", title: "皇家巡察御史", birthday: "0425", points: 140, lifetimePoints: 140, animalType: "hamster", petType: "hamster", petExp: 140 }
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

// 預設行為登記原因庫
const DEFAULT_BEHAVIOR_REASONS = [
  { id: 'br_ref_1', type: 'reflection', label: '上課分心聊私事', text: '上課分心聊私事' },
  { id: 'br_ref_2', type: 'reflection', label: '未帶課堂學用品', text: '未帶課堂學用品' },
  { id: 'br_ref_3', type: 'reflection', label: '未經許可擅離位', text: '未經許可擅離位' },
  { id: 'br_ref_4', type: 'reflection', label: '走廊危險奔跑追逐', text: '走廊危險奔跑追逐' },
  { id: 'br_ref_5', type: 'reflection', label: '對師長同儕禮貌欠佳', text: '對師長同儕禮貌欠佳' },
  { id: 'br_srv_1', type: 'service', label: '超過07:40未打卡', text: '超過07:40未打卡（留班補打掃）' },
  { id: 'br_srv_2', type: 'service', label: '個人座位周遭整潔不佳', text: '個人座位周遭整潔不佳' },
  { id: 'br_srv_3', type: 'service', label: '打掃責任區未落實', text: '打掃責任區未落實' },
  { id: 'br_srv_4', type: 'service', label: '忘記抽屜與置物櫃清空', text: '忘記抽屜與置物櫃清空' },
  { id: 'br_srv_5', type: 'service', label: '公物使用後未歸位', text: '公物使用後未歸位' }
];

// 預設教室座位表 (5行 x 6列 = 30格)
const DEFAULT_SEATING_CHART = [
  1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24,
  25, 26, 27, null, null, null
];

// 預設今日聯絡簿資料
const DEFAULT_CONTACT_BOOK = {
  date: "2026-11-16",
  homeworkItems: [
    "1. 國語習作第 八 課完成",
    "2. 數學習作 P.62 ~ P.65",
    "3. 訂正國語隨堂生字本",
    "4. 閱讀課外讀物 20 分鐘並簽名"
  ],
  reminders: [
    "明天有體育課，請穿著西寧王國運動服與運動鞋",
    "請帶自然課觀察記錄本與彩色筆",
    "記得帶水壺與跳繩"
  ],
  queenMotto: "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"
};

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
    desc: "象徵勇氣、正義與領導力，鬃毛如烈陽般耀眼。",
    stages: [
      { min: 0, title: "萌萌幼獅蛋", icon: "🥚", desc: "散發溫暖陽光微熱的金紋神蛋。" },
      { min: 30, title: "活潑小萌獅", icon: "🦁", desc: "搖頭晃腦的小獅子，練習咆哮時萌翻全場！" },
      { min: 60, title: "英勇戰盾雄獅", icon: "🛡️", desc: "身披守護鎧甲，鬃毛泛起雷電守護同儕。" },
      { min: 100, title: "皇家百獸霸王", icon: "👑", desc: "頭戴王者金冠，威震四方的大臣守護神！" },
      { min: 150, title: "✨ 耀金太陽神聖巨獅", icon: "🌟", desc: "全身綻放純金聖光的無上神獅，達到金化頂點！" }
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
      { min: 0, title: "赤紅守望萌蛋", icon: "🥚", desc: "帶著可愛黑豆眉花紋的溫暖彩蛋。" },
      { min: 30, title: "歡樂搖尾幼柴", icon: "🐶", desc: "踩著快樂步伐，對每位大臣熱情打招呼！" },
      { min: 60, title: "皇家先鋒守衛犬", icon: "🛡️", desc: "繫著王國紅圍巾，敏銳守護班級每一寸榮譽。" },
      { min: 100, title: "忠義千總神犬將軍", icon: "👑", desc: "穿戴黃金披風，忠心耿耿的智勇戰將！" },
      { min: 150, title: "✨ 耀金天啟光明神犬", icon: "🌟", desc: "通體金光燦爛，踏雲而來的金色守護天使！" }
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
      { min: 0, title: "神秘符文毛球蛋", icon: "🥚", desc: "會發出神秘呼嚕呼嚕微光的紫色法術蛋。" },
      { min: 30, title: "魔法學徒小貓", icon: "🐱", desc: "戴著小巧法師帽，用貓爪監督功課寫作。" },
      { min: 60, title: "星夜靈動魔貓", icon: "🔮", desc: "眼眸中閃爍星辰秘法，身手矯健迅捷如風。" },
      { min: 100, title: "大賢者靈貓聖尊", icon: "👑", desc: "參透王國萬物知識的至高長老喵！" },
      { min: 150, title: "✨ 耀金萬星靈光神貓", icon: "🌟", desc: "全身披覆純金符文流光的永恆智慧神貓！" }
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
      { min: 0, title: "粉萌彩雲飛兔蛋", icon: "🥚", desc: "散發甜甜草莓香氣與星芒的柔軟彩蛋。" },
      { min: 30, title: "蹦跳小萌兔", icon: "🐰", desc: "長長的耳朵高高豎起，對王國大小事充滿好奇！" },
      { min: 60, title: "踏風逐星飛天兔", icon: "✨", desc: "腳踏微風長出夢幻光翼，跳躍速度冠絕王國。" },
      { min: 100, title: "月華星宮兔仙子", icon: "👑", desc: "手持星月魔杖，能為大臣帶來幸福與幸運！" },
      { min: 150, title: "✨ 耀金流光星月神兔", icon: "🌟", desc: "綻放純金璀璨光芒的至高金化神兔！" }
    ]
  },
  bear: {
    id: "bear",
    name: "沉穩棕熊",
    icon: "🐻",
    color: "#854d0e",
    bgGradient: "from-amber-600 to-yellow-800",
    desc: "象徵穩健、厚重與堅毅，是王國最堅固的後盾。",
    stages: [
      { min: 0, title: "泰山石紋雄蛋", icon: "🥚", desc: "沉穩如泰山、堅不可摧的厚重磐石蛋。" },
      { min: 30, title: "圓滾小頑熊", icon: "🐻", desc: "喜歡抱著蜂蜜罐打滾的憨厚小萌熊。" },
      { min: 60, title: "鋼鐵壁壘戰熊", icon: "🛡️", desc: "身披重裝鋼甲，為身邊夥伴擋下一切困難。" },
      { min: 100, title: "撼地大地熊王", icon: "👑", desc: "踏步地動山搖，威武雄壯的王國守護巨尊！" },
      { min: 150, title: "✨ 耀金神聖大地金熊", icon: "🌟", desc: "通體化為不滅純金，象徵永恆堅定毅力！" }
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
      { min: 0, title: "冰晶霜雪企鵝蛋", icon: "🥚", desc: "晶瑩剔透如藍寶石般的極地寒冰蛋。" },
      { min: 30, title: "搖擺小企鵝", icon: "🐧", desc: "肚子圓滾滾、走起路來左右搖擺的極地紳士！" },
      { min: 60, title: "極光巡防騎士", icon: "❄️", desc: "身披極光冰晶斗篷，能滑翔穿梭於風雪之中。" },
      { min: 100, title: "南極冰冠帝王", icon: "👑", desc: "統領冰原極境的威嚴帝王企鵝，冷靜睿智！" },
      { min: 150, title: "✨ 耀金極光萬華神皇", icon: "🌟", desc: "冰晶與純金交織出無盡金色聖光的終極神皇！" }
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
      { min: 0, title: "博學翡翠夜蛋", icon: "🥚", desc: "隱隱浮現古代智慧符文的青翠寶石蛋。" },
      { min: 30, title: "戴眼鏡小雛鷹", icon: "🦉", desc: "眨著大眼睛認真研讀奏章的博學小天才！" },
      { min: 60, title: "星夜羽翼導師", icon: "📜", desc: "手持智慧卷軸，隨時為大家指引解惑。" },
      { min: 100, title: "皇家首席大院士", icon: "👑", desc: "頭戴金絲桂冠，掌管王國圖書館的智慧尊者！" },
      { min: 150, title: "✨ 耀金全知天眼聖尊", icon: "🌟", desc: "散發不滅金光的洞察全知神鷹，智慧無雙！" }
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
      { min: 0, title: "火靈九尾朱蛋", icon: "🥚", desc: "燃燒著溫潤朱紅靈焰的神秘靈狐蛋。" },
      { min: 30, title: "調皮小萌狐", icon: "🦊", desc: "搖晃著大蓬鬆尾巴，機靈點子特別多！" },
      { min: 60, title: "幻術飛天靈狐", icon: "🔥", desc: "尾端帶有祥瑞靈火，身手飄逸神出鬼沒。" },
      { min: 100, title: "九天祥瑞九尾天狐", icon: "👑", desc: "九尾綻開若彩雲，象徵至高吉祥與智慧！" },
      { min: 150, title: "✨ 耀金太陰真靈神狐", icon: "🌟", desc: "通體純金祥雲繚繞的金化天界神狐！" }
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
      { min: 0, title: "黃金瓜子幸運蛋", icon: "🥚", desc: "圓滾滾如向日葵種子的金黃色希望之蛋。" },
      { min: 30, title: "塞滿腮幫小倉鼠", icon: "🐹", desc: "兩頰塞滿滿、努力跑跑滾輪的超可愛倉鼠！" },
      { min: 60, title: "勤奮農務小管家", icon: "🌾", desc: "戴著麥稈帽，最懂得替王國存糧與規劃！" },
      { min: 100, title: "萬庫金幣富貴神鼠", icon: "👑", desc: "坐在黃金寶箱上，象徵豐收滿滿的大功臣！" },
      { min: 150, title: "✨ 耀金百寶豐收金仙", icon: "🌟", desc: "全身鍍滿純金光華的福運招財金化倉鼠！" }
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

// 預設今日出席狀態 (1~27號)
const DEFAULT_ATTENDANCE = {
  [getTodayDateString()]: {
    1: { status: 'present', checkInTime: '07:28', note: '' },
    2: { status: 'present', checkInTime: '07:31', note: '' },
    3: { status: 'present', checkInTime: '07:33', note: '' },
    4: { status: 'present', checkInTime: '07:35', note: '' },
    5: { status: 'present', checkInTime: '07:38', note: '' },
    6: { status: 'present', checkInTime: '07:25', note: '' },
    7: { status: 'present', checkInTime: '07:39', note: '' },
    8: { status: 'late', checkInTime: '07:46', note: '晨讀遲到' },
    9: { status: 'present', checkInTime: '07:36', note: '' },
    10: { status: 'present', checkInTime: '07:30', note: '' },
    11: { status: 'present', checkInTime: '07:34', note: '' },
    12: { status: 'present', checkInTime: '07:22', note: '' },
    13: { status: 'present', checkInTime: '07:37', note: '' },
    14: { status: 'leave', checkInTime: null, note: '病假（家長已通報）' },
    15: { status: 'present', checkInTime: '07:26', note: '' },
    16: { status: 'present', checkInTime: '07:32', note: '' },
    17: { status: 'present', checkInTime: '07:35', note: '' },
    18: { status: 'present', checkInTime: '07:29', note: '' },
    19: { status: 'present', checkInTime: '07:33', note: '' },
    20: { status: 'present', checkInTime: '07:36', note: '' },
    21: { status: 'present', checkInTime: '07:24', note: '' },
    22: { status: 'late', checkInTime: '07:48', note: '校車延誤' },
    23: { status: 'present', checkInTime: '07:35', note: '' },
    24: { status: 'present', checkInTime: '07:38', note: '' },
    25: { status: 'present', checkInTime: '07:27', note: '' },
    26: { status: 'present', checkInTime: '07:34', note: '' },
    27: { status: 'present', checkInTime: '07:30', note: '' }
  }
};

// 預設作業項目 (今日範例)
const DEFAULT_HOMEWORK = [
  {
    id: 1,
    title: "國語習作第 八 課完成",
    presetName: "國習",
    type: "國語",
    date: getTodayDateString(),
    records: {
      1: 'submitted', 2: 'submitted', 3: 'submitted', 4: 'submitted', 5: 'submitted',
      6: 'submitted', 7: 'submitted', 8: 'late', 9: 'submitted', 10: 'submitted',
      11: 'submitted', 12: 'submitted', 13: 'submitted', 14: 'pending', 15: 'submitted',
      16: 'revision', 17: 'submitted', 18: 'submitted', 19: 'submitted', 20: 'submitted',
      21: 'submitted', 22: 'missing', 23: 'submitted', 24: 'submitted', 25: 'submitted',
      26: 'submitted', 27: 'submitted'
    }
  },
  {
    id: 2,
    title: "數學習作 P.62 ~ P.65",
    presetName: "數習",
    type: "數學",
    date: getTodayDateString(),
    records: {
      1: 'submitted', 2: 'submitted', 3: 'submitted', 4: 'submitted', 5: 'submitted',
      6: 'submitted', 7: 'submitted', 8: 'submitted', 9: 'submitted', 10: 'submitted',
      11: 'submitted', 12: 'submitted', 13: 'submitted', 14: 'pending', 15: 'submitted',
      16: 'submitted', 17: 'submitted', 18: 'submitted', 19: 'revision', 20: 'submitted',
      21: 'submitted', 22: 'missing', 23: 'submitted', 24: 'submitted', 25: 'submitted',
      26: 'submitted', 27: 'submitted'
    }
  },
  {
    id: 3,
    title: "生字造詞隨堂筆記",
    presetName: "造詞",
    type: "國語",
    date: getTodayDateString(),
    records: {
      1: 'submitted', 2: 'submitted', 3: 'submitted', 4: 'submitted', 5: 'submitted',
      6: 'submitted', 7: 'submitted', 8: 'submitted', 9: 'submitted', 10: 'submitted',
      11: 'submitted', 12: 'submitted', 13: 'submitted', 14: 'pending', 15: 'submitted',
      16: 'submitted', 17: 'submitted', 18: 'submitted', 19: 'submitted', 20: 'submitted',
      21: 'submitted', 22: 'submitted', 23: 'submitted', 24: 'submitted', 25: 'submitted',
      26: 'submitted', 27: 'submitted'
    }
  }
];

const DEFAULT_POINT_LOGS = [
  { id: 101, studentId: 15, points: 5, reason: "奏章字跡工整端正", date: getTodayDateString(), time: "08:15" },
  { id: 102, studentId: 6, points: 5, reason: "課堂主動發表演練", date: getTodayDateString(), time: "09:05" },
  { id: 103, studentId: 21, points: 5, reason: "熱心指導同儕算術", date: getTodayDateString(), time: "10:20" },
  { id: 104, studentId: 3, points: 5, reason: "主動協助整理班級圖書", date: getTodayDateString(), time: "11:10" }
];

const DEFAULT_REWARD_CARDS = [
  { id: 'rc_1', title: '榮譽免死金牌 (免罰卡)', cost: 30, icon: '🛡️', desc: '可抵銷一次未帶學用品或遲到愛班服務登記', category: 'special' },
  { id: 'rc_2', title: '一日皇家座位特權卡', cost: 45, icon: '💺', desc: '可自主挑選一日心儀王位（需經導師核可）', category: 'privilege' },
  { id: 'rc_3', title: '御膳房優先盛飯令', cost: 20, icon: '🍱', desc: '享有當日午餐第一順位盛飯與加菜特權', category: 'item' },
  { id: 'rc_4', title: '御花園特別免差役令', cost: 25, icon: '🧹', desc: '可免除一日外掃或教室值日生職務', category: 'privilege' },
  { id: 'rc_5', title: '宮廷圖書館自由閱覽證', cost: 15, icon: '📚', desc: '午休或早自習可至班級圖書角借閱傳奇秘笈', category: 'study' },
  { id: 'rc_6', title: '國王特赦奏章豁免卷', cost: 50, icon: '📜', desc: '可減免一項指定短篇日常作業（不含段考與作文）', category: 'special' }
];

// 行為卡累計資料 (座位自省卡、愛班服務卡)
const DEFAULT_BEHAVIOR_CARDS = {
  8: { reflectionCount: 0, serviceCount: 1, serviceReason: "晨檢遲到留班補打掃", serviceReasons: [{ text: "晨檢遲到留班補打掃", date: getTodayDateString(), time: "07:46" }] },
  22: { reflectionCount: 1, serviceCount: 1, reflectionReason: "作業兩項缺繳", reflectionReasons: [{ text: "作業兩項缺繳", date: getTodayDateString(), time: "08:00" }], serviceReason: "校車遲到", serviceReasons: [{ text: "校車遲到", date: getTodayDateString(), time: "07:48" }] }
};

const DEFAULT_ANNOUNCEMENTS = [
  { id: 1, title: "五年二班班親會將於本週五晚間隆重召開", content: "歡迎全體皇親國戚（各位家長）蒞臨王國議政廳，共同研商小兵成長大計！", date: "2026-11-12", important: true },
  { id: 2, title: "下週即將迎來王國期中學力大評量", content: "請全體小兵大臣調養精神、溫故知新，發揮平素所學爭取至高榮譽！", date: "2026-11-10", important: false }
];

const STORAGE_KEY = "xining_kingdom_v3_dashboard";

// ============================================================================
// 3. KingdomStore (狀態管理核心)
// ============================================================================
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
          if (!parsed.contactBookHistory) parsed.contactBookHistory = { [getTodayDateString()]: DEFAULT_CONTACT_BOOK };
          if (!parsed.rewardCards) parsed.rewardCards = DEFAULT_REWARD_CARDS;
          if (!parsed.rewardRedemptions) parsed.rewardRedemptions = [];
          if (!parsed.behaviorCards) parsed.behaviorCards = JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_CARDS));
          if (!parsed.trafficOverrides) parsed.trafficOverrides = {};
          if (!parsed.seatingLayout) parsed.seatingLayout = { rows: 5, cols: 6 };
          if (!parsed.seatingChart || !Array.isArray(parsed.seatingChart)) {
            parsed.seatingChart = [...DEFAULT_SEATING_CHART];
          }
          if (!parsed.lastModified) parsed.lastModified = 0;

          // 確保每位學生具備 lifetimePoints 與 animalType
          parsed.students.forEach(st => {
            if (st.lifetimePoints === undefined || st.lifetimePoints === null) {
              st.lifetimePoints = Math.max(st.points || 0, st.petExp || 0);
            }
            if (!st.animalType) {
              let a = st.petType || 'lion';
              if (a === 'dragon') a = 'lion';
              if (a === 'unicorn') a = 'rabbit';
              st.animalType = a;
            }
            st.petType = st.animalType;
            st.petExp = st.lifetimePoints;
          });

          return parsed;
        }
      }
    } catch (e) {
      console.warn("讀取本機資料失敗，載入預設值", e);
    }

    return {
      queenPassword: "queen",
      lateThreshold: "07:40",
      students: JSON.parse(JSON.stringify(DEFAULT_STUDENTS_27)),
      pointPresets: JSON.parse(JSON.stringify(DEFAULT_POINT_PRESETS)),
      homeworkPresets: JSON.parse(JSON.stringify(DEFAULT_HOMEWORK_PRESETS)),
      behaviorReasons: JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_REASONS)),
      contactBook: JSON.parse(JSON.stringify(DEFAULT_CONTACT_BOOK)),
      contactBookHistory: { [getTodayDateString()]: JSON.parse(JSON.stringify(DEFAULT_CONTACT_BOOK)) },
      attendance: JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE)),
      homework: JSON.parse(JSON.stringify(DEFAULT_HOMEWORK)),
      pointLogs: JSON.parse(JSON.stringify(DEFAULT_POINT_LOGS)),
      announcements: JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENTS)),
      rewardCards: JSON.parse(JSON.stringify(DEFAULT_REWARD_CARDS)),
      rewardRedemptions: [],
      behaviorCards: JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_CARDS)),
      trafficOverrides: {},
      seatingLayout: { rows: 5, cols: 6 },
      seatingChart: [...DEFAULT_SEATING_CHART],
      lastModified: 0,
      _isFreshInit: true
    };
  }

  save() {
    try {
      this.data.lastModified = Date.now();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      }
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
      contactBookHistory: { [getTodayDateString()]: JSON.parse(JSON.stringify(DEFAULT_CONTACT_BOOK)) },
      attendance: JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE)),
      homework: JSON.parse(JSON.stringify(DEFAULT_HOMEWORK)),
      pointLogs: JSON.parse(JSON.stringify(DEFAULT_POINT_LOGS)),
      announcements: JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENTS)),
      rewardCards: JSON.parse(JSON.stringify(DEFAULT_REWARD_CARDS)),
      rewardRedemptions: [],
      behaviorCards: JSON.parse(JSON.stringify(DEFAULT_BEHAVIOR_CARDS)),
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

  // --- 每日聯絡簿按日歷史記錄 ---
  getContactBook(dateStr) {
    const targetDate = dateStr || getTodayDateString();
    if (this.data.contactBookHistory && this.data.contactBookHistory[targetDate]) {
      return this.data.contactBookHistory[targetDate];
    }
    if (targetDate === getTodayDateString() && this.data.contactBook) {
      return this.data.contactBook;
    }
    // 返回基礎範本
    return {
      date: targetDate,
      homeworkItems: [
        "1. 國語習作第 八 課完成",
        "2. 數學習作 P.62 ~ P.65",
        "3. 訂正國語隨堂生字本",
        "4. 閱讀課外讀物 20 分鐘並簽名"
      ],
      reminders: [
        "明天有體育課，請穿著西寧王國運動服與運動鞋",
        "請帶自然課觀察記錄本與彩色筆",
        "記得帶水壺與跳繩"
      ],
      queenMotto: "👑 皇后每日聖諭：細心成就卓越，今日的每一筆認真都是明日的榮譽徽章！"
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
    if (targetDate === getTodayDateString()) {
      this.data.contactBook = entry;
    }
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
          lifetimePoints: 50,
          animalType: "lion",
          petType: "lion",
          petExp: 50
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

  // --- 守護動物自選設定 ---
  setStudentAnimal(studentId, animalType) {
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (!student) return false;
    let aKey = (animalType || 'lion').toLowerCase();
    if (aKey === 'dragon') aKey = 'lion';
    if (aKey === 'unicorn') aKey = 'rabbit';
    if (!ANIMAL_DEFINITIONS[aKey]) aKey = 'lion';
    student.animalType = aKey;
    student.petType = aKey;
    this.save();
    return true;
  }

  // --- 雙軌金幣制度：可用金幣 (points) 與生涯累積總額 (lifetimePoints) ---
  awardSingleStudent(studentId, points, reason = "課堂嘉獎") {
    const pts = parseInt(points, 10);
    if (isNaN(pts)) return false;
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (!student) return false;

    if (student.lifetimePoints === undefined) student.lifetimePoints = student.points || 0;

    if (pts > 0) {
      student.points = (student.points || 0) + pts;
      student.lifetimePoints = (student.lifetimePoints || 0) + pts;
      student.petExp = student.lifetimePoints;
    } else {
      student.points = Math.max(0, (student.points || 0) + pts);
    }

    this.data.pointLogs.unshift({
      id: Date.now(),
      studentId: student.id,
      points: pts,
      reason,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });

    this.save();
    return true;
  }

  batchAwardMultipleStudents(studentIds, points, reason = "課堂嘉獎") {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return [];
    const pts = parseInt(points, 10);
    if (isNaN(pts)) return [];

    const updatedStudents = [];
    studentIds.forEach(id => {
      const student = this.data.students.find(s => s.id === id || s.seatNo === id);
      if (student) {
        if (student.lifetimePoints === undefined) student.lifetimePoints = student.points || 0;
        if (pts > 0) {
          student.points = (student.points || 0) + pts;
          student.lifetimePoints = (student.lifetimePoints || 0) + pts;
          student.petExp = student.lifetimePoints;
        } else {
          student.points = Math.max(0, (student.points || 0) + pts);
        }
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

  // --- 批次更改金幣與重置功能 ---
  batchAdjustPoints(studentIds, { mode = 'adjust', deltaPoints = 0, targetPoints = 0, targetLifetime = 0, syncLifetime = true, reason = "導師批次調整" } = {}) {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return [];
    const updated = [];

    studentIds.forEach(id => {
      const st = this.data.students.find(s => s.id === id || s.seatNo === id);
      if (!st) return;
      if (st.lifetimePoints === undefined) st.lifetimePoints = st.points || 0;

      if (mode === 'adjust') {
        const pts = parseInt(deltaPoints, 10) || 0;
        st.points = Math.max(0, (st.points || 0) + pts);
        if (pts > 0 && syncLifetime) {
          st.lifetimePoints = (st.lifetimePoints || 0) + pts;
        }
      } else if (mode === 'set_points') {
        st.points = Math.max(0, parseInt(targetPoints, 10) || 0);
      } else if (mode === 'set_lifetime') {
        st.lifetimePoints = Math.max(0, parseInt(targetLifetime, 10) || 0);
      } else if (mode === 'reset_points') {
        st.points = 0;
      } else if (mode === 'reset_lifetime') {
        st.lifetimePoints = 0;
      } else if (mode === 'reset_both') {
        st.points = 0;
        st.lifetimePoints = 0;
      }
      st.petExp = st.lifetimePoints;
      updated.push(st);
    });

    if (updated.length > 0) {
      this.data.pointLogs.unshift({
        id: Date.now(),
        studentId: updated.length === 1 ? updated[0].id : 'batch_adjust',
        points: mode === 'adjust' ? (deltaPoints || 0) : 0,
        reason: `${reason} 【模式：${mode}，${updated.length} 位大臣】`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5)
      });
      this.save();
    }
    return updated;
  }

  batchResetPoints(targetPoints = 0, clearLogs = false) {
    const pts = Math.max(0, parseInt(targetPoints, 10) || 0);
    this.data.students.forEach(s => {
      s.points = pts;
    });
    if (clearLogs) {
      this.data.pointLogs = [];
    }
    this.save();
  }

  resetSingleStudentPoints(studentId, targetPoints = 0) {
    const student = this.data.students.find(s => s.id === studentId || s.seatNo === studentId);
    if (student) {
      student.points = Math.max(0, parseInt(targetPoints, 10) || 0);
      this.save();
    }
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
    this.save();
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
    this.save();
    return true;
  }

  deletePointPreset(presetId) {
    if (!this.data.pointPresets) return false;
    this.data.pointPresets = this.data.pointPresets.filter(p => p.id !== presetId);
    this.save();
    return true;
  }

  // --- 作業快捷與行為原因庫 ---
  addHomeworkPreset({ subject = "國語", name, fullName, defaultDate = null }) {
    if (!name) return;
    if (!this.data.homeworkPresets) this.data.homeworkPresets = [];
    this.data.homeworkPresets.push({
      id: "hw_pre_" + Date.now(),
      subject,
      name: name.trim(),
      fullName: (fullName || name).trim(),
      defaultDate
    });
    this.save();
  }

  deleteHomeworkPreset(presetId) {
    if (!this.data.homeworkPresets) return;
    this.data.homeworkPresets = this.data.homeworkPresets.filter(p => p.id !== presetId);
    this.save();
  }

  addBehaviorReason({ type = "reflection", label, text }) {
    if (!label) return;
    if (!this.data.behaviorReasons) this.data.behaviorReasons = [];
    this.data.behaviorReasons.push({
      id: "br_" + Date.now(),
      type: type === "service" ? "service" : "reflection",
      label: label.trim(),
      text: (text || label).trim()
    });
    this.save();
  }

  deleteBehaviorReason(reasonId) {
    if (!this.data.behaviorReasons) return;
    this.data.behaviorReasons = this.data.behaviorReasons.filter(p => p.id !== reasonId);
    this.save();
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
      return { success: false, message: `金幣不足！持有：${student.points}，需要：${card.cost}` };
    }

    // 扣除可用金幣，保留 lifetimePoints！
    student.points -= card.cost;

    if (!this.data.rewardRedemptions) this.data.rewardRedemptions = [];
    const record = {
      id: Date.now(),
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
      reason: `兌換卡牌【${card.title}】`,
      date: getTodayDateString(),
      time: new Date().toTimeString().slice(0, 5)
    });

    this.save();
    return { success: true, message: `成功兌換【${card.title}】！已扣除 ${card.cost} 點可用金幣。生涯累積神獸不減退！` };
  }

  toggleRedemptionStatus(redemptionId) {
    if (!this.data.rewardRedemptions) return;
    const rec = this.data.rewardRedemptions.find(r => r.id === redemptionId);
    if (rec) {
      rec.status = rec.status === 'used' ? 'pending' : 'used';
      this.save();
    }
  }

  // --- 行為卡牌累計與特赦管理 (座位自省卡、愛班服務卡) ---
  getReflectionCount(studentId) {
    const b = (this.data.behaviorCards && (this.data.behaviorCards[studentId])) || {};
    return b.reflectionCount !== undefined ? b.reflectionCount : (b.reflectionCard ? 1 : 0);
  }

  getServiceCount(studentId) {
    const b = (this.data.behaviorCards && (this.data.behaviorCards[studentId])) || {};
    return b.serviceCount !== undefined ? b.serviceCount : (b.serviceCard ? 1 : 0);
  }

  addReflectionCard(studentId, reason = "") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = { reflectionCount: 0, serviceCount: 0, reflectionReasons: [], serviceReasons: [] };
    }
    const b = this.data.behaviorCards[studentId];
    b.reflectionCount = (b.reflectionCount || (b.reflectionCard ? 1 : 0)) + 1;
    b.reflectionCard = true;
    if (!Array.isArray(b.reflectionReasons)) b.reflectionReasons = [];
    b.reflectionReasons.push({ text: reason || "課堂座位自省", date: getTodayDateString(), time: new Date().toTimeString().slice(0, 5) });
    b.reflectionReason = reason || b.reflectionReason || "課堂座位自省";
    this.save();
    return b.reflectionCount;
  }

  removeReflectionCardOne(studentId) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return 0;
    const b = this.data.behaviorCards[studentId];
    const current = b.reflectionCount !== undefined ? b.reflectionCount : (b.reflectionCard ? 1 : 0);
    b.reflectionCount = Math.max(0, current - 1);
    b.reflectionCard = b.reflectionCount > 0;
    if (b.reflectionCount === 0) {
      b.reflectionReason = "";
      b.reflectionReasons = [];
    }
    this.save();
    return b.reflectionCount;
  }

  addServiceCard(studentId, reason = "") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    if (!this.data.behaviorCards[studentId]) {
      this.data.behaviorCards[studentId] = { reflectionCount: 0, serviceCount: 0, reflectionReasons: [], serviceReasons: [] };
    }
    const b = this.data.behaviorCards[studentId];
    b.serviceCount = (b.serviceCount || (b.serviceCard ? 1 : 0)) + 1;
    b.serviceCard = true;
    if (!Array.isArray(b.serviceReasons)) b.serviceReasons = [];
    b.serviceReasons.push({ text: reason || "愛班服務勞動", date: getTodayDateString(), time: new Date().toTimeString().slice(0, 5) });
    b.serviceReason = reason || b.serviceReason || "愛班服務勞動";
    this.save();
    return b.serviceCount;
  }

  removeServiceCardOne(studentId) {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return 0;
    const b = this.data.behaviorCards[studentId];
    const current = b.serviceCount !== undefined ? b.serviceCount : (b.serviceCard ? 1 : 0);
    b.serviceCount = Math.max(0, current - 1);
    b.serviceCard = b.serviceCount > 0;
    if (b.serviceCount === 0) {
      b.serviceReason = "";
      b.serviceReasons = [];
    }
    this.save();
    return b.serviceCount;
  }

  pardonStudent(studentId, type = "all") {
    if (!this.data.behaviorCards || !this.data.behaviorCards[studentId]) return;
    const b = this.data.behaviorCards[studentId];
    if (type === 'all' || type === 'reflection') {
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
    this.save();
  }

  pardonAll(type = "all") {
    if (!this.data.behaviorCards) this.data.behaviorCards = {};
    this.data.students.forEach(st => {
      const b = this.data.behaviorCards[st.id] || (this.data.behaviorCards[st.id] = {});
      if (type === 'all' || type === 'reflection') {
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
    const bCard = (this.data.behaviorCards && (this.data.behaviorCards[sId] || this.data.behaviorCards[seatNo])) || {};
    const reflectionCount = this.getReflectionCount(sId);
    const hasManualReflection = reflectionCount > 0;
    const reflectionReason = bCard.reflectionReason || '';

    const isLateCheckIn = att.status === 'late';
    const isUncheckedLate = (!att.checkInTime && att.status !== 'present');
    const autoServiceFromLate = isLateCheckIn || isUncheckedLate;
    const serviceCount = this.getServiceCount(sId) + (autoServiceFromLate && !bCard.serviceCount ? 1 : 0);
    const hasService = serviceCount > 0;
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
        reflectionCount,
        reflectionReason,
        hasService,
        serviceCount,
        serviceReason,
        missingList,
        revisionList,
        lateList,
        isLate: isLateCheckIn,
        isOverridden: true
      };
    }

    // 依規則嚴格判定：
    // A. 作業未繳交或是上課表現不佳有座位自省卡者 -> 紅燈 (需在座位上反省)
    if (hasManualReflection || missingList.length > 0) {
      const reasons = [];
      if (missingList.length > 0) {
        reasons.push(missingList.map(h => `${getShortHwName(h)}未交`).join('、'));
      }
      if (hasManualReflection) {
        reasons.push(reflectionCount > 1 ? `自省卡(x${reflectionCount})` : (reflectionReason ? `座位自省(${reflectionReason})` : '座位自省'));
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
        reflectionCount,
        reflectionReason,
        hasService,
        serviceCount,
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
        reflectionCount: 0,
        reflectionReason: '',
        hasService,
        serviceCount,
        serviceReason,
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

  if (stageNum === 0) {
    return `
      <svg viewBox="0 0 160 160" class="w-full h-full filter drop-shadow-md">
        <defs>
          <radialGradient id="eggGlow_${key}" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="${pal.light}" />
            <stop offset="65%" stop-color="${pal.base}" />
            <stop offset="100%" stop-color="${pal.dark}" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="70" fill="#fef3c7" opacity="0.4" />
        <ellipse cx="80" cy="88" rx="42" ry="52" fill="url(#eggGlow_${key})" stroke="${pal.dark}" stroke-width="2.5" />
        <path d="M50 78 Q80 70 110 78" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
        <path d="M55 98 Q80 90 105 98" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
        <ellipse cx="68" cy="65" rx="8" ry="14" fill="#ffffff" opacity="0.5" transform="rotate(-20 68 65)"/>
        <circle cx="115" cy="45" r="4" fill="#fbbf24" />
        <circle cx="45" cy="115" r="3" fill="#fbbf24" />
        <text x="80" y="102" font-size="24" text-anchor="middle">🐣</text>
      </svg>
    `;
  }

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

  if (stageNum === 2) {
    accessory = `
      <path d="M60 112 Q80 124 100 112" stroke="${pal.accent}" stroke-width="8" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="120" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
    `;
  } else if (stageNum === 3) {
    accessory = `
      <polygon points="62,34 70,44 80,30 90,44 98,34 94,52 66,52" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
      <circle cx="80" cy="33" r="3.5" fill="#ef4444" />
      <path d="M52 110 Q80 130 108 110" stroke="#dc2626" stroke-width="10" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="122" r="8" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
    `;
  } else if (stageNum === 4) {
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
      ${ears}
      <circle cx="80" cy="82" r="42" fill="url(#animGrad_${key}_${stageNum})" stroke="${pal.dark}" stroke-width="3" />
      ${faceDetails}
      <circle cx="68" cy="74" r="4.5" fill="#1e293b" />
      <circle cx="69.5" cy="72.5" r="1.5" fill="#ffffff" />
      <circle cx="92" cy="74" r="4.5" fill="#1e293b" />
      <circle cx="93.5" cy="72.5" r="1.5" fill="#ffffff" />
      <circle cx="60" cy="83" r="5" fill="#f43f5e" opacity="0.35" />
      <circle cx="100" cy="83" r="5" fill="#f43f5e" opacity="0.35" />
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
function isLocalHostOrLAN(hostname) {
  if (!hostname) return false;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
  // RFC 1918 私有 IP 與教育網/區網網段
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
          headers: { 'Content-Type': 'application/json' },
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
        const gasUrl = `${this.config.googleScriptUrl}?account=${encodeURIComponent(account)}&action=pull`;
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
      particleCount: 120,
      spread: 80,
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
    DEFAULT_BEHAVIOR_REASONS
  };
}

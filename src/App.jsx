import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Sparkles,
  Calculator,
  Target,
  Users,
  Store,
  MapPin,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bot,
  Send,
  Video,
  Instagram,
  Copy,
  Check,
  Sun,
  Moon,
  Clock,
  MessageCircle,
  Flame,
  Wand2,
  Heart,
  Gift,
  BarChart2,
  Filter,
  MessageSquare,
  Table,
} from "lucide-react";

// --- 中国行政区划（可按需继续扩展）---
const CHINA_REGIONS = {
  北京市: {
    北京市: ["朝阳区", "海淀区", "东城区", "西城区", "丰台区", "石景山区", "通州区", "顺义区", "昌平区", "大兴区"],
  },
  上海市: {
    上海市: ["浦东新区", "黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区"],
  },
  广东省: {
    深圳市: ["南山区", "福田区", "罗湖区", "宝安区", "龙岗区", "龙华区", "光明区", "坪山区"],
    广州市: ["天河区", "越秀区", "海珠区", "荔湾区", "白云区", "黄埔区", "番禺区", "花都区"],
    东莞市: ["南城街道", "东城街道", "莞城街道", "松山湖", "长安镇", "虎门镇", "常平镇"],
    佛山市: ["禅城区", "南海区", "顺德区", "高明区", "三水区"],
  },
  浙江省: {
    杭州市: ["上城区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "临平区", "钱塘区", "富阳区", "临安区"],
    宁波市: ["海曙区", "江北区", "鄞州区", "镇海区", "北仑区"],
    温州市: ["鹿城区", "龙湾区", "瓯海区", "洞头区"],
  },
};

// --- 门店类型 ---
const STORE_TYPE_OPTIONS = [
  { id: "mall", label: "商场馆", desc: "商场人流大，适合高曝光+体验卡" },
  { id: "office", label: "写字楼店", desc: "白领为主，重视缓压、体态与效率" },
  { id: "community", label: "社区店", desc: "附近住户，适合长期陪伴与亲子" },
  { id: "studio", label: "工作室", desc: "小而精，重体验与高客单私教" },
];

// --- 价格带 ---
const PRICE_RANGE_OPTIONS = [
  { id: "low", label: "百元以内", desc: "更偏引流体验" },
  { id: "mid", label: "100–299 元", desc: "常规付费体验 / 月卡" },
  { id: "high", label: "300 元以上", desc: "高客单小班课 / 私教" },
];

// --- 会员构成默认比例 ---
const DEFAULT_MEMBER_TYPES = {
  group: 60, // 团课
  smallGroup: 30, // 小班课
  private: 10, // 私教
};

// --- 一周主题 ---
const WEEKLY_THEMES = [
  { day: "周日", theme: "周末 reset", emoji: "🌅" },
  { day: "周一", theme: "元气开工", emoji: "⚡" },
  { day: "周二", theme: "体态管理", emoji: "🧘" },
  { day: "周三", theme: "情绪排毒", emoji: "💧" },
  { day: "周四", theme: "核心雕刻", emoji: "🔥" },
  { day: "周五", theme: "下班放松", emoji: "🌙" },
  { day: "周六", theme: "社交轻聚", emoji: "🎉" },
];

// --- 常见经营痛点标签 ---
const PAIN_POINTS = [
  "新客不好收集",
  "到店转化低",
  "复购率不高",
  "成交靠打折",
  "团课不满员",
  "私教不好卖",
  "老会员流失",
  "老师排课混乱",
  "运营内容没时间写",
  "社群没人互动",
];

// --- 预设 AI 问答标签 ---
const PRESET_QA_TAGS = [
  "如何设计 99 元体验卡又不掉价？",
  "怎么提升新客到店率？",
  "老师提成应该怎么设计？",
  "如何把私教卖给团课学员？",
  "怎么做朋友圈内容不“打扰”？",
  "如何搭建活跃社群？",
];

// --- 每日内容生成 ---
function getDailyContent(storeType, shopName, location, date) {
  const dayIndex = date.getDay(); // 0-6
  const themeInfo = WEEKLY_THEMES[dayIndex];
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;

  const baseName = shopName || "本馆";

  const iconMap = {
    morning: Sun,
    noon: Clock,
    night: Moon,
  };

  const templatesByType = {
    mall: [
      // 周日
      {
        morning: {
          title: "周末慢晨 | 商场还没开门我们已开练",
          content: `早安，${dateStr}。\n商场还没开门，我们已经在垫子上等你。\n用一组温和流瑜伽，让身体慢慢醒来。\n#${baseName} #周末慢生活`,
        },
        noon: {
          title: "逛街别只逛 | 来拉伸放松一下",
          content: `逛街逛累了？来${baseName}做一组全身拉伸。\n30 分钟解决肩颈酸、腰背紧、腿部肿。\n📍${location} · 凭当日小票到店免费体验一次。`,
        },
        night: {
          title: "收心冥想 | 给周末一个完整句号",
          content: `今晚最后一节课：放松冥想＋深度拉伸。\n帮你把一周的情绪缓缓放下，安心入睡。\n留言“晚安”，领一份睡前放松音频。`,
        },
      },
      // 周一
      {
        morning: {
          title: "拒绝 Monday Blue | 用拜日式开机",
          content: `早安！新一周开始啦～\n在办公室前先在${baseName}做一组拜日式。\n10 分钟唤醒身体，今天也要好好工作。`,
        },
        noon: {
          title: "午间 20 min 核心快闪课",
          content: `午休别瘫在工位上刷手机啦。\n20 分钟核心快闪课，上班族专属不出汗微燃脂。\n报名前 5 名送肩颈拉伸加时服务。`,
        },
        night: {
          title: "加班后减压流 | 把压力留在垫子上",
          content: `今天辛苦了吗？\n来一节「加班后减压流」，通过大幅度扭转和拉伸，把压力甩在垫子上。\n下班时间不固定？后台回复“弹性排课”，顾问帮你协调时间。`,
        },
      },
    ],
    office: [
      {
        morning: {
          title: "早八缓醒流 | 不熬夜也不困",
          content: `别再早上靠咖啡续命啦～\n在${baseName}做一组温和缓醒流，打开肩颈和髋关节。\n一天的精神状态，决定于这 20 分钟。`,
        },
        noon: {
          title: "午休体态诊断 | 免费量身评估",
          content: `圆肩驼背、颈纹明显、小腹突出？\n今天中午来${baseName}做一次体态评估。\n我们会帮你打分＋给出专属改善方案。`,
        },
        night: {
          title: "熬夜人专属修复课",
          content: `经常加班用脑过度？\n这节课帮你放松眼周、头皮和颈部，改善入睡困难。\n只要你来了，老师就帮你“关机重启”。`,
        },
      },
    ],
    community: [
      {
        morning: {
          title: "宝妈修复早晨场",
          content: `早起送完孩子？\n留一点时间给自己，在${baseName}做骨盆修复＋腰背舒展。\n照顾家人的同时，也要好好照顾自己。`,
        },
        noon: {
          title: "邻居拼团体验课",
          content: `一个人不好意思来？\n拉上同一个小区的邻居一起拼团体验课。\n3 人成团，每人 39 元，课后再送一次拉伸。`,
        },
        night: {
          title: "社区瑜伽 | 下楼就是馆",
          content: `下班不用再挤地铁，只要下楼就能练。\n今晚 7:30 大众基础流，零基础也可以安心跟练。\n评论区 +1，顾问会联系你排座位。`,
        },
      },
    ],
    studio: [
      {
        morning: {
          title: "高端私教 | 仅 4 个名额",
          content: `今天是${themeInfo.day}，${baseName}仅开放 4 个一对一私教名额。\n针对肩颈、腰背、产后、体态等问题，做系统化解决。\n后台回复“私教”，获取一对一咨询。`,
        },
        noon: {
          title: "形体与仪态调整课",
          content: `站姿、坐姿、走路时的线条，就是你的“高级感”。\n这节课会通过核心＋肩颈配合，帮你重建体态。\n适合对形象要求较高的你。`,
        },
        night: {
          title: "烛光修复 | 只为你留一盏灯",
          content: `晚上最后一节是烛光修复流。\n柔和的灯光＋舒缓音乐，专门为一天很累的你准备。\n课后还会赠送一杯温热花草茶。`,
        },
      },
    ],
  };

  const typeKey = templatesByType[storeType] ? storeType : "mall";
  const todaysTemplate = templatesByType[typeKey][dayIndex % templatesByType[typeKey].length];

  const moments = [
    {
      title: todaysTemplate.morning.title,
      content: todaysTemplate.morning.content,
      icon: iconMap.morning,
    },
    {
      title: todaysTemplate.noon.title,
      content: todaysTemplate.noon.content,
      icon: iconMap.noon,
    },
    {
      title: todaysTemplate.night.title,
      content: todaysTemplate.night.content,
      icon: iconMap.night,
    },
  ];

  const douyinPost = {
    title: `${themeInfo.emoji} ${baseName} · 今日短视频脚本`,
    bgm: "治愈钢琴 / 流行轻快 BGM",
    content: `今天在${location}的${baseName}，我们以「${themeInfo.theme}」为主题，拍摄一条真实、不摆拍的生活感短视频。主打“真实改变”和“真实出汗”。`,
    script: [
      {
        scene: "开场 2 秒",
        visual: "馆外招牌＋城市晚霞 / 清晨光线",
        audio: "旁白：这里是" + baseName + "，今天的你，准备好重启自己了吗？",
      },
      {
        scene: "中段 6 秒",
        visual: "会员练习 / 老师手把手调整 / 细节特写（汗水、笑容、肌肉线条）",
        audio: "环境音＋轻音乐，适当加一句“这是她坚持 3 个月的变化”。",
      },
      {
        scene: "结尾 4 秒",
        visual: "会员与老师合影 / 下课收垫子的瞬间",
        audio: "字幕：评论区扣「1」，送你一节体验课。限今日。",
      },
    ],
  };

  const xhsPost = {
    title: `${baseName}真实体验｜${themeInfo.theme}的一天`,
    content: `今天打卡 ${location} 的 ${baseName}。\n\n这家馆给我的感受是：\n1⃣ 环境干净、细节到位（毛巾、水、香薰）\n2⃣ 老师会认真记住每个人的身体情况\n3⃣ 动作示范＋口令都很清晰，新手也不会迷茫\n\n如果你也在附近，可以尝试他们家的新客体验课，是真的“会上瘾”的那种舒适感。`,
    imageDesc: "推荐：一张门头照＋一张馆内环境＋一张细节（垫子/香薰/更衣区）＋一张动作教学场景。",
  };

  return {
    themeInfo,
    moments,
    douyinPost,
    xiaohongshuPost: xhsPost,
  };
}

// --- 卡项矩阵生成 ---
function generateCardMatrix(storeType, priceRange, painPoints) {
  const isPriceLow = priceRange === "low";
  const isPriceHigh = priceRange === "high";

  const tagsBase = [];
  if (painPoints.includes("新客不好收集")) tagsBase.push("引流");
  if (painPoints.includes("到店转化低")) tagsBase.push("强体验");
  if (painPoints.includes("老会员流失")) tagsBase.push("锁客");
  if (painPoints.includes("私教不好卖")) tagsBase.push("私教转化");
  if (tagsBase.length === 0) tagsBase.push("基础运营");

  const cards = [];

  // 1. 新客引流卡
  cards.push({
    name: isPriceLow ? "地推体验卡" : "新客尊享体验卡",
    desc: isPriceLow ? "适合地推/联名渠道，简单粗暴好发放。" : "门店专属体验卡，搭配仪式感升级服务。",
    price: isPriceLow ? 29 : 99,
    times: isPriceLow ? 1 : 3,
    highlight: "用于把“路人”变成“到店体验者”。",
    tags: ["新客", "体验", ...tagsBase],
  });

  // 2. 爆款团课卡
  cards.push({
    name: storeType === "office" ? "下班团课月卡" : "高频团课月卡",
    desc: "绑定固定上课时段，让会员形成「习惯」。可针对体重管理、体态调整、情绪释放等主题包装。",
    price: isPriceHigh ? 899 : 599,
    times: 12,
    highlight: "提升上课频次，增加到店粘性。",
    tags: ["团课", "复购", "黏性"],
  });

  // 3. 小班精修卡
  cards.push({
    name: "小班体态精修卡",
    desc: "人数控制在 4–6 人，兼顾私教效果与团课价格，适合体态、产后修复等需求。",
    price: isPriceHigh ? 2699 : 1999,
    times: 12,
    highlight: "提升客单价又不会销售压力过大，是承接团课会员升级的桥梁。",
    tags: ["小班", "体态", "升级"],
  });

  // 4. 私教尊享卡
  cards.push({
    name: "私教尊享卡",
    desc: "完全根据会员个人情况设计训练计划。建议限制名额，并和教练个人品牌绑定宣传。",
    price: isPriceHigh ? 8880 : 6880,
    times: 24,
    highlight: "用于承接高粘性、高信任度会员，打造单店业绩“发动机”。",
    tags: ["私教", "高客单", "结果导向"],
  });

  let summary = "通过一张体验卡 + 一张团课卡 + 一张小班卡 + 一张私教卡，构成完整的“引流 → 体验 → 留存 → 升级”漏斗。";

  if (storeType === "mall") {
    summary += " 商场馆建议重点强化体验卡与团课卡，通过场内活动、联名合作做曝光。";
  } else if (storeType === "office") {
    summary += " 写字楼店建议做“午休课”和“下班课”，以时间段锁住白领人群。";
  } else if (storeType === "community") {
    summary += " 社区店更适合做家庭/亲子相关课程，加强邻里关系和社群运营。";
  } else if (storeType === "studio") {
    summary += " 工作室建议加强小班与私教，走“高质量少而精”的路线。";
  }

  return {
    summary,
    list: cards,
  };
}

// --- 私域话术生成（死/沉/潜/活） ---
function generatePrivateScripts(storeType, shopName, location) {
  const baseName = shopName || "我们馆";

  return {
    dead: `【久未联系老会员唤醒话术】
好久不见～这里是${baseName}的小助手。\n
我们在整理老会员档案时看到你的名字，想到你当时坚持得特别好。\n
最近我们新增了一些对「${storeType === "office" ? "上班族肩颈" : "体态与舒缓"}」特别友好的课程，
想邀请你回来体验一次，帮你重新找回当时那个状态。\n
如果你愿意，我们可以先赠送你一节「老会员专属回归课」。你看这周有没有 1 个空闲的时间段？`,

    dormant: `【近期不常来店的会员】
哈喽，这里是${baseName}的小助手～\n
最近老师们发现，好久没在课上看到你啦，有点想你。\n
如果是因为工作忙或者作息乱，也别太自责，我们可以帮你调整：\n
· 推荐更适合你的上课时间段\n· 调整课程类型（比如从强度型改为修复型）\n
本周我们有一个「轻松回归」小活动，只要回店上课，就送一次拉伸/热敷服务。\n
我可以先帮你锁一个位置吗？`,

    potential: `【有咨询但未成交的新客】
你好呀，这里是${baseName}，之前你有在我们这边咨询过课程。\n
没第一时间报名完全没关系，选择适合自己的节奏很重要。\n
为了让你更好评估是否适合，我们准备了一个「认真对待你的第一次体验」的方案：\n
1⃣ 先做一次体态/健康问卷＋简单评估\n2⃣ 再安排一节针对你需求设计的体验课\n3⃣ 课后再由老师给你一份书面建议\n
如果你愿意，我们可以从第 1 步——评估开始，而且是免费的。你看本周哪天方便？`,

    active: `【高频活跃会员】
亲爱的，感谢你这段时间的坚持，每次在课上看到你，老师们都非常开心～\n
你已经是我们${baseName}非常稳定的成员了，因此想邀请你参与一个「共建计划」：\n
· 你可以对课程设置、时间安排、环境细节提出任何建议\n· 我们会优先根据「老会员建议」进行调整\n· 也欢迎你推荐朋友来体验，我们会给你准备专属的「老带新福利」\n
如果你愿意，我可以先把你的专属小顾问联系方式发给你，后面任何想法直接微信就好。`,
  };
}

// --- 模拟 AI 问答（可用真接口替换） ---
function mockAiResponse(question) {
  const q = question.toLowerCase();

  if (q.includes("体验卡") || q.includes("引流") || q.includes("新客")) {
    return (
      "针对“新客引流”，可以参考以下落地方案：\n\n" +
      "1⃣ 把体验卡分成「地推版」和「门店版」两种价格与权益；\n" +
      "2⃣ 地推版更便宜、权益简单，方便大量发放；\n" +
      "3⃣ 门店版可以叠加「体态评估」或「拉伸加时」，突出“认真对待第一次体验”；\n" +
      "4⃣ 所有体验卡必须配合「到店前提醒」「到店后跟进」的私域 SOP；\n" +
      "5⃣ 重点不是卖出多少张体验卡，而是体验卡之后能转化多少正式会员。"
    );
  }

  if (q.includes("私教") || q.includes("客单") || q.includes("成交")) {
    return (
      "私教销售的关键不是“推销”，而是“诊断 + 方案”：\n\n" +
      "1⃣ 先通过体态/疼痛等维度做一次「结构化诊断」；\n" +
      "2⃣ 把问题拆解成几个模块（如：肩颈、核心、下肢等）；\n" +
      "3⃣ 给出分阶段的解决方案，并标明大致需要多少节课；\n" +
      "4⃣ 把私教卡命名为「解决方案套餐」，而不是简单的“课时包”；\n" +
      "5⃣ 全程避免“推销感”，而是以“专业建议”的姿态出现。"
    );
  }

  if (q.includes("社群") || q.includes("社群运营") || q.includes("微信群")) {
    return (
      "瑜伽馆的社群运营，建议从“陪练群”而不是“广告群”做起：\n\n" +
      "1⃣ 把社群定位为“陪你一起坚持练习的地方”；\n" +
      "2⃣ 固定时间打卡（例如每天早上 7:30 发一条简单拉伸小视频）；\n" +
      "3⃣ 每周设置一个小主题，例如「肩颈周」「早睡周」「喝水挑战」；\n" +
      "4⃣ 销售内容控制在整体内容的 10～15%，用“报名链接 + 私聊”形式呈现；\n" +
      "5⃣ 把最活跃的会员找出来，邀请 TA 成为小助手，一起维护社群氛围。"
    );
  }

  return (
    "我大致理解了你的问题，可以从三个角度来优化：\n\n" +
    "1⃣ 先梳理你目前门店的定位（人群、客单价、上课频次）；\n" +
    "2⃣ 再针对“获客、转化、留存”三个环节分别拆解；\n" +
    "3⃣ 最后把解决方案落到：课程设计、卡项结构、话术与社群运营上。\n\n" +
    "如果你愿意，可以把你门店的简单情况发给我（例如：面积/老师/客单价等），我可以再给你一版更具体的建议。"
  );
}

export default function App() {
  const [province, setProvince] = useState("广东省");
  const [city, setCity] = useState("深圳市");
  const [district, setDistrict] = useState("南山区");

  const [studioName, setStudioName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [storeType, setStoreType] = useState("mall");
  const [priceRange, setPriceRange] = useState("mid");

  const [targetType, setTargetType] = useState("revenue"); // 'revenue' | 'members'
  const [targetRevenue, setTargetRevenue] = useState("100000");
  const [targetMembers, setTargetMembers] = useState("100");

  const [memberTypes, setMemberTypes] = useState(DEFAULT_MEMBER_TYPES);
  const [selectedPainPoints, setSelectedPainPoints] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [qaInput, setQaInput] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [isQaLoading, setIsQaLoading] = useState(false);

  const qaSectionRef = useRef(null);

  const provinces = Object.keys(CHINA_REGIONS);

  const cities = useMemo(() => {
    if (!province || !CHINA_REGIONS[province]) return [];
    return Object.keys(CHINA_REGIONS[province]);
  }, [province]);

  const districts = useMemo(() => {
    if (!province || !city || !CHINA_REGIONS[province]) return [];
    const m = CHINA_REGIONS[province][city];
    return m || [];
  }, [province, city]);

  useEffect(() => {
    if (!cities.length) return;
    if (!cities.includes(city)) {
      setCity(cities[0]);
    }
  }, [cities, city]);

  useEffect(() => {
    if (!districts.length) return;
    if (!districts.includes(district)) {
      setDistrict(districts[0]);
    }
  }, [districts, district]);

  const shortLocation = `${city}${district}`;
  const fullLocation = `${province} · ${city} · ${district}`;
  const shopName = studioName || "未命名瑜伽馆";

  const handleProvinceChange = (e) => {
    const v = e.target.value;
    setProvince(v);
    const newCities = CHINA_REGIONS[v] ? Object.keys(CHINA_REGIONS[v]) : [];
    const firstCity = newCities[0] || "";
    setCity(firstCity);
    const newDistricts = CHINA_REGIONS[v] && firstCity ? CHINA_REGIONS[v][firstCity] || [] : [];
    setDistrict(newDistricts[0] || "");
  };

  const handleCityChange = (e) => {
    const v = e.target.value;
    setCity(v);
    const newDistricts =
      province && CHINA_REGIONS[province] && CHINA_REGIONS[province][v]
        ? CHINA_REGIONS[province][v]
        : [];
    setDistrict(newDistricts[0] || "");
  };

  const togglePainPoint = (point) => {
    setSelectedPainPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const changeDate = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d);
  };

  const handleGenerate = () => {
    if (targetType === "revenue" && !targetRevenue) return;
    if (targetType === "members" && !targetMembers) return;

    setIsGenerating(true);

    setTimeout(() => {
      const dailyContent = getDailyContent(storeType, shopName, shortLocation, selectedDate);
      const cardMatrix = generateCardMatrix(storeType, priceRange, selectedPainPoints);
      const scripts = generatePrivateScripts(storeType, shopName, fullLocation);

      let targetSummary = "";
      if (targetType === "revenue") {
        targetSummary = `目标营收：¥${targetRevenue} / 月`;
      } else {
        targetSummary = `目标新增会员：${targetMembers} 人 / 月`;
      }

      setResult({
        storeType,
        shopName,
        fullLocation,
        targetSummary,
        date: selectedDate,
        cards: cardMatrix,
        scripts: {
          moments: dailyContent.moments,
          douyin: dailyContent.douyinPost,
          xiaohongshu: dailyContent.xiaohongshuPost,
          private: scripts,
        },
      });

      setIsGenerating(false);
      if (qaSectionRef.current) {
        qaSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 800);
  };

  const handlePresetTagClick = (tag) => {
    setQaInput(tag);
    setTimeout(() => {
      if (qaSectionRef.current) {
        qaSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleAskAI = () => {
    const q = qaInput.trim();
    if (!q) return;
    setIsQaLoading(true);

    setTimeout(() => {
      const answer = mockAiResponse(q);
      setQaHistory((prev) => [...prev, { question: q, answer }]);
      setQaInput("");
      setIsQaLoading(false);
    }, 900);
  };

  return (
    <div className="min-h-screen text-slate-100">
      {/* 顶部深蓝导航条 */}
      <header className="h-14 bg-[#0b1630] border-b border-slate-800/80 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          {/* 左侧 logo + 标题 */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500/80 flex items-center justify-center shadow-lg shadow-emerald-900/60">
              <span className="text-xs font-bold">Logo</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold tracking-wide">
                  弦中弦 AI 业绩生成器
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] border border-emerald-500/40">
                  门店老板专用
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                输入本月目标和门店情况，自动生成卡项方案与文案脚本
              </p>
            </div>
          </div>

          {/* 右侧简单信息 */}
          <div className="hidden md:flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>
                Today · {selectedDate.getMonth() + 1}/{selectedDate.getDate()}
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* 主体：左窄右宽 */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
        {/* 左侧配置区 */}
        <section className="space-y-4">
          {/* 顶部三个数字块 */}
          <div className="grid grid-cols-3 gap-2">
            <MetricBox label="新客占比" value="100" unit="%" />
            <MetricBox label="复购占比" value="40" unit="%" />
            <MetricBox label="老客占比" value="20" unit="%" />
          </div>

          {/* 基本信息 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Store className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold">1. 门店基本信息</h2>
              </div>
              <span className="text-xs text-slate-500">
                用于自动生成「文案中的门店信息」
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  门店名称
                </label>
                <div className="relative">
                  <input
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    placeholder="例如：南山·轻光瑜伽空间"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-3 pr-3 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  联系电话（可选）
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="用于文案底部引导"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-8 pr-3 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 地址 */}
            <div className="mt-4">
              <label className="block text-xs text-slate-400 mb-1">
                门店所在城市
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={province}
                  onChange={handleProvinceChange}
                  className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                >
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select
                  value={city}
                  onChange={handleCityChange}
                  className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                <span>预览：{fullLocation}</span>
              </div>
            </div>
          </div>

          {/* 目标 & 门店类型 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-pink-400" />
                <h2 className="text-sm font-semibold">2. 本月业绩目标</h2>
              </div>
              <span className="text-xs text-slate-500">
                用于生成「数字清晰的目标描述」
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">目标类型</span>
                  <Calculator className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTargetType("revenue")}
                    className={`flex-1 text-xs py-1.5 rounded-lg border ${
                      targetType === "revenue"
                        ? "bg-emerald-500/10 border-emerald-500/70 text-emerald-200"
                        : "bg-slate-950 border-slate-700 text-slate-400"
                    }`}
                  >
                    <span className="font-medium">营收目标</span>
                  </button>
                  <button
                    onClick={() => setTargetType("members")}
                    className={`flex-1 text-xs py-1.5 rounded-lg border ${
                      targetType === "members"
                        ? "bg-indigo-500/10 border-indigo-500/70 text-indigo-200"
                        : "bg-slate-950 border-slate-700 text-slate-400"
                    }`}
                  >
                    <span className="font-medium">新增会员数</span>
                  </button>
                </div>
                <div className="mt-3">
                  {targetType === "revenue" ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        ¥
                      </span>
                      <input
                        type="number"
                        value={targetRevenue}
                        onChange={(e) => setTargetRevenue(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        value={targetMembers}
                        onChange={(e) => setTargetMembers(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        人
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">
                    门店类型 & 价格带
                  </span>
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {STORE_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setStoreType(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                        storeType === opt.id
                          ? "bg-purple-500/10 border-purple-500/70 text-purple-100"
                          : "bg-slate-950 border-slate-700 text-slate-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  {PRICE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPriceRange(opt.id)}
                      className={`flex-1 text-[11px] py-1 rounded-lg border transition-colors ${
                        priceRange === opt.id
                          ? "bg-amber-500/10 border-amber-500/70 text-amber-100"
                          : "bg-slate-950 border-slate-700 text-slate-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 会员构成 & 痛点 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">会员构成（比例）</span>
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] mt-1">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">团课</div>
                    <input
                      type="number"
                      value={memberTypes.group}
                      onChange={(e) =>
                        setMemberTypes((prev) => ({
                          ...prev,
                          group: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded px-1 py-1 text-center text-xs"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">小班课</div>
                    <input
                      type="number"
                      value={memberTypes.smallGroup}
                      onChange={(e) =>
                        setMemberTypes((prev) => ({
                          ...prev,
                          smallGroup: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded px-1 py-1 text-center text-xs"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">私教</div>
                    <input
                      type="number"
                      value={memberTypes.private}
                      onChange={(e) =>
                        setMemberTypes((prev) => ({
                          ...prev,
                          private: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded px-1 py-1 text-center text-xs"
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  这里不需要很精准，只是方便系统理解你门店的「重心」。
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">
                    目前最想解决的经营难题
                  </span>
                  <AlertBadge />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {PAIN_POINTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePainPoint(p)}
                      className={`px-2 py-1 rounded-full text-[11px] border transition-colors ${
                        selectedPainPoints.includes(p)
                          ? "bg-rose-500/15 border-rose-500/70 text-rose-100"
                          : "bg-slate-950 border-slate-700 text-slate-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  至少勾选 1–2 条，生成的方案会更贴合真实情况。
                </p>
              </div>
            </div>

            {/* 日期 & 生成按钮 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2 pt-3 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>为哪一天生成经营方案：</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => changeDate(-1)}
                    className="p-1 rounded-lg border border-slate-700 hover:bg-slate-800/80"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700">
                    {selectedDate.getMonth() + 1} 月 {selectedDate.getDate()} 日
                  </span>
                  <button
                    onClick={() => changeDate(1)}
                    className="p-1 rounded-lg border border-slate-700 hover:bg-slate-800/80"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-rose-900/40 border border-rose-500/60 transition-all ${
                  isGenerating
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white"
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-transparent border-t-white rounded-full animate-spin mr-2" />
                    正在生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    一键生成赚钱方案
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 右侧结果区 */}
        <section className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/40 min-h-[280px]">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-sm space-y-2">
                <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-2">
                  <Wand2 className="w-6 h-6 text-slate-300" />
                </div>
                <p>在左侧填好门店信息后，点击「一键生成赚钱方案」</p>
                <p className="text-xs text-slate-500">
                  系统会帮你一口气生成：卡项结构 + 今日内容 + 私域话术 + 短视频脚本
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* 顶部摘要 */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Target className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">{fullLocation}</div>
                      <div className="text-sm font-semibold">
                        {result.shopName} · 今日经营导航
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <span className="px-2 py-1 rounded-lg bg-slate-800 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {result.date.getMonth() + 1} 月 {result.date.getDate()} 日
                      </span>
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-800 flex items-center space-x-1">
                      <BarChart2 className="w-3 h-3" />
                      <span>{result.targetSummary}</span>
                    </span>
                  </div>
                </div>

                {/* 卡项矩阵 */}
                <div className="mt-2 border border-slate-800 rounded-xl bg-slate-950/60">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Table className="w-3.5 h-3.5 text-amber-300" />
                      <span className="text-xs font-semibold">今日推荐卡项矩阵</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      v1.0 · 以「引流→体验→留存→升级」为逻辑
                    </span>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-[11px] text-slate-400 mb-2">
                      {result.cards.summary}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {result.cards.list.map((card, idx) => (
                        <div
                          key={idx}
                          className="border border-slate-800 rounded-lg p-3 bg-slate-900/60"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <div className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center">
                                {idx === 0 && (
                                  <Gift className="w-3.5 h-3.5 text-pink-300" />
                                )}
                                {idx === 1 && (
                                  <Flame className="w-3.5 h-3.5 text-orange-300" />
                                )}
                                {idx === 2 && (
                                  <Heart className="w-3.5 h-3.5 text-rose-300" />
                                )}
                                {idx === 3 && <CrownIcon />}
                              </div>
                              <div>
                                <div className="text-xs font-semibold">{card.name}</div>
                                <div className="text-[11px] text-slate-500">
                                  {card.times} 次 / ¥{card.price}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {card.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-300 mb-1">
                            {card.desc}
                          </p>
                          <p className="text-[11px] text-emerald-300">
                            ⟶ {card.highlight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 脚本区 */}
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <ScriptRow
                    label="今日朋友圈三条文案"
                    color="emerald"
                    content={result.scripts.moments
                      .map((m, i) => `【第 ${i + 1} 条：${m.title}】\n${m.content}`)
                      .join("\n\n")}
                    icon={MessageCircle}
                  />
                  <ScriptRow
                    label="短视频脚本：抖音 / 视频号通用"
                    color="violet"
                    content={
                      `【标题建议】\n${result.scripts.douyin.title}\n\n` +
                      `【BGM 建议】\n${result.scripts.douyin.bgm}\n\n` +
                      `【整体说明】\n${result.scripts.douyin.content}\n\n` +
                      "【分镜脚本】\n" +
                      result.scripts.douyin.script
                        .map(
                          (s, i) =>
                            `${i + 1}. 场景：${s.scene}\n画面：${s.visual}\n声音：${s.audio}`
                        )
                        .join("\n\n")
                    }
                    icon={Video}
                  />
                  <ScriptRow
                    label="小红书图文（可改成图文笔记）"
                    color="rose"
                    content={
                      `【标题建议】\n${result.scripts.xiaohongshu.title}\n\n` +
                      `【正文参考】\n${result.scripts.xiaohongshu.content}\n\n` +
                      `【图片建议】\n${result.scripts.xiaohongshu.imageDesc}`
                    }
                    icon={Instagram}
                  />
                  <ScriptRow
                    label="私域话术 · 死/沉/潜/活会员"
                    color="sky"
                    content={
                      `【久未联系老会员（死）】\n${result.scripts.private.dead}\n\n` +
                      `【近期不常来会员（沉）】\n${result.scripts.private.dormant}\n\n` +
                      `【有咨询未成交新客（潜）】\n${result.scripts.private.potential}\n\n` +
                      `【高频活跃会员（活）】\n${result.scripts.private.active}`
                    }
                    icon={Bot}
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI 问答区 */}
          <div
            ref={qaSectionRef}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/40"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-cyan-300" />
                <h2 className="text-sm font-semibold">3. 跟「AI 经营顾问」聊聊</h2>
              </div>
              <span className="text-[11px] text-slate-500">
                尝试提问：如何提升复购？怎么卖私教？
              </span>
            </div>

            {/* 预设标签 */}
            <div className="flex flex-wrap gap-1 mb-3">
              {PRESET_QA_TAGS.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handlePresetTagClick(tag)}
                  className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950 text-[11px] text-slate-300 hover:border-cyan-500/70 hover:text-cyan-100 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* 输入框 */}
            <div className="relative mb-3">
              <textarea
                value={qaInput}
                onChange={(e) => setQaInput(e.target.value)}
                rows={3}
                placeholder="在这里描述你的门店现状和问题，例如：『我们是社区小馆，客单价在 300 左右，新客不少但很难长期留下来，应该怎么设计卡项和社群？』"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-3 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/70 resize-none"
              />
              <button
                onClick={handleAskAI}
                disabled={isQaLoading}
                className="absolute right-2 bottom-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isQaLoading ? (
                  <span className="w-3 h-3 border-2 border-transparent border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* QA 历史 */}
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {qaHistory.length === 0 ? (
                <p className="text-xs text-slate-500">
                  这里会记录你和「AI 经营顾问」的对话，方便你之后复制到 Word / 飞书等文档中整理。
                </p>
              ) : (
                qaHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-start space-x-2 text-xs">
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-3 h-3 text-slate-300" />
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 flex-1">
                        <div className="text-[11px] text-slate-400 mb-0.5">
                          你的问题
                        </div>
                        <div className="whitespace-pre-line text-xs">
                          {item.question}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 text-xs">
                      <div className="h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-slate-950" />
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 flex-1">
                        <div className="text-[11px] text-cyan-300 mb-0.5">
                          AI 经营顾问的回复
                        </div>
                        <div className="whitespace-pre-line text-xs text-slate-100">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// 小徽章图标
function AlertBadge() {
  return (
    <div className="flex items-center space-x-1 text-[11px] text-amber-300">
      <Flame className="w-3 h-3" />
      <span>最多选 3 个</span>
    </div>
  );
}

function CROWN_SVG(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 18h16l-1-9-4 3-3-7-3 7-4-3-1 9z" fill="currentColor" />
    </svg>
  );
}

function CrownIcon() {
  return <CROWN_SVG className="w-3.5 h-3.5 text-yellow-300" />;
}

// 左上角的三个指标小卡片
function MetricBox({ label, value, unit }) {
  return (
    <div className="bg-[#101a3a] border border-slate-700/70 rounded-xl px-3 py-2 text-center shadow-sm shadow-slate-900/60">
      <div className="text-[11px] text-slate-300 mb-1 truncate">{label}</div>
      <div className="flex items-baseline justify-center space-x-1">
        <span className="text-lg font-semibold text-amber-300">{value}</span>
        {unit && <span className="text-[11px] text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

// 通用脚本文案组件（支持一键复制）
function ScriptRow({ label, color, content, icon: Icon }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const colorMap = {
    emerald: "from-emerald-500/20 to-emerald-500/0 border-emerald-500/50 text-emerald-200",
    violet: "from-violet-500/20 to-violet-500/0 border-violet-500/50 text-violet-200",
    rose: "from-rose-500/20 to-rose-500/0 border-rose-500/50 text-rose-200",
    sky: "from-sky-500/20 to-sky-500/0 border-sky-500/50 text-sky-200",
  };

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
      <div
        className={`px-3 py-2 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r ${
          colorMap[color] || "from-slate-700/40 to-slate-900/0"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-lg bg-slate-950/40 flex items-center justify-center">
            {Icon ? <Icon className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-semibold">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center space-x-1 text-[11px] px-2 py-1 rounded-full bg-slate-950/40 border border-slate-700 hover:border-slate-400 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>复制文案</span>
            </>
          )}
        </button>
      </div>
      <div className="px-3 py-3">
        <div className="whitespace-pre-line text-[11px] leading-relaxed text-slate-100">
          {content}
        </div>
      </div>
    </div>
  );
}

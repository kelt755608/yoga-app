import { useState } from "react";
import {
  Sparkles,
  Target,
  ClipboardList,
  MessageCircle,
  Copy,
  Activity,
  Users,
} from "lucide-react";
import "./index.css";

function App() {
  // ========= 基本信息 =========
  const [storeName, setStoreName] = useState("");
  const [contact, setContact] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  // ========= 本月目标 =========
  const [monthlyTarget, setMonthlyTarget] = useState("100000");
  const [cardPriceRange, setCardPriceRange] = useState("2000-6000元");
  const [focusTags, setFocusTags] = useState([
    "老客户续费",
    "办高客单",
    "大课带人头",
  ]);
  const [smallClassTarget, setSmallClassTarget] = useState("60");
  const [trialTarget, setTrialTarget] = useState("30");
  const [privateClassTarget, setPrivateClassTarget] = useState("10");

  // ========= 文案结果 =========
  const [storeScript, setStoreScript] = useState("");
  const [momentScript, setMomentScript] = useState("");
  const [salesScript, setSalesScript] = useState("");
  const [smsScript, setSmsScript] = useState("");

  // ========= AI 问答 =========
  const [qaInput, setQaInput] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [isQaLoading, setIsQaLoading] = useState(false);

  // 复制到剪贴板
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("已复制到剪贴板");
    } catch (e) {
      console.error(e);
      alert("复制失败，请手动选择文本复制");
    }
  };

  // 生成四大脚本
  const handleGenerate = () => {
    const baseInfo = `【门店基本信息】
门店名称：${storeName || "（请补充门店名称）"}
联系方式：${contact || "（请补充电话/微信）"}
门店地址：${province || ""}${city || ""}${district || ""}${address || ""}`;

    const goalInfo = `【本月业绩目标】
本月总业绩目标：${monthlyTarget || "（请填写）"} 元
主推卡型价格带：${cardPriceRange || "（请填写）"}
重点客群 / 业务：${focusTags.length > 0 ? focusTags.join("、") : "（请填写）"}
小班课目标人次：${smallClassTarget || "（请填写）"}
体验课目标人次：${trialTarget || "（请填写）"}
私教课目标节数：${privateClassTarget || "（请填写）"}`;

    const s1 = `【强中强·门店信息介绍脚本】
老师您好，以下是根据您填写的数据自动生成的门店信息脚本，可用于方案 PPT 或成交话术开头部分：

${baseInfo}

${goalInfo}
—— 请结合门店实际情况再做微调。`;

    const s2 = `【强中强·朋友圈文案示例】
适用场景：教练/店长个人号、门店公众号推文开头。

1）情绪开场：
这个月给自己定了一个小目标：帮助${city || "我们这座城市"}至少 ${
      monthlyTarget || "XXXX"
    } 元的新业绩，服务更多想通过瑜伽/运动改变自己的朋友。

2）门店实力：
我们【${storeName || "门店名称"}】一直专注于${focusTags.join(
      "、"
    )}，门店客单在${cardPriceRange} 区间，既保证效果，也兼顾性价比。

3）福利引导：
本月针对【体验课 / 小班课 / 私教课】分别设定了${trialTarget} / ${
      smallClassTarget
    } / ${privateClassTarget} 的名额，想了解适合自己的方案，可以私信我「方案」两个字，我会根据你目前的状态帮你做一份个人成长路径。`;

    const s3 = `【强中强·当面成交话术示例】
适用于：一对一咨询 / 体验课结束后的方案说明。

老师开场：
“今天我先快速帮你梳理一下你目前的情况，然后给你一份【专属方案】，最后我们再看一下怎么在你可接受的预算内，把效果做到最好，好吗？”

核心结构：
1）确认对方目标与顾虑；
2）结合门店定位，解释为什么推荐 ${cardPriceRange} 这个价格带；
3）把本月门店目标（${monthlyTarget} 元）转化为“我们希望这个月多服务多少位像你这样的人”；
4）给出 2～3 个方案档位，让对方在【效果】和【预算】之间自己选择；
5）用本月活动名额做稀缺：体验课${trialTarget}个名额、小班课${smallClassTarget}个名额、私教课${privateClassTarget}节课名额。`;

    const s4 = `【强中强·短信 / 企业微信群发模板】

模板一：沉睡客户唤醒
“您好，这里是${storeName || "您的瑜伽/运动"}中心，本月我们针对老同学开放了 ${
      cardPriceRange || "XXXX"
    } 价格带的升级体验名额，预计只开放 ${
      smallClassTarget || "XX"
    } 个位置。如果你最近想重新开始练习，可以直接回复【我要规划】，我们会为你做一份 1 个月的【重启计划】。”

模板二：体验课转正
“今天辛苦啦～根据你今天的状态，我们帮你做了一份【专属练习建议】，如果你想把这一个月真正用来改变自己，可以考虑我们本月的目标班级，一共 ${
      trialTarget || "XX"
    } 个体验名额，现在还剩不多。直接回复【我要方案】，我来帮你做匹配。”`;

    setStoreScript(s1);
    setMomentScript(s2);
    setSalesScript(s3);
    setSmsScript(s4);
  };

  // 真实调用 /api/chat（ChatGPT）
  const handleAskAI = async () => {
    const question = qaInput.trim();
    if (!question) return;

    setIsQaLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      setQaHistory((prev) => [
        ...prev,
        {
          question,
          answer:
            data.answer || "抱歉，AI 没有返回有效回答，请稍后再试。",
        },
      ]);
      setQaInput("");
    } catch (err) {
      console.error("调用 /api/chat 失败：", err);
      setQaHistory((prev) => [
        ...prev,
        {
          question,
          answer: "调用 AI 接口失败，请检查网络或稍后再试。",
        },
      ]);
    } finally {
      setIsQaLoading(false);
    }
  };

  // 可点击标签
  const toggleTag = (tag) => {
    setFocusTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const TAG_OPTIONS = [
    "老客户续费",
    "高客单方案",
    "大课带新客",
    "私教增购",
    "产后宝妈",
    "上班族减压",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 顶部导航 */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/40">
              <Sparkles className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400">
                强中强 · 门店业绩生成器
              </div>
              <div className="text-xs text-slate-400">
                一键生成门店介绍、朋友圈文案、成交话术与短信模板
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-xs text-slate-400 md:flex">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>今天：系统自动记录关键业绩规划要素</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主体布局：左侧配置 + 右侧结果 */}
      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* 左侧：表单配置 */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/60">
          {/* 模块 1 基本信息 */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Users className="h-4 w-4 text-emerald-400" />
              1. 门店基本信息
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              用于自动生成「文案里的门店信息」与背景介绍。
            </p>

            <div className="mt-3 space-y-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">门店名称</label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="例如：强中强瑜伽华强北旗舰店"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  联系电话 / 微信（可选）
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="用于放在短信 / 文案结尾处"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">省份</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                    placeholder="例如：广东省"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">城市</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                    placeholder="例如：深圳市"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">区/商圈</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                    placeholder="例如：南山区"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">详细地址（可选）</label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="例如：科技园地铁站 B 出口 200 米"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* 模块 2 本月业绩目标 */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Target className="h-4 w-4 text-emerald-400" />
              2. 本月业绩目标
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              用于自动生成「数字清晰的目标描述」和成交话术中的目标感。
            </p>

            <div className="mt-3 space-y-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  本月总业绩目标（元）
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  主推卡型价格带（例如：2000-6000元）
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                  value={cardPriceRange}
                  onChange={(e) => setCardPriceRange(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  本月重点业务 / 客群（可多选）
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map((tag) => {
                    const active = focusTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] transition ${
                          active
                            ? "border-emerald-400 bg-emerald-500/15 text-emerald-200"
                            : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-emerald-400/70 hover:text-emerald-200"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">
                    小班课目标人次
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                    value={smallClassTarget}
                    onChange={(e) => setSmallClassTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">
                    体验课目标人次
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/50"
                    value={trialTarget}
                    onChange={(e) => setTrialTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">
                    私教课目标节数
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs outline-none focus:border-emer

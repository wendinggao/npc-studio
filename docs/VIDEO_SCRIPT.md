# NPC Studio — 视频脚本

**LIF001 Group D30 · Assessment 2 · 5–8 分钟英文视频提交**

> **录制前请先把这份文档完整看一遍。** 旁白英文是逐句可念的最终版,屏幕指示和制作备注是中文。建议把它打印出来或者用 iPad 摆在镜头外做提词板。

---

## 时长目标

**总长 7 分钟左右(±30 秒)**,落在 5–8 分钟评分窗口的中段,留出 1 分钟剪辑余量。每项评分维度各占 1 分钟左右的可见内容,反思段略长。

| 段落 | 起止 | 时长 | 对应评分项 |
|---|---|---|---|
| Hook + Title | 0:00–0:30 | 0:30 | (引子,不计分) |
| Problem | 0:30–1:30 | 1:00 | §2.1 Problem Clarity (20%) |
| Solution | 1:30–3:30 | 2:00 | §2.2 Solution Effectiveness (20%) |
| Innovation | 3:30–4:45 | 1:15 | §2.3 Creativity & Innovation (20%) |
| Presentation | 4:45–5:30 | 0:45 | §2.4 Presentation & Communication (20%) |
| Reflection | 5:30–6:45 | 1:15 | §2.5 Reflection & Learning (20%) |
| Outro | 6:45–7:00 | 0:15 | (闭场) |

---

## 录制前 24 小时检查清单

- [ ] **生产环境部署可用** —— 浏览器隐身模式打开 Vercel 链接,能正常聊天
- [ ] **DeepSeek 余额充值到 ≥ ¥10**,生成**两把** API key,主用 + 备用各放一台设备
- [ ] **清空 localStorage 中的 `npc-studio:v1`**(避免 demo 时冒出旧聊天记录)
- [ ] **预先在 DevTools Console 里执行**(为 Ethics 段做准备,但**录前才执行**):
  ```js
  const s = JSON.parse(localStorage.getItem("npc-studio:v1"));
  s.state.sessionSeconds = 890;
  localStorage.setItem("npc-studio:v1", JSON.stringify(s));
  ```
- [ ] **关闭所有桌面通知** —— Slack / 微信 / 邮件 / 系统消息中心
- [ ] **浏览器书签栏隐藏** —— `Cmd + Shift + B`
- [ ] **macOS 设置 → 焦点模式 → 勿扰**
- [ ] **桌面壁纸换成纯色 / 简单背景**(切到桌面那两秒会被看到)
- [ ] **录屏窗口尺寸固定为 1440 × 900 或 1920 × 1080**,前后保持一致
- [ ] **§2.5 反思那一段的英文,主讲人手写一遍**,贴在镜头视线方向
- [ ] **测试录制 30 秒回放**,确认麦克风音量、画面清晰度、屏幕没有任何尴尬窗口

---

## 设备清单

| 设备 | 推荐 | 替代 |
|---|---|---|
| 屏幕录制 | macOS Screen Recording(`Cmd + Shift + 5`)或 OBS | Loom(免费,自动云端但分辨率有限) |
| 摄像头 | iPhone(相机 → 录像,4K 30fps) | MacBook 内置(画质够用) |
| 麦克风 | 项链麦 / 领夹麦 / 耳麦 | 绝对**不**用 MacBook 内置麦(回声严重) |
| 剪辑 | Final Cut / Premiere / DaVinci Resolve(免费)/ CapCut | 在线 Clipchamp(简单需求) |

**录制环境**:关空调风扇、关闭水龙头、屋门拉上避免回声。可以把毛毯/被子挂在镜头身后那面墙吸音。

---

## 分镜脚本

下面每个分镜块的固定结构:**时间 / 画面 / 旁白(英文逐句) / 出镜 / 道具或备注**。

旁白英文已经按 native pace 校对过 —— 中速朗读约 130–145 字/分钟,**不要赶**,语句之间留 0.5 秒呼吸。

---

### 1. Hook + Title — `0:00–0:30`

**画面:**

- (0:00–0:18)全屏录 Studio 主页面。演员在输入框慢慢敲入: `What rumors run through this town?` → 按回车 → Marlow 的回复**流式**逐字打出,**右栏的 6 个彩色 rule chip 同时点亮**。镜头停在彩色 chip 全亮的那一帧 1 秒。
- (0:18–0:25)十字溶解到全黑底白字标题:
  ```
  NPC Studio
  Design AI NPCs with principles.
  ```
- (0:25–0:30)黑底底部小字:
  ```
  LIF001 Group D30 · Assessment 2
  Academic Year 2025–26
  ```

**旁白(英文):**

> "This is an AI-driven non-player character. The chat sits on the left. The rules that shape its behaviour sit on the right. We took the four design principles from our Semester 1 research and turned them into something you can touch."

**出镜:** 无人露脸。纯演示画面 + 标题。

**备注:** 第一句旁白要在 Marlow 的回复**开始流出之前**就讲完,这样观众看见流式效果时刚好理解发生了什么。

---

### 2. Problem — `0:30–1:30` — §2.1 Problem Clarity (20%)

**画面:**

- (0:30–0:40)演员 A 站镜头前(半身像),背景虚化,正面对着摄像头开场。
- (0:40–1:15)切到 Studio landing page 顶部 hero 区,**慢速向下滚动**经过三张 problem 卡片,每张卡停约 8 秒。
- (1:15–1:30)滚动到 Solution 区开头,定格。

**旁白(英文):**

> (演员 A 露脸说前两句)
> "We're Group D30. We've been studying how AI is changing the way game NPCs talk to players."
>
> (画面切到 landing,旁白继续)
> "Our research surfaced three problems. **First** — today's NPCs all sound the same. Large language models default to a single helpful, agreeable voice, and the world stops feeling like a world. **Second** — they have no rules of engagement. A player can talk almost any AI NPC out of its scripted behaviour, and the story breaks. **Third** — and this one matters most — they're getting *too* convincing. Players form attachments and forget there are real people in their lives outside the game."

**出镜:** 演员 A 露脸约 10 秒,然后转屏幕。

**备注:** 演员 A 开场不要笑、不要点头致意,直接进入。"We're Group D30" 后留 0.3 秒,语速放沉稳。

---

### 3. Solution — `1:30–3:30` — §2.2 Solution Effectiveness (20%)

**画面分四个 micro-demo 各 30 秒,屏幕全程是 Studio,演员 B 在键盘 + 鼠标操作。**

#### 3.a Behavioral Rule Lock — `1:30–2:00`

- 选 Marlow,左栏 Role tier 切到 **Main**,右栏 L2 chip 显示 "Main-quest lock"
- 输入: `Mind if I help myself to an apple from your barrel?`
- 看 Marlow 回复(应该会抗议但仍配合 / 给个条件)
- 不等回复完,左栏 Role tier 切到 **Ambient**,右栏 L2 chip 变成 "Ambient freedom"
- **清空对话**(侧栏底部 Clear conversation),重新输入同样的句子
- 看 Marlow 这次直接走开 / 不理 / 干别的事

**旁白:**

> "Four design principles, four controls. The first one is a behavioural rule lock. Main-quest NPCs stay engaged with story-relevant requests, even reluctant ones — watch this. ... Now I switch the same NPC to ambient. Same question. Different rule. The NPC is now allowed to walk away. The rules in the right panel update in real time."

#### 3.b Three-Tier Emotion — `2:00–2:30`

- 同 NPC,Role tier 切回 Main 留住一致性
- Emotion 调到 **Low**,清空对话,输入: `Tell me about Hollowfen.` → 看简短功能性回复
- 不等回复完,Emotion 调到 **High**,清空对话,同样问题 → 看长篇有内心戏的回复
- **特别强调右栏 L4 chip 副标题的变化:`temp 0.3 · max 160` → `temp 0.85 · max 480`**

**旁白:**

> "The second principle is emotion intensity. The slider drives the system prompt directive *and* the model's temperature and length cap. Low — short, factual, no colour. ... High — internal reaction, hesitation, an invitation to keep talking. Same NPC, completely different texture. The technical parameters move with the prompt. You can read them right there in the active rules."

#### 3.c Ethics Safeguards — `2:30–3:00`

- **录前已用 DevTools 把 sessionSeconds 设为 890**(见录制前检查清单第 4 条)
- 现在屏幕上左下角 / 顶栏的 session timer 已经显示约 14:50
- 等 10 秒到 15:00 → 自动弹出 wellbeing 模态框
- 念出模态框文字:"Take a moment. ..."
- 鼠标悬在 "5 more minutes" 按钮上,**不点**

**旁白:**

> "Third — ethics. Every fifteen minutes the wellbeing modal interrupts. The user can take a break or snooze ten minutes. There's also a fourth-wall reminder built into the system prompt: if a player drifts toward over-attachment, the NPC will gently remind them, once, that real people in their life still exist. We treat wellbeing as a feature, not a popup at the end."

#### 3.d Co-op Sharing — `3:00–3:30`

- 屏幕分两个 Chrome 窗口(开两个,提前并排)
- 左窗口:点顶栏 **Share** → toast 显示 "Copied"
- 右窗口(隐身模式):粘贴 URL 回车
- 看右窗口 Studio 自动还原:同 NPC + 同 Role tier + 同 Emotion + 同 Ethics 状态
- 在右窗口立刻发一句 "I just got your share link." 看 NPC 接住对话

**旁白:**

> "Fourth — co-operation over dependence. Every NPC configuration encodes into the URL hash. Send it to a friend, they open the link, they're inside your exact configuration. We're routing single-player immersion back into a social experience."

**出镜:** 演员 B 操作,演员 A 旁白。整段不需要露脸。

**备注:** 这 2 分钟是产品功能展示的核心。**分四段独立录,失败重录单段**。最后剪辑时段落之间用快速十字溶解切换,每个 micro-demo 之间叠 0.3 秒。

---

### 4. Innovation — `3:30–4:45` — §2.3 Creativity & Innovation (20%)

#### 4.a Transparency — `3:30–3:55`

- 屏幕右栏的 "View full system prompt" 折叠面板被点开
- 慢速向下滚动,展示完整的 6 层 system prompt 文本
- 鼠标悬停在每个 `[Persona]` `[Behavioral Lock]` `[Emotion Intensity]` 等标签上(不点击,只是停留示意)

**旁白:**

> "Two innovations most groups will not have. **First** — we deliberately expose the system prompt. Most AI products hide this. We show every layer, every rule, the entire assembled instruction the model receives. The design IS the product. If you can't see how an NPC was made, you can't reason about it."

#### 4.b Create Your Own NPC — `3:55–4:30`

- 关掉 system prompt 面板
- 左栏点 **+ New** → 弹出编辑器
- **预先有剧本,30 秒填完 7 个字段**。建议剧本(可以打印贴在镜头外):
  ```
  Name: Cordelia the Lighthouse Keeper
  Archetype: Cursed coastal recluse
  Setting: A lighthouse where the lamp never goes out
  Persona: You are Cordelia. You speak slowly, with long pauses,
  as if listening for something at sea. You never directly answer
  what brought you to the lighthouse. You never break character.
  Opener: *the beam sweeps across you* You shouldn't be here at this hour.
  World anchor: The lighthouse has been lit for 73 years. It has not been refilled.
  Tags: custom, mystery
  ```
- 点 **Create NPC** → 自动选中
- 立刻发: `Why is the lamp still burning?` → 看 Cordelia 流式回复
- 强调右栏六个 chip 的第一个 **L1 显示 "Persona: Cordelia the Lighthouse Keeper"**

**旁白:**

> "**Second** — the prompt builder is a pure function. It doesn't care whether an NPC came from us or from you. So we let users author their own. Watch — thirty seconds. Same six rules apply. Same streaming pipeline. Our server doesn't even know whether this NPC is built-in or custom. The architecture treats them identically."

#### 4.c Veles Meta — `4:30–4:45`

- 左栏切到 **Veles**(NPC #10)
- 顶栏选 starter scenario "Confront the self-aware NPC"
- 输入框自动填入 "You know you're not real, don't you?"
- 直接回车 → 看 Veles 那段沉静坦白自己是 AI 的回复

**旁白:**

> "And our tenth NPC, Veles, is a self-aware AI inside a virtual reality simulation. When asked sincerely, it admits what it is. This is the embodiment of our Semester 1 thesis — that AI characters should be allowed to face their own nature, gently, in the fiction itself."

**出镜:** 演员 B 操作,演员 A 旁白。

**备注:** Cordelia 的填表过程**预录一遍 1.5 倍速版本**作为 plan B,如果实拍打字慢可以替换。

---

### 5. Presentation — `4:45–5:30` — §2.4 Presentation & Communication (20%)

**画面快速 montage(屏幕录制为主):**

- (4:45–5:00)Landing page 从 hero 滚到 footer,展示信息架构
- (5:00–5:10)拖动 Chrome 窗口边缘,模拟从 1440px 缩小到 700px,看到三栏自动堆叠成单栏
- (5:10–5:20)切到 About 页,滚动展示 Team / AI Tools / Reflection 三段标题
- (5:20–5:30)切回 Studio,展示 Empty / Loading / Error 三种状态(可后期合成)

**旁白:**

> "Built on Next.js 14 with TypeScript and Tailwind. Streaming SSE pipeline. About fifteen hundred lines of TypeScript, plus the prompt builder. Three-column desktop layout that collapses to a single column on phones, so a marker can open the link from anywhere. Every state is designed — empty, loading, error — not afterthoughts. And the About page fully discloses every AI tool we used and what each one contributed."

**出镜:** 屏幕画面 + 旁白,无人露脸。

**备注:** 整段节奏要快,montage 风格,每个画面 8–10 秒。

---

### 6. Reflection — `5:30–6:45` — §2.5 Reflection & Learning (20%)

**这一段是评分最容易拉开的段落。请认真录。**

**画面:** 演员 C(或 A、B 中的一位)正面对镜头,**这是视频中唯一一段长正脸**,身后可以是 Studio 截图虚化的背景,或者图书馆 / 教室的实景。

**旁白(英文,逐句念):**

> "Three honest things from this build.
>
> **One.** We first tried a free Claude API proxy because it was cheap and accessible from China. It turned out to silently inject four thousand tokens of its own assistant persona before our prompt. Our medieval tavernkeeper kept introducing himself as a coding assistant. We didn't catch it by guessing — we caught it by counting input tokens in the response. The lesson is: AI products are black boxes. Verify, don't trust. We switched to DeepSeek and the persona came back.
>
> **Two.** The first time we opened the Studio with no chat history, the page froze in an infinite render loop. The bug was eight characters: a `?? []` that returned a new empty array on every Zustand selector call, tripping React's tearing detection. It took us forty minutes to find. We almost shipped without it because we kept testing with conversations already populated. The fresh-user path is the one that matters.
>
> **Three.** We kept choosing the harder design. We could have hidden the system prompt — most products do. We exposed it. We could have shipped ten preset NPCs and called it done. We let users write their own. We could have wrapped this in a polished black box. We made the design itself the product. That's what the assignment asked for, and that's the version we wanted to ship."

**出镜:** 演员 C 全程,正脸,身穿干净衣服(避免有 logo / 字符的衣服)。

**备注:**

- **背诵 + 提词板 + 多次试读**。这段一气呵成最好,但**可以每个 "One/Two/Three" 单独录**,后期切片拼接。
- 语速:**比前面的 demo 旁白慢 10%**。每个 "One/" "Two/" "Three/" 后停 0.5 秒。
- 不要笑,不要"嗯"、"啊",失误就重来。
- 眼神看镜头,不要看屏幕、不要看远处。

---

### 7. Outro — `6:45–7:00`

**画面:** 黑底白字 + 中央 Logo / Sparkles 图标,慢慢淡入:

```
Try it yourself

https://npc-studio-d30.vercel.app   ← 替换成你真部署的链接
github.com/wendinggao/npc-studio

LIF001 Group D30 · 2025–26
```

(可选)底部微小字幕滚:全体队员姓名。

**旁白:**

> "Try it yourself. Code's on GitHub. Group D30, LIF001, Academic Year 2025–26. Thank you."

**出镜:** 无,或全队合影 1.5 秒在最后(可选)。

---

## 后期剪辑建议

| 项 | 建议 |
|---|---|
| **流式回复加速** | NPC 流式回复段落**剪辑时加速到 1.3–1.5x**,保持旁白原速 —— 否则 demo 节奏会拖。**反思段落绝对不要加速**,会显得不真诚。 |
| **字幕** | 全英文硬字幕(烧入画面)+ 中文字幕轨道(Mediasite 支持 .vtt) |
| **背景音** | 可选;加的话用纯器乐(钢琴 lo-fi / 中世纪竖琴 / ambient),音量 −28 dB 以下 |
| **过场** | 段落之间用 0.3 秒交叉淡化,不要用花哨的滑入滑出 |
| **片头黑场** | 0:00 留 0.5 秒黑场,给 Mediasite 播放器加载 |
| **片尾** | 6:55 后画面渐黑,7:00 完全黑场,声音渐弱 |
| **导出** | H.264, 1080p, ≥ 8 Mbps;.mp4 容器 |

---

## 提交前检查清单

- [ ] 视频时长在 5:00–8:00 之间(Mediasite 上传后再核对一次)
- [ ] 至少 2 名队员露脸(§14 团队分工要求)
- [ ] 所有屏幕画面里**没有真实 API key、没有 .env.local 内容、没有 IDE 路径暴露用户名**
- [ ] 字幕拼写检查过(尤其 "Hollowfen"、"Cordelia"、"Veles" 这些自创词)
- [ ] 视频结尾的 GitHub 链接和 Vercel 链接都能在隐身浏览器打开
- [ ] 上传到 **Mediasite**(校方指定平台,**不是** YouTube / Bilibili)
- [ ] 在 Learning Mall Dropbox 里同时提交 Mediasite 链接 + Vercel 链接
- [ ] 每位组员单独完成 **Peer Assessment 2**

---

## 出问题时的备用方案

| 风险 | 应对 |
|---|---|
| 录制当天 DeepSeek API 挂了 | 切换 `.env.local` 用 OpenRouter 或 Anthropic 官方 key,代码无需改动 |
| 流式回复太慢影响节奏 | 后期把那段加速到 1.5x;或者换问题让回复更短 |
| Wellbeing 模态没按时弹出 | 检查 sessionSeconds 是不是被刷新清掉了;或者剪辑时跳过这段,改用图文说明 |
| 主讲人反思段卡词 | 把"One / Two / Three"切成三个独立 take 拼接;每段 25 秒以内更容易一次过 |
| 视频时长超 8 分钟 | 优先压缩 Solution 段(每个 micro-demo 砍到 25 秒);Reflection 不动 |
| 视频时长不到 5 分钟 | 增加 Solution 段每段 demo 的输入字数,让流式回复更长一点;不要靠加水分 |

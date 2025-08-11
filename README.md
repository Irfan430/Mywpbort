
# 📦 IrfanBot (Mywpbort-main) — সম্পূর্ণ গাইড ও বিশ্লেষণ

এই রিপোজিটরিতে একটি **WhatsApp বট** আছে যা `@whiskeysockets/baileys` দিয়ে চলে, সঙ্গে আছে Express ভিত্তিক **ড্যাশবোর্ড/হেলথ এন্ডপয়েন্ট**, **হট-রিলোড**, এবং **MongoDB** (ঐচ্ছিক)। কমান্ড সিস্টেমটি ফোল্ডার-ভিত্তিক (categories) + **রানটাইমে কাস্টম কমান্ড ইন্সটল** করার সুবিধা (`/cmd install`), GoatBot স্টাইলে।

---

## ✅ কী কী আছে (ফিচার সমূহ)

- **Pairing code login** (QR ছাড়াই কোডে লগইন; রিট্রাই/স্টেবল)
- **Dashboard/Health**: `/`, `/status`, `/health`, `/logs/tail`, `/dashboard/save`
- **MongoDB (optional)**: ইউজার/সেশন ব্যাকআপের জন্য
- **Command Loader**: `commands/{admin,core,group,tools,fun}` + **runtime custom commands**
- **Events**: নতুন মেম্বার/বট-জয়েন ওয়েলকাম মেসেজ
- **Protections**: Anti-link, Anti-call
- **Quality of life**: Auto read, Typing indicator, Uptime/Ping, Help
- **Hot reload**: লোকাল ডেভে ফাইল সেভ করলেই রিলোড (nodemon + chokidar)

---

## 🗂️ প্রজেক্ট স্ট্রাকচার (উচ্চ-স্তরের)

```
Mywpbort-main/
├─ index.js                   # মেইন সার্ভার/বট স্টার্টার
├─ package.json               # ডিপেন্ডেন্সি/স্ক্রিপ্ট
├─ config.json                # প্রোড কনফিগ (Render/সার্ভার)
├─ config.dev.json            # ডেভ কনফিগ (লোকাল)
├─ .env                       # পোর্ট/অ্যাডমিন কী ইত্যাদি
├─ database.js                # MongoDB কানেক্টর (optional)
├─ database/
│  └─ sessionModel.js         # সেশন/ডেটা মডেল (যদি ব্যবহার করেন)
├─ handlers/
│  └─ commandManager.js       # কমান্ড রেজিস্ট্রি, রানটাইম ইন্সটল
├─ commands/
│  ├─ admin/                  # অ্যাডমিন কমান্ড (kick, promote ইত্যাদি + cmd)
│  ├─ core/                   # help, ping, uptime, system
│  ├─ group/                  # adduser, kick (গ্রুপ ম্যানেজ)
│  ├─ tools/                  # sticker, toimg, quote, flux ইত্যাদি
│  └─ fun/                    # eightball ইত্যাদি
├─ events/
│  ├─ welcomeNewMember.js     # গ্রুপে নতুন ইউজারে ওয়েলকাম
│  └─ welcomeOnJoin.js        # বট নিজে জয়েন করলে ওয়েলকাম
├─ utils/
│  ├─ database.js             # হেল্পার
│  └─ sessionStore.js         # সেশন স্টোর
├─ public/
│  └─ index.html              # ড্যাশবোর্ড হোম (Express static)
└─ render.yaml                # Render ডিপ্লয় কনফিগ (ঐচ্ছিক)
```

---

## ⚙️ প্রয়োজনীয়তা

- **Node.js**: >= 18.x (package.json → `engines.node`)
- **npm** বা **pnpm/yarn** (উল্লেখিত স্ক্রিপ্ট npm ধরে লেখা)
- **MongoDB** (ঐচ্ছিক): অন/অফ করতে `config.json` → `database.enabled`

---

## 🔧 কনফিগারেশন

### 1) `.env`
```
PORT=10000
NODE_ENV=development
ADMIN_KEY=your-secret-admin-key
# MONGO_URI=your-mongodb-uri (যদি config.json এ না দেন)
```

> নোট: **সেন্সিটিভ কিছু `config.json`-এ হার্ডকোড করা আছে (mongoURI)** — প্রোডাকশনে এগুলো `.env`-এ নিন এবং `config.json` থেকে রিমুভ/ওভাররাইড করুন।

### 2) `config.dev.json` (লোকাল ডেভের জন্য)
- ডিফল্ট prefix: `/`
- ফিচার ফ্ল্যাগ: `features.{welcome,goodbye,antiCall,antiLink}`
- ড্যাশবোর্ড: `dashboard.enabled`, `dashboard.adminKeyEnv`
- ডাটাবেস: `database.enabled`, `database.uri: "MONGO_URI_FROM_ENV"`

### 3) `config.json` (ডিপ্লয়ের জন্য)
- একই কী-গুলো, তবে প্রোড ভ্যালু। **পরামর্শ**: MongoDB URI `.env` থেকে নিন।

---

## 🚀 লোকাল রান (ডেভেলপমেন্ট)

```bash
# 1) ডিপেন্ডেন্সি
npm install

# 2) কনফিগ কপি/এডিট
cp config.dev.json config.json      # বা নিজের মতো এডিট
cp .env .env.local || true          # .env ঠিক রাখুন

# 3) স্টার্ট
npm run dev     # nodemon সহ হট-রিলোড
# অথবা
npm start       # node index.js
```

**প্রথম লগইন (Pairing Code):**
- কনসোলে pairing code দেখাবে (বা `/pair` কমান্ড থাকলে সেটি ব্যবহার করুন) — ফোনের WhatsApp → Linked Devices → **Link with Phone Number** (বা কোড অনুযায়ী) দিয়ে লগইন করুন।
- লগইন হয়ে গেলে সেশন লোকালি/ডাটাবেজে সেভ হতে পারে (কনফিগ অনুযায়ী)।

---

## ☁️ Render ডিপ্লয় (উদাহরণ)

- **Build Command**: `npm ci`
- **Start Command**: `node index.js`
- **Environment**:
  - `PORT`: 10000 (বা Render প্রদত্ত)
  - `NODE_ENV`: `production`
  - `ADMIN_KEY`: `<your-admin-key>`
  - `MONGO_URI`: `<your-mongodb-uri>` (যদি DB ব্যবহার করেন)
- **Disk** (ঐচ্ছিক): সেশন পার্সিস্ট করতে একটি ডিস্ক ব্যবহার করতে পারেন।
- `render.yaml` থাকলে _Blueprint_ ডিপ্লয় সম্ভব।

ডিপ্লয়ের পর **ড্যাশবোর্ড/হেলথ**:
- `GET /` → `public/index.html`
- `GET /health` → `{ ok: true }`
- `GET /status` → বট স্ট্যাটাস
- `GET /logs/tail?lines=200&key=ADMIN_KEY`
- `POST /dashboard/save` → কনফিগ সেভ (key দরকার)

---

## 🧩 কমান্ড সিস্টেম — কীভাবে কাজ করে

### কমান্ড ফাইলের বেসিক স্ট্রাকচার
```js
// commands/tools/echo.js
module.exports = {
  name: "echo",
  aliases: ["say"],
  usage: "/echo <text>",
  description: "Reply back with your text",
  run: async ({ sock, m, args, logger, CONFIG }) => {
    const text = args.join(" ").trim() || "Nothing to echo!";
    await m.reply(text);
  }
}
```

**রেজিস্ট্রেশন**: ফাইলটি `commands/<category>/` ফোল্ডারে রাখলেই লোড হবে (রিস্টার্ট/হট-রিলোডের সাথে)।

### Runtime কাস্টম কমান্ড (রিস্টার্টে উধাও)
`/cmd` কমান্ডটি আছে (দেখুন: `commands/admin/cmd.js`).

**উদাহরণ:** ইনলাইন কোড ইন্সটল
```
/cmd install hello.js module.exports={
  name:"hello", run: async({m})=>m.reply("Hi!")
}
```

**মাল্টিলাইন:**
```
/cmd install hello.js ```js
module.exports = {
  name: "hello",
  run: async ({m}) => m.reply("Hi from multiline!")
}
```

**রিমুভ/লিস্ট:**
```
/cmd remove hello
/cmd list
```

### এডমিন/গ্রুপ কমান্ড
- `commands/admin/*` → promote/demote/kick/mute ইত্যাদি
- `commands/group/*` → গ্রুপ ইউটিলিটিজ (adduser/kick ইত্যাদি)
- `commands/core/*` → help, ping, uptime, system
- `commands/tools/*` → sticker, toimg, quote, flux ইত্যাদি

> **Prefix**: ডিফল্ট `/` → `config.json` → `prefix` দিয়ে বদলান।

---

## 🎛️ ইভেন্টস

- `events/welcomeNewMember.js`: নতুন মেম্বার এলে `{users}`, `{group}` প্লেসহোল্ডার সহ ওয়েলকাম মেসেজ।
- `events/welcomeOnJoin.js`: বট নিজে গ্রুপে যোগ হলে গ্রুপ সাবজেক্ট/অ্যাডমিন লিস্টসহ মেসেজ।

ফিচার অন/অফ: `config.json → features.welcome / features.goodbye`

---

## 🔐 সিকিউরিটি নোট

- **কখনই** প্রোডাকশন Mongo URI, Admin Key রিপোতে কমিট করবেন না। `.env` ব্যবহার করুন।
- ড্যাশবোর্ড সেভ/লগ টেইল এন্ডপয়েন্টে **`ADMIN_KEY` আবশ্যক**।
- Owner নম্বর (`config.json → owner`) সঠিক E.164 ফরম্যাটে রাখুন (`+659xxxxxxx`)।

---

## 🛠️ ট্রাবলশুটিং

- **Pairing code আসছে না**: সার্ভার আউটবাউন্ড ব্লক? Render লগ চেক করুন। Node >=18 কিনা দেখুন।
- **MongoDB কানেক্ট হচ্ছে না**: `MONGO_URI` সঠিক? IP allowlist/Network Access ঠিক আছে?
- **Commands লোড হচ্ছে না**: ফাইল নাম/মডিউল এক্সপোর্ট সঠিক? কনসোল এররে কী দেখাচ্ছে?
- **AntiLink কাজ করছে না**: `features.antiLink.enabled=true` এবং `action=warn|delete` সেট করুন।
- **Dashboard 401/403**: `?key=ADMIN_KEY` না দিলে ব্লক হবে।

---

## 🧪 দ্রুত টেস্ট প্ল্যান

1. লোকালি `npm run dev` চালিয়ে pairing code দিয়ে লগইন করুন।
2. `/ping`, `/uptime`, `/help` রান করে দেখুন।
3. `/cmd install` দিয়ে একটি টেস্ট কমান্ড অ্যাড করুন, কাজ করছে কি না দেখুন।
4. গ্রুপে নতুন মেম্বার অ্যাড করে ওয়েলকাম ট্রিগার দেখুন।
5. `/tools sticker`, `/tools toimg` ইত্যাদি টেস্ট করুন (মিডিয়া পারমিশন ঠিক আছে কি না)।
6. Dashboard `/health`, `/status`, `/logs/tail?key=ADMIN_KEY` হিট করে দেখুন।

---

## 📝 লাইসেন্স

MIT (রেপোতে `LICENSE` ফাইল আছে)।

---

## ℹ️ নোট

- এই README বাংলা-ফার্স্ট, তবে চাইলে ইংরেজি ভ্যারিয়েন্টও তৈরি করে দেওয়া যাবে।
- আপনি চাইলে **prefix ছাড়া অটো-রিপ্লাই গ্রিটিং** বা **কোনো নির্দিষ্ট API রেসপন্সে অটো-রিপ্লাই** যুক্ত করার নমুনা কমান্ডও দিয়ে দিতে পারি — বললেই যুক্ত করে দেবো।

const originalConsoleLog = console.log;
console.log = function(...args) {
  if (typeof args[0] === 'string' && (args[0].includes('Chunk size is') || args[0].includes('1cb3ea404e31a6b5000000403c857c4b9e31a800000000000000000000000000000000000000000000000000000000000000000000000000'))) {
    return;
  }
  originalConsoleLog.apply(console, args);
};

const mineflayer = require("mineflayer");
const readline = require("readline");
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');
const _chalk = require("chalk");
const chalk = _chalk && _chalk.default ? _chalk.default : _chalk;

const GITHUB_API_URL = 'https://api.github.com/repos/Propenthia34/Minecraft-Console-Client/commits/main';
const GITHUB_ZIP_URL = 'https://github.com/Propenthia34/Minecraft-Console-Client/archive/refs/heads/main.zip';
const VERSION_FILE = path.join(__dirname, 'version.json');

async function getLocalVersion() {
    if (!fs.existsSync(VERSION_FILE)) {
        return null;
    }
    const data = fs.readFileSync(VERSION_FILE, 'utf8');
    return JSON.parse(data).commit;
}

async function getRemoteVersion() {
    try {
        const response = await axios.get(GITHUB_API_URL, {
            headers: { 'User-Agent': 'CrageNetwork-Bot-Updater' }
        });
        return response.data.sha;
    } catch (error) {
        console.error(chalk.red('[AutoUpdate] Uzak sürüm bilgisi alınamadı:', error.message));
        return null;
    }
}

async function downloadAndExtractUpdate() {
    try {
        console.log(chalk.blue('[AutoUpdate] Güncelleme indiriliyor...'));
        const response = await axios.get(GITHUB_ZIP_URL, { responseType: 'arraybuffer' });
        const zip = new AdmZip(response.data);
        const tempDir = path.join(__dirname, 'temp_update');
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        fs.mkdirSync(tempDir, { recursive: true });

        zip.extractAllTo(tempDir, true);
        console.log(chalk.green('[AutoUpdate] Güncelleme indirildi ve çıkarıldı.'));

        const extractedEntries = fs.readdirSync(tempDir);
        const sourceDir = path.join(tempDir, extractedEntries[0]);

        return sourceDir;
    } catch (error) {
        console.error(chalk.red('[AutoUpdate] Güncelleme indirme hatası:', error.message));
        return null;
    }
}

async function checkForUpdates() {
    console.log(chalk.blue('[AutoUpdate] Güncellemeler kontrol ediliyor...'));
    const localVersion = await getLocalVersion();
    const remoteVersion = await getRemoteVersion();

    if (!remoteVersion) return;

    if (!localVersion) {
        fs.writeFileSync(VERSION_FILE, JSON.stringify({ commit: remoteVersion }));
        console.log(chalk.yellow('[AutoUpdate] Yerel sürüm bilgisi oluşturuldu.'));
        return;
    }

    if (localVersion !== remoteVersion) {
        console.log(chalk.green('[AutoUpdate] Yeni bir sürüm bulundu! Güncelleniyor...'));
        const updateSourceDir = await downloadAndExtractUpdate();

        if (updateSourceDir) {
            console.log(chalk.yellow('[AutoUpdate] Güncelleyici başlatılıyor. Uygulama yeniden başlayacak...'));
            const updaterPath = path.join(__dirname, 'updater.js');
            const appDir = __dirname;

            const updater = spawn('node', [updaterPath, updateSourceDir, appDir], {
                detached: true,
                stdio: 'ignore'
            });
            updater.unref();
            process.exit();
        }
    } else {
        console.log(chalk.green('[AutoUpdate] Uygulama güncel.'));
    }
}

// --- Bot Logic ---
let antiAfkInterval = null;
let survivalInterval = null;
let reconnectTimer = null;
let reconnectDelay = 5000; 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const yellow = typeof chalk?.yellow === "function" ? chalk.yellow : (s) => s;
rl.setPrompt(yellow("> "));

rl.on("line", (input) => {
  if (global.bot && input.trim().length > 0) {
    try {
      global.bot.chat(input.trim());
    } catch(e) {
      console.log(chalk.red("Mesaj gönderilirken bir hata oluştu:", e));
    }
  }
  rl.prompt(true);
});

function startBot(username, password) {
  console.log(chalk.green("Crage Network Bot'una hoş geldiniz!"));
  console.log(chalk.yellow("Sunucuya bağlanılıyor..."));

  const bot = mineflayer.createBot({
    host: "play.cragenetwork.com",
    port: 25565,
    username: username,
    password: password,   
    auth: "offline",
    version: "1.21.4",
    keepAlive: true,
    checkTimeoutInterval: 60 * 1000,
    viewDistance: "tiny",
  });

  global.bot = bot;

  bot.on("resourcePack", () => {
    try {
      bot.acceptResourcePack();
      console.log("[RP] Resource pack kabul edildi.");
    } catch (e) {
      console.log("[RP] Resource pack kabul hatası:", e?.message || e);
    }
  });

  bot.on("kicked", (reason) => {
    const reasonText = reason.toString();
    console.log(chalk.red("[KICKED] Sunucudan atıldınız. Sebep: " + reasonText));
    
    if (reasonText.includes('logging in too fast')) {
        reconnectDelay = 30000; 
        console.log(chalk.yellow("Çok hızlı giriş denemesi. Yeniden bağlanma süresi 30 saniyeye ayarlandı."));
    }
  });

  bot.on("spawn", () => {
    console.log(chalk.green("Bot sunucuya spawn oldu. Giriş yapılıyor..."));
    reconnectDelay = 5000; 

    setTimeout(() => {
      try { bot.chat(`/login ${password}`); } catch {}
    }, 1500);

    setTimeout(() => {
      try { bot.chat("/server survival"); } catch {}
    }, 5000);

    setTimeout(() => {
      console.log(chalk.yellow("Giriş tamamlandı. /survival döngüsü başlıyor..."));
      rl.prompt(true);
      
      if (survivalInterval) clearInterval(survivalInterval);
      survivalInterval = setInterval(() => {
          try {
              if(global.bot) global.bot.chat('/survival');
          } catch {}
      }, 30000);
    }, 8000);

    if (antiAfkInterval) clearInterval(antiAfkInterval);
    antiAfkInterval = setInterval(() => {
      try {
        if (!bot || !bot.entity) return;
        const yaw = Math.random() * Math.PI * 2 - Math.PI;
        const pitch = Math.random() * (Math.PI / 2) - (Math.PI / 4);
        bot.look(yaw, pitch, true);
        rl.prompt(true);
      } catch {}
    }, 60000);
  });

  bot.on("message", (jsonMsg) => {
    try {
      const messageText = jsonMsg.toAnsi();
      console.log(messageText);
    } catch {
      console.log(String(jsonMsg));
    }
    rl.prompt(true);
  });

  bot.on("error", (err) => {
      console.log(chalk.red("Kritik bir hata oluştu:", err.message));
  });

  bot.on("end", (reason) => {
    if (reconnectTimer) return; 

    console.log(chalk.red(`Bağlantı sonlandı. Sebep: ${reason || 'Bilinmeyen'}`));

    if (global.bot) {
        global.bot.removeAllListeners();
    }
    if (antiAfkInterval) clearInterval(antiAfkInterval);
    if (survivalInterval) clearInterval(survivalInterval);
    antiAfkInterval = null;
    survivalInterval = null;
    global.bot = null;
    
    console.log(chalk.yellow(`${reconnectDelay / 1000} saniye içinde yeniden bağlanılıyor...`));
    
    reconnectTimer = setTimeout(() => {
      startBot(username, password);
      reconnectTimer = null; 
    }, reconnectDelay);
  });
}

async function main() {
    await checkForUpdates(); 
    setInterval(checkForUpdates, 1800000); 

    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
      console.log(chalk.red("Lütfen kullanıcı adı ve şifre ile başlatın."));
      console.log(chalk.yellow("Kullanım: Bu programı doğrudan çalıştırmayın. Lütfen start.bat dosyasını kullanın."));
      process.exit(1);
    }

    startBot(username, password);
}

main();

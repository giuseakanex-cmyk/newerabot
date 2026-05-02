// ==========================================
// LEGAM OS - ACTIVITY TRACKER & REWARDS (SAFE MONEY)
// ==========================================

const legamHeader = `✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦\n·  𝐋 𝐄 𝐆 𝐀 𝐌  𝐎 𝐒  ·\n✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦`;
const legamFooter = `✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦\n. . ✦  .  ⁺  .  ✦  . .`;

// ================================================
// 🔄 COMANDO MANUALE: .resetstats (Solo Owner)
// ================================================
let handler = async (m, { conn, isGroup, isOwner }) => {
    if (!isGroup) return;
    
    // BLOCCATO: Solo l'Owner può azzerare le statistiche globali del gruppo
    if (!isOwner) {
        return m.reply("『 ⛔ 』 **𝐀𝐂𝐂𝐄𝐒𝐒𝐎 𝐍𝐄𝐆𝐀𝐓𝐎**\nSolo l'Owner del sistema può resettare le statistiche.");
    }

    // Inizializza o azzera l'attività del gruppo specifico
    if (!global.db.data.groupActivity) global.db.data.groupActivity = {};
    global.db.data.groupActivity[m.chat] = {}; 
    
    let msg = `${legamHeader}\n\n『 🔄 』 𝐑 𝐄 𝐒 𝐄 𝐓  𝐒 𝐓 𝐀 𝐓 𝐒\n\n· Statistiche di attività azzerate!\n· 💰 Il capitale degli utenti è rimasto intatto.\n· 📊 La scalata ricomincia da zero.\n\n${legamFooter}`;
    
    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

// ================================================
// ⚙️ MOTORE BACKGROUND: TRACCIAMENTO ATTIVITÀ
// ================================================
handler.before = async function (m) {
    if (!m.chat || m.fromMe || !m.sender || !m.isGroup) return;

    // Assicurati che i database esistano
    global.db.data.groupActivity = global.db.data.groupActivity || {};
    if (!global.db.data.groupActivity[m.chat]) global.db.data.groupActivity[m.chat] = {};

    let now = Date.now();
    let chatData = global.db.data.groupActivity[m.chat];

    // Se l'utente non ha mai scritto nel gruppo, inizializzalo
    if (!chatData[m.sender]) {
        chatData[m.sender] = {
            msgCount: 0,
            onlineTime: 0,
            timeForReward: 0,
            lastMessageTime: now
        };
    }
    
    let userAct = chatData[m.sender];

    // Database utenti per il saldo economico
    global.db.data.users = global.db.data.users || {};
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { euro: 0 };
    if (typeof global.db.data.users[m.sender].euro !== 'number') global.db.data.users[m.sender].euro = 0;

    // ⏱️ 1. CALCOLO TEMPO ONLINE
    let diffSeconds = Math.floor((now - userAct.lastMessageTime) / 1000);
    let secondsToAdd = (diffSeconds > 0 && diffSeconds <= 300) ? diffSeconds : 10;

    userAct.onlineTime += secondsToAdd;
    userAct.timeForReward += secondsToAdd;
    userAct.lastMessageTime = now;

    // 🎯 2. TRAGUARDO MESSAGGI (Ogni 100 messaggi)
    userAct.msgCount += 1;
    if (userAct.msgCount % 100 === 0) {
        global.db.data.users[m.sender].euro += 200; 
        let msgReward = `🎉 @${m.sender.split('@')[0]}, hai inviato altri 100 messaggi: +200€!`;
        await this.sendMessage(m.chat, { text: msgReward, mentions: [m.sender] });
    }

    // 🎁 3. TRAGUARDO TEMPO (Ogni 1 Ora)
    if (userAct.timeForReward >= 3600) {
        global.db.data.users[m.sender].euro += 300;
        userAct.timeForReward = 0; 
        let oreTotali = Math.floor(userAct.onlineTime / 3600) || 1;
        let txtOra = `🕦 @${m.sender.split('@')[0]}, hai raggiunto ${oreTotali} ore di attività: +300€!`;
        await this.sendMessage(m.chat, { text: txtOra, mentions: [m.sender] });
    }
};

handler.help = ['resetstats'];
handler.tags = ['owner'];
handler.command = /^(resetstats|azzerastats)$/i;
handler.group = true;
handler.owner = true; // Impostato a true per sicurezza anche a livello di handler

export default handler;
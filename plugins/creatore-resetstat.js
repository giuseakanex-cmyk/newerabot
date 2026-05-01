
// ==========================================
// LEGAM OS - RESET CLASSIFICA TEMPO
// ==========================================

const legamHeader = `✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦\n·  𝐋 𝐄 𝐆 𝐀 𝐌  𝐎 𝐒  ·\n✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦`;
const legamFooter = `✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦\n. . ✦  .  ⁺  .  ✦  . .`;

let handler = async (m, { conn, isGroup, isOwner }) => {
    try {
        if (!isGroup) return;

        // Blocco di sicurezza: Solo l'Owner può manipolare il tempo
        if (!isOwner) {
            return m.reply("『 ⛔ 』 **𝐀𝐂𝐂𝐄𝐒𝐒𝐎 𝐍𝐄𝐆𝐀𝐓𝐎**\nSolo l'Owner del sistema può resettare il tempo.");
        }

        // Controllo esistenza database per evitare crash
        if (!global.db.data.groupActivity || !global.db.data.groupActivity[m.chat]) {
            return m.reply("『 💡 』 Nessuna statistica registrata in questo gruppo.");
        }

        let chatData = global.db.data.groupActivity[m.chat];
        let usersReset = 0;

        // Cicla tutti gli utenti del gruppo e azzera SOLO i contatori del tempo
        for (let user in chatData) {
            if (chatData[user]) {
                chatData[user].onlineTime = 0;
                chatData[user].timeForReward = 0;
                // Aggiorniamo anche l'ultimo messaggio a ora, così il calcolo riparte pulito
                chatData[user].lastMessageTime = Date.now(); 
                usersReset++;
            }
        }
        
        let msg = `${legamHeader}

『 ⏱️ 』 𝐑 𝐄 𝐒 𝐄 𝐓  𝐓 𝐄 𝐌 𝐏 𝐎

· Classifica ore azzerata con successo.
· Utenti resettati: ${usersReset}
· 💬 I messaggi inviati sono intatti.
· 💰 I fondi sono al sicuro.

👑 _Il tempo riparte da zero._

${legamFooter}`;
        
        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
        
    } catch (e) {
        console.error("Errore nel comando resettime:", e);
        m.reply("『 ❌ 』 Errore durante il reset del tempo.");
    }
};

handler.help = ['resettime'];
handler.tags = ['owner'];
handler.command = /^(resettime)$/i;

handler.group = true;
handler.owner = true; 

export default handler;



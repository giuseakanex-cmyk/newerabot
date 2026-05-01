
let handler = async (m, { conn }) => {
    if (!m.isGroup) return m.reply('⚠️ Questo comando è utilizzabile solo all\'interno di un gruppo.');

    // Reazione di elaborazione sistema
    await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

    const users = global.db.data.users || {};
    let removedCount = 0;

    // Scansione database utenti per il gruppo corrente
    for (let jid in users) {
        let user = users[jid];
        // Rimozione permessi premium/staff legati a questo specifico chat ID
        if (user && user.premium === true && user.premiumGroup === m.chat) {
            user.premium = false;
            user.premiumGroup = '';
            removedCount++;
        }
    }

    if (removedCount === 0) {
        return m.reply('*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\nNessun profilo Staff rilevato in questo database di gruppo.');
    }

    // Estetica New Era: Pulita e Autoritaria
    let caption = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Authority Reset_
───────────────

*OPERAZIONE COMPLETATA*
• Staff rimossi: *${removedCount}*
• Privilegi revocati: *Totale*

_Il sistema ha aggiornato i permessi del gruppo._
───────────────
*ROOT ACCESS GRANTED*`.trim();

    await conn.sendMessage(m.chat, {
        text: caption,
        mentions: [m.sender]
    }, { quoted: m });
};

handler.help = ['resetvips'];
handler.tags = ['owner'];
handler.command = /^(resetvips|clearstaff)$/i;
handler.group = true;
handler.owner = true; 

export default handler;



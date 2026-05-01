let handler = async (m, { conn, usedPrefix, isOwner, isAdmin }) => {
    const user = global.db.data.users[m.sender] || {}
    if (!isOwner && !isAdmin && !user.premium) return

    let modNumber = m.sender.split('@')[0];

    let txt = `
*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Elite Access_
───────────────
👤 *Autorità:* @${modNumber}
🛡️ *Livello:* VIP System
───────────────
• *${usedPrefix}totag*
  Richiamo globale
• *${usedPrefix}pingv*
  Latenza dedicata
• *${usedPrefix}delv*
  Rimozione rapida mess.
• *${usedPrefix}nukegp*
  Simulazione override
• *${usedPrefix}warnvip*
  Flag sanzione
• *${usedPrefix}unwarnvip*
  Revoca sanzione
• *${usedPrefix}viplist*
  Database prescelti
───────────────
_newera elite v3.0_`.trim();

    await conn.sendMessage(m.chat, {
        text: txt,
        mentions: [m.sender]
    }, { quoted: m });
}

handler.help = ['menuvip']
handler.tags = ['menu']
handler.command = /^(menuvip)$/i
handler.premium = true 
handler.group = true

export default handler


import fetch from 'node-fetch'

let handler = async (m, { conn, text, command, usedPrefix, participants }) => {
    // Definizione dei comandi
    const isWarn = /^(warn|avverti|avvertimento)$/i.test(command)
    const isUnwarn = /^(unwarn|delwarn|togliwarn|togliavvertimento)$/i.test(command)
    const isList = /^(listawarn|warnlist|listavv|avvertimenti)$/i.test(command)

    // Inizializzazione database utenti se mancante
    if (!global.db.data.users) global.db.data.users = {}

    // 1. LISTA AVVERTIMENTI
    if (isList) {
        const users = global.db.data.users
        let warnedUsers = Object.entries(users).filter(([jid, user]) => 
            user.warns && user.warns[m.chat] > 0
        )

        if (warnedUsers.length === 0) {
            return m.reply(`『 📋 』 **𝐋𝐈𝐒𝐓𝐀 𝐖𝐀𝐑𝐍**\n\nNessun utente avvertito in questo gruppo.`)
        }

        let textList = `『 📋 』 **𝐔𝐓𝐄𝐍𝐓𝐈 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐓𝐈**\n\n`
        let mentions = []
        for (let [jid, data] of warnedUsers) {
            let count = data.warns[m.chat]
            textList += `• @${jid.split('@')[0]} [${count}/3]\n`
            mentions.push(jid)
        }

        return conn.sendMessage(m.chat, { text: textList, mentions: mentions }, { quoted: m })
    }

    // Identificazione del bersaglio (Target)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false

    if (!who) {
        return m.reply(`『 📋 』 **𝐔𝐒𝐎 𝐂𝐎𝐌𝐀𝐍𝐃𝐎**\n\n${usedPrefix + command} @utente [motivo]`)
    }

    // Pulizia JID per sicurezza
    who = who.split(':')[0] + '@s.whatsapp.net'

    if (!global.db.data.users[who]) global.db.data.users[who] = { warns: {} }
    let user = global.db.data.users[who]
    if (!user.warns) user.warns = {}
    if (typeof user.warns[m.chat] !== 'number') user.warns[m.chat] = 0

    // 2. AZIONE WARN
    if (isWarn) {
        if (who === conn.user.jid) return m.reply('『 ‼️ 』 Non puoi avvertire il bot.')
        
        // Verifica se il target è un owner
        const isOwner = global.owner.some(o => o[0] + '@s.whatsapp.net' === who)
        if (isOwner) return m.reply('『 ‼️ 』 Non puoi avvertire un amministratore di sistema.')

        let reason = text ? text.replace(/@\d+/g, '').trim() : (m.quoted ? 'Comportamento inappropriato' : 'Non specificato')
        
        user.warns[m.chat] += 1
        let count = user.warns[m.chat]

        if (count >= 3) {
            user.warns[m.chat] = 0
            await conn.sendMessage(m.chat, { text: `『 ☢️ 』 @${who.split('@')[0]} ha raggiunto 3/3 avvertimenti. Rimozione in corso...`, mentions: [who] }, { quoted: m })
            await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
        } else {
            await conn.sendMessage(m.chat, { text: `『 ⚠️ 』 **𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎**\n\n**𝐔𝐭𝐞𝐧𝐭𝐞:** @${who.split('@')[0]}\n**𝐌𝐨𝐭𝐢𝐯𝐨:** ${reason}\n**𝐒𝐭𝐚𝐭𝐨:** ${count}/3`, mentions: [who] }, { quoted: m })
        }
    }

    // 3. AZIONE UNWARN
    if (isUnwarn) {
        if (user.warns[m.chat] <= 0) return m.reply('『 ‼️ 』 L\'utente non ha avvertimenti attivi.')
        
        user.warns[m.chat] -= 1
        let count = user.warns[m.chat]
        
        await conn.sendMessage(m.chat, { text: `『 📉 』 **𝐖𝐀𝐑𝐍 𝐑𝐈𝐌𝐎𝐒𝐒𝐎**\n\n**𝐔𝐭𝐞𝐧𝐭𝐞:** @${who.split('@')[0]}\n**𝐒𝐭𝐚𝐭𝐨:** ${count}/3`, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['warn', 'unwarn', 'warnlist']
handler.tags = ['group']
handler.command = /^(warn|avverti|avvertimento|unwarn|delwarn|togliwarn|togliavvertimento|listawarn|warnlist|listavv|avvertimenti)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler



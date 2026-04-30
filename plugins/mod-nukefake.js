
// ==========================================
// LEGAM OS - PROTOCOLLO NUKE & RESUSCITA BY BLOOD
// ==========================================

const handler = async (m, { conn, command, usedPrefix, isAdmin, isOwner }) => {
    const chat = global.db.data.chats[m.chat] || {}
    const user = global.db.data.users[m.sender] || {}
    
    // Verifica permessi: Owner, Admin del gruppo o Membro VIP (Premium)
    const isVip = user.premium && user.premiumGroup === m.chat
    if (!isAdmin && !isOwner && !isVip) {
        return m.reply('⛔ *Accesso negato. Solo lo Staff / VIP possono eseguire questo protocollo.*')
    }

    // ☢️ PROTOCOLLO NUKEGP (Simulazione / Dominazione)
    if (command === 'nukegp') {
        try {
            await m.react('☣️')
            const groupMetadata = await conn.groupMetadata(m.chat)

            // Salvataggio dati per il ripristino
            chat.oldName = groupMetadata.subject
            chat.oldDesc = groupMetadata.desc || "Nessuna descrizione"
            global.db.data.chats[m.chat] = chat

            // 1. Rinnovo Estetico (Nome)
            let newName = `${groupMetadata.subject} | 𝐒𝐕𝐓 𝚩𝐘 𝐆𝐈𝐔𝐒𝚵ꨄ`.substring(0, 25)
            await conn.groupUpdateSubject(m.chat, newName).catch(() => {})

            // 2. Aggiornamento Descrizione
            await conn.groupUpdateDescription(m.chat, "𝐋𝚵𝐆𝚬𝐌 𝐎𝐒 𝐃𝐎𝐌𝐈𝐍𝐀 𝐒𝐔 𝐐𝐔𝚬𝐒𝐓𝐎 𝐓𝚬𝐑𝐑𝐈𝐓𝐎𝐑𝐈𝐎 🛡️").catch(() => {})

            // 3. Blocco Comunicazioni (Solo Admin)
            await conn.groupSettingUpdate(m.chat, 'announcement').catch(() => {})

            // 4. Generazione Invito e Tag All
            let code = await conn.groupInviteCode(m.chat).catch(() => "Link protetto")
            let link = `https://chat.whatsapp.com/${code}`
            const participants = groupMetadata.participants.map(u => u.id)

            let nukeMsg = `
╭──────────────────────╮
│  ☣️  *𝐆𝐑𝐔𝐏𝐏𝐎 𝐒𝐕𝐔𝐎𝐓𝐀𝐓𝐎* ☣️  │
╰──────────────────────╯

📣 *𝐃𝐀 𝐿𝛴𝐺𝛬𝑀 𝚩𝚯𝐓*

*𝐆𝐑𝐔𝐏𝐏𝐎 𝐒𝐕𝐔𝐎𝐓𝐀𝐓𝐎, 𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐓𝐔𝐓𝐓𝐈 𝐐𝐔𝐈:*
${link}

⚡ *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐿𝛴𝐺𝛬𝑀 𝚩𝚯𝐓*`.trim()

            await conn.sendMessage(m.chat, {
                text: nukeMsg,
                mentions: participants
            })

        } catch (e) {
            console.error(e)
            m.reply("❌ Errore durante l'esecuzione del protocollo.")
        }
    }

    // ✨ PROTOCOLLO RESUSCITA
    if (command === 'resuscita') {
        if (!chat.oldName) return m.reply("⚠️ *Nessun dato di ripristino trovato nel database Legam OS.*")

        try {
            await m.react('🕊️')
            
            // 1. Ripristino Nome
            await conn.groupUpdateSubject(m.chat, chat.oldName).catch(() => {})

            // 2. Ripristino Descrizione
            await conn.groupUpdateDescription(m.chat, chat.oldDesc).catch(() => {})

            // 3. Sblocco Comunicazioni
            await conn.groupSettingUpdate(m.chat, 'not_announcement').catch(() => {})

            let resMsg = `
✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦
✨ *𝐑𝐈𝐏𝐑𝐈𝐒𝐓𝐈𝐍𝐎 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐓𝐎* ✨
✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦

✅ _Nome e descrizione ripristinati._
🔓 _Il gruppo è nuovamente aperto._

🛡️ *𝐋𝐞𝐠𝐚𝐦 𝐎𝐒 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲*`.trim()

            await conn.sendMessage(m.chat, { text: resMsg })
            
            // Pulizia database temporaneo
            delete chat.oldName
            delete chat.oldDesc
            
        } catch (e) {
            m.reply("❌ Errore durante la resurrezione.")
        }
    }
}

handler.help = ['nukegp', 'resuscita']
handler.tags = ['owner', 'vip']
handler.command = /^(nukegp|resuscita)$/i

handler.group = true
handler.botAdmin = true 

export default handler



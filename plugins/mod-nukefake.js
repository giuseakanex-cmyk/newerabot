const handler = async (m, { conn, command, usedPrefix, isAdmin, isOwner }) => {
    const chat = global.db.data.chats[m.chat] || {}
    const user = global.db.data.users[m.sender] || {}
    
    // Verifica permessi: Owner, Admin del gruppo o Membro VIP (Premium)
    const isVip = user.premium && user.premiumGroup === m.chat
    if (!isAdmin && !isOwner && !isVip) {
        return m.reply('*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\n⚠️ Accesso negato: Autorizzazione Staff/VIP richiesta.')
    }

    // ☢️ PROTOCOLLO NUKEGP (Simulazione / Override)
    if (command === 'nukegp') {
        try {
            await m.react('☢️')
            const groupMetadata = await conn.groupMetadata(m.chat)

            // Salvataggio dati per il ripristino
            chat.oldName = groupMetadata.subject
            chat.oldDesc = groupMetadata.desc || "Nessuna descrizione"
            global.db.data.chats[m.chat] = chat

            // 1. Rinnovo Estetico (Nome)
            let newName = `${groupMetadata.subject} | 𝐎𝐕𝐄𝐑𝐑𝐈𝐃𝐄`.substring(0, 25)
            await conn.groupUpdateSubject(m.chat, newName).catch(() => {})

            // 2. Aggiornamento Descrizione
            await conn.groupUpdateDescription(m.chat, "𝐍𝐄𝐖 𝐄𝐑𝐀 𝐒𝐘𝐒𝐓𝐄𝐌 𝐎𝐕𝐄𝐑𝐑𝐈𝐃𝐄\n\nQuesto gruppo è ora sotto il controllo del protocollo di sicurezza.").catch(() => {})

            // 3. Blocco Comunicazioni (Solo Admin)
            await conn.groupSettingUpdate(m.chat, 'announcement').catch(() => {})

            // 4. Generazione Invito e Tag All
            let code = await conn.groupInviteCode(m.chat).catch(() => "Link protetto")
            let link = `https://chat.whatsapp.com/${code}`
            const participants = groupMetadata.participants.map(u => u.id)

            let nukeMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Protocollo Override_
───────────────
⚠️ *ATTENZIONE*
Il sistema ha neutralizzato il gruppo.

• *Punto di Ritrovo Temporaneo:*
${link}
───────────────
_system override active_`.trim()

            await conn.sendMessage(m.chat, {
                text: nukeMsg,
                mentions: participants
            })

        } catch (e) {
            console.error(e)
            m.reply("⚠️ *ERRORE SISTEMA:*\nImpossibile eseguire il protocollo Override.")
        }
    }

    // ✨ PROTOCOLLO RESUSCITA (Restore)
    if (command === 'resuscita') {
        if (!chat.oldName) return m.reply("*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_\n───────────────\n⚠️ Nessun punto di ripristino trovato nel database.")

        try {
            await m.react('🔄')
            
            // 1. Ripristino Nome
            await conn.groupUpdateSubject(m.chat, chat.oldName).catch(() => {})

            // 2. Ripristino Descrizione
            await conn.groupUpdateDescription(m.chat, chat.oldDesc).catch(() => {})

            // 3. Sblocco Comunicazioni
            await conn.groupSettingUpdate(m.chat, 'not_announcement').catch(() => {})

            let resMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Restore_
───────────────
✅ *Ripristino Completato*
• Parametri originali ricaricati.
• Restrizioni di comunicazione rimosse.
───────────────
_system normalized_`.trim()

            await conn.sendMessage(m.chat, { text: resMsg })
            
            // Pulizia database temporaneo
            delete chat.oldName
            delete chat.oldDesc
            
        } catch (e) {
            m.reply("⚠️ *ERRORE SISTEMA:*\nImpossibile ripristinare i dati del gruppo.")
        }
    }
}

handler.help = ['nukegp', 'resuscita']
handler.tags = ['owner', 'vip']
handler.command = /^(nukegp|resuscita)$/i

handler.group = true
handler.botAdmin = true 

export default handler
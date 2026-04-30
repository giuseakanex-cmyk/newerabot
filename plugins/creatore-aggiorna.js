
import { execSync } from 'child_process'

/**
 * COMANDO AGGIORNA / UPDATE
 * Funziona tramite Git: esegue il pull e resetta eventuali modifiche locali 
 * per evitare conflitti durante la sincronizzazione.
 */
let handler = async (m, { conn, text }) => {
    try {
        // Reazione di attesa
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        
        // Sincronizza i metadati del repository
        execSync('git fetch')
        let checkUpdates = execSync('git status -uno', { encoding: 'utf-8' })

        // Verifica se ci sono effettivamente modifiche
        if (checkUpdates.includes('Your branch is up to date') || checkUpdates.includes('nothing to commit')) {
            let msg = `
⊹ ࣪ ˖ ✦ ━━ 𝐀 𝐆 𝐆 𝐈 𝐎 𝐑 𝐍 𝐀 𝐌 𝐄 𝐍 𝐓 𝐎 ━━ ✦ ˖ ࣪ ⊹

✅ *𝐒𝐢𝐬𝐭𝐞𝐦𝐚 𝐠𝐢𝐚̀ 𝐚𝐥𝐥𝐢𝐧𝐞𝐚𝐭𝐨.*
⟡ _Nessun aggiornamento disponibile._

✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦`.trim()
            await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            return
        }

        // Esegue il reset e il pull forzato
        // git reset --hard è necessario se hai modificato file localmente (es. principale.js)
        let updateLog = execSync('git reset --hard && git pull', { encoding: 'utf-8' })
        
        let msg = `
⊹ ࣪ ˖ ✦ ━━ 𝐀 𝐆 𝐆 𝐈 𝐎 𝐑 𝐍 𝐀 𝐌 𝐄 𝐍 𝐓 𝐎 ━━ ✦ ˖ ࣪ ⊹

🚀 *𝐒𝐢𝐧𝐜𝐫𝐨𝐧𝐢𝐳𝐳𝐚𝐳𝐢𝐨𝐧𝐞 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐚.*

\`\`\`bash
${updateLog.trim()}
\`\`\`

⟡ _Il bot si riavvierà automaticamente se hai un monitor attivo._

✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦`.trim()
        
        await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: '🚀', key: m.key } })

    } catch (err) {
        // Gestione errori git (es. cartella non git, conflitti gravi)
        let msg = `
⊹ ࣪ ˖ ✦ ━━ 𝐄 𝐑 𝐑 𝐎 𝐑 𝐄 ━━ ✦ ˖ ࣪ ⊹

❌ *𝐅𝐚𝐥𝐥𝐢𝐦𝐞𝐧𝐭𝐨 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐦𝐞𝐧𝐭𝐨.*

\`\`\`bash
${err.stdout ? err.stdout.toString() : err.message}
\`\`\`

✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦`.trim()
        await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['aggiorna', 'update']
handler.tags = ['creatore']
handler.command = ['aggiorna', 'update']
handler.owner = true

export default handler


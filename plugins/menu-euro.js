const defaultMenu = {
  before: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Economy Matrix_\n───────────────`.trimStart(),
  header: '\n◤  *%category*  ◣',
  body: '🪙  *%cmd*',
  footer: '───────────────',
  after: `_system economy active_`
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  const categorie = {
    'euro': 'ECONOMIA',
    'rpg': 'AVVENTURA',
    'taglia': 'TAGLIE',
    'virtual': 'VIRTUALI'
  }

  try {
    await conn.sendPresenceUpdate('composing', m.chat)
    
    let menuCompleto = defaultMenu.before + '\n'

    for (let tag in categorie) {
        let comandi = Object.values(global.plugins)
            .filter(plugin => !plugin.disabled && plugin.tags && plugin.tags.includes(tag))
            .map(plugin => ({
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                prefix: 'customPrefix' in plugin
            }))

        if (comandi.length > 0) {
            menuCompleto += defaultMenu.header.replace(/%category/g, categorie[tag]) + '\n'
            menuCompleto += comandi.map(menu => 
                menu.help.map(cmd => 
                    defaultMenu.body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
                ).join('\n')
            ).join('\n')
            menuCompleto += '\n' + defaultMenu.footer + '\n'
        }
    }

    menuCompleto += defaultMenu.after

   await conn.sendMessage(m.chat, {
      video: { url: './media/menu/menu4.mp4' },
      caption: menuCompleto.trim(),
      gifPlayback: true,
      gifAttribution: 2,
      mimetype: 'video/mp4'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply("⚠️ *ERRORE SISTEMA*")
  }
}

handler.help = ['menueuro']
handler.tags = ['menu']
handler.command = ['menueuro']

export default handler

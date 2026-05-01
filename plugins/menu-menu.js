let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Definizione del testo con font Bold Sans e Italic per un look premium
    let text = `
*𝐍𝐄𝐖 𝐄𝐑𝐀*
_The Next Generation Core_

Ciao @${m.sender.split('@')[0]},
Seleziona una categoria qui sotto per visualizzare i comandi disponibili.

*STATS*
• *Stato:* Operativo
• *Sessione:* Attiva
`.trim();

    // Array di bottoni (senza Download e Ricerca)
    const buttons = [
      { buttonId: `${_p}menustrumenti`, buttonText: { displayText: '🛠️ Strumenti' }, type: 1 },
      { buttonId: `${_p}menueuro`, buttonText: { displayText: '💰 Economia' }, type: 1 },
      { buttonId: `${_p}menugiochi`, buttonText: { displayText: '🎮 Giochi' }, type: 1 },
      { buttonId: `${_p}menugruppo`, buttonText: { displayText: '👥 Gruppo' }, type: 1 },
      { buttonId: `${_p}menucreatore`, buttonText: { displayText: '👨‍💻 Creatore' }, type: 1 },
      { buttonId: `${_p}menuvip`, buttonText: { displayText: '🛡️ VIP' }, type: 1 },
      { buttonId: `${_p}menuspeciale`, buttonText: { displayText: '🪩 Speciale' }, type: 1 },
      { buttonId: `${_p}menusicurezza`, buttonText: { displayText: '🚨 Sicurezza' }, type: 1 },
      { buttonId: `${_p}contronuke on`, buttonText: { displayText: '☢️ Anti-Nuke' }, type: 1 },
      { buttonId: `${_p}feedback`, buttonText: { displayText: '✍️ Feedback' }, type: 1 }
    ];

    // Invio del messaggio
    await conn.sendMessage(m.chat, {
      text: text,
      footer: 'ɴᴇᴡ ᴇʀᴀ ᴄᴏɴᴛʀᴏʟ',
      buttons: buttons,
      headerType: 1,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      text: "*⚠️ ERRORE SISTEMA*\nImpossibile generare il menu."
    }, { quoted: m });
  }
}

handler.help = ['menu']
handler.command = ['menu', 'menuall', 'menucompleto', 'funzioni', 'comandi', 'help']

export default handler

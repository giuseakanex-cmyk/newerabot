
const MENU_IMAGE_URL = 'https://i.ibb.co/5gt7Zdvf/IMG-1823.png';

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Testo minimalista con font elegante
    let text = `🛡️ 𝐔𝐭𝐢𝐥𝐢𝐳𝐳𝐚 𝐢 𝐛𝐨𝐭𝐭𝐨𝐧𝐢 𝐪𝐮𝐢 𝐬𝐨𝐭𝐭𝐨 𝐩𝐞𝐫 𝐚𝐜𝐜𝐞𝐝𝐞𝐫𝐞 𝐚𝐥 𝐦𝐞𝐧𝐮 𝐝𝐞𝐬𝐢𝐝𝐞𝐫𝐚𝐭𝐨.`;

    // Array di bottoni per tutti i menu disponibili
    const buttons = [
       { buttonId: `${_p}menustrumenti`, buttonText: { displayText: '🛠️ 𝐒𝐭𝐫𝐮𝐦𝐞𝐧𝐭𝐢' }, type: 1 },
      { buttonId: `${_p}menueuro`, buttonText: { displayText: '💰 𝐄𝐜𝐨𝐧𝐨𝐦𝐢𝐚' }, type: 1 },
      { buttonId: `${_p}menugiochi`, buttonText: { displayText: '🎮 𝐆𝐢𝐨𝐜𝐡𝐢' }, type: 1 },
      { buttonId: `${_p}menugruppo`, buttonText: { displayText: '👥 𝐆𝐫𝐮𝐩𝐩𝐨' }, type: 1 },
      { buttonId: `${_p}menuricerche`, buttonText: { displayText: '🔍 𝐑𝐢𝐜𝐞𝐫𝐜𝐡𝐞' }, type: 1 },
      { buttonId: `${_p}menudownload`, buttonText: { displayText: '📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝' }, type: 1 },
      { buttonId: `${_p}menucreatore`, buttonText: { displayText: '👨‍💻 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐞' }, type: 1 },
      { buttonId: `${_p}menuvip`, buttonText: { displayText: '🛡️ 𝐕𝐈𝐏' }, type: 1 },
      { buttonId: `${_p}menuspeciale`, buttonText: { displayText: '🪩 𝐒𝐩𝐞𝐜𝐢𝐚𝐥𝐞' }, type: 1 },
      { buttonId: `${_p}menusicurezza`, buttonText: { displayText: '🚨 𝐒𝐢𝐜𝐮𝐫𝐞𝐳𝐳𝐚' }, type: 1 },
      { buttonId: `${_p}contronuke on`, buttonText: { displayText: '☢️ 𝐀𝐧𝐭𝐢-𝐍𝐮𝐤𝐞' }, type: 1 },
      { buttonId: `${_p}feedback`, buttonText: { displayText: '✍️ 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤' }, type: 1 }
    ];

    // Invio del messaggio interattivo
    await conn.sendMessage(m.chat, {
      image: { url: MENU_IMAGE_URL },
      caption: text,
      footer: '𝐋 𝐄 𝐆 𝐀 𝐌  𝐎 𝐒',
      buttons: buttons,
      headerType: 4
    }, { quoted: m });

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      text: "❌ Errore caricamento menu interattivo:\n" + String(e)
    }, { quoted: m })
  }
}

handler.help = ['menu']
handler.command = ['menu', 'menuall', 'menucompleto', 'funzioni','comandi', 'help']

export default handler



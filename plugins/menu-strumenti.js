let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const strumentiList = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled && plugin.tags && plugin.tags.includes('strumenti'))
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        prefix: 'customPrefix' in plugin
      }));

    let textMenu = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Utility Tools_\n───────────────\n`;

    strumentiList.forEach(menu => {
      menu.help.forEach(cmd => {
        if (cmd) {
            textMenu += `• ${_p + cmd}\n`;
        }
      });
    });

    textMenu += `───────────────\n_system operative_`;

    await conn.sendMessage(m.chat, {
      text: textMenu.trim()
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('*⚠️ ERRORE SISTEMA*');
  }
};

handler.help = ['menustrumenti'];
handler.tags = ['menu'];
handler.command = /^(menustrumenti|menutools|strumenti|tools)$/i;

export default handler;

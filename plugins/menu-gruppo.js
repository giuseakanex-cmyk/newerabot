let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const gruppoList = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled && plugin.tags && plugin.tags.includes('gruppo'))
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        prefix: 'customPrefix' in plugin
      }));

    let textMenu = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Group Control_\n───────────────\n`;

    gruppoList.forEach(menu => {
      menu.help.forEach(cmd => {
        if (cmd) {
            textMenu += `• ${_p + cmd}\n`;
        }
      });
    });

    textMenu += `───────────────\n_administration active_`;

    await conn.sendMessage(m.chat, {
      text: textMenu.trim()
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('*⚠️ ERRORE SISTEMA*');
  }
};

handler.help = ['menugruppo'];
handler.tags = ['menu'];
handler.command = /^(menugruppo|menugp|menuadmin|gruppo|group)$/i;

export default handler;

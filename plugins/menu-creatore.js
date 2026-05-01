let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '👑', key: m.key } });
    
    const ownerList = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled && plugin.tags && plugin.tags.includes('creatore'))
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        prefix: 'customPrefix' in plugin
      }));

    let textMenu = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Core Creator_\n───────────────\n\n`;

    ownerList.forEach(menu => {
      menu.help.forEach(cmd => {
        if (cmd) {
            textMenu += `• ${_p + cmd}\n`;
        }
      });
    });

    textMenu += `\n───────────────\n_root authority access_`;

    await conn.sendMessage(m.chat, {
      video: { url: './media/menu/menu6.mp4' },
      caption: textMenu.trim(),
      gifPlayback: true,
      gifAttribution: 2,
      mimetype: 'video/mp4'
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ *ERRORE SISTEMA*');
  }
};

handler.help = ['menucreatore'];
handler.tags = ['menu'];
handler.command = /^(menuowner|menucreatore)$/i;

export default handler;

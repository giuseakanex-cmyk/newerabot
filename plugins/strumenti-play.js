
import yts from 'yt-search';
import fg from 'api-dylux';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`『 💡 』 **𝐃𝐈𝐑𝐄𝐓𝐓𝐈𝐕𝐀 𝐋𝐄𝐆𝐀𝐌 𝐎𝐒**\n\nScrivi: *${usedPrefix + command}* nome canzone o link YouTube.`);

  try {
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) return m.reply('『 ⚠️ 』 **𝐑𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐨 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐧𝐞𝐠𝐥𝐢 𝐚𝐫𝐜𝐡𝐢𝐯𝐢.**');

    const url = vid.url;

    if (command === 'play') {
        let infoMsg = `✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦\n`;
        infoMsg += `· 🎵 𝐋 𝐄 𝐆 𝐀 𝐌  𝐌 𝐔 𝐒 𝐈 𝐂 ·\n`;
        infoMsg += `✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦\n\n`;
        infoMsg += `『 📌 』 **𝐓𝐢𝐭𝐨𝐥𝐨:** ${vid.title}\n`;
        infoMsg += `『 ⏱️ 』 **𝐃𝐮𝐫𝐚𝐭𝐚:** ${vid.timestamp}\n\n`;
        infoMsg += `*𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐢𝐥 𝐟𝐨𝐫𝐦𝐚𝐭𝐨 𝐝𝐚 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐫𝐞:*`;

        return await conn.sendMessage(m.chat, {
            image: { url: vid.thumbnail },
            caption: infoMsg,
            footer: '🛡️ 𝐋𝐞𝐠𝐚𝐦 𝐎𝐒 𝐄𝐧𝐭𝐞𝐫𝐭𝐚𝐢𝐧𝐦𝐞𝐧𝐭',
            buttons: [
                { buttonId: `${usedPrefix}playaud ${url}`, buttonText: { displayText: '🎵 𝐀𝐔𝐃𝐈𝐎 (𝐌𝐏𝟑)' }, type: 1 },
                { buttonId: `${usedPrefix}playvid ${url}`, buttonText: { displayText: '🎬 𝐕𝐈𝐃𝐄𝐎 (𝐌𝐏𝟒)' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "📥", key: m.key } });

    let downloadUrl = null;
    const isAudio = command === 'playaud';

    // Recupero Link
    try {
        let res = isAudio ? await fg.yta(url) : await fg.ytv(url);
        if (res && res.dl_url) downloadUrl = res.dl_url;
    } catch {
        let api = isAudio ? 'ytmp3' : 'ytmp4';
        let res = await fetch(`https://api.vreden.my.id/api/${api}?url=${url}`);
        let json = await res.json();
        downloadUrl = json.result?.download?.url || json.result?.url;
    }

    if (!downloadUrl) throw new Error();

    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `input_${Date.now()}`);
    const outputPath = path.join(tmpDir, `output_${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`);

    // Scarichiamo il file
    const res = await fetch(downloadUrl);
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(inputPath, Buffer.from(arrayBuffer));

    if (isAudio) {
        // Conversione FFmpeg
        await new Promise((resolve, reject) => {
            exec(`ffmpeg -i ${inputPath} -vn -ar 44100 -ac 2 -b:a 128k ${outputPath}`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(outputPath),
            mimetype: 'audio/mpeg',
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, {
            video: fs.readFileSync(inputPath),
            mimetype: 'video/mp4',
            caption: `『 ✅ 』 **𝐒𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨**\n\n🛡️ *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐋𝐞𝐠𝐚𝐦 𝐎𝐒*`,
        }, { quoted: m });
    }

    // Pulizia file temporanei
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('『 ❌ 』 **𝐄𝐑𝐑𝐎𝐑𝐄 𝐏𝐋𝐀𝐘:** File non disponibile o server offline.');
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;



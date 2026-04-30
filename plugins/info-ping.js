import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {
    let old = performance.now()
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    
    // Ping con precisione decimale e padding (es: 023.5)
    let speed = (performance.now() - old).toFixed(1).padStart(5, '0')

    let txt = `
Ｎ Ｅ Ｗ Ｅ Ｒ Ａ  ｜  ＳＹＳＴＥＭ

◤  𝐏𝐈𝐍𝐆   ﹕ ${speed} ᴍꜱ
◣  𝐔𝐏𝐓𝐈𝐌𝐄 ﹕ ${uptime}

─── ɴᴇᴡᴇʀᴀ ᴄᴏʀᴇ ᴠ${global.versione} ───`.trim()

    await m.reply(txt)
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000).toString().padStart(2, '0')
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    
    // Formato uptime compatto ed elegante
    return `${h}ʜ  ${m.toString().padStart(2, '0')}ᴍ  ${s.toString().padStart(2, '0')}ꜱ`
}

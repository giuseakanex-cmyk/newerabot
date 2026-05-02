
import { execSync } from 'child_process';
import fs from 'fs';
import archiver from 'archiver';
import path from 'path';

let handler = async (m, { conn, isOwner }) => {
    // Solo l'Owner può scaricare l'intero codice sorgente per motivi di sicurezza
    if (!isOwner) return m.reply("*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Security_\n───────────────\n⚠️ Accesso negato: Azione riservata all'Owner.");

    await m.react('wait');
    const backupName = `backup_${new Date().getTime()}.zip`;
    const outputPath = path.join(process.cwd(), backupName);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
        const stats = fs.statSync(outputPath);
        const fileSize = (stats.size / 1024 / 1024).toFixed(2);

        let caption = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Backup_
───────────────
✅ *Archivio Generato*
• *File:* \`${backupName}\`
• *Dimensione:* ${fileSize} MB
───────────────
_trasferimento in corso..._`.trim();

        try {
            await conn.sendMessage(m.chat, { 
                document: fs.readFileSync(outputPath), 
                mimetype: 'application/zip', 
                fileName: backupName, 
                caption: caption 
            }, { quoted: m });
            
            // Elimina il file dal server dopo l'invio per non occupare spazio
            fs.unlinkSync(outputPath);
            await m.react('✅');
        } catch (e) {
            console.error(e);
            m.reply("⚠️ *Errore durante l'invio del file.*");
        }
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    // Esclusioni strategiche per mantenere lo zip leggero
    archive.glob('**/*', {
        cwd: process.cwd(),
        ignore: [
            'node_modules/**',
            '.git/**',
            '.npm/**',
            backupName, // Esclude se stesso
            'tmp/**',
            'session/**', // Escludi la sessione se non vuoi che altri la rubino
            '*.zip',
            '*.rar'
        ]
    });

    await archive.finalize();
};

handler.help = ['zip', 'backup'];
handler.tags = ['owner'];
handler.command = /^(zip|backup|getbot)$/i;
handler.owner = true;

export default handler;
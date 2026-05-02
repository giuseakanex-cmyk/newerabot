let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.isGroup) return;

    try {
        const metadata = await conn.groupMetadata(m.chat);
        const groupName = metadata.subject;
        const inviteCode = await conn.groupInviteCode(m.chat);
        const inviteLink = 'https://chat.whatsapp.com/' + inviteCode;

        // Costruzione dei bottoni interattivi (Meccanica cta_copy)
        const interactiveButtons = [
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Copia Link",
                    id: inviteLink,
                    copy_code: inviteLink
                })
            }
        ];

        // Struttura del messaggio interattivo New Era
        const msg = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            title: "*𝐍𝐄𝐖 𝐄𝐑𝐀* • Invite System",
                            hasMediaAttachment: false
                        },
                        body: {
                            text: `*Gruppo:* ${groupName}\n\nUtilizza il tasto sottostante per copiare il link d'invito ufficiale negli appunti.`
                        },
                        footer: {
                            text: "powered by new era security"
                        },
                        nativeFlowMessage: {
                            buttons: interactiveButtons
                        }
                    }
                }
            }
        };

        await conn.relayMessage(m.chat, msg, {});

    } catch (e) {
        console.error(e);
        m.reply("⚠️ *ERRORE:* Impossibile generare il link. Assicurati che il bot sia Amministratore.");
    }
};

handler.help = ['link'];
handler.tags = ['gruppo'];
handler.command = /^(link|invito)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
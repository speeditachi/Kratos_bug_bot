const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers } = require("@whiskeysockets/baileys");
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/pair', async (req, res) => {
    let phoneNumber = req.body.phone;
    if (!phoneNumber) {
        return res.status(400).json({ error: "Antre nimewo WhatsApp ou tanpri." });
    }

    // Retire siy +, espas, ak karaktè espesyal
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (phoneNumber.length < 8) {
        return res.status(400).json({ error: "Nimewo a pa valid." });
    }

    const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const sessionDir = path.join(__dirname, 'sessions', sessionId);

    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        const sock = makeWASocket({
            logger: pino({ level: "silent" }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Chrome"),
            auth: state
        });

        sock.ev.on("creds.update", saveCreds);

        await delay(3000);
        const code = await sock.requestPairingCode(phoneNumber);
        
        // Fòmate kòd la (egzanp: XXXX-XXXX)
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

        res.json({ code: formattedCode });

        // Netwaye dosye sesyon an apre 2 minit pou l pa plen sèvè a
        setTimeout(() => {
            try {
                sock.end();
                if (fs.existsSync(sessionDir)) {
                    fs.rmSync(sessionDir, { recursive: true, force: true });
                }
            } catch (e) {}
        }, 120000);

    } catch (error) {
        console.error("Erè Pairing:", error);
        if (fs.existsSync(sessionDir)) {
            fs.rmSync(sessionDir, { recursive: true, force: true });
        }
        res.status(500).json({ error: "Echèk nan jenere kòd la. Eseye ankò." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`KRATOS BUG BOT ap kouri sou pò ${PORT}`);
});

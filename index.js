<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KRATOS BUG BOT - Pairing</title>
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); width: 100%; max-width: 400px; text-align: center; }
        input { width: 90%; padding: 12px; margin: 15px 0; border: 1px solid #475569; border-radius: 8px; background: #0f172a; color: #fff; font-size: 16px; }
        button { background: #3b82f6; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; width: 100%; font-weight: bold; }
        button:hover { background: #2563eb; }
        #code-display { margin-top: 20px; font-size: 20px; color: #4ade80; font-weight: bold; word-break: break-all; }
    </style>
</head>
<body>
    <div class="card">
        <h2>KRATOS BUG BOT</h2>
        <p>Antre nimewo WhatsApp ou (avèk kòd peyi a, san +):</p>
        <input type="text" id="phone" placeholder="egz: 50937000000">
        <button onclick="getPairingCode()">Jwenn Kòd la</button>
        <div id="code-display"></div>
    </div>

    <script>
        async function getPairingCode() {
            const phone = document.getElementById('phone').value;
            const display = document.getElementById('code-display');
            if (!phone) {
                alert('Tanpri antre yon nimewo.');
                return;
            }
            display.innerText = 'Ap chache kòd la...';
            try {
                const response = await fetch('/pair', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                const data = await response.json();
                if (data.code) {
                    display.innerText = 'Kòd ou: ' + data.code;
                } else {
                    display.innerText = 'Erè: ' + (data.error || 'Echèk');
                }
            } catch (err) {
                display.innerText = 'Erè koneksyon ak sèvè a.';
            }
        }
    </script>
</body>
</html>

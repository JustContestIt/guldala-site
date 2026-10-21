// Until the CRM takes orders, Tatiana gets each request as a Telegram message (brief §8).
// Without TELEGRAM_* in .env the request is only logged — fine for previews, not for production.
export async function notifyTatiana(text: string): Promise<boolean> {
  console.log(`[guldala] ${text.replace(/\n/g, " | ")}`);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return true;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

import { Telegraf } from 'telegraf';
import fs from 'fs';

const bot = new Telegraf('8004413557:AAHPVitUB2P8c4OIf-3GNOO-w2geohUFgGI');
const ADMIN_ID = '7844032739';

function generateKey() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

bot.command('createuser', async (kunle) => {
  if (kunle.from.id.toString() !== ADMIN_ID) return;

  const args = kunle.message.text.split(' ');
  if (args.length < 3) return kunle.reply('Usage: /createuser <username> <days>');

  const [_, username, daysStr] = args;
  const days = parseInt(daysStr);
  if (isNaN(days)) return kunle.reply('Days must be a number');

  const key = generateKey();
  const expires = new Date(Date.now() + days * 86400000).toISOString();
  const users = fs.existsSync('users.json') ? JSON.parse(fs.readFileSync('users.json')) : [];
  users.push({ username, key, expires });
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

kunle.reply(`✅ Key created:
\`\`\`
👤 Username: ${username}
🔑 Key: ${key}
📆 Expires: ${expires}
\`\`\`

\`\`\`
🧪 How to Use:
1. Visit: https://your-webapp-link.com
2. Paste username & key to login
\`\`\`
`);
});

bot.launch();
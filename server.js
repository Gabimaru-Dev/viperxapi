import express from 'express';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();
const __dirname = path.resolve();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'viperx_secret',
  resave: false,
  saveUninitialized: true
}));

function getUsers() {
  try {
    return JSON.parse(fs.readFileSync('./users.json'));
  } catch {
    return [];
  }
}

function isExpired(dateStr) {
  const now = new Date();
  const expiry = new Date(dateStr);
  return now.getTime() > expiry.getTime();
}

app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect('/dashboard');
  }
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
  const { username, key } = req.body;
  const users = getUsers();
  const found = users.find(u => u.username === username && u.key === key);

  if (!found || isExpired(found.expires)) {
    return res.send('<h3>❌ Invalid or expired credentials. <a href="/">Go back</a></h3>');
  }

  req.session.loggedIn = true;
  req.session.username = username;
  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/');
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.post('/api/freeze', async (req, res) => {
  if (!req.session.loggedIn) return res.status(401).send('Unauthorized');
  const { number, mode } = req.body;

  const log = JSON.parse(fs.readFileSync('./log.json', 'utf-8') || '[]');
  log.push({
    user: req.session.username,
    mode,
    number,
    time: new Date().toISOString()
  });
  fs.writeFileSync('./log.json', JSON.stringify(log, null, 2));

  const url = `http://159.223.50.150:2000/execution?target=${number}&mode=${mode}&username=gabi&key=SYY2`;
  try {
    const fetch = (await import('node-fetch')).default;
    await fetch(url);
    res.send(`✅ Sent ${mode.toUpperCase()} to ${number}`);
  } catch (err) {
    res.status(500).send('❌ Failed to send request');
  }
});

app.listen(3000, () => console.log('ViperX running on http://localhost:3000'));
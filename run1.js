
const { spawn } = require('child_process');

function runScript(name, path) {
  const proc = spawn('node', [path], { stdio: 'inherit' });
  proc.on('exit', (code) => {
    console.log(`${name} exited with code ${code}`);
  });
}

runScript('🤖 Telegram Bot', 'bot.js');
runScript('🕒 KeepAlive', 'keepalive1.js');
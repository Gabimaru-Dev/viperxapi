
import { spawn } from 'child_process';

function runScript(name, path) {
  const proc = spawn('node', [path], { stdio: 'inherit' });
  proc.on('exit', (code) => {
    console.log(`${name} exited with code ${code}`);
  });
}

runScript('🌐 Server', 'server.js');
runScript('🕒 KeepAlive', 'keepalive.js');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\bmura\\.gemini\\antigravity\\brain\\d9be3f9e-0c45-46ee-a8cc-f6f3ca57ce73';
const PROFILE_DIR = 'C:\\Users\\bmura\\AppData\\Local\\Temp\\chrome-citypulse-profile';
const PORT = 9333;

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(PROFILE_DIR)) {
    fs.mkdirSync(PROFILE_DIR, { recursive: true });
  }

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE_DIR}`,
    '--no-sandbox',
    '--window-size=1440,900',
    'http://localhost:5173',
  ]);

  console.log(`Launched isolated Chrome on port ${PORT}...`);

  // Wait for debug port
  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      targets = await httpGet(`http://127.0.0.1:${PORT}/json/list`);
      if (Array.isArray(targets) && targets.length > 0) break;
    } catch (e) {
      // retry
    }
  }

  if (!targets) {
    console.error('Could not connect to Chrome debugging target');
    chromeProc.kill();
    return;
  }

  // Find page target with localhost:5173
  let pageTarget = targets.find((t) => t.type === 'page' && t.url.includes('5173'));
  if (!pageTarget) {
    pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  }

  console.log('Selected target:', pageTarget.title, pageTarget.url, pageTarget.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const res = JSON.parse(event.data);
    if (res.id && callbacks.has(res.id)) {
      callbacks.get(res.id)(res);
      callbacks.delete(res.id);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      const timer = setTimeout(() => {
        callbacks.delete(id);
        reject(new Error(`Timeout waiting for response to ${method}`));
      }, 10000);

      callbacks.set(id, (val) => {
        clearTimeout(timer);
        resolve(val);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise((r) => (ws.onopen = r));
  console.log('WebSocket open.');

  await send('Page.enable');
  await send('Runtime.enable');

  // Wait for 3D city scene to mount and buildings to rise
  console.log('Waiting 3.5s for 3D city scene to mount and buildings to rise...');
  await new Promise((r) => setTimeout(r, 3500));

  const saveImage = (name, base64) => {
    const buf = Buffer.from(base64, 'base64');
    fs.writeFileSync(name, buf);
    const artPath = path.join(ARTIFACT_DIR, name);
    try {
      fs.writeFileSync(artPath, buf);
    } catch (e) {
      console.warn('Could not save to artifact dir:', e.message);
    }
    console.log(`Saved ${name} (${buf.length} bytes) successfully!`);
  };

  // 1. Capture Login Screenshot
  console.log('Capturing login screenshot...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot1.result && shot1.result.data) {
    saveImage('screenshot_login.png', shot1.result.data);
  }

  // 2. Click "Demo Operator" button to enter Dashboard
  console.log('Clicking Demo Operator login button...');
  await send('Runtime.evaluate', {
    expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const demoOpBtn = buttons.find(b => b.textContent.includes('Demo Operator'));
      if (demoOpBtn) demoOpBtn.click();
    `,
  });

  // Wait for camera dive transition to complete and dashboard to mount
  console.log('Waiting 2.5s for camera fly-through transition into dashboard...');
  await new Promise((r) => setTimeout(r, 2500));

  // Capture Dashboard Screenshot
  console.log('Capturing dashboard screenshot...');
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot2.result && shot2.result.data) {
    saveImage('screenshot_dashboard.png', shot2.result.data);
  }

  // 3. Open AI City Assistant
  console.log('Opening AI City Assistant in Dashboard...');
  await send('Runtime.evaluate', {
    expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find(b => b.textContent.includes('AI City Assistant'));
      if (aiBtn) aiBtn.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  const shotAi = await send('Page.captureScreenshot', { format: 'png' });
  if (shotAi.result && shotAi.result.data) {
    saveImage('screenshot_ai_assistant.png', shotAi.result.data);
  }

  // Close AI modal and switch to Citizen Portal
  await send('Runtime.evaluate', {
    expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const closeBtn = buttons.find(b => b.querySelector('svg.lucide-x'));
      if (closeBtn) closeBtn.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 400));

  console.log('Switching to Citizen View...');
  await send('Runtime.evaluate', {
    expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const citizenBtn = buttons.find(b => b.textContent.includes('Citizen'));
      if (citizenBtn) citizenBtn.click();
    `,
  });

  await new Promise((r) => setTimeout(r, 1500));
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot3.result && shot3.result.data) {
    saveImage('screenshot_citizen.png', shot3.result.data);
  }

  ws.close();
  chromeProc.kill();
  console.log('All screenshots captured successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});

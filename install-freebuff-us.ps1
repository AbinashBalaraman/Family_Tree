# install-freebuff-us.ps1
# Script to install and configure Freebuff with US residential proxy routing on Windows

Write-Host "⚡ Starting Freebuff US-Spoof Setup..." -ForegroundColor Cyan

# 1. Check for Node.js
try {
    $nodeVer = node -v
    Write-Host "✔ Node.js is installed ($nodeVer)" -ForegroundColor Green
} catch {
    Write-Error "❌ Node.js is not installed! Please download and install Node.js from https://nodejs.org first."
    Exit
}

# 2. Install Freebuff globally
Write-Host "Installing freebuff globally via npm..." -ForegroundColor Yellow
npm install -g freebuff

# 3. Find global index.js path
$npmRoot = (npm root -g).Trim()
$indexJsPath = Join-Path $npmRoot "freebuff\index.js"

if (-not (Test-Path $indexJsPath)) {
    Write-Error "❌ Could not find installed freebuff entry file at: $indexJsPath"
    Exit
}

Write-Host "Found entry file at: $indexJsPath" -ForegroundColor Green
Write-Host "Applying US Residential Proxy patch..." -ForegroundColor Yellow

# Read file content
$content = [System.IO.File]::ReadAllText($indexJsPath)

# Patched code block
$patch = @"
const httpProxy = require('http')
const netProxy = require('net')

const socksProxies = [
  '174.77.111.196:4145',
  '174.77.111.197:4145',
  '216.68.128.121:4145',
  '68.1.210.163:4145',
  '174.75.211.222:4145',
  '174.75.211.193:4145',
  '174.64.199.79:4145',
  '174.64.199.82:4145'
]

let proxyIndex = 0

function connectSocks5(proxyHost, proxyPort, targetHost, targetPort) {
  return new Promise((resolve, reject) => {
    const socket = netProxy.connect({ host: proxyHost, port: proxyPort })
    socket.setTimeout(5000)
    socket.on('timeout', () => {
      socket.destroy()
      reject(new Error('SOCKS5 timeout'))
    })
    socket.on('error', (err) => {
      reject(err)
    })
    socket.on('connect', () => {
      socket.write(Buffer.from([0x05, 0x01, 0x00]))
    })
    let state = 'greeting'
    socket.on('data', (chunk) => {
      if (state === 'greeting') {
        if (chunk[0] !== 0x05 || chunk[1] !== 0x00) {
          socket.destroy()
          return reject(new Error('SOCKS5 auth negotiation failed'))
        }
        const hostBuf = Buffer.from(targetHost, 'utf8')
        const req = Buffer.alloc(7 + hostBuf.length)
        req[0] = 0x05
        req[1] = 0x01
        req[2] = 0x00
        req[3] = 0x03
        req[4] = hostBuf.length
        hostBuf.copy(req, 5)
        req.writeUInt16BE(targetPort, 5 + hostBuf.length)
        socket.write(req)
        state = 'connect'
      } else if (state === 'connect') {
        if (chunk[0] !== 0x05 || chunk[1] !== 0x00) {
          socket.destroy()
          return reject(new Error('SOCKS5 CONNECT failed'))
        }
        socket.removeAllListeners('data')
        socket.removeAllListeners('timeout')
        resolve(socket)
      }
    })
  })
}

async function connectToTargetWithFallback(targetHost, targetPort) {
  let startIndex = proxyIndex
  for (let i = 0; i < socksProxies.length; i++) {
    const currentIndex = (startIndex + i) % socksProxies.length
    const proxyStr = socksProxies[currentIndex]
    const [proxyHost, proxyPortStr] = proxyStr.split(':')
    const proxyPort = parseInt(proxyPortStr, 10)
    try {
      const socket = await connectSocks5(proxyHost, proxyPort, targetHost, targetPort)
      proxyIndex = currentIndex
      return socket
    } catch (err) {
      // try next
    }
  }
  throw new Error('All SOCKS5 proxies failed')
}

function startLocalProxy() {
  return new Promise((resolve, reject) => {
    const server = httpProxy.createServer((req, res) => {
      res.writeHead(501)
      res.end('Not Implemented')
    })
    server.on('connect', (req, clientSocket, head) => {
      const [targetHost, targetPortStr] = req.url.split(':')
      const targetPort = parseInt(targetPortStr || '443', 10)
      
      clientSocket.on('error', () => {})
      
      connectToTargetWithFallback(targetHost, targetPort)
        .then((socksSocket) => {
          socksSocket.on('error', () => {})
          
          clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')
          if (head && head.length > 0) socksSocket.write(head)
          clientSocket.pipe(socksSocket)
          socksSocket.pipe(clientSocket)
        })
        .catch((err) => {
          try {
            clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n')
            clientSocket.end()
          } catch (e) {}
        })
    })
    server.listen(0, '127.0.0.1', () => {
      resolve(server.address().port)
    })
    server.on('error', reject)
  })
}

async function main() {
  try {
    const port = await startLocalProxy()
    const proxyUrl = "http://127.0.0.1:" + port
    process.env.HTTPS_PROXY = proxyUrl
    process.env.HTTP_PROXY = proxyUrl
    process.env.https_proxy = proxyUrl
    process.env.http_proxy = proxyUrl
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  } catch (err) {}

  await ensureBinaryExists()

  const child = spawnInstalledBinary()
  const exitListener = attachExitHandler(child)

  setTimeout(() => {
    checkForUpdates(child, exitListener)
  }, 100)
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error.message)
  process.exit(1)
})
"@

# Replace main block with patched code
$newContent = $content -replace "(?s)async function main\(\).*$", $patch

# Save back to file
[System.IO.File]::WriteAllText($indexJsPath, $newContent)

# 4. Trigger download to pre-cache the binary
Write-Host "Initializing Freebuff download..." -ForegroundColor Yellow
freebuff --version

Write-Host "🎉 Setup complete! You can now run 'freebuff' on this machine to use it in Premium US Mode." -ForegroundColor Green

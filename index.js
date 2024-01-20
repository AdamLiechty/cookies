const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cors({credentials: true}))
app.use(cookieParser())
const port = process.env.PORT || 3000

const cookieSettings = (req) => ({
    domain: '.' + req.get('host'),
    // httpOnly: true,
    sameSite: 'none',
    // partitioned: true,
    secure: true
})

app.get('/', (req, res) => {
    const iframeURL = req.query.iframe
    res.cookie('nav', 'nav-cookie')
    res.send(`<!DOCTYPE html>
<html>
    <head><title>🍪👾</title></head>
    <script>
    window.onload = () => {
        document.querySelector("#fetch").onclick = () => {
            fetch("/cookie?name=fetched&value=" + Math.floor(Math.random()*1000))
        }
        document.querySelector("#xhr").onclick = () => {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', "/cookie?name=xhr-ed&value=" + Math.floor(Math.random()*1000))
            xhr.send();
        }
        document.querySelector("#requestStorageAccess").onclick = () => {
            document.requestStorageAccess()
        }
        document.querySelector("#hasStorageAccess").onclick = () => {
            document.hasStorageAccess().then(x => console.log('hasStorageAccess: ' + x))
        }
        function getIframeURL() {
            let iframeURL = document.querySelector("#url").value
            if (!iframeURL.endsWith('/')) iframeURL += '/'
            return iframeURL
        }
        document.querySelector("#fetch-d").onclick = () => {
            fetch(getIframeURL() + "cookie?name=fetched&value=" + Math.floor(Math.random()*1000))
        }
        document.querySelector("#xhr-d").onclick = () => {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', getIframeURL() + "cookie?name=xhr-ed&value=" + Math.floor(Math.random()*1000))
            xhr.send();
        }
        document.querySelector("#iframe-go").onclick = () => {
            const iframeURL = document.querySelector("#url").value
            location.href = '/?iframe=' + encodeURIComponent(iframeURL)
        }
        document.querySelector("#href").innerText = location.href
    }
    </script>
    <body>
        <div id="href"></div>
        <div>Cookies:</div>
        ${Object.keys(req.cookies).length ? '' : '[none set]'}
        <ul>
        ${Object.entries(req.cookies).map(([name, val]) => `<li>${name}: ${val}</li>`).join('')}
        </ul>
        <a href="/cookie?name=rand&value=${Math.floor(Math.random()*1000)}&iframe=${iframeURL ? encodeURIComponent(iframeURL) : ''}">🍪</a>
        <div><button id="fetch">Make fetch call to get cookie</button></div>
        <div><button id="xhr">Make XHR call to get cookie</button></div>
        <div><button id="requestStorageAccess">requestStorageAccess()</button></div>
        <div><button id="hasStorageAccess">hasStorageAccess()</button></div>
        <div>
          For testing other-domain cookies, host this on a second domain and enter here.
          <label>iframe URL: <input id="url" type="text" value="${iframeURL || ''}" /></label>
          and <button id="iframe-go">Go!</button>
        </div>
        <div><button id="fetch-d">Make fetch call to other domain to get cookie</button></div>
        <div><button id="xhr-d">Make XHR call to other domain to get cookie</button></div>
        ${(iframeURL || '') && `<iframe src=${iframeURL} width="500" height="500" />`}
    </body>
</html>
`)
})

app.get('/cookie', (req, res) => {
    const {name, value} = req.query
    if (!name || !value) return res.status(400).send({message: 'Expected name and value query params.'})

    res.cookie(name, value, cookieSettings(req))
    res.send(`<!DOCTYPE html>
    <html>
    <head><title>🍪</title></head>
    <script>
    window.onload = () => {
        document.querySelector("#back").onclick = () => {
            history.back()
        }
    }
    </script>
    <body>
        <div>Sent HttpOnly cookie ${name}: ${value}</div>
        <button id="back">&lt;-- 🍪</button> (then reload to see current cookies)
    </body>
</html>
`)
})

app.get('/bounce', (req, res) => {
    res.cookie('bounce_cookie', '1', cookieSettings(req))
    res.redirect('https://output.jsbin.com/nusifux')
})

app.listen(port, () => console.log(`Listening on port ${port}`))

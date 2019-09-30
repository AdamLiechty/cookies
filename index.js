const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send(`
<html>
    <head><title>🍪👾</title></head>
    <script>
    window.onload = () => {
        document.querySelector("#fetch").onclick = () => {
            fetch("/cookie?name=fetched&value=${Math.floor(Math.random()*1000)}")
        }
        document.querySelector("#xhr").onclick = () => {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', "/cookie?name=xhr-ed&value=${Math.floor(Math.random()*1000)}")
            xhr.send();
        }
    }
    </script>
    <body>
        <div>Cookies:</div>
        ${Object.keys(req.cookies).length ? '' : '[none set]'}
        <ul>
        ${Object.entries(req.cookies).map(([name, val]) => `<li>${name}: ${val}</li>`).join('')}
        </ul>
        <a href="/cookie?name=rand&value=${Math.floor(Math.random()*1000)}">🍪</a>
        <div><button id="fetch">Make fetch call to get cookie</button></div>
        <div><button id="xhr">Make XHR call to get cookie</button></div>
    </body>
</html>
`)
})

app.get('/cookie', (req, res) => {
    const {name, value} = req.query
    if (!name || !value) return res.status(400).send({message: 'Expected name and value query params.'})

    res.cookie(name, value, {httpOnly: true})
    res.send(`
    <html>
    <head><title>🍪</title></head>
    <body>
        <div>Sent HttpOnly cookie ${name}: ${value}</div>
        <a href="/">&lt;-- 🍪</a>
    </body>
</html>
`)
})

app.get('/bounce', (req, res) => {
    res.cookie('bounce_cookie', '1')
    res.redirect('https://output.jsbin.com/nusifux')
})

app.listen(port, () => console.log(`Listening on port ${port}`))

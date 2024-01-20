# 🍪 Cookie Testing

## Why
"Yay, I get to work with browser cookies today!"

-- no one in 2024

Did a browser break one of my customers? Yes, it's good for privacy, but now my day is ruined figuring out whether my customers got broken or they broke themselves.

## About
A simple NodeJS app that serves a cookie-testing page to check browser behavior.
The page enumerates all cookies set on the domain.

- Cookies set by user-agent navigation response
- Cookies set by `fetch` response
- Cookies set by XHR response

```sh
npm i
npm start
```

## Third-party cookies
Optionally, serve this from two different domains to test cookies set for and by
an iframed third-party domain.

[Ngrok](https://ngrok.com/) is helpful for serving this site on a public domain over HTTPS.

To serve with two separate domains, use an ngrok config file like:
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
tunnels:
  one:
    proto: http
    addr: 3000
  two:
    proto: http
    addr: 3000
```
*Sample `ngrok.yml`*

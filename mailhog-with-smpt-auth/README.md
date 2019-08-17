## mailhog

`mailhog/mailhog-credentials` is a file storing one `username:password` entry per line. Each password has to be bcrypted. The caveat is that Mailhog is able to enforce authentication only for Web UI and REST API, not for incoming SMTP traffic ([recent feature request](https://github.com/mailhog/MailHog/issues/226)). Hence solution with `nginx` and `node` proxy.

On 8025 HTTP port Mailhog exposes its Web UI and REST API. It also keeps listening for SMTP traffic on port 1025.

## nginx

The role of nginx is that it keeps listening for SMTP traffic and redirects it to `node-auth-proxy`. If it gets a "good response" back for a given email, it forwards it to MailHog, otherwise, it fails with an error message.

"Good response" example:
```
HTTP/1.0 200 OK
Auth-Status: OK
Auth-Server: <host> # the server name or IP address of the upstream server that will used for mail processing
Auth-Port: <port> # the port of the upstream server
```

"Bad response" example:
```
HTTP/1.0 200 OK
Auth-Status: <message> # an error message to be returned to the client, for example “Invalid login or password”
Auth-Wait: <number> # the number of remaining authentication attempts until the connection is closed
```

Note that in both cases the returned HTTP response status code is `200`. Headers are what makes the difference.

## node-auth-proxy

`node-auth-proxy` is a simple node HTTP server that decides whether to accept a given email message or not. It's the one responsible for returning "good response" or "bad response".

It compares the `auth-user` and `auth-pass` HTTP headers with `USER` and `PASS` env variables defined in `./node-auth-proxy/.env` file.

The comparison happens on the `/auth` endpoint.

## Setup

Fill `./mailhog/mailhog-credentials` MailHog credentials file.
Fill `./node-auth-proxy/.env` env file.

Run `$ docker-compose up`.

Send a test email by running `node send-test-email.js` script. If you want the message to pass the auth proxy set "user" and "pass" strings to match the USER and PASS entries from the env file.

If everything is fine, you should be able to see the intercepted message in MailHog at `localhost:8025` in your browser.

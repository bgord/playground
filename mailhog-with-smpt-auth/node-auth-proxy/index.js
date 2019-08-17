const http = require("http");

const { USER, PASS } = process.env;

const server = http.createServer((req, res) => {
  function rejectTraffic(reason) {
    res.setHeader("Auth-Status", reason);
    res.writeHead(200);
    res.end();
  }

  function acceptTraffic() {
    res.setHeader("Auth-Status", "OK");
    res.setHeader("Auth-Server", "172.16.238.10"); // MailHog IP
    res.setHeader("Auth-Port", "1025"); // MailHog port
    res.writeHead(200);
    res.end();
  }

  const { "auth-user": req_user, "auth-pass": req_pass } = req.headers;

  if (req.url !== "/auth") {
    rejectTraffic(
      "SMTP traffic was redirected to wrong auth server endpoint, /auth is the correct one."
    );
  } else if (req_user === USER && req_pass === PASS) {
    acceptTraffic();
  } else {
    rejectTraffic("Invalid auth user or pass");
  }
});

server.listen(3000);

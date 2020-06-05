const tokenPage = (token) => {
  return `
      <html>
        <title>Setting JWT</title>
        <script>
            localStorage.setItem('token','${token}')
        </script>
        <style>
        body {
            background: #333;
            color: #eee;
            font-family: Helvetica,Arial;
        }
        h1 {
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%)
        }
        </style>
      </html>
      <body>
      <h1>
            Setting JWT
      </h1>
      </body>
      `;
};

const paymentPage = (package) => {
  return `
      <html>
        <title>${package.name} @ ${package.version}</title>
        <meta name="monetization" content="${package.webMonetization.wallet}">
        <style>
        body {
          background: #333;
          color: #eee;
          font-family: Helvetica,Arial;
        }
        h1 {
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%)
        }
        </style>
      </html>
      <body>
      <h1>
          Currently Paying to ${package.name} @ ${package.version}
      </h1>
      </body>
      `;
};

module.exports = { paymentPage, tokenPage };

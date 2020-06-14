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
          <body>
            <h1>
              Setting JWT
            </h1>
          </body>
        </html>
        `;
};

const paymentPage = (packages) => {
  return `
  <html>
    <head>
      <title>Monetizing Modules</title>
      <meta name="monetization">
      <style>
        body {
          background: #333;
          color: #eee;
          font-family: Helvetica, Arial;
        }
        h1 {
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .notice{
          color:#aaa;
        }
      </style>
    </head>
    <body>
      <h1>
        <div class="notice" >Please do not minimize or close this window</div>
        Currently Paying to <span id="packageName"></span> @ <span id="packageVersion"></span>
      </h1>
    </body>
    <script>
        const packages=JSON.parse('${JSON.stringify(packages)}');
        document.monetization.addEventListener("monetizationstart", ({bubbles,cancelBubble,cancelable,composed,currentTarget,defaultPrevented,detail,eventPhase,isTrusted,path,returnValue,srcElement,target,timeStamp,type}) => {
          window.handleEventListener({bubbles,cancelBubble,cancelable,composed,currentTarget,defaultPrevented,detail,eventPhase,isTrusted,path,returnValue,srcElement,target,timeStamp,type});
        });
        document.monetization.addEventListener("monetizationpending", ({bubbles,cancelBubble,cancelable,composed,currentTarget,defaultPrevented,detail,eventPhase,isTrusted,path,returnValue,srcElement,target,timeStamp,type}) => {
          window.handleEventListener({bubbles,cancelBubble,cancelable,composed,currentTarget,defaultPrevented,detail,eventPhase,isTrusted,path,returnValue,srcElement,target,timeStamp,type});
        });
        document.monetization.addEventListener("monetizationprogress", ({bubbles,cancelBubble,cancelable,composed,currentTarget,defaultPrevented,detail,eventPhase,isTrusted,path,returnValue,srcElement,target,timeStamp,type}) => {
          window.handleEventListener({bubbles,cancelBubble,cancelable,composed,currentTarget,defaultPrevented,detail,eventPhase,isTrusted,path,returnValue,srcElement,target,timeStamp,type});
        });
        document.monetization.addEventListener("monetizationstop", ({detail,timeStamp,type}) => {
          window.handleEventListener({detail,timeStamp,type});
        });

        const monetizePackage=()=>{
          document.head.querySelector('meta[name="monetization"]').remove();
          const index = Math.floor(Math.random() * packages.length);
          console.log("Index : ", index);
          document.getElementById("packageName").innerText = packages[index].name;
          document.getElementById("packageVersion").innerText = packages[index].version;
          const metaTag = document.createElement("meta");
          metaTag.name = "monetization";
          metaTag.content = packages[index].webMonetization.wallet;
          document.getElementsByTagName("head")[0].appendChild(metaTag);
        }
        monetizePackage();

        setInterval(monetizePackage, 65000);
      </script>
  </html>
  `;
};

module.exports = { paymentPage, tokenPage };

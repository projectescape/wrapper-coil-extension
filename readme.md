# wrapper-coil-extension

`wrapper-coil-extension` is a wrapper around Coil's Web Monetization browser extension that allows it to be used from node.js.

---

# Install

```bash
npm install --save wrapper-coil-extension
```

---

# Usage

```javascript
const { login, logout, monetize } = require("wrapper-coil-extension");

// To Login with your Coil Account

login();

// To Logout

logout();

// To start Monetization

monetize(monetizationPackages[,timeout]);
```

---

### timeout

timout defines how much time is spent on monetizing one package in queue
timeout<20000 defaults to 20000

---

### monetizationPackages

monetizationPackages is an object of the type which is passed by `monetize-npm-cli`

```javascript
// monetizationPackages

{
    packages:[
        {
          name: "",
          version: "",
          webMonetization: {
              wallet:""
          },
          state: "",
          monetizationpending: [],
          monetizationstart: [],
          monetizationstop: [],
          monetizationprogress: [],
        }
    ],
    invokeListener(i,listener){
        // i is the index of package
        // listener is the name of listeners to invoke
        // monetizationpending || monetizationstart || monetizationstop || monetizationprogress
    }
}

```

---

# API

The aim of this wrapper was to mimic the web monetization API given [here](https://webmonetization.org/docs/api) as much as it could.
Since the extension was never meant to be run from such an environment, all of the browser API is not fully supported.
As Coil's Extension can only monetize the tab in the foreground, this wrapper loops all the wallets for set amount of time (which is the above passed timeout.)
State of a package can be either `started` or `pending`, depending on whether it is being monetized currently or waiting in a queue. It initially starts off with `pending` and no listeners fired.
When its the turn of a package to be monetized, state is set to `started` and event listeners set for `monetizationstart` and `monetizationprogress` are fired with no arguments. After timeout, state is set to `pending` and `monetizationstop` and `monetizationpending` events are fired with no arguments.

---

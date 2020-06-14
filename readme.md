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

monetize(monetizationPackages);
```

---

### timeout

#### (Depreciated)

Since `v0.0.7`, timeout is no longer used as instead of looping through packages, probablistic revenue sharing is being used.

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
    invokeListener(data){
        // data is the response argument received when any event is fired
        // listener is the name of listeners to invoke
        // monetizationpending || monetizationstart || monetizationstop || monetizationprogress
    }
}

```

---

# API

The aim of this wrapper is to mimic the web monetization API given [here](https://webmonetization.org/docs/api) in a CLI environment.
As Coil's Extension can only monetize the tab in foreground, this wrapper uses probabilistic revenue sharing for all the packages and packages are selected for 65 seconds each.
Before `v0.0.7`, many of the functionalities weren't working the same as that in browser, but most of them have been solved now.
The only remaining problem is that monetization won't work with puppeteer window minimized.

---

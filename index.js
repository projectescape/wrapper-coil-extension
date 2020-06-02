// const login = require("./src/login");
// login();

const wallets = [
  {
    name: "dev.to",
    webMonetization: {
      wallet: "$ilp.uphold.com/24HhrUGG7ekn",
    },
  },
  {
    name: "second",
    webMonetization: {
      wallet: "$coil.xrptipbot.com/KquNBCC3QiyXWIuRCQDuEQ",
    },
  },
  {
    name: "third",
    webMonetization: {
      wallet: "$pay.stronghold.co/1a19827479e1def4768b8d365cdbc8098c8",
    },
  },
];

const monetize = require("./src/monetize");
monetize(wallets);

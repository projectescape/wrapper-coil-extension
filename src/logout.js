const fs = require("fs");

const logout = async () => {
  await fs.writeFile(
    `${__dirname}/../store/profile.json`,
    JSON.stringify({}),
    (err) => {
      if (err) {
        console.log("Unable to write to logout", err);
      } else {
        console.log("Logged out");
      }
    }
  );
};

module.exports = logout;

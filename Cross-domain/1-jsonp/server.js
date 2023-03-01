const express = require("express");
const app = express();
const port = 3000;

app.get("/say", (req, res) => {
  const { wd, callback } = req.query;
  console.log(req.query)
  res.send(`${callback}('我不爱你')`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

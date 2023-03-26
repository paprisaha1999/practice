const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, "paprikey"); // it will verify the token & store it inside "decoded"
    if (decoded) {
      // console.log(decoded);
      req.body.userID = decoded.userID;
      next(); // if already logged in it will go to next, means notesRouter
    } else {
      res.status(400).send({ msg: "Please Login First!" });
    }
  } else {
    res.status(400).send({ msg: "Please Login First!" });
  }
};

module.exports = { auth };

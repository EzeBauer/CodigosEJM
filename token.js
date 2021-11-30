//=======EN LOGIN JS===========

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (request, response) => {
  const { body } = request; //recupero el body de la reques
  const { username, password } = body;

  //intento encontrar al usuario
  const user = await User.findOne({ username });
  //ver si el password es correcto
  const passwordCorrect =
    user === null //si no encuentra al usuario
      ? false
      : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    response.status(401).json({
      error: "invalid user or password",
    });
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });

  response.send({
    name: user.name,
    username: user.username,
    token,
  });
});

module.exports = loginRouter;

//================EN APP.JS=========================

const loginRouter = require("./controllers/login");
const { json } = require("stream/consumers");
app.use("/api/login", loginRouter);

///================ENN LA TERMINAL============

npm install jsonwebtoken 


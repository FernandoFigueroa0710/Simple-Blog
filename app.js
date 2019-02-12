const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const expressValidator = require("express-validator");

//connection to mongodb via monk
const mongo = require("mongodb");
const db = require("monk")("localhost/simpleblog");

const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const categoriesRouter = require("./routes/categories");

const app = express();
// make moment global to the entire app.
app.locals.moment = require('moment');
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// express session middelware
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

//express validator middleware
app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      let namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//connect flash middleware
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//make our db accesible to the router
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/categories", categoriesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

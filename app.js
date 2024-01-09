//Import packages
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes/index.js");
require("dotenv").config();

//Set up configs
const app = express();
const PORT = 4000;

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({credentials: true}))
app.use("/", indexRouter);

//Error handling

//Catch 404 errors and pass to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

//Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message, error });
});


//Listen on port
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});

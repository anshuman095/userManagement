const express = require("express");
const dotenv = require("dotenv");
const roleRoutes = require("./routes/roleRoute");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const pool = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const ApiError = require("./utils/apiError");
const Messages = require("./utils/message");
const bodyParser = require("body-parser");
const { createTable } = require("./models/userModel");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());

app.use("/api/role", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  next(ApiError.notFound(Messages.URL_NOT_FOUND));
});
app.use(errorHandler);

createTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to create table", error);
  });

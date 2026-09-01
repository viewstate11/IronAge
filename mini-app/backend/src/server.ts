import "dotenv/config";
import app from "./app.js";

const PORT = Number(
  process.env.PORT || 5050
);

const server = app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `IRONAGE API listening on port ${PORT}`
    );
  }
);

server.on(
  "error",
  (error) => {
    console.error(
      "❌ IRONAGE SERVER ERROR:",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ UNCAUGHT EXCEPTION:",
      error
    );
  }
);

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "❌ UNHANDLED REJECTION:",
      error
    );
  }
);

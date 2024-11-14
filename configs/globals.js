require("dotenv").config();
// Global configurations object contains Application Level variables such as:
// client secrets, passwords, connection strings, and misc flags
const configurations = {
  ConnectionStrings: {
    MongoDB: "mongodb+srv://simer:Simer@cluster0.8cmzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0node",
  },
  Authentication: {
    Google: {
      ClientId: "311732746487-jus96n7vhct2jiakknsdfi4b5c6gnlrv.apps.googleusercontent.com",
      ClientSecret: "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",
      CallbackUrl: "http://localhost:3000/auth/google/callback"

    },
  },
};
module.exports = configurations;



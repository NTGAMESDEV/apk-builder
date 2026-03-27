import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

const GITHUB_TOKEN = "YOUR_TOKEN";
const REPO = "username/repo";

app.post("/upload", upload.array("files"), async (req, res) => {
  for (let file of req.files) {
    const content = fs.readFileSync(file.path, { encoding: "base64" });

    await fetch(`https://api.github.com/repos/${REPO}/contents/${file.originalname}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "upload file",
        content: content
      })
    });
  }

  res.send("ok");
});

app.post("/save-config", (req, res) => {
  fs.writeFileSync("uploads/config.json", JSON.stringify(req.body, null, 2));
  res.send("saved");
});

app.post("/build", async (req, res) => {
  await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/build.yml/dispatches`, {
    method: "POST",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ref: "main" })
  });

  res.send("building");
});

app.get("/download", (req, res) => {
  res.send("https://github.com/username/repo/releases/latest/download/app.apk");
});

app.listen(3000, () => console.log("Server running 🚀"));

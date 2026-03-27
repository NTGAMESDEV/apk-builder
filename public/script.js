async function upload() {
  const files = document.getElementById("fileInput").files;
  const formData = new FormData();

  for (let f of files) {
    formData.append("files", f);
  }

  await fetch("/upload", {
    method: "POST",
    body: formData
  });

  alert("อัปโหลดสำเร็จ 🚀");
}

function showEdit() {
  document.getElementById("editBox").style.display = "block";
}

async function saveConfig() {
  const data = {
    name: appName.value,
    package: package.value,
    ip: ip.value,
    port: port.value,
    api: api.value
  };

  await fetch("/save-config", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  alert("บันทึกแล้ว 💾");
}

async function buildAPK() {
  await fetch("/build", { method: "POST" });

  alert("กำลัง Build... 🔥");

  setTimeout(async () => {
    const res = await fetch("/download");
    const url = await res.text();

    const btn = document.getElementById("downloadBtn");
    btn.href = url;
    btn.style.display = "block";
  }, 10000);
}

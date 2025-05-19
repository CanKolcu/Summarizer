let separated = false;
let boxCount = 0;
let selectedLanguage = "en"; // varsayılan dil

function setLanguage(lang) {
  selectedLanguage = lang;

  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach(btn => btn.classList.remove("border", "border-white"));

  if (lang === "en") {
    document.getElementById("btn-en").classList.add("border", "border-white");
  } else if (lang === "tr") {
    document.getElementById("btn-tr").classList.add("border", "border-white");
  }

  console.log("Seçilen dil:", selectedLanguage);
}

async function handleContinueClick() {
  const input = document.getElementById("inputText").value;

  if (!input) {
    alert("Lütfen bir metin girin.");
    return;
  }

  if (!separated) {
    separated = true;
    document.getElementById("boxesContainer").classList.remove("hidden");
    document.getElementById("continueButton").innerText = "New Summary";
  }

  try {
    const response = await fetch("/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, language: selectedLanguage })
    });

    const data = await response.json();

    if (data.summary) {
      addBox(data.summary);
    } else {
      alert("Özetleme başarısız: " + data.error);
    }
  } catch (error) {
    console.error("Hata:", error);
    alert("Bir hata oluştu. Konsolu kontrol edin.");
  }
}

function addBox(summaryText) {
  boxCount++;
  const container = document.getElementById("boxesContainer");

  const box = document.createElement("div");
  box.className =
    "relative bg-gray-800 rounded-2xl p-4 w-[220px] h-[160px] flex flex-col justify-between fade-in-up shadow-lg transform transition duration-500 cursor-pointer hover:scale-105";

  box.setAttribute("data-summary", summaryText);

  box.innerHTML = `
    <button onclick="removeBox(this)" class="absolute top-[-6px] right-[-6px] bg-gray-900 text-gray-300 hover:text-red-500 rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-sm">
      &times;
    </button>
    <div onclick="expandBox(${boxCount})" class="bg-gray-900 text-white w-full h-full p-2 rounded-xl overflow-auto text-sm">
      <strong>Özet #${boxCount}</strong><br><br>
      ${summaryText.length > 100 ? summaryText.slice(0, 100) + "..." : summaryText}
    </div>
  `;

  container.appendChild(box);
}

function removeBox(button) {
  button.parentElement.remove();
}

function expandBox(id) {
  const overlay = document.getElementById("overlay");
  const summaryText = document.querySelectorAll("#boxesContainer > div")[id - 1].getAttribute("data-summary");

  document.getElementById("expandedContentText").innerText = summaryText;

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
}

function closeExpandedBox() {
  const overlay = document.getElementById("overlay");
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
}

function downloadSummary() {
  const summaryText = document.getElementById("expandedContentText").innerText;
  const blob = new Blob([summaryText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ozet.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

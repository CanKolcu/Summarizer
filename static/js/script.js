let separated = false;
let boxCount = 0;
let selectedLanguage = "en"; // varsayılan dil

function setLanguage(lang) {
  selectedLanguage = lang;

  // Önce tüm dil butonlarından 'selected' stilini kaldır
  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach(btn => btn.classList.remove("border", "border-white"));

  // Seçilen dilin butonuna beyaz kenarlık ekle
  if (lang === "en") {
    document.getElementById("btn-en").classList.add("border", "border-white");
  } else if (lang === "tr") {
    document.getElementById("btn-tr").classList.add("border", "border-white");
  }

  console.log("Seçilen dil:", selectedLanguage);
}

// Devam Et butonuna tıklanınca hem özet alınır hem kutu oluşturulur
async function handleContinueClick() {
  const input = document.getElementById("inputText").value;

  if (!input) {
    alert("Lütfen bir metin girin.");
    return;
  }

  // İlk tıklamada kutu alanlarını aktif et
  if (!separated) {
    separated = true;

    const boxesContainer = document.getElementById("boxesContainer");
    const continueButton = document.getElementById("continueButton");

    boxesContainer.classList.remove("hidden");
    boxesContainer.classList.add("fade-in-up");
    continueButton.innerText = "new summary";
  }

  // Özetleme isteği
  try {
    const response = await fetch("/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: input, language: selectedLanguage })
    });

    const data = await response.json();

    if (data.summary) {
      addBox(data.summary); // kutuyu özetle oluştur
    } else {
      alert("Özetleme başarısız: " + data.error);
    }
  } catch (error) {
    console.error("Hata:", error);
    alert("Bir hata oluştu. Konsolu kontrol edin.");
  }
}

// Kutucuk oluşturma ve özet yerleştirme
function addBox(summaryText) {
  boxCount++;
  const container = document.getElementById("boxesContainer");

  const box = document.createElement("div");
  box.className =
    "bg-gray-800 rounded-2xl p-4 w-[200px] h-[150px] flex flex-col justify-between fade-in-up shadow-lg transform transition duration-500 cursor-pointer hover:scale-105";

  box.setAttribute("onclick", `expandBox(${boxCount})`);
  box.setAttribute("data-summary", summaryText); // detaylı görünüm için

  box.innerHTML = `
    <div class="bg-gray-900 text-white w-full h-full p-2 rounded-xl overflow-auto text-sm">
      <strong>Özet #${boxCount}</strong><br><br>
      ${summaryText.length > 100 ? summaryText.slice(0, 100) + "..." : summaryText}
    </div>
  `;

  container.appendChild(box);
}

// Genişletilmiş görünüm
function expandBox(id) {
  const overlay = document.getElementById("overlay");
  const expandedContent = document.getElementById("expandedContent");

  // Kutuyu bul ve datadan metni çek
  const box = document.querySelectorAll("#boxesContainer > div")[id - 1];
  const summaryText = box.getAttribute("data-summary");

  expandedContent.innerHTML = `
    <h2 class="text-2xl mb-4 font-semibold">Özet #${id}</h2>
    <p class="text-sm">${summaryText}</p>
  `;

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
}

// Kapat
function closeExpandedBox() {
  const overlay = document.getElementById("overlay");
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
}

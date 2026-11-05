const semesters = {
  "BCA 1st Semester": [
    "Environmental science",
    "Fundamental of computer & digital systems",
    "Fundamental of mathmatics",
    "C Programming",
    "introduction of web programming",
    "Technical Communication"
  ],
  "BCA 2nd Semester": [
    "Data Structures",
    "Operating System",
    "Discrete Mathematics",
    "Web Basics",
    "Basic Electronics",
    "Statistics"
  ],
  "BCA 3rd Semester": [
    "DBMS",
    "OOPs",
    "Computer Architecture",
    "Software Engineering",
    "Networking Basics",
    "Microprocessor"
  ],
  "BCA 4th Semester": [
    "Java",
    "Python",
    "Algorithms",
    "Database Management",
    "Computer Networks",
    "Linux"
  ],
  "BCA 5th Semester": [
    "Advanced Java",
    "Cloud Computing",
    "AI Fundamentals",
    "Mobile App Development",
    "Cyber Security",
    "Project Management"
  ],
  "BCA 6th Semester": [
    "Major Project",
    "Internship Report",
    "Data Science",
    "Machine Learning",
    "Capstone",
    "Career Skills"
  ]
};

const SINGLE_PRICE = 249;
const BUNDLE_PRICE = 1249;
const WHATSAPP_NUMBER = "+918750399015"; // 

let selectedSemester = "BCA 1st Semester";
let selectedSubjects = new Set();

const semesterTabs = document.getElementById("semester-tabs");
const subjectsList = document.getElementById("subjects-list");
const bundleCard = document.getElementById("bundle-card");
const summaryBox = document.getElementById("summary");

function getCurrentSemesterSubjects() {
  return semesters[selectedSemester];
}

function getCurrentTotal() {
  const count = selectedSubjects.size;
  const totalSubjects = getCurrentSemesterSubjects().length;

  if (count === 0) return 0;
  if (count === totalSubjects) return BUNDLE_PRICE;
  return count * SINGLE_PRICE;
}

function renderTabs() {
  semesterTabs.innerHTML = "";

  Object.keys(semesters).forEach((semester) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tab" + (semester === selectedSemester ? " active" : "");
    tab.textContent = semester;

    tab.addEventListener("click", () => {
      selectedSemester = semester;
      selectedSubjects = new Set();
      render();
    });

    semesterTabs.appendChild(tab);
  });
}

function renderSubjects() {
  const subjects = getCurrentSemesterSubjects();
  subjectsList.innerHTML = "";

  subjects.forEach((subject) => {
    const subjectCard = document.createElement("article");
    const isSelected = selectedSubjects.has(subject);
    subjectCard.className = "subject-card" + (isSelected ? " selected" : "");

    subjectCard.innerHTML = `
      <div class="subject-top">
        <h3>${subject}</h3>
        <span class="price">₹${SINGLE_PRICE}</span>
      </div>
      <p class="subject-desc">Study notes / assignment support / reference material</p>
      <button type="button" class="btn ${isSelected ? 'btn-light' : 'btn-order'}">
        ${isSelected ? "Selected" : "Select"}
      </button>
    `;

    const button = subjectCard.querySelector("button");
    button.addEventListener("click", () => {
      if (selectedSubjects.has(subject)) {
        selectedSubjects.delete(subject);
      } else {
        selectedSubjects.add(subject);
      }
      render();
    });

    subjectsList.appendChild(subjectCard);
  });
}

function renderBundleCard() {
  const totalSubjects = getCurrentSemesterSubjects().length;
  const isAllSelected = selectedSubjects.size === totalSubjects;

  bundleCard.innerHTML = `
    <div class="bundle-inner">
      <div>
        <h3>All ${selectedSemester} subjects</h3>
        <p>Buy the full package at a discounted price.</p>
      </div>
      <div class="bundle-price">₹${BUNDLE_PRICE}</div>
      <button type="button" class="btn btn-order">
        ${isAllSelected ? "Full Bundle Selected" : "Select Full Bundle"}
      </button>
    </div>
  `;

  const button = bundleCard.querySelector("button");
  button.addEventListener("click", () => {
    selectedSubjects = new Set(getCurrentSemesterSubjects());
    render();
  });
}

function buildWhatsAppMessage() {
  const items = [...selectedSubjects];
  const total = getCurrentTotal();
  const isBundle = items.length === getCurrentSemesterSubjects().length;

  let message = "";

  if (isBundle) {
    message = `
Hello bro ☺️ ,
I want to buy the full ${selectedSemester} bundle.

Selected Package:
- Full ${selectedSemester} Bundle (6 Subjects)

Total: ₹${total}

Please share payment details.
    `.trim();
  } else {
    message = `
Hello bro ☺️ ,
I want to buy the following study materials for ${selectedSemester}:

- ${items.join("\n- ")}

Total: ₹${total}

Please share payment details.
    `.trim();
  }

  return message;
}

function renderSummary() {
  const items = [...selectedSubjects];
  const total = getCurrentTotal();

  summaryBox.innerHTML = `
    <h3>${selectedSemester}</h3>
    <div class="summary-list">
      ${items.length
        ? items.map((item) => `<span>${item}</span>`).join("")
        : "<span>No subject selected</span>"}
    </div>
    <div class="summary-total">Total: ₹${total}</div>
    <button type="button" id="buy-now-btn" class="btn btn-primary" ${items.length ? "" : "disabled"}>
      Buy Now
    </button>
  `;

  const buyNowBtn = document.getElementById("buy-now-btn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      if (!items.length) return;

      const message = buildWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    });
  }
}

function render() {
  renderTabs();
  renderSubjects();
  renderBundleCard();
  renderSummary();
}

render();


// ===== MOBILE MENU =====

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}


//
/*

// ===== CODEHUB REELS PLAYER =====

const reelCards = document.querySelectorAll(".reel-card");

reelCards.forEach((card) => {
  const video = card.querySelector(".reel-video");
  const playButton = card.querySelector(".reel-play-btn");

  function openReel() {
    const reelModal = document.createElement("div");

    reelModal.className = "reel-modal";

    reelModal.innerHTML = `
      <button class="reel-close-btn" aria-label="Close video">
        ✕
      </button>
      <video class="reel-modal-video" controls autoplay playsinline>
      </video>
    `;

    const modalVideo = reelModal.querySelector(".reel-modal-video");

    modalVideo.src = video.currentSrc || video.src;
    modalVideo.muted = false;

    document.body.appendChild(reelModal);
    document.body.style.overflow = "hidden";

    modalVideo.play().catch(() => {
      modalVideo.controls = true;
    });

    function closeReel() {
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.load();

      reelModal.remove();
      document.body.style.overflow = "";
    }

    reelModal.querySelector(".reel-close-btn")
      .addEventListener("click", closeReel);

    reelModal.addEventListener("click", (event) => {
      if (event.target === reelModal) {
        closeReel();
      }
    });

    document.addEventListener("keydown", function escapeHandler(event) {
      if (event.key === "Escape") {
        closeReel();
        document.removeEventListener("keydown", escapeHandler);
      }
    });
  }

  card.addEventListener("click", openReel);

  if (playButton) {
    playButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openReel();
    });
  }
});

// ===== END CODEHUB REELS PLAYER ===== */
const WHATSAPP_REDIRECT = "https://wa.me/919111319711";
const TELEGRAM_REDIRECT = "https://t.me/+vwttSnVV60JkZTQ1";

const loader = document.getElementById("loader");
const year = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 250);
  }
});

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("show"));
  });
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => observer.observe(element));

const leadForm = document.getElementById("leadForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

const indianPhoneRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

function setMessage(message, type) {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? "Submitting..." : "Unlock Free Training";
}

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("", "");

    const formData = new FormData(leadForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      experience: String(formData.get("experience") || "").trim()
    };

    if (!payload.name || !payload.phone || !payload.experience) {
      setMessage("Please fill all fields before submitting.", "error");
      return;
    }

    if (!indianPhoneRegex.test(payload.phone)) {
      setMessage("Please enter a valid Indian mobile number.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed.");
      }

      setMessage("Success! Redirecting to WhatsApp and Telegram...", "success");
      leadForm.reset();

      setTimeout(() => {
        window.open(WHATSAPP_REDIRECT, "_blank", "noopener,noreferrer");
        window.location.href = TELEGRAM_REDIRECT;
      }, 700);
    } catch (error) {
      setMessage(error.message || "Could not submit the form. Please retry.", "error");
    } finally {
      setLoading(false);
    }
  });
}

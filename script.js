// script.js - HealthyBites

document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // Recipe filter (search / meal type / calories)
  // =========================================
  const search = document.querySelector("#search");
  const mealType = document.querySelector("#meal-type");
  const calSel = document.querySelector("#calories");
  const recipes = document.querySelectorAll(".recipe-card");

  function filterRecipes() {
    const term = search ? search.value.toLowerCase() : "";
    const meal = mealType ? mealType.value : "";
    const cal = calSel ? calSel.value : "";

    recipes.forEach((r) => {
      let visible = true;

      if (term && !r.textContent.toLowerCase().includes(term)) {
        visible = false;
      }
      if (meal && r.dataset.meal !== meal) {
        visible = false;
      }
      if (cal && Number(r.dataset.cal) > Number(cal)) {
        visible = false;
      }

      r.style.display = visible ? "block" : "none";
    });
  }

  if (search) search.addEventListener("input", filterRecipes);
  if (mealType) mealType.addEventListener("change", filterRecipes);
  if (calSel) calSel.addEventListener("change", filterRecipes);

  // =========================================
  // Drag & drop meal planner
  // =========================================
  const draggables = document.querySelectorAll(".draggable");
  const dropzones = document.querySelectorAll(".dropzone");

  draggables.forEach((d) => {
    d.addEventListener("dragstart", () => {
      d.classList.add("dragging");
    });
    d.addEventListener("dragend", () => {
      d.classList.remove("dragging");
    });
  });

  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("over");
    });
    zone.addEventListener("drop", () => {
      const dragging = document.querySelector(".dragging");
      if (dragging) {
        const clone = dragging.cloneNode(true);
        clone.classList.remove("dragging");
        clone.setAttribute("draggable", "false");
        zone.appendChild(clone);
      }
      zone.classList.remove("over");
    });
  });

  // =========================================
  // "Save plan" demo validation
  // =========================================
  const saveBtn = document.querySelector("#save-plan");
  const saveStatus = document.querySelector("#save-status");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (saveStatus) {
        saveStatus.textContent =
          "Login required to save meal plans (demo validation).";
      }
    });
  }

  // =========================================
  // Profile form feedback
  // =========================================
  const profileForm = document.querySelector("#profile-form");
  const profileStatus = document.querySelector("#profile-status");

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (profileStatus) {
        profileStatus.textContent = "Profile saved locally for this session.";
      }
    });
  }

  // =========================================
  // Contact form validation
  // =========================================
  const contactForm = document.querySelector("#contact-form");
  const contactStatus = document.querySelector("#contact-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        if (contactStatus) {
          contactStatus.textContent =
            "Please fill in all required fields with a valid email.";
        }
      } else {
        if (contactStatus) {
          contactStatus.textContent = "Message sent (demo).";
        }
      }
    });
  }

  // =========================================
  // FAQ accordion component
  // =========================================
  const faqQuestions = document.querySelectorAll(".faq-question");

  if (faqQuestions.length > 0) {
    faqQuestions.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isActive = btn.classList.contains("active");

        // close all accordions
        faqQuestions.forEach((b) => {
          b.classList.remove("active");
          const ans = b.nextElementSibling;
          if (ans) ans.style.maxHeight = null;
        });

        // open the clicked one (if it wasn’t already active)
        if (!isActive) {
          btn.classList.add("active");
          const answer = btn.nextElementSibling;
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + "px";
          }
        }
      });
    });
  }

  // =========================================
  // Third-party API integration (Recipes page)
  // =========================================
  const apiSection = document.querySelector("#api-recipes");
  const apiStatus = document.querySelector("#api-recipes-status");
  const apiList = document.querySelector("#api-recipes-list");

  // Only run on the Recipes page
  if (apiSection && apiList) {
    // Example public API. Any simple JSON recipes/foods API works for this demo.
    const API_URL = "https://api.sampleapis.com/recipes/recipes";

    fetch(API_URL)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return resp.json();
      })
      .then((data) => {
        // Clear "loading" text
        if (apiStatus) {
          apiStatus.textContent = "Extra recipes loaded from API:";
        }

        apiList.innerHTML = "";

        // Show a small subset so the page stays clean
        data.slice(0, 5).forEach((item) => {
          const li = document.createElement("li");
          // Fallbacks if API structure changes
          const title = item.title || item.name || "Recipe";
          li.textContent = title;
          apiList.appendChild(li);
        });

        if (!apiList.children.length && apiStatus) {
          apiStatus.textContent =
            "The API responded, but no recipes could be displayed.";
        }
      })
      .catch((error) => {
        console.error("Error fetching recipes from API:", error);
        if (apiStatus) {
          apiStatus.textContent =
            "Sorry, we couldn't load extra recipes right now.";
        }
      });
  }
});

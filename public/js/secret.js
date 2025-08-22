const SecretForm = document.querySelector("#SecretForm");
const fileInput = document.querySelector("#file");
const titleInput = document.getElementById("title");
const secretInput = document.getElementById("secret");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");
const uploadedFilesFilenames = document.getElementById(
  "uploadedFilesFilenames"
);
const hideContainer = document.querySelector("#hideContainer");

const token = localStorage.getItem("token");

// Redirect if no token
if (!token) window.location.href = "/login.html";

// Get secret id from URL hash
const secretId = window.location.hash.substring(1);

// Hide container by default if no secretId
if (!secretId) {
  hideContainer.style.display = "none";
}

// Load existing secret if editing
async function loadSecret(id) {
  if (!id) return;
  try {
    const res = await fetch(`/v1/data/vault/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();

    titleInput.value = data.title || "";
    secretInput.value = data.value || "";

    // Clear any previous entries
    uploadedFilesFilenames.innerHTML = "";

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        const filenameEl = document.createElement("p");
        filenameEl.textContent = file.filename || "Unnamed file";
        uploadedFilesFilenames.append(filenameEl);
      });
      hideContainer.style.display = "block";
    } else {
      uploadedFilesFilenames.textContent = "No attachments";
      hideContainer.style.display = "block";
    }

    formTitle.textContent = "Edit Secret";
    submitBtn.textContent = "Update Secret";
  } catch (err) {
    console.error("Failed to load secret:", err);
    message.style.color = "red";
    message.textContent = "Failed to load secret.";
  }
}

// Handle form submission
SecretForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const value = secretInput.value.trim();
  const files = fileInput.files;

  if (!title || !value) {
    message.style.color = "red";
    message.textContent = "Title and Secret cannot be empty!";
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("value", value);

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const method = secretId ? "PATCH" : "POST";
  const url = secretId ? `/v1/data/vault/${secretId}` : "/v1/data/vault";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.textContent = data.message || "Secret saved successfully!";
      setTimeout(() => (message.textContent = ""), 3000);

      if (!secretId) {
        SecretForm.reset();
        hideContainer.style.display = "none";
      }
    } else {
      message.style.color = "red";
      message.textContent =
        data.message || data.error || "Something went wrong!";
    }
  } catch (err) {
    console.error(err);
    message.style.color = "red";
    message.textContent = "Network error. Please try again.";
  }
});

// Initialize
loadSecret(secretId);

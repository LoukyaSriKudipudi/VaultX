const SecretForm = document.querySelector("#SecretForm");
const titleInput = document.getElementById("title");
const secretInput = document.getElementById("secret");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");
const token = localStorage.getItem("token");

// Redirect if no token
if (!token) window.location.href = "/login.html";

// Get secret id from URL hash
const secretId = window.location.hash.substring(1);

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
    formTitle.textContent = "Edit Secret";
    submitBtn.textContent = "Update Secret";
  } catch (err) {
    console.error("Failed to load secret:", err);
    message.style.color = "red";
    message.textContent = "Failed to load secret.";
  }
}

// Unified form submit handler
SecretForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const values = {
    title: titleInput.value.trim(),
    value: secretInput.value.trim(),
  };

  if (!values.title || !values.value) {
    message.style.color = "red";
    message.textContent = "Title and Secret cannot be empty!";
    return;
  }

  const method = secretId ? "PATCH" : "POST";
  const url = secretId ? `/v1/data/vault/${secretId}` : "/v1/data/vault";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.textContent = data.message || "Secret saved successfully!";

      setTimeout(() => (message.textContent = ""), 3000);

      // If adding new secret, reset form
      if (!secretId) SecretForm.reset();
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

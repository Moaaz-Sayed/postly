if (localStorage.getItem("token") !== null) {
  window.location.href = "../home.html";
}

const form = document.getElementById("signup-form");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", handlesignUp);

function handlesignUp(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const image = document.getElementById("file-input").files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  if (image) {
    formData.append("image", image);
  }

  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData)
    .then((res) => {
      messageDiv.textContent = "Account created successfully!";
      messageDiv.className = "popup-message success";
      messageDiv.style.display = "block";
      form.reset();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => {
        window.location.href = "../home.html";
      }, 1500);
    })
    .catch((err) => {
      const msg = err.response?.data?.message || "Something went wrong!";
      messageDiv.textContent = msg;
      messageDiv.className = "popup-message error";
      messageDiv.style.display = "block";
    });
}

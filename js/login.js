if (localStorage.getItem("token") !== null) {
  window.location.href = "../home.html";
}

const submit = document.getElementById("submit");
const create = document.getElementById("create");
submit.addEventListener("click", handleLogin);
create.addEventListener(
  "click",
  () => (window.location.href = "../register.html")
);

function handleLogin(e) {
  e.preventDefault();

  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();

  if (user === "" || pass === "") {
    showMessage("Please fill in all fields", "error");
    return;
  }

  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: user,
      password: pass,
    })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showMessage("Logged in successfully!", "success");

      setTimeout(() => {
        window.location.href = "../home.html";
      }, 1000);
    })
    .catch((err) => {
      showMessage("Invalid username or password", "error");
    });
}

function showMessage(text, type = "success") {
  const messageDiv = document.getElementById("message");
  if (!messageDiv) return;

  messageDiv.textContent = text;
  messageDiv.className = `popup-message ${type} show`;

  setTimeout(() => {
    messageDiv.classList.remove("show");
  }, 5000);
}

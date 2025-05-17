const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./forbidden.html";
} else {
  axios
    .get("https://tarmeezacademy.com/api/v1/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {})
    .catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "./forbidden.html";
    });
}

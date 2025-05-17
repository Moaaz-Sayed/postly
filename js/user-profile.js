const userId = localStorage.getItem("profileUserId");
const userString = localStorage.getItem("user");
const currentUser = userString ? JSON.parse(userString) : null;
// Headers
if (currentUser) {
  document.querySelector(".usr h4").innerText = currentUser.name;
  document.getElementById("user-photo").src = currentUser.profile_image?.length
    ? currentUser.profile_image
    : "./imges/user.png";
}
axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}`).then((res) => {
  const user = res.data.data;
  document.getElementById("r-name").innerText = user.name;
  document.querySelector(".username").innerText = `@${user.username}`;
  document.getElementById("profile-photo").src = user.profile_image?.length
    ? user.profile_image
    : "./imges/user.png";
  document
    .querySelectorAll(".posts .usr-photo")
    .forEach(
      (e) =>
        (e.src = user.profile_image?.length
          ? user.profile_image
          : "./imges/user.png")
    );

  document.title = `${user.username} - Profile`;
});

// Get User Posts
axios
  .get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
  .then((res) => {
    const posts = res.data.data;
    posts.reverse();
    document.querySelector(".posts").innerHTML = posts.map(renderPost).join("");
  });

// Open profile Photo when clicked

const profilePhoto = document.getElementById("profile-photo");

profilePhoto.addEventListener("click", () => {
  modal.classList.add("show");
  modalImg.src = profilePhoto.src;
});

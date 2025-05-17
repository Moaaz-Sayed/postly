const user = JSON.parse(localStorage.getItem("user"));
const userId = user.id;
const userString = localStorage.getItem("user");
const currentUser = userString ? JSON.parse(userString) : null;
// Headers
if (currentUser) {
  document.querySelector(".usr h4").innerText = currentUser.name;
  document.getElementById("user-photo").src = currentUser.profile_image?.length
    ? currentUser.profile_image
    : "./imges/user.png";

  document.querySelector(".username").innerText = `@${currentUser.username}`;
  document.getElementById("r-name").innerText = currentUser.name;
  document.getElementById("profile-photo").src = currentUser.profile_image
    ?.length
    ? user.profile_image
    : "./imges/user.png";
}

//Add Post

const postBtn = document.getElementById("post-btn");

postBtn.addEventListener("click", addPost);

// Get Profile Posts
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

// photo uploaded

const fileInput = document.getElementById("file-input");
const imageStatus = document.getElementById("imageStatus");

fileInput.addEventListener("change", () => {
  if (fileInput.files && fileInput.files.length > 0) {
    imageStatus.innerHTML = `
      Image selected 
      <button id="removeImageBtn" title="Remove image" style="border:none; background:none; cursor:pointer; color:red; font-weight:bold; margin-left:5px;">&times;</button>
    `;

    document.getElementById("removeImageBtn").addEventListener("click", () => {
      fileInput.value = "";
      imageStatus.textContent = "";
    });
  } else {
    imageStatus.textContent = "";
  }
});

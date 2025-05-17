//Show USerName And Photo

const userString = localStorage.getItem("user");
const currentUser = userString ? JSON.parse(userString) : null;
if (currentUser) {
  document.querySelector(".usr h4").innerText = currentUser.name;
  document.getElementById("user-photo").src = currentUser.profile_image?.length
    ? currentUser.profile_image
    : "./imges/user.png";
}

//Show Posts In Page

function loadPosts() {
  const token = localStorage.getItem("token");
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  axios
    .get("https://tarmeezacademy.com/api/v1/posts?limit=50", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const posts = res.data.data;
      postsContainer.innerHTML = posts.map(renderPost).join("");
    })
    .catch((err) => {
      postsContainer.innerHTML = `<p>Failed to load posts.</p>`;
    })
    .finally(() => {
      loader.style.display = "none";
    });
}

window.addEventListener("DOMContentLoaded", loadPosts);

//Add Post

const postBtn = document.getElementById("post-btn");

postBtn.addEventListener("click", addPost);

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

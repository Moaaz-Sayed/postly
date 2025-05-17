//Post Model
function renderPost(post) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isMyPost = currentUser && post.author.id === currentUser.id;

  const editIcon = isMyPost
    ? `<div class="edit-area">
        <i class="fa-solid fa-pen-to-square edit-icon" title="Edit Post"
          onclick="startEditPost(${
            post.id
          }, decodeURIComponent('${encodeURIComponent(post.body)}'))"></i>
      </div>`
    : "";

  const deleteIcon = isMyPost
    ? `<i class="fa-solid fa-trash-can delete-icon" title="Delete Post" onclick="deletePost(${post.id}, this)"></i>`
    : "";

  const profileImgSrc = post.author.profile_image?.length
    ? post.author.profile_image
    : "../imges/user.png";
  //GEt Comment when page loaded
  setTimeout(() => getComments(post.id), 0);

  return `
    <div class="card">
      <div class="head">
        <div class="post-usr">
          <img src="${profileImgSrc}" alt="" class="user-photo usr-photo" onerror="this.src='../imges/user.png';">
          <h4>
            <a href="../user-profile.html" onclick="saveUserId(${
              post.author.id
            })">${post.author.name}</a>
          </h4>
        </div>
        <div class="e-r-icon">
          ${deleteIcon}
          ${editIcon}
          <i class="fa-solid fa-eye-slash" title="Hide" onclick=hidePost(this)></i>
        </div>
      </div>
      <div class="body">
        ${
          post.image
            ? `<img src="${post.image}" alt="" class="post-photo">`
            : ""
        }
        <h6 class="date">${post.created_at}</h6>
        <p class="content">${post.body}</p>
      </div>
      <hr>
      <div class="footer">
        <div class="comment-area">
          <i class="fa-solid fa-pencil"></i>
          <span class="label">Comment</span>
        </div>
        <h4 class="comments-count" id="count-${post.id}">(${
    post.comments_count || 0
  })</h4>
      </div>
      
      <div class="comments-container" id="comments-${post.id}"></div>

      <div class="add-comment">
        <input type="text" id="input-${
          post.id
        }" placeholder="Write a comment...">
        <button onclick="addComment(${post.id})">Send</button>
      </div>
    </div>
  `;
}

function addComment(postId) {
  const token = localStorage.getItem("token");
  const input = document.getElementById(`input-${postId}`);
  const commentText = input.value.trim();

  if (!token) {
    showToast("You must be logged in to comment.", "error");
    return;
  }

  if (commentText === "") {
    showToast("Comment cannot be empty.", "error");
    return;
  }

  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
      {
        body: commentText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      input.value = "";
      showToast("Comment added successfully!", "success");
      getComments(postId); //Update Comments After Add
    })
    .catch((error) => {
      console.error(error);
      showToast("Failed to add comment.", "error");
    });
}

//Get Comments
function getComments(postId) {
  const commentsContainer = document.getElementById(`comments-${postId}`);
  const countElement = document.getElementById(`count-${postId}`);
  commentsContainer.innerHTML = "<p>Loading comments...</p>";

  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
    .then((response) => {
      const comments = response.data.data.comments;
      countElement.textContent = `(${comments.length})`;

      if (comments.length === 0) {
        commentsContainer.innerHTML =
          "<p class='no-comments'>No comments yet.</p>";
        return;
      }

      const commentsHtml = comments
        .map((comment) => {
          const profileImg =
            comment.author.profile_image || "../imges/user.png";
          return `
          <div class="comment">
            <img src="${profileImg}" alt="User" class="comment-user-img" onerror="this.src='../imges/user.png';">
            <div class="comment-body">
              <strong>${comment.author.name}</strong>
              <p>${comment.body}</p>
            </div>
          </div>
        `;
        })
        .join("");

      commentsContainer.innerHTML = commentsHtml;
    })
    .catch((error) => {
      console.error(error);
      commentsContainer.innerHTML =
        "<p class='error'>Failed to load comments.</p>";
    });
}

function saveUserId(userId) {
  localStorage.setItem("profileUserId", userId);
}

//Log Out
document.querySelectorAll("button[id^='out']").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "../index.html";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  });
});

// Open toggle menu
const toggleBtn = document.getElementById("menu-toggle");
const dropdown = document.getElementById("dropdown-menu");

toggleBtn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

// Open photo modal with event delegation
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const postsContainer = document.getElementById("posts");

postsContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.classList.contains("post-photo")) {
    modal.classList.add("show");
    modalImg.src = e.target.src;
  }
});

closeModal.onclick = () => {
  modal.classList.remove("show");
};

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
};

//Add Post

function addPost() {
  const postBtn = document.getElementById("post-btn");
  postBtn.disabled = true;
  postBtn.innerText = "Posting...";

  const token = localStorage.getItem("token");
  const content = document.getElementById("post-content").value;
  const imageFile = document.getElementById("file-input").files[0];

  const formData = new FormData();
  formData.append("body", content);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      const newPostData = res.data.data;
      const html = renderPost(newPostData);
      document.getElementById("posts").innerHTML =
        html + document.getElementById("posts").innerHTML;

      const postsEl = document.getElementById("posts");
      const firstPost = postsEl.querySelector(".card");
      if (firstPost) firstPost.scrollIntoView({ behavior: "smooth" });
      showToast("The post has been published successfully.", "success");
    })
    .catch((err) => {
      showToast(`Error creating post: ${err.message}`, "error");
    })
    .finally(() => {
      document.getElementById("post-content").value = "";
      document.getElementById("file-input").value = "";
      postBtn.disabled = false;
      postBtn.innerText = "Post";
    });
}

//ShowToast For succes or Error When create a post
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

// Edit Post

function startEditPost(postId, currentContent) {
  const modal = document.getElementById("edit-modal");
  modal.style.display = "flex";
  modal.classList.add("show");
  document.getElementById("edit-post-id").value = postId;
  document.getElementById("edit-post-content").value = currentContent;
}

function submitEdit() {
  const token = localStorage.getItem("token");
  const postId = document.getElementById("edit-post-id").value;
  const newContent = document.getElementById("edit-post-content").value;

  axios
    .put(
      `https://tarmeezacademy.com/api/v1/posts/${postId}`,
      { body: newContent },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => {
      showToast("Post updated successfully", "success");
      closeEditModal();
      loadPosts();
    })
    .catch(() => {
      showToast("Failed to update post", "error");
    });
}

function closeEditModal() {
  const modal = document.getElementById("edit-modal");
  modal.style.display = "none";
  modal.classList.remove("show");
}

//Hide post

function hidePost(iconElement) {
  const postCard = iconElement.closest(".card");
  if (postCard) {
    postCard.classList.add("hide");
    setTimeout(() => {
      postCard.remove();
    }, 500);
  }
}

// Delete Post

function deletePost(postId, iconElement) {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");
  const postCard = iconElement.closest(".card");

  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      postCard.classList.add("hide");
      setTimeout(() => {
        postCard.remove();
        showToast("Post deleted successfully", "success");
      }, 500);
    })
    .catch((error) => {
      console.error(error);
      if (error.response && error.response.status === 403) {
        showToast(
          "You cannot delete a post that doesn't belong to you",
          "error"
        );
      } else {
        showToast("An error occurred while deleting the post", "error");
      }
    });
}

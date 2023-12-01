// DOM elements
const guideList = document.querySelector(".guides");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const unauthContent = document.getElementById("unauth-content-container");

const setupUI = (user) => {
  if (user) {
    // account info
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
      `;
        accountDetails.innerHTML = html;
      });
    // toggle user UI elements
    unauthContent.style.display = "none";
    guideList.style.display = "block";
    loggedInLinks.forEach((item) => (item.style.display = "block"));
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
  } else {
    // clear account info
    accountDetails.innerHTML = "";
    // toggle user elements
    loggedInLinks.forEach((item) => (item.style.display = "none"));
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
    unauthContent.style.display = "block";
    guideList.style.display = "none";
  }
};

// setup guides
const setupGuides = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const guide = doc.data();
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${guide.title} </div>
          <div class="collapsible-body white"> ${guide.content}  </div>
        </li>
      `;
      html += li;
    });
    guideList.innerHTML = html;
  }
};

// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

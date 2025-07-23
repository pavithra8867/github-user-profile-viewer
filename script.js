const api = "https://api.github.com/users/";
const main = document.getElementById("main");
const inputForm = document.getElementById("userInput");
const inputBox = document.getElementById("inputBox");

const userGetFunction = (name) => {
  axios.get(api + name)
    .then((response) => {
      userCard(response.data);
      repoGetFunction(name);
    })
    .catch((err) => {
      if (err.response && err.response.status === 404) {
        errorFunction("No profile with this username");
      } else {
        errorFunction("Error fetching user");
      }
    });
};

const repoGetFunction = (name) => {
  axios.get(`${api}${name}/repos?sort=created`)
    .then((response) => {
      repoCardFunction(response.data);
    })
    .catch(() => {
      errorFunction("Problem fetching repos");
    });
};

const userCard = (user) => {
  const info = user.bio ? `<p>${user.bio}</p>` : "";
  const cardElement = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name || user.login}</h2>
        ${info}
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
  main.innerHTML = cardElement;
};

const errorFunction = (message) => {
  main.innerHTML = `
    <div class="card">
      <h1>${message}</h1>
    </div>
  `;
};

const repoCardFunction = (repos) => {
  const reposElement = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposElement.appendChild(repoEl);
  });
};

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = inputBox.value.trim();
  if (user) {
    userGetFunction(user);
    inputBox.value = "";
  }
});

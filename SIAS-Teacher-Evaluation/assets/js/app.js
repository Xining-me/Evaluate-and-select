window.addEventListener("hashchange", router);
window.addEventListener("load", router);

async function router() {
  const hash = location.hash || "#/";
  const main = document.getElementById("app");
  if (hash === "#/" || hash === "") {
    const teachers = await fetch("data/teachers.json").then(r => r.json());
    main.innerHTML = teachers.map(t => `
      <div class="card">
        <h2>${t.name}</h2>
        <p>${t.title} - ${t.department}</p>
        <a href="#/teacher/${t.id}">查看评价</a>
      </div>
    `).join("");
  } else {
    main.innerHTML = "<p>页面开发中...</p>";
  }
}
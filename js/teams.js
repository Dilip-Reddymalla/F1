const racesPage = document.querySelector("#pending");
racesPage.addEventListener('click', (evt)=>{
  evt.preventDefault();
  alert("comming soon");
});

const dropdowns = document.querySelectorAll('.dropdown select');
for (let select of dropdowns) {
  for (let year in years) {
    const newOption = document.createElement("option");
    newOption.textContent = year;
    newOption.value = year;

    if (year === "2025") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }
}

function getWikiTitleFromUrl(url) {
  if (!url) return null;
  return decodeURIComponent(
    new URL(url).pathname.replace("/wiki/", "")
  );
}




const container = document.getElementById("teams-container");
const btn = document.getElementById("button");

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const year = document.getElementById("year").value;

  container.innerHTML = "";

  const url = `https://api.jolpi.ca/ergast/f1/${year}/constructors.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    const teams = data.MRData.ConstructorTable.Constructors;

    const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary/";

    for (let team of teams) {
        let imageSrc = "assets/f1.png"; // fallback

        const wikiTitle = getWikiTitleFromUrl(team.url);
        console.log(wikiTitle); // good debug

        if (wikiTitle) {
            try {
            const response = await fetch(
                WIKI_API + wikiTitle
            );
            const data = await response.json();

            imageSrc =
                data.thumbnail?.source ||
                data.originalimage?.source ||
                imageSrc;
            } catch (e) {
            console.warn("Image not found for", team.name);
            }
        }

        container.innerHTML += `
            <div class="team-card">
            <h2 class="team-name">${team.name}</h2>

            <img
                src="${imageSrc}"
                alt="${team.name}"
                class="team-photo"
            >

            <ul class="team-data">
                <li><strong>Nationality:</strong> ${team.nationality}</li>
                <li><strong>ID:</strong> ${team.constructorId}</li>
            </ul>
            </div>
        `;
}

        } catch (err) {
            console.error("Failed to load drivers:", err);
        }
});

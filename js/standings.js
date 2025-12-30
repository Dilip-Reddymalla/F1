const racesPage = document.querySelector("#pending");
racesPage.addEventListener('click', (evt)=>{
  evt.preventDefault();
  alert("comming soon");
});

const dropdowns = document.querySelectorAll('#year');
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

function getNameFromWikiUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  const lastPart = url.split('/wiki/')[1];
  if (!lastPart) return null;

  const clean = lastPart.split('#')[0].split('?')[0];

  return {
    apiTitle: clean
  };
}


const container = document.getElementById("standings-container");
const btn = document.getElementById("button");

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const year = document.getElementById("year").value;

  container.innerHTML = "";

  const urlDrivers = `https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json`;
  const urlConstructors = `https://api.jolpi.ca/ergast/f1/${year}/constructorstandings.json`;
  
  if(document.getElementById("type").value === "Drivers Championship"){
    try {
        const response = await fetch(urlDrivers);
        const data = await response.json();

        const players = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const imgUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/";

        for (let player of players) {
            let imageSrc = "assets/f1.png";

            if (player.Driver?.url) {
                const name = getNameFromWikiUrl(player.Driver.url);

                if (name?.apiTitle) {
                try {
                    const response2 = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${name.apiTitle}`
                    );
                    const data2 = await response2.json();

                    imageSrc =
                    data2.thumbnail?.source ||
                    data2.originalimage?.source ||
                    imageSrc;
                } catch (e) {
                    console.warn("Image not found for", player.Driver.familyName);
                }
                }
            }

            container.innerHTML += `
                <div class="standings-card">
                <h2 class="standings-name">
                    ${player.Driver.givenName} ${player.Driver.familyName}
                </h2>

                <img
                    src="${imageSrc}"
                    alt="${player.Driver.givenName} ${player.Driver.familyName}"
                    class="standings-photo"
                >

                <ul class="standings-data">
                    <li><strong>Code:</strong> ${player.Driver.code ?? "N/A"}</li>
                    <li><strong>Driver ID:</strong> ${player.Driver.driverId}</li>
                    <li><strong>Points:</strong> ${player.points}</li>
                    <li><strong>Position:</strong> ${player.position}</li>
                    <li><strong>Wins:</strong> ${player.wins}</li>
                    <li><strong>Nationality:</strong> ${player.Driver.nationality}</li>
                    <li><strong>Permanent Number:</strong> ${player.Driver.permanentNumber ?? "N/A"}</li>
                </ul>
                </div>
            `;
            }

        } 
        catch (err) {
            console.error("Failed to load drivers:", err);
        }
    }
    if(document.getElementById("type").value === "Constructors Championship"){
          try {
            const response = await fetch(urlConstructors);
            const data = await response.json();

            const teams = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
            const imgUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/";

            for (let team of teams) {
            let imageSrc = "assets/f1.png";
                
            if (team.Constructor.url) {
                const name = getNameFromWikiUrl(team.Constructor?.url);
                if (name?.apiTitle) {
                try {
                    const response2 = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${name.apiTitle}`
                    );
                    const data2 = await response2.json();

                    imageSrc =
                    data2.thumbnail?.source ||
                    data2.originalimage?.source ||
                    imageSrc;
                } catch (e) {
                    console.warn("Image not found for", team.name);
                }
                }
        }

        container.innerHTML += `
            <div class="standings-card">
            <h2 class="standings-name">${team.Constructor.name}</h2>

            <img
                src="${imageSrc}"
                alt="${team.Constructor.name}"
                class="standings-photo"
            >

            <ul class="standings-data">
                <li><strong>Constructors:</strong> ${team.Constructor.name ?? "N/A"}</li>
                <li><strong>Points:</strong> ${team.points}</li>
                <li><strong>Position:</strong> ${team.position}</li>
                <li><strong>Wins:</strong> ${team.wins}</li>
            </ul>
            </div>
        `;
        }
        } 
        catch (err) {
            console.error("Failed to load constructors:", err);
        }
    }

});

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

    if (year === "2026") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }
}

function getDriverFromWikiUrl(url) {
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


const container = document.getElementById("drivers-container");
const btn = document.getElementById("button");

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const year = document.getElementById("year").value;

  container.innerHTML = "";

  const url = `https://api.jolpi.ca/ergast/f1/${year}/drivers.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const drivers = data.MRData.DriverTable.Drivers;

    const imgUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/";

    for (let driver of drivers) {
    let imageSrc = "assets/f1.png";

    if (driver.url) {
        const name = getDriverFromWikiUrl(driver.url);

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
            console.warn("Image not found for", driver.familyName);
        }
        }
    }

    container.innerHTML += `
        <div class="driver-card">
        <h2 class="driver-name">${driver.givenName} ${driver.familyName}</h2>

        <img
            src="${imageSrc}"
            alt="${driver.givenName} ${driver.familyName}"
            class="driver-photo"
        >

        <ul class="driver-data">
            <li><strong>Code:</strong> ${driver.code ?? "N/A"}</li>
            <li><strong>Date of Birth:</strong> ${driver.dateOfBirth}</li>
            <li><strong>Driver ID:</strong> ${driver.driverId}</li>
            <li><strong>Nationality:</strong> ${driver.nationality}</li>
            <li><strong>Permanent Number:</strong> ${driver.permanentNumber ?? "N/A"}</li>
        </ul>
        </div>
    `;
    }
    } catch (err) {
        console.error("Failed to load drivers:", err);
    }
});

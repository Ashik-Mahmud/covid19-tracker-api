/* 
TODO:
-
-
-
-
-
-

*/

/* STEP: 1 select all important elements  */
const contentBody = document.getElementById('content-body')
const selectContainer = document.getElementById("country-name");
const preload = document.getElementById("preload");
const error = document.getElementById("error");
/* STEP: 2 create function for load all of data by search terms */
const loadReports = async () => {
    let response = await fetch(`https://corona.lmao.ninja/v2/countries/`);
    let data = await response.json();
    globalReports(data)
    displayCountryAtSelect(data)
};


/* STEP: 3 display country at select option */
const displayCountryAtSelect = (countries) => {
    const countryLists = countries.map((country) => `<option value="${country.countryInfo.iso2}">${country.country}</option>`).join('');
    selectContainer.innerHTML += countryLists;
}



/* STEP: 4 load global reports based on logic  */
const globalReports = (reports) => {
    const checkBox = document.getElementById("flexSwitchCheckChecked");
    displayGlobalReports(false, reports);
    checkBox.addEventListener('change', () => checkBox.checked ? displayGlobalReports(true, reports) : displayGlobalReports(false, reports));
}

/* STEP: 5 display global reports at UI  */
const displayGlobalReports = (logic, reports) => {
    let cases, recovered, deaths, active;
    if (logic === true) {
        cases = reports.reduce((acc, cases) => acc + cases.cases, 0);
        recovered = reports.reduce((acc, recovered) => acc + recovered.recovered, 0);
        deaths = reports.reduce((acc, deaths) => acc + deaths.deaths, 0);
        active = reports.reduce((acc, active) => acc + active.active, 0);
    } else {
        cases = reports.reduce((acc, cases) => acc + cases.todayCases, 0);
        recovered = reports.reduce((acc, recovered) => acc + recovered.todayRecovered, 0);
        deaths = reports.reduce((acc, deaths) => acc + deaths.todayDeaths, 0);
        active = reports.reduce((acc, active) => acc + active.active, 0);
    }
    document.getElementById("cases").innerText = cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("recovered").innerText = recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("deaths").innerText = deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("active").innerText = active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* STEP: 6 load individual country reports by select */
const loadIndividualReport = async (event) => {
    preload.style.display = 'block';
    error.style.display = 'none';
    contentBody.textContent = '';
    let countryId = event.target.value;
    if (countryId === '') {
        preload.style.display = 'none';
        error.style.display = 'block';
    } else {
        let response = await fetch(`https://corona.lmao.ninja/v2/countries/`);
        let data = await response.json();
        const filteredReports = data.filter(report => report.countryInfo.iso2 === countryId);
        displayIndividualReport(filteredReports);
    }
}

/* STEP: 7 display Individual Reports  */
const displayIndividualReport = (report) => {
    let {
        country,
        cases,
        todayCases,
        deaths,
        todayDeaths,
        recovered,
        todayRecovered,
        active,
        continent,
        countryInfo
    } = report[0];
    let pattern = /\B(?=(\d{3})+(?!\d))/g;
    contentBody.innerHTML = `
            <div class="card mb-4 rounded-0">
                <div class="card-header bg-dark bg-opacity-10">
                    <b>Country Info</b>
                </div>
                <table class="table card-body">
                    <tr>
                        <th>Country name</th>
                        <td >
                            <span class="shadow-sm d-inline-block px-2 py-1 text-center bg-dark text-white"  >${country}</span>
                        </td>
                        <th>Continent</th>
                        <td>
                            <span class="shadow-sm d-inline-block px-2 py-1 text-center bg-dark text-white">${continent}</span> 
                        </td>
                        <th>Flags</th>
                        <td>
                            <img src="${countryInfo.flag}" alt="flags" width="40px">
                        </td>
                        </tr>
                </table>
            </div>
            <div class="card mb-4 rounded-0">
                <div class="card-header bg-dark bg-opacity-10">
                    <b>Today Reports</b>
                </div>
                <table class="table card-body">
                    <tr>
                        <th>Today Cases</th>
                        <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-warning text-dark">${todayCases.toString().replace(pattern, ",")}</span></td>
                        <th>Today Recovered</th>
                        <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-success text-white">${todayRecovered.toString().replace(pattern, ",")}</span></td>
                        <th>Today Deaths</th>
                        <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-danger text-white">${todayDeaths.toString().replace(pattern, ",")}</span></td>
                        <th>Active</th>
                        <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-info text-white">${active.toString().replace(pattern, ",")}</span></td>
                    </tr>
                </table>
            </div>
            <div class="card mb-4 rounded-0">
                <div class="card-header bg-success bg-opacity-10">
                    <b>Total Reports</b>
                </div>
                <table class="table card-body">
                
                <tr>
                    <th>Total Cases</th>
                    <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-warning text-dark">${cases.toString().replace(pattern, ",")}</span></td>
                    <th>Total Recovered</th>
                    <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-success text-white">${recovered.toString().replace(pattern, ",")}</span></td>
                    <th>Total Deaths</th>
                    <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-danger text-white">${deaths.toString().replace(pattern, ",")}</span></td>
                    <th>Active</th>
                    <td ><span class="shadow-sm d-inline-block px-2 py-1 text-center bg-info text-white">${active.toString().replace(pattern, ",")}</span></td>
                </tr>
                </table>
            </div>
    `;
    preload.style.display = 'none';

}

selectContainer.addEventListener('change', loadIndividualReport)

loadReports();
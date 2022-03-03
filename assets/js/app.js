/* 
TODO:
- select all important elements  
- create function for load all of data by search terms
- display country at select option
- load global reports based on logic
- display global reports at UI 
- load individual country reports by select
- display Individual Reports 
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
            <div class="card mb-4 rounded-0" >
                <div class="card-header bg-dark bg-opacity-10">
                    <b>Country Info</b>
                </div>
                <table class="table card-body">
                    <tr class="total-reports-container">
                        <th>Country name</th>
                        <td ><span class="bg-dark text-white">${country}</span></td>
                        <th>Continent</th>
                        <td><span class="bg-dark text-white">${continent}</span></td>
                        <th>Flags</th>
                        <td><img src="${countryInfo.flag}" alt="flags" width="40px"></td>
                        </tr>
                </table>
            </div>
            <div class="card mb-4 rounded-0" >
                <div class="card-header bg-dark bg-opacity-10">
                    <b>Today Reports</b>
                </div>
                <table class="table card-body">
                    <tr class="total-reports-container">
                        <th>Today Cases</th>
                        <td ><span class="bg-warning text-dark">${todayCases.toString().replace(pattern, ",")}</span></td>
                        <th>Today Recovered</th>
                        <td ><span class="bg-success text-white">${todayRecovered.toString().replace(pattern, ",")}</span></td>
                        <th>Today Deaths</th>
                        <td ><span class="bg-danger text-white">${todayDeaths.toString().replace(pattern, ",")}</span></td>
                        <th>Active</th>
                        <td ><span class="bg-info text-white">${active.toString().replace(pattern, ",")}</span></td>
                    </tr>
                </table>
            </div>
            <div class="card mb-4 rounded-0">
                <div class="card-header bg-success bg-opacity-10">
                    <b>Total Reports</b>
                </div>
                <table class="table card-body">
                <tr class="total-reports-container">
                    <th>Total Cases</th>
                    <td ><span class="bg-warning text-dark">${cases.toString().replace(pattern, ",")}</span></td>
                    <th>Total Recovered</th>
                    <td ><span class="bg-success text-white">${recovered.toString().replace(pattern, ",")}</span></td>
                    <th>Total Deaths</th>
                    <td ><span class=" bg-danger text-white">${deaths.toString().replace(pattern, ",")}</span></td>
                    <th>Active</th>
                    <td ><span class="bg-info text-white">${active.toString().replace(pattern, ",")}</span></td>
                </tr>
                </table>
            </div>
            <div id="chartContainer" style="height: 370px; width: 100%;"></div>
    `;
    preload.style.display = 'none';
    chartInit({
        country,
        todayCases,
        todayRecovered,
        todayDeaths,
        cases,
        recovered,
        deaths,
        active
    });

}

selectContainer.addEventListener('change', loadIndividualReport)

loadReports();



// Initialization chart 
const chartInit = (obj) => {
    let {
        country,
        todayCases,
        todayRecovered,
        todayDeaths,
        cases,
        recovered,
        deaths,
        active
    } = obj;
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Covid-19 Reports For "+ country
        },
        axisY: {
            title: "Total Patients",

        },
        axisX: {
            title: "Covid-19 Statistic"
        },
        data: [{
            type: "column",
            yValueFormatString: "#,##0.0#\" peoples\"",
            dataPoints: [{
                    label: "Total Cases",
                    y: cases
                },
                {
                    label: "Total Recovered",
                    y: recovered
                },
                {
                    label: "Total Deaths",
                    y: deaths
                },
                {
                    label: "Today Cases",
                    y: todayCases
                },
                {
                    label: "Today Recovered",
                    y: todayRecovered
                },
                {
                    label: "Today Deaths",
                    y: todayDeaths
                },
                {
                    label: "Active",
                    y: active
                }

            ]
        }]
    });
    chart.render();



}
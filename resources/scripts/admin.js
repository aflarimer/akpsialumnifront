//const baseUrl = "https://akpsi-alumnidatabase.herokuapp.com/api/person";
//const baseUrlLocal = "https://localhost:5001/api/person";

var loadNumber = 1;

// document.getElementById('majorsearch').addEventListener('keyup', function (e) {
//     if (e.code === 'Enter') {
//         e.preventDefault();
//         loadNumber++;
//         searchClick();
//     }
// });

 //these were both tests, neither work rn
 
// document.getElementById('majorsearch').addEventListener("keyup", function(event) {
//     // Number 13 is the "Enter" key on the keyboard
//     if (event.code === 13) {
//       event.preventDefault();
//       document.getElementById("test").click();
//     }
//   });

function handleOnLoad() {
    const peopleUrl = "https://akpsi-alumnidatabase.herokuapp.com/api/person";
    fetch(peopleUrl).then(function(response){
        return response.json();
    }).then(function(json){
        console.log(json);
        displayTable(json);
        if (loadNumber == 1) {
            newMap(json);
        }
    }).catch(function(error){
        console.log(error);
    });
};

function displayTable(json){
    var dataTable = document.getElementById("dataTable");
    //gets what the user searched
    var citysearch = document.getElementById("citysearch").value.toLowerCase();
    var majorsearch = document.getElementById("majorsearch").value.toLowerCase();
    var html = "<table class=\"table table-striped table-light\"><tr><th>First Name</th><th>Last Name</th><th>Pledge Class</th><th>Major</th><th>LinkedIn</th><th>Email</th><th>City</th><th>Company</th></tr>";
    if (majorsearch != "" || citysearch != "") { //if the user has typed something into one of the search bars
        json.forEach(person => {
            //next 2 lines convert data from database into a common case AND compares it to what the user has searched
            //this allows them to type one part of the search string and get all results (ex. Atl works to pull all Atlanta records, I did this for the multiple major situation)
            let cityincludes = person.city.toLowerCase().includes(citysearch);
            let majorincludes = person.major.toLowerCase().includes(majorsearch);
            //if statement depending on which box is used to search, or both
            if (cityincludes && majorincludes) { //if they use both search boxes at the same time
                html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td></tr>`;
            }
            else if (citysearch == "" && majorincludes) { //if they search for major
                html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td></tr>`;
            }
            else if (cityincludes && majorsearch == "") { //if they search for city
                html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td></tr>`;
            }
        });
    }
    else { //upon page load, when nothing is in the search bars
        json.forEach(person => {
            html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td></tr>`;
        });
    }
    html+="</table>";
    dataTable.innerHTML = html;
}

function searchClick() {
    loadNumber++; //had this bug where the map would load twice once someone searched for something, this broke the if statement in the fetch which fixed the bug
    handleOnLoad();

}

function newMap(json) {
    var map = new ol.Map({
        target: 'map',
        layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
        ],
        view: new ol.View({
        center: ol.proj.fromLonLat([-98.12679384750024, 38.02230401901925]),
        zoom: 3.8
        })
    });

    const iconStyle = new ol.style.Style({
        text: new ol.style.Text({
            text: '\uf041',                         // fa-play, unicode f04b
            font: '900 18px "Font Awesome 5 Free"', // font weight must be 900

        })
    });
    
    json.forEach(person => {
        var longitude = person.longitude;
        var latitude = person.latitude;
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                    })
                ]
            }),
            style: iconStyle
        });
        map.addLayer(layer);
    })
}
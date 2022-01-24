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
    var citysearch = document.getElementById("citysearch").value.toLowerCase();
    var majorsearch = document.getElementById("majorsearch").value.toLowerCase();
    var html = "<table class=\"table table-striped table-light\"><tr><th>First Name</th><th>Last Name</th><th>Major</th><th>Minor/Specialization</th><th>City</th><th>Company</th><th>LinkedIn</th><th>Email</th></tr>";
    if (majorsearch != "" || citysearch != "") {
        json.forEach(person => {
            
            //var cityRegEx = new RegExp(person.city.toLowerCase(), 'i');
            //var majorRegEx = new RegExp(person.major.toLowerCase(), 'i');
            let cityincludes = person.city.toLowerCase().includes(citysearch);
            let majorincludes = person.major.toLowerCase().includes(majorsearch);
            if (cityincludes && majorincludes) {
                html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.major}</td><td>${person.minor}</td><td>${person.city}</td><td>${person.company}</td><td>${person.linkedIn}</td><td>${person.email}</td></tr>`;
            }
            else if (citysearch == "" && majorincludes) {
                html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.major}</td><td>${person.minor}</td><td>${person.city}</td><td>${person.company}</td><td>${person.linkedIn}</td><td>${person.email}</td></tr>`;
            }
            else if (cityincludes && majorsearch == "") {
                html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.major}</td><td>${person.minor}</td><td>${person.city}</td><td>${person.company}</td><td>${person.linkedIn}</td><td>${person.email}</td></tr>`;
            }
        });
    }
    else {
        json.forEach(person => {
            html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.major}</td><td>${person.minor}</td><td>${person.city}</td><td>${person.company}</td><td>${person.linkedIn}</td><td>${person.email}</td></tr>`;
        });
    }
    html+="</table>";
    dataTable.innerHTML = html;
}

function handleOnSubmit() {
    var fName = document.getElementById("FirstName").value;
    var lName = document.getElementById("LastName").value;
    var major = document.getElementById("Major").value;
    var minor = document.getElementById("Minor").value;
    var pledgeClass = document.getElementById("PledgeClass").value;
    var gradSemester = document.getElementById("GradSemester").value;
    var gradSchool = document.getElementById("GradSchool").value;
    var gradSchoolName = document.getElementById("GradSchoolName").value;
    var employed = document.getElementById("Employed").value;
    var position = document.getElementById("Position").value;
    var company = document.getElementById("Company").value;
    var city = document.getElementById("City").value;
    var linkedIn = document.getElementById("LinkedIn").value;
    var email = document.getElementById("Email").value;
    var phone = document.getElementById("Phone").value;

    var person = {
        FirstName: fName,
        LastName: lName,
        Major: major,
        Minor: minor,
        PledgeClass: pledgeClass,
        GraduatingSemester: gradSemester,
        GradSchool: gradSchool,
        GradSchoolName: gradSchoolName,
        Employed: employed,
        Position: position,
        Company: company,
        City: city,
        LinkedIn: linkedIn,
        Email: email,
        Phone: phone
    }
    postPerson(person);
}

function postPerson(person) {
        const personUrl = "https://akpsi-alumnidatabase.herokuapp.com/api/person";
        fetch(personUrl,{
            method: "POST",
            headers: {
                "Accept":'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(person)
        })
        .then((response)=>{
            console.log(response);
            document.location = "./completedform.html";
        });
    
}

function searchClick() {
    loadNumber++;
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
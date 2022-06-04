//const baseUrl = "https://akpsi-alumnidatabase.herokuapp.com/api/person";
//const baseUrlLocal = "https://localhost:3001/api/person";

var loadNumber = 1;

var fieldList = ["FirstName", "Last Name", "PledgeClass", "Major", "LinkedIn", "Email", "City", "Company", "Delete"];

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
    const peopleUrl = "https://localhost:3001/api/person";
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
    var totalPpl = 0;
    var dataTable = document.getElementById("dataTable");
    //gets what the user searched
    var citysearch = document.getElementById("citysearch").value.toLowerCase();
    var majorsearch = document.getElementById("majorsearch").value.toLowerCase();
    var html = "<table class=\"table table-striped table-light\"><tr><th>First Name</th><th>Last Name</th><th>Pledge Class</th><th>Major</th><th>LinkedIn</th><th>Email</th><th>City</th><th>Company</th><th>Delete</th></tr>";
    if (majorsearch != "" || citysearch != "") { //if the user has typed something into one of the search bars
        json.forEach(person => {
            //next 2 lines convert data from database into a common case AND compares it to what the user has searched
            //this allows them to type one part of the search string and get all results (ex. Atl works to pull all Atlanta records, I did this for the multiple major situation)
            let cityincludes = person.city.toLowerCase().includes(citysearch);
            let majorincludes = person.major.toLowerCase().includes(majorsearch);
            //if statement depending on which box is used to search, or both
            if (cityincludes && majorincludes) { //if they use both search boxes at the same time
                html+=`<tr id=${person.id}><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td></tr>`;
                totalPpl++;
            }
            else if (citysearch == "" && majorincludes) { //if they search for major
                html+=`<tr id=${person.id}><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td></tr>`;
                totalPpl++;
            }
            else if (cityincludes && majorsearch == "") { //if they search for city
                html+=`<tr id=${person.id}><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td></tr>`;
                totalPpl++;
            }
        });
    }
    else { //upon page load, when nothing is in the search bars
        json.forEach(person => {
            html+=`<tr id=${person.id}><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.pledgeClass}</td><td>${person.major}</td><td>${person.linkedIn}</td><td>${person.email}</td><td>${person.city}</td><td>${person.company}</td><td><button class="btn btn-danger btn-sm" onclick = "handleOnDelete(${person.id})">Delete</button></td></tr>`;
            totalPpl++;
        });
    }
    html+="</table>";
    dataTable.innerHTML = html;
    loadTotal(totalPpl);
    handleTableEdit();
}

function handleOnDelete(id) {
    var personObj = {ID: id};
    const deletePersonApiUrl = "https://localhost:3001/api/person/" + id;

    fetch(deletePersonApiUrl, {
        method: "DELETE",
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(personObj)
    }).then((response)=> {
        loadNumber++;
        handleOnLoad();
    })
}

function handleTableEdit() {
    var table = document.getElementById("dataTable");
    var rows = document.getElementsByTagName("tr");
    var cells = document.getElementsByTagName("td");

    for(var i=0; i<rows.length; i++) { //change this to 1 and the next one since don't need header row to be editable?
        var personId = rows[i].id;
        for(var j=0; j<rows[i].cells.length; j++) {
            var myCell = rows[i].cells[j];
            var column = fieldList[j];
            myCell.setAttribute('person-id', personId);
            myCell.setAttribute('column', column);
        }
    }

    for(var i=0; i<cells.length; i++) {
        if (cells[i].getAttribute('column') != "Delete") {
            cells[i].contentEditable = true;
            cells[i].onclick = function() {
                if(this.hasAttribute('data-clicked')){
                    return;
                }
                this.setAttribute('data-clicked', 'yes');
                this.setAttribute('data-text', this.innerHTML);
                var input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.value = this.innerHTML;
                input.style.backgroundColor = "LightGoldenRodYellow";

                input.onblur = function() {
                    var td = input.parentElement;
                    var origText = td.getAttribute('data-text');
                    var currentText = this.value;

                    if(origText != currentText) {
                        //make the save call
                        td.removeAttribute('data-clicked');
                        td.removeAttribute('data-text');
                        var ID = td.getAttribute('person-id');
                        var Column = td.getAttribute('column');
                        td.innerHTML = currentText;
                        var changeObj = {ID : ID};
                        changeObj[Column] = currentText;
                        PutPerson(ID, changeObj);
                    }else{
                        td.removeAttribute('data-clicked');
                        td.removeAttribute('data-text');
                        td.innerHTML = origText;
                    }
                }
                
                // input.onkeypress = function(){ //onkeypress is deprecated so find something else
                //     if(event.keyCode == 13) {
                //         this.blur();
                //     }
                // }

                this.innerHTML = '';
                this.append(input);
                this.firstElementChild.select();
            }
        }
    }
}

function PutPerson(id, changeObj) {
    const putPersonApiUrl = "https://localhost:3001/api/person/" + id;

    fetch(putPersonApiUrl, {
        method: "PUT",
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(changeObj)
    }).then((response)=> {
        loadNumber++;
        handleOnLoad();
    })
}

function loadTotal(totalPpl) {
    document.getElementById("totalPeople").innerHTML = "Total Alumni: " + totalPpl;
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
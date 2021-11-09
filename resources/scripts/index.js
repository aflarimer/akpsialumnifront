function handleOnLoad() {
    //const peopleUrl = "https://localhost:5001/api/person"
    const peopleUrl = "https://akpsi-alumnidatabase.herokuapp.com/api/person";
    fetch(peopleUrl).then(function(response){
        return response.json();
    }).then(function(json){
        console.log(json);
        displayTable(json);

    }).catch(function(error){
        console.log(error);
    });
};

function displayTable(json){
    var dataTable = document.getElementById("dataTable");
    var html = "<table><tr><th>First Name</th><th>Last Name</th><th>City</th></tr>";
    json.forEach(person => {
        html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.city}</td></tr>`;
    });
    html+="</table>";
    dataTable.innerHTML = html;
}
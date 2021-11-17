//const baseUrl = "https://akpsi-alumnidatabase.herokuapp.com/api/person";
//const baseUrlLocal = "https://localhost:5001/api/person";

function handleOnLoad() {
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
    var html = "<table class=\"table table-striped table-light\"><tr><th>First Name</th><th>Last Name</th><th>City</th></tr>";
    json.forEach(person => {
        html+=`<tr><td>${person.firstName}</td><td>${person.lastName}</td><td>${person.major}</td><td>${person.minor}</td><td>${person.major}</td><td>${person.city}</td><td>${person.email}</td></tr>`;
    });
    html+="</table>";
    dataTable.innerHTML = html;
}

function handleOnSubmit() {
    var fName = document.getElementById("fName").value;
    var lName = document.getElementById("lName").value;
    var major = document.getElementById("major").value;
    var city = document.getElementById("city").value;
    var placeholder = "Not Provided";

    var person = {
        FirstName: fName,
        LastName: lName,
        Major: major,
        Minor: placeholder,
        PledgeClass: placeholder,
        GraduatingSemester: placeholder,
        GradSchool: placeholder,
        GradSchoolName: placeholder,
        Employed: placeholder,
        Position: placeholder,
        Company: placeholder,
        City: city,
        Email: placeholder
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
            handleOnLoad();
        });
    
}
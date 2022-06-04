function handleOnSubmit() {
    var warning = document.getElementById("delay-warning").style.display = "block";
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
function handleOnSubmit() {
    
    var email = document.getElementById('Email').value;
    var password = document.getElementById('Password').value;
    
    if(email == "aflarimer@gmail.com" && password == "password") {
        localStorage.setItem('verified', 'true');
        document.location = "./adminhome.html";
    }
    else {
        document.getElementById('warning').style.display = "block";
        var email = document.getElementById('Email').value = '';
        var password = document.getElementById('Password').value = '';
    }
}



$(document).ready(function() {
    // adding default user
	sessionStorage.setItem("k", "k");
});

function CheckRegister() {
    let username = $( "#userRegister" ).val();
    let password = $( "#passRegister" ).val();
    let firstName = $( "#firstNameRegister" ).val();
    let lasttName = $( "#lastNameRegister" ).val();
    let email = $( "#emailRegister" ).val();
    let flag = false;

    // check if have empty field
    flag = username=="" || password=="" || firstName=="" || lasttName=="" || email=="";
    if(flag){
        alert("One of the field are empty");
        return;
    }

    // check password
    flag = password.length < 6;
    if(password.match(/[a-zA-Z]/) == null || password.match(/[0-9]/) == null || flag){
        alert("Password not strong enough - must be atleast size of 6 with letters and numbers");
        return;
    }

    // check full name
    if(firstName.match(/[0-9]/) != null){
        alert("First name can not have numbers");
        return;
    }
    if(lasttName.match(/[0-9]/) != null){
        alert("Last name can not have numbers");
        return;
    }

    // check email
    if(email.match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/) == null){
        alert("Email not valid");
        return;
    }

    Register(username, password);

}

function Register(username, password) {
    sessionStorage.setItem(username, password);
    SetActiveDiv('login');
}

function Login() {
    let username = $( "#userLogin" ).val();
    let password = $( "#passLogin" ).val();
    db_password = sessionStorage.getItem(username);

    if(password != db_password){
        alert("not exist user / wrong password");
        return;
    }

    SetActiveDiv('game');
    Start();
}
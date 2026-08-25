// ==========================================
// Darul Quran Smart ERP
// Authentication System
// Core Module
// ==========================================


function login(username, password){


    let users = JSON.parse(
        localStorage.getItem("users")
    ) || [];



    let user = users.find(
        u =>
        u.username === username &&
        u.password === password
    );



    if(user){


        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );


        return {

            success:true,

            message:"Login Successful",

            user:user

        };


    }



    return {

        success:false,

        message:"Invalid Username or Password"

    };


}






function logout(){


    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
    "index.html";


}






function getCurrentUser(){


    return JSON.parse(

        localStorage.getItem(
            "currentUser"
        )

    );


}






function isLoggedIn(){


    return getCurrentUser() !== null;


}





window.login = login;

window.logout = logout;

window.getCurrentUser = getCurrentUser;

window.isLoggedIn = isLoggedIn;

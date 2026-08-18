function login(){

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    if(username === "admin" && password === "12345"){

        alert("Login Successful");

        window.location.href = "dashboard.html";

    }

    else{

        alert("Invalid Username or Password");

    }

}// Student Statistics Chart

const studentChart = document.getElementById("studentChart");

if(studentChart){

new Chart(studentChart, {

type: "bar",

data: {

labels: [
"Class 1",
"Class 2",
"Class 3",
"Class 4",
"Class 5"
],

datasets:[{

label:"Students",

data:[
80,
120,
100,
150,
50
]

}]

}

});

}



// Attendance Chart

const attendanceChart = document.getElementById("attendanceChart");

if(attendanceChart){

new Chart(attendanceChart, {

type:"pie",

data:{

labels:[
"Present",
"Absent"
],

datasets:[{

data:[
90,
10
]

}]

}

});

}



// Finance Chart

const financeChart = document.getElementById("financeChart");

if(financeChart){

new Chart(financeChart, {

type:"line",

data:{

labels:[
"Jan",
"Feb",
"Mar",
"Apr",
"May"
],

datasets:[{

label:"Income",

data:[
30000,
45000,
50000,
60000,
70000
]

}]

}

});

}

// ===== DASHBOARD JS PART 3/3 START =====


// Sidebar Menu

const menuBtn = document.getElementById("menuBtn");

const sidebar = document.getElementById("sidebar");

const overlay = document.getElementById("overlay");


menuBtn.onclick = function(){

sidebar.classList.toggle("active");

overlay.classList.toggle("active");

}



overlay.onclick = function(){

sidebar.classList.remove("active");

overlay.classList.remove("active");

}




// Student Growth Chart

new Chart(

document.getElementById("studentChart"),

{

type:"bar",

data:{

labels:[

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

],

backgroundColor:"#076b3a"

}]


},


options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

tooltip:{

enabled:true

}

}


}


}

);







// Attendance Chart


new Chart(

document.getElementById("attendanceChart"),

{

type:"doughnut",

data:{

labels:[

"Present 95%",

"Absent 5%"

],


datasets:[{

data:[

95,
5

],

backgroundColor:[

"#076b3a",
"#e74c3c"

]


}]


},


options:{

responsive:true,

maintainAspectRatio:false,

cutout:"70%",


plugins:{


legend:{

position:"bottom"

}


}


}


}

);








// Income Chart


new Chart(

document.getElementById("incomeChart"),

{

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
75000

],


borderColor:"#076b3a",

backgroundColor:"rgba(7,107,58,.15)",

fill:true,

tension:.4


}]


},


options:{

responsive:true,

maintainAspectRatio:false

}


}

);



// ===== DASHBOARD JS PART 3/3 END =====

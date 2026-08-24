// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Dashboard System
// Final dashboard.js
// ==========================================



// ===============================
// Get Data
// ===============================


function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}





function getTeachers(){


return JSON.parse(

localStorage.getItem("teachers")

) || [];


}





function getFees(){


return JSON.parse(

localStorage.getItem("fees")

) || [];


}





function getAttendance(){


return JSON.parse(

localStorage.getItem("attendance")

) || [];


}








// ===============================
// Load Dashboard Cards
// ===============================


function loadDashboard(){



let students = getStudents();


let teachers = getTeachers();


let fees = getFees();


let attendance = getAttendance();





// Total Students


let totalStudents = document.getElementById(

"totalStudents"

);



if(totalStudents){

totalStudents.innerText = students.length;

}







// Total Teachers


let totalTeachers = document.getElementById(

"totalTeachers"

);



if(totalTeachers){

totalTeachers.innerText = teachers.length;

}







// Monthly Income


let totalIncome = 0;



fees.forEach(item=>{


totalIncome += Number(item.amount) || 0;


});





let monthlyFee = document.getElementById(

"monthlyFee"

);



if(monthlyFee){

monthlyFee.innerText =

"৳" + totalIncome;

}







// Attendance


let attendanceValue = document.getElementById(

"attendance"

);



if(attendanceValue){



if(attendance.length > 0){


let present = attendance.filter(

a=>a.status==="Present"

).length;



let percent =

Math.round(

(present / attendance.length) * 100

);



attendanceValue.innerText = percent+"%";


}

else{


attendanceValue.innerText="0%";


}



}



}









// ===============================
// Sidebar
// ===============================



const menuBtn = document.getElementById(

"menuBtn"

);


const sidebar = document.getElementById(

"sidebar"

);


const overlay = document.getElementById(

"overlay"

);




if(menuBtn){


menuBtn.onclick=function(){


sidebar.classList.toggle("active");


overlay.classList.toggle("active");


}



}





if(overlay){


overlay.onclick=function(){


sidebar.classList.remove("active");


overlay.classList.remove("active");


}


}








// ===============================
// Student Chart
// ===============================



let studentChart = document.getElementById(

"studentChart"

);



if(studentChart){



new Chart(

studentChart,

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

20,
30,
25,
35,
15

]

}]


},



options:{


responsive:true


}


}



);


}









// ===============================
// Attendance Chart
// ===============================



let attendanceChart = document.getElementById(

"attendanceChart"

);



if(attendanceChart){



new Chart(

attendanceChart,

{


type:"doughnut",


data:{


labels:[

"Present",
"Absent"

],



datasets:[{


data:[

95,
5

]


}]



},



options:{


responsive:true


}



}


);


}









// ===============================
// Income Chart
// ===============================


let incomeChart = document.getElementById(

"incomeChart"

);



if(incomeChart){



new Chart(

incomeChart,


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

]


}]



},


options:{


responsive:true


}



}


);


}







// Start


loadDashboard();

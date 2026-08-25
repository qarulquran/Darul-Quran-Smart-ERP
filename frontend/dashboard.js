// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Dashboard System
// dashboard.js FINAL
// ==========================================


// ===============================
// Database
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
// Monthly Fee Setup
// ===============================


const monthlyFee = {


"শিশু শ্রেণী":500,

"প্রথম শ্রেণী":600,

"দ্বিতীয় শ্রেণি":600,

"তৃতীয় শ্রেণী":600,

"চতুর্থ শ্রেণি":600,

"পঞ্চম শ্রেণী":700,

"ষষ্ঠ শ্রেণি":800,


"Class 1":600,

"Class 2":600,

"Class 3":600,

"Class 4":600,

"Class 5":700,

"Class 6":800


};








// ===============================
// Other Fee Setup
// ===============================


const otherFeeSetup = {


"Admission Fee":1000,

"Exam Fee":500,

"ID Card Fee":200,

"Book Fee":500,

"Uniform Fee":800,

"Tour Fee":1000,

"Certificate Fee":500,

"Other Fee":0


};








// ===============================
// Load Dashboard
// ===============================


function loadDashboard(){



let students =
getStudents();



let teachers =
getTeachers();



let fees =
getFees();




let attendance =
getAttendance();





let studentBox =
document.getElementById(
"totalStudents"
);



if(studentBox){

studentBox.innerText =
students.length;

}





let teacherBox =
document.getElementById(
"totalTeachers"
);



if(teacherBox){

teacherBox.innerText =
teachers.length;

}







let income = 0;



fees.forEach(fee=>{


income +=
Number(fee.amount) || 0;


});





let incomeBox =
document.getElementById(
"monthlyFee"
);



if(incomeBox){

incomeBox.innerText =
"৳" + income;

}





let attendanceBox =
document.getElementById(
"attendance"
);



if(attendanceBox){



let present =
attendance.filter(
a=>a.status==="Present"
).length;



let total =
attendance.length;



let percent = 0;



if(total>0){

percent =
Math.round(
(present/total)*100
);

}



attendanceBox.innerText =
percent+"%";


}






loadDueSummary();


loadCharts();


}

// ===============================
// Due Summary
// ===============================


function loadDueSummary(){


let students =
getStudents();


let fees =
getFees();



let monthlyDue = 0;

let otherDue = 0;





students.forEach(student=>{


let studentFees = fees.filter(

fee =>

fee.studentCode === student.studentCode

);





// ===============================
// Monthly Fee Due
// ===============================


let paidMonthly = 0;



studentFees.forEach(fee=>{


if(
fee.feeType === "Monthly Fee"
){


paidMonthly += Number(fee.amount);


}


});






if(student.admissionDate){


let startDate =
new Date(
student.admissionDate
);


let today =
new Date();




let months =

(
(today.getFullYear()
-
startDate.getFullYear())

*12

)

+

(
today.getMonth()
-
startDate.getMonth()

)

+

1;





let classFee =

monthlyFee[
student.admissionClass
]

||0;





let expected =

months * classFee;




let due =

expected - paidMonthly;



if(due > 0){

monthlyDue += due;

}



}








// ===============================
// Other Fee Due
// ===============================



Object.keys(otherFeeSetup).forEach(type=>{


let paid = 0;



studentFees.forEach(fee=>{


if(
fee.feeType === type
){


paid += Number(fee.amount);


}



});





let due =

otherFeeSetup[type] - paid;




if(due > 0){


otherDue += due;


}



});





});








let totalDue =

monthlyDue + otherDue;





let totalBox =

document.getElementById(
"totalDueAmount"
);



let monthlyBox =

document.getElementById(
"monthlyDueAmount"
);



let otherBox =

document.getElementById(
"otherDueAmount"
);





if(totalBox){

totalBox.innerText =
totalDue;

}



if(monthlyBox){

monthlyBox.innerText =
monthlyDue;

}



if(otherBox){

otherBox.innerText =
otherDue;

}



}









// ===============================
// Sidebar Control
// ===============================


const menuBtn =
document.getElementById(
"menuBtn"
);


const sidebar =
document.getElementById(
"sidebar"
);


const overlay =
document.getElementById(
"overlay"
);




if(menuBtn){


menuBtn.onclick=function(){


sidebar.classList.toggle(
"active"
);


overlay.classList.toggle(
"active"
);


}


}



if(overlay){


overlay.onclick=function(){


sidebar.classList.remove(
"active"
);


overlay.classList.remove(
"active"
);


}


}









// ===============================
// Charts
// ===============================


function loadCharts(){



let studentChart =
document.getElementById(
"studentChart"
);



if(studentChart){


new Chart(

studentChart,

{

type:"bar",

data:{


labels:[
"Students"
],


datasets:[{


label:"Total Students",

data:[

getStudents().length

]


}]


},


options:{

responsive:true

}


}

);


}







let attendanceChart =
document.getElementById(
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


getAttendance().filter(

a=>a.status==="Present"

).length,


getAttendance().filter(

a=>a.status!=="Present"

).length


]


}]


},


options:{

responsive:true

}


}

);



}








let incomeChart =
document.getElementById(
"incomeChart"
);



if(incomeChart){



new Chart(

incomeChart,

{


type:"line",


data:{


labels:[

"Income"

],


datasets:[{


label:"Income",

data:[


getFees().reduce(

(sum,fee)=>

sum + Number(fee.amount || 0),

0

)


]


}]


},


options:{

responsive:true

}


}

);



}



}









// ===============================
// Start
// ===============================


loadDashboard();

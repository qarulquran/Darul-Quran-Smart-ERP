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







// Total Collection


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




// Due Summary Load

loadDueSummary();



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



let paidMonthly = 0;



fees.forEach(fee=>{



if(

fee.studentCode === student.studentCode

&&

fee.feeType === "Monthly Fee"

){


paidMonthly += Number(fee.amount);



}



});






if(student.admissionDate){



let startDate =

new Date(student.admissionDate);



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

|| 0;





let expected =

months * classFee;




let due =

expected - paidMonthly;



if(due > 0){

monthlyDue += due;

}



}





});








// Other Fee Due

fees.forEach(fee=>{



if(

fee.feeType !== "Monthly Fee"

){


}

});






let totalDue =

monthlyDue + otherDue;





let totalDueBox =

document.getElementById(
"totalDueAmount"
);



let monthlyDueBox =

document.getElementById(
"monthlyDueAmount"
);



let otherDueBox =

document.getElementById(
"otherDueAmount"
);





if(totalDueBox){

totalDueBox.innerText =
totalDue;

}



if(monthlyDueBox){

monthlyDueBox.innerText =
monthlyDue;

}



if(otherDueBox){

otherDueBox.innerText =
otherDue;

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
// Charts
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

"Income"

],


datasets:[{


label:"Income",


data:[


getFees().reduce(

(sum,item)=>

sum + Number(item.amount || 0),

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









// ===============================
// Start Dashboard
// ===============================


loadDashboard();

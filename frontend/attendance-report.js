// ==========================================
// Darul Quran Smart ERP
// Attendance Report System
// attendance-report.js
// ==========================================





// ===============================
// Get Data
// ===============================


function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}






function getAttendance(){


return JSON.parse(

localStorage.getItem("attendance")

) || [];


}









// ===============================
// Search Report
// ===============================


const searchButton =

document.getElementById(

"searchReport"

);








if(searchButton){



searchButton.addEventListener(

"click",

function(){



let code =

document.getElementById(

"studentCode"

).value.trim();






let students = getStudents();





let student = students.find(item =>



item.studentCode === code



);








if(!student){


alert(

"Student Not Found"

);


return;


}







document.getElementById(

"reportBox"

).style.display="flex";







document.getElementById(

"studentName"

).innerText =

student.name || "";








document.getElementById(

"showCode"

).innerText =

student.studentCode || "";








document.getElementById(

"studentClass"

).innerText =

student.admissionClass || "";












// Attendance Calculation


let attendance = getAttendance();






let records = attendance.filter(item =>



item.studentCode === code



);








let total = records.length;






let present = records.filter(item =>



item.status === "Present"



).length;







let absent = records.filter(item =>



item.status === "Absent"



).length;








let leave = records.filter(item =>



item.status === "Leave"



).length;








let percentage = 0;







if(total > 0){



percentage =

Math.round(

(present / total) * 100

);



}







document.getElementById(

"totalClass"

).innerText =

total;







document.getElementById(

"present"

).innerText =

present;







document.getElementById(

"absent"

).innerText =

absent;







document.getElementById(

"percentage"

).innerText =

percentage + "%";







});


}

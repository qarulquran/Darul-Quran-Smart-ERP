// ==========================================
// Darul Quran ERP
// Dynamic Student Profile System
// Student Code Based
// ==========================================



// ===============================
// Get Students
// ===============================


function getStudents(){


    return JSON.parse(

        localStorage.getItem("students")

    ) || [];


}







// ===============================
// Get Selected Student Code
// ===============================


let studentCode =

localStorage.getItem(
    "selectedStudent"
);







// ===============================
// Find Student
// ===============================


let students = getStudents();



let student = students.find(

    item =>

    (
        item.studentCode === studentCode ||

        item.id === studentCode

    )

);







// ===============================
// Display Student
// ===============================


if(student){



document.getElementById(
"studentName"
).innerText =

student.name || "";





document.getElementById(
"studentCode"
).innerText =

student.studentCode || student.id || "";





document.getElementById(
"fatherName"
).innerText =

student.fatherName || student.father || "";





document.getElementById(
"motherName"
).innerText =

student.motherName || student.mother || "";





document.getElementById(
"dateOfBirth"
).innerText =

student.dateOfBirth || "";





document.getElementById(
"studentClass"
).innerText =

student.admissionClass || student.className || "";





document.getElementById(
"mobile"
).innerText =

student.guardianMobile || student.mobile || "";







let address = "";



if(student.address){


address =

(student.address.division || "")
+
" "
+
(student.address.district || "")
+
" "
+
(student.address.thana || "")
+
" "
+
(student.address.details || "");


}



else{


address = student.address || "";


}






document.getElementById(
"address"
).innerText = address;







document.getElementById(
"attendance"
).innerText =

student.attendance || "0%";






document.getElementById(
"feeStatus"
).innerText =

student.feeStatus || "Due";







document.getElementById(
"result"
).innerText =

student.result || "N/A";





}

else{


alert(
"Student not found"
);



window.location.href =

"students.html";



}

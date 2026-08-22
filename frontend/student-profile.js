// ==========================================
// Darul Quran ERP
// Student Profile System
// Code Based Loading
// ==========================================



// ===============================
// Get Student Database
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



let student = students.find(function(item){



    return (

        item.studentCode === studentCode

        ||

        item.id === studentCode

    );


});







// ===============================
// Load Profile
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
"bloodGroup"
).innerText =

student.bloodGroup || "";





document.getElementById(
"studentClass"
).innerText =

student.admissionClass || student.className || "";





document.getElementById(
"mobile"
).innerText =

student.guardianMobile || student.mobile || "";





document.getElementById(
"admissionDate"
).innerText =

student.admissionDate || "";







// Address


let fullAddress = "";



if(student.address && typeof student.address === "object"){


fullAddress =

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


fullAddress = student.address || "";


}






document.getElementById(
"address"
).innerText =

fullAddress;








document.getElementById(
"fatherNid"
).innerText =

student.fatherNid || "";





document.getElementById(
"motherNid"
).innerText =

student.motherNid || "";








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

student.result || "-";





// Photo

if(student.photo){


document.getElementById(
"studentPhoto"
).src = student.photo;


}





}

else{


alert(
"Student Not Found"
);



window.location.href =

"students.html";


}

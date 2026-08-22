// ==========================================
// Darul Quran ERP
// Student Profile System
// Student Code Based
// ==========================================


// Get Student Database

function getStudents(){

    return JSON.parse(

        localStorage.getItem("students")

    ) || [];

}





// Get Student Code From URL

let urlParams =
new URLSearchParams(
window.location.search
);



let studentCode =
urlParams.get("id");





// Find Student

let students =
getStudents();



let student =

students.find(

item =>

item.studentCode === studentCode

);







// Load Student Profile


if(student){



document.getElementById(
"studentName"
).innerText =
student.name || "";



document.getElementById(
"studentCode"
).innerText =
student.studentCode || "";



document.getElementById(
"fatherName"
).innerText =
student.fatherName || "";



document.getElementById(
"motherName"
).innerText =
student.motherName || "";



document.getElementById(
"dob"
).innerText =
student.dateOfBirth || "";



document.getElementById(
"className"
).innerText =
student.admissionClass || "";



document.getElementById(
"mobile"
).innerText =
student.guardianMobile || "";



document.getElementById(
"address"
).innerText =

(student.address?.division || "")
+
" "
+
(student.address?.district || "")
+
" "
+
(student.address?.thana || "");




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

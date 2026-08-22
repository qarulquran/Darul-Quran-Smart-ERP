// ==========================================
// Darul Quran ERP
// Dynamic Edit Student System
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
// Selected Student Code
// ===============================


let studentCode =

localStorage.getItem(

    "editStudent"

);






// ===============================
// Get Student
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
// Load Student Data
// ===============================


if(student){



document.getElementById(
"studentName"
).value =

student.name || "";





document.getElementById(
"fatherName"
).value =

student.fatherName || student.father || "";





document.getElementById(
"motherName"
).value =

student.motherName || student.mother || "";





document.getElementById(
"dateOfBirth"
).value =

student.dateOfBirth || "";





document.getElementById(
"studentClass"
).value =

student.admissionClass || student.className || "";





document.getElementById(
"mobile"
).value =

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
).value = address;




}

else{


alert(

"Student not found"

);


window.location.href =

"students.html";


}








// ===============================
// Update Student
// ===============================


document.getElementById(

"editForm"

)

.addEventListener(

"submit",

function(e){


e.preventDefault();





let students = getStudents();





students = students.map(student => {



let code =

student.studentCode ||

student.id;





if(code === studentCode){



student.name =

document.getElementById(
"studentName"
).value;




student.fatherName =

document.getElementById(
"fatherName"
).value;




student.motherName =

document.getElementById(
"motherName"
).value;




student.dateOfBirth =

document.getElementById(
"dateOfBirth"
).value;




student.admissionClass =

document.getElementById(
"studentClass"
).value;




student.guardianMobile =

document.getElementById(
"mobile"
).value;




student.address =

document.getElementById(
"address"
).value;



}




return student;



});







localStorage.setItem(

"students",

JSON.stringify(students)

);






alert(

"Student Updated Successfully"

);





window.location.href =

"students.html";



});

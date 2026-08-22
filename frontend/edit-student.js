// ==========================================
// Darul Quran ERP
// Edit Student System
// Student Code Based
// ==========================================


// Get Students

function getStudents(){

    return JSON.parse(

        localStorage.getItem("students")

    ) || [];

}



// Save Students

function saveStudents(data){

    localStorage.setItem(

        "students",

        JSON.stringify(data)

    );

}



// Get Student Code From URL

let params =

new URLSearchParams(

window.location.search

);


let studentCode =

params.get("id");




// Load Student


let students = getStudents();


let student = students.find(

item =>

item.studentCode === studentCode

);




// If Student Found

if(student){


document.getElementById(
"studentName"
).value =
student.name || "";



document.getElementById(
"fatherName"
).value =
student.fatherName || "";



document.getElementById(
"motherName"
).value =
student.motherName || "";



document.getElementById(
"dateOfBirth"
).value =
student.dateOfBirth || "";



document.getElementById(
"admissionClass"
).value =
student.admissionClass || "";



document.getElementById(
"mobile"
).value =
student.guardianMobile || "";



document.getElementById(
"address"
).value =

student.address?.details || "";



}

else{


alert(
"Student not found"
);


window.location.href =
"students.html";


}





// Update Student


const form =

document.querySelector("form");



if(form){


form.addEventListener(

"submit",

function(e){


e.preventDefault();





let students = getStudents();




let index = students.findIndex(

item =>

item.studentCode === studentCode

);





if(index !== -1){



students[index].name =

document.getElementById(
"studentName"
).value;




students[index].fatherName =

document.getElementById(
"fatherName"
).value;




students[index].motherName =

document.getElementById(
"motherName"
).value;




students[index].dateOfBirth =

document.getElementById(
"dateOfBirth"
).value;




students[index].admissionClass =

document.getElementById(
"admissionClass"
).value;




students[index].guardianMobile =

document.getElementById(
"mobile"
).value;




students[index].address.details =

document.getElementById(
"address"
).value;




saveStudents(students);




alert(

"Student Updated Successfully\n\nStudent Code:\n"

+ studentCode

);



window.location.href =

"student-profile.html?id="

+ studentCode;



}



}

);


}

// ==========================================
// Darul Quran ERP
// Edit Student System
// Part 1/2
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


let oldStudentCode =

localStorage.getItem(

"editStudent"

);







// ===============================
// Load Students
// ===============================


let students = getStudents();





let student = students.find(function(item){


    return (

        item.studentCode === oldStudentCode

    );


});







// ===============================
// Generate New Student Code
// ===============================


function generateStudentCode(className){



let students = getStudents();




let classNumber = "";



let match = className.match(/\d+/);





if(match){


    classNumber = match[0];


}

else if(className === "Play"){


    classNumber = "0";


}

else if(className === "Nursery"){


    classNumber = "N";


}

else{


    classNumber = "0";


}






let year =

new Date()

.getFullYear();







let sameClassStudents =

students.filter(student=>



student.studentCode &&


student.studentCode.startsWith(

`DQ-${classNumber}-${year}`

)



);






let serial =

sameClassStudents.length + 1;






let serialNumber =

String(serial)

.padStart(5,"0");







return (

`DQ-${classNumber}-${year}-${serialNumber}`

);



}








// ===============================
// Load Student Data Into Form
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






document.getElementById(

"address"

).value =

typeof student.address === "string"

?

student.address

:

"";





}

else{


alert(

"Student Not Found"

);


window.location.href =

"students.html";


}

// ==========================================
// Part 2/2
// Update Student System
// ==========================================



// ===============================
// Update Form Submit
// ===============================


const editForm =

document.getElementById(

"editForm"

);





if(editForm){



editForm.addEventListener(

"submit",

function(e){


e.preventDefault();





let students = getStudents();





students = students.map(function(item){





if(item.studentCode === oldStudentCode){





// ===============================
// Check Class Change
// ===============================


let oldClass =

item.admissionClass || "";



let newClass =

document.getElementById(

"studentClass"

).value;







if(oldClass !== newClass){



item.studentCode =

generateStudentCode(

newClass

);



item.admissionClass =

newClass;



}








// ===============================
// Update Information
// ===============================


item.name =

document.getElementById(

"studentName"

).value;






item.fatherName =

document.getElementById(

"fatherName"

).value;






item.motherName =

document.getElementById(

"motherName"

).value;






item.dateOfBirth =

document.getElementById(

"dateOfBirth"

).value;







item.guardianMobile =

document.getElementById(

"mobile"

).value;






item.address =

document.getElementById(

"address"

).value;







}





return item;





});








// ===============================
// Save Updated Data
// ===============================


localStorage.setItem(

"students",

JSON.stringify(

students

)

);







alert(

"Student Updated Successfully"

);







window.location.href =

"students.html";





}

);


}

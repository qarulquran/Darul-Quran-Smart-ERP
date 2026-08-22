// ==========================================
// Generate Student Code
// Format:
// DQ-Class-Year-Serial
// Example:
// DQ-1-2026-00001
// ==========================================


function generateStudentCode(className){


let students = JSON.parse(

localStorage.getItem("students")

) || [];




// Class Number বের করা

let classNumber = "";



if(className){


let match = className.match(/\d+/);



if(match){

classNumber = match[0];

}

else{


// Play / Nursery এর জন্য

if(className === "Play"){

classNumber = "0";

}

else if(className === "Nursery"){

classNumber = "N";

}


}



}





// Current Year

let year =

new Date()

.getFullYear();





// একই Class + Year এর Student Count


let sameClassStudents =

students.filter(student =>



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





return `DQ-${classNumber}-${year}-${serialNumber}`;


}

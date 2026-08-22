// ==========================================
// Darul Quran Smart ERP
// Student ID Card System
// id-card.js
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

"selectedStudent"

);








// ===============================
// Find Student
// ===============================


let students = getStudents();





let student = students.find(item =>



item.studentCode === studentCode



);








// ===============================
// Load ID Card
// ===============================


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

"studentClass"

).innerText =

student.admissionClass || "";







document.getElementById(

"bloodGroup"

).innerText =

student.bloodGroup || "";







document.getElementById(

"mobile"

).innerText =

student.guardianMobile || "";







let address = "";





if(student.address){



if(typeof student.address === "object"){



address =

(student.address.division || "")
+
" "
+
(student.address.district || "")
+
" "
+
(student.address.thana || "");



}

else{


address = student.address;


}



}






document.getElementById(

"address"

).innerText =

address;









// Photo Load


if(student.photo){


document.getElementById(

"studentPhoto"

).src =

student.photo;


}









// QR Code


let qrData =


student.studentCode

+

"|"

+

student.name;







let qrBox =

document.getElementById(

"qrCode"

);








if(qrBox){



let img = document.createElement(

"img"

);



img.src =

"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="

+

encodeURIComponent(qrData);





qrBox.appendChild(img);



}









}

else{


alert(

"Student Not Found"

);



window.location.href =

"students.html";


}

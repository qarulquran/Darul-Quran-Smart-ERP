// ==========================================
// Darul Quran Smart ERP
// Certificate Management System
// certificate.js
// ==========================================





// ===============================
// Get Database
// ===============================


function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}





function getResults(){


return JSON.parse(

localStorage.getItem("results")

) || [];


}





function getCertificates(){


return JSON.parse(

localStorage.getItem("certificates")

) || [];


}







function saveCertificates(data){


localStorage.setItem(

"certificates",

JSON.stringify(data)

);


}









// ===============================
// Selected Student
// ===============================


let studentCode =

localStorage.getItem(

"selectedStudent"

);









let students = getStudents();





let student = students.find(item =>


item.studentCode === studentCode


);








let results = getResults();





let result = results.find(item =>


item.studentCode === studentCode


);









if(student){







// Certificate Number


let certificates = getCertificates();






let year =

new Date()

.getFullYear();





let number =

certificates.length + 1;






let certificateNo =


"CERT-DQ-"

+

year

+

"-"

+

String(number)

.padStart(5,"0");









// Save Certificate Record


let certificate = {



certificateNo:

certificateNo,





studentCode:

student.studentCode,





issueDate:

new Date()

.toISOString()

.substring(0,10),





createdAt:

new Date()

.toISOString()



};






certificates.push(certificate);






saveCertificates(certificates);











// Student Info



document.getElementById(

"certificateNo"

).innerText =

certificateNo;






document.getElementById(

"issueDate"

).innerText =

certificate.issueDate;







document.getElementById(

"studentName"

).innerText =

student.name || "";






document.getElementById(

"studentNameText"

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

"studentClass"

).innerText =

student.admissionClass || "";









if(student.photo){


document.getElementById(

"studentPhoto"

).src = student.photo;


}









// Result Info


if(result){



document.getElementById(

"examName"

).innerText =

result.exam || "";







document.getElementById(

"grade"

).innerText =

result.grade || "";







document.getElementById(

"gpa"

).innerText =

result.gpa || "";



}







document.getElementById(

"passingYear"

).innerText =

year;









// QR Code



let qrData =


certificateNo

+

"|"

+

student.studentCode;








let qr = document.getElementById(

"qrCode"

);






if(qr){



let img = document.createElement("img");



img.src =

"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="

+

encodeURIComponent(qrData);





qr.appendChild(img);



}









}

else{


alert(

"Student Not Found"

);



window.location.href =

"students.html";


}

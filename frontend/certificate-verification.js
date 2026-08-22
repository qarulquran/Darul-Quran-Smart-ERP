// ==========================================
// Darul Quran Smart ERP
// Certificate Verification System
// certificate-verification.js
// ==========================================





// ===============================
// Get Database
// ===============================


function getCertificates(){


return JSON.parse(

localStorage.getItem("certificates")

) || [];


}





function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}









// ===============================
// Verify Button
// ===============================


const verifyButton =

document.getElementById(

"verifyBtn"

);








if(verifyButton){



verifyButton.addEventListener(

"click",

function(){



let certificateNo =

document.getElementById(

"certificateNo"

).value.trim();






let certificates = getCertificates();







let certificate = certificates.find(item =>



item.certificateNo === certificateNo



);








if(!certificate){



alert(

"Certificate Not Found"

);



return;


}









let students = getStudents();







let student = students.find(item =>



item.studentCode === certificate.studentCode



);







if(student){



document.getElementById(

"certificateResult"

).style.display="flex";








document.getElementById(

"status"

).innerText =

"✅ Certificate Verified";








document.getElementById(

"showCertificateNo"

).innerText =

certificate.certificateNo;







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

"passingYear"

).innerText =

new Date(

certificate.createdAt

)

.getFullYear();







}

else{


document.getElementById(

"status"

).innerText =

"❌ Student Data Not Found";


}





});


}

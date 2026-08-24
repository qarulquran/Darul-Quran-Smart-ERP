// ==========================================
// Darul Quran Ahmadia Madrasah
// Fee Collection System
// Final fee.js
// ==========================================


let selectedStudent = null;



function getStudents(){

return JSON.parse(

localStorage.getItem("students")

) || [];

}



function getFees(){

return JSON.parse(

localStorage.getItem("fees")

) || [];

}






function saveFees(data){

localStorage.setItem(

"fees",

JSON.stringify(data)

);

}






// ===============================
// Search Student
// ===============================


function searchStudent(){


let code = document

.getElementById("studentCodeInput")

.value

.trim();





let students = getStudents();





let student = students.find(

item =>

item.studentCode.trim() === code

);






if(!student){


alert("Student Not Found");


return;


}





selectedStudent = student;



// Keep selected student

localStorage.setItem(

"selectedFeeStudent",

JSON.stringify(student)

);





document.getElementById("studentName")

.innerText =

student.name || "-";





document.getElementById("studentClass")

.innerText =

student.admissionClass || "-";





document.getElementById("fatherName")

.innerText =

student.fatherName || "-";





alert("Student Found");



}








// ===============================
// Receipt Number
// ===============================


function generateReceiptNo(){


let fees=getFees();


return (

"DQ-REC-"

+

new Date().getFullYear()

+

"-"

+

String(fees.length+1)

.padStart(6,"0")

);


}








// ===============================
// Save Payment
// ===============================


function saveFee(){



if(!selectedStudent){



let oldStudent = JSON.parse(

localStorage.getItem("selectedFeeStudent")

);



if(oldStudent){

selectedStudent = oldStudent;

}

}





if(!selectedStudent){


alert(

"আগে Student Search করুন"

);


return;


}







let amount = document

.getElementById("amount")

.value;





if(!amount){


alert(

"Amount দিন"

);


return;


}







let fee = {



receiptNo:

generateReceiptNo(),



studentCode:

selectedStudent.studentCode,



studentName:

selectedStudent.name,



fatherName:

selectedStudent.fatherName,



guardianMobile:

selectedStudent.guardianMobile,



feeType:

document.getElementById("feeType").value,



month:

document.getElementById("feeMonth").value,



amount:amount,



paymentMethod:

document.getElementById("paymentMethod").value,



paymentDate:

new Date().toLocaleDateString("bn-BD")



};







let fees=getFees();



fees.push(fee);



saveFees(fees);






// Receipt Data

localStorage.setItem(

"lastReceipt",

JSON.stringify(fee)

);







// WhatsApp Message

let msg =

"আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ।\n\n"+

"দারুল কুরআন আহমদিয়া মাদরাসা\n\n"+

"শিক্ষার্থী: "+fee.studentName+

"\nReceipt No: "+fee.receiptNo+

"\nAmount: ৳"+fee.amount+

"\nMonth: "+fee.month+

"\n\nজাযাকাল্লাহু খায়রান।";




localStorage.setItem(

"guardianMessage",

msg

);







alert(

"Payment Saved Successfully\n"+

fee.receiptNo

);



}








// ===============================
// Receipt
// ===============================


function openReceipt(){


if(!localStorage.getItem("lastReceipt")){


alert("No Receipt Found");


return;


}



window.location.href="receipt.html";


}

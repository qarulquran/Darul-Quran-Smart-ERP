// ==========================================
// Darul Quran Ahmadia Madrasah
// Fee Collection System
// fee.js
// ==========================================


// ===============================
// Get Database
// ===============================

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



// ===============================
// Current Selected Student
// ===============================

let selectedStudent = null;





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

item => item.studentCode === code

);



if(!student){

alert("Student not found");

return;

}



selectedStudent = student;



document.getElementById("studentName")
.innerText =
student.name || "-";



document.getElementById("studentClass")
.innerText =
student.admissionClass || "-";



document.getElementById("fatherName")
.innerText =
student.fatherName || "-";



}





// ===============================
// Generate Receipt Number
// ===============================

function generateReceiptNo(){


let serial =
Date.now()
.toString()
.slice(-6);



return "DQ-REC-"
+
new Date().getFullYear()
+
"-"
+
serial;


}







// ===============================
// Save Fee
// ===============================

function saveFee(){



if(!selectedStudent){


alert("Please select student first");


return;


}




let fee = {


receiptNo:
generateReceiptNo(),



studentCode:
selectedStudent.studentCode,



studentName:
selectedStudent.name,



feeType:
document.getElementById("feeType").value,



month:
document.getElementById("feeMonth").value,



amount:
document.getElementById("amount").value,



paymentMethod:
document.getElementById("paymentMethod").value,



paymentDate:
new Date()
.toLocaleDateString("en-GB")


};





let fees = getFees();



fees.push(fee);



localStorage.setItem(

"fees",

JSON.stringify(fees)

);




alert("Payment Saved Successfully");



}







// ===============================
// Open Receipt
// ===============================

function openReceipt(){



let fees = getFees();



if(fees.length === 0){


alert("No payment found");


return;


}



window.location.href =
"receipt.html";


}

// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP
// Final Fee Collection System
// fee.js
// ==========================================



let selectedStudent = null;



// ===============================
// Database
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


let code =
document
.getElementById("studentCodeInput")
.value
.trim();




let students = getStudents();




let student = students.find(item =>


String(item.studentCode).trim()
===
String(code).trim()


);





if(!student){


alert(
"Student Not Found"
);


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





document.getElementById("guardianMobile")
.innerText =
student.guardianMobile || "-";






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
// Save Fee
// ===============================


function saveFee(){



if(!selectedStudent){


alert(
"Please Search Student First"
);


return;


}





let fee={



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



amount:
document.getElementById("amount").value,



paymentMethod:
document.getElementById("paymentMethod").value,



paymentDate:
new Date().toLocaleDateString("bn-BD")



};






if(!fee.amount){


alert(
"Amount দিন"
);


return;


}






let fees=getFees();



fees.push(fee);





// Save Fee Database

saveFees(fees);






// Save Latest Receipt

localStorage.setItem(

"lastReceipt",

JSON.stringify(fee)

);







// WhatsApp Message

let message =

"আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ।\n\n"

+

"দারুল কুরআন আহমদিয়া মাদরাসা\n\n"

+

"শিক্ষার্থী: "

+

fee.studentName

+

"\n"

+

"Receipt No: "

+

fee.receiptNo

+

"\n"

+

"Fee Amount: ৳"

+

fee.amount

+

"\n"

+

"Month: "

+

fee.month

+

"\n\n"

+

"জাযাকাল্লাহু খায়রান।";







localStorage.setItem(

"guardianMessage",

message

);








alert(

"Payment Saved Successfully\n"

+

fee.receiptNo

);







}









// ===============================
// Open Receipt
// ===============================


function openReceipt(){



if(!localStorage.getItem("lastReceipt")){


alert(
"No Receipt Found"
);


return;


}



window.location.href=

"receipt.html";


}

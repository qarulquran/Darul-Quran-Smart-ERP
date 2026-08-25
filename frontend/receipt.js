// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Money Receipt
// receipt.js FINAL FIX
// ==========================================


document.addEventListener(
"DOMContentLoaded",
function(){



// ===============================
// Get Last Receipt Data
// ===============================


let payment =
JSON.parse(
localStorage.getItem("lastReceipt")
);





// যদি lastReceipt না থাকে
// তাহলে fees থেকে শেষ ডাটা নিবে


if(!payment){


let fees =
JSON.parse(
localStorage.getItem("fees")
) || [];



if(fees.length > 0){

payment =
fees[fees.length-1];

}


}





if(!payment){


alert(
"No Receipt Data Found"
);


window.location.href="fee.html";


return;


}







// ===============================
// Get Student
// ===============================


let students =
JSON.parse(
localStorage.getItem("students")
) || [];




let student =
students.find(
s =>
s.studentCode === payment.studentCode
);







// ===============================
// Receipt Info
// ===============================


document.getElementById("receiptNo").innerText =
payment.receiptNo || "-";



document.getElementById("paymentDate").innerText =
payment.paymentDate || "-";







// ===============================
// Student Information
// ===============================


document.getElementById("studentName").innerText =

student ?
student.name :

payment.studentName || "-";




document.getElementById("studentCode").innerText =

student ?
student.studentCode :

payment.studentCode || "-";




document.getElementById("studentClass").innerText =

student ?
student.admissionClass :

payment.admissionClass || "-";




document.getElementById("fatherName").innerText =

student ?
student.fatherName :

payment.fatherName || "-";








// ===============================
// Payment Information
// ===============================


document.getElementById("feeType").innerText =

payment.feeType || "-";




document.getElementById("feeMonth").innerText =

payment.month || "-";




document.getElementById("amount").innerText =

payment.amount || "0";




document.getElementById("paymentMethod").innerText =

payment.paymentMethod || "-";









// ===============================
// Barcode
// ===============================


let barcode =
document.getElementById("barcode");




if(barcode){


barcode.innerHTML="";



let img =
document.createElement("img");



img.src =
"https://barcode.tec-it.com/barcode.ashx?data="
+
encodeURIComponent(
payment.receiptNo
)
+
"&code=Code128";



img.style.width="220px";



barcode.appendChild(img);


}



});

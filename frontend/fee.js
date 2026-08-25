// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee Collection
// fee.js FINAL
// ==========================================


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



let selectedStudent = null;




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



    let student =
    students.find(
        s => s.studentCode === code
    );



    if(!student){

        alert("Student Not Found");

        return;

    }



    selectedStudent = student;



    document.getElementById("studentName").innerText =
    student.name || "-";


    document.getElementById("studentClass").innerText =
    student.admissionClass || "-";


    document.getElementById("fatherName").innerText =
    student.fatherName || "-";



}





// ===============================
// Receipt Number
// ===============================


function generateReceiptNo(){


return "DQ-REC-" 
+
new Date().getFullYear()
+
"-"
+
Date.now().toString().slice(-6);


}







// ===============================
// Save Fee
// ===============================

function saveFee(){


if(!selectedStudent){

alert("Please Search Student First");

return;

}




let amount =
document.getElementById("amount").value;




if(!amount || amount<=0){

alert("Enter Amount");

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


admissionClass:
selectedStudent.admissionClass,



feeType:
document.getElementById("feeType").value,



month:
document.getElementById("feeMonth").value,



amount:
amount,



paymentMethod:
document.getElementById("paymentMethod").value,



paymentDate:
new Date().toLocaleDateString("en-GB")

};





let fees=getFees();


fees.push(fee);



localStorage.setItem(
"fees",
JSON.stringify(fees)
);



// Receipt data

localStorage.setItem(
"lastReceipt",
JSON.stringify(fee)
);




alert(
"Payment Saved Successfully\nReceipt No: "
+
fee.receiptNo
);



window.location.href="receipt.html";


}







function openReceipt(){


let data =
localStorage.getItem("lastReceipt");


if(!data){

alert("No Receipt Found");

return;

}


window.location.href="receipt.html";


}





function logout(){

localStorage.removeItem("admin");

window.location.href="index.html";

}

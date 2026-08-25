// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee Collection System
// fee.js FINAL
// ==========================================


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



// ===============================
// Selected Student
// ===============================

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



    if(!code){

        alert("Enter Student Code");

        return;

    }



    let students = getStudents();



    let student =
    students.find(
        item =>
        item.studentCode === code
    );




    if(!student){


        alert(
        "Student not found"
        );


        return;


    }




    selectedStudent = student;




    document
    .getElementById("studentName")
    .innerText =
    student.name || "-";





    document
    .getElementById("studentClass")
    .innerText =
    student.admissionClass || "-";





    document
    .getElementById("fatherName")
    .innerText =
    student.fatherName || "-";





}








// ===============================
// Receipt Number
// ===============================


function generateReceiptNo(){


    let time =
    Date.now()
    .toString()
    .slice(-8);



    return (
        "DQ-REC-" +
        new Date().getFullYear()
        +
        "-"
        +
        time
    );


}









// ===============================
// Save Payment
// ===============================


function saveFee(){



    if(!selectedStudent){


        alert(
        "Please Search Student First"
        );


        return;

    }






    let amount =
    document
    .getElementById("amount")
    .value;




    if(!amount || amount<=0){


        alert(
        "Enter Amount"
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



        admissionClass:
        selectedStudent.admissionClass,



        feeType:
        document
        .getElementById("feeType")
        .value,



        month:
        document
        .getElementById("feeMonth")
        .value,



        amount:
        amount,



        paymentMethod:
        document
        .getElementById("paymentMethod")
        .value,



        paymentDate:
        new Date()
        .toLocaleDateString("en-GB")



    };









    // Save all fees


    let fees =
    getFees();



    fees.push(fee);





    localStorage.setItem(

        "fees",

        JSON.stringify(fees)

    );






    // IMPORTANT FOR RECEIPT


    localStorage.setItem(

        "lastReceipt",

        JSON.stringify(fee)

    );
    
    // Save Last Receipt Data

localStorage.setItem(
    "lastReceipt",
    JSON.stringify(fee)
);

    






    alert(
"Payment Saved Successfully\n\nReceipt No: "
+
fee.receiptNo
);







    window.location.href =
    "receipt.html";



}









// ===============================
// Open Receipt Button
// ===============================


function openReceipt(){



    let receipt =
    localStorage.getItem(
    "lastReceipt"
    );



    if(!receipt){


        alert(
        "No Receipt Found"
        );


        return;


    }



    window.location.href =
    "receipt.html";


}






// ===============================
// Logout
// ===============================


function logout(){


    localStorage.removeItem(
    "admin"
    );


    window.location.href =
    "index.html";


}

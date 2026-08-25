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



function saveStudents(data){

    localStorage.setItem(
        "students",
        JSON.stringify(data)
    );

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


    return (

        "DQ-REC-"

        +

        new Date().getFullYear()

        +

        "-"

        +

        Date.now()
        .toString()
        .slice(-6)

    );


}








// ===============================
// Admission Fee Update
// ===============================

function updateAdmissionStatus(studentCode){


    let students = getStudents();



    students = students.map(student=>{


        if(student.studentCode === studentCode){


            student.admissionFeeStatus = "Paid";


            student.admissionStatus = "Confirmed";


        }


        return student;


    });




    saveStudents(students);



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





    let amount =

    document
    .getElementById("amount")
    .value;




    if(!amount || amount <= 0){


        alert(
        "Enter Amount"
        );


        return;


    }






    let feeType =

    document
    .getElementById("feeType")
    .value;








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

        feeType,



        month:

        document
        .getElementById("feeMonth")
        .value,



        amount:

        Number(amount),



        paymentMethod:

        document
        .getElementById("paymentMethod")
        .value,



        paymentDate:

        new Date()
        .toLocaleDateString("en-GB"),



        status:

        "Paid"


    };









    // Save Fee History


    let fees = getFees();



    fees.push(fee);



    localStorage.setItem(

        "fees",

        JSON.stringify(fees)

    );









    // Admission Fee Control


    if(feeType === "Admission Fee"){


        updateAdmissionStatus(

            fee.studentCode

        );


    }








    // Save Receipt Data


    localStorage.setItem(

        "lastReceipt",

        JSON.stringify(fee)

    );








    alert(

        "Payment Saved Successfully\n\nReceipt No:\n"

        +

        fee.receiptNo

    );






    window.location.href =

    "receipt.html";



}









// ===============================
// Open Receipt
// ===============================

function openReceipt(){



    let data =

    localStorage.getItem(
        "lastReceipt"
    );



    if(!data){


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

// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP
// Fee Collection System
// Final fee.js
// ==========================================


document.addEventListener("DOMContentLoaded", function(){



// ===============================
// Variables
// ===============================


let selectedStudent = null;




const searchBtn = document.getElementById("searchStudent");

const saveBtn = document.getElementById("savePayment");








// ===============================
// Get Students
// ===============================


function getStudents(){


    let data = localStorage.getItem("students");


    if(!data){

        return [];

    }


    return JSON.parse(data);


}








// ===============================
// Get Fees
// ===============================


function getFees(){


    return JSON.parse(

        localStorage.getItem("fees")

    ) || [];


}








// ===============================
// Search Student
// ===============================


if(searchBtn){


searchBtn.addEventListener("click", function(){



    let code = document

    .getElementById("studentCode")

    .value

    .trim();





    if(code===""){


        alert("Student Code লিখুন");

        return;


    }





    let students = getStudents();





    let student = students.find(function(item){


        return item.studentCode === code;


    });







    if(!student){


        alert(

        "এই Student Code-এ কোনো ছাত্র পাওয়া যায়নি"

        );


        return;


    }







    selectedStudent = student;







    document.getElementById("studentInfo")

    .style.display="block";







    document.getElementById("studentPhoto")

    .src = student.photo || 

    "https://via.placeholder.com/120";







    document.getElementById("studentName")

    .innerText = student.name || "-";







    document.getElementById("showStudentCode")

    .innerText = student.studentCode || "-";







    document.getElementById("studentClass")

    .innerText = student.admissionClass || "-";







    document.getElementById("fatherName")

    .innerText = student.fatherName || "-";







    document.getElementById("guardianMobile")

    .innerText = student.guardianMobile || "-";






    alert("Student Found Successfully");



});



}










// ===============================
// Receipt Number
// ===============================


function createReceiptNo(){



    let fees = getFees();



    let number = fees.length + 1;



    return "DQ-MR-" +

    new Date().getFullYear()

    +

    "-" +

    String(number).padStart(5,"0");



}









// ===============================
// Save Payment
// ===============================


if(saveBtn){


saveBtn.addEventListener("click", function(){



    if(!selectedStudent){


        alert(

        "আগে Student Search করুন"

        );


        return;


    }






    let amount = document

    .getElementById("amount")

    .value;





    if(amount===""){


        alert(

        "Amount লিখুন"

        );


        return;


    }








    let payment = {


        receiptNo:

        createReceiptNo(),



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

        document.getElementById("month").value,



        amount:

        amount,



        paymentMethod:

        document.getElementById("paymentMethod").value,



        paymentDate:

        new Date().toLocaleDateString("bn-BD")



    };







    let fees = getFees();



    fees.push(payment);





    localStorage.setItem(

        "fees",

        JSON.stringify(fees)

    );






    localStorage.setItem(

        "lastReceipt",

        JSON.stringify(payment)

    );







    alert(

    "Payment Saved Successfully\nReceipt No: "

    +

    payment.receiptNo

    );







    window.location.href="receipt.html";





});



}





});

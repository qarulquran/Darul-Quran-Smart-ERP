// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee Due Management
// fee-due.js FINAL VERSION
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
// Monthly Fee Setup
// ===============================

const monthlyFee = {


    "শিশু শ্রেণী":500,

    "প্রথম শ্রেণী":600,

    "দ্বিতীয় শ্রেণি":600,

    "তৃতীয় শ্রেণী":600,

    "চতুর্থ শ্রেণি":600,

    "পঞ্চম শ্রেণী":700,

    "ষষ্ঠ শ্রেণি":800,


    "Class 1":600,

    "Class 2":600,

    "Class 3":600,

    "Class 4":600,

    "Class 5":700,

    "Class 6":800


};






// ===============================
// Other Fee Setup
// ===============================


const otherFeeSetup = {


    "Admission Fee":1000,

    "Exam Fee":500,

    "ID Card Fee":200,

    "Book Fee":500,

    "Uniform Fee":800,

    "Tour Fee":1000,

    "Certificate Fee":500,

    "Other Fee":0


};








// ===============================
// Month Count
// ===============================


function monthDifference(startDate,endDate){


    return (

        (endDate.getFullYear()
        -
        startDate.getFullYear()) * 12

        +

        (endDate.getMonth()
        -
        startDate.getMonth())

        +

        1

    );


}








// ===============================
// Load Due Report
// ===============================


function loadDue(){



let students =
getStudents();



let fees =
getFees();



let filter =
document.getElementById("feeFilter").value;




let table =
document.getElementById("dueTable");



table.innerHTML="";



let totalDue = 0;





students.forEach(student=>{



let studentFees =

fees.filter(

fee =>

fee.studentCode === student.studentCode

);





// ===============================
// Monthly Fee Calculation
// ===============================



let monthlyPaid = 0;



studentFees.forEach(fee=>{


if(
fee.feeType === "Monthly Fee"
){


monthlyPaid += Number(
fee.amount
);


}



});






if(
student.admissionDate
&&
(filter==="All" ||
filter==="Monthly Fee")
){



let startDate =
new Date(
student.admissionDate
);



let today =
new Date();



let totalMonth =

monthDifference(
startDate,
today
);




let classFee =

monthlyFee[
student.admissionClass
]
||
0;





let monthlyExpected =

totalMonth *
classFee;





let monthlyDue =

monthlyExpected
-
monthlyPaid;




if(monthlyDue < 0){

monthlyDue = 0;

}






if(monthlyDue > 0){



let row =
document.createElement("tr");



row.innerHTML =

`
<td>
${student.name || "-"}
</td>

<td>
${student.admissionClass || "-"}
</td>

<td>
Monthly Fee
</td>

<td>
৳ ${monthlyPaid}
</td>

<td>
৳ ${monthlyDue}
</td>
`;



table.appendChild(row);



totalDue += monthlyDue;


}



}







// ===============================
// Other Fee Calculation
// ===============================


let paidOther = {};





studentFees.forEach(fee=>{



if(
fee.feeType !== "Monthly Fee"
){


if(!paidOther[fee.feeType]){


paidOther[fee.feeType]=0;


}



paidOther[fee.feeType]

+=

Number(fee.amount);



}



});
    
    // ===============================
// Other Fee Due Continue
// ===============================


Object.keys(otherFeeSetup).forEach(type=>{



if(
filter !== "All"
&&
filter !== type
){

return;

}




let expected =

otherFeeSetup[type];




let paid =

paidOther[type] || 0;




let due =

expected - paid;



if(due < 0){

due = 0;

}





if(due > 0){



let row =
document.createElement("tr");



row.innerHTML =

`
<td>
${student.name || "-"}
</td>

<td>
${student.admissionClass || "-"}
</td>

<td>
${type}
</td>

<td>
৳ ${paid}
</td>

<td>
৳ ${due}
</td>
`;



table.appendChild(row);



totalDue += due;



}



});



});







document.getElementById("totalDue")
.innerText =
totalDue;



}








// ===============================
// Auto Load
// ===============================


document.addEventListener(

"DOMContentLoaded",

function(){


loadDue();


}

);

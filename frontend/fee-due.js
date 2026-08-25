// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee Due Management
// fee-due.js FINAL
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




// ==========================================
// Class Wise Monthly Fee
// ==========================================


const monthlyFee = {


    "শিশু শ্রেণী":500,

    "প্রথম শ্রেণী":600,

    "দ্বিতীয় শ্রেণি":600,

    "তৃতীয় শ্রেণী":600,

    "চতুর্থ শ্রেণি":600,

    "পঞ্চম শ্রেণি":700,

    "ষষ্ঠ শ্রেণি":800,


    // English class support

    "Class 1":600,

    "Class 2":600,

    "Class 3":600,

    "Class 4":600,

    "Class 5":700,

    "Class 6":800


};






// ==========================================
// Month Difference
// ==========================================


function monthDifference(start,end){


return (

(end.getFullYear()-start.getFullYear()) * 12

+

(end.getMonth()-start.getMonth())

+

1

);


}









// ==========================================
// Load Due
// ==========================================


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





let studentPayments =

fees.filter(

fee =>

fee.studentCode === student.studentCode

);







// ================================
// Monthly Fee Calculation
// ================================



let monthlyPaid = 0;



studentPayments.forEach(payment=>{


if(payment.feeType==="Monthly Fee"){


monthlyPaid += Number(payment.amount);


}


});





let monthlyDue = 0;





if(student.admissionDate){



let startDate =

new Date(student.admissionDate);



let today = new Date();



let months =

monthDifference(

startDate,

today

);





let classFee =

monthlyFee[student.admissionClass] || 0;





monthlyDue =

(months * classFee)

-

monthlyPaid;



if(monthlyDue < 0){

monthlyDue = 0;

}


}







if(
(filter==="All" || filter==="Monthly Fee")
&&
monthlyDue > 0
){



let row =
document.createElement("tr");



row.innerHTML = `


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









// ================================
// Other Fee Due
// ================================



let otherFees = {};





studentPayments.forEach(payment=>{



if(payment.feeType !== "Monthly Fee"){



if(!otherFees[payment.feeType]){


otherFees[payment.feeType]=0;


}



otherFees[payment.feeType] +=

Number(payment.amount);



}



});






Object.keys(otherFees).forEach(type=>{



if(
filter!=="All"
&&
filter!==type
){

return;

}





// বর্তমানে Paid amount দেখাবে
// পরে Fee Setup থেকে Expected Amount যোগ হবে



let row =
document.createElement("tr");



row.innerHTML = `


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

৳ ${otherFees[type]}

</td>



<td>

৳ 0

</td>


`;



table.appendChild(row);



});





});







document.getElementById("totalDue")
.innerText =

totalDue;



}








document.addEventListener(

"DOMContentLoaded",

function(){


loadDue();


}

);

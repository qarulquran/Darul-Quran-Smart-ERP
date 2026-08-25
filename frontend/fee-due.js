// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee Due Management
// fee-due.js
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
// Load Due Report
// ==========================================


function loadDue(){


let students = getStudents();

let fees = getFees();


let filter =
document.getElementById("feeFilter").value;



let table =
document.getElementById("dueTable");


table.innerHTML="";



let totalDue = 0;



students.forEach(student => {



let studentFees =
fees.filter(
item =>
item.studentCode === student.studentCode
);





// যদি কোনো payment না থাকে

if(studentFees.length === 0){


return;


}




let feeSummary = {};





studentFees.forEach(item=>{


let type =
item.feeType;



if(!feeSummary[type]){


feeSummary[type]=0;


}



feeSummary[type] +=
Number(item.amount);



});






Object.keys(feeSummary).forEach(type=>{



if(
filter !== "All"
&&
filter !== type
){

return;


}






let paid =
feeSummary[type];



/*
 এখানে Fee Amount
 পরে class অনুযায়ী
 auto setup করা হবে
*/

let due = 0;





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
৳ ${paid}
</td>


<td>
৳ ${due}
</td>

`;



table.appendChild(row);



totalDue += due;



});



});





document.getElementById("totalDue")
.innerText =
totalDue;



}





// Auto Load

document.addEventListener(
"DOMContentLoaded",
function(){

loadDue();

});

// =====================================
// Darul Quran Ahmadia Madrasah
// Fee History System
// =====================================



function getFees(){


return JSON.parse(

localStorage.getItem("fees")

) || [];


}




function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}







function searchFeeHistory(){



let code =
document
.getElementById("studentCode")
.value
.trim();




if(!code){


alert("Enter Student Code");

return;


}





let students =
getStudents();



let student =
students.find(

s =>
s.studentCode === code

);





if(!student){


alert("Student Not Found");

return;


}







let fees =
getFees();




let studentFees =
fees.filter(

f =>
f.studentCode === code

);









document.getElementById("studentInfo").innerHTML =

`
<div class="student-card">

<h3>Student Information</h3>

<p>Name: ${student.name}</p>

<p>Class: ${student.admissionClass}</p>

<p>Father: ${student.fatherName}</p>

</div>
`;









if(studentFees.length===0){


document.getElementById("history").innerHTML =

`
<h3>
No Fee Payment Found
</h3>
`;


return;


}







let total=0;


let rows="";




studentFees.forEach(
fee=>{


total += Number(fee.amount);



rows +=

`
<tr>

<td>
${fee.month}
</td>


<td>
${fee.feeType}
</td>


<td>
৳ ${fee.amount}
</td>


<td>
${fee.paymentMethod}
</td>


<td>
${fee.paymentDate}
</td>


</tr>

`;



}

);







document.getElementById("history").innerHTML =

`

<h3>
Fee History
</h3>


<table>


<tr>

<th>
Month
</th>

<th>
Type
</th>


<th>
Amount
</th>


<th>
Method
</th>


<th>
Date
</th>


</tr>


${rows}


</table>



<h2>

Total Paid:
৳ ${total}

</h2>


`;



}

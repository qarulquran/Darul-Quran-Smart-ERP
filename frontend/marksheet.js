// ==========================================
// Darul Quran Smart ERP
// Marksheet System
// marksheet.js
// ==========================================





// ===============================
// Get Data
// ===============================


function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}







function getResults(){


return JSON.parse(

localStorage.getItem("results")

) || [];


}









// ===============================
// Get Selected Student
// ===============================


let studentCode =

localStorage.getItem(

"selectedStudent"

);









// ===============================
// Find Result
// ===============================


let results = getResults();





let result = results.find(item =>



item.studentCode === studentCode



);








// ===============================
// Find Student
// ===============================


let students = getStudents();





let student = students.find(item =>



item.studentCode === studentCode



);









if(student && result){






// Student Information



document.getElementById(

"studentName"

).innerText =

student.name || "";







document.getElementById(

"studentCode"

).innerText =

student.studentCode || "";







document.getElementById(

"studentClass"

).innerText =

student.admissionClass || "";








document.getElementById(

"examName"

).innerText =

result.exam || "";









if(student.photo){


document.getElementById(

"studentPhoto"

).src = student.photo;


}











// Subject List


let table =

document.getElementById(

"subjectList"

);






table.innerHTML = "";








result.subjects.forEach(item=>{






let mark = Number(item.mark);






let grade = "";






if(mark >= 80){

grade="A+";

}

else if(mark >=70){

grade="A";

}

else if(mark>=60){

grade="A-";

}

else if(mark>=50){

grade="B";

}

else if(mark>=40){

grade="C";

}

else if(mark>=33){

grade="D";

}

else{

grade="F";

}









table.innerHTML +=



`

<tr>


<td>

${item.subject}

</td>



<td>

${mark}

</td>



<td>

${grade}

</td>



</tr>


`;






});









document.getElementById(

"totalMark"

).innerText =

result.total;








document.getElementById(

"average"

).innerText =

result.average;








document.getElementById(

"grade"

).innerText =

result.grade;








document.getElementById(

"gpa"

).innerText =

result.gpa;









}

else{



alert(

"Result Not Found"

);



window.location.href =

"result.html";


}

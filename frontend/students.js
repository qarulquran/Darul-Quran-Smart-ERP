// ==========================================
// Darul Quran ERP
// Student List System
// Dynamic Student Management
// ==========================================



// ===============================
// Get Students
// ===============================


function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}







let allStudents = getStudents();








// ===============================
// Display Students
// ===============================


function displayStudents(data){



let table =

document.getElementById(

"studentTable"

);



if(!table) return;




table.innerHTML = "";





if(data.length === 0){


table.innerHTML =

`
<tr>

<td colspan="8">

No Student Found

</td>

</tr>

`;


return;


}








data.forEach(student=>{






table.innerHTML +=



`

<tr>



<td>


<img

src="${student.photo || 'https://via.placeholder.com/60'}"

width="60"

height="60"

style="border-radius:50%;object-fit:cover;">


</td>





<td>

${student.studentCode || ""}

</td>





<td>

${student.name || ""}

</td>





<td>

${student.admissionClass || ""}

</td>





<td>

${student.fatherName || ""}

</td>





<td>

${student.guardianMobile || ""}

</td>





<td>

${student.feeStatus || "Due"}

</td>





<td>



<button

onclick="viewStudent('${student.studentCode}')"

class="view-btn">

👁 View

</button>




<button

onclick="editStudent('${student.studentCode}')"

class="edit-btn">

✏ Edit

</button>





<button

onclick="deleteStudent('${student.studentCode}')"

class="delete-btn">

🗑 Delete

</button>



</td>




</tr>


`;



});



}









// ===============================
// View Student
// ===============================


function viewStudent(code){



localStorage.setItem(

"selectedStudent",

code

);



window.location.href =

"student-profile.html";



}








// ===============================
// Edit Student
// ===============================


function editStudent(code){



localStorage.setItem(

"editStudent",

code

);



window.location.href =

"edit-student.html";



}









// ===============================
// Delete Student
// ===============================


function deleteStudent(code){



let confirmDelete =

confirm(

"Delete this student?"

);




if(!confirmDelete)

return;






let students = getStudents();





students = students.filter(student=>


student.studentCode !== code


);







localStorage.setItem(

"students",

JSON.stringify(students)

);






alert(

"Student Deleted Successfully"

);






displayStudents(students);



}









// ===============================
// Search System
// ===============================


let searchInput =

document.getElementById(

"searchStudent"

);



let searchButton =

document.getElementById(

"searchBtn"

);






if(searchButton){


searchButton.onclick=function(){



let value =

searchInput.value

.toLowerCase();





let result = allStudents.filter(student=>



(student.name || "")

.toLowerCase()

.includes(value)

||

(student.studentCode || "")

.toLowerCase()

.includes(value)

||

(student.guardianMobile || "")

.includes(value)

||

(student.fatherName || "")

.toLowerCase()

.includes(value)



);





displayStudents(result);



};



}









// ===============================
// Page Load
// ===============================


displayStudents(allStudents);

// ==========================================
// Darul Quran ERP
// Student Management System
// Student Code Based
// ==========================================



// Get Students

function getStudents(){

    return JSON.parse(

        localStorage.getItem("students")

    ) || [];

}






// Display Students

function displayStudents(){


    let students = getStudents();


    let tableBody =
    document.getElementById(
        "studentTableBody"
    );



    if(!tableBody){
        return;
    }



    tableBody.innerHTML="";





    students.forEach(student=>{



        let row =
        document.createElement("tr");



        row.innerHTML = `


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



        <a href="student-profile.html?id=${student.studentCode}">

        <button>

        👁 View

        </button>

        </a>





        <a href="edit-student.html?id=${student.studentCode}">

        <button>

        ✏ Edit

        </button>

        </a>





        <button onclick="deleteStudent('${student.studentCode}')">

        🗑 Delete

        </button>



        </td>



        `;




        tableBody.appendChild(row);



    });



}








// Search Student


function searchStudent(){



let value =

document.getElementById(
"searchInput"
)
.value
.toLowerCase();





let rows =

document.querySelectorAll(
"#studentTableBody tr"
);





rows.forEach(row=>{



let text =

row.innerText
.toLowerCase();





if(
text.includes(value)
){

row.style.display="";


}

else{


row.style.display="none";


}



});



}







// Delete Student


function deleteStudent(studentCode){



let confirmDelete =

confirm(

"Delete this student?"

);



if(confirmDelete){



let students =
getStudents();





students =

students.filter(

student =>

student.studentCode !== studentCode

);





localStorage.setItem(

"students",

JSON.stringify(students)

);





displayStudents();





alert(

"Student deleted successfully"

);



}




}








// Load Data

displayStudents();

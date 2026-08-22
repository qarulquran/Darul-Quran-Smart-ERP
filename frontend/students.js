// =====================================
// Darul Quran Smart ERP
// Student Management System
// students.js
// =====================================


// Get Students Data

function getStudents(){

    let data = localStorage.getItem("students");

    if(data){

        return JSON.parse(data);

    }

    return [];

}




// Save Students Data

function saveStudents(students){

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

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



    tableBody.innerHTML = "";



    students.forEach(student => {



        let row =
        document.createElement("tr");



        row.innerHTML = `

        <td>
        ${student.studentCode || student.id}
        </td>


        <td>
        ${student.name || ""}
        </td>


        <td>
        ${student.className || ""}
        </td>


        <td>
        ${student.father || ""}
        </td>


        <td>
        ${student.mobile || ""}
        </td>


        <td>
        ${student.feeStatus || "Due"}
        </td>



        <td>


        <button 
        onclick="viewStudent('${student.studentCode || student.id}')">

        👁 View

        </button>



        <button
        onclick="editStudent('${student.studentCode || student.id}')">

        ✏ Edit

        </button>



        <button
        onclick="deleteStudent('${student.studentCode || student.id}')">

        🗑 Delete

        </button>



        </td>


        `;



        tableBody.appendChild(row);



    });



}





// =====================================
// Search Student
// =====================================


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
        row.innerText.toLowerCase();



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





// =====================================
// Delete Student
// =====================================


function deleteStudent(code){



    let confirmDelete =
    confirm(
        "Delete this student?"
    );



    if(!confirmDelete){

        return;

    }




    let students =
    getStudents();



    students =
    students.filter(student => {


        return (

            student.studentCode !== code

            &&

            student.id !== code

        );


    });





    saveStudents(students);




    displayStudents();




    alert(
        "Student deleted successfully"
    );



}





// =====================================
// View Student
// =====================================


function viewStudent(code){


    localStorage.setItem(
        "viewStudentCode",
        code
    );


    window.location.href =
    "student-profile.html";


}




// =====================================
// Edit Student
// =====================================


function editStudent(code){


    localStorage.setItem(
        "editStudentCode",
        code
    );


    window.location.href =
    "edit-student.html";


}





// Load Table

displayStudents();

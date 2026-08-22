// ==========================================
// Darul Quran Smart ERP
// Student Management System
// students.js Part 1/2
// ==========================================



// ===============================
// Get Student Data
// ===============================


function getStudents(){

    return JSON.parse(

        localStorage.getItem("students")

    ) || [];

}




// ===============================
// Display Students
// ===============================


function displayStudents(){


    let students = getStudents();



    let tableBody = document.getElementById(

        "studentTableBody"

    );



    if(!tableBody){

        return;

    }



    tableBody.innerHTML = "";





    students.forEach(student => {



        let row = document.createElement("tr");





        row.innerHTML = `



<td>

${student.studentCode || student.id || ""}

</td>




<td>

${student.name || ""}

</td>




<td>

${student.admissionClass || student.className || ""}

</td>




<td>

${student.fatherName || student.father || ""}

</td>




<td>

${student.guardianMobile || student.mobile || ""}

</td>




<td>

${student.feeStatus || "Due"}

</td>




<td>



<button onclick="viewStudent('${student.studentCode || student.id}')">

👁 View

</button>



<button onclick="editStudent('${student.studentCode || student.id}')">

✏ Edit

</button>



<button onclick="deleteStudent('${student.studentCode || student.id}')">

🗑 Delete

</button>



</td>



`;





        tableBody.appendChild(row);



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



    let confirmDelete = confirm(

        "Delete this student?"

    );



    if(!confirmDelete){

        return;

    }





    let students = getStudents();





    students = students.filter(student => {



        let studentId =

        student.studentCode ||

        student.id;



        return studentId !== code;



    });







    localStorage.setItem(

        "students",

        JSON.stringify(students)

    );





    alert(

        "Student Deleted Successfully"

    );





    displayStudents();



}







// ===============================
// Search Student
// ===============================


function searchStudent(){



    let value =

    document.getElementById(

        "searchInput"

    ).value.toLowerCase();





    let rows = document.querySelectorAll(

        "#studentTableBody tr"

    );





    rows.forEach(row => {



        let text =

        row.innerText.toLowerCase();





        if(text.includes(value)){



            row.style.display = "";



        }

        else{



            row.style.display = "none";



        }



    });



}







// ===============================
// Clear Old Demo Data
// ===============================


// প্রথমবার নতুন system চালুর সময়
// demo data আর load হবে না


function cleanOldDemoData(){



    let students = getStudents();





    let cleanData = students.filter(student => {



        return (

            student.studentCode ||

            student.name

        );



    });





    localStorage.setItem(

        "students",

        JSON.stringify(cleanData)

    );



}






// ===============================
// Page Load
// ===============================


cleanOldDemoData();


displayStudents();


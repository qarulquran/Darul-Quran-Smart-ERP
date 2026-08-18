
// Final Student Management System


// Load Students

function getStudents(){

    return JSON.parse(
        localStorage.getItem("students")
    ) || [];

}



// Display Student List

function displayStudents(){

    let students = getStudents();

    let tbody = document.querySelector("#studentTableBody");


    if(!tbody) return;


    tbody.innerHTML = "";


    students.forEach(student => {


        let row = `

        <tr>

        <td>${student.id}</td>

        <td>${student.name}</td>

        <td>${student.className}</td>

        <td>${student.father}</td>

        <td>${student.mobile}</td>

        <td>${student.feeStatus}</td>


        <td>

        <a href="student-profile.html">
        <button>👁 View</button>
        </a>


        <a href="edit-student.html">
        <button>✏ Edit</button>
        </a>


        <button onclick="deleteStudent('${student.id}')">
        🗑 Delete
        </button>


        </td>


        </tr>

        `;


        tbody.innerHTML += row;


    });


}




// Search Student

function searchStudent(){


    let value =
    document.getElementById("searchInput")
    .value
    .toLowerCase();


    let rows =
    document.querySelectorAll(
        "#studentTableBody tr"
    );


    rows.forEach(row=>{


        if(
            row.innerText
            .toLowerCase()
            .includes(value)
        ){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }


    });


}




// Delete Student

function deleteStudent(id){


    let confirmDelete =
    confirm(
        "Delete this student?"
    );


    if(confirmDelete){


        let students = getStudents();


        students =
        students.filter(
            student => student.id !== id
        );


        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );


        displayStudents();


        alert(
            "Student Deleted"
        );

    }


}




// Start

displayStudents();

// Final Student Management System


// Get Student Data

function getStudents(){

    return JSON.parse(
        localStorage.getItem("students")
    ) || [];

}



// Display Student List

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

        <td>${student.id}</td>

        <td>${student.name}</td>

        <td>${student.className}</td>

        <td>${student.father}</td>

        <td>${student.mobile}</td>

        <td>${student.feeStatus}</td>


        <td>


        <a href="student-profile.html">

        <button>
        👁 View
        </button>

        </a>



        <a href="edit-student.html">

        <button>
        ✏ Edit
        </button>

        </a>



        <button onclick="deleteStudent('${student.id}')">

        🗑 Delete

        </button>



        </td>

        `;


        tableBody.appendChild(row);


    });


}




// Search Student

function searchStudent(){


    let searchValue =
    document.getElementById(
        "searchInput"
    ).value.toLowerCase();



    let rows =
    document.querySelectorAll(
        "#studentTableBody tr"
    );



    rows.forEach(row=>{


        let data =
        row.innerText.toLowerCase();



        if(data.includes(searchValue)){

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
        "Are you sure you want to delete this student?"
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
            "Student deleted successfully"
        );


    }


}





// Load Table

displayStudents();

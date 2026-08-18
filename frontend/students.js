// Student Search Function

function searchStudent(){

    let input = document.querySelector(".search-box input");
    let filter = input.value.toLowerCase();

    let rows = document.querySelectorAll("table tbody tr");


    rows.forEach(row => {

        let text = row.innerText.toLowerCase();

        if(text.includes(filter)){
            row.style.display = "";
        }
        else{
            row.style.display = "none";
        }

    });

}



// Delete Student Function

function deleteStudent(){

    let confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );


    if(confirmDelete){

        alert("Student deleted successfully");

    }

}



// Edit Student Function

function editStudent(){

    alert("Edit student feature coming soon");

}// Display Students in Table

function displayStudents(){

    let table = document.querySelector("table");


    students.forEach(student=>{

        let row = table.insertRow();


        row.innerHTML = `

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


        </td>

        `;


    });

}



displayStudents();

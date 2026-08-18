// Add Student Function

function addStudent(){


    let student = {

        id: Date.now(),

        name: document.querySelector("#studentName").value,

        father: document.querySelector("#fatherName").value,

        mother: document.querySelector("#motherName").value,

        className: document.querySelector("#className").value,

        mobile: document.querySelector("#mobile").value,

        address: document.querySelector("#address").value,

        feeStatus: "Due",

        attendance: "0%",

        result: "Not Available"

    };



    let students = JSON.parse(
        localStorage.getItem("students")
    ) || [];



    students.push(student);



    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );



    alert("Student Added Successfully");


    window.location.href="students.html";


}

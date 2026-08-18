
// Final Add Student System


function addStudent(){


    let student = {


        id:
        "STD-" + Date.now(),


        name:
        document.getElementById("studentName").value,


        father:
        document.getElementById("fatherName").value,


        mother:
        document.getElementById("motherName").value,


        dob:
        document.getElementById("dob").value,


        className:
        document.getElementById("className").value,


        mobile:
        document.getElementById("mobile").value,


        admissionDate:
        document.getElementById("admissionDate").value,


        address:
        document.getElementById("address").value,


        feeStatus:
        "Due",


        attendance:
        "0%",


        result:
        "Not Available"

    };





    if(
        student.name === "" ||
        student.father === "" ||
        student.className === ""
    ){

        alert(
        "Please fill required fields"
        );

        return;

    }






    let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];






    students.push(student);






    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );







    alert(
    "Student Added Successfully"
    );






    window.location.href =
    "students.html";



}

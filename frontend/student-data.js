// ==========================================
// Darul Quran Smart ERP
// Student Data Management System
// student-data.js
// ==========================================



// ===============================
// Student Database
// ===============================


// এখানে আর কোনো Demo Student থাকবে না

let students = [];




// ===============================
// Get Students
// ===============================


function getStudents(){


    return JSON.parse(

        localStorage.getItem("students")

    ) || [];


}






// ===============================
// Save Students
// ===============================


function saveStudents(data){



    localStorage.setItem(

        "students",

        JSON.stringify(data)

    );


}






// ===============================
// Load Students
// ===============================


function loadStudents(){


    let data =

    localStorage.getItem("students");



    if(data){


        students = JSON.parse(data);


    }

    else{


        students = [];


        saveStudents(students);


    }


}






// ===============================
// Add New Student
// ===============================


function addStudent(student){



    let students = getStudents();



    students.push(student);



    saveStudents(students);



}






// ===============================
// Find Student By Code
// ===============================


function findStudent(code){



    let students = getStudents();



    return students.find(student => {



        return (

            student.studentCode === code ||

            student.id === code

        );


    });



}






// ===============================
// Delete Student
// ===============================


function removeStudent(code){



    let students = getStudents();



    students = students.filter(student => {



        return (

            student.studentCode !== code &&

            student.id !== code

        );


    });



    saveStudents(students);



}






// ===============================
// Update Student
// ===============================


function updateStudent(updatedStudent){



    let students = getStudents();



    students = students.map(student => {



        if(

            student.studentCode === updatedStudent.studentCode

        ){


            return updatedStudent;


        }


        return student;



    });




    saveStudents(students);



}






// ===============================
// Initialize
// ===============================


loadStudents();

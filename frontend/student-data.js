// Student Data Management

let students = [

{
    id: "001",
    name: "Ahmed Rahman",
    father: "Md. Rahman",
    mother: "Fatema Begum",
    className: "Class 5",
    mobile: "017XXXXXXXX",
    address: "Dhaka, Bangladesh",
    feeStatus: "Paid",
    attendance: "95%",
    result: "A+"
},


{
    id: "002",
    name: "Abdullah",
    father: "Karim Ali",
    mother: "Ayesha Begum",
    className: "Class 6",
    mobile: "018XXXXXXXX",
    address: "Chittagong, Bangladesh",
    feeStatus: "Due",
    attendance: "90%",
    result: "A"
}

];



// Save Student Data

function saveStudents(){

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}



// Load Student Data

function loadStudents(){

    let data = localStorage.getItem("students");


    if(data){

        students = JSON.parse(data);

    }

}


// Initialize

saveStudents();
loadStudents();

// ==========================================
// Darul Quran ERP
// Add Student System
// Student Master Database
// ==========================================


// ===============================
// Location Database
// ===============================

let locationData = {};


fetch("data/bangladesh-location.json")

.then(response => response.json())

.then(data => {

    locationData = data;

    loadDivision();

})

.catch(error=>{

    console.log(
        "Location Error:",
        error
    );

});




// ===============================
// Address Dropdown
// ===============================


const division =
document.getElementById("divisionSearch");


const district =
document.getElementById("districtSearch");


const thana =
document.getElementById("thanaSearch");


const union =
document.getElementById("unionSearch");


const ward =
document.getElementById("wardSearch");





function loadDivision(){

    if(!division) return;


    division.innerHTML="";


    Object.keys(locationData)

    .forEach(item=>{


        division.innerHTML +=
        `
        <option>
        ${item}
        </option>
        `;


    });


}





// ===============================
// Student Code Generator
// ===============================


function generateStudentCode(){


    let students = JSON.parse(

        localStorage.getItem("students")

    ) || [];



    let number =
    students.length + 1;



    let code =
    String(number)
    .padStart(4,"0");



    let year =
    new Date()
    .getFullYear();



    return `DQ-${year}-${code}`;


}





// ===============================
// Save Student
// ===============================


const saveButton =
document.querySelector(
".submit-area button"
);



if(saveButton){


saveButton.addEventListener(
"click",

function(){



let students = JSON.parse(

localStorage.getItem("students")

) || [];





let studentCode =
generateStudentCode();





let student = {


studentCode:studentCode,


name:
document.getElementById(
"studentName"
)?.value || "",



dateOfBirth:
document.getElementById(
"dateOfBirth"
)?.value || "",



birthRegistration:
document.getElementById(
"birthRegistration"
)?.value || "",



bloodGroup:
document.getElementById(
"bloodGroup"
)?.value || "",



nationality:
document.getElementById(
"nationality"
)?.value || "Bangladeshi",





fatherName:
document.getElementById(
"fatherName"
)?.value || "",



fatherNid:
document.getElementById(
"fatherNid"
)?.value || "",




motherName:
document.getElementById(
"motherName"
)?.value || "",



motherNid:
document.getElementById(
"motherNid"
)?.value || "",




guardianMobile:
document.getElementById(
"guardianMobile"
)?.value || "",






previousInstitution:
document.getElementById(
"previousInstitution"
)?.value || "",



previousClass:
document.getElementById(
"previousClass"
)?.value || "",





admissionClass:
document.getElementById(
"admissionClass"
)?.value || "",



admissionDate:
document.getElementById(
"admissionDate"
)?.value || "",





address:{


division:
division?.value || "",


district:
district?.value || "",


thana:
thana?.value || "",


union:
union?.value || "",


ward:
ward?.value || "",


},




feeStatus:"Due",


attendance:"0%",


result:"",


createdAt:
new Date()
.toISOString()


};






students.push(student);





localStorage.setItem(

"students",

JSON.stringify(students)

);







alert(

"Student Added Successfully\n\nStudent Code:\n"

+ studentCode

);




window.location.href =
"students.html";




});


}

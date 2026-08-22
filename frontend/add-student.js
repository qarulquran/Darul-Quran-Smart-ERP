// ==========================================
// Darul Quran ERP
// Add Student Final System
// Student Master Database
// ==========================================



// ===============================
// Load Bangladesh Location Data
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
        "Location Loading Error:",
        error
    );

});





// ===============================
// Address Elements
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





// ===============================
// Load Division
// ===============================


function loadDivision(){


    if(!division) return;



    division.innerHTML =
    `
    <option>
    Select Division
    </option>
    `;



    Object.keys(locationData)

    .forEach(item=>{


        division.innerHTML +=

        `
        <option value="${item}">
        ${item}
        </option>
        `;


    });


}






// ===============================
// Division Change
// ===============================


if(division){


division.addEventListener(
"change",

()=>{


district.innerHTML =
"<option>Select District</option>";

thana.innerHTML =
"<option>Select Thana</option>";

union.innerHTML =
"<option>Select Union</option>";

ward.innerHTML =
"<option>Select Ward</option>";



let data =
locationData[division.value];



Object.keys(data)

.forEach(item=>{


district.innerHTML +=

`
<option value="${item}">
${item}
</option>
`;


});


});


}







// ===============================
// District Change
// ===============================


if(district){


district.addEventListener(
"change",

()=>{


thana.innerHTML =
"<option>Select Thana</option>";

union.innerHTML =
"<option>Select Union</option>";

ward.innerHTML =
"<option>Select Ward</option>";



let data =

locationData

[division.value]

[district.value];



Object.keys(data)

.forEach(item=>{


thana.innerHTML +=

`
<option value="${item}">
${item}
</option>
`;


});


});


}







// ===============================
// Thana Change
// ===============================


if(thana){


thana.addEventListener(
"change",

()=>{


union.innerHTML =
"<option>Select Union</option>";

ward.innerHTML =
"<option>Select Ward</option>";



let data =

locationData

[division.value]

[district.value]

[thana.value];



Object.keys(data)

.forEach(item=>{


union.innerHTML +=

`
<option value="${item}">
${item}
</option>
`;


});


});


}







// ===============================
// Union Change
// ===============================


if(union){


union.addEventListener(
"change",

()=>{


ward.innerHTML =
"<option>Select Ward</option>";



let data =

locationData

[division.value]

[district.value]

[thana.value]

[union.value];



data.forEach(item=>{


ward.innerHTML +=

`
<option>
${item}
</option>
`;


});


});


}








// ===============================
// Generate Student Code
// ===============================


function generateStudentCode(){


let students =

JSON.parse(

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

()=>{





let students =

JSON.parse(

localStorage.getItem("students")

) || [];





let studentCode =

generateStudentCode();







let student = {



studentCode:

studentCode,



name:

document.getElementById(
"studentName"
).value,



dateOfBirth:

document.getElementById(
"dateOfBirth"
).value,



birthRegistration:

document.getElementById(
"birthRegistration"
).value,



bloodGroup:

document.getElementById(
"bloodGroup"
).value,



nationality:

document.getElementById(
"nationality"
).value,





fatherName:

document.getElementById(
"fatherName"
).value,



fatherNid:

document.getElementById(
"fatherNid"
).value,



motherName:

document.getElementById(
"motherName"
).value,



motherNid:

document.getElementById(
"motherNid"
).value,



guardianMobile:

document.getElementById(
"guardianMobile"
).value,





previousInstitution:

document.getElementById(
"previousInstitution"
).value,



previousClass:

document.getElementById(
"previousClass"
).value,





admissionClass:

document.getElementById(
"admissionClass"
).value,



admissionDate:

document.getElementById(
"admissionDate"
).value,






address:{


division:

division.value,


district:

district.value,


thana:

thana.value,


union:

union.value,


ward:

ward.value,


village:

document.getElementById(
"village"
).value,



details:

document.getElementById(
"presentAddress"
).value


},





permanentAddress:

document.getElementById(
"permanentAddress"
).value,





photo:"",



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

+
studentCode

);






window.location.href =

"students.html";





}


);


}

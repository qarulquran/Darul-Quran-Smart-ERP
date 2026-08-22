// ==========================================
// Darul Quran Smart ERP
// Add Student System
// Student Code:
// DQ-Class-Year-Serial
// Example:
// DQ-1-2026-00001
// ==========================================



// ==========================================
// Bangladesh Location Load
// ==========================================


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





// ==========================================
// Address Elements
// ==========================================


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






// ==========================================
// Load Division
// ==========================================


function loadDivision(){


    if(!division) return;



    division.innerHTML =
    `
    <option value="">
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







// ==========================================
// Division Change
// ==========================================


if(division){


division.addEventListener(
"change",

function(){


    district.innerHTML =
    `
    <option value="">
    Select District
    </option>
    `;


    thana.innerHTML =
    `
    <option value="">
    Select Thana
    </option>
    `;


    union.innerHTML =
    `
    <option value="">
    Select Union
    </option>
    `;


    ward.innerHTML =
    `
    <option value="">
    Select Ward
    </option>
    `;



    let data =
    locationData[
        division.value
    ];



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







// ==========================================
// District Change
// ==========================================


if(district){


district.addEventListener(
"change",

function(){



    thana.innerHTML =
    `
    <option value="">
    Select Thana
    </option>
    `;


    union.innerHTML =
    `
    <option value="">
    Select Union
    </option>
    `;


    ward.innerHTML =
    `
    <option value="">
    Select Ward
    </option>
    `;



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







// ==========================================
// Thana Change
// ==========================================


if(thana){


thana.addEventListener(
"change",

function(){


    union.innerHTML =
    `
    <option value="">
    Select Union
    </option>
    `;



    ward.innerHTML =
    `
    <option value="">
    Select Ward
    </option>
    `;




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






// ==========================================
// Union Change
// ==========================================


if(union){


union.addEventListener(
"change",

function(){



    ward.innerHTML =
    `
    <option value="">
    Select Ward
    </option>
    `;




    let data =

    locationData

    [division.value]

    [district.value]

    [thana.value]

    [union.value];



    data.forEach(item=>{


        ward.innerHTML +=


        `
        <option value="${item}">
        ${item}
        </option>
        `;


    });



});


}






// ==========================================
// Generate Student Code
// Format:
// DQ-Class-Year-Serial
// ==========================================


function generateStudentCode(className){



    let students =

    JSON.parse(

        localStorage.getItem(
            "students"
        )

    ) || [];




    let classNumber = "0";




    let match =

    className.match(/\d+/);




    if(match){


        classNumber = match[0];


    }

    else if(className === "Play"){


        classNumber = "0";


    }

    else if(className === "Nursery"){


        classNumber = "N";


    }






    let year =

    new Date()

    .getFullYear();






    let sameClassStudents =

    students.filter(student =>



        student.studentCode &&



        student.studentCode.startsWith(

        `DQ-${classNumber}-${year}`

        )



    );





    let serial =

    sameClassStudents.length + 1;





    let serialNumber =

    String(serial)

    .padStart(5,"0");






    return (

    `DQ-${classNumber}-${year}-${serialNumber}`

    );



}


// ==========================================
// Save Student System
// ==========================================



const saveButton =

document.querySelector(
    ".submit-area button"
);





if(saveButton){



saveButton.addEventListener(

"click",

function(){



// ===============================
// Get Existing Students
// ===============================


let students =

JSON.parse(

localStorage.getItem(
"students"
)

) || [];





// ===============================
// Get Class
// ===============================


let className =

document.getElementById(
"admissionClass"
).value;




if(!className){


alert(
"Please Select Admission Class"
);


return;


}






// ===============================
// Generate Student Code
// ===============================


let studentCode =

generateStudentCode(
className
);






// ===============================
// Create Student Object
// ===============================


let student = {



studentCode:



studentCode,





name:



document.getElementById(
"studentName"
).value,





father:



document.getElementById(
"fatherName"
).value,





mother:



document.getElementById(
"motherName"
).value,





mobile:



document.getElementById(
"guardianMobile"
).value,





className:



className,





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





fatherNid:



document.getElementById(
"fatherNid"
).value,





motherNid:



document.getElementById(
"motherNid"
).value,





previousInstitution:



document.getElementById(
"previousInstitution"
).value,





previousClass:



document.getElementById(
"previousClass"
).value,





admissionDate:



document.getElementById(
"admissionDate"
).value,





address:{


division:

division ?
division.value :
"",



district:

district ?
district.value :
"",



thana:

thana ?
thana.value :
"",



union:

union ?
union.value :
"",



ward:

ward ?
ward.value :
"",



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





feeStatus:

"Due",





attendance:

"0%",





result:

"",





createdAt:



new Date()

.toISOString()



};








// ===============================
// Save Database
// ===============================


students.push(
student
);





localStorage.setItem(

"students",

JSON.stringify(
students
)

);






// ===============================
// Success
// ===============================


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

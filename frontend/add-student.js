// ==========================================
// Darul Quran Smart ERP
// Add Student System
// Part 1
// ==========================================


// ===============================
// Bangladesh Location Load
// ===============================

let locationData = {};

fetch("data/bangladesh-location.json")

.then(response => response.json())

.then(data => {

    locationData = data;

    loadDivision();

})

.catch(error => {

    console.log(
        "Location Error:",
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
"<option>Select Division</option>";



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

function(){


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

function(){


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

function(){


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

function(){


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
<option value="${item}">
${item}
</option>
`;


});


});


}






// ===============================
// Generate Student Code
// ===============================


function generateStudentCode(className){


let students = JSON.parse(

localStorage.getItem("students")

) || [];



let classNumber = "";



let match =
className.match(/\d+/);



if(match){

classNumber = match[0];

}

else if(className==="Play"){

classNumber="0";

}

else if(className==="Nursery"){

classNumber="N";

}

else{

classNumber="0";

}




let year =

new Date()

.getFullYear();





let sameStudents =

students.filter(student=>


student.studentCode &&

student.studentCode.startsWith(

`DQ-${classNumber}-${year}`

)


);




let serial =

sameStudents.length + 1;



let serialNumber =

String(serial)

.padStart(5,"0");





return (

`DQ-${classNumber}-${year}-${serialNumber}`

);


}

// ==========================================
// Part 2
// Save Student System
// ==========================================




// ===============================
// Convert Image To Base64
// ===============================


function convertImageToBase64(file){


return new Promise((resolve)=>{


if(!file){

resolve("");

return;

}



let reader = new FileReader();



reader.onload = function(){


resolve(reader.result);


};



reader.readAsDataURL(file);



});


}







// ===============================
// Save Button
// ===============================


const saveButton =

document.querySelector(

".submit-area button"

);







if(saveButton){



saveButton.addEventListener(

"click",

async function(){





let students = JSON.parse(

localStorage.getItem("students")

) || [];







// Class


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






// Student Code


let studentCode =

generateStudentCode(

className

);








// Photo


let photoInput =

document.querySelector(

'input[type="file"]'

);



let photo = "";



if(photoInput && photoInput.files[0]){


photo = await convertImageToBase64(

photoInput.files[0]

);


}









// Student Object


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

className,






admissionDate:

document.getElementById(

"admissionDate"

).value,







address:{



division:

division ? division.value : "",



district:

district ? district.value : "",



thana:

thana ? thana.value : "",



union:

union ? union.value : "",



ward:

ward ? ward.value : "",



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






photo:

photo,






feeStatus:

"Due",





attendance:

"0%",





result:

"-",





createdAt:

new Date()

.toISOString()



};








// Save


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

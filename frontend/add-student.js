/* ===== ADD STUDENT JS FINAL PART 1/2 START ===== */


// ===============================
// Location Database Load
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
// Address Elements
// ===============================


const division =
document.getElementById("division");


const district =
document.getElementById("district");


const thana =
document.getElementById("thana");


const union =
document.getElementById("union");


const ward =
document.getElementById("ward");







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



/* ===== PART 1/2 END ===== *//* ===== ADD STUDENT JS FINAL PART 2/2 START ===== */



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
// Student Photo Preview
// ===============================


const photoInput =
document.querySelector(
'input[type="file"]'
);



if(photoInput){


photoInput.addEventListener(
"change",
function(){


const file =
this.files[0];


if(file){


const reader =
new FileReader();



reader.onload=function(e){


console.log(
"Photo preview ready"
);


}



reader.readAsDataURL(file);



}


});


}







// ===============================
// Same Address
// ===============================


const sameAddress =
document.getElementById(
"sameAddress"
);



if(sameAddress){


sameAddress.addEventListener(
"change",
function(){


if(this.checked){


alert(
"Present address copied to permanent address"
);



}



});


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



const studentID =

"STD-" +

Date.now()
.toString()
.slice(-6);



alert(

"Student Saved Successfully\n\nStudent ID: "

+ studentID

);



});


}





/* ===== ADD STUDENT JS FINAL COMPLETE ===== */

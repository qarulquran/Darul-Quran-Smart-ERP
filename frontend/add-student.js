/* ===== ADD STUDENT JS START ===== */


// Photo Preview

const photoInput = document.querySelector(
'input[type="file"]'
);


if(photoInput){

photoInput.addEventListener(
"change",
function(){

const file = this.files[0];

if(file){

const reader = new FileReader();


reader.onload=function(e){

console.log("Photo Selected");

}


reader.readAsDataURL(file);

}

}

);

}




// Bangladesh Location Data (Basic Structure)

const locationData = {


"Dhaka":{

"Dhamrai":[
"Union 1",
"Union 2",
"Union 3"
],

"Savar":[
"Union 1",
"Union 2",
"Union 3"
]


},



"Chattogram":{

"Sitakunda":[
"Union 1",
"Union 2"
],

"Mirsharai":[
"Union 1",
"Union 2"
]


},



"Barishal":{

"Barishal Sadar":[
"Union 1",
"Union 2"
]

}


};





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





// Division Change


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



Object.keys(locationData[this.value] || {})
.forEach(function(item){

district.innerHTML +=
`<option>${item}</option>`;

});


});


}







// District Change


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



thana.innerHTML +=
`<option>${this.value}</option>`;


});


}







// Thana Change


if(thana){


thana.addEventListener(
"change",
function(){


union.innerHTML =
"<option>Select Union</option>";

ward.innerHTML =
"<option>Select Ward</option>";



[
"Union 1",
"Union 2",
"Union 3"
]
.forEach(function(item){


union.innerHTML +=
`<option>${item}</option>`;


});


});


}







// Union Change


if(union){


union.addEventListener(
"change",
function(){


ward.innerHTML =
"<option>Select Ward</option>";


for(let i=1;i<=9;i++){


ward.innerHTML +=
`<option>Ward ${i}</option>`;


}


});


}







// Same Address Option


const sameAddress =
document.getElementById("sameAddress");



if(sameAddress){


sameAddress.addEventListener(
"change",
function(){


if(this.checked){


alert(
"Permanent address copied from present address"
);


}


});


}







// Save Button


const saveBtn =
document.querySelector(
".submit-area button"
);



if(saveBtn){


saveBtn.onclick=function(){


alert(
"Student information saved successfully"
);


}


}



/* ===== ADD STUDENT JS END ===== */

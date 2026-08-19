/* ===== ADD STUDENT FINAL JS PART 1/2 START ===== */


// ===============================
// Bangladesh Location Database
// ===============================

let bangladeshLocation = {};


// Load JSON Database

fetch("data/bangladesh-location.json")

.then(response => response.json())

.then(data => {

    bangladeshLocation = data;

    loadDivision();

})

.catch(error => {

    console.log(
        "Location database loading error:",
        error
    );

});





// ===============================
// Address Select Elements
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
    `<option>
    Select Division
    </option>`;


    Object.keys(bangladeshLocation)

    .forEach(function(item){


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
    bangladeshLocation[this.value];



    Object.keys(data)

    .forEach(function(item){


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

    bangladeshLocation

    [division.value]

    [this.value];



    Object.keys(data)

    .forEach(function(item){


        thana.innerHTML +=

        `
        <option value="${item}">
        ${item}
        </option>
        `;


    });



});


}


/* ===== PART 1/2 END ===== *//* ===== ADD STUDENT FINAL JS PART 2/2 START ===== */



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

    bangladeshLocation

    [division.value]

    [district.value]

    [this.value];



    Object.keys(data)

    .forEach(function(item){


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

    bangladeshLocation

    [division.value]

    [district.value]

    [thana.value]

    [this.value];



    data.forEach(function(item){


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
// Same Address Feature
// ===============================


const sameAddress =
document.getElementById("sameAddress");



if(sameAddress){


sameAddress.addEventListener(
"change",
function(){


if(this.checked){


console.log(
"Present address copied"
);


}


});


}







// ===============================
// Student Form Validation
// ===============================


const form =
document.querySelector("form");



if(form){


form.addEventListener(
"submit",
function(e){



const name =
document.querySelector(
'input[name="studentName"]'
);



if(name && name.value.trim()==""){


e.preventDefault();


alert(
"Please enter student name"
);


return;


}



});


}






/* ===== ADD STUDENT FINAL JS COMPLETE END ===== */

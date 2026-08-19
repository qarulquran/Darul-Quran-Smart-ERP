/* ===== ADD STUDENT JS FINAL VERSION PART 1/2 START ===== */


// ===============================
// Student Photo Preview
// ===============================

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

                reader.onload = function(e){

                    console.log(
                        "Student photo selected"
                    );

                }

                reader.readAsDataURL(file);

            }

        }
    );

}





// ===============================
// Smart Bangladesh Address System
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







// Load Division List

if(division){


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







// Division Select


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







// District Select


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





// ===== PART 1 END =====/* ===== ADD STUDENT JS FINAL VERSION PART 2/2 START ===== */



// ===============================
// Thana Select
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
// Union Select
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
        <option>
        ${item}
        </option>
        `;


    });



});


}







// ===============================
// Same Address Copy
// ===============================


const sameAddress =
document.getElementById("sameAddress");



if(sameAddress){


sameAddress.addEventListener(
"change",
function(){


    if(this.checked){

        alert(
        "Present Address copied"
        );

    }


});


}








// ===============================
// Form Validation
// ===============================


const saveButton =
document.querySelector(
".submit-area button"
);



if(saveButton){


saveButton.addEventListener(
"click",
function(){



let name =
document.querySelector(
'input[placeholder="Enter student name"]'
);



if(name && name.value.trim()==""){


alert(
"Please enter student name"
);


return;


}



alert(
"Student information saved successfully"
);



});


}






/* ===== ADD STUDENT JS FINAL VERSION END ===== */

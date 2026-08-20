alert("Custom Dropdown JS Loaded");


let bangladeshLocation = {};


// ===============================
// Load Bangladesh Location JSON
// ===============================

Promise.all([

    fetch("data/bangladesh-location-part1.json")
        .then(response => response.json()),

    fetch("data/bangladesh-location-part2.json")
        .then(response => response.json())

])

.then(([part1, part2]) => {


    bangladeshLocation = {

        ...part1,
        ...part2

    };


    console.log(
        "Location Loaded Successfully",
        bangladeshLocation
    );


    loadDivision();


})

.catch(error => {


    console.log(
        "Location Loading Error:",
        error
    );


});




// ===============================
// Create Search Dropdown
// ===============================

function createDropdown(
    inputId,
    listId,
    items,
    callback
){


    const input =
    document.getElementById(inputId);


    const list =
    document.getElementById(listId);



    if(!input || !list){

        console.log(
            "Element Missing:",
            inputId,
            listId
        );

        return;

    }



    function showList(search=""){


        list.innerHTML="";



        let filtered =
        items.filter(item =>

            item
            .toLowerCase()
            .includes(
                search.toLowerCase()
            )

        );



        filtered.forEach(item => {


            let option =
            document.createElement("div");


            option.className =
            "dropdown-item";


            option.innerText =
            item;



            option.onclick=function(){


                input.value=item;


                list.innerHTML="";



                if(callback){

                    callback(item);

                }


            };



            list.appendChild(option);


        });


    }





    input.addEventListener(
        "focus",
        function(){

            showList();

        }
    );



    input.addEventListener(
        "input",
        function(){

            showList(this.value);

        }
    );



}




// ===============================
// Load Division
// ===============================

function loadDivision(){


    let divisions =
    Object.keys(
        bangladeshLocation
    );



    createDropdown(

        "divisionSearch",

        "divisionList",

        divisions,


        function(division){


            loadDistrict(
                division
            );


        }

    );


}




// ===============================
// Load District
// ===============================

function loadDistrict(
    division
){


    let districts =
    Object.keys(

        bangladeshLocation[division]

    );



    createDropdown(

        "districtSearch",

        "districtList",

        districts,


        function(district){


            loadThana(

                division,

                district

            );


        }

    );


}// ===============================
// Load Thana / Upazila
// ===============================

function loadThana(
    division,
    district
){

    let thanas =
    Object.keys(

        bangladeshLocation[division][district]

    );


    createDropdown(

        "thanaSearch",

        "thanaList",

        thanas,


        function(thana){


            loadUnion(

                division,

                district,

                thana

            );


        }

    );

}





// ===============================
// Load Union
// ===============================

function loadUnion(

    division,

    district,

    thana

){


    let unions =
    Object.keys(

        bangladeshLocation
        [division]
        [district]
        [thana]

    );



    createDropdown(

        "unionSearch",

        "unionList",

        unions,


        function(union){


            loadWard(

                division,

                district,

                thana,

                union

            );


        }

    );


}






// ===============================
// Load Ward
// ===============================

function loadWard(

    division,

    district,

    thana,

    union

){


    let wards =

    bangladeshLocation
    [division]
    [district]
    [thana]
    [union];



    createDropdown(

        "wardSearch",

        "wardList",

        wards,

        null

    );


}

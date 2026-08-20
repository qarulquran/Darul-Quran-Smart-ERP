let bangladeshLocation = {};


// Load JSON

fetch("bangladesh-location.json")

.then(response => response.json())

.then(data => {

    bangladeshLocation = data;

    console.log("Location Loaded", bangladeshLocation);

    loadDivision();

})

.catch(error => {

    console.log("JSON Loading Error:", error);

});




// Create Dropdown

function createDropdown(inputId, listId, items, callback){


    const input = document.getElementById(inputId);

    const list = document.getElementById(listId);


    if(!input || !list){
        return;
    }



    function showList(search=""){


        list.innerHTML="";


        let filtered = items.filter(item =>

            item.toLowerCase()
            .includes(search.toLowerCase())

        );



        filtered.forEach(item => {


            let option = document.createElement("div");

            option.className="dropdown-item";

            option.innerText=item;



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




    input.addEventListener("focus",function(){

        showList();

    });



    input.addEventListener("input",function(){

        showList(this.value);

    });


}





// Division

function loadDivision(){


    let divisions = Object.keys(
        bangladeshLocation
    );


    createDropdown(

        "divisionSearch",

        "divisionList",

        divisions,


        function(division){

            loadDistrict(division);

        }

    );

}







// District

function loadDistrict(division){


    let districts = Object.keys(

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


}







// Thana

function loadThana(division,district){


    let thanas = Object.keys(

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






// Union

function loadUnion(
division,
district,
thana
){


    let unions = Object.keys(

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







// Ward

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



let bangladeshLocation = {};


// Load JSON Database

fetch("bangladesh-location.json")

.then(function(response){

    return response.json();

})


.then(function(data){

    bangladeshLocation = data;

console.log("Location Loaded", bangladeshLocation);

})


.catch(function(error){

    console.log(
        "Location data loading error:",
        error
    );

});





// Common Dropdown Function


function setupDropdown(
inputId,
listId,
items,
callback
){


let input =
document.getElementById(inputId);


let list =
document.getElementById(listId);



if(!input || !list){
    return;
}




function showList(searchText=""){


list.innerHTML="";


let filtered =
items.filter(function(item){

return item
.toLowerCase()
.includes(
searchText.toLowerCase()
);

});



filtered.forEach(function(item){


let option =
document.createElement("div");


option.className =
"dropdown-item";


option.innerText =
item;



option.onclick=function(){


input.value=item;


list.classList.remove(
"active"
);



if(callback){

callback(item);

}


};


list.appendChild(option);



});



if(filtered.length > 0){

list.classList.add(
"active"
);

}



}




input.addEventListener(
"focus",
function(){

showList();

});


input.addEventListener(
"input",
function(){

showList(
this.value
);

});





document.addEventListener(
"click",
function(e){


if(
e.target !== input &&
!list.contains(e.target)
){

list.classList.remove(
"active"
);

}


});


}



// Load Division


function loadDivision(){


let divisions =
Object.keys(
bangladeshLocation
);



setupDropdown(

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







// Load District


function loadDistrict(
division
){


let districts =

Object.keys(

bangladeshLocation[division]

);



setupDropdown(

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







// Load Thana


function loadThana(
division,
district
){


let thanas =

Object.keys(

bangladeshLocation

[division]

[district]

);



setupDropdown(

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







// Load Union


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



setupDropdown(

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








// Load Ward


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




setupDropdown(

"wardSearch",

"wardList",

wards,

null

);



}document.addEventListener("DOMContentLoaded", function(){

    if(Object.keys(bangladeshLocation).length > 0){

        loadDivision();

    }

});





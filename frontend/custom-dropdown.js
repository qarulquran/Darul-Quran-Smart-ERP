
// Custom Dropdown Creator


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



if(!input || !list) return;



input.addEventListener(
"focus",
function(){

showItems(items);

});





input.addEventListener(
"input",
function(){


let search =
this.value.toLowerCase();



let filtered =

items.filter(function(item){


return item
.toLowerCase()
.includes(search);


});



showItems(filtered);



});







function showItems(data){


list.innerHTML="";



if(data.length===0){


list.innerHTML =

`
<div class="dropdown-empty">
No result found
</div>
`;


}

else{


data.forEach(function(item){



let div =
document.createElement("div");



div.className =
"dropdown-item";



div.innerText =
item;



div.onclick=function(){


input.value=item;


list.classList.remove(
"active"
);



if(callback){

callback(item);

}


};



list.appendChild(div);



});



}



list.classList.add(
"active"
);



}




document.addEventListener(
"click",
function(e){


if(
!input.contains(e.target)
&&
!list.contains(e.target)
){


list.classList.remove(
"active"
);



// Bangladesh Location Connection


let locationDatabase = {};



fetch("data/bangladesh-location.json")

.then(response => response.json())

.then(data => {


locationDatabase = data;


initializeAddress();


});






function initializeAddress(){



let divisions =
Object.keys(locationDatabase);



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







function loadDistrict(division){


let districts =

Object.keys(
locationDatabase[division]
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







function loadThana(
division,
district
){


let thanas =

Object.keys(

locationDatabase

[division]

[district]

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







function loadUnion(
division,
district,
thana
){



let unions =

Object.keys(

locationDatabase

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







function loadWard(
division,
district,
thana,
union
){



let wards =

locationDatabase

[division]

[district]

[thana]

[union];



createDropdown(

"wardSearch",

"wardList",

wards

);



}






});



}



// =====================================
// Common Layout Loader
// =====================================



function loadComponent(

id,

file

){



fetch(file)

.then(response=>response.text())

.then(data=>{


document.getElementById(id)

.innerHTML=data;



});

}




window.onload=function(){


loadComponent(

"header",

"../components/header.html"

);



loadComponent(

"sidebar",

"../components/sidebar.html"

);



loadComponent(

"footer",

"../components/footer.html"

);



};

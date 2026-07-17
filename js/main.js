document.addEventListener(
"DOMContentLoaded",
()=>{


// ==========================
// LOADING
// ==========================


setTimeout(()=>{

document
.getElementById("loading-screen")
.style.display="none";


},1500);





// ==========================
// INTRO
// ==========================


setTimeout(()=>{

document
.getElementById("intro")
.style.display="none";


},3500);








// ==========================
// RENDER PRODUCT
// ==========================


const productBox =
document.getElementById("products");


let currentProducts = products;



function renderProducts(list){


productBox.innerHTML="";


list.forEach(product=>{


let card=document.createElement("div");


card.className="product-card";



card.innerHTML=`

<img src="${product.image}">


<h3>
${product.name}
</h3>


<p>
${product.description}
</p>


<button>
Xem chi tiết
</button>

`;



card
.querySelector("button")
.onclick=()=>openModal(product);



productBox.appendChild(card);



});


}



renderProducts(products);









// ==========================
// SEARCH
// ==========================


document
.getElementById("search")
.addEventListener(
"input",
(e)=>{


let value=
e.target.value.toLowerCase();



let result =
products.filter(
p=>
p.name
.toLowerCase()
.includes(value)
);



renderProducts(result);



});










// ==========================
// CATEGORY
// ==========================


const menu=
document.getElementById(
"category-menu"
);



document
.getElementById(
"category-btn"
)
.onclick=()=>{

menu.classList.toggle(
"active"
);

};





document
.querySelectorAll(
"#category-menu div"
)
.forEach(btn=>{


btn.onclick=()=>{


let cat=
btn.dataset.category;



if(cat==="all")
{

renderProducts(products);

}

else{


renderProducts(

products.filter(
p=>p.category===cat
)

);


}



menu.classList.remove(
"active"
);


}



});











// ==========================
// MODAL
// ==========================


const modal =
document.getElementById(
"product-modal"
);



function openModal(product){


modal.style.display="flex";


document
.getElementById(
"modal-title"
)
.innerText=
product.name;



document
.getElementById(
"modal-image"
)
.src=
product.image;



document
.getElementById(
"modal-description"
)
.innerText=
product.description;



document
.getElementById(
"modal-author"
)
.innerText=
product.author;



document
.getElementById(
"demo-btn"
)
.href=
product.demo;



document
.getElementById(
"download-btn"
)
.href=
product.download;



}




document
.getElementById(
"close-modal"
)
.onclick=()=>{

modal.style.display="none";

};









// ==========================
// DONATE
// ==========================


const donateModal=
document.getElementById(
"donate-modal"
);



document
.getElementById(
"donate"
)
.onclick=()=>{

donateModal.style.display="flex";

};



document
.getElementById(
"close-donate"
)
.onclick=()=>{

donateModal.style.display="none";

};









// ==========================
// HOT PRODUCT
// ==========================


const hotBox =
document.getElementById(
"hot-products"
);



products
.filter(p=>p.hot)
.forEach(p=>{


let div=
document.createElement("div");


div.className=
"product-card";



div.innerHTML=`

<img src="${p.image}">

<h3>
${p.name}
</h3>

`;



hotBox.appendChild(div);



});









// ==========================
// CONTACT
// ==========================


document
.getElementById(
"avatar"
)
.onclick=()=>{


document
.getElementById(
"contact-links"
)
.classList.toggle(
"active"
);



};









// ==========================
// STAR BACKGROUND
// ==========================


const canvas=
document.getElementById(
"stars"
);


const ctx=
canvas.getContext("2d");



canvas.width=
innerWidth;


canvas.height=
innerHeight;




let stars=[];



for(let i=0;i<150;i++){


stars.push({

x:
Math.random()*canvas.width,

y:
Math.random()*canvas.height,

r:
Math.random()*2,

speed:
Math.random()*0.5

});


}





function draw(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



ctx.fillStyle="white";



stars.forEach(s=>{


ctx.beginPath();


ctx.arc(
s.x,
s.y,
s.r,
0,
Math.PI*2
);


ctx.fill();



s.y+=s.speed;



if(s.y>canvas.height)
s.y=0;



});



requestAnimationFrame(draw);


}



draw();




});
// ==========================
// MUSIC
// ==========================


const music =
document.getElementById("music");


const musicBtn =
document.getElementById("music-btn");



let playing=false;



musicBtn.onclick=()=>{


if(!playing){


music.play();


musicBtn.innerHTML="🔊";


}

else{


music.pause();


musicBtn.innerHTML="🎵";


}



playing=!playing;



};






// ==========================
// HEART EFFECT
// ==========================


function createHeart(){


let heart=
document.createElement("div");



heart.className="heart";


heart.innerHTML="❤️";



heart.style.left=
Math.random()*100+"vw";



heart.style.fontSize=
(
Math.random()*20+15
)+"px";



document
.getElementById("hearts")
.appendChild(heart);





setTimeout(()=>{


heart.remove();


},6000);



}



setInterval(
createHeart,
800
);








// ==========================
// HOT CAROUSEL AUTO
// ==========================


let position=0;



const carousel=
document.getElementById(
"hot-products"
);



setInterval(()=>{


position-=220;



if(
Math.abs(position)
>
carousel.scrollWidth
)

position=0;



carousel.style.transform=
`
translateX(${position}px)
`;



},2500);








// ==========================
// LOGIN UI
// ==========================



// sau này thay bằng Firebase


function login(){


let email=
document.getElementById(
"email"
).value;



let pass=
document.getElementById(
"password"
).value;



if(email && pass){


alert(
"Đăng nhập thành công"
);


}


}



document
.getElementById(
"login-btn"
)
.onclick=login;

const start = document.getElementById("start")
const v1 = document.getElementById("video1");
const v2 = document.getElementById("video2");
const v3 = document.getElementById("video3");

const entract1=document.getElementById("entract1")
const entract2=document.getElementById("entract2")
const end = document.getElementById("end")

start.addEventListener("click",()=>{
    start.style.display = "none";
    v1.style.display = "block";
    v1.play();
})
v1.addEventListener("ended",()=>{
    v1.style.display = "none";
    entract1.style.display="block";
})
entract1.addEventListener("click",()=>{
    entract1.style.display = "none";
    v2.style.display = "block";
    v2.play();
})
v2.addEventListener("ended",()=>{
    v2.style.display = "none";
    entract2.style.display = "block";
})
entract2.addEventListener("click",()=>{
    entract2.style.display = "none";
    v3.style.display="block";
    v3.play();
})
v3.addEventListener("ended",()=>{
    v3.style.display="none";
    end.style.display="block";
})
// Remove the cache on videos on click.
const blocks = document.getElementsByClassName("block");
for(let b of blocks) {
    b.addEventListener("click",()=>{
        b.style.display = "none";
    })
}
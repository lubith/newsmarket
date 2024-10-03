window.showSlide = e=>{
    Je(e)
}

function Je(e) {
    const n = document.querySelectorAll(".slider-viewport li");
    for (let a = 0; a < n.length; a++)
        n[a].style.display = e === a ? "block" : "none";
        //console.info(e === 3 ? "true" : "false");
    const t = document.querySelectorAll(".slider-navigation li");
    for (let a = 0; a < t.length; a++)
        e === a ? t[a].classList.add("active") : t[a].classList.remove("active")
}

const bn = document.getElementById("sidebar-navigation")
  , Zt = document.getElementById("sidebar-navigation-dismiss")
  , Yt = document.getElementById("navigation-toggle") //
//  , ae = document.getElementById("account-menu");

Yt.addEventListener("click", ()=>{
    bn.style.display = "block"
});

Zt.addEventListener("click", ()=>{
    bn.style.display = "none"
}
);
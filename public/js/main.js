document.getElementById("lista").addEventListener("change", function(){
    const additional = document.getElementById("informacionAdicional");
    if (this.checked){
        additionalInfo.classList.remove("hidden");    
    } else {
        additionalInfo.classList.add("hidden");
    }
    })
;
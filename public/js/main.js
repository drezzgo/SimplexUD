document.getElementById('lista').addEventListener('change', function(){
    const informacionAdicional = document.getElementById('informacionAdicional');
    if (this.checked){
        informacionAdicional.classList.remove("hidden");    
    } else {
        informacionAdicional.classList.add("hidden");
    }
});
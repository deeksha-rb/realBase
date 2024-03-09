function addTuple() {
    var modal = document.getElementById("Modal");
    var btn = document.getElementById("opModal");
    var span = document.getElementsByClassName("close")[0];
  
    btn.onclick = function() {
      modal.style.display = "block";
    }

    span.onclick = function() {
      modal.style.display = "none";
    }
  
    window.onclick = function(event) 
    {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}

const addButton = document.querySelector(".add");
const input = document.querySelector(".addFields");

function addTupleFields() {
    
}


addButton.addEventListener("click", addTupleFields);

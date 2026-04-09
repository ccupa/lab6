let authorLinks = document.querySelectorAll(".authorNames");
        document.querySelector("#closeModal").addEventListener("click", ()=> {
            document.querySelector("#authorModal").close();
        });

        for (let i of authorLinks) {
            i.addEventListener("click", displayAuthorInfo);
    
        }

        async function displayAuthorInfo() {
            let authorId = this.getAttribute("authorId");
            //alert("stuff" + authorId);
            let url = "/api/author/" + authorId;
            let response = await fetch(url);
            let data = await response.json();
            document.querySelector("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
            document.querySelector("#authorPicture").src = data[0].portrait;
            document.querySelector("#authorBio").textContent = data[0].bio;
            //enable modal
        document.querySelector("#authorModal").showModal();
    }
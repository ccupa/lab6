console.log("quotes.js loaded");

let authorLinks = document.querySelectorAll(".authorNames");

authorLinks.forEach(link => {
    link.addEventListener("click", async function(event) {
        event.preventDefault();

        let authorId = this.dataset.authorId;
        console.log("clicked authorId:", authorId);

        try {
            let response = await fetch(`/api/author/${authorId}`);
            let data = await response.json();
            console.log(data);

            if (!data || data.length == 0) {
                return;
            }

            let author = data[0];

            document.getElementById("authorName").textContent =
                author.firstName + " " + author.lastName;

            document.getElementById("authorPicture").src = author.portrait || "";
            
            let authorDetails = document.getElementById("authorDetails");
            authorDetails.innerHTML = "";

            for (let key in author) {
                if (
                    key != "authorId" &&
                    key != "firstName" &&
                    key != "lastName" &&
                    key != "portrait" &&
                    author[key] != null &&
                    author[key] != ""
                ) {
                    authorDetails.innerHTML += `<p><strong>${key}:</strong> ${author[key]}</p>`;
                }
            }

            document.getElementById("authorModal").style.display = "block";
        } catch (error) {
            console.log("Error loading author info:", error);
        }
    });
});

document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("authorModal").style.display = "none";
});
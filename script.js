if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(reg => console.log("Service Worker: Registered"))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}
function toggleMenu() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.classList.toggle("show");
}

// Optional: Close the menu when clicking outside of it
window.onclick = function(event) {
    if (!event.target.matches('.menu-toggle')) {
        const dropdowns = document.getElementsByClassName("nav-links");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let db;

    // Open (or create) the IndexedDB database
    const request = indexedDB.open("contactDB", 1);

    request.onerror = (event) => {
        console.error("Database error:", event.target.errorCode);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        displayComments();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("email", "email", { unique: false });
        objectStore.createIndex("message", "message", { unique: false });
    };

    // Form submission event listener
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get form values
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Save the contact data to IndexedDB
        const transaction = db.transaction(["contacts"], "readwrite");
        const objectStore = transaction.objectStore("contacts");
        const newContact = { name, email, message };

        const addRequest = objectStore.add(newContact);

        addRequest.onsuccess = () => {
            contactForm.reset();
            displayComments();
        };

        addRequest.onerror = (event) => {
            console.error("Error adding contact:", event.target.error);
        };
    });

    // Function to display comments from IndexedDB
    function displayComments() {
        const commentsSection = document.getElementById("commentsSection");
        commentsSection.innerHTML = ""; // Clear previous comments

        const transaction = db.transaction(["contacts"], "readonly");
        const objectStore = transaction.objectStore("contacts");

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const { name, email, message } = cursor.value;
                const commentDiv = document.createElement("div");
                commentDiv.className = "comment";
                commentDiv.innerHTML = `
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${message}</p>
                    <hr>
                `;
                commentsSection.appendChild(commentDiv);
                cursor.continue();
            }
        };
    }
});

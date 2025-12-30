function performLogout(is_admin) {
    // 1. Clear ALL relevant local storage keys
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    // 2. CRITICAL FIX: Clear the browser's history state
    // This tells the browser to 'forget' the form data associated with the previous page load,
    // which is the final defense against autofill persistence.
    if (window.history && window.history.pushState) {
        window.history.pushState('', null, null); 
    }

    // 3. Redirect to the appropriate login page
    if (is_admin) {
        window.location.href = 'shelter-login.html';
    } else {
        window.location.href = 'login.html';
    }
}

function injectDynamicLinks() {
    const navContainer = document.getElementById('dynamicNavLinks');
    if (!navContainer) return;

    // Get the user's state from local storage
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const isLoggedIn = !!userRole;

    let linksHTML = '';
    let homeHref = 'index.html'; // Default for guests

    // --- 1. Determine Dynamic Home Page and Core Links ---
    if (userRole === 'admin') {
        homeHref = 'shelter-dashboard.html';
    } else if (userRole === 'user') {
        homeHref = 'dashboard.html';
    }

    // Always include these links, using the dynamic homeHref for the "Home" link
    linksHTML += `<a class="nav-link active" href="${homeHref}">Home</a>`;
    

    if (isLoggedIn) {
        // --- 2. AUTHENTICATED USER VIEW (Hides Login/Register) ---
        
        if (userRole === 'admin') {
            // Admin links
            linksHTML += `<a class="nav-link text-danger font-weight-bold" href="shelter-dashboard.html">Admin Portal</a>`;
            linksHTML += `<a class="nav-link text-danger" href="add-pet.html">Add Pet</a>`;
            
            // Admin Logout link
            linksHTML += `<a class="nav-link" href="shelter-login.html" onclick="performLogout(true)">Logout (${userName})</a>`;

        } else if (userRole === 'user') {
            // Regular user links
            linksHTML += `<a class="nav-link text-success" href="dashboard.html">My Dashboard</a>`;
            linksHTML += `<a class="nav-link" href="adoption-request.html">Submit Request</a>`;
            
            // Regular User Logout link
            linksHTML += `<a class="nav-link" href="login.html" onclick="performLogout(false)">Logout (${userName})</a>`;
        }
    } else {
        // --- 3. GUEST/LOGOUT VIEW (Shows Login/Register links) ---
        linksHTML += `<a class="nav-link" href="login.html">Login</a>`;
        linksHTML += `<a class="nav-link" href="register.html">Register</a>`;
        linksHTML += `<a class="nav-link" href="available-pets.html">Available Pets</a>`;
        linksHTML += `<a class="nav-link" href="shelter-login.html">Shelter Login</a>`; 
    }
linksHTML += `<a class="nav-link" href="contact-page.html">Contact</a>`;
    linksHTML += `<a class="nav-link" href="about-us.html">About Us</a>`; 
    navContainer.innerHTML = linksHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    // This is the core logic that fetches the navbar template and injects links.
    const navElement = document.querySelector('nav');
    if (navElement) {
        // Insert the dynamic links container directly into the existing <nav> element
        navElement.insertAdjacentHTML('beforeend', `
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav" id="dynamicNavLinks">
                    </div>
            </div>
        `);
        injectDynamicLinks();
    }
});
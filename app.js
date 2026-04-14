document.addEventListener("DOMContentLoaded", () => {
    // Dynamic Client Fetching (Fixed selectors and data schema)
    const clientList = document.querySelector('.client-list');
    
    if (clientList) {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => {
                data.forEach(client => {
                    clientList.innerHTML += `
                        <div class="client-row">
                            <div class="client-profile-group">
                                <img src="${client.logoUrl}" alt="${client.name} Logo" class="client-logo">
                                <div class="client-info">
                                    <h2>${client.name}</h2>
                                    <p>${client.description}</p>
                                </div>
                            </div>
                            <div class="client-meta">
                                <a href="${client.socials}" target="_blank">View Profile &#8599;</a>
                            </div>
                        </div>
                    `;
                });
            })
            .catch(err => console.error("Database connection issue:", err));
    }
});
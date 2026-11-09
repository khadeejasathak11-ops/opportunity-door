
const detailsContainer = document.getElementById("opportunity-details");

const params = new URLSearchParams(window.location.search);
const opportunityId = params.get("id");

const opportunity = opportunities.find(item => item.id === opportunityId);

if (!opportunity) {
    detailsContainer.innerHTML = `
        <h2>Opportunity not found</h2>
        <p>This listing may no longer be available.</p>
        <a href="index.html">Return home →</a>
    `;
} else {
    detailsContainer.innerHTML = `
        <span class="opportunity-category">${opportunity.category}</span>

        <h1>${opportunity.title}</h1>

        <p class="details-provider">${opportunity.provider}</p>

        <p class="details-description">${opportunity.description}</p>

        <div class="details-info">
            <div><strong>Eligibility</strong><p>${opportunity.eligibility}</p></div>
            <div><strong>Cost</strong><p>${opportunity.cost}</p></div>
            <div><strong>Deadline</strong><p>${opportunity.deadline}</p></div>
            <div><strong>Location</strong><p>${opportunity.location}</p></div>
            <div><strong>Last verified</strong><p>${opportunity.lastVerified}</p></div>
        </div>

        ${opportunity.officialLink
            ? `<a class="primary-button" href="${opportunity.officialLink}" target="_blank" rel="noopener noreferrer">Visit Official Website →</a>`
            : `<p class="sample-note">Sample listing — official application link not added yet.</p>`
        }
    `;
}

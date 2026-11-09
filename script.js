const opportunityList = document.getElementById("opportunity-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const stateFilter = document.getElementById("state-filter");
const costFilter = document.getElementById("cost-filter");
const formatFilter = document.getElementById("format-filter");
const gradeFilter = document.getElementById("grade-filter");
const deadlineFilter = document.getElementById("deadline-filter");
const resultsCount = document.getElementById("results-count");
const clearFiltersButton = document.getElementById("clear-filters");

function matchesDeadline(item, days) {
    if (days === "all") return true;

    if (days === "none") {
        return !item.deadlineDate;
    }

    if (!item.deadlineDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(item.deadlineDate + "T23:59:59");
    const difference = deadline - today;
    const daysRemaining = difference / (1000 * 60 * 60 * 24);

    return daysRemaining >= 0 && daysRemaining <= Number(days);
}

function displayOpportunities() {
    const search = searchInput.value.toLowerCase().trim();

    const category = categoryFilter.value;
    const state = stateFilter.value;
    const cost = costFilter.value;
    const format = formatFilter.value;
    const grade = gradeFilter.value;
    const deadline = deadlineFilter.value;

    const filtered = opportunities.filter(item => {

        const searchableText = [
            item.title,
            item.provider,
            item.description,
            item.eligibility,
            item.location,
            item.category
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(search);

        const matchesCategory =
            category === "all" || item.category === category;

        let matchesState = true;

        if (state === "Nationwide") {
            matchesState = item.nationwide === true;
        } else if (state === "International") {
            matchesState = item.international === true;
        } else if (state !== "all") {
            matchesState =
                item.nationwide === true ||
                (item.states || []).includes(state);
        }

        const matchesCost =
            cost === "all" || item.costType === cost;

        const matchesFormat =
            format === "all" || item.format === format;

        const matchesGrade =
            grade === "all" || item.gradeLevels.includes(grade);

        const matchesDate = matchesDeadline(item, deadline);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesState &&
            matchesCost &&
            matchesFormat &&
            matchesGrade &&
            matchesDate
        );
    });

    resultsCount.textContent =
        `${filtered.length} ${filtered.length === 1 ? "opportunity" : "opportunities"} found`;

    if (filtered.length === 0) {
        opportunityList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">✦</div>
                <h3>No matching opportunities found</h3>
                <p>Try changing your filters or clearing your search.</p>
                <button class="clear-button" onclick="clearFilters()">
                    Clear all filters
                </button>
            </div>
        `;
        return;
    }

    opportunityList.innerHTML = filtered.map(item => `
        <article class="opportunity-card">

            <span class="opportunity-category">
                ${item.category}
            </span>

            <h3>${item.title}</h3>

            <p class="provider-name">${item.provider}</p>

            <p class="card-description">${item.description}</p>

            <div class="card-tags">
                <span>${item.cost}</span>
                <span>${item.format}</span>
                <span>${item.gradeLevels.map(g => "Grade " + g).join(", ")}</span>
            </div>

            <p class="card-deadline">
                <strong>Deadline:</strong> ${item.deadline}
            </p>

            <a href="opportunity.html?id=${encodeURIComponent(item.id)}">
                View details →
            </a>

        </article>
    `).join("");
}

function clearFilters() {
    searchInput.value = "";
    categoryFilter.value = "all";
    stateFilter.value = "all";
    costFilter.value = "all";
    formatFilter.value = "all";
    gradeFilter.value = "all";
    deadlineFilter.value = "all";

    displayOpportunities();
}

[
    searchInput,
    categoryFilter,
    stateFilter,
    costFilter,
    formatFilter,
    gradeFilter,
    deadlineFilter
].forEach(filter => {
    filter.addEventListener("input", displayOpportunities);
    filter.addEventListener("change", displayOpportunities);
});

clearFiltersButton.addEventListener("click", clearFilters);

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        categoryFilter.value = button.dataset.category;

        displayOpportunities();

        document.getElementById("opportunities").scrollIntoView({
            behavior: "smooth"
        });
    });
});

displayOpportunities();
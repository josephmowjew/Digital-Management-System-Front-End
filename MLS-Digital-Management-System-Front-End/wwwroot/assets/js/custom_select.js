function initSelect2(options, containerId) {
    var containerElement = document.getElementById(containerId);

    // Check if containerElement exists
    if (!containerElement) {
        console.error("Container element with ID '" + containerId + "' not found.");
        return;
    }

    var selectSearch = containerElement.querySelector("#select-search");
    var selectOptions = containerElement.querySelector(".select2-options");
    var selectDropdown = containerElement.querySelector(".select2-dropdown");
    var selectSelection = containerElement.querySelector(".select2-selection");
    var lastSelectOption = null;
    var uniqueOptions = new Set();
    var currentPage = 1;
    var totalPages = 1;
    var hiddenFieldId = options.hiddenFieldId || "MemberId";

    // Check if selectSearch exists
    if (!selectSearch) {
        console.error("Search input element not found within container element.");
        return;
    }

    if (options.initialSearchValue !== undefined && options.initialSearchValue !== null) {

        selectSearch.value = options.initialSearchValue
    }

   

    // Function to fetch data from the backend
    function fetchData() {
        // Make an AJAX request to the backend
        $.ajax({
            url: options.url || "/GetAllMembersJson", // Replace with your backend API endpoint
            type: "GET",
            data: {
                page: currentPage,
                pageSize: options.pageSize || 20,
                searchValue: selectSearch.value.toLowerCase() // Include search value
            },
            success: function (response) {
                // Add new options to the dropdown
                response.forEach(function (option) {
                    var optionValue = option.name;
                    var optionId = option.id;
                    var accountNumber = null;

                    if (!uniqueOptions.has(optionValue)) {
                        var newOption = document.createElement('div');
                        newOption.classList.add('select2-dropdown-option');
                        newOption.setAttribute('data-value', optionId);
                        newOption.textContent = optionValue;

                        var newOptionLi = document.createElement('li');
                        newOptionLi.appendChild(newOption);

                        if (options.initialSearchValue && options.initialSearchValue.trim() !== '') {
                            // Extract AccountNumber from optionValue only if initialSearchValue is defined and not empty
                            accountNumber = extractAccountNumber(optionValue);
                            // Check if the extracted accountNumber matches the initialSearchValue
                            if (accountNumber === options.initialSearchValue) {
                                newOptionLi.classList.add('selected'); // Mark as selected
                                document.getElementById(hiddenFieldId).value = optionId; // Set hidden field value
                                selectSelection.textContent = optionValue; // Set selection text
                            }
                        }

                        selectOptions.appendChild(newOptionLi);
                        uniqueOptions.add(optionValue);

                        // Add event listener to the new option
                        newOption.addEventListener("click", function () {
                            var selectedValue = this.textContent;
                            var selectId = this.getAttribute("data-value");
                            document.getElementById(hiddenFieldId).value = selectId;
                            selectSelection.textContent = selectedValue;
                            selectDropdown.style.display = "none";
                        });
                    }
                });

                // Update the last select option
                lastSelectOption = selectOptions.lastChild ? selectOptions.lastChild.firstChild : null;

                // Call filterOptions after new options are added
                filterOptions();

                // Observe the new last option
                if (lastSelectOption) {
                    observer.observe(lastSelectOption);
                }

                // Increment the current page
                currentPage++;
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data: ", error);
            }
        });
    }


    // Function to extract AccountNumber from optionValue
    function extractAccountNumber(optionValue) {
        var matches = optionValue.match(/\((.*?)\)/); // Using regex to extract text within parentheses
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return null;
    }


    // Function to filter options based on search input
    function filterOptions() {
        var searchValue = selectSearch.value.toLowerCase();
        var selectOptionsLi = selectOptions.querySelectorAll("li");
        selectOptionsLi.forEach(function (option) {
            var text = option.textContent.toLowerCase();
            if (text.includes(searchValue)) {
                option.style.display = "list-item";
            } else {
                option.style.display = "none";
            }
        });
    }

    // Intersection Observer configuration
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.target === lastSelectOption) {
                fetchData(); // Call fetchData when the last option becomes visible
            }
        });
    }, { threshold: 0.5 });

    // Initially fetch the first set of options
    fetchData();

    // Call filterOptions initially
    filterOptions();

    // Event listener for search input
    selectSearch.addEventListener("input", function () {
        fetchData(); // Call fetchData when the search input changes
    });

    // Show/hide dropdown on selection click
    var isDropdownOpen = false;
    selectSelection.addEventListener("click", function () {
        if (isDropdownOpen) {
            selectDropdown.style.display = "none";
            isDropdownOpen = false;
        } else {
            selectDropdown.style.display = "block";
            isDropdownOpen = true;

            // Add a click event listener to the document
            document.addEventListener("click", handleOutsideClick, false);
        }
    });

    // Function to handle clicks outside the dropdown
    function handleOutsideClick(event) {
        if (!selectSelection.contains(event.target) && !selectDropdown.contains(event.target)) {
            selectDropdown.style.display = "none";
            isDropdownOpen = false;
            document.removeEventListener("click", handleOutsideClick, false);
        }
    }
}

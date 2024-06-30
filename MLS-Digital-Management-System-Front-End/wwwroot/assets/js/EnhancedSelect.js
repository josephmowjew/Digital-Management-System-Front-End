class EnhancedSelect {
  constructor(options, containerId) {
    this.options = options;
    this.container = document.getElementById(containerId);
    this.cache = new Map();
    this.currentPage = 1;
    this.uniqueOptions = new Set();
    this.initElements();
    this.bindEvents();
    this.loadInitialData();
  }

  initElements() {
   
    this.selectSearch = this.container.querySelector("#select-search");
    this.selectOptions = this.container.querySelector(".select2-options");
    this.selectDropdown = this.container.querySelector(".select2-dropdown");
    this.selectSelection = this.container.querySelector(".select2-selection");
    this.hiddenField = document.getElementById(this.options.hiddenFieldId || "CustomerId");

    if (!this.selectSearch || !this.selectOptions || !this.selectDropdown || !this.selectSelection || !this.hiddenField) {
      console.error("One or more required elements not found.");
      return;
    }

    // Hide dropdown by default
    this.selectDropdown.style.display = 'none';

    this.selectSelection.setAttribute('role', 'combobox');
    this.selectSelection.setAttribute('aria-haspopup', 'listbox');
    this.selectSelection.setAttribute('aria-expanded', 'false');
    this.selectOptions.setAttribute('role', 'listbox');
 
  }

  bindEvents() {

    this.selectSearch.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
    this.selectSelection.addEventListener("click", this.toggleDropdown.bind(this));
    document.addEventListener("click", this.handleOutsideClick.bind(this));
    this.selectOptions.addEventListener("scroll", this.handleScroll.bind(this));
    this.selectSearch.addEventListener('keydown', this.handleKeyDown.bind(this));

  }

  async loadInitialData() {
    
    try {
      const data = await this.fetchData(this.options.initialSearchValue || '');
      
      this.renderOptions(data);
      if (this.options.initialSearchValue) {
       
        await this.preselectOption(this.options.initialSearchValue);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async preselectOption(initialValue) {
   
    const options = this.selectOptions.querySelectorAll('.select2-dropdown-option');
 
    for (let option of options) {

      if (option.getAttribute('data-value') === initialValue) {
     
        this.selectOption({
          Id: option.getAttribute('data-value'),
          Name: option.textContent
        });
        break;
      }
    }
   
  }

  async handleSearch() {
    const searchValue = this.selectSearch.value.toLowerCase();
    this.currentPage = 1;
    this.uniqueOptions.clear();

    try {
      const data = await this.fetchData(searchValue);
      this.renderOptions(data);
      this.showDropdown();
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchData(searchValue) {
    
    const response = await fetch(`${this.options.url}?page=${this.currentPage}&pageSize=${this.options.pageSize || 20}&searchValue=${searchValue}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  }

  renderOptions(options) {
 
    this.selectOptions.innerHTML = ''; // Clear existing options

    if (!Array.isArray(options) || options.length === 0) {
      const noResults = document.createElement('li');
      noResults.textContent = 'No results found';
      this.selectOptions.appendChild(noResults);
      return;
    }

    options.forEach(option => {
      const optionElement = this.createOptionElement(option);
      this.selectOptions.appendChild(optionElement);
    });
  }

  createOptionElement(option) {
    const optionElement = document.createElement('div');
    optionElement.classList.add('select2-dropdown-option');
    optionElement.setAttribute('data-value', option.Id || option.id || '');
    optionElement.setAttribute('role', 'option');
    optionElement.textContent = option.Name || option.name || 'Unnamed Option';

    optionElement.addEventListener("click", (e) => {
      e.stopPropagation();
      this.selectOption(option);
      this.hideDropdown();
    });

    return optionElement;
  }

  selectOption(option) {
  
    this.hiddenField.value = option.Id || option.id || '';
    this.selectSelection.textContent = option.Name || option.name || 'Select an option';
    
    // Trigger a change event on the hidden field
    const event = new Event('change', { bubbles: true });
    this.hiddenField.dispatchEvent(event);

  }

  toggleDropdown(event) {
    event.stopPropagation();
    const isExpanded = this.selectSelection.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  showDropdown() {
  
    this.selectDropdown.style.display = 'block';
    this.selectSelection.setAttribute('aria-expanded', 'true');
  }

  hideDropdown() {
  
    this.selectDropdown.style.display = 'none';
    this.selectSelection.setAttribute('aria-expanded', 'false');
  }

  handleOutsideClick(event) {
    if (!this.container.contains(event.target)) {
      
      this.hideDropdown();
    }
  }

  handleScroll() {
    if (this.selectOptions.scrollTop + this.selectOptions.clientHeight >= this.selectOptions.scrollHeight - 20) {
     
      this.loadMoreOptions();
    }
  }

  async loadMoreOptions() {
    try {
      this.currentPage++;
      const data = await this.fetchData(this.selectSearch.value.toLowerCase());
      this.renderOptions(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleKeyDown(event) {
    const options = this.selectOptions.querySelectorAll('.select2-dropdown-option');
    const currentIndex = Array.from(options).findIndex(option => option.classList.contains('focused'));

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusOption(currentIndex + 1, options);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusOption(currentIndex - 1, options);
        break;
      case 'Enter':
        event.preventDefault();
        if (currentIndex !== -1) {
          const selectedOption = options[currentIndex];
          this.selectOption({
            Id: selectedOption.getAttribute('data-value'),
            Name: selectedOption.textContent
          });
          this.hideDropdown();
        }
        break;
    }
  }

  focusOption(index, options) {
    options.forEach(option => option.classList.remove('focused'));
    if (index >= 0 && index < options.length) {
      options[index].classList.add('focused');
      options[index].scrollIntoView({ block: 'nearest' });
    }
  }

  handleError(error) {
    console.error('Error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'An error occurred while fetching data. Please try again.';
    this.selectOptions.innerHTML = '';
    this.selectOptions.appendChild(errorMessage);
  }

  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
}

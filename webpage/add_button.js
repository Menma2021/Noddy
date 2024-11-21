class AddButton {
    constructor(content_manager) {
        this.content_manager = content_manager;

        // Create the button element
        this.button = document.createElement('button');
        this.button.id = 'add_button';
        this.button.innerHTML = '+';

        // Get the position of the navigation container
        const navigationContainer = document.getElementById('navigation_container');
        const navBounds = navigationContainer.getBoundingClientRect();

        // Button position
        this.button.style.position = 'absolute';
        this.button.style.top = `${navBounds.top + 10}px`; // Adjust the top position as needed
        this.button.style.left = `${navBounds.right + 10}px`; // Adjust the left position as needed
        this.button.style.zIndex = '1000'; // Ensure it's on top of other elements

        // Append button to the body
        document.body.appendChild(this.button);

        // Create input field (initially hidden)
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.placeholder = 'Enter data here...';
        this.inputField.style.position = 'absolute';
        this.inputField.style.display = 'none'; // Initially hidden
        this.inputField.style.top = `${navBounds.top + 60}px`; // Position it below the button
        this.inputField.style.left = `${navBounds.right + 10}px`;
        this.inputField.style.zIndex = '1000'; // Ensure it's on top
        document.body.appendChild(this.inputField);

        // Add event listener for button click (toggle input field visibility)
        this.button.addEventListener('click', () => {
            if (this.inputField.style.display === 'none') {
                this.inputField.style.display = 'block';
                this.inputField.focus();
            } else {
                this.inputField.style.display = 'none';
            }
        });

        // Add event listener for input field change (trigger content generation)
        this.inputField.addEventListener('change', () => {
            const input = this.inputField.value;
            if (input) {
                this.content_manager.generate_content(input, "additional_data");
                this.inputField.value = ''; // Clear input field
                this.inputField.style.display = 'none'; // Hide input field after use
            }
        });
    }
}

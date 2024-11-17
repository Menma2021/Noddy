/*
this file manage the content of the page
it manage the main content object
it also manage the navigation bar
Xuanpei Chen 2024/11/11
*/

class ContentManager{
    constructor(key_data){
        
        this.main_content = new MainContent(key_data);
        this.content_list = [this.main_content];
    }

    generate_content(key_data){
        /*generate a new content by the key_data
        and add it to the content_list
        */
        this.main_content = new MainContent(key_data);
        this.content_list.push(this.main_content);
    }

    change_content(){
        /*change the content of the page
        the content is in the content_list
        */
    }
}


btn.addEventListener("change", e => {
    if (e.detail === 'dark') {
        document.body.dataset.theme = "dark";
    }
    else {
        document.body.dataset.theme = "light";
    }
});

// For testing, can be deleted if I pushed it and forgot to delet before that
document.addEventListener('DOMContentLoaded', () => {
    const navigationContainer = document.getElementById('navigation_container');
    if (navigationContainer) {
        const navBounds = navigationContainer.getBoundingClientRect();
        console.log(navBounds);
    } else {
        console.error('navigation_container element not found.');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data') || 'Node Tree';
    const content_manager = new ContentManager(data);
  });

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

document.addEventListener("DOMContentLoaded", () => {
  const content_manager = new ContentManager("SpaceX");
});

/*
this file manage the content of the page
it manage the main content object
it also manage the navigation bar
Xuanpei Chen 2024/11/11
*/

class ContentManager{
    constructor(key_data){
        this.navigation_button_container = document.getElementById('navigation_button_container');
        this.main_content = new MainContent(key_data,this);
        this.bind_navigation_button(this.main_content);
        this.content_list = [this.main_content];
        
    }

    generate_content(key_data,additional_data){
        /*generate a new content by the key_data
        and add it to the content_list
        */
        this.hide_all_content();
        if (this.main_content.additional_data!=""){
            const additional_data_new = this.main_content.additional_data+"->"+additional_data;
            console.log(additional_data_new)
            this.main_content = new MainContent(key_data,this,additional_data_new);
        }
        else if (additional_data==""){
            this.main_content = new MainContent(key_data,this);
        }
        else{
            this.main_content = new MainContent(key_data,this,this.main_content.key_data+"->"+additional_data);
        }
        this.bind_navigation_button(this.main_content);
        this.content_list.push(this.main_content);
    }
    hide_all_content(){
        for (const content of this.content_list){
            content.hide_content();
            content.destroy_sessions();
        }
    }

    bind_navigation_button(content){
        const element=document.createElement('div');
        const element_delete = document.createElement('div');
        const element_text = document.createElement('span');
        element.classList.add('navigation_button');
        element_text.textContent=content.key_data;
        element_delete.classList.add('navigation_button_delete');
        element_delete.innerHTML = `<img src="trash-svgrepo-com.svg" class="trash_icon" alt="Trash Icon" style="width: 25px; height: 25px;" />`;
        element_delete.addEventListener('click',()=>{
            this.delete_content(content,element);
        });
        element.appendChild(element_delete);
        element.appendChild(element_text);
        element_text.addEventListener('click',()=>{
            this.change_content(content);
        });
        this.navigation_button_container.appendChild(element);
    }

    change_content(content){
        /*change the content of the page
        the content is in the content_list
        */
        this.hide_all_content();
        content.show_content();
        this.main_content = content;
    }
    delete_content(content,element){
        this.content_list = this.content_list.filter(item => item !== content);
        content.destroy_content();
        if (content===this.main_content){
            this.navigation_button_container.removeChild(element);
            this.main_content = this.content_list[0];
            this.change_content(this.main_content);
        }
        else{
            this.navigation_button_container.removeChild(element);
        }
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
    new AddButton(content_manager);
  });

/*
this is the main content of the page
it contains the graph
and summary of the graph
and the description of the each node
*/

class MainContent {
    constructor(key_data) {
        this.element = document.createElement('div');
        this.element.classList.add('main_content');//if want to hidden, use hidden_content
        this.initinal_graph(key_data);
        this.initinal_summary_box();
        const content_container = document.getElementById('content_container');
        content_container.appendChild(this.element);
        


        this.start_generate_graph();


    }
    initinal_graph(key_data){
        this.element_graph = document.createElement('div');
        this.element_graph.classList.add('graph');
        this.element.appendChild(this.element_graph);
        this.graph = new Graph(this.element_graph,key_data);
    }
    initinal_summary_box(){
        this.summary_box = document.createElement('div');
        this.summary_box.classList.add('summary_box');
        this.element.appendChild(this.summary_box);
    }
    async start_generate_graph() {
        await this.graph.get_graph_data();
        await this.generate_summary();
    }

    generate_summary_prompt(){
        /*
        this function generate the prompt for the summary of the graph
        the prompt is :
        "....
        "
        */
        const data=this.graph.data;
        const prompt = `
        brabrabra
        `;
        return prompt;
    }
    async generate_summary() {
        const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();

        if (available !== "no") {
            const session = await ai.languageModel.create();
          
            // Prompt the model and stream the result:

            const prompt = this.generate_summary_prompt();
            console.log(prompt);
            const stream = session.promptStreaming(prompt);
            for await (const chunk of stream) {
                console.log(chunk);
                this.summary_box.innerHTML = chunk;
                
                
            }
        }
    }
}


main_content = new MainContent("Hello World");

/*
this is the main content of the page
it contains the graph
and summary of the graph
and the description of the each node
Xuanpei Chen 2024/11/11
*/

class MainContent {
    constructor(key_data,content_manager,additional_data="") {
        this.key_data = key_data;
        this.additional_data = additional_data;
        this.content_manager = content_manager;
        this.element = document.createElement('div');
        this.element.classList.add('main_content');//if want to hidden, use hidden_content
        this.initinal_graph(key_data,additional_data);
        this.initinal_summary_box();
        this.content_container = document.getElementById('content_container');
        this.content_container.appendChild(this.element);
        
        this.start_generate_graph(additional_data);

        this.sessions = [];

    }

    initinal_graph(key_data){
        this.element_graph = document.createElement('div');
        this.element_graph.classList.add('graph');
        this.element.appendChild(this.element_graph);
        this.graph = new Graph(this.element_graph,key_data,this,this.content_manager);
    }
    initinal_summary_box(){
        this.summary_box = document.createElement('div');
        this.summary_box.classList.add('summary_box');
        this.element.appendChild(this.summary_box);
    }
    async start_generate_graph(additional_data) {
        // Generate graph data asynchronously
        await this.graph.get_graph_data(additional_data);

        const graphData = this.graph.data; // Make sure graphData is available here
        if (graphData) {
            await this.generate_summary(graphData,additional_data);  // Pass the graph data to the summary generation
        } else {
            console.log("Graph data is not available.");
        }
    }

    generate_summary_prompt(graphData,additional_data){
        // Create a prompt to generate the summary based on the graph data
        const nodes = graphData.nodes.map(node => node.id).join(', ');
        const links = graphData.links.map(link => `${link.source.id} -> ${link.target.id}`).join(', ');
        let additional_data_prompt = "";
        if (additional_data !== ""){
            additional_data_prompt = `Here is the additional information: ${additional_data}`;
        }
        const prompt = /* `
        Summarize the following graph data:
        Nodes: ${nodes}
        Links: ${links}
        Please provide a brief summary of the nodes. Take the first node as the main topic, and trace down to each nodes
        `; */
        `
        
        Using the data provided below, create a summary of the topic. First node is the main topic. All the links mean that the topics are connected.
        When generating prompt, don't mention the fact that you are generating data from the graph - write as if you are just responding to basic promt.
        Additionally, you need to mention all the nodes, however, don't oversaturate answer with a lot of information - keep it brief and general.
        ${additional_data_prompt}
        Here is the main data:
        Nodes: ${nodes}
        Links: ${links}
        `;
        return prompt;
    }
    async generate_summary(graphData,additional_data) {
        const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();

        this.summary_box.innerHTML = "Loading description...";

        if (available !== "no") {
            const session = await ai.languageModel.create();
            this.sessions.push(session);
            // Prompt the model and stream the result:

            const prompt = this.generate_summary_prompt(graphData,additional_data);
            //console.log('Summary Prompt:', prompt);
            
            // Send the prompt to the AI and stream the result            
            const stream = session.promptStreaming(prompt);
            for await (const chunk of stream) {
                //console.log(chunk);
                // Insert the summary into the summary_box container on the HTML page
                this.summary_box.innerHTML = marked.parse(chunk);
                
            }
        }
    }

    hide_content(){
        this.element.classList.add('hidden_content');
    }
    show_content(){
        this.element.classList.remove('hidden_content');
    }
    destroy_content(){
        this.content_container.removeChild(this.element);
        this.destroy_sessions();
    }
    destroy_sessions(){
        this.sessions.forEach(session => {
            try{
                session.destroy();
            }catch(e){
                console.log(e);
            }
        });
    }
}



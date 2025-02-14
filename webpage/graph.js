
document.body.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
class Graph {
    constructor(element, central_node, main_content,content_manager) {
        // Initialize the graph with a central node and main content
        this.central_node = central_node;
        this.main_content = main_content;
        this.content_manager = content_manager;
        this.data = {
          nodes: [ // all nodes
              { id: central_node, isCentral: true, translated: false, translated_id: central_node },
          ],
          links: [ // all nodes connections
          ]
        };
        
        this.mouse_x_temp = 0;
        this.mouse_y_temp = 0;
        
        // Set up dimensions and scaling
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scale = 1;
        this.mouse_move_speed = 0.01;
        this.element = element;

        // Create SVG element
        this.svg = d3.select(element)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("overflow", "scroll");

        // Initialize force simulation
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force("link", d3.forceLink(this.data.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody(-2000))
            .force("collision", d3.forceCollide().radius(d => d.isCentral ? 100 : 75).strength(0.1))
            //.force("center", d3.forceCenter(this.width / 2, this.height / 2)); 
        

        this.initinal_listener();
        this.initinal_graph();
        
        this.svg.attr("viewBox", `${0} ${0} ${this.width} ${this.height}`);

        this.box_element = document.createElement('div');

        this.description_dict = {};

        this.node_dragging = false;


    }

    // Handle the start of node dragging
    dragStarted(event, node) {
        this.node_dragging = true;
        if (!event.active) this.simulation.alphaTarget(0.1).restart();
        // Lock the dragged nodes
        node.fx = node.x;
        node.fy = node.y;
    }
    
    // Handle node dragging
    dragged(event, node) {
        const targetX = event.x;
        const targetY = event.y;
    
        // Smooth node interpolation 
        node.fx += (targetX - node.fx) * 0.1;
        node.fy += (targetY - node.fy) * 0.1;
    }
    
    // Handle the end of node dragging
    dragEnded(event, node) {
        if (!event.active) this.simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
        this.node_dragging = false;
    }
    
    // Get children nodes of a given node
    getChildren(nodeId) {
        const children = [];
        for (const link of this.data.links) {
            if (link.source.id === nodeId) {
                children.push(link.target);
            }
        }
        return children;
    }
    
    // Initialize event listeners
    initinal_listener() {
        // Zoom functionality
        this.element.addEventListener("wheel", (event) => {
            const delta = event.deltaY/100;
            const min_scale = 0.5;
            const newScale = Math.max(min_scale, this.scale + delta);
            //console.log(newScale);
            const mouse_x = event.clientX - this.svg.node().getBoundingClientRect().left;
            const mouse_y = event.clientY - this.svg.node().getBoundingClientRect().top;
            const viewBox = this.svg.attr("viewBox").split(" ");
            const viewBoxX = parseFloat(viewBox[0]);
            const viewBoxY = parseFloat(viewBox[1]);
            const viewBoxWidth = parseFloat(viewBox[2]);
            const viewBoxHeight = parseFloat(viewBox[3]);
            //console.log(viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight);
            const elementWidth = this.svg.node().clientWidth;
            const elementHeight = this.svg.node().clientHeight;
            const mouse_x_viewbox = viewBoxX + (mouse_x / elementWidth) * viewBoxWidth;
            const mouse_y_viewbox = viewBoxY + (mouse_y / elementHeight) * viewBoxHeight;
            this.change_size(newScale,mouse_x_viewbox,mouse_y_viewbox ,viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight);
        });
        
        // Pan functionality
        this.element.addEventListener("mousedown", (event) => {
            this.box_element.remove();
            this.is_dragging = true;
            this.mouse_x_temp = event.clientX;
            this.mouse_y_temp = event.clientY;
        });
        this.element.addEventListener("mousemove", (event) => {
            if (this.is_dragging && !this.node_dragging) {
                const mouse_x_delta = -(event.clientX - this.mouse_x_temp)*this.scale;
                const mouse_y_delta = -(event.clientY - this.mouse_y_temp)*this.scale;
                
                const viewBox = this.svg.attr("viewBox").split(" ");
                const viewBoxX = parseFloat(viewBox[0])+mouse_x_delta;
                const viewBoxY = parseFloat(viewBox[1])+mouse_y_delta;
                const viewBoxWidth = parseFloat(viewBox[2]);
                const viewBoxHeight = parseFloat(viewBox[3]);
                this.svg.attr("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
            }
            this.mouse_x_temp = event.clientX;
            this.mouse_y_temp = event.clientY;
        });
        this.element.addEventListener("mouseup", (event) => {
            this.is_dragging = false;
        });
    }

    node_click_listener(circle_element){
        // New page generation goes here
        const text=d3.select(circle_element.parentNode).select('text').text();
        let ancestors = [text];
        this.getAncestors(text, ancestors);
        const root = ancestors.pop(0);
        
        const additional_data = `${ancestors.reverse().join(' -> ')}`;
        this.content_manager.generate_content(text,additional_data);
    }

    // Handle node hover events
    async node_hover_listener(circle_element,node_id) {
        // delay timer
        let signal = false;
        
        // mouse enter event
        circle_element.addEventListener('mouseenter', () => {
            setTimeout(async () => {
                if (signal){
                    return;
                }
                    this.box_element.remove();
        
                    const navigationContainer = document.getElementById('navigation_container');
                    const navBounds = navigationContainer.getBoundingClientRect();
        
                    const box_position_x = navBounds.right - window.innerWidth * 0.2; // Taking position right on the right
                    const box_position_y = navBounds.top; // Alighning with the top of navigation container
        
                    // Creating the description box
                    this.box_element = document.createElement('div');
                    this.box_element.style.width = `${window.innerWidth * 0.4}px`;
                    this.box_element.style.height = `${window.innerHeight * 0.4}px`;
                    this.box_element.style.position = 'absolute';
                    this.box_element.style.left = `${box_position_x}px`;
                    this.box_element.style.top = `${box_position_y}px`;
                    this.box_element.style.border = '1px solid black';
                    this.box_element.classList.add('discription_box');
        
                    const title_element = document.createElement('div');
                    const title = d3.select(circle_element.parentNode).select('text').text();
                    const link = await this.fetchWikipediaLink(title);
                    title_element.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                    title_element.style.fontSize = '20px';
                    title_element.style.fontWeight = 'bold';
        
                    this.content_element = document.createElement('div');
                    this.box_element.appendChild(title_element);
                    this.box_element.appendChild(this.content_element);
        
                    this.main_content.element.appendChild(this.box_element);
                    this.generate_description(node_id, this.content_element);
        
                    //console.log(circle_element);
                    //console.log(d3.select(circle_element));
            }, 2000);
        });
            
        // mouse leave event
        circle_element.addEventListener('mouseleave', () => {
            signal = true;
        });
    }

    // Fetch Wikipedia link for a given title
    async fetchWikipediaLink(title) {
        const context = this.central_node;
        const searchQuery = `${title} ${context}`;
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(searchQuery)}`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            if (data.query.search.length > 0) {
                const pageTitle = data.query.search[0].title; // Most relevant page
                return `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
            } 
            else {
                // No page found - fallback to what we did before
                return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}&title=Special%3ASearch&ns0=1`;
            }
        } 
        catch (error) {
            console.error('Error fetching Wikipedia link:', error);
            // Error - fallback
            return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}&title=Special%3ASearch&ns0=1`;
        }
    }

    node_out_listener(circle_element){
        //console.log(circle_element);
        //console.log(d3.select(circle_element));

        //this.box_element.remove();
    }

    // Initialize the graph
    initinal_graph() {
        this.isHorizontal = false; // Change this for different layout

        if (this.isHorizontal) {
            this.simulation.force("x", d3.forceX().strength(0.1).x(d => d.isCentral ? this.width * 0.1 : this.width / 2))
                          .force("y", d3.forceY().strength(0.05).y(this.height / 2));
        } else {
            this.simulation.force("x", d3.forceX().strength(0.05).x(this.width / 2))
                          .force("y", d3.forceY().strength(0.01).y(d => d.isCentral ? this.height * 0.1 : this.height / 2))

        }
  
        // Create links
        this.link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.data.links)
            .enter().append("line")
            .attr("class", "link");
  
        // Create nodes
        this.node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(this.data.nodes)
            .enter().append("g")
            .attr("class", d => `node ${d.isCentral ? 'central' : ''}`);
  
        // Add circles to nodes
        this.node.append("circle")
            .attr("r", d => d.isCentral ? 35 : 20)  // Larger size for central node
            .on("mouseover", function() {
                d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 40 : 25); // Can add more staff
            })
            .on("mouseout", function() {
                d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 35 : 20); // Can add more staff
            })
            .call(d3.drag()
                .on("start", (event, d) => this.dragStarted(event, d))
                .on("drag", (event, d) => this.dragged(event, d))
                .on("end", (event, d) => this.dragEnded(event, d)));
  
        // Add text labels to nodes
        this.node.append("text")
            .attr("dy", -40)
            .attr("dx", -40)
            .text(d => d.translated ? d.translated_id : d.id)
            .on("dblclick", (event, d) => {
                if (!d.isCentral)
                {
                    this.edit_node(d.id, d.id)
                }
            });  
        // Update positions on each tick of the simulation
        this.simulation.on("tick", () => {
            this.link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
  
            this.node
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        });
    }

    // Assign data to the graph change check whether it is translated or not
    async assign_data(data){
        if (this.main_content.language=="en"){
            this.data = data;
            return;
        }
        else{
            for (const node of data.nodes){
                const match_node = this.find_match_node(node.id);
                if (match_node){
                    node.translated = match_node.translated;
                    node.translated_id = match_node.translated_id;
                } 
                if (!node.translated){
                    const translated_text = await this.main_content.translate_data_back(node.id,this.main_content.language);
                    node.translated = true;
                    node.translated_id = translated_text;
                }
            }

            this.data = data;
        }
    }
    find_match_node(node_id){
        for (const node of this.data.nodes){
            if (node.id == node_id){
                return node;
            }
        }
        return null;
    }
    
    // Update the graph with new data
    async updateGraph(newData) {
        if (JSON.stringify(newData) === JSON.stringify(this.data)) {
            return;
        }
        const nodesById = new Map(this.data.nodes.map(d => [d.id, d]));
        newData.nodes.forEach(node => {
            const existingNode = nodesById.get(node.id);
            if (existingNode) {
                node.x = existingNode.x;
                node.y = existingNode.y;
            } else {
                node.x = this.width / 2;
                node.y = this.height / 2;
            }
        });
        await this.assign_data(newData);

        // Update links
        this.link = this.link.data(newData.links);
        this.link.exit().remove();
        this.link = this.link.enter().append("line").attr("class", "link").merge(this.link);

        // Update nodes
        this.node = this.node.data(newData.nodes);
        this.node.exit().remove();
        const nodeEnter = this.node.enter().append("g").attr("class", d => `node ${d.isCentral ? 'central' : ''}`);
        nodeEnter.append("circle")
            .attr("r", d => d.isCentral ? 35 : 20)
            .on("mouseover", (event, d) => {
                //console.log(this); 
                this.node_hover_listener(event.currentTarget,d.id);
                d3.select(event.currentTarget) 
                    .transition()
                    .duration(200)
                    .attr("r", d.isCentral ? 40 : 25);
            })
            .on("mouseout", (event, d) => {
                this.node_out_listener(event.currentTarget);
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr("r", d.isCentral ? 35 : 20);
            })
            .on("click", (event, d) => {
                this.node_click_listener(event.currentTarget);
            });
        this.node.select("circle")
            .call(d3.drag()
                .on("start", (event, d) => this.dragStarted(event, d))
                .on("drag", (event, d) => this.dragged(event, d))
                .on("end", (event, d) => this.dragEnded(event, d)));

        nodeEnter.append("text")
            .attr("dy", -40)
            .attr("dx", -40)
            .text(d => d.translated ? d.translated_id : d.id)
            .on("dblclick", (event, d) => {
                if (!d.isCentral)
                {
                    this.edit_node(d.id, d.id)
                }
            });  

        this.node = nodeEnter.merge(this.node);
        this.simulation.nodes(newData.nodes);
        this.simulation.force("link").links(newData.links);
        //this.simulation.force("collision", d3.forceCollide().radius(d => d.isCentral ? 50 : 35));
        this.simulation.alpha(1).restart();
    }

    // Change the size of the graph
    change_size(scale, mouse_x, mouse_y, viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight) {
        const corners = [
            [viewBoxX, viewBoxY],
            [viewBoxX + viewBoxWidth, viewBoxY],
            [viewBoxX, viewBoxY + viewBoxHeight],
            [viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight]
        ];
        const new_corners = [];
        for (const corner of corners) {
            const [x, y] = corner;
            const newX = mouse_x - (mouse_x - x) * (scale/this.scale);
            const newY = (mouse_y - (mouse_y - y) * (scale/this.scale));
            new_corners.push([newX, newY]);
        }

        this.scale = scale;
        
        this.svg.attr("viewBox", `${new_corners[0][0]} ${new_corners[0][1]} ${new_corners[3][0]-new_corners[0][0]} ${new_corners[3][1]-new_corners[0][1]}`);
    }

    // Get graph data from AI
    async get_graph_data(additional_data="") {
        const func=this.updateGraph.bind(this);
        let userInput = this.central_node;
        if (this.main_content.language!="en"){
            userInput = await this.main_content.translate_data(userInput,this.main_content.language);
        }
        await this.generate_graph_stream(userInput,func,additional_data,10);
    }
    async generate_graph_stream(userInput,function_to_call,additional_data="",num_nodes=10) {
        this.additional_data = additional_data;
        const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();

        if (available !== "no") {
            const session = await ai.languageModel.create();
            this.main_content.sessions.push(session);

            // Prompt the model and stream the result:
            
            let additional_data_prompt = "";
            if (additional_data !== ""){
                additional_data_prompt = `Here is the additional information: ${additional_data}`;
            }
            const prompt = `
When a user searches for a keyword or provides a sentence, extract the central topic or main keyword(s) from the input to use as the main node in the structured response. If the user input is a sentence or question, extract only the central topic or main phrase. Examples:
   - "Name the largest countries of the world" -> "The largest countries"
   - "Demonstrate how World War 2 went" -> "World War 2"
   - "Which ethnicities live in Europe" -> "European ethnicities"
   - "Help me with my homework" -> "Homework advices".
If the user input is already concise or a single keyword (e.g., "Python"), use it as-is. Afterwards, follow this requirements:

1. Each line must strictly follow this format: $NL$ ? $STP$, where:
   - $NL$ represents the level indicator, L means level (e.g., $1L$, $2L$, $3L$, etc.).
   - ? contains a single keyword or phrase related to the search.
   - $STP$ marks the end of each line.
   
2. Ensure that ? includes only one keyword or phrase per line, without any additional text or multiple keywords, each keyword must at most be 3 words!

3. Each line must include both $NL$ and $STP$.

4. The response should cover multiple levels and contain at least ${num_nodes} lines.

5. $NL$ and $STP$ are special characters it is important to follow the format strictly don't include any other characters.

6. The structure must only have 1 level 1 node!

Format example:
$1L$ Main search keyword $STP$
$2L$ Sub-keyword 1 $STP$
$3L$ Sub-sub-keyword $STP$
$2L$ Sub-keyword 2 $STP$


Example Response:
If the user searches for "Algorithms and Data Structures":
$1L$ Algorithms and Data Structures $STP$
$2L$ Algorithms $STP$
$3L$ Sorting $STP$
$3L$ Graph $STP$
$2L$ Data Structures $STP$
$3L$ Trees $STP$
$4L$ Binary $STP$
$4L$ AVL $STP$
$3L$ Hash Table $STP$
$3L$ Linked List $STP$
$3L$ Stacks $STP$
$4L$ Array $STP$
$4L$ Linked List $STP$
$3L$ Queues $STP$
$4L$ Circular $STP$
$4L$ Priority $STP$


Ensure every line follows the exact format, with both $NL$ and $STP$ ($NL$ and $STP$ are special characters it is important to follow the format strictly don't include any other characters), and that there must be at least ${num_nodes} lines!!!
${additional_data_prompt}
Now User input: ${userInput} 
print $1L$ ${userInput} $STP$ as the first line!
`;
            //console.log(prompt);
            const stream = session.promptStreaming(prompt);
            let new_data = {};
            for await (const chunk of stream) {
                
                new_data = this.transform_data(chunk);
                await function_to_call(new_data);
            }
            return new_data;
        }
    }

    // Transform AI response into graph data
    transform_data(input) {
        const nodePattern = /[}$>\[]?\d+L[}$>\[]? (.*?) [}$>\[]?[^a-zA-Z0-9]?STP[}$>\[]?/g;/*To explain this gibberish: /.../g - start and end of the pattern. 
        [}$>\[]? looks for $, >, >, [, ]. (.*?) - basically, .* will include any characters that are not white spaces after first part. To make it not include stop sign, 
        ? makes it so that it included as small as possible. The last part is self explanatory */
        
        const nodes = [];
        const links = [];
        const nodeLayers = {};
        const lastNode = {}; // Tracking of a last updated node
    
        let match;
        while ((match = nodePattern.exec(input)) !== null) {
            const layer = parseInt(match[0].match(/\d+L/)[0].slice(0, -1), 10);
            const nodeName = match[1].trim();
    
            // Adding node to the list if not already present
            if (!nodes.some(node => node.id === nodeName)) {
                nodes.push({ id: nodeName, isCentral: layer === 1, translated: false, translated_id: nodeName });
            }
    
            // Adding nodes based on layer
            nodeLayers[layer] = nodeLayers[layer] || [];
            nodeLayers[layer].push(nodeName);
    
            // Vertice to the last node in the previous layer
            if (layer > 1 && lastNode[layer - 1]) {
                links.push({ source: lastNode[layer - 1], target: nodeName });
            }
    
            lastNode[layer] = nodeName;
        }

        const new_data = {
            nodes, links
        };
        return new_data;
    }

    // Get ancestors of a node
    getAncestors(nodeId, ancestors) {
        for (const link of this.data.links){

            if (link.target.id === nodeId && ancestors.indexOf(link.source.id) === -1){
                
                ancestors.push(link.source.id);
                if (link.source.id == this.central_node){
                    return;
                }
                this.getAncestors(link.source.id, ancestors);
                
            }
        }
    }

    // Generate description prompt for AI
    generate_description_prompt(input){
        const ancestors = [input];
        this.getAncestors(input, ancestors);
        //console.log(ancestors);
        let additional_data_prompt = "";
        if (this.additional_data !== ""){
            additional_data_prompt = `Here is the additional information: ${this.additional_data}`;
        }
        const prompt = `
        ${additional_data_prompt}
        Here is the information I provided:
        ${ancestors.reverse().join(' -> ')}
        Please produce a detailed description of the ${input}
        `;

        return prompt;
    }

    // Generate description for a keyword
    async generate_description(keyword){
        // Check if the description already exists in the cache
        if (this.description_dict[keyword]) {
            this.content_element.innerHTML = this.description_dict[keyword];
            return;
        }

        // Set a loading indicator while waiting for the AI response
        this.content_element.innerHTML = "Loading description...";
        this.description_translater = new MarkdoneTranslater(this.main_content);
        this.description_translater.set_language(this.main_content.language);
        const { available } = await ai.languageModel.capabilities();
        if (available !== "no") {
            // Initialize session for generating description
            if (this.session) {
                this.session.destroy();
            }
            this.session = await ai.languageModel.create();
            this.main_content.sessions.push(this.session);

            // Generate the prompt
            const prompt = this.generate_description_prompt(keyword);
            //console.log(prompt);
            // Start streaming the AI response
            const stream = this.session.promptStreaming(prompt);
            for await (let chunk of stream) {
                //console.log(chunk);
                if (this.main_content.language!="en"){
                    chunk = await this.description_translater.translate_markdown(chunk);
                }
                // Update the content element as the response streams in
                this.content_element.innerHTML = marked.parse(chunk);
            }

            // Cache the description once fully loaded
            this.description_dict[keyword] = this.content_element.innerHTML;
        }
    }

    async edit_node(node,new_node){
        const func=async (p1, p2 = node,p3=new_node) => await this.updateNode(p1, p2,p3)
        this.previous_data = structuredClone(this.data);
        //console.log(this.previous_data);
        const ancestors = [node];
        
        this.getAncestors(node,ancestors);
        const additional_data = "Here is the information I provided: " + ancestors.reverse().join(' -> ');
        const new_data = await this.generate_graph_stream(new_node,func,additional_data,3);
        
    }
    async updateNode(new_data,node,new_node){
        //console.log(this.previous_data);
        //console.log(new_data);
        // Find the corresponding node in the new data
        // Update node id in previous data
        let previous_data = structuredClone(this.previous_data);
        
        // Update link target id in previous data 
        //let previous_links = previous_data.links;
        previous_data.links.forEach(l => {
            if(l.target.id == node) {
                l.target.id = new_node;
            }
        });
        previous_data.nodes.forEach(n => {
            if (n.id == node){
                n.id = new_node;
            }
        });
        // Remove nodes with target.id === new_node and their descendants
        const nodesToRemove = new Set();
        const findDescendants = (nodeId) => {
            previous_data.links.forEach(l => {
                if(l.source.id === nodeId) {
                    nodesToRemove.add(l.target.id);
                    findDescendants(l.target.id);
                }
            });
        };

        previous_data.links.forEach(l => {
            if(l.target.id == new_node) {
                //nodesToRemove.add(l.target.id);
                findDescendants(l.target.id);
            }
        });

        previous_data.nodes = previous_data.nodes.filter(n => !nodesToRemove.has(n.id));
        previous_data.links = previous_data.links.filter(l => !nodesToRemove.has(l.target.id));

        // Merge with new data
        new_data.nodes.forEach(node => {
            // if (node.isCentral) {
            //     node.id = new_node;
            // }
            node.isCentral = false;
        });
        new_data.nodes = new_data.nodes.filter(n => n.id != new_node);

        const update_data = {
            nodes: [...previous_data.nodes, ...new_data.nodes],
            links: [...previous_data.links, ...new_data.links]
        };
       
        await this.updateGraph(update_data);
        //console.log(this.data);
        
    }
}


document.body.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
class Graph {
    constructor(element,central_node) {
        this.central_node = central_node;
        this.data = {
          nodes: [ // all nodes
              { id: central_node, isCentral: true },
              
          ],
          links: [ // all nodes connections
              
          ]
        };
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scale = 1;
        this.mouse_move_speed = 0.01;
        this.element = element;
        this.svg = d3.select(element)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("overflow", "scroll");
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force("link", d3.forceLink(this.data.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));
        this.initinal_listener();
        this.initinal_graph();
        this.get_graph_data();
        this.svg.attr("viewBox", `${0} ${0} ${this.width} ${this.height}`);

        

        
    }
    initinal_listener() {
        this.element.addEventListener("wheel", (event) => {
    
            const delta = event.deltaY/100;
            const min_scale = 0.5;
            const newScale = Math.max(min_scale, this.scale + delta);
            console.log(newScale);
            const mouse_x = event.clientX - this.svg.node().getBoundingClientRect().left;
            const mouse_y = event.clientY - this.svg.node().getBoundingClientRect().top;
            const viewBox = this.svg.attr("viewBox").split(" ");
            const viewBoxX = parseFloat(viewBox[0]);
            const viewBoxY = parseFloat(viewBox[1]);
            const viewBoxWidth = parseFloat(viewBox[2]);
            const viewBoxHeight = parseFloat(viewBox[3]);
            console.log(viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight);
            const elementWidth = this.svg.node().clientWidth;
            const elementHeight = this.svg.node().clientHeight;
            const mouse_x_viewbox = viewBoxX + (mouse_x / elementWidth) * viewBoxWidth;
            const mouse_y_viewbox = viewBoxY + (mouse_y / elementHeight) * viewBoxHeight;
            this.change_size(newScale,mouse_x_viewbox,mouse_y_viewbox ,viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight);
        });
        
        this.element.addEventListener("mousedown", (event) => {
            this.is_dragging = true;
            this.mouse_x_temp = event.clientX;
            this.mouse_y_temp = event.clientY;
        });
        this.element.addEventListener("mousemove", (event) => {
            if (this.is_dragging) {
                const mouse_x_delta = -(event.clientX - this.mouse_x_temp)*this.scale;
                const mouse_y_delta = -(event.clientY - this.mouse_y_temp)*this.scale;
                this.mouse_x_temp = event.clientX;
                this.mouse_y_temp = event.clientY;
                const viewBox = this.svg.attr("viewBox").split(" ");
                const viewBoxX = parseFloat(viewBox[0])+mouse_x_delta;
                const viewBoxY = parseFloat(viewBox[1])+mouse_y_delta;
                const viewBoxWidth = parseFloat(viewBox[2]);
                const viewBoxHeight = parseFloat(viewBox[3]);
                this.svg.attr("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
            }
        });
        this.element.addEventListener("mouseup", (event) => {
            this.is_dragging = false;
        });
    }
    initinal_graph() {
        this.isHorizontal = false; // Change this for different layout

        if (this.isHorizontal) {
            this.simulation.force("x", d3.forceX().strength(0.1).x(d => d.isCentral ? this.width * 0.1 : this.width / 2))
                          .force("y", d3.forceY().strength(0.05).y(this.height / 2));
        } else {
            this.simulation.force("x", d3.forceX().strength(0.05).x(this.width / 2))
                          .force("y", d3.forceY().strength(0.1).y(d => d.isCentral ? this.height * 0.1 : this.height / 2));
        }
  
        this.link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.data.links)
            .enter().append("line")
            .attr("class", "link");
  
        this.node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(this.data.nodes)
            .enter().append("g")
            .attr("class", d => `node ${d.isCentral ? 'central' : ''}`);
  
        this.node.append("circle")
            .attr("r", d => d.isCentral ? 35 : 20)  // Larger size for central node
            .on("mouseover", function()
            {
                d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 40 : 25); // Can add more staff
            })
            .on("mouseout", function() 
            {
                d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 35 : 20); // Can add more staff
            });
  
        this.node.append("text")
            .attr("dy", -40)
            .attr("dx", -40)
            .text(d => d.id);
  
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

    updateGraph(newData) {
        this.data = newData;

        
        this.link = this.link.data(newData.links);
        this.link.exit().remove();
        this.link = this.link.enter().append("line").attr("class", "link").merge(this.link);

        
        this.node = this.node.data(newData.nodes);
        this.node.exit().remove();
        const nodeEnter = this.node.enter().append("g").attr("class", d => `node ${d.isCentral ? 'central' : ''}`);
        nodeEnter.append("circle")
            .attr("r", d => d.isCentral ? 35 : 20)
            .on("mouseover", function() {
                d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 40 : 25);
            })
            .on("mouseout", function() {
                d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 35 : 20);
            });
        nodeEnter.append("text")
            .attr("dy", -40)
            .attr("dx", -40)
            .text(d => d.id);
        this.node = nodeEnter.merge(this.node);

        this.simulation.nodes(newData.nodes);
        this.simulation.force("link").links(newData.links);
        this.simulation.alpha(1).restart();
    }

    change_size(scale,mouse_x,mouse_y,viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight) {
        
       
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
    async get_graph_data() {
        const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();

        if (available !== "no") {
            const session = await ai.languageModel.create();

    // Prompt the model and stream the result:

        const userInput = this.central_node;

        const prompt = `
When a user searches for a keyword, generate a structured response with the following requirements:

1. Each line must strictly follow this format: $NL$ ? $STP$, where:
   - $NL$ represents the level indicator, L means level (e.g., $1L$, $2L$, $3L$, etc.).
   - ? contains a single keyword or phrase related to the search.
   - $STP$ marks the end of each line.
   
2. Ensure that ? includes only one keyword or phrase per line, without any additional text or multiple keywords, each keyword must at most be 3 words!

3. Each line must include both $NL$ and $STP$.

4. The response should cover multiple levels and contain at least 10 lines.

5. $NL$ and $STP$ are special characters it is important to follow the format strictly don't include any other characters.

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


Ensure every line follows the exact format, with both $NL$ and $STP$ ($NL$ and $STP$ are special characters it is important to follow the format strictly don't include any other characters), and that there must be at least 10 lines!!!
Now User input: ${userInput} 
print $1L$ ${userInput} $STP$ as the first line!
`;

        const stream = session.promptStreaming(prompt);
        for await (const chunk of stream) {
            console.log(chunk);
            const new_data = this.transform_data(chunk);
            this.updateGraph(new_data);
            }
        }
    }

    transform_data(input) {
        const nodePattern = /\$?\d+L\$? (.*?) \$?[^a-zA-Z0-9]?STP\$?/g; /*To explain this gibberish: /.../g - start and end of the pattern. 
            \$? looks for $, but makes "$" optional. \d+ looks for a number (d is for digit, + means that there can be more than one digits)
            (.*?) - basically, .* will include any characters that are not white spaces after first part. To make it not include stop sign, 
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
                nodes.push({ id: nodeName, isCentral: layer === 1 });
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
}


const graph = new Graph(document.getElementsByClassName("graph")[0],"First Year Project");


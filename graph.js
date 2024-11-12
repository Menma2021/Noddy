

class Graph {
    constructor(element,central_node) {
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

        this.svg.attr("viewBox", `${0} ${0} ${600} ${600}`);

        

        
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
}


const graph = new Graph(document.getElementsByClassName("graph")[0],"Graph Theory");


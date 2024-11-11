

class Graph {
    constructor() {
        this.data = {
          nodes: [ // all nodes
              { id: "Algorithms and Data Structures", isCentral: true },
              { id: "Algorithms" },
              { id: "Data Structures" },
              { id: "Sorting Algorithms" },
              { id: "Binary Search" },
              { id: "Sliding Window" },
              { id: "Prefix Sum" },
              { id: "Arrays" },
              { id: "Hash Table" },
              { id: "Linked List" },
              { id: "Trees" },
              { id: "Two Pointer" }
          ],
          links: [ // all nodes connections
              { source: "Algorithms and Data Structures", target: "Algorithms" },
              { source: "Algorithms and Data Structures", target: "Data Structures" },
              { source: "Algorithms", target: "Sorting Algorithms" },
              { source: "Sorting Algorithms", target: "Binary Search" },
              { source: "Binary Search", target: "Two Pointer" },
              { source: "Binary Search", target: "Sliding Window" },
              { source: "Binary Search", target: "Prefix Sum" },
              { source: "Data Structures", target: "Arrays" },
              { source: "Arrays", target: "Hash Table" },
              { source: "Arrays", target: "Linked List" },
              { source: "Arrays", target: "Trees" }
          ]
        };
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.svg = d3.select(".graph")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("overflow", "scroll");
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force("link", d3.forceLink(this.data.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));
        this.initinal_graph();
        
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

        // 更新链接
        this.link = this.link.data(newData.links);
        this.link.exit().remove();
        this.link = this.link.enter().append("line").attr("class", "link").merge(this.link);

        // 更新节点
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
}
const graph = new Graph();
document.addEventListener("DOMContentLoaded", () => {
  

});
document.addEventListener("click", () => {
    const newData = {
        nodes: [...graph.data.nodes],
        links: [...graph.data.links]
    };
    newData.nodes.push({ id: "Graph Theory" });
    newData.links.push({ source: "Algorithms and Data Structures", target: "Graph Theory" });

    graph.updateGraph(newData);
});
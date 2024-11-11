function updateGraph(newData) {
    
    // Update links
    const link = svg.selectAll(".link")
        .data(newData.links, d => `${d.source.id}-${d.target.id}`);
    
    link.enter()
        .append("line")
        .attr("class", "link")
        .merge(link); // Merge existing links
    
    link.exit().remove(); // Remove excess links

    // Update nodes
    const node = svg.selectAll(".node")
        .data(data.nodes, d => d.id);

    const nodeEnter = node.enter()
        .append("g")
        .attr("class", d => `node ${d.isCentral ? 'central' : ''}`);

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

    nodeEnter.merge(node); // Merge existing nodes
    
    node.exit().remove(); // Remove excess nodes

    // Update force-directed graph simulation
    simulation.nodes(newData.nodes);
    simulation.force("link").links(newData.links);
    simulation.alpha(1).restart(); // Restart simulation to apply updates
}



// document.addEventListener("DOMContentLoaded", () => {
//     // light/dark mode adjustement
//     document.body.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

//     const data = {
//         nodes: [ // all nodes
//             { id: "Algorithms and Data Structures", isCentral: true },
//             { id: "Algorithms" },
//             { id: "Data Structures" },
//             { id: "Sorting Algorithms" },
//             { id: "Binary Search" },
//             { id: "Sliding Window" },
//             { id: "Prefix Sum" },
//             { id: "Arrays" },
//             { id: "Hash Table" },
//             { id: "Linked List" },
//             { id: "Trees" },
//             { id: "Two Pointer" }
//         ],
//         links: [ // all nodes connections
//             { source: "Algorithms and Data Structures", target: "Algorithms" },
//             { source: "Algorithms and Data Structures", target: "Data Structures" },
//             { source: "Algorithms", target: "Sorting Algorithms" },
//             { source: "Sorting Algorithms", target: "Binary Search" },
//             { source: "Binary Search", target: "Two Pointer" },
//             { source: "Binary Search", target: "Sliding Window" },
//             { source: "Binary Search", target: "Prefix Sum" },
//             { source: "Data Structures", target: "Arrays" },
//             { source: "Arrays", target: "Hash Table" },
//             { source: "Arrays", target: "Linked List" },
//             { source: "Arrays", target: "Trees" }
//         ]
//     };

//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     const svg = d3.select("body").append("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .style("overflow", "scroll");

//     const simulation = d3.forceSimulation(data.nodes)
//         .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
//         .force("charge", d3.forceManyBody().strength(-500))
//         .force("center", d3.forceCenter(width / 2, height / 2));

//     let isHorizontal = false; // Change this for different layout

//     if (isHorizontal) {
//         simulation.force("x", d3.forceX().strength(0.1).x(d => d.isCentral ? width * 0.1 : width / 2))
//                   .force("y", d3.forceY().strength(0.05).y(height / 2));
//     } else {
//         simulation.force("x", d3.forceX().strength(0.05).x(width / 2))
//                   .force("y", d3.forceY().strength(0.1).y(d => d.isCentral ? height * 0.1 : height / 2));
//     }

//     const link = svg.append("g")
//         .attr("class", "links")
//         .selectAll("line")
//         .data(data.links)
//         .enter().append("line")
//         .attr("class", "link");

//     const node = svg.append("g")
//         .attr("class", "nodes")
//         .selectAll("g")
//         .data(data.nodes)
//         .enter().append("g")
//         .attr("class", d => `node ${d.isCentral ? 'central' : ''}`);

//     node.append("circle")
//         .attr("r", d => d.isCentral ? 35 : 20)  // Larger size for central node
//         .on("mouseover", function()
//         {
//             d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 40 : 25); // Can add more staff
//         })
//         .on("mouseout", function() 
//         {
//             d3.select(this).transition().duration(200).attr("r", d => d.isCentral ? 35 : 20); // Can add more staff
//         });

//     node.append("text")
//         .attr("dy", -40)
//         .attr("dx", -40)
//         .text(d => d.id);

//     simulation.on("tick", () => {
//         link
//             .attr("x1", d => d.source.x)
//             .attr("y1", d => d.source.y)
//             .attr("x2", d => d.target.x)
//             .attr("y2", d => d.target.y);

//         node
//             .attr("transform", d => `translate(${d.x}, ${d.y})`);
//     });
// });

// document.addEventListener("click", () => {
//     const newData =  {
//         nodes: [ // all nodes
//             { id: "Algorithms and Data Structures", isCentral: true },
//             { id: "Algorithms" },
//             { id: "Data Structures" },
//             { id: "Sorting Algorithms" },
//             { id: "Binary Search" },
//             { id: "Sliding Window" },
//             { id: "Prefix Sum" },
//             { id: "Arrays" },
//             { id: "Hash Table" },
//             { id: "Linked List" },
//             { id: "Trees" },
//             { id: "Two Pointer" },
//             { id: "Binary Search Tree" }
//         ],
//         links: [ // all nodes connections
//             { source: "Algorithms and Data Structures", target: "Algorithms" },
//             { source: "Algorithms and Data Structures", target: "Data Structures" },
//             { source: "Algorithms", target: "Sorting Algorithms" },
//             { source: "Sorting Algorithms", target: "Binary Search" },
//             { source: "Binary Search", target: "Two Pointer" },
//             { source: "Binary Search", target: "Sliding Window" },
//             { source: "Binary Search", target: "Prefix Sum" },
//             { source: "Data Structures", target: "Arrays" },
//             { source: "Arrays", target: "Hash Table" },
//             { source: "Arrays", target: "Linked List" },
//             { source: "Arrays", target: "Trees" },
//             { source: "Trees", target: "Binary Search Tree" }
//         ]
//     };
//     updateGraph(newData);
// });
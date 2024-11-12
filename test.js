function parseNodeString(input) {
    const nodePattern = /\$?\d+L\$? (.*?) \$?[^a-zA-Z0-9]?STP\$?/g;
    const nodes = [];
    const links = [];
    const nodeLayers = {};
    const lastNode = {}; // Tracks the last node added for each layer

    let match;
    while ((match = nodePattern.exec(input)) !== null) {
        const layer = parseInt(match[0].match(/\d+L/)[0].slice(0, -1), 10);
        const nodeName = match[1].trim();

        // Add node to the list if not already present
        if (!nodes.some(node => node.id === nodeName)) {
            nodes.push({ id: nodeName, isCentral: layer === 1 });
        }

        // Track nodes by their layers
        nodeLayers[layer] = nodeLayers[layer] || [];
        nodeLayers[layer].push(nodeName);

        // Create a link to the last node in the previous layer (layer - 1)
        if (layer > 1 && lastNode[layer - 1]) {
            links.push({ source: lastNode[layer - 1], target: nodeName });
        }

        // Update the last node for the current layer
        lastNode[layer] = nodeName;
    }

    return {
        nodes,
        links
    };
}

export {parseNodeString};

// Example input string
const inputString = `$1L$ NodeName1 $STP$
$2L$ NodeName2 $STP$
$3L$ NodeName3 $STP$
$3L$ NodeName5 $STP$
$4L$ NodeName6 $STP$
$3L$ NodeName7 $STP$
$2L$ NodeName8 $STP$
$2L$ NodeName9 $STP$
$3L$ NodeName10 $STP$
$4L$ NodeName11 $STP$`;

// Run the function
const data = parseNodeString(inputString);
console.log(data);

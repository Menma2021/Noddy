/*
this is the main content of the page
it contains the graph
and summary of the graph
and the description of the each node
*/

class MainContent {
    constructor(root) {
        this.root = root;
        this.graph = new Graph(root);
    }
}
# Noddy: Dynamic Knowledge Graph Generator

## Overview
Noddy is a dynamic knowledge graph generator that simplifies exploring new topics. By entering a keyword or a phrase, Noddy instantly creates a customized knowledge graph, breaking down complex ideas into clear, manageable subtopics. The platform leverages AI-powered insights to provide detailed summaries for entire graphs and individual nodes, enhancing understanding and accessibility for users worldwide. 
This projects helps to:
- Bridge difficulty in exploring complex topics
- Fix overload of unorganized information
- Provide interactive and visual learning tools
- Have a deeper exploration of specific topic without wordcount limitations of AI

## Features

### Core Features
- **Dynamic Graph Generation**: Create intuitive, detailed knowledge graphs with a single keyword input.
- **AI-Powered Summaries**: Get distilled insights for entire graphs and individual nodes using advanced AI algorithms, simplifying complex ideas.

### Unique Features
- **Multilingual Support**: Generate input, diagrams, and summaries (backed up with the link to the related wikipedia page) in any language of your choice, breaking language barriers.
- **Extension Integration**: Quickly generate graphs by entering a keyword or a phrase into any search bar and pressing enter. The extension redirects users to the Noddy webpage, where the graph is instantly created.
- **Expandable Graphs**: Explore complex ideas by expanding specific nodes to generate connected knowledge graphs for deeper insights.

### Bonus Features
- **Adaptive Theme Mode**:
  - *Automatic Dark/Light Mode Adjustment*: Syncs with device settings to provide the best visual experience.
  - *Customizable Theme Options*: Manually toggle between dark and light modes for personalized use.
- **Interactive Diagram Movement**:
  - *Dynamic Behavior*: Fluid, organic movement of diagrams with responsive repositioning.
  - *Customizable Interaction*: Drag and zoom nodes for tailored layouts and focused exploration.
  - *Instant Keyword Editing*: Double-click on the nodes to expend the graph from that node for more details regarding specific subtopic.

## Installation

### Prerequisites
- **Browser**: For now, works only on *Google Chrome Dev* browser
- **APIs used**:
  - Language Detection API
  - Translation API
  - Prompt API
  - MediaWiki API
  - D3.js library for interactive graphs

### Steps to Set Up
1. Clone the repository:
   ```bash
   git clone https://github.com/Menma2021/GoogleAIChallenge.git
   cd Noddy
   ```
2. Install dependencies:
   Ensure that necessary features are insyalled: in Google Chrome Dev, go to *chrome://flags*, and install *Prompt API for Gemini Nano*, *Language detection web platform API* and *Experimental translation API*. More detailed installation proccess: *https://developer.chrome.com/docs/ai/built-in-apis*
3. Launch the application:
   Open `index.html` from a webpage folder in a Google Chrome Dev to access the platform.
4. If you want to use extension, go to chrome://extensions, toggle Developer mode and load the "plugin" folder through the "Load unpacked" button

## Usage
- **Search for a topic**:
  1. Enter a keyword/phrase in the search bar.
  2. Click on the extenstion pop-up that shows up, and the system redirects you to Noody page and generates a detailed knowledge graph with related subtopics.
  3. OR Open `index.html` and immidiately be redirected to the webpage

- **Explore the graph**:
  1. Drag nodes to rearrange the layout.
  2. Zoom in/out to focus on specific areas.
  3. Use toggle button to switch between dark and light modes

- **Expand a topic**:
  1. Double-click on a node to generate a new branches from that node with more information about the topic.
  2. Click on a node to generate a completely new graph with a keyword of a node you clicked on, related to the topic of your initial graph
  3. Click on a "+" button and input the topic you are interested in to generate a completely new graph
  4. If you don't need current graph anymore, click on trash can icon to delete the graph

- **Multilingual Summaries**:
  1. Input a keyword in your preferred language.
  2. Translate graphs and summaries into the language you chose.

## API Features
- **Prompt API**: Drives the app by using keyword-based prompts to generate graphs and summaries.
- **Language Detection API**: Automatically identifies the input language for tailored content.
- **Translation API**: Ensures multilingual accessibility by translating graphs and summaries.
- **MediaWiki API**: Provides direct links to relevant Wiki pages for further research.
- **D3.js**: Powers the creation of interactive, physics-based diagrams for an engaging user experience.

## Future Improvements
- Sign-in and Log-in system for the users
- Further enhance the UI/UX for seamless user experience.
- Integrate additional APIs for more diverse and enriched knowledge sources.
- Optimize performance for faster graph generation.

## Contribution
Contributions are welcome! If you have suggestions for improvements or encounter any issues, feel free to fork the repository, make changes, and submit a pull request.

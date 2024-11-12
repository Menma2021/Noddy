
async function test_ai() {
  const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();

  if (available !== "no") {
    const session = await ai.languageModel.create();

    // Prompt the model and stream the result:

    const userInput = "Bocchi the Rock! ";

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
    }
  }

  
    
}

test_ai();
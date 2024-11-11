
async function test_ai() {
  const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();

  if (available !== "no") {
    const session = await ai.languageModel.create();

    // Prompt the model and stream the result:
    const stream = session.promptStreaming("Write me an extra-long poem");
    for await (const chunk of stream) {
      console.log(chunk);
    }
  }

  
    
}

test_ai();
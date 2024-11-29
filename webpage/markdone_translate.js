

// Class for translating markdown content
class MarkdoneTranslater{
    constructor(main_content){
        this.translated_dict = {}; // Dictionary to store translated text
        this.main_content = main_content; // Reference to main content
    }

    // Set the target language for translation
    set_language(language){
        this.language = language;
    }

    // Translate individual text
    async translate_data(text){
        //console.log(text);
        // Return cached translation if available
        if (this.translated_dict[text]){
            return this.translated_dict[text];
        }
        // Translate if target language is not English
        if (this.language!="en"){
            const translated_text = await this.main_content.translate_data_back(text,this.language);
            this.translated_dict[text] = translated_text; // Cache the translation
            //console.log(translated_text);
            return translated_text;
        }
        return text; // Return original text if no translation needed
    }

    // Translate markdown content
    async translate_markdown(markdown){
        // Regex to match markdown syntax elements
        // Regular expression to match various Markdown syntax elements:
        // \*\* : Matches bold syntax "** " at start of text
        // `.*?`: Matches inline code blocks between backticks like `code`
        // #+\s : Matches heading syntax "# ", "## ", etc.
        // \* : Matches unordered list item "* "
        // >\s? : Matches blockquote syntax "> "
        // -\s : Matches alternative unordered list item "- "
        // [*\d]\.\s : Matches ordered list items like "1. ", "2. "
        // !\[.*?\]\(.*?\) : Matches image syntax like ![alt](url)
        // \[.*?\]\(.*?\) : Matches link syntax like [text](url)
        // : : Matches colons used in definitions
        // \r?\n : Matches line breaks
        // /g flag makes it match all occurrences globally
        
        // Examples of what this regex matches:
        // "** Bold text" -> matches "** "
        // "`const x = 1`" -> matches "`const x = 1`"
        // "# Heading" -> matches "# "
        // "* List item" -> matches "* "
        // "> Quote" -> matches "> "
        // "1. First item" -> matches "1. "
        // "![Image](test.jpg)" -> matches whole image tag
        // "[Link](url)" -> matches whole link tag
        const regex = /(\*\* |`.*?`|#+\s|\* |>\s?|-\s|[*\d]\.\s|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|:|\r?\n)/g

        // Split markdown into parts
        const markdownParts = markdown.split(regex); 
        if (!regex.test(markdownParts[markdownParts.length-1])){
            markdownParts.splice(-1);
        }
        // Translate each part
        const translatedParts = await Promise.all(
            markdownParts.map(async (part) => {
                //console.log(part);
                
                // Keep markdown syntax elements unchanged
                if (regex.test(part) || part.trim() === "") {
                    return part; 
                } else {
                    return await this.translate_data(part);
                }
            })
        );
        //console.log(translatedParts);
        // Join translated parts back into markdown
        const translatedMarkdown = translatedParts.join("");
        //console.log(translatedMarkdown);
        return translatedMarkdown;
    }
}
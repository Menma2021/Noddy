

class MarkdoneTranslater{
    constructor(main_content){
        this.translated_dict = {};
        this.main_content = main_content;
    }
    set_language(language){
        this.language = language;
    }
    async translate_data(text){
        console.log(text);
        if (this.translated_dict[text]){
            return this.translated_dict[text];
        }
        if (this.language!="en"){
            const translated_text = await this.main_content.translate_data_back(text,this.language);
            this.translated_dict[text] = translated_text;
            console.log(translated_text);
            return translated_text;
        }
        return text;
    }

    async translate_markdown(markdown){
        const regex = /(\*\* |`.*?`|#+\s|\* |>\s?|-\s|[*\d]\.\s|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|:|\r?\n)/g


        const markdownParts = markdown.split(regex); // 分割 Markdown 和普通文本
        const translatedParts = await Promise.all(
            markdownParts.map(async (part) => {
                console.log(part);
                
                if (regex.test(part) || part.trim() === "") {
                    return part; 
                } else {
                    return await this.translate_data(part);
                }
            })
        );
        console.log(translatedParts);
        const translatedMarkdown = translatedParts.join("");
        console.log(translatedMarkdown);
        return translatedMarkdown;
    }
}
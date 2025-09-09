import { ParagraphBlock } from "../types/types"

export function renderRichText(richTextArray: ParagraphBlock[]): string {
    return richTextArray.map(block => {
        if (block.type === 'paragraph') {
          const paragraphContent = block.children.map(child => {
            let text = child.text
            if (child.bold) text = `<strong>${text}</strong>`
            if (child.underline) text = `<u>${text}</u>`
            if (child.italic) text = `<em>${text}</em>`
            if (child.strikethrough) text = `<s>${text}</s>`
            return text
          }).join('')
    
          // Check if the paragraph contains only spaces followed by actual content
          const isCentered = block.children.some(child => child.text.trim() === '') && block.children.some(child => child.text.trim() !== '')
    
          // Ensure empty paragraphs are rendered to maintain spacing
          const style = `text-align: ${isCentered ? 'center' : 'left'}`
          return paragraphContent.trim() ? `<p style='${style}'>${paragraphContent}</p>` : '<p style="margin: 1em 0"></p>'
        }
        // Handle other block types if necessary
        return ''
      }).join('')
  }

  export function processHtml(htmlString: string) {
    // Replace empty paragraph tags with a space
    if (htmlString.length === 0) return '';
    return htmlString.replace(/<p><\/p>/g, '\n');
  }
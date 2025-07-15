import { convertToHTML } from 'draft-convert';
import { convertFromRaw } from 'draft-js';

export const getFontSizeFactor = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 767) { // Mobile
        return 0.78;
    } else if (windowWidth <= 1024) { // Tablet
        return 0.83;
    } else { // Web
        return 1;
    }
};

export const renderDescription = (description, fontSizeFactor) => {
    try {
      // Attempt to parse description as JSON
      const contentState = convertFromRaw(JSON.parse(description));
      
      // Convert DraftJS content state to HTML
      const html = convertToHTML({
        styleToHTML: (style) => {
          if (style.startsWith('color-')) {
            const color = style.replace('color-', '');
            return <span style={{ color }} />;
          }
          if (style.startsWith('fontsize-')) {
            const fontSize = style.replace('fontsize-', '') * fontSizeFactor;
            return <span style={{ fontSize: `${fontSize}px` }} />;
          }
        },
        blockToHTML: (block) => {
          if (block.type === 'unstyled') {
            const text = block.text;
            if (text === '') {
              return <br />;
            }
            return <p />;
          }
        },
        entityToHTML: (entity, originalText) => {
          if (entity.type === 'LINK') {
            const { url, targetOption } = entity.data;
            return <a href={url} target={targetOption || '_self'}>{originalText}</a>;
          }
          return originalText;
        },
      })(contentState);
  
      return html;
    } catch (e) {
      // console.error('Error converting description:', e);
  
      // If description is not JSON, treat it as plain text
      const isEmpty = description.trim().length === 0;
      return isEmpty ? '' : `<p>${description}</p>`;
    }
  };


export  const isRichTextEmpty = (richText) => {
    // Try to parse richText as JSON
    try {
      const content = JSON.parse(richText);
      // Check if content is in the expected DraftJS raw format
      if (content.blocks && Array.isArray(content.blocks)) {
        for (const block of content.blocks) {
          if (block.text.trim().length > 0) {
            return false;
          }
        }
        return true;
      } else {
        throw new Error('Not DraftJS raw content');
      }
    } catch (error) {
      // If parsing fails, treat richText as plain text
      return richText.trim().length === 0;
    }
  };

  export const change24to12Hr = (time) => {
    const [hours, minutes] = time.split(':');
    
      // Convert hours to 12-hour format
      let formattedHours = parseInt(hours, 10);
      const amPm = formattedHours >= 12 ? 'PM' : 'AM';
      formattedHours = formattedHours % 12 || 12; // Ensure 12 is displayed instead of 0 for 12:XX
  
      // Combine hours, minutes, and AM/PM indicator
      const formattedTime = `${formattedHours}:${minutes} ${amPm}`;
      return formattedTime
  }
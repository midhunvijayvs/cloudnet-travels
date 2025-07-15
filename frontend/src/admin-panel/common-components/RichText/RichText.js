import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, convertFromRaw  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichText.scss'



const RichTextEditor = ({ sectionId, onContentChange, initialContent, placeholder }) => {
  const [editorState, setEditorState] = useState(
    () => {
      if (initialContent) {
        try {
          const contentState = convertFromRaw(JSON.parse(initialContent));
          return EditorState.createWithContent(contentState);
        } catch (error) {
          return EditorState.createWithText(initialContent || '');
        }
      }
      return EditorState.createEmpty();
    }
  );

  useEffect(() => {
    if (initialContent) {
      try {
        const contentState = convertFromRaw(JSON.parse(initialContent));
        const newEditorState = EditorState.createWithContent(contentState);
  
        if (!editorState.getCurrentContent().hasText() || 
            JSON.stringify(convertToRaw(editorState.getCurrentContent())) !== initialContent) {
          setEditorState(newEditorState);
        }
      } catch (error) {
        if (editorState.getCurrentContent().getPlainText() !== (initialContent || '')) {
          setEditorState(EditorState.createWithText(initialContent || ''));
        }
      }
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [initialContent]);
  
  
  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);

    // Convert editor content to raw JSON and pass it to parent component
    const contentState = newEditorState.getCurrentContent();
    const content = JSON.stringify(convertToRaw(contentState));
    onContentChange(sectionId, content);
    
  };

  
  const toolBarOptions = {
    options: ['inline','link', 'list','fontSize','colorPicker'],
    inline: {
      options: ['bold', 'italic', 'underline'],
      className: 'custom-inline-toolbar',
    },
    blockType: {
      inDropdown: false,
      options: [ 'H1', 'H2', 'H3'],
      className: 'custom-blocktype-toolbar',
    },
    list: {
      options: ['unordered', 'ordered'],
      className: 'custom-list-toolbar',
    },
    fontSize: {
      options: [8, 9, 10, 11, 12, 14, 16, 18,23, 24,25,26,27,28,29,30,31,32,34, 36,38,40,42,44,46, 48, 50],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    colorPicker: {
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      colors: ['rgb(255,0,0)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
        'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
        'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
        'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
        'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
        'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
    },
    link: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      dropdownClassName: undefined,
      showOpenOptionOnHover: true,
      defaultTargetOption: '_self',
      options: ['link', 'unlink'],
      linkCallback: undefined
    },
  }

  
  return (
    <div className='rich-text-container'>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={toolBarOptions}
        placeholder={placeholder? placeholder : ''}
      />
    </div>
  );
};

export default RichTextEditor;

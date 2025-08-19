import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const theme = useColorModeValue('vs-light', 'vs-dark');

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineHeight: 1.5,
    padding: { top: 16, bottom: 16 },
    wordWrap: 'on' as const,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    renderWhitespace: 'selection' as const,
    smoothScrolling: true,
    cursorBlinking: 'smooth' as const,
    roundedSelection: true,
    renderLineHighlight: 'all' as const,
    folding: true,
    foldingStrategy: 'auto' as const,
    showFoldingControls: 'mouseover' as const,
    matchBrackets: 'always' as const,
    autoIndent: 'full' as const,
    formatOnPaste: true,
    formatOnType: true,
    suggest: {
      showKeywords: true,
      showSnippets: true,
    },
  };

  return (
    <Box h="full" w="full">
      <Editor
        height="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={handleEditorChange}
        options={editorOptions}
      />
    </Box>
  );
};

export default CodeEditor;
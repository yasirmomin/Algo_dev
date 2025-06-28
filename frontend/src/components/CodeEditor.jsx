import {Editor} from '@monaco-editor/react';
function CodeEditor({ code, setCode, language }) {
  return (
    <div className="border rounded shadow mt-4 ">
      <Editor
        height="60vh"
        width="1000px"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
        options={{
          fontSize: 18,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;
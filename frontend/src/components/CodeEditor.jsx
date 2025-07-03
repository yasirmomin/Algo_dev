import { Editor } from "@monaco-editor/react";

function CodeEditor({ code, setCode, language }) {
  return (
    <div className="rounded-xl shadow-md border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <Editor
        height="60vh"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
        options={{
          fontSize: 18,
          fontFamily: "Fira Code, monospace",
          minimap: { enabled: false },
          wordWrap: "on",
          wrappingIndent: "indent",
          smoothScrolling: true,
          tabSize: 2,
          automaticLayout: true,
          lineNumbers: "on",
          renderLineHighlight: "all",
          fixedOverflowWidgets: true,
          bracketPairColorization: true,
          cursorSmoothCaretAnimation: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;

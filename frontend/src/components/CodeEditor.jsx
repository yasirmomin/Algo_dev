import { Editor } from "@monaco-editor/react";

function CodeEditor({ code, setCode, language , theme }) {
  return (
    <div className="rounded-xl shadow-md border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <Editor
        height="50vh"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        theme={theme === "dark" ? "vs-dark" : "vs-light"} 
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

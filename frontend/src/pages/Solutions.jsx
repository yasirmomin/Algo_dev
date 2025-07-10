import ReactMarkdown from 'react-markdown';

export default function Solutions({ solutions }) {
  if (!solutions) return <p className="text-gray-500">No solution added by admin yet.</p>;

  return (
    <div
      className="
        dark:text-gray-200
        h-full
        overflow-y-scroll
        p-4
        rounded-xl
        border
        border-gray-200
        bg-white
        dark:border-gray-900
        dark:bg-black/50
        backdrop-blur
      "
    >
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>
          {solutions}
        </ReactMarkdown>
      </div>
    </div>
  );
}


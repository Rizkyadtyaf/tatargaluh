/**
 * A React component that displays a fallback UI when an image is not available.
 * 
 * @param {Object} props - The component props.
 * @param {string} [props.text='No Image'] - The text to display when the image is not present.
 */
export default function ImageFallback({ text = 'No Image' }: { text?: string }) {
  return (
    <div className="w-full h-full bg-surface-dark flex items-center justify-center text-gray-400">
      {text}
    </div>
  );
}

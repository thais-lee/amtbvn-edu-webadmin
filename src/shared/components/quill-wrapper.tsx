import { useCallback, useRef } from 'react';
import ReactQuill from 'react-quill-new';

const QuillWrapper = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const handleChange = useCallback(
    (content: string) => {
      onChange(content);
    },
    [onChange],
  );

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={handleChange}
      style={{ height: '200px', marginBottom: '50px' }}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
      }}
    />
  );
};

export default QuillWrapper;

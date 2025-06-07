import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import slugify from 'slugify';

interface SlugInputProps {
  value?: string;
  onChange?: (value: string) => void;
  prefix?: string;
  autoSlugFrom?: string;
  placeholder?: string;
}

const SlugInput: React.FC<SlugInputProps> = ({
  value = '',
  onChange,
  prefix = '',
  autoSlugFrom = '',
  placeholder = 'Enter slug',
}) => {
  const [body, setBody] = useState(value);

  // Auto-generate slug from source
  useEffect(() => {
    if (autoSlugFrom !== undefined) {
      const generated = slugify(autoSlugFrom, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      setBody(generated);
      if (onChange) onChange(generated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSlugFrom]);

  // Propagate changes up
  useEffect(() => {
    if (onChange) onChange(body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  return (
    <Input
      addonBefore={prefix}
      value={body}
      onChange={(e) => {
        const formatted = slugify(e.target.value, {
          lower: true,
          strict: true,
          locale: 'vi',
        });
        setBody(formatted);
      }}
      placeholder={placeholder}
    />
  );
};

export default SlugInput;

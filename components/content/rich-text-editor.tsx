'use client';

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Quote,
  Code,
  Eye,
  Edit3,
} from 'lucide-react';
import { Button, Tooltip } from 'antd';

interface RichTextEditorProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write or paste your HTML editorial content here...',
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('rich-text-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'Sample text';
    const replacement = `${openTag}${selectedText}${closeTag}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-1">
        <div className="flex items-center gap-1 flex-wrap">
          <Tooltip title="Bold">
            <Button
              type="text"
              size="small"
              icon={<Bold className="w-4 h-4" />}
              onClick={() => insertTag('<strong>', '</strong>')}
            />
          </Tooltip>
          <Tooltip title="Italic">
            <Button
              type="text"
              size="small"
              icon={<Italic className="w-4 h-4" />}
              onClick={() => insertTag('<em>', '</em>')}
            />
          </Tooltip>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <Tooltip title="Heading 1">
            <Button
              type="text"
              size="small"
              icon={<Heading1 className="w-4 h-4" />}
              onClick={() => insertTag('<h1>', '</h1>')}
            />
          </Tooltip>

          <Tooltip title="Heading 2">
            <Button
              type="text"
              size="small"
              icon={<Heading2 className="w-4 h-4" />}
              onClick={() => insertTag('<h2>', '</h2>')}
            />
          </Tooltip>

          <Tooltip title="Heading 3">
            <Button
              type="text"
              size="small"
              icon={<Heading3 className="w-4 h-4" />}
              onClick={() => insertTag('<h3>', '</h3>')}
            />
          </Tooltip>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <Tooltip title="Bullet List">
            <Button
              type="text"
              size="small"
              icon={<List className="w-4 h-4" />}
              onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            />
          </Tooltip>

          <Tooltip title="Numbered List">
            <Button
              type="text"
              size="small"
              icon={<ListOrdered className="w-4 h-4" />}
              onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
            />
          </Tooltip>

          <Tooltip title="Blockquote">
            <Button
              type="text"
              size="small"
              icon={<Quote className="w-4 h-4" />}
              onClick={() => insertTag('<blockquote>', '</blockquote>')}
            />
          </Tooltip>

          <Tooltip title="Hyperlink">
            <Button
              type="text"
              size="small"
              icon={<Link className="w-4 h-4" />}
              onClick={() => insertTag('<a href="https://example.com">', '</a>')}
            />
          </Tooltip>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type={activeTab === 'editor' ? 'primary' : 'text'}
            size="small"
            icon={<Edit3 className="w-3.5 h-3.5" />}
            onClick={() => setActiveTab('editor')}
            className={activeTab === 'editor' ? 'bg-slate-900 font-bold' : ''}
          >
            Edit
          </Button>

          <Button
            type={activeTab === 'preview' ? 'primary' : 'text'}
            size="small"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => setActiveTab('preview')}
            className={activeTab === 'preview' ? 'bg-slate-900 font-bold' : ''}
          >
            Live HTML Preview
          </Button>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'editor' ? (
        <textarea
          id="rich-text-textarea"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          rows={12}
          className="w-full p-4 bg-transparent outline-none font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 resize-y"
        />
      ) : (
        <div
          className="p-6 prose dark:prose-invert max-w-none min-h-[250px] text-xs text-slate-800 dark:text-slate-200"
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400 italic">No content to preview.</p>' }}
        />
      )}
    </div>
  );
};

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type {
  CvBuilderLayoutElement,
  CvBuilderThemeColorRole,
  CvTemplatePageSize,
  CvTemplateSectionDesignerElement,
} from '@/types/cv-template/cv_template_type';
import { pageSizes } from './cv-builder-defaults';

interface CvBuilderCanvasProps {
  pageSize: CvTemplatePageSize;
  elements: CvBuilderLayoutElement[];
  selectedElementId: string | null;
  onSelect: (elementId: string) => void;
  onChange: (element: CvBuilderLayoutElement) => void;
  onDelete: (elementId: string) => void;
  primaryColor: string;
  accentColor: string;
  onSaveDefaultLayout: () => void;
  isSavingDefaultLayout: boolean;
}

type ResizeDirection = 'right' | 'bottom' | 'corner';


const GithubIcon = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3" />
    <path d="M15 22v-3.9a3.4 3.4 0 0 0-.9-2.6c3 0 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.8 12.8 0 0 0-6.7 0C5.7.4 4.6.7 4.6.7a4.7 4.7 0 0 0-.1 3.6A5.1 5.1 0 0 0 3 7.9c0 5.1 3.1 6.6 6.1 6.6a3.4 3.4 0 0 0-.9 2.6V22" />
  </svg>
);

const LinkedinIcon = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const previewValues: Record<string, string> = {
  fullName: 'Your Name',
  professionalTitle: 'Software Engineer',
  email: '✉  example@gmail.com',
  phone: '☎  +1 2345 6789',
  location: '📍  #1 road, city/state-0011',
  summary:
    'I am a software engineer with experience in a variety of programming languages and a track record of delivering high-quality code. I am skilled in problem-solving and have a strong background in computer science. I am a strong communicator and enjoy working collaboratively with others.',
  experience:
    '<p><strong>Senior Software Developer</strong><br/>Company – Country <span style="float:right">Jan 2022 – Dec 2023</span></p><ul><li>Developed and maintained software using Java, Python, and C++</li><li>Led cross-functional teams to deliver successful software projects</li><li>write a work experience of a senior software engineer in bullet points</li></ul><p><strong>Web Developer</strong><br/>Company – Country <span style="float:right">Jan 2021 – Dec 2021</span></p><ul><li>Developed and maintained various web applications using languages such as HTML, CSS, JavaScript, and PHP</li><li>Worked with cross-functional teams to gather requirements and design user interfaces</li></ul>',
  education:
    '<p><strong>Masters in Software Engineering</strong></p><p>Jan 2019 – Dec 2020</p><p><em>XYX University, Bangalore</em></p><p><strong>Bachelor in Computer Science</strong></p><p>Jan 2015 – Dec 2018</p><p><em>XYX University, Bangalore</em></p>',
  skills: '<ul><li>SQL Database Management</li><li>Linux/Unix Command line</li><li>Python</li><li>C++</li><li>JAVA</li></ul>',
  languages: '<ul><li><strong>English:</strong> Proficient</li><li><strong>Hindi:</strong> Proficient</li></ul>',
  certificates: 'Project Management Professional (PMP)',
  projects: 'CRM Migration — Led planning, rollout, and training.',
  hobbies: '<ul><li>Writing</li><li>Cricket</li><li>Music</li></ul>',
  custom: '',
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isTextInputTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return ['input', 'textarea', 'select'].includes(tagName) || target.isContentEditable;
};

const getElementBounds = (params: {
  element: Pick<CvBuilderLayoutElement, 'width' | 'height'>;
  pageWidth: number;
  pageHeight: number;
}) => ({
  minX: 0,
  minY: 0,
  maxX: Math.max(0, params.pageWidth - params.element.width),
  maxY: Math.max(0, params.pageHeight - params.element.height),
});

const getResizeBounds = (params: {
  element: Pick<CvBuilderLayoutElement, 'x' | 'y'>;
  pageWidth: number;
  pageHeight: number;
}) => ({
  maxWidth: params.pageWidth - params.element.x,
  maxHeight: params.pageHeight - params.element.y,
});

const stripHtml = (value: string) =>
  value
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

const resolveThemeColor = (
  value: string | undefined,
  role: CvBuilderThemeColorRole | undefined,
  primaryColor: string,
  accentColor: string,
) => {
  if (role === 'primary') return primaryColor;
  if (role === 'accent') return accentColor;
  return value;
};

export default function CvBuilderCanvas({
  pageSize,
  elements,
  selectedElementId,
  onSelect,
  onChange,
  onDelete,
  primaryColor,
  accentColor,
  onSaveDefaultLayout,
  isSavingDefaultLayout,
}: CvBuilderCanvasProps) {
  const page = pageSizes[pageSize];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);

  useEffect(() => {
    const updateScale = () => {
      const width = containerRef.current?.clientWidth ?? 900;
      const available = Math.max(width - 40, 420);
      setScale(Math.min(0.9, available / page.width));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [page.width]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selectedElementId || isTextInputTarget(event.target)) return;
      const selectedElement = elements.find((element) => element.id === selectedElementId);
      if (!selectedElement || selectedElement.locked) return;

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        onDelete(selectedElement.id);
        return;
      }

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;

      event.preventDefault();
      const distance = event.shiftKey ? 10 : 1;
      const movement = {
        ArrowUp: { x: 0, y: -distance },
        ArrowDown: { x: 0, y: distance },
        ArrowLeft: { x: -distance, y: 0 },
        ArrowRight: { x: distance, y: 0 },
      }[event.key] ?? { x: 0, y: 0 };

      const bounds = getElementBounds({
        element: selectedElement,
        pageWidth: page.width,
        pageHeight: page.height,
      });

      onChange({
        ...selectedElement,
        x: clamp(selectedElement.x + movement.x, bounds.minX, bounds.maxX),
        y: clamp(selectedElement.y + movement.y, bounds.minY, bounds.maxY),
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [elements, onChange, onDelete, page.height, page.width, selectedElementId]);

  const sortedElements = useMemo(
    () => [...elements].sort((first, second) => first.zIndex - second.zIndex),
    [elements],
  );

  return (
    <div
      ref={containerRef}
      className="min-h-[calc(100vh-220px)] overflow-auto rounded-[30px] bg-[#E9E9E2] p-6"
    >
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={onSaveDefaultLayout}
          disabled={isSavingDefaultLayout}
          className="rounded-full bg-[#006B3F] px-5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#005231] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSavingDefaultLayout ? 'Saving default...' : 'Save as Default Layout'}
        </button>
      </div>
      <div
        className="mx-auto origin-top"
        style={{ width: page.width * scale, height: page.height * scale }}
      >
        <div
          className="relative bg-white shadow-2xl"
          style={{
            width: page.width,
            height: page.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {sortedElements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              primaryColor={primaryColor}
              accentColor={accentColor}
              pageHeight={page.height}
              pageWidth={page.width}
              scale={scale}
              selected={selectedElementId === element.id}
              onSelect={onSelect}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CanvasElement({
  element,
  primaryColor,
  accentColor,
  pageHeight,
  pageWidth,
  scale,
  selected,
  onSelect,
  onChange,
}: {
  element: CvBuilderLayoutElement;
  primaryColor: string;
  accentColor: string;
  pageHeight: number;
  pageWidth: number;
  scale: number;
  selected: boolean;
  onSelect: (elementId: string) => void;
  onChange: (element: CvBuilderLayoutElement) => void;
}) {
  const isHorizontalLine = element.type === 'horizontalLine' || element.type === 'line';
  const isVerticalLine = element.type === 'verticalLine';
  const lineWidth = Math.max(1, element.style.borderWidth ?? (isVerticalLine ? element.width : element.height) ?? 2);
  const resolvedTextColor = resolveThemeColor(
    element.style.color,
    element.style.colorRole,
    primaryColor,
    accentColor,
  );
  const resolvedFillColor = resolveThemeColor(
    element.style.backgroundColor,
    element.style.backgroundColorRole,
    primaryColor,
    accentColor,
  );
  const resolvedBorderColor = resolveThemeColor(
    element.style.borderColor,
    element.style.borderColorRole,
    primaryColor,
    accentColor,
  );

  const baseStyle: CSSProperties = {
    left: element.x,
    top: element.y,
    width: isVerticalLine ? lineWidth : element.width,
    height: isHorizontalLine ? lineWidth : element.height,
    zIndex: element.zIndex,
    color: resolvedTextColor,
    backgroundColor:
      isHorizontalLine || isVerticalLine
        ? resolvedBorderColor ?? resolvedFillColor ?? '#111827'
        : resolvedFillColor,
    borderColor: resolvedBorderColor ?? 'transparent',
    borderWidth: isHorizontalLine || isVerticalLine ? 0 : element.style.borderWidth ?? 0,
    borderStyle: 'solid',
    borderRadius: element.type === 'circle' ? '9999px' : element.style.borderRadius ?? 0,
    fontFamily: element.style.fontFamily,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    textAlign: element.style.textAlign,
    lineHeight: element.style.lineHeight,
    opacity: element.style.opacity,
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (element.locked || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.dataset.resizeHandle === 'true') return;

    event.preventDefault();
    event.stopPropagation();
    onSelect(element.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = element.x;
    const startTop = element.y;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / scale;
      const dy = (moveEvent.clientY - startY) / scale;
      const bounds = getElementBounds({ element, pageWidth, pageHeight });

      onChange({
        ...element,
        x: clamp(Math.round(startLeft + dx), bounds.minX, bounds.maxX),
        y: clamp(Math.round(startTop + dy), bounds.minY, bounds.maxY),
      });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const resize = (direction: ResizeDirection, event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(element.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = element.width;
    const startHeight = element.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / scale;
      const dy = (moveEvent.clientY - startY) / scale;
      const resizeBounds = getResizeBounds({ element, pageWidth, pageHeight });

      if (element.type === 'circle') {
        const size = clamp(
          Math.round(Math.max(startWidth + dx, startHeight + dy, 24)),
          24,
          Math.min(resizeBounds.maxWidth, resizeBounds.maxHeight),
        );
        onChange({ ...element, width: size, height: size });
        return;
      }

      if (isHorizontalLine) {
        const width = direction === 'right' || direction === 'corner' ? startWidth + dx : startWidth;
        onChange({
          ...element,
          width: clamp(Math.round(width), 12, resizeBounds.maxWidth),
          height: lineWidth,
          style: { ...element.style, borderWidth: lineWidth },
        });
        return;
      }

      if (isVerticalLine) {
        const height = direction === 'bottom' || direction === 'corner' ? startHeight + dy : startHeight;
        onChange({
          ...element,
          width: lineWidth,
          height: clamp(Math.round(height), 12, resizeBounds.maxHeight),
          style: { ...element.style, borderWidth: lineWidth },
        });
        return;
      }

      const width = direction === 'right' || direction === 'corner' ? startWidth + dx : startWidth;
      const height = direction === 'bottom' || direction === 'corner' ? startHeight + dy : startHeight;
      onChange({
        ...element,
        width: clamp(Math.round(width), 24, resizeBounds.maxWidth),
        height: clamp(Math.round(height), 12, resizeBounds.maxHeight),
      });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      onPointerDown={startDrag}
      className={`absolute ${selected ? 'overflow-visible' : 'overflow-hidden'} ${element.locked ? 'cursor-not-allowed' : 'cursor-move'} ${
        selected ? 'ring-2 ring-[#006B3F] ring-offset-2' : ''
      }`}
      style={baseStyle}
    >
      <ElementContent element={element} primaryColor={primaryColor} accentColor={accentColor} />
      {selected ? (
        <>
          {!isVerticalLine ? (
            <span
              data-resize-handle="true"
              onPointerDown={(event) => resize('right', event)}
              className="absolute right-0 top-0 z-30 h-full w-2 cursor-ew-resize bg-[#006B3F]/20 hover:bg-[#006B3F]/40"
            />
          ) : null}
          {!isHorizontalLine ? (
            <span
              data-resize-handle="true"
              onPointerDown={(event) => resize('bottom', event)}
              className="absolute bottom-0 left-0 z-30 h-2 w-full cursor-ns-resize bg-[#006B3F]/20 hover:bg-[#006B3F]/40"
            />
          ) : null}
          <span
            data-resize-handle="true"
            onPointerDown={(event) => resize('corner', event)}
            className="absolute bottom-0 right-0 z-40 size-4 cursor-nwse-resize rounded-full border-2 border-[#006B3F] bg-white shadow"
          />
        </>
      ) : null}
    </div>
  );
}

function ElementContent({ element, primaryColor, accentColor }: { element: CvBuilderLayoutElement; primaryColor: string; accentColor: string }) {
  if (
    element.type === 'rectangle' ||
    element.type === 'circle' ||
    element.type === 'horizontalLine' ||
    element.type === 'verticalLine' ||
    element.type === 'line'
  ) {
    return null;
  }

  if (element.type === 'section') {
    if (element.sectionDesignerJson?.elements?.length) {
      return <SectionDesignerPreview element={element} primaryColor={primaryColor} accentColor={accentColor} />;
    }

    return (
      <div className="flex h-full w-full flex-col gap-1 p-1.5 leading-tight">
        <span className="w-fit rounded bg-[#E6F6F0] px-2 py-1 text-[0.68em] font-black uppercase text-[#006B3F]">
          Auto form section
        </span>
        <strong className="text-sm">{element.label}</strong>
        <span className="text-xs opacity-60">
          User fields from this designed section will render here and auto-flow to a new page when content is long.
        </span>
      </div>
    );
  }

  if (element.type === 'icon') {
    return <div className="flex h-full w-full items-center justify-center"><IconGraphic name={element.iconName ?? 'linkedin'} className="shrink-0" style={{ width: element.style.fontSize ?? Math.min(element.width, element.height) * 0.7, height: element.style.fontSize ?? Math.min(element.width, element.height) * 0.7 }} /></div>;
  }

  const value = previewValues[element.contentBinding?.fieldKey ?? element.fieldKey] ?? element.placeholder;

  if (element.type === 'list') {
    const items = stripHtml(value).split(/\n+/).map((item) => item.replace(/^•\s*/, '').trim()).filter(Boolean);
    const isNumberList = element.listStyle === 'number';
    const ListTag = isNumberList ? 'ol' : 'ul';
    return (
      <ListTag
        className="h-full w-full overflow-hidden p-0.5 leading-tight"
        style={{
          listStylePosition: 'inside',
          listStyleType: isNumberList ? 'decimal' : 'disc',
        }}
      >
        {items.length ? items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>) : <li>{element.label}</li>}
      </ListTag>
    );
  }

  if (element.type === 'dynamicItems') {
    return <div className="h-full w-full whitespace-pre-line p-0.5 leading-tight">{stripHtml(value)}</div>;
  }

  if (element.type === 'textarea' || element.richTextFormat === 'html') {
    const htmlValue = value.trim().startsWith('<') ? value : stripHtml(value);

    return (
      <div className="h-full w-full overflow-hidden p-0.5 leading-tight [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: htmlValue }} />
    );
  }

  return (
    <div className="h-full w-full whitespace-pre-line p-0.5 leading-tight">
      {stripHtml(value)}
    </div>
  );
}

function SectionDesignerPreview({ element, primaryColor, accentColor }: { element: CvBuilderLayoutElement; primaryColor: string; accentColor: string }) {
  const designerJson = element.sectionDesignerJson;
  if (!designerJson) return null;

  const scaleX = element.width / designerJson.canvas.width;
  const scaleY = element.height / designerJson.canvas.height;

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden bg-transparent">
      {designerJson.elements
        .slice()
        .sort((first, second) => first.zIndex - second.zIndex)
        .map((child) => (
          <SectionPreviewElement key={child.id} element={child} scaleX={scaleX} scaleY={scaleY} primaryColor={primaryColor} accentColor={accentColor} />
        ))}
    </div>
  );
}

function SectionPreviewElement({ element, scaleX, scaleY, primaryColor, accentColor }: { element: CvTemplateSectionDesignerElement; scaleX: number; scaleY: number; primaryColor: string; accentColor: string }) {
  const isHorizontalLine = element.type === 'horizontalLine' || element.type === 'line';
  const isVerticalLine = element.type === 'verticalLine';
  const lineWidth = Math.max(1, element.style.borderWidth ?? 2);
  const resolvedTextColor = resolveThemeColor(element.style.color, element.style.colorRole, primaryColor, accentColor);
  const resolvedFillColor = resolveThemeColor(element.style.backgroundColor, element.style.backgroundColorRole, primaryColor, accentColor);
  const resolvedBorderColor = resolveThemeColor(element.style.borderColor, element.style.borderColorRole, primaryColor, accentColor);
  const style: CSSProperties = {
    left: element.x * scaleX,
    top: element.y * scaleY,
    width: (isVerticalLine ? lineWidth : element.width) * scaleX,
    height: (isHorizontalLine ? lineWidth : element.height) * scaleY,
    zIndex: element.zIndex,
    color: resolvedTextColor,
    backgroundColor: isHorizontalLine || isVerticalLine ? resolvedBorderColor ?? '#111827' : resolvedFillColor,
    borderColor: resolvedBorderColor ?? 'transparent',
    borderWidth: isHorizontalLine || isVerticalLine ? 0 : element.style.borderWidth ?? 0,
    borderStyle: 'solid',
    borderRadius: element.type === 'circle' ? '9999px' : element.style.borderRadius ?? 0,
    fontFamily: element.style.fontFamily,
    fontSize: (element.style.fontSize ?? 12) * Math.min(scaleX, scaleY),
    fontWeight: element.style.fontWeight,
    fontStyle: element.style.fontStyle,
    textAlign: element.style.textAlign,
    overflow: 'hidden',
  };

  return (
    <div className="absolute" style={style}>
      <SectionPreviewContent element={element} />
    </div>
  );
}

function SectionPreviewContent({ element }: { element: CvTemplateSectionDesignerElement }) {
  if (element.type === 'rectangle' || element.type === 'horizontalLine' || element.type === 'verticalLine' || element.type === 'line') return null;
  if (element.type === 'circle' && element.isField && element.previewValue.startsWith('http')) return <img src={element.previewValue} alt="Section preview" className="h-full w-full object-cover" />;
  if (element.type === 'circle') return null;
  if (element.type === 'icon') return <div className="flex h-full w-full items-center justify-center"><IconGraphic name={element.iconName ?? 'linkedin'} className="shrink-0" style={{ width: element.style.fontSize ?? Math.min(element.width, element.height) * 0.7, height: element.style.fontSize ?? Math.min(element.width, element.height) * 0.7 }} /></div>;
  if (element.type === 'list') {
    const items = stripHtml(element.previewValue || '').split(/\n+/).map((item) => item.replace(/^•\s*/, '').trim()).filter(Boolean);
    const isNumberList = element.listStyle === 'number';
    const ListTag = isNumberList ? 'ol' : 'ul';
    return (
      <ListTag
        className="h-full w-full overflow-hidden p-0.5 leading-tight"
        style={{
          listStylePosition: 'inside',
          listStyleType: isNumberList ? 'decimal' : 'disc',
        }}
      >
        {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ListTag>
    );
  }
  if (element.type === 'dynamicItems') return <div className="h-full w-full overflow-hidden whitespace-pre-line p-0.5 leading-tight">{element.previewValue || element.label}</div>;
  if (element.type === 'textarea' || element.richTextFormat === 'html') return <div className="h-full w-full overflow-hidden p-0.5 leading-tight [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: element.previewValue || '' }} />;
  const content = <div className="h-full w-full whitespace-pre-line p-0.5 leading-tight">{element.previewValue || element.label}</div>;
  return element.hyperlink ? <a href={element.hyperlink} target="_blank" rel="noreferrer" className="block h-full w-full">{content}</a> : content;
}

function IconGraphic({ name, className, style }: { name: 'github' | 'linkedin' | 'weblink' | 'phone' | 'location' | 'email'; className?: string; style?: CSSProperties }) {
  if (name === 'github') return <GithubIcon className={className} style={style} />;
  if (name === 'linkedin') return <LinkedinIcon className={className} style={style} />;
  if (name === 'phone') return <Phone className={className} style={style} />;
  if (name === 'location') return <MapPin className={className} style={style} />;
  if (name === 'email') return <Mail className={className} style={style} />;
  return <Globe className={className} style={style} />;
}

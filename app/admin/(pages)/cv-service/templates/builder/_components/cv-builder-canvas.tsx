'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type {
  CvBuilderLayoutElement,
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
}

type ResizeDirection = 'right' | 'bottom' | 'corner';


const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
  fullName: 'Emily Carter',
  professionalTitle: 'Project Manager',
  email: 'emily.carter@email.com',
  phone: '+1 416 555 2847',
  location: 'Toronto, Canada',
  summary:
    'Project manager with six years of experience coordinating cross-functional initiatives. This block is marked as dynamic and can grow when user content is longer.',
  experience: 'Northbridge Digital — Project Manager\n• Managed releases and reporting.\n• Improved delivery timelines.',
  education: 'Bachelor of Commerce in Management',
  skills: 'Project Planning • Stakeholder Management • Agile Delivery',
  languages: 'English • French',
  certificates: 'Project Management Professional (PMP)',
  projects: 'CRM Migration — Led planning, rollout, and training.',
  custom: '',
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isTextInputTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return ['input', 'textarea', 'select'].includes(tagName) || target.isContentEditable;
};

export default function CvBuilderCanvas({
  pageSize,
  elements,
  selectedElementId,
  onSelect,
  onChange,
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
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;

      const selectedElement = elements.find((element) => element.id === selectedElementId);
      if (!selectedElement || selectedElement.locked) return;

      event.preventDefault();
      const distance = event.shiftKey ? 10 : 1;
      const movement = {
        ArrowUp: { x: 0, y: -distance },
        ArrowDown: { x: 0, y: distance },
        ArrowLeft: { x: -distance, y: 0 },
        ArrowRight: { x: distance, y: 0 },
      }[event.key] ?? { x: 0, y: 0 };

      onChange({
        ...selectedElement,
        x: clamp(selectedElement.x + movement.x, 0, page.width - selectedElement.width),
        y: clamp(selectedElement.y + movement.y, 0, page.height - selectedElement.height),
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [elements, onChange, page.height, page.width, selectedElementId]);

  const sortedElements = useMemo(
    () => [...elements].sort((first, second) => first.zIndex - second.zIndex),
    [elements],
  );

  return (
    <div
      ref={containerRef}
      className="min-h-[calc(100vh-220px)] overflow-auto rounded-[30px] bg-[#E9E9E2] p-6"
    >
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
  pageHeight,
  pageWidth,
  scale,
  selected,
  onSelect,
  onChange,
}: {
  element: CvBuilderLayoutElement;
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

  const baseStyle: CSSProperties = {
    left: element.x,
    top: element.y,
    width: isVerticalLine ? lineWidth : element.width,
    height: isHorizontalLine ? lineWidth : element.height,
    zIndex: element.zIndex,
    color: element.style.color,
    backgroundColor:
      isHorizontalLine || isVerticalLine
        ? element.style.borderColor ?? element.style.backgroundColor ?? '#111827'
        : element.style.backgroundColor,
    borderColor: element.style.borderColor ?? 'transparent',
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
      onChange({
        ...element,
        x: clamp(Math.round(startLeft + dx), 0, pageWidth - element.width),
        y: clamp(Math.round(startTop + dy), 0, pageHeight - element.height),
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

      if (element.type === 'circle') {
        const size = clamp(
          Math.round(Math.max(startWidth + dx, startHeight + dy, 24)),
          24,
          Math.min(pageWidth - element.x, pageHeight - element.y),
        );
        onChange({ ...element, width: size, height: size });
        return;
      }

      if (isHorizontalLine) {
        const width = direction === 'right' || direction === 'corner' ? startWidth + dx : startWidth;
        onChange({
          ...element,
          width: clamp(Math.round(width), 12, pageWidth - element.x),
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
          height: clamp(Math.round(height), 12, pageHeight - element.y),
          style: { ...element.style, borderWidth: lineWidth },
        });
        return;
      }

      const width = direction === 'right' || direction === 'corner' ? startWidth + dx : startWidth;
      const height = direction === 'bottom' || direction === 'corner' ? startHeight + dy : startHeight;
      onChange({
        ...element,
        width: clamp(Math.round(width), 24, pageWidth - element.x),
        height: clamp(Math.round(height), 12, pageHeight - element.y),
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
      className={`absolute overflow-hidden ${element.locked ? 'cursor-not-allowed' : 'cursor-move'} ${
        selected ? 'ring-2 ring-[#006B3F] ring-offset-2' : ''
      }`}
      style={baseStyle}
    >
      <ElementContent element={element} />
      {selected ? (
        <>
          {!isVerticalLine ? (
            <span
              data-resize-handle="true"
              onPointerDown={(event) => resize('right', event)}
              className="absolute right-0 top-1/2 h-10 w-2 -translate-y-1/2 cursor-ew-resize bg-[#006B3F]"
            />
          ) : null}
          {!isHorizontalLine ? (
            <span
              data-resize-handle="true"
              onPointerDown={(event) => resize('bottom', event)}
              className="absolute bottom-0 left-1/2 h-2 w-10 -translate-x-1/2 cursor-ns-resize bg-[#006B3F]"
            />
          ) : null}
          <span
            data-resize-handle="true"
            onPointerDown={(event) => resize('corner', event)}
            className="absolute bottom-0 right-0 size-4 cursor-nwse-resize bg-[#006B3F]"
          />
        </>
      ) : null}
    </div>
  );
}

function ElementContent({ element }: { element: CvBuilderLayoutElement }) {
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
      return <SectionDesignerPreview element={element} />;
    }

    return (
      <div className="flex h-full w-full flex-col gap-2 p-3 leading-tight">
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
    return <div className="flex h-full w-full items-center justify-center"><IconGraphic name={element.iconName ?? 'linkedin'} className="h-[70%] w-[70%]" /></div>;
  }

  const value = previewValues[element.contentBinding?.fieldKey ?? element.fieldKey] ?? element.placeholder;

  if (element.type === 'textarea' || element.richTextFormat === 'html') {
    return (
      <div className="h-full w-full overflow-hidden p-2 leading-tight">
        {element.contentBinding?.autoHeight ? (
          <span className="rounded bg-[#E6F6F0] px-1 text-[0.68em] font-black uppercase text-[#006B3F]">
            Auto flow
          </span>
        ) : null}
        <div className={element.contentBinding?.autoHeight ? 'mt-1' : ''} dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    );
  }

  return (
    <div className="h-full w-full whitespace-pre-line p-2 leading-tight">
      {element.contentBinding?.autoHeight ? (
        <span className="rounded bg-[#E6F6F0] px-1 text-[0.68em] font-black uppercase text-[#006B3F]">
          Auto flow
        </span>
      ) : null}
      <div className={element.contentBinding?.autoHeight ? 'mt-1' : ''}>{value}</div>
    </div>
  );
}

function SectionDesignerPreview({ element }: { element: CvBuilderLayoutElement }) {
  const designerJson = element.sectionDesignerJson;
  if (!designerJson) return null;

  const scaleX = element.width / designerJson.canvas.width;
  const scaleY = element.height / designerJson.canvas.height;

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      {designerJson.elements
        .slice()
        .sort((first, second) => first.zIndex - second.zIndex)
        .map((child) => (
          <SectionPreviewElement key={child.id} element={child} scaleX={scaleX} scaleY={scaleY} />
        ))}
    </div>
  );
}

function SectionPreviewElement({ element, scaleX, scaleY }: { element: CvTemplateSectionDesignerElement; scaleX: number; scaleY: number }) {
  const isHorizontalLine = element.type === 'horizontalLine' || element.type === 'line';
  const isVerticalLine = element.type === 'verticalLine';
  const lineWidth = Math.max(1, element.style.borderWidth ?? 2);
  const style: CSSProperties = {
    left: element.x * scaleX,
    top: element.y * scaleY,
    width: (isVerticalLine ? lineWidth : element.width) * scaleX,
    height: (isHorizontalLine ? lineWidth : element.height) * scaleY,
    zIndex: element.zIndex,
    color: element.style.color,
    backgroundColor: isHorizontalLine || isVerticalLine ? element.style.borderColor ?? '#111827' : element.style.backgroundColor,
    borderColor: element.style.borderColor ?? 'transparent',
    borderWidth: isHorizontalLine || isVerticalLine ? 0 : element.style.borderWidth ?? 0,
    borderStyle: 'solid',
    borderRadius: element.type === 'circle' ? '9999px' : element.style.borderRadius ?? 0,
    fontFamily: element.style.fontFamily,
    fontSize: (element.style.fontSize ?? 12) * Math.min(scaleX, scaleY),
    fontWeight: element.style.fontWeight,
    fontStyle: element.style.fontStyle,
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
  if (element.type === 'icon') return <div className="flex h-full w-full items-center justify-center"><IconGraphic name={element.iconName ?? 'linkedin'} className="h-[70%] w-[70%]" /></div>;
  if (element.type === 'textarea' || element.richTextFormat === 'html') return <div className="h-full w-full overflow-hidden p-1 leading-tight" dangerouslySetInnerHTML={{ __html: element.previewValue || '' }} />;
  const content = <div className="h-full w-full whitespace-pre-line p-1 leading-tight">{element.previewValue || element.label}</div>;
  return element.hyperlink ? <a href={element.hyperlink} target="_blank" rel="noreferrer" className="block h-full w-full">{content}</a> : content;
}

function IconGraphic({ name, className }: { name: 'github' | 'linkedin' | 'weblink' | 'phone' | 'location' | 'email'; className?: string }) {
  if (name === 'github') return <GithubIcon className={className} />;
  if (name === 'linkedin') return <LinkedinIcon className={className} />;
  if (name === 'phone') return <Phone className={className} />;
  if (name === 'location') return <MapPin className={className} />;
  if (name === 'email') return <Mail className={className} />;
  return <Globe className={className} />;
}

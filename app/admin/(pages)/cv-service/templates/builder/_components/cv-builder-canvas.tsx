'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import type { CvBuilderLayoutElement, CvTemplatePageSize } from '@/types/cv-template/cv_template_type';
import { pageSizes } from './cv-builder-defaults';

interface CvBuilderCanvasProps {
  pageSize: CvTemplatePageSize;
  elements: CvBuilderLayoutElement[];
  selectedElementId: string | null;
  onSelect: (elementId: string) => void;
  onChange: (element: CvBuilderLayoutElement) => void;
}

const previewValues: Record<string, string[]> = {
  fullName: ['Emily Carter'],
  professionalTitle: ['Project Manager'],
  email: ['Toronto, Canada  •  emily.carter@email.com  •  +1 416 555 2847'],
  phone: ['+1 416 555 2847'],
  location: ['Toronto, Canada'],
  summary: [
    'Project manager with six years of experience coordinating cross-functional initiatives, stakeholder communication, and delivery planning.',
  ],
  experience: ['Northbridge Digital — Project Manager', 'Managed releases and stakeholder reporting.', 'Improved delivery timelines by streamlining team handoffs.'],
  education: ['Bachelor of Commerce in Management', 'Toronto Metropolitan University'],
  skills: ['Project Planning', 'Stakeholder Management', 'Risk Management', 'Agile Delivery'],
  languages: ['English', 'French'],
  certificates: ['Project Management Professional (PMP)'],
  projects: ['CRM Migration — Led planning, rollout, and training.'],
  custom: [],
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

  const sortedElements = useMemo(
    () => [...elements].sort((first, second) => first.zIndex - second.zIndex),
    [elements],
  );

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-220px)] overflow-auto rounded-[30px] bg-[#E9E9E2] p-6">
      <div className="mx-auto origin-top" style={{ width: page.width * scale, height: page.height * scale }}>
        <div
          className="relative bg-white shadow-2xl"
          style={{ width: page.width, height: page.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {sortedElements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
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
  selected,
  onSelect,
  onChange,
}: {
  element: CvBuilderLayoutElement;
  selected: boolean;
  onSelect: (elementId: string) => void;
  onChange: (element: CvBuilderLayoutElement) => void;
}) {
  const [position, setPosition] = useState({ x: element.x, y: element.y });

  useEffect(() => {
    setPosition({ x: element.x, y: element.y });
  }, [element.x, element.y]);

  const baseStyle: CSSProperties = {
    width: element.width,
    height: element.height,
    zIndex: element.zIndex,
    color: element.style.color,
    backgroundColor: element.type === 'line' ? element.style.backgroundColor : element.style.backgroundColor,
    borderColor: element.style.borderColor ?? 'transparent',
    borderWidth: element.style.borderWidth ?? 0,
    borderStyle: 'solid',
    borderRadius: element.type === 'circle' ? '9999px' : element.style.borderRadius,
    fontFamily: element.style.fontFamily,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    textAlign: element.style.textAlign,
    lineHeight: element.style.lineHeight,
    opacity: element.style.opacity,
  };

  const resize = (direction: 'right' | 'bottom' | 'corner', event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = element.width;
    const startHeight = element.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const width = direction === 'right' || direction === 'corner' ? Math.max(24, startWidth + moveEvent.clientX - startX) : startWidth;
      const height = direction === 'bottom' || direction === 'corner' ? Math.max(12, startHeight + moveEvent.clientY - startY) : startHeight;
      onChange({ ...element, width, height });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <motion.div
      drag={!element.locked}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const next = { x: Math.max(0, position.x + info.offset.x), y: Math.max(0, position.y + info.offset.y) };
        setPosition(next);
        onChange({ ...element, ...next });
      }}
      onPointerDown={() => onSelect(element.id)}
      className={`absolute cursor-move overflow-hidden ${selected ? 'ring-2 ring-[#006B3F] ring-offset-2' : ''}`}
      style={{ left: position.x, top: position.y, ...baseStyle }}
    >
      <ElementContent element={element} />
      {selected ? (
        <>
          <span onPointerDown={(event) => resize('right', event)} className="absolute right-0 top-1/2 h-10 w-2 -translate-y-1/2 cursor-ew-resize bg-[#006B3F]" />
          <span onPointerDown={(event) => resize('bottom', event)} className="absolute bottom-0 left-1/2 h-2 w-10 -translate-x-1/2 cursor-ns-resize bg-[#006B3F]" />
          <span onPointerDown={(event) => resize('corner', event)} className="absolute bottom-0 right-0 size-4 cursor-nwse-resize bg-[#006B3F]" />
        </>
      ) : null}
    </motion.div>
  );
}

function ElementContent({ element }: { element: CvBuilderLayoutElement }) {
  if (element.type === 'rectangle' || element.type === 'circle' || element.type === 'line') {
    return null;
  }

  const values = previewValues[element.fieldKey] ?? [element.placeholder];
  const isSection = element.type === 'section';

  return (
    <div className="h-full w-full p-2">
      {isSection ? (
        <>
          <div className="mb-2 text-[0.9em] font-black uppercase tracking-wide">{element.label}</div>
          <div className="space-y-1.5 text-[0.82em]">
            {values.map((value) => (
              <p key={value} className="leading-snug">{value}</p>
            ))}
          </div>
        </>
      ) : (
        <div className="leading-tight">{values[0] ?? element.placeholder}</div>
      )}
    </div>
  );
}

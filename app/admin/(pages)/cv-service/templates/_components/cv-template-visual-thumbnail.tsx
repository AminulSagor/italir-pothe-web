import type { CSSProperties } from 'react';
import type {
  CvBuilderLayoutElement,
  CvTemplateItem,
  CvTemplateLayoutSchema,
  CvTemplateSectionDesignerElement,
} from '@/types/cv-template/cv_template_type';

interface CvTemplateVisualThumbnailProps {
  template: CvTemplateItem;
}

const resolveColor = (
  value: string | undefined,
  role: string | undefined,
  primaryColor: string,
  accentColor: string,
) => {
  if (role === 'primary') return primaryColor;
  if (role === 'accent') return accentColor;
  return value ?? 'transparent';
};

const stripHtml = (value: string) =>
  value
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li>/gi, '')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;

const iconText: Record<string, string> = {
  github: 'GH',
  linkedin: 'in',
  weblink: '↗',
  phone: '☎',
  location: '⌖',
  email: '@',
};

function renderElement(
  element: CvBuilderLayoutElement,
  pageWidth: number,
  pageHeight: number,
  primaryColor: string,
  accentColor: string,
  fontFamily: string,
) {
  if (element.type === 'section' && element.sectionDesignerJson?.elements?.length) {
    const sectionCanvas = element.sectionDesignerJson.canvas;
    return (
      <div
        key={element.id}
        className="absolute overflow-hidden"
        style={{
          left: toPercent(element.x, pageWidth),
          top: toPercent(element.y, pageHeight),
          width: toPercent(element.width, pageWidth),
          height: toPercent(element.height, pageHeight),
          zIndex: element.zIndex,
        }}
      >
        {element.sectionDesignerJson.elements
          .slice()
          .sort((first, second) => first.zIndex - second.zIndex)
          .map((child) =>
            renderSectionElement(
              child,
              sectionCanvas.width,
              sectionCanvas.height,
              primaryColor,
              accentColor,
              fontFamily,
            ),
          )}
      </div>
    );
  }

  return renderVisualElement(
    element,
    pageWidth,
    pageHeight,
    primaryColor,
    accentColor,
    fontFamily,
    element.placeholder || element.label || '',
  );
}

function renderSectionElement(
  element: CvTemplateSectionDesignerElement,
  sectionWidth: number,
  sectionHeight: number,
  primaryColor: string,
  accentColor: string,
  fontFamily: string,
) {
  return renderVisualElement(
    element as CvBuilderLayoutElement,
    sectionWidth,
    sectionHeight,
    primaryColor,
    accentColor,
    fontFamily,
    element.previewValue || element.label || '',
  );
}

function renderVisualElement(
  element: CvBuilderLayoutElement,
  canvasWidth: number,
  canvasHeight: number,
  primaryColor: string,
  accentColor: string,
  fontFamily: string,
  rawValue: string,
) {
  const style = element.style ?? {};
  const backgroundColor = resolveColor(
    style.backgroundColor,
    style.backgroundColorRole,
    primaryColor,
    accentColor,
  );
  const borderColor = resolveColor(
    style.borderColor,
    style.borderColorRole,
    primaryColor,
    accentColor,
  );
  const color = resolveColor(style.color, style.colorRole, primaryColor, accentColor);
  const borderWidth = style.borderWidth ?? 0;
  const value = stripHtml(rawValue);
  const textAlign = style.textAlign ?? 'left';
  const isLine = element.type === 'horizontalLine' || element.type === 'verticalLine' || element.type === 'line';

  const baseStyle: CSSProperties = {
    left: toPercent(element.x, canvasWidth),
    top: toPercent(element.y, canvasHeight),
    width: toPercent(element.width, canvasWidth),
    height: toPercent(element.height, canvasHeight),
    zIndex: element.zIndex,
    opacity: style.opacity ?? 1,
  };

  if (element.type === 'rectangle' || element.type === 'circle') {
    return (
      <div
        key={element.id}
        className="absolute"
        style={{
          ...baseStyle,
          backgroundColor,
          borderColor,
          borderStyle: borderWidth > 0 ? 'solid' : 'none',
          borderWidth,
          borderRadius: element.type === 'circle' ? '9999px' : style.borderRadius ?? 0,
        }}
      />
    );
  }

  if (isLine) {
    return (
      <div
        key={element.id}
        className="absolute"
        style={{
          ...baseStyle,
          borderTop:
            element.type !== 'verticalLine'
              ? `${Math.max(1, borderWidth || 1)}px solid ${borderColor || backgroundColor || '#111827'}`
              : undefined,
          borderLeft:
            element.type === 'verticalLine'
              ? `${Math.max(1, borderWidth || 1)}px solid ${borderColor || backgroundColor || '#111827'}`
              : undefined,
        }}
      />
    );
  }

  const textStyle: CSSProperties = {
    ...baseStyle,
    backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor,
    borderColor,
    borderStyle: borderWidth > 0 ? 'solid' : 'none',
    borderWidth,
    borderRadius: style.borderRadius ?? 0,
    color,
    fontFamily: style.fontFamily ?? fontFamily,
    fontSize: `${Math.max(6, style.fontSize ?? 12)}px`,
    fontWeight: style.fontWeight ?? 500,
    fontStyle: style.fontStyle ?? 'normal',
    lineHeight: style.lineHeight ?? 1.25,
    textAlign,
    padding: '2px 3px',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
  };

  if (element.type === 'icon') {
    return (
      <div key={element.id} className="absolute flex items-center justify-center" style={textStyle}>
        {iconText[element.iconName ?? ''] ?? '•'}
      </div>
    );
  }

  if (element.type === 'list') {
    const items = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    return (
      <div key={element.id} className="absolute" style={textStyle}>
        {items.map((item, index) => (
          <div key={`${element.id}-${index}`} className="flex gap-1">
            <span className="shrink-0">
              {element.listStyle === 'number' ? `${index + 1}.` : '•'}
            </span>
            <span>{item.replace(/^(?:[•\-*]\s*|\d+[\.)]\s*)/, '')}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div key={element.id} className="absolute" style={textStyle}>
      {value}
    </div>
  );
}

export default function CvTemplateVisualThumbnail({ template }: CvTemplateVisualThumbnailProps) {
  const layout = (template.schema?.designJson ?? template.schema?.layout) as
    | CvTemplateLayoutSchema
    | undefined;
  const page = layout?.page;

  if (!layout?.elements?.length || !page) {
    return (
      <div className="flex h-full flex-col justify-end bg-[#102A24] p-5 text-white">
        <p className="text-xl font-black">{template.title}</p>
        <p className="mt-2 text-xs text-white/70">
          {template.pageSize.toUpperCase()} • {template.fontFamily}
        </p>
      </div>
    );
  }

  const previewHeight = 332;
  const previewScale = Math.min(previewHeight / page.height, 1);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#EEF2ED] p-3">
      <div
        className="relative overflow-hidden shadow-sm"
        style={{
          width: page.width * previewScale,
          height: page.height * previewScale,
        }}
      >
        <div
          className="relative overflow-hidden bg-white"
          style={{
            width: page.width,
            height: page.height,
            backgroundColor: page.backgroundColor ?? '#FFFFFF',
            transform: `scale(${previewScale})`,
            transformOrigin: 'top left',
          }}
        >
          {layout.elements
            .slice()
            .sort((first, second) => first.zIndex - second.zIndex)
            .map((element) =>
              renderElement(
                element,
                page.width,
                page.height,
                template.primaryColor,
                template.accentColor,
                template.fontFamily,
              ),
            )}
        </div>
      </div>
    </div>
  );
}

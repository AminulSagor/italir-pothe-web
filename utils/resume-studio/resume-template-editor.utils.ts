import type {
  ResumeRendererConfig,
  ResumeSectionDefinition,
  ResumeTemplateEditorState,
  ResumeTemplateFieldSchema,
  ResumeTemplateVersion,
} from "@/types/resume-studio/resume-template.types";
import {
  MAX_PREVIEW_SAMPLE_DATA_LENGTH,
  parseResumePreviewSampleData,
} from "@/utils/resume-studio/resume-preview-sample-data.utils";

export const DEFAULT_RENDERER_CONFIG: ResumeRendererConfig = {
  layout: "single-column",
  sidebarContinuation: "not-applicable",
  recommendedMaxPages: 2,
  hardMaxPages: 6,
  locale: "en",
};

export const STARTER_TEMPLATE_HTML = `<main class="resume-page">
  <header class="resume-header" data-resume-section="personal">
    {{#if personal.photoUrl}}
      <img class="resume-photo" data-resume-photo src="{{personal.photoUrl}}" alt="Profile photo" />
    {{/if}}

    <div>
      <h1>{{personal.fullName}}</h1>
      {{#if personal.jobTitle}}<p class="job-title">{{personal.jobTitle}}</p>{{/if}}
      <div class="contact-row">
        {{#if personal.email}}<span>{{personal.email}}</span>{{/if}}
        {{#if personal.phone}}<span>{{personal.phone}}</span>{{/if}}
        {{#if personal.location}}<span>{{personal.location}}</span>{{/if}}
      </div>
    </div>
  </header>

  {{#if summary}}
    <section class="resume-section" data-resume-section="summary">
      <h2 data-resume-section-title>Professional Summary</h2>
      <p>{{summary}}</p>
    </section>
  {{/if}}

  {{#if experience}}
    <section class="resume-section" data-resume-section="experience">
      <h2 data-resume-section-title>Experience</h2>
      {{#each experience}}
        <article class="resume-entry" data-resume-entry>
          <div class="entry-heading">
            <div>
              <h3>{{position}}</h3>
              <p>{{company}}</p>
            </div>
            <p>{{startDate}} {{#if endDate}}– {{endDate}}{{/if}}</p>
          </div>
          {{#if description}}<p>{{description}}</p>{{/if}}
          {{#if bullets}}
            <ul>
              {{#each bullets}}<li>{{this}}</li>{{/each}}
            </ul>
          {{/if}}
        </article>
      {{/each}}
    </section>
  {{/if}}

  {{#if education}}
    <section class="resume-section" data-resume-section="education">
      <h2 data-resume-section-title>Education</h2>
      {{#each education}}
        <article class="resume-entry" data-resume-entry>
          <h3>{{degree}}</h3>
          <p>{{institution}}</p>
          {{#if fieldOfStudy}}<p>{{fieldOfStudy}}</p>{{/if}}
        </article>
      {{/each}}
    </section>
  {{/if}}

  {{#if skills}}
    <section class="resume-section" data-resume-section="skills">
      <h2 data-resume-section-title>Skills</h2>
      <div class="tag-list">
        {{#each skills}}<span class="tag">{{this}}</span>{{/each}}
      </div>
    </section>
  {{/if}}
</main>`;

export const STARTER_TEMPLATE_CSS = `@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  color: #1f2937;
  background: #ffffff;
}

.resume-page {
  width: 210mm;
  min-height: 297mm;
  padding: 16mm;
  background: #ffffff;
}

.resume-header {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 2px solid #1f2937;
  padding-bottom: 16px;
}

.resume-photo {
  width: 30mm;
  height: 30mm;
  border-radius: 50%;
  object-fit: cover;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 4px;
  font-size: 28px;
}

h2 {
  margin-bottom: 10px;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

h3 {
  margin-bottom: 3px;
  font-size: 14px;
}

p,
li,
span {
  font-size: 10.5px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.job-title {
  margin-bottom: 8px;
  font-size: 13px;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
}

.resume-section {
  margin-top: 18px;
}

.resume-entry {
  margin-bottom: 12px;
  break-inside: avoid;
}

.entry-heading {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 4px 8px;
}`;

export const slugifyResumeTemplate = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);

export const cloneFieldSchema = (
  schema: ResumeTemplateFieldSchema,
): ResumeTemplateFieldSchema => JSON.parse(JSON.stringify(schema));

export const normalizeSectionOrder = (
  sections: ResumeSectionDefinition[],
): ResumeSectionDefinition[] =>
  sections.map((section, index) => ({
    ...section,
    order: index * 10,
  }));

export const getPreferredEditableVersion = (
  versions: ResumeTemplateVersion[],
): ResumeTemplateVersion | null =>
  versions.find((version) => version.status === "draft") ??
  versions.find((version) => version.status === "published") ??
  versions[0] ??
  null;

export const validateTemplateEditorState = (
  state: ResumeTemplateEditorState,
  options: { isNew: boolean; requireMetadata?: boolean },
) => {
  const errors: string[] = [];
  const { metadata, fieldSchema, rendererConfig } = state;

  if (options.requireMetadata !== false) {
    if (metadata.name.trim().length < 2) {
      errors.push("Template name must be at least 2 characters.");
    }

    if (options.isNew) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug.trim())) {
        errors.push("Slug must use lowercase letters, numbers, and hyphens only.");
      }
    }

    if (metadata.category.trim().length < 2) {
      errors.push("Category must be at least 2 characters.");
    }
  }

  if (!state.html.trim()) {
    errors.push("HTML is required.");
  }

  if (state.html.length > 220_000) {
    errors.push("HTML cannot exceed 220,000 characters.");
  }

  if (state.css.length > 220_000) {
    errors.push("CSS cannot exceed 220,000 characters.");
  }

  if (state.sampleDataJson.length > MAX_PREVIEW_SAMPLE_DATA_LENGTH) {
    errors.push("Preview sample data cannot exceed 150,000 characters.");
  } else if (state.sampleDataJson.trim()) {
    try {
      parseResumePreviewSampleData(state.sampleDataJson);
    } catch (error) {
      errors.push(
        error instanceof Error
          ? error.message
          : "Preview sample data must be valid JSON.",
      );
    }
  }

  if (rendererConfig.hardMaxPages < 1 || rendererConfig.hardMaxPages > 6) {
    errors.push("Hard maximum pages must be between 1 and 6.");
  }

  if (
    rendererConfig.recommendedMaxPages < 1 ||
    rendererConfig.recommendedMaxPages > rendererConfig.hardMaxPages
  ) {
    errors.push("Recommended pages must be between 1 and the hard maximum.");
  }

  if (
    rendererConfig.layout === "two-column" &&
    rendererConfig.sidebarContinuation !== "template-managed"
  ) {
    errors.push(
      'Two-column templates require sidebar continuation "template-managed".',
    );
  }

  const enabledSections = fieldSchema.sections.filter(
    (section) => section.enabled && !section.hidden,
  );

  if (!enabledSections.length) {
    errors.push("Enable at least one CV section.");
  }

  for (const section of fieldSchema.sections) {
    if (section.required && (!section.enabled || section.hidden)) {
      errors.push(`${section.label} cannot be required while disabled or hidden.`);
    }

    for (const field of section.fields ?? []) {
      if (field.required && (!field.enabled || field.hidden)) {
        errors.push(`${field.label} cannot be required while disabled or hidden.`);
      }
    }
  }

  return errors;
};

export const makeNewTemplateEditorState = (
  defaultFieldSchema: ResumeTemplateFieldSchema,
): ResumeTemplateEditorState => ({
  metadata: {
    name: "",
    slug: "",
    description: "",
    category: "",
    isPremium: false,
    sortOrder: 0,
  },
  html: "",
  css: "",
  sampleDataJson: "",
  fieldSchema: cloneFieldSchema(defaultFieldSchema),
  rendererConfig: { ...DEFAULT_RENDERER_CONFIG },
});

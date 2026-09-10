import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksActions extends Struct.ComponentSchema {
  collectionName: 'components_blocks_actions';
  info: {
    displayName: 'Actions';
  };
  attributes: {};
}

export interface BlocksBrandCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_brand_cards';
  info: {
    displayName: 'Brand Card';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.brand-item', true>;
    title: Schema.Attribute.String;
    varient: Schema.Attribute.Enumeration<['suitable', 'unsuitable']>;
  };
}

export interface BlocksBrandItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_brand_items';
  info: {
    displayName: 'Brand Item';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface BlocksBudgetRange extends Struct.ComponentSchema {
  collectionName: 'components_blocks_budget_ranges';
  info: {
    displayName: 'Budget Range';
  };
  attributes: {
    label: Schema.Attribute.String;
    maxAmount: Schema.Attribute.Integer;
    minAmount: Schema.Attribute.Integer;
    recommended: Schema.Attribute.Boolean;
  };
}

export interface BlocksCaseStudy extends Struct.ComponentSchema {
  collectionName: 'components_blocks_case_studies';
  info: {
    displayName: 'Case Study';
  };
  attributes: {
    afterImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    afterLabel: Schema.Attribute.String;
    afterMobileImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    beforeImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    beforeLabel: Schema.Attribute.String;
    clientName: Schema.Attribute.String;
    mobileBeforeImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface BlocksContact extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contacts';
  info: {
    displayName: 'Contact';
  };
  attributes: {
    address: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    location: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface BlocksFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faq_items';
  info: {
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface BlocksFeature extends Struct.ComponentSchema {
  collectionName: 'components_blocks_features';
  info: {
    displayName: 'Feature';
  };
  attributes: {
    backgroundColor: Schema.Attribute.Enumeration<['navy', 'lavender', 'sage']>;
    description: Schema.Attribute.Text;
    illustration: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    title: Schema.Attribute.String;
  };
}

export interface BlocksFooterIntro extends Struct.ComponentSchema {
  collectionName: 'components_blocks_footer_intros';
  info: {
    displayName: 'Footer Intro';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    subDescription: Schema.Attribute.String;
  };
}

export interface BlocksForm extends Struct.ComponentSchema {
  collectionName: 'components_blocks_forms';
  info: {
    displayName: 'Form';
  };
  attributes: {
    pricingTiers: Schema.Attribute.Component<'blocks.budget-range', true>;
    Steps: Schema.Attribute.Component<'blocks.form-step', true>;
    successMessage: Schema.Attribute.Text;
  };
}

export interface BlocksFormField extends Struct.ComponentSchema {
  collectionName: 'components_blocks_form_fields';
  info: {
    displayName: 'Form Field';
  };
  attributes: {
    label: Schema.Attribute.String;
    options: Schema.Attribute.Component<'blocks.option', true>;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean;
    type: Schema.Attribute.Enumeration<
      ['text', 'email', 'phone', 'url', 'textarea', 'radio', 'select']
    >;
  };
}

export interface BlocksFormStep extends Struct.ComponentSchema {
  collectionName: 'components_blocks_form_steps';
  info: {
    displayName: 'Form Step';
  };
  attributes: {
    description: Schema.Attribute.Text;
    fields: Schema.Attribute.Component<'blocks.form-field', true>;
    footerText: Schema.Attribute.Text;
    formTitle: Schema.Attribute.String;
    layout: Schema.Attribute.Enumeration<['default', 'two-column']>;
    primaryButton: Schema.Attribute.Component<'shared.button', false>;
    showEstimate: Schema.Attribute.Boolean;
    title: Schema.Attribute.String;
  };
}

export interface BlocksLayout extends Struct.ComponentSchema {
  collectionName: 'components_blocks_layouts';
  info: {
    displayName: 'Layout';
  };
  attributes: {
    direction: Schema.Attribute.Enumeration<['row', 'column']>;
  };
}

export interface BlocksLink extends Struct.ComponentSchema {
  collectionName: 'components_blocks_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    platform: Schema.Attribute.String;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface BlocksOption extends Struct.ComponentSchema {
  collectionName: 'components_blocks_options';
  info: {
    displayName: 'Option';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface BlocksProblemCards extends Struct.ComponentSchema {
  collectionName: 'components_blocks_problem_cards';
  info: {
    displayName: 'Problem Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    identifier: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface BlocksProcessCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_process_cards';
  info: {
    displayName: 'Process Card';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.button', false>;
    description: Schema.Attribute.Text;
    hoverList: Schema.Attribute.Component<'shared.list-item', true>;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    size: Schema.Attribute.Enumeration<['default', 'wide']>;
    title: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['content', 'media']>;
  };
}

export interface BlocksProjectView extends Struct.ComponentSchema {
  collectionName: 'components_blocks_project_views';
  info: {
    displayName: 'Project View';
  };
  attributes: {};
}

export interface SectionsBrandFit extends Struct.ComponentSchema {
  collectionName: 'components_sections_brand_fits';
  info: {
    displayName: 'Brand Fit';
  };
  attributes: {
    header: Schema.Attribute.Component<'shared.section-header', false>;
    suitableCard: Schema.Attribute.Component<'blocks.brand-card', false>;
    unsuitableCard: Schema.Attribute.Component<'blocks.brand-card', false>;
  };
}

export interface SectionsCaseStudyShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_case_study_showcases';
  info: {
    displayName: 'CaseStudy Showcase';
  };
  attributes: {
    caseStudies: Schema.Attribute.Component<'blocks.case-study', true>;
    header: Schema.Attribute.Component<'shared.section-header', false>;
  };
}

export interface SectionsClientShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_client_showcases';
  info: {
    displayName: 'Client Showcase';
  };
  attributes: {
    actions: Schema.Attribute.Component<'shared.button', true>;
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    services: Schema.Attribute.Component<'shared.list-item', true>;
    title: Schema.Attribute.Text;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.section-header', false>;
    questions: Schema.Attribute.Component<'blocks.faq-item', true>;
  };
}

export interface SectionsFooter extends Struct.ComponentSchema {
  collectionName: 'components_sections_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    address: Schema.Attribute.Text;
    contacts: Schema.Attribute.Component<'blocks.contact', true>;
    intro: Schema.Attribute.Component<'blocks.footer-intro', false>;
    marquee: Schema.Attribute.Text;
    quickLinks: Schema.Attribute.Component<'blocks.link', true>;
    socialLinks: Schema.Attribute.Component<'blocks.link', true>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    brandLogos: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    header: Schema.Attribute.Component<'shared.section-header', false>;
    leadForm: Schema.Attribute.Component<'blocks.form', false>;
    primaryButton: Schema.Attribute.Component<'shared.button', false>;
  };
}

export interface SectionsOurProcess extends Struct.ComponentSchema {
  collectionName: 'components_sections_our_processes';
  info: {
    displayName: 'Our Process';
  };
  attributes: {
    CTA: Schema.Attribute.Component<'shared.button', false>;
    desktopCards: Schema.Attribute.Component<'blocks.process-card', true>;
    desktopCta: Schema.Attribute.Component<'shared.button', true>;
    eyebrow: Schema.Attribute.String;
    header: Schema.Attribute.Component<'shared.section-header', false>;
    mobileCards: Schema.Attribute.Component<
      'sections.process-card-mobile',
      true
    >;
    mobileEyebrow: Schema.Attribute.String;
  };
}

export interface SectionsOurWork extends Struct.ComponentSchema {
  collectionName: 'components_sections_our_works';
  info: {
    displayName: 'Our Work';
  };
  attributes: {
    header: Schema.Attribute.Component<'shared.section-header', false>;
    projects: Schema.Attribute.Relation<'oneToMany', 'api::brand.brand'>;
  };
}

export interface SectionsProblemAssessment extends Struct.ComponentSchema {
  collectionName: 'components_sections_problem_assessments';
  info: {
    displayName: 'Problem Assessment';
  };
  attributes: {
    header: Schema.Attribute.Component<'shared.section-header', false>;
    problemCards: Schema.Attribute.Component<'blocks.problem-cards', true>;
    submitButton: Schema.Attribute.Component<'shared.button', false>;
    summaryText: Schema.Attribute.Text;
  };
}

export interface SectionsProcessCardMobile extends Struct.ComponentSchema {
  collectionName: 'components_sections_process_card_mobile_s';
  info: {
    displayName: 'Process Card (Mobile)';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSolutionHighlights extends Struct.ComponentSchema {
  collectionName: 'components_sections_solution_highlights';
  info: {
    displayName: 'Solution Highlights';
  };
  attributes: {
    features: Schema.Attribute.Component<'blocks.feature', true>;
    header: Schema.Attribute.Component<'shared.section-header', false>;
  };
}

export interface SharedAuditBar extends Struct.ComponentSchema {
  collectionName: 'components_shared_audit_bars';
  info: {
    displayName: 'AuditBar';
    icon: 'bell';
  };
  attributes: {
    auditText: Schema.Attribute.String;
    leadForm: Schema.Attribute.Component<'blocks.form', false>;
    primaryButtonText: Schema.Attribute.String;
    secondaryButtonText: Schema.Attribute.String;
    secondaryButtonUrl: Schema.Attribute.String;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedListItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_list_items';
  info: {
    displayName: 'List Item';
  };
  attributes: {
    Text: Schema.Attribute.String;
  };
}

export interface SharedSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_headers';
  info: {
    displayName: 'Section Header';
  };
  attributes: {
    description: Schema.Attribute.Text;
    mobileDescription: Schema.Attribute.Text;
    mobileTitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.actions': BlocksActions;
      'blocks.brand-card': BlocksBrandCard;
      'blocks.brand-item': BlocksBrandItem;
      'blocks.budget-range': BlocksBudgetRange;
      'blocks.case-study': BlocksCaseStudy;
      'blocks.contact': BlocksContact;
      'blocks.faq-item': BlocksFaqItem;
      'blocks.feature': BlocksFeature;
      'blocks.footer-intro': BlocksFooterIntro;
      'blocks.form': BlocksForm;
      'blocks.form-field': BlocksFormField;
      'blocks.form-step': BlocksFormStep;
      'blocks.layout': BlocksLayout;
      'blocks.link': BlocksLink;
      'blocks.option': BlocksOption;
      'blocks.problem-cards': BlocksProblemCards;
      'blocks.process-card': BlocksProcessCard;
      'blocks.project-view': BlocksProjectView;
      'sections.brand-fit': SectionsBrandFit;
      'sections.case-study-showcase': SectionsCaseStudyShowcase;
      'sections.client-showcase': SectionsClientShowcase;
      'sections.faq': SectionsFaq;
      'sections.footer': SectionsFooter;
      'sections.hero': SectionsHero;
      'sections.our-process': SectionsOurProcess;
      'sections.our-work': SectionsOurWork;
      'sections.problem-assessment': SectionsProblemAssessment;
      'sections.process-card-mobile': SectionsProcessCardMobile;
      'sections.solution-highlights': SectionsSolutionHighlights;
      'shared.audit-bar': SharedAuditBar;
      'shared.button': SharedButton;
      'shared.list-item': SharedListItem;
      'shared.section-header': SharedSectionHeader;
      'shared.seo': SharedSeo;
    }
  }
}

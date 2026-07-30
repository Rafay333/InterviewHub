/**
 * SEO headings based on common Google search patterns for interview prep.
 * Winning pattern from SERP research: "{Topic} Interview Questions"
 * Often also: "{Topic} Interview Questions and Answers"
 */

export type SeoCopy = {
  /** Visible H1 / card title — primary keyword phrase */
  heading: string;
  /** Browser tab / Google title (~50–60 chars ideal) */
  metaTitle: string;
  /** Meta description with natural keyword + intent */
  metaDescription: string;
};

export function interviewQuestionsHeading(topic: string): string {
  return `${topic} Interview Questions`;
}

export function interviewQuestionsMetaTitle(topic: string): string {
  return `${topic} Interview Questions | InterviewHub`;
}

export function interviewQuestionsMetaDescription(topic: string, blurb: string): string {
  return `Practice ${topic} interview questions with clear answers. ${blurb}`;
}

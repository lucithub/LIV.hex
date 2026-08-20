export type FeedbackType = 'bug' | 'improvement' | 'general';

export interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  email?: string;
}

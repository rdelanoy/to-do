export const STATUSES = {
  pending: 'pending',
  progress: 'progress',
  cancel: 'cancel',
  done: 'done',
} as const;

export type StatusType = keyof typeof STATUSES;

export const healthDataMap: Record<
  string,
  { title: string; value: string; description: string; tips: string }
> = {
  'heart-rate': {
    title: 'Heart Rate',
    value: '75 bpm',
    description:
      'Your heart rate measures how many times your heart beats per minute. It’s a key indicator of cardiovascular health.',
    tips:
      'To maintain a healthy heart rate, engage in regular aerobic exercise, reduce stress, and stay hydrated.',
  },
  'sleep': {
    title: 'Sleep Hours',
    value: '5 hours',
    description:
      'Sleep is essential for physical and mental recovery. Adults typically need 7–9 hours of sleep each night.',
    tips:
      'Stick to a consistent sleep schedule, avoid screens before bed, and create a calm sleep environment.',
  },
  'steps': {
    title: 'Steps',
    value: '8,000 steps',
    description:
      'Step count is a measure of daily physical activity. Walking helps improve cardiovascular health, endurance, and metabolism.',
    tips:
      'Aim for at least 7,000–10,000 steps per day. Take breaks to walk during your work day or go for a walk after meals.',
  },
};

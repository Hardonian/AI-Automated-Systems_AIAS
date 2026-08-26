export const telemetry = {
  track: () => {},
  page: () => {},
  identify: () => {},
  capture: () => {},
  startTimer: () => ({ stop: () => 0 }),
  interaction: () => {},
  error: () => {},
  performance: () => {},
  security: () => {},
  engagement: () => {},
};

export const errorTracker = {
  capture: () => {},
  log: () => {},
};

export default telemetry;

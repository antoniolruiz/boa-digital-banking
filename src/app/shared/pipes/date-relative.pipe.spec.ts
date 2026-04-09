import { DateRelativePipe } from './date-relative.pipe';

describe('DateRelativePipe', () => {
  let pipe: DateRelativePipe;

  beforeEach(() => {
    pipe = new DateRelativePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "Just now" for current time', () => {
    const result = pipe.transform(new Date());
    expect(result).toBe('Just now');
  });

  it('should return minutes ago for recent times', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    const result = pipe.transform(date);
    expect(result).toContain('m ago');
  });

  it('should return hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const result = pipe.transform(date);
    expect(result).toContain('h ago');
  });

  it('should return days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = pipe.transform(date);
    expect(result).toContain('d ago');
  });

  it('should handle string dates', () => {
    const result = pipe.transform(new Date().toISOString());
    expect(result).toBeTruthy();
  });

  it('should handle null', () => {
    const result = pipe.transform(null);
    expect(result).toBe('—');
  });

  it('should handle undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('—');
  });

  it('should use long format', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    const result = pipe.transform(date, 'long');
    expect(result).toContain('minutes ago');
  });
});

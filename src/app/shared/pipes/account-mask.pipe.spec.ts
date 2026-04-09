import { AccountMaskPipe } from './account-mask.pipe';

describe('AccountMaskPipe', () => {
  let pipe: AccountMaskPipe;

  beforeEach(() => {
    pipe = new AccountMaskPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should mask account number showing last 4 digits', () => {
    const result = pipe.transform('1234567890');
    expect(result).toBe('****7890');
  });

  it('should mask short account numbers', () => {
    const result = pipe.transform('1234');
    expect(result).toBe('****1234');
  });

  it('should handle null', () => {
    const result = pipe.transform(null);
    expect(result).toBe('—');
  });

  it('should handle undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('—');
  });

  it('should handle empty string', () => {
    const result = pipe.transform('');
    expect(result).toBe('—');
  });

  it('should show full number when showFull is true', () => {
    const result = pipe.transform('1234567890', 'account', true);
    expect(result).toBe('1234567890');
  });

  it('should mask SSN', () => {
    const result = pipe.transform('123456789', 'ssn');
    expect(result).toBe('***-**-6789');
  });

  it('should mask phone number', () => {
    const result = pipe.transform('5551234567', 'phone');
    expect(result).toBe('(***) ***-4567');
  });

  it('should mask email', () => {
    const result = pipe.transform('john.doe@example.com', 'email');
    expect(result).toContain('@example.com');
    expect(result).toContain('****');
  });
});

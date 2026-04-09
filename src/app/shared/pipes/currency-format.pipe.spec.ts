import { CurrencyFormatPipe } from './currency-format.pipe';

describe('CurrencyFormatPipe', () => {
  let pipe: CurrencyFormatPipe;

  beforeEach(() => {
    pipe = new CurrencyFormatPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format positive amounts with $ symbol', () => {
    const result = pipe.transform(1234.56);
    expect(result).toContain('$');
    expect(result).toContain('1,234.56');
  });

  it('should format zero as $0.00', () => {
    const result = pipe.transform(0);
    expect(result).toContain('0.00');
  });

  it('should format negative amounts in parentheses', () => {
    const result = pipe.transform(-500.00);
    expect(result).toContain('(');
    expect(result).toContain('500.00');
    expect(result).toContain(')');
  });

  it('should handle null values', () => {
    const result = pipe.transform(null as unknown as number);
    expect(result).toBe('—');
  });

  it('should handle undefined values', () => {
    const result = pipe.transform(undefined as unknown as number);
    expect(result).toBe('—');
  });

  it('should format large numbers with commas', () => {
    const result = pipe.transform(1000000);
    expect(result).toContain('1,000,000');
  });
});

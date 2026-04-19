import { cn } from '@/src/lib/utils';

describe('cn()', () => {
  it('should merge classes correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('should merge tailwind classes using twMerge', () => {
    expect(cn('px-2 py-2', 'p-4')).toBe('p-4');
  });

  it('should handle undefined and null', () => {
    expect(cn('class1', undefined, null)).toBe('class1');
  });
});

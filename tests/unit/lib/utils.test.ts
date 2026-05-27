import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('merges basic classes correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('resolves tailwind class conflicts correctly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-white', 'bg-black')).toBe('bg-black');
  });

  it('handles conditional classes correctly', () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn('base-class', isTrue && 'true-class', isFalse && 'false-class')).toBe('base-class true-class');
    expect(cn({ 'class1': true, 'class2': false })).toBe('class1');
  });

  it('handles arrays correctly', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
    expect(cn(['class1', ['class2', 'class3']])).toBe('class1 class2 class3');
  });

  it('handles falsy values gracefully', () => {
    expect(cn('class1', null, undefined, false, 0, '', 'class2')).toBe('class1 class2');
  });

  it('combines various inputs correctly', () => {
    expect(cn(
      'base',
      ['array1', 'array2'],
      { 'obj-true': true, 'obj-false': false },
      'p-4',
      'p-8', // Overrides p-4
      null,
      undefined
    )).toBe('base array1 array2 obj-true p-8');
  });
});

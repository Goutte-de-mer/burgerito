// Tests unitaires basiques pour des fonctions utilitaires

describe('Utils - Unit Tests', () => {
  describe('Basic Math Operations', () => {
    it('should add two numbers correctly', () => {
      expect(1 + 2).toBe(3);
    });

    it('should multiply two numbers correctly', () => {
      expect(5 * 4).toBe(20);
    });
  });

  describe('String Operations', () => {
    it('should concatenate strings', () => {
      expect('Hello' + ' ' + 'World').toBe('Hello World');
    });

    it('should check string length', () => {
      const str = 'burgerito';
      expect(str.length).toBe(9);
    });
  });

  describe('Array Operations', () => {
    it('should filter array elements', () => {
      const numbers = [1, 2, 3, 4, 5];
      const evens = numbers.filter(n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
    });

    it('should map array elements', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });
  });
});


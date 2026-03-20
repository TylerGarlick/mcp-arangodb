/**
 * Unit tests for logger
 */

import { logger, LogLevel } from '../../src/logger';

describe('Logger', () => {
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  
  describe('debug', () => {
    it('should log debug messages', () => {
      logger.debug('test message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('DEBUG');
      expect(output).toContain('test message');
    });
    
    it('should include metadata if provided', () => {
      logger.debug('test', { key: 'value' });
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('key');
      expect(output).toContain('value');
    });
  });
  
  describe('info', () => {
    it('should log info messages', () => {
      logger.info('test message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('INFO');
    });
  });
  
  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('test message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('WARN');
    });
  });
  
  describe('error', () => {
    it('should log error messages', () => {
      logger.error('test message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('ERROR');
    });
    
    it('should include error object if provided', () => {
      const error = new Error('test error');
      logger.error('operation failed', { error: error.message });
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('operation failed');
    });
  });
  
  it('should include ISO timestamp', () => {
    logger.info('test');
    const output = consoleErrorSpy.mock.calls[0][0];
    // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
    expect(output).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});

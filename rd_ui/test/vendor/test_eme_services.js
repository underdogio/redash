'use strict';

describe('URLService', function() {
  var URLService;

  beforeEach(module('eme.services'));
  beforeEach(inject(function(_URLService_){
    URLService = _URLService_;
  }));

  var data = {
    key1: 'value1',
    key2: 'value2',
    key3: {
      key3a: 'value3a',
      key3b: 'value3b'
    }
  };

  var serializedData = {
    key1: 'value1',
    key2: 'value2',
    'key3.key3a': 'value3a',
    'key3.key3b': 'value3b'
  };

  describe('flatten', function() {
    it('should handle numeric values', function() {
      var object = URLService.flatten({
        key1: {
          key2: 1
        }
      });
      expect(object).toEqual({
        'key1.key2': 1
      });
    });

    it('should handle array value', function() {
      var object = URLService.flatten({
        key1: {
          key2: [1,2,3]
        }
      });
      expect(object).toEqual({
        'key1.key2': [1,2,3]
      });
    });

    it('should handle string value', function() {
      var object = URLService.flatten({
        key1: {
          key2: 's'
        }
      });
      expect(object).toEqual({
        'key1.key2': 's'
      });
    });

    it('should handle function value', function() {
      function f() {};
      var object = URLService.flatten({
        key1: {
          key2: f
        }
      });
      expect(object).toEqual({
        'key1.key2': f
      });
    });
  });

  ddescribe('encodeArray', function() {
    it('should encode arrays', function() {
      var result = URLService.encodeArray('numbers', [1,2,3]);
      var expected = 'numbers[]=1&numbers[]=2&numbers[]=3';
      expect(result).toEqual(expected);
    });
  });

  describe('serialize', function() {
    var serialized;

    beforeEach(function() {
      serialized = URLService.serialize(data);
    });

    it('should collapse keys of nested objects', function() {
      expect(Object.keys(serialized))
        .toEqual(['key1', 'key2', 'key3.key3a', 'key3.key3b']);
    });

    it('should serialize correctly', function() {
      expect(serialized).toEqual(serializedData);
    });

  });

  describe('deserialize', function() {
    var deserialized;

    beforeEach(function() {
      deserialized = URLService.deserialize(serializedData);
    });

    it('should deserialize correctly', function() {
      expect(deserialized).toEqual(data);
    });
  });

  describe('value casting', function() {
    it('should cast booleans to strings', function() {
      expect(URLService.serialize({key: true})).toEqual({key: 'true'});
    });

    it('should cast integers to strings', function() {
      expect(URLService.serialize({key: 1})).toEqual({key: '1'});
      expect(URLService.serialize({key: -1})).toEqual({key: '-1'});
    });

  });
});

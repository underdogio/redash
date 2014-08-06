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

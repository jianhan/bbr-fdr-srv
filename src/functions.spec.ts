import { setMapPropVal } from './functions';
import { __ } from 'ramda';
import { Map } from 'immutable';

describe('test functions', () => {
  describe('setMapPropVal function', () => {
    it('should update map with value', () => {
      const testMap = Map({ test: 'initial value' });
      // todo: fix typing
      const updatedMap = setMapPropVal('test', __, testMap)('updated value') as any;

      expect(updatedMap.get('test')).toEqual('updated value');
    });
  });
});

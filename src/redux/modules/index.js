// @flow
import place from './place';
import location from './location';
import nav from './nav';
import favourite from './favourite';

export default {
  place, location, nav, favourite,
};

// Put reducer keys that you do NOT want stored to persistence here
export const blacklist = ['place', 'location', 'nav'];

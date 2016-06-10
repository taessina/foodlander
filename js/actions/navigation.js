export const back = () => ({ type: 'back' });
export const replace = (action) => ({ type: 'replace', key: action.key, ...action });
export const push = (action) => ({ type: 'push', key: action.key, ...action });

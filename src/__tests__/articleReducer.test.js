import { reducer, initialState } from '@/reducers/articlesReducer';

describe('reducer', () => {
  it('handles SET_ARTICLES', () => {
    const action = { type: 'SET_ARTICLES', payload: [{ id: 1, title: 'Article 1' }] };
    expect(reducer(initialState, action)).toEqual({ ...initialState, articles: action.payload });
  });

  it('handles SET_SEARCH_TERM', () => {
    const action = { type: 'SET_SEARCH_TERM', payload: 'test' };
    expect(reducer(initialState, action)).toEqual({ ...initialState, searchTerm: action.payload });
  });

  it('handles SET_SEARCH_RESULTS', () => {
    const action = { type: 'SET_SEARCH_RESULTS', payload: ['result1', 'result2'] };
    expect(reducer(initialState, action)).toEqual({ ...initialState, searchResultsMarked: action.payload });
  });

  it('handles TOGGLE_CASE_SENSITIVE', () => {
    const action = { type: 'TOGGLE_CASE_SENSITIVE' };
    const firstToggle = reducer(initialState, action);
    expect(firstToggle.caseSensitive).toEqual(!initialState.caseSensitive);
    const secondToggle = reducer(firstToggle, action);
    expect(secondToggle.caseSensitive).toEqual(initialState.caseSensitive);
  });

  it('handles SET_ERROR', () => {
    const action = { type: 'SET_ERROR', payload: 'Error message' };
    expect(reducer(initialState, action)).toEqual({ ...initialState, error: action.payload });
  });

  it('handles SET_LOADING', () => {
    const action = { type: 'SET_LOADING', payload: false };
    expect(reducer(initialState, action)).toEqual({ ...initialState, isLoading: action.payload });
  });

  it('returns the current state for an unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION', payload: null };
    expect(reducer(initialState, action)).toEqual(initialState);
  });
});

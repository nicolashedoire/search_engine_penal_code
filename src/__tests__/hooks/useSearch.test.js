import { renderHook, act } from '@testing-library/react-hooks';
import useSearch from '@/hooks/useSearch';
import { createRoot } from 'react-dom/client';

const mockDispatch = jest.fn();
const mockGetHighlightedArticles = jest.fn();

jest.mock('react-dom/client', () => ({
  ...jest.requireActual('react-dom/client'),
  createRoot: jest.fn(),
}));

describe('useSearch Hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockGetHighlightedArticles.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes searchTerm with initialSearchTerm', () => {
    const initialSearchTerm = 'initial term';
    const { result } = renderHook(() =>
      useSearch(initialSearchTerm, mockDispatch, mockGetHighlightedArticles)
    );

    expect(result.current.searchTerm).toBe(initialSearchTerm);
  });

  it('updates searchTerm when handleSearch is called', () => {
    const { result } = renderHook(() =>
      useSearch('', mockDispatch, mockGetHighlightedArticles)
    );

    act(() => {
      result.current.handleSearch('new term');
    });

    expect(result.current.searchTerm).toBe('new term');
  });


  it('handleSearch is stable across re-renders', () => {
    const { result, rerender } = renderHook(() =>
      useSearch('', mockDispatch, mockGetHighlightedArticles)
    );

    const handleSearchFirstRender = result.current.handleSearch;

    rerender();

    expect(result.current.handleSearch).toBe(handleSearchFirstRender);
  });
});


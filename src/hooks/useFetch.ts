"use client";

import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function areDepsEqual(a: DependencyList, b: DependencyList): boolean {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);
  const allDeps = [...deps, reloadToken];
  const [prevDeps, setPrevDeps] = useState(allDeps);
  const fetcherRef = useRef(fetcher);

  // Resetting to a loading state here (during render) rather than in the
  // effect below, and reading fetcher via a ref, keeps this hook clean under
  // react-hooks/set-state-in-effect and exhaustive-deps without disabling
  // either rule.
  if (!areDepsEqual(allDeps, prevDeps)) {
    setPrevDeps(allDeps);
    setState((previous) => ({ ...previous, loading: true, error: null }));
  }

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Something went wrong",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [prevDeps]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  return { ...state, refetch };
}

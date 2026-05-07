import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { getIssue } from '@/assets/hooks/services/github';

interface UseIssueDetailsOptions {
  owner: string;
  repo: string;
  issueNumber?: number;
  enabled?: boolean;
}

export function useIssueDetails({
  owner,
  repo,
  issueNumber,
  enabled = true,
}: UseIssueDetailsOptions) {
  const [loading, setLoading] = useState(false);

  const [errorText, setErrorText] =
    useState('');

  const [issue, setIssue] =
    useState<any>(null);

  const fetchIssue = useCallback(async () => {
    if (!issueNumber || !enabled) {
      return;
    }

    try {
      setLoading(true);
      setErrorText('');

      const data = await getIssue({
        owner,
        repo,
        issueNumber,
      });

      setIssue(data);
    } catch (err: any) {
      setErrorText(
        err?.message ||
        'Failed to fetch issue.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    owner,
    repo,
    issueNumber,
    enabled,
  ]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  return {
    loading,
    errorText,
    issue,
    refetch: fetchIssue,
  };
}
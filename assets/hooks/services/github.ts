import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

interface GetIssueOptions {
  owner: string;
  repo: string;
  issueNumber: number;
}

export async function getIssue({
  owner,
  repo,
  issueNumber,
}: GetIssueOptions) {
  const response = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  return response.data;
}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'OnoAhto';

async function fetchGitHub(endpoint) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Stats-Generator'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getRepositories() {
  // 인증된 사용자가 접근 가능한 모든 저장소 (owner, collaborator, org member)
  const repos = await fetchGitHub(`/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member`);
  // 포크가 아닌 저장소만 필터링
  return repos.filter(repo => !repo.fork);
}

async function getRepoLanguages(owner, repo) {
  try {
    const languages = await fetchGitHub(`/repos/${owner}/${repo}/languages`);
    // 언어별 바이트 수의 합계 반환
    return Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  } catch (e) {
    console.log(`  - Languages error for ${repo}:`, e.message);
    return 0;
  }
}

async function getRepoCommits(owner, repo) {
  try {
    const commits = await fetchGitHub(`/repos/${owner}/${repo}/commits?per_page=1`);
    return commits[0] || null;
  } catch (e) {
    console.log(`  - Commits error for ${repo}:`, e.message);
    return null;
  }
}

async function getTotalCommits(owner, repo) {
  try {
    // contributors 통계에서 커밋 수 가져오기
    const contributors = await fetchGitHub(`/repos/${owner}/${repo}/contributors?per_page=100`);
    if (!Array.isArray(contributors)) return 0;
    return contributors.reduce((sum, c) => sum + c.contributions, 0);
  } catch (e) {
    console.log(`  - Contributors error for ${repo}:`, e.message);
    return 0;
  }
}

async function getOpenPRs() {
  try {
    const prs = await fetchGitHub(`/search/issues?q=author:${GITHUB_OWNER}+type:pr+is:open`);
    return prs.total_count || 0;
  } catch {
    return 0;
  }
}

async function getOpenIssues() {
  try {
    const issues = await fetchGitHub(`/search/issues?q=author:${GITHUB_OWNER}+type:issue+is:open`);
    return issues.total_count || 0;
  } catch {
    return 0;
  }
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function estimateLinesFromBytes(bytes) {
  // 평균적으로 1줄 = 약 40바이트로 추정
  return Math.round(bytes / 40);
}

async function generateStats() {
  console.log('Fetching GitHub stats...');

  const repos = await getRepositories();
  console.log(`Found ${repos.length} repositories`);

  // 총 코드 바이트 수 계산
  let totalBytes = 0;
  let totalCommits = 0;
  let latestCommit = null;
  let activeProject = null;

  for (const repo of repos) {
    const owner = repo.owner.login;
    console.log(`Processing: ${owner}/${repo.name}`);

    // 언어별 바이트 수
    const bytes = await getRepoLanguages(owner, repo.name);
    totalBytes += bytes;

    // 커밋 수
    const commits = await getTotalCommits(owner, repo.name);
    totalCommits += commits;

    // 최신 커밋 확인
    const repoLatestCommit = await getRepoCommits(owner, repo.name);
    if (repoLatestCommit) {
      const commitDate = new Date(repoLatestCommit.commit.author.date);
      if (!latestCommit || commitDate > new Date(latestCommit.date)) {
        latestCommit = {
          date: repoLatestCommit.commit.author.date,
          message: repoLatestCommit.commit.message.split('\n')[0], // 첫 줄만
          repo: repo.name
        };
        activeProject = repo.name;
      }
    }
  }

  // Open PRs & Issues
  const openPRs = await getOpenPRs();
  const openIssues = await getOpenIssues();

  const stats = {
    linesOfCode: estimateLinesFromBytes(totalBytes),
    linesFormatted: formatNumber(estimateLinesFromBytes(totalBytes)),
    repositories: repos.length,
    totalCommits: totalCommits,
    commitsFormatted: formatNumber(totalCommits),
    activeProject: activeProject || 'N/A',
    lastCommit: latestCommit ? latestCommit.date : new Date().toISOString(),
    lastCommitMessage: latestCommit ? latestCommit.message : 'N/A',
    openPRs: openPRs,
    openIssues: openIssues,
    openWork: openPRs + openIssues,
    updatedAt: new Date().toISOString()
  };

  console.log('\nGenerated stats:', stats);

  // public 디렉토리에 저장
  const outputPath = path.join(__dirname, '..', 'public', 'stats.json');
  fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));
  console.log(`\nStats saved to ${outputPath}`);
}

generateStats().catch(err => {
  console.error('Error generating stats:', err);
  process.exit(1);
});

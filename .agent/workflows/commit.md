---
description: Review uncommitted changes, check commit message conventions, commit and push
---

# Commit Workflow

## Steps

// turbo-all

1. **Review uncommitted changes**
   Run `git --no-pager diff --stat && git --no-pager diff` in the project root to see all unstaged changes, and `git --no-pager diff --cached --stat && git --no-pager diff --cached` for staged changes. Read through the diffs carefully to understand what was changed and why.

2. **Check recent commit message conventions**
   Run `git log --oneline -5` to view the last 5 commit messages. Note the format, prefix style (e.g. `feat:`, `fix:`, `refactor:`), casing, and length conventions used.

3. **Stage all changes**
   Run `git add -A` to stage everything.

4. **Commit with a conventional message**
   Based on your understanding of the changes (step 1) and the commit message conventions (step 2), craft a commit message that:
   - Follows the same style/prefix convention as the recent commits
   - Summarizes the change concisely in the subject line
   - Is written in imperative mood (e.g. "add" not "added")
   
   Run `git commit -m "<your message>"` with the crafted message.

5. **Push**
   Run `git push` to push the commit to the remote.

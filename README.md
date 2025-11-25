
# hello!

🔒 Git Workflow & Branch Rules

## Project structure (cleaned)

- `backend/node-server/`: Node/Express API server (moved from `backend/api-data-systems`).
- `backend/python-service/`: Python microservice for auxiliary tasks.
- `backend/scripts/`: Supabase utilities (moved from the backend root).
- `backend/testing-devops/` & `backend/user-trip-logic/`: Team documentation and planning notes.
- `frontend/web-app/`: Vite React frontend (renamed from `frontend/ui-ux`).
  - `examples/api-integration/`: Lightweight fetch demo consolidated from the previous standalone folder.

To keep our project organized and prevent merge conflicts, please follow this workflow:

🧭 Branch Workflow

Never commit directly to main.
The main branch is protected — all changes must go through a Pull Request (PR).

Create a new branch for your task using one of these formats:

feature/your-feature-name → for new features

fix/bug-description → for bug fixes

chore/update-readme → for documentation or small tweaks

Example:

git checkout -b feature/login-page


Make clear, descriptive commits.
Example commit messages:

feat: add login form validation
fix: correct typo in navbar
chore: update README with setup instructions


Open a Pull Request (PR) once your branch is ready.

Tag relevant reviewers if needed.

Wait for approval and make sure all conversations are resolved.

Once approved, merge it into main.


💡 Why We Do This

This workflow helps us:

Avoid merge conflicts

Keep a clean commit history

Ensure code review before changes go live

Protect our main branch from accidental changes

-------------------------------------------------------------------------------------
To Clone the Repo on VsCode 
- Locally/Manual 
> On your computer, open a terminal and type: 
 ' git clone https://github.com/your-username/travel-app.git cd travel-app '
> - Replace your-username with your GitHub username. This downloads the repo to your computer.
---------------
 - You can do it non-manually
> Make Sure to have VsCode downlaoded on your computer - linked it to your GitHub - Type "Let-s-Travel" Then add it as a folder on your desktop. 
 

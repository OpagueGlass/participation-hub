# Participation Hub
## Introduction
A secure, transparent platform to inform participants about research outcomes. Researchers create research collections to invite participants, enabling participants to view data visualisations and published papers associated with the research.

## Features
### User Authentication
- Participant registration through magic link with password setup
- Custom email template for invitation with a magic link
- Login for participants and researchers with email and password

### Participant Dashboard
- Show the summary of participation status and research collections
- Research collection page with the details, uploaded image visualisations and associated research papers
- Consent withdrawal from a research collection
- Feedback submission

### Researcher Dashboard
- Create and manage research collections
- Show owned collections with basic search and filtering functionality
- Invite Participants via email, sending the invitation email with the magic link to participants who have not previously registered
- Manage research papers associated with the collection
- Manage images representing data visualisations

## Documentation
The documentation can be found in [.github/docs.md](https://github.com/OpagueGlass/participation-hub/blob/main/.github/docs.md)

## Installation
1. Install dependencies on first clone
```bash
npm install
```

2. Initialise environment variables

3. Start the development server
```bash
npm run dev 
```

## Future Work
- Chatbot with access to the research's database schema provided by tbls
- Keycloak authentication for single sign-on


# Treeckle 2.0

[![Build Status](https://travis-ci.com/CS3219-SE-Principles-and-Patterns/cs3219-ay2021-s1-project-2020-s1-g12.svg?token=Xw6nHZzuJ4sB4zSroK2t&branch=master)](https://travis-ci.com/CS3219-SE-Principles-and-Patterns/cs3219-ay2021-s1-project-2020-s1-g12)

<p align="center">
  <img src="./assets/treeckle-title-bottom-transparent.png" alt="Treeckle" width="400"/>
</p>

Website: <https://v2.treeckle.com/>

_Currently in development._

Treeckle is a student life app for the Residential Colleges of NUS, intended to be a platform for the efficient booking of facilties, and the creation and management of events.

## Contributions Guidelines

### Naming of branches

- Use name initals (JT, KN, SY, MS)
- Follow by feature description (separated by -)
- E.g. JT-venue-creation

### Commits/PR

- Before merging, rebase and squash
- Commit message = Branch name = PR name
- PR by issue/feature
- Use github issues

### Backend

- Use venv
- [Style](https://google.github.io/styleguide/pyguide.html)
- Use snake_case, 4 spaces indentations and CONSTANT_VARIABLE
- Use list comphension
- Include constant file
- Use double quotes for strings

### Frontend

- Only use yarn (no npm)
- Typescript only in src file
- Component files use tsx, utils function files use ts
- Define constants instead of magic string
- Use enums
- Declare API response type

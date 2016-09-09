# Contributing to koa-better-body

:sparkles: Thanks for your contribution in advance! :tada:

First and foremost, thank you! We appreciate that you want to contribute to `koa-better-body`, your time is valuable, and your contributions mean a lot to us.

## What does "contributing" mean?

There are many ways to contribute to an open source project, including:

- Updating or correcting documentation
- Feature requests
- Submitting bug reports

But you aren't limited to these things. Use your imagination. If you like a project, and you see something that can or should be improved, then you have an opportunity (but not an obligation) to contribute. 

### Improve documentation

As a user of `koa-better-body` you're the perfect candidate to help us improve our documentation. Typo corrections, error fixes, better explanations, more examples, etc. Open issues for things that could be improved. Anything. Even improvements to this document.

Use the [`docs` label](https://github.com/tunnckoCore/koa-better-body/labels/docs) to find suggestions for what we'd love to see more documentation on.

### Improve issues

Some issues are created with missing information, not reproducible, or plain invalid. Help make them easier to resolve. Handling issues takes a lot of time that we could rather spend on fixing bugs and adding features.

### Give feedback on issues

We're always looking for more opinions on discussions in the issue tracker. It's a good opportunity to influence the future direction of AVA.

The [`question` label](https://github.com/tunnckoCore/koa-better-body/labels/question) is a good place to find ongoing discussions.


## Why should I contribute?

Regardless of the details, being an effective contributor means that you're adding _adding value_ to a project.

Here are just a few of the advantages of adding value to a project:

- you gain the appreciation and respect of the project's maintainers and community
- you gain valuable experience
- you get noticed by job recruiters
- you become more attrative to potential employers. 

## Getting familiarized with a project

Before you attempt to contribute to a project, take a moment to get familiarized with it. In most cases you can learn all you need to know within a couple of minutes. 

### Required

The following items are a pre-requisite for contributing to any project. Avoid creating issues or doing pull requests until you've done all of these things:

- **Review the readme**: Oftentimes a project readme has links to documentation, advice on creating issues or bug reports, and so on.
- **Read contributing guidelines**: look for a `CONTRIBUTING.md` file and, if one exists, read it in its entirety before creating issues or doing a pull request. Typically this is in the root of the project, but it might be in `.github/CONTRIBUTING.md`.
- **Search issues**: Before creating bug reports, feature requests, or submitting issues of any kind, you should always search for existing issues (closed or open) that address the same thing. 

### Recommended

- **Review unit tests** - one of the best ways to get familiarized with a project is through its unit tests. Of course, this depends on the type of project, complexity, test coverage, and so on. But when applicable, test are often a good source of insight.
- **Get familiarized with the code** - If the codebase is small, and you're familiar with the language, take a moment to review the code to see if you find anything that can be improved. If the codebase is large, you might be able to provide domain expertise or fixes for specific areas.
- **Ask questions** - Depending the project type and size, it might be good to start by searching google to find anwers to your questions. Then, check to see if the project uses [gitter](https://gitter.im) or has a [slack](https://slack.com) channel, or something similar. Also visit [stackoverflow](https://stackoverflow.com) and do a search to see if others have already asked the same question. As a last resort, create an issue on the project's GitHub repository.


## Details of Highly Effective Bug Reports

### Rationale

The easier you make it for a maintainter or members of the community to react, the more likely it is for them to react quickly. 

Like you, maintainers have to make decisions about where to spend their time. Not only within a given project, but oftentimes across multiple projects. If you're experiencing a bug and you want to make a report, bug reports that are clearly described and organized are much more likely to get addressed by the maintainers or member of the community.

Providing these details up front will make everyone happy. If you don't provide these details, maintainers will have to ask you for them, which can be annoying for experienced maintainers who have had to ask for these crucial details many times. 

### The details

Always include the following essential details in every bug report:

1. **version**: what version of `koa-better-body` were you using when you experienced the bug?
2. **description**: clear description of the bug, and minimum steps to reproduce it.
3. **error messages**: paste any error messages into the issue or a [github gist](https://gist.github.com/), use [gfm code blocks][gfm].
4. **code**: paste any code necessary for reproducing the bug and use [gfm code blocks][gfm] to wrap the code.
5. **title**: use a clear and descriptive title.

See GitHub's guide to [Creating and highlighting code blocks][gfm] for more details.

## Submitting a pull requests

- Non-trivial changes are often best discussed in an issue first, to prevent you from doing unnecessary work.
- For ambitious tasks, you should try to get your work in front of the community for feedback as soon as possible. Open a pull request as soon as you have done the minimum needed to demonstrate your idea. At this early stage, don't worry about making things perfect, or 100% complete. Add a [WIP] prefix to the title, and describe what you still need to do. This lets reviewers know not to nit-pick small details or point out improvements you already know you need to make.
- New features should be accompanied with tests and documentation.
- Don't include unrelated changes.
- Lint and test immediately after you fork by running `$ npm test`.
- Lint and test before submitting the pull request by running `$ npm test`.
- Make the pull request from a [topic branch](https://github.com/dchelimsky/rspec/wiki/Topic-Branches), not master.
- Use a clear and descriptive title for the pull request and commits.
- Write a convincing description of why we should land your pull request. It's your job to convince us. Answer "why" it's needed and provide use-cases.
- You might be asked to do changes to your pull request. There's never a need to open another pull request. [Just update the existing one.][amending]

## Other ways to contribute

### Show your support

Sometimes we find a project we like but just don't have time to contribute. That's okay, there are other ways to show support:

- Star the project
- Tweet about it
- Tell your friends

### Show your appreciation

Maintainers are people too. You can make someone's day by letting them know you appreciate their work. If you use a library in one of your own projects, let the author know you care:

- Add a link to the project on your project's readme
- Say "thanks" on twitter

## Attribution

This document is adapted from a few Contributing Guides. It is more general and can apply in most cases. Everyone is free to re-use it or re-adapt it.

### Good to read

- [Awesome Contributing][awesomelist]
- [Idiomatic Contributing][idiomatic]
- [AVA's Contributing Guide][avajs]
- [Amending a commit Guide][amending]
- [Creating and highlighting code blocks][gfm]

### Authors

**Charlike Mike Reagent**

* [github/tunnckoCore](https://github.com/tunnckoCore)
* [twitter/tunnckoCore](http://twitter.com/tunnckoCore)

## License

Released under [Creative Commons](https://creativecommons.org/licenses/by/3.0/).  
Copyright © 2016, [Charlike Mike Reagent](https://twitter.com/jonschlinkert).

[gfm]: https://help.github.com/articles/creating-and-highlighting-code-blocks/
[avajs]: https://github.com/avajs/ava/blob/master/contributing.md
[idiomatic]: https://github.com/jonschlinkert/idiomatic-contributing
[awesomelist]: https://github.com/jonschlinkert/awesome-contributing
[amending]: https://github.com/RichardLitt/docs/blob/master/amending-a-commit-guide.md
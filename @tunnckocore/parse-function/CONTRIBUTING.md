# Contributing Guide :100: 

> _Hello stranger! :sparkles: Please, read the [Code Of Conduct](./CODE_OF_CONDUCT.md) and the full guide at [tunnckoCore/contributing](https://github.com/tunnckoCore/contributing)!  
> Even if you are an experienced developer or active open source maintainer, it worth look over there._

![welcome-teal](https://cloud.githubusercontent.com/assets/194400/22215755/76cb4dbc-e194-11e6-95ed-7def95e68f14.png)

> “_Every thought, **every word**, and **every action**
that **adds to** the **positive** is a **contribution to peace**. <br />
Each and **every one** of us is **capable** of making such a **contribution**_.”
~ [Aung San Suu Kyi](https://en.wikipedia.org/wiki/Aung_San_Suu_Kyi)

Firstly, a ***heartfelt thank you*** for making time to contribute to this project! <br />

<!-- Part 1 -->

## Are you new to Open Source?

If you’re a **new** open source contributor, the process can be intimidating.  
_What if you don’t know how to code?_ What if something goes wrong? **Don't worry!**

**You don’t have to contribute code!** A common misconception about contributing to open source is that you need to _contribute code_. In fact, it’s often the other parts of a project that are most neglected or overlooked. You’ll do the project a _huge favor_ by offering to pitch in with these types of **contributions**!

**Even if you like to write code**, other types of contributions are a great way to get involved with a project and meet other community members. Building those relationships will give you opportunities to work on other parts of the project.

- **Yes:** [Step to the full guide](https://github.com/tunnckoCore/contributing) if you are _new_, **super curious** _OR_ if you're **really really new** and need more depth.
- **No:** Then continue reading, if you **know** for _what is all that_ or you're **familiar** with [@tunnckoCore](https://github.com/tunnckoCore) projects.

<!-- Part 2 -->

## Opening an issue

You should usually open an issue in the following situations:

- Report an error you can't solve yourself
- Discuss a high-level topic or idea (ex. community, vision, policies)
- Propose a new feature or other project idea

### Tips for communicating on issues:

- **If you see an open issue that you want to tackle,** comment on the issue to let people know you're on it. That way, people are less likely to duplicate your work.
- **If an issue was opened a while ago,** it's possible that it's being addressed somewhere else, or has already been resolved, so comment to ask for confirmation before starting work.
- **If you opened an issue, but figured out the answer later on your own,** comment on the issue to let people know, then close the issue. Even documenting that outcome is a contribution to the project.
- **Please be patient** and _wait_ a response from maintainer or somebody else. Check out [_"What to do next?"_](https://github.com/tunnckoCore/contributing#what-can-i-do-while-im-waiting).

### Include Any/All _Relevant_ Information in the _Issue Description_

- Please _include_ as much ***relevant information*** as you can like versions and operating system.
- A _good_ issue _describes_ the idea in a _**concise** and **user-focused**_ way.
- ***Never*** leave the issue _description_ blank even when you are in a "rush" - the point of issues is to _communicate_.

**Why not empty description?** You _wouldn't_ send a _blank email_ to hundreds of your friends (_unless you wanted to freak them out!_), right? Submitting _blank issues_ is doing **exactly** that! It sends a ["_I have **no idea** what I'm doing_"](https://www.google.com/search?q=i+have+no+idea+what+i%27m+doing&tbm=isch) **message** to your _peers_.

<!-- Part 3 -->

## Opening a pull request

> _If this is your first pull request, check out [Make a Pull Request](http://makeapullrequest.com/) by [**@kentcdodds**](https://github.com/kentcdodds)._

![get-it-done](https://cloud.githubusercontent.com/assets/194400/22265743/44a2ca72-e275-11e6-819d-2c5a1958ea11.png)

You should usually open a pull request in the following situations:

- Submit trivial fixes (ex. a typo, broken link, or obvious error)
- Start work on a contribution that was already asked for, or that you've already discussed, in an issue

A pull request doesn't have to represent finished work. It's usually better to open a pull request early on, so others can watch or give feedback on your progress. Just mark it as a "WIP" (Work in Progress) in the subject line. You can always add more commits later.

### Pro Tips to follow

- **Don't mind about the style** because we use [StandardJS](https://github.com/standard/standard), [ESLint](https://github.com/eslint/eslint) and [Prettier](https://github.com/prettier/prettier). Use `npm run lint` command.
- **Don't change the markdown files**, because the README is generated (it isn't hand written) and the API section is from JSDoc code comments. Let this step to us when _and if_ pull request is merged.
- **Dont't comment tests**, instead use `test.skip`. They'll still be shown in the output, but are never run.

### How to submit a pull request

There are just **8 easy steps** you should do. _**Please**_, follow them in _that exact_ order.

1. **[Fork the repository](https://guides.github.com/activities/forking/)** and clone it locally.
2. **[Create a branch](https://guides.github.com/introduction/flow/)** for your edits.
3. **Install dependencies** by running `npm install` command.
4. **Test everything is working** before you start _doing anything_ with `npm test` command. If something is wrong, please report it first and don't continue if you can't skip the problem easily.
5. **Reference any relevant issues** or supporting documentation or information in your PR (ex. "Closes #37.")
6. **Test again or add new ones!** Run `npm test` again to _make sure_ your changes don't break existing tests.
7. **Commit your changes** by running `npm run commit`. It _will lead you_ through what the commit message _should look like_ and will run more tasks **to ensure** that code style and tests are okey. 
8. **Wait response!** What to do in that time? Check out [_**"What to do next?"**_](https://github.com/tunnckoCore/contributing#what-can-i-do-while-im-waiting).

:star: **You did it**! :star: _Congratulations on becoming one of the [Open Source](https://opensource.guide) contributors!_

![thank-you-green-large](https://cloud.githubusercontent.com/assets/194400/22229077/5b0695ee-e1cd-11e6-9001-e5ff53afce36.jpg)

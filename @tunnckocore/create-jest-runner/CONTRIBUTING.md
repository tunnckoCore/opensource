### Setup up your dev environment

1. Fork the repo and create your branch from `master`.
   A guide on how to fork a repository: https://help.github.com/articles/fork-a-repo/
   
   Open terminal (e.g. Terminal, iTerm, Git Bash or Git Shell) and type:
   ```sh
   git clone https://github.com/<your_username>/jest-runner-utils
   cd jest
   git checkout -b my_branch
   ```
   Note:
   Replace `<your_username>` with your GitHub username

2. jest-runner-utils uses [Yarn](https://code.facebook.com/posts/1840075619545360)
   for running development scripts. If you haven't already done so,
   please [install yarn](https://yarnpkg.com/en/docs/install).

3. Run `yarn`.
   
     ```sh
    yarn
    ```

5. If you've changed APIs, update the documentation.

6. Ensure the test suite passes via `yarn test`. To run the test suite you

   ```sh
   yarn test
   ```
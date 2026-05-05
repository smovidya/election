# Project Overview

## 🚀 What is Astro?

**Astro** is a modern front-end framework designed to build fast websites with minimal JavaScript. It focuses on content-first development and provides the flexibility to use various frameworks like React, Vue, Svelte, and more while ensuring your site is lightweight and optimized for performance. Astro generates static HTML by default, which helps in improving SEO (Search Engine Optimization) and page load speeds.

---

## 🎨 What is Tailwind CSS?

**Tailwind CSS** is a utility-first CSS framework that makes it easy to build custom designs quickly. Instead of writing custom CSS, you apply pre-defined classes directly in your HTML. This approach allows for rapid development and makes it easy to adjust the design of your site without writing a lot of extra code.

---

## 🪄 What is Shadcn?

**Shadcn** is a component library that works well with Tailwind CSS. It provides a set of pre-built, customizable UI components that can be used in your projects to make design and development faster and easier. The components are designed with accessibility and responsiveness in mind, ensuring they work well across different devices and screen sizes. By integrating Shadcn, you can quickly enhance the user interface without needing to build everything from scratch.

---

## 📋 Setup Instructions

### 1. Clone the repository

Start by cloning this repository to your local machine:

```sh
git clone <repository-url>
```

### 2. Install dependencies

Navigate to the project folder and install the required dependencies using **bun**:

```sh
cd <project-directory>
bun install
```

### 3. Create and switch to a new branch

Before making any changes, create a new branch for your work. Name the branch according to the feature or fix you're working on. For example:

```sh
git checkout -b feature/new-feature
```

Or for bug fixes:

```sh
git checkout -b fix/bug-name
```

### 4. Run the project locally

Start the local development server:

```sh
bun dev
```

You can now view the project at `localhost:4321` in your browser.

### 5. Format and Lint the Code

Before committing your changes, ensure your code is properly formatted and linted:

```sh
bun run format
bun run lint
```

### 6. Build the project

To build the production version of your site:

```sh
bun build
```

### 7. Preview the build

Before deploying, preview your build locally:

```sh
bun preview
```

---

## 🧑‍💻 Commit Rules

To maintain a clean and understandable project history, follow these commit rules:

1. **Commit Messages**:
   - Use the present tense. Example: "Add new feature" instead of "Added new feature."
   - Keep the message brief (under 50 characters).
   - If necessary, provide a detailed explanation after a blank line.

2. **Types of Commit Messages**:
   - **feat**: New feature or improvement.
   - **fix**: Bug fix.
   - **docs**: Documentation changes.
   - **style**: Changes that do not affect functionality (e.g., formatting, missing semicolons).
   - **refactor**: Refactoring code without changing functionality.
   - **test**: Adding or modifying tests.
   - **chore**: General tasks or maintenance.

3. **Example Commit Message**:
   ```text
   feat: add dark mode support
   ```

---

## 🔄 Pull Request Guidelines

When opening a pull request (PR), please follow these guidelines:

1. **Descriptive PR Title**:
   - Use a clear and concise title that summarizes the changes.

2. **PR Description**:
   - Provide a detailed description of what was changed, why it was changed, and any additional context for reviewers.

3. **Linking Issues**:
   - If the PR addresses an open issue, mention it in the PR description. Example:
     ```text
     Closes #123
     ```

4. **Test Your Code**:
   - Ensure that your code works correctly and does not break existing functionality.

5. **Request a Review**:
   - Assign at least one team member to review your PR before merging.

---

## ⚙️ Additional Resources

- [Astro Documentation](https://astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn Documentation](https://ui.shadcn.com)
- [GitHub Pull Request Guidelines](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)

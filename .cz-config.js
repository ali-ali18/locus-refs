module.exports = {
  prompter(cz, commit) {
    cz.prompt([
      {
        type: "list",
        name: "type",
        message: "Select commit type",
        choices: [
          { value: "feat", name: "feat: A new feature" },
          { value: "fix", name: "fix: A bug fix" },
          { value: "docs", name: "docs: Documentation only changes" },
          {
            value: "refactor",
            name: "refactor: A code change that neither fixes a bug nor adds a feature",
          },
          {
            value: "test",
            name: "test: Adding missing tests or correcting existing tests",
          },
          {
            value: "chore",
            name: "chore: Changes to the build process or auxiliary tools and libraries such as documentation generation",
          },
          {
            value: "style",
            name: "style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
          },
          {
            value: "perf",
            name: "perf: A code change that improves performance",
          },
          { value: "other", name: "other: A commit of a different type" },
        ],
      },
      {
        type: "input",
        name: "location",
        message: "Enter the location of the commit (dashboard, auth, etc.)",
        validate: (val) => (val.trim() ? true : "Location is required"),
      },
      {
        type: "input",
        name: "title",
        message: "Enter the title of the commit (limited to 72 characters)",
        validate: (val) => {
          if (!val.trim()) return "Title is required";
          if (val.length > 72) return "Title must be less than 72 characters";
          return true;
        },
      },
      {
        type: "input",
        name: "content",
        message: "Insert commit content",
        validate: (val) => (val.trim() ? true : "Content is required"),
      },
      {
        type: "input",
        name: "closes",
        message:
          "Enter the issue number(s) closed by this commit (#123, #456 or press enter to skip)",
      },
      {
        type: "input",
        name: "note",
        message: "Important note (or enter to skip)",
      },
    ]).then(({ type, location, title, content, closes, note }) => {
      let footer = "";
      if (closes.trim())
        footer += `Closes #${closes.trim().replace(/^#+/, "")}\n`;
      if (note.trim()) footer += `Note: ${note.trim()}\n`;

      const message = [
        `${type}(${location}): ${title}`,
        content.trim(),
        footer.trim(),
      ]
        .filter(Boolean)
        .join("\n\n");

      commit(message);
    });
  },
};

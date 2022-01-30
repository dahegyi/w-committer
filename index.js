#!/usr/bin/env node

// Commit messages are based on Karma guidelines
// http://karma-runner.github.io/1.0/dev/git-commit-msg.html

import inquirer from "inquirer";
import { exec } from "child_process";

const askTaskId = async () => {
  const answer = await inquirer.prompt({
    name: "task_id",
    type: "input",
    message: "Enter Azure task ID:",
  });

  if (!answer.task_id) {
    console.error("⛔ Task ID cannot be empty!");
  } else if (!Number.isInteger(Number(answer.task_id))) {
    console.error("⛔ Task ID should only contain numbers!");
  } else if (answer.task_id.length < 6) {
    console.error(
      "⛔ Make sure you've typed the right task number. We are currently beyond 100000!"
    );
  } else {
    return answer.task_id;
  }
};

const askTaskType = async () => {
  const answer = await inquirer.prompt({
    name: "task_type",
    type: "list",
    message: "Select the type of the commit:\n",
    choices: ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
  });

  return answer.task_type;
};

const askTouchedComponent = async () => {
  const answer = await inquirer.prompt({
    name: "touched_component",
    type: "input",
    message: "Which component is affected?",
  });

  if (!answer.touched_component) {
    console.error("⛔ Component name cannot be empty!");
  } else {
    return answer.touched_component;
  }
};

const askCommitMessage = async () => {
  const answer = await inquirer.prompt({
    name: "commit_message",
    type: "input",
    message: "Enter commit message:",
  });

  if (!answer.commit_message) {
    console.error("⛔ Commit message cannot be empty!");
  } else {
    return answer.commit_message;
  }
};

const commit = async () => {
  let taskId, taskType, touchedComponent, commitMessage;

  while (!taskId) taskId = await askTaskId();
  while (!taskType) taskType = await askTaskType();
  while (!touchedComponent) touchedComponent = await askTouchedComponent();
  while (!commitMessage) commitMessage = await askCommitMessage();

  const script = exec(
    `git commit -m '#${taskId} ${taskType}(${touchedComponent}): ${commitMessage}'`
  );
  script.stdout.on("data", function (data) {
    console.log("🟡 committing...\n", data.toString());
  });
  script.stderr.on("data", function (data) {
    console.log(data.toString());
  });
};

console.clear();
await commit();

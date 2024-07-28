import type { Meta, StoryObj } from "@storybook/web-components";
import { fn } from "@storybook/test";
import type { ButtonProps } from "./Button";
// import { Button } from './Button';
import add from "@common/utils";

type Args = [number, number];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Example/Button",
  tags: ["autodocs"],
  render: (args: Args) => `<span>${add(args[0], args[1])}<span>`,
  argTypes: [{ control: "number" }, { control: "number" }],
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: [1, 2],
};

export const Secondary: Story = {
  args: [2, 2],
};

export const Large: Story = {
  args: [9, 2],
};
export const Small: Story = {
  args: [5, 2],
};

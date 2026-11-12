import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// House style: no em dashes (U+2014) in anything a visitor can read. Checked on string
// literals, template strings and JSX text, so code comments are not affected. Includes the
// escaped forms (\u2014, &mdash;, &#8212; and &#x2014;) that would render as one.
const EM_DASH = "\\u2014|\\\\u2014|&mdash;|&#8212;|&#x2014;";
const NO_EM_DASH_MESSAGE =
  "No em dashes in UI copy. Rewrite with a comma, colon, period, parentheses or a hyphen (see CLAUDE.md).";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=/${EM_DASH}/i]`, message: NO_EM_DASH_MESSAGE },
        { selector: `TemplateElement[value.cooked=/${EM_DASH}/i]`, message: NO_EM_DASH_MESSAGE },
        { selector: `JSXText[value=/${EM_DASH}/i]`, message: NO_EM_DASH_MESSAGE },
      ],
    },
  },
];

export default eslintConfig;

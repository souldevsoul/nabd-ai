/**
 * ESLint Rule: no-redundant-roles
 *
 * Warns against adding ARIA roles that are implicit for HTML elements.
 * These are redundant and add unnecessary code.
 *
 * Examples of redundant roles:
 * - <button role="button"> - button already has implicit role="button"
 * - <a href="..." role="link"> - anchor with href has implicit role="link"
 * - <img role="img"> - img has implicit role="img"
 * - <nav role="navigation"> - nav has implicit role="navigation"
 *
 * WCAG 2.1: 4.1.2 Name, Role, Value
 *
 * @version 1.0.0
 * @category Accessibility
 */

// Map of HTML elements to their implicit ARIA roles
const IMPLICIT_ROLES = {
  // Interactive elements
  button: ['button'],
  a: ['link'], // Only when href is present
  input: ['textbox', 'checkbox', 'radio', 'button', 'searchbox', 'spinbutton', 'slider', 'combobox'],
  select: ['combobox', 'listbox'],
  textarea: ['textbox'],

  // Sectioning elements
  article: ['article'],
  aside: ['complementary'],
  footer: ['contentinfo'], // When not inside article/aside/main/nav/section
  header: ['banner'], // When not inside article/aside/main/nav/section
  main: ['main'],
  nav: ['navigation'],
  section: ['region'], // When has accessible name

  // Structural elements
  form: ['form'], // When has accessible name
  table: ['table'],
  thead: ['rowgroup'],
  tbody: ['rowgroup'],
  tfoot: ['rowgroup'],
  tr: ['row'],
  th: ['columnheader', 'rowheader'],
  td: ['cell', 'gridcell'],

  // Other elements
  img: ['img', 'presentation'], // presentation when alt=""
  ul: ['list'],
  ol: ['list'],
  li: ['listitem'],
  dl: ['list'],
  dt: ['term'],
  dd: ['definition'],
  figure: ['figure'],
  figcaption: ['caption'],
  hr: ['separator'],
  menu: ['list', 'menu'],
  meter: ['meter'],
  progress: ['progressbar'],
  dialog: ['dialog'],
  details: ['group'],
  summary: ['button'],
  output: ['status'],
  address: ['group'],
  fieldset: ['group'],
  legend: ['legend'],
  optgroup: ['group'],
  option: ['option'],
  datalist: ['listbox'],
  search: ['search'],
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow redundant ARIA roles that are implicit for HTML elements',
      category: 'Accessibility',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      redundantRole: 'The role "{{role}}" is implicit for <{{element}}>. Remove the redundant role attribute.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')) {
      return {};
    }

    // Skip non-JSX files
    if (!filename.endsWith('.jsx') && !filename.endsWith('.tsx')) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        // Get element name
        if (node.name.type !== 'JSXIdentifier') return;

        const elementName = node.name.name.toLowerCase();

        // Skip custom components (PascalCase)
        if (node.name.name[0] === node.name.name[0].toUpperCase()) return;

        // Get role attribute
        const roleAttr = node.attributes.find(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            attr.name.name === 'role'
        );

        if (!roleAttr || !roleAttr.value) return;

        // Get role value
        let roleValue = null;
        if (roleAttr.value.type === 'Literal') {
          roleValue = roleAttr.value.value;
        } else if (
          roleAttr.value.type === 'JSXExpressionContainer' &&
          roleAttr.value.expression.type === 'Literal'
        ) {
          roleValue = roleAttr.value.expression.value;
        }

        if (!roleValue || typeof roleValue !== 'string') return;

        // Check if role is implicit for this element
        const implicitRoles = IMPLICIT_ROLES[elementName];
        if (!implicitRoles) return;

        // Special case: <a> only has implicit role="link" when href is present
        if (elementName === 'a') {
          const hasHref = node.attributes.some(
            (attr) =>
              attr.type === 'JSXAttribute' &&
              attr.name.type === 'JSXIdentifier' &&
              attr.name.name === 'href'
          );
          if (!hasHref) return;
        }

        // Check if the role is redundant
        if (implicitRoles.includes(roleValue.toLowerCase())) {
          context.report({
            node: roleAttr,
            messageId: 'redundantRole',
            data: {
              role: roleValue,
              element: elementName,
            },
            fix(fixer) {
              // Remove the role attribute
              const sourceCode = context.getSourceCode();
              const attrIndex = node.attributes.indexOf(roleAttr);

              // Get range to remove (including leading/trailing whitespace)
              let start = roleAttr.range[0];
              let end = roleAttr.range[1];

              // Remove leading whitespace
              const text = sourceCode.getText();
              while (start > 0 && /\s/.test(text[start - 1])) {
                start--;
              }

              return fixer.removeRange([start, end]);
            },
          });
        }
      },
    };
  },
};

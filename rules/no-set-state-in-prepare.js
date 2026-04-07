module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow setState inside prepare()',
    },
    schema: [],
  },

  create(context) {
    function isThisSetStateCall(node) {
      return (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'ThisExpression' &&
        (
          (node.callee.property.type === 'Identifier' &&
            node.callee.property.name === 'setState') ||
          (node.callee.property.type === 'Literal' &&
            node.callee.property.value === 'setState')
        )
      );
    }

    return {
      // This targets ONLY CallExpressions inside prepare()
      "MethodDefinition[key.name='prepare'] CallExpression"(node) {
        if (isThisSetStateCall(node)) {
          context.report({
            node,
            message:
              'Do not call this.setState inside prepare(). Write to "this" directly and manually control the updates',
          });
        }
      },
    };
  },
};

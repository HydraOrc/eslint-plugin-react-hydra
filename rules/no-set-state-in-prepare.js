function traverse(node, visitor) {
  if (!node || typeof node !== 'object') {
    return;
  }

  visitor(node);

  for (const key in node) {
    const child = node[key];

    if (Array.isArray(child)) {
      child.forEach((c) => traverse(c, visitor));
    } else {
      traverse(child, visitor);
    }
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow setState inside prepare()',
    },
    schema: [],
  },

  create(context) {
    function isPrepareMethod(node) {
      return (
        node.key &&
        node.key.type === 'Identifier' &&
        node.key.name === 'prepare'
      );
    }

    function isThisSetStateCall(node) {
      return (
        node.type === 'CallExpression' &&
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
      MethodDefinition(node) {
        if (!isPrepareMethod(node)) {
          return;
        }

        const check = (inner) => {
          if (isThisSetStateCall(inner)) {
            context.report({
              node: inner,
              message: 'Do not call this.setState inside prepare(). Write to "this" directly and manually control the updates',
            });
          }
        };

        traverse(node.value.body, {
          enter: check,
        });
      },
    };
  },
};

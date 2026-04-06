module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow getDerivedStateFromProps',
    },
    schema: [],
  },

  create(context) {
    return {
      MethodDefinition(node) {
        if (
          node.static &&
          node.key &&
          node.key.type === 'Identifier' &&
          node.key.name === 'getDerivedStateFromProps'
        ) {
          context.report({
            node,
            message:
              'Do not use getDerivedStateFromProps. Use componentWillReceiveProps with "this.prepare" instead',
          });
        }
      },
    };
  },
};

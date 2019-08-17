module.exports = {
  meta: {
    type: 'suggestion',
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        // return if given import declaration doesn't apply to "react" path
        if (node.source.value !== 'react') {
          return;
        }

        // possible specifier types:
        // - ImportSpecifier,
        // - ImportDefaultSpecifier,
        // - ImportNamespaceSpecifier
        const specifiers = node.specifiers;

        const howManySpecifiers = specifiers.length;

        const importSpecifiers = specifiers.filter(
          specifier => specifier.type === 'ImportSpecifier',
        );

        const importSpecifierNames = importSpecifiers.map(
          importSpecifier => importSpecifier.imported.name,
        );

        const howManyImportSpecifiers = importSpecifiers.length;

        /*
         It works for: import {} from "react";
         but DOESN'T work in the following case:
         import React, {} from "react";
         because the ImportDeclaration registers only React
         as a "ImportDefaultSpecifier", the {} part is ignored
        */
        if (howManySpecifiers === 0) {
          const message = 'Use React.* instead of destructuring react imports';
          context.report({message, node});
        }

        // import {x} from "react";
        // import React, {x} from "react";
        if (howManyImportSpecifiers === 1) {
          const firstName = importSpecifierNames[0];
          const message = `Use React.${firstName} instead of destructuring react imports`;
          context.report({message, node});
        }

        // import {x, y} from "react";
        // import React, {x, y} from "react";
        if (howManyImportSpecifiers > 1) {
          const joinedNames = importSpecifierNames.join(',');
          const message = `Use React.{${joinedNames}} instead of destructuring react imports`;
          context.report({message, node});
        }
      },
    };
  },
};

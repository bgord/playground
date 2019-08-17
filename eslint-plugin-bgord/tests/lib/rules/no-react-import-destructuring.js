const rule = require('../../../lib/rules/no-react-import-destructuring');
const RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const ruleTester = new RuleTester();

ruleTester.run('no-react-import-destructuring', rule, {
  valid: [
    "import React from 'react'",
    "import * as React from 'react';",
    "import {x} from 'y'",
    "import React, {} from 'react';",
  ],
  invalid: [
    {
      code: 'import {useState} from "react";',
      errors: [
        {
          message: 'Use React.useState instead of destructuring react imports',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import React, {useState} from "react";',
      errors: [
        {
          message: 'Use React.useState instead of destructuring react imports',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import {useState, useEffect} from "react";',
      errors: [
        {
          message:
            'Use React.{useState,useEffect} instead of destructuring react imports',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import React, {useState, useEffect} from "react";',
      errors: [
        {
          message:
            'Use React.{useState,useEffect} instead of destructuring react imports',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import {} from "react";',
      errors: [
        {
          message: 'Use React.* instead of destructuring react imports',
          type: 'ImportDeclaration',
        },
      ],
    },
  ],
});

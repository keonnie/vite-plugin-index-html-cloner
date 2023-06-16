# Variables parsing

## Summary

We have implemented variable parsing when index files are cloned, enabling the generation of dynamic pages with individual metadata. This feature proves particularly useful for enhancing search engine optimization (SEO) since each subdirectory index file represent a main page within its directory. By parsing meta attributes such as "description" and "keywords," users can optimise their pages for improved visibility and search engine rankings.

## Usage

Given the application has a directory `users` where an `index.html` page will be generated. Create a file `.seo.yml` in this directory.

```yml
# /users/.seo.yml
description: List of users
keywords: users, listing
```

```html
<!-- /index.html -->
<head>
  ...
  <meta description="{{description}}" />
  <meta keywords="{{keywords}}" />
</head>
<body>
  ...
</body>
```

The page generated will be:

```html
<!-- /index.html -->
<head>
  ...
  <meta description="List of users" />
  <meta keywords="users, listing" />
</head>
<body>
  ...
</body>
```

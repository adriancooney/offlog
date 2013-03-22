# Offlog Theming
Offlog theme's are similiar to that of Tumblrs. They're a one-sheet for everything and formatted with the Mustache JS templating engine. It's really best to take a look at the default theme and see by example how they work.

## Variables supplied
The following are global variables supplied to every themesheet:
`blog_title`, `blog_description`, author_name`, `author_email`, `author_bio`, `author_avatar` (url), `date{day, month, date, year}`

## Article Loop
The article loop is denoted by the opening `{#article}` tag and the closing `{/article}` tag. Inside the loop, several variables are provided to display the content of the articles. These include: `article_timestamp{day, date, month, year}`, `article_title`, `article_content` (html, use unescape tags ({{{ }}})). For example:

	{{#article}}
		<article>
			<h1><span>{{article_timestamp.date}}<br><em>{{article_timestamp.month}}</em></span>{{article_title}}</h1>
			{{{article_content}}}
		</article>
	{{/article}}

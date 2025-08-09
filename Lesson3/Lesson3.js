// Strings = text

'hello'

alert('hello');

//'sometext'
'some' + 'text'

//Concatenation
'some' + 'more' + 'text'

//typeof

// 'number'
typeof 2

// 'string'
typeof 'hello'

// string plus int is converted to STRING --> Type Coercion(automatic type conversion)

//'hello3'
'hello' + 3

// '$20.957.99'
'$' + 20.95 + 7.99

// '$28.94'
'$' + (2095 + 799)/100

// 'Items (2): $28.94
'Items (' + (1 + 1) + '): $' + (2095 + 799)/100

alert('Items (' + (1 + 1) + '): $' + (2095 + 799)/100);

// 3 ways to create a string
'hello'
"hello"
`hello`

"I'm learning JavaScript"

// Escape Character
'I\'m learning JavaScript'

// New Line Escape Character (\n)
alert('some\ntext');


// Template String
`hello`

// Template String features include interpolation.
// Interpolation lets you insert value directly into a string -> ${}
`Items (${1 + 1}): $${(2095+799) / 100}`

// Template String feature includes multi-line strings. ONLY in template strings
`some 
text`
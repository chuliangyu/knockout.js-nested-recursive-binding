# knockout.js-nested-recursive-binding

knockout.js nested/recursive binding
============

Kncokout.js does not allow nested binding. It does provides a solution by using knockout components. However in my opinion knockout comkponent has its drawbacks. One of the drawback is that you have to pass the data from the parent data model. Sometimes that is not desired (as shown in the exmaple below). Another drawback is that you to define client side templates. 

The rbind() function here allows recursive binding of knockout.js without resort to knockout.js templates. Furthermore, child models are independent from parent models, making it extremely easy to insert and remove any self-contained DOM and its model into your code.

Example
============
Lets say that you have a javascript model to control HTML form ajax submit, and inside the form, you have some address fields (street, city, state, country, zipcodes). You want a javascript model bound to the address fields, so that when a user select a country, the 'State' field is updated with states of that selected country.

The html code will be:
```html
<form method="post" action="..." data-model="ajaxFormModel" id="myform">
	....
	<div data-model="addressModel">
		<label>Street line 1</label>
		<input type="text" name="street_1" />
		.....
		<select name="country">...</select>
		<select name="state"">...</select>
		....
	</div

	<button type="submit">submit</button>
</form>
```

The javascript code will be

```js
var address = require('address'); //assume that you have an 'address' model
var ajaxForm = require('ajaxform'); //assume you have an ajax form model to handle ajax form submission

var models = function(){
	this.ajaxFormModel = new ajaxForm();
	this.addressModel = new address();
};

rbind(new models(), document.getElementById('myForm'));
```

The 2nd parameter for rbind() is the DOM, if not provided, rbind will walk through the whole html body.

How it works
============
rbind() walk through the HTML DOM, find DOM elements that needs to be bound with a model (which has the 'data-model' attributes defined, remove them from the DOM and bind with the specified model, then insert these DOM elements back into the html DOM. 

If a model needs to have access to the DOM it is binded to, it should define a setElement() function. rbind() will call the setElement() and pass the DOM element as the parameter. 

Side effects
============
Because the binded DOM elments are removed and inserted back into the html DOM, the page might appear jumping when it is loaded. There are simpilar issues when using other JS frameworks such as Angular JS.

One way to handle this is to hide the content of the page until the javascript is run. For example:

```html
<body>
	.....
	<div id="content" class="hidden">

	</div>
	<script>
		//assuming you are using jquery
		$(function(){
			$('#content').removeClass('hidden').removeClass('spinner');
		});
	</script>
</body>

```



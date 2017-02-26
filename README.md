knockout.js nested/recursive binding
============

Kncokout.js does not allow nested binding. It does provides a solution by using knockout components. However knockout components has its drawbacks. One is that the data for the components needs to be passed from the parent data model, often that is not desired (as shown in the exmaple below). Another drawback is that you need to define client side templates. If you have been using service side templates all along, it becomes annoying to have templates spreaded on both server and client sides. 

The rbind() function here allows recursive binding of knockout.js without resort to knockout.js templates. Furthermore, child models are independent from parent models, making it extremely easy to insert or remove any self-contained DOM and its model.

Example
============
Lets say that you have a javascript model to control HTML form ajax submit, and inside the form, you have some address fields (street, city, state, country, zipcodes) that are bound to an address model, so that when a user select a country, the 'State' field is updated with states of that selected country.

The html code will be:
```html
<form method="post" action="..." data-model="ajaxFormModel" id="myform">
	...
	<div data-model="addressModel">
		<label>Street line 1</label>
		<input type="text" name="street_1" />
		...
		<select name="country">...</select>
		<select name="state">...</select>
		...
	</div>
        ...
	<button type="submit">submit</button>
</form>
```

The javascript code will be

```js
var address = require('Address'); //assume that you have an 'Address' model
var ajaxForm = require('Ajaxform'); //assume you have an 'AjaxForm' model to handle ajax form submission

var models = function(){
	this.ajaxFormModel = new ajaxForm();
	this.addressModel = new address();
};

rbind(new models(), document.getElementById('myForm'));
```

The 2nd parameter for rbind() is the DOM, if not provided, rbind will walk through the whole html body.

How it works
============
rbind() walk through the HTML DOM, find DOM elements that have the 'data-model' attributes defined, remove them from the DOM and bind with the specified model, then insert these DOM elements back into the html DOM. This is done recursively, so that when a model is binded to a DOM, the DOMs nested within that DOM that need to ko binded have been detacthed from that DOM, thus avoiding the problem of the same DOM being binded more than once, which is not allowed in knockout.js.  

If a model needs to have access to the DOM it is binded to, it should define a setElement() function. rbind() will call the setElement() and pass the DOM element as the parameter. For example if the 'ajaxForm' needs to know the DOM it is binded to, its code should be like:

```js
var AjaxForm = function(){
    ...
    this.setElement = function(ele) {
        this.form = ele;
    }
    ...
};

```

Side effects
============
Because the binded DOM elments are removed and inserted back into the html DOM, the page content might appear jumping when it is loaded. This is a common issue when using client side JS frameworks such as Angular JS.

One way to handle this is to hide the content of the page until the javascript is run. For example:

```html
<body>
	.....
	<div id="content" class="hidden">
            ....
	</div>
	<script>
		//assuming you are using jquery
		$(function(){
			$('#content').removeClass('hidden');
		});
	</script>
</body>

```



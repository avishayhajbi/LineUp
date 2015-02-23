/*******************************************************************
  							I18N
********************************************************************/


/**
 * @class
 * This class is responsible for localization of the HTML document.
 * I18N stands for internationalization - see <a href="http://en.wikipedia.org/wiki/Internationalization_and_localization">wikipedia</a> 
 * article for the name origin.
 * <br/>
 * The data used for localization is provided via the <code>languageDictionary</code> associative array. 
 * Each entry in this array is a unique identifier of the text template which is in turn the value of each array member. 
 * Localization of the current HTML document is initiated by calling the <code>processDocument()</code> method which finds localized HTML
 * elements matching to dictionary entries by ID and setting their innerHTML value to the given text. Each text template is a Unicode text 
 * which may have one or more variables inside. Variables are defined by using the 
 * percent (%) character as opening and closing tag. <br/><br/>
 * For example: <code>'This is template number %counter% for form %formName%'.</code>
 * <br/><br/>
 * In this case I18N processor will look for two variables 'counter' and 'formName'. Variables are provided in constructor via the 
 * <code>variables</code> argument. In case there is no variable defined with given name, localization algorithm will try to look 
 * for another template with ID equal to the variable name. This means that nested templates can be used. <br/>
 * Since version 4.0 of the SDK, I18N also supports Mustache Templates (using <code>processTemplate()</code>)
 *
 * 
 * @constructor
 * 
 * 
 * @param {String[]} languageDictionary The actual dictionary built as an associative 
 * 	array where the key is the id of the text and the value is the text.
 * @param {String[]} variables An associative array of the variables used in the dictionary. 
 * 	Variables can be referenced from any text using the '%' tags: 'This car is %color%.'
 * @param {Boolean} silentVarMismatch When set to false will show an alert if there is a variable mismatch.
 */

function I18N(languageDictionary, variables, silentVarMismatch) {
	this.languageDictionary = (!languageDictionary) ? null : languageDictionary;
	this.variables = (!variables) ? null : variables;
	// if 'silentVarMismatch' not defined set accordingly to host debug flag
	this.silentVarMismatch = silentVarMismatch;
};

/**
 * Introduce a variables array to the existing I18N object. This array will be used next time when generating text templates
 * @param {String[]} variables Associative array of variables 
 */
I18N.prototype.inroduceVariables = function(variables) {
	this.variables = variables;
};


/**
 * Processes the given text template by replacing variable references with their corresponding values. 
 * Since variables can be other templates, this method is recursive.
 * <br/>
 * If the <code>silentVarMismatch</code> property is set This method can throw an exception 
 * 
 * @private
 * @param {String} text Text template with embedded variables
 * @param {String[]} variables Associative array of variables 
 * @param {Integer} loopCounter Recursion counter used internally to prevent self including nested templates
 * @returns {String} The complete text with resolved variable references
 */
I18N.prototype.generateText = function(text, variables, loopCounter) {

	if (!variables) variables = this.variables;
	if (loopCounter == undefined) loopCounter = 0; // recursion counter
	
	var start = -1;
	var end = 0;
	
	while ((start = text.indexOf('%', end)) > -1 ) {
		end = text.indexOf('%', start + 2);
		// no closing tag - probably just part of the text
		if (end == -1) break;
		
		var variable = text.substring(start + 1, end);
		if (variable.length == 0)
			continue; // empty var - probably just part of a text
		
		// ---- get variable value
		// try retrieve the variable value from the variables list
		var varValue = (variables != null) ? variables[variable] : undefined;
		if (varValue == undefined) {// may be this is another text reference?
			varValue = this.languageDictionary[variable];
			if (typeof(varValue) == 'string') { // we have a text with such id - go for recursion
				// check for a case when one text contains another which contains it back (loop)
				if (loopCounter < 5) {
					varValue = this.generateText(varValue, variables, ++loopCounter);
				} 
				else {
					// we hit an endless loop - act according to user settings
					if (!this.silentVarMismatch) {
						alert('Recursive variable: ' + variable + '; text generation interrupted to prevent entering into dead lock');
						return;
					}
					else
						continue;
				}
			}	
		}
		
		// make sure the var value is valid	
		if ((varValue == undefined) || (typeof(varValue) == 'object')) {
			// bad variable - act according to user settings
			if (!this.silentVarMismatch) {
				alert('Invalid variable: ' + variable);
				return;
			}	
			else
				continue;
		}

		// plant the variable value inside the text
		var before = text.substring(0, start);		
		var after = text.substring(end + 1);
		text = before.concat(varValue).concat(after);
		// fix the 'end' index, after we changed the text
		end = end - 2/* % chars*/ - (variable.length-varValue.length);
	}
	return text;
};

/**
 * Retrieves a text from the dictionary with a corresponding key (array entry). 
 * This method can be used for manual localization of particular application parts, for example when displaying a message:<br/>
 * <code>application.showMessage(i18n.getValue('MSG_0'));</code>
 *  
 * @param {String} key Unique identifier of the text template
 * @param {String[]} variables Associative array of variables 
 * @returns {String} The complete text with resolved variable references
 */
I18N.prototype.getValue = function (key, variables) {
	var value = this.languageDictionary[key];
	if (typeof(value) != 'string') 
		return '';
	
	value = this.generateText(value, variables);
	return value;
};

/**
 * Processes the Mustache Templates. Every HTML element which ID matches to a key in the dictionary will have it text
 * replaced with the text from dictionary. Uses the {@Link replaceValues} method.
 * @params {String} template The template to process. 
 * @returns {String} The processed template.
 */
I18N.prototype.processTemplate = function (template) {
    // Replace any {[KEY]} static HTML values.
    return this.replaceValues(template);
}

/**
 * Processes the current HTML document for localization. Every HTML element which ID matches to a key in the dictionary will have it text 
 * replaced with the text from dictionary.
 */
I18N.prototype.processDocument = function () {
	// make sure we have a dictionary to work with

	if ((this.languageDictionary == undefined) || (this.languageDictionary == null))
		return;

	// go over each key in the dictionary, locate the matching HTML tag and insert a text from dictionary into it.
	for (var key in this.languageDictionary) {
		var element = document.getElementById(key);
		
		if (typeof(element) == 'undefined' || element == null) 
			continue;
			
		var value = this.languageDictionary[key];
		if (typeof(value) != 'string') 
			continue;
		
		value = this.generateText(value);
		
		try {	
			var tagname = element.tagName.toLowerCase();
			if (tagname == 'img')
				element.src = value;
			else if (tagname == 'input')
				element.value = value;
			else
				element.innerHTML = value;
		} catch (e) {			
			throw 'error for pair [' + key + ':' + value + '] ' + e.message + ' (' + e.number + ')';
			continue;			
		}
	}
};

/**
 * Loads dictionary from an INI-like formatted input. Templates in the input text are separated with platform 
 * specific <code>'EndOfLine'</code> symbols ('\n'). Each template is a pair of 'key' and 'value' separated by the 
 * <code>'equals'</code> symbol ('=') in the following manner:<br/><br/>
 * 
 * <code>
 * DIV_0=This is sample template number %counter%. <br/>
 * DIV_1=This is another sample template. <br/>
 * MSG_0=Localized message text! <br/>
 * ... <br/>
 * </code>
 * 
 * @param {String} rawText INI-like formatted input text 
 */
I18N.prototype.loadDictionary = function (rawText) {
	this.languageDictionary = new Array();
	var lines = rawText.split("\n");
	
	for (var i = 0; i < lines.length; i++) {
		var c = lines[i].indexOf('=');
		if (c == -1) continue;
		var key = lines[i].substring(0, c); 
		// remove leading or trailing non alphanumeric chars (and not '_', '-'), ';' at start applies for commenting.
		key = key.replace(/^[^-_a-zA-Z0-9;]+|[^-_a-zA-Z0-9]+$/g, '');
		var value = lines[i].substring(c+1);
		// convert all special chars (\n, \r, \t, \b) in text to the real values of these chars 
		value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\b/g, '\b');
		var reg = /^[\x00-\x20]+|[\x00-\x20]+$/;
		value = value.replace(reg, '');
		this.languageDictionary[key] = value;
	}
};

/**
 * Sets the language dictionary of current I18N object.
 * @param {String[]} languageDictionary Dictionary associative array.
 */
I18N.prototype.setDictionary = function (languageDictionary) {
	this.languageDictionary = languageDictionary;
};
/**
 * Replace any {[KEY]} static HTML values with the text from dictionary.
 * @params {String} html The html to process. 
 * @returns {String} The processed html.
 */
I18N.prototype.replaceValues = function(html) {
    var start;
    if((start = html.indexOf("{[")) !== -1)
    {
        var end = html.indexOf("]}");
        var param = html.substr(start+2, end-start-2);
        var value = this.getValue(param);
        // Recursive processing.
        html = html.substr(0, start) + value + this.replaceValues(html.substr(end+2))
    }

    return html;
}


	i18n = new I18N(null, false, false);
	var dict  = '[page1]\nLA_PAGE1HEADER=LineUp\n';
  
  	i18n.loadDictionary(dict);
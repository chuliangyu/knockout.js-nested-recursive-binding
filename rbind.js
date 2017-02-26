//allows recursive knockout bind
//models are independent even when one is nested inside another
var rbind = function (models, ele){
    "use strict";

    var ko = require('knockout'); //delete this if ko is a global variable
    var ele = ele || document.body;

    var insertMap = [];

    var bindChildren = function(ele) {
        var children = ele.children;
        if (children && children.length > 0) {
            for(var i = 0; i < children.length; i++) {
                if (applyBindings(children[i])){
                    i--;
                };
            }
        }
    };

    var reinstallNodes = function(){
        insertMap.forEach(function(m){
            if (m.nextSibling) {
                m.parent.insertBefore(m.ele, m.nextSibling);
            } else {
                m.parent.appendChild(m.ele);
            }
        });
    };

    var applyBindings = function(ele){
        if (ele.hasAttribute && ele.hasAttribute('data-model')){
            var attr = ele.getAttribute('data-model');
            //remove element from dom
            var parent = ele.parentNode;
            var nextSibling = ele.nextSibling; 
            
            insertMap.push({
                ele: ele,
                parent: parent,
                nextSibling: nextSibling
            });

            var attrModel = models[attr];

            if (!attrModel) {
                console.log('attrModel: ' + attr + ' not defined');
            }
            //if a view model need to accept the dome element, it should implement the setElement() method
            if (attrModel.setElement) { 
                attrModel.setElement(ele);
            }

            parent.removeChild(ele);
            bindChildren(ele);
            try {
                ko.applyBindings(attrModel, ele);
            } catch (e) {
                console.log('faild to bind', attr, attrModel, ele);
                throw e;
            }
            return true;
        } else {
            bindChildren(ele);
            return false;
        }
    };

    try {
        applyBindings(ele);
    } catch (e) {
        reinstallNodes();
        throw e;
    }

    reinstallNodes();
};

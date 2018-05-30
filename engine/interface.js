const Interface = (function() {
  let priv = new WeakMap();
  let _ = function(instance) {return priv.get(instance)};

  return class {
    constructor(name, methods=[], properties=[]) {
			let privOptions = {
				name: name,
				methods: [],
				properties: [],
			};
			priv.set(this, privOptions);

      for (let i=0; i < methods.length; i++) {
        if (typeof methods[i] !== 'string') {
          throw new Error('The constructor of the interface wait for method names as chain.')
        }
        _(this).methods.push(methods[i]);
      }

      for (let i=0; i < properties.length; i++) {
        if (typeof properties[i] !== 'string') {
        throw new Error('The constructor of the interface wait for property names as chain.')
        }
        _(this).properties.push(properties[i]);
      }
    }

    isIplementedBy(obj) {
      var methodsLen = _(this).methods.length;
      var propertiesLen = _(this).properties.length;
      var currentMember;

      if(obj) {
        //Methods checking
        for (let i=0; i < methodsLen; i++) {
          currentMember = _(this).methods[i];
          if(!obj[currentMember] || typeof obj[currentMember] !== 'function') {
            throw new Error('The object not implements interface ' + _(this).name + '. Cannot find required method ' + currentMember + '.');
          }
        }

        //Properties checking
        for (let i=0; i < propertiesLen; i++) {
          currentMember = _(this).properties[i]; 
          if((obj[currentMember] === undefined) || typeof obj[currentMember] === 'function') {
          throw new Error('The object not implements interface ' + _(this).name + '. Cannot find required property ' + currentMember + '.');
          }
        }
      }
      else throw new Error('Hasn`t any object to check!');
    }
  }
})();

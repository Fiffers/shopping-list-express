var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
    remove: function(id) {
    var items = this.items;
    function findItem(item) {
        if(item.id == id) {
            var index = items.indexOf(item);
            items.splice(index, 1);
            return this;
        };
    };
    var item = items.find(findItem);
    return item;
    },
    update:  function(updatedItem) {
    var items = this.items;
    function findItem(item) {
        if(item.id == updatedItem.id) {
            var index = items.indexOf(item);
            items[index].name = updatedItem.name;
            items[index].id = updatedItem.id;
            return this;
        };
    }
    var item = items.find(findItem);
    return item;
    }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(request, response) {
    var id = request.params.id;
    console.log("server-side id", id);
    if (!id) {
        return response.sendStatus(400);
    }
    var item = storage.remove(id);
    response.status(200).json(item);
});

app.put('/items/:id', jsonParser, function(request, response) {
    var updated = request.body;
    if (!request.body.name) {
        return response.sendStatus('You are doing it wrong', 400);
    }
    var updated = storage.update(updated);
    response.status(200).json(updated);
});

exports.app = app;
exports.storage = storage;

app.listen(process.env.PORT || 8080, process.env.IP);

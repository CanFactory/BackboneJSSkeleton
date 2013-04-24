// cw.models.entity.js
var CWEntity = Backbone.Model.extend({
    // I like to put something here, as it saves me writing a code comment...
    defaults: {
        "id":  null,
        "name": null,
        "animal": null
    }
});




// cw.collections.entities.js
var CWEntityCollection = Backbone.Collection.extend({
    model: CWEntity
});




// cw.views.entity.js
var CWEntityView = Backbone.View.extend({
    tagName: "div",
    className: "entity",
    
    events: {
        "click .show_favourite_animal": 'showAnimal',
        "click .delete": 'deleteEntity'
    },
    
    initialize: function() {
        this.define();
    },
    
    define: function() {
        this.$button = $('<input class="show_favourite_animal" type="button" data-entity-id="'+ this.model.get('id') +'" value="Show Favourite Animal" />');
        this.$delete = $('<a class="delete" href="#">[delete]</a>');
    },
    
    render: function() {
        this.$el.append( $("<span>"+ this.model.get('name') +"</span>") );
        this.$el.append(this.$button);
        this.$el.append(this.$delete);
        return this;
    },
    
    showAnimal: function(e) {
        e.preventDefault();
        // Lets go the long way around to learn new things about collections...
        // of course you could just get the animal here by calling `this.model.get('animal')`
        
        // Get the element from the event..
        $button = $(e.target);
        // Get the entity ID from the found element..
        entity_id = $button.data('entity-id');
        // Search through our collection for a model with that ID..
        entity = window.CW.Data.Entities.findWhere({id: entity_id});
        
        animal = entity.get('animal');
        message = animal + " is the favourite animal of " + this.model.get('name');
        
        alert(message);
    },
    
    deleteEntity: function(e) {
        e.preventDefault();
        this.remove();
    }
    
});




// cw.views.sidebar.js
var CWSidebarView = Backbone.View.extend({
    tagName: "div",
    id: "sidebar",
    
    events: {
        'click input[type="button"].add_employees': 'startButtonWasClicked'
    },
    
    initialize: function() {
        _.bindAll(this);
        this.define();
        this.hasStarted = false;
    },                            
    
    define: function(e) {
        this.$startButton = $("<input class='add_employees' type='button' value='Add Employees!' />");
    },
    
    render: function(e) {
        this.$el.append( this.$startButton );
    },
    
    startButtonWasClicked: function(e) {
        if (this.hasStarted) {
            console.log("Woah, running this more than once! Cool!");
        }
        
        window.CW.Data.Entities.each(function(entity_model) {
            entityView = new CWEntityView({
                model: entity_model
            });
            $entityView = entityView.render().$el;
            this.$el.append( $entityView );
        }, this);
        
        this.hasStarted = true;
    }
});




// cw.router.js
var CWRouter = Backbone.Router.extend({
    resetPage: function() {
        $('body').html('<div id="container" />');
    },
    
    
    routes: {
        "projects/:project_id/resources/:resource_id":    "home",
        "projects/:project_id/resources":                 "home",
        "projects/:project_id":                           "home",
        "projects":                                       "home",
        "*default":                                       "home"
        // '*' followed by any character will match anything..
        // https://github.com/documentcloud/backbone/issues/1464
    },
    
    initialize: function() {
        // Bootstrap stuff...
        window.CW={};
        window.CW.Data={};
        window.CW.Data.Entities = new CWEntityCollection();
        window.CW.Data.Entities.add( new CWEntity({
            'id': 1,
            'name': 'Gareth',
            'animal': 'Kangaroo'
        }) );
        
        window.CW.Data.Entities.add( new CWEntity({
            'id': 2,
            'name': 'Jim',
            'animal': 'Monkey'
        }) );
        
        window.CW.Data.Entities.add( new CWEntity({
            'id': 3,
            'name': 'Joe',
            'animal': 'Ostrich'
        }) );
        
        // Kick off router...
        Backbone.history.start();
        console.log('Router Loaded');
    },
    
    home: function() {
        console.log("Loading Home Page");
        this.resetPage();
        views = [];
        
        sidebar_view = new CWSidebarView({
            el: $('#container')
        });
        views.push(sidebar_view);
        
        _(views).invoke('render');
    },
    
    stub: function() {
        console.log("Stub page called...", arguments);
    }
    
});
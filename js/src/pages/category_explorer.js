var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery'),
    ReactRouter = require('react-router'),
    Navigation = require('react-router').Navigation;

var Session = require('../util/session.js'),
    Api = require('../util/api.js');

var CategoryExplorerClass = React.createClass({
    mixins: [React.addons.LinkedStateMixin, Navigation],

    getInitialState: function(){
        return {
            course: this.props.course,
        };
    },

    handleClick: function(event){
        console.log(this);
        this.transitionTo('/class/' + this.state.course.Id);
    },

    onMouseEnter: function(event){

    },

    onMouseLeave: function(event){

    },

    render: function(){
        return (
            <mui.Paper className='category-explorer-class' onClick={this.handleClick}>
                <div>{this.props.course.Name}</div>
            </mui.Paper>
        );
    }
});


var CategoryExplorer = React.createClass({
    mixins: [React.addons.LinkedStateMixin, Navigation, ReactRouter.State],
    sheetApi: "/api/degreesheet",
    classApi: "/api/class",

    getClassesForCategory: function(cat_id){
        console.log("Category ID: " + cat_id);
        resp = Api.call(this.classApi, {
            session: Session.get_session().session,
            method: "get_classes_for_category",
            category_id: cat_id,
        });
        return resp;
    },

    getInitialState: function() {
        return {
            uri_params: this.getParams(),
            session: Session.get_session(),
            category: this.getClassesForCategory(this.getParams().categoryId),
        };
    },

    render: function() {
        if (!Session.is_logged_in()) {
            this.transitionTo('Login');
            return (<div></div>);
        } else if (this.state.category) {
            console.log(this.state.category);
          return (
            <div>
              <h1>Classes for {this.state.category.Name}</h1>
                {this.state.category.Classes.map(function(course, i) {
                        return(<CategoryExplorerClass course={course} />);
                    })
                }
            </div>
          );
        } else {
            return (<div>Failed to load classes</div>);
        }
    }
});

module.exports = CategoryExplorer;

var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery');
    Navigation = require('react-router').Navigation;

var Session = require('../util/session.js'),
    Api = require('../util/api.js');

var SheetManagerSheet = React.createClass({
    mixins: [React.addons.LinkedStateMixin, Navigation],

    getInitialState: function(){
        return {
            sheet: this.props.sheet,
        };
    },

    handleClick: function(event){
        console.log(this);
        this.transitionTo('/sheet/' + this.state.sheet.Id);
    },

    onMouseEnter: function(event){

    },

    onMouseLeave: function(event){

    },

    render: function(){
        return (
            <mui.Paper onClick={this.handleClick}>
                <div>{this.props.sheet.Name}</div>
                <div>{this.props.sheet.Template_Name}</div>
                <div>{this.props.sheet.Created}</div>
            </mui.Paper>
        );
    }
});


var SheetManager = React.createClass({
    mixins: [React.addons.LinkedStateMixin, Navigation],
    sheetApi: "/api/degreesheet",

    getInitialState: function() {
        return {
            session: Session.get_session(),
            sheets: this.getSheets(),
        };
    },

    getSheets: function() {
        resp = Api.call(this.sheetApi, {
            method: 'list_sheets',
            session: Session.get_session().session,
        });
        return resp;
    },

    render: function() {
        if (!Session.is_logged_in()) {
            this.transitionTo('Login');
            return (<div></div>);
        } else if (this.state.sheets) {
          return (
            <div>
              <h1>My Sheets</h1>
                {this.state.sheets.map(function(sheet, i) {
                        return(<SheetManagerSheet sheet={sheet} />);
                    })
                }
            </div>
          );
        } else {
            return (<div>Failed to load sheets</div>);
        }
    }
});

module.exports = SheetManager;

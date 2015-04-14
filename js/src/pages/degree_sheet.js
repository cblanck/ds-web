var React = require('react'),
    mui   = require('material-ui'),
    dnd   = require('react-dnd'),
    ReactRouter = require('react-router'),
    Navigation = ReactRouter.Navigation;

var Session = require('../util/session.js'),
    Api = require('../util/api.js');

var dsheet_api = '/api/degreesheet';

var dropTarget = {
  acceptDrop: function(component, course) {
    component.removeCourse();
    component.setState({
      droppedCourse: course
    });
  }
};

function makeCategoryBin(category) {
  var CategoryBin = React.createClass({
    mixins: [dnd.DragDropMixin],
    getInitialState: function() {
      return {
        droppedCourse: null,
        singleton: category.Classes ? false : true,
        classes: category.Classes ? category.Classes : [category],
      };
    },
    statics: {
      configureDragDrop: function(register) {
        if (category.Classes) {
          category.Classes.forEach(
            function(e,i,a) {
              register(e.Id.toString(), {dropTarget: dropTarget});
            }
          );
        } else {
          register(category.Id.toString(), {dropTarget: dropTarget});
        }
      }
    },
    removeCourse: function(){
      if(!this.state.droppedCourse){
        return;
      }
      this.state.droppedCourse.setState({hasDropped: false});
      this.setState({droppedCourse: null});
    },
    handleClick: function() {
      if (this.state.droppedCourse) {
        this.removeCourse()
      } else {
        this.refs.dialogWindow.show();
      }
    },
    _onDialogSubmit: function() {
      this.setState({
        droppedCourse: this.refs.classRadio.getSelectedValue(),
      });
      this.refs.dialogWindow.dismiss();
    },
    render: function() {
      if (!this.state.singleton) {
        var courses = category.Classes.map(
          function(e) {
            return e.Id.toString();
          }
        );
      } else {
        courses = [category.Id.toString()];
      }
      var backgroundColor = '#FFF59D';
      var dropStates = courses.map(this.getDropState);
      var filled = this.state.droppedCourse;
      var slotInfo = category.Name;
      var callsign = "";
      if (this.state.singleton) {
        callsign = (' ('+category.Subject_callsign + " " +
                     category.Course_number+')');
      }
      if (filled){
        slotInfo += " fulfilled";
        backgroundColor = '#A5D6A7';
        if (!this.state.singleton) {
           slotInfo += " by " + filled.props.name;
        }
        slotInfo += " (remove)";
      }

      if (dropStates.some(function(e,i,a){ return e.isHovering; })) {
        backgroundColor = 'darkgreen';
      } else if (dropStates.some(function(e,i,a){ return e.isDragging; })) {
        backgroundColor = 'darkkhaki';
      }
      var standardActions = [
        { text: 'Cancel' },
        { text: 'Submit', onClick: this._onDialogSubmit }
      ];
      return (
        <div className="category-div" {...this.dropTargetFor.apply(this, courses)} onClick={this.handleClick}
          style={{backgroundColor: backgroundColor}}>
          {dropStates.some(function(e,i,a){ return e.isHovering; }) ?
            'Release to drop' :
            slotInfo
          }
          <div className='dsheet-callsign'>{callsign}</div>
          <mui.Dialog ref="dialogWindow" actions={standardActions}>
            <mui.RadioButtonGroup name="classes" ref="classRadio">
              {this.state.classes.map(
                function(course) {
                  return <mui.RadioButton
                            value={course.Id.toString()}
                            label={course.Name}/>
                }
              )}
            </mui.RadioButtonGroup>
          </mui.Dialog>
        </div>
      );
    }
  });
  return CategoryBin;
}

var dragSource = {
  beginDrag: function(component) {
    return {
      item: component
    };
  },

  endDrag: function(component, effect) {
    if (effect) {
      component.setState({
        hasDropped: true
      });
    }
  }
};

function makeCourse(entry) {
  var Course = React.createClass({
    mixins: [dnd.DragDropMixin],

    propTypes: {
      name: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
      return {
        hasDropped: false
      };
    },

    statics: {
      configureDragDrop: function(register) {
        register(entry.Class.Id.toString(), { dragSource: dragSource });
      }
    },

    render: function() {
      var name = this.props.name;
      var hasDropped = this.state.hasDropped;
      var isDragging = this.getDragState(entry.Class.Id.toString());
      var opacity = isDragging ? 0.4 : 1;

      if (hasDropped) {
        return <div className="dropped-class"></div>
      } else {
        return (
          <div {...this.dragSourceFor(entry.Class.Id.toString())}
               style={{opacity: opacity}}>
            {name}
          </div>
        );
      }
    }
  });
  return Course;
}

var ClassGroup = React.createClass({
  render: function() {
    return (
      <div className={this.props.className ? this.props.className : 'classgroup-div'}>
        <div>
          {this.props.template.Inherits.map(
            function(c, i){
              return <ClassGroup template={c} />;
            }
          )}
        </div>
        <div>
          {this.props.template.Classes.map(
            function(c, i) {
              var CategoryBin = makeCategoryBin(c);
              return <CategoryBin />;
            }
          )}
        </div>
        <div>
          {this.props.template.Categories.map(
            function(c, i){
              var CategoryBin = makeCategoryBin(c);
              return <CategoryBin />
            }
          )}
        </div>
      </div>
    )
  }
});

var Sheets = React.createClass({
  mixins: [React.addons.LinkedStateMixin, Navigation, ReactRouter.State],

  getInitialState: function() {
    if (!Session.is_logged_in()){
      this.transitionTo('Login');
    }
    var p = this.getParams();
    var sheet = Api.call(
      dsheet_api,
      {
        method: 'get_sheet',
        session: Session.get_session().session,
        sheet_id: p.sheet_id,
      }
    );
    if (!sheet) {
      this.transitionTo("404");
    }
    var template = Api.call(
      dsheet_api,
      {
        method: 'get_requirements_for_template',
        template_id: sheet.Template_id,
      }
    );
    if (!template) {
      this.transitionTo("404");
    }
    return {
      sheet: sheet,
      template: template,
      entries: sheet.Entries,
    };
  },

  render: function() {
    return (
      <div>
        <ClassGroup className="outer-classgroup" template={this.state.template}/>
        <div className="course-div">
          {this.state.entries.map(
            function(entry) {
              var Course = makeCourse(entry);
              return <Course className="sheet-course" name={entry.Class.Name}/>;
            }
          )}
        </div>
      </div>
    );
  }

});

module.exports = Sheets;

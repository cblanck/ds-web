var React = require('react'),
    mui   = require('material-ui'),
    dnd   = require('react-dnd'),
    ReactRouter = require('react-router'),
    Navigation = ReactRouter.Navigation,
    Promise = require('promise'),
    Combobox = require('react-pick').Combobox;

var Session = require('../util/session.js'),
    Api = require('../util/api.js');

var dsheet_api = '/api/degreesheet';

var dropTarget = {
  acceptDrop: function(component, course) {
    component.removeCourse();
    component.addCourse(course);
  }
};

function makeCategoryBin(category, predropped, master_template) {
  var CategoryBin = React.createClass({
    mixins: [dnd.DragDropMixin],
    getInitialState: function() {
      var dropped = null;
      if (predropped[category.Id.toString()]) {
        dropped = predropped[category.Id.toString()];
      }
      return {
        predropped: dropped,
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
    componentDidMount: function() {
      if(this.isMounted() && this.state.predropped){
        this.props.preDrop(this, this.state.predropped.toString());
      }
    },
    addCourse: function(course){
        this.setState({droppedCourse: course});
        master_template.drops[category.Id] = course.props.class_id;
    },
    removeCourse: function(){
      if(!this.state.droppedCourse){
        return;
      }
      this.state.droppedCourse.setState({hasDropped: false});
      this.setState({droppedCourse: null});
      master_template.drops[category.Id] = undefined;
    },
    handleClick: function() {
      if (this.state.droppedCourse) {
        this.removeCourse();
      }
    },
    handleCsClick: function() {
      if (!this.state.singleton) {
        var win = window.open('/#/category/'+category.Id, '_blank');
        win.focus();
      } else {
        var win = window.open('/#/class/'+category.Id, '_blank');
        win.focus();
      }
    },
    render: function() {
      var courses;
      if (!this.state.singleton) {
        courses = category.Classes.map(
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
      } else {
        callsign = '(Explore category)';
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
      return (
        <div className="category-div" {...this.dropTargetFor.apply(this, courses)} onClick={this.handleClick}
          style={{backgroundColor: backgroundColor}}>
          {dropStates.some(function(e,i,a){ return e.isHovering; }) ?
            'Release to drop' :
            slotInfo
          }
          <div onClick={this.handleCsClick} className='dsheet-callsign'>{callsign}</div>
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
        return <div className="dropped-class"></div>;
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
        <h5 className="classgroup-title">{this.props.template.Name}</h5>
        <div>
          {this.props.template.Inherits.map(
            function(c, i){
              return <ClassGroup template={c}
                                 predropped={this.props.predropped}
                                 preDrop={this.props.preDrop}
                                 master={this.props.master} />;
            }.bind(this)
          )}
        </div>
        {this.props.template.Classes.map(
          function(c, i) {
            var CategoryBin = makeCategoryBin(c,
                                              this.props.predropped,
                                              this.props.master);
            return <CategoryBin preDrop={this.props.preDrop}/>;
          }.bind(this)
        )}
        {this.props.template.Categories.map(
          function(c, i){
            var CategoryBin = makeCategoryBin(c,
                                              this.props.predropped,
                                              this.props.master);
            return <CategoryBin preDrop={this.props.preDrop}/>;
          }.bind(this)
        )}
      </div>
    );
  }
});

var all_classes = Api.call(
  '/api/class',
  {
    method: 'list',
    session: Session.get_session().session,
  }
);

var mapping = {};
var loaded = false;

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
    template.drops = {};
    return {
      sheet: sheet,
      template: template,
      entries: sheet.Taken_courses,
      planned: sheet.Planned_courses,
      predropped: sheet.Dropped_courses,
    };
  },
  saveSheetState: function(){
    // Collate the requirement_id:course_id mappings
    // Post it to the backend
    result = Api.call(
      '/api/degreesheet',
      {
        method: 'set_satisfaction_mapping',
        session: Session.get_session().session,
        sheet_id: this.state.sheet.Id,
        satisfaction_map : JSON.stringify(this.state.template.drops),
      }
    );
  },
  componentDidMount: function(){
    if (loaded) {
      return;
    }
    for (course_id in mapping) {
      mapping[course_id].addCourse(this.refs[course_id]);
      this.refs[course_id].setState({hasDropped: true});
    }
    loaded = true;
  },
  preDrop: function(component, course_id) {
    if (loaded) {
      return;
    }
    mapping[course_id] = component;
  },
  render: function() {
    return (
      <div>
        <ClassGroup className="outer-classgroup"
                    predropped={this.state.predropped}
                    preDrop={this.preDrop}
                    template={this.state.template}
                    master={this.state.template}/>
        <div className="course-div">
          <div className="taken-courses-div">
            Taken Courses
            {this.state.entries.map(
              function(entry) {
                var Course = makeCourse(entry);
                return (
                  <Course className="sheet-course"
                          class_id={entry.Class.Id}
                          key={entry.Class.Id}
                          ref={entry.Class.Id}
                          name={entry.Class.Name}/>
                );
              },
              this
            )}
          </div>
          <div className="planned-courses-div">
            Planned Courses
            {this.state.planned.map(
              function(entry) {
                var Course = makeCourse(entry);
                return (
                  <Course className="sheet-course"
                          class_id={entry.Class.Id}
                          key={entry.Class.Id}
                          ref={entry.Class.Id}
                          name={entry.Class.Name}/>
                );
              },
              this
            )}
          </div>
          <mui.RaisedButton primary={true} onClick={this.saveSheetState} label="Save Sheet" />
        </div>
      </div>
    );
  }

});

module.exports = Sheets;

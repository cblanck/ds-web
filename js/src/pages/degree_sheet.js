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
        this.removeCourse();
      }
    },
    handleCsClick: function() {
      if (!this.state.singleton) {
        var win = window.open('/#/category/'+category.Id, '_blank');
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
            <span onClick={this.props.removeClick}>  <strong>x</strong></span>
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
              return <ClassGroup template={c} />;
            }
          )}
        </div>
        {this.props.template.Classes.map(
          function(c, i) {
            var CategoryBin = makeCategoryBin(c);
            return <CategoryBin />;
          }
        )}
        {this.props.template.Categories.map(
          function(c, i){
            var CategoryBin = makeCategoryBin(c);
            return <CategoryBin />;
          }
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


var ClassInput = React.createClass({
  getOptionsForInputValue: function(inputValue) {
    return new Promise(function(resolve, reject) {
      inputValue = inputValue.toLowerCase();
      if (inputValue.length < 3) {
        resolve([]);
        return;
      }
      resolve(
        all_classes.filter(
          function(c) {
            var callsigned = c.Subject_callsign+" "+c.Course_number;
            return c.Name.toLowerCase().indexOf(inputValue) === 0 ||
                   callsigned.toLowerCase().indexOf(inputValue) === 0;
          }
        )
      );
    });
  },

  getLabelForOption: function(value) {
    if (!value.Name){
      return  "";
    }
    return value.Name + " ("+value.Subject_callsign+" "+value.Course_number+")";
  },

  render: function() {
    return (
      <Combobox
        {...this.props}
        getOptionsForInputValue={this.getOptionsForInputValue}
        getLabelForOption={this.getLabelForOption}
      />
    );
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
    var planned = Api.call(
      dsheet_api,
      {
        method: 'get_planned_courses',
        session: Session.get_session().session,
      }
    );
    if (!planned) {
      this.transitionTo("404");
    }
    return {
      sheet: sheet,
      template: template,
      entries: sheet.Entries,
      planned: planned,
      classToPlan: '',
      classToTake: '',
    };
  },
  handlePlannedChange: function(value) {
    this.setState({classToPlan: value});
  },
  handleTakenChange: function(value) {
    this.setState({classToTake: value});
  },
  handlePlanClick: function() {
    if (!this.state.classToPlan){
      return;
    }
    current_plan = this.state.planned;
    current_plan.push({Class: this.state.classToPlan});
    this.setState({
      planned: current_plan,
      classToPlan: '',
    });
  },
  handleTakeClick: function() {
    if (!this.state.classToTake){
      return;
    }
    current_entries = this.state.entries;
    current_entries.push({Class: this.state.classToTake});
    this.setState({
      entries: current_entries,
      classToTake: '',
    });
  },
  handleRemoveClass: function(entry, planned) {
    var l;
    if (planned) {
      l = this.state.planned;
    } else {
      l = this.state.entries;
    }
    var index = l.indexOf(entry);
    l.splice(index, 1);
    if (planned) {
      this.setState({planned: l});
    } else {
      this.setState({entries: l});
    }
  },
  render: function() {
    return (
      <div>
        <ClassGroup className="outer-classgroup" template={this.state.template}/>
        <div className="course-div">
          <div className="taken-courses-div">
            Taken Courses
            {this.state.entries.map(
              function(entry) {
                var Course = makeCourse(entry);
                return (
                  <Course className="sheet-course"
                          removeClick={this.handleRemoveClass.bind(this, entry, false)}
                          name={entry.Class.Name}/>
                );
              },
              this
            )}
          </div>
          <ClassInput
            value={this.state.classToTake}
            onChange={this.handleTakenChange}
          />
          <button onClick={this.handleTakeClick}>Add Class</button>
          <div className="planned-courses-div">
            Planned Courses
            {this.state.planned.map(
              function(entry) {
                var Course = makeCourse(entry);
                return (
                  <Course className="sheet-course"
                          removeClick={this.handleRemoveClass.bind(this, entry, true)}
                          name={entry.Class.Name}/>
                );
              },
              this
            )}
          </div>
          <ClassInput
            value={this.state.classToPlan}
            onChange={this.handlePlannedChange}
          />
          <button onClick={this.handlePlanClick}>Plan Class</button>
        </div>
      </div>
    );
  }

});

module.exports = Sheets;

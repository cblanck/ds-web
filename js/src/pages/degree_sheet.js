var React = require('react'),
    mui   = require('material-ui'),
    dnd   = require('react-dnd'),
    Navigation = require('react-router').Navigation;

var Session = require('../util/session.js'),
    Sheet = require('../util/sheet.js');
var dropTarget = {
  acceptDrop: function(component, course) {
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
    handleClick: function() {
      if (this.state.droppedCourse) {
        this.state.droppedCourse.setState({hasDropped: false});
        this.setState({droppedCourse: null});
      }
    },
    render: function() {
      if (category.Classes) {
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
      if (!category.Classes) {
        callsign = (' ('+category.Subject_callsign + " " +
                     category.Course_number+')');
      }
      if (filled){
        slotInfo += (" fulfilled by " + filled.props.name + " (remove)");
        backgroundColor = '#A5D6A7';
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
          <div className='dsheet-callsign'>{callsign}</div>
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

function makeCourse(dropType) {
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
        register(dropType, { dragSource: dragSource });
      }
    },

    render: function() {
      var name = this.props.name;
      var hasDropped = this.state.hasDropped;
      var isDragging = this.getDragState(dropType);
      var opacity = isDragging ? 0.4 : 1;

      if (hasDropped) {
        return <div className="dropped-class"></div>
      } else {
        return (
          <div {...this.dragSourceFor(dropType)}
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
      <div className='classgroup-div'>
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
  mixins: [React.addons.LinkedStateMixin, Navigation],

  getInitialState: function() {
    return {
      template: template = Sheet.get_template(30),
    };
  },

  render: function() {
    var Course = makeCourse('20');
    return (
      <div>
        <ClassGroup className="outer-classgroup" template={this.state.template}/>
        <Course name='a course i guess OKAY'/>
      </div>
    );
  }

});

module.exports = Sheets;

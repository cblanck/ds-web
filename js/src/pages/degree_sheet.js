var React = require('react'),
    mui   = require('material-ui'),
    dnd   = require('react-dnd'),
    Navigation = require('react-router').Navigation;

var Session = require('../util/session.js');
var dropTarget = {
  acceptDrop: function(component, course) {
    component.setState({
      droppedCourse: course
    });
  }
};

function makeReqBin(accepts) {
  var RequirementBin = React.createClass({
    mixins: [dnd.DragDropMixin],
    getInitialState: function() {
      return {
        droppedCourse: null,
      };
    },
    statics: {
      configureDragDrop: function(register) {
        accepts.forEach(function(itemType) {
          return register(itemType, { dropTarget: dropTarget });
        });
      }
    },
    render: function() {
      var item = this.state.course;
      var backgroundColor = '#222';
      var dropStates = accepts.map(this.getDropState);

      if (dropStates.some(function(e,i,a){return e.isHovering;})) {
        backgroundColor = 'darkgreen';
      } else if (dropStates.some(function(e,i,a){return e.isDragging})) {
        backgroundColor = 'darkkhaki';
      }
      return (
        <div {...this.dropTargetFor.apply(this, accepts)}
          style={{backgroundColor: backgroundColor}}>
          {dropStates.some(function(e,i,a) {return e.isHovering}) ?
            'Release to drop' :
            'This dustbin accepts: ' + accepts.join(', ')
          }
        </div>
      );
    }
  });
  return RequirementBin;
}

var ItemTypes = {
  CAT: 'cat'
};

var dragSource = {
  beginDrag: function(component) {
    return {
      item: {
        name: component.props.name
      }
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
      var name = this.props;
      var hasDropped = this.state;
      var isDragging = this.getDragState(dropType);
      var opacity = isDragging ? 0.4 : 1;

      return (
        <div {...this.dragSourceFor(dropType)}
             style={{opacity: opacity}}>
          {hasDropped ?
            <s>{name}</s> :
            name
          }
        </div>
      );
    }
  });

  return Course;
}

var Sheets = React.createClass({
  mixins: [React.addons.LinkedStateMixin, Navigation],
  renderReqBin: function(accepts) {
    var ReqBin = makeReqBin(accepts);
    return <ReqBin />;
  },

  renderCourse: function(name, dropType) {
    var Course = makeCourse(dropType);
    return <Course name={name} />;
  },

  render: function() {
    return (
      <div>
        <div>
          {this.renderReqBin([ItemTypes.CAT])}
          loloololol
        </div>
        <div>
          {this.renderCourse('cat', ItemTypes.CAT)}
        </div>
      </div>
    );
  }

});

module.exports = Sheets;

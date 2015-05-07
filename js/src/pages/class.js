/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router'),
    mui   = require('material-ui'),
    ClassAPI = require('../util/class.js'),
    ReviewForm = require('../components/review_form.js'),
    ReviewList = require('../components/review_list.js'),
    $     = require('jquery');

var Session = require('../util/session.js'),
    Api = require('../util/api.js');


var AddToPlannedClassesButton = React.createClass({
    getInitialState: function(){
        var planned_classes = Api.call(
                '/api/degreesheet',
                {
                    method: 'get_planned_courses',
                    session: Session.get_session().session,
                }
            );
        console.log(planned_classes);
        var course_already_added = false;
        planned_classes.map(function(c){
            console.log(c);
            if (c.Class_id == this.props.course_id){
                course_already_added = true;
            }
        }.bind(this));
        return {
            course_is_planned: course_already_added,
        };
    },
    unPlan: function(){
        console.log("UnPlanning course" + this.props.course_id);
        var resp = Api.call(
                '/api/degreesheet',
                {
                    method: 'delete_planned_course',
                    session: Session.get_session().session,
                    course_id: this.props.course_id,
                }
            );
        if (resp){
            this.setState({course_is_planned: false});
        } else {
            console.log(resp);
        }
    },
    Plan: function(){
        console.log("Planning course" + this.props.course_id);
        var resp = Api.call(
                '/api/degreesheet',
                {
                    method: 'add_planned_course',
                    session: Session.get_session().session,
                    course_id: this.props.course_id,
                }
            );
        if (resp){
            this.setState({course_is_planned: true});
        } else {
            console.log(resp);
        }
    },
    render: function(){
        if (this.state.course_is_planned){
            return (
                <mui.RaisedButton className="plan-course-button" onClick={this.unPlan}
                    label="Remove from Planner"
                />);
        } else {
            return (
                <mui.RaisedButton className="plan-course-button" primary={true} onClick={this.Plan}
                    label="Add to Planner"
                />);
        }
    }

});

module.exports = React.createClass({
    mixins: [ReactRouter.State],
    render: function() {
        var uri_params = this.getParams();
        var class_data = ClassAPI.getById(uri_params.classId);
        var classInfoItems = [
            { text: 'Name', data: class_data.Name },
            { text: 'Subject', data: class_data.Subject_description },
            { text: 'Callsign', data: class_data.Subject_callsign + "-" + class_data.Course_number },
            { text: 'Instructors', data: (<ul>{class_data.Instructors.map(function(instructor, i){
                return (<li><a href="mailto:{instructor.Email}">{instructor.Name}</a></li>);
                })}</ul>), },
        ];
        return (
                <div className='class_continer'>
                    <div className='class_info'>
                        <mui.Menu className='class_quickref' menuItems={classInfoItems} />
                        <mui.Paper className='class_detail'>
                           <div className='class_detail_inner'>
                               <strong>{class_data.Name}</strong><br/>
                               {class_data.Description}<br/>
                                <br />
                                <AddToPlannedClassesButton course_id={uri_params.classId}/>
                                <br/><br/><br/>
                                <ReviewForm
                                  classId={uri_params.classId}
                                  instructors={class_data.Instructors} />
                                <ReviewList
                                  classId={uri_params.classId} />
                           </div>
                        </mui.Paper>
                    </div>
                </div>
               );
    }
});

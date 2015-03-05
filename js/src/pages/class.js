/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router'),
    mui   = require('material-ui'),
    ClassAPI = require('../util/class.js'),
    $     = require('jquery');


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
                           <strong>{class_data.Name}</strong><br/>
                           {class_data.Description}<br/>
                            List of sections?
                        </mui.Paper>
                    </div>
                </div>
               );
    }
});
